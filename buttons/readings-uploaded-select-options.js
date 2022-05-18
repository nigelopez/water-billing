const helper = require('../helpers/column-helpers');

module.exports = [
    helper.dropdownButton({ 
        desc: 'Move to Active Readings', 
        button_name: 'readings_move_to_active', 
        label: 'Move to Active Readings', 
        iconStyle: { color: 'green' }, 
        icon: 'iconsminds-arrow-inside', 
        inputsFrom: 'readings/move-to-active-readings-inputs', 
        modules: ['readings/move-to-active-readings'],
    }),
    // helper.dropdownButton({ 
    //     desc: 'Send Multi Invoice Email Notifications', 
    //     button_name: 'invoice_multi_send_notifications', 
    //     label: 'Send Email Notifications', 
    //     iconStyle: { color: 'blue' }, 
    //     icon: 'iconsminds-mail-send', 
    //     inputsFrom: 'invoices/multi-send-notifications-inputs', 
    //     modules: ['invoices/multi-send-notifications'],
    // }),
    // helper.dropdownButton({ 
    //     desc: 'Void Multi Invoices', 
    //     button_name: 'invoice_void', 
    //     label: 'Void Invoices', 
    //     iconStyle: { color: '#a80016' }, 
    //     icon: 'iconsminds-delete-file', 
    //     inputsFrom: 'invoices/multi-void-invoices-inputs', 
    //     modules: ['invoices/multi-void-invoices'],
    // }),
]