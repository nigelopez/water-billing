const { db, string } = require('../../helpers/init');
const helper = require('../../helpers/input-helpers');
const moment = require('moment');
const types = [
  { value: '', text: 'Please select a type' },
  { value: 'single', text: 'Single Bill - No Copy' },
  { value: 'with_copy', text: 'With Receiving Copy' },
]
const inputs = {
  submitUrl: 'downloads/download-statements',
  submittingText: "Please wait",
  submitButtonText: 'Submit Request',
  submitButtonColor: 'success',
  cancelButtonColor: 'secondary',
  cancelButtonText: 'Cancel',
  autocomplete: "off",
  type: "object",
  properties: {
    bill_date: helper.DatePicker({ label: "Select Billing Date", name: "bill_date", required: true, maxDate: moment() }),
    type: helper.Select({ label: "Select Type of Value", name: "type", options: types, required: true }),
  }
};

module.exports = async (data) => {
  inputs.title = `Download Statements`;
  inputs.initialValues = {
    bill_date: moment().format("YYYY-MM-DD")
  }
  return inputs;
};