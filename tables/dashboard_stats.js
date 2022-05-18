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
            table.decimal('today',10,2).index().defaultTo(0);
            table.decimal('this_month',12,2).index().defaultTo(0);
            table.decimal('total_collections',12,2).index().defaultTo(0);
            table.decimal('total_receivables',12,2).index().defaultTo(0);
            table.dateTime('last_update').index().notNullable();
        });
        await db(name).insert({
            today: 0,
            this_month: 0,
            total_collections: 0,
            total_receivables: 0,
            last_update: db.fn.now()
        });
        logger.info(`Successfully created table "${name}"`);
    }catch(e){
        logger.error(e.message);
    };
}
