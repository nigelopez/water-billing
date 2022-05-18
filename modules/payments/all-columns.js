const helper = require('../../helpers/column-helpers');
const options = require('../../buttons/water_payments');

module.exports = async (data) => {
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
            Header: 'OR #', accessor: 'or_number', width: 100,
            Cell: {
                componentName: 'Badge',
                propName: 'voided',
                active: helper.badge({ color: 'primary' }),
                voided: helper.badge({ color: 'danger', outline: false }),
                customFunction:`cell.propName = row.original.voided_on ? 'voided':'active';`
            }
        },
        { 
            Header: 'Unit Code', accessor: 'unit_code', width: 100,
        },
        { Header: 'Name', accessor: 'name', width: 200 },
        { 
            Header: 'Receipt Date', accessor: 'receipt_date_display', width: 130,
            Cell: helper.divCenter({ align: 'left', bold: true })
        },
        { 
            Header: 'Mode of Payment', accessor: 'type', width: 60,
            // Cell: {
            //     componentName: 'Badge',
            //     propName: 'CASH',
            //     CASH: helper.badge({ color: 'success' }),
            //     ONLINE: helper.badge({ color: 'info' }),
            //     CHECK: helper.badge({ color: 'warning' }),
            //     customFunction:`cell.propName = row.original.type;`
            // }
        },
        { 
            Header: 'Amount', accessor: 'amount', width: 150,
            Cell: {
                componentName: 'Badge',
                propName: 'active',
                active: helper.badge({ color: 'success' }),
                cancelled: helper.badge({ color: 'danger', tooltip: { values: ['Voided by','voided_by_name','on','voided_on_display','with note "','void_notes','"'], id: 'amount' }}),
                showValue: 'amount_display',
                customFunction:`cell.propName = row.original.status_display;`
            }
        },
        { Header: 'Payment Notes', accessor: 'notes' },
        {
            Header: 'Added On', accessor: 'added_on_display',
            Cell: helper.divCenter({ align: 'left', bold: false })
        },
        { Header: 'Added By', accessor: 'added_by_name' },
        { 
            Header: 'Status', accessor: 'status_display',
            Cell: {
                componentName: 'Badge',
                cancelled: helper.badge({ color: 'danger', tooltip: { values: ['Voided by','voided_by_name','on','voided_on_display','with note "','void_notes','"'], id: 'amount' }}),
                active: helper.badge({ color: 'success' }),
                customFunction:`cell.propName = row.original.status_display`
            }
        },
        
    ];
    return Promise.resolve(columns)
}