const { db } = require('../../helpers/init');
const helper = require('../../helpers/input-helpers');

const inputs = {
  submitUrl: 'readings/delete-readings',
  submittingText: "Please wait",
  submitButtonText: 'Delete Now',
  submitButtonColor: 'danger',
  cancelButtonColor: 'secondary',
  cancelButtonText: 'Cancel',
  type: "object",
  properties: {
    description: null,
    warning: null,
    reason: helper.Input({ name: "reason", label: "Reason for deleting these readings", required: true })
  }
};

module.exports = async (data) => {
  inputs.properties.description = helper.Warning({ color: "primary", label: "", message: `You are about to delete ${data.rows?.length} row${data.rows?.length > 1 ? 's':''}.`})
  inputs.properties.warning = helper.Warning({ color: "info", label: "Note", message: `This action is irreversable. Please confirm`});
  inputs.title = `Delete Readings`;
  inputs.initialValues = {
    rows: data.rows
  };
  return inputs;
};