const { db } = require('../../helpers/init');
const yup = require('yup');

const form = yup.object({
  id: yup.number().required().positive(),
  void_notes: yup.string().required()
}).noUnknown();

module.exports = async (data) => {
  const { id } = data.credentials;
  data = await form.validate(data);
  const bill = await db("water_utility_bills").where("id",data.id).first();
  if(!bill)
    throw new Error(`Cannot find bill`);

  await db("water_utility_bills").update({
    voided_on: db.fn.now(),
    voided_by: id,
    void_notes: data.void_notes
  }).where("id",bill.id);
  
  return { successMessage: `Utility Bill has been voided successfully` };
};