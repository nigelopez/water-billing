const separator = require('./separator');
module.exports = (info) => {
    return [
        [
            {
                table: {
                    widths: [ '*', 100],
                    body: [
                        [
                            { text: "Current Amount Due", style: {  }, margin: [0,5,0,0] },
                            { text: info?.current_amount_due || "current_amount_due", style: { alignment: 'right' }, margin: [0,5,0,0] },
                        ],
                        [
                            { text: "Outstanding Balance" },
                            { text: info?.outstanding_balance || "outstanding_balance", style: { alignment: 'right' } }
                        ],
                        [
                            { text: `${info?.interest || "interest"}% of Outstanding Balance` },
                            { text: info?.total_interest || "total_interest", style: { alignment: 'right' } }
                        ],
                        [
                            { text: "Advance Payment" },
                            { text: info?.advance_payment || "advance_payment", style:{ alignment: 'right' } }
                        ],
                    ]
                },
                layout: separator(.8)
            }
        ]
    ]
}