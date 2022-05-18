const helper = require('../../helpers/column-helpers');
const options = require('../../buttons/downloads_qr');
const DOWNLOAD_URL = process.env.DOWNLOAD_URL || "";
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
        { Header: 'Unit Code', accessor: 'unit_code', width: 70, },
        { Header: 'Name', accessor: 'name' },
        { Header: 'Type', accessor: 'type', width: 100 }
    ];
    return Promise.resolve(columns)
}