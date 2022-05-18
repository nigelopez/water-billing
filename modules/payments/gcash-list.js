const { db, string } = require('../../helpers/init');

const search = {
    fields: {
        "or_number": { name: 'or_number', label: 'OR Number', type: 'text' },
        "status_display": { name: 'status_display', label: 'Status', type: 'select', opt: ["pending","paid","Missing OR"] },
        "unit_code": { name: 'unit_code', label: 'Unit Code', type: 'text' },
        "name": { name: 'name', label: 'Consumer Name', type: 'text' },
        "amount": { name: 'amount', label: 'Amount', type: 'number' },
        "billing_number": { name: 'billing_number', label: 'Statement Number', type: 'text' },
        "reference": { name: 'reference', label: 'Gcash Reference #', type: 'text' },
        "timestamp": { name: 'timestamp', label: 'Date Paid', type: 'date' },
        "response_message": { name: 'response_message', label: 'Gcash Response', type: 'text' },
    }
}

module.exports = async (data) => {
    data = await db.filter('view_gcash_requests',data);
    data.search = search;
    return data;
}