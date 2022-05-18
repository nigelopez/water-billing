const { db } = require('../../helpers/init');
// const knex = require('../../private_functions/knex');
const _ = require('lodash');
// const { checkRestriction } = require('../../helpers/restrictions');
// const menuDB = require('../../helpers/menus');
// const getUserButtons = require('../../helpers/getUserButtons');
// var x = {};

const logout = {
    id: 'logout',
    icon: 'iconsminds-power',
    label: 'Logout',
    to: '{root}/logout',
    component: 'Logout'
}

module.exports = async (data) => {
    const { user, id } = data.credentials;
    let menus = [];
    return await db.transaction(async trx=>{
        const allMenus = await trx('menus').orderBy('id','asc');
        const allowed = (await trx('user_restrictions').where('user_id',id).where('type','menu')).map(r=>r.name);
        const allowedSubMenus = (await trx('user_restrictions').where('user_id',id).where('type','sub_menu')).map(r=>r.name);
        allMenus.map(m=>{
            if(allowed.indexOf(m.id) < 0 && id !== 1)
                return;
            const menu = {
                id: m.id,
                icon: m.icon,
                label: m.label,
                long_label: m.long_label,
                to: m.to,
                component: m.component
            }
            if(m.component_props){
                try{
                    menu.componentProps = JSON.parse(m.component_props);
                    if(m.component === "Tabs"){
                        menu.componentProps.map((x,i)=>{
                            if(id !== 1 && allowedSubMenus.indexOf(x.name) < 0)
                                delete menu.componentProps[i];
                        });
                        menu.componentProps = _.compact(menu.componentProps);
                    }
                }catch(e){
                    menu.componentProps = null;
                }
            }

            if(m.right_elements){
                try{
                    menu.rightElements = JSON.parse(m.right_elements);
                }catch(e){
                    menu.rightElements = null;
                }
            }
            menus.push(menu);
        });
        menus.push(logout);
        return menus;
    })
}