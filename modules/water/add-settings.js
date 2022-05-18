const { db } = require('../../helpers/init');
const verifications = require('./settings-types-verifications');
const yup = require('yup');

const form = yup.object({
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
  const found = await db("water_settings").where("name",data.name).first();
  if(found)
    throw new Error(`Water Settings Name already exists. Please choose another name`);
  await db("water_settings_updates").insert({
    old_value: JSON.stringify({ action: "add" }),
    new_value: JSON.stringify(data),
    updated_by: id
  });
  await db("water_settings").insert(data);
  return { successMessage: `New water settings has been added successfully` };
};