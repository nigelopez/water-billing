const { db } = require('../../helpers/init');
const yup = require('yup');

const form = yup.object({
  id: yup.number().required().positive(),
}).noUnknown();

module.exports = async (data) => {
  const { id } = data.credentials;
  data = await form.validate(data);
  const settings = await db("water_settings").where("id",data.id).first();
  if(!settings)
    throw new Error(`Cannot find water settings`);
  await db("water_settings_updates").insert({
    old_value: JSON.stringify(settings),
    new_value: JSON.stringify({ action: "delete" }),
    updated_by: id
  });
  await db("water_settings").del().where("id",data.id);
  return { successMessage: `Water settings has been deleted successfully` };
};