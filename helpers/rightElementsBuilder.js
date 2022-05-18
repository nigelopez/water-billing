module.exports = data => {
    return {
        button_name: data.button_name,
        component: 'Button',
        buttonProps: {
            color: data.color || 'primary',
            outline: data.outline === false ? false : true,
            className: data.className || 'default',
            },
            showTextValue: data.text || `Change my text value`,
            nextComponent: data.nextComponent || 'FormModal',
            nextComponentProps: data.nextComponentProps || {
            inputsFrom: data.inputsFrom || '/no-value/inputsFrom/',
        },
        modalProps: {
            wrapClassName: `modal-${data.align || 'right'}`,
            backdrop: data.backdrop || 'static',
            keyboard: data.keyboard === true ? true : false,
        },
    }
}