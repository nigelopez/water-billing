const separator = require('./separator');
module.exports = (info) => {
    if(!info?.percentage_charges)
        return [];
    const lines = [
        [{ text: " ", style: { fontSize: 2 } },""]
    ];
    info.percentage_charges.map(c=>{
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
                layout: separator(0.3)
            }
        ]
    ];
}