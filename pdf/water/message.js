const { defaultFontSize } = require('./config');
module.exports = (info) => {
    if(info?.hide_inconvenience)
        return [];
    const lines = Number(info?.percentage_charges?.length) + Number(info?.fixed_charges?.length);
    return [
        [
            {
                table: {
                    widths: [ '*' ],
                    body: [
                        [
                            { 
                                text: [
                                    "Please pay on or before ",
                                    { text: info?.due_date || "due_date", style: { bold: true } },
                                    " to avoid inconvenience."
                                ],
                                style: { alignment: 'center', fontSize:  info.minimize ? 7:defaultFontSize - 1 },
                                margin: [0,lines <= 2? info.minimize?5:30:3,0,0]
                            },
                        ],
                    ]
                },
                layout: 'noBorders'
            }
        ]
    ]
}