const { db, string } = require('../../helpers/init');
const helper = require('../../helpers/input-helpers');
const moment = require('moment');

const inputs = {
  submitUrl: 'readings/delete-reading',
  submittingText: "Please wait",
  submitButtonText: 'Delete Reading',
  submitButtonColor: 'danger',
  cancelButtonColor: 'secondary',
  cancelButtonText: 'Cancel',
  type: "object",
  properties: {
    unit_code: helper.Input({ label: "Unit Code", name: "unit_code", disabled: true }),
    date: helper.Input({ label: "Reading Date", name: "date", disabled: true }),  
    reading: helper.Input({ label: "Reading Value", name: "value", disabled: true, inputGroup: { addonType: 'prepend', text: 'cu.m' } }),
    reason: helper.Input({ label: "Reason for deleting", name: "reason", required: true }),
    warning: helper.Warning({ message: `This action cannot be reverted` })
  }
};

module.exports = async (data) => {
  const id = parseInt(data.id) || 0;
  const reading = await db("water_readings").where("id",id).first();
  if(!reading)
    throw new Error(`Reading not found`);
  const last_statement = await db("water_statements").where("consumer_id",reading.consumer_id).orderBy("period_to","desc").whereNull("voided_on").first();
  if(last_statement){
    const latest = moment(last_statement.period_to);
    const reading_date = moment(reading.date);
    if(latest >= reading_date)
      throw new Error(`You cannot delete this reading value because the latest bill date of this consumer is ${latest.format("MMMM DD, YYYY")} and the date of this reading is ${reading_date.format("MMMM DD, YYYY")}. A reading must not be older from the latest bill of the consumer before you can delete.`)
  }
  reading.date = moment(reading.date).format("MMMM DD, YYYY");
  inputs.initialValues = reading;
  inputs.title = `Delete Reading`;
  return inputs;
};