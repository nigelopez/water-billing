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
            table.integer('consumer_id').index().notNullable();
            table.string('unit_code').index().notNullable();
            table.string('consumer_name').index().notNullable();
            table.string('meter_number').index().nullable();
            
            table.string('bill_number',12).index().notNullable().unique();
            table.date('bill_date').index().notNullable();
            table.date('due_date').index().notNullable();
            
            table.date('period_from').index().nullable();
            table.decimal('previous_reading',8,1).index().notNullable();
            table.date('period_to').index().notNullable();
            table.decimal('current_reading',8,1).index().notNullable();
            
            table.integer('number_of_days').index().notNullable();
            table.decimal('average_cbm_per_day',8,1).index().notNullable();
            
            table.decimal('total_cbm',8,1).index().notNullable();
            table.decimal('billed_cbm',8,1).index().notNullable();

            table.decimal('additional_charges',10,2).index().notNullable();
            
            table.decimal('current_amount_due',10,2).index().notNullable();
            table.decimal('advance_payment',10,2).index().defaultTo(0);
            table.decimal('outstanding_balance',10,2).index().notNullable();
            table.integer('interest').index().notNullable();
            table.decimal('total_interest',10,2).index().notNullable();

            
            table.decimal('total_amount_due_without_overpayment',12,2).index().notNullable();
            table.decimal('total_amount_due',12,2).index().notNullable();

            table.integer('generated_by').index().notNullable();
            table.timestamp('generated_on').index().defaultTo(db.fn.now());

            table.integer('voided_by').index().defaultTo(0);
            table.string('void_reasons').nullable();
            table.dateTime('voided_on').index().nullable();
        });
        logger.info(`Successfully created table "${name}"`);
    }catch(e){
        logger.error(e.message);
    };
}
