const { db } = require('../../helpers/init');
const moment = require('moment');
const forEach = require('async-foreach').forEach;
const string = require('../../helpers/string');
const rightElements = require('../../buttons/water_utility_bills_right_elements');

module.exports = async (data) => {
    if(!data?.sorted?.length)
        data.sorted = [ { id: 'added_on', desc: true } ];
    if(!data?.filtered)
        data.filtered = [];
    data.filtered.push({ id: 'voided_on', type: "whereNotNull"});
    data = await db.filter('view_water_utility_bills',data);
    await new Promise(resolve=>{
        forEach(data.rows, async function(r){
            const done = this.async();
            try{
                r.month_year = moment().set('year',r.year).set('month',r.month - 1).format("MMMM YYYY");
                r.charge_per_cbm = string.currencyFormat(r.charge_per_cbm);
                r.water_fee = r.water_fee > 0 ? string.currencyFormat(r.water_fee):null;
                r.current_bill = string.currencyFormat(r.current_bill);
                r.water_consumption = `${string.numberWithCommas(r.water_consumption)} cbm`;
                if(r.voided_by){
                    const user = await db("users").where("id",r.voided_by).first() || { first_name: 'FIRSTNAME_NOT_FOUND', last_name: 'LASTNAME_NOT_FOUND' };
                    r.voided_by = `${user.last_name}, ${user.first_name}`;
                    r.voided_on = r.voided_on && moment(r.voided_on).format('llll');
                }else
                    r.voided_by = null;
            }catch(e){
                console.log(e.message);
            }
            done();
        },resolve);
    })
    data.rightElements = rightElements;
    return data;
}
