const helper = require('../helpers/column-helpers');

module.exports = [
    helper.dropdownButton({ 
        desc: 'Terminate Process of Downloading Statements', 
        button_name: 'downloads_terminate_process', 
        label: 'Terminate Process', 
        iconStyle: { color: '#a80016' }, 
        icon: 'iconsminds-close', 
        inputsFrom: 'downloads/terminate-statements-request-inputs',
        modules: ['downloads/terminate-statement-request'],
        submitData: ['id']
    }),
]