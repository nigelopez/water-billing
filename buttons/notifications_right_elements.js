const helper = require('../helpers/column-helpers');

module.exports = [
    helper.buttonFormModal({ 
        desc: 'Send Notifications', 
        button_name: 'notification_send', 
        inputsFrom: 'notifications/send-notification-inputs',
        label: 'Send Notifications', 
        modules: ['notifications/send-notification'],
        outline: false
    }),
]