const { db, string } = require('../../helpers/init');
const helper = require('../../helpers/input-helpers');
const moment = require('moment');

const inputs = {
  submitUrl: 'consumers/update-consumer',
  submittingText: "Please wait",
  submitButtonText: 'Update Consumer',
  submitButtonColor: 'success',
  cancelButtonColor: 'secondary',
  cancelButtonText: 'Cancel',
  type: "object",
  properties: {
    unit_code: helper.Input({ label: "Unit Code", name: "unit_code", required: true }),
    name: helper.Input({ label: "Consumer Name", name: "name", required: true }),
    email: helper.Input({ label: "Email Address ( separate by comma )", name: "email", }),
    number: helper.Input({ label: "Phone Number", name: "number" }),  
    warning: helper.Warning({ label: "Warning", message: "If you are updating a NEW meter number, please use the 'Change Meter Number' button."})
  }
};

module.exports = async (data) => {
  const id = parseInt(data.id) || 0;
  const consumer = await db("water_consumers").where("id",id).first();
  if(!consumer)
    throw new Error(`Cannot find consumer id ${id}`);
  
  inputs.initialValues = {
    unit_code: consumer.unit_code,
    name: consumer.name,
    number: consumer.number,
    email: consumer.email,
    consumer_id: consumer.id,
  };
  inputs.title = `Update Consumer`;
  return inputs;
};