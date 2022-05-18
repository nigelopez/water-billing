const { db , string } = require('../../helpers/init');
const yup = require('yup');
const moment = require('moment');
const path = require('path');
const fs = require('fs');
const processCSV = require('csvtojson');
const forEach = require('async-foreach').forEach;
const form = yup.object({
  date: yup.string().required().length(10),
  consumer_id: yup.number().positive().nullable(),
  type: yup.string().required(),
  value: yup.number().min(0).nullable(),
  xlsx: yup.string().nullable(),
}).noUnknown();

const Excel = require('exceljs');

module.exports = async (data) => {
  data.consumer_id = data.consumer_id?.value;
  const { id } = data.credentials;
  data = await form.validate(data);
  let date = string.validateDate(data.date);
  if(data.type === 'upload'){
    const { xlsx } = data;
    if(!xlsx)
      throw new Error(`No csv file uploaded`);
    if(!fs.existsSync(xlsx))
      throw new Error(`File ${xlsx} not found! Please contact administrator`);
    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(xlsx);
    const sheet = workbook.getWorksheet(1);
    const rows = [];
    for (var i = 2; i <= sheet.actualRowCount; i++) {
      // if(i > 2){
        const x = [];
        for (var j = 1; j <= sheet.actualColumnCount; j++) {
            data = sheet.getRow(i).getCell(j).toString();
            x.push(data);
        }
        const [unit_code, new_reading_value] = x;
        // if(isNaN(Number(id)))
        //   throw new Error(`Invalid consumer id on row # ${i}`);
        if(new_reading_value != ''){
          // skip all blanks
          if(isNaN(Number(new_reading_value)))
            throw new Error(`Invalid NEW_READING_VALUE of row # ${i} - ${unit_code} `);
          rows.push({
            // id,
            unit_code,
            new_reading_value
          });
        }
      // }
    }
    // console.log(rows);
    await db.transaction(async trx=>{
      const inserts = [];
      await new Promise((resolve, reject) => {
        let rejected = false;
        forEach(rows, async function(j){
          if(rejected || j.new_reading_value == '') return;
          const done = this.async();
          try{
            const consumer = await trx("water_consumers").where("unit_code",j.unit_code).first();
            if(!consumer)
              throw new Error(`Cannot find consumer ${j.unit_code}`);
            const reading = await trx("water_readings").select("value","date","consumer_id").where("consumer_id",consumer.id).orderBy('date','desc').first();
            if(!reading)
                throw new Error(`No previous reading of "${c.unit_code} - ${c.name}". Please add a single reading value for this consumer first in order to proceed`);
            const d = moment(reading.date);
            if(d.isSameOrAfter(date,'day')){
                throw new Error(`${j.unit_code} - Last reading of this consumer was on ${d.format("MMMM DD, YYYY")}, which means it is same day or after ${date.format("MMMM DD, YYYY")}. It cannot be added unless you will change the reading date, or download new template`);
            }else{
                const value = Number(j.new_reading_value);
                const old_reading = Number(reading.value);
                if(old_reading > value)
                  throw new Error(`${j.unit_code} - Previous reading was ${old_reading} cu.m and new reading is ${value} cu.m. You cannot add a reading that is lower than the previous reading value. If this is a new meter, please change the meter first.`);
                inserts.push({
                  value,
                  consumer_id: consumer.id,
                  date: date.format("YYYY-MM-DD"),
                  added_by: id,
                  meter_number: consumer.meter_number,
                  unit_code: consumer.unit_code
                })
            }
          }catch(e){
            console.log(e);
            reject(e);
            rejected = true;
          }
          done();
        },resolve)
      });
      if(inserts.length < 1)
        throw new Error(`No valid rows found. Please check your excel file`);
      await db("water_readings").insert(inserts);
    });
    return { successMessage: `Successfully imported reading values.` };
  }else if(data.type === 'single'){
    if(!data.consumer_id)
      throw new Error(`Please select a consumer!`);
    if(!data.value && data.value !== 0)
      throw new Error(`Reading value is required!`);
    const consumer = await db("water_consumers").where("id",data.consumer_id).first();
    if(!consumer)
      throw new Error(`Consumer not found!`);
    
    const latest_reading = await db("water_readings").where("consumer_id",consumer.id).orderBy("date","desc").first();
    if(latest_reading){
      const latest = moment(latest_reading.date);
      if(latest >= date)
        throw new Error(`You cannot add a previous reading. Last reading of this consumer was on ${latest.format("MMMM DD, YYYY")} and you are adding ON or BEFORE that date`);
      const last_reading = latest_reading.value;
      if(last_reading > data.value)
        throw new Error(`Invalid Reading Value! It must be greater than or equal to the last reading which is ${last_reading} cu.m`);
    }
    
    date = date.format('YYYY-MM-DD');

    const insert = {
      date,
      consumer_id: consumer.id,
      unit_code: consumer.unit_code,
      value: Number(data.value).toFixed(1),
      meter_number: consumer.meter_number,
      added_by: id
    };

    await db("water_readings").insert(insert);
    
    return { successMessage: `New reading successfully added!` };
  }else{
    throw new Error(`Invalid type!`);
  }
};