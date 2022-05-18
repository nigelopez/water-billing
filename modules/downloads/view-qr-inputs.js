const { db, get } = require('../../helpers/init');
const generateQR = require('../../helpers/generateQR');
const helper = require('../../helpers/input-helpers');
const moment = require('moment');
const ps = require('ps-node');
const inputs = {
  hideSubmit: true,
  submittingText: "Please wait",
  submitButtonText: '',
  submitButtonColor: 'danger',
  cancelButtonColor: 'secondary',
  cancelButtonText: 'Cancel',
  type: "object",
  properties: {
    qr: helper.ImageDisplay({ 
      label: `QR Code`,
      style: {
        width: '100%'
      }
    })
  }
};

module.exports = async (data) => {
  const consumer = await get.consumer(data.id);
  inputs.title = `View QR - ${consumer.unit_code}`;
  let buffer = await generateQR(consumer.unit_code,500);
  inputs.properties.qr.props.url = buffer;
  return inputs;
};