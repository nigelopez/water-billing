const { db } = require('../../helpers/init');
const moment = require('moment');
const forEach = require('async-foreach').forEach;
const rightElements = require('../../buttons/settings_percentage_charges_right_elements');

module.exports = async (data) => {
    if(!data.filtered)
        data.filtered = [];
    
    data.filtered.push({
        id: 'name',
        operator: 'like',
        value: 'percentage_charges_%'
    });

    data = await db.filter('water_settings',data);
    data.rows.map(r=>{
        r.deletable = true;
    })
    data.rightElements = rightElements;
    return data;
}
