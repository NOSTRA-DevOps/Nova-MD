import 'dotenv/config';
import _0x0_0x54b050, {
    existsSync,
    mkdirSync,
    rmSync
} from 'fs';
import _0x0_0xafccc6, { dirname } from 'path';
import _0x0_0x2f0441 from 'chalk';
import _0x0_0x153aba from 'syntax-error';
import { parsePhoneNumber as _0x0_0x2130c3 } from 'awesome-phonenumber';
import _0x0_0x55b2d4 from 'readline';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { smsg } from './lib/myfunc.js';
import { compileAll } from './lib/compile.js';
import _0x0_0x20d175, {
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    Browsers,
    jidDecode,
    jidNormalizedUser,
    makeCacheableSignalKeyStore,
    delay
} from '@whiskeysockets/baileys';
import _0x0_0x4f1982 from 'node-cache';
import _0x0_0x291f87 from 'pino';
import _0x0_0x94fe63 from './config.js';
import _0x0_0x31e7bb from './lib/lightweight_store.js';
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
import _0x0_0x13540c from './lib/commandHandler.js';
import _0x0_0x31656e from './lib/sessionManager.js';
_0x0_0x31e7bb['readFromFile']();
setInterval(() => _0x0_0x31e7bb['writeToFile'](), _0x0_0x94fe63['storeWriteInterval'] || 0x2710);
setInterval(() => {
    if (global['gc']) {
        global['gc']();
        console['log']('🧹\x20Garbage\x20collection\x20completed');
    }
}, 0xea60);
setInterval(() => {
    const _0x3ce62c = process['memoryUsage']()['rss'] / 0x400 / 0x400;
    if (_0x3ce62c > 0x190) {
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
_0x0_0x54b050['mkdirSync']('./data', { 'recursive': !![] });
for (const [file, def] of Object['entries'](DATA_DEFAULTS)) {
    const fp = './data/' + file;
    if (!_0x0_0x54b050['existsSync'](fp))
        _0x0_0x54b050['writeFileSync'](fp, JSON['stringify'](def, null, 0x2));
}
let owner = [];
try {
    owner = JSON['parse'](_0x0_0x54b050['readFileSync']('./data/owner.json', 'utf-8'));
} catch {
    owner = [];
}
global['botname'] = _0x0_0x94fe63['botName'] || 'NOVA-MD';
global['themeemoji'] = '•';
const pairingCode = ![];
const useMobile = process['argv']['includes']('--mobile');
let rl = null;
let rlClosed = ![];
if (process['stdin']['isTTY'] && !_0x0_0x94fe63['pairingNumber']) {
    rl = _0x0_0x55b2d4['createInterface']({
        'input': process['stdin'],
        'output': process['stdout']
    });
    rl['on']('close', () => {
        rlClosed = !![];
    });
}
const question = _0xcb6c4e => {
    if (rl && !rlClosed) {
        return new Promise(_0x23290f => rl['question'](_0xcb6c4e, _0x23290f));
    } else {
        return Promise['resolve'](_0x0_0x94fe63['ownerNumber'] || '237676250509');
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
    const _0x27923d = _0x0_0xafccc6['join'](__dirname, 'session');
    if (!existsSync(_0x27923d)) {
        mkdirSync(_0x27923d, { 'recursive': !![] });
    }
    return _0x27923d;
}
function hasValidSession() {
    return _0x0_0x31656e['hasValidSession']();
}
server['listen'](PORT, () => {
    printLog('success', 'Server\x20listening\x20on\x20port\x20' + PORT);
    printLog('info', '🌐\x20Web\x20interface\x20available\x20at:\x20http://localhost:' + PORT + '/pairing');
});
async function startNovaXCode() {
    try {
        const {version: _0xb7ee08} = await fetchLatestBaileysVersion();
        ensureSessionDirectory();
        await delay(0x3e8);
        const {
            state: _0x2d3f96,
            saveCreds: _0x50c911
        } = await useMultiFileAuthState('./session');
        const _0x32d06c = async () => {
            ensureSessionDirectory();
            await _0x50c911();
        };
        const _0x56d076 = new _0x0_0x4f1982();
        const _0x11e9f0 = await _0x0_0x31e7bb['getSetting']('global', 'stealthMode');
        const _0x2ac43f = _0x11e9f0 && _0x11e9f0['enabled'];
        const _0x19d983 = _0x0_0x20d175({
            'version': _0xb7ee08,
            'logger': _0x0_0x291f87({ 'level': 'silent' }),
            'browser': Browsers['macOS']('Chrome'),
            'auth': {
                'creds': _0x2d3f96['creds'],
                'keys': makeCacheableSignalKeyStore(_0x2d3f96['keys'], _0x0_0x291f87({ 'level': 'fatal' })['child']({ 'level': 'fatal' }))
            },
            'markOnlineOnConnect': !_0x2ac43f,
            'generateHighQualityLinkPreview': !![],
            'syncFullHistory': ![],
            'getMessage': async _0x2841ea => {
                const _0x1dc287 = jidNormalizedUser(_0x2841ea['remoteJid']);
                const _0x46b0bc = await _0x0_0x31e7bb['loadMessage'](_0x1dc287, _0x2841ea['id']);
                return _0x46b0bc?.['message'] || '';
            },
            'msgRetryCounterCache': _0x56d076,
            'defaultQueryTimeoutMs': 0xea60,
            'connectTimeoutMs': 0xea60,
            'keepAliveIntervalMs': 0x2710
        });
        _0x19d983['store'] = _0x0_0x31e7bb;
        const _0x296bfa = _0x19d983['sendPresenceUpdate'];
        const _0x3009a4 = _0x19d983['readMessages'];
        const _0xd04551 = _0x19d983['sendReceipt'];
        _0x19d983['sendPresenceUpdate'] = async function (..._0x5b48f7) {
            const _0x247508 = await _0x0_0x31e7bb['getSetting']('global', 'stealthMode');
            if (_0x247508 && _0x247508['enabled']) {
                printLog('info', '👻\x20Blocked\x20presence\x20update\x20(stealth\x20mode)');
                return;
            }
            return _0x296bfa['apply'](this, _0x5b48f7);
        };
        _0x19d983['readMessages'] = async function (..._0x2daab6) {
            const _0x28bb1a = await _0x0_0x31e7bb['getSetting']('global', 'stealthMode');
            if (_0x28bb1a && _0x28bb1a['enabled'])
                return;
            return _0x3009a4['apply'](this, _0x2daab6);
        };
        if (_0xd04551) {
            _0x19d983['sendReceipt'] = async function (..._0x18bc52) {
                const _0x43dfc0 = await _0x0_0x31e7bb['getSetting']('global', 'stealthMode');
                if (_0x43dfc0 && _0x43dfc0['enabled'])
                    return;
                return _0xd04551['apply'](this, _0x18bc52);
            };
        }
        const _0x13ba32 = _0x19d983['query'];
        _0x19d983['query'] = async function (_0x1742ec, ..._0x2b5279) {
            const _0xeefb69 = await _0x0_0x31e7bb['getSetting']('global', 'stealthMode');
            if (_0xeefb69 && _0xeefb69['enabled']) {
                if (_0x1742ec && _0x1742ec['tag'] === 'receipt')
                    return;
                if (_0x1742ec && _0x1742ec['attrs'] && (_0x1742ec['attrs']['type'] === 'read' || _0x1742ec['attrs']['type'] === 'read-self'))
                    return;
            }
            return _0x13ba32['apply'](this, [
                _0x1742ec,
                ..._0x2b5279
            ]);
        };
        _0x19d983['isGhostMode'] = async () => {
            const _0x580b71 = await _0x0_0x31e7bb['getSetting']('global', 'stealthMode');
            return _0x580b71 && _0x580b71['enabled'];
        };
        _0x19d983['ev']['on']('creds.update', _0x32d06c);
        _0x0_0x31e7bb['bind'](_0x19d983['ev']);
        _0x19d983['ev']['on']('messages.upsert', async _0x19f4a6 => {
            try {
                const _0x385c3e = _0x19f4a6['messages'][0x0];
                if (!_0x385c3e['message'])
                    return;
                _0x385c3e['message'] = Object['keys'](_0x385c3e['message'])[0x0] === 'ephemeralMessage' ? _0x385c3e['message']['ephemeralMessage']['message'] : _0x385c3e['message'];
                if (_0x385c3e['key'] && _0x385c3e['key']['remoteJid'] === 'status@broadcast') {
                    await handleStatus(_0x19d983, _0x19f4a6);
                    return;
                }
                if (!_0x19d983['public'] && !_0x385c3e['key']['fromMe'] && _0x19f4a6['type'] === 'notify') {
                    const _0x3e8878 = _0x385c3e['key']?.['remoteJid']?.['endsWith']('@g.us');
                    if (!_0x3e8878)
                        return;
                }
                if (_0x385c3e['key']['id']['startsWith']('BAE5') && _0x385c3e['key']['id']['length'] === 0x10)
                    return;
                if (_0x19d983?.['msgRetryCounterCache']) {
                    _0x19d983['msgRetryCounterCache']['clear']();
                }
                try {
                    await handleMessages(_0x19d983, _0x19f4a6);
                } catch (_0x58f503) {
                    printLog('error', 'Error\x20in\x20handleMessages:\x20' + _0x58f503['message']);
                    if (_0x385c3e['key'] && _0x385c3e['key']['remoteJid']) {
                        await _0x19d983['sendMessage'](_0x385c3e['key']['remoteJid'], {
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
            } catch (_0x248cb8) {
                printLog('error', 'Error\x20in\x20messages.upsert:\x20' + _0x248cb8['message']);
            }
        });
        _0x19d983['decodeJid'] = _0x3ab8f8 => {
            if (!_0x3ab8f8)
                return _0x3ab8f8;
            if (/:\d+@/gi['test'](_0x3ab8f8)) {
                const _0x1a3698 = jidDecode(_0x3ab8f8) || {};
                return _0x1a3698['user'] && _0x1a3698['server'] && _0x1a3698['user'] + '@' + _0x1a3698['server'] || _0x3ab8f8;
            } else
                return _0x3ab8f8;
        };
        _0x19d983['ev']['on']('contacts.update', _0x5cf43b => {
            for (const _0x26c56f of _0x5cf43b) {
                const _0x3b86a9 = _0x19d983['decodeJid'](_0x26c56f['id']);
                if (_0x0_0x31e7bb && _0x0_0x31e7bb['contacts'])
                    _0x0_0x31e7bb['contacts'][_0x3b86a9] = {
                        'id': _0x3b86a9,
                        'name': _0x26c56f['notify']
                    };
            }
        });
        _0x19d983['getName'] = (_0x29d856, _0x1bdb4d = ![]) => {
            const _0xc49311 = _0x19d983['decodeJid'](_0x29d856);
            _0x1bdb4d = _0x19d983['withoutContact'] || _0x1bdb4d;
            let _0x48c83e;
            if (_0xc49311['endsWith']('@g.us'))
                return new Promise(async _0x5ee785 => {
                    _0x48c83e = _0x0_0x31e7bb['contacts'][_0xc49311] || {};
                    if (!(_0x48c83e['name'] || _0x48c83e['subject']))
                        _0x48c83e = _0x19d983['groupMetadata'](_0xc49311) || {};
                    _0x5ee785(_0x48c83e['name'] || _0x48c83e['subject'] || _0x0_0x2130c3('+' + _0xc49311['replace']('@s.whatsapp.net', ''))['number']?.['international']);
                });
            else
                _0x48c83e = _0xc49311 === '0@s.whatsapp.net' ? {
                    'id': _0xc49311,
                    'name': 'WhatsApp'
                } : _0xc49311 === _0x19d983['decodeJid'](_0x19d983['user']['id']) ? _0x19d983['user'] : _0x0_0x31e7bb['contacts'][_0xc49311] || {};
            return (_0x1bdb4d ? '' : _0x48c83e['name']) || _0x48c83e['subject'] || _0x48c83e['verifiedName'] || _0x0_0x2130c3('+' + _0x29d856['replace']('@s.whatsapp.net', ''))['number']?.['international'];
        };
        _0x19d983['public'] = !![];
        _0x19d983['serializeM'] = _0x3573b5 => smsg(_0x19d983, _0x3573b5, _0x0_0x31e7bb);
        const _0x3f90d8 = _0x2d3f96['creds']?.['registered'] === !![];
        if (_0x3f90d8) {
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
        _0x19d983['ev']['on']('connection.update', async _0x4f9e43 => {
            const {
                connection: _0x229616,
                lastDisconnect: _0x55ec21,
                qr: _0x4f8ccd
            } = _0x4f9e43;
            if (_0x229616 === 'open') {
                printLog('success', 'Bot\x20connected\x20successfully!');
                try {
                    const _0x25bd76 = await _0x0_0x31e7bb['getBotMode']();
                    const _0x1330f9 = process['uptime']();
                    const _0x524fa2 = Math['floor'](_0x1330f9 / 0xe10);
                    const _0x244249 = Math['floor'](_0x1330f9 % 0xe10 / 0x3c);
                    const _0x5c743c = 'https://raw.githubusercontent.com/NOSTRA-DevOps/Nova-MD/refs/heads/main/assets/logo.PNG';
                    let _0x3c2cc1 = null;
                    try {
                        const _0x28815e = await fetch(_0x5c743c);
                        if (_0x28815e['ok']) {
                            const _0x286d3d = await _0x28815e['arrayBuffer']();
                            _0x3c2cc1 = Buffer['from'](_0x286d3d);
                        }
                    } catch (_0x475e26) {
                        const _0x1852f0 = _0x0_0xafccc6['join'](process['cwd'](), 'assets', 'logo.PNG');
                        if (_0x0_0x54b050['existsSync'](_0x1852f0)) {
                            _0x3c2cc1 = _0x0_0x54b050['readFileSync'](_0x1852f0);
                        }
                    }
                    let _0x276a7e = '╭━━━━『\x20*' + (_0x0_0x94fe63['botName'] || 'NOVA-MD') + '\x20INFO*\x20』━━━⬣\x0a';
                    _0x276a7e += '┃\x0a';
                    _0x276a7e += '┃\x20✨\x20*Status:*\x20✅\x20ONLINE\x0a';
                    _0x276a7e += '┃\x20🤖\x20*Version:*\x20' + (_0x0_0x94fe63['version'] || '2.5.0') + '\x20(Stable)\x0a';
                    _0x276a7e += '┃\x20⚙️\x20*Mode:*\x20' + _0x25bd76['toUpperCase']() + '\x0a';
                    _0x276a7e += '┃\x20⏰\x20*Uptime:*\x20' + _0x524fa2 + 'h\x20' + _0x244249 + 'm\x0a';
                    _0x276a7e += '┃\x20📊\x20*Prefixes:*\x20' + _0x0_0x94fe63['prefixes']['join']('\x20') + '\x0a';
                    _0x276a7e += '┃\x20📦\x20*Plugins:*\x20' + _0x0_0x13540c['commands']['size'] + '\x0a';
                    _0x276a7e += '┃\x20💾\x20*Storage:*\x20' + _0x0_0x31e7bb['getStats']()['backend']['toUpperCase']() + '\x0a';
                    _0x276a7e += '┃\x0a';
                    _0x276a7e += '┃━━━━━━━━━━━━━━━━━━⬣\x0a';
                    _0x276a7e += '┃\x0a';
                    _0x276a7e += '┃\x20🌐\x20*JOIN\x20CHANNELS*\x0a';
                    _0x276a7e += '┃\x0a';
                    _0x276a7e += '┃\x20💬\x20*FaceBook:*\x0a';
                    _0x276a7e += '┃\x20https://www.facebook.com/profile.php?id=61591828051151\x0a';
                    _0x276a7e += '┃\x0a';
                    _0x276a7e += '┃\x20📱\x20*Telegram:*\x0a';
                    _0x276a7e += '┃\x20https://t.me/addlist/CpQzYQfWwwxmYTk0\x0a';
                    _0x276a7e += '┃\x0a';
                    _0x276a7e += '┃\x20▶️\x20*YouTube:*\x0a';
                    _0x276a7e += '┃\x20https://youtube.com/@labokingfreesurf\x0a';
                    _0x276a7e += '┃\x0a';
                    _0x276a7e += '┃━━━━━━━━━━━━━━━━━━⬣\x0a';
                    _0x276a7e += '┃\x0a';
                    _0x276a7e += '┃\x20✨\x20_Powered\x20by\x20NOSTRA._\x0a';
                    _0x276a7e += '╰━━━━━━━━━━━━━━━━━━⬣';
                    const _0x46542f = _0x19d983['user']['id']['split'](':')[0x0] + '@s.whatsapp.net';
                    if (_0x3c2cc1) {
                        await _0x19d983['sendMessage'](_0x46542f, {
                            'image': _0x3c2cc1,
                            'caption': _0x276a7e,
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
                        await _0x19d983['sendMessage'](_0x46542f, {
                            'text': _0x276a7e,
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
                } catch (_0x51bd4c) {
                    printLog('error', 'Failed\x20to\x20send\x20automatic\x20about\x20message:\x20' + _0x51bd4c['message']);
                }
                const _0x5dcb1e = await _0x0_0x31e7bb['getSetting']('global', 'stealthMode');
                if (_0x5dcb1e && _0x5dcb1e['enabled']) {
                    printLog('info', '👻\x20STEALTH\x20MODE\x20ACTIVE');
                }
                printLog('success', 'Connected\x20to\x20=>\x20' + JSON['stringify'](_0x19d983['user'], null, 0x2));
                await delay(0x7cf);
                try {
                    owner = JSON['parse'](_0x0_0x54b050['readFileSync']('./data/owner.json', 'utf-8'));
                } catch (_0x52c139) {
                }
                printLog('info', '[\x20' + (_0x0_0x94fe63['botName'] || 'NOVA-MD') + '\x20]');
                printLog('info', 'WA\x20NUMBER\x20\x20:\x20' + (owner[0x0] || _0x0_0x94fe63['ownerNumber'] || ''));
                printLog('success', 'Bot\x20Connected\x20Successfully!');
                printLog('info', 'Plugins\x20\x20\x20:\x20' + _0x0_0x13540c['commands']['size']);
                printLog('info', 'Prefixes\x20\x20\x20:\x20' + _0x0_0x94fe63['prefixes']['join'](',\x20'));
                printLog('store', 'Backend\x20\x20\x20\x20:\x20' + _0x0_0x31e7bb['getStats']()['backend']);
                console['log']();
            }
            if (_0x229616 === 'close') {
                const _0x263008 = _0x55ec21?.['error']?.['output']?.['statusCode'];
                const _0x5a6eea = _0x263008 !== DisconnectReason['loggedOut'] && _0x263008 !== 0x191;
                if (_0x263008 === DisconnectReason['loggedOut'] || _0x263008 === 0x191) {
                    try {
                        rmSync('./session', {
                            'recursive': !![],
                            'force': !![]
                        });
                    } catch (_0xe27975) {
                    }
                    await delay(0xbb8);
                    startNovaXCode();
                    return;
                }
                if (_0x5a6eea) {
                    printLog('connection', 'Reconnecting\x20in\x205\x20seconds...');
                    await delay(0x1388);
                    startNovaXCode();
                }
            }
        });
        _0x19d983['ev']['on']('call', async _0x4471ab => {
            await handleCall(_0x19d983, _0x4471ab);
        });
        _0x19d983['ev']['on']('group-participants.update', async _0x15b5d6 => {
            await handleGroupParticipantUpdate(_0x19d983, _0x15b5d6);
        });
        _0x19d983['ev']['on']('status.update', async _0x8db4e9 => {
            await handleStatus(_0x19d983, _0x8db4e9);
        });
        _0x19d983['ev']['on']('messages.reaction', async _0x406b73 => {
            await handleStatus(_0x19d983, _0x406b73);
        });
        return _0x19d983;
    } catch (_0x46793f) {
        printLog('error', 'Error\x20in\x20startNovaXCode:\x20' + _0x46793f['message']);
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
    printLog('info', '📱\x20Open\x20http://localhost:' + (_0x0_0x94fe63['port'] || 0x1388) + '/pairing\x20in\x20your\x20browser\x20if\x20it\x27s\x20local');
    printLog('info', '📱\x20For\x20web\x20servic\x20deployment,\x20click\x20the\x20service\x20URL\x20and\x20add\x20/pairing\x20at\x20the\x20end');
    const _0x55ee5e = 0x1e * 0x3c * 0x3e8;
    const _0x41ad3b = Date['now']();
    const _0x3dcd66 = 0xbb8;
    return new Promise((_0x27d1f4, _0x4b15f1) => {
        const _0x599b44 = setInterval(() => {
            if (hasValidSession()) {
                clearInterval(_0x599b44);
                printLog('success', '✅\x20Session\x20detected!\x20Starting\x20bot...');
                _0x27d1f4();
            }
            if (Date['now']() - _0x41ad3b > _0x55ee5e) {
                clearInterval(_0x599b44);
                _0x4b15f1(new Error('Session\x20creation\x20timeout\x20(30\x20minutes)'));
            }
        }, _0x3dcd66);
    });
}
async function main() {
    await compileAll();
    await _0x0_0x13540c['loadCommands']();
    printLog('info', 'Starting\x20NOVA-MD\x20BOT...');
    if (hasValidSession()) {
        printLog('success', '✅\x20Valid\x20session\x20found,\x20starting\x20bot...');
        await delay(0xbb8);
        startNovaXCode()['catch'](_0x198cc5 => {
            printLog('error', 'Fatal\x20error:\x20' + _0x198cc5['message']);
            if (rl && !rlClosed)
                rl['close']();
            process['exit'](0x1);
        });
    } else {
        printLog('info', '🌐\x20No\x20session\x20found.\x20Launching\x20web\x20pairing\x20interface...');
        printLog('info', '📱\x20Open\x20http://localhost:' + (_0x0_0x94fe63['port'] || 0x1388) + '/pairing\x20in\x20your\x20browser\x20to\x20connect\x20WhatsApp');
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
            startNovaXCode()['catch'](_0xa35870 => {
                printLog('error', 'Fatal\x20error:\x20' + _0xa35870['message']);
                if (rl && !rlClosed)
                    rl['close']();
                process['exit'](0x1);
            });
        } catch (_0x1e3eef) {
            printLog('error', 'Session\x20creation\x20failed:\x20' + _0x1e3eef['message']);
            if (rl && !rlClosed)
                rl['close']();
            process['exit'](0x1);
        }
    }
}
main();
const sessionDir = _0x0_0xafccc6['join'](process['cwd'](), 'session');
setInterval(() => {
    if (!_0x0_0x54b050['existsSync'](sessionDir))
        return;
    _0x0_0x54b050['readdir'](sessionDir, (_0x3d0840, _0xa7a5ad) => {
        if (_0x3d0840)
            return;
        for (const _0x9b790 of _0xa7a5ad) {
            if (_0x9b790 === 'creds.json')
                continue;
            if (_0x9b790['startsWith']('app-state-sync-key-'))
                continue;
            _0x0_0x54b050['unlink'](_0x0_0xafccc6['join'](sessionDir, _0x9b790), () => {
            });
        }
    });
}, 0x3 * 0x3c * 0x3e8);
const customTemp = _0x0_0xafccc6['join'](process['cwd'](), 'temp');
if (!_0x0_0x54b050['existsSync'](customTemp))
    _0x0_0x54b050['mkdirSync'](customTemp, { 'recursive': !![] });
process.env.TMPDIR = customTemp;
process.env.TEMP = customTemp;
process.env.TMP = customTemp;
setInterval(() => {
    _0x0_0x54b050['readdir'](customTemp, (_0x1dd738, _0x4efd80) => {
        if (_0x1dd738)
            return;
        for (const _0x4d8be5 of _0x4efd80) {
            const _0x135ea3 = _0x0_0xafccc6['join'](customTemp, _0x4d8be5);
            _0x0_0x54b050['stat'](_0x135ea3, (_0x5c9cf9, _0x45b68a) => {
                if (!_0x5c9cf9 && Date['now']() - _0x45b68a['mtimeMs'] > 0x3 * 0x3c * 0x3c * 0x3e8) {
                    _0x0_0x54b050['unlink'](_0x135ea3, () => {
                    });
                }
            });
        }
    });
}, 0x1 * 0x3c * 0x3c * 0x3e8);
const folders = [
    _0x0_0xafccc6['join'](__dirname, './lib'),
    _0x0_0xafccc6['join'](__dirname, './plugins')
];
folders['forEach'](_0x34b134 => {
    if (!_0x0_0x54b050['existsSync'](_0x34b134))
        return;
    _0x0_0x54b050['readdirSync'](_0x34b134)['filter'](_0x3060b6 => _0x3060b6['endsWith']('.js'))['forEach'](_0x31d7ad => {
        const _0x44ed83 = _0x0_0xafccc6['join'](_0x34b134, _0x31d7ad);
        try {
            const _0x5d02e5 = _0x0_0x54b050['readFileSync'](_0x44ed83, 'utf-8');
            const _0x371689 = _0x0_0x153aba(_0x5d02e5, _0x31d7ad, {
                'sourceType': 'module',
                'allowAwaitOutsideFunction': !![]
            });
            if (_0x371689) {
                console['error'](_0x0_0x2f0441['red']('❌\x20Syntax\x20error\x20in\x20' + _0x44ed83 + ':\x0a' + _0x371689));
            }
        } catch (_0x14d05c) {
            console['error'](_0x0_0x2f0441['yellow']('⚠️\x20Cannot\x20read\x20file\x20' + _0x44ed83 + ':\x0a' + _0x14d05c));
        }
    });
});
process['on']('uncaughtException', _0x642169 => {
    printLog('error', 'Uncaught\x20Exception:\x20' + _0x642169['message']);
    console['error'](_0x642169['stack']);
    writeErrorLog({
        'type': 'uncaughtException',
        'error': _0x642169['message'],
        'stack': _0x642169['stack'],
        'timestamp': new Date()['toISOString']()
    });
});
process['on']('unhandledRejection', _0x2d57fc => {
    printLog('error', 'Unhandled\x20Rejection:\x20' + _0x2d57fc['message']);
    console['error'](_0x2d57fc['stack']);
    writeErrorLog({
        'type': 'unhandledRejection',
        'error': _0x2d57fc['message'],
        'stack': _0x2d57fc['stack'],
        'timestamp': new Date()['toISOString']()
    });
});
server['on']('error', _0x3ca712 => {
    if (_0x3ca712['code'] === 'EADDRINUSE') {
        printLog('error', 'Address\x20localhost:' + PORT + '\x20in\x20use');
        writeErrorLog({
            'type': 'serverError',
            'error': 'Address\x20localhost:' + PORT + '\x20in\x20use',
            'timestamp': new Date()['toISOString']()
        });
        server['close']();
    } else {
        printLog('error', 'Server\x20error:\x20' + _0x3ca712['message']);
        writeErrorLog({
            'type': 'serverError',
            'error': _0x3ca712['message'],
            'stack': _0x3ca712['stack'],
            'timestamp': new Date()['toISOString']()
        });
    }
});