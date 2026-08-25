import 'dotenv/config';
import _0x0_0x455738, {
    existsSync,
    mkdirSync,
    rmSync
} from 'fs';
import _0x0_0x29e5ab, { dirname } from 'path';
import _0x0_0x27c730 from 'chalk';
import _0x0_0x220400 from 'syntax-error';
import { parsePhoneNumber as _0x0_0x4afae8 } from 'awesome-phonenumber';
import _0x0_0x21500a from 'readline';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { smsg } from './lib/myfunc.js';
import { compileAll } from './lib/compile.js';
import _0x0_0x138eab, {
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    Browsers,
    jidDecode,
    jidNormalizedUser,
    makeCacheableSignalKeyStore,
    delay
} from '@whiskeysockets/baileys';
import _0x0_0x18529b from 'node-cache';
import _0x0_0xb91f69 from 'pino';
import _0x0_0x39a4e7 from './config.js';
import _0x0_0x25f433 from './lib/lightweight_store.js';
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
import _0x0_0x5f02e9 from './lib/commandHandler.js';
import _0x0_0x49dc48 from './lib/sessionManager.js';
_0x0_0x25f433['readFromFile']();
setInterval(() => _0x0_0x25f433['writeToFile'](), _0x0_0x39a4e7['storeWriteInterval'] || 0x2710);
setInterval(() => {
    if (global['gc']) {
        global['gc']();
        console['log']('🧹\x20Garbage\x20collection\x20completed');
    }
}, 0xea60);
setInterval(() => {
    const _0x370deb = process['memoryUsage']()['rss'] / 0x400 / 0x400;
    if (_0x370deb > 0x190) {
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
_0x0_0x455738['mkdirSync']('./data', { 'recursive': !![] });
for (const [file, def] of Object['entries'](DATA_DEFAULTS)) {
    const fp = './data/' + file;
    if (!_0x0_0x455738['existsSync'](fp))
        _0x0_0x455738['writeFileSync'](fp, JSON['stringify'](def, null, 0x2));
}
let owner = [];
try {
    owner = JSON['parse'](_0x0_0x455738['readFileSync']('./data/owner.json', 'utf-8'));
} catch {
    owner = [];
}
global['botname'] = _0x0_0x39a4e7['botName'] || 'NOVA-MD';
global['themeemoji'] = '•';
const pairingCode = ![];
const useMobile = process['argv']['includes']('--mobile');
let rl = null;
let rlClosed = ![];
if (process['stdin']['isTTY'] && !_0x0_0x39a4e7['pairingNumber']) {
    rl = _0x0_0x21500a['createInterface']({
        'input': process['stdin'],
        'output': process['stdout']
    });
    rl['on']('close', () => {
        rlClosed = !![];
    });
}
const question = _0x1cf1ec => {
    if (rl && !rlClosed) {
        return new Promise(_0x4ac043 => rl['question'](_0x1cf1ec, _0x4ac043));
    } else {
        return Promise['resolve'](_0x0_0x39a4e7['ownerNumber'] || '237676250509');
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
    const _0x1fb4c1 = _0x0_0x29e5ab['join'](__dirname, 'session');
    if (!existsSync(_0x1fb4c1)) {
        mkdirSync(_0x1fb4c1, { 'recursive': !![] });
    }
    return _0x1fb4c1;
}
function hasValidSession() {
    return _0x0_0x49dc48['hasValidSession']();
}
server['listen'](PORT, () => {
    printLog('success', 'Server\x20listening\x20on\x20port\x20' + PORT);
    printLog('info', '🌐\x20Web\x20interface\x20available\x20at:\x20http://localhost:' + PORT + '/pairing');
});
async function startNovaXCode() {
    try {
        const {version: _0x14c75c} = await fetchLatestBaileysVersion();
        ensureSessionDirectory();
        await delay(0x3e8);
        const {
            state: _0x165277,
            saveCreds: _0xd70c20
        } = await useMultiFileAuthState('./session');
        const _0x1e9f1f = async () => {
            ensureSessionDirectory();
            await _0xd70c20();
        };
        const _0x487702 = new _0x0_0x18529b();
        const _0x2ee84f = await _0x0_0x25f433['getSetting']('global', 'stealthMode');
        const _0xea6f1c = _0x2ee84f && _0x2ee84f['enabled'];
        const _0x347384 = _0x0_0x138eab({
            'version': _0x14c75c,
            'logger': _0x0_0xb91f69({ 'level': 'silent' }),
            'browser': Browsers['macOS']('Chrome'),
            'auth': {
                'creds': _0x165277['creds'],
                'keys': makeCacheableSignalKeyStore(_0x165277['keys'], _0x0_0xb91f69({ 'level': 'fatal' })['child']({ 'level': 'fatal' }))
            },
            'markOnlineOnConnect': !_0xea6f1c,
            'generateHighQualityLinkPreview': !![],
            'syncFullHistory': ![],
            'getMessage': async _0x16a23f => {
                const _0x303432 = jidNormalizedUser(_0x16a23f['remoteJid']);
                const _0x510436 = await _0x0_0x25f433['loadMessage'](_0x303432, _0x16a23f['id']);
                return _0x510436?.['message'] || '';
            },
            'msgRetryCounterCache': _0x487702,
            'defaultQueryTimeoutMs': 0xea60,
            'connectTimeoutMs': 0xea60,
            'keepAliveIntervalMs': 0x2710
        });
        _0x347384['store'] = _0x0_0x25f433;
        const _0x9c0c73 = _0x347384['sendPresenceUpdate'];
        const _0x2e6fac = _0x347384['readMessages'];
        const _0x981ad1 = _0x347384['sendReceipt'];
        _0x347384['sendPresenceUpdate'] = async function (..._0x18fa9e) {
            const _0x590dd7 = await _0x0_0x25f433['getSetting']('global', 'stealthMode');
            if (_0x590dd7 && _0x590dd7['enabled']) {
                printLog('info', '👻\x20Blocked\x20presence\x20update\x20(stealth\x20mode)');
                return;
            }
            return _0x9c0c73['apply'](this, _0x18fa9e);
        };
        _0x347384['readMessages'] = async function (..._0x2d77b3) {
            const _0x39bf3d = await _0x0_0x25f433['getSetting']('global', 'stealthMode');
            if (_0x39bf3d && _0x39bf3d['enabled'])
                return;
            return _0x2e6fac['apply'](this, _0x2d77b3);
        };
        if (_0x981ad1) {
            _0x347384['sendReceipt'] = async function (..._0x3518b2) {
                const _0x566fa9 = await _0x0_0x25f433['getSetting']('global', 'stealthMode');
                if (_0x566fa9 && _0x566fa9['enabled'])
                    return;
                return _0x981ad1['apply'](this, _0x3518b2);
            };
        }
        const _0xafe9a5 = _0x347384['query'];
        _0x347384['query'] = async function (_0x321bbb, ..._0x2fb984) {
            const _0x167217 = await _0x0_0x25f433['getSetting']('global', 'stealthMode');
            if (_0x167217 && _0x167217['enabled']) {
                if (_0x321bbb && _0x321bbb['tag'] === 'receipt')
                    return;
                if (_0x321bbb && _0x321bbb['attrs'] && (_0x321bbb['attrs']['type'] === 'read' || _0x321bbb['attrs']['type'] === 'read-self'))
                    return;
            }
            return _0xafe9a5['apply'](this, [
                _0x321bbb,
                ..._0x2fb984
            ]);
        };
        _0x347384['isGhostMode'] = async () => {
            const _0x3e943c = await _0x0_0x25f433['getSetting']('global', 'stealthMode');
            return _0x3e943c && _0x3e943c['enabled'];
        };
        _0x347384['ev']['on']('creds.update', _0x1e9f1f);
        _0x0_0x25f433['bind'](_0x347384['ev']);
        _0x347384['ev']['on']('messages.upsert', async _0x539a0a => {
            try {
                const _0x4cc8a9 = _0x539a0a['messages'][0x0];
                if (!_0x4cc8a9['message'])
                    return;
                _0x4cc8a9['message'] = Object['keys'](_0x4cc8a9['message'])[0x0] === 'ephemeralMessage' ? _0x4cc8a9['message']['ephemeralMessage']['message'] : _0x4cc8a9['message'];
                if (_0x4cc8a9['key'] && _0x4cc8a9['key']['remoteJid'] === 'status@broadcast') {
                    await handleStatus(_0x347384, _0x539a0a);
                    return;
                }
                if (!_0x347384['public'] && !_0x4cc8a9['key']['fromMe'] && _0x539a0a['type'] === 'notify') {
                    const _0x155a27 = _0x4cc8a9['key']?.['remoteJid']?.['endsWith']('@g.us');
                    if (!_0x155a27)
                        return;
                }
                if (_0x4cc8a9['key']['id']['startsWith']('BAE5') && _0x4cc8a9['key']['id']['length'] === 0x10)
                    return;
                if (_0x347384?.['msgRetryCounterCache']) {
                    _0x347384['msgRetryCounterCache']['clear']();
                }
                try {
                    await handleMessages(_0x347384, _0x539a0a);
                } catch (_0x42c750) {
                    printLog('error', 'Error\x20in\x20handleMessages:\x20' + _0x42c750['message']);
                    if (_0x4cc8a9['key'] && _0x4cc8a9['key']['remoteJid']) {
                        await _0x347384['sendMessage'](_0x4cc8a9['key']['remoteJid'], {
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
            } catch (_0x4f6c13) {
                printLog('error', 'Error\x20in\x20messages.upsert:\x20' + _0x4f6c13['message']);
            }
        });
        _0x347384['decodeJid'] = _0x36f8f6 => {
            if (!_0x36f8f6)
                return _0x36f8f6;
            if (/:\d+@/gi['test'](_0x36f8f6)) {
                const _0x36df6e = jidDecode(_0x36f8f6) || {};
                return _0x36df6e['user'] && _0x36df6e['server'] && _0x36df6e['user'] + '@' + _0x36df6e['server'] || _0x36f8f6;
            } else
                return _0x36f8f6;
        };
        _0x347384['ev']['on']('contacts.update', _0x14118e => {
            for (const _0x1a1998 of _0x14118e) {
                const _0x345a66 = _0x347384['decodeJid'](_0x1a1998['id']);
                if (_0x0_0x25f433 && _0x0_0x25f433['contacts'])
                    _0x0_0x25f433['contacts'][_0x345a66] = {
                        'id': _0x345a66,
                        'name': _0x1a1998['notify']
                    };
            }
        });
        _0x347384['getName'] = (_0x3fbf62, _0x386c1a = ![]) => {
            const _0x54e4be = _0x347384['decodeJid'](_0x3fbf62);
            _0x386c1a = _0x347384['withoutContact'] || _0x386c1a;
            let _0x545927;
            if (_0x54e4be['endsWith']('@g.us'))
                return new Promise(async _0x3bbe75 => {
                    _0x545927 = _0x0_0x25f433['contacts'][_0x54e4be] || {};
                    if (!(_0x545927['name'] || _0x545927['subject']))
                        _0x545927 = _0x347384['groupMetadata'](_0x54e4be) || {};
                    _0x3bbe75(_0x545927['name'] || _0x545927['subject'] || _0x0_0x4afae8('+' + _0x54e4be['replace']('@s.whatsapp.net', ''))['number']?.['international']);
                });
            else
                _0x545927 = _0x54e4be === '0@s.whatsapp.net' ? {
                    'id': _0x54e4be,
                    'name': 'WhatsApp'
                } : _0x54e4be === _0x347384['decodeJid'](_0x347384['user']['id']) ? _0x347384['user'] : _0x0_0x25f433['contacts'][_0x54e4be] || {};
            return (_0x386c1a ? '' : _0x545927['name']) || _0x545927['subject'] || _0x545927['verifiedName'] || _0x0_0x4afae8('+' + _0x3fbf62['replace']('@s.whatsapp.net', ''))['number']?.['international'];
        };
        _0x347384['public'] = !![];
        _0x347384['serializeM'] = _0x494496 => smsg(_0x347384, _0x494496, _0x0_0x25f433);
        const _0x3f3023 = _0x165277['creds']?.['registered'] === !![];
        if (_0x3f3023) {
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
        _0x347384['ev']['on']('connection.update', async _0x204a49 => {
            const {
                connection: _0x54496d,
                lastDisconnect: _0x1f677e,
                qr: _0xf2246
            } = _0x204a49;
            if (_0x54496d === 'open') {
                printLog('success', 'Bot\x20connected\x20successfully!');
                try {
                    const _0x4a7bd6 = await _0x0_0x25f433['getBotMode']();
                    const _0x4410a0 = process['uptime']();
                    const _0x3cca50 = Math['floor'](_0x4410a0 / 0xe10);
                    const _0x295d2e = Math['floor'](_0x4410a0 % 0xe10 / 0x3c);
                    const _0x1f6f05 = 'https://raw.githubusercontent.com/NOSTRA-DevOps/Nova-MD/refs/heads/main/assets/logo.PNG';
                    let _0x27a048 = null;
                    try {
                        const _0x194dd9 = await fetch(_0x1f6f05);
                        if (_0x194dd9['ok']) {
                            const _0x5bd26b = await _0x194dd9['arrayBuffer']();
                            _0x27a048 = Buffer['from'](_0x5bd26b);
                        }
                    } catch (_0x1cf897) {
                        const _0x33f8ca = _0x0_0x29e5ab['join'](process['cwd'](), 'assets', 'logo.PNG');
                        if (_0x0_0x455738['existsSync'](_0x33f8ca)) {
                            _0x27a048 = _0x0_0x455738['readFileSync'](_0x33f8ca);
                        }
                    }
                    let _0x4d36ad = '╭━━━━『\x20*' + (_0x0_0x39a4e7['botName'] || 'NOVA-MD') + '*\x20』━━⬣\x0a';
                    _0x4d36ad += '┃\x0a';
                    _0x4d36ad += '┃\x20✨\x20*Status:*\x20✅\x20ONLINE\x0a';
                    _0x4d36ad += '┃\x20🤖\x20*Version:*\x20' + (_0x0_0x39a4e7['version'] || '2.0.0') + '\x0a';
                    _0x4d36ad += '┃\x20⚙️\x20*Mode:*\x20' + _0x4a7bd6['toUpperCase']() + '\x0a';
                    _0x4d36ad += '┃\x20⏰\x20*Uptime:*\x20' + _0x3cca50 + 'h\x20' + _0x295d2e + 'm\x0a';
                    _0x4d36ad += '┃\x20📊\x20*Prefixes:*\x20' + _0x0_0x39a4e7['prefixes']['join']('\x20') + '\x0a';
                    _0x4d36ad += '┃\x20📦\x20*Plugins:*\x20' + _0x0_0x5f02e9['commands']['size'] + '\x0a';
                    _0x4d36ad += '┃\x20💾\x20*Storage:*\x20' + _0x0_0x25f433['getStats']()['backend']['toUpperCase']() + '\x0a';
                    _0x4d36ad += '┃\x0a';
                    _0x4d36ad += '┃━━━━━━━━━━━━━━━━━⬣\x0a';
                    _0x4d36ad += '┃\x0a';
                    _0x4d36ad += '┃\x20🌐\x20*JOIN\x20CHANNELS*\x0a';
                    _0x4d36ad += '┃\x0a';
                    _0x4d36ad += '┃\x20💬\x20*FaceBook:*\x0a';
                    _0x4d36ad += '┃\x20https://www.facebook.com/profile.php?id=61591828051151\x0a';
                    _0x4d36ad += '┃\x0a';
                    _0x4d36ad += '┃\x20📱\x20*Telegram:*\x0a';
                    _0x4d36ad += '┃\x20https://t.me/addlist/CpQzYQfWwwxmYTk0\x0a';
                    _0x4d36ad += '┃\x0a';
                    _0x4d36ad += '┃\x20▶️\x20*YouTube:*\x0a';
                    _0x4d36ad += '┃\x20https://youtube.com/@labokingfreesurf\x0a';
                    _0x4d36ad += '┃\x0a';
                    _0x4d36ad += '┃━━━━━━━━━━━━━━━━━⬣\x0a';
                    _0x4d36ad += '┃\x0a';
                    _0x4d36ad += '┃\x20✨\x20_Powered\x20by\x20NOSTRA._\x0a';
                    _0x4d36ad += '╰━━━━━━━━━━━━━━━━━⬣';
                    const _0x352e0b = _0x347384['user']['id']['split'](':')[0x0] + '@s.whatsapp.net';
                    _0x0_0x39a4e7['ownerNumber'] = _0x352e0b;
                    if (_0x27a048) {
                        await _0x347384['sendMessage'](_0x352e0b, {
                            'image': _0x27a048,
                            'caption': _0x4d36ad,
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
                        await _0x347384['sendMessage'](_0x352e0b, {
                            'text': _0x4d36ad,
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
                } catch (_0x23c1ba) {
                    printLog('error', 'Failed\x20to\x20send\x20automatic\x20about\x20message:\x20' + _0x23c1ba['message']);
                }
                const _0xae3193 = await _0x0_0x25f433['getSetting']('global', 'stealthMode');
                if (_0xae3193 && _0xae3193['enabled']) {
                    printLog('info', '👻\x20STEALTH\x20MODE\x20ACTIVE');
                }
                printLog('success', 'Connected\x20to\x20=>\x20' + JSON['stringify'](_0x347384['user'], null, 0x2));
                await delay(0x7cf);
                try {
                    owner = JSON['parse'](_0x0_0x455738['readFileSync']('./data/owner.json', 'utf-8'));
                } catch (_0x2c03dc) {
                }
                printLog('info', '[\x20' + (_0x0_0x39a4e7['botName'] || 'NOVA-MD') + '\x20]');
                printLog('info', 'WA\x20NUMBER\x20\x20:\x20' + (owner[0x0] || _0x0_0x39a4e7['ownerNumber'] || ''));
                printLog('success', 'Bot\x20Connected\x20Successfully!');
                printLog('info', 'Plugins\x20\x20\x20:\x20' + _0x0_0x5f02e9['commands']['size']);
                printLog('info', 'Prefixes\x20\x20\x20:\x20' + _0x0_0x39a4e7['prefixes']['join'](',\x20'));
                printLog('store', 'Backend\x20\x20\x20\x20:\x20' + _0x0_0x25f433['getStats']()['backend']);
                console['log']();
            }
            if (_0x54496d === 'close') {
                const _0x2bafbd = _0x1f677e?.['error']?.['output']?.['statusCode'];
                const _0x2504fe = _0x2bafbd !== DisconnectReason['loggedOut'] && _0x2bafbd !== 0x191;
                if (_0x2bafbd === DisconnectReason['loggedOut'] || _0x2bafbd === 0x191) {
                    try {
                        rmSync('./session', {
                            'recursive': !![],
                            'force': !![]
                        });
                    } catch (_0x285c2c) {
                    }
                    await delay(0xbb8);
                    startNovaXCode();
                    return;
                }
                if (_0x2504fe) {
                    printLog('connection', 'Reconnecting\x20in\x205\x20seconds...');
                    await delay(0x1388);
                    startNovaXCode();
                }
            }
        });
        _0x347384['ev']['on']('call', async _0x4d06bc => {
            await handleCall(_0x347384, _0x4d06bc);
        });
        _0x347384['ev']['on']('group-participants.update', async _0xfffe21 => {
            await handleGroupParticipantUpdate(_0x347384, _0xfffe21);
        });
        _0x347384['ev']['on']('status.update', async _0x4c92fb => {
            await handleStatus(_0x347384, _0x4c92fb);
        });
        _0x347384['ev']['on']('messages.reaction', async _0x320192 => {
            await handleStatus(_0x347384, _0x320192);
        });
        return _0x347384;
    } catch (_0x278750) {
        printLog('error', 'Error\x20in\x20startNovaXCode:\x20' + _0x278750['message']);
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
    printLog('info', '📱\x20Open\x20http://localhost:' + (_0x0_0x39a4e7['port'] || 0x1388) + '/pairing\x20in\x20your\x20browser\x20if\x20it\x27s\x20local');
    printLog('info', '📱\x20For\x20web\x20servic\x20deployment,\x20click\x20the\x20service\x20URL\x20and\x20add\x20/pairing\x20at\x20the\x20end');
    const _0x5f4804 = 0x1e * 0x3c * 0x3e8;
    const _0x3aa7e8 = Date['now']();
    const _0xeff2f6 = 0xbb8;
    return new Promise((_0x10f7d8, _0x14140e) => {
        const _0x3ffb49 = setInterval(() => {
            if (hasValidSession()) {
                clearInterval(_0x3ffb49);
                printLog('success', '✅\x20Session\x20detected!\x20Starting\x20bot...');
                _0x10f7d8();
            }
            if (Date['now']() - _0x3aa7e8 > _0x5f4804) {
                clearInterval(_0x3ffb49);
                _0x14140e(new Error('Session\x20creation\x20timeout\x20(30\x20minutes)'));
            }
        }, _0xeff2f6);
    });
}
async function main() {
    await compileAll();
    await _0x0_0x5f02e9['loadCommands']();
    printLog('info', 'Starting\x20NOVA-MD\x20BOT...');
    if (hasValidSession()) {
        printLog('success', '✅\x20Valid\x20session\x20found,\x20starting\x20bot...');
        await delay(0xbb8);
        startNovaXCode()['catch'](_0x41792d => {
            printLog('error', 'Fatal\x20error:\x20' + _0x41792d['message']);
            if (rl && !rlClosed)
                rl['close']();
            process['exit'](0x1);
        });
    } else {
        printLog('info', '🌐\x20No\x20session\x20found.\x20Launching\x20web\x20pairing\x20interface...');
        printLog('info', '📱\x20Open\x20http://localhost:' + (_0x0_0x39a4e7['port'] || 0x1388) + '/pairing\x20in\x20your\x20browser\x20to\x20connect\x20WhatsApp');
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
            startNovaXCode()['catch'](_0x50f878 => {
                printLog('error', 'Fatal\x20error:\x20' + _0x50f878['message']);
                if (rl && !rlClosed)
                    rl['close']();
                process['exit'](0x1);
            });
        } catch (_0x4148b5) {
            printLog('error', 'Session\x20creation\x20failed:\x20' + _0x4148b5['message']);
            if (rl && !rlClosed)
                rl['close']();
            process['exit'](0x1);
        }
    }
}
main();
const sessionDir = _0x0_0x29e5ab['join'](process['cwd'](), 'session');
setInterval(() => {
    if (!_0x0_0x455738['existsSync'](sessionDir))
        return;
    _0x0_0x455738['readdir'](sessionDir, (_0x5d7b54, _0x9a3cd9) => {
        if (_0x5d7b54)
            return;
        for (const _0x252f85 of _0x9a3cd9) {
            if (_0x252f85 === 'creds.json')
                continue;
            if (_0x252f85['startsWith']('app-state-sync-key-'))
                continue;
            _0x0_0x455738['unlink'](_0x0_0x29e5ab['join'](sessionDir, _0x252f85), () => {
            });
        }
    });
}, 0x3 * 0x3c * 0x3e8);
const customTemp = _0x0_0x29e5ab['join'](process['cwd'](), 'temp');
if (!_0x0_0x455738['existsSync'](customTemp))
    _0x0_0x455738['mkdirSync'](customTemp, { 'recursive': !![] });
process.env.TMPDIR = customTemp;
process.env.TEMP = customTemp;
process.env.TMP = customTemp;
setInterval(() => {
    _0x0_0x455738['readdir'](customTemp, (_0x8a3c16, _0x263ab1) => {
        if (_0x8a3c16)
            return;
        for (const _0x53999e of _0x263ab1) {
            const _0x4b2145 = _0x0_0x29e5ab['join'](customTemp, _0x53999e);
            _0x0_0x455738['stat'](_0x4b2145, (_0x1cd957, _0x421b17) => {
                if (!_0x1cd957 && Date['now']() - _0x421b17['mtimeMs'] > 0x3 * 0x3c * 0x3c * 0x3e8) {
                    _0x0_0x455738['unlink'](_0x4b2145, () => {
                    });
                }
            });
        }
    });
}, 0x1 * 0x3c * 0x3c * 0x3e8);
const folders = [
    _0x0_0x29e5ab['join'](__dirname, './lib'),
    _0x0_0x29e5ab['join'](__dirname, './plugins')
];
folders['forEach'](_0x285aec => {
    if (!_0x0_0x455738['existsSync'](_0x285aec))
        return;
    _0x0_0x455738['readdirSync'](_0x285aec)['filter'](_0x1e79a2 => _0x1e79a2['endsWith']('.js'))['forEach'](_0x1e334e => {
        const _0x3e7ba6 = _0x0_0x29e5ab['join'](_0x285aec, _0x1e334e);
        try {
            const _0x5d1546 = _0x0_0x455738['readFileSync'](_0x3e7ba6, 'utf-8');
            const _0x549301 = _0x0_0x220400(_0x5d1546, _0x1e334e, {
                'sourceType': 'module',
                'allowAwaitOutsideFunction': !![]
            });
            if (_0x549301) {
                console['error'](_0x0_0x27c730['red']('❌\x20Syntax\x20error\x20in\x20' + _0x3e7ba6 + ':\x0a' + _0x549301));
            }
        } catch (_0x26c5a7) {
            console['error'](_0x0_0x27c730['yellow']('⚠️\x20Cannot\x20read\x20file\x20' + _0x3e7ba6 + ':\x0a' + _0x26c5a7));
        }
    });
});
process['on']('uncaughtException', _0xff92c7 => {
    printLog('error', 'Uncaught\x20Exception:\x20' + _0xff92c7['message']);
    console['error'](_0xff92c7['stack']);
    writeErrorLog({
        'type': 'uncaughtException',
        'error': _0xff92c7['message'],
        'stack': _0xff92c7['stack'],
        'timestamp': new Date()['toISOString']()
    });
});
process['on']('unhandledRejection', _0x44555c => {
    printLog('error', 'Unhandled\x20Rejection:\x20' + _0x44555c['message']);
    console['error'](_0x44555c['stack']);
    writeErrorLog({
        'type': 'unhandledRejection',
        'error': _0x44555c['message'],
        'stack': _0x44555c['stack'],
        'timestamp': new Date()['toISOString']()
    });
});
server['on']('error', _0x21c1a1 => {
    if (_0x21c1a1['code'] === 'EADDRINUSE') {
        printLog('error', 'Address\x20localhost:' + PORT + '\x20in\x20use');
        writeErrorLog({
            'type': 'serverError',
            'error': 'Address\x20localhost:' + PORT + '\x20in\x20use',
            'timestamp': new Date()['toISOString']()
        });
        server['close']();
    } else {
        printLog('error', 'Server\x20error:\x20' + _0x21c1a1['message']);
        writeErrorLog({
            'type': 'serverError',
            'error': _0x21c1a1['message'],
            'stack': _0x21c1a1['stack'],
            'timestamp': new Date()['toISOString']()
        });
    }
});