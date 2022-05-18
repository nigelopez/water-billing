const { db,string } = require('../../helpers/init');
const generate = require('../../helpers/water/generate');
const moment = require('moment');
const yup = require('yup');
const form = yup.object({
  reading_from: yup.string().length(10).required(),
  billing_date: yup.string().length(10).required(),
  ignore_bills: yup.boolean().default(false).nullable(),
  ignore_old_statement_errors: yup.boolean().default(true).nullable()
});
module.exports = async (data) => {
  const { id } = data.credentials;
  data = await form.validate(data);
  let { ignore_bills, billing_date, reading_from, ignore_old_statement_errors } = data;
  billing_date = string.validateDate(billing_date);
  reading_from = string.validateDate(reading_from);
  if(billing_date < reading_from)
    throw new Error("Billing date must not be earlier than reading date");
  const start = process.hrtime();
  const result = await generate(billing_date, id, { ignore_bills, reading_from, ignore_old_statement_errors });
  const elapsed = process.hrtime(start)[1] / 1000000;
  const ins = {
    requested_by: id,
    total_statements: result.total_inserts,
    total_time: elapsed,
    ignore_bills,
    ignore_old_statement_errors
  };
  await db("water_statement_generations").insert(ins);
  if(result.total_inserts < 1)
    throw new Error(`All accounts are up to date. No statements generated.`);

  return { successMessage: `Successfully generated ${result.total_inserts} statements.` };
};