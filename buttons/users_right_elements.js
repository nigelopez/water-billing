const helper = require('../helpers/column-helpers');

module.exports = [
    helper.buttonFormModal({ 
        desc: 'Add a new user', 
        button_name: 'users_add', 
        inputsFrom: 'users/add-user-inputs',
        label: 'Add New User', 
        modules: ['users/add-user'],
        outline: false
    }),
]