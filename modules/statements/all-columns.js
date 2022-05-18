const helper = require('../../helpers/column-helpers');
const options = require('../../buttons/water_statements');

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
        // {
        //     Header: 'ID', accessor: 'id', width: 50,
        // },
        {
            Header: 'Bill #', accessor: 'bill_number', width: 150,
            Cell: {
                componentName: 'Button',
                propName: 'active',
                active: helper.buttonLink({ href: `${process.env.DOWNLOAD_URL || ''}/api/pdf/waterbill/{id}/${uuid}/{unit_code}_{bill_number}`, color: 'success' }),
            }
        },
        { Header: 'Unit Code', accessor: 'unit_code', width: 100,
            Cell: {
                componentName: 'Button',
                propName: 'active',
                active: helper.buttonLink({ href: `${process.env.DOWNLOAD_URL || ''}/api/pdf/waterbill/{id}/${uuid}/{unit_code}_{bill_number}`, color: 'primary' }),
            }
        },
        { Header: 'Consumer Name', accessor: 'consumer_name' },
        { 
            Header: 'Consumption', accessor: 'total_cbm', width: 20,
            // Cell: {
            //     componentName: 'Badge',
            //     propName: 'active',
            //     active: helper.badge({ color: 'secondary' }),
            // }
        },
        { 
            Header: 'Billed Consumption', accessor: 'billed_cbm', width: 20,
            // Cell: {
            //     componentName: 'Badge',
            //     propName: 'active',
            //     active: helper.badge({ color: 'info' }),
            // }
        },
        { 
            Header: 'Total Due', accessor: 'total_amount_due', width: 120,
            Cell: {
                componentName: 'Button',
                propName: 'active',
                active: helper.buttonLink({ href: `${process.env.DOWNLOAD_URL || ''}/api/pdf/waterbill/{id}/${uuid}/{unit_code}_{bill_number}`, color: 'danger' }),
                voided: helper.buttonLink({ href: `${process.env.DOWNLOAD_URL || ''}/api/pdf/waterbill/{id}/${uuid}/{unit_code}_{bill_number}`, color: 'danger', outline: false }),
                customFunction: `
                    if(row.original.voided_on)
                        cell.propName = 'voided';
                    else
                        cell.propName = 'active';
                `
            }
        },
        { Header: 'Bill Date', accessor: 'bill_date', width: 100 },
        {
            Header: 'Period From', accessor: 'period_from', width: 100,
            Cell: {
                componentName: 'Badge',
                propName: 'active',
                active: helper.badge({ color: 'primary' }),
            }
        },
        {
            Header: 'Period To', accessor: 'period_to', width: 100,
            Cell: {
                componentName: 'Badge',
                propName: 'active',
                active: helper.badge({ color: 'success' }),
            }
        },
        { Header: 'Due Date', accessor: 'due_date', width: 100 },
        
    ];
    return Promise.resolve(columns)
}