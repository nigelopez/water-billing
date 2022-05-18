const { db } = require('../../helpers/init');
const helper = require('../../helpers/input-helpers');
const string = require('../../helpers/string');
const moment = require('moment');
const inputs = {
  submitUrl: 'users/change-password',
  submittingText: "Please wait",
  submitButtonText: 'Update Password',
  submitButtonColor: 'success',
  cancelButtonColor: 'secondary',
  cancelButtonText: 'Cancel',
  type: "object",
  properties: {
    password: helper.Input({ label: "New Password", name: "password", required: true, inputType: 'password' }),
    password_confirmation: helper.Input({ label: "Confirm Password", name: "password_confirmation", required: true, inputType: 'password' }),
  }
};

module.exports = async (data) => {
  const id = Number(data.credentials.id) || 0;
  const user = await db("users").where("id",id).first();
  if(!user)
    throw new Error(`User id ${id} not found!`);
  inputs.initialValues = {
    id: user.id,
  }
  inputs.title = `Change Passwod`;
  return inputs;
};