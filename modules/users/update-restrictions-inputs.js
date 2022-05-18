const { db } = require('../../helpers/init');
const helper = require('../../helpers/input-helpers');
const allButtons = require('../../helpers/getAllButtons')();
const string = require('../../helpers/string');
const moment = require('moment');
const columns = [
  { Header: 'Type', accessor: 'type', width: 120 },
  { Header: 'Description', accessor: 'desc' },
];
const inputs = {
  submitUrl: 'users/update-restrictions',
  submittingText: "Please wait",
  submitButtonText: 'Update Restrictions',
  submitButtonColor: 'success',
  cancelButtonColor: 'secondary',
  cancelButtonText: 'Cancel',
  type: "object",
  properties: {
    username: helper.Input({ label: "Username", name: "username", disabled: true }),
    selectTable: {
      type: "string",
      component: "List",
      componentProps: {
        selectable: true,
        label: "List of Restrictions",
        columns,
        noCard: true,
        tableProps: { filterable: false, showPagination: false, minRows: 0, defaultPageSize: 0 },
        rows: [ ]
      }
    },
  }
};

module.exports = async (data) => {
  const id = Number(data.id) || 0;
  let rows = [];
  let selected = {};
  return await db.transaction(async trx=>{
    const user = await trx("users").where("id",id).first().select("username","id","first_name","last_name");
    if(!user)
      throw new Error(`Cannot find user id ${id}`);
    const menus = await trx("menus").select('id','label','component','component_props').orderBy("id");
    const subMenus = [];
    menus.map(m=>{
      rows.push({ id: `menu_${m.id}`, value: m.id, type:'menu', desc: `Allow user to see ${m.label} menu`});
      if(m.component === 'Tabs'){
        try{
          const props = JSON.parse(m.component_props);
          props.map(p=>{
            subMenus.push({
              id: `sub_menu_${p.name}`,
              value: p.name,
              type:`sub_menu`,
              desc: `Allow user to see ${p.label} tab under ${m.label} menu`,
            });
          })
        }catch(e){}
      }
    });
    rows = [ ...rows, ...subMenus, ...allButtons ];
    const allowed = await trx('user_restrictions').where("user_id",id);
    allowed.map(a=>{
      selected[`${a.type}_${a.name}`] = { id: `${a.type}_${a.name}`, type: a.type, value: a.name };
    })
    inputs.properties.selectTable.componentProps.tableProps.defaultPageSize = rows.length;
    inputs.properties.selectTable.componentProps.rows = rows;
    inputs.properties.selectTable.componentProps.selectedRows = selected;
    inputs.properties.selectTable.componentProps.nestedModal = true;
    inputs.initialValues = user;
    inputs.title = `Update Restrictions`;
    return inputs;
  });
};