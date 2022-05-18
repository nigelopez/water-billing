const gcash = require('../helpers/gcash');
const yup = require('yup');

const form = yup.object({
	id: yup.number().positive().required(),
	hash: yup.string().required().length(32)
}).noUnknown();

module.exports = async (data, req, res) => {
	data = await form.validate(data);
	const link = await gcash.generateCheckoutUrl(data.id, data.hash);
	res.redirect(link);
	return { piped: true };
}