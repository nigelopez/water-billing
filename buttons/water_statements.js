const helper = require('../helpers/column-helpers');

module.exports = [
    helper.dropdownButton({
        desc: 'Void a water statement',
        button_name: 'water_statement_void',
        label: 'Void', 
        iconStyle: { color: '#a80016' },
        icon: 'iconsminds-close',
        inputsFrom: 'statements/void-statement-inputs',
        modules: ['statements/void-statement'],
        submitData: ['id']
    }),
]