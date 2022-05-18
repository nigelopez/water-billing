const { db } = require('../../helpers/init');
const moment = require('moment');

const search = {
    fields: {
        "unit_code": { name: 'unit_code', label: 'Unit Code', type: 'text' },
        "consumer_name": { name: 'consumer_name', label: 'Consumer Name', type: 'text' },
        "email": { name: 'email', label: 'Email Address', type: 'text' },
        "bill_number": { name: 'bill_number', label: 'Bill Number', type: 'text' },
        "requested_by_name": { name: 'requested_by_name', label: 'Requested By', type: 'text' },
        "requested_on": { name: 'requested_on', label: 'Date Requested', type: 'date' }
    }
}

const rightElements = require('../../buttons/notifications_right_elements');

module.exports = async (data) => {
    if(!data.filtered)
        data.filtered = [];

    data = await db.filter('view_water_notifications_pending',data);
    data.rows.map(r=>{
        r.bill_date = moment(r.bill_date).format("MMMM DD, YYYY");
        r.requested_on = moment(r.requested_on).format("MMMM DD, YYYY hh:mm a");
    });
    
    data.rightElements = rightElements;
    data.search = search;
    return data;
}
