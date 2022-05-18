const { db } = require('../../helpers/init');
const helper = require('../../helpers/input-helpers');

const inputs = {
  submitUrl: 'settings/settings-update',
  submittingText: "Please wait",
  submitButtonText: 'Update Settings',
  submitButtonColor: 'primary',
  cancelButtonColor: 'secondary',
  cancelButtonText: 'Cancel',
  // showValues: true,
  type: "object",
  properties: {
    description: helper.Input({ label: "Description", name: "description", disabled: true }),
    value: helper.Input({ label: "Value", name: "value", required: true, }),
    image: helper.Image({
      name: "image", label: "Upload Image", postUrl: "upload/readings", accept: '.png, .jpg, .gif',
      showOnlyWhen: { field: 'name', is: 'equal', compareValue: 'header_logo'},
    })
  }
};

module.exports = async (data) => {
  const id = parseInt(data.id) || 0;
  const settings = await db("water_settings").where("id",id).first();
  if(!settings)
    throw new Error(`Cannot find settings!`);

  if(settings.name === 'header_logo'){
    delete inputs.properties.value;
    delete settings.value;
    inputs.submitUrl = 'settings/update-logo';
  }else if(settings.name === 'notifications_message'){
    inputs.properties.value = helper.TextArea({ name: 'value', label: 'Body of the Email Notification', rows: 15 });
  }

  if(settings.type == 'number' && settings.name !== 'header_logo_margin_top' && settings.name !== 'additional_days_for_due_date'){
    inputs.properties.value.props.inputProps.type = 'number';
    inputs.properties.value.props.inputGroup = {
      addonType: 'prepend',
      text: (settings.name == 'minimum_consumption' || settings.name == 'readings_intercept_value')
      ? 'Cubic Meters'
      : process.env.CURRENCY || 'PHP'
    }
  }else if(settings.type == 'percentage'){
    inputs.properties.value.props.inputProps.type = 'number';
    inputs.properties.value.props.inputGroup = {
      addonType: 'append',
      text: '%'
    }
  }

  // if(settings.name.indexOf('fixed_charges') > -1){
    
  // }
  if(settings.name == 'bill_zero_consumptions'){
    inputs.properties.value = helper.Select({
      name: 'value',
      label: "Select option",
      required: true,
      options: [
        { value: '', text: 'Please select'},
        { value: 'yes', text: 'Yes'},
        { value: 'no', text: 'No'},
      ]
    });
  }

  inputs.title = `Update Settings`;
  inputs.initialValues = settings;
  return inputs;
};