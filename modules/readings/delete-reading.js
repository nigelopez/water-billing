const { db } = require('../../helpers/init');
const yup = require('yup');

const form = yup.object({
  id: yup.number().required().positive(),
  reason: yup.string().required()
}).noUnknown();

module.exports = async (data) => {
  const { id } = data.credentials;
  data = await form.validate(data);
  await db.transaction(async trx=>{
    const readings = await trx("water_readings").where("id",data.id).select('consumer_id','unit_code','meter_number','date','value').first();
    if(!readings)
      throw new Error(`Cannot find water reading id # ${data.id}`);
    readings.reason = data.reason;
    await trx("water_readings_deleted").insert(readings);
    await trx("water_readings").del().where("id",data.id);
    await trx("uploads_readings").where("active_readings_id",data.id).update("active_readings_id",null);
  })
  return { successMessage: `Water reading has been deleted successfully` };
};