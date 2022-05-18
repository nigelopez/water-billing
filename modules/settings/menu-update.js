const { db } = require('../../helpers/init');
const yup = require('yup');

const form = yup.object({
  _id: yup.number().positive().required(),
  id: yup.string().required(),
  icon: yup.string().required(),
  label: yup.string().required(),
  long_label: yup.string().nullable(),
  to: yup.string().required(),
  component: yup.string().required(),
  component_props: yup.string().nullable(),
  right_elements: yup.string().nullable(),
}).noUnknown();

module.exports = async (data) => {
  data = await form.validate(data);
  if(data.component_props){
    try{
      JSON.parse(data.component_props);
    }catch(e){
      throw new Error(`Component Props - Invalid JSON String`);
    }
  }
  if(data.right_elements){
    try{
      JSON.parse(data.right_elements);
    }catch(e){
      throw new Error(`Right Elements - Invalid JSON String`);
    }
  }
  await db("menus").update(data).where("_id",data._id);
  return { successMessage: `Successfully updated ${data.label} menu`, closeModal: 1000 };
};