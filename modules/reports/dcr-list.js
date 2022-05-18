const { db, string } = require('../../helpers/init');
const moment = require('moment');
const forEach = require('async-foreach').forEach;
const rightElements = require('../../buttons/reports_dcr_right_elements');


const search = {
    fields: {
        "receipt_date": { name: 'receipt_date', label: 'Receipt Date', type: 'date', labelFrom: "Select Date", single: true },
    }
}

module.exports = async (data) => {
    const { uuid } = data.credentials;
    let receipt_date;
    if(data.searchForm){
        receipt_date = data.searchForm.from;
    }

    if(!receipt_date)
        receipt_date = moment().format("YYYY-MM-DD");
    
    receipt_date = string.validateDate(receipt_date).format("YYYY-MM-DD");

    if(!data.filtered)
        data.filtered = [];

    data.filtered.map((d,i)=>{
        if(d.id === "receipt_date")
            delete data.filtered[i];
    });

    data.filtered.push({ id: "receipt_date", value: receipt_date });

    data.pageSize = 9999;
    data = await db.filter('view_water_payments',data);
    let totals = {
        cash: 0,
        check: 0,
        online: 0,
        totals: true
    }
    data.rows.map(r=>{
        if(!r.voided_on){
            r.type = r.type.toLowerCase();
            if(!totals[r.type])
                totals[r.type] = 0;
            totals[r.type] += r.amount;
        }
        r.or_number = string.addLeadingZeros(r.or_number);
    });
    Object.keys(totals).map(k=>{
        totals[`${k}_amount`] = string.currencyFormat(totals[k]);
    });
    totals.receipt_date_display = 'Overall Total';
    data.rows.push(totals);

    // update download link of the rightElement
    rightElements[0].aProps.href = `${string.getDownloadURL}/api/public-gets/reports-dcr/?uuid=${uuid}&date=${receipt_date}`;
    data.rightElements = rightElements;
    data.search = search;
    return data;
}