const { db, string } = require('../../helpers/init');
const moment = require('moment');
const forEach = require('async-foreach').forEach;
const rightElements = require('../../buttons/consumers_right_elements');

const search = {
    fields: {
        "allow_billing": { name: 'allow_billing', label: 'Status', type: 'select', opt: ['active','inactive'] },
        "unit_code": { name: 'unit_code', label: 'Unit Code', type: 'text' },
        "name": { name: 'name', label: 'Consumer Name', type: 'text' },
        "type": { name: 'type', label: 'Type / Model', type: 'text' },
        "current_balance": { name: 'current_balance', label: 'Current Balance', type: 'number' },
        "meter_number": { name: 'meter_number', label: 'Meter Number', type: 'text' },
        "email": { name: 'email', label: 'Email Address', type: 'text' },
        "number": { name: 'number', label: 'Phone Number', type: 'text' },
    }
}

module.exports = async (data) => {
    if(!data?.sorted?.length)
        data.sorted_by_raw = `added_on DESC, unit_code ASC`;
    if(!data.filtered)
        data.filtered = [];
    // data.filtered.push({ id: 'suspended', value: 0 });
    data.filtered.map(f=>{
        if(f.id === "allow_billing")
            f.value = f.value == "active" ? 1:0;
    });
    data = await db.filter('view_water_consumers',data);
    // data.rows.map(r=>{
    //     r.has_balance = r.current_balance > 0 ? true:false;
    //     r.current_balance = string.currencyFormat(r.current_balance);
    // });
    data.search = search;
    data.rightElements = rightElements;
    return data;
}
