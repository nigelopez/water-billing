const { db } = require('../../helpers/init');
const yup = require('yup');
const fs = require('fs');
const sharp = require('sharp');
const form = yup.object({
  id: yup.number().positive().required(),
  image: yup.string().required()
}).noUnknown();


module.exports = async (data) => {
  const { id } = data.credentials;
  data = await form.validate(data);
  await db.transaction(async trx=>{
    const settings = await trx("water_settings").where("id",data.id).first();
    if(!settings)
      throw new Error(`Cannot find settings with id ${data.id}`);
    if(!fs.existsSync(data.image))
      throw new Error(`Cannot find image! Please re upload`);
    let img = await sharp(data.image).resize({ width: 100 }).toBuffer();
    img = `data:image/png;base64,${img.toString('base64')}`;
    console.log(img);
    // console.log(img.toString().length);
    // let stats = fs.statSync(data.image);
    // let fileSizeInBytes = stats.size;
    // let mb = fileSizeInBytes / (1024*1024);
    // if(mb > 0.15)
    //   throw new Error("To reduce file size of each statements, please use a logo that is below 150kb in size. Please resize your logo");
    // let value = `data:image/png;base64,${fs.readFileSync(data.image, 'base64')}`;
    await trx('water_settings').update({ value: img }).where('id',settings.id);
  });
  return { successMessage: `Successfully updated statement logo` };
};