const separator = require('./separator');
module.exports = (info) => {
    if(!info?.notice?.length)
        return [];
    const lines = [
        [
            { text: `IMPORTANT NOTICE:${info.minimize?'':'\n\n'}`, style: { bold: true }, margin: [0,info.minimize?3:10,0,0] },
        ]
    ];
    info.notice.map(n=>{
        lines.push([{text:`${n.value}${info.minimize ? "":"\n\n"}`, margin: info.minimize ? [0,-3,0,0]:[]}]);
    })
    return {
        margin: [0,-20,0,0],
        table: {
            widths: [ '*' ],
            body: lines
        },
        layout: separator()
    }
}