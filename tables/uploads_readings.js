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
            table.string('path').index().notNullable();
            table.date('reading_date').index().notNullable();

            table.date('last_reading_date').index().nullable();
            table.double('last_reading',8,3).index().defaultTo(0);
            table.integer('decimals').index().defaultTo(1);
            
            table.timestamp('date_uploaded').index().defaultTo(db.fn.now());
            table.dateTime('date_solving_started').index().nullable();
            table.dateTime('date_solving_finished').index().nullable();

            table.text('result_text').index().nullable();
            table.double('result',8,3).index().nullable();
            table.string('error').index().nullable();

            table.integer('deleted_by').index().nullable();
            table.dateTime('deleted_on').index().nullable();

            table.integer('moved_by').index().nullable();
            table.dateTime('moved_on').index().nullable();
            table.integer('active_readings_id').index().nullable();

            table.integer('reviewed_by').index().nullable();
            table.dateTime('reviewed_on').index().nullable();
        });
        logger.info(`Successfully created table "${name}"`);
    }catch(e){
        logger.error(e.message);
    };
}
