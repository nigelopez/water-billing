const moment = require('moment');
const x = {};

x.Image = ( props ) => {
  return {
    type: "string",
    component: "FileUpload",
    props: {
      label: props.label || "Upload Image",
      name: props.name || "image",
      showOnlyWhen: props.showOnlyWhen || null,
      postUrl: props.postUrl || 'api/upload/profile_image',
      progressProps: {
        color: props.color || 'success',
        animated: true
      },
      inputProps: {
        accept: props.accept || '.png, .jpg, .jpeg'
      },
      imageProps: {
        style: props.style || { marginTop: '20px' }
      }
    }
  }
}

x.ImageDisplay = ( props ) => {
  return {
    type: "string",
    component: "Image",
    props: {
      label: props.label || "Image",
      url: props.url || null,
      base64: props.base64 || null,
      imageProps: {
        style: props.style || { marginTop: '20px' }
      }
    }
  }
}

x.Zipped = ( props ) => {
  return {
    type: "string",
    component: "FileUpload",
    props: {
      label: props.label || "Upload File",
      name: props.name || "image",
      postUrl: props.postUrl || 'api/upload/funnel',
      progressProps: {
        color: props.color || 'success',
        animated: true
      },
      inputProps: {
        accept: '.zip'
      },
      imageProps: {
        style: props.style || { marginTop: '20px' }
      }
    }
  }
}

x.Input = ( props = {} ) => {
    return {
        type: props.type || "string",
        nullable: props.nullable || false,
        component: "Input",
        minLength: props.minLength || null,
        props: {
            label: props.label,
            name: props.name,
            inputProps: {
                required: props.required || false,
                disabled: props.disabled || false,
                type: props.inputType || 'text',
                step: props.step || null,
                style: props.style || null
            },
            inputGroup: props.inputGroup || null,
            showOnlyWhen: props.showOnlyWhen || null,
            listenTo: props.listenTo || null
        }
    }
}

x.TextArea = ( props ) => {
    return {
        type: props.type || "string",
        nullable: props.nullable || false,
        component: "TextArea",
        props: {
            label: props.label,
            name: props.name,
            inputProps: {
                required: props.required || false,
                disabled: props.disabled || false,
                rows: props.rows || null
            },
        }
    }
}

x.Div = ( props ) => {
    return {
        type: props.type,
        component: "Div",
        props: {
            style:  {
              textAlign: props.textAlign || "center",
            },
            html: props.html
        }
    }
}

x.DatePicker = ( props ) => {
    return {
        type: "string",
        component: "DatePicker",
        props: {
          label: props.label,
          name: props.name,
          format: "YYYY-MM-DD",
          inputProps: {
            selected: props.selectedDate || null,
            minDate: props.minDate,
            maxDate: props.maxDate || null,
            dateFormat: props.dateDisplay || "MMMM dd, yyyy",
            disabled: props.disabled || false,
            showMonthYearPicker: props.showMonthYearPicker || false,
            autocomplete: "off",
            required: props.required
          },
          showOnlyWhen: props.showOnlyWhen || null,
        }
      }
}

x.Switch = ( props ) => {
    return {
        type: "boolean",
        component: "Switch",
        props: {
          label: props.label,
          name: props.name,
          divProps:{
            style: {
              float: 'right',
              marginTop: '5px'
            }
          },
          labelProps:{
            style: {
              marginTop: '10px'
            }
          },
          inputProps: {
            required: props.required || false,
            className: 'custom-switch custom-switch-primary',
            checked: props.checked || false
          },
          showOnlyWhen: props.showOnlyWhen || null,
        }
    }
}

x.FormSocketListener = ( props ) => {
  return {
    type: props.type || "string",
    component: "FormSocketListener",
    props
  }
}

x.Warning = ( props = {} ) => {
  return {
    type: "string",
    component: "Warning",
    props: {
      label: props.label || "Warning",
      message: props.message || "No message",
      alertProps: {
        color: props.color || "warning"
      },
      showOnlyWhen: props.showOnlyWhen || null,
    }
  }
}

x.Select = ( props = {} ) => {
  return { 
    type: "string",
    component: "Select",
    props: { 
      label: props.label || 'NO_LABEL',
      name: props.name || 'NO_NAME',
      options: props.options || [],
      inputProps: {
        required: props.required,
        disabled: props.disabled
      }
    }
  }
}

x.ButtonLink = ( props = {} ) => {
  return { 
    type: "string",
    component: "ButtonLink",
    props: { 
      label: props.label,
      name: props.name || 'NO_NAME',
      text: props.text || 'NO_TEXT',
      aProps: props.aProps || {}, 
      buttonProps: props.buttonProps || {},
      showOnlyWhen: props.showOnlyWhen || null,
    }
  }
}
module.exports = x;