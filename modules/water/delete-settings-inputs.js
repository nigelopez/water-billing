const { db } = require('../../helpers/init');
const helper = require('../../helpers/input-helpers');
const types = require('./settings-types');

const inputs = {
  submitUrl: 'water/delete-settings',
  submittingText: "Please wait",
  submitButtonText: 'Delete Settings',
  submitButtonColor: 'danger',
  cancelButtonColor: 'secondary',
  cancelButtonText: 'Cancel',
  type: "object",
  properties: {
    name: helper.Input({ label: "Name", name: "name", disabled: true }),
    description: helper.Input({ label: "Description", name: "description", disabled: true }),
    type: helper.Select({ label: "Select Type of Value", name: "type", options: types, disabled: true }),
    value: helper.Input({ label: "Value", name: "value", disabled: true }),
    warning: helper.Warning({ message: `This action cannot be reverted` })
  }
};

module.exports = async (data) => {
  const id = parseInt(data.id) || 0;
  const settings = await db("water_settings").where("id",id).first();
  if(!settings)
    throw new Error(`Cannot find water settings!`);
  
  inputs.title = `Delete ${settings.name}`;
  inputs.initialValues = settings;
  return inputs;
};