const helper = require('../../helpers/column-helpers');

module.exports = async (data) => {
    const columns = [
        { 
            Header: 'OR #', accessor: 'or_number', width: 100,
        },
        { 
            Header: 'Unit Code', accessor: 'unit_code', width: 100,
            Cell: {
                componentName: 'Badge',
                propName: 'voided',
                voided: helper.badge({ color: 'danger', outline: false }),
            }
        },
        { 
            Header: 'Receipt Date', accessor: 'receipt_date', width: 130,
        },
        { Header: 'Name', accessor: 'name', width: 200 },
        { 
            Header: 'Type', accessor: 'type', width: 60,
            Cell: {
                componentName: 'Badge',
                propName: 'CASH',
                CASH: helper.badge({ color: 'success', align: 'center' }),
                ONLINE: helper.badge({ color: 'info', align: 'center' }),
                CHECK: helper.badge({ color: 'warning', align: 'center' }),
                customFunction:`cell.propName = row.original.type;`
            }
        },
        { 
            Header: 'Amount', accessor: 'amount', width: 150,
        },
        { Header: 'Voided By', accessor: 'voided_by_name' },
        { Header: 'Voided On', accessor: 'voided_on' },
        {
            Header: 'Voided Reason', accessor: 'void_notes',
            Cell: {
                componentName: 'Badge',
                propName: 'void',
                void: helper.badge({ color: 'danger' })
            }
        },
        { Header: 'Added On', accessor: 'added_on', width: 150 },
        { Header: 'Added By', accessor: 'added_by_name' },
        { Header: 'Payment Notes', accessor: 'notes' },
    ];
    return Promise.resolve(columns)
}