const helper = require('../../helpers/column-helpers');
const options = require('../../buttons/users');

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
        { Header: 'ID', accessor: 'id', width: 50, },
        {
            Header: 'Status', accessor: 'status', width: 100,
            Cell: {
                componentName: 'Badge',
                propName: 'active',
                active: helper.badge({ color: 'success', align: 'center' }),
                suspended: helper.badge({ color: 'danger', align: 'center' }),
                customFunction: `cell.propName = row.original.status;`
            }
        },
        { Header: 'Username', accessor: 'username', width: 100, },
        { Header: 'First Name', accessor: 'first_name' },
        { Header: 'Last Name', accessor: 'last_name' },
        
    ];
    return Promise.resolve(columns)
}