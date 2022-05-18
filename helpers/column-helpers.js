var x = {};
x.divCenter = ( props ) => {
    return {
        componentName: 'div',
        propName: 'props1',
        props1: {
            align: props && props.align || 'center',
            style: {
                textAlign: props && props.align || 'center',
                fontWeight: (props && props.bold) === false ? '':'bold',//default is bold
                color: props && props.color || '000000'
            }
        },
    }
}
x.buttonFormModal = ( props = {} ) => {
    return {
        desc: props.desc,
        button_name: props.button_name,
        buttonProps: {
            color: props.color || 'primary',
            outline: props.outline === false ? false:true,
            block: true,
            className: 'default',
        },
        showTextValue: props.label || null,
        nextComponent: 'FormModal',
        modules: props.modules || [],
        nextComponentProps: {
            inputsFrom: props.inputsFrom || 'no-inputsFrom-props',
            submitData: props.submitData || []
        },
        modalProps:{
            wrapClassName: props.center ? "modal-center":"modal-right",
            backdrop: "static",
            keyboard: false,
            size: props.large ? 'lg':null
        }
    }
}

x.buttonLink = ( props ) => {
    return {
        showTextValue: props.label || null,
        buttonProps: {
            color: props.color || 'primary',
            outline: props.outline === false ? false:true,
            block: true,
            className: 'default'
        },
        aProps: {
            href: props.href || 'no-href-props',
            target: '_blank'
        },
        desc: props.desc,
        button_name: props.button_name,
        modules: props.modules || [],
    }
}

x.buttonSimple = ( props = {} ) => {
    return {
        buttonProps: {
            color: props.color || 'primary',
            outline: props.outline === false ? false:true,
            block: true,
            size: 'sm',
            className: 'default',
        }
    }
}

x.dropdownButton = ( props = {} ) => {
    return {
        desc: props.desc,
        label: props.label || "NO_LABEL",
        icon: props.icon || "iconsminds-gear",
        button_name: props.button_name || "NO_NAME",
        iconStyle: props.iconStyle,
        nextComponent: 'FormModal',
        nextComponentProps: {
            inputsFrom: props.inputsFrom || 'no-inputsFrom-props',
            submitData: props.submitData || []
        },
        modules: props.modules || [],
        modalProps:{
            wrapClassName: props.center ? "modal-center":"modal-right",
            backdrop: "static",
            keyboard: false,
            size: props.large ? 'lg':null
        },
        showIf: props.showIf,

        // use props.row to access row
        // return false if you don't want to show the option
        // use "result" variable, if result is true, then show option, if false, hide option
        eval: props.eval,
    }
}

x.badge = ( props = {} ) => {
    return { 
        divProps: {
            align: props.align,
        },
        props: {
            color: props.color || 'primary',
            style: props.style || { fontSize: '12px' },
            tooltip: props.tooltip
        }
    };
}
module.exports = x;