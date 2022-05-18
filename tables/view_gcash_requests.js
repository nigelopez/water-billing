const { db, string } = require('../helpers/init');
const logger = require('logdown')(__filename);
const name = require('path').basename(__filename).split(".")[0];

module.exports = async () => {
    try{
        await db.schema.raw(`CREATE OR REPLACE VIEW ${name} AS
            SELECT g.*, c.name,
            IF(
                status = 'pending',
                'pending',
                IF(
                    status = 'paid' AND or_number IS NULL,
                    'Missing OR',
                    status
                )
            ) as status_display,
            CONCAT('${string.getCurrencySymbol()} ', FORMAT(g.amount, 2)) as amount_display,
            CONCAT('${string.getCurrencySymbol()} ', FORMAT(g.amount_paid, 2)) as amount_paid_display,
            DATE_FORMAT(g.timestamp, "%M %d, %Y %h:%i %p") as timestamp_display
            FROM gcash_requests as g
            JOIN water_consumers as c
            ON g.consumer_id = c.id
            ORDER BY date_added DESC
        `);
        logger.info(`${name} - has been successfully created`)
    }catch(e){
        logger.error(`Cannot create view`,e.message)
    }
}
