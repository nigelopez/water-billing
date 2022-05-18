const helper = require('../helpers/column-helpers');

module.exports = [
    helper.buttonFormModal({
        desc: 'Generate water statements',
        button_name: 'statements_generate',
        inputsFrom: 'statements/generate-statement-inputs',
        modules: ['statements/generate-statements'],
        label: 'Generate Statements',
        outline: false
    }),
]