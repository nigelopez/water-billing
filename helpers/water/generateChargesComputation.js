const string = require('../string');
const getAdditionalCharges = require('./getAdditionalCharges');

const execute = ( { charges, billed_cbm } ) => {
    const breakdown = [];
    let total = 0;
    charges.map(c=>{
        let t = Number(c.charge_per_cbm) * Number(billed_cbm);
        total += t;
        breakdown.push({
            bill_id: c.id,
            label: c.label,
            rate: `${string.currencyFormat(Number(c.charge_per_cbm).toFixed(2))} / cu.m`,
            total: string.currencyFormat(t.toFixed(2)),
        }) 
    })
    breakdown.push({
        label: `Sub Total 2`,
        total: string.currencyFormat(total.toFixed(2)),
        line: true
    });
    return { breakdown, total };
}

// getAdditionalCharges().then(async charges=>{
//     // console.log(charges)
//     await execute({ charges, billed_cbm: 1.5 });
// })

module.exports = execute;