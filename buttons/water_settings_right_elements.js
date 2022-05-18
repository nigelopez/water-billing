const helper = require('../helpers/column-helpers');

module.exports = [
    helper.buttonFormModal({
        desc: 'Add a new water settings',
        button_name: 'water_settings_add', 
        inputsFrom: 'water/add-settings-inputs', 
        modules:['water/add-settings'],
        label: 'Add Settings', 
        outline: false
    }),
]