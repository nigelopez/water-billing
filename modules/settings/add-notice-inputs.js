const { db } = require('../../helpers/init');
const helper = require('../../helpers/input-helpers');

const inputs = {
  submitUrl: 'settings/add-notice',
  submittingText: "Please wait",
  submitButtonText: 'Add Notice',
  submitButtonColor: 'primary',
  cancelButtonColor: 'secondary',
  cancelButtonText: 'Cancel',
  type: "object",
  properties: {
    description: helper.Input({ label: "Description ( will not display in the statement )", name: "description", required: true }),
    value: helper.Input({ label: "Value", name: "value", required: true }),
  }
};

module.exports = async (data) => {
  inputs.title = `Add New Notice`;
  return inputs;
};