const { db } = require('../../helpers/init');
const credentials = require('../../helpers/credentials');
const importFresh = require('import-fresh');
const path = require('path');
const logger = require('logdown')(__filename);

module.exports = async (req, res, next) => {
    const { uuid } = req.query;
    let body = {
        ...req.query,
        module: req.params.module,
        function: req.params.function,
        // credentials
    }
    try{
        if(!uuid)
            throw new Error('INVALID_CREDENTIALS');
        const user = await db("users").where("uuid",uuid).first();
        if(!user)
            throw new Error(`INVALID_CREDENTIALS`);
        
        const api = importFresh(path.join('../../modules',body.module,body.function));
        const response = await api(body, req, res);
        if(response?.piped)
            return;
        if(response?.successMessage && !response?.closeModal)
            response.closeModal = 1000; // default close modal
        res.status(200).send(response);
        return;
    }catch(e){
        if(e.sqlMessage)
            e.message = e.sqlMessage;
        if(e.message.indexOf('Cannot find module') >= 0)
            e.message = e.message.split("\n")[0];
        logger.error(body.function,e.message);
        // let's use status 200 so that we can pass exact error message to the client
        return res.status(200).send({ message: e.message });
    }
    next();
}