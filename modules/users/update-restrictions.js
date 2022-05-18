const { db } = require('../../helpers/init');
const defaultRestrictions = require('../../helpers/defaultRestrictions');
const getModulesByName = require('../../helpers/getModulesByName');

const moment = require('moment');
const yup = require('yup');

const form = yup.object({
  id: yup.number().required().positive(),
  selectedRows: yup.object().required(),
}).noUnknown();

module.exports = async (data) => {
  const { id } = data.credentials;
  data = await form.validate(data);
  return await db.transaction(async trx=>{
    const inserts = [];
    const allModules = await getModulesByName(trx);
    Object.values(data.selectedRows).map(r=>{
      inserts.push({
        user_id: data.id,
        type: r.type,
        name: r.value,
        added_by: id
      });
      // if(allModules[r.value]){
        allModules[r.value]?.map(m=>{
          inserts.push({
            user_id: data.id,
            type: 'module',
            name: m,
            added_by: id
          });
        })
      // }
    });
    if(inserts.length < 1)
      throw new Error("No restrictions selected!");
    defaultRestrictions.map(d=>{
      inserts.push({ user_id: data.id, ...d, added_by: id });
    });
    
    await trx("user_restrictions").del().where("user_id",data.id);
    await trx("user_restrictions").insert(inserts);
    return { successMessage: `Successfully inserted ${inserts.length} restrictions` };
  });
};