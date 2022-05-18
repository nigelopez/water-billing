const { db } = require('../init');
const moment = require('moment');
const getPreviousReadings = require('./getPreviousReadings');
const generateChargesComputation = require('./generateChargesComputation');
const getConsumptionRates = require('./getConsumptionRates');
const generateConsumptionComputation = require('./generateConsumptionComputation.js');
const getConsumerLatestNumbers = require('./getConsumerLatestNumbers');
const forEach = require('async-foreach').forEach;
const string = require('../string');

module.exports = async (date = moment(), generated_by = 0, options = { ignore_bills: false, reading_from: null }) => {
    // const to = date.format('YYYY-MM-DD HH:mm:ss');
    const to = date.format('YYYY-MM-DD 23:59:59');
    let previous = (await db.raw(`
        SELECT consumer_id, unit_code, period_to as last_reading_date, current_reading as last_reading
        FROM water_statements t1
        WHERE t1.voided_on is NULL AND t1.period_to = (
                SELECT MAX(t2.period_to)
                     FROM water_statements t2
                     WHERE t2.consumer_id = t1.consumer_id AND t2.voided_on is null
        ) ORDER BY last_reading_date`))[0];

    let previous_readings = {};
    
    previous.map(p=>{
        previous_readings[p.consumer_id] = p;
    });
    const rates = await getConsumptionRates();
    let total_inserts = 0;
    await db.transaction(async trx=>{
        let required = (await trx("water_settings").where("name","required_additional_charges").first())?.value;
        let bill_zero_consumptions = await trx("water_settings").where("name","bill_zero_consumptions").first();
        let minimum_consumption = Number((await trx("water_settings").where("name","minimum_consumption").first())?.value) || 0
        let consumption_before_applying_minimum = Number((await trx("water_settings").where("name","consumption_before_applying_minimum").first())?.value) || 0
        bill_zero_consumptions = bill_zero_consumptions?.value == "yes" ? true:false;

        // if(bill_zero_consumptions && minimum_consumption < 1)
        //     throw new Error("Billing of zero consumption is enabled but minimum consumption value is less than 1 cubic meter. Please check 'Minimum Consumption' Settings");
        const charges = {};
        let requiredCharges;
        let chargesLabels = {};
        if(required){
        // if(!required)
            // required = "";
            // throw new Error("Water settings 'required_additional_charges' not found");

            requiredCharges = required.split(" ").join("").split(",");
            await new Promise((resolve,reject)=>{
                forEach(requiredCharges, async function(r){
                    const done = this.async();
                    const label = (await trx("water_settings").where("name",`charge_label[${r}]`).first())?.value;
                    if(!label)
                        return reject(new Error(`"charge_label[${r}]" was not found in water settings`));
                    chargesLabels[r] = label;
                    done();
                },resolve);
            });
            let chargesQuery = await trx("water_utility_bills").whereNull("voided_on").select("id","type","charge_per_cbm","year","month");
            chargesQuery.map(c=>{
                if(!charges[`${c.year}-${c.month}`])
                    charges[`${c.year}-${c.month}`] = {};
                c.label = chargesLabels[c.type];
                charges[`${c.year}-${c.month}`][c.type] = c;
            });
        }


        const percentage_charges = await trx("water_settings").where("name","like","percentage_charges%").orderBy("description");
        const fixed_charges = await trx("water_settings").where("name","like","fixed_charges%").orderBy("description");
        const interest = Number((await trx("water_settings").where("name","interest").first())?.value || 0) / 100;
        const additional_days = Number((await trx("water_settings").where("name","additional_days_for_due_date").first())?.value || 15);
        let bill_number = Number(((await trx("water_statements").orderBy('bill_number','desc').select('bill_number').first())?.bill_number || `WB-300000000`).split("-")[1]);
        const consumers = await trx("water_consumers").where("suspended",0).select('id','unit_code','name').where("allow_billing",true);
        
        let rejected = false;
        await new Promise((resolve, reject) =>{
            try{
                forEach(consumers, async function(consumer){
                    const done = this.async();
                    if(rejected)
                        return false;
                    try{
                        let all = await getConsumerLatestNumbers(consumer.id,trx);
                        all.total_payment_received = -Math.abs(all.total_payment_received);
                        let overdue_balance = Number((all.overall_due + all.total_payment_received).toFixed(2));
                        let readings = trx("water_readings").orderBy('date').where('consumer_id',consumer.id).where("date","<=",to);
                        let period_from;
                        let previous_reading = 0;
                        if(options?.reading_from){
                            period_from = options.reading_from.format('YYYY-MM-DD');
                            readings.whereBetween("date",[period_from,to]);
                            previous_reading = (await trx("water_readings").orderBy('date').where('consumer_id',consumer.id).where(z=>{
                                z.where("date",">=",period_from);
                                z.where("date","<",to);
                            }).select("value").first())?.value || 0;
                        }else if(previous_readings[consumer.id]){ 
                            period_from = moment(previous_readings[consumer.id].last_reading_date).add(1,'day').format('YYYY-MM-DD');
                            readings.whereBetween("date",[period_from,to]);
                            previous_reading = previous_readings[consumer.id].last_reading;
                        }
                        readings = await readings;
                        let new_overall_receivables = all.overall_due;
                        let inserted = 0;
                        await new Promise((resolve,reject) => {
                            forEach(readings, async function(r){
                                const done = this.async();
                                if(rejected)
                                    return false;
                                try{
                                    const period_to = moment(r.date);
                                    if(!period_from){
                                        // these lines must be the same below before calling done()
                                        previous_reading = r.value;
                                        period_from = period_to.format("YYYY-MM-DD");
                                        return done();
                                    }
                                    let current_amount_due = 0;
                                    const total_cbm = Number(r.value - previous_reading);
                                    // console.log({
                                    //     total_cbm,
                                    //     value: r.value,
                                    //     previous_reading
                                    // })
                                    // throw new Error("Here");
                                    // if(total_cbm > 0 || (total_cbm == 0 && bill_zero_consumptions)){
                                        // const billed_cbm = total_cbm < minimum_consumption ? minimum_consumption:total_cbm;
                                        // if(total_cbm == 0){
                                            let billed_cbm = 0;
                                            if(consumption_before_applying_minimum > 0){
                                                console.log(total_cbm,'>=',consumption_before_applying_minimum,"....",total_cbm,'<',minimum_consumption);
                                                if(total_cbm >= consumption_before_applying_minimum && total_cbm < minimum_consumption)
                                                    billed_cbm = minimum_consumption;
                                                else if(total_cbm >= minimum_consumption)
                                                    billed_cbm = total_cbm;
                                                else
                                                    return done();
                                            }else if(consumption_before_applying_minimum <= 0 && total_cbm < minimum_consumption){
                                                billed_cbm = minimum_consumption;
                                            }else{
                                                billed_cbm = total_cbm;
                                            }
                                            if(billed_cbm <= 0 )
                                                return done();
                                            // console.log({
                                            //     billed_cbm, total_cbm, consumption_before_applying_minimum
                                            // })
                                        // }
                                        const year_month = `${period_to.year()}-${period_to.month() + 1}`;
                                        let additional_charges = 0;
                                        if(required && !charges[year_month] && !options?.ignore_bills)
                                            throw new Error(`${r.unit_code} - No utility bills found for ${period_to.format("MMMM YYYY")}`)
                                        if(!options?.ignore_bills){
                                            requiredCharges?.map(c=>{
                                                if(!charges[year_month][c])
                                                    throw new Error(`${r.unit_code} - No ${c} utility bill for ${period_to.format("MMMM YYYY")}`);
                                            });
                                        }else{
                                            requiredCharges?.map(c=>{
                                                if(!charges[year_month])
                                                    charges[year_month] = {};
                                                charges[year_month][c] = {
                                                    charge_per_cbm: 0,
                                                    label: chargesLabels[c]
                                                };
                                            });
                                        }
                                        let charges_array = { total: 0 };
                                        if(required)
                                            charges_array = generateChargesComputation({ charges: Object.values(charges[year_month]), billed_cbm });
                                        const consumption_array = generateConsumptionComputation({ rates, billed_cbm, minimum_consumption });
                                        const sub_total = charges_array.total + consumption_array.total;
                                        current_amount_due += sub_total;
                                        additional_charges += charges_array.total;
                                        const percentage_charges_array = [];
                                        percentage_charges.map(p=>{
                                            const label = p.description.replace("{{value}}",p.value);
                                            const percentage = p.value / 100;
                                            const total = Number((percentage * sub_total).toFixed(2));
                                            percentage_charges_array.push({
                                                label,
                                                total: string.currencyFormat(total)
                                            });
                                            current_amount_due += total;
                                            additional_charges += total;
                                        });

                                        const fixed_charges_array = [];
                                        fixed_charges.map(f=>{
                                            fixed_charges_array.push({
                                                label: f.description,
                                                total: string.currencyFormat(Number(f.value))
                                            })
                                            current_amount_due += Number(f.value);
                                            additional_charges += Number(f.value);
                                        });
                                        const total_interest = inserted < 1 && overdue_balance > 0 ? Number((overdue_balance * interest).toFixed(2)):0 || 0;
                                        const total_amount_due_without_overpayment = Number((total_interest + current_amount_due).toFixed(2));
                                        const total_amount_due = Number(((total_interest + current_amount_due) + overdue_balance).toFixed(2));
                                        let days = moment.duration(period_to.diff(moment(period_from))).asDays();
                                        if(days < 1 && period_from)
                                            return done();
                                            // throw new Error(`${consumer.unit_code} - Invalid period_from[${period_from}] and period_to[${period_to.format('YYYY-MM-DD')}]`);
                                        if(!period_from){
                                            days = 0;
                                        }
                                        const average_cbm_per_day = days && Number((total_cbm / days).toFixed(1)) || 0;
                                        const bill_date = date.format("YYYY-MM-DD");
                                        const insert = {
                                            meter_number: consumer.meter_number,
                                            bill_number: `WB-${++bill_number}`,
                                            bill_date,
                                            due_date: moment(bill_date).add(additional_days,'days').format("YYYY-MM-DD"),
                                            consumer_id: consumer.id,
                                            unit_code: consumer.unit_code,
                                            consumer_name: consumer.name,
                                            period_from,
                                            period_to: period_to.format("YYYY-MM-DD"),
                                            previous_reading,
                                            current_reading: r.value,
                                            total_cbm,
                                            average_cbm_per_day,
                                            number_of_days: days,
                                            additional_charges: Number(additional_charges.toFixed(2)),
                                            billed_cbm,
                                            current_amount_due: Number(current_amount_due.toFixed(2)),
                                            outstanding_balance: overdue_balance > 0 ? overdue_balance:0,
                                            interest: interest * 100,
                                            total_interest,
                                            total_amount_due_without_overpayment,
                                            total_amount_due,
                                            advance_payment: overdue_balance < 0 ? Math.abs(overdue_balance):0,
                                            generated_by,
                                            voided_by: 0
                                        }
                                        const id = (await trx("water_statements").insert(insert))[0];
                                        inserted++;
                                        total_inserts++;
                                        if(required)
                                            await trx("water_statement_charges").insert({
                                                type: 'charges',
                                                values: JSON.stringify(charges_array.breakdown),
                                                statement_id: id
                                            });

                                        await trx("water_statement_charges").insert({
                                            type: 'consumption',
                                            values: JSON.stringify(consumption_array.breakdown),
                                            statement_id: id
                                        });
                                        
                                        if(percentage_charges_array.length > 0)
                                            await trx("water_statement_charges").insert({
                                                type: 'percentage_charges',
                                                values: JSON.stringify(percentage_charges_array),
                                                statement_id: id
                                            });
                                        if(fixed_charges_array.length > 0)
                                            await trx("water_statement_charges").insert({
                                                type: 'fixed_charges',
                                                values: JSON.stringify(fixed_charges_array),
                                                statement_id: id
                                            });
                                        new_overall_receivables += insert.current_amount_due + insert.total_interest;
                                        overdue_balance = total_amount_due;
                                    // }
                                    previous_reading = r.value;
                                    if(!options?.reading_from)
                                        period_from = period_to.format("YYYY-MM-DD");
                                }catch(e){
                                    console.log(e,'xxx');
                                    rejected = true;
                                    reject(e);
                                }
                                done();
                            },resolve)
                        });
                        if(inserted > 0){
                            await trx("water_consumers").update({
                                overall_receivables: new_overall_receivables,
                                overall_payments: Math.abs(all.total_payment_received),
                                current_balance: new_overall_receivables + all.total_payment_received,
                                last_update: db.fn.now()
                            }).where("id",consumer.id);
                        }
                    }catch(e){
                        rejected = true;
                        reject(e);
                    }
                    done();
                },resolve)
            }catch(e){
                reject(e);
            }
        })
        return;
    });
    return { total_inserts };
}