const { db } = require('../../helpers/init');
const helper = require('../../helpers/input-helpers');
const types = require('./settings-types');

const inputs = {
  submitUrl: 'water/update-settings',
  submittingText: "Please wait",
  submitButtonText: 'Update Settings',
  submitButtonColor: 'primary',
  cancelButtonColor: 'secondary',
  cancelButtonText: 'Cancel',
  type: "object",
  properties: {
    name: helper.Input({ label: "Name", name: "name", required: true }),
    description: helper.Input({ label: "Description", name: "description", required: true }),
    type: helper.Select({ label: "Select Type of Value", name: "type", options: types, required: true }),
    value: helper.Input({ label: "Value", name: "value", required: true }),
  }
};

module.exports = async (data) => {
  inputs.title = `Update Settings`;
  const settings = await db('water_settings').where("id",data.id).first();
  if(!settings)
    throw new Error(`Cannot find this water settings`);
  inputs.initialValues = {
    name: settings.name,
    description: settings.description,
    type: settings.type,
    value: settings.value,
    id: settings.id
  }
  return inputs;
};