const { db, string } = require('../helpers/init');
const logger = require('logdown')(__filename);
const name = require('path').basename(__filename).split(".")[0];

module.exports = async () => {
    try{
        await db.schema.raw(`CREATE OR REPLACE VIEW ${name} AS
            SELECT w.*,
            CONCAT(u.first_name," ",u.last_name) as added_by_name,
            CONCAT(v.first_name," ",v.last_name) as suspended_by_name,
            DATE_FORMAT(w.turnover_date, "%M %d, %Y") as turnover_date_display,
            IF(
                w.current_balance > 0,
                1,
                0
            ) as has_balance,
            CONCAT('${string.getCurrencySymbol()} ', FORMAT(w.current_balance, 2)) as current_balance_display
            FROM water_consumers as w
            LEFT JOIN users as u
            ON w.added_by = u.id
            LEFT JOIN users as v
            ON w.suspended_by = v.id
        `);
        logger.info(`${name} - has been successfully created`)
    }catch(e){
        logger.error(`Cannot create view`,e.message)
    }
}
