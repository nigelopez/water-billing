const { db, string } = require('../../helpers/init');
const yup = require('yup');
const { forEach } = require('async-foreach');
const validator = require("email-validator");
const form = yup.object({
  date: yup.string().length(10).required(),
  type: yup.string().oneOf(['select','all']),
  consumer_ids: yup.array()
}).noUnknown();
module.exports = async (data) => {
  const { id } = data.credentials;
  data = await form.validate(data);
  const date = string.validateDate(data.date);
  const inserts = [];
  return await db.transaction(async trx=>{
    let consumers = trx("water_consumers").select('id','unit_code','name','email').whereNotNull('email')
    if(data.type == 'select'){
      if(!data.consumer_ids?.length)
        throw new Error(`Please select at least one consumer`);
      consumers.whereIn("id",data.consumer_ids.map(c=>c.value));
    }else if(data.type == 'all'){
  
    }else
      throw new Error(`Invalid type!`);

    consumers = await consumers;
    await new Promise((resolve, reject) =>{
      let rejected = false;
      let bill_date = date.format('YYYY-MM-DD');
      forEach(consumers, async function(c){
        if(rejected) return;
        const done = this.async();
        try{
          const emails = c.email?.split(",");
          const statement = await trx("water_statements").where("bill_date",bill_date).where('consumer_id',c.id).whereNull('voided_on').first();
          emails.map(email=>{
            const ins = {
              consumer_id: c.id,
              consumer_name: c.name,
              unit_code: c.unit_code,
              statement_id: statement?.id || 0,
              bill_number: statement?.bill_number || 'N/A',
              bill_date,
              status: 0,
              requested_by: id,
              email
            }
            if(!validator.validate(email)){
              ins.status = -1;
              ins.processed_on = trx.fn.now();
              ins.message = `Invalid email address`;
            }else if(!statement){
              ins.status = -1;
              ins.processed_on = trx.fn.now();
              ins.message = `No statement found for ${bill_date}`;
            }
            inserts.push(ins);
          })
        }catch(e){
          console.log(e);
          reject(e);
          rejected = true;
        }
        done();
      },resolve);
    });
    await trx("water_notifications").insert(inserts);
    return { successMessage: `Your request for notifications has been successfully saved. It will be processed as soon as possible` };
  })
};