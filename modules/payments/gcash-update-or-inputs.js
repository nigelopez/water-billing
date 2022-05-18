const { db, string } = require('../../helpers/init');
const helper = require('../../helpers/input-helpers');
const moment = require('moment');

const inputs = {
  submitUrl: 'payments/gcash-update-or',
  submittingText: "Please wait",
  submitButtonText: 'Update OR #',
  submitButtonColor: 'primary',
  cancelButtonColor: 'secondary',
  cancelButtonText: 'Cancel',
  type: "object",
  properties: {
    unit_code: helper.Input({ label: "Unit Code", name: "unit_code", disabled: true }),
    name: helper.Input({ label: "Consumer Name", name: "name", disabled: true }),
    amount: helper.Input({ label: "Payment Amount", name: "amount", disabled: true }),
    receipt_date: helper.Input({ label: "Receipt Date", name: "receipt_date", disabled: true }),
    or_number: helper.Input({ label: "OR Number", name: "or_number", required: true }),
  }
};

module.exports = async (data) => {
  const id = parseInt(data.id) || 0;
  const gcash = await db("view_gcash_requests").where("id",id).first();
  if(!gcash)
    throw new Error(`Cannot find gcash request id ${id}`);
  const payment = await db("water_payments").where("id",gcash.payment_id).first();
  
  if(!payment)
    throw new Error(`Could not find payment id ${gcash.payment_id}`);

  inputs.initialValues = {
    id: gcash.id,
    unit_code: gcash.unit_code,
    name: gcash.name,
    amount: gcash.amount_paid,
    receipt_date: moment(payment?.receipt_date).format("MMMM DD, YYYY")
  };
  inputs.title = `Update OR #`;
  return inputs;
};