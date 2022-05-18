const { db, string } = require('../helpers/init');
const gcash = require('../helpers/gcash');

const AWS = require('aws-sdk');
const SES_CONFIG = {
    accessKeyId: process.env.SES_ACCESS_KEY_ID,
    secretAccessKey: process.env.SES_SECRET_ACCESS_KEY,
    region: process.env.SES_REGION,
};
const AWS_SES = new AWS.SES(SES_CONFIG);
const mailcomposer = require('mailcomposer');

const expand = require('expand-template')();
const moment = require('moment');
const pdf = require('../pdf/water/generate_statement_by_id');

const stream = require("stream")

const sendMail = async (details) => {
    let data = await new Promise(async (resolve, reject) =>{
        let echoStream = new stream.Writable();
        let chunks = [];
        echoStream._write = function (chunk, encoding, done) {
            chunks.push(chunk);
            done();
        };
        echoStream.on('error', function (err) {
            reject(err);
        });
        echoStream.on('close', function () {
            resolve(Buffer.concat(chunks));
            chunks = null;
            echoStream = null;
        });
        try{
            await pdf.create(details.statement_id,echoStream);
        }catch(e){
            return reject(e);
        }
    });
    const mailOptions = {
        from: `${details.notifications_name} <${details.notifications_sender}>`,
        replyTo: `${details.notifications_name} <${details.notifications_reply_to}>`,
        subject: details.notifications_subject,
        html: details.notifications_message,
        to: details.recipient,
        attachments: [{
            filename: `${details.bill_number}.pdf`,
            contentType: 'application/pdf',
            content: data
        }]
    };
    const mail = mailcomposer(mailOptions);
    return await new Promise((resolve, reject) => {
        mail.build(function (err, message) {
            if(err) return reject(err);
            const req = AWS_SES.sendRawEmail({ RawMessage: { Data: message } });
            req.send(function (err, data) {
                if (err) return reject(err);
                return resolve(data);
            });
        });
    });
}

let checking = false;

const execute = async () => {
    if(checking) return;
    checking = true;
    await db.transaction(async trx=>{
        const notification = await trx("water_notifications").where("status",0).orderBy("requested_on","asc").first();
        if(!notification)
            return;
        let update = {}
        try{
            const statement = await trx("water_statements").where('id',notification.statement_id).first();
            if(!statement)
                throw new Error(`Cannot find statement id ${notification.statement_id}`);
            if(statement.voided_on)
                throw new Error(`This statement was voided`);
            const details = {};
            const template = await trx("water_settings").where("name","like","notifications_%");
            notification.bill_month = moment(notification.bill_date).format("MMMM");
            notification.bill_year = moment(notification.bill_date).format("YYYY");
            notification.bill_date = moment(notification.bill_date).format("MMMM DD, YYYY");
            notification.period_from = moment(statement.period_from).format("MMMM DD, YYYY");
            notification.period_to = moment(statement.period_to).format("MMMM DD, YYYY");
            notification.previous_reading = `${statement.previous_reading} cubic meter${statement.previous_reading > 1?'s':''}`;
            notification.current_reading = `${statement.current_reading} cubic meter${statement.current_reading > 1?'s':''}`;
            notification.number_of_days = `${statement.number_of_days} day${statement.number_of_days > 1?'s':''}`;
            notification.total_cbm = `${statement.total_cbm} cubic meter${statement.total_cbm > 1?'s':''}`;
            notification.billed_cbm = `${statement.billed_cbm} cubic meter${statement.billed_cbm > 1?'s':''}`;
            notification.outstanding_balance = string.currencyFormat(statement.outstanding_balance);
            notification.total_amount_due = string.currencyFormat(statement.total_amount_due);

            // gcash
            const gSettings = await gcash.getGcashSettings(trx);
            if(gSettings.gcash_allowed && statement.total_amount_due > 0){
                const url = gcash.getConsumerUrl(statement.id);
                notification.gcash_payment_link = `<br/>If you want to pay via GCASH, you may <a href="${url}" target="_blank">click here</a>.<br/><br/>`;
            }else{
                notification.gcash_payment_link = '';
            }
            // end of gcash
            template.map(t=>{
                details[t.name] = expand(t.value,notification);
            });
            details.recipient = notification.email;
            details.bill_number = notification.bill_number;
            details.statement_id = notification.statement_id;
            // console.log(details);
            // process.exit();
            const response = await sendMail(details,trx);
            update = {
                message: JSON.stringify(response),
                processed_on: trx.fn.now(),
                status: 1
            };
            console.log(`Successfully sent an email to ${details.recipient}`);
        }catch(e){
            console.log(e);
            if(e?.response?.text)
                e.message = e.response.text;
            update = {
                message: e.message,
                processed_on: trx.fn.now(),
                status: -1
            };
        }
        await trx("water_notifications").update(update).where("id",notification.id);
    });
    checking = false;
}

setInterval(execute, 1000);

// execute();