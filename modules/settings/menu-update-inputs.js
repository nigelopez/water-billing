const { db } = require('../../helpers/init');
const helper = require('../../helpers/input-helpers');

const inputs = {
  submitUrl: 'settings/menu-update',
  submittingText: "Please wait",
  submitButtonText: 'Update Menu',
  submitButtonColor: 'primary',
  cancelButtonColor: 'secondary',
  cancelButtonText: 'Cancel',
  // showValues: true,
  type: "object",
  properties: {
    id: helper.Input({ label: "ID", name: "id", required: true }),
    icon: { type: "string", component: "IconsSelect", props: { label: "Icon", name: "icon", inputProps: { required: true } } },
    label: helper.Input({ label: "Label", name: "label", required: true }),
    long_label: helper.Input({ label: "Long Label", name: "long_label", required: false }),
    to: helper.Input({ label: "To (href)", name: "to", required: true }),
    component: helper.Input({ label: "Component Name", name: "component", required: true }),
    component_props: helper.Input({ label: "Component Props (must be JSON stringified)", name: "component_props", required: false }),
    right_elements: helper.Input({ label: "Right Elements (must be JSON stringified)", name: "right_elements", required: false }),
  }
};

module.exports = async (data) => {
  const id = parseInt(data._id) || 0;
  const menu = await db("menus").where("_id",id).first();
  if(!menu)
    throw new Error(`Cannot find menu!`);
  
  inputs.title = `Update ${menu.label}`;
  inputs.initialValues = menu;
  return inputs;
};