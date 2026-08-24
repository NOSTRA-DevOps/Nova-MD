import 'dotenv/config';
import _0x0_0x212b21, {
    existsSync,
    mkdirSync,
    rmSync
} from 'fs';
import _0x0_0xa5ac91, { dirname } from 'path';
import _0x0_0x1239ad from 'chalk';
import _0x0_0x5e89fd from 'syntax-error';
import { parsePhoneNumber as _0x0_0x163fe8 } from 'awesome-phonenumber';
import _0x0_0x342b7f from 'readline';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { smsg } from './lib/myfunc.js';
import { compileAll } from './lib/compile.js';
import _0x0_0xe9e6ab, {
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    Browsers,
    jidDecode,
    jidNormalizedUser,
    makeCacheableSignalKeyStore,
    delay
} from '@whiskeysockets/baileys';
import _0x0_0x308b5b from 'node-cache';
import _0x0_0x3e4d16 from 'pino';
import _0x0_0x2e84ae from './config.js';
import _0x0_0x29af11 from './lib/lightweight_store.js';
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
import _0x0_0x4c905c from './lib/commandHandler.js';
import _0x0_0xa6ced6 from './lib/sessionManager.js';
_0x0_0x29af11['readFromFile']();
setInterval(() => _0x0_0x29af11['writeToFile'](), _0x0_0x2e84ae['storeWriteInterval'] || 0x2710);
setInterval(() => {
    if (global['gc']) {
        global['gc']();
        console['log']('🧹\x20Garbage\x20collection\x20completed');
    }
}, 0xea60);
setInterval(() => {
    const _0x3ebfb4 = process['memoryUsage']()['rss'] / 0x400 / 0x400;
    if (_0x3ebfb4 > 0x190) {
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
_0x0_0x212b21['mkdirSync']('./data', { 'recursive': !![] });
for (const [file, def] of Object['entries'](DATA_DEFAULTS)) {
    const fp = './data/' + file;
    if (!_0x0_0x212b21['existsSync'](fp))
        _0x0_0x212b21['writeFileSync'](fp, JSON['stringify'](def, null, 0x2));
}
let owner = [];
try {
    owner = JSON['parse'](_0x0_0x212b21['readFileSync']('./data/owner.json', 'utf-8'));
} catch {
    owner = [];
}
global['botname'] = _0x0_0x2e84ae['botName'] || 'NOVA-MD';
global['themeemoji'] = '•';
const pairingCode = ![];
const useMobile = process['argv']['includes']('--mobile');
let rl = null;
let rlClosed = ![];
if (process['stdin']['isTTY'] && !_0x0_0x2e84ae['pairingNumber']) {
    rl = _0x0_0x342b7f['createInterface']({
        'input': process['stdin'],
        'output': process['stdout']
    });
    rl['on']('close', () => {
        rlClosed = !![];
    });
}
const question = _0x57d8e5 => {
    if (rl && !rlClosed) {
        return new Promise(_0x5986d9 => rl['question'](_0x57d8e5, _0x5986d9));
    } else {
        return Promise['resolve'](_0x0_0x2e84ae['ownerNumber'] || '237676250509');
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
    const _0x36575a = _0x0_0xa5ac91['join'](__dirname, 'session');
    if (!existsSync(_0x36575a)) {
        mkdirSync(_0x36575a, { 'recursive': !![] });
    }
    return _0x36575a;
}
function hasValidSession() {
    return _0x0_0xa6ced6['hasValidSession']();
}
server['listen'](PORT, () => {
    printLog('success', 'Server\x20listening\x20on\x20port\x20' + PORT);
    printLog('info', '🌐\x20Web\x20interface\x20available\x20at:\x20http://localhost:' + PORT + '/pairing');
});
async function startNovaXCode() {
    try {
        const {version: _0x4cc6dd} = await fetchLatestBaileysVersion();
        ensureSessionDirectory();
        await delay(0x3e8);
        const {
            state: _0x183d47,
            saveCreds: _0x50d734
        } = await useMultiFileAuthState('./session');
        const _0x3442d8 = async () => {
            ensureSessionDirectory();
            await _0x50d734();
        };
        const _0x51d0ec = new _0x0_0x308b5b();
        const _0x227335 = await _0x0_0x29af11['getSetting']('global', 'stealthMode');
        const _0x13fd88 = _0x227335 && _0x227335['enabled'];
        const _0x3f3672 = _0x0_0xe9e6ab({
            'version': _0x4cc6dd,
            'logger': _0x0_0x3e4d16({ 'level': 'silent' }),
            'browser': Browsers['macOS']('Chrome'),
            'auth': {
                'creds': _0x183d47['creds'],
                'keys': makeCacheableSignalKeyStore(_0x183d47['keys'], _0x0_0x3e4d16({ 'level': 'fatal' })['child']({ 'level': 'fatal' }))
            },
            'markOnlineOnConnect': !_0x13fd88,
            'generateHighQualityLinkPreview': !![],
            'syncFullHistory': ![],
            'getMessage': async _0x218375 => {
                const _0x2a05cf = jidNormalizedUser(_0x218375['remoteJid']);
                const _0x39eece = await _0x0_0x29af11['loadMessage'](_0x2a05cf, _0x218375['id']);
                return _0x39eece?.['message'] || '';
            },
            'msgRetryCounterCache': _0x51d0ec,
            'defaultQueryTimeoutMs': 0xea60,
            'connectTimeoutMs': 0xea60,
            'keepAliveIntervalMs': 0x2710
        });
        _0x3f3672['store'] = _0x0_0x29af11;
        const _0x1a7a40 = _0x3f3672['sendPresenceUpdate'];
        const _0x5e8c3a = _0x3f3672['readMessages'];
        const _0x46b0c1 = _0x3f3672['sendReceipt'];
        _0x3f3672['sendPresenceUpdate'] = async function (..._0x32ccce) {
            const _0x402b1b = await _0x0_0x29af11['getSetting']('global', 'stealthMode');
            if (_0x402b1b && _0x402b1b['enabled']) {
                printLog('info', '👻\x20Blocked\x20presence\x20update\x20(stealth\x20mode)');
                return;
            }
            return _0x1a7a40['apply'](this, _0x32ccce);
        };
        _0x3f3672['readMessages'] = async function (..._0x3e7c9d) {
            const _0x115a38 = await _0x0_0x29af11['getSetting']('global', 'stealthMode');
            if (_0x115a38 && _0x115a38['enabled'])
                return;
            return _0x5e8c3a['apply'](this, _0x3e7c9d);
        };
        if (_0x46b0c1) {
            _0x3f3672['sendReceipt'] = async function (..._0x3a81af) {
                const _0x479106 = await _0x0_0x29af11['getSetting']('global', 'stealthMode');
                if (_0x479106 && _0x479106['enabled'])
                    return;
                return _0x46b0c1['apply'](this, _0x3a81af);
            };
        }
        const _0x1ba24e = _0x3f3672['query'];
        _0x3f3672['query'] = async function (_0x5e80c0, ..._0xe60f3f) {
            const _0x4cb8de = await _0x0_0x29af11['getSetting']('global', 'stealthMode');
            if (_0x4cb8de && _0x4cb8de['enabled']) {
                if (_0x5e80c0 && _0x5e80c0['tag'] === 'receipt')
                    return;
                if (_0x5e80c0 && _0x5e80c0['attrs'] && (_0x5e80c0['attrs']['type'] === 'read' || _0x5e80c0['attrs']['type'] === 'read-self'))
                    return;
            }
            return _0x1ba24e['apply'](this, [
                _0x5e80c0,
                ..._0xe60f3f
            ]);
        };
        _0x3f3672['isGhostMode'] = async () => {
            const _0x55e31b = await _0x0_0x29af11['getSetting']('global', 'stealthMode');
            return _0x55e31b && _0x55e31b['enabled'];
        };
        _0x3f3672['ev']['on']('creds.update', _0x3442d8);
        _0x0_0x29af11['bind'](_0x3f3672['ev']);
        _0x3f3672['ev']['on']('messages.upsert', async _0x3f65ff => {
            try {
                const _0x18b1e6 = _0x3f65ff['messages'][0x0];
                if (!_0x18b1e6['message'])
                    return;
                _0x18b1e6['message'] = Object['keys'](_0x18b1e6['message'])[0x0] === 'ephemeralMessage' ? _0x18b1e6['message']['ephemeralMessage']['message'] : _0x18b1e6['message'];
                if (_0x18b1e6['key'] && _0x18b1e6['key']['remoteJid'] === 'status@broadcast') {
                    await handleStatus(_0x3f3672, _0x3f65ff);
                    return;
                }
                if (!_0x3f3672['public'] && !_0x18b1e6['key']['fromMe'] && _0x3f65ff['type'] === 'notify') {
                    const _0x1b5381 = _0x18b1e6['key']?.['remoteJid']?.['endsWith']('@g.us');
                    if (!_0x1b5381)
                        return;
                }
                if (_0x18b1e6['key']['id']['startsWith']('BAE5') && _0x18b1e6['key']['id']['length'] === 0x10)
                    return;
                if (_0x3f3672?.['msgRetryCounterCache']) {
                    _0x3f3672['msgRetryCounterCache']['clear']();
                }
                try {
                    await handleMessages(_0x3f3672, _0x3f65ff);
                } catch (_0x4e0e7e) {
                    printLog('error', 'Error\x20in\x20handleMessages:\x20' + _0x4e0e7e['message']);
                    if (_0x18b1e6['key'] && _0x18b1e6['key']['remoteJid']) {
                        await _0x3f3672['sendMessage'](_0x18b1e6['key']['remoteJid'], {
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
            } catch (_0x232ba6) {
                printLog('error', 'Error\x20in\x20messages.upsert:\x20' + _0x232ba6['message']);
            }
        });
        _0x3f3672['decodeJid'] = _0x4d73a6 => {
            if (!_0x4d73a6)
                return _0x4d73a6;
            if (/:\d+@/gi['test'](_0x4d73a6)) {
                const _0x292582 = jidDecode(_0x4d73a6) || {};
                return _0x292582['user'] && _0x292582['server'] && _0x292582['user'] + '@' + _0x292582['server'] || _0x4d73a6;
            } else
                return _0x4d73a6;
        };
        _0x3f3672['ev']['on']('contacts.update', _0x5b77fe => {
            for (const _0x4e2451 of _0x5b77fe) {
                const _0x10a85a = _0x3f3672['decodeJid'](_0x4e2451['id']);
                if (_0x0_0x29af11 && _0x0_0x29af11['contacts'])
                    _0x0_0x29af11['contacts'][_0x10a85a] = {
                        'id': _0x10a85a,
                        'name': _0x4e2451['notify']
                    };
            }
        });
        _0x3f3672['getName'] = (_0x4aa92f, _0x4845ec = ![]) => {
            const _0x5bdddd = _0x3f3672['decodeJid'](_0x4aa92f);
            _0x4845ec = _0x3f3672['withoutContact'] || _0x4845ec;
            let _0x4a27be;
            if (_0x5bdddd['endsWith']('@g.us'))
                return new Promise(async _0x4ac8b9 => {
                    _0x4a27be = _0x0_0x29af11['contacts'][_0x5bdddd] || {};
                    if (!(_0x4a27be['name'] || _0x4a27be['subject']))
                        _0x4a27be = _0x3f3672['groupMetadata'](_0x5bdddd) || {};
                    _0x4ac8b9(_0x4a27be['name'] || _0x4a27be['subject'] || _0x0_0x163fe8('+' + _0x5bdddd['replace']('@s.whatsapp.net', ''))['number']?.['international']);
                });
            else
                _0x4a27be = _0x5bdddd === '0@s.whatsapp.net' ? {
                    'id': _0x5bdddd,
                    'name': 'WhatsApp'
                } : _0x5bdddd === _0x3f3672['decodeJid'](_0x3f3672['user']['id']) ? _0x3f3672['user'] : _0x0_0x29af11['contacts'][_0x5bdddd] || {};
            return (_0x4845ec ? '' : _0x4a27be['name']) || _0x4a27be['subject'] || _0x4a27be['verifiedName'] || _0x0_0x163fe8('+' + _0x4aa92f['replace']('@s.whatsapp.net', ''))['number']?.['international'];
        };
        _0x3f3672['public'] = !![];
        _0x3f3672['serializeM'] = _0x38c960 => smsg(_0x3f3672, _0x38c960, _0x0_0x29af11);
        const _0x39efb8 = _0x183d47['creds']?.['registered'] === !![];
        if (_0x39efb8) {
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
        _0x3f3672['ev']['on']('connection.update', async _0x8cf2ce => {
            const {
                connection: _0x751f9b,
                lastDisconnect: _0x3cd67b,
                qr: _0x699f39
            } = _0x8cf2ce;
            if (_0x751f9b === 'open') {
                printLog('success', 'Bot\x20connected\x20successfully!');
                try {
                    const _0x3f4633 = await _0x0_0x29af11['getBotMode']();
                    const _0x1fdcb1 = process['uptime']();
                    const _0x4c2816 = Math['floor'](_0x1fdcb1 / 0xe10);
                    const _0x23dcf1 = Math['floor'](_0x1fdcb1 % 0xe10 / 0x3c);
                    const _0x3ad774 = 'https://raw.githubusercontent.com/NOSTRA-DevOps/Nova-MD/refs/heads/main/assets/logo.PNG';
                    let _0x151fec = null;
                    try {
                        const _0x162db2 = await fetch(_0x3ad774);
                        if (_0x162db2['ok']) {
                            const _0x3623a5 = await _0x162db2['arrayBuffer']();
                            _0x151fec = Buffer['from'](_0x3623a5);
                        }
                    } catch (_0x22134c) {
                        const _0x414921 = _0x0_0xa5ac91['join'](process['cwd'](), 'assets', 'logo.PNG');
                        if (_0x0_0x212b21['existsSync'](_0x414921)) {
                            _0x151fec = _0x0_0x212b21['readFileSync'](_0x414921);
                        }
                    }
                    let _0x85ae16 = '╭━━━━『\x20*' + (_0x0_0x2e84ae['botName'] || 'NOVA-MD') + '\x20INFO*\x20』━━━⬣\x0a';
                    _0x85ae16 += '┃\x0a';
                    _0x85ae16 += '┃\x20✨\x20*Status:*\x20✅\x20ONLINE\x0a';
                    _0x85ae16 += '┃\x20🤖\x20*Version:*\x20' + (_0x0_0x2e84ae['version'] || '2.5.0') + '\x20(Stable)\x0a';
                    _0x85ae16 += '┃\x20⚙️\x20*Mode:*\x20' + _0x3f4633['toUpperCase']() + '\x0a';
                    _0x85ae16 += '┃\x20⏰\x20*Uptime:*\x20' + _0x4c2816 + 'h\x20' + _0x23dcf1 + 'm\x0a';
                    _0x85ae16 += '┃\x20📊\x20*Prefixes:*\x20' + _0x0_0x2e84ae['prefixes']['join']('\x20') + '\x0a';
                    _0x85ae16 += '┃\x20📦\x20*Plugins:*\x20' + _0x0_0x4c905c['commands']['size'] + '\x0a';
                    _0x85ae16 += '┃\x20💾\x20*Storage:*\x20' + _0x0_0x29af11['getStats']()['backend']['toUpperCase']() + '\x0a';
                    _0x85ae16 += '┃\x0a';
                    _0x85ae16 += '┃━━━━━━━━━━━━━━━━━━⬣\x0a';
                    _0x85ae16 += '┃\x0a';
                    _0x85ae16 += '┃\x20🌐\x20*JOIN\x20CHANNELS*\x0a';
                    _0x85ae16 += '┃\x0a';
                    _0x85ae16 += '┃\x20💬\x20*FaceBook:*\x0a';
                    _0x85ae16 += '┃\x20https://www.facebook.com/profile.php?id=61591828051151\x0a';
                    _0x85ae16 += '┃\x0a';
                    _0x85ae16 += '┃\x20📱\x20*Telegram:*\x0a';
                    _0x85ae16 += '┃\x20https://t.me/addlist/CpQzYQfWwwxmYTk0\x0a';
                    _0x85ae16 += '┃\x0a';
                    _0x85ae16 += '┃\x20▶️\x20*YouTube:*\x0a';
                    _0x85ae16 += '┃\x20https://youtube.com/@labokingfreesurf\x0a';
                    _0x85ae16 += '┃\x0a';
                    _0x85ae16 += '┃━━━━━━━━━━━━━━━━━━⬣\x0a';
                    _0x85ae16 += '┃\x0a';
                    _0x85ae16 += '┃\x20✨\x20_Powered\x20by\x20NOSTRA._\x0a';
                    _0x85ae16 += '╰━━━━━━━━━━━━━━━━━━⬣';
                    const _0x1a70f2 = _0x3f3672['user']['id']['split'](':')[0x0] + '@s.whatsapp.net';
                    if (_0x151fec) {
                        await _0x3f3672['sendMessage'](_0x1a70f2, {
                            'image': _0x151fec,
                            'caption': _0x85ae16,
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
                        await _0x3f3672['sendMessage'](_0x1a70f2, {
                            'text': _0x85ae16,
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
                } catch (_0xf06b43) {
                    printLog('error', 'Failed\x20to\x20send\x20automatic\x20about\x20message:\x20' + _0xf06b43['message']);
                }
                const _0xe8ea5e = await _0x0_0x29af11['getSetting']('global', 'stealthMode');
                if (_0xe8ea5e && _0xe8ea5e['enabled']) {
                    printLog('info', '👻\x20STEALTH\x20MODE\x20ACTIVE');
                }
                printLog('success', 'Connected\x20to\x20=>\x20' + JSON['stringify'](_0x3f3672['user'], null, 0x2));
                await delay(0x7cf);
                try {
                    owner = JSON['parse'](_0x0_0x212b21['readFileSync']('./data/owner.json', 'utf-8'));
                } catch (_0xa21bcc) {
                }
                printLog('info', '[\x20' + (_0x0_0x2e84ae['botName'] || 'NOVA-MD') + '\x20]');
                printLog('info', 'WA\x20NUMBER\x20\x20:\x20' + (owner[0x0] || _0x0_0x2e84ae['ownerNumber'] || ''));
                printLog('success', 'Bot\x20Connected\x20Successfully!');
                printLog('info', 'Plugins\x20\x20\x20:\x20' + _0x0_0x4c905c['commands']['size']);
                printLog('info', 'Prefixes\x20\x20\x20:\x20' + _0x0_0x2e84ae['prefixes']['join'](',\x20'));
                printLog('store', 'Backend\x20\x20\x20\x20:\x20' + _0x0_0x29af11['getStats']()['backend']);
                console['log']();
            }
            if (_0x751f9b === 'close') {
                const _0x2283c3 = _0x3cd67b?.['error']?.['output']?.['statusCode'];
                const _0x57c5de = _0x2283c3 !== DisconnectReason['loggedOut'] && _0x2283c3 !== 0x191;
                if (_0x2283c3 === DisconnectReason['loggedOut'] || _0x2283c3 === 0x191) {
                    try {
                        rmSync('./session', {
                            'recursive': !![],
                            'force': !![]
                        });
                    } catch (_0x58658a) {
                    }
                    await delay(0xbb8);
                    startNovaXCode();
                    return;
                }
                if (_0x57c5de) {
                    printLog('connection', 'Reconnecting\x20in\x205\x20seconds...');
                    await delay(0x1388);
                    startNovaXCode();
                }
            }
        });
        _0x3f3672['ev']['on']('call', async _0x2c30d0 => {
            await handleCall(_0x3f3672, _0x2c30d0);
        });
        _0x3f3672['ev']['on']('group-participants.update', async _0x2e5d0d => {
            await handleGroupParticipantUpdate(_0x3f3672, _0x2e5d0d);
        });
        _0x3f3672['ev']['on']('status.update', async _0xac27c => {
            await handleStatus(_0x3f3672, _0xac27c);
        });
        _0x3f3672['ev']['on']('messages.reaction', async _0x52ef24 => {
            await handleStatus(_0x3f3672, _0x52ef24);
        });
        return _0x3f3672;
    } catch (_0x351f88) {
        printLog('error', 'Error\x20in\x20startNovaXCode:\x20' + _0x351f88['message']);
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
    printLog('info', '📱\x20Open\x20http://localhost:' + (_0x0_0x2e84ae['port'] || 0x1388) + '/pairing\x20in\x20your\x20browser\x20if\x20it\x27s\x20local');
    printLog('info', '📱\x20For\x20web\x20servic\x20deployment,\x20click\x20the\x20service\x20URL\x20and\x20add\x20/pairing\x20at\x20the\x20end');
    const _0x13dacc = 0x1e * 0x3c * 0x3e8;
    const _0x524490 = Date['now']();
    const _0x593cc4 = 0xbb8;
    return new Promise((_0x148aa0, _0x434cb5) => {
        const _0x5b9026 = setInterval(() => {
            if (hasValidSession()) {
                clearInterval(_0x5b9026);
                printLog('success', '✅\x20Session\x20detected!\x20Starting\x20bot...');
                _0x148aa0();
            }
            if (Date['now']() - _0x524490 > _0x13dacc) {
                clearInterval(_0x5b9026);
                _0x434cb5(new Error('Session\x20creation\x20timeout\x20(30\x20minutes)'));
            }
        }, _0x593cc4);
    });
}
async function main() {
    await compileAll();
    await _0x0_0x4c905c['loadCommands']();
    printLog('info', 'Starting\x20NOVA-MD\x20BOT...');
    if (hasValidSession()) {
        printLog('success', '✅\x20Valid\x20session\x20found,\x20starting\x20bot...');
        await delay(0xbb8);
        startNovaXCode()['catch'](_0x1df175 => {
            printLog('error', 'Fatal\x20error:\x20' + _0x1df175['message']);
            if (rl && !rlClosed)
                rl['close']();
            process['exit'](0x1);
        });
    } else {
        printLog('info', '🌐\x20No\x20session\x20found.\x20Launching\x20web\x20pairing\x20interface...');
        printLog('info', '📱\x20Open\x20http://localhost:' + (_0x0_0x2e84ae['port'] || 0x1388) + '/pairing\x20in\x20your\x20browser\x20to\x20connect\x20WhatsApp');
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
            startNovaXCode()['catch'](_0xae13b4 => {
                printLog('error', 'Fatal\x20error:\x20' + _0xae13b4['message']);
                if (rl && !rlClosed)
                    rl['close']();
                process['exit'](0x1);
            });
        } catch (_0x4006b0) {
            printLog('error', 'Session\x20creation\x20failed:\x20' + _0x4006b0['message']);
            if (rl && !rlClosed)
                rl['close']();
            process['exit'](0x1);
        }
    }
}
main();
const sessionDir = _0x0_0xa5ac91['join'](process['cwd'](), 'session');
setInterval(() => {
    if (!_0x0_0x212b21['existsSync'](sessionDir))
        return;
    _0x0_0x212b21['readdir'](sessionDir, (_0x5d235d, _0x1be9f3) => {
        if (_0x5d235d)
            return;
        for (const _0x337602 of _0x1be9f3) {
            if (_0x337602 === 'creds.json')
                continue;
            if (_0x337602['startsWith']('app-state-sync-key-'))
                continue;
            _0x0_0x212b21['unlink'](_0x0_0xa5ac91['join'](sessionDir, _0x337602), () => {
            });
        }
    });
}, 0x3 * 0x3c * 0x3e8);
const customTemp = _0x0_0xa5ac91['join'](process['cwd'](), 'temp');
if (!_0x0_0x212b21['existsSync'](customTemp))
    _0x0_0x212b21['mkdirSync'](customTemp, { 'recursive': !![] });
process.env.TMPDIR = customTemp;
process.env.TEMP = customTemp;
process.env.TMP = customTemp;
setInterval(() => {
    _0x0_0x212b21['readdir'](customTemp, (_0x2086b8, _0x4f12a6) => {
        if (_0x2086b8)
            return;
        for (const _0x266d25 of _0x4f12a6) {
            const _0x29038e = _0x0_0xa5ac91['join'](customTemp, _0x266d25);
            _0x0_0x212b21['stat'](_0x29038e, (_0x20006a, _0x183525) => {
                if (!_0x20006a && Date['now']() - _0x183525['mtimeMs'] > 0x3 * 0x3c * 0x3c * 0x3e8) {
                    _0x0_0x212b21['unlink'](_0x29038e, () => {
                    });
                }
            });
        }
    });
}, 0x1 * 0x3c * 0x3c * 0x3e8);
const folders = [
    _0x0_0xa5ac91['join'](__dirname, './lib'),
    _0x0_0xa5ac91['join'](__dirname, './plugins')
];
folders['forEach'](_0x399ac8 => {
    if (!_0x0_0x212b21['existsSync'](_0x399ac8))
        return;
    _0x0_0x212b21['readdirSync'](_0x399ac8)['filter'](_0x2d569a => _0x2d569a['endsWith']('.js'))['forEach'](_0x300a99 => {
        const _0x111542 = _0x0_0xa5ac91['join'](_0x399ac8, _0x300a99);
        try {
            const _0x37c3cc = _0x0_0x212b21['readFileSync'](_0x111542, 'utf-8');
            const _0x55ca2c = _0x0_0x5e89fd(_0x37c3cc, _0x300a99, {
                'sourceType': 'module',
                'allowAwaitOutsideFunction': !![]
            });
            if (_0x55ca2c) {
                console['error'](_0x0_0x1239ad['red']('❌\x20Syntax\x20error\x20in\x20' + _0x111542 + ':\x0a' + _0x55ca2c));
            }
        } catch (_0x3e8f25) {
            console['error'](_0x0_0x1239ad['yellow']('⚠️\x20Cannot\x20read\x20file\x20' + _0x111542 + ':\x0a' + _0x3e8f25));
        }
    });
});
process['on']('uncaughtException', _0x4a0c2f => {
    printLog('error', 'Uncaught\x20Exception:\x20' + _0x4a0c2f['message']);
    console['error'](_0x4a0c2f['stack']);
    writeErrorLog({
        'type': 'uncaughtException',
        'error': _0x4a0c2f['message'],
        'stack': _0x4a0c2f['stack'],
        'timestamp': new Date()['toISOString']()
    });
});
process['on']('unhandledRejection', _0x21f52b => {
    printLog('error', 'Unhandled\x20Rejection:\x20' + _0x21f52b['message']);
    console['error'](_0x21f52b['stack']);
    writeErrorLog({
        'type': 'unhandledRejection',
        'error': _0x21f52b['message'],
        'stack': _0x21f52b['stack'],
        'timestamp': new Date()['toISOString']()
    });
});
server['on']('error', _0x4ca709 => {
    if (_0x4ca709['code'] === 'EADDRINUSE') {
        printLog('error', 'Address\x20localhost:' + PORT + '\x20in\x20use');
        writeErrorLog({
            'type': 'serverError',
            'error': 'Address\x20localhost:' + PORT + '\x20in\x20use',
            'timestamp': new Date()['toISOString']()
        });
        server['close']();
    } else {
        printLog('error', 'Server\x20error:\x20' + _0x4ca709['message']);
        writeErrorLog({
            'type': 'serverError',
            'error': _0x4ca709['message'],
            'stack': _0x4ca709['stack'],
            'timestamp': new Date()['toISOString']()
        });
    }
});