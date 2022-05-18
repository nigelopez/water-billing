const { db } = require('../helpers/init');
const forEach = require('async-foreach').forEach;
const path = require('path');
const fs = require('fs');
const dir = __dirname;
const logger = require('logdown')(__filename);

fs.readdir(dir, function (err, files) {
    if (err) {
        return logger.error('Unable to scan directory: ' + err);
    } 
    forEach(files, async function(file){
        const done = this.async();
        if(file !== 'create.js' && file !== '_drop.js' && file.indexOf('.json') < 0){
            const create = require(path.join(__dirname, file));
            if(typeof create !== 'function'){
                logger.error(`${file} - no exported function`);
            }else{
                await create();
            }
        }
        done();
    },()=>{
        process.exit();
    });
});