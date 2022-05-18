const helper = require('../../helpers/column-helpers');
const options = require('../../buttons/water_utility_bills');

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
            Header: 'Type', accessor: 'type', width: 85,
            Cell: {
                componentName: 'Button',
                propName: 'others',
                water: helper.buttonSimple({ color: 'info', outline: false }),
                electric: helper.buttonSimple({ color: 'warning', outline: false }),
                others: helper.buttonSimple({ color: 'secondary', outline: false }),
                customFunction: `
                    cell.propName = row.original.type;
                `
            }
        },
        { 
            Header: 'Month & Year', accessor: 'month_year', width: 100,
            Cell: {
                componentName: 'Badge',
                propName: 'prop',
                prop: helper.badge({ color: 'primary' }),
            }
        },
        { 
            Header: 'Charge / CBM', accessor: 'charge_per_cbm', width: 100,
            Cell: {
                componentName: 'Badge',
                propName: 'active',
                active: helper.badge({ color: 'success', align: 'center', style: { fontSize: '11px' } }),
                voided: helper.badge({ color: 'danger', style: { fontSize: '11px' }, align: 'center' }),
                customFunction: `
                    if(row.original.voided_on)
                        cell.propName = 'voided';
                    else
                        cell.propName = 'active';
                `
            }
        },
        {
            Header: 'Water Consumption', accessor: 'water_consumption', width: 140,
            Cell: {
                componentName: 'Badge',
                propName: 'active',
                active: helper.badge({ color: 'warning', align: 'center', style: { fontSize: '11px' } }),
                voided: helper.badge({ color: 'danger', style: { fontSize: '11px' }, align: 'center' }),
                customFunction: `
                    if(row.original.voided_on)
                        cell.propName = 'voided';
                    else
                        cell.propName = 'active';
                `
            }
        },
        {
            Header: 'Water Fee', accessor: 'water_fee', width: 110,
            Cell: {
                componentName: 'Badge',
                propName: 'active',
                active: helper.badge({ color: 'info', align: 'center', style: { fontSize: '11px' } }),
                voided: helper.badge({ color: 'danger', style: { fontSize: '11px' }, align: 'center' }),
                customFunction: `
                    if(row.original.voided_on)
                        cell.propName = 'voided';
                    else
                        cell.propName = 'active';
                `
            }
        },
        { 
            Header: 'Billed Amount', accessor: 'current_bill', width: 130,
            Cell: {
                componentName: 'Button',
                propName: 'active',
                active: helper.buttonSimple({ color: 'primary', outline: false })
            }
        },
        
        { Header: 'Added By', accessor: 'added_by_name', width: 100 },
        { Header: 'Added On', accessor: 'added_on' },
        
    ];
    return Promise.resolve(columns)
}