const helper = require('../helpers/column-helpers');

module.exports = [
    helper.buttonFormModal({ 
        desc: 'Add New Fixed Charge', 
        button_name: 'settings_fixed_charge_add', 
        inputsFrom: 'settings/add-fixed-charge-inputs',
        label: 'Add New Fixed Charge', 
        modules: ['settings/add-fixed-charge'],
        outline: false
    }),
]