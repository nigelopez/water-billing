const { db, string } = require('../../helpers/init');
const helper = require('../../helpers/input-helpers');
const moment = require('moment');
const inputs = {
  submitUrl: 'statements/void-by-bill-date',
  submittingText: "Please wait",
  submitButtonText: 'Void Now',
  submitButtonColor: 'danger',
  cancelButtonColor: 'secondary',
  cancelButtonText: 'Cancel',
  type: "object",
  autocomplete: "off",
  properties: {
    date: helper.DatePicker({ label: "Billing Date", name: "date", required: true, maxDate: moment() }),
    void_reasons: helper.Input({ label: "Void Reason", name: "void_reasons", required: true }),
    warning: helper.Warning({ label: "Warning:", message: "This action will void all statements under the selected billing date."})
  }
};

module.exports = async (data) => {
  inputs.title = `Void By Billing Date`;
  return inputs;
};