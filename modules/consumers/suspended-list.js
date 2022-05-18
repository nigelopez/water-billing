const { db, string } = require('../../helpers/init');
const moment = require('moment');
const forEach = require('async-foreach').forEach;
const rightElements = require('../../buttons/consumers_right_elements');
module.exports = async (data) => {
    if(!data?.sorted?.length)
        data.sorted_by_raw = `added_on DESC, unit_code ASC`;
    if(!data.filtered)
        data.filtered = [];
    data.filtered.push({ id: 'suspended', value: 1 });
    data = await db.filter('view_water_consumers',data);
    data.rows.map(r=>{
        r.has_balance = r.current_balance > 0 ? true:false;
        r.current_balance = string.currencyFormat(r.current_balance);
    });
    data.rightElements = rightElements;
    return data;
}
