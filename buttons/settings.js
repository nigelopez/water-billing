const helper = require('../helpers/column-helpers');

module.exports = [
    helper.dropdownButton({ 
        desc: 'Update header settings',
        button_name: 'settings_headers_update',
        label: 'Update',
        iconStyle: { color: '#26b000' },
        icon: 'iconsminds-file-edit',
        inputsFrom: 'settings/settings-update-inputs',
        modules: ['settings/settings-update'],
        submitData: ['id']
    }),
    helper.dropdownButton({ 
        desc: 'Delete header settings',
        button_name: 'settings_headers_delete',
        label: 'Delete',
        iconStyle: { color: '#a80016' }, 
        icon: 'iconsminds-close',
        inputsFrom: 'settings/settings-delete-inputs',
        modules: ['settings/settings-delete'],
        submitData: ['id'],
        showIf: { field: 'deletable', value: true }, 
    }),
]