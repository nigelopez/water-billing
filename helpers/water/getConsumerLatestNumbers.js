const { db } = require('../init');

module.exports = async (consumer_id = 0, trx = db) => {
    let old_balance = (await trx("water_consumers").where("id",consumer_id).first().select("old_balance"))?.old_balance || 0;
    let all = await trx("water_statements").sum('current_amount_due as total_due').sum('total_interest as total_interest').whereNull("voided_on").where("consumer_id",consumer_id).first();
    let total_payment_received = Math.abs((await trx("water_payments").whereNull("voided_on").where("consumer_id",consumer_id).sum("amount as total_payment").first())?.total_payment || 0);
    let overall_due = Number((all.total_due + all.total_interest + old_balance).toFixed(2));
    let current_balance = Number((overall_due - total_payment_received).toFixed(2));
    return {
        overall_due,
        total_payment_received,
        current_balance 
    }
}