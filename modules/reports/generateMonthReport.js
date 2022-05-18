const moment= require('moment');
module.exports = async (trx, month, year) => {
	const generated = Number((await trx("water_utility_bills").where("year",year).where("month",month).first())?.water_consumption || 0);
	const expenses = Number((await trx("water_utility_bills").where("year",year).where("month",month).sum("current_bill as expenses").first())?.expenses || 0);
	const from = moment().set('month',month - 1).set('year',year).startOf("month").format('YYYY-MM-DD HH:mm:ss');
	const to = moment().set('month',month - 1).set('year',year).endOf("month").format('YYYY-MM-DD HH:mm:ss');
	const statements = await trx("water_statements").whereBetween("bill_date",[from,to]).sum("total_cbm as total_consumption").sum("billed_cbm as total_billed").sum("current_amount_due as total_receivables").whereNull("voided_on").first();
	let loss = generated - statements.total_consumption;
	if(loss < 0)
		loss = 0;
	return {
		month: moment().set('month',month - 1).set("year",year).format("MMMM YYYY"),
		generated,
		consumption: statements.total_consumption || 0,
		billed: statements.total_billed || 0,
		receivables: statements.total_receivables || 0,
		expenses,
		income: statements.total_receivables - expenses,
		loss
	}
}