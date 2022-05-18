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
            table.boolean('ignore_bills').default(false).index();
            table.boolean('ignore_old_statement_errors').default(false).index();
            table.integer('total_statements').index().defaultTo(0);
            table.integer('total_time').index().defaultTo(0);
            table.integer("requested_by").index().defaultTo(0);
            table.timestamp("requested_on").index().defaultTo(db.fn.now());
        });
        logger.info(`Successfully created table "${name}"`);
    }catch(e){
        logger.error(e.message);
    };
}
