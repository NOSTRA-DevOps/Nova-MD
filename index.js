import 'dotenv/config';
import _0x0_0x2efbad, {
    existsSync,
    mkdirSync,
    rmSync
} from 'fs';
import _0x0_0x524145, { dirname } from 'path';
import _0x0_0x108dac from 'chalk';
import _0x0_0x5c9324 from 'syntax-error';
import { parsePhoneNumber as _0x0_0x22627b } from 'awesome-phonenumber';
import _0x0_0x27ccc2 from 'readline';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { smsg } from './lib/myfunc.js';
import { compileAll } from './lib/compile.js';
import _0x0_0xc92fd1, {
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    Browsers,
    jidDecode,
    jidNormalizedUser,
    makeCacheableSignalKeyStore,
    delay
} from '@whiskeysockets/baileys';
import _0x0_0x1c7adb from 'node-cache';
import _0x0_0x5d84da from 'pino';
import _0x0_0x1decc4 from './config.js';
import _0x0_0x12f367 from './lib/lightweight_store.js';
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
import _0x0_0x55e87f from './lib/commandHandler.js';
import _0x0_0x31d7bc from './lib/sessionManager.js';
_0x0_0x12f367['readFromFile']();
setInterval(() => _0x0_0x12f367['writeToFile'](), _0x0_0x1decc4['storeWriteInterval'] || 0x2710);
setInterval(() => {
    if (global['gc']) {
        global['gc']();
        console['log']('🧹\x20Garbage\x20collection\x20completed');
    }
}, 0xea60);
setInterval(() => {
    const _0x481c99 = process['memoryUsage']()['rss'] / 0x400 / 0x400;
    if (_0x481c99 > 0x190) {
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
_0x0_0x2efbad['mkdirSync']('./data', { 'recursive': !![] });
for (const [file, def] of Object['entries'](DATA_DEFAULTS)) {
    const fp = './data/' + file;
    if (!_0x0_0x2efbad['existsSync'](fp))
        _0x0_0x2efbad['writeFileSync'](fp, JSON['stringify'](def, null, 0x2));
}
let owner = [];
try {
    owner = JSON['parse'](_0x0_0x2efbad['readFileSync']('./data/owner.json', 'utf-8'));
} catch {
    owner = [];
}
global['botname'] = _0x0_0x1decc4['botName'] || 'NOVA-MD';
global['themeemoji'] = '•';
const pairingCode = ![];
const useMobile = process['argv']['includes']('--mobile');
let rl = null;
let rlClosed = ![];
if (process['stdin']['isTTY'] && !_0x0_0x1decc4['pairingNumber']) {
    rl = _0x0_0x27ccc2['createInterface']({
        'input': process['stdin'],
        'output': process['stdout']
    });
    rl['on']('close', () => {
        rlClosed = !![];
    });
}
const question = _0x3c29f5 => {
    if (rl && !rlClosed) {
        return new Promise(_0x3bbe50 => rl['question'](_0x3c29f5, _0x3bbe50));
    } else {
        return Promise['resolve'](_0x0_0x1decc4['ownerNumber'] || '237676250509');
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
    const _0x34e872 = _0x0_0x524145['join'](__dirname, 'session');
    if (!existsSync(_0x34e872)) {
        mkdirSync(_0x34e872, { 'recursive': !![] });
    }
    return _0x34e872;
}
function hasValidSession() {
    return _0x0_0x31d7bc['hasValidSession']();
}
server['listen'](PORT, () => {
    printLog('success', 'Server\x20listening\x20on\x20port\x20' + PORT);
    printLog('info', '🌐\x20Web\x20interface\x20available\x20at:\x20http://localhost:' + PORT + '/pairing');
});
async function startNovaXCode() {
    try {
        const {version: _0x25f149} = await fetchLatestBaileysVersion();
        ensureSessionDirectory();
        await delay(0x3e8);
        const {
            state: _0x104bc0,
            saveCreds: _0x447097
        } = await useMultiFileAuthState('./session');
        const _0xdd11e4 = async () => {
            ensureSessionDirectory();
            await _0x447097();
        };
        const _0x22d795 = new _0x0_0x1c7adb();
        const _0x5911cc = await _0x0_0x12f367['getSetting']('global', 'stealthMode');
        const _0x452450 = _0x5911cc && _0x5911cc['enabled'];
        const _0xb041ff = _0x0_0xc92fd1({
            'version': _0x25f149,
            'logger': _0x0_0x5d84da({ 'level': 'silent' }),
            'browser': Browsers['macOS']('Chrome'),
            'auth': {
                'creds': _0x104bc0['creds'],
                'keys': makeCacheableSignalKeyStore(_0x104bc0['keys'], _0x0_0x5d84da({ 'level': 'fatal' })['child']({ 'level': 'fatal' }))
            },
            'markOnlineOnConnect': !_0x452450,
            'generateHighQualityLinkPreview': !![],
            'syncFullHistory': ![],
            'getMessage': async _0x1f8928 => {
                const _0x55dbf8 = jidNormalizedUser(_0x1f8928['remoteJid']);
                const _0xa0ae09 = await _0x0_0x12f367['loadMessage'](_0x55dbf8, _0x1f8928['id']);
                return _0xa0ae09?.['message'] || '';
            },
            'msgRetryCounterCache': _0x22d795,
            'defaultQueryTimeoutMs': 0xea60,
            'connectTimeoutMs': 0xea60,
            'keepAliveIntervalMs': 0x2710
        });
        _0xb041ff['store'] = _0x0_0x12f367;
        const _0x4d29f8 = _0xb041ff['sendPresenceUpdate'];
        const _0x299b1d = _0xb041ff['readMessages'];
        const _0x477ea9 = _0xb041ff['sendReceipt'];
        _0xb041ff['sendPresenceUpdate'] = async function (..._0x2a38bc) {
            const _0x121519 = await _0x0_0x12f367['getSetting']('global', 'stealthMode');
            if (_0x121519 && _0x121519['enabled']) {
                printLog('info', '👻\x20Blocked\x20presence\x20update\x20(stealth\x20mode)');
                return;
            }
            return _0x4d29f8['apply'](this, _0x2a38bc);
        };
        _0xb041ff['readMessages'] = async function (..._0x465ebf) {
            const _0x24a356 = await _0x0_0x12f367['getSetting']('global', 'stealthMode');
            if (_0x24a356 && _0x24a356['enabled'])
                return;
            return _0x299b1d['apply'](this, _0x465ebf);
        };
        if (_0x477ea9) {
            _0xb041ff['sendReceipt'] = async function (..._0x3267be) {
                const _0x16d0bb = await _0x0_0x12f367['getSetting']('global', 'stealthMode');
                if (_0x16d0bb && _0x16d0bb['enabled'])
                    return;
                return _0x477ea9['apply'](this, _0x3267be);
            };
        }
        const _0x1c33c1 = _0xb041ff['query'];
        _0xb041ff['query'] = async function (_0x4b751b, ..._0x282096) {
            const _0x8bf07 = await _0x0_0x12f367['getSetting']('global', 'stealthMode');
            if (_0x8bf07 && _0x8bf07['enabled']) {
                if (_0x4b751b && _0x4b751b['tag'] === 'receipt')
                    return;
                if (_0x4b751b && _0x4b751b['attrs'] && (_0x4b751b['attrs']['type'] === 'read' || _0x4b751b['attrs']['type'] === 'read-self'))
                    return;
            }
            return _0x1c33c1['apply'](this, [
                _0x4b751b,
                ..._0x282096
            ]);
        };
        _0xb041ff['isGhostMode'] = async () => {
            const _0x47e62c = await _0x0_0x12f367['getSetting']('global', 'stealthMode');
            return _0x47e62c && _0x47e62c['enabled'];
        };
        _0xb041ff['ev']['on']('creds.update', _0xdd11e4);
        _0x0_0x12f367['bind'](_0xb041ff['ev']);
        _0xb041ff['ev']['on']('messages.upsert', async _0x778c55 => {
            try {
                const _0x16d6d2 = _0x778c55['messages'][0x0];
                if (!_0x16d6d2['message'])
                    return;
                _0x16d6d2['message'] = Object['keys'](_0x16d6d2['message'])[0x0] === 'ephemeralMessage' ? _0x16d6d2['message']['ephemeralMessage']['message'] : _0x16d6d2['message'];
                if (_0x16d6d2['key'] && _0x16d6d2['key']['remoteJid'] === 'status@broadcast') {
                    await handleStatus(_0xb041ff, _0x778c55);
                    return;
                }
                if (!_0xb041ff['public'] && !_0x16d6d2['key']['fromMe'] && _0x778c55['type'] === 'notify') {
                    const _0x5a4053 = _0x16d6d2['key']?.['remoteJid']?.['endsWith']('@g.us');
                    if (!_0x5a4053)
                        return;
                }
                if (_0x16d6d2['key']['id']['startsWith']('BAE5') && _0x16d6d2['key']['id']['length'] === 0x10)
                    return;
                if (_0xb041ff?.['msgRetryCounterCache']) {
                    _0xb041ff['msgRetryCounterCache']['clear']();
                }
                try {
                    await handleMessages(_0xb041ff, _0x778c55);
                } catch (_0x407200) {
                    printLog('error', 'Error\x20in\x20handleMessages:\x20' + _0x407200['message']);
                    if (_0x16d6d2['key'] && _0x16d6d2['key']['remoteJid']) {
                        await _0xb041ff['sendMessage'](_0x16d6d2['key']['remoteJid'], {
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
            } catch (_0x3d8963) {
                printLog('error', 'Error\x20in\x20messages.upsert:\x20' + _0x3d8963['message']);
            }
        });
        _0xb041ff['decodeJid'] = _0x28b7f7 => {
            if (!_0x28b7f7)
                return _0x28b7f7;
            if (/:\d+@/gi['test'](_0x28b7f7)) {
                const _0x4df2d9 = jidDecode(_0x28b7f7) || {};
                return _0x4df2d9['user'] && _0x4df2d9['server'] && _0x4df2d9['user'] + '@' + _0x4df2d9['server'] || _0x28b7f7;
            } else
                return _0x28b7f7;
        };
        _0xb041ff['ev']['on']('contacts.update', _0x199d5f => {
            for (const _0x8a8ff0 of _0x199d5f) {
                const _0x4d303a = _0xb041ff['decodeJid'](_0x8a8ff0['id']);
                if (_0x0_0x12f367 && _0x0_0x12f367['contacts'])
                    _0x0_0x12f367['contacts'][_0x4d303a] = {
                        'id': _0x4d303a,
                        'name': _0x8a8ff0['notify']
                    };
            }
        });
        _0xb041ff['getName'] = (_0x326105, _0x19853d = ![]) => {
            const _0x36c423 = _0xb041ff['decodeJid'](_0x326105);
            _0x19853d = _0xb041ff['withoutContact'] || _0x19853d;
            let _0x2a5c53;
            if (_0x36c423['endsWith']('@g.us'))
                return new Promise(async _0x5a33dd => {
                    _0x2a5c53 = _0x0_0x12f367['contacts'][_0x36c423] || {};
                    if (!(_0x2a5c53['name'] || _0x2a5c53['subject']))
                        _0x2a5c53 = _0xb041ff['groupMetadata'](_0x36c423) || {};
                    _0x5a33dd(_0x2a5c53['name'] || _0x2a5c53['subject'] || _0x0_0x22627b('+' + _0x36c423['replace']('@s.whatsapp.net', ''))['number']?.['international']);
                });
            else
                _0x2a5c53 = _0x36c423 === '0@s.whatsapp.net' ? {
                    'id': _0x36c423,
                    'name': 'WhatsApp'
                } : _0x36c423 === _0xb041ff['decodeJid'](_0xb041ff['user']['id']) ? _0xb041ff['user'] : _0x0_0x12f367['contacts'][_0x36c423] || {};
            return (_0x19853d ? '' : _0x2a5c53['name']) || _0x2a5c53['subject'] || _0x2a5c53['verifiedName'] || _0x0_0x22627b('+' + _0x326105['replace']('@s.whatsapp.net', ''))['number']?.['international'];
        };
        _0xb041ff['public'] = !![];
        _0xb041ff['serializeM'] = _0x2634c2 => smsg(_0xb041ff, _0x2634c2, _0x0_0x12f367);
        const _0x3b2bb4 = _0x104bc0['creds']?.['registered'] === !![];
        if (_0x3b2bb4) {
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
        _0xb041ff['ev']['on']('connection.update', async _0x5da1c7 => {
            const {
                connection: _0x51ce08,
                lastDisconnect: _0x54f78c,
                qr: _0x7107b7
            } = _0x5da1c7;
            if (_0x51ce08 === 'open') {
                printLog('success', 'Bot\x20connected\x20successfully!');
                try {
                    const _0x276d0a = await _0x0_0x12f367['getBotMode']();
                    const _0x706084 = process['uptime']();
                    const _0x342276 = Math['floor'](_0x706084 / 0xe10);
                    const _0x16e990 = Math['floor'](_0x706084 % 0xe10 / 0x3c);
                    const _0x530d86 = 'https://raw.githubusercontent.com/NOSTRA-DevOps/Nova-MD/refs/heads/main/assets/logo.PNG';
                    let _0x3e2188 = null;
                    try {
                        const _0x2ac3c5 = await fetch(_0x530d86);
                        if (_0x2ac3c5['ok']) {
                            const _0x3c2b36 = await _0x2ac3c5['arrayBuffer']();
                            _0x3e2188 = Buffer['from'](_0x3c2b36);
                        }
                    } catch (_0x555dc0) {
                        const _0x595fbe = _0x0_0x524145['join'](process['cwd'](), 'assets', 'logo.PNG');
                        if (_0x0_0x2efbad['existsSync'](_0x595fbe)) {
                            _0x3e2188 = _0x0_0x2efbad['readFileSync'](_0x595fbe);
                        }
                    }
                    let _0x28411b = '╭━━━━『\x20*' + (_0x0_0x1decc4['botName'] || 'NOVA-MD') + '*\x20』━━⬣\x0a';
                    _0x28411b += '┃\x0a';
                    _0x28411b += '┃\x20✨\x20*Status:*\x20✅\x20ONLINE\x0a';
                    _0x28411b += '┃\x20🤖\x20*Version:*\x20' + (_0x0_0x1decc4['version'] || '2.0.0') + '\x0a';
                    _0x28411b += '┃\x20⚙️\x20*Mode:*\x20' + _0x276d0a['toUpperCase']() + '\x0a';
                    _0x28411b += '┃\x20⏰\x20*Uptime:*\x20' + _0x342276 + 'h\x20' + _0x16e990 + 'm\x0a';
                    _0x28411b += '┃\x20📊\x20*Prefixes:*\x20' + _0x0_0x1decc4['prefixes']['join']('\x20') + '\x0a';
                    _0x28411b += '┃\x20📦\x20*Plugins:*\x20' + _0x0_0x55e87f['commands']['size'] + '\x0a';
                    _0x28411b += '┃\x20💾\x20*Storage:*\x20' + _0x0_0x12f367['getStats']()['backend']['toUpperCase']() + '\x0a';
                    _0x28411b += '┃\x0a';
                    _0x28411b += '┃━━━━━━━━━━━━━━━━━⬣\x0a';
                    _0x28411b += '┃\x0a';
                    _0x28411b += '┃\x20🌐\x20*JOIN\x20CHANNELS*\x0a';
                    _0x28411b += '┃\x0a';
                    _0x28411b += '┃\x20💬\x20*FaceBook:*\x0a';
                    _0x28411b += '┃\x20https://www.facebook.com/profile.php?id=61591828051151\x0a';
                    _0x28411b += '┃\x0a';
                    _0x28411b += '┃\x20📱\x20*Telegram:*\x0a';
                    _0x28411b += '┃\x20https://t.me/addlist/CpQzYQfWwwxmYTk0\x0a';
                    _0x28411b += '┃\x0a';
                    _0x28411b += '┃\x20▶️\x20*YouTube:*\x0a';
                    _0x28411b += '┃\x20https://youtube.com/@labokingfreesurf\x0a';
                    _0x28411b += '┃\x0a';
                    _0x28411b += '┃━━━━━━━━━━━━━━━━━⬣\x0a';
                    _0x28411b += '┃\x0a';
                    _0x28411b += '┃\x20✨\x20_Powered\x20by\x20NOSTRA._\x0a';
                    _0x28411b += '╰━━━━━━━━━━━━━━━━━⬣';
                    const _0x8b9e15 = _0xb041ff['user']['id']['split'](':')[0x0] + '@s.whatsapp.net';
                    if (_0x3e2188) {
                        await _0xb041ff['sendMessage'](_0x8b9e15, {
                            'image': _0x3e2188,
                            'caption': _0x28411b,
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
                        await _0xb041ff['sendMessage'](_0x8b9e15, {
                            'text': _0x28411b,
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
                } catch (_0x187e2e) {
                    printLog('error', 'Failed\x20to\x20send\x20automatic\x20about\x20message:\x20' + _0x187e2e['message']);
                }
                const _0x1b7deb = await _0x0_0x12f367['getSetting']('global', 'stealthMode');
                if (_0x1b7deb && _0x1b7deb['enabled']) {
                    printLog('info', '👻\x20STEALTH\x20MODE\x20ACTIVE');
                }
                printLog('success', 'Connected\x20to\x20=>\x20' + JSON['stringify'](_0xb041ff['user'], null, 0x2));
                await delay(0x7cf);
                try {
                    owner = JSON['parse'](_0x0_0x2efbad['readFileSync']('./data/owner.json', 'utf-8'));
                } catch (_0xa999a6) {
                }
                printLog('info', '[\x20' + (_0x0_0x1decc4['botName'] || 'NOVA-MD') + '\x20]');
                printLog('info', 'WA\x20NUMBER\x20\x20:\x20' + (owner[0x0] || _0x0_0x1decc4['ownerNumber'] || ''));
                printLog('success', 'Bot\x20Connected\x20Successfully!');
                printLog('info', 'Plugins\x20\x20\x20:\x20' + _0x0_0x55e87f['commands']['size']);
                printLog('info', 'Prefixes\x20\x20\x20:\x20' + _0x0_0x1decc4['prefixes']['join'](',\x20'));
                printLog('store', 'Backend\x20\x20\x20\x20:\x20' + _0x0_0x12f367['getStats']()['backend']);
                console['log']();
            }
            if (_0x51ce08 === 'close') {
                const _0x58feff = _0x54f78c?.['error']?.['output']?.['statusCode'];
                const _0x5ddffa = _0x58feff !== DisconnectReason['loggedOut'] && _0x58feff !== 0x191;
                if (_0x58feff === DisconnectReason['loggedOut'] || _0x58feff === 0x191) {
                    try {
                        rmSync('./session', {
                            'recursive': !![],
                            'force': !![]
                        });
                    } catch (_0x3d13e4) {
                    }
                    await delay(0xbb8);
                    startNovaXCode();
                    return;
                }
                if (_0x5ddffa) {
                    printLog('connection', 'Reconnecting\x20in\x205\x20seconds...');
                    await delay(0x1388);
                    startNovaXCode();
                }
            }
        });
        _0xb041ff['ev']['on']('call', async _0x4ead99 => {
            await handleCall(_0xb041ff, _0x4ead99);
        });
        _0xb041ff['ev']['on']('group-participants.update', async _0x1ade61 => {
            await handleGroupParticipantUpdate(_0xb041ff, _0x1ade61);
        });
        _0xb041ff['ev']['on']('status.update', async _0x2273da => {
            await handleStatus(_0xb041ff, _0x2273da);
        });
        _0xb041ff['ev']['on']('messages.reaction', async _0x34269b => {
            await handleStatus(_0xb041ff, _0x34269b);
        });
        return _0xb041ff;
    } catch (_0x548630) {
        printLog('error', 'Error\x20in\x20startNovaXCode:\x20' + _0x548630['message']);
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
    printLog('info', '📱\x20Open\x20http://localhost:' + (_0x0_0x1decc4['port'] || 0x1388) + '/pairing\x20in\x20your\x20browser\x20if\x20it\x27s\x20local');
    printLog('info', '📱\x20For\x20web\x20servic\x20deployment,\x20click\x20the\x20service\x20URL\x20and\x20add\x20/pairing\x20at\x20the\x20end');
    const _0x1af410 = 0x1e * 0x3c * 0x3e8;
    const _0x33f08e = Date['now']();
    const _0x17ef0b = 0xbb8;
    return new Promise((_0x576c35, _0xca854b) => {
        const _0x585aa2 = setInterval(() => {
            if (hasValidSession()) {
                clearInterval(_0x585aa2);
                printLog('success', '✅\x20Session\x20detected!\x20Starting\x20bot...');
                _0x576c35();
            }
            if (Date['now']() - _0x33f08e > _0x1af410) {
                clearInterval(_0x585aa2);
                _0xca854b(new Error('Session\x20creation\x20timeout\x20(30\x20minutes)'));
            }
        }, _0x17ef0b);
    });
}
async function main() {
    await compileAll();
    await _0x0_0x55e87f['loadCommands']();
    printLog('info', 'Starting\x20NOVA-MD\x20BOT...');
    if (hasValidSession()) {
        printLog('success', '✅\x20Valid\x20session\x20found,\x20starting\x20bot...');
        await delay(0xbb8);
        startNovaXCode()['catch'](_0x14db36 => {
            printLog('error', 'Fatal\x20error:\x20' + _0x14db36['message']);
            if (rl && !rlClosed)
                rl['close']();
            process['exit'](0x1);
        });
    } else {
        printLog('info', '🌐\x20No\x20session\x20found.\x20Launching\x20web\x20pairing\x20interface...');
        printLog('info', '📱\x20Open\x20http://localhost:' + (_0x0_0x1decc4['port'] || 0x1388) + '/pairing\x20in\x20your\x20browser\x20to\x20connect\x20WhatsApp');
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
            startNovaXCode()['catch'](_0x5a9c51 => {
                printLog('error', 'Fatal\x20error:\x20' + _0x5a9c51['message']);
                if (rl && !rlClosed)
                    rl['close']();
                process['exit'](0x1);
            });
        } catch (_0x407add) {
            printLog('error', 'Session\x20creation\x20failed:\x20' + _0x407add['message']);
            if (rl && !rlClosed)
                rl['close']();
            process['exit'](0x1);
        }
    }
}
main();
const sessionDir = _0x0_0x524145['join'](process['cwd'](), 'session');
setInterval(() => {
    if (!_0x0_0x2efbad['existsSync'](sessionDir))
        return;
    _0x0_0x2efbad['readdir'](sessionDir, (_0x42f060, _0x468b37) => {
        if (_0x42f060)
            return;
        for (const _0x207967 of _0x468b37) {
            if (_0x207967 === 'creds.json')
                continue;
            if (_0x207967['startsWith']('app-state-sync-key-'))
                continue;
            _0x0_0x2efbad['unlink'](_0x0_0x524145['join'](sessionDir, _0x207967), () => {
            });
        }
    });
}, 0x3 * 0x3c * 0x3e8);
const customTemp = _0x0_0x524145['join'](process['cwd'](), 'temp');
if (!_0x0_0x2efbad['existsSync'](customTemp))
    _0x0_0x2efbad['mkdirSync'](customTemp, { 'recursive': !![] });
process.env.TMPDIR = customTemp;
process.env.TEMP = customTemp;
process.env.TMP = customTemp;
setInterval(() => {
    _0x0_0x2efbad['readdir'](customTemp, (_0x3844f1, _0xc32d49) => {
        if (_0x3844f1)
            return;
        for (const _0x3eb610 of _0xc32d49) {
            const _0x40a3e0 = _0x0_0x524145['join'](customTemp, _0x3eb610);
            _0x0_0x2efbad['stat'](_0x40a3e0, (_0x2a8b50, _0x2b8c4f) => {
                if (!_0x2a8b50 && Date['now']() - _0x2b8c4f['mtimeMs'] > 0x3 * 0x3c * 0x3c * 0x3e8) {
                    _0x0_0x2efbad['unlink'](_0x40a3e0, () => {
                    });
                }
            });
        }
    });
}, 0x1 * 0x3c * 0x3c * 0x3e8);
const folders = [
    _0x0_0x524145['join'](__dirname, './lib'),
    _0x0_0x524145['join'](__dirname, './plugins')
];
folders['forEach'](_0x40ff7f => {
    if (!_0x0_0x2efbad['existsSync'](_0x40ff7f))
        return;
    _0x0_0x2efbad['readdirSync'](_0x40ff7f)['filter'](_0x49a306 => _0x49a306['endsWith']('.js'))['forEach'](_0x32b346 => {
        const _0x527c6e = _0x0_0x524145['join'](_0x40ff7f, _0x32b346);
        try {
            const _0xb5111a = _0x0_0x2efbad['readFileSync'](_0x527c6e, 'utf-8');
            const _0x15eab9 = _0x0_0x5c9324(_0xb5111a, _0x32b346, {
                'sourceType': 'module',
                'allowAwaitOutsideFunction': !![]
            });
            if (_0x15eab9) {
                console['error'](_0x0_0x108dac['red']('❌\x20Syntax\x20error\x20in\x20' + _0x527c6e + ':\x0a' + _0x15eab9));
            }
        } catch (_0x5602a1) {
            console['error'](_0x0_0x108dac['yellow']('⚠️\x20Cannot\x20read\x20file\x20' + _0x527c6e + ':\x0a' + _0x5602a1));
        }
    });
});
process['on']('uncaughtException', _0x138183 => {
    printLog('error', 'Uncaught\x20Exception:\x20' + _0x138183['message']);
    console['error'](_0x138183['stack']);
    writeErrorLog({
        'type': 'uncaughtException',
        'error': _0x138183['message'],
        'stack': _0x138183['stack'],
        'timestamp': new Date()['toISOString']()
    });
});
process['on']('unhandledRejection', _0x3fc418 => {
    printLog('error', 'Unhandled\x20Rejection:\x20' + _0x3fc418['message']);
    console['error'](_0x3fc418['stack']);
    writeErrorLog({
        'type': 'unhandledRejection',
        'error': _0x3fc418['message'],
        'stack': _0x3fc418['stack'],
        'timestamp': new Date()['toISOString']()
    });
});
server['on']('error', _0x58f9c6 => {
    if (_0x58f9c6['code'] === 'EADDRINUSE') {
        printLog('error', 'Address\x20localhost:' + PORT + '\x20in\x20use');
        writeErrorLog({
            'type': 'serverError',
            'error': 'Address\x20localhost:' + PORT + '\x20in\x20use',
            'timestamp': new Date()['toISOString']()
        });
        server['close']();
    } else {
        printLog('error', 'Server\x20error:\x20' + _0x58f9c6['message']);
        writeErrorLog({
            'type': 'serverError',
            'error': _0x58f9c6['message'],
            'stack': _0x58f9c6['stack'],
            'timestamp': new Date()['toISOString']()
        });
    }
});