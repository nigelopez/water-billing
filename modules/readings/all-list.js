const { db } = require('../../helpers/init');
const moment = require('moment');
const forEach = require('async-foreach').forEach;
const string = require('../../helpers/string');
const rightElements = require('../../buttons/water_readings_right_elements');

const selectOptions = require(`../../buttons/readings-active-select-options`);

const search = {
    fields: {
        "name": { name: 'name', label: 'Consumer Name', type: 'text' },
        "unit_code": { name: 'unit_code', label: 'Unit Code', type: 'text' },
        "date": { name: 'date', label: 'Reading Date', type: 'date' },
        "value": { name: 'value', label: 'Reading Value', type: 'number' },
    }
}

module.exports = async (data) => {
    if(!data?.sorted?.length)
        data.sorted = [ { id: 'date', desc: true } ];
        
    data = await db.filter('view_water_readings',data);
    data.rows.map(r=>{
        r.added_on = moment(r.added_on).format('MMM DD, YYYY hh:mm A');
        r.date = moment(r.date).format('MMMM DD, YYYY');
        // r.value = `${r.value} cu.m`
    });

    data.rightElements = rightElements;
    data.selectOptions = selectOptions;
    data.search = search;
    return data;
}