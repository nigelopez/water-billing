const { db, string } = require('../../helpers/init');
const getConsumerLatestNumbers = require('../../helpers/water/getConsumerLatestNumbers');
const updateConsumerLatestNumbers = require('../../helpers/water/updateConsumerLatestNumbers');
const types = require('./payment-types').map(t=>t.value);
const yup = require('yup');

const form = yup.object({
  id: yup.number().required().positive(),
  or_number: yup.number().required().positive()
}).noUnknown();

module.exports = async (data) => {
  data.consumer_id = data.consumer_id?.value;
  
  const { id } = data.credentials;
  
  data = await form.validate(data);

  await db.transaction(async trx=>{
    const gcash = await trx("gcash_requests").where("id",data.id).first();
    if(!gcash)
      throw new Error(`Could not find gcash request id ${data.id}`);
    const payment = await trx("water_payments").where("or_number",data.or_number).whereNull("voided_on").first();
    if(payment)
      throw new Error(`OR # ${data.or_number} is already added. You cannot use this OR # to another transaction.`);
      
    await trx("gcash_requests").update("or_number",data.or_number).where("id",gcash.id);
    await trx("water_payments").update("or_number",data.or_number).where("id",gcash.payment_id).update("added_by",id);

  });

  return { successMessage: `Official Receipt # for Gcash Transaction has been assigned successfully` };
};