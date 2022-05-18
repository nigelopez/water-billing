const { db } = require('../../helpers/init');
const yup = require('yup');
const water = require('../../pdf/water/generate_statement_by_id');
const form = yup.object({
  id: yup.number().positive().required(),
}).noUnknown();

module.exports = async (data,request,response) => {
  data = await form.validate(data);
  await water.create(data.id,response);
};