import 'dotenv/config';
import _0x0_0x425928, {
    existsSync,
    mkdirSync,
    rmSync
} from 'fs';
import _0x0_0x38ecd9, { dirname } from 'path';
import _0x0_0x10a65c from 'chalk';
import _0x0_0x4d0c6b from 'syntax-error';
import { parsePhoneNumber as _0x0_0x1c46d3 } from 'awesome-phonenumber';
import _0x0_0x1c679b from 'readline';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { smsg } from './lib/myfunc.js';
import { compileAll } from './lib/compile.js';
import _0x0_0x2ec0dd, {
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    Browsers,
    jidDecode,
    jidNormalizedUser,
    makeCacheableSignalKeyStore,
    delay
} from '@whiskeysockets/baileys';
import _0x0_0x4a1bc9 from 'node-cache';
import _0x0_0xde9ffe from 'pino';
import _0x0_0x194b68 from './config.js';
import _0x0_0x398d6a from './lib/lightweight_store.js';
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
import _0x0_0x36abef from './lib/commandHandler.js';
import _0x0_0x876f94 from './lib/sessionManager.js';
_0x0_0x398d6a['readFromFile']();
setInterval(() => _0x0_0x398d6a['writeToFile'](), _0x0_0x194b68['storeWriteInterval'] || 0x2710);
setInterval(() => {
    if (global['gc']) {
        global['gc']();
        console['log']('🧹\x20Garbage\x20collection\x20completed');
    }
}, 0xea60);
setInterval(() => {
    const _0x1533a4 = process['memoryUsage']()['rss'] / 0x400 / 0x400;
    if (_0x1533a4 > 0x190) {
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
_0x0_0x425928['mkdirSync']('./data', { 'recursive': !![] });
for (const [file, def] of Object['entries'](DATA_DEFAULTS)) {
    const fp = './data/' + file;
    if (!_0x0_0x425928['existsSync'](fp))
        _0x0_0x425928['writeFileSync'](fp, JSON['stringify'](def, null, 0x2));
}
let owner = [];
try {
    owner = JSON['parse'](_0x0_0x425928['readFileSync']('./data/owner.json', 'utf-8'));
} catch {
    owner = [];
}
global['botname'] = _0x0_0x194b68['botName'] || 'NOVA-MD';
global['themeemoji'] = '•';
const pairingCode = ![];
const useMobile = process['argv']['includes']('--mobile');
let rl = null;
let rlClosed = ![];
if (process['stdin']['isTTY'] && !_0x0_0x194b68['pairingNumber']) {
    rl = _0x0_0x1c679b['createInterface']({
        'input': process['stdin'],
        'output': process['stdout']
    });
    rl['on']('close', () => {
        rlClosed = !![];
    });
}
const question = _0x1aecdf => {
    if (rl && !rlClosed) {
        return new Promise(_0x46ede4 => rl['question'](_0x1aecdf, _0x46ede4));
    } else {
        return Promise['resolve'](_0x0_0x194b68['ownerNumber'] || '237676250509');
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
    const _0x24c110 = _0x0_0x38ecd9['join'](__dirname, 'session');
    if (!existsSync(_0x24c110)) {
        mkdirSync(_0x24c110, { 'recursive': !![] });
    }
    return _0x24c110;
}
function hasValidSession() {
    return _0x0_0x876f94['hasValidSession']();
}
server['listen'](PORT, () => {
    printLog('success', 'Server\x20listening\x20on\x20port\x20' + PORT);
    printLog('info', '🌐\x20Web\x20interface\x20available\x20at:\x20http://localhost:' + PORT + '/pairing');
});
async function startNovaXCode() {
    try {
        const {version: _0x2ef237} = await fetchLatestBaileysVersion();
        ensureSessionDirectory();
        await delay(0x3e8);
        const {
            state: _0x353efd,
            saveCreds: _0x1098b1
        } = await useMultiFileAuthState('./session');
        const _0x18231c = async () => {
            ensureSessionDirectory();
            await _0x1098b1();
        };
        const _0x3abf78 = new _0x0_0x4a1bc9();
        const _0x1a9c7b = await _0x0_0x398d6a['getSetting']('global', 'stealthMode');
        const _0xb0c3f2 = _0x1a9c7b && _0x1a9c7b['enabled'];
        const _0x5a3975 = _0x0_0x2ec0dd({
            'version': _0x2ef237,
            'logger': _0x0_0xde9ffe({ 'level': 'silent' }),
            'browser': Browsers['macOS']('Chrome'),
            'auth': {
                'creds': _0x353efd['creds'],
                'keys': makeCacheableSignalKeyStore(_0x353efd['keys'], _0x0_0xde9ffe({ 'level': 'fatal' })['child']({ 'level': 'fatal' }))
            },
            'markOnlineOnConnect': !_0xb0c3f2,
            'generateHighQualityLinkPreview': !![],
            'syncFullHistory': ![],
            'getMessage': async _0x479eb5 => {
                const _0x4ef391 = jidNormalizedUser(_0x479eb5['remoteJid']);
                const _0x27daa6 = await _0x0_0x398d6a['loadMessage'](_0x4ef391, _0x479eb5['id']);
                return _0x27daa6?.['message'] || '';
            },
            'msgRetryCounterCache': _0x3abf78,
            'defaultQueryTimeoutMs': 0xea60,
            'connectTimeoutMs': 0xea60,
            'keepAliveIntervalMs': 0x2710
        });
        _0x5a3975['store'] = _0x0_0x398d6a;
        const _0x185f5a = _0x5a3975['sendPresenceUpdate'];
        const _0x39841e = _0x5a3975['readMessages'];
        const _0x16a9fe = _0x5a3975['sendReceipt'];
        _0x5a3975['sendPresenceUpdate'] = async function (..._0x2e6a5b) {
            const _0x2af5e8 = await _0x0_0x398d6a['getSetting']('global', 'stealthMode');
            if (_0x2af5e8 && _0x2af5e8['enabled']) {
                printLog('info', '👻\x20Blocked\x20presence\x20update\x20(stealth\x20mode)');
                return;
            }
            return _0x185f5a['apply'](this, _0x2e6a5b);
        };
        _0x5a3975['readMessages'] = async function (..._0x480b04) {
            const _0x5356a4 = await _0x0_0x398d6a['getSetting']('global', 'stealthMode');
            if (_0x5356a4 && _0x5356a4['enabled'])
                return;
            return _0x39841e['apply'](this, _0x480b04);
        };
        if (_0x16a9fe) {
            _0x5a3975['sendReceipt'] = async function (..._0x4866ce) {
                const _0x262126 = await _0x0_0x398d6a['getSetting']('global', 'stealthMode');
                if (_0x262126 && _0x262126['enabled'])
                    return;
                return _0x16a9fe['apply'](this, _0x4866ce);
            };
        }
        const _0x323eb6 = _0x5a3975['query'];
        _0x5a3975['query'] = async function (_0x35c661, ..._0x139c69) {
            const _0x3caa9c = await _0x0_0x398d6a['getSetting']('global', 'stealthMode');
            if (_0x3caa9c && _0x3caa9c['enabled']) {
                if (_0x35c661 && _0x35c661['tag'] === 'receipt')
                    return;
                if (_0x35c661 && _0x35c661['attrs'] && (_0x35c661['attrs']['type'] === 'read' || _0x35c661['attrs']['type'] === 'read-self'))
                    return;
            }
            return _0x323eb6['apply'](this, [
                _0x35c661,
                ..._0x139c69
            ]);
        };
        _0x5a3975['isGhostMode'] = async () => {
            const _0x40fa7c = await _0x0_0x398d6a['getSetting']('global', 'stealthMode');
            return _0x40fa7c && _0x40fa7c['enabled'];
        };
        _0x5a3975['ev']['on']('creds.update', _0x18231c);
        _0x0_0x398d6a['bind'](_0x5a3975['ev']);
        _0x5a3975['ev']['on']('messages.upsert', async _0xd00df6 => {
            try {
                const _0x59620b = _0xd00df6['messages'][0x0];
                if (!_0x59620b['message'])
                    return;
                _0x59620b['message'] = Object['keys'](_0x59620b['message'])[0x0] === 'ephemeralMessage' ? _0x59620b['message']['ephemeralMessage']['message'] : _0x59620b['message'];
                if (_0x59620b['key'] && _0x59620b['key']['remoteJid'] === 'status@broadcast') {
                    await handleStatus(_0x5a3975, _0xd00df6);
                    return;
                }
                if (!_0x5a3975['public'] && !_0x59620b['key']['fromMe'] && _0xd00df6['type'] === 'notify') {
                    const _0x48ede8 = _0x59620b['key']?.['remoteJid']?.['endsWith']('@g.us');
                    if (!_0x48ede8)
                        return;
                }
                if (_0x59620b['key']['id']['startsWith']('BAE5') && _0x59620b['key']['id']['length'] === 0x10)
                    return;
                if (_0x5a3975?.['msgRetryCounterCache']) {
                    _0x5a3975['msgRetryCounterCache']['clear']();
                }
                try {
                    await handleMessages(_0x5a3975, _0xd00df6);
                } catch (_0x3c61b2) {
                    printLog('error', 'Error\x20in\x20handleMessages:\x20' + _0x3c61b2['message']);
                    if (_0x59620b['key'] && _0x59620b['key']['remoteJid']) {
                        await _0x5a3975['sendMessage'](_0x59620b['key']['remoteJid'], {
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
            } catch (_0x18bc1f) {
                printLog('error', 'Error\x20in\x20messages.upsert:\x20' + _0x18bc1f['message']);
            }
        });
        _0x5a3975['decodeJid'] = _0x325fed => {
            if (!_0x325fed)
                return _0x325fed;
            if (/:\d+@/gi['test'](_0x325fed)) {
                const _0x53ef1e = jidDecode(_0x325fed) || {};
                return _0x53ef1e['user'] && _0x53ef1e['server'] && _0x53ef1e['user'] + '@' + _0x53ef1e['server'] || _0x325fed;
            } else
                return _0x325fed;
        };
        _0x5a3975['ev']['on']('contacts.update', _0x35eb9c => {
            for (const _0x519c97 of _0x35eb9c) {
                const _0x940541 = _0x5a3975['decodeJid'](_0x519c97['id']);
                if (_0x0_0x398d6a && _0x0_0x398d6a['contacts'])
                    _0x0_0x398d6a['contacts'][_0x940541] = {
                        'id': _0x940541,
                        'name': _0x519c97['notify']
                    };
            }
        });
        _0x5a3975['getName'] = (_0x1f9697, _0x111d7a = ![]) => {
            const _0x2bec5a = _0x5a3975['decodeJid'](_0x1f9697);
            _0x111d7a = _0x5a3975['withoutContact'] || _0x111d7a;
            let _0xd3d1d6;
            if (_0x2bec5a['endsWith']('@g.us'))
                return new Promise(async _0x18ae5a => {
                    _0xd3d1d6 = _0x0_0x398d6a['contacts'][_0x2bec5a] || {};
                    if (!(_0xd3d1d6['name'] || _0xd3d1d6['subject']))
                        _0xd3d1d6 = _0x5a3975['groupMetadata'](_0x2bec5a) || {};
                    _0x18ae5a(_0xd3d1d6['name'] || _0xd3d1d6['subject'] || _0x0_0x1c46d3('+' + _0x2bec5a['replace']('@s.whatsapp.net', ''))['number']?.['international']);
                });
            else
                _0xd3d1d6 = _0x2bec5a === '0@s.whatsapp.net' ? {
                    'id': _0x2bec5a,
                    'name': 'WhatsApp'
                } : _0x2bec5a === _0x5a3975['decodeJid'](_0x5a3975['user']['id']) ? _0x5a3975['user'] : _0x0_0x398d6a['contacts'][_0x2bec5a] || {};
            return (_0x111d7a ? '' : _0xd3d1d6['name']) || _0xd3d1d6['subject'] || _0xd3d1d6['verifiedName'] || _0x0_0x1c46d3('+' + _0x1f9697['replace']('@s.whatsapp.net', ''))['number']?.['international'];
        };
        _0x5a3975['public'] = !![];
        _0x5a3975['serializeM'] = _0xdebaad => smsg(_0x5a3975, _0xdebaad, _0x0_0x398d6a);
        const _0x2877f8 = _0x353efd['creds']?.['registered'] === !![];
        if (_0x2877f8) {
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
        _0x5a3975['ev']['on']('connection.update', async _0x475e73 => {
            const {
                connection: _0x3d9219,
                lastDisconnect: _0x1209e8,
                qr: _0x5b8578
            } = _0x475e73;
            if (_0x3d9219 === 'open') {
                printLog('success', 'Bot\x20connected\x20successfully!');
                try {
                    const _0x376df7 = await _0x0_0x398d6a['getBotMode']();
                    const _0x5dd409 = process['uptime']();
                    const _0x20a170 = Math['floor'](_0x5dd409 / 0xe10);
                    const _0x2d969e = Math['floor'](_0x5dd409 % 0xe10 / 0x3c);
                    const _0x2d6b97 = 'https://raw.githubusercontent.com/NOVA-X-Code/Nova-MD/refs/heads/main/assets/logo.PNG';
                    let _0x385e24 = null;
                    try {
                        const _0x341dfc = await fetch(_0x2d6b97);
                        if (_0x341dfc['ok']) {
                            const _0x5281b7 = await _0x341dfc['arrayBuffer']();
                            _0x385e24 = Buffer['from'](_0x5281b7);
                        }
                    } catch (_0x3516b8) {
                        const _0x467a7b = _0x0_0x38ecd9['join'](process['cwd'](), 'assets', 'logo.PNG');
                        if (_0x0_0x425928['existsSync'](_0x467a7b)) {
                            _0x385e24 = _0x0_0x425928['readFileSync'](_0x467a7b);
                        }
                    }
                    let _0x45d194 = '╭━━『\x20*' + (_0x0_0x194b68['botName'] || 'NOVA-MD') + '\x20INFO*\x20』━⬣\x0a';
                    _0x45d194 += '┃\x0a';
                    _0x45d194 += '┃\x20✨\x20*Status:*\x20✅\x20ONLINE\x0a';
                    _0x45d194 += '┃\x20🤖\x20*Version:*\x20' + (_0x0_0x194b68['version'] || '2.5.0') + '\x20(Stable)\x0a';
                    _0x45d194 += '┃\x20⚙️\x20*Mode:*\x20' + _0x376df7['toUpperCase']() + '\x0a';
                    _0x45d194 += '┃\x20⏰\x20*Uptime:*\x20' + _0x20a170 + 'h\x20' + _0x2d969e + 'm\x0a';
                    _0x45d194 += '┃\x20📊\x20*Prefixes:*\x20' + _0x0_0x194b68['prefixes']['join']('\x20') + '\x0a';
                    _0x45d194 += '┃\x20📦\x20*Plugins:*\x20' + _0x0_0x36abef['commands']['size'] + '\x0a';
                    _0x45d194 += '┃\x20💾\x20*Storage:*\x20' + _0x0_0x398d6a['getStats']()['backend']['toUpperCase']() + '\x0a';
                    _0x45d194 += '┃\x0a';
                    _0x45d194 += '┃━━━━━━━━━━━━━━━━━━⬣\x0a';
                    _0x45d194 += '┃\x0a';
                    _0x45d194 += '┃\x20🌐\x20*JOIN\x20CHANNELS*\x0a';
                    _0x45d194 += '┃\x0a';
                    _0x45d194 += '┃\x20💬\x20*FaceBook:*\x0a';
                    _0x45d194 += '┃\x20https://www.facebook.com/profile.php?id=61591828051151\x0a';
                    _0x45d194 += '┃\x0a';
                    _0x45d194 += '┃\x20📱\x20*Telegram:*\x0a';
                    _0x45d194 += '┃\x20https://t.me/addlist/CpQzYQfWwwxmYTk0\x0a';
                    _0x45d194 += '┃\x0a';
                    _0x45d194 += '┃\x20▶️\x20*YouTube:*\x0a';
                    _0x45d194 += '┃\x20https://youtube.com/@labokingfreesurf\x0a';
                    _0x45d194 += '┃\x0a';
                    _0x45d194 += '┃━━━━━━━━━━━━━━━━━━⬣\x0a';
                    _0x45d194 += '┃\x0a';
                    _0x45d194 += '┃\x20✨\x20_Powered\x20by\x20NOSTRA._\x0a';
                    _0x45d194 += '╰━━━━━━━━━━━━━━⬣';
                    const _0x1cdb96 = _0x5a3975['user']['id']['split'](':')[0x0] + '@s.whatsapp.net';
                    if (_0x385e24) {
                        await _0x5a3975['sendMessage'](_0x1cdb96, {
                            'image': _0x385e24,
                            'caption': _0x45d194,
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
                        await _0x5a3975['sendMessage'](_0x1cdb96, {
                            'text': _0x45d194,
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
                } catch (_0x43b70b) {
                    printLog('error', 'Failed\x20to\x20send\x20automatic\x20about\x20message:\x20' + _0x43b70b['message']);
                }
                const _0x34c6bc = await _0x0_0x398d6a['getSetting']('global', 'stealthMode');
                if (_0x34c6bc && _0x34c6bc['enabled']) {
                    printLog('info', '👻\x20STEALTH\x20MODE\x20ACTIVE');
                }
                printLog('success', 'Connected\x20to\x20=>\x20' + JSON['stringify'](_0x5a3975['user'], null, 0x2));
                await delay(0x7cf);
                try {
                    owner = JSON['parse'](_0x0_0x425928['readFileSync']('./data/owner.json', 'utf-8'));
                } catch (_0x3ee7c6) {
                }
                printLog('info', '[\x20' + (_0x0_0x194b68['botName'] || 'NOVA-MD') + '\x20]');
                printLog('info', 'WA\x20NUMBER\x20\x20:\x20' + (owner[0x0] || _0x0_0x194b68['ownerNumber'] || ''));
                printLog('success', 'Bot\x20Connected\x20Successfully!');
                printLog('info', 'Plugins\x20\x20\x20:\x20' + _0x0_0x36abef['commands']['size']);
                printLog('info', 'Prefixes\x20\x20\x20:\x20' + _0x0_0x194b68['prefixes']['join'](',\x20'));
                printLog('store', 'Backend\x20\x20\x20\x20:\x20' + _0x0_0x398d6a['getStats']()['backend']);
                console['log']();
            }
            if (_0x3d9219 === 'close') {
                const _0x5f0f69 = _0x1209e8?.['error']?.['output']?.['statusCode'];
                const _0x60547 = _0x5f0f69 !== DisconnectReason['loggedOut'] && _0x5f0f69 !== 0x191;
                if (_0x5f0f69 === DisconnectReason['loggedOut'] || _0x5f0f69 === 0x191) {
                    try {
                        rmSync('./session', {
                            'recursive': !![],
                            'force': !![]
                        });
                    } catch (_0x40622a) {
                    }
                    await delay(0xbb8);
                    startNovaXCode();
                    return;
                }
                if (_0x60547) {
                    printLog('connection', 'Reconnecting\x20in\x205\x20seconds...');
                    await delay(0x1388);
                    startNovaXCode();
                }
            }
        });
        _0x5a3975['ev']['on']('call', async _0x152312 => {
            await handleCall(_0x5a3975, _0x152312);
        });
        _0x5a3975['ev']['on']('group-participants.update', async _0x221104 => {
            await handleGroupParticipantUpdate(_0x5a3975, _0x221104);
        });
        _0x5a3975['ev']['on']('status.update', async _0x15afe2 => {
            await handleStatus(_0x5a3975, _0x15afe2);
        });
        _0x5a3975['ev']['on']('messages.reaction', async _0x48bd12 => {
            await handleStatus(_0x5a3975, _0x48bd12);
        });
        return _0x5a3975;
    } catch (_0x1c7515) {
        printLog('error', 'Error\x20in\x20startNovaXCode:\x20' + _0x1c7515['message']);
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
    printLog('info', '📱\x20Open\x20http://localhost:' + (_0x0_0x194b68['port'] || 0x1388) + '/pairing\x20in\x20your\x20browser\x20if\x20it\x27s\x20local');
    printLog('info', '📱\x20For\x20web\x20servic\x20deployment,\x20click\x20the\x20service\x20URL\x20and\x20add\x20/pairing\x20at\x20the\x20end');
    const _0x260009 = 0x1e * 0x3c * 0x3e8;
    const _0x3cd467 = Date['now']();
    const _0xb9c530 = 0xbb8;
    return new Promise((_0x35c3c8, _0x43a2ab) => {
        const _0x5299f1 = setInterval(() => {
            if (hasValidSession()) {
                clearInterval(_0x5299f1);
                printLog('success', '✅\x20Session\x20detected!\x20Starting\x20bot...');
                _0x35c3c8();
            }
            if (Date['now']() - _0x3cd467 > _0x260009) {
                clearInterval(_0x5299f1);
                _0x43a2ab(new Error('Session\x20creation\x20timeout\x20(30\x20minutes)'));
            }
        }, _0xb9c530);
    });
}
async function main() {
    await compileAll();
    await _0x0_0x36abef['loadCommands']();
    printLog('info', 'Starting\x20NOVA-MD\x20BOT...');
    if (hasValidSession()) {
        printLog('success', '✅\x20Valid\x20session\x20found,\x20starting\x20bot...');
        await delay(0xbb8);
        startNovaXCode()['catch'](_0x3016a5 => {
            printLog('error', 'Fatal\x20error:\x20' + _0x3016a5['message']);
            if (rl && !rlClosed)
                rl['close']();
            process['exit'](0x1);
        });
    } else {
        printLog('info', '🌐\x20No\x20session\x20found.\x20Launching\x20web\x20pairing\x20interface...');
        printLog('info', '📱\x20Open\x20http://localhost:' + (_0x0_0x194b68['port'] || 0x1388) + '/pairing\x20in\x20your\x20browser\x20to\x20connect\x20WhatsApp');
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
            startNovaXCode()['catch'](_0x5ca8a9 => {
                printLog('error', 'Fatal\x20error:\x20' + _0x5ca8a9['message']);
                if (rl && !rlClosed)
                    rl['close']();
                process['exit'](0x1);
            });
        } catch (_0x35e40e) {
            printLog('error', 'Session\x20creation\x20failed:\x20' + _0x35e40e['message']);
            if (rl && !rlClosed)
                rl['close']();
            process['exit'](0x1);
        }
    }
}
main();
const sessionDir = _0x0_0x38ecd9['join'](process['cwd'](), 'session');
setInterval(() => {
    if (!_0x0_0x425928['existsSync'](sessionDir))
        return;
    _0x0_0x425928['readdir'](sessionDir, (_0x5b8ff2, _0x4305ff) => {
        if (_0x5b8ff2)
            return;
        for (const _0x4090b1 of _0x4305ff) {
            if (_0x4090b1 === 'creds.json')
                continue;
            if (_0x4090b1['startsWith']('app-state-sync-key-'))
                continue;
            _0x0_0x425928['unlink'](_0x0_0x38ecd9['join'](sessionDir, _0x4090b1), () => {
            });
        }
    });
}, 0x3 * 0x3c * 0x3e8);
const customTemp = _0x0_0x38ecd9['join'](process['cwd'](), 'temp');
if (!_0x0_0x425928['existsSync'](customTemp))
    _0x0_0x425928['mkdirSync'](customTemp, { 'recursive': !![] });
process.env.TMPDIR = customTemp;
process.env.TEMP = customTemp;
process.env.TMP = customTemp;
setInterval(() => {
    _0x0_0x425928['readdir'](customTemp, (_0x350a73, _0x3a25d7) => {
        if (_0x350a73)
            return;
        for (const _0x524cd0 of _0x3a25d7) {
            const _0x531e91 = _0x0_0x38ecd9['join'](customTemp, _0x524cd0);
            _0x0_0x425928['stat'](_0x531e91, (_0x33677c, _0x3b5370) => {
                if (!_0x33677c && Date['now']() - _0x3b5370['mtimeMs'] > 0x3 * 0x3c * 0x3c * 0x3e8) {
                    _0x0_0x425928['unlink'](_0x531e91, () => {
                    });
                }
            });
        }
    });
}, 0x1 * 0x3c * 0x3c * 0x3e8);
const folders = [
    _0x0_0x38ecd9['join'](__dirname, './lib'),
    _0x0_0x38ecd9['join'](__dirname, './plugins')
];
folders['forEach'](_0x1c98f8 => {
    if (!_0x0_0x425928['existsSync'](_0x1c98f8))
        return;
    _0x0_0x425928['readdirSync'](_0x1c98f8)['filter'](_0x56931d => _0x56931d['endsWith']('.js'))['forEach'](_0x39683e => {
        const _0x252088 = _0x0_0x38ecd9['join'](_0x1c98f8, _0x39683e);
        try {
            const _0x48d1af = _0x0_0x425928['readFileSync'](_0x252088, 'utf-8');
            const _0x530ae4 = _0x0_0x4d0c6b(_0x48d1af, _0x39683e, {
                'sourceType': 'module',
                'allowAwaitOutsideFunction': !![]
            });
            if (_0x530ae4) {
                console['error'](_0x0_0x10a65c['red']('❌\x20Syntax\x20error\x20in\x20' + _0x252088 + ':\x0a' + _0x530ae4));
            }
        } catch (_0x58cf65) {
            console['error'](_0x0_0x10a65c['yellow']('⚠️\x20Cannot\x20read\x20file\x20' + _0x252088 + ':\x0a' + _0x58cf65));
        }
    });
});
process['on']('uncaughtException', _0x3c9db3 => {
    printLog('error', 'Uncaught\x20Exception:\x20' + _0x3c9db3['message']);
    console['error'](_0x3c9db3['stack']);
    writeErrorLog({
        'type': 'uncaughtException',
        'error': _0x3c9db3['message'],
        'stack': _0x3c9db3['stack'],
        'timestamp': new Date()['toISOString']()
    });
});
process['on']('unhandledRejection', _0x5d5eb7 => {
    printLog('error', 'Unhandled\x20Rejection:\x20' + _0x5d5eb7['message']);
    console['error'](_0x5d5eb7['stack']);
    writeErrorLog({
        'type': 'unhandledRejection',
        'error': _0x5d5eb7['message'],
        'stack': _0x5d5eb7['stack'],
        'timestamp': new Date()['toISOString']()
    });
});
server['on']('error', _0x3da60f => {
    if (_0x3da60f['code'] === 'EADDRINUSE') {
        printLog('error', 'Address\x20localhost:' + PORT + '\x20in\x20use');
        writeErrorLog({
            'type': 'serverError',
            'error': 'Address\x20localhost:' + PORT + '\x20in\x20use',
            'timestamp': new Date()['toISOString']()
        });
        server['close']();
    } else {
        printLog('error', 'Server\x20error:\x20' + _0x3da60f['message']);
        writeErrorLog({
            'type': 'serverError',
            'error': _0x3da60f['message'],
            'stack': _0x3da60f['stack'],
            'timestamp': new Date()['toISOString']()
        });
    }
});