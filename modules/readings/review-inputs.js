const { db } = require('../../helpers/init');
const helper = require('../../helpers/input-helpers');
const moment = require('moment');
const IMG_URL = process.env.IMAGES_URL;
const inputs = {
  submitUrl: 'readings/review',
  submittingText: "Please wait",
  submitButtonText: 'Mark as Reviewed',
  submitButtonColor: 'primary',
  cancelButtonColor: 'secondary',
  cancelButtonText: 'Cancel',
  type: "object",
  properties: {
    unit_code: helper.Input({ label: "Unit Code", name: "unit_code", disabled: true }),
    name: helper.Input({ label: "Consumer Name", name: "name", disabled: true }),
    reading_date: helper.Input({ label: "Reading Date", name: "reading_date", disabled: true }),
    snapshot: helper.ImageDisplay({ 
      label: "Reading Snapshot", 
      url: "", 
      style: { 
        border: '1px solid #878787',
        width: '100%',
        boxShadow: "1px 1px #888888",
        borderRadius: "5px"
      },
    }),
    message: helper.Warning({ label: "Message", message: null, color: 'primary' }),
    warning: helper.Warning({ label: "Warning", message: "Reviewed readings are final, please make sure it is 100% correct.", color: 'danger' }),
    result: helper.Input({ label: "Reading Result", name: "result", required: true, inputType: "number", step: 0.001 }),
  }
};


const decimalSteps = {
  "1": 0.1,
  "2": 0.01,
  "3": 0.001,
};

module.exports = async (data) => {
  inputs.title = `Review Inputs`;
  const id = Number(data.id) || 0;
  const reading = await db("uploads_readings as r").where("r.id",id).first()
                  .join("water_consumers as c","c.id","r.consumer_id")
                  .select("r.*","c.name","c.reader_decimals");
  if(!reading)
    throw new Error(`Cannot find uploads reading id # ${data.id}`);

  const decimals = reading.reader_decimals;
  inputs.properties.result.props.inputProps.step = decimalSteps[decimals] || 1;

  inputs.properties.message.props.message = reading.error;

  let snapshot = reading.path.split("/");
  snapshot = snapshot[snapshot.length - 1];
  inputs.properties.snapshot.props.url = `${IMG_URL}/${snapshot}`;

  inputs.initialValues = {
    name: reading.name,
    id: reading.id,
    unit_code: reading.unit_code,
    reading_date: moment(reading.reading_date).format("MMMM DD, YYYY"),
    result: reading.result,
  };
  return inputs;
};