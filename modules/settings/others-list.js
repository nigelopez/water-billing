const { db } = require('../../helpers/init');
const moment = require('moment');
const forEach = require('async-foreach').forEach;
const rightElements = require('../../buttons/settings_rates_right_elements');
const others = ['only_turned_over_units','show_ignore_utility_bills'];

module.exports = async (data) => {
    if(!data.filtered)
        data.filtered = [];
    
    data.filtered.push({
        id: 'name',
        operator: 'in',
        value: others
    });

    data = await db.filter('water_settings',data);
    data.rows.map(r=>{
        r.switch = r.value?.toUpperCase() === "YES" ? 1:0;
    });
    data.rightElements = rightElements;
    return data;
}
