const helper = require('../../helpers/column-helpers');
const options = require('../../buttons/water_readings');

module.exports = async (data) => {
    const columns = [
        { showSelectRows: true, Header: "select" }, // header must be here or else ReactTable will throw an exception
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
            Header: 'Unit Code', accessor: 'unit_code', width: 85,
            Cell: {
                componentName: 'Badge',
                propName: 'prop',
                prop: helper.badge({ color: 'primary' }),
            }
        },
        { 
            Header: 'Date', accessor: 'date', width: 10,
            Cell: {
                componentName: 'Badge',
                propName: 'badge',
                badge: helper.badge({ color: 'info' }),
            }
        },
        { 
            Header: 'Reading', accessor: 'value', width: 150,
            Cell: {
                componentName: 'Div',
                propName: 'prop',
                prop: {
                    prop: {
                        html: 'hello'
                    }
                },
                customFunction: 'cell["prop"].prop.html = `<b>${row.original.value}</b>`;'
            }
        },
        { Header: 'Consumer Name', accessor: 'name' },
        { Header: 'Added By', accessor: 'added_by_name' },
        { Header: 'Added On', accessor: 'added_on' },
        
    ];
    return Promise.resolve(columns)
}