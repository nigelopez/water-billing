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
            table.integer('user_id').index().notNullable();
            table.string('type').index().notNullable(); // module or menu
            table.string('name').index().notNullable();
            table.integer('added_by').index().notNullable();
            table.timestamp('added_on').index().notNullable().defaultTo(db.fn.now());
        });
        logger.info(`Successfully created table "${name}"`);
    }catch(e){
        logger.error(e.message);
    };
}
