const { db } = require('../../helpers/init');
const helper = require('../../helpers/input-helpers');
const string = require('../../helpers/string');
const moment = require('moment');
const inputs = {
  submitUrl: 'users/suspend-user',
  submittingText: "Please wait",
  submitButtonText: 'Suspend User',
  submitButtonColor: 'danger',
  cancelButtonColor: 'secondary',
  cancelButtonText: 'Cancel',
  type: "object",
  properties: {
    username: helper.Input({ label: "Username", name: "username", disabled: true }),
    first_name: helper.Input({ label: "First Name", name: "first_name", disabled: true }),
    last_name: helper.Input({ label: "Last Name", name: "last_name", disabled: true }),
  }
};

module.exports = async (data) => {
  const id = Number(data.id) || 0;
  const user = await db("users").where("id",id).first().select("username","id","first_name","last_name");
  if(!user)
    throw new Error(`Cannot find user id ${id}`);
  if(user.status == 0)
    throw new Error(`This user was already suspended`);
  inputs.initialValues = user
  inputs.title = `Suspend User`;
  return inputs;
};