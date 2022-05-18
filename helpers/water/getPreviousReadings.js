const { db } = require('../init');
const moment = require('moment');

module.exports = async (month, year) => {
    const previous_date = moment().set('month',month - 1).set('year',year).add(-1,'month');
    const previous_reading_month = previous_date.month() + 1;
    const previous_reading_year = previous_date.year();

    const from = moment().set('month',previous_reading_month - 1).set('year',previous_reading_year).startOf('month').format('YYYY-MM-DD HH:mm:ss');;
    const to = moment().set('month',previous_reading_month - 1).set('year',previous_reading_year).endOf('month').format('YYYY-MM-DD HH:mm:ss');

    let readings = await db("water_readings").whereBetween("date",[from,to]).orderBy('date','asc');
    const response = {};
    readings.map(r=>{
        response[r.consumer_id] = { 
            consumer_id: r.consumer_id,
            unit_code: r.unit_code,
            reading: r.value,
            date: moment(r.date).format("YYYY-MM-DD")
        };
    })
    readings = null;
    return response;
}