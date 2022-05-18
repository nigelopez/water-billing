const myArgs = process.argv.slice(2);
const { v4 } = require('uuid');
const { db } = require('./init');
const moment = require('moment');
const { forEach } = require('async-foreach');
const single = require('../pdf/water/generate_statement_by_id');
const fs = require('fs');

const path = require('path');
const PdfPrinter = require('pdfmake');
const fonts = {
	Roboto: {
		normal: path.join(__dirname, '../pdf/fonts/Roboto-Light.ttf'),
		bold: path.join(__dirname, '../pdf/fonts/Roboto-Medium.ttf'),
		italics: path.join(__dirname, '../pdf/fonts/Roboto-Italic.ttf'),
		bolditalics: path.join(__dirname, '../pdf/fonts/Robot-MediumItalic.ttf')
	}
};
const printer = new PdfPrinter(fonts);

const x = async (id) => {
    try{
        await db.transaction(async trx=>{
            const req = await trx('downloads_statements').where("id",id).first();
            if(!req)
                throw new Error(`Cannot find download statement request id ${id}`);
            let { bill_date } = req;
            bill_date = moment(bill_date).format("YYYY-MM-DD");
            const statements = await trx('water_statements').where('bill_date',bill_date).select('id').whereNull("voided_on");
            let margin = 0;
            if(req.type == "with_copy"){
                margin = Number((await trx("water_settings").where("name","copy_separator_margin_top_bottom").first())?.value) || 0;
            }
            console.log({ margin });
            const content = [];
            await db("downloads_statements").where("id",id).update({ 
                pid: process.pid,
                started_on: trx.fn.now(),
                number_of_statements: statements.length
            });
            await new Promise((resolve,reject)=>{
                let rejected = false;
                forEach(statements, async function(s){
                    if(rejected) return;
                    const done = this.async();
                    try{
                        if(req.type === "with_copy"){
                            // first set pageBreak to false
                            content.push(await single.create(s.id,false,false,trx,true));
                            if(margin > 0){
                                content.push({
                                    canvas: [
                                        {
                                            type: 'line',
                                            x1: 0,
                                            y1: 5,
                                            x2: 590,
                                            y2: 5,
                                            lineWidth: 0.5,
                                            dash: {length: 5, space: 5} 
                                        }
                                    ],
                                    margin: [0,margin,0,margin]
                                });
                            }
                            // second set pageBreak to true
                            content.push(await single.create(s.id,false,true,trx,true));
                        }else{
                            content.push(await single.create(s.id,false,true,trx,false));
                        }
                    }catch(e){
                        reject(e);
                        rejected = true;
                    }
                    done();
                },resolve)
            });
            const definition = single.definitionOnly({ minimize: req.type == "with_copy" ? true:false });
            try{
                delete content[content.length - 1][content[content.length - 1].length - 1];
            }catch(e){};
            definition.content = content;
            // console.log(content);
            // process.exit();
            const fn = `${bill_date}_${v4()}.pdf`;
            const folder = path.join(__dirname, '../downloads/');
            if(!fs.existsSync(folder))
                fs.mkdirSync(folder);
            const pdfFile = fs.createWriteStream(path.join(folder,fn));
            const pdfDoc = printer.createPdfKitDocument(definition);
            pdfDoc.pipe(pdfFile);
            pdfDoc.end();
            await new Promise(resolve=>{
                pdfFile.on("close",resolve); 
            });
            let stats = fs.statSync(path.join(folder,fn));
            let filesize = (stats.size / (1024*1024)).toFixed(2) + " mb";
            await trx("downloads_statements").where("id",id).update({ 
                ended_on: trx.fn.now(),
                filename: fn,
                filesize,
                pid: 0
            });
            await trx.commit();
        });
    }catch(e){
        console.log(e);
        await db("downloads_statements").where("id",id).update({ 
            message: e.message,
            ended_on: db.fn.now(),
            pid: 0
        });
    }
    process.exit();
}

if(myArgs[0]){
    const id = parseInt(myArgs[0]);
    x(id);
}

module.exports = x;