const whiteBorder = require("./whiteBorder");

module.exports = (info) => {
    if(!info?.fixed_charges)
        return [];
    const lines = [];
    info.fixed_charges.map(c=>{
        lines.push([
            { text: c.label },
            { text: c.total, style: { alignment: 'right' } },
        ]);
    })
    return [
        [
            {
                table: {
                    widths: [ "*", 60],
                    body: lines
                },
                layout: whiteBorder
            }
        ]
    ];
}