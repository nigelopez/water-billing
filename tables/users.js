const { db } = require('../helpers/init');
const logger = require('logdown')(__filename);
const name = require('path').basename(__filename).split(".")[0];

module.exports = async () => {
    const exists = await db.schema.hasTable(name);
    if(exists)
        return;
    try{
        await db.schema.createTable(name, table => { 
            table.increments('id').primary()
            table.string('username').notNullable().index().unique();
            table.string('password',32).notNullable();
            table.string('last_name').notNullable();
            table.string('first_name').notNullable();
            table.integer('created_by').index().defaultTo(1);
            table.timestamp('created_on').defaultTo(db.fn.now());
            table.boolean('status').defaultTo(true);
            table.string('uuid').nullable().index();
            table.string('image').nullable();
            table.boolean('change_password').index().defaultTo(true);
        });
        logger.info(`Successfully created table "${name}"`);
    }catch(e){
        logger.error(e.message);
    };

    const tpz = await db('users').where('username','tpz').first();
    if(tpz) return;
    
    const credentials = require('../helpers/credentials');
    const insert = [
        {
            username: 'tpz',
            password: credentials.encrypt_password("tpz"),
            last_name: 'Super',
            first_name: 'Admin'
        },
        {
            username: 'leng',
            password: credentials.encrypt_password("leng"),
            last_name: 'Salde',
            first_name: 'Anna Lee',
        },
    ]
    await db('users').insert(insert);
    logger.info(`Successfully inserted "tpz" and "leng" to users table`);
    // insert default restrictions to leng
    const user = await db("users").where("username","leng").first();
    if(!user)
        return;
    const restrictions = require('./adminRestrictions.json');
    restrictions.map(r=>{
        r.user_id = user.id;
        r.added_by = 1;
    });
    await db("user_restrictions").insert(restrictions);
    logger.info(`Successfully inserted restrictions for "leng"`);
}
