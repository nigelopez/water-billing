const { db , string } = require('../../helpers/init');
const yup = require('yup');

const form = yup.object({
    id: yup.number().required(),
    checked: yup.boolean().required(),
}).noUnknown();

module.exports = async (data) => {
    const { id } = data.credentials;
    console.log(data);
    data = await form.validate(data);
    await db.transaction(async trx=>{
        await trx("water_consumers").update("allow_billing",data.checked).where("id",data.id);
        const insert = {
            updated_by: id,
            checked: data.checked,
            consumer_id: data.id
        };
        // console.log(insert);
        await trx("consumer_allow_billing_updates").insert(insert);
    });
    return;
};