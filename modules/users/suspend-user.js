const { db } = require('../../helpers/init');
const moment = require('moment');
const yup = require('yup');

const form = yup.object({
  id: yup.number().required().positive(),
}).noUnknown();

module.exports = async (data) => {
  const { id } = data.credentials;
  data = await form.validate(data);
  await db.transaction(async trx=>{
    const user = await trx("users").where("id",data.id).first();
    if(!user)
      throw new Error(`Cannot find user id # ${data.id}`);
    await trx("users").update({ status: 0 }).where("id",user.id);
    return;
  });
  return { successMessage: `User has been suspended successfully` };
};