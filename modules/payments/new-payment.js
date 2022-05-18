const { db, string } = require('../../helpers/init');
const getConsumerLatestNumbers = require('../../helpers/water/getConsumerLatestNumbers');
const updateConsumerLatestNumbers = require('../../helpers/water/updateConsumerLatestNumbers');
const types = require('./payment-types').map(t=>t.value);
const yup = require('yup');

const form = yup.object({
  receipt_date: yup.string().required().length(10),
  or_number: yup.number().required().positive(),
  consumer_id: yup.number().required('consumer is required').positive(),
  amount: yup.number().required().min(0.01),
  type: yup.string().required(),
  bank_name: yup.string().nullable(),
  check_number: yup.string().nullable(),
  reference_number: yup.string().nullable(),
  notes: yup.string().nullable()
}).noUnknown();

module.exports = async (data) => {
  data.consumer_id = data.consumer_id?.value;
  
  const { id } = data.credentials;
  
  data = await form.validate(data);

  if(types.indexOf(data.type) < 0)
    throw new Error(`Invalid type!`);

  let receipt_date = string.validateDate(data.receipt_date);

  await db.transaction(async trx=>{
    const consumer = await trx("water_consumers").where("id",data.consumer_id).first();
    if(!consumer)
      throw new Error(`Consumer not found!`);
    
    const found = await trx("water_payments").whereNull("voided_on").where("or_number",data.or_number).first();
    if(found)
      throw new Error(`OR # ${data.or_number} is already added. If you really need to add this, you need to void the old payment first`);;

    receipt_date = receipt_date.format('YYYY-MM-DD');
    
    const insert = {
      receipt_date,
      consumer_id: consumer.id,
      unit_code: consumer.unit_code,
      or_number: Number(data.or_number),
      amount: Number(data.amount.toFixed(2)),
      notes: data.notes,
      type: data.type.toUpperCase(),
      added_by: id
    };
    if(insert.type == "CHECK"){
      insert.check_number = data.check_number;
      insert.bank_name = data.bank_name;
    }else if(insert.type == "ONLINE"){
      insert.reference_number = data.reference_number;
      insert.bank_name = data.bank_name;
    }
    await trx("water_payments").insert(insert);
    const numbers = await getConsumerLatestNumbers(consumer.id,trx);
    await updateConsumerLatestNumbers(consumer.id, numbers.overall_due, numbers.total_payment_received, trx);
    return;
  });

  return { successMessage: `New payment has been successfully added!` };
};