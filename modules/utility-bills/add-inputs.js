const { db, get } = require('../../helpers/init');
const helper = require('../../helpers/input-helpers');
const moment = require('moment');

const inputs = {
  submitUrl: 'utility-bills/add',
  // showValues: true,
  submittingText: "Please wait",
  submitButtonText: 'Save Bill',
  submitButtonColor: 'primary',
  cancelButtonColor: 'secondary',
  cancelButtonText: 'Cancel',
  type: "object",
  properties: {
    date: helper.DatePicker({ type: "string", label: "Month & Year of this Bill", name: "date", selectedDate: moment().format('YYYY-MM-DD'), maxDate: moment().endOf('month').format("YYYY-MM-DD"), showMonthYearPicker: true, dateDisplay: 'MMMM yyyy' }),
    type: helper.Select({ label: "Select Type of Bill", name: "type", options: [], required: true }),
    water_consumption: helper.Input({ 
      label: "Total Water Consumption", name: "water_consumption", inputType: 'number', step: 1, required: true,
      showOnlyWhen: { field: 'type', is: 'equal', compareValue: 'water'},
      inputGroup: { addonType: 'prepend', text: 'Cubic Meter', inputGroupStyle: { width: '100px' } }
    }),
    water_fee: helper.Input({ 
      label: "Water Fee", name: "water_fee", inputType: 'number', step: 0.01, required: true,
      showOnlyWhen: { field: 'type', is: 'equal', compareValue: 'water'},
      inputGroup: { addonType: 'prepend', text: process.env.CURRENCY, inputGroupStyle: { width: '100px' } }
    }),
    current_bill: helper.Input({ 
      label: "Gross Current Bill (do not include previous balance)", name: "current_bill", inputType: 'number', step: 0.01, required: true,
      inputGroup: { addonType: 'prepend', text: process.env.CURRENCY, inputGroupStyle: { width: '100px' } }
    }),
    image: helper.Image({ label: "Upload Scanned Copy of this Bill", postUrl: "upload/utility-bill" })
  }
};

module.exports = async (data) => {
  inputs.title = `Add New Settings`;
  const types = await get.utility_bills_types();
  let electricOnly = false;
  types.map(t=>{
    if(t.value == 'electric' && types.length == 2)
      electricOnly = true;
  });
  if(electricOnly)
    delete inputs.properties.water_consumption.props.showOnlyWhen;
  inputs.properties.type.props.options = types;
  inputs.initialValues = {
    date: moment().format("YYYY-MM-DD")
  }
  return inputs;
};