const helper = require('../../helpers/column-helpers');
const buttons = require('../../buttons/notifications.js');

module.exports = async (data) => {
    const columns = [
        {
            Header: 'Status', accessor: 'status_text', width: 60,
            Cell: {
                componentName: 'Badge',
                propName: 'sent',
                sent: helper.badge({ color: 'success' })
            }
        },
        { Header: 'Unit Code', accessor: 'unit_code' },
        { Header: 'Consumer', accessor: 'consumer_name' },
        { Header: 'Email', accessor: 'email' },
        { Header: 'Bill Number', accessor: 'bill_number' },
        { Header: 'Bill Date', accessor: 'bill_date' },
        { Header: 'Response', accessor: 'message' },
        { Header: 'Requested By', accessor: 'requested_by_name' },
        { Header: 'Requested On', accessor: 'requested_on' },
        { Header: 'Processed On', accessor: 'processed_on' },
    ];
    return Promise.resolve(columns)
}