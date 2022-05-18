const helper = require('../helpers/column-helpers');

module.exports = [
    helper.buttonFormModal({
        desc: 'Accept new payment button', 
        button_name: 'payments_new', 
        inputsFrom: 'payments/new-payment-inputs', 
        modules:['payments/new-payment'],
        label: 'New Payment', 
        outline: false
    }),
]