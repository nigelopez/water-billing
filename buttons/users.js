const helper = require('../helpers/column-helpers');

module.exports = [
    helper.dropdownButton({
        desc: 'Change password of user under users list',
        button_name: 'users_list_change_password',
        label: 'Change Password',
        iconStyle: { color: '#26b000' },
        icon: 'iconsminds-key', 
        inputsFrom: 'users/update-password-inputs', 
        modules:['users/update-password'],
        submitData: ['id']
    }),
    helper.dropdownButton({ 
        desc: 'Update information of user under users list', 
        button_name: 'users_list_update_information', 
        label: 'Update Information', 
        iconStyle: { color: '#1759c2' }, 
        icon: 'iconsminds-user', 
        inputsFrom: 'users/update-information-inputs', 
        modules:['users/update-information'],
        submitData: ['id']
    }),
    helper.dropdownButton({ 
        desc: 'Set restrictions of user under users list', 
        button_name: 'users_list_set_restrictions', 
        label: 'Update Restrictions', iconStyle: { color: '#1f1f1f' }, 
        icon: 'iconsminds-gear', 
        inputsFrom: 'users/update-restrictions-inputs', 
        modules:['users/update-restrictions'],
        submitData: ['id'], 
        center: true, large: true
    }),
    helper.dropdownButton({
        desc: 'Suspend a user', 
        button_name: 'users_list_suspend', 
        showIf: { field: 'status', value: 'active' }, 
        label: 'Suspend User',
        iconStyle: { color: '#a80016' }, 
        icon: 'iconsminds-close', 
        inputsFrom: 'users/suspend-user-inputs',
        modules:['users/suspend-user'],
        submitData: ['id']} ),
    helper.dropdownButton({
        desc: 'Unsuspend a user', 
        button_name: 'users_list_unsuspend', 
        showIf: { field: 'status', value: 'suspended' }, 
        label: 'Unsuspend User', 
        iconStyle: { color: '#f5cb42' }, 
        icon: 'iconsminds-play-music', 
        inputsFrom: 'users/unsuspend-user-inputs',
        modules:['users/unsuspend-user'],
        submitData: ['id']
    }),
]