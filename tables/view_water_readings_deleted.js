const { db } = require('../helpers/init');
const logger = require('logdown')(__filename);
const name = require('path').basename(__filename).split(".")[0];

module.exports = async () => {
    try{
        await db.schema.raw(`CREATE OR REPLACE VIEW ${name} AS
            SELECT r.*, c.name, CONCAT(u.first_name," ",u.last_name) as deleted_by_name
            FROM water_readings_deleted as r
            JOIN water_consumers as c
            ON c.id = r.consumer_id
            LEFT JOIN users as u
            ON r.deleted_by = u.id
            ORDER BY deleted_on DESC
        `);
        logger.info(`${name} - has been successfully created`)
    }catch(e){
        logger.error(`Cannot create view`,e.message)
    }
}
