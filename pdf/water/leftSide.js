const consumer = require('./consumer');
const consumption = require('./consumption');
const chart = require('./chart');
module.exports = (info) => {
    return {
        layout: 'noBorders',
        table: {
            widths: [ '*' ],
            body: [
                [ consumer(info) ],
                [ consumption(info) ],
                [ chart(info) ],
            ]
        }
    }
}