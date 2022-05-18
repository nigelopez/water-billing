const { db } = require('../helpers/init');
const logger = require('logdown')(__filename);
const name = require('path').basename(__filename).split(".")[0];

module.exports = async () => {
    try{
        await db.schema.raw(`CREATE OR REPLACE VIEW ${name} AS
            SELECT w.*,
            CONCAT(u.first_name," ",u.last_name) as generated_by_name,
            CONCAT(v.first_name," ",v.last_name) as voided_by_name
            FROM water_statements as w
            LEFT JOIN users as u
            ON w.generated_by = u.id
            LEFT JOIN users as v
            ON w.voided_by = v.id
        `);
        logger.info(`${name} - has been successfully created`)
    }catch(e){
        logger.error(`Cannot create view`,e.message)
    }
}
