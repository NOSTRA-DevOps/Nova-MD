import 'dotenv/config';
import _0x0_0x1a74a8, {
    existsSync,
    mkdirSync,
    rmSync
} from 'fs';
import _0x0_0x130ec2, { dirname } from 'path';
import _0x0_0x549065 from 'chalk';
import _0x0_0x309ea3 from 'syntax-error';
import { parsePhoneNumber as _0x0_0x45ff99 } from 'awesome-phonenumber';
import _0x0_0x5bd5fd from 'readline';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { smsg } from './lib/myfunc.js';
import { compileAll } from './lib/compile.js';
import _0x0_0x2d2a89, {
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    Browsers,
    jidDecode,
    jidNormalizedUser,
    makeCacheableSignalKeyStore,
    delay
} from '@whiskeysockets/baileys';
import _0x0_0x37a1ad from 'node-cache';
import _0x0_0x12c98b from 'pino';
import _0x0_0x18d182 from './config.js';
import _0x0_0x352218 from './lib/lightweight_store.js';
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
import _0x0_0x21f655 from './lib/commandHandler.js';
import _0x0_0x51f5e3 from './lib/sessionManager.js';
import { cleanJid } from './lib/isOwner.js';
_0x0_0x352218['readFromFile']();
setInterval(() => _0x0_0x352218['writeToFile'](), _0x0_0x18d182['storeWriteInterval'] || 0x2710);
setInterval(() => {
    if (global['gc']) {
        global['gc']();
        console['log']('🧹\x20Garbage\x20collection\x20completed');
    }
}, 0xea60);
setInterval(() => {
    const _0x38b13d = process['memoryUsage']()['rss'] / 0x400 / 0x400;
    if (_0x38b13d > 0x190) {
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
    'antibadword.json': {},
    'config.json': { 'ownerNumber': '' },
    'clones.json': []
};
_0x0_0x1a74a8['mkdirSync']('./data', { 'recursive': !![] });
for (const [file, def] of Object['entries'](DATA_DEFAULTS)) {
    const fp = './data/' + file;
    if (!_0x0_0x1a74a8['existsSync'](fp))
        _0x0_0x1a74a8['writeFileSync'](fp, JSON['stringify'](def, null, 0x2));
}
let owner = [];
try {
    owner = JSON['parse'](_0x0_0x1a74a8['readFileSync']('./data/owner.json', 'utf-8'));
} catch {
    owner = [];
}
if (!_0x0_0x18d182['ownerNumber'] && owner['length'] > 0x0) {
    _0x0_0x18d182['ownerNumber'] = owner[0x0];
    try {
        const configPath = './data/config.json';
        if (_0x0_0x1a74a8['existsSync'](configPath)) {
            const configData = JSON['parse'](_0x0_0x1a74a8['readFileSync'](configPath, 'utf-8'));
            configData['ownerNumber'] = owner[0x0];
            _0x0_0x1a74a8['writeFileSync'](configPath, JSON['stringify'](configData, null, 0x2));
        }
    } catch (_0x0_0x2a969d) {
    }
}
global['botname'] = _0x0_0x18d182['botName'] || 'NOVA-MD';
global['themeemoji'] = '•';
const pairingCode = ![];
const useMobile = process['argv']['includes']('--mobile');
let rl = null;
let rlClosed = ![];
if (process['stdin']['isTTY'] && !_0x0_0x18d182['pairingNumber']) {
    rl = _0x0_0x5bd5fd['createInterface']({
        'input': process['stdin'],
        'output': process['stdout']
    });
    rl['on']('close', () => {
        rlClosed = !![];
    });
}
const question = _0x3f7a16 => {
    if (rl && !rlClosed) {
        return new Promise(_0x1e5e5a => rl['question'](_0x3f7a16, _0x1e5e5a));
    } else {
        return Promise['resolve'](_0x0_0x18d182['ownerNumber'] || '');
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
    const _0x5e352a = _0x0_0x130ec2['join'](__dirname, 'session');
    if (!existsSync(_0x5e352a)) {
        mkdirSync(_0x5e352a, { 'recursive': !![] });
    }
    return _0x5e352a;
}
function hasValidSession() {
    return _0x0_0x51f5e3['hasValidSession']();
}
server['listen'](PORT, () => {
    printLog('success', 'Server\x20listening\x20on\x20port\x20' + PORT);
    printLog('info', '🌐\x20Web\x20interface\x20available\x20at:\x20http://localhost:' + PORT + '/pairing');
});
async function startNovaXCode() {
    try {
        const {version: _0x15a413} = await fetchLatestBaileysVersion();
        ensureSessionDirectory();
        await delay(0x3e8);
        const {
            state: _0x260d9a,
            saveCreds: _0x1bd31f
        } = await useMultiFileAuthState('./session');
        const _0x2b4c8b = async () => {
            ensureSessionDirectory();
            await _0x1bd31f();
        };
        const _0x4ec4b1 = new _0x0_0x37a1ad();
        const _0x107725 = await _0x0_0x352218['getSetting']('global', 'stealthMode');
        const _0x3ac8e0 = _0x107725 && _0x107725['enabled'];
        const _0xae6206 = _0x0_0x2d2a89({
            'version': _0x15a413,
            'logger': _0x0_0x12c98b({ 'level': 'silent' }),
            'browser': Browsers['macOS']('Chrome'),
            'auth': {
                'creds': _0x260d9a['creds'],
                'keys': makeCacheableSignalKeyStore(_0x260d9a['keys'], _0x0_0x12c98b({ 'level': 'fatal' })['child']({ 'level': 'fatal' }))
            },
            'markOnlineOnConnect': !_0x3ac8e0,
            'generateHighQualityLinkPreview': !![],
            'syncFullHistory': ![],
            'getMessage': async _0x324ab8 => {
                const _0xf8c1bf = jidNormalizedUser(_0x324ab8['remoteJid']);
                const _0x3fc104 = await _0x0_0x352218['loadMessage'](_0xf8c1bf, _0x324ab8['id']);
                return _0x3fc104?.['message'] || '';
            },
            'msgRetryCounterCache': _0x4ec4b1,
            'defaultQueryTimeoutMs': 0xea60,
            'connectTimeoutMs': 0xea60,
            'keepAliveIntervalMs': 0x2710
        });
        _0xae6206['store'] = _0x0_0x352218;
        const _0x109ca2 = _0xae6206['sendPresenceUpdate'];
        const _0x5bded6 = _0xae6206['readMessages'];
        const _0x54bd10 = _0xae6206['sendReceipt'];
        _0xae6206['sendPresenceUpdate'] = async function (..._0x39d14d) {
            const _0x2b28ee = await _0x0_0x352218['getSetting']('global', 'stealthMode');
            if (_0x2b28ee && _0x2b28ee['enabled']) {
                printLog('info', '👻\x20Blocked\x20presence\x20update\x20(stealth\x20mode)');
                return;
            }
            return _0x109ca2['apply'](this, _0x39d14d);
        };
        _0xae6206['readMessages'] = async function (..._0x274b06) {
            const _0x229ccc = await _0x0_0x352218['getSetting']('global', 'stealthMode');
            if (_0x229ccc && _0x229ccc['enabled'])
                return;
            return _0x5bded6['apply'](this, _0x274b06);
        };
        if (_0x54bd10) {
            _0xae6206['sendReceipt'] = async function (..._0x56d4ba) {
                const _0x312405 = await _0x0_0x352218['getSetting']('global', 'stealthMode');
                if (_0x312405 && _0x312405['enabled'])
                    return;
                return _0x54bd10['apply'](this, _0x56d4ba);
            };
        }
        const _0x2e7e0d = _0xae6206['query'];
        _0xae6206['query'] = async function (_0x4f6150, ..._0x1651a0) {
            const _0x66196e = await _0x0_0x352218['getSetting']('global', 'stealthMode');
            if (_0x66196e && _0x66196e['enabled']) {
                if (_0x4f6150 && _0x4f6150['tag'] === 'receipt')
                    return;
                if (_0x4f6150 && _0x4f6150['attrs'] && (_0x4f6150['attrs']['type'] === 'read' || _0x4f6150['attrs']['type'] === 'read-self'))
                    return;
            }
            return _0x2e7e0d['apply'](this, [
                _0x4f6150,
                ..._0x1651a0
            ]);
        };
        _0xae6206['isGhostMode'] = async () => {
            const _0x212ac2 = await _0x0_0x352218['getSetting']('global', 'stealthMode');
            return _0x212ac2 && _0x212ac2['enabled'];
        };
        _0xae6206['ev']['on']('creds.update', _0x2b4c8b);
        _0x0_0x352218['bind'](_0xae6206['ev']);
        _0xae6206['ev']['on']('messages.upsert', async _0x55ceff => {
            try {
                const _0xf33b82 = _0x55ceff['messages'][0x0];
                if (!_0xf33b82['message'])
                    return;
                _0xf33b82['message'] = Object['keys'](_0xf33b82['message'])[0x0] === 'ephemeralMessage' ? _0xf33b82['message']['ephemeralMessage']['message'] : _0xf33b82['message'];
                if (_0xf33b82['key'] && _0xf33b82['key']['remoteJid'] === 'status@broadcast') {
                    await handleStatus(_0xae6206, _0x55ceff);
                    return;
                }
                if (!_0xae6206['public'] && !_0xf33b82['key']['fromMe'] && _0x55ceff['type'] === 'notify') {
                    const _0xdaa20b = _0xf33b82['key']?.['remoteJid']?.['endsWith']('@g.us');
                    if (!_0xdaa20b)
                        return;
                }
                if (_0xf33b82['key']['id']['startsWith']('BAE5') && _0xf33b82['key']['id']['length'] === 0x10)
                    return;
                if (_0xae6206?.['msgRetryCounterCache']) {
                    _0xae6206['msgRetryCounterCache']['clear']();
                }
                try {
                    await handleMessages(_0xae6206, _0x55ceff);
                } catch (_0x1fb171) {
                    printLog('error', 'Error\x20in\x20handleMessages:\x20' + _0x1fb171['message']);
                    if (_0xf33b82['key'] && _0xf33b82['key']['remoteJid']) {
                        await _0xae6206['sendMessage'](_0xf33b82['key']['remoteJid'], {
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
            } catch (_0xcf9aa) {
                printLog('error', 'Error\x20in\x20messages.upsert:\x20' + _0xcf9aa['message']);
            }
        });
        _0xae6206['decodeJid'] = _0x5e9c41 => {
            if (!_0x5e9c41)
                return _0x5e9c41;
            if (/:\d+@/gi['test'](_0x5e9c41)) {
                const _0x56f5dc = jidDecode(_0x5e9c41) || {};
                return _0x56f5dc['user'] && _0x56f5dc['server'] && _0x56f5dc['user'] + '@' + _0x56f5dc['server'] || _0x5e9c41;
            } else
                return _0x5e9c41;
        };
        _0xae6206['ev']['on']('contacts.update', _0x41a233 => {
            for (const _0x4d1ca3 of _0x41a233) {
                const _0xee7214 = _0xae6206['decodeJid'](_0x4d1ca3['id']);
                if (_0x0_0x352218 && _0x0_0x352218['contacts'])
                    _0x0_0x352218['contacts'][_0xee7214] = {
                        'id': _0xee7214,
                        'name': _0x4d1ca3['notify']
                    };
            }
        });
        _0xae6206['getName'] = (_0x36725b, _0x44b0fc = ![]) => {
            const _0x4a5bc7 = _0xae6206['decodeJid'](_0x36725b);
            _0x44b0fc = _0xae6206['withoutContact'] || _0x44b0fc;
            let _0x29905f;
            if (_0x4a5bc7['endsWith']('@g.us'))
                return new Promise(async _0x96ed45 => {
                    _0x29905f = _0x0_0x352218['contacts'][_0x4a5bc7] || {};
                    if (!(_0x29905f['name'] || _0x29905f['subject']))
                        _0x29905f = _0xae6206['groupMetadata'](_0x4a5bc7) || {};
                    _0x96ed45(_0x29905f['name'] || _0x29905f['subject'] || _0x0_0x45ff99('+' + _0x4a5bc7['replace']('@s.whatsapp.net', ''))['number']?.['international']);
                });
            else
                _0x29905f = _0x4a5bc7 === '0@s.whatsapp.net' ? {
                    'id': _0x4a5bc7,
                    'name': 'WhatsApp'
                } : _0x4a5bc7 === _0xae6206['decodeJid'](_0xae6206['user']['id']) ? _0xae6206['user'] : _0x0_0x352218['contacts'][_0x4a5bc7] || {};
            return (_0x44b0fc ? '' : _0x29905f['name']) || _0x29905f['subject'] || _0x29905f['verifiedName'] || _0x0_0x45ff99('+' + _0x36725b['replace']('@s.whatsapp.net', ''))['number']?.['international'];
        };
        _0xae6206['public'] = !![];
        _0xae6206['serializeM'] = _0x27a8c3 => smsg(_0xae6206, _0x27a8c3, _0x0_0x352218);
        const _0x376482 = _0x260d9a['creds']?.['registered'] === !![];
        if (_0x376482) {
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
        _0xae6206['ev']['on']('connection.update', async _0x572fa6 => {
            const {
                connection: _0x3c7080,
                lastDisconnect: _0x32d0ff,
                qr: _0x884f43
            } = _0x572fa6;
            if (_0x3c7080 === 'open') {
                printLog('success', 'Bot\x20connected\x20successfully!');
                try {
                    const _0x5948fa = cleanJid(_0xae6206['user']['id']);
                    if (!_0x0_0x18d182['ownerNumber']) {
                        const _0xfd71b1 = './data/owner.json';
                        let _0x3157ce = [];
                        if (_0x0_0x1a74a8['existsSync'](_0xfd71b1)) {
                            _0x3157ce = JSON['parse'](_0x0_0x1a74a8['readFileSync'](_0xfd71b1, 'utf-8'));
                        }
                        if (_0x3157ce['length'] === 0x0) {
                            _0x3157ce['push'](_0x5948fa);
                            _0x0_0x1a74a8['writeFileSync'](_0xfd71b1, JSON['stringify'](_0x3157ce, null, 0x2));
                            _0x0_0x18d182['ownerNumber'] = _0x5948fa;
                            printLog('info', '👑\x20Default\x20owner\x20set\x20to:\x20' + _0x5948fa);
                        }
                    }
                } catch (_0x4def1e) {
                }
                try {
                    const _0x11e16a = await _0x0_0x352218['getBotMode']();
                    const _0x134cb1 = process['uptime']();
                    const _0x2357c0 = Math['floor'](_0x134cb1 / 0xe10);
                    const _0x4f811b = Math['floor'](_0x134cb1 % 0xe10 / 0x3c);
                    const _0x7a7611 = _0x0_0x18d182['botOwner'] || 'NOSTRA';
                    const _0x13ece0 = _0x0_0x18d182['ownerNumber'] || 'Not\x20set';
                    const _0x114062 = 'https://raw.githubusercontent.com/NOSTRA-DevOps/Nova-MD/refs/heads/main/assets/logo.PNG';
                    let _0x19aa49 = null;
                    try {
                        const _0x35e055 = await fetch(_0x114062);
                        if (_0x35e055['ok']) {
                            const _0x253ba2 = await _0x35e055['arrayBuffer']();
                            _0x19aa49 = Buffer['from'](_0x253ba2);
                        }
                    } catch (_0x2ae759) {
                        const _0x594436 = _0x0_0x130ec2['join'](process['cwd'](), 'assets', 'logo.PNG');
                        if (_0x0_0x1a74a8['existsSync'](_0x594436)) {
                            _0x19aa49 = _0x0_0x1a74a8['readFileSync'](_0x594436);
                        }
                    }
                    let _0x135847 = '╭━━━━『\x20*' + (_0x0_0x18d182['botName'] || 'NOVA-MD') + '*\x20』━━⬣\x0a';
                    _0x135847 += '┃\x0a';
                    _0x135847 += '┃\x20✨\x20*Status:*\x20✅\x20ONLINE\x0a';
                    _0x135847 += '┃\x20🤖\x20*Version:*\x20' + (_0x0_0x18d182['version'] || '2.0.0') + '\x0a';
                    _0x135847 += '┃\x20⚙️\x20*Mode:*\x20' + _0x11e16a['toUpperCase']() + '\x0a';
                    _0x135847 += '┃\x20⏰\x20*Uptime:*\x20' + _0x2357c0 + 'h\x20' + _0x4f811b + 'm\x0a';
                    _0x135847 += '┃\x20📊\x20*Prefixes:*\x20' + _0x0_0x18d182['prefixes']['join']('\x20') + '\x0a';
                    _0x135847 += '┃\x20📦\x20*Plugins:*\x20' + _0x0_0x21f655['commands']['size'] + '\x0a';
                    _0x135847 += '┃\x20💾\x20*Storage:*\x20' + _0x0_0x352218['getStats']()['backend']['toUpperCase']() + '\x0a';
                    _0x135847 += '┃\x0a';
                    _0x135847 += '┃━━━━━━━━━━━━━━━━━⬣\x0a';
                    _0x135847 += '┃\x0a';
                    _0x135847 += '┃\x20👑\x20*Owner:*\x20' + _0x7a7611 + '\x0a';
                    _0x135847 += '┃\x20📱\x20*Number:*\x20' + _0x13ece0 + '\x0a';
                    _0x135847 += '┃\x20🔗\x20wa.me/' + _0x13ece0 + '\x0a';
                    _0x135847 += '┃\x0a';
                    _0x135847 += '┃━━━━━━━━━━━━━━━━━⬣\x0a';
                    _0x135847 += '┃\x0a';
                    _0x135847 += '┃\x20🌐\x20*JOIN\x20CHANNELS*\x0a';
                    _0x135847 += '┃\x0a';
                    _0x135847 += '┃\x20💬\x20*FaceBook:*\x0a';
                    _0x135847 += '┃\x20https://www.facebook.com/profile.php?id=61591828051151\x0a';
                    _0x135847 += '┃\x0a';
                    _0x135847 += '┃\x20📱\x20*Telegram:*\x0a';
                    _0x135847 += '┃\x20https://t.me/addlist/CpQzYQfWwwxmYTk0\x0a';
                    _0x135847 += '┃\x0a';
                    _0x135847 += '┃\x20▶️\x20*YouTube:*\x0a';
                    _0x135847 += '┃\x20https://youtube.com/@labokingfreesurf\x0a';
                    _0x135847 += '┃\x0a';
                    _0x135847 += '┃━━━━━━━━━━━━━━━━━⬣\x0a';
                    _0x135847 += '┃\x0a';
                    _0x135847 += '┃\x20✨\x20_Powered\x20by\x20NOSTRA._\x0a';
                    _0x135847 += '╰━━━━━━━━━━━━━━━━━⬣';
                    const _0x53571e = _0xae6206['user']['id']['split'](':')[0x0] + '@s.whatsapp.net';
                    if (_0x19aa49) {
                        await _0xae6206['sendMessage'](_0x53571e, {
                            'image': _0x19aa49,
                            'caption': _0x135847,
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
                        await _0xae6206['sendMessage'](_0x53571e, {
                            'text': _0x135847,
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
                } catch (_0x5d465a) {
                    printLog('error', 'Failed\x20to\x20send\x20automatic\x20about\x20message:\x20' + _0x5d465a['message']);
                }
                const _0x58bd35 = await _0x0_0x352218['getSetting']('global', 'stealthMode');
                if (_0x58bd35 && _0x58bd35['enabled']) {
                    printLog('info', '👻\x20STEALTH\x20MODE\x20ACTIVE');
                }
                printLog('success', 'Connected\x20to\x20=>\x20' + JSON['stringify'](_0xae6206['user'], null, 0x2));
                await delay(0x7cf);
                try {
                    owner = JSON['parse'](_0x0_0x1a74a8['readFileSync']('./data/owner.json', 'utf-8'));
                } catch (_0x5ee32f) {
                }
                printLog('info', '[\x20' + (_0x0_0x18d182['botName'] || 'NOVA-MD') + '\x20]');
                printLog('info', '👑\x20OWNER\x20\x20:\x20' + (owner[0x0] || _0x0_0x18d182['ownerNumber'] || 'Not\x20set'));
                printLog('success', 'Bot\x20Connected\x20Successfully!');
                printLog('info', '📦\x20Plugins\x20\x20\x20:\x20' + _0x0_0x21f655['commands']['size']);
                printLog('info', '📊\x20Prefixes\x20\x20:\x20' + _0x0_0x18d182['prefixes']['join'](',\x20'));
                printLog('store', '💾\x20Backend\x20\x20\x20:\x20' + _0x0_0x352218['getStats']()['backend']);
                console['log']();
            }
            if (_0x3c7080 === 'close') {
                const _0x10af2b = _0x32d0ff?.['error']?.['output']?.['statusCode'];
                const _0xdc71e5 = _0x10af2b !== DisconnectReason['loggedOut'] && _0x10af2b !== 0x191;
                if (_0x10af2b === DisconnectReason['loggedOut'] || _0x10af2b === 0x191) {
                    try {
                        rmSync('./session', {
                            'recursive': !![],
                            'force': !![]
                        });
                    } catch (_0x7cf7e8) {
                    }
                    await delay(0xbb8);
                    startNovaXCode();
                    return;
                }
                if (_0xdc71e5) {
                    printLog('connection', 'Reconnecting\x20in\x205\x20seconds...');
                    await delay(0x1388);
                    startNovaXCode();
                }
            }
        });
        _0xae6206['ev']['on']('call', async _0x590bcc => {
            await handleCall(_0xae6206, _0x590bcc);
        });
        _0xae6206['ev']['on']('group-participants.update', async _0x2b8f99 => {
            await handleGroupParticipantUpdate(_0xae6206, _0x2b8f99);
        });
        _0xae6206['ev']['on']('status.update', async _0x22c2e4 => {
            await handleStatus(_0xae6206, _0x22c2e4);
        });
        _0xae6206['ev']['on']('messages.reaction', async _0x6af178 => {
            await handleStatus(_0xae6206, _0x6af178);
        });
        return _0xae6206;
    } catch (_0x50f4db) {
        printLog('error', 'Error\x20in\x20startNovaXCode:\x20' + _0x50f4db['message']);
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
    printLog('info', '📱\x20Open\x20http://localhost:' + (_0x0_0x18d182['port'] || 0x1388) + '/pairing\x20in\x20your\x20browser\x20if\x20it\x27s\x20local');
    printLog('info', '📱\x20For\x20web\x20service\x20deployment,\x20click\x20the\x20service\x20URL\x20and\x20add\x20/pairing\x20at\x20the\x20end');
    const _0x31083d = 0x1e * 0x3c * 0x3e8;
    const _0x2f3400 = Date['now']();
    const _0x3c3032 = 0xbb8;
    return new Promise((_0x2d3e8b, _0x2b101c) => {
        const _0x1abfcd = setInterval(() => {
            if (hasValidSession()) {
                clearInterval(_0x1abfcd);
                printLog('success', '✅\x20Session\x20detected!\x20Starting\x20bot...');
                _0x2d3e8b();
            }
            if (Date['now']() - _0x2f3400 > _0x31083d) {
                clearInterval(_0x1abfcd);
                _0x2b101c(new Error('Session\x20creation\x20timeout\x20(30\x20minutes)'));
            }
        }, _0x3c3032);
    });
}
async function main() {
    await compileAll();
    await _0x0_0x21f655['loadCommands']();
    printLog('info', 'Starting\x20NOVA-MD\x20BOT...');
    printLog('info', '👑\x20Owner\x20System:\x20Use\x20`.owner`\x20command\x20to\x20manage\x20owners');
    if (hasValidSession()) {
        printLog('success', '✅\x20Valid\x20session\x20found,\x20starting\x20bot...');
        await delay(0xbb8);
        startNovaXCode()['catch'](_0x784a66 => {
            printLog('error', 'Fatal\x20error:\x20' + _0x784a66['message']);
            if (rl && !rlClosed)
                rl['close']();
            process['exit'](0x1);
        });
    } else {
        printLog('info', '🌐\x20No\x20session\x20found.\x20Launching\x20web\x20pairing\x20interface...');
        printLog('info', '📱\x20Open\x20http://localhost:' + (_0x0_0x18d182['port'] || 0x1388) + '/pairing\x20in\x20your\x20browser\x20to\x20connect\x20WhatsApp');
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
            startNovaXCode()['catch'](_0x5f5622 => {
                printLog('error', 'Fatal\x20error:\x20' + _0x5f5622['message']);
                if (rl && !rlClosed)
                    rl['close']();
                process['exit'](0x1);
            });
        } catch (_0x197b96) {
            printLog('error', 'Session\x20creation\x20failed:\x20' + _0x197b96['message']);
            if (rl && !rlClosed)
                rl['close']();
            process['exit'](0x1);
        }
    }
}
main();
const sessionDir = _0x0_0x130ec2['join'](process['cwd'](), 'session');
setInterval(() => {
    if (!_0x0_0x1a74a8['existsSync'](sessionDir))
        return;
    _0x0_0x1a74a8['readdir'](sessionDir, (_0x4c97ca, _0x213fa8) => {
        if (_0x4c97ca)
            return;
        for (const _0xc2290c of _0x213fa8) {
            if (_0xc2290c === 'creds.json')
                continue;
            if (_0xc2290c['startsWith']('app-state-sync-key-'))
                continue;
            _0x0_0x1a74a8['unlink'](_0x0_0x130ec2['join'](sessionDir, _0xc2290c), () => {
            });
        }
    });
}, 0x3 * 0x3c * 0x3e8);
const customTemp = _0x0_0x130ec2['join'](process['cwd'](), 'temp');
if (!_0x0_0x1a74a8['existsSync'](customTemp))
    _0x0_0x1a74a8['mkdirSync'](customTemp, { 'recursive': !![] });
process.env.TMPDIR = customTemp;
process.env.TEMP = customTemp;
process.env.TMP = customTemp;
setInterval(() => {
    _0x0_0x1a74a8['readdir'](customTemp, (_0x403ced, _0x3e665a) => {
        if (_0x403ced)
            return;
        for (const _0x1ff902 of _0x3e665a) {
            const _0x366f3f = _0x0_0x130ec2['join'](customTemp, _0x1ff902);
            _0x0_0x1a74a8['stat'](_0x366f3f, (_0xe50be9, _0x95b792) => {
                if (!_0xe50be9 && Date['now']() - _0x95b792['mtimeMs'] > 0x3 * 0x3c * 0x3c * 0x3e8) {
                    _0x0_0x1a74a8['unlink'](_0x366f3f, () => {
                    });
                }
            });
        }
    });
}, 0x1 * 0x3c * 0x3c * 0x3e8);
const folders = [
    _0x0_0x130ec2['join'](__dirname, './lib'),
    _0x0_0x130ec2['join'](__dirname, './plugins')
];
folders['forEach'](_0x1e5094 => {
    if (!_0x0_0x1a74a8['existsSync'](_0x1e5094))
        return;
    _0x0_0x1a74a8['readdirSync'](_0x1e5094)['filter'](_0x2f17cc => _0x2f17cc['endsWith']('.js'))['forEach'](_0x14ebe4 => {
        const _0x57f009 = _0x0_0x130ec2['join'](_0x1e5094, _0x14ebe4);
        try {
            const _0x449c42 = _0x0_0x1a74a8['readFileSync'](_0x57f009, 'utf-8');
            const _0x20570b = _0x0_0x309ea3(_0x449c42, _0x14ebe4, {
                'sourceType': 'module',
                'allowAwaitOutsideFunction': !![]
            });
            if (_0x20570b) {
                console['error'](_0x0_0x549065['red']('❌\x20Syntax\x20error\x20in\x20' + _0x57f009 + ':\x0a' + _0x20570b));
            }
        } catch (_0x383a27) {
            console['error'](_0x0_0x549065['yellow']('⚠️\x20Cannot\x20read\x20file\x20' + _0x57f009 + ':\x0a' + _0x383a27));
        }
    });
});
process['on']('uncaughtException', _0x5bc86a => {
    printLog('error', 'Uncaught\x20Exception:\x20' + _0x5bc86a['message']);
    console['error'](_0x5bc86a['stack']);
    writeErrorLog({
        'type': 'uncaughtException',
        'error': _0x5bc86a['message'],
        'stack': _0x5bc86a['stack'],
        'timestamp': new Date()['toISOString']()
    });
});
process['on']('unhandledRejection', _0x522491 => {
    printLog('error', 'Unhandled\x20Rejection:\x20' + _0x522491['message']);
    console['error'](_0x522491['stack']);
    writeErrorLog({
        'type': 'unhandledRejection',
        'error': _0x522491['message'],
        'stack': _0x522491['stack'],
        'timestamp': new Date()['toISOString']()
    });
});
server['on']('error', _0x39d8ae => {
    if (_0x39d8ae['code'] === 'EADDRINUSE') {
        printLog('error', 'Address\x20localhost:' + PORT + '\x20in\x20use');
        writeErrorLog({
            'type': 'serverError',
            'error': 'Address\x20localhost:' + PORT + '\x20in\x20use',
            'timestamp': new Date()['toISOString']()
        });
        server['close']();
    } else {
        printLog('error', 'Server\x20error:\x20' + _0x39d8ae['message']);
        writeErrorLog({
            'type': 'serverError',
            'error': _0x39d8ae['message'],
            'stack': _0x39d8ae['stack'],
            'timestamp': new Date()['toISOString']()
        });
    }
});