const separator = require('./separator');
const whiteBorder = require('./whiteBorder');

module.exports = (info) => {
    if(!info?.charges?.length)
        return [];
    const lines = [];
    let sub;

    info.charges.map(c=>{
        const x = [
            { text: c.label, style: {  } },
            { text: c.rate, style: { alignment: 'right' } },
            { text: c.total, style: { alignment: 'right'} },
        ];
        if(c.line){
            x[0].margin = [0,5,0,0];
            x[1].margin = [0,5,0,0];
            x[2].margin = [0,5,0,0];
            sub = x;
        }else
            lines.push(x);
    });
    return [
        [ 
            {
                table: {
                    widths: [ '*' ],
                    body: [
                        [ { text: "ADDITIONAL CHARGES", style: "filledHeader" } ],
                        [
                            {
                                layout: whiteBorder,
                                table: {
                                    widths: [ '*', 70, 70 ],
                                    body: lines
                                },
                            }
                        ],
                    ]
                },
                layout: 'noBorders'
            }
        ],
        [
            {
                table: {
                    widths: [ '*', 70, 70 ],
                    body: [ sub ]
                },
                layout: separator(0.3)
            }
        ]
    ]
}