const { db, string } = require('../../helpers/init');
const moment = require('moment');
const forEach = require('async-foreach').forEach;
const rightElements = require('../../buttons/reports_mcr_right_elements');

const search = {
    fields: {
        "month_year": { name: 'month_year', label: 'Month Year', type: 'month_year', labelFrom: "Select Date", single: true },
    }
}

module.exports = async (data) => {
    const { uuid } = data.credentials;
    let month_year;
    if(data.searchForm){
        month_year = data.searchForm.from;
    }
    if(!month_year)
        month_year = moment().format("YYYY-MM-DD");
    
    month_year = string.validateDate(month_year);

    if(!data.filtered)
        data.filtered = [];
    
    data.filtered.map((d,i)=>{
        if(d.id === "month_year")
            delete data.filtered[i];
    });

    data.filtered.push({ id: "receipt_date", operator: "between", value: [month_year.startOf("month").format("YYYY-MM-DD"),month_year.endOf("month").format("YYYY-MM-DD")] });
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
    rightElements[0].aProps.href = `${string.getDownloadURL}/api/public-gets/reports-mcr/?uuid=${uuid}&date=${month_year.format("YYYY-MM-01")}`;
    data.rightElements = rightElements;
    data.search = search;
    return data;
}