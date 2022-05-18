const helper = require('../../helpers/column-helpers');
const options = require('../../buttons/water_consumers_suspended');

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
        { 
            Header: 'Balance', accessor: 'current_balance', width: 120,
            Cell: {
                componentName: "Button",
                propName: "suspended",
                suspended: helper.buttonSimple({ color: 'danger', outline: false }),
            }
        },
        { Header: 'Suspended By', accessor: 'suspended_by_name', width: 100 },
        { Header: 'Notes', accessor: 'suspension_reason' },
        { Header: 'Meter #', accessor: 'meter_number', width: 100 },
        { Header: 'Email', accessor: 'email' },
        { Header: 'Phone', accessor: 'number' },
        
    ];
    return Promise.resolve(columns)
}