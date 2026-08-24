import 'dotenv/config';
import _0x0_0x17f7e0, {
    existsSync,
    mkdirSync,
    rmSync
} from 'fs';
import _0x0_0x7127ea, { dirname } from 'path';
import _0x0_0x3fc721 from 'chalk';
import _0x0_0x3b69fd from 'syntax-error';
import { parsePhoneNumber as _0x0_0x210271 } from 'awesome-phonenumber';
import _0x0_0x104bb2 from 'readline';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { smsg } from './lib/myfunc.js';
import { compileAll } from './lib/compile.js';
import _0x0_0x35a849, {
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    Browsers,
    jidDecode,
    jidNormalizedUser,
    makeCacheableSignalKeyStore,
    delay
} from '@whiskeysockets/baileys';
import _0x0_0x149c24 from 'node-cache';
import _0x0_0x287165 from 'pino';
import _0x0_0xb75ad7 from './config.js';
import _0x0_0x3b2b74 from './lib/lightweight_store.js';
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
import _0x0_0x23abc6 from './lib/commandHandler.js';
import _0x0_0x194a0b from './lib/sessionManager.js';
_0x0_0x3b2b74['readFromFile']();
setInterval(() => _0x0_0x3b2b74['writeToFile'](), _0x0_0xb75ad7['storeWriteInterval'] || 0x2710);
setInterval(() => {
    if (global['gc']) {
        global['gc']();
        console['log']('🧹\x20Garbage\x20collection\x20completed');
    }
}, 0xea60);
setInterval(() => {
    const _0x3772c8 = process['memoryUsage']()['rss'] / 0x400 / 0x400;
    if (_0x3772c8 > 0x190) {
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
_0x0_0x17f7e0['mkdirSync']('./data', { 'recursive': !![] });
for (const [file, def] of Object['entries'](DATA_DEFAULTS)) {
    const fp = './data/' + file;
    if (!_0x0_0x17f7e0['existsSync'](fp))
        _0x0_0x17f7e0['writeFileSync'](fp, JSON['stringify'](def, null, 0x2));
}
let owner = [];
try {
    owner = JSON['parse'](_0x0_0x17f7e0['readFileSync']('./data/owner.json', 'utf-8'));
} catch {
    owner = [];
}
global['botname'] = _0x0_0xb75ad7['botName'] || 'NOVA-MD';
global['themeemoji'] = '•';
const pairingCode = ![];
const useMobile = process['argv']['includes']('--mobile');
let rl = null;
let rlClosed = ![];
if (process['stdin']['isTTY'] && !_0x0_0xb75ad7['pairingNumber']) {
    rl = _0x0_0x104bb2['createInterface']({
        'input': process['stdin'],
        'output': process['stdout']
    });
    rl['on']('close', () => {
        rlClosed = !![];
    });
}
const question = _0x4e2bf6 => {
    if (rl && !rlClosed) {
        return new Promise(_0x2c13bb => rl['question'](_0x4e2bf6, _0x2c13bb));
    } else {
        return Promise['resolve'](_0x0_0xb75ad7['ownerNumber'] || '237676250509');
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
    const _0x37bb4e = _0x0_0x7127ea['join'](__dirname, 'session');
    if (!existsSync(_0x37bb4e)) {
        mkdirSync(_0x37bb4e, { 'recursive': !![] });
    }
    return _0x37bb4e;
}
function hasValidSession() {
    return _0x0_0x194a0b['hasValidSession']();
}
server['listen'](PORT, () => {
    printLog('success', 'Server\x20listening\x20on\x20port\x20' + PORT);
    printLog('info', '🌐\x20Web\x20interface\x20available\x20at:\x20http://localhost:' + PORT + '/pairing');
});
async function startNovaXCode() {
    try {
        const {version: _0x5eca36} = await fetchLatestBaileysVersion();
        ensureSessionDirectory();
        await delay(0x3e8);
        const {
            state: _0x4e24bb,
            saveCreds: _0x4d312a
        } = await useMultiFileAuthState('./session');
        const _0x47b529 = async () => {
            ensureSessionDirectory();
            await _0x4d312a();
        };
        const _0x54570d = new _0x0_0x149c24();
        const _0x5c0296 = await _0x0_0x3b2b74['getSetting']('global', 'stealthMode');
        const _0x400a44 = _0x5c0296 && _0x5c0296['enabled'];
        const _0x534ea9 = _0x0_0x35a849({
            'version': _0x5eca36,
            'logger': _0x0_0x287165({ 'level': 'silent' }),
            'browser': Browsers['macOS']('Chrome'),
            'auth': {
                'creds': _0x4e24bb['creds'],
                'keys': makeCacheableSignalKeyStore(_0x4e24bb['keys'], _0x0_0x287165({ 'level': 'fatal' })['child']({ 'level': 'fatal' }))
            },
            'markOnlineOnConnect': !_0x400a44,
            'generateHighQualityLinkPreview': !![],
            'syncFullHistory': ![],
            'getMessage': async _0x5da23a => {
                const _0x38f483 = jidNormalizedUser(_0x5da23a['remoteJid']);
                const _0x48b683 = await _0x0_0x3b2b74['loadMessage'](_0x38f483, _0x5da23a['id']);
                return _0x48b683?.['message'] || '';
            },
            'msgRetryCounterCache': _0x54570d,
            'defaultQueryTimeoutMs': 0xea60,
            'connectTimeoutMs': 0xea60,
            'keepAliveIntervalMs': 0x2710
        });
        _0x534ea9['store'] = _0x0_0x3b2b74;
        const _0xeca0f2 = _0x534ea9['sendPresenceUpdate'];
        const _0x2d8b05 = _0x534ea9['readMessages'];
        const _0x56a2d7 = _0x534ea9['sendReceipt'];
        _0x534ea9['sendPresenceUpdate'] = async function (..._0x266f92) {
            const _0x5b0589 = await _0x0_0x3b2b74['getSetting']('global', 'stealthMode');
            if (_0x5b0589 && _0x5b0589['enabled']) {
                printLog('info', '👻\x20Blocked\x20presence\x20update\x20(stealth\x20mode)');
                return;
            }
            return _0xeca0f2['apply'](this, _0x266f92);
        };
        _0x534ea9['readMessages'] = async function (..._0x5a29a8) {
            const _0x104034 = await _0x0_0x3b2b74['getSetting']('global', 'stealthMode');
            if (_0x104034 && _0x104034['enabled'])
                return;
            return _0x2d8b05['apply'](this, _0x5a29a8);
        };
        if (_0x56a2d7) {
            _0x534ea9['sendReceipt'] = async function (..._0x6c9e64) {
                const _0x10f67e = await _0x0_0x3b2b74['getSetting']('global', 'stealthMode');
                if (_0x10f67e && _0x10f67e['enabled'])
                    return;
                return _0x56a2d7['apply'](this, _0x6c9e64);
            };
        }
        const _0x27e6a0 = _0x534ea9['query'];
        _0x534ea9['query'] = async function (_0x25f40c, ..._0x5da1ab) {
            const _0x295af0 = await _0x0_0x3b2b74['getSetting']('global', 'stealthMode');
            if (_0x295af0 && _0x295af0['enabled']) {
                if (_0x25f40c && _0x25f40c['tag'] === 'receipt')
                    return;
                if (_0x25f40c && _0x25f40c['attrs'] && (_0x25f40c['attrs']['type'] === 'read' || _0x25f40c['attrs']['type'] === 'read-self'))
                    return;
            }
            return _0x27e6a0['apply'](this, [
                _0x25f40c,
                ..._0x5da1ab
            ]);
        };
        _0x534ea9['isGhostMode'] = async () => {
            const _0x3af9f3 = await _0x0_0x3b2b74['getSetting']('global', 'stealthMode');
            return _0x3af9f3 && _0x3af9f3['enabled'];
        };
        _0x534ea9['ev']['on']('creds.update', _0x47b529);
        _0x0_0x3b2b74['bind'](_0x534ea9['ev']);
        _0x534ea9['ev']['on']('messages.upsert', async _0x6154f => {
            try {
                const _0x207a8c = _0x6154f['messages'][0x0];
                if (!_0x207a8c['message'])
                    return;
                _0x207a8c['message'] = Object['keys'](_0x207a8c['message'])[0x0] === 'ephemeralMessage' ? _0x207a8c['message']['ephemeralMessage']['message'] : _0x207a8c['message'];
                if (_0x207a8c['key'] && _0x207a8c['key']['remoteJid'] === 'status@broadcast') {
                    await handleStatus(_0x534ea9, _0x6154f);
                    return;
                }
                if (!_0x534ea9['public'] && !_0x207a8c['key']['fromMe'] && _0x6154f['type'] === 'notify') {
                    const _0x16603a = _0x207a8c['key']?.['remoteJid']?.['endsWith']('@g.us');
                    if (!_0x16603a)
                        return;
                }
                if (_0x207a8c['key']['id']['startsWith']('BAE5') && _0x207a8c['key']['id']['length'] === 0x10)
                    return;
                if (_0x534ea9?.['msgRetryCounterCache']) {
                    _0x534ea9['msgRetryCounterCache']['clear']();
                }
                try {
                    await handleMessages(_0x534ea9, _0x6154f);
                } catch (_0x35e22a) {
                    printLog('error', 'Error\x20in\x20handleMessages:\x20' + _0x35e22a['message']);
                    if (_0x207a8c['key'] && _0x207a8c['key']['remoteJid']) {
                        await _0x534ea9['sendMessage'](_0x207a8c['key']['remoteJid'], {
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
            } catch (_0x389c91) {
                printLog('error', 'Error\x20in\x20messages.upsert:\x20' + _0x389c91['message']);
            }
        });
        _0x534ea9['decodeJid'] = _0x4f37a5 => {
            if (!_0x4f37a5)
                return _0x4f37a5;
            if (/:\d+@/gi['test'](_0x4f37a5)) {
                const _0xd2c686 = jidDecode(_0x4f37a5) || {};
                return _0xd2c686['user'] && _0xd2c686['server'] && _0xd2c686['user'] + '@' + _0xd2c686['server'] || _0x4f37a5;
            } else
                return _0x4f37a5;
        };
        _0x534ea9['ev']['on']('contacts.update', _0x135396 => {
            for (const _0x1fb490 of _0x135396) {
                const _0x5d98ed = _0x534ea9['decodeJid'](_0x1fb490['id']);
                if (_0x0_0x3b2b74 && _0x0_0x3b2b74['contacts'])
                    _0x0_0x3b2b74['contacts'][_0x5d98ed] = {
                        'id': _0x5d98ed,
                        'name': _0x1fb490['notify']
                    };
            }
        });
        _0x534ea9['getName'] = (_0x208d28, _0x3b3ec8 = ![]) => {
            const _0x2d2f37 = _0x534ea9['decodeJid'](_0x208d28);
            _0x3b3ec8 = _0x534ea9['withoutContact'] || _0x3b3ec8;
            let _0x3c03ea;
            if (_0x2d2f37['endsWith']('@g.us'))
                return new Promise(async _0x57845e => {
                    _0x3c03ea = _0x0_0x3b2b74['contacts'][_0x2d2f37] || {};
                    if (!(_0x3c03ea['name'] || _0x3c03ea['subject']))
                        _0x3c03ea = _0x534ea9['groupMetadata'](_0x2d2f37) || {};
                    _0x57845e(_0x3c03ea['name'] || _0x3c03ea['subject'] || _0x0_0x210271('+' + _0x2d2f37['replace']('@s.whatsapp.net', ''))['number']?.['international']);
                });
            else
                _0x3c03ea = _0x2d2f37 === '0@s.whatsapp.net' ? {
                    'id': _0x2d2f37,
                    'name': 'WhatsApp'
                } : _0x2d2f37 === _0x534ea9['decodeJid'](_0x534ea9['user']['id']) ? _0x534ea9['user'] : _0x0_0x3b2b74['contacts'][_0x2d2f37] || {};
            return (_0x3b3ec8 ? '' : _0x3c03ea['name']) || _0x3c03ea['subject'] || _0x3c03ea['verifiedName'] || _0x0_0x210271('+' + _0x208d28['replace']('@s.whatsapp.net', ''))['number']?.['international'];
        };
        _0x534ea9['public'] = !![];
        _0x534ea9['serializeM'] = _0x164afa => smsg(_0x534ea9, _0x164afa, _0x0_0x3b2b74);
        const _0x521a52 = _0x4e24bb['creds']?.['registered'] === !![];
        if (_0x521a52) {
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
        _0x534ea9['ev']['on']('connection.update', async _0x21ecdb => {
            const {
                connection: _0x333980,
                lastDisconnect: _0x2a07ec,
                qr: _0x13a79f
            } = _0x21ecdb;
            if (_0x333980 === 'open') {
                printLog('success', 'Bot\x20connected\x20successfully!');
                try {
                    const _0x1ba655 = await _0x0_0x3b2b74['getBotMode']();
                    const _0x1ceb28 = process['uptime']();
                    const _0x4b1608 = Math['floor'](_0x1ceb28 / 0xe10);
                    const _0x4ff90a = Math['floor'](_0x1ceb28 % 0xe10 / 0x3c);
                    const _0x3119bc = 'https://raw.githubusercontent.com/NOSTRA-DevOps/Nova-MD/refs/heads/main/assets/logo.PNG';
                    let _0x256fbd = null;
                    try {
                        const _0x3aaa5f = await fetch(_0x3119bc);
                        if (_0x3aaa5f['ok']) {
                            const _0x31736c = await _0x3aaa5f['arrayBuffer']();
                            _0x256fbd = Buffer['from'](_0x31736c);
                        }
                    } catch (_0x43bfd7) {
                        const _0x372764 = _0x0_0x7127ea['join'](process['cwd'](), 'assets', 'logo.PNG');
                        if (_0x0_0x17f7e0['existsSync'](_0x372764)) {
                            _0x256fbd = _0x0_0x17f7e0['readFileSync'](_0x372764);
                        }
                    }
                    let _0x1b4390 = '╭━━━━『\x20*' + (_0x0_0xb75ad7['botName'] || 'NOVA-MD') + '*\x20』━━⬣\x0a';
                    _0x1b4390 += '┃\x0a';
                    _0x1b4390 += '┃\x20✨\x20*Status:*\x20✅\x20ONLINE\x0a';
                    _0x1b4390 += '┃\x20🤖\x20*Version:*\x20' + (_0x0_0xb75ad7['version'] || '2.0.0') + '\x0a';
                    _0x1b4390 += '┃\x20⚙️\x20*Mode:*\x20' + _0x1ba655['toUpperCase']() + '\x0a';
                    _0x1b4390 += '┃\x20⏰\x20*Uptime:*\x20' + _0x4b1608 + 'h\x20' + _0x4ff90a + 'm\x0a';
                    _0x1b4390 += '┃\x20📊\x20*Prefixes:*\x20' + _0x0_0xb75ad7['prefixes']['join']('\x20') + '\x0a';
                    _0x1b4390 += '┃\x20📦\x20*Plugins:*\x20' + _0x0_0x23abc6['commands']['size'] + '\x0a';
                    _0x1b4390 += '┃\x20💾\x20*Storage:*\x20' + _0x0_0x3b2b74['getStats']()['backend']['toUpperCase']() + '\x0a';
                    _0x1b4390 += '┃\x0a';
                    _0x1b4390 += '┃━━━━━━━━━━━━━━━━━━⬣\x0a';
                    _0x1b4390 += '┃\x0a';
                    _0x1b4390 += '┃\x20🌐\x20*JOIN\x20CHANNELS*\x0a';
                    _0x1b4390 += '┃\x0a';
                    _0x1b4390 += '┃\x20💬\x20*FaceBook:*\x0a';
                    _0x1b4390 += '┃\x20https://www.facebook.com/profile.php?id=61591828051151\x0a';
                    _0x1b4390 += '┃\x0a';
                    _0x1b4390 += '┃\x20📱\x20*Telegram:*\x0a';
                    _0x1b4390 += '┃\x20https://t.me/addlist/CpQzYQfWwwxmYTk0\x0a';
                    _0x1b4390 += '┃\x0a';
                    _0x1b4390 += '┃\x20▶️\x20*YouTube:*\x0a';
                    _0x1b4390 += '┃\x20https://youtube.com/@labokingfreesurf\x0a';
                    _0x1b4390 += '┃\x0a';
                    _0x1b4390 += '┃━━━━━━━━━━━━━━━━━━⬣\x0a';
                    _0x1b4390 += '┃\x0a';
                    _0x1b4390 += '┃\x20✨\x20_Powered\x20by\x20NOSTRA._\x0a';
                    _0x1b4390 += '╰━━━━━━━━━━━━━━━━━━⬣';
                    const _0x5d1def = _0x534ea9['user']['id']['split'](':')[0x0] + '@s.whatsapp.net';
                    _0x0_0xb75ad7['ownerNumber'] = _0x5d1def;
                    if (_0x256fbd) {
                        await _0x534ea9['sendMessage'](_0x5d1def, {
                            'image': _0x256fbd,
                            'caption': _0x1b4390,
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
                        await _0x534ea9['sendMessage'](_0x5d1def, {
                            'text': _0x1b4390,
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
                } catch (_0x4dadbc) {
                    printLog('error', 'Failed\x20to\x20send\x20automatic\x20about\x20message:\x20' + _0x4dadbc['message']);
                }
                const _0x4d1299 = await _0x0_0x3b2b74['getSetting']('global', 'stealthMode');
                if (_0x4d1299 && _0x4d1299['enabled']) {
                    printLog('info', '👻\x20STEALTH\x20MODE\x20ACTIVE');
                }
                printLog('success', 'Connected\x20to\x20=>\x20' + JSON['stringify'](_0x534ea9['user'], null, 0x2));
                await delay(0x7cf);
                try {
                    owner = JSON['parse'](_0x0_0x17f7e0['readFileSync']('./data/owner.json', 'utf-8'));
                } catch (_0x223b7b) {
                }
                printLog('info', '[\x20' + (_0x0_0xb75ad7['botName'] || 'NOVA-MD') + '\x20]');
                printLog('info', 'WA\x20NUMBER\x20\x20:\x20' + (owner[0x0] || _0x0_0xb75ad7['ownerNumber'] || ''));
                printLog('success', 'Bot\x20Connected\x20Successfully!');
                printLog('info', 'Plugins\x20\x20\x20:\x20' + _0x0_0x23abc6['commands']['size']);
                printLog('info', 'Prefixes\x20\x20\x20:\x20' + _0x0_0xb75ad7['prefixes']['join'](',\x20'));
                printLog('store', 'Backend\x20\x20\x20\x20:\x20' + _0x0_0x3b2b74['getStats']()['backend']);
                console['log']();
            }
            if (_0x333980 === 'close') {
                const _0x33b49a = _0x2a07ec?.['error']?.['output']?.['statusCode'];
                const _0x2a719e = _0x33b49a !== DisconnectReason['loggedOut'] && _0x33b49a !== 0x191;
                if (_0x33b49a === DisconnectReason['loggedOut'] || _0x33b49a === 0x191) {
                    try {
                        rmSync('./session', {
                            'recursive': !![],
                            'force': !![]
                        });
                    } catch (_0x36a87c) {
                    }
                    await delay(0xbb8);
                    startNovaXCode();
                    return;
                }
                if (_0x2a719e) {
                    printLog('connection', 'Reconnecting\x20in\x205\x20seconds...');
                    await delay(0x1388);
                    startNovaXCode();
                }
            }
        });
        _0x534ea9['ev']['on']('call', async _0x26f17f => {
            await handleCall(_0x534ea9, _0x26f17f);
        });
        _0x534ea9['ev']['on']('group-participants.update', async _0x1d3298 => {
            await handleGroupParticipantUpdate(_0x534ea9, _0x1d3298);
        });
        _0x534ea9['ev']['on']('status.update', async _0x4bb38c => {
            await handleStatus(_0x534ea9, _0x4bb38c);
        });
        _0x534ea9['ev']['on']('messages.reaction', async _0x29290c => {
            await handleStatus(_0x534ea9, _0x29290c);
        });
        return _0x534ea9;
    } catch (_0x2d3957) {
        printLog('error', 'Error\x20in\x20startNovaXCode:\x20' + _0x2d3957['message']);
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
    printLog('info', '📱\x20Open\x20http://localhost:' + (_0x0_0xb75ad7['port'] || 0x1388) + '/pairing\x20in\x20your\x20browser\x20if\x20it\x27s\x20local');
    printLog('info', '📱\x20For\x20web\x20servic\x20deployment,\x20click\x20the\x20service\x20URL\x20and\x20add\x20/pairing\x20at\x20the\x20end');
    const _0x329239 = 0x1e * 0x3c * 0x3e8;
    const _0x61cff7 = Date['now']();
    const _0x28b9d5 = 0xbb8;
    return new Promise((_0x20b313, _0x28fbd2) => {
        const _0x353316 = setInterval(() => {
            if (hasValidSession()) {
                clearInterval(_0x353316);
                printLog('success', '✅\x20Session\x20detected!\x20Starting\x20bot...');
                _0x20b313();
            }
            if (Date['now']() - _0x61cff7 > _0x329239) {
                clearInterval(_0x353316);
                _0x28fbd2(new Error('Session\x20creation\x20timeout\x20(30\x20minutes)'));
            }
        }, _0x28b9d5);
    });
}
async function main() {
    await compileAll();
    await _0x0_0x23abc6['loadCommands']();
    printLog('info', 'Starting\x20NOVA-MD\x20BOT...');
    if (hasValidSession()) {
        printLog('success', '✅\x20Valid\x20session\x20found,\x20starting\x20bot...');
        await delay(0xbb8);
        startNovaXCode()['catch'](_0x23b676 => {
            printLog('error', 'Fatal\x20error:\x20' + _0x23b676['message']);
            if (rl && !rlClosed)
                rl['close']();
            process['exit'](0x1);
        });
    } else {
        printLog('info', '🌐\x20No\x20session\x20found.\x20Launching\x20web\x20pairing\x20interface...');
        printLog('info', '📱\x20Open\x20http://localhost:' + (_0x0_0xb75ad7['port'] || 0x1388) + '/pairing\x20in\x20your\x20browser\x20to\x20connect\x20WhatsApp');
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
            startNovaXCode()['catch'](_0x12ae3a => {
                printLog('error', 'Fatal\x20error:\x20' + _0x12ae3a['message']);
                if (rl && !rlClosed)
                    rl['close']();
                process['exit'](0x1);
            });
        } catch (_0x31af44) {
            printLog('error', 'Session\x20creation\x20failed:\x20' + _0x31af44['message']);
            if (rl && !rlClosed)
                rl['close']();
            process['exit'](0x1);
        }
    }
}
main();
const sessionDir = _0x0_0x7127ea['join'](process['cwd'](), 'session');
setInterval(() => {
    if (!_0x0_0x17f7e0['existsSync'](sessionDir))
        return;
    _0x0_0x17f7e0['readdir'](sessionDir, (_0x560227, _0x592cc2) => {
        if (_0x560227)
            return;
        for (const _0x50c52b of _0x592cc2) {
            if (_0x50c52b === 'creds.json')
                continue;
            if (_0x50c52b['startsWith']('app-state-sync-key-'))
                continue;
            _0x0_0x17f7e0['unlink'](_0x0_0x7127ea['join'](sessionDir, _0x50c52b), () => {
            });
        }
    });
}, 0x3 * 0x3c * 0x3e8);
const customTemp = _0x0_0x7127ea['join'](process['cwd'](), 'temp');
if (!_0x0_0x17f7e0['existsSync'](customTemp))
    _0x0_0x17f7e0['mkdirSync'](customTemp, { 'recursive': !![] });
process.env.TMPDIR = customTemp;
process.env.TEMP = customTemp;
process.env.TMP = customTemp;
setInterval(() => {
    _0x0_0x17f7e0['readdir'](customTemp, (_0xbdc2f2, _0x447471) => {
        if (_0xbdc2f2)
            return;
        for (const _0x356c2e of _0x447471) {
            const _0x1549d8 = _0x0_0x7127ea['join'](customTemp, _0x356c2e);
            _0x0_0x17f7e0['stat'](_0x1549d8, (_0x5f5af5, _0x1b1f97) => {
                if (!_0x5f5af5 && Date['now']() - _0x1b1f97['mtimeMs'] > 0x3 * 0x3c * 0x3c * 0x3e8) {
                    _0x0_0x17f7e0['unlink'](_0x1549d8, () => {
                    });
                }
            });
        }
    });
}, 0x1 * 0x3c * 0x3c * 0x3e8);
const folders = [
    _0x0_0x7127ea['join'](__dirname, './lib'),
    _0x0_0x7127ea['join'](__dirname, './plugins')
];
folders['forEach'](_0x9d0399 => {
    if (!_0x0_0x17f7e0['existsSync'](_0x9d0399))
        return;
    _0x0_0x17f7e0['readdirSync'](_0x9d0399)['filter'](_0x3876a9 => _0x3876a9['endsWith']('.js'))['forEach'](_0x2cabac => {
        const _0x2013cc = _0x0_0x7127ea['join'](_0x9d0399, _0x2cabac);
        try {
            const _0x472553 = _0x0_0x17f7e0['readFileSync'](_0x2013cc, 'utf-8');
            const _0x1296f7 = _0x0_0x3b69fd(_0x472553, _0x2cabac, {
                'sourceType': 'module',
                'allowAwaitOutsideFunction': !![]
            });
            if (_0x1296f7) {
                console['error'](_0x0_0x3fc721['red']('❌\x20Syntax\x20error\x20in\x20' + _0x2013cc + ':\x0a' + _0x1296f7));
            }
        } catch (_0x1b7d1f) {
            console['error'](_0x0_0x3fc721['yellow']('⚠️\x20Cannot\x20read\x20file\x20' + _0x2013cc + ':\x0a' + _0x1b7d1f));
        }
    });
});
process['on']('uncaughtException', _0x2c9cfd => {
    printLog('error', 'Uncaught\x20Exception:\x20' + _0x2c9cfd['message']);
    console['error'](_0x2c9cfd['stack']);
    writeErrorLog({
        'type': 'uncaughtException',
        'error': _0x2c9cfd['message'],
        'stack': _0x2c9cfd['stack'],
        'timestamp': new Date()['toISOString']()
    });
});
process['on']('unhandledRejection', _0xed4fb => {
    printLog('error', 'Unhandled\x20Rejection:\x20' + _0xed4fb['message']);
    console['error'](_0xed4fb['stack']);
    writeErrorLog({
        'type': 'unhandledRejection',
        'error': _0xed4fb['message'],
        'stack': _0xed4fb['stack'],
        'timestamp': new Date()['toISOString']()
    });
});
server['on']('error', _0x17727b => {
    if (_0x17727b['code'] === 'EADDRINUSE') {
        printLog('error', 'Address\x20localhost:' + PORT + '\x20in\x20use');
        writeErrorLog({
            'type': 'serverError',
            'error': 'Address\x20localhost:' + PORT + '\x20in\x20use',
            'timestamp': new Date()['toISOString']()
        });
        server['close']();
    } else {
        printLog('error', 'Server\x20error:\x20' + _0x17727b['message']);
        writeErrorLog({
            'type': 'serverError',
            'error': _0x17727b['message'],
            'stack': _0x17727b['stack'],
            'timestamp': new Date()['toISOString']()
        });
    }
});