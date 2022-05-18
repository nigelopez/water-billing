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
    data.filtered.push({ id: 'voided_on', type: "whereNull"});
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
                r.added_on = moment(r.added_on).format('MMMM DD, YYYY hh:mm A');
            }catch(e){
                console.log(e.message);
            }
            done();
        },resolve);
    })
    data.rightElements = rightElements;
    return data;
}
