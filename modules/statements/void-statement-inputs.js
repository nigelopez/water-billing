const { db, string } = require('../../helpers/init');
const helper = require('../../helpers/input-helpers');
const moment = require('moment');

const inputs = {
  submitUrl: 'statements/void-statement',
  submittingText: "Please wait",
  submitButtonText: 'Void Statement',
  submitButtonColor: 'danger',
  cancelButtonColor: 'secondary',
  cancelButtonText: 'Cancel',
  type: "object",
  properties: {
    bill_number: helper.Input({ label: "Bill Number", name: "bill_number", disabled: true }),
    unit_code: helper.Input({ label: "Unit Code", name: "unit_code", disabled: true }),
    name: helper.Input({ label: "Consumer Name", name: "consumer_name", disabled: true }),
    total_amount_due: helper.Input({ label: "Total Amount Due", name: "total_amount_due", disabled: true }),
    bill_date: helper.Input({ label: "Bill Date", name: "bill_date", disabled: true }),
    void_reasons: helper.Input({ label: "Void Reason", name: "void_reasons", required: true }),
    warning: helper.Warning({ message: `This action cannot be reverted` })
  }
};

module.exports = async (data) => {
  const id = parseInt(data.id) || 0;
  const statement = await db("water_statements").where("id",id).select('id','consumer_id','bill_number','unit_code','total_amount_due','consumer_name','billed_cbm','period_from','period_to','bill_date').first();
  if(!statement)
    throw new Error(`Cannot find water statement!`);
  if(statement.voided_on)
    throw new Error(`This statement was already cancelled`);
  const latest = await db("water_statements").select('id','period_to').first().orderBy('period_to','desc').whereNull("voided_on").where("consumer_id",statement.consumer_id);
  if(latest){
    const latest_period_to = moment(latest.period_to);
    const statement_period_to = moment(statement.period_to);
    if(latest_period_to > statement_period_to)
      throw new Error(`You cannot void an old water statement`);
  }
  inputs.title = `Void ${statement.bill_number}`;
  statement.total_amount_due = string.currencyFormat(statement.total_amount_due);
  statement.bill_date = moment(statement.bill_date).format("MMMM DD, YYYY");
  inputs.initialValues = statement;
  return inputs;
};