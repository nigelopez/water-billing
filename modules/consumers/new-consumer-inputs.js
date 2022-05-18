const { db, string, check } = require('../../helpers/init');
const helper = require('../../helpers/input-helpers');
const moment = require('moment');
const types = [
  { value: '', text: 'Please select a type' },
  { value: 'single', text: 'One by one' },
  { value: 'upload', text: 'Import Consumers' },
]
const inputs = {
  submitUrl: 'consumers/new-consumer',
  submittingText: "Please wait",
  submitButtonText: 'Add Consumer',
  submitButtonColor: 'success',
  cancelButtonColor: 'secondary',
  cancelButtonText: 'Cancel',
  type: "object",
  properties: {
    type: helper.Select({ label: "Select Type", name: "type", options: types, required: true }),
    download_link: null,
    image: helper.Image({
      name: "xlsx", label: "Upload Excel(.xlsx) File", postUrl: "upload/readings", accept: '.xlsx',
      showOnlyWhen: { field: 'type', is: 'equal', compareValue: 'upload'},
    }),
    unit_code: helper.Input({ 
      label: "Unit Code", name: "unit_code", required: true,
      showOnlyWhen: { field: 'type', is: 'equal', compareValue: 'single'},
    }),
    name: helper.Input({ 
      label: "Consumer Name (Last Name, First Name)", name: "name", required: true,
      showOnlyWhen: { field: 'type', is: 'equal', compareValue: 'single'},
    }),
    unit_type: helper.Input({ 
      label: "Unit Type ( optional )", name: "unit_type" ,
      showOnlyWhen: { field: 'type', is: 'equal', compareValue: 'single'},
    }),
    turnover_date: helper.DatePicker({ 
      label: "Date of Turnover ( optional )", name: "turnover_date" ,
      requrired: false,
      showOnlyWhen: { field: 'type', is: 'equal', compareValue: 'single'},
      maxDate: moment()
    }),
    email: helper.Input({ 
      label: "Email (optional)", name: "email", required: false,
      showOnlyWhen: { field: 'type', is: 'equal', compareValue: 'single'},
    }),
    number: helper.Input({ 
      label: "Phone Number (optional)", name: "number", required: false,
      showOnlyWhen: { field: 'type', is: 'equal', compareValue: 'single'},
    }),
    meter_number: helper.Input({ 
      label: "Meter Number", name: "meter_number", required: false,
      showOnlyWhen: { field: 'type', is: 'equal', compareValue: 'single'},
    }), 
    last_reading_date: helper.DatePicker({ 
      type: "string", label: "Last Reading Date", name: "last_reading_date", 
      // selectedDate: moment().format('YYYY-MM-DD'),
      maxDate: moment().format("YYYY-MM-DD"),
      dateDisplay: 'MMMM dd, yyyy',
      showOnlyWhen: { field: 'type', is: 'equal', compareValue: 'single'},
      required: true
    }),
    last_reading_value: helper.Input({ 
      label: "Last Reading Value", name: "last_reading_value", required: true, inputType: 'number', step: 0.1,
      showOnlyWhen: { field: 'type', is: 'equal', compareValue: 'single'},
    }), 
    current_balance: helper.Input({ 
      label: "Current Balance", name: "current_balance", required: true, inputType: 'number', step: 0.01,
      inputGroup: { addonType: 'prepend', text: process.env.CURRENCY || "PHP" },
      showOnlyWhen: { field: 'type', is: 'equal', compareValue: 'single'},
    }), 
  }
};

module.exports = async (data) => {
  inputs.title = `Add New Consumer`;
  inputs.properties.download_link = helper.ButtonLink({ 
    showOnlyWhen: { field: 'type', is: 'equal', compareValue: 'upload'},
    text: 'Download Template',
    aProps: { href: `${process.env.DOWNLOAD_URL || ''}/api/public-gets/download-consumer-import-template/?uuid=${data?.credentials?.uuid}`, target: '_blank' },
    buttonProps: { 
      color: 'primary',
      block: true,
      className: 'default',
      type: 'button'
    }
  });
  const turnover_required = await check.if_turnover_date_is_required();
  if(turnover_required){
    inputs.properties.turnover_date.props.inputProps.required = true;
    inputs.properties.turnover_date.props.label = "Date of Turnover"
  }
  inputs.initialValues = {
  }
  return inputs;
};