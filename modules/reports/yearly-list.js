const { db, string, myForEach } = require('../../helpers/init');
const moment = require('moment');
const rightElements = require('../../buttons/reports_yearly_right_elements');
const generate = require('./generateMonthReport');

const search = {
    fields: {
        "year": { name: 'year', label: 'Year', type: 'number', labelFrom: "Year", single: true },
    }
}

const months = [1,2,3,4,5,6,7,8,9,10,11,12];

module.exports = async (data) => {
    const { uuid } = data.credentials;
    let year = moment().year();
    if(data.searchForm){
        year = Number(data.searchForm.from);
    }

    data.pageSize = 9999;
    const rows = [];
    let totals = {
        month: 'Overall Total',
        generated: 0,
        consumption: 0,
        billed: 0,
        loss: 0,
        receivables: 0,
        expenses: 0,
        income: 0,
        bold: true
    };
    await db.transaction(async trx=>{
        await myForEach(months,async (month) => {
            const x = await generate(trx,month,year);

            totals.generated += x.generated;
            totals.consumption += x.consumption;
            totals.billed += x.billed;
            totals.loss += x.loss;
            totals.receivables += x.receivables;
            totals.expenses += x.expenses;
            totals.income += x.income;

            x.generated = x.generated && string.numberWithCommas(x.generated,1) || '-';
            x.consumption = x.consumption && string.numberWithCommas(x.consumption,1) || '-';
            x.loss = x.loss && string.numberWithCommas(x.loss,1) || '-';
            x.billed = x.billed && string.numberWithCommas(x.billed,1) || '-';
            x.receivables = x.receivables && string.currencyFormat(x.receivables) || '-';
            x.expenses = x.expenses && string.currencyFormat(x.expenses) || '-';
            x.income = x.income && string.currencyFormat(x.income) || '-';
            rows.push(x);
        },{ rejectOnError: true });
    });

    totals.generated = totals.generated && string.numberWithCommas(totals.generated,1) || '-';
    totals.consumption = totals.consumption && string.numberWithCommas(totals.consumption,1) || '-';
    totals.loss = totals.loss && string.numberWithCommas(totals.loss,1) || '-';
    totals.billed = totals.billed && string.numberWithCommas(totals.billed,1) || '-';
    totals.receivables = totals.receivables && string.currencyFormat(totals.receivables) || '-';
    totals.expenses = totals.expenses && string.currencyFormat(totals.expenses) || '-';
    totals.income = totals.income && string.currencyFormat(totals.income) || '-';

    rows.push(totals);

    // update download link of the rightElement
    rightElements[0].aProps.href = `${string.getDownloadURL}/api/public-gets/reports-yearly/?uuid=${uuid}&year=${year}`;

    data = {
        pageSize: 9999,
        rows,
        search,
        rightElements
    }
    return data;
}