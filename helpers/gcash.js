const { db } = require('./init');
const expand = require('expand-template')();
const axios = require('axios');
const qs = require('qs');
const md5 = require('md5');

const URL = process.env.GCASH_CONSUMER_URL;
const GCASH_POSTBACK_URL = process.env.GCASH_POSTBACK_URL;
const GCASH_RETURN_SUCCESS_URL = process.env.GCASH_RETURN_SUCCESS_URL;
const GCASH_RETURN_FAILED_URL = process.env.GCASH_RETURN_FAILED_URL;
const KEY = process.env.KEY;

const { v4 } = require('uuid');
const x = {};

const getHash = (id) => {
	return md5(`${KEY},${id}`).toLowerCase();
}

x.getGcashSettings = async (trx = db) => {
	const settings = await trx("water_settings").where("name","like","gcash_%");
	const result = {};
	settings.map(s=>{
		if(s.name == 'gcash_additional_fee')
			s.value = (Number(s.value) || 0) / 100;
		else if(s.name == 'gcash_allowed')
			s.value = s.value?.toLowerCase() === 'yes' ? true:false;
		result[s.name] = s.value;
	});
	return result;
}
x.generateCheckoutUrl = async (id, hash) => {
	// const check = getHash(id);
	// if(check !== hash)
	// 	throw new Error("Invalid url");
	
	id = Number(id);

	return await db.transaction(async trx=>{
		const settings = await x.getGcashSettings(trx);
		if(!settings['gcash_allowed'])
			throw new Error(`Gcash payment is currently not allowed`);
		if(!settings['gcash_api_key'])
			throw new Error('gcash_api_key not found in the settings');
		if(!settings['gcash_api_url'])
			settings['gcash_api_url'] = 'https://g.payx.ph/payment_request';
		const statement = await trx('water_statements').where("id",id).first();
		if(!statement)
			throw new Error(`Cannot find statement id # ${id}`);
		if(statement.voided_on)
			throw new Error(`This billing has been cancelled`);
		
		if(statement.total_amount_due <= 0)
			throw new Error(`There is nothing to pay right now`);

		const consumer = await trx('water_consumers').where("id",statement.consumer_id).first();
		if(!consumer)
			throw new Error(`Consumer not found!`)
		let email = null;
		let phone = null;
		if(consumer.email){
			email = consumer.email.split(",")[0];
		}
		if(consumer.number){
			phone = consumer.number.split(",")[0].replace("+","");
		}
		if(phone?.length === 10 && phone[0] != '0')
			phone = `0${phone}`;
		else if(phone?.length === 12 && phone[0] == '6' && phone[1] == '3')
			phone = `0${phone.replace('63',"")}`;

		const uuid = v4();
		const fee = settings['gcash_additional_fee'] || 0;
		const data = {
			'x-public-key': settings['gcash_api_key'],
			amount: statement.total_amount_due,
			description: `Statement # ${statement.bill_number}`,
			expiry: 24,
			fee: statement.total_amount_due * fee,
			customername: consumer.name,
			customermobile: phone,
			customeremail: email,
			webhooksuccessurl: GCASH_POSTBACK_URL,
			webhookfailurl: GCASH_POSTBACK_URL,
			redirectsuccessurl: GCASH_RETURN_SUCCESS_URL,
			redirectfailurl: GCASH_RETURN_FAILED_URL,
		};
		
		const config = {
			method: 'POST',
			url: settings['gcash_api_url'],
			data: qs.stringify(data),
		};
		let response = (await axios.request(config))?.data;
		if(response.success != 1 || !response.data)
			throw new Error(`There was an error generating Gcash Checkout URL`);
		response = response.data;
		const insert = {
			uuid,
			consumer_id: consumer.id,
			unit_code: consumer.unit_code,
            statement_id: statement.id,
			billing_number: statement.bill_number,
            code: response.code,
			description: response.description,
			status: response.status,
			amount: response.amount,
			fee: response.fee,
			gross_amount: response.grossamount,
            net_amount: response.netamount,
            hash: response.hash,
			expiry: response.expiry,
            date_added: response.dateadded,
            checkout_url: response.checkouturl,
			request_id: response.request_id
		};
		await trx("gcash_requests").insert(insert);
		return response.checkouturl;
	});
}

x.getConsumerUrl = (id) => {
	if(!URL)
		throw new Error("No GCASH_CONSUMER_URL found in ENV");
	return expand(URL,{ hash: getHash(id), id });
}

module.exports = x;