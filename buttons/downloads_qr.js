const helper = require('../helpers/column-helpers');

module.exports = [
    helper.dropdownButton({ 
        desc: 'View QR Code of Consumer', 
        button_name: 'downloads_view_qr_code', 
        label: 'View QR Code', 
        iconStyle: { color: '#26b000' }, 
        icon: 'iconsminds-magnifi-glass', 
        inputsFrom: 'downloads/view-qr-inputs', 
        modules:['downloads/view-qr'],
        submitData: ['id'],
        center: true
    }),
]