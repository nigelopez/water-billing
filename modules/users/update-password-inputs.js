const { db } = require('../../helpers/init');
const helper = require('../../helpers/input-helpers');
const string = require('../../helpers/string');
const moment = require('moment');
const inputs = {
  submitUrl: 'users/update-password',
  submittingText: "Please wait",
  submitButtonText: 'Update Password',
  submitButtonColor: 'success',
  cancelButtonColor: 'secondary',
  cancelButtonText: 'Cancel',
  type: "object",
  properties: {
    username: helper.Input({ label: "Username", name: "username", disabled: true }),
    password: helper.Input({ label: "New Password", name: "password", required: true }),
  }
};

module.exports = async (data) => {
  const id = Number(data.id) || 0;
  const user = await db("users").where("id",id).first();
  if(!user)
    throw new Error(`User id ${id} not found!`);
  inputs.initialValues = {
    id: user.id,
    username: user.username,
    password: 'ChangeMe'
  }
  inputs.title = `Change Passwod`;
  return inputs;
};