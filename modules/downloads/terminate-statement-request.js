const { db, string } = require('../../helpers/init');
const fs = require('fs');
const yup = require('yup');
const form = yup.object({
  id: yup.number().required()
}).noUnknown();
const kill  = require('tree-kill');

module.exports = async (data) => {
  const { id } = data.credentials;
  data = await form.validate(data);
  const request = await db("downloads_statements").where("id",data.id).first();
  if(!request)
    throw new Error(`Cannot find request id ${data.id}`);
  if(request.ended_on)
    throw new Error(`This request has been ended already`);
  if(!request.pid)
    throw new Error(`Cannot find PID of this request. No process to terminate`);
  await new Promise((resolve, reject) =>{
    kill(request.pid,(err)=>{
      if(err)
        return reject(err);
      resolve();
    });
  })
  const update = {
    ended_on: db.fn.now(),
    pid: 0
  };

  await db("downloads_statements").update(update).where("id",request.id);
  return { successMessage: `Successfully terminated the request.` };
};