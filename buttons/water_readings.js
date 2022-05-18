const helper = require('../helpers/column-helpers');

module.exports = [
    // helper.dropdownButton({ button_name: 'water_reading_update', label: 'Update Reading', iconStyle: { color: '#26b000' }, icon: 'iconsminds-file-edit', inputsFrom: 'water/update-reading-inputs', submitData: ['id']}),
    helper.dropdownButton({ 
        desc: 'Delete a water reading', 
        button_name: 'readings_delete', 
        label: 'Delete Reading', 
        iconStyle: { color: '#a80016' }, 
        icon: 'iconsminds-close', 
        inputsFrom: 'readings/delete-reading-inputs', 
        modules:['readings/delete-reading'],
        submitData: ['id']
    }),
]