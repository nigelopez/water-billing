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
            table.integer('year').index().notNullable();
            table.integer('month').index().notNullable();
            table.string('type').index().notNullable();
            table.integer('water_consumption').index().nullable();
            table.decimal('charge_per_cbm',6,2).index().notNullable();
            table.decimal('water_fee',12,2).index().notNullable();
            table.decimal('current_bill',12,2).index().notNullable();
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
