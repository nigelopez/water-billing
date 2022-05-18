const helper = require('../../helpers/column-helpers');
const buttons = require('../../buttons/settings.js');
const DOWNLOAD_URL = process.env.DOWNLOAD_URL || '';
module.exports = async (data) => {
    const columns = [
        // { 
        //     Header: 'Options', accessor: '_id', width: 60,
        //     headerClassName: 'overflow',
        //     Cell: {
        //         componentName: 'MultiOptions',
        //         propName: 'props1',
        //         props1: {
        //             options: buttons
        //         },
        //     }
        // },
        { 
            Header: 'Active', accessor: 'switch', width: 70,
            Cell: {
                componentName: 'Switch',
                propName: 'switch',
                switch: {
                    check: 'switch',
                    postData: ['id'],
                    updateUrl: `${DOWNLOAD_URL}/api/settings/update-yes-no-settings`,
                },
            }
        },
        { Header: 'Description', accessor: 'description' },
        { Header: 'Value', accessor: 'value', },
    ];
    return Promise.resolve(columns)
}