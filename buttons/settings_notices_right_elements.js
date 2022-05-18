const helper = require('../helpers/column-helpers');

module.exports = [
    helper.buttonFormModal({ 
        desc: 'Add New Notice', 
        button_name: 'settings_notice_add', 
        inputsFrom: 'settings/add-notice-inputs',
        label: 'Add New Notice', 
        modules: ['settings/add-notice'],
        outline: false
    }),
]