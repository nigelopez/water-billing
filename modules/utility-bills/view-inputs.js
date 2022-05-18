const { db } = require('../../helpers/init');
const helper = require('../../helpers/input-helpers');
const string = require('../../helpers/string');
const types = require('./utility-bills-types');
const moment = require('moment');
const inputs = {
  submitButtonColor: 'danger',
  cancelButtonColor: 'secondary',
  cancelButtonText: 'Cancel',
  type: "object",
  properties: {
    date: helper.DatePicker({ disabled: true, type: "string", label: "Month & Year of this Bill", name: "date", selectedDate: moment().format('YYYY-MM-DD'), maxDate: moment().endOf('month').format("YYYY-MM-DD"), showMonthYearPicker: true, dateDisplay: 'MMMM yyyy' }),
    type: helper.Select({ label: "Select Type of Bill", name: "type", options: types, disabled: true }),
    water_consumption: helper.Input({ label: "Water Consumption", name: "water_consumption", inputType: 'string', disabled: true, }),
    water_fee: helper.Input({ label: "Water Fee", name: "water_fee", inputType: 'string', disabled: true, }),
    current_bill: helper.Input({ label: "Billed Amount", name: "current_bill", inputType: 'string', disabled: true, }),
    image: {},
  }
};

module.exports = async (data) => {
  const id = parseInt(data.id) || 0;
  const bill = await db("water_utility_bills").where("id",id).first();
  if(!bill)
    throw new Error(`Cannot find water utiliy bill!`);
  inputs.properties.image = helper.ImageDisplay({ url: bill.image, label: "Uploaded Image", style: { width: '100%' }});
  inputs.title = `View Bill`;
  bill.current_bill = string.currencyFormat(bill.current_bill);
  bill.water_consumption = `${string.numberWithCommas(bill.water_consumption)} cbm`;
  bill.water_fee = string.currencyFormat(bill.water_fee);
  inputs.initialValues = bill;
  return inputs;
};