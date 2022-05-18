const { db, string } = require('../../helpers/init');
const getConsumerLatestNumbers = require('../../helpers/water/getConsumerLatestNumbers');
const updateConsumerLatestNumbers = require('../../helpers/water/updateConsumerLatestNumbers');
const yup = require('yup');
const { forEach } = require('async-foreach');

const form = yup.object({
  date: yup.string().required().length(10),
  void_reasons: yup.string().required()
}).noUnknown();

module.exports = async (data) => {
  const { id } = data.credentials;
  data = await form.validate(data);
  let date = string.validateDate(data.date).format('YYYY-MM-DD');
  let voided = 0;
  await db.transaction(async trx=>{
    let bills = await trx("water_statements").where("bill_date",date).whereNull("voided_on");
    await new Promise((resolve,reject)=>{
      let rejected = false;
      forEach(bills, async function(b){
        if(rejected) return;
        const done = this.async();
        try{
          const numbers = await getConsumerLatestNumbers(b.consumer_id, trx);
          numbers.overall_due -= b.current_amount_due + b.total_interest;
          numbers.overall_due = Number(numbers.overall_due.toFixed(2));

          await trx("water_statements").update({
            voided_on: trx.fn.now(),
            voided_by: id,
            void_reasons: data.void_reasons
          }).where("id",b.id);

          await trx("water_consumers").update({
            overall_receivables: numbers.overall_due,
            overall_payments: numbers.total_payment_received,
            current_balance: numbers.overall_due + -Math.abs(numbers.total_payment_received),
            last_update: trx.fn.now()
          }).where('id',b.consumer_id);
          voided++;
        }catch(e){
          rejected = true;
          reject(e);
        }
        done();
      },resolve);
    });
  });
  
  return { successMessage: `${voided} water statements has been voided successfully` };
};