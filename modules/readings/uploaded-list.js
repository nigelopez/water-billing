const { db } = require('../../helpers/init');
const moment = require('moment');
const IMG_URL = process.env.IMAGES_URL;

const selectOptions = require(`../../buttons/readings-uploaded-select-options`);

const search = {
    fields: {
        "name": { name: 'name', label: 'Consumer Name', type: 'text' },
        "unit_code": { name: 'unit_code', label: 'Unit Code', type: 'text' },
        "result": { name: 'result', label: 'Reading Result', type: 'number' },
        "reading_date": { name: 'reading_date', label: 'Reading Date', type: 'date' },
        "status": { name: 'status', label: 'Status', type: 'select', opt: ['pending','solving','solved','moved','errored','reviewed'] },
        "error": { name: 'error', label: 'Error', type: 'text' },
    }
}

module.exports = async (data) => {
    if(!data?.sorted?.length)
        data.sorted_by_raw = 'reading_date DESC, date_uploaded DESC';
        
    data = await db.filter('view_uploads_readings',data);
    data.rows.map(r=>{
        r.date_uploaded = moment(r.date_uploaded).format('MMM DD, YYYY hh:mm A');
        r.reading_date = moment(r.reading_date).format('MMMM DD, YYYY');
        const path = r.path.split("/");
        r.path = `${IMG_URL}/${path[path.length - 1]}`;
    });

    data.selectOptions = selectOptions;
    data.search = search;
    return data;
}