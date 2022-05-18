const { db } = require('../../helpers/init');
const credentials = require('../../helpers/credentials');
const importFresh = require('import-fresh');
const logger = require('logdown')(__filename);
const path = require('path');
module.exports = async (req, res, next) => {
    const { function:func, auth, param:id } = req.params;
    const user = await db("users").where("uuid",auth).first();
    if(!auth || !user)
        return res.send({ message: `Invalid token`});
    const body = { id };
    try{
        const fn = path.join(__dirname,'../../modules/pdfs/',func);
        const api = importFresh(fn);
        const response = await api(body, req, res);
        return;
    }catch(e){
        if(e.sqlMessage)
            e.message = e.sqlMessage;
        if(e?.message?.indexOf('Cannot find module') >= 0)
            e.message = e.message.split("\n")[0];
        console.log(e);
        logger.error(body.function,e.message);
        // let's use status 200 so that we can pass exact error message to the client
        return res.status(200).send({ message: e.message });
    }
    // auth.ip = req.headers['cf-connecting-ip'] || req.headers['x-real-ip'] || req.connection.remoteAddress;
    res.send(fn);
}