const { db, string } = require('../../helpers/init');
const moment = require('moment');
const forEach = require('async-foreach').forEach;
const rightElements = require('../../buttons/download_statements_right_elements');
const ps = require('ps-node');
const fs = require('fs');
const path = require('path');
const downloads = path.join(__dirname, '../../downloads');

const search = {
    fields: {
        "type": { name: 'type', label: 'Download Type', type: 'select', opt: ['single','with_copy'] },
        "bill_date": { name: 'bill_date', label: 'Billing Date', type: 'date' },
        "filename": { name: 'filename', label: 'File Name', type: 'text' },
        "number_of_statements": { name: 'number_of_statements', label: 'Number of Statements', type: 'number' },
        "requested_by_name": { name: 'requested_by_name', label: 'Requested By', type: 'text' },
        "requested_on": { name: 'requested_on', label: 'Date Requested', type: 'date' },
    }
}

module.exports = async (data) => {
    if(!data.filtered)
        data.filtered = [];
    data = await db.filter('view_downloads_statements',data);
    await new Promise(resolve=>{
        forEach(data.rows,function(r){
            const done = this.async();
            r.bill_date = moment(r.bill_date).format('MMMM DD, YYYY');
            r.started_on = r.started_on ? moment(r.started_on).format('MMM DD, YYYY hh:mm a'):null;
            r.ended_on = r.ended_on ? moment(r.ended_on).format('MMM DD, YYYY hh:mm a'):null;
            r.requested_on = r.requested_on ? moment(r.requested_on).format('MMM DD, YYYY hh:mm a'):null;
            r.status = r.ended_on ? 'finished':r.started_on ? 'running':'unknown';
            // console.log(path.join(downloads,r.filename || ''),'here')
            if(r.filename && fs.existsSync(path.join(downloads,r.filename)))
                r.fileFound = true;
            if(r.pid > 0){
                ps.lookup({ pid: r.pid },(err,list)=>{
                    if(err)
                        return done();
                    if(list.length > 0){
                        r.status = 'running';
                    }else{
                        r.status = 'terminated';
                    }
                    done();
                })
                // done();
            }else{
                done()
            }
        },resolve)
    })
    data.rightElements = rightElements;
    data.search = search;
    return data;
}
