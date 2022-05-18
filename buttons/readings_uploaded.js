const helper = require('../helpers/column-helpers');

module.exports = [
    // helper.dropdownButton({ button_name: 'water_reading_update', label: 'Update Reading', iconStyle: { color: '#26b000' }, icon: 'iconsminds-file-edit', inputsFrom: 'water/update-reading-inputs', submitData: ['id']}),
    helper.dropdownButton({ 
        desc: 'Review Uploaded Water Reading', 
        button_name: 'readings_review', 
        label: 'Review Reading', 
        icon: 'iconsminds-magnifi-glass', 
        inputsFrom: 'readings/review-inputs', 
        modules:['readings/review'],
        submitData: ['id'],
        eval: `result = !props.row["active_readings_id"] && !props.row["reviewed_by"]`
    }),
]