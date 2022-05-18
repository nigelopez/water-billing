const defaultFontSize = 9;
const fs = require('fs');
const path = require('path');
const PdfPrinter = require('pdfmake');
const { db } = require('../../helpers/init');
const fonts = {
	Roboto: {
		normal: path.join(__dirname, '../fonts/Roboto-Light.ttf'),
		bold: path.join(__dirname, '../fonts/Roboto-Medium.ttf'),
		italics: path.join(__dirname, '../fonts/Roboto-Italic.ttf'),
		bolditalics: path.join(__dirname, '../fonts/Robot-MediumItalic.ttf')
	}
};
const printer = new PdfPrinter(fonts);
const mainContent = require('./mainContent');


const definition = (info) =>{
    return {
        content: mainContent(info),
        pageSize: info?.pageSize || "LETTER",
        pageMargins: [ 25, 35, 25, 20 ],
        styles: {
            filledHeader: {
                bold: true,
                color: '#ffffff',
                fillColor: '#696969',
                alignment: 'center',
            }
        },
        defaultStyle: {
            fontSize: defaultFontSize,
        }
    }
};

const string = require('../../helpers/string');
const getConsumptionRates = require('../../helpers/water/getConsumptionRates');
const getAdditionalCharges = require('../../helpers/water/getAdditionalCharges');
const generateChargesComputation = require('../../helpers/water/generateChargesComputation');
const generateConsumptionComputation = require('../../helpers/water/generateConsumptionComputation');
(async ()=> {
    const charges = await getAdditionalCharges();
    const rates = await getConsumptionRates();
    const _charges = await generateChargesComputation({ charges, billed_cbm: 12 });
    const _consumption = await generateConsumptionComputation({ rates, billed_cbm: 12 });
    // console.log(_consumption);
    const info = {};
    (await db("water_settings").where("name","like","header_%")).map(h=>{
        info[h.name] = h.value;
    });
    const current_amount_due = _charges.total + _consumption.total;
    const percentage_charges = await db("water_settings").where("name","like","percentage_charges%").orderBy("description");
    if(percentage_charges.length > 0){
        const pc = [];
        percentage_charges.map(p=>{
            const label = p.description.replace("{{value}}",p.value);
            const percentage = p.value / 100;
            const total = Number((percentage * current_amount_due).toFixed(2));
            pc.push({
                label,
                total: string.currencyFormat(total)
            })
        });
        info.percentage_charges = pc;
    }
    const fixed_charges = await db("water_settings").where("name","like","fixed_charges%").orderBy("description");
    if(fixed_charges.length > 0){
        const fc = [];
        fixed_charges.map(f=>{
            fc.push({
                label: f.description,
                total: string.currencyFormat(Number(f.value))
            })
        });
        info.fixed_charges = fc;
    }

    info.notice = await db("water_settings").where("name","like","notice_%").orderBy("name");
    info.water_consumption_computation = _consumption.breakdown;
    info.charges_computation = _charges.breakdown;

    var pdfDoc = printer.createPdfKitDocument(definition(info));
    pdfDoc.pipe(fs.createWriteStream('document.pdf'));
    pdfDoc.end();
    // process.exit();
})();