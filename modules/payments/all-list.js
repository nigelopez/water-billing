const { db, string } = require('../../helpers/init');
const rightElements = require('../../buttons/water_payments_right_elements');

const search = {
    fields: {
        "or_number": { name: 'or_number', label: 'OR Number', type: 'text' },
        "unit_code": { name: 'unit_code', label: 'Unit Code', type: 'text' },
        "name": { name: 'name', label: 'Consumer Name', type: 'text' },
        "receipt_date": { name: 'receipt_date', label: 'Receipt Date', type: 'date' },
        "type": { name: 'type', label: 'Mode of Payment', type: 'select', opt: ["CASH","CHECK","ONLINE"] },
        "amount": { name: 'amount', label: 'Amount', type: 'number' },
        "notes": { name: 'notes', label: 'Payment Notes', type: 'text' },
        "added_on": { name: 'added_on', label: 'Added On', type: 'date' },
        "added_by_name": { name: 'added_by_name', label: 'Added By', type: 'text' },
        "status_display": { name: 'status_display', label: 'Status', type: 'select', opt: ["cancelled","active"] },
    }
}

module.exports = async (data) => {
    data.filtered?.map(d=>{
        if(d.id === "or_number")
            d.value = Number(d.value) || d.value;
    })
    data = await db.filter('view_water_payments',data);
    data.rows.map(r=>{
        r.or_number = string.addLeadingZeros(r.or_number);
    })
    data.rightElements = rightElements;
    data.search = search;
    return data;
}