const { v4: uuidv4 } = require('uuid');
const yup = require('yup');
const credentials = require('../../helpers/credentials');
const { db } = require('../../helpers/init');
var x = {};

const form = yup.object({
    username: yup.string().required().max(50),
    password: yup.string().required()
}).noUnknown();

module.exports = async data => {
    const { ip } = data.credentials;
    const details = data.ua;
    delete details['geoIp'];
    details.username = data.username;
    details.ip = ip;
    details.uuid = uuidv4();
    details.success = false;

    data = await form.validate(data);
    data.password = await credentials.encrypt_password(data.password);

    try{
        const user = await db('users').where('username',data.username).first();
        if(!user)
            throw new Error(`Invalid username`);
        if(user.status !== 1)
            throw new Error(`Your account has been disabled`);
        if(user.password !== data.password)
            throw new Error(`Invalid password`);

        details.success = true;
        
        await db('user_logins').insert(details);
        await db('users').update({ uuid: details.uuid }).where("id",user.id);

        const auth = {
            username: user.username,
            id: user.id,
            ip,
            uuid: details.uuid
        };

        auth.hash = credentials.request_hash(auth);
        
        if(user.change_password){
            auth.modal = {
                nextComponentProps: {
                    inputsFrom: "users/change-password-inputs",
                },
                modalProps: {
                    wrapClassName:  "modal-center",
                    backdrop: "static",
                    keyboard: false,
                    hideCloseButtons: true
                }
            };
        }
        console.log(auth);
        return {
            credentials: JSON.stringify(auth),
            defaultPage: `/app/dashboard`
        };
    }catch(e){
        await db('user_logins').insert(details);
        throw e;
    }
};