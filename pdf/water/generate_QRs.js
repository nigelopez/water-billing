const path = require('path');
const generateQR = require('../../helpers/generateQR');
const PdfPrinter = require('pdfmake');
const { db, myForEach, string } = require('../../helpers/init');
const fonts = {
	Roboto: {
		normal: path.join(__dirname, '../fonts/Roboto-Light.ttf'),
		bold: path.join(__dirname, '../fonts/Roboto-Medium.ttf'),
		italics: path.join(__dirname, '../fonts/Roboto-Italic.ttf'),
		bolditalics: path.join(__dirname, '../fonts/Robot-MediumItalic.ttf')
	}
};
const MILLIMETERS_IN_INCH = 25.4;
const POINTS_IN_INCH = 75;
function mmToPoints(mm) {
  const inches = mm / MILLIMETERS_IN_INCH;
  return inches * POINTS_IN_INCH;
}

var fs = require('fs');

const printer = new PdfPrinter(fonts);

// const width = mmToPoints(1320.8);
// const height = mmToPoints(304.8);
const SIZE = mmToPoints(15);
// const columns = parseInt(width / SIZE) - 4;
const columns = 11;
const x = {};
// console.log({ width, height, columns })
x.create = async ( pipe ) => {
    const xx = [];
    const widths = [];
    for(var i = 1; i <= columns; i++){
        widths.push(SIZE);
    }
    // for(var i = 1; i <= 1350; i++){
    // const xx = [];
    // for(var i = 1; i <= 2000; i++){
    //     xx.push(`AM${string.addLeadingZeros(i,4)}`);
    // }
    var docDefinition = {
        pageSize: 'LETTER',
        pageMargins: [ 20, 15, 20, 15 ],
        content: [
            {
                table: {
                    dontBreakRows: true,
                    widths,
                    body: []
                },
                layout: {
                    hLineWidth: function(i, node) {
                        return 0.2;
                    },
                    vLineWidth: function(i, node) {
                        return 0.2;
                    },
                    hLineStyle: function (i, node) {
                        return { dash: { length: 4, space: 2} };
                    },
                    vLineStyle: function (i, node) {
                        return { dash: { length: 4, space: 2 } };
                    },
                    hLineColor: function (i, node) {
                        return '#999999';
                    },
                    vLineColor: function (i, node) {
                        return '#999999';
                    },
                }
              }
        ]
    };
    const consumers = (await db("water_consumers").select("unit_code").orderBy('unit_code')).map(z=>z.unit_code);
    let body = [];
    const fit = SIZE * .80;
    const fontSize = SIZE * 0.20;
    const func = async (unit_code) => {
        body.push([
            { qr: unit_code, fit ,alignment:"center", margin: [0,5,0,0] },
            { text: unit_code, alignment:"center", margin: [0,2,0,2], style: { fontSize } }
        ]);
        if(body.length >= widths.length){
            docDefinition.content[0].table.body.push(body);
            body = [];
        }
    }
    // await myForEach(xx,func);
    await myForEach(consumers,func);
    if(body.length > 0){
        for(var i = body.length; i < widths.length; i++)
            body.push('');
        docDefinition.content[0].table.body.push(body);
    }
    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    pdfDoc.pipe(pipe);
    // pdfDoc.pipe(fs.createWriteStream('temp.pdf'));
    pdfDoc.end();
}

module.exports = x;