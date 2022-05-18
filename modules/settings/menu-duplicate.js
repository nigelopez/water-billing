const { db } = require('../../helpers/init');
const yup = require('yup');

const form = yup.object({
  _id: yup.number().positive().required(),
  id: yup.string().required(),
  label: yup.string().required(),
  to: yup.string().required()
}).noUnknown();

module.exports = async (data) => {
  data = await form.validate(data);
  const menu = await db("menus").where("_id",data._id).first();
  if(!menu)
    throw new Error(`Cannot find menu`);
  delete menu.added_on;
  delete menu.id;
  delete menu._id;
  const insert = {
    ...menu,
    id: data.id,
    label: data.label,
    to: data.to
  }
  await db("menus").insert(insert);
  return { successMessage: `Successfully duplicated ${menu.label} menu`, closeModal: 1000 };
};