const { db } = require('../../helpers/init');

module.exports = async (data) => {
    if(!data.filtered)
        data.filtered = [];
    data.filtered.push({ id: "name", operator: "like", value: "readings_%" });
    data = await db.filter('water_settings',data);
    return data;
}