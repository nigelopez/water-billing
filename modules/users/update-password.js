const { db } = require('../../helpers/init');
const moment = require('moment');
const yup = require('yup');
const credentials = require('../../helpers/credentials');

const form = yup.object({
  id: yup.number().required().positive(),
  password: yup.string().required().min(6).max(20),
}).noUnknown();

module.exports = async (data) => {
  const { id } = data.credentials;
  data = await form.validate(data);
  await db.transaction(async trx=>{
    const user = await trx("users").where("id",data.id).first();
    if(!user)
      throw new Error(`Cannot find user id # ${data.id}`);
    const update = {
      change_password: 1,
      password: credentials.encrypt_password(data.password)
    }
    await trx("users").update(update).where("id",user.id);
    return;
  });
  return { successMessage: `Password has been updated successfully` };
};