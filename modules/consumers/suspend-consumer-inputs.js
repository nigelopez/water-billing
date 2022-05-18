const { db } = require('../../helpers/init');
const helper = require('../../helpers/input-helpers');
const string = require('../../helpers/string');
const inputs = {
  submitUrl: 'consumers/suspend-consumer',
  submittingText: "Please wait",
  submitButtonText: 'Suspend',
  submitButtonColor: 'danger',
  cancelButtonColor: 'secondary',
  cancelButtonText: 'Cancel',
  type: "object",
  properties: {
    name: helper.Input({ label: "Name", name: "name", disabled: true }),
    unit_code: helper.Input({ label: "Unit Code", name: "unit_code", disabled: true }),
    current_balance: helper.Input({ label: "Current Balance", name: "current_balance", disabled: true }),
    reason: helper.Input({ label: "Reason for suspension", name: "reason", required: true }),
  }
};

module.exports = async (data) => {
  const id = Number(data.id) || 0;
  const consumer = await db("water_consumers").where("id",id).first();
  if(!consumer)
    throw new Error(`Cannot find consumer id ${id}`);
  inputs.initialValues = { 
    name: consumer.name,
    consumer_id: consumer.id,
    current_balance: string.currencyFormat(consumer.current_balance),
    unit_code: consumer.unit_code
  }
  inputs.title = `Suspend Consumer`;
  return inputs;
};