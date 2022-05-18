const { db } = require('../../helpers/init');
const yup = require('yup');
const verifications = require('./settings-types-verifications');

const form = yup.object({
  id: yup.number().positive().required(),
  value: yup.string().required()
}).noUnknown();

module.exports = async (data) => {
  const { id } = data.credentials;
  data = await form.validate(data);
  await db.transaction(async trx=>{
    const settings = await trx("water_settings").where("id",data.id).first();
    if(!settings)
      throw new Error(`Cannot find settings with id ${data.id}`);
    if(!verifications[settings.type])
      throw new Error(`Type not found! Please contact administrator`);
    data.value = verifications[settings.type](data.value);
    const update = {
      value: data.value
    };
    if(settings.name == 'additional_days_for_due_date' && Number(data.value || 0) < 1)
      throw new Error(`Additional days after billing date must be at least 1 day`);
    await trx("water_settings").update(update).where('id',settings.id);
    await trx('water_settings_updates').insert({
      updated_by: id,
      old_value: JSON.stringify({ value: settings.value }),
      new_value: JSON.stringify({ value: data.value }),
    });
  });
  return { successMessage: `Successfully updated settings` };
};