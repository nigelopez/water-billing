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
            table.integer("consumer_id").notNullable().index();
            table.string("unit_code").index().notNullable();
            table.string("or_number").index().notNullable();
            table.decimal("amount",12,2).index().defaultTo(0);
            table.date('receipt_date').index().notNullable();
            table.string('type').index().notNullable();
            table.string('bank_name').index().nullable();
            table.string('check_number').index().nullable();
            table.string('reference_number').index().nullable();
            table.string('notes').index().nullable();
            table.integer('added_by').index().notNullable();
            table.timestamp('added_on').index().defaultTo(db.fn.now());
            table.integer('voided_by').index().defaultTo(0);
            table.dateTime('voided_on').index().nullable();
            table.string('void_notes').index().nullable();
            table.text('image').index().nullable();
        });
        logger.info(`Successfully created table "${name}"`);
    }catch(e){
        logger.error(e.message);
    };
}
