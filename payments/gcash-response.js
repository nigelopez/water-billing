const { db } = require("../helpers/init");
const gcash = require('../helpers/gcash');
const getConsumerLatestNumbers = require('../helpers/water/getConsumerLatestNumbers');
const updateConsumerLatestNumbers = require('../helpers/water/updateConsumerLatestNumbers');
const yup = require('yup');
const moment = require('moment');
const form = yup.object({
	success: yup.number().required(),
	customername: yup.string(),
	customeremail: yup.string(),
	customermobile: yup.string(),
	request_id: yup.string().required(),
	amount: yup.number().required(),
	reference: yup.string(),
	response_message: yup.string(),
	response_advise: yup.string(),
	timestamp: yup.string()
}).noUnknown();

module.exports = async (data, req, res) => {
	data = await form.validate(data);
	data.timestamp = data.timestamp.split("+")[0].trim();

	await db.transaction(async trx=>{
		const request = await trx("gcash_requests").where("request_id",data.request_id).first();
		if(!request){
			throw new Error(`Cannot find request_id ${data.request_id}`);
		}
		data.timestamp = moment(data.timestamp);
		if(!data.timestamp.isValid())
			data.timestamp = moment();

		data.timestamp = data.timestamp.format("YYYY-MM-DD HH:mm:ss");

		const update = {
			timestamp: data.timestamp,
			response_advise: data.response_advise,
			response_message: data.response_message,
			reference: data.reference,
			amount_paid: data.amount,
			customer_name: data.customername,
			customer_phone: data.customermobile,
			customer_email: data.customeremail,
			status: data.success === 1 ? 'paid':'failed',
		};
		try{
			if(data.success === 1){
				const insert = {
					receipt_date: moment().format('YYYY-MM-DD'),
					consumer_id: request.consumer_id,
					unit_code: request.unit_code,
					or_number: data.reference,
					amount: request.amount,
					type: 'ONLINE',
					added_by: 0
				};
				if(insert.type == "ONLINE"){
					insert.reference_number = data.reference;
					insert.bank_name = "GCASH";
				}
				const payment_id = (await db("water_payments").insert(insert))[0];
				
				const numbers = await getConsumerLatestNumbers(request.consumer_id);
				await updateConsumerLatestNumbers(request.consumer_id, numbers.overall_due, numbers.total_payment_received);
				update.payment_id = payment_id;
			}
		}catch(e){
			console.log(e);
		};
		await trx('gcash_requests').update(update).where('id',request.id);
		return;
	});
	return { successMessage: `Successfully updated gcash transaction` };
	// data = await form.validate(data);
	// const link = await gcash.generateCheckoutUrl(data.id, data.hash);
	// res.redirect(link);
	// return { piped: true };
}