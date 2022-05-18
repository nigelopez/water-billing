const { db, string } = require('../../helpers/init');
const helper = require('../../helpers/input-helpers');
const moment = require('moment');
const types = [
  { value: '', text: 'Please select a type' },
  { value: 'select', text: 'Select Consumers' },
  { value: 'all', text: 'All Consumers' },
]
const inputs = {
  submitUrl: 'notifications/send-notification',
  submittingText: "Please wait",
  submitButtonText: 'Send Notification',
  submitButtonColor: 'success',
  cancelButtonColor: 'secondary',
  cancelButtonText: 'Cancel',
  type: "object",
  autocomplete: 'off',
  properties: {
    date: helper.DatePicker({ label: "Select Billing Date", name: "date", required: true, maxDate: moment() }),
    type: helper.Select({ label: "Select Type of Value", name: "type", options: types, required: true }),
    consumer_ids: {
      type: "string",
      nullable: false,
      component: "ReactSelectAsync",
      props: {
        showOnlyWhen: { field: 'type', is: 'equal', compareValue: 'select'},
        name: 'consumer_ids',
        label: `Select Consumer with Email`,
        searchUrl: `search/consumer-with-email`,
        props: {
            isClearable: true,
            isMulti: true
        }
      }
    },
    value: helper.Input({ 
      label: "Reading Value", name: "value", inputType: 'number', step: 0.1, required: true,
      showOnlyWhen: { field: 'type', is: 'equal', compareValue: 'single'},
    }),
    warning: helper.Warning({
        message: `All consumers with email address will be notified`,
        label: "Note:",
        color: 'info',
        showOnlyWhen: { field: 'type', is: 'equal', compareValue: 'all'}
    })
  }
};

module.exports = async (data) => {
  inputs.title = `Send Notification`;
  inputs.initialValues = {}
  return inputs;
};