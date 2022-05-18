const helper = require('../../helpers/column-helpers');
const buttons = require('../../buttons/menus.js');

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
        { Header: 'ID', accessor: 'id', width: 70, },
        { Header: 'Icon', accessor: 'icon', width: 80, },
        { Header: 'Label', accessor: 'label', width: 100 },
        { Header: 'Location', accessor: 'to' },
        { Header: 'Component', accessor: 'component' },
        { Header: 'Props', accessor: 'component_props' },
        { Header: 'Right Elements', accessor: 'right_elements' },
        { Header: 'Added On', accessor: 'added_on'},
    ];
    return Promise.resolve(columns)
}