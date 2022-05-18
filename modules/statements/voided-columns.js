const helper = require('../../helpers/column-helpers');

module.exports = async (data) => {
    const { uuid } = data.credentials;
    const columns = [
        // {
        //     Header: 'ID', accessor: 'id', width: 50,
        // },
        {
            Header: 'Bill #', accessor: 'bill_number', width: 150,
            Cell: {
                componentName: 'Button',
                propName: 'voided',
                voided: helper.buttonLink({ href: `${process.env.DOWNLOAD_URL || ''}/api/pdf/waterbill/{id}/${uuid}/{unit_code}_{bill_number}`, color: 'danger', outline: false }),
            }
        },
        { Header: 'Unit Code', accessor: 'unit_code', width: 100,
            Cell: {
                componentName: 'Button',
                propName: 'active',
                active: helper.buttonLink({ href: `${process.env.DOWNLOAD_URL || ''}/api/pdf/waterbill/{id}/${uuid}/{unit_code}_{bill_number}`, color: 'primary' }),
            }
        },
        { Header: 'Name', accessor: 'consumer_name' },
        { 
            Header: 'Total Due', accessor: 'total_amount_due', width: 120,
            Cell: {
                componentName: 'Button',
                propName: 'active',
                active: helper.buttonLink({ href: `${process.env.DOWNLOAD_URL || ''}/api/pdf/waterbill/{id}/${uuid}/{unit_code}_{bill_number}`, color: 'danger' })
            }
        },
        {
            Header: 'Voided By', accessor: 'voided_by_name', width: 100,
        },
        {
            Header: 'Voided On', accessor: 'voided_on', width: 100,
        },
        {
            Header: 'Notes', accessor: 'void_reasons', width: 100, 
            Cell: {
                componentName: 'Badge',
                propName: 'badge',
                badge: helper.badge({ color: 'danger' })
            }
        },
        {
            Header: 'Period From', accessor: 'period_from', width: 100,
            // Cell: {
            //     componentName: 'Badge',
            //     propName: 'active',
            //     active: helper.badge({ color: 'primary', align: 'center', style: { fontSize: '11px' } }),
            // }
        },
        {
            Header: 'Period To', accessor: 'period_to', width: 100,
            // Cell: {
            //     componentName: 'Badge',
            //     propName: 'active',
            //     active: helper.badge({ color: 'success', align: 'center', style: { fontSize: '11px' } }),
            // }
        },
        { 
            Header: 'Consumption', accessor: 'billed_cbm', width: 100,
            // Cell: {
            //     componentName: 'Badge',
            //     propName: 'active',
            //     active: helper.badge({ color: 'info', align: 'center', style: { fontSize: '11px' } }),
            // }
        },
        { Header: 'Bill Date', accessor: 'bill_date', width: 100 },
        { Header: 'Due Date', accessor: 'due_date', width: 100 },
        
    ];
    return Promise.resolve(columns)
}