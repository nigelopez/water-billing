const helper = require('../helpers/column-helpers');

module.exports = [
    helper.dropdownButton({ 
        desc: 'Cancel a pending notification',
        button_name: 'notifications_cancel_pending',
        label: 'Cancel Notification',
        iconStyle: { color: '#a80016' }, 
        icon: 'iconsminds-close',
        inputsFrom: 'notifications/cancel-pending-inputs',
        modules: ['notification/cancel-pending'],
        submitData: ['id'],
        showIf: { field: 'status', value: 0 }, 
    }),
]