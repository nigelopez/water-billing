const { db } = require('../../helpers/init');
const helper = require('../../helpers/input-helpers');
const types = [
  { value: '', text: 'Please select a scheme' },
  { value: 'fixed', text: 'Fixed Rate Per Cubic Meter' },
  { value: 'range', text: 'Depending on Consumption (by range)' },
]
const inputs = {
  submitUrl: 'settings/rates-modify-scheme',
  submittingText: "Please wait",
  submitButtonText: 'Modify Rate Scheme',
  submitButtonColor: 'danger',
  cancelButtonColor: 'secondary',
  cancelButtonText: 'Cancel',
  type: "object",
  properties: {
    type: helper.Select({ label: "Select a scheme", options: types, name: 'type', required: true }),
    w1: helper.Warning({ 
      label: 'Notes', message: 'You can modify the rates by range after you submit the changes', color: 'info',
      showOnlyWhen: { field: 'type', is: 'equal', compareValue: 'range'}
    }),
    w2: helper.Warning({ 
      label: 'Notes', message: 'You can modify the rate after you submit the changes', color: 'warning',
      showOnlyWhen: { field: 'type', is: 'equal', compareValue: 'fixed'}
    })
  }
};

module.exports = async (data) => {
  inputs.title = `Modify Rate Scheme`;
  // inputs.initialValues = settings;
  return inputs;
};