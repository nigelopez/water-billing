const { db, string } = require('../../helpers/init');
const ps = require('ps-node');
const moment = require('moment');
const credentials = require('../../helpers/credentials');
const importFresh = require('import-fresh');
const path = require('path');
const { v4 } = require('uuid');
const logger = require('logdown')(__filename);
const multer = require('multer');
const MAX_SOLVING_THREADS = process.env.MAX_SOLVING_THREADS || 3;
const { spawn } = require('child_process');
const processor = path.join(__dirname, '../../services/solve_readings.js');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'../../','uploads'));
    },
    filename: function (req, file, cb) {
        const { unitCode, date } = req.params;
        let ext = file.originalname?.split(".");
        ext = ext[ext.length - 1] || 'jpg';
        cb(null, unitCode + "-" + date + "-" + v4().split("-")[0] + "." + ext);
    }
})
// const uploadOptions = multer({ dest: path.join(__dirname,'../../','uploads') }).single('file');
const uploadOptions = multer({
    storage,
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname).toLowerCase();
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'))
        }
        callback(null, true);
    },
    limits: {
        fileSize: 1024 * 20
    }
}).single('file');

module.exports = async (req, res, next) => {
    let { apiKey, unitCode, date } = req.params;
    try{
        if(!apiKey)
            throw new Error("API KEY NOT FOUND!");
        if(!unitCode)
            throw new Error("UNIT CODE NOT FOUND");
        if(!date)
            throw new Error("DATE NOT FOUND");

        date = string.validateDate(date);
        
        await db.transaction(async trx=>{
            const consumer = await trx("water_consumers").where("unit_code",unitCode).first();
            if(!consumer)
                throw new Error(`Cannot find unit "${unitCode}"`);

            const filePath = await new Promise((resolve, reject) => {
                uploadOptions(req,res,function(err){
                    if(err){
                        return reject(err);
                    }
                    // return setTimeout(()=>reject(new Error("hello xxx")),500);
                    const { path } = req?.file;
                    return resolve(path);
                });
            });
            if(!path)
                throw new Error("No file found. Please contact support");
            const reading = await trx("water_readings").where("consumer_id",consumer.id).orderBy("date","desc").first();
            if(reading){
                const last_reading_date = moment(reading.date);
                if(last_reading_date.isSameOrAfter(date))
                    throw new Error(`The last reading date of ${consumer.unit_code} is on ${last_reading_date.format('MMMM DD, YYYY')} and this uploaded reading date is on ${date.format('MMMM DD, YYYY')}. The uploaded reading date must not be earlier than the last reading date of the consumer.`)
            }
            const insert = {
                unit_code: unitCode,
                consumer_id: consumer.id,
                reading_date: date.format("YYYY-MM-DD"),
                path: filePath,
                last_reading_date: reading?.date,
                last_reading: reading?.value,
            };
            await trx("uploads_readings").insert(insert);
            res.send({ successMessage: `Successfully uploaded` });

            await new Promise((resolve)=>{
                ps.lookup({
                        command: 'node',
                        arguments: processor,
                    }, function(err, resultList ) {
                    if (err) {
                        return resolve();
                    }
                    if(resultList.length < MAX_SOLVING_THREADS){
                        spawn('node', [processor], {
                            detached: true,
                            stdio: [ 'ignore' ]
                        });
                    }
                    return resolve();
                });
            })
        });
    }catch(e){
        console.log(e);
        logger.error(e.message);
        // let's use status 200 so that we can pass exact error message to the client
        return res.status(200).send({ message: e.message });
    }
}