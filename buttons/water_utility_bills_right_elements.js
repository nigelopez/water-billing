const helper = require('../helpers/column-helpers');

module.exports = [
    helper.buttonFormModal({ 
        desc: 'Add a utility bill', 
        button_name: 'utility_bills_add', 
        inputsFrom: 'utility-bills/add-inputs', 
        modules:['utility-bills/add','upload/utility-bill'],
        label: 'Add New Bill',
        outline: false
    }),
]