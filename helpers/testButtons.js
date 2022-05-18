const fs = require('fs');
const path = require('path');
const location = path.join(__dirname, '../buttons/');
const _ = require('lodash');
const dir = require('node-dir');

const x = () => {
  const files = dir.files(location, { sync:true });
  const buttons = [];
  const modules = [];
  files.map(f=>{
    const file = require(f);
    file.map(z=>{
        z.modules?.map(x=>{
            modules.push(path.join(__dirname,'../modules/', `${x}.js`));
        });
        modules.push(path.join(__dirname,'../modules/',`${z.nextComponentProps.inputsFrom}.js`));
    });
  });
//   modules.map(f=>{
//       const loc = path.join(__dirname,'../modules/',`${f}.js`);
//       if(!fs.existsSync(loc))
//         console.log(`Not found`,loc);
//   });

  const mf = dir.files(path.join(__dirname,'../modules/'), { sync: true });
  console.log(modules);
  mf.map(m=>{
        if(m.indexOf('columns') < 0 && m.indexOf('list') < 0 && modules.indexOf(m) < 0)
            console.log(m);
  })
}

x();