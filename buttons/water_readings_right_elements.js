const helper = require('../helpers/column-helpers');

module.exports = [
    helper.buttonFormModal({ 
        desc: 'Add a water reading', 
        button_name: 'readings_add', 
        inputsFrom: 'readings/new-reading-inputs', 
        modules:['readings/new-reading','public-gets/download-reading-template','upload/readings'],
        label: 'New Reading', 
        outline: false
    }),
]