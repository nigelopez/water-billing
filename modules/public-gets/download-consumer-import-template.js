const moment = require('moment');
const yup = require('yup');
const { db, check } = require('../../helpers/init');
const { parse } = require('json2csv');
const fields = ['id', 'unit_code', 'name', 'meter_number', 'last_reading_date', 'last_reading_value','new_reading_value'];
const opts = { fields };
const { forEach } = require('async-foreach');
const excel = require('excel4node');

module.exports = async (data,req,res) => {
    return await db.transaction(async trx=>{
        const consumers = await trx("water_consumers").select("id","unit_code","name","meter_number").limit(100);
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
        
        const textStyle = workbook.createStyle({
            numberFormat: '@'
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

        const pesoStyle = workbook.createStyle({
            numberFormat: '₱#,##0.00; (₱#,##0.00); -'
        });

        let row = 1;
        worksheet.cell(row,1).string("UNIT CODE").style(headerStyle);
        worksheet.cell(2,1).string("AJ001");
        worksheet.column(2).setWidth(15);

        worksheet.cell(row,2).string("CONSUMER NAME").style(headerStyle);;
        worksheet.cell(2,2).string("LASTNAME, FIRST NAME (DO NOT DELETE THIS LINE)");
        worksheet.column(2).setWidth(50);

        worksheet.cell(row,3).string("LOT TYPE (Optional)").style(headerStyle);;
        worksheet.cell(2,3).string("Unit Model");
        worksheet.column(3).setWidth(20);

        const turnover_date_required = await check.if_turnover_date_is_required();

        worksheet.cell(row,4).string(`Date of Turnover${turnover_date_required ? '':' (Optional)'}`).style(headerStyle);;
        worksheet.cell(2,4).string("2022-01-30");
        worksheet.column(4).setWidth(20);
        
        worksheet.cell(row,5).string("EMAIL").style(headerStyle);;
        worksheet.cell(2,5).string("email@address.com");
        worksheet.column(5).setWidth(15);

        worksheet.cell(row,6).string("PHONE").style(headerStyle);;
        worksheet.cell(2,6).string("09171234567");
        worksheet.column(6).setWidth(15);

        worksheet.cell(row,7).string("METER NUMBER").style(headerStyle);
        worksheet.cell(2,7).string("12345");
        worksheet.column(7).setWidth(20);

        worksheet.cell(row,8).string("LAST READING DATE").style(headerStyle);
        worksheet.cell(2,8).date(new Date()).style(dateStyle);
        worksheet.column(8).setWidth(25);

        worksheet.cell(row,9).string("LAST READING VALUE").style(headerStyle);
        worksheet.cell(2,9).number(130);
        worksheet.column(9).setWidth(25);

        worksheet.cell(row,10).string("CURRENT BALANCE").style(headerStyle);
        worksheet.cell(2,10).number(3030).style(pesoStyle);
        worksheet.column(10).setWidth(25);

        worksheet.cell(3,1).string("START BELOW THIS ROW").style({ font: { color: "red", size: 20 }});

        for(var i = 4; i <= 2000; i++){
            worksheet.cell(i,1).style(textStyle);
            worksheet.cell(i,3).style(textStyle);
            worksheet.cell(i,5).style(textStyle); // email
            worksheet.cell(i,10).style(pesoStyle);
            worksheet.cell(i,8).style(dateStyle); // last reading_date
            worksheet.cell(i,4).style(dateStyle); // turnover date
        }
        workbook.write(`import_consumer_template.xlsx`,res);
        return { piped: true };
    });
};