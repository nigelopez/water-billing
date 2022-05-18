const helper = require('../helpers/column-helpers');

module.exports = [
    helper.buttonFormModal({ 
        desc: 'Add New Consumer',
        button_name: 'consumers_new',
        inputsFrom: 'consumers/new-consumer-inputs',
        modules: ['consumers/new-consumer','public-gets/download-consumer-import-template'],
        label: 'Add New Consumer',
        outline: false 
    }),
]