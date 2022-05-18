const { db } = require('../../helpers/init');
const moment = require('moment');
const forEach = require('async-foreach').forEach;
const values = [
    'minimum_consumption',
    'consumption_before_applying_minimum'
]
module.exports = async (data) => {
    if(!data.filtered)
        data.filtered = [];
    
    data.filtered.push({
        id: 'name',
        value: values
    });

    data = await db.filter('water_settings',data);
    data.alerts = [
        { html: 'You can set the minimum cubic meter to 0 if you don\'t want to charge your consumers a minimum charge' }
    ]
    return data;
}
