const { db } = require('../../helpers/init');
const path = require('path');
const fs = require('fs');
const downloads = path.join(__dirname, '../../downloads');
const mcr = require('../../pdf/reports/mcr');

module.exports = async (data,req,res) => {
    mcr(res,data.date);
    return { piped: true };
};