const { db } = require('../../helpers/init');
const moment = require('moment');
const forEach = require('async-foreach').forEach;

module.exports = async (data) => {
    data = await db.filter('menus',data);
    data.rows.map(r=>{
        r.added_on = r.added_on ? moment(r.added_on).format('llll') : null
    })
    return data;
}
