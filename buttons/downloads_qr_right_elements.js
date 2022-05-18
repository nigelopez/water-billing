const helper = require('../helpers/column-helpers');

module.exports = [
    helper.buttonLink({ 
        desc: 'Download All QR Codes',
        button_name: 'downloads_all_qr',
        modules: ['public-gets/download-all-qr-codes'],
        // href: 'public-gets/download-all-qr',
        label: 'Download All QR Codes',
        outline: false 
    }),
    // helper.buttonFormModal({ 
    //     desc: 'Download All QR Codes',
    //     button_name: 'downloads_all_qr',
    //     inputsFrom: 'downloads/download-all-inputs',
    //     modules: ['public-gets/download-all-qr'],
    //     label: 'Download All QR Codes',
    //     outline: false 
    // }),
]