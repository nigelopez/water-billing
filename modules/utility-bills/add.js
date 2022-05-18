const { db, get } = require('../../helpers/init');
const aws_url = `https://${process.env.AWS_BUCKET_NAME}.s3`;
const yup = require('yup');
const moment = require('moment');

const form = yup.object({
  date: yup.string().required(),
  type: yup.string().required(),
  current_bill: yup.number().required(),
  image: yup.string().required("Image is required. Please wait for it to finish uploading"),
  water_consumption: yup.number().nullable(),
  water_fee: yup.number().nullable()
}).noUnknown();

module.exports = async (data) => {
  const { id } = data.credentials;
  data = await form.validate(data);
  if(data.image.indexOf(aws_url) !== 0)
    throw new Error(`Please re upload the image`);
  const date = moment(data.date);
  if(!date.isValid())
    throw new Error("Invalid date!");
  const year = date.year();
  const month = date.month() + 1;
  const found = await db("water_utility_bills").where("year",year).where("month",month).where("type",data.type).whereNull("voided_on").first();
  if(found)
    throw new Error(`There is an existing ${data.type} bill for ${date.format("MMMM YYYY")}. You need to void it first before you can add ${data.type} bill`);
  const insert = {
    type: data.type,
    month, year,
    image: data.image,
    current_bill: Number(data.current_bill),
    charge_per_cbm: 0, // for electric, default is 0, it will be updated below
    water_fee: 0,
    added_by: id
  };
  if(data.type == "water"){
    if(!data.water_consumption)
      throw new Error(`Please provide total water consumption`);
    if(!data.water_fee)
      throw new Error(`Please provide total water fee`);
    insert.water_consumption = Number(data.water_consumption);
    insert.water_fee = Number(data.water_fee);
    insert.charge_per_cbm = (insert.current_bill - insert.water_fee) / insert.water_consumption;
    if(insert.water_fee >= insert.current_bill)
      throw new Error(`Current bill must be greater than water bill!`);
  }else if(data.type === 'electric'){
    const types = await get.utility_bills_types();
    let electricOnly = false;
    types.map(t=>{
      if(t.value == 'electric' && types.length == 2)
        electricOnly = true;
    });
    if(electricOnly){
      insert.water_consumption = Number(data.water_consumption);
      if(!insert.water_consumption)
        throw new Error("Invalid water consumption!");
      insert.charge_per_cbm = insert.current_bill / insert.water_consumption;
    }
  }else if(data.type != "electric" && data.type != "water"){
    throw new Error(`Invalid type "${data.type}"`);
  }
  
  await db("water_utility_bills").insert(insert);
  
  // update electric row water_consumption and charge_per_cbm
  try{
    const water = await db("water_utility_bills").where("year",year).where("month",month).where("type","water").whereNull("voided_on").first();
    const electric = await db("water_utility_bills").where("year",year).where("month",month).where("type","electric").whereNull("voided_on").first();
    if(water && electric){
      const update = {
        water_consumption: water.water_consumption,
        charge_per_cbm: electric.current_bill / water.water_consumption
      };
      await db("water_utility_bills").update(update).where("id",electric.id);
    }
  }catch(e){
    logger.error(e.message);
  }
  // end of update
  return { successMessage: `Successfully added new utility bill` };
};