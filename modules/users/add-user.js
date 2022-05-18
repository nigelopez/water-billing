const { db } = require('../../helpers/init');
const moment = require('moment');
const yup = require('yup');
const credentials = require('../../helpers/credentials');
const defaultRestrictions = require('../../helpers/defaultRestrictions');
const form = yup.object({
  username: yup.string().required().min(4).max(20),
  first_name: yup.string().required(),
  last_name: yup.string().required(),
  password: yup.string().required().min(6).max(20),
}).noUnknown();

module.exports = async (data) => {
  const { id } = data.credentials;
  data = await form.validate(data);
  await db.transaction(async trx=>{
    const user = await trx("users").where("username",data.username).first();
    if(user)
      throw new Error(`Username already exists!`);
    data.password = credentials.encrypt_password(data.password);
    const insert = {
      ...data,
      created_by: id
    };
    const user_id = (await trx('users').insert(insert))[0];
    const moduleInserts = []
    defaultRestrictions.map(d=>{
      moduleInserts.push({ user_id, ...d, added_by: id });
    });
    await trx('user_restrictions').insert(moduleInserts);
  });
  return { successMessage: `New User has been added successfully` };
};