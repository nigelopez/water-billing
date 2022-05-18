const { db } = require('../../helpers/init');
const helper = require('../../helpers/input-helpers');

const inputs = {
  submitUrl: 'settings/menu-duplicate',
  submittingText: "Please wait",
  submitButtonText: 'Duplicate Menu',
  submitButtonColor: 'primary',
  cancelButtonColor: 'secondary',
  cancelButtonText: 'Cancel',
  type: "object",
  properties: {
    id: helper.Input({ label: "New ID", name: "id", required: true }),
    label: helper.Input({ label: "Label", name: "label", required: true }),
    to: helper.Input({ label: "Location", name: "to", required: true }),
  }
};

module.exports = async (data) => {
  const id = parseInt(data._id) || 0;
  const menu = await db("menus").where("_id",id).first();
  if(!menu)
    throw new Error(`Cannot find menu!`);
  
  inputs.title = `Duplicate ${menu.label}`;
  inputs.initialValues = {
    _id: id,
    label: menu.label,
    to: menu.to
  }
  return inputs;
};