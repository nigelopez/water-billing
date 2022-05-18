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
            table.string("name").index().unique();
            table.string("description").index().notNullable();
            table.text("value").notNullable();
            table.string("type").index().notNullable();
        });
        logger.info(`Successfully created table "${name}"`);
        const insert = require('./defaultSettings.json');
        await db(name).insert(insert);
        logger.info(`Successfully inserted default values to ${name} table`);
    }catch(e){
        logger.error(e.message);
    };
}
