const { db } = require('../../helpers/init');
const rightElements = require('../../buttons/water_statements_cancelled_right_elements');
const moment = require('moment');
const forEach = require('async-foreach').forEach;
const string = require('../../helpers/string');

const search = {
    fields: {
        "bill_number": { name: 'bill_number', label: 'Bill Number', type: 'text' },
        "unit_code": { name: 'unit_code', label: 'Unit Code', type: 'text' },
        "name": { name: 'name', label: 'Consumer Name', type: 'text' },
        "billed_cbm": { name: 'billed_cbm', label: 'Consumption', type: 'number' },
        "bill_date": { name: 'bill_date', label: 'Billing Date', type: 'date' },
        "total_amount_due": { name: 'total_amount_due', label: 'Amount Due', type: 'number' },
        "period_from": { name: 'period_from', label: 'Period From', type: 'date' },
        "period_to": { name: 'period_to', label: 'Period To', type: 'date' },
        "voided_on": { name: 'voided_on', label: 'Date Voided', type: 'date' },
        "voided_by_name": { name: 'voided_by_name', label: 'Voided By', type: 'text' },
    }
}

module.exports = async (data) => {
    if(!data.filtered)
        data.filtered = [];
    data.filtered.push({ id: 'voided_on', type: 'whereNotNull' });
    data = await db.filter('view_water_statements',data);
    data.rows.map(r=>{
        r.total_amount_due = string.currencyFormat(r.total_amount_due);
        r.voided_on = moment(r.voided_on).format("MMM DD, YYYY hh:mm A");
        r.bill_date = moment(r.bill_date).format("MMM DD, YYYY");
        r.due_date = moment(r.due_date).format("MMM DD, YYYY");
        r.period_from = moment(r.period_from).format("MMM DD, YYYY");
        r.period_to = moment(r.period_to).format("MMM DD, YYYY");
        r.billed_cbm = `${r.billed_cbm} cu.m`
    })
    data.search = search;
    data.rightElements = rightElements;
    return data;
}
