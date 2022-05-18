const { db } = require('../../helpers/init');
const credentials = require('../../helpers/credentials');
const importFresh = require('import-fresh');
const path = require('path');
const logger = require('logdown')(__filename);
const _ = require('lodash');

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
        module: req.params.module,
        function: req.params.function,
        credentials: auth
    }
    
    if(body.function == 'login')
       body.ua = req.useragent;

    try{
        const api = importFresh(path.join('../../modules',body.module,body.function));
        if(body.module !== 'public'){
            body = await credentials.validate(body);
        }
        const { searchForm, sortBy } = body;
        if(searchForm && searchForm.name){
            body.filtered = [];
            if(searchForm.text){
                body.filtered.push({
                    id: searchForm.name,
                    value: searchForm.text
                });
            }else if(searchForm.from){
                if(!searchForm.to){
                    if(Number(searchForm.from) == searchForm.from){
                        body.filtered.push({
                            id: searchForm.name,
                            operator: '=',
                            value: searchForm.from
                        });
                    }else{
                        body.filtered.push({
                            id: searchForm.name,
                            value: searchForm.from
                        });
                    }
                }else{
                    body.filtered.push({
                        range: true,
                        id: searchForm.name,
                        from: Number(searchForm.from) == searchForm.from ? Number(searchForm.from):searchForm.from,
                        to: Number(searchForm.to) == searchForm.to ? Number(searchForm.to):searchForm.to,
                    });
                }
            }
        }

        if(sortBy)
            body.sorted = sortBy;

        const response = await api(body, req, res);
        if(response?.successMessage && !response?.closeModal)
            response.closeModal = 1000; // default close modal
        if(response?.rightElements && body.credentials.id !== 1){
            const allowed = (await db("user_restrictions").where("user_id",body.credentials.id).where("type","button")).map(r=>r.name);
            const finalRights = [];
            response.rightElements.map((r,i)=>{
                if(allowed.indexOf(r.button_name) > -1)
                    finalRights.push(response.rightElements[i]);
            });
            response.rightElements = finalRights;
        }

        if(body.function.indexOf('columns') > -1 && body.credentials.id !== 1){
            const buttons = (await db("user_restrictions").where("user_id",body.credentials.id).where("type","button")).map(r=>r.name);
            response.map(r=>{
                if(r.Cell?.componentName == 'MultiOptions'){
                    r.filterable = false;
                    r.disableSortBy = true;
                    Object.values(r.Cell).map(c=>{
                        if(!c.options)
                            return;
                        let finalOpts = [];
                        c.options.map(o=>{
                            if(buttons.indexOf(o.button_name) > -1){
                                finalOpts.push(o);
                            }
                        });
                        c.options = finalOpts;
                    })
                }
            })
        }
        // setTimeout(function(){
            res.status(200).send(response);
        // },1000)
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