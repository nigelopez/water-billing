const { db } = require('../helpers/init');
const logger = require('logdown')(__filename);
const name = require('path').basename(__filename).split(".")[0];

module.exports = async () => {
    try{
        await db.schema.raw(`CREATE OR REPLACE VIEW ${name} AS
            SELECT w.*, 'pending' as status_text,
            CONCAT(u.first_name," ",u.last_name) as requested_by_name
            FROM water_notifications as w
            LEFT JOIN users as u
            ON w.requested_by = u.id
            WHERE w.status = 0
        `);
        logger.info(`${name} - has been successfully created`)
    }catch(e){
        logger.error(`Cannot create view`,e.message)
    }
}
