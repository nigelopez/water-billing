const { db } = require('../../helpers/init');
const moment = require('moment');
const forEach = require('async-foreach').forEach;
const string = require('../../helpers/string');
// const rightElements = require('../../buttons/water_readings_right_elements');

const search = {
    fields: {
        "name": { name: 'name', label: 'Consumer Name', type: 'text' },
        "unit_code": { name: 'unit_code', label: 'Unit Code', type: 'text' },
        "date": { name: 'date', label: 'Reading Date', type: 'date' },
        "value": { name: 'value', label: 'Reading Value', type: 'number' },
        "deleted_by_name": { name: 'deleted_by_name', label: 'Deleted By', type: 'text' },
    }
}

module.exports = async (data) => {
    // if(!data?.sorted?.length)
    //     data.sorted = [ { id: 'date', desc: true } ];
        
    data = await db.filter('view_water_readings_deleted',data);
    data.rows.map(r=>{
        r.deleted_on = moment(r.deleted_on).format('MMM DD, YYYY hh:mm A');
        r.date = moment(r.date).format('MMMM DD, YYYY');
        // r.value = `${r.value} cu.m`
    });
    // data.rightElements = rightElements;
    data.search = search;
    return data;
}