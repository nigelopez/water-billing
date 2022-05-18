const { db } = require('../../helpers/init');
const helper = require('../../helpers/input-helpers');

const inputs = {
  submitUrl: 'settings/menu-delete',
  submittingText: "Please wait",
  submitButtonText: 'Delete Menu',
  submitButtonColor: 'danger',
  cancelButtonColor: 'secondary',
  cancelButtonText: 'Cancel',
  type: "object",
  properties: {
    label: helper.Input({ label: "Label", name: "label", required: false, disabled: true }),
    warning: helper.Warning({ message: `This action cannot be reverted` })
  }
};

module.exports = async (data) => {
  const id = parseInt(data._id) || 0;
  const menu = await db("menus").where("_id",id).first();
  if(!menu)
    throw new Error(`Cannot find menu!`);
  
  inputs.title = `Delete ${menu.label}`;
  inputs.initialValues = {
    _id: id,
    label: menu.label
  }
  return inputs;
};