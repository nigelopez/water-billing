const { db , string, get, myForEach, check } = require('../../helpers/init');
const yup = require('yup');
const moment = require('moment');
const path = require('path');
const fs = require('fs');
const forEach = require('async-foreach').forEach;
const multiForm = yup.object({
  type: yup.string().required(),
  xlsx: yup.string().required(),
}).noUnknown();

const singleForm = yup.object({
    unit_code: yup.string().required().uppercase(),
    name: yup.string().required().uppercase(),
    unit_type: yup.string().nullable(),
    meter_number: yup.string().nullable().uppercase(),
    email: yup.string().nullable(),
    number: yup.string().nullable(),
    last_reading_date: yup.string().required().length(10),
    last_reading_value: yup.number().required().min(0),
    current_balance: yup.number().required().min(0),
    turnover_date: yup.string().length(10)
}).noUnknown();

const Excel = require('exceljs');

const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
};
module.exports = async (data) => {
    const { id } = data.credentials;
    const rows = [];
    
    const turnover_date_required = await check.if_turnover_date_is_required();

  if(data.type === 'upload'){
    data = await multiForm.validate(data);
    const { xlsx } = data;
    if(!xlsx)
      throw new Error(`No excel file uploaded`);
    if(!fs.existsSync(xlsx))
      throw new Error(`File ${xlsx} not found! Please contact administrator`);
    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(xlsx);
    const sheet = workbook.getWorksheet(1);
    for (var i = 4; i <= sheet.actualRowCount; i++) {
        const x = [];
        for (var j = 1; j <= sheet.actualColumnCount; j++) {
            data = sheet.getRow(i).getCell(j).toString();
            x.push(data == '' ? null:data);
        }
        let [unit_code, name, type, turnover_date, email, number, meter_number, last_reading_date, last_reading_value, current_balance] = x;
        if(!unit_code)
            throw new Error(`Please check row # ${i}; invalid Unit code`);
        if(!name)
            name = "-";
        // if(!name)
        //     throw new Error(`Please check row # ${i}; invalid consumer name`);
        if(turnover_date_required && !turnover_date)
            throw new Error(`${unit_code} - Turnover date is required`);
        if(turnover_date){
            turnover_date = moment(turnover_date);
            if(!turnover_date.isValid())
                throw new Error(`${unit_code} - Invalid turnover date`);
            turnover_date = turnover_date.format("YYYY-MM-DD");
        }
        if(email && !validateEmail(email))
            throw new Error(`Please check row # ${i}; ${unit_code} - ${name} - invalid email address`);
        if(!last_reading_date)
            throw new Error(`Please check row # ${i}; ${unit_code} - ${name} - invalid last reading date`)
        last_reading_date = moment(last_reading_date);
        if(!last_reading_date.isValid())
            throw new Error(`Please check row # ${i}; ${unit_code} - ${name} - invalid last reading date`)
        last_reading_date = last_reading_date.format('YYYY-MM-DD');
        if(!last_reading_value)
            last_reading_value = 0;
            // throw new Error(`Please check row # ${i}; ${unit_code} - ${name} - invalid last reading value`)
        last_reading_value = Number(last_reading_value);
        if(isNaN(last_reading_value))
            throw new Error(`Please check row # ${i}; ${unit_code} - ${name} - invalid last reading value`)
        current_balance = Number(current_balance || 0);
        if(isNaN(current_balance))
            throw new Error(`Please check row # ${i}; ${unit_code} - ${name} - invalid current balance`);
        if(!meter_number)
            meter_number = get.random_meter_number();
        rows.push({
            unit_code, name, type, turnover_date, email, number, meter_number, last_reading_date, last_reading_value, current_balance
        })
    }
  }else if(data.type === 'single'){
    data = await singleForm.validate(data);
    data.type = data.unit_type;
    delete data.unit_type;
    if(!data.meter_number)
        data.meter_number = get.random_meter_number();
    if(turnover_date_required){
        data.turnover_date = string.validateDate(data.turnover_date).format("YYYY-MM-DD");
    }
    rows.push(data);
  }else{
    throw new Error(`Invalid type!`);
  }

    let inserted = 0;
    await db.transaction(async trx=>{
        const func = async (r) => {
            const found = await trx("water_consumers").where("unit_code",r.unit_code).first();
            if(found)
                throw new Error(`${r.unit_code} is already in the consumers list!`);
            const insert = { 
                name: r.name,
                type: r.type,
                turnover_date: r.turnover_date,
                unit_code: r.unit_code,
                meter_number: r.meter_number,
                old_balance: r.current_balance,
                current_balance: r.current_balance,
                email: r.email,
                number: r.number
            };
            // console.log(insert);
            let last_reading_date = null;
            try{
                last_reading_date = string.validateDate(r.last_reading_date).format('YYYY-MM-DD');
            }catch(e){
                throw new Error(`${r.unit_code} - Last Reading Date Error - ${e.message}`);
            }
            let last_reading_value = Number(r.last_reading_value);
            const consumer_id = (await trx("water_consumers").insert(insert))[0];
            await trx("water_readings").insert({
                consumer_id,
                unit_code: r.unit_code,
                meter_number: r.meter_number,
                date: last_reading_date,
                value: last_reading_value,
                added_by: id
            });
            inserted++;
        }
        await myForEach(rows,func, { rejectOnError: true });
    });
    return { successMessage: `Successfully inserted ${inserted} consumers` };
};