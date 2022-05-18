const knex = require('knex');
const filter = require(require('path').join(__dirname, 'filter.js'));

const database = knex({
    client: process.env.DB_CLIENT,
    pool: {
        min: parseInt(process.env.DB_MIN_POOL) || 0,
        max: parseInt(process.env.DB_MAX_POOL) || 7,
    },
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    }
});

database.filter = (table, data) => filter(database, table, data);

module.exports = database;