const helper = require('../helpers/column-helpers');

module.exports = [
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
    helper.dropdownButton({ 
        desc: 'Unsuspend a consumer', 
        button_name: 'consumers_unsuspend', 
        label: 'Remove Suspension', 
        iconStyle: { color: '#26b000' }, 
        icon: 'iconsminds-play-music',
        inputsFrom: 'consumers/unsuspend-consumer-inputs',
        modules:['consumers/unsuspend-consumer'],
        submitData: ['id']
    }),
]