const helper = require('../../helpers/column-helpers');
const options = require('../../buttons/gcash_requests_columns');

module.exports = async (data) => {
    const { uuid } = data.credentials;
    const columns = [
        { 
            Header: 'Options', accessor: '_id', width: 60,
            filterable: false,
            headerClassName: 'overflow',
            Cell: {
                componentName: 'MultiOptions',
                propName: 'props1',
                props1: { options },
            }
        },
        { 
            Header: 'Status', accessor: 'status_display', width: 100,
            Cell: {
                componentName: 'Badge',
                propName: 'pending',
                pending: helper.badge({ color: 'warning' }),
                'Missing OR': helper.badge({ color: 'danger' }),
                'paid': helper.badge({ color: 'success' }),
                customFunction: `cell.propName = row.original.status_display`
            }
        },
        { 
            Header: 'OR #', accessor: 'or_number', width: 100,
        },
        { 
            Header: 'Unit Code', accessor: 'unit_code', width: 100,
        },
        { Header: 'Name', accessor: 'name', width: 100 },
        { 
            Header: 'Statement #', accessor: 'billing_number', width: 50,
            Cell: {
                componentName: 'Button',
                propName: 'active',
                active: helper.buttonLink({ href: `${process.env.DOWNLOAD_URL || ''}/api/pdf/waterbill/{id}/${uuid}/{unit_code}_{billing_number}`, color: 'primary' }),
            }
        },
        { 
            Header: 'Amount', accessor: 'amount_display', width: 150,
        },
        { Header: 'Gcash Ref #', accessor: 'reference' },
        { Header: 'Response', accessor: 'response_message' },
        { 
            Header: 'Amount Paid', accessor: 'amount_paid_display',
            Cell: helper.divCenter({ align: 'left', bold: true })
        },
        { Header: 'Date Paid', accessor: 'timestamp_display' },
    ];
    return Promise.resolve(columns)
}