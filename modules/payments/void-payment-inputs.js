const { db, string } = require('../../helpers/init');
const helper = require('../../helpers/input-helpers');
const moment = require('moment');

const inputs = {
  submitUrl: 'payments/void-payment',
  submittingText: "Please wait",
  submitButtonText: 'Void Payment',
  submitButtonColor: 'danger',
  cancelButtonColor: 'secondary',
  cancelButtonText: 'Cancel',
  type: "object",
  properties: {
    or_number: helper.Input({ label: "OR Number", name: "or_number", disabled: true }),
    unit_code: helper.Input({ label: "Unit Code", name: "unit_code", disabled: true }),
    name: helper.Input({ label: "Consumer Name", name: "name", disabled: true }),
    amount: helper.Input({ label: "Payment Amount", name: "amount", disabled: true }),
    receipt_date: helper.Input({ label: "Receipt Date", name: "receipt_date", disabled: true }),
    void_reasons: helper.Input({ label: "Void Reason", name: "void_reasons", required: true }),
    warning: helper.Warning({ message: `This action cannot be reverted` })
  }
};

module.exports = async (data) => {
  const id = parseInt(data.id) || 0;
  const payment = await db("view_water_payments").where("id",id).first();
  if(!payment)
    throw new Error(`Cannot find payment id ${id}`);
  if(payment.voided_on)
    throw new Error(`This payment was already cancelled`);
  payment.receipt_date = moment(payment.receipt_date).format("MMMM DD, YYYY");
  payment.amount = string.currencyFormat(payment.amount);
  inputs.title = `Void Payment`;
  inputs.initialValues = payment;
  return inputs;
};