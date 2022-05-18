const helper = require('../../helpers/column-helpers');
const options = require('../../buttons/water_readings');

module.exports = async (data) => {
    const columns = [
        {
            Header: 'Month Year', accessor: 'month', width: 85,
        },
        {
            Header: 'Total Generated', accessor: 'generated', width: 85,
        },
        {
            Header: 'Total Consumption', accessor: 'consumption', width: 85,
        },
        {
            Header: 'Total Loss', accessor: 'loss', width: 85,
            Cell: {
                componentName: 'div',
                propName: 'prop',
                prop: { align: 'left', style: { color: 'red' } },
            }
        },
        {
            Header: 'Total Billed', accessor: 'billed', width: 85,
        },
        {
            Header: 'Total Receivables', accessor: 'receivables', width: 85,
        },
        {
            Header: 'Total Expenses', accessor: 'expenses', width: 85,
            Cell: {
                componentName: 'div',
                propName: 'prop',
                prop: { align: 'left', style: { color: 'red' } },
            }
        },
        {
            Header: 'Total Income', accessor: 'income', width: 85,
            Cell: {
                componentName: 'div',
                propName: 'prop',
                prop: { align: 'left', style: { fontWeight: 'bold' } },
            }
        },
        
    ];
    return Promise.resolve(columns)
}