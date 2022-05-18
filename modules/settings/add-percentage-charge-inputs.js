const { db } = require('../../helpers/init');
const helper = require('../../helpers/input-helpers');

const inputs = {
  submitUrl: 'settings/add-percentage-charge',
  submittingText: "Please wait",
  submitButtonText: 'Add Percentage Charge',
  submitButtonColor: 'primary',
  cancelButtonColor: 'secondary',
  cancelButtonText: 'Cancel',
  type: "object",
  properties: {
    info: helper.Warning({ label: "Calculation Notes", message: 'The percentage that you will add here will be calculated as ( SubTotals + (Percentage x SubTotals) )', color: 'info'}),
    description: helper.Input({ label: "Description ( this will be displayed in the statement )", name: "description", required: true }),
    value: helper.Input({ label: "Percentage", name: "value", required: true, inputType: 'number', step: 0.01, inputGroup: { addonType: 'append', text: '%' } }),
    warning: helper.Warning({ label: "Notes", message: 'You can use {{value}} to display the value of % that you are adding. For example: "Admin Fee ({{value}}%)" will be displayed in the statement as "Admin Fee (5%)"'})
  }
};

module.exports = async (data) => {
  inputs.title = `Add Percentage Charge`;
  return inputs;
};