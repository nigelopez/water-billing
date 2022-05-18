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
            table.string('module_name').index().notNullable();
            table.string('location').index().notNullable();
            table.integer('uploaded_by').index().notNullable();
            table.timestamp('uploaded_on').index().defaultTo(db.fn.now());
        });
        logger.info(`Successfully created table "${name}"`);
    }catch(e){
        logger.error(e.message);
    };
}
