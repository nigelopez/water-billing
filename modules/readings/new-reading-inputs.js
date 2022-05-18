const { db, string } = require('../../helpers/init');
const helper = require('../../helpers/input-helpers');
const moment = require('moment');
const types = [
  { value: '', text: 'Please select a type' },
  { value: 'single', text: 'Single Reading' },
  { value: 'upload', text: 'Upload Readings' },
]
const inputs = {
  submitUrl: 'readings/new-reading',
  submittingText: "Please wait",
  submitButtonText: 'Add New Reading',
  submitButtonColor: 'success',
  cancelButtonColor: 'secondary',
  cancelButtonText: 'Cancel',
  type: "object",
  autocomplete: 'off',
  properties: {
    date: helper.DatePicker({ label: "Reading Date", name: "date", required: true, maxDate: moment() }),
    type: helper.Select({ label: "Select Type of Value", name: "type", options: types, required: true }),
    consumer_id: {
      type: "string",
      nullable: false,
      component: "ReactSelectAsync",
      props: {
        showOnlyWhen: { field: 'type', is: 'equal', compareValue: 'single'},
        name: 'consumer_id',
        label: `Select Consumer`,
        searchUrl: `search/consumer`,
        props: {
            isClearable: true
        }
      }
    },
    value: helper.Input({ 
      label: "Reading Value", name: "value", inputType: 'number', step: 0.1, required: true,
      showOnlyWhen: { field: 'type', is: 'equal', compareValue: 'single'},
    }),
    download_link: null,
    image: helper.Image({
      name: "xlsx", label: "Upload Excel(.xlsx) File", postUrl: "upload/readings", accept: '.xlsx',
      showOnlyWhen: { field: 'type', is: 'equal', compareValue: 'upload'},
    })
  }
};

module.exports = async (data) => {
  inputs.title = `Add New Reading`;
  inputs.properties.download_link = helper.ButtonLink({ 
    showOnlyWhen: { field: 'type', is: 'equal', compareValue: 'upload'},
    text: 'Download Template',
    aProps: { href: `${process.env.DOWNLOAD_URL || ''}/api/public-gets/download-reading-template/?uuid=${data?.credentials?.uuid}`, target: '_blank' },
    buttonProps: { 
      color: 'primary',
      block: true,
      className: 'default',
      type: 'button'
    }
  })
  inputs.initialValues = {
    date: moment().format("YYYY-MM-DD")
  }
  return inputs;
};