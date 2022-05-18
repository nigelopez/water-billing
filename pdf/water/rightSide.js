const whiteBorder = require('./whiteBorder');
const separator = require('./separator');
const { defaultFontSize } = require('./config');
const consumptionComputation = require('./consumptionComputation');;
const additionalCharges = require('./additionalCharges');
const percentageCharges = require('./percentageCharges');
const summary = require('./summary');
const totalDue = require('./totalDue');
const message = require('./message');
const fixedCharges = require('./fixedCharges');
const receivedBy = require('./receivedBy');
module.exports = (info) => {
    const body = [
        ...consumptionComputation(info),
        ...additionalCharges(info),
        ...percentageCharges(info),
        ...fixedCharges(info),
        ...summary(info),
        ...totalDue(info),
        ...message(info),
    ];
    if(info.minimize)
        body.push(receivedBy(info));
    return {
        layout: 'noBorders',
        table: {
            widths: [ '*' ],
            body
        }
    }
}