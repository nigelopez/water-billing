const { db } = require('../helpers/init');
const logger = require('logdown')(__filename);
const name = require('path').basename(__filename).split(".")[0];

module.exports = async () => {
    const exists = await db.schema.hasTable(name);
    if(exists)
        return;
    try{
        await db.schema.createTable(name, table => { 
            table.increments('id').primary()
            table.string('uuid').notNullable().index();
            table.string('username').notNullable().index();
            table.timestamp('login_date').defaultTo(db.fn.now()).index();
            table.dateTime('last_update').nullable().index();
            table.boolean('success').index().defaultTo(false);
            table.string('ip').index().notNullable();
            table.string('browser')
            table.string('version')
            table.string('os')
            table.string('platform')
            table.string('source')
            table.boolean('isYaBrowser')
            table.boolean('isAuthoritative')
            table.boolean('isMobile')
            table.boolean('isMobileNative')
            table.boolean('isTablet')
            table.boolean('isiPad')
            table.boolean('isiPod')
            table.boolean('isiPhone')
            table.boolean('isiPhoneNative')
            table.boolean('isAndroid')
            table.boolean('isAndroidNative')
            table.boolean('isBlackberry')
            table.boolean('isOpera')
            table.boolean('isIE')
            table.boolean('isEdge')
            table.boolean('isIECompatibilityMode')
            table.boolean('isSafari')
            table.boolean('isFirefox')
            table.boolean('isWebkit')
            table.boolean('isChrome')
            table.boolean('isKonqueror')
            table.boolean('isOmniWeb')
            table.boolean('isSeaMonkey')
            table.boolean('isFlock')
            table.boolean('isAmaya')
            table.boolean('isPhantomJS')
            table.boolean('isEpiphany')
            table.boolean('isDesktop')
            table.boolean('isWindows')
            table.boolean('isLinux')
            table.boolean('isLinux64')
            table.boolean('isMac')
            table.boolean('isChromeOS')
            table.boolean('isBada')
            table.boolean('isSamsung')
            table.boolean('isRaspberry')
            table.boolean('isBot')
            table.boolean('isCurl')
            table.boolean('isAndroidTablet')
            table.boolean('isWinJs')
            table.boolean('isKindleFire')
            table.boolean('isSilk')
            table.boolean('isCaptive')
            table.boolean('isSmartTV')
            table.boolean('isUC')
            table.boolean('isFacebook')
            table.boolean('isAlamoFire')
            table.boolean('isElectron')
            table.boolean('silkAccelerated')
            table.boolean('isWechat')
        });
        logger.info(`Successfully created table "${name}"`);
    }catch(e){
        logger.error(e.message);
    };
}
