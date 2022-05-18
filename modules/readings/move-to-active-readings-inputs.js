const { db } = require('../../helpers/init');
const helper = require('../../helpers/input-helpers');

const inputs = {
  submitUrl: 'readings/move-to-active-readings',
  submittingText: "Please wait",
  submitButtonText: 'Move Now',
  submitButtonColor: 'primary',
  cancelButtonColor: 'secondary',
  cancelButtonText: 'Cancel',
  type: "object",
  properties: {
    description: null,
    warning: null
  }
};

module.exports = async (data) => {
  inputs.properties.description = helper.Warning({ color: "primary", label: "", message: `You are about to move ${data.rows?.length} row${data.rows?.length > 1 ? 's':''} to Active Readings.`})
  inputs.properties.warning = helper.Warning({ color: "info", label: "Note", message: `All selected readings with errors or pending readings will not be moved`});
  inputs.title = `Move to Active Readings`;
  inputs.initialValues = {
    rows: data.rows
  };
  return inputs;
};