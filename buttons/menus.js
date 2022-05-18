const helper = require('../helpers/column-helpers');

module.exports = [
    helper.dropdownButton({ 
        desc: 'Update a menu',
        button_name: 'menu_update',
        label: 'Update',
        iconStyle: { color: '#26b000' },
        icon: 'iconsminds-file-edit',
        inputsFrom: 'settings/menu-update-inputs',
        modules: ['settings/menu-update'],
        submitData: ['_id']
    }),
    helper.dropdownButton({ 
        desc: 'Duplicate a menu', 
        button_name: 'menu_duplicate', 
        label: 'Duplicate', 
        iconStyle: { color: '#8f7200' }, 
        icon: 'iconsminds-file-copy', 
        inputsFrom: 'settings/menu-duplicate-inputs', 
        modules: ['settings/menu-duplicate'],
        submitData: ['_id']
    }),
    helper.dropdownButton({ 
        desc: 'Delete a menu', 
        button_name: 'menu_delete', 
        label: 'Delete', 
        iconStyle: { color: '#a80016' }, 
        icon: 'iconsminds-delete-file', 
        inputsFrom: 'settings/menu-delete-inputs', 
        modules: ['settings/menu-delete'],
        submitData: ['_id']
    }),
]