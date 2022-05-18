const helper = require('../../helpers/column-helpers');
const options = require('../../buttons/water_consumers');
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
        { 
            Header: 'Status', accessor: 'suspended', width: 70,
            Cell: {
                componentName: 'Switch',
                propName: 'switch',
                switch: {
                    check: 'allow_billing',
                    postData: ['id'],
                    updateUrl: `${DOWNLOAD_URL}/api/consumers/allow-billing`,
                },
                // customFunction: `cell.switch.props.check = row.original.suspended == 0`
            }
        },
        { Header: 'Unit Code', accessor: 'unit_code', width: 70, },
        { Header: 'Name', accessor: 'name' },
        { Header: 'Date of Turnover', accessor: 'turnover_date_display' },
        { Header: 'Type', accessor: 'type', width: 100 },
        { 
            Header: 'Balance', accessor: 'current_balance_display', width: 120,
            Cell: {
                componentName: "Button",
                propName: "no_balance",
                no_balance: helper.buttonSimple({ color: 'success', outline: false }),
                has_balance: helper.buttonSimple({ color: 'info', outline: false }),
                customFunction: `cell.propName = row.original.has_balance ? 'has_balance':'no_balance';`
            }
        },
        // { Header: 'Notes', accessor: 'suspension_reason' },
        { Header: 'Meter #', accessor: 'meter_number', width: 100 },
        { Header: 'Email', accessor: 'email' },
        { Header: 'Phone', accessor: 'number' },
        
    ];
    return Promise.resolve(columns)
}