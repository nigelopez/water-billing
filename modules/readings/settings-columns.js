const helper = require('../../helpers/column-helpers');
const options = require('../../buttons/readings_settings');

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
            Header: 'Description', accessor: 'description', width: 85,
        },
        { Header: 'Value', accessor: 'value' },
    ];
    return Promise.resolve(columns)
}