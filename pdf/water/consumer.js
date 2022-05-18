const whiteBorder = require('./whiteBorder');

module.exports = (info) => {
    return {
        table: {
            widths: [ '*' ],
            body: [
                [ { text: "CONSUMER INFORMATION", style: "filledHeader" } ],
                [ { text: "\n", style: { fontSize: 2 } }],
                [
                    {
                        layout: 'noBorders',
                        table: {
                            widths: [ 60, '*' ],
                            body: [
                                [
                                    { text: "Unit Code:", style: {  } },
                                    { text: info?.unit_code || "ERR: unit_code", style: { bold: true } }
                                ],
                                [
                                    { text: "Name:", style: {  } },
                                    { text: info?.consumer_name || "ERR: consumer_name", style: { bold: true } }
                                ]
                            ]
                        }
                    }
                ],
                [ { text: "\n", style: { fontSize: 2 } }],
            ]
        },
        layout: whiteBorder
    }
}