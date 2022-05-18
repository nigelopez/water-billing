const helper = require('../helpers/column-helpers');

module.exports = [
    helper.dropdownButton({ 
        desc: 'Update Gcash Official Receipt', 
        button_name: 'water_payment_void', 
        label: 'Update OR #', 
        icon: 'iconsminds-file-edit', 
        inputsFrom: 'payments/gcash-update-or-inputs', 
        modules:['payments/gcash-update-or'],
        submitData: ['id'],
        eval: `result = props.row["status_display"] == "Missing OR"`
    }),
]