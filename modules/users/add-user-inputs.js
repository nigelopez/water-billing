const { db } = require('../../helpers/init');
const helper = require('../../helpers/input-helpers');
const string = require('../../helpers/string');
const moment = require('moment');
const inputs = {
  submitUrl: 'users/add-user',
  submittingText: "Please wait",
  submitButtonText: 'Suspend User',
  submitButtonColor: 'success',
  cancelButtonColor: 'secondary',
  cancelButtonText: 'Cancel',
  type: "object",
  properties: {
    username: helper.Input({ label: "Username", name: "username", required: true }),
    first_name: helper.Input({ label: "First Name", name: "first_name", required: true }),
    last_name: helper.Input({ label: "Last Name", name: "last_name", required: true }),
    password: helper.Input({ label: "Password", name: "password", required: true }),
  }
};

module.exports = async (data) => {
  inputs.initialValues = {
    password: 'ChangeMe'
  }
  inputs.title = `Add New User`;
  return inputs;
};