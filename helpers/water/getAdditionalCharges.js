const { db } = require('../init');
const _ = require('lodash');
const moment = require('moment');
const forEach = require('async-foreach').forEach;

module.exports = async (month = moment().month() + 1, year = moment().year()) => {
    const addons = await db("water_utility_bills").whereNull("voided_on").where("year",year).select("id","type","charge_per_cbm").where("month",month);
    let error;
    await db.transaction(async trx=>{
        await new Promise((resolve,reject)=>{
            forEach(addons, async function(bill){
                const done = this.async();
                try{
                    const label = (await trx("water_settings").where("name",`charge_label[${bill.type}]`).first())?.description;
                    if(!label)
                        throw new Error(`"charge_label[${bill.type}]" was not found in water settings`);
                    bill.label = label;
                }catch(e){
                    error = e.message;
                }
                done();
            },resolve);
        });
        return;
    });
    if(error)
        throw error;
    return _.orderBy(addons,['type'],['asc']);
}