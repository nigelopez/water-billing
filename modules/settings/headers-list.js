const { db } = require('../../helpers/init');
const moment = require('moment');
const forEach = require('async-foreach').forEach;
const headers = [
    'header_company_phone',
    'header_company_email',
    'header_company_address',
    'header_company_name',
    'header_logo',
    'header_logo_margin_top'
];

module.exports = async (data) => {
    if(!data.filtered)
        data.filtered = [];
    
    data.filtered.push({
        id: 'name',
        value: headers
    });

    data = await db.filter('water_settings',data);
    return data;
}
