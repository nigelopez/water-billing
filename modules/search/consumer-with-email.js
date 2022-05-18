const { db, string } = require('../../helpers/init');
module.exports = async (data) => {
    var { input } = data;
    if(!input)
        throw new Error(`No search data found`);
    const search = `%${input}%`;
    const consumers = await db("water_consumers").where(x=>{
        x.where("unit_code","like",search);
        x.orWhere("name","like",search);
        x.orWhere("email","like",search);
    }).whereNotNull('email');
    let result = [];
    consumers.map((c,key)=>{
        result.push({
            key,
            value: c.id,
            label: `${c.unit_code} - ${c.name} - ${c.email}`,
            balance: string.currencyFormat(c.current_balance)
        })
    });
    return result;
}