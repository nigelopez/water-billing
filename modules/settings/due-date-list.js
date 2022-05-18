const { db } = require('../../helpers/init');
const moment = require('moment');
const forEach = require('async-foreach').forEach;

module.exports = async (data) => {
    if(!data.filtered)
        data.filtered = [];
    
    data.filtered.push({
        id: 'name',
        value: 'additional_days_for_due_date'
    });

    data = await db.filter('water_settings',data);
    return data;
}
