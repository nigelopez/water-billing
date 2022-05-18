const { db } = require('../../helpers/init');
const yup = require('yup');
const types = ['fixed','range'];
const form = yup.object({
  type: yup.string().required().oneOf(types)
}).noUnknown();

const defaultRanges = [
  { name: 'rate[consumption_range[1]]', description: 'Minimum 10 cu.m', value: '15.20', type: 'number' },
  { name: 'rate[consumption_range[2]]', description: '10 to 20 cu.m', value: '16.80', type: 'number' },
  { name: 'rate[consumption_range[3]]', description: '20 to 30 cu.m', value: '19.77', type: 'number' },
  { name: 'rate[consumption_range[4]]', description: 'Over 30 cu.m', value: '48.40', type: 'number' },
  { name: 'consumption_range[1]', description: 'Range of Consumption #1', value: '0-10', type: 'range' },
  { name: 'consumption_range[2]', description: 'Range of Consumption #2', value: '10-20', type: 'range' },
  { name: 'consumption_range[3]', description: 'Range of Consumption #3', value: '20-30', type: 'range' },
  { name: 'consumption_range[4]', description: 'Range of Consumption #4', value: '30-999999', type: 'range' },
  { name: 'charge_label[water]', description: 'Water Charges', value: 'MCWD Add-On Charge', type: 'text' },
  { name: 'charge_label[electric]', description: 'Electricity Charges', value: 'MECO Pumping Charge', type: 'text' },
  { name: 'required_additional_charges', description: 'Required additional charges before creating statement(e.g water, electric), separated by comma', value: 'water,electric', type: 'text' },
];

const fixedRange = [
  { name: 'rate[consumption_range[1]]', description: 'Fixed Rate', value: '30', type: 'number' },
  { name: 'consumption_range[1]', description: 'Range of Consumption #1', value: '0-999999', type: 'range' },
]

module.exports = async (data) => {
  const { id } = data.credentials;
  data = await form.validate(data);
  await db.transaction(async trx=>{
    const rates = await trx("water_settings").where("name","like","rate[%");
    
    await trx('water_settings').where('name','like','rate[%').del();
    await trx('water_settings').where('name','like','consumption_range[%').del();
    await trx('water_settings').where('name','like','charge_label[%').del();
    await trx('water_settings').where('name','required_additional_charges').del();

    if(data.type == 'range'){
      if(rates.length > 1)
        throw new Error(`You are already on a range scheme`);
      await trx('water_settings').insert(defaultRanges);
    }else if(data.type == 'fixed'){
      if(rates.length == 1)
        throw new Error(`You are already on a fixed scheme`);
      await trx('water_settings').insert(fixedRange);
    }else
      throw new Error(`Invalid scheme!`);
    await trx('water_settings_updates').insert({
      updated_by: id,
      old_value: JSON.stringify({ action: 'update_rate_to_range' }),
      new_value: JSON.stringify(defaultRanges)
    });
  })
  
  return { successMessage: `Successfully updated rate scheme.` };
};