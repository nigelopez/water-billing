const whiteBorder = require('./whiteBorder');
const separator = require('./separator');
module.exports = (info) => {
    if(!info?.consumption?.length)
        return [];
    const lines = [];
    let sub;
    info.consumption.map(c=>{
        const x = [
            { text: c.label || '' },
            { text: c.cbm || '', style: { alignment: 'right' } },
            { text: c.rate || '', style: { alignment: 'right' } },
            { text: c.total || '', style: { alignment: 'right' } }
        ];
        if(c.line){
            x[0].margin = [0,5,0,0];
            x[1].margin = [0,5,0,0];
            x[2].margin = [0,5,0,0];
            x[3].margin = [0,5,0,0];
            sub = x;
        }else
            lines.push(x);
    });

    if(lines.length < 1){
        lines.push(["","","",""]);
    }
    return [
        [
            {
                table: {
                    widths: [ '*' ],
                    body: [
                        [ { text: "WATER CONSUMPTION COMPUTATION", style: "filledHeader" } ],
                        [
                            {
                                layout: whiteBorder,
                                table: {
                                    widths: [ 90,  25, '*', '*' ],
                                    body: lines
                                }
                            }
                        ],
                    ]
                },
                layout: 'noBorders'
            }
        ],
        sub ? [
            {
                table: {
                    widths: [ 90,  25, '*', '*' ],
                    body: [sub]
                },
                layout: separator(0.3)
            }
        ]:[],
    ]
}