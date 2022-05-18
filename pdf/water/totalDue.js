const separator = require('./separator');

module.exports = (info) => {
    return [
        [{ text: " ", margin: [0,-10,0,0]}],
        [
            {
                table: {
                    widths: [ '*', 100],
                    body: [
                        [
                            { text: "Total Amount Due", style: { bold: true }, margin: [0,5,0,0] },
                            { text: info?.total_amount_due || "total_amount_due", style: { bold: true, alignment: 'right' }, margin: [0,5,0,0] },
                        ],
                    ]
                },
                layout: separator(1.5)
            }
        ],
    ]
}