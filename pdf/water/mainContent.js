const headers = require('./headers');
const leftSide = require('./leftSide');
const rightSide = require('./rightSide');
const notice = require('./notice');
const separator = require('./separator');
module.exports = (info) => {
  let additional = [];
  // if(info.minimize){
  //   const lines = [[{ text: ``, style: { bold: true }, margin: [0,0,0,0] }]];
  //   additional = [
  //     {
  //       margin: [0,5,0,0],
  //       table: {
  //           widths: [ '*' ],
  //           body: lines
  //       },
  //       layout: separator()
  //     },
  //     headers(info),
  //     {
  //       layout: 'noBorders',
  //       margin: info.minimize ? [0,-10,0,0]:[],
  //       table: {
  //         widths: [ '*','*' ],
  //         body: [
  //             [
  //                 leftSide(info),
  //                 rightSide(info)
  //             ]
  //         ]
  //       }
  //     },
  //     [ notice(info) ],
  //   ]
  // };
    return [
        headers(info),
        info.minimize ? "":"\n",
        {
          layout: 'noBorders',
          margin: info.minimize ? [0,-10,0,0]:[],
          table: {
            widths: [ '*','*' ],
            body: [
                [
                    leftSide(info),
                    rightSide(info)
                ]
            ]
          }
        },
        info.minimize ? "":"\n\n",
        [ notice(info) ],
        [...additional],
        info.pageBreak ? { text: "", pageBreak: 'before'}:null
    ];
}