const helper = require('../../helpers/column-helpers');
const buttons = require('../../buttons/settings_notifications.js');

module.exports = async (data) => {
    const columns = [
        { 
            Header: 'Options', accessor: '_id', width: 60,
            headerClassName: 'overflow',
            Cell: {
                componentName: 'MultiOptions',
                propName: 'props1',
                props1: {
                    options: buttons
                },
            }
        },
        { Header: 'Description', accessor: 'description' },
        { Header: 'Value', accessor: 'value', },
    ];
    return Promise.resolve(columns)
}