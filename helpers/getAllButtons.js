const location = require('path').join(__dirname, '../buttons/');
const _ = require('lodash');
const dir = require('node-dir');

module.exports = () => {
  const files = dir.files(location, { sync:true });
  const buttons = [];
  files.map(f=>{
    const file = require(f);
    file.map(z=>{
      buttons.push({
        id: `button_${z.button_name}`,
        type: 'button',
        value: z.button_name,
        desc: z.desc
      });
    });
  });
  return _.uniqBy(buttons, 'value');
}
