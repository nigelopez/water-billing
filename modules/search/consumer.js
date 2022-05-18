const { db, string } = require('../../helpers/init');
module.exports = async (data) => {
    var { input } = data;
    if(!input)
        throw new Error(`No search data found`);
    const search = `%${input}%`;
    const consumers = await db("water_consumers").where("unit_code","like",search).orWhere("name","like",search);
    let result = [];
    consumers.map((c,key)=>{
        result.push({
            key,
            value: c.id,
            label: `${c.unit_code} - ${c.name}`,
            balance: string.currencyFormat(c.current_balance)
        })
    });
    return result;
}