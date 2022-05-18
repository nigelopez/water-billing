const { db } = require('../../helpers/init');
const moment = require('moment');
const yup = require('yup');

const form = yup.object({
  consumer_id: yup.number().required().positive(),
}).noUnknown();

module.exports = async (data) => {
  const { id } = data.credentials;
  data = await form.validate(data);
  await db.transaction(async trx=>{
    const consumer = await trx("water_consumers").where("id",data.consumer_id).first();
    if(!consumer)
      throw new Error(`Cannot find consumer id # ${data.id}`);
    const update = {
      suspended: 0,
      suspended_by: 0,
      suspension_reason: null
    };
    await trx("water_consumers").update(update).where("id",consumer.id);
    await trx("water_consumers_updates").insert({
      old_value: JSON.stringify({}),
      new_value: JSON.stringify({ unsuspend: true }),
      updated_by: id,
      consumer_id: consumer.id
    });
    return;
  });
  return { successMessage: `Suspension has been removed successfully` };
};