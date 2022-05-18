const { db } = require('../../helpers/init');
const moment = require('moment');
const forEach = require('async-foreach').forEach;

module.exports = async (data) => {
    if(!data.filtered)
        data.filtered = [];
    
    data.filtered.push({
        id: 'name',
        operator: 'like',
        value: 'charge_label[%'
    });

    data = await db.filter('water_settings',data);
    data.alerts = [
        { html: 'These charges are only used when your Rate Scheme is not fixed rate.', color: 'info' },
        { html: 'The rate per cubic meter will depend on the values you will enter in the Bills menu', color: 'warning' }
    ];
    return data;
}
