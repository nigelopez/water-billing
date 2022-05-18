const helper = require('../helpers/column-helpers');

module.exports = [
    helper.dropdownButton({ 
        desc: 'View a utility bill', 
        button_name: 'utility_bill_view', 
        label: 'View Bill', 
        iconStyle: { color: '#26b000' }, 
        icon: 'iconsminds-magnifi-glass', 
        inputsFrom: 'utility-bills/view-inputs', 
        modules:[],
        submitData: ['id']
    }),
    helper.dropdownButton({ 
        desc: 'Void a utility bill', 
        button_name: 'utility_bill_void', 
        label: 'Void Bill', 
        iconStyle: { color: '#a80016' }, 
        icon: 'iconsminds-close', 
        inputsFrom: 'utility-bills/void-inputs', 
        modules:['utility-bills/void'],
        submitData: ['id']
    }),
]