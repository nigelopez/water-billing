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
            table.string('action').index().notNullable();
            table.text('old_value').notNullable();
            table.text('new_value').notNullable();
            table.text('reason').nullable();
            table.integer('updated_by').index().notNullable();
            table.timestamp('updated_at').defaultTo(db.fn.now()).index();
        });
        logger.info(`Successfully created table "${name}"`);
    }catch(e){
        logger.error(e.message);
    };
}
