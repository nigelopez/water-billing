const { db } = require('../../helpers/init');
const yup = require('yup');

const form = yup.object({
	id: yup.number().required(),
	result: yup.number().required().positive()
}).noUnknown();

module.exports = async (data) => {
	const { id } = data.credentials;
	data = await form.validate(data);
	await db.transaction(async trx=>{
		const reading = await trx("uploads_readings").where("id",data.id).first();
		if(!reading)
			throw new Error(`Cannot find uploaded reading id # ${data.id}`);
		const update = {
			reviewed_by: id,
			reviewed_on: db.fn.now(),
			result: data.result
		};
		await trx("uploads_readings").where("id",reading.id).update(update);
	});
	
	return { successMessage: `Successfully marked the reading as reviewed.` };
}