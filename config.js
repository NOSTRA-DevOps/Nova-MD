import 'dotenv/config';
const _prefixes = process.env.PREFIXES ? process.env.PREFIXES['split'](',') : [
    '$',
    '#'
];
const config = {
    'botName': process.env.BOT_NAME || 'NOVA-MD',
    'botOwner': process.env.BOT_OWNER || 'NOSTRA',
    'ownerNumber': process.env.OWNER_NUMBER || '237676250509',
    'author': 'NOSTRA',
    'packname': 'NOVA-MD',
    'description': process.env.DESCRIPTION || 'High\x20performance\x20multi-device\x20WhatsApp\x20bot',
    'version': '2.0.0',
    'prefixes': _prefixes,
    'prefix': _prefixes[0x0],
    'commandMode': process.env.COMMAND_MODE || 'private',
    'timeZone': process.env.TIMEZONE || 'Africa/Douala',
    'channelLink': 'https://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y',
    'updateZipUrl': process.env.UPDATE_URL || 'https://github.com/NOSTRA-DevOps/Nova-MD/archive/refs/heads/main.zip',
    'ytChannel': 'https://www.youtube.com/@LaboKingFreeSurf?sub_confirmation=1',
    'sessionId': process.env.SESSION_ID || '',
    'pairingNumber': process.env.PAIRING_NUMBER || '',
    'port': Number(process.env.PORT) || 0x1388,
    'maxStoreMessages': Number(process.env.MAX_STORE_MESSAGES) || 0x32,
    'tempCleanupInterval': Number(process.env.CLEANUP_INTERVAL) || 0x1 * 0x3c * 0x3c * 0x3e8,
    'storeWriteInterval': Number(process.env.STORE_WRITE_INTERVAL) || 0x2710,
    'giphyApiKey': process.env.GIPHY_API_KEY || 'qnl7ssQChTdPjsKta2Ax2LMaGXz303tq',
    'removeBgKey': process.env.REMOVEBG_KEY || '',
    'warnCount': 0x3,
    'APIs': {
        'xteam': 'https://api.xteam.xyz',
        'dzx': 'https://api.dhamzxploit.my.id',
        'lol': 'https://api.lolhuman.xyz',
        'violetics': 'https://violetics.pw',
        'neoxr': 'https://api.neoxr.my.id',
        'zenzapis': 'https://zenzapis.xyz',
        'akuari': 'https://api.akuari.my.id',
        'akuari2': 'https://apimu.my.id',
        'nrtm': 'https://fg-nrtm.ddns.net',
        'fgmods': 'https://api-fgmods.ddns.net'
    },
    'APIKeys': {
        'https://api.xteam.xyz': 'd90a9e986e18778b',
        'https://api.lolhuman.xyz': '85faf717d0545d14074659ad',
        'https://api.neoxr.my.id': process.env.NEOXR_KEY || 'yourkey',
        'https://violetics.pw': 'beta',
        'https://zenzapis.xyz': process.env.ZENZAPIS_KEY || 'yourkey',
        'https://api-fgmods.ddns.net': 'fg-dylux'
    }
};
export default config;