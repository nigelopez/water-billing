const { db } = require('../../helpers/init');
const helper = require('../../helpers/input-helpers');

const inputs = {
  submitUrl: 'settings/add-fixed-charge',
  submittingText: "Please wait",
  submitButtonText: 'Add Fixed Charge',
  submitButtonColor: 'primary',
  cancelButtonColor: 'secondary',
  cancelButtonText: 'Cancel',
  type: "object",
  properties: {
    description: helper.Input({ label: "Description ( this will be displayed in the statement )", name: "description", required: true }),
    value: helper.Input({ label: "Value", name: "value", required: true, inputType: 'number', step: 0.01, inputGroup: { addonType: 'prepend', text: process.env.CURRENCY || "PHP" } }),
  }
};

module.exports = async (data) => {
  inputs.title = `Add Fixed Charge`;
  return inputs;
};