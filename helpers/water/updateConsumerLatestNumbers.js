const { db } = require('../init');

module.exports = async (consumer_id, overall_due, total_payment_received, trx = db) => {
    await trx("water_consumers").update({
        overall_receivables: overall_due,
        overall_payments: total_payment_received,
        current_balance: overall_due + -Math.abs(total_payment_received),
        last_update: trx.fn.now()
    }).where('id',consumer_id);
}