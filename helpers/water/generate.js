const { db, get, check, myForEach } = require('../init');
const moment = require('moment');
const getPreviousReadings = require('./getPreviousReadings');
const generateChargesComputation = require('./generateChargesComputation');
const getConsumptionRates = require('./getConsumptionRates');
const generateConsumptionComputation = require('./generateConsumptionComputation.js');
const getConsumerLatestNumbers = require('./getConsumerLatestNumbers');
const forEach = require('async-foreach').forEach;
const string = require('../string');
const BILL_STARTING_NUMBER = process.env.BILL_STARTING_NUMBER || `WB-300000000`;
module.exports = async (date = moment(), generated_by = 0, options = { ignore_bills: false, reading_from: null, ignore_old_statement_errors: true }) => {
    // const to = date.format('YYYY-MM-DD HH:mm:ss');
    const bill_date = date.format("YYYY-MM-DD");
    const from = options.reading_from?.format("YYYY-MM-DD");
    const to = date.format('YYYY-MM-DD 23:59:59');
    const rates = await getConsumptionRates();
    let total_inserts = 0;
    
    await db.transaction(async trx=>{
        let { charges, chargesLabels, required } = await get.water_required_charges(to,trx);
        let minimum_consumption = Number((await get.water_settings("minimum_consumption",true,trx))?.value || 0);
        let consumption_before_applying_minimum = Number((await get.water_settings("consumption_before_applying_minimum",true,trx))?.value || 0);
        const percentage_charges = await trx("water_settings").where("name","like","percentage_charges%").orderBy("description");
        const fixed_charges = await trx("water_settings").where("name","like","fixed_charges%").orderBy("description");
        const interest = Number((await get.water_settings("interest",true,trx))?.value || 0) / 100;
        const additional_days = Number((await get.water_settings("additional_days_for_due_date",true,trx))?.value || 15);

        let bill_number = Number(((await trx("water_statements").orderBy('bill_number','desc').select('bill_number').first())?.bill_number || BILL_STARTING_NUMBER).split("-")[1]);

        const consumers = await trx("water_consumers").select('id','unit_code','name','meter_number').where("allow_billing",true);

        const func = async (consumer) => {
            try{
                await check.if_latest_statement_is_inside_period(consumer.id, from, to, trx);
            }catch(e){
                // default is true, ignore old statements errors
                if(options?.ignore_old_statement_errors === false)
                    throw e;
            }
            let readings = await get.water_readings(consumer.id,from,to,trx);
            // console.log(readings);
            // throw new Error("eut");
            if(readings.length < 2)
                return; // not enough readings
            
            let period_from, period_to, previous_reading, current_reading, last_reading, meter_number, total_cbm = 0, used_readings = [];
            readings.map((r,i)=>{
                if(i === 0){
                    last_reading = r.value;
                    previous_reading = r.value;
                    period_from = r.date;
                    meter_number = r.meter_number;
                }else{
                    current_reading = r.value;
                    period_to = r.date;
                    if(meter_number !== r.meter_number){
                        // change of meter
                        meter_number = r.meter_number;
                    }else{
                        if(last_reading > r.value)
                            throw new Error(`Invalid reading of ${consumer.unit_code}; Last reading ${last_reading} cu.m is greater than ${r.value} cu.m`);
                            total_cbm += r.value - last_reading;
                    }
                    last_reading = r.value;
                }
                used_readings.push(r.id);
            });         
            used_readings.pop();

            total_cbm = Number(total_cbm.toFixed(1));
            period_from = moment(period_from);
            period_to = moment(period_to);

            const year_month = `${period_to.year()}-${period_to.month() + 1}`;
            
            if(required.length > 0 && !charges[year_month] && !options?.ignore_bills)
                throw new Error(`No utility bills found for ${period_to.format("MMMM YYYY")}`);

            let additional_charges = 0;
            let current_amount_due = 0;
            
            let days = moment.duration(period_to.diff(moment(period_from))).asDays();
            const average_cbm_per_day = days && Number((total_cbm / days).toFixed(1)) || 0;

            let all = await getConsumerLatestNumbers(consumer.id,trx);


            let billed_cbm = 0;
            if(total_cbm >= consumption_before_applying_minimum && total_cbm < minimum_consumption)
                billed_cbm = minimum_consumption;
            else if(total_cbm >= minimum_consumption)
                billed_cbm = total_cbm;
            if(billed_cbm <= 0){
                throw new Error("Billed CBM is 0");
            }

            if(!options?.ignore_bills){
                required?.map(c=>{
                    if(!charges[year_month][c])
                        throw new Error(`${consumer.unit_code} - No ${c} utility bill for ${period_to.format("MMMM YYYY")}`);
                });
            }else{
                required?.map(c=>{
                    if(!charges[year_month])
                        charges[year_month] = {};
                    charges[year_month][c] = {
                        charge_per_cbm: 0,
                        label: chargesLabels[c]
                    };
                });
            }
            
            let charges_array = { total: 0 };
            if(required.length > 0)
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

            const total_interest = all.current_balance > 0 ? Number((all.current_balance * interest).toFixed(2)) : 0;
            const total_amount_due_without_overpayment = Number((total_interest + current_amount_due).toFixed(2));
            const total_amount_due = Number(((total_interest + current_amount_due) + all.current_balance).toFixed(2));
            
            const insert = {
                meter_number: consumer.meter_number,
                bill_number: `WB-${++bill_number}`,
                bill_date,
                due_date: moment(bill_date).add(additional_days,'days').format("YYYY-MM-DD"),
                consumer_id: consumer.id,
                unit_code: consumer.unit_code,
                consumer_name: consumer.name,
                period_from: period_from.format("YYYY-MM-DD"),
                period_to: period_to.format("YYYY-MM-DD"),
                previous_reading,
                current_reading,
                total_cbm,
                average_cbm_per_day,
                number_of_days: days,
                additional_charges: Number(additional_charges.toFixed(2)),
                billed_cbm,
                current_amount_due: Number(current_amount_due.toFixed(2)),
                outstanding_balance: all.current_balance > 0 ? all.current_balance : 0,
                interest: interest * 100,
                total_interest,
                total_amount_due_without_overpayment,
                total_amount_due,
                advance_payment: all.current_balance < 0 ? Math.abs(all.current_balance):0,
                generated_by,
                voided_by: 0,
            }

            const id = (await trx("water_statements").insert(insert))[0];
            
            await trx("water_readings").update("statement_id",id).whereIn("id",used_readings);

            let new_overall_receivables = all.overall_due + insert.current_amount_due + insert.total_interest;

            await trx("water_consumers").update({
                overall_receivables: new_overall_receivables,
                overall_payments: Math.abs(all.total_payment_received),
                current_balance: new_overall_receivables + -Math.abs(all.total_payment_received),
                last_update: db.fn.now()
            }).where("id",consumer.id);

            if(required.length > 0){
                await trx("water_statement_charges").insert({
                    type: 'charges',
                    values: JSON.stringify(charges_array.breakdown),
                    statement_id: id
                });
            }

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

            total_inserts++;
        }

        await myForEach(consumers,func,{ rejectOnError: true });
        
    });
    return { total_inserts };
}