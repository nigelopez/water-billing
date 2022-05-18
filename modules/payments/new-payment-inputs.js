const { db, string } = require('../../helpers/init');
const helper = require('../../helpers/input-helpers');
const types = require('./payment-types');
const moment = require('moment');

const inputs = {
  submitUrl: 'payments/new-payment',
  submittingText: "Please wait",
  submitButtonText: 'Submit Payment',
  submitButtonColor: 'success',
  cancelButtonColor: 'secondary',
  cancelButtonText: 'Cancel',
  autocomplete: 'off',
  type: "object",
  properties: {
    receipt_date: helper.DatePicker({ label: "Receipt Date", name: "receipt_date", required: true, maxDate: moment() }),
    consumer_id: {
      type: "string",
      nullable: false,
      component: "ReactSelectAsync",
      props: {
        name: 'consumer_id',
        label: `Select Consumer`,
        searchUrl: `search/consumer`,
        props: {
            isClearable: true,
        },
        onUpdate: {
          setFieldValue: 'balance',
          from: 'balance'
        }
      }
    },
    balance: helper.Input({ label: "Current Balance", name: "balance", disabled: true, style: { fontWeight: "bold", fontSize: '1.5em', color: 'red' } }),
    or_number: helper.Input({ label: "OR Number", name: "or_number", inputType: 'number', step: 1, required: true }),
    amount: helper.Input({ label: "Amount", name: "amount", inputType: 'number', step: 0.01, required: true, inputGroup: { addonType: 'prepend', text: string.getCurrencySymbol() } }),
    type: helper.Select({ label: "Select Type of Payment", name: "type", options: types, required: true }),
    bank_name: helper.Input({ 
      label: "Bank Name", name: "bank_name", required: true,
      showOnlyWhen: { field: 'type', is: 'in', compareValue: ['ONLINE','CHECK'] },
    }),
    check_number: helper.Input({ 
      label: "Check Number", name: "check_number", required: true,
      showOnlyWhen: { field: 'type', is: 'equal', compareValue: 'CHECK'},
    }),
    reference_number: helper.Input({ 
      label: "Online Reference Number", name: "reference_number", required: true,
      showOnlyWhen: { field: 'type', is: 'equal', compareValue: 'ONLINE'},
    }),
    notes: helper.Input({ label: "Notes (optional)", name: "notes", inputType: 'string', required: false }),
  }
};

module.exports = async (data) => {
  inputs.title = `New Payment`;
  const latest = await db("water_payments").orderBy("or_number","desc").first();
  let or_number;
  if(latest?.or_number)
    or_number = Number(latest?.or_number) + 1;
  inputs.initialValues = {
    receipt_date: moment().format("YYYY-MM-DD"),
    or_number
  }
  return inputs;
};