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
            table.string("unit_code").index().notNullable().unique();
            table.string("name").index().notNullable();
            table.string("type").index().nullable();
            table.string("turnover_date").index().nullable();
            table.string('meter_number').index().nullable();
            table.decimal("old_balance",12,2).index().defaultTo(0);
            table.dateTime("last_payment_date").index().defaultTo(null);
            table.decimal("last_payment_amount",10,2).index().defaultTo(0);
            table.decimal("overall_receivables",12,2).index().defaultTo(0);
            table.decimal("overall_payments",12,2).index().defaultTo(0);
            table.decimal("current_balance",12,2).index().defaultTo(0);
            table.dateTime("last_update").index().defaultTo(null);
            table.integer('suspended').index().defaultTo(0);
            table.integer('suspended_by').index().defaultTo(0);
            table.string('suspension_reason').index().nullable();
            table.string('email').index().nullable();
            table.string('number').index().nullable();
            table.integer("added_by").index().defaultTo(0);
            table.timestamp("added_on").index().defaultTo(db.fn.now());
            table.integer("reader_decimals").index().defaultTo(0);
            table.boolean("allow_billing").index().defaultTo(1);
        });
        logger.info(`Successfully created table "${name}"`);
    }catch(e){
        logger.error(e.message);
    };
}
