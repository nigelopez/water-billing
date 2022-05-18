const helper = require('../helpers/column-helpers');

module.exports = [
    helper.buttonFormModal({ 
        desc: 'Download Statements', 
        button_name: 'download_statements', 
        inputsFrom: 'downloads/download-statement-inputs', 
        modules: ['downloads/download-statements','public-gets/download-statements',],
        label: 'Download Statements',
        outline: false
    }),
]