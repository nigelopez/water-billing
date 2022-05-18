const fs = require('fs');

module.exports = (info) => {
    return {
        layout: 'noBorders',
        table: {
            widths: ['50%', '50%'],
            body: [
                [
                    {
                        layout: 'noBorders',
                        table: {
                            widths: [ info?.header_logo ? 80:0, '*' ],
                            body: [
                                [
                                    info?.header_logo ? [ {text: " ", style: { fontSize: 7 } }, { image: info?.header_logo, width: info.minimize ? 60:70, margin: info.minimize ? [10,-10,0,0]:[0,Number(info?.header_logo_margin_top) || 0,0,0] } ]:[],
                                    { 
                                        layout: 'noBorders',
                                        table: {
                                            widths: ["*"],
                                            body:[
                                                [ { text: info?.header_company_name || "ERR: header_company_name", style: { bold: true }, } ],
                                                [ { text: info?.header_company_address || "ERR: header_company_address", margin: info.minimize ? [0, -3.5, 0, 0]: [] } ],
                                                [ { text: info?.header_company_email || "ERR: header_company_email", margin: info.minimize ? [0, -3.5, 0, 0]: [] } ],
                                                info?.header_company_phone ? [ { text: info?.header_company_phone || "ERR: header_company_phone", margin: info.minimize ? [0, -3.5, 0, 0]: []} ]:[''],
                                            ]
                                        }
                                    }
                                ]
                            ]
                        }
                    },
                    {
                        layout: 'noBorders',
                        table: {
                            widths: [ '*' ],
                            body: [
                                [
                                    { 
                                        layout: 'noBorders',
                                        table: {
                                            widths: ["*"],
                                            body:[
                                                [ { text: 'STATEMENT OF ACCOUNT', style: { bold: true, alignment: 'right' } } ],
                                                [
                                                    {
                                                        layout: 'noBorders',
                                                        table: {
                                                            widths: [ 90, 75, 1, "*" ],
                                                            body:[
                                                                [
                                                                    { text: "", margin: info.minimize ? [0, -5, 0, 0]: [] },
                                                                    { text: "Billing Statement #", margin: info.minimize ? [0, -5, 0, 0]: [] },
                                                                    { text: ":", margin: info.minimize ? [0, -5, 0, 0]: [] },
                                                                    { text: info?.bill_number || "ERR: bill_number", style: {  alignment: 'right' }, margin: info.minimize ? [0, -5, 0, 0]: [] }
                                                                ],
                                                                [
                                                                    { text: "", margin: info.minimize ? [0, -3.5, 0, 0]: [] },
                                                                    { text: "Billing Date", margin: info.minimize ? [0, -3.5, 0, 0]: [] },
                                                                    { text: ":", margin: info.minimize ? [0, -3.5, 0, 0]: [] },
                                                                    { text: info?.bill_date || "ERR: bill_date", style: {  alignment: 'right' }, margin: info.minimize ? [0, -3.5, 0, 0]: [] }
                                                                ],
                                                                [
                                                                    { text: "", margin: info.minimize ? [0, -3.5, 0, 0]: [] },
                                                                    { text: "Due Date", margin: info.minimize ? [0, -3.5, 0, 0]: [] },
                                                                    { text: ":", margin: info.minimize ? [0, -3.5, 0, 0]: [] },
                                                                    { text: info?.due_date || "ERR: due_date", style: {  alignment: 'right' }, margin: info.minimize ? [0, -3.5, 0, 0]: [] }
                                                                ]
                                                            ]
                                                        }
                                                    }
                                                ]
                                            ]
                                        }
                                    }
                                ]
                            ]
                        }
                    },
                ]
            ]
        }
    }
}