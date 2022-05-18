const helper = require('../helpers/column-helpers');

module.exports = [
    helper.dropdownButton({ 
        desc: 'Void a water payment', 
        button_name: 'water_payment_void', 
        label: 'Void', 
        iconStyle: { color: '#a80016' }, 
        icon: 'iconsminds-close', 
        inputsFrom: 'water/void-payment-inputs', 
        modules:['water/void-payment'],
        submitData: ['id'],
        eval: `result = !props.row["voided_by"]`
    }),
]