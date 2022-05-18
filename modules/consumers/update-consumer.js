const { db, string } = require('../../helpers/init');
const yup = require('yup');

const form = yup.object({
  consumer_id: yup.number().required().positive(),
  unit_code: yup.string().required().uppercase(),
  name: yup.string().required().uppercase(),
  email: yup.string().nullable(),
  number: yup.string().nullable()
}).noUnknown();

module.exports = async (data) => {
  const { id } = data.credentials;
  data = await form.validate(data);
  await db.transaction(async trx=>{
    const consumer = await trx("water_consumers").where("id",data.consumer_id).first();
    if(!consumer)
      throw new Error(`Cannot find consumer id # ${data.id}`);
    if(consumer.unit_code !== data.unit_code){
      const check = await trx("water_consumers").where("unit_code",data.unit_code).first();
      if(check)
        throw new Error(`Unit Code "${data.unit_code}" already added. Cannot add duplicate unit code`);
    }
    let email = data.email;
    if(email && !string.validateEmail(email)){
        throw new Error(`Invalid email address: ${data.email}`);
    }
    const update = {
      name: data.name,
      email,
      number: data.number,
      unit_code: data.unit_code
    };
    await trx("water_consumers").update(update).where("id",consumer.id);
    await trx("water_consumers_updates").insert({
      old_value: JSON.stringify({ name: consumer.name, email: consumer.email, number: consumer.number,meter_number: consumer.meter_number }),
      new_value: JSON.stringify(update),
      updated_by: id,
      consumer_id: consumer.id
    });
    return;
  });
  return { successMessage: `Consumer Information has been updated successfully` };
};