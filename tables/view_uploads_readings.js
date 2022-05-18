const { db } = require('../helpers/init');
const logger = require('logdown')(__filename);
const name = require('path').basename(__filename).split(".")[0];

module.exports = async () => {
    try{
        await db.schema.raw(`CREATE OR REPLACE VIEW ${name} AS
            SELECT r.*,
            c.name,
            IF(
                r.date_solving_started IS NULL,
                "pending",
                IF(
                    r.active_readings_id > 0,
                    "moved",
                    IF(
                        r.date_solving_finished IS NULL,
                        "solving",
                        IF(
                            r.error IS NOT NULL,
                            IF(
                                r.reviewed_by > 0,
                                "reviewed",
                                "errored"
                            ),
                            IF(
                                r.reviewed_by > 0,
                                "reviewed",
                                "solved"
                            )
                        )
                    )
                )
            ) as status
            FROM uploads_readings as r
            JOIN water_consumers as c
            ON c.id = r.consumer_id
        `);
        logger.info(`${name} - has been successfully created`)
    }catch(e){
        logger.error(`Cannot create view`,e.message)
    }
}
