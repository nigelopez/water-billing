const { db, myForEach } = require('../../helpers/init');
const moment = require('moment');
const yup = require('yup');
const form = yup.object({
	rows: yup.array().min(1).required()
}).noUnknown();

module.exports = async (data) => {
	const { id } = data.credentials;
	data = await form.validate(data);
	let total = 0;
	await db.transaction(async trx=>{
		const intercept = Number((await trx("water_settings").where("name","readings_intercept_value").first())?.value || 0);
		
		const func = async (r) => {
			
			const reading = await trx("uploads_readings").where("id",r).first().whereNotNull("result").whereNull("active_readings_id").where(x=>{
				x.whereNull("error");
				x.orWhereNotNull("reviewed_by");
			});

			if(!reading)
				return;

			try{
				const consumer = await trx("water_consumers").where("id",reading.consumer_id).first();
				const decimals = consumer.reader_decimals || 1;

				const new_reading_date = moment(reading.reading_date);
				const latest_reading = await trx("water_readings").where("consumer_id",reading.consumer_id).orderBy("date","desc").first();
				
				if(latest_reading){
					const latest = moment(latest_reading.date);
					
					if(latest >= new_reading_date)
						throw new Error(`Last reading of ${reading.unit_code} was on "${latest.format("MMMM DD, YYYY")}" and you are adding "${new_reading_date.format("MMMM DD, YYYY")}", it must be later than the last reading date.`);
					
					const last_reading = latest_reading.value;
					// if(last_reading > reading.result)
					// 	throw new Error(`Invalid Reading Value! It must be greater than or equal to the last reading which is ${last_reading} cu.m`);
					
					// intercept it here
					let consumption = Number((reading.result - last_reading).toFixed(decimals));
					if(last_reading && consumption < 0)
						throw new Error(`Manual Review Required - possible consumption: ${consumption} cbm `);

					if(!reading.reviewed_by && (intercept > 0 && consumption > intercept)){
						throw new Error(`Manual Review Required - possible consumption: ${consumption} cbm `);
					}
					// end of interception
				}
				const insert = {
					date: new_reading_date.format("YYYY-MM-DD"),
					consumer_id: reading.consumer_id,
					unit_code: reading.unit_code,
					value: reading.result,
					added_by: id
				};
				const insert_id = (await trx("water_readings").insert(insert))[0];
				await trx("uploads_readings").update({
					active_readings_id: insert_id
				}).where("id",reading.id);
				total++;
			}catch(e){
				await trx("uploads_readings").update({
					error: e.message
				}).where("id",reading.id);
			}
		}
		await myForEach(data.rows,func);
	});
	
	if(total < 1)
		return { successMessage: "No readings moved" };

	return { successMessage: `Successfully moved ${total} reading${total > 1 ?'s':''}` };
}