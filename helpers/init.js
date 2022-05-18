// this file is used to load environment variables so that we don't have to call it again and again in case we need it;

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const db = require('../database/main');
const string = require('./string');
const secret_key = process.env.KEY || null;
const { forEach } = require('async-foreach');
const moment = require('moment');
const { v4 } = require('uuid');

const myForEach = async (values = [], onLoop = async ()=>{}, options = { rejectOnError: false }) => {
    return await new Promise((resolve, reject) => {
        forEach(values, async function(v,i){
            const done = this.async();
            try{
                await onLoop(v,i);
            }catch(e){
                if(options?.rejectOnError){
                    reject(e);
                    return false;
                }
            }
            done();
        },resolve);
    });
}

const get = {};
const check = {};

check.if_latest_statement_is_inside_period = async (consumer_id, from, to, trx = db) => {
    // console.log({ from, to })
    // const latest = await trx("water_statements").where("consumer_id",consumer_id).orderBy("period_to","desc").first().whereNull("voided_on")
    // .where(z=>{
    //     z.whereBetween("period_from",[from,to]);
    //     z.orWhereBetween("period_to",[from,to]);
    // });
    // if(!latest)
    //     return;
    // throw new Error("hey");
    const latest = await trx("water_statements").where("consumer_id",consumer_id).orderBy("period_to","desc").first().whereNull("voided_on");
    if(!latest)
        return;
    // const last_period_from = moment(latest.period_from);
    const last_period_to = moment(latest.period_to);
    const xfrom = moment(from);
    // const xto = moment(to);
    if(xfrom <= last_period_to)
        throw new Error(`Latest period of ${latest.unit_code} is on ${last_period_to.format("MMMM DD, YYYY")} and the period selected is earlier. You may void ${latest.bill_number} first if you really need to generate old invoice`);
    // if(xto <= last_period_to)
    //     throw new Error("Before 2");
}

get.utility_bills_types = async (trx = db) => {
    let types = (await trx("water_settings").where("name","like","charge_label%"))?.map(t=>{
    const matches = t.name.match(/\[(.*?)\]/);
    const value = matches && matches[1];
    if(!value)
        throw new Error(`Invalid settings "${t.name}"; Cannot get value inside brackets`);
    return { value, text: t.value };
    });
    types = [
        { value: '', text: 'Please select a bill' },
        ...types
    ];
    return types;
}


get.water_readings = async (consumer_id, from, to, trx = db) => {
    // console.log(trx("water_readings").where("consumer_id",consumer_id).whereBetween("date",[from, to]).where("statement_id",0).orderBy("date","asc").toQuery());
    const readings = await trx("water_readings").where("consumer_id",consumer_id).whereBetween("date",[from, to]).where("statement_id",0).orderBy("date","asc");
    return readings;
}

get.water_required_charges = async (bill_date, trx = db) => {
    bill_date = moment(bill_date);
    if(!bill_date.isValid())
        throw new Error(`Invalid bill_date`);

    let required = (await trx("water_settings").where("name","required_additional_charges").first())?.value;
    if(!required) return null;

    let charges = {};
    let chargesLabels = {};
    
    required = required.split(" ").join("").split(",");
    await new Promise((resolve,reject)=>{
        forEach(required, async function(r){
            const done = this.async();
            const label = (await trx("water_settings").where("name",`charge_label[${r}]`).first())?.value;
            if(!label)
                return reject(new Error(`"charge_label[${r}]" was not found in water settings`));
            chargesLabels[r] = label;
            done();
        },resolve);
    });
    let chargesQuery = await trx("water_utility_bills").whereNull("voided_on").select("id","type","charge_per_cbm","year","month").where("year",bill_date.year()).where("month",bill_date.month() + 1);
    chargesQuery.map(c=>{
        if(!charges[`${c.year}-${c.month}`])
            charges[`${c.year}-${c.month}`] = {};
        c.label = chargesLabels[c.type];
        charges[`${c.year}-${c.month}`][c.type] = c;
    });
    
    return { charges, chargesLabels, required };
}

get.water_settings = async (name, firstRowOnly = true, trx = db) => {
    let q = trx("water_settings").where("name",name);
    if(firstRowOnly)
        q.first();
    return await q;
}

get.consumer = async ( id, trx = db ) => {
    let consumer = await trx('water_consumers').where("id",Number(id)).first();
    if(!consumer)
        throw new Error(`Consumer ID ${id} not found`);
    return consumer;
}

check.if_turnover_date_is_required = async( trx = db ) => {
    let settings = await trx("water_settings").where("name","only_turned_over_units").first();
    if(!settings || settings.value.toUpperCase() !== "YES")
        return false;
    return true;
}

get.random_meter_number = () => {
    return v4().split('-')[0];
}

module.exports = { db, secret_key, string, myForEach, get, check };