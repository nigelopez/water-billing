const { db } = require('../../helpers/init');
const yup = require('yup');
const verifications = require('./settings-types-verifications');

const form = yup.object({
  id: yup.number().positive().required(),
  checked: yup.boolean().required()
}).noUnknown();

module.exports = async (data) => {
  const { id } = data.credentials;
  data = await form.validate(data);
  await db.transaction(async trx=>{
    data.value = data.checked ? 'yes':'no';
    const settings = await trx("water_settings").where("id",data.id).first();
    if(!settings)
      throw new Error(`Cannot find settings with id ${data.id}`);
    const update = {
      value: data.value
    };
    await trx("water_settings").update(update).where('id',settings.id);
    await trx('water_settings_updates').insert({
      updated_by: id,
      old_value: JSON.stringify({ value: settings.value }),
      new_value: JSON.stringify({ value: data.value }),
    });
  });
  return { successMessage: `Successfully updated settings` };
};