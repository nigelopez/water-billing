const moment = require('moment');
const yup = require('yup');
const { db } = require('../../helpers/init');
const { parse } = require('json2csv');
const fields = ['id', 'unit_code', 'name', 'meter_number', 'last_reading_date', 'last_reading_value','new_reading_value'];
const opts = { fields };
const { forEach } = require('async-foreach');
const excel = require('excel4node');

module.exports = async (data,req,res) => {
    return await db.transaction(async trx=>{
        const consumers = await trx("water_consumers").select("id","unit_code","name","meter_number");
        const workbook = new excel.Workbook({
            dateFormat: 'mm/dd/yyyy hh:mm:ss'
        });
        
        const worksheet = workbook.addWorksheet('Template');
        
        const oldStyle = workbook.createStyle({
            font: { color: 'blue' }
        });

        const newStyle = workbook.createStyle({
            font: { color: 'green' }
        });
        
        const dateStyle = workbook.createStyle({
            numberFormat: 'yyyy-mm-dd'
        });
        
        const headerStyle = workbook.createStyle({
            font: { color: "black", size: 14, bold: true }
        });

        const warningStyle = workbook.createStyle({
            font: { color: "red", bold: true },
        });

        const leftStyle = workbook.createStyle({
            alignment: { horizontal: 'left' }
        })

        let row = 1;
        worksheet.cell(row++,1).string("Do not modify any value except the NEW READING VALUE to prevent unexpected errors").style({ font: { color: 'red', size: 20, bold: true }});
        worksheet.cell(row,1).string("Consumer ID").style(headerStyle);
        worksheet.column(1).setWidth(20);
        worksheet.cell(row,2).string("UNIT CODE").style(headerStyle);
        worksheet.column(2).setWidth(15);
        worksheet.cell(row,3).string("CONSUMER NAME").style(headerStyle);;
        worksheet.column(3).setWidth(50);
        worksheet.cell(row,4).string("METER NUMBER").style(headerStyle);
        worksheet.column(4).setWidth(20);
        worksheet.cell(row,5).string("LAST READING DATE").style(headerStyle);
        worksheet.column(5).setWidth(25);
        worksheet.cell(row,6).string("LAST READING VALUE").style(headerStyle);
        worksheet.column(6).setWidth(25);
        worksheet.cell(row,7).string("NEW READING VALUE").style(headerStyle);
        worksheet.column(7).setWidth(25);
        worksheet.cell(row,8).string("WARNING").style(headerStyle);
        worksheet.column(8).setWidth(50);
        row++;
        await new Promise((resolve,reject)=>{
            let rejected = false;
            const now = moment();
            forEach(consumers, async function(c,index){
                if(rejected)
                    return;
                const done = this.async();
                try{
                    const reading = await trx("water_readings").select("value","date").where("consumer_id",c.id).orderBy('date','desc').first();
                    if(!reading)
                        throw new Error(`No previous reading of "${c.unit_code} - ${c.name}". Please add a single reading value for this consumer first in order to proceed`);
                    const d = moment(reading.date);
                    if(d.isSameOrAfter(now,'day')){
                        delete consumers[index];
                    }else{
                        worksheet.cell(row,1).number(c.id).style(leftStyle);
                        worksheet.cell(row,2).string(c.unit_code);
                        worksheet.cell(row,3).string(c.name);
                        worksheet.cell(row,4).string(c.meter_number);
                        worksheet.cell(row,5).date(moment(reading.date).format("YYYY-MM-DD")).style(dateStyle);
                        worksheet.cell(row,6).number(reading.value).style(oldStyle);
                        worksheet.cell(row,7).style(newStyle);
                        worksheet.cell(row,8).formula(`=IF(ISBLANK(${excel.getExcelCellRef(row,7)}),"",IF(${excel.getExcelCellRef(row,7)}-${excel.getExcelCellRef(row,6)} < 0,"New reading value is below the last reading value!",""))`).style(warningStyle);
                        row++;
                    }
                }catch(e){
                    reject(e);
                    rejected = true;
                }
                done();
            },resolve)
        })
        workbook.write(`latest_reading_${moment().format('YYYY-MM-DD hh-mm-A')}.xlsx`,res);
        // const csv = parse(consumers, opts);
        // res.header('Content-Type', 'text/csv');
        // res.attachment(`latest_reading_${moment().format('YYYY-MM-DD hh-mm-A')}.csv`);
        // res.send(csv);
        return { piped: true };
    });
};