const string = require('../string');

const execute = ( { rates, billed_cbm, minimum_consumption } ) => {
    const breakdown = [];
    let total = 0;
    let totalCbm = 0;
    if(billed_cbm < minimum_consumption)
        billed_cbm = minimum_consumption;
    for(var i = 0; i < rates.length; i++) {
        const r = rates[i];
        const max = r.to - r.from;
        let cbm;
        if(billed_cbm > max){
            cbm =  Number(max);
        }else{
            cbm = Number(billed_cbm < 0 ? 0:billed_cbm);
        }
        billed_cbm -= max;
        cbm = cbm > 0 ? Number(cbm).toFixed(1):0;
        totalCbm += Number(cbm);
        breakdown.push({
            cbm,
            rate: string.currencyFormat(r.rate),
            label: r.label,
            total: string.currencyFormat(Number(cbm * r.rate).toFixed(2))
        });
        total += cbm * r.rate;
    }
    breakdown.push({
        label: `Sub Total 1`,
        cbm: Number(totalCbm).toFixed(1),
        total: string.currencyFormat(total.toFixed(2)),
        line: true
    })
    return { breakdown, total };
}
// sample
// getConsumptionRates().then(async rates=>{
//     await execute({ rates, billed_cbm: 6.1 });
// });

module.exports = execute;