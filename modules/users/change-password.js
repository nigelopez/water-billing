const { db } = require('../../helpers/init');
const moment = require('moment');
const yup = require('yup');
const credentials = require('../../helpers/credentials');

const form = yup.object({
  password: yup.string().required().min(6).max(20),
  password_confirmation: yup.string().required().min(6).max(20),
}).noUnknown();

module.exports = async (data) => {
  const { id } = data.credentials;
  data = await form.validate(data);
  if(data.password !== data.password_confirmation)
    throw new Error(`Confirmation password did not match!`);
  await db.transaction(async trx=>{
    const user = await trx("users").where("id",id).first();
    if(!user)
      throw new Error(`Cannot find user id # ${id}`);
    const update = {
      change_password: 0,
      password: credentials.encrypt_password(data.password)
    }
    await trx("users").update(update).where("id",user.id);
    return;
  });
  return { successMessage: `Password has been updated successfully`, removeFirstModal: true };
};