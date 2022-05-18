const aws_uploads = ["utility-bill"];
const { db } = require('../../helpers/init');
const credentials = require('../../helpers/credentials');
const importFresh = require('import-fresh');
const path = require('path');
const { v4 } = require('uuid');
const logger = require('logdown')(__filename);
const multer = require('multer');
const uploadOptions = multer({ dest: path.join(__dirname,'../../','uploads') }).single('file');
const aws = require('aws-sdk');
const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
const multerS3 = require('multer-s3');

const upload = multer({
    storage: multerS3({
      s3,
      bucket: process.env.AWS_BUCKET_NAME,
      metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
      },
      acl: 'public-read',
      key: function (req, file, cb) {
        const { username } = req?.info?.credentials;
        const ext = file?.originalname?.split(".")[1];
        cb(null, `${process.env.AWS_FOLDER_NAME}/${username}_${req?.info?.function}_${v4()}.${ext}`);
      }
    })
}).single('file');

module.exports = async (req, res, next) => {
    let auth = req.headers['x-credentials'] || "{}";
    try{
        auth = JSON.parse(auth);
    }catch(e){
        auth = {};
    }
    auth.ip = req.headers['cf-connecting-ip'] || req.headers['x-real-ip'] || req.connection.remoteAddress;

    let body = {
        ...req.body,
        module: 'upload',
        function: req.params.function,
        credentials: auth
    }
    try{
        body = await credentials.validate(body);
        req.info = body;
        if(aws_uploads.indexOf(body.function) > -1){
            upload(req,res,function(err){
                if(err){
                    throw new Error(err);
                }
                if(req?.file){
                    const { location: filename } = req.file;
                    res.send({ filename, successMessage: `Successfully uploaded` });
                }else{
                    res.send({ message: `No file from request`});
                }
            });
        }else{
            // local file
            uploadOptions(req,res,function(err){
                if(err){
                    throw new Error(err);
                }
                if(req?.file){
                    const { path } = req.file;
                    res.send({ filename: path, successMessage: `Successfully uploaded` });
                }else{
                    res.send({ message: `No file from request`});
                }
            });
        }
    }catch(e){
        logger.error(e.message);
        // let's use status 200 so that we can pass exact error message to the client
        return res.status(200).send({ message: e.message });
    }
}