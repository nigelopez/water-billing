const helper = require('../../helpers/column-helpers');

module.exports = async (data) => {
    const columns = [
        {
            Header: 'Unit Code', accessor: 'unit_code', width: 85,
            Cell: {
                componentName: 'Badge',
                propName: 'prop',
                prop: helper.badge({ color: 'danger' }),
            }
        },
        { Header: 'Consumer Name', accessor: 'name' },
        { 
            Header: 'Date', accessor: 'date', width: 10,
            Cell: {
                componentName: 'Badge',
                propName: 'badge',
                badge: helper.badge({ color: 'primary' }),
            }
        },
        { 
            Header: 'Reading', accessor: 'value', width: 10,
            Cell: helper.divCenter({ align: 'left', bold: true })
        },
        { Header: 'Deleted By', accessor: 'deleted_by_name' },
        { Header: 'Deleted On', accessor: 'deleted_on' },
        
    ];
    return Promise.resolve(columns)
}