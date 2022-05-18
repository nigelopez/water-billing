const { db } = require('../../helpers/init');
const helper = require('../../helpers/input-helpers');
const string = require('../../helpers/string');
const types = require('./utility-bills-types');
const moment = require('moment');
const inputs = {
  submitUrl: 'utility-bills/void',
  submittingText: "Please wait",
  submitButtonText: 'Void Bill',
  submitButtonColor: 'danger',
  cancelButtonColor: 'secondary',
  cancelButtonText: 'Cancel',
  type: "object",
  properties: {
    date: helper.DatePicker({ disabled: true, type: "string", label: "Month & Year of this Bill", name: "date", selectedDate: moment().format('YYYY-MM-DD'), maxDate: moment().endOf('month').format("YYYY-MM-DD"), showMonthYearPicker: true, dateDisplay: 'MMMM yyyy' }),
    type: helper.Select({ label: "Select Type of Bill", name: "type", options: types, disabled: true }),
    current_bill: helper.Input({ label: "Billed Amount", name: "current_bill", inputType: 'string', disabled: true, }),
    image: {},
    warning: helper.Warning({ message: `This action cannot be reverted` }),
    void_notes: helper.Input({ label: "Void Notes", name: "void_notes", inputType: 'string', required: true }),
  }
};

module.exports = async (data) => {
  const id = parseInt(data.id) || 0;
  const bill = await db("water_utility_bills").where("id",id).first();
  if(!bill)
    throw new Error(`Cannot find water utiliy bill!`);
  if(bill.voided_on)
    throw new Error(`This bill was already voided`);
  inputs.properties.image = helper.ImageDisplay({ url: bill.image, label: "Uploaded Image", style: { width: '100%' }});
  inputs.title = `Void Bill`;
  bill.current_bill = string.currencyFormat(bill.current_bill);
  inputs.initialValues = bill;
  return inputs;
};