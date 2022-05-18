const helper = require('../../helpers/column-helpers');
const buttons = require('../../buttons/notifications.js');

module.exports = async (data) => {
    const columns = [
        { 
            Header: 'Options', accessor: '_id', width: 60,
            headerClassName: 'overflow',
            Cell: {
                componentName: 'MultiOptions',
                propName: 'props1',
                props1: {
                    options: buttons
                },
            }
        },
        {
            Header: 'Status', accessor: 'status_text', width: 60,
            Cell: {
                componentName: 'Badge',
                propName: 'failed',
                failed: helper.badge({ color: 'danger' })
            }
        },
        { Header: 'Unit Code', accessor: 'unit_code' },
        { Header: 'Consumer', accessor: 'consumer_name' },
        { Header: 'Email', accessor: 'email' },
        { Header: 'Message', accessor: 'message' },
        { Header: 'Bill Number', accessor: 'bill_number' },
        { Header: 'Bill Date', accessor: 'bill_date' },
        { Header: 'Requested By', accessor: 'requested_by_name' },
        { Header: 'Requested On', accessor: 'requested_on' },
        { Header: 'Processed On', accessor: 'processed_on' },
        
    ];
    return Promise.resolve(columns)
}