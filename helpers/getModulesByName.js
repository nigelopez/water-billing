const { db } = require('./init');
const logger = require('logdown')(__filename);
const location = require('path').join(__dirname, '../buttons/');
const _ = require('lodash');
const dir = require('node-dir');

const x = async (trx = db) => {
    const menus = await trx('menus');
    let modules = {};
    menus.map(m=>{
        try{
            const props = JSON.parse(m.component_props);
            if(m.component !== 'Dashboard'){
                props.map(p=>{
                    modules[p.name] = Object.values(p.componentProps);
                })
            }else{
                modules[m.id] = Object.values(props);
            }
        }catch(e){
            logger.error(m.id,e.message);
        }
    });
    // console.log(menus);
    const files = dir.files(location, { sync:true });
    files.map(f=>{
        const file = require(f);
        // console.log(file);
        file.map(z=>{
            if(z.nextComponentProps?.inputsFrom){
                if(!modules[z.button_name])
                    modules[z.button_name] = [];
                modules[z.button_name].push(z.nextComponentProps.inputsFrom);
                z.modules?.map(m=>{
                    // console.log(z.button_name,m);
                    modules[z.button_name].push(m);
                })
            }
        });
    });
    // console.log(modules);
    return modules;
}
// x();
module.exports = x;