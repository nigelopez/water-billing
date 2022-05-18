const { db } = require('../../helpers/init');
const yup = require('yup');

const form = yup.object({
  _id: yup.number().positive().required(),
}).noUnknown();

module.exports = async (data) => {
  data = await form.validate(data);
  const menu = await db("menus").where("_id",data._id).first();
  if(!menu)
    throw new Error(`Cannot find menu`);
  await db("menus").where("_id",data._id).del();
  return { successMessage: `Successfully deleted ${menu.label}` };
};