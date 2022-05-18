const whiteBorder = require('./whiteBorder');
module.exports = (info) => {
    return {
        // margin: info.minimize ? [0,-20,0,0]:[],
        table: {
            widths: [ '*' ],
            body: [
                [ { text: "WATER CONSUMPTION DETAILS", style: "filledHeader" } ],
                [
                    {
                        layout: 'noBorders',
                        table: {
                            widths: [ 57, '*', 73, '*' ],
                            body: [
                                [
                                    { text: "Period From:", style: {  } },
                                    { text: info?.period_from || "ERR", style: { alignment: 'right'} },
                                    { text: "Previous Reading:", style: {  } },
                                    { text: info?.previous_reading || "ERR", style: { alignment: 'right'} },
                                ],
                                [
                                    { text: "Period To:", style: {  } },
                                    { text: info?.period_to || "ERR", style: { alignment: 'right'} },
                                    { text: "Current Reading:", style: {  } },
                                    { text: info?.current_reading || "ERR", style: { alignment: 'right' } },
                                ],
                                [
                                    { text: "# of days:", style: {  } },
                                    { text: info?.number_of_days || "ERR", style: { alignment: 'right'} },
                                    { text: "Consumption:", style: {  } },
                                    { text: info?.total_cbm || "ERR", style: { alignment: 'right' } },
                                ],
                                [
                                    { text: "Ave cu.m/day:", style: {  } },
                                    { text: info?.average_cbm_per_day || "ERR", style: { alignment: 'right'} },
                                    { text: "Cu.M Billed:", style: {  } },
                                    { text: info?.billed_cbm || "ERR", style: { bold: true, alignment: 'right' } },
                                ]
                            ]
                        },
                    }
                ],
            ]
        },
        layout: whiteBorder
    }
}