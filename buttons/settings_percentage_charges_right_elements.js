const helper = require('../helpers/column-helpers');

module.exports = [
    helper.buttonFormModal({ 
        desc: 'Add New Percentage Charge', 
        button_name: 'settings_percentage_charge_add', 
        inputsFrom: 'settings/add-percentage-charge-inputs',
        label: 'Add New Percentage Charge', 
        modules: ['settings/add-percentage-charge'],
        outline: false
    }),
]