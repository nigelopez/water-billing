const { db } = require('../../helpers/init');
const rightElements = require('../../buttons/water_settings_right_elements');
const moment = require('moment');
const forEach = require('async-foreach').forEach;

module.exports = async (data) => {
    data = await db.filter('water_settings',data);
    data.rightElements = rightElements;
    return data;
}
