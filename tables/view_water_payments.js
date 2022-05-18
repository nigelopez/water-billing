const { db, string } = require('../helpers/init');
const logger = require('logdown')(__filename);
const name = require('path').basename(__filename).split(".")[0];

module.exports = async () => {
    try{
        await db.schema.raw(`CREATE OR REPLACE VIEW ${name} AS
            SELECT p.*, c.name,
            CONCAT(u.first_name," ",u.last_name) as added_by_name,
            CONCAT(v.first_name," ",v.last_name) as voided_by_name,
            IF(
                p.voided_by > 0,
                'cancelled',
                'active'
            ) as status_display,
            DATE_FORMAT(p.added_on, "%M %d, %Y %h:%i %p") as added_on_display,
            DATE_FORMAT(p.receipt_date, "%M %d, %Y") as receipt_date_display,
            DATE_FORMAT(p.voided_on, "%M %d, %Y") as voided_on_display,
            CONCAT('${string.getCurrencySymbol()} ', FORMAT(p.amount, 2)) as amount_display,
            IF(
                p.type = "CASH",
                IF(
                    voided_by > 0,
                    CONCAT('(','${string.getCurrencySymbol()} ', FORMAT(p.amount, 2),')'),
                    CONCAT('${string.getCurrencySymbol()} ', FORMAT(p.amount, 2))
                ),
                null
            ) as cash_amount,
            IF(
                p.type = "CHECK",
                IF(
                    voided_by > 0,
                    CONCAT('(','${string.getCurrencySymbol()} ', FORMAT(p.amount, 2),')'),
                    CONCAT('${string.getCurrencySymbol()} ', FORMAT(p.amount, 2))
                ),
                null
            ) as check_amount,
            IF(
                p.type = "ONLINE",
                IF(
                    voided_by > 0,
                    CONCAT('(','${string.getCurrencySymbol()} ', FORMAT(p.amount, 2),')'),
                    CONCAT('${string.getCurrencySymbol()} ', FORMAT(p.amount, 2))
                ),
                null
            ) as online_amount
            FROM water_payments as p
            JOIN water_consumers as c
            ON c.id = p.consumer_id
            LEFT JOIN users as u
            ON p.added_by = u.id
            LEFT JOIN users as v
            ON p.voided_by = v.id
        `);
        logger.info(`${name} - has been successfully created`)
    }catch(e){
        logger.error(`Cannot create view`,e.message)
    }
}
