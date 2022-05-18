const helper = require('../helpers/column-helpers');

module.exports = [
    helper.dropdownButton({ 
        desc: 'Update a water settings', 
        button_name: 'water_settings_update', 
        label: 'Update', 
        iconStyle: { color: '#26b000' }, 
        icon: 'iconsminds-file-edit', 
        inputsFrom: 'water/update-settings-inputs', 
        modules:['water/update-settings'],
        submitData: ['id']
    }),
    helper.dropdownButton({ 
        desc: 'Delete a water settings', 
        button_name: 'water_settings_delete', 
        label: 'Delete', 
        iconStyle: { color: '#a80016' }, 
        icon: 'iconsminds-delete-file', 
        inputsFrom: 'water/delete-settings-inputs', 
        modules:['water/delete-settings'],
        submitData: ['id']
    }),
]