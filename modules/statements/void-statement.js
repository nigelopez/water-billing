const { db } = require('../../helpers/init');
const getConsumerLatestNumbers = require('../../helpers/water/getConsumerLatestNumbers');
const yup = require('yup');

const form = yup.object({
  id: yup.number().required().positive(),
  void_reasons: yup.string().required()
}).noUnknown();

module.exports = async (data) => {
  const { id } = data.credentials;
  data = await form.validate(data);
  const statement = await db("water_statements").where("id",data.id).first();
  if(!statement)
    throw new Error(`Cannot find statement id ${data.id}`);
  const numbers = await getConsumerLatestNumbers(statement.consumer_id);
  numbers.overall_due -= Number((statement.current_amount_due + statement.total_interest).toFixed(2));
  numbers.overall_due = Number(numbers.overall_due.toFixed(2));

  await db.transaction(async trx=>{
    await trx("water_statements").update({
      voided_on: db.fn.now(),
      voided_by: id,
      void_reasons: data.void_reasons
    }).where("id",statement.id);
    await trx("water_consumers").update({
      overall_receivables: numbers.overall_due,
      overall_payments: numbers.total_payment_received,
      current_balance: numbers.overall_due + -Math.abs(numbers.total_payment_received),
      last_update: db.fn.now()
    }).where('id',statement.consumer_id);
    await trx("water_readings").update("statement_id",0).where("consumer_id",statement.consumer_id).where("statement_id",statement.id);
    return await trx.commit();
  });
  
  return { successMessage: `Water statement has been voided successfully` };
};