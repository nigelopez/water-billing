const { db, string } = require('../../helpers/init');
const fs = require('fs');
const yup = require('yup');
const types = ['single','with_copy'];
const { spawn } = require('child_process');
const path = require('path');
const form = yup.object({
  bill_date: yup.string().length(10).required(),
  type: yup.string().required()
}).noUnknown();

module.exports = async (data) => {
  const { id } = data.credentials;
  data = await form.validate(data);
  if(types.indexOf(data.type) < 0)
    throw new Error(`Types must only be in ${types.join(",")}`);

  let bill_date = string.validateDate(data.bill_date);
  const running = await db("downloads_statements").where("pid",">",0).first();
  if(running)
    throw new Error(`To avoid server overload, you are limited to one download request at a time. If you think it is taking too long, please terminate the pending request first.`);
  const request = {
    bill_date: bill_date.format('YYYY-MM-DD'),
    requested_by: id,
    type: data.type
  }
  const request_id = (await db("downloads_statements").insert(request))[0];
  const file = path.join(__dirname, '../../helpers/downloadStatements.js');
  
  spawn('node', [file,request_id], {
    detached: true,
    stdio: [ 'ignore' ]
  });

  return { successMessage: `Your download request has been submitted successfully. It might take few minutes if it has too many statements to generate. Please be patient`, closeModal: 3000 };
};