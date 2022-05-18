const { db, string } = require('../../helpers/init');
const helper = require('../../helpers/input-helpers');
const moment = require('moment');

const inputs = {
  submitUrl: 'consumers/change-meter',
  submittingText: "Please wait",
  submitButtonText: 'Change Meter',
  submitButtonColor: 'success',
  cancelButtonColor: 'secondary',
  cancelButtonText: 'Cancel',
  type: "object",
  properties: {
    unit_code: helper.Input({ label: "Unit Code", name: "unit_code", disabled: true }),
    name: helper.Input({ label: "Consumer Name", name: "name", disabled: true }),
    meter_number: helper.Input({ label: "Current Meter Number", name: "meter_number", disabled: true }),
    last_reading_of_old_meter: helper.Input({ label: "Last Reading of Old Meter", name: "last_reading_of_old_meter", inputGroup: { addonType: 'prepend', text: 'Cu.M' }, required: true, inputType:'number', step: 0.1 }),
    new_meter_number: helper.Input({ label: "New Meter Number", name: "new_meter_number", required: true }),
    current_reading_of_new_meter: helper.Input({ label: "Current Reading of New Meter", name: "current_reading_of_new_meter", inputGroup: { addonType: 'prepend', text: 'Cu.M' }, required: true, inputType:'number', step: 0.1 }),
  }
};

module.exports = async (data) => {
  const id = parseInt(data.id) || 0;
  const consumer = await db("water_consumers").where("id",id).first();
  if(!consumer)
    throw new Error(`Cannot find consumer id ${id}`);
  const reading = await db("water_readings").where("consumer_id",consumer.id).orderBy("date","desc").first();
  inputs.initialValues = {
    unit_code: consumer.unit_code,
    name: consumer.name,
    consumer_id: consumer.id,
    meter_number: consumer.meter_number || 'N/A',
    last_reading_of_old_meter: reading?.value || 0,
    current_reading_of_new_meter: 0
  };
  inputs.title = `Change Water Meter`;
  return inputs;
};