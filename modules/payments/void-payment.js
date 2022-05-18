const { db } = require('../../helpers/init');
const getConsumerLatestNumbers = require('../../helpers/water/getConsumerLatestNumbers');
const updateConsumerLatestNumbers = require('../../helpers/water/updateConsumerLatestNumbers');
const yup = require('yup');

const form = yup.object({
  id: yup.number().required().positive(),
  void_reasons: yup.string().required()
}).noUnknown();

module.exports = async (data) => {
  const { id } = data.credentials;
  data = await form.validate(data);
  const payment = await db("water_payments").where("id",data.id).first();
  
  if(!payment)
    throw new Error(`Cannot find payment id ${data.id}`);

  await db.transaction(async trx=>{
    await trx("water_payments").update({
      voided_on: db.fn.now(),
      voided_by: id,
      void_notes: data.void_reasons
    }).where("id",payment.id);

    const numbers = await getConsumerLatestNumbers(payment.consumer_id,trx);
    await updateConsumerLatestNumbers(payment.consumer_id, numbers.overall_due, numbers.total_payment_received, trx);
    await trx("gcash_requests").where("payment_id",payment.id).update("or_number",null);
    return await trx.commit();
  });
  
  return { successMessage: `Water payment has been voided successfully` };
};