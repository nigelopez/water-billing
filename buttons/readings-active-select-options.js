const helper = require('../helpers/column-helpers');

module.exports = [
    helper.dropdownButton({ 
        desc: 'Delete Active Readings', 
        button_name: 'readings_delete', 
        label: 'Delete Readings', 
        iconStyle: { color: 'red' }, 
        icon: 'iconsminds-close', 
        inputsFrom: 'readings/delete-readings-inputs', 
        modules: ['readings/delete-readings'],
    }),
]