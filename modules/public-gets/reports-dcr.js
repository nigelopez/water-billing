const { db } = require('../../helpers/init');
const path = require('path');
const fs = require('fs');
const downloads = path.join(__dirname, '../../downloads');
const dcr = require('../../pdf/reports/dcr');

module.exports = async (data,req,res) => {
    dcr(res,data.date);
    return { piped: true };
};