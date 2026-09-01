import 'dotenv/config';
import fs from 'fs-extra';

// Fonction pour obtenir le numéro du propriétaire
function getOwnerNumber() {
    // 1. D'abord, essayer depuis data/config.json (persistant)
    try {
        const configPath = './data/config.json';
        if (fs.existsSync(configPath)) {
            const configData = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
            if (configData.ownerNumber && configData.ownerNumber.trim() !== '') {
                return configData.ownerNumber;
            }
        }
    } catch (error) {
        console.log('⚠️ Could not read config.json:', error.message);
    }
    
    // 2. Ensuite, essayer depuis .env
    if (process.env.OWNER_NUMBER && process.env.OWNER_NUMBER.trim() !== '') {
        return process.env.OWNER_NUMBER;
    }
    
    // 3. Sinon, essayer de lire depuis la session (creds.json)
    try {
        const credsPath = './session/creds.json';
        if (fs.existsSync(credsPath)) {
            const creds = JSON.parse(fs.readFileSync(credsPath, 'utf-8'));
            let jid = null;
            
            if (creds.me) {
                if (typeof creds.me === 'string') {
                    jid = creds.me;
                } else if (creds.me.id) {
                    jid = creds.me.id;
                } else if (creds.me.user) {
                    jid = creds.me.user;
                } else if (creds.me.jid) {
                    jid = creds.me.jid;
                }
            }
            
            if (!jid && creds.account) {
                if (creds.account.jid) jid = creds.account.jid;
                else if (creds.account.id) jid = creds.account.id;
            }
            
            if (jid) {
                const phoneNumber = jid.split(':')[0].split('@')[0];
                if (phoneNumber && /^\d+$/.test(phoneNumber)) {
                    return phoneNumber;
                }
            }
        }
    } catch (error) {
        console.log('⚠️ Could not read owner number from session:', error.message);
    }
    
    // 4. Dernier recours: essayer depuis data/owner.json
    try {
        const ownerPath = './data/owner.json';
        if (fs.existsSync(ownerPath)) {
            const owners = JSON.parse(fs.readFileSync(ownerPath, 'utf-8'));
            if (owners.length > 0) {
                return owners[0];
            }
        }
    } catch (error) {}
    
    return '';
}

// Fonction pour sauvegarder le propriétaire dans config.json
function saveOwnerNumber(number) {
    try {
        const configPath = './data/config.json';
        let configData = {};
        
        if (fs.existsSync(configPath)) {
            configData = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        }
        
        configData.ownerNumber = number;
        configData.updatedAt = new Date().toISOString();
        
        fs.ensureDirSync('./data');
        fs.writeFileSync(configPath, JSON.stringify(configData, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving owner number:', error);
        return false;
    }
}

const _prefixes = process.env.PREFIXES ? process.env.PREFIXES.split(',') : ['-', '$', '#'];

const config = {
    // Bot Identity
    botName: process.env.BOT_NAME || 'NOVA-MD',
    botOwner: process.env.BOT_OWNER || 'NOSTRA',
    ownerNumber: getOwnerNumber(),
    author: 'NOSTRA',
    packname: 'NOVA-MD',
    description: process.env.DESCRIPTION || 'High performance multi-device WhatsApp bot',
    version: '2.0.0',
    // Bot Config
    prefixes: _prefixes,
    prefix: _prefixes[0],
    commandMode: process.env.COMMAND_MODE || 'private',
    timeZone: process.env.TIMEZONE || 'Africa/Douala',
    // Links
    channelLink: 'https://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y',
    updateZipUrl: process.env.UPDATE_URL || 'https://github.com/NOSTRA-DevOps/Nova-MD/archive/refs/heads/main.zip',
    ytChannel: 'https://www.youtube.com/@LaboKingFreeSurf?sub_confirmation=1',
    // Session
    sessionId: process.env.SESSION_ID || '',
    pairingNumber: process.env.PAIRING_NUMBER || '',
    // Performance
    port: Number(process.env.PORT) || 5000,
    maxStoreMessages: Number(process.env.MAX_STORE_MESSAGES) || 50,
    tempCleanupInterval: Number(process.env.CLEANUP_INTERVAL) || 1 * 60 * 60 * 1000,
    storeWriteInterval: Number(process.env.STORE_WRITE_INTERVAL) || 10000,
    // API Keys
    giphyApiKey: process.env.GIPHY_API_KEY || 'qnl7ssQChTdPjsKta2Ax2LMaGXz303tq',
    removeBgKey: process.env.REMOVEBG_KEY || '',
    // Warn system
    warnCount: 3,
    // External APIs
    APIs: {
        xteam: 'https://api.xteam.xyz',
        dzx: 'https://api.dhamzxploit.my.id',
        lol: 'https://api.lolhuman.xyz',
        violetics: 'https://violetics.pw',
        neoxr: 'https://api.neoxr.my.id',
        zenzapis: 'https://zenzapis.xyz',
        akuari: 'https://api.akuari.my.id',
        akuari2: 'https://apimu.my.id',
        nrtm: 'https://fg-nrtm.ddns.net',
        fgmods: 'https://api-fgmods.ddns.net'
    },
    APIKeys: {
        'https://api.xteam.xyz': 'd90a9e986e18778b',
        'https://api.lolhuman.xyz': '85faf717d0545d14074659ad',
        'https://api.neoxr.my.id': process.env.NEOXR_KEY || 'yourkey',
        'https://violetics.pw': 'beta',
        'https://zenzapis.xyz': process.env.ZENZAPIS_KEY || 'yourkey',
        'https://api-fgmods.ddns.net': 'fg-dylux'
    }
};

// Exporter la fonction saveOwnerNumber pour usage externe
config.saveOwnerNumber = saveOwnerNumber;

console.log('🤖 Owner Number detected:', config.ownerNumber || '❌ NOT SET - Use .owner2 set');

export default config;