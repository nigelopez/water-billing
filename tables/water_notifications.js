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
            table.integer('consumer_id').index().notNullable();
            table.string('unit_code').index().notNullable();
            table.string('consumer_name').index().notNullable();
            table.integer('statement_id').index().notNullable();
            table.string('bill_number').index().notNullable();
            table.date('bill_date').index().notNullable();
            table.string('email').index().notNullable();
            table.integer('status').defaultTo(0).index();
            table.text('message').nullable();
            table.dateTime('processed_on').index().nullable();
            table.integer('requested_by').index().notNullable();
            table.timestamp('requested_on').index().defaultTo(db.fn.now());
            table.dateTime('cancelled_on').index().nullable();
            table.integer('cancelled_by').index().nullable();
        });
        logger.info(`Successfully created table "${name}"`);
    }catch(e){
        logger.error(e.message);
    };
}
