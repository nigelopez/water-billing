const helper = require('../helpers/column-helpers');

module.exports = [
    helper.buttonFormModal({ 
        desc: 'Modify Rate Scheme', 
        button_name: 'settings_rates_modify_scheme', 
        inputsFrom: 'settings/rates-modify-scheme-inputs',
        label: 'Modify Rate Scheme', 
        modules: ['settings/rates-modify-scheme'],
        outline: false
    }),
]