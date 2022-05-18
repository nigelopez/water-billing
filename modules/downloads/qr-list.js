const { db, string } = require('../../helpers/init');
const moment = require('moment');
const forEach = require('async-foreach').forEach;
const rightElements = require('../../buttons/downloads_qr_right_elements');

const search = {
    fields: {
        "unit_code": { name: 'unit_code', label: 'Unit Code', type: 'text' },
        "name": { name: 'name', label: 'Consumer Name', type: 'text' },
        "type": { name: 'type', label: 'Type / Model', type: 'text' }
    }
}

module.exports = async (data) => {
    const { uuid } = data.credentials;
    if(!data?.sorted?.length)
        data.sorted_by_raw = `added_on DESC, unit_code ASC`;
    if(!data.filtered)
        data.filtered = [];
    data = await db.filter('water_consumers',data);
    data.search = search;
    rightElements[0].aProps.href = `${string.getDownloadURL}/api/${rightElements[0].modules[0]}?uuid=${uuid}`;
    data.rightElements = rightElements;
    return data;
}
