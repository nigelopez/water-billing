const helper = require('../helpers/column-helpers');

module.exports = [
    helper.dropdownButton({ 
        desc: 'Update header settings',
        button_name: 'settings_headers_update',
        label: 'Update',
        iconStyle: { color: '#26b000' },
        icon: 'iconsminds-file-edit',
        inputsFrom: 'settings/settings-update-inputs',
        modules: ['settings/settings-update','settings/update-logo'],
        submitData: ['id'],
        center: true,
        large: true
    }),
]