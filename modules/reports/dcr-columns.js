const helper = require('../../helpers/column-helpers');
const options = require('../../buttons/water_readings');

module.exports = async (data) => {
    const columns = [
        {
            Header: 'OR #', accessor: 'or_number', width: 85,
            Cell: {
                componentName: 'Badge',
                propName: 'active',
                active: helper.badge({ color: 'success' }),
                voided: helper.badge({ color: 'danger', tooltip: { values: ['Voided by','voided_by_name','on','voided_on_display','with note "','void_notes','"']} }),
                customFunction: `cell.propName = row.original.voided_on ? 'voided':'active';`
            }
        },
        {
            Header: 'Unit Code', accessor: 'unit_code', width: 85,
            Cell: {
                componentName: 'Badge',
                propName: 'active',
                active: helper.badge({ color: 'primary' }),
            }
        },
        { Header: 'Consumer Name', accessor: 'name' },
        { 
            Header: 'Receipt Date', accessor: 'receipt_date_display', width: 10,
            Cell: {
                componentName: 'div',
                propName: 'normal',
                normal: { align: 'left' },
                totals: { align: 'left', style: { fontWeight: 'bold' } },
                customFunction: `cell.propName = row.original.totals ? 'totals':'normal'`
            }
        },
        {
            Header: 'Cash', accessor: 'cash_amount', width: 10,
            Cell: {
                componentName: 'div',
                propName: 'normal',
                normal: { align: 'left' },
                totals: { align: 'left', style: { fontWeight: 'bold' } },
                customFunction: `cell.propName = row.original.totals ? 'totals':'normal'`
            }
        },
        {
            Header: 'Online', accessor: 'online_amount', width: 10,
            Cell: {
                componentName: 'div',
                propName: 'normal',
                normal: { align: 'left' },
                totals: { align: 'left', style: { fontWeight: 'bold' } },
                customFunction: `cell.propName = row.original.totals ? 'totals':'normal'`
            }
        },
        { 
            Header: 'Check', accessor: 'check_amount', width: 10,
            Cell: {
                componentName: 'div',
                propName: 'normal',
                normal: { align: 'left' },
                totals: { align: 'left', style: { fontWeight: 'bold' } },
                customFunction: `cell.propName = row.original.totals ? 'totals':'normal'`
            }
        },
        {
            Header: 'Check / Ref #', accessor: 'check_number',
            Cell: {
                componentName: 'div',
                propName: 'normal',
                normal: { align: 'left' },
                customFunction: `cell.showTextValue = row.original.check_number || row.original.reference_number;`
            }
        },
        { Header: 'Notes', accessor: 'notes' },
        {
            Header: 'Void Notes', accessor: 'void_notes',
            Cell: {
                componentName: 'div',
                propName: 'normal',
                normal: { align: 'left', style: { color: 'red' } },
            }
        },
        
    ];
    return Promise.resolve(columns)
}