const helper = require('../helpers/column-helpers');

module.exports = [
    helper.dropdownButton({ 
        desc: 'Update Reading Settings Value', 
        button_name: 'reading_update_settings', 
        label: 'Update Setting Value', 
        // iconStyle: { color: '#26b000' }, 
        icon: 'iconsminds-file-edit', 
        inputsFrom: 'settings/settings-update-inputs', 
        modules:['settings/update'],
        submitData: ['id']
    }),
]