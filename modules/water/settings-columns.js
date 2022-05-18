const helper = require('../../helpers/column-helpers');
const options = require('../../buttons/water_settings');

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
        { Header: 'ID', accessor: 'id', width: 70, },
        { Header: 'Name', accessor: 'name', width: 100 },
        { Header: 'Description', accessor: 'description' },
        { Header: 'Value', accessor: 'value', width: 300 },
        
    ];
    return Promise.resolve(columns)
}