const { db } = require('../../helpers/init');
const yup = require('yup');
const moment = require('moment');

const form = yup.object({
  consumer_id: yup.number().required().positive(),
  new_meter_number: yup.string().required(),
  last_reading_of_old_meter: yup.number().required(),
  current_reading_of_new_meter: yup.number().required().min(0),
}).noUnknown();

module.exports = async (data) => {
  const { id } = data.credentials;
  data = await form.validate(data);
  await db.transaction(async trx=>{
    const consumer = await trx("water_consumers").where("id",data.consumer_id).first();
    if(!consumer)
      throw new Error(`Cannot find consumer id # ${data.id}`);
    const found = await trx("water_consumers").where("meter_number",data.new_meter_number).first();
    if(found)
      throw new Error(`${data.new_meter_number} is linked to ${found.unit_code}`);
    await trx("water_consumers").update("meter_number",data.new_meter_number).where("id",consumer.id);
    await trx("water_consumers_meter_updates").insert({
      old_value: consumer.meter_number || 'N/A',
      new_value: data.new_meter_number,
      updated_by: id,
      consumer_id: consumer.id
    });
    // add reading
    const reading = await db("water_readings").where("consumer_id",consumer.id).orderBy("date","desc").first();
    let last_reading_date = moment().add(-1,'day');
    let new_meter_first_reading_date = moment();
    if(reading){
      last_reading_date = moment(reading.date).add(2, 'day');
    }
    const days = moment.duration(new_meter_first_reading_date.diff(moment(last_reading_date))).asDays();
    if(days < 1)
      new_meter_first_reading_date = moment(last_reading_date.format('YYYY-MM-DD')).add(1,'day');
  
    const newDays = moment.duration(new_meter_first_reading_date.diff(moment())).asDays();
    if(newDays < 1)
      new_meter_first_reading_date.add(-1,'day');
  
    await trx("water_readings").insert({
      consumer_id: consumer.id,
      date: last_reading_date.format("YYYY-MM-DD"),
      value: data.last_reading_of_old_meter,
      unit_code: consumer.unit_code,
      meter_number: consumer.meter_number
    });

    // first reading of new meter
    await trx("water_readings").insert({
      consumer_id: consumer.id,
      date: new_meter_first_reading_date.format("YYYY-MM-DD"),
      value: data.current_reading_of_new_meter,
      unit_code: consumer.unit_code,
      meter_number: data.new_meter_number
    });

    return;
  });
  return { successMessage: `Water meter has been changed successfully` };
};