const { db } = require('../../helpers/init');
const path = require('path');
const fs = require('fs');
const downloads = path.join(__dirname, '../../downloads');
const generateAllQR = require('../../pdf/water/generate_QRs');
module.exports = async (data,req,res) => {
    res.setHeader('Content-Type', 'application/pdf');
    await generateAllQR.create(res);
    return { piped: true };
};