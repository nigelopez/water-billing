const helper = require('../../helpers/column-helpers');
const options = require('../../buttons/readings_uploaded');

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
            Header: 'Status',
            width: 10,
            accessor: 'status'
        },
        {
            Header: 'Unit Code', accessor: 'unit_code', width: 85,
            Cell: {
                componentName: 'Badge',
                propName: 'pending',
                pending: helper.badge({ color: 'secondary', tooltip: { values: ["Waiting to start"] } }),
                solved: helper.badge({ color: 'success', tooltip: { values: ["Successfully solved"] } }),
                solving: helper.badge({ color: 'warning', tooltip: { values: ["Currently solving"] } }),
                errored: helper.badge({ color: 'danger', tooltip: { values: ['error'] } }),
                moved: helper.badge({ color: 'primary', tooltip: { values: ["Successfully moved to active readings"] } }),
                reviewed: helper.badge({ color: 'info', tooltip: { values: ["Reviewed by",'reviewed_by_name'] } }),
                customFunction: `cell.propName = row.original.status`
            }
        },
        { Header: 'Consumer Name', accessor: 'name' },
        { 
            Header: 'Reading Date', accessor: 'reading_date', width: 150,
        },
        { 
            Header: 'Image', accessor: 'path', width: 150,
            Cell: {
                componentName: 'Div',
                propName: 'img',
                img: {
                    prop: {
                        html: "<b>hello</b>"
                    }
                },
                customFunction: 'cell[cell.propName].prop.html = `<a href="${row.original.path}" target="_blank"><img class="imgReading" height="35" src="${row.original.path}"/></a>`'
            }
        },
        { 
            Header: 'Result', accessor: 'result', width: 150,
            // Cell: {
            //     componentName: 'Badge',
            //     propName: 'prop',
            //     prop: helper.badge({ color: 'success' })
            // }
        },
        { Header: 'Date Uploaded', accessor: 'date_uploaded' },
        // { Header: 'Solving Requested By', accessor: 'requested_to_be_solved_by_name' },
        { Header: 'Error', accessor: 'error' },
    ];
    return Promise.resolve(columns)
}