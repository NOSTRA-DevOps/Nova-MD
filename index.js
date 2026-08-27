import 'dotenv/config';
import _0x0_0xb078f3, {
    existsSync,
    mkdirSync,
    rmSync
} from 'fs';
import _0x0_0xcdd628, { dirname } from 'path';
import _0x0_0x1e604f from 'chalk';
import _0x0_0x4f5592 from 'syntax-error';
import { parsePhoneNumber as _0x0_0x4a7e2b } from 'awesome-phonenumber';
import _0x0_0x236460 from 'readline';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { smsg } from './lib/myfunc.js';
import { compileAll } from './lib/compile.js';
import _0x0_0x4f83a6, {
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    Browsers,
    jidDecode,
    jidNormalizedUser,
    makeCacheableSignalKeyStore,
    delay
} from '@whiskeysockets/baileys';
import _0x0_0x14f056 from 'node-cache';
import _0x0_0x483232 from 'pino';
import _0x0_0x3d96d1 from './config.js';
import _0x0_0x2c1e40 from './lib/lightweight_store.js';
import {
    server,
    PORT
} from './lib/server.js';
import { printLog } from './lib/print.js';
import { writeErrorLog } from './lib/logger.js';
import {
    handleMessages,
    handleGroupParticipantUpdate,
    handleStatus,
    handleCall
} from './lib/messageHandler.js';
import _0x0_0x342ad9 from './lib/commandHandler.js';
import _0x0_0x520d60 from './lib/sessionManager.js';
_0x0_0x2c1e40['readFromFile']();
setInterval(() => _0x0_0x2c1e40['writeToFile'](), _0x0_0x3d96d1['storeWriteInterval'] || 0x2710);
setInterval(() => {
    if (global['gc']) {
        global['gc']();
        console['log']('🧹\x20Garbage\x20collection\x20completed');
    }
}, 0xea60);
setInterval(() => {
    const _0x4cbcc2 = process['memoryUsage']()['rss'] / 0x400 / 0x400;
    if (_0x4cbcc2 > 0x190) {
        printLog('warning', 'RAM\x20too\x20high\x20(>400MB),\x20restarting\x20bot...');
        process['exit'](0x1);
    }
}, 0x7530);
const DATA_DEFAULTS = {
    'owner.json': [],
    'banned.json': [],
    'premium.json': [],
    'warnings.json': {},
    'notes.json': {},
    'autoAi.json': {},
    'messageCount.json': {
        'isPublic': !![],
        'messageCount': {}
    },
    'userGroupData.json': {
        'users': [],
        'groups': [],
        'antilink': {},
        'antibadword': {},
        'warnings': {},
        'sudo': [],
        'welcome': {},
        'goodbye': {},
        'chatbot': {},
        'autoReaction': ![]
    },
    'autoStatus.json': { 'enabled': ![] },
    'autoread.json': { 'enabled': ![] },
    'autotyping.json': { 'enabled': ![] },
    'pmblocker.json': { 'enabled': ![] },
    'anticall.json': { 'enabled': ![] },
    'stealthMode.json': { 'enabled': ![] },
    'autoBio.json': {
        'enabled': ![],
        'customBio': null
    },
    'autoReaction.json': { 'enabled': ![] },
    'antidelete.json': { 'enabled': ![] },
    'antilink.json': {},
    'antibadword.json': {}
};
_0x0_0xb078f3['mkdirSync']('./data', { 'recursive': !![] });
for (const [file, def] of Object['entries'](DATA_DEFAULTS)) {
    const fp = './data/' + file;
    if (!_0x0_0xb078f3['existsSync'](fp))
        _0x0_0xb078f3['writeFileSync'](fp, JSON['stringify'](def, null, 0x2));
}
let owner = [];
try {
    owner = JSON['parse'](_0x0_0xb078f3['readFileSync']('./data/owner.json', 'utf-8'));
} catch {
    owner = [];
}
global['botname'] = _0x0_0x3d96d1['botName'] || 'NOVA-MD';
global['themeemoji'] = '•';
const pairingCode = ![];
const useMobile = process['argv']['includes']('--mobile');
let rl = null;
let rlClosed = ![];
if (process['stdin']['isTTY'] && !_0x0_0x3d96d1['pairingNumber']) {
    rl = _0x0_0x236460['createInterface']({
        'input': process['stdin'],
        'output': process['stdout']
    });
    rl['on']('close', () => {
        rlClosed = !![];
    });
}
const question = _0x1679c4 => {
    if (rl && !rlClosed) {
        return new Promise(_0x76fd01 => rl['question'](_0x1679c4, _0x76fd01));
    } else {
        return Promise['resolve'](_0x0_0x3d96d1['ownerNumber'] || '237676250509');
    }
};
process['on']('exit', () => {
    if (rl && !rlClosed)
        rl['close']();
});
process['on']('SIGINT', () => {
    if (rl && !rlClosed)
        rl['close']();
    process['exit'](0x0);
});
function ensureSessionDirectory() {
    const _0x59cf17 = _0x0_0xcdd628['join'](__dirname, 'session');
    if (!existsSync(_0x59cf17)) {
        mkdirSync(_0x59cf17, { 'recursive': !![] });
    }
    return _0x59cf17;
}
function hasValidSession() {
    return _0x0_0x520d60['hasValidSession']();
}
server['listen'](PORT, () => {
    printLog('success', 'Server\x20listening\x20on\x20port\x20' + PORT);
    printLog('info', '🌐\x20Web\x20interface\x20available\x20at:\x20http://localhost:' + PORT + '/pairing');
});
async function startNovaXCode() {
    try {
        const {version: _0x48dbeb} = await fetchLatestBaileysVersion();
        ensureSessionDirectory();
        await delay(0x3e8);
        const {
            state: _0xd60399,
            saveCreds: _0x45b73b
        } = await useMultiFileAuthState('./session');
        const _0x3cca1a = async () => {
            ensureSessionDirectory();
            await _0x45b73b();
        };
        const _0x1c6dc5 = new _0x0_0x14f056();
        const _0xe14c89 = await _0x0_0x2c1e40['getSetting']('global', 'stealthMode');
        const _0x41ea7f = _0xe14c89 && _0xe14c89['enabled'];
        const _0x2432d3 = _0x0_0x4f83a6({
            'version': _0x48dbeb,
            'logger': _0x0_0x483232({ 'level': 'silent' }),
            'browser': Browsers['macOS']('Chrome'),
            'auth': {
                'creds': _0xd60399['creds'],
                'keys': makeCacheableSignalKeyStore(_0xd60399['keys'], _0x0_0x483232({ 'level': 'fatal' })['child']({ 'level': 'fatal' }))
            },
            'markOnlineOnConnect': !_0x41ea7f,
            'generateHighQualityLinkPreview': !![],
            'syncFullHistory': ![],
            'getMessage': async _0xc0b8cc => {
                const _0x585266 = jidNormalizedUser(_0xc0b8cc['remoteJid']);
                const _0x175cf2 = await _0x0_0x2c1e40['loadMessage'](_0x585266, _0xc0b8cc['id']);
                return _0x175cf2?.['message'] || '';
            },
            'msgRetryCounterCache': _0x1c6dc5,
            'defaultQueryTimeoutMs': 0xea60,
            'connectTimeoutMs': 0xea60,
            'keepAliveIntervalMs': 0x2710
        });
        _0x2432d3['store'] = _0x0_0x2c1e40;
        const _0x5d6be7 = _0x2432d3['sendPresenceUpdate'];
        const _0x5533ee = _0x2432d3['readMessages'];
        const _0x4309a8 = _0x2432d3['sendReceipt'];
        _0x2432d3['sendPresenceUpdate'] = async function (..._0x3a3313) {
            const _0x579d5f = await _0x0_0x2c1e40['getSetting']('global', 'stealthMode');
            if (_0x579d5f && _0x579d5f['enabled']) {
                printLog('info', '👻\x20Blocked\x20presence\x20update\x20(stealth\x20mode)');
                return;
            }
            return _0x5d6be7['apply'](this, _0x3a3313);
        };
        _0x2432d3['readMessages'] = async function (..._0x36a418) {
            const _0x2e11e4 = await _0x0_0x2c1e40['getSetting']('global', 'stealthMode');
            if (_0x2e11e4 && _0x2e11e4['enabled'])
                return;
            return _0x5533ee['apply'](this, _0x36a418);
        };
        if (_0x4309a8) {
            _0x2432d3['sendReceipt'] = async function (..._0x559d79) {
                const _0x7793a6 = await _0x0_0x2c1e40['getSetting']('global', 'stealthMode');
                if (_0x7793a6 && _0x7793a6['enabled'])
                    return;
                return _0x4309a8['apply'](this, _0x559d79);
            };
        }
        const _0x5ca4a1 = _0x2432d3['query'];
        _0x2432d3['query'] = async function (_0x5cacf2, ..._0x217a09) {
            const _0x109362 = await _0x0_0x2c1e40['getSetting']('global', 'stealthMode');
            if (_0x109362 && _0x109362['enabled']) {
                if (_0x5cacf2 && _0x5cacf2['tag'] === 'receipt')
                    return;
                if (_0x5cacf2 && _0x5cacf2['attrs'] && (_0x5cacf2['attrs']['type'] === 'read' || _0x5cacf2['attrs']['type'] === 'read-self'))
                    return;
            }
            return _0x5ca4a1['apply'](this, [
                _0x5cacf2,
                ..._0x217a09
            ]);
        };
        _0x2432d3['isGhostMode'] = async () => {
            const _0x1bd0d8 = await _0x0_0x2c1e40['getSetting']('global', 'stealthMode');
            return _0x1bd0d8 && _0x1bd0d8['enabled'];
        };
        _0x2432d3['ev']['on']('creds.update', _0x3cca1a);
        _0x0_0x2c1e40['bind'](_0x2432d3['ev']);
        _0x2432d3['ev']['on']('messages.upsert', async _0x5d45b9 => {
            try {
                const _0x4ba98c = _0x5d45b9['messages'][0x0];
                if (!_0x4ba98c['message'])
                    return;
                _0x4ba98c['message'] = Object['keys'](_0x4ba98c['message'])[0x0] === 'ephemeralMessage' ? _0x4ba98c['message']['ephemeralMessage']['message'] : _0x4ba98c['message'];
                if (_0x4ba98c['key'] && _0x4ba98c['key']['remoteJid'] === 'status@broadcast') {
                    await handleStatus(_0x2432d3, _0x5d45b9);
                    return;
                }
                if (!_0x2432d3['public'] && !_0x4ba98c['key']['fromMe'] && _0x5d45b9['type'] === 'notify') {
                    const _0x5bba9d = _0x4ba98c['key']?.['remoteJid']?.['endsWith']('@g.us');
                    if (!_0x5bba9d)
                        return;
                }
                if (_0x4ba98c['key']['id']['startsWith']('BAE5') && _0x4ba98c['key']['id']['length'] === 0x10)
                    return;
                if (_0x2432d3?.['msgRetryCounterCache']) {
                    _0x2432d3['msgRetryCounterCache']['clear']();
                }
                try {
                    await handleMessages(_0x2432d3, _0x5d45b9);
                } catch (_0x4bec90) {
                    printLog('error', 'Error\x20in\x20handleMessages:\x20' + _0x4bec90['message']);
                    if (_0x4ba98c['key'] && _0x4ba98c['key']['remoteJid']) {
                        await _0x2432d3['sendMessage'](_0x4ba98c['key']['remoteJid'], {
                            'text': '❌\x20An\x20error\x20occurred\x20while\x20processing\x20your\x20message.',
                            'contextInfo': {
                                'forwardingScore': 0x1,
                                'isForwarded': !![],
                                'forwardedNewsletterMessageInfo': {
                                    'newsletterJid': '120363429019355682@newsletter',
                                    'newsletterName': 'NOSTRA',
                                    'serverMessageId': -0x1
                                }
                            }
                        })['catch'](console['error']);
                    }
                }
            } catch (_0x5e0382) {
                printLog('error', 'Error\x20in\x20messages.upsert:\x20' + _0x5e0382['message']);
            }
        });
        _0x2432d3['decodeJid'] = _0x426335 => {
            if (!_0x426335)
                return _0x426335;
            if (/:\d+@/gi['test'](_0x426335)) {
                const _0x3e2e96 = jidDecode(_0x426335) || {};
                return _0x3e2e96['user'] && _0x3e2e96['server'] && _0x3e2e96['user'] + '@' + _0x3e2e96['server'] || _0x426335;
            } else
                return _0x426335;
        };
        _0x2432d3['ev']['on']('contacts.update', _0x1d6de9 => {
            for (const _0xd58644 of _0x1d6de9) {
                const _0x120d36 = _0x2432d3['decodeJid'](_0xd58644['id']);
                if (_0x0_0x2c1e40 && _0x0_0x2c1e40['contacts'])
                    _0x0_0x2c1e40['contacts'][_0x120d36] = {
                        'id': _0x120d36,
                        'name': _0xd58644['notify']
                    };
            }
        });
        _0x2432d3['getName'] = (_0x2cfd6c, _0x40b292 = ![]) => {
            const _0x2d65e8 = _0x2432d3['decodeJid'](_0x2cfd6c);
            _0x40b292 = _0x2432d3['withoutContact'] || _0x40b292;
            let _0x95f9d2;
            if (_0x2d65e8['endsWith']('@g.us'))
                return new Promise(async _0x5a944b => {
                    _0x95f9d2 = _0x0_0x2c1e40['contacts'][_0x2d65e8] || {};
                    if (!(_0x95f9d2['name'] || _0x95f9d2['subject']))
                        _0x95f9d2 = _0x2432d3['groupMetadata'](_0x2d65e8) || {};
                    _0x5a944b(_0x95f9d2['name'] || _0x95f9d2['subject'] || _0x0_0x4a7e2b('+' + _0x2d65e8['replace']('@s.whatsapp.net', ''))['number']?.['international']);
                });
            else
                _0x95f9d2 = _0x2d65e8 === '0@s.whatsapp.net' ? {
                    'id': _0x2d65e8,
                    'name': 'WhatsApp'
                } : _0x2d65e8 === _0x2432d3['decodeJid'](_0x2432d3['user']['id']) ? _0x2432d3['user'] : _0x0_0x2c1e40['contacts'][_0x2d65e8] || {};
            return (_0x40b292 ? '' : _0x95f9d2['name']) || _0x95f9d2['subject'] || _0x95f9d2['verifiedName'] || _0x0_0x4a7e2b('+' + _0x2cfd6c['replace']('@s.whatsapp.net', ''))['number']?.['international'];
        };
        _0x2432d3['public'] = !![];
        _0x2432d3['serializeM'] = _0x101e7c => smsg(_0x2432d3, _0x101e7c, _0x0_0x2c1e40);
        const _0x294b8f = _0xd60399['creds']?.['registered'] === !![];
        if (_0x294b8f) {
            if (rl && !rlClosed) {
                rl['close']();
                rl = null;
            }
        } else {
            printLog('info', '🔄\x20Waiting\x20for\x20connection\x20to\x20establish\x20via\x20web\x20interface...');
            if (rl && !rlClosed) {
                rl['close']();
                rl = null;
            }
        }
        _0x2432d3['ev']['on']('connection.update', async _0x4302c7 => {
            const {
                connection: _0x2b70e5,
                lastDisconnect: _0x384cb6,
                qr: _0x38d941
            } = _0x4302c7;
            if (_0x2b70e5 === 'open') {
                printLog('success', 'Bot\x20connected\x20successfully!');
                try {
                    const _0x4fb8b3 = await _0x0_0x2c1e40['getBotMode']();
                    const _0xbae357 = process['uptime']();
                    const _0x373701 = Math['floor'](_0xbae357 / 0xe10);
                    const _0x1456cf = Math['floor'](_0xbae357 % 0xe10 / 0x3c);
                    const _0x2fb50b = 'https://raw.githubusercontent.com/NOSTRA-DevOps/Nova-MD/refs/heads/main/assets/logo.PNG';
                    let _0x4ffba1 = null;
                    try {
                        const _0x168e7a = await fetch(_0x2fb50b);
                        if (_0x168e7a['ok']) {
                            const _0x58e2ea = await _0x168e7a['arrayBuffer']();
                            _0x4ffba1 = Buffer['from'](_0x58e2ea);
                        }
                    } catch (_0x310f7b) {
                        const _0x58d7b8 = _0x0_0xcdd628['join'](process['cwd'](), 'assets', 'logo.PNG');
                        if (_0x0_0xb078f3['existsSync'](_0x58d7b8)) {
                            _0x4ffba1 = _0x0_0xb078f3['readFileSync'](_0x58d7b8);
                        }
                    }
                    let _0x35e345 = '╭━━━━『\x20*' + (_0x0_0x3d96d1['botName'] || 'NOVA-MD') + '*\x20』━━⬣\x0a';
                    _0x35e345 += '┃\x0a';
                    _0x35e345 += '┃\x20✨\x20*Status:*\x20✅\x20ONLINE\x0a';
                    _0x35e345 += '┃\x20🤖\x20*Version:*\x20' + (_0x0_0x3d96d1['version'] || '2.0.0') + '\x0a';
                    _0x35e345 += '┃\x20⚙️\x20*Mode:*\x20' + _0x4fb8b3['toUpperCase']() + '\x0a';
                    _0x35e345 += '┃\x20⏰\x20*Uptime:*\x20' + _0x373701 + 'h\x20' + _0x1456cf + 'm\x0a';
                    _0x35e345 += '┃\x20📊\x20*Prefixes:*\x20' + _0x0_0x3d96d1['prefixes']['join']('\x20') + '\x0a';
                    _0x35e345 += '┃\x20📦\x20*Plugins:*\x20' + _0x0_0x342ad9['commands']['size'] + '\x0a';
                    _0x35e345 += '┃\x20💾\x20*Storage:*\x20' + _0x0_0x2c1e40['getStats']()['backend']['toUpperCase']() + '\x0a';
                    _0x35e345 += '┃\x0a';
                    _0x35e345 += '┃━━━━━━━━━━━━━━━━━⬣\x0a';
                    _0x35e345 += '┃\x0a';
                    _0x35e345 += '┃\x20🌐\x20*JOIN\x20CHANNELS*\x0a';
                    _0x35e345 += '┃\x0a';
                    _0x35e345 += '┃\x20💬\x20*FaceBook:*\x0a';
                    _0x35e345 += '┃\x20https://www.facebook.com/profile.php?id=61591828051151\x0a';
                    _0x35e345 += '┃\x0a';
                    _0x35e345 += '┃\x20📱\x20*Telegram:*\x0a';
                    _0x35e345 += '┃\x20https://t.me/addlist/CpQzYQfWwwxmYTk0\x0a';
                    _0x35e345 += '┃\x0a';
                    _0x35e345 += '┃\x20▶️\x20*YouTube:*\x0a';
                    _0x35e345 += '┃\x20https://youtube.com/@labokingfreesurf\x0a';
                    _0x35e345 += '┃\x0a';
                    _0x35e345 += '┃━━━━━━━━━━━━━━━━━⬣\x0a';
                    _0x35e345 += '┃\x0a';
                    _0x35e345 += '┃\x20✨\x20_Powered\x20by\x20NOSTRA._\x0a';
                    _0x35e345 += '╰━━━━━━━━━━━━━━━━━⬣';
                    const _0x5389ca = _0x2432d3['user']['id']['split'](':')[0x0] + '@s.whatsapp.net';
                    if (_0x4ffba1) {
                        await _0x2432d3['sendMessage'](_0x5389ca, {
                            'image': _0x4ffba1,
                            'caption': _0x35e345,
                            'contextInfo': {
                                'forwardingScore': 0x1,
                                'isForwarded': !![],
                                'forwardedNewsletterMessageInfo': {
                                    'newsletterJid': '120363429019355682@newsletter',
                                    'newsletterName': 'NOSTRA',
                                    'serverMessageId': -0x1
                                }
                            }
                        });
                    } else {
                        await _0x2432d3['sendMessage'](_0x5389ca, {
                            'text': _0x35e345,
                            'contextInfo': {
                                'forwardingScore': 0x1,
                                'isForwarded': !![],
                                'forwardedNewsletterMessageInfo': {
                                    'newsletterJid': '120363429019355682@newsletter',
                                    'newsletterName': 'NOSTRA',
                                    'serverMessageId': -0x1
                                }
                            }
                        });
                    }
                    printLog('success', '📥\x20About\x20message\x20sent\x20successfully\x20to\x20your\x20WhatsApp!');
                } catch (_0x188929) {
                    printLog('error', 'Failed\x20to\x20send\x20automatic\x20about\x20message:\x20' + _0x188929['message']);
                }
                const _0x4db2ea = await _0x0_0x2c1e40['getSetting']('global', 'stealthMode');
                if (_0x4db2ea && _0x4db2ea['enabled']) {
                    printLog('info', '👻\x20STEALTH\x20MODE\x20ACTIVE');
                }
                printLog('success', 'Connected\x20to\x20=>\x20' + JSON['stringify'](_0x2432d3['user'], null, 0x2));
                await delay(0x7cf);
                try {
                    owner = JSON['parse'](_0x0_0xb078f3['readFileSync']('./data/owner.json', 'utf-8'));
                } catch (_0x257aa6) {
                }
                printLog('info', '[\x20' + (_0x0_0x3d96d1['botName'] || 'NOVA-MD') + '\x20]');
                printLog('info', 'WA\x20NUMBER\x20\x20:\x20' + (owner[0x0] || _0x0_0x3d96d1['ownerNumber'] || ''));
                printLog('success', 'Bot\x20Connected\x20Successfully!');
                printLog('info', 'Plugins\x20\x20\x20:\x20' + _0x0_0x342ad9['commands']['size']);
                printLog('info', 'Prefixes\x20\x20\x20:\x20' + _0x0_0x3d96d1['prefixes']['join'](',\x20'));
                printLog('store', 'Backend\x20\x20\x20\x20:\x20' + _0x0_0x2c1e40['getStats']()['backend']);
                console['log']();
            }
            if (_0x2b70e5 === 'close') {
                const _0x3af01a = _0x384cb6?.['error']?.['output']?.['statusCode'];
                const _0x4a1bb9 = _0x3af01a !== DisconnectReason['loggedOut'] && _0x3af01a !== 0x191;
                if (_0x3af01a === DisconnectReason['loggedOut'] || _0x3af01a === 0x191) {
                    try {
                        rmSync('./session', {
                            'recursive': !![],
                            'force': !![]
                        });
                    } catch (_0x39e91a) {
                    }
                    await delay(0xbb8);
                    startNovaXCode();
                    return;
                }
                if (_0x4a1bb9) {
                    printLog('connection', 'Reconnecting\x20in\x205\x20seconds...');
                    await delay(0x1388);
                    startNovaXCode();
                }
            }
        });
        _0x2432d3['ev']['on']('call', async _0x17df2f => {
            await handleCall(_0x2432d3, _0x17df2f);
        });
        _0x2432d3['ev']['on']('group-participants.update', async _0x4dacf8 => {
            await handleGroupParticipantUpdate(_0x2432d3, _0x4dacf8);
        });
        _0x2432d3['ev']['on']('status.update', async _0x24fe80 => {
            await handleStatus(_0x2432d3, _0x24fe80);
        });
        _0x2432d3['ev']['on']('messages.reaction', async _0x56ed38 => {
            await handleStatus(_0x2432d3, _0x56ed38);
        });
        return _0x2432d3;
    } catch (_0x5a3113) {
        printLog('error', 'Error\x20in\x20startNovaXCode:\x20' + _0x5a3113['message']);
        if (rl && !rlClosed) {
            rl['close']();
            rl = null;
        }
        await delay(0x1388);
        startNovaXCode();
    }
}
async function waitForSessionCreation() {
    printLog('info', '🔄\x20Waiting\x20for\x20session\x20to\x20be\x20created\x20via\x20web\x20interface...');
    printLog('info', '📱\x20Open\x20http://localhost:' + (_0x0_0x3d96d1['port'] || 0x1388) + '/pairing\x20in\x20your\x20browser\x20if\x20it\x27s\x20local');
    printLog('info', '📱\x20For\x20web\x20servic\x20deployment,\x20click\x20the\x20service\x20URL\x20and\x20add\x20/pairing\x20at\x20the\x20end');
    const _0x6cf8bf = 0x1e * 0x3c * 0x3e8;
    const _0x4faf1d = Date['now']();
    const _0x1102f4 = 0xbb8;
    return new Promise((_0x3b8841, _0x5c32ce) => {
        const _0x18d8bd = setInterval(() => {
            if (hasValidSession()) {
                clearInterval(_0x18d8bd);
                printLog('success', '✅\x20Session\x20detected!\x20Starting\x20bot...');
                _0x3b8841();
            }
            if (Date['now']() - _0x4faf1d > _0x6cf8bf) {
                clearInterval(_0x18d8bd);
                _0x5c32ce(new Error('Session\x20creation\x20timeout\x20(30\x20minutes)'));
            }
        }, _0x1102f4);
    });
}
async function main() {
    await compileAll();
    await _0x0_0x342ad9['loadCommands']();
    printLog('info', 'Starting\x20NOVA-MD\x20BOT...');
    if (hasValidSession()) {
        printLog('success', '✅\x20Valid\x20session\x20found,\x20starting\x20bot...');
        await delay(0xbb8);
        startNovaXCode()['catch'](_0x5a9469 => {
            printLog('error', 'Fatal\x20error:\x20' + _0x5a9469['message']);
            if (rl && !rlClosed)
                rl['close']();
            process['exit'](0x1);
        });
    } else {
        printLog('info', '🌐\x20No\x20session\x20found.\x20Launching\x20web\x20pairing\x20interface...');
        printLog('info', '📱\x20Open\x20http://localhost:' + (_0x0_0x3d96d1['port'] || 0x1388) + '/pairing\x20in\x20your\x20browser\x20to\x20connect\x20WhatsApp');
        printLog('info', '📱\x20For\x20Render:\x20https://votre-bot.onrender.com/pairing');
        printLog('info', '');
        printLog('info', 'Choose\x20one\x20of\x20these\x20methods:');
        printLog('info', '\x20\x20\x20•\x20QR\x20Code:\x20Scan\x20with\x20WhatsApp\x20>\x20Linked\x20Devices');
        printLog('info', '\x20\x20\x20•\x20Pairing\x20Code:\x20Enter\x20your\x20phone\x20number,\x20get\x208-digit\x20code');
        printLog('info', '');
        try {
            await waitForSessionCreation();
            printLog('success', '✅\x20Session\x20detected!\x20Starting\x20bot...');
            await delay(0xbb8);
            startNovaXCode()['catch'](_0x44654e => {
                printLog('error', 'Fatal\x20error:\x20' + _0x44654e['message']);
                if (rl && !rlClosed)
                    rl['close']();
                process['exit'](0x1);
            });
        } catch (_0x3ebd36) {
            printLog('error', 'Session\x20creation\x20failed:\x20' + _0x3ebd36['message']);
            if (rl && !rlClosed)
                rl['close']();
            process['exit'](0x1);
        }
    }
}
main();
const sessionDir = _0x0_0xcdd628['join'](process['cwd'](), 'session');
setInterval(() => {
    if (!_0x0_0xb078f3['existsSync'](sessionDir))
        return;
    _0x0_0xb078f3['readdir'](sessionDir, (_0x5e866e, _0x561719) => {
        if (_0x5e866e)
            return;
        for (const _0x5b9ed2 of _0x561719) {
            if (_0x5b9ed2 === 'creds.json')
                continue;
            if (_0x5b9ed2['startsWith']('app-state-sync-key-'))
                continue;
            _0x0_0xb078f3['unlink'](_0x0_0xcdd628['join'](sessionDir, _0x5b9ed2), () => {
            });
        }
    });
}, 0x3 * 0x3c * 0x3e8);
const customTemp = _0x0_0xcdd628['join'](process['cwd'](), 'temp');
if (!_0x0_0xb078f3['existsSync'](customTemp))
    _0x0_0xb078f3['mkdirSync'](customTemp, { 'recursive': !![] });
process.env.TMPDIR = customTemp;
process.env.TEMP = customTemp;
process.env.TMP = customTemp;
setInterval(() => {
    _0x0_0xb078f3['readdir'](customTemp, (_0x411b03, _0x5328b7) => {
        if (_0x411b03)
            return;
        for (const _0x1e4fd4 of _0x5328b7) {
            const _0x43dc9c = _0x0_0xcdd628['join'](customTemp, _0x1e4fd4);
            _0x0_0xb078f3['stat'](_0x43dc9c, (_0x295c20, _0x259498) => {
                if (!_0x295c20 && Date['now']() - _0x259498['mtimeMs'] > 0x3 * 0x3c * 0x3c * 0x3e8) {
                    _0x0_0xb078f3['unlink'](_0x43dc9c, () => {
                    });
                }
            });
        }
    });
}, 0x1 * 0x3c * 0x3c * 0x3e8);
const folders = [
    _0x0_0xcdd628['join'](__dirname, './lib'),
    _0x0_0xcdd628['join'](__dirname, './plugins')
];
folders['forEach'](_0x439cea => {
    if (!_0x0_0xb078f3['existsSync'](_0x439cea))
        return;
    _0x0_0xb078f3['readdirSync'](_0x439cea)['filter'](_0x4500f1 => _0x4500f1['endsWith']('.js'))['forEach'](_0x432029 => {
        const _0x1caed6 = _0x0_0xcdd628['join'](_0x439cea, _0x432029);
        try {
            const _0x50c9d6 = _0x0_0xb078f3['readFileSync'](_0x1caed6, 'utf-8');
            const _0x48d9d3 = _0x0_0x4f5592(_0x50c9d6, _0x432029, {
                'sourceType': 'module',
                'allowAwaitOutsideFunction': !![]
            });
            if (_0x48d9d3) {
                console['error'](_0x0_0x1e604f['red']('❌\x20Syntax\x20error\x20in\x20' + _0x1caed6 + ':\x0a' + _0x48d9d3));
            }
        } catch (_0x2bb84b) {
            console['error'](_0x0_0x1e604f['yellow']('⚠️\x20Cannot\x20read\x20file\x20' + _0x1caed6 + ':\x0a' + _0x2bb84b));
        }
    });
});
process['on']('uncaughtException', _0xc5363 => {
    printLog('error', 'Uncaught\x20Exception:\x20' + _0xc5363['message']);
    console['error'](_0xc5363['stack']);
    writeErrorLog({
        'type': 'uncaughtException',
        'error': _0xc5363['message'],
        'stack': _0xc5363['stack'],
        'timestamp': new Date()['toISOString']()
    });
});
process['on']('unhandledRejection', _0x3243aa => {
    printLog('error', 'Unhandled\x20Rejection:\x20' + _0x3243aa['message']);
    console['error'](_0x3243aa['stack']);
    writeErrorLog({
        'type': 'unhandledRejection',
        'error': _0x3243aa['message'],
        'stack': _0x3243aa['stack'],
        'timestamp': new Date()['toISOString']()
    });
});
server['on']('error', _0x177b4a => {
    if (_0x177b4a['code'] === 'EADDRINUSE') {
        printLog('error', 'Address\x20localhost:' + PORT + '\x20in\x20use');
        writeErrorLog({
            'type': 'serverError',
            'error': 'Address\x20localhost:' + PORT + '\x20in\x20use',
            'timestamp': new Date()['toISOString']()
        });
        server['close']();
    } else {
        printLog('error', 'Server\x20error:\x20' + _0x177b4a['message']);
        writeErrorLog({
            'type': 'serverError',
            'error': _0x177b4a['message'],
            'stack': _0x177b4a['stack'],
            'timestamp': new Date()['toISOString']()
        });
    }
});