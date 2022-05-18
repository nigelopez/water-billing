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
            table.integer('downloads').index().defaultTo(0);
            table.date('bill_date').index().notNullable();
            table.string('type').index().notNullable();
            table.string('filename').index().nullable();
            table.string('filesize').index().nullable();
            table.integer('number_of_statements').index().defaultTo(0);
            table.string('message').index().nullable();
            table.dateTime('started_on').index().nullable();
            table.dateTime('ended_on').index().nullable();
            table.integer('pid').index().defaultTo(0);
            table.integer('requested_by').notNullable().index();
            table.timestamp('requested_on').index().defaultTo(db.fn.now());
        });
        logger.info(`Successfully created table "${name}"`);
    }catch(e){
        logger.error(e.message);
    };
}
