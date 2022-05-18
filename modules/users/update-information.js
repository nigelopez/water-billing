const { db } = require('../../helpers/init');
const moment = require('moment');
const yup = require('yup');
const credentials = require('../../helpers/credentials');

const form = yup.object({
  id: yup.number().required().positive(),
  first_name: yup.string().required(),
  last_name: yup.string().required(),
}).noUnknown();

module.exports = async (data) => {
  const { id } = data.credentials;
  data = await form.validate(data);
  await db.transaction(async trx=>{
    const user = await trx("users").where("id",data.id).first();
    if(!user)
      throw new Error(`Cannot find user id # ${data.id}`);
    const update = {
      first_name: data.first_name,
      last_name: data.last_name
    }
    await trx("users").update(update).where("id",user.id);
    return;
  });
  return { successMessage: `User details has been updated successfully` };
};