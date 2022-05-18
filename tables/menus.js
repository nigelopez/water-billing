const { db } = require('../helpers/init');
const logger = require('logdown')(__filename);
const name = require('path').basename(__filename).split(".")[0];

module.exports = async () => {
    const exists = await db.schema.hasTable(name);
    if(exists)
        return;
    try{
        await db.schema.createTable(name, table => { 
            table.increments('_id').primary();
            table.string('id').index().unique().notNullable();
            table.string('icon').index().notNullable();
            table.string('label').index().notNullable();
            table.string('long_label').index().nullable();
            table.string('to').index().notNullable();
            table.string('component').index().nullable();
            table.text('component_props').index().nullable();
            table.text('right_elements').index().nullable();
            table.timestamp('added_on').index().defaultTo(db.fn.now());
        });
        logger.info(`Successfully created table "${name}"`);
    }catch(e){
        logger.error(e.message);
    };
    const hasSettings = await db('menus').where('id','settings').first();
    if(hasSettings) return;

    const menus = require('./defaultMenus.json');
    menus.map(m=>{
        m.added_on = null;
    });
    
    await db('menus').insert(menus);
    logger.info(`Successfully inserted default menus`);
}
