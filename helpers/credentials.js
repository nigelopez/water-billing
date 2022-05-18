const { db, secret_key } = require('./init');
const md5 = require('md5');
const x = {};

x.request_hash = data => md5(`${secret_key},${data.username},${data.ip},${data.uuid}`);

x.encrypt_password = password => md5(`${secret_key}${password}`);

x.validate = async data => {
    // console.log({ data });
    if(x.request_hash(data?.credentials) !== data?.credentials?.hash)
        throw new Error("INVALID_CREDENTIALS");
        
    await db.transaction(async trx=>{
        const user = await trx('users').where('status',1).where('username',data.credentials.username).first();
        if(!user)
            throw new Error("INVALID_CREDENTIALS");
        data.credentials.currency = process.env.CURRENCY || "PHP";
        
        // if(user.id === 1)
        //     return data;
        if(user.uuid !== data.credentials.uuid)
            throw new Error("INVALID_CREDENTIALS");

        if(data.credentials.id !== 1 && data.module !== "public"){
            const name = `${data.module}/${data.function}`;
            const allowed = await trx('user_restrictions').where('user_id',user.id).where('type','module').where('name',name).first();
            if(!allowed)
                throw new Error(`${data.module}/${data.function} is not allowed on your account`);
        }
    });
    return data;
}

module.exports = x;