const { db } = require('../helpers/init');
const logger = require('logdown')(__filename);
const name = require('path').basename(__filename).split(".")[0];

module.exports = async () => {
    const exists = await db.schema.hasTable(name);
    if(exists)
        return;
    try{
        await db.schema.createTable(name, table => { 
            table.increments('id').primary();
            table.integer('payment_id').index().defaultTo(0);
            table.string('or_number').index().nullable();
            table.string('uuid').index().unique();
            table.integer('consumer_id').index().notNullable();
            table.string('unit_code').index().notNullable();
            table.integer('statement_id').index().notNullable();
            table.string('billing_number').index().notNullable();
            table.timestamp('date_requested').index().defaultTo(db.fn.now());

            // gcash params
            table.string('code').index();
            table.string('description').index().notNullable();
            table.string('status').index().notNullable();
            table.decimal('amount',8,2).index().notNullable();
            table.decimal('fee',8,2).index().notNullable();
            table.decimal('gross_amount',8,2).index().notNullable();
            table.decimal('net_amount',8,2).index().notNullable();
            table.string('hash').index().notNullable();
            table.integer('expiry').index().notNullable();
            table.dateTime('date_added').index().notNullable();
            table.string('checkout_url').index().notNullable();
            table.string('request_id').index().notNullable().unique();

            // after transaction
            table.string('reference').index().nullable();
            table.decimal('amount_paid',8,2).index().nullable();
            table.string('response_message').index().nullable();
            table.string('response_advise').index().nullable();
            table.string('timestamp').index().nullable();
            table.string('customer_name').index().nullable();
            table.string('customer_phone').index().nullable();
            table.string('customer_email').index().nullable();
        });
        logger.info(`Successfully created table "${name}"`);
    }catch(e){
        logger.error(e.message);
    };
}
