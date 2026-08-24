import 'dotenv/config';
import _0x0_0x3767a7, {
    existsSync,
    mkdirSync,
    rmSync
} from 'fs';
import _0x0_0x3f902c, { dirname } from 'path';
import _0x0_0x4ff2d4 from 'chalk';
import _0x0_0x3c60fb from 'syntax-error';
import { parsePhoneNumber as _0x0_0x3db7c4 } from 'awesome-phonenumber';
import _0x0_0x15b0e2 from 'readline';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { smsg } from './lib/myfunc.js';
import { compileAll } from './lib/compile.js';
import _0x0_0x23e403, {
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    Browsers,
    jidDecode,
    jidNormalizedUser,
    makeCacheableSignalKeyStore,
    delay
} from '@whiskeysockets/baileys';
import _0x0_0x45c115 from 'node-cache';
import _0x0_0x14c654 from 'pino';
import _0x0_0x6a477d from './config.js';
import _0x0_0x53c4c7 from './lib/lightweight_store.js';
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
import _0x0_0x375729 from './lib/commandHandler.js';
import _0x0_0x4ff6dc from './lib/sessionManager.js';
_0x0_0x53c4c7['readFromFile']();
setInterval(() => _0x0_0x53c4c7['writeToFile'](), _0x0_0x6a477d['storeWriteInterval'] || 0x2710);
setInterval(() => {
    if (global['gc']) {
        global['gc']();
        console['log']('🧹\x20Garbage\x20collection\x20completed');
    }
}, 0xea60);
setInterval(() => {
    const _0x37ec88 = process['memoryUsage']()['rss'] / 0x400 / 0x400;
    if (_0x37ec88 > 0x190) {
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
_0x0_0x3767a7['mkdirSync']('./data', { 'recursive': !![] });
for (const [file, def] of Object['entries'](DATA_DEFAULTS)) {
    const fp = './data/' + file;
    if (!_0x0_0x3767a7['existsSync'](fp))
        _0x0_0x3767a7['writeFileSync'](fp, JSON['stringify'](def, null, 0x2));
}
let owner = [];
try {
    owner = JSON['parse'](_0x0_0x3767a7['readFileSync']('./data/owner.json', 'utf-8'));
} catch {
    owner = [];
}
global['botname'] = _0x0_0x6a477d['botName'] || 'NOVA-MD';
global['themeemoji'] = '•';
const pairingCode = ![];
const useMobile = process['argv']['includes']('--mobile');
let rl = null;
let rlClosed = ![];
if (process['stdin']['isTTY'] && !_0x0_0x6a477d['pairingNumber']) {
    rl = _0x0_0x15b0e2['createInterface']({
        'input': process['stdin'],
        'output': process['stdout']
    });
    rl['on']('close', () => {
        rlClosed = !![];
    });
}
const question = _0x4111c2 => {
    if (rl && !rlClosed) {
        return new Promise(_0x35b0b9 => rl['question'](_0x4111c2, _0x35b0b9));
    } else {
        return Promise['resolve'](_0x0_0x6a477d['ownerNumber'] || '237676250509');
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
    const _0x3edc2e = _0x0_0x3f902c['join'](__dirname, 'session');
    if (!existsSync(_0x3edc2e)) {
        mkdirSync(_0x3edc2e, { 'recursive': !![] });
    }
    return _0x3edc2e;
}
function hasValidSession() {
    return _0x0_0x4ff6dc['hasValidSession']();
}
server['listen'](PORT, () => {
    printLog('success', 'Server\x20listening\x20on\x20port\x20' + PORT);
    printLog('info', '🌐\x20Web\x20interface\x20available\x20at:\x20http://localhost:' + PORT + '/pairing');
});
async function startNovaXCode() {
    try {
        const {version: _0x3798c3} = await fetchLatestBaileysVersion();
        ensureSessionDirectory();
        await delay(0x3e8);
        const {
            state: _0x2000dc,
            saveCreds: _0x556a52
        } = await useMultiFileAuthState('./session');
        const _0xd222fb = async () => {
            ensureSessionDirectory();
            await _0x556a52();
        };
        const _0x314c01 = new _0x0_0x45c115();
        const _0x5eca26 = await _0x0_0x53c4c7['getSetting']('global', 'stealthMode');
        const _0x579d48 = _0x5eca26 && _0x5eca26['enabled'];
        const _0x3c6bc1 = _0x0_0x23e403({
            'version': _0x3798c3,
            'logger': _0x0_0x14c654({ 'level': 'silent' }),
            'browser': Browsers['macOS']('Chrome'),
            'auth': {
                'creds': _0x2000dc['creds'],
                'keys': makeCacheableSignalKeyStore(_0x2000dc['keys'], _0x0_0x14c654({ 'level': 'fatal' })['child']({ 'level': 'fatal' }))
            },
            'markOnlineOnConnect': !_0x579d48,
            'generateHighQualityLinkPreview': !![],
            'syncFullHistory': ![],
            'getMessage': async _0xf2cd4a => {
                const _0x310458 = jidNormalizedUser(_0xf2cd4a['remoteJid']);
                const _0x5d1852 = await _0x0_0x53c4c7['loadMessage'](_0x310458, _0xf2cd4a['id']);
                return _0x5d1852?.['message'] || '';
            },
            'msgRetryCounterCache': _0x314c01,
            'defaultQueryTimeoutMs': 0xea60,
            'connectTimeoutMs': 0xea60,
            'keepAliveIntervalMs': 0x2710
        });
        _0x3c6bc1['store'] = _0x0_0x53c4c7;
        const _0x487866 = _0x3c6bc1['sendPresenceUpdate'];
        const _0x3b67a8 = _0x3c6bc1['readMessages'];
        const _0x5b55d3 = _0x3c6bc1['sendReceipt'];
        _0x3c6bc1['sendPresenceUpdate'] = async function (..._0xfe943) {
            const _0x208f17 = await _0x0_0x53c4c7['getSetting']('global', 'stealthMode');
            if (_0x208f17 && _0x208f17['enabled']) {
                printLog('info', '👻\x20Blocked\x20presence\x20update\x20(stealth\x20mode)');
                return;
            }
            return _0x487866['apply'](this, _0xfe943);
        };
        _0x3c6bc1['readMessages'] = async function (..._0x317de2) {
            const _0x2b0c0d = await _0x0_0x53c4c7['getSetting']('global', 'stealthMode');
            if (_0x2b0c0d && _0x2b0c0d['enabled'])
                return;
            return _0x3b67a8['apply'](this, _0x317de2);
        };
        if (_0x5b55d3) {
            _0x3c6bc1['sendReceipt'] = async function (..._0x348a14) {
                const _0x59a5c6 = await _0x0_0x53c4c7['getSetting']('global', 'stealthMode');
                if (_0x59a5c6 && _0x59a5c6['enabled'])
                    return;
                return _0x5b55d3['apply'](this, _0x348a14);
            };
        }
        const _0x2fafda = _0x3c6bc1['query'];
        _0x3c6bc1['query'] = async function (_0x5a56db, ..._0x370483) {
            const _0x4a3586 = await _0x0_0x53c4c7['getSetting']('global', 'stealthMode');
            if (_0x4a3586 && _0x4a3586['enabled']) {
                if (_0x5a56db && _0x5a56db['tag'] === 'receipt')
                    return;
                if (_0x5a56db && _0x5a56db['attrs'] && (_0x5a56db['attrs']['type'] === 'read' || _0x5a56db['attrs']['type'] === 'read-self'))
                    return;
            }
            return _0x2fafda['apply'](this, [
                _0x5a56db,
                ..._0x370483
            ]);
        };
        _0x3c6bc1['isGhostMode'] = async () => {
            const _0xfdcb9d = await _0x0_0x53c4c7['getSetting']('global', 'stealthMode');
            return _0xfdcb9d && _0xfdcb9d['enabled'];
        };
        _0x3c6bc1['ev']['on']('creds.update', _0xd222fb);
        _0x0_0x53c4c7['bind'](_0x3c6bc1['ev']);
        _0x3c6bc1['ev']['on']('messages.upsert', async _0x3ade77 => {
            try {
                const _0x3c0065 = _0x3ade77['messages'][0x0];
                if (!_0x3c0065['message'])
                    return;
                _0x3c0065['message'] = Object['keys'](_0x3c0065['message'])[0x0] === 'ephemeralMessage' ? _0x3c0065['message']['ephemeralMessage']['message'] : _0x3c0065['message'];
                if (_0x3c0065['key'] && _0x3c0065['key']['remoteJid'] === 'status@broadcast') {
                    await handleStatus(_0x3c6bc1, _0x3ade77);
                    return;
                }
                if (!_0x3c6bc1['public'] && !_0x3c0065['key']['fromMe'] && _0x3ade77['type'] === 'notify') {
                    const _0x522c67 = _0x3c0065['key']?.['remoteJid']?.['endsWith']('@g.us');
                    if (!_0x522c67)
                        return;
                }
                if (_0x3c0065['key']['id']['startsWith']('BAE5') && _0x3c0065['key']['id']['length'] === 0x10)
                    return;
                if (_0x3c6bc1?.['msgRetryCounterCache']) {
                    _0x3c6bc1['msgRetryCounterCache']['clear']();
                }
                try {
                    await handleMessages(_0x3c6bc1, _0x3ade77);
                } catch (_0x40891f) {
                    printLog('error', 'Error\x20in\x20handleMessages:\x20' + _0x40891f['message']);
                    if (_0x3c0065['key'] && _0x3c0065['key']['remoteJid']) {
                        await _0x3c6bc1['sendMessage'](_0x3c0065['key']['remoteJid'], {
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
            } catch (_0x45d8b4) {
                printLog('error', 'Error\x20in\x20messages.upsert:\x20' + _0x45d8b4['message']);
            }
        });
        _0x3c6bc1['decodeJid'] = _0x1f3d92 => {
            if (!_0x1f3d92)
                return _0x1f3d92;
            if (/:\d+@/gi['test'](_0x1f3d92)) {
                const _0x34b6ec = jidDecode(_0x1f3d92) || {};
                return _0x34b6ec['user'] && _0x34b6ec['server'] && _0x34b6ec['user'] + '@' + _0x34b6ec['server'] || _0x1f3d92;
            } else
                return _0x1f3d92;
        };
        _0x3c6bc1['ev']['on']('contacts.update', _0x43662f => {
            for (const _0x35364d of _0x43662f) {
                const _0x13426f = _0x3c6bc1['decodeJid'](_0x35364d['id']);
                if (_0x0_0x53c4c7 && _0x0_0x53c4c7['contacts'])
                    _0x0_0x53c4c7['contacts'][_0x13426f] = {
                        'id': _0x13426f,
                        'name': _0x35364d['notify']
                    };
            }
        });
        _0x3c6bc1['getName'] = (_0x4a5858, _0x8656a0 = ![]) => {
            const _0x387ab8 = _0x3c6bc1['decodeJid'](_0x4a5858);
            _0x8656a0 = _0x3c6bc1['withoutContact'] || _0x8656a0;
            let _0x440102;
            if (_0x387ab8['endsWith']('@g.us'))
                return new Promise(async _0x56e01f => {
                    _0x440102 = _0x0_0x53c4c7['contacts'][_0x387ab8] || {};
                    if (!(_0x440102['name'] || _0x440102['subject']))
                        _0x440102 = _0x3c6bc1['groupMetadata'](_0x387ab8) || {};
                    _0x56e01f(_0x440102['name'] || _0x440102['subject'] || _0x0_0x3db7c4('+' + _0x387ab8['replace']('@s.whatsapp.net', ''))['number']?.['international']);
                });
            else
                _0x440102 = _0x387ab8 === '0@s.whatsapp.net' ? {
                    'id': _0x387ab8,
                    'name': 'WhatsApp'
                } : _0x387ab8 === _0x3c6bc1['decodeJid'](_0x3c6bc1['user']['id']) ? _0x3c6bc1['user'] : _0x0_0x53c4c7['contacts'][_0x387ab8] || {};
            return (_0x8656a0 ? '' : _0x440102['name']) || _0x440102['subject'] || _0x440102['verifiedName'] || _0x0_0x3db7c4('+' + _0x4a5858['replace']('@s.whatsapp.net', ''))['number']?.['international'];
        };
        _0x3c6bc1['public'] = !![];
        _0x3c6bc1['serializeM'] = _0x507b8d => smsg(_0x3c6bc1, _0x507b8d, _0x0_0x53c4c7);
        const _0x2df69c = _0x2000dc['creds']?.['registered'] === !![];
        if (_0x2df69c) {
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
        _0x3c6bc1['ev']['on']('connection.update', async _0x4d0d63 => {
            const {
                connection: _0x1496b4,
                lastDisconnect: _0x5c4440,
                qr: _0x12af6f
            } = _0x4d0d63;
            if (_0x1496b4 === 'open') {
                printLog('success', 'Bot\x20connected\x20successfully!');
                try {
                    const _0xf84ab0 = await _0x0_0x53c4c7['getBotMode']();
                    const _0xbfa418 = process['uptime']();
                    const _0x3ad25a = Math['floor'](_0xbfa418 / 0xe10);
                    const _0x59de4f = Math['floor'](_0xbfa418 % 0xe10 / 0x3c);
                    const _0x38297c = 'https://raw.githubusercontent.com/NOSTRA-DevOps/Nova-MD/refs/heads/main/assets/logo.PNG';
                    let _0x44dff3 = null;
                    try {
                        const _0x3fa0fd = await fetch(_0x38297c);
                        if (_0x3fa0fd['ok']) {
                            const _0x5328f2 = await _0x3fa0fd['arrayBuffer']();
                            _0x44dff3 = Buffer['from'](_0x5328f2);
                        }
                    } catch (_0x6abb1a) {
                        const _0x4fa3f4 = _0x0_0x3f902c['join'](process['cwd'](), 'assets', 'logo.PNG');
                        if (_0x0_0x3767a7['existsSync'](_0x4fa3f4)) {
                            _0x44dff3 = _0x0_0x3767a7['readFileSync'](_0x4fa3f4);
                        }
                    }
                    let _0xf81290 = '╭━━━━『\x20*' + (_0x0_0x6a477d['botName'] || 'NOVA-MD') + '*\x20』━━⬣\x0a';
                    _0xf81290 += '┃\x0a';
                    _0xf81290 += '┃\x20✨\x20*Status:*\x20✅\x20ONLINE\x0a';
                    _0xf81290 += '┃\x20🤖\x20*Version:*\x20' + (_0x0_0x6a477d['version'] || '2.0.0') + '\x0a';
                    _0xf81290 += '┃\x20⚙️\x20*Mode:*\x20' + _0xf84ab0['toUpperCase']() + '\x0a';
                    _0xf81290 += '┃\x20⏰\x20*Uptime:*\x20' + _0x3ad25a + 'h\x20' + _0x59de4f + 'm\x0a';
                    _0xf81290 += '┃\x20📊\x20*Prefixes:*\x20' + _0x0_0x6a477d['prefixes']['join']('\x20') + '\x0a';
                    _0xf81290 += '┃\x20📦\x20*Plugins:*\x20' + _0x0_0x375729['commands']['size'] + '\x0a';
                    _0xf81290 += '┃\x20💾\x20*Storage:*\x20' + _0x0_0x53c4c7['getStats']()['backend']['toUpperCase']() + '\x0a';
                    _0xf81290 += '┃\x0a';
                    _0xf81290 += '┃━━━━━━━━━━━━━━━━━━⬣\x0a';
                    _0xf81290 += '┃\x0a';
                    _0xf81290 += '┃\x20🌐\x20*JOIN\x20CHANNELS*\x0a';
                    _0xf81290 += '┃\x0a';
                    _0xf81290 += '┃\x20💬\x20*FaceBook:*\x0a';
                    _0xf81290 += '┃\x20https://www.facebook.com/profile.php?id=61591828051151\x0a';
                    _0xf81290 += '┃\x0a';
                    _0xf81290 += '┃\x20📱\x20*Telegram:*\x0a';
                    _0xf81290 += '┃\x20https://t.me/addlist/CpQzYQfWwwxmYTk0\x0a';
                    _0xf81290 += '┃\x0a';
                    _0xf81290 += '┃\x20▶️\x20*YouTube:*\x0a';
                    _0xf81290 += '┃\x20https://youtube.com/@labokingfreesurf\x0a';
                    _0xf81290 += '┃\x0a';
                    _0xf81290 += '┃━━━━━━━━━━━━━━━━━━⬣\x0a';
                    _0xf81290 += '┃\x0a';
                    _0xf81290 += '┃\x20✨\x20_Powered\x20by\x20NOSTRA._\x0a';
                    _0xf81290 += '╰━━━━━━━━━━━━━━━━━━⬣';
                    const _0x1778e8 = _0x3c6bc1['user']['id']['split'](':')[0x0] + '@s.whatsapp.net';
                    _0x0_0x6a477d['ownerNumber'] = _0x1778e8;
                    if (_0x44dff3) {
                        await _0x3c6bc1['sendMessage'](_0x1778e8, {
                            'image': _0x44dff3,
                            'caption': _0xf81290,
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
                        await _0x3c6bc1['sendMessage'](_0x1778e8, {
                            'text': _0xf81290,
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
                } catch (_0xdeed4f) {
                    printLog('error', 'Failed\x20to\x20send\x20automatic\x20about\x20message:\x20' + _0xdeed4f['message']);
                }
                const _0x5a65d7 = await _0x0_0x53c4c7['getSetting']('global', 'stealthMode');
                if (_0x5a65d7 && _0x5a65d7['enabled']) {
                    printLog('info', '👻\x20STEALTH\x20MODE\x20ACTIVE');
                }
                printLog('success', 'Connected\x20to\x20=>\x20' + JSON['stringify'](_0x3c6bc1['user'], null, 0x2));
                await delay(0x7cf);
                try {
                    owner = JSON['parse'](_0x0_0x3767a7['readFileSync']('./data/owner.json', 'utf-8'));
                } catch (_0x1998b4) {
                }
                printLog('info', '[\x20' + (_0x0_0x6a477d['botName'] || 'NOVA-MD') + '\x20]');
                printLog('info', 'WA\x20NUMBER\x20\x20:\x20' + (owner[0x0] || _0x0_0x6a477d['ownerNumber'] || ''));
                printLog('success', 'Bot\x20Connected\x20Successfully!');
                printLog('info', 'Plugins\x20\x20\x20:\x20' + _0x0_0x375729['commands']['size']);
                printLog('info', 'Prefixes\x20\x20\x20:\x20' + _0x0_0x6a477d['prefixes']['join'](',\x20'));
                printLog('store', 'Backend\x20\x20\x20\x20:\x20' + _0x0_0x53c4c7['getStats']()['backend']);
                console['log']();
            }
            if (_0x1496b4 === 'close') {
                const _0x595e6a = _0x5c4440?.['error']?.['output']?.['statusCode'];
                const _0x246bab = _0x595e6a !== DisconnectReason['loggedOut'] && _0x595e6a !== 0x191;
                if (_0x595e6a === DisconnectReason['loggedOut'] || _0x595e6a === 0x191) {
                    try {
                        rmSync('./session', {
                            'recursive': !![],
                            'force': !![]
                        });
                    } catch (_0x412db5) {
                    }
                    await delay(0xbb8);
                    startNovaXCode();
                    return;
                }
                if (_0x246bab) {
                    printLog('connection', 'Reconnecting\x20in\x205\x20seconds...');
                    await delay(0x1388);
                    startNovaXCode();
                }
            }
        });
        _0x3c6bc1['ev']['on']('call', async _0x51430b => {
            await handleCall(_0x3c6bc1, _0x51430b);
        });
        _0x3c6bc1['ev']['on']('group-participants.update', async _0x4f5bc9 => {
            await handleGroupParticipantUpdate(_0x3c6bc1, _0x4f5bc9);
        });
        _0x3c6bc1['ev']['on']('status.update', async _0x3919d9 => {
            await handleStatus(_0x3c6bc1, _0x3919d9);
        });
        _0x3c6bc1['ev']['on']('messages.reaction', async _0x4ec864 => {
            await handleStatus(_0x3c6bc1, _0x4ec864);
        });
        return _0x3c6bc1;
    } catch (_0x1f7945) {
        printLog('error', 'Error\x20in\x20startNovaXCode:\x20' + _0x1f7945['message']);
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
    printLog('info', '📱\x20Open\x20http://localhost:' + (_0x0_0x6a477d['port'] || 0x1388) + '/pairing\x20in\x20your\x20browser\x20if\x20it\x27s\x20local');
    printLog('info', '📱\x20For\x20web\x20servic\x20deployment,\x20click\x20the\x20service\x20URL\x20and\x20add\x20/pairing\x20at\x20the\x20end');
    const _0x552c52 = 0x1e * 0x3c * 0x3e8;
    const _0x1bf09a = Date['now']();
    const _0x2c6b2c = 0xbb8;
    return new Promise((_0x209b78, _0x51dfbc) => {
        const _0x1f61fb = setInterval(() => {
            if (hasValidSession()) {
                clearInterval(_0x1f61fb);
                printLog('success', '✅\x20Session\x20detected!\x20Starting\x20bot...');
                _0x209b78();
            }
            if (Date['now']() - _0x1bf09a > _0x552c52) {
                clearInterval(_0x1f61fb);
                _0x51dfbc(new Error('Session\x20creation\x20timeout\x20(30\x20minutes)'));
            }
        }, _0x2c6b2c);
    });
}
async function main() {
    await compileAll();
    await _0x0_0x375729['loadCommands']();
    printLog('info', 'Starting\x20NOVA-MD\x20BOT...');
    if (hasValidSession()) {
        printLog('success', '✅\x20Valid\x20session\x20found,\x20starting\x20bot...');
        await delay(0xbb8);
        startNovaXCode()['catch'](_0x151131 => {
            printLog('error', 'Fatal\x20error:\x20' + _0x151131['message']);
            if (rl && !rlClosed)
                rl['close']();
            process['exit'](0x1);
        });
    } else {
        printLog('info', '🌐\x20No\x20session\x20found.\x20Launching\x20web\x20pairing\x20interface...');
        printLog('info', '📱\x20Open\x20http://localhost:' + (_0x0_0x6a477d['port'] || 0x1388) + '/pairing\x20in\x20your\x20browser\x20to\x20connect\x20WhatsApp');
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
            startNovaXCode()['catch'](_0xea989f => {
                printLog('error', 'Fatal\x20error:\x20' + _0xea989f['message']);
                if (rl && !rlClosed)
                    rl['close']();
                process['exit'](0x1);
            });
        } catch (_0x32876e) {
            printLog('error', 'Session\x20creation\x20failed:\x20' + _0x32876e['message']);
            if (rl && !rlClosed)
                rl['close']();
            process['exit'](0x1);
        }
    }
}
main();
const sessionDir = _0x0_0x3f902c['join'](process['cwd'](), 'session');
setInterval(() => {
    if (!_0x0_0x3767a7['existsSync'](sessionDir))
        return;
    _0x0_0x3767a7['readdir'](sessionDir, (_0x52b9ed, _0xdcb8a6) => {
        if (_0x52b9ed)
            return;
        for (const _0x50239f of _0xdcb8a6) {
            if (_0x50239f === 'creds.json')
                continue;
            if (_0x50239f['startsWith']('app-state-sync-key-'))
                continue;
            _0x0_0x3767a7['unlink'](_0x0_0x3f902c['join'](sessionDir, _0x50239f), () => {
            });
        }
    });
}, 0x3 * 0x3c * 0x3e8);
const customTemp = _0x0_0x3f902c['join'](process['cwd'](), 'temp');
if (!_0x0_0x3767a7['existsSync'](customTemp))
    _0x0_0x3767a7['mkdirSync'](customTemp, { 'recursive': !![] });
process.env.TMPDIR = customTemp;
process.env.TEMP = customTemp;
process.env.TMP = customTemp;
setInterval(() => {
    _0x0_0x3767a7['readdir'](customTemp, (_0x58db62, _0x50a020) => {
        if (_0x58db62)
            return;
        for (const _0x360687 of _0x50a020) {
            const _0x5d406c = _0x0_0x3f902c['join'](customTemp, _0x360687);
            _0x0_0x3767a7['stat'](_0x5d406c, (_0x53d03c, _0x690f6d) => {
                if (!_0x53d03c && Date['now']() - _0x690f6d['mtimeMs'] > 0x3 * 0x3c * 0x3c * 0x3e8) {
                    _0x0_0x3767a7['unlink'](_0x5d406c, () => {
                    });
                }
            });
        }
    });
}, 0x1 * 0x3c * 0x3c * 0x3e8);
const folders = [
    _0x0_0x3f902c['join'](__dirname, './lib'),
    _0x0_0x3f902c['join'](__dirname, './plugins')
];
folders['forEach'](_0x4a078c => {
    if (!_0x0_0x3767a7['existsSync'](_0x4a078c))
        return;
    _0x0_0x3767a7['readdirSync'](_0x4a078c)['filter'](_0x2f06d1 => _0x2f06d1['endsWith']('.js'))['forEach'](_0x7dd8b9 => {
        const _0x44e819 = _0x0_0x3f902c['join'](_0x4a078c, _0x7dd8b9);
        try {
            const _0x4e5d26 = _0x0_0x3767a7['readFileSync'](_0x44e819, 'utf-8');
            const _0x39c8cc = _0x0_0x3c60fb(_0x4e5d26, _0x7dd8b9, {
                'sourceType': 'module',
                'allowAwaitOutsideFunction': !![]
            });
            if (_0x39c8cc) {
                console['error'](_0x0_0x4ff2d4['red']('❌\x20Syntax\x20error\x20in\x20' + _0x44e819 + ':\x0a' + _0x39c8cc));
            }
        } catch (_0x2e178b) {
            console['error'](_0x0_0x4ff2d4['yellow']('⚠️\x20Cannot\x20read\x20file\x20' + _0x44e819 + ':\x0a' + _0x2e178b));
        }
    });
});
process['on']('uncaughtException', _0x9c1858 => {
    printLog('error', 'Uncaught\x20Exception:\x20' + _0x9c1858['message']);
    console['error'](_0x9c1858['stack']);
    writeErrorLog({
        'type': 'uncaughtException',
        'error': _0x9c1858['message'],
        'stack': _0x9c1858['stack'],
        'timestamp': new Date()['toISOString']()
    });
});
process['on']('unhandledRejection', _0x2dec5b => {
    printLog('error', 'Unhandled\x20Rejection:\x20' + _0x2dec5b['message']);
    console['error'](_0x2dec5b['stack']);
    writeErrorLog({
        'type': 'unhandledRejection',
        'error': _0x2dec5b['message'],
        'stack': _0x2dec5b['stack'],
        'timestamp': new Date()['toISOString']()
    });
});
server['on']('error', _0x182143 => {
    if (_0x182143['code'] === 'EADDRINUSE') {
        printLog('error', 'Address\x20localhost:' + PORT + '\x20in\x20use');
        writeErrorLog({
            'type': 'serverError',
            'error': 'Address\x20localhost:' + PORT + '\x20in\x20use',
            'timestamp': new Date()['toISOString']()
        });
        server['close']();
    } else {
        printLog('error', 'Server\x20error:\x20' + _0x182143['message']);
        writeErrorLog({
            'type': 'serverError',
            'error': _0x182143['message'],
            'stack': _0x182143['stack'],
            'timestamp': new Date()['toISOString']()
        });
    }
});