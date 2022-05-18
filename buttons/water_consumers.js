const helper = require('../helpers/column-helpers');

module.exports = [
    helper.dropdownButton({ 
        desc: 'Change meter of a consumer', 
        button_name: 'consumers_change_meter', 
        label: 'Change Meter Number', 
        iconStyle: { color: '#26b000' }, 
        icon: 'iconsminds-dashboard', 
        inputsFrom: 'consumers/change-meter-inputs', 
        modules:['consumers/change-meter'],
        submitData: ['id']
    }),
    helper.dropdownButton({ 
        desc: 'Update consumer information', 
        button_name: 'consumers_update_info', 
        label: 'Update Information', 
        iconStyle: { color: '#1759c2' }, 
        icon: 'iconsminds-user', 
        inputsFrom: 'consumers/update-consumer-inputs', 
        modules:['consumers/update-consumer'],
        submitData: ['id']
    }),
    // helper.dropdownButton({ 
    //     desc: 'Suspend a consumer', 
    //     button_name: 'consumers_suspend', 
    //     label: 'Suspend Billing', 
    //     iconStyle: { color: '#a80016' }, 
    //     icon: 'iconsminds-close', 
    //     inputsFrom: 'consumers/suspend-consumer-inputs', 
    //     modules:['consumers/suspend-consumer'],
    //     submitData: ['id']
    // }),
]