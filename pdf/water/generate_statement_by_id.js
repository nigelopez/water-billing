const defaultFontSize = 9;
const minimizedFont = 6.5;
const path = require('path');
const PdfPrinter = require('pdfmake');
const generateChart = require('./generateChart');
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

const definition = (info, noContent = false) =>{
    return {
        content: !noContent ? mainContent(info):[],
        pageSize: info?.pageSize || info.minimize ? 'FOLIO':"LETTER",
        pageMargins: info.minimize ? [ 15,15,15,15] : [ 25, 35, 25, 20 ],
        styles: {
            filledHeader: {
                bold: true,
                color: '#ffffff',
                fillColor: '#696969',
                alignment: 'center',
            }
        },
        defaultStyle: {
            fontSize: info.minimize ? minimizedFont:defaultFontSize,
        },
        watermark: info.voided_on ? { text: 'CANCELLED', color: 'red', opacity: 0.2, bold: true }:null,
    }
};

const moment = require('moment');
const string = require('../../helpers/string');
const x = {};
x.create = async (id,pipe,pageBreak,trx = db,minimize = false) => {
    const info = await trx("water_statements").where("id",id).first();
    if(!info)
        throw new Error(`Cannot find water bill id # ${id}`);
    
    const period_to = moment(info.period_to);
    const statements = await trx("water_statements").where("id","<=",id).where("consumer_id",info.consumer_id).whereNull("voided_on");
    const months = {};
    const xValues = [];
    const yValues = [];
    statements.map(r=>{
        months[moment(r.period_to).format("YYYY-MM")] = {
            value: (months[moment(r.date).format("YYYY-MM")]?.value || 0) + r.billed_cbm
        }
    });
    period_to.add(-11,'month');
    let total = 0;
    let numberOfMonths = 0;
    for(var i = 1; i <= 12; i++){
        total += months[period_to.format("YYYY-MM")]?.value || 0;
        if(total)
            numberOfMonths++;
        xValues.push(period_to.format("MMM YYYY"));
        yValues.push(months[period_to.format("YYYY-MM")]?.value || "");
        period_to.add(1,'month');
    }
    
    // console.log(total,numberOfMonths)
    info.image = await generateChart(xValues, yValues, (total / numberOfMonths).toFixed(1), minimize);
    info.minimize = minimize;
    info.bill_date = moment(info.bill_date).format("MMMM DD, YYYY");
    info.previous_reading = info.previous_reading > 0 ? Number(info.previous_reading).toFixed(1):'0';
    info.current_reading = info.current_reading > 0 ? Number(info.current_reading).toFixed(1):'0';
    info.total_cbm = info.total_cbm > 0 ? Number(info.total_cbm).toFixed(1):'0';
    info.billed_cbm = info.billed_cbm > 0 ? Number(info.billed_cbm).toFixed(1):'0';
    info.number_of_days = info.number_of_days > 0 ? Number(info.number_of_days):'0';
    info.average_cbm_per_day = info.average_cbm_per_day > 0 ? Number(info.average_cbm_per_day):'0';
    info.due_date = moment(info.due_date).format("MMMM DD, YYYY");
    info.period_from = info.period_from && moment(info.period_from).format("MMM DD, YYYY") || '-';
    info.period_to = moment(info.period_to).format("MMM DD, YYYY");
    info.generated_on = moment(info.generated_on).format("llll");
    info.current_amount_due = string.currencyFormat(info.current_amount_due);
    info.hide_inconvenience = info.total_amount_due <= 0;
    info.total_amount_due = info.total_amount_due > 0 ? string.currencyFormat(info.total_amount_due):`( ${string.currencyFormat(info.total_amount_due)} )`;
    info.outstanding_balance = string.currencyFormat(info.outstanding_balance);
    info.advance_payment = info.advance_payment > 0 ? `( ${string.currencyFormat(info.advance_payment)} )`:string.currencyFormat(info.advance_payment);
    info.total_interest = string.currencyFormat(info.total_interest);

    (await trx("water_settings").where("name","like","header_%")).map(h=>{
        info[h.name] = h.value;
    });
    const addons = await trx("water_statement_charges").where("statement_id",id);
    addons.map(a=>{
        info[a.type] = JSON.parse(a.values);
    });
    info.notice = await trx("water_settings").where("name","like","notice_%").orderBy("name");
    info.pageSize = minimize ? 'FOLIO':(await trx("water_settings").where("name","paper_size").first())?.value || "LETTER";
    info.pageBreak = pageBreak;
    if(pipe !== false){
        var pdfDoc = printer.createPdfKitDocument(definition(info));
        pdfDoc.pipe(pipe);
        pdfDoc.end();
    }else{
        return mainContent(info);
    }
}

x.definitionOnly = (info) => {
    return definition(info, true);
}

module.exports = x;