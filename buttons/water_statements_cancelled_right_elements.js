const helper = require('../helpers/column-helpers');

module.exports = [
    helper.buttonFormModal({ 
        desc: 'Void a water statement by billing date', 
        button_name: 'statements_void_by_bill_date', 
        inputsFrom: 'statements/void-by-bill-date-inputs', 
        modules:['statements/void-by-bill-date'],
        label: 'Void By Billing Date', 
        outline: false,
        color: 'danger'
    }),
]