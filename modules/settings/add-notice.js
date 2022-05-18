const { db } = require('../../helpers/init');
const yup = require('yup');

const form = yup.object({
  description: yup.string().required(),
  value: yup.string().required(),
}).noUnknown();

module.exports = async (data) => {
  const { id } = data.credentials;
  data = await form.validate(data);
  const name = `notice_${data.description}`;
  const found = await db("water_settings").where("name",name).first();
  if(found)
    throw new Error(`Notice description exists`);
  data.name = name;
  data.type = 'text';
  await db("water_settings_updates").insert({
    old_value: JSON.stringify({ action: "add" }),
    new_value: JSON.stringify(data),
    updated_by: id
  });
  await db("water_settings").insert(data);
  return { successMessage: `New notice has been added successfully` };
};