const { db, string } = require('../../helpers/init');
const moment = require('moment');
const rightElements = require('../../buttons/water_payments_right_elements');

const search = {
    fields: {
        "or_number": { name: 'or_number', label: 'OR Number', type: 'text' },
        "unit_code": { name: 'unit_code', label: 'Unit Code', type: 'text' },
        "name": { name: 'name', label: 'Consumer Name', type: 'text' },
        "receipt_date": { name: 'receipt_date', label: 'Receipt Date', type: 'date' },
        "type": { name: 'type', label: 'Mode of Payment', type: 'select', opt: ["CASH","CHECK","ONLINE"] },
        "amount": { name: 'amount', label: 'Amount', type: 'number' },
        "void_notes": { name: 'void_notes', label: 'Void Notes', type: 'text' },
        "voided_on": { name: 'voided_on', label: 'Date Voided', type: 'date' },
        "voided_by_name": { name: 'added_by_name', label: 'Voided By', type: 'text' },
    }
}
module.exports = async (data) => {
    if(!data?.sorted?.length)
        data.sorted_by_raw = `receipt_date DESC, added_on DESC`;
    if(!data.filtered)
        data.filtered = [];
    data.filtered.push({ id: 'voided_on', type: 'whereNotNull' });
        
    data = await db.filter('view_water_payments',data);
    data.rows.map(r=>{
        r.added_on = moment(r.added_on).format('MMM DD, YYYY hh:mm A');
        r.amount = string.currencyFormat(r.amount);
        r.receipt_date = moment(r.receipt_date).format("MMMM DD, YYYY");
        r.voided_on = r.voided_on && moment(r.voided_on).format('MMM DD, YYYY hh:mm A');
    });
    data.rightElements = rightElements;
    data.search = search;
    return data;
}