const helper = require('../../helpers/input-helpers');
const moment = require('moment');
const { db, get } = require('../../helpers/init');
const inputs = {
  submitUrl: 'statements/generate-statements',
  submittingText: "Please wait",
  submitButtonText: 'Generate Now',
  submitButtonColor: 'success',
  cancelButtonColor: 'secondary',
  cancelButtonText: 'Cancel',
  type: "object",
  properties: {
    reading_from: helper.DatePicker({ label: "Reading Date From", name: "reading_from", required: true, maxDate: moment().add(-1,'day') }),
    billing_date: helper.DatePicker({ label: "Billing Date", name: "billing_date", required: true, maxDate: moment() }),
    // warning: helper.Warning({ label: "Please confirm", message: `Are you sure you want to generate new billing statements?`, color: 'success' }),
    ignore: helper.Switch({ label: "Ignore utility bill", name: "ignore_bills" }),
    warning2: helper.Warning({
      label: "Warning", message: `Ignoring utility bills will result to 0.00 per cbm for electric & water charges`, color: 'info',
      showOnlyWhen: { field: 'ignore_bills', is: 'equal', compareValue: true },
    }),
  }
};

module.exports = async (data) => {
  inputs.title = `Generate Statements`;
  const last = await db("water_statements").orderBy("bill_date","desc").whereNull("voided_on").first();
  const show = await get.water_settings("show_ignore_utility_bills",true);
  if(show?.value !== "yes")
    delete inputs.properties.ignore;
  inputs.initialValues = {};
  if(last){
    inputs.properties.reading_from.props.inputProps.selected = moment(last.bill_date).format("YYYY-MM-DD");
    inputs.initialValues.reading_from = moment(last.bill_date).format("YYYY-MM-DD");
  }
  return inputs;
};