const { db } = require('../../helpers/init');
const path = require('path');
const fs = require('fs');
const downloads = path.join(__dirname, '../../downloads');

module.exports = async (data,req,res) => {
    const id = Number(data.request_id) || 0;
    const request = await db("downloads_statements").where("id",id).first();
    if(!request)
        throw new Error(`Cannot find request!`);
    const { filename } = request;
    if(!filename)
        throw new Error(`Filename not found!`);
    const fn = path.join(downloads,filename);
    if(!fs.existsSync(fn))
        throw new Error(`File not found!`);
    const file = fs.createReadStream(fn);
    const stat = fs.statSync(fn);
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    file.pipe(res);
    return { piped: true };
};