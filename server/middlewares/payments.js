const { db } = require('../../helpers/init');
const importFresh = require('import-fresh');
const path = require('path');
const logger = require('logdown')(__filename);

module.exports = async (req, res, next) => {
    let body = {
        ...req.query,
        ...req.body,
        module: req.params.module,
    }
    try{
        const api = importFresh(path.join('../../payments',body.module));
        const response = await api(body, req, res);
        if(response.piped)
            return;
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