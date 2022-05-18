const helper = require('../../helpers/column-helpers');
const options = require('../../buttons/download_statements');

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
        { Header: 'Type', accessor: 'type', width: 70, },
        { 
            Header: 'Status', accessor: 'status', width: 70,
            Cell: {
                componentName: 'Badge',
                propName: 'unknown',
                unknown: helper.badge({ color: 'secondary', align: 'center' }),
                running: helper.badge({ color: 'info', align: 'center' }),
                terminated: helper.badge({ color: 'danger', align: 'center' }),
                finished: helper.badge({ color: 'success', align: 'center' }),
                customFunction: `cell.propName = row.original.status;`
            }
        },
        { 
            Header: 'Bill Date', accessor: 'bill_date', width: 120,
            Cell: {
                componentName: 'Badge',
                propName: 'date',
                date: helper.badge({ color: 'primary', align: 'center' })
            }
        },
        { Header: 'File Name', accessor: 'filename' },
        { 
            Header: 'File Size', accessor: 'filesize', width: 70,
            Cell: {
                componentName: 'Badge',
                propName: 'file',
                file: helper.badge({ color: 'warning', align: 'center' })
            }
        },
        { 
            Header: '# of Statements', accessor: 'number_of_statements',
            Cell: {
                componentName: 'Button',
                propName: 'btn',
                btn: helper.buttonSimple({ color: 'secondary' }),
                found: helper.buttonLink({ color: 'success', outline: false, href: `${process.env.DOWNLOAD_URL || ''}/api/public-gets/download-statements/?uuid=${data?.credentials?.uuid}&request_id={id}` }),
                customFunction: `cell.propName = row.original.fileFound ? 'found':'btn';`
            }
        },
        { Header: 'Started On', accessor: 'started_on' },
        { Header: 'Ended On', accessor: 'ended_on' },
        { Header: 'Requested By', accessor: 'requested_by_name' },
        { Header: 'Requested On', accessor: 'requested_on' },
    ];
    return Promise.resolve(columns)
}