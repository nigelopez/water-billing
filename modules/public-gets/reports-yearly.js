const yearly = require('../../pdf/reports/yearly');

module.exports = async (data,req,res) => {
    yearly(res,data.year);
    return { piped: true };
};