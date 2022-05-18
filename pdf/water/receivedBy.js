const { defaultFontSize } = require('./config');
module.exports = (info) => {
    return [
        [
            {
                table: {
                    widths: [ '*' ],
                    body: [
                        [
                            { 
                                text: [
                                    "Billing Received By:\n\n\n",
                                    "________________________________________     _________________\n",
                                ],
                                style: { alignment: 'left', fontSize:  info.minimize ? 7:defaultFontSize - 1, bold: true },
                            },
                        ],
                        [
                            { text: "Signature Over Printed Name", margin: [22,0,0,0] },
                        ],
                        [
                            { text: "Date", margin: [155,-11,0,0] },
                        ]
                    ]
                },
                layout: 'noBorders'
            }
        ]
    ]
}