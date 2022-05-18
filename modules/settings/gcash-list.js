const { db } = require('../../helpers/init');
const moment = require('moment');
const forEach = require('async-foreach').forEach;

module.exports = async (data) => {
    if(!data.filtered)
        data.filtered = [];
    
    data.filtered.push({
        id: 'name',
        operator: 'like',
        value: 'gcash_%'
    });

    data = await db.filter('water_settings',data);
    return data;
}
