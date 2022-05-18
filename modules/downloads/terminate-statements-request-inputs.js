const { db, string } = require('../../helpers/init');
const helper = require('../../helpers/input-helpers');
const moment = require('moment');
const ps = require('ps-node');
const inputs = {
  submitUrl: 'downloads/terminate-statement-request',
  submittingText: "Please wait",
  submitButtonText: 'Terminate Request',
  submitButtonColor: 'danger',
  cancelButtonColor: 'secondary',
  cancelButtonText: 'Cancel',
  type: "object",
  properties: {
    bill_date: helper.Input({ label: "Bill Date", name: "bill_date", disabled: true }),
    warning: helper.Warning({ message: `This action cannot be reverted` })
  }
};

module.exports = async (data) => {
  inputs.title = `Terminate Request`;
  const request = await db("downloads_statements").where("id",data.id).first();
  if(!request)
    throw new Error(`Cannot find request id ${data.id}`);
  if(request.ended_on)
    throw new Error(`This request has been ended already`);
  if(!request.pid)
    throw new Error(`Cannot find PID of this request. No process to terminate`);
  
  const running = await new Promise((resolve,reject)=>{
    ps.lookup({ pid: request.pid },(err,list)=>{
        if(err)
            return resolve(false);
        return resolve(list.length > 0);
    });
  });
  if(!running)
    throw new Error(`This process is not running anymore`);
  
  inputs.initialValues = {
    id: data.id,
    bill_date: moment(request.bill_date).format("MMMM DD, YYYY")
  }
  return inputs;
};