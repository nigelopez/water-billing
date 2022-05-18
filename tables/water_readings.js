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
            table.integer("consumer_id").index().notNullable();
            table.string("unit_code").index().notNullable();
            table.string("meter_number").index().notNullable();
            table.date("date").index().notNullable();
            table.integer("statement_id").index().defaultTo(0);
            table.decimal("value",8,3).index().notNullable();
            table.integer("added_by").index().defaultTo(0);
            table.timestamp("added_on").index().defaultTo(db.fn.now());
            table.unique(["unit_code","date","meter_number"]);
        });
        logger.info(`Successfully created table "${name}"`);
    }catch(e){
        logger.error(e.message);
    };
}
