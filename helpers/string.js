const currencyFormatter = require('currency-formatter');
const moment = require('moment');
const x = {};

x.currencyFormat = (amount, format = '%s') => {
    return currencyFormatter.format(amount, { code: process.env.CURRENCY || 'PHP', format: `${format} %v` })
}

x.numberWithCommas = (x,decimals = 2) => {
    return Number(x).toFixed(decimals).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

x.getCurrencySymbol = (currency = process.env.CURRENCY || "PHP") => {
    return currencyFormatter.findCurrency(currency)?.symbol;
}

x.addLeadingZeros = (number, zeroes = 4) => String(number).padStart(zeroes, '0');

x.validateDate = (date = '') => {
    if(date.length !== 10)
        throw new Error(`Invalid date`);
    date = date.split('-');
    if(date.length !== 3)
        throw new Error(`Invalid date!`);
    date = moment(date.join('-'));
    if(!date.isValid())
        throw new Error(`Invalid date!`);
    return date;
}

x.validateEmail = email => {
    return String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
}

x.getDownloadURL = process.env.DOWNLOAD_URL || "";
module.exports = x;