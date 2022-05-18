const { db } = require('../../helpers/init');
const verifications = require('./settings-types-verifications');
const yup = require('yup');

const form = yup.object({
  id: yup.number().required().positive(),
  name: yup.string().required(),
  description: yup.string().required(),
  type: yup.string().required(),
  value: yup.string().nullable(),
}).noUnknown();

module.exports = async (data) => {
  const { id } = data.credentials;
  data = await form.validate(data);
  if(!verifications[data.type])
    throw new Error(`Please select a valid type`);
  data.value = verifications[data.type](data.value);
  const settings = await db("water_settings").where("id",data.id).first();
  if(!settings)
    throw new Error(`Cannot find water settings`);
  if(settings.name !== data.name){
    const found = await db("water_settings").where("name",data.name).first();
    if(found)
      throw new Error(`Water Settings Name already exists. Please choose another name`);
  }
  await db("water_settings_updates").insert({
    old_value: JSON.stringify(settings),
    new_value: JSON.stringify(data),
    updated_by: id
  });
  await db("water_settings").update(data).where("id",data.id);
  return { successMessage: `Water settings has been updated successfully` };
};