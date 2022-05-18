const { db } = require('../init');
const _ = require('lodash');

module.exports = async () => {
    const rates = {};
    (await db('water_settings').where('name','like','rate[consumption_range%')).map(r=>{
        rates[r.name] = { rate: Number(r.value), label: r.description };
    })
    const ranges = (await db('water_settings').where('name','like','consumption_range%')).map(r=>{
        if(!rates[`rate[${r.name}]`])
            throw new Error(`Cannot get rate of ${r.name}`);
        const val = `${r.value}`.split("-");
        if(val.length !== 2)
            throw new Error(`Invalid format value of ${r.name}`);
        val[0] = Number(val[0]);
        val[1] = Number(val[1]);
        if(val[0] > val[1])
            throw new Error(`Invalid format value of ${r.name}. First number should be less than the second number`);
        return {
            from: val[0],
            to: val[1],
            rate: rates[`rate[${r.name}]`]["rate"],
            label: rates[`rate[${r.name}]`]["label"],
        }
    });
    return _.orderBy(ranges,['from'],['asc']);
}