const { db, string } = require('../../helpers/init');
const moment = require('moment');
const forEach = require('async-foreach').forEach;
const rightElements = require('../../buttons/users_right_elements');

module.exports = async (data) => {
    const { id } = data.credentials;
    if(!data?.sorted?.length)
        data.sorted_by_raw = `created_on DESC`;
    if(!data.filtered)
        data.filtered = [];

    if(id !== 1)
        data.filtered.push({ id: 'id', operator: '<>', value: 1 });

    data = await db.filter('users',data);
    data.rows.map(r=>{
        r.status = r.status == 1 ? 'active':'suspended';
    });

    data.rightElements = rightElements;
    return data;
}
