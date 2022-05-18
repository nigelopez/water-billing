const { db, myForEach } = require('../../helpers/init');
const moment = require('moment');
const yup = require('yup');
const form = yup.object({
	rows: yup.array().min(1).required(),
	reason: yup.string().required(),
}).noUnknown();

module.exports = async (data) => {
	const { id } = data.credentials;
	data = await form.validate(data);
	let success = 0;
	let failed = 0;

	await db.transaction(async trx=>{
		const myFunc = async (value, index) => {
			try{
				const reading = await trx("water_readings").where("id",value).select('id','consumer_id','unit_code','meter_number','date','value').first();
				if(!reading){
					throw new Error(`Cannot find water reading id # ${data.id}`);
				}
				const last_statement = await trx("water_statements").where("consumer_id",reading.consumer_id).orderBy("period_to","desc").whereNull("voided_on").first();
				if(last_statement){
					const latest = moment(last_statement.period_to);
					const reading_date = moment(reading.date);
					if(latest >= reading_date)
					throw new Error(`You cannot delete this reading value because the latest bill date of this consumer is ${latest.format("MMMM DD, YYYY")} and the date of this reading is ${reading_date.format("MMMM DD, YYYY")}. A reading must not be older from the latest bill of the consumer before you can delete.`)
				}
				reading.reason = data.reason;
				reading.deleted_by = id;
				await trx("water_readings_deleted").insert(reading);
				await trx("water_readings").del().where("id",reading.id);
				await trx("uploads_readings").where("active_readings_id",reading.id).update({ active_readings_id: null });
				success++;
			}catch(e){
				failed++;
				console.log(e.message);
				throw new Error(e);
			}
		};

		await myForEach(data.rows,myFunc);
	});

	return { successMessage: `Successfully Deleted ${success} Reading${success > 1 ? 's':''}; Total Failed: ${failed}`, closeModal: 3000 };
}