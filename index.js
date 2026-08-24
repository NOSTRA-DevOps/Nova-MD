import 'dotenv/config';
import _0x0_0x2fd287, {
    existsSync,
    mkdirSync,
    rmSync
} from 'fs';
import _0x0_0x3f6909, { dirname } from 'path';
import _0x0_0x4b599e from 'chalk';
import _0x0_0x475ff6 from 'syntax-error';
import { parsePhoneNumber as _0x0_0x3554e8 } from 'awesome-phonenumber';
import _0x0_0x49c80f from 'readline';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { smsg } from './lib/myfunc.js';
import { compileAll } from './lib/compile.js';
import _0x0_0x1073e6, {
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    Browsers,
    jidDecode,
    jidNormalizedUser,
    makeCacheableSignalKeyStore,
    delay
} from '@whiskeysockets/baileys';
import _0x0_0x2b1259 from 'node-cache';
import _0x0_0x1a69bc from 'pino';
import _0x0_0x17afdf from './config.js';
import _0x0_0x5d3ef9 from './lib/lightweight_store.js';
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
import _0x0_0x1d85b0 from './lib/commandHandler.js';
import _0x0_0x54e4e5 from './lib/sessionManager.js';
_0x0_0x5d3ef9['readFromFile']();
setInterval(() => _0x0_0x5d3ef9['writeToFile'](), _0x0_0x17afdf['storeWriteInterval'] || 0x2710);
setInterval(() => {
    if (global['gc']) {
        global['gc']();
        console['log']('🧹\x20Garbage\x20collection\x20completed');
    }
}, 0xea60);
setInterval(() => {
    const _0xe9d20d = process['memoryUsage']()['rss'] / 0x400 / 0x400;
    if (_0xe9d20d > 0x190) {
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
_0x0_0x2fd287['mkdirSync']('./data', { 'recursive': !![] });
for (const [file, def] of Object['entries'](DATA_DEFAULTS)) {
    const fp = './data/' + file;
    if (!_0x0_0x2fd287['existsSync'](fp))
        _0x0_0x2fd287['writeFileSync'](fp, JSON['stringify'](def, null, 0x2));
}
let owner = [];
try {
    owner = JSON['parse'](_0x0_0x2fd287['readFileSync']('./data/owner.json', 'utf-8'));
} catch {
    owner = [];
}
global['botname'] = _0x0_0x17afdf['botName'] || 'NOVA-MD';
global['themeemoji'] = '•';
const pairingCode = ![];
const useMobile = process['argv']['includes']('--mobile');
let rl = null;
let rlClosed = ![];
if (process['stdin']['isTTY'] && !_0x0_0x17afdf['pairingNumber']) {
    rl = _0x0_0x49c80f['createInterface']({
        'input': process['stdin'],
        'output': process['stdout']
    });
    rl['on']('close', () => {
        rlClosed = !![];
    });
}
const question = _0x4ac9ca => {
    if (rl && !rlClosed) {
        return new Promise(_0x399f89 => rl['question'](_0x4ac9ca, _0x399f89));
    } else {
        return Promise['resolve'](_0x0_0x17afdf['ownerNumber'] || '237676250509');
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
    const _0x818518 = _0x0_0x3f6909['join'](__dirname, 'session');
    if (!existsSync(_0x818518)) {
        mkdirSync(_0x818518, { 'recursive': !![] });
    }
    return _0x818518;
}
function hasValidSession() {
    return _0x0_0x54e4e5['hasValidSession']();
}
server['listen'](PORT, () => {
    printLog('success', 'Server\x20listening\x20on\x20port\x20' + PORT);
    printLog('info', '🌐\x20Web\x20interface\x20available\x20at:\x20http://localhost:' + PORT + '/pairing');
});
async function startNovaXCode() {
    try {
        const {version: _0x357a11} = await fetchLatestBaileysVersion();
        ensureSessionDirectory();
        await delay(0x3e8);
        const {
            state: _0x5951b6,
            saveCreds: _0x53353c
        } = await useMultiFileAuthState('./session');
        const _0x46a3c9 = async () => {
            ensureSessionDirectory();
            await _0x53353c();
        };
        const _0x145ac3 = new _0x0_0x2b1259();
        const _0x4053d2 = await _0x0_0x5d3ef9['getSetting']('global', 'stealthMode');
        const _0x4cdbd3 = _0x4053d2 && _0x4053d2['enabled'];
        const _0x1acb8d = _0x0_0x1073e6({
            'version': _0x357a11,
            'logger': _0x0_0x1a69bc({ 'level': 'silent' }),
            'browser': Browsers['macOS']('Chrome'),
            'auth': {
                'creds': _0x5951b6['creds'],
                'keys': makeCacheableSignalKeyStore(_0x5951b6['keys'], _0x0_0x1a69bc({ 'level': 'fatal' })['child']({ 'level': 'fatal' }))
            },
            'markOnlineOnConnect': !_0x4cdbd3,
            'generateHighQualityLinkPreview': !![],
            'syncFullHistory': ![],
            'getMessage': async _0xc81ee6 => {
                const _0x36ba7c = jidNormalizedUser(_0xc81ee6['remoteJid']);
                const _0x21a5cd = await _0x0_0x5d3ef9['loadMessage'](_0x36ba7c, _0xc81ee6['id']);
                return _0x21a5cd?.['message'] || '';
            },
            'msgRetryCounterCache': _0x145ac3,
            'defaultQueryTimeoutMs': 0xea60,
            'connectTimeoutMs': 0xea60,
            'keepAliveIntervalMs': 0x2710
        });
        _0x1acb8d['store'] = _0x0_0x5d3ef9;
        const _0x207da1 = _0x1acb8d['sendPresenceUpdate'];
        const _0xc97f75 = _0x1acb8d['readMessages'];
        const _0x146c09 = _0x1acb8d['sendReceipt'];
        _0x1acb8d['sendPresenceUpdate'] = async function (..._0x57e633) {
            const _0x44d917 = await _0x0_0x5d3ef9['getSetting']('global', 'stealthMode');
            if (_0x44d917 && _0x44d917['enabled']) {
                printLog('info', '👻\x20Blocked\x20presence\x20update\x20(stealth\x20mode)');
                return;
            }
            return _0x207da1['apply'](this, _0x57e633);
        };
        _0x1acb8d['readMessages'] = async function (..._0x36a4fd) {
            const _0x12be08 = await _0x0_0x5d3ef9['getSetting']('global', 'stealthMode');
            if (_0x12be08 && _0x12be08['enabled'])
                return;
            return _0xc97f75['apply'](this, _0x36a4fd);
        };
        if (_0x146c09) {
            _0x1acb8d['sendReceipt'] = async function (..._0x361aed) {
                const _0x38ced4 = await _0x0_0x5d3ef9['getSetting']('global', 'stealthMode');
                if (_0x38ced4 && _0x38ced4['enabled'])
                    return;
                return _0x146c09['apply'](this, _0x361aed);
            };
        }
        const _0x1571b0 = _0x1acb8d['query'];
        _0x1acb8d['query'] = async function (_0x3a3f80, ..._0x22fdd3) {
            const _0x14de42 = await _0x0_0x5d3ef9['getSetting']('global', 'stealthMode');
            if (_0x14de42 && _0x14de42['enabled']) {
                if (_0x3a3f80 && _0x3a3f80['tag'] === 'receipt')
                    return;
                if (_0x3a3f80 && _0x3a3f80['attrs'] && (_0x3a3f80['attrs']['type'] === 'read' || _0x3a3f80['attrs']['type'] === 'read-self'))
                    return;
            }
            return _0x1571b0['apply'](this, [
                _0x3a3f80,
                ..._0x22fdd3
            ]);
        };
        _0x1acb8d['isGhostMode'] = async () => {
            const _0x1202a7 = await _0x0_0x5d3ef9['getSetting']('global', 'stealthMode');
            return _0x1202a7 && _0x1202a7['enabled'];
        };
        _0x1acb8d['ev']['on']('creds.update', _0x46a3c9);
        _0x0_0x5d3ef9['bind'](_0x1acb8d['ev']);
        _0x1acb8d['ev']['on']('messages.upsert', async _0x17a61b => {
            try {
                const _0x7a74c = _0x17a61b['messages'][0x0];
                if (!_0x7a74c['message'])
                    return;
                _0x7a74c['message'] = Object['keys'](_0x7a74c['message'])[0x0] === 'ephemeralMessage' ? _0x7a74c['message']['ephemeralMessage']['message'] : _0x7a74c['message'];
                if (_0x7a74c['key'] && _0x7a74c['key']['remoteJid'] === 'status@broadcast') {
                    await handleStatus(_0x1acb8d, _0x17a61b);
                    return;
                }
                if (!_0x1acb8d['public'] && !_0x7a74c['key']['fromMe'] && _0x17a61b['type'] === 'notify') {
                    const _0x415a9f = _0x7a74c['key']?.['remoteJid']?.['endsWith']('@g.us');
                    if (!_0x415a9f)
                        return;
                }
                if (_0x7a74c['key']['id']['startsWith']('BAE5') && _0x7a74c['key']['id']['length'] === 0x10)
                    return;
                if (_0x1acb8d?.['msgRetryCounterCache']) {
                    _0x1acb8d['msgRetryCounterCache']['clear']();
                }
                try {
                    await handleMessages(_0x1acb8d, _0x17a61b);
                } catch (_0x53a1c9) {
                    printLog('error', 'Error\x20in\x20handleMessages:\x20' + _0x53a1c9['message']);
                    if (_0x7a74c['key'] && _0x7a74c['key']['remoteJid']) {
                        await _0x1acb8d['sendMessage'](_0x7a74c['key']['remoteJid'], {
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
            } catch (_0x2ef99d) {
                printLog('error', 'Error\x20in\x20messages.upsert:\x20' + _0x2ef99d['message']);
            }
        });
        _0x1acb8d['decodeJid'] = _0x47a1c0 => {
            if (!_0x47a1c0)
                return _0x47a1c0;
            if (/:\d+@/gi['test'](_0x47a1c0)) {
                const _0x270cf6 = jidDecode(_0x47a1c0) || {};
                return _0x270cf6['user'] && _0x270cf6['server'] && _0x270cf6['user'] + '@' + _0x270cf6['server'] || _0x47a1c0;
            } else
                return _0x47a1c0;
        };
        _0x1acb8d['ev']['on']('contacts.update', _0x4e1fd7 => {
            for (const _0x3088d3 of _0x4e1fd7) {
                const _0x5796a7 = _0x1acb8d['decodeJid'](_0x3088d3['id']);
                if (_0x0_0x5d3ef9 && _0x0_0x5d3ef9['contacts'])
                    _0x0_0x5d3ef9['contacts'][_0x5796a7] = {
                        'id': _0x5796a7,
                        'name': _0x3088d3['notify']
                    };
            }
        });
        _0x1acb8d['getName'] = (_0x2457b9, _0x4e1dce = ![]) => {
            const _0x13230a = _0x1acb8d['decodeJid'](_0x2457b9);
            _0x4e1dce = _0x1acb8d['withoutContact'] || _0x4e1dce;
            let _0x134337;
            if (_0x13230a['endsWith']('@g.us'))
                return new Promise(async _0x31c900 => {
                    _0x134337 = _0x0_0x5d3ef9['contacts'][_0x13230a] || {};
                    if (!(_0x134337['name'] || _0x134337['subject']))
                        _0x134337 = _0x1acb8d['groupMetadata'](_0x13230a) || {};
                    _0x31c900(_0x134337['name'] || _0x134337['subject'] || _0x0_0x3554e8('+' + _0x13230a['replace']('@s.whatsapp.net', ''))['number']?.['international']);
                });
            else
                _0x134337 = _0x13230a === '0@s.whatsapp.net' ? {
                    'id': _0x13230a,
                    'name': 'WhatsApp'
                } : _0x13230a === _0x1acb8d['decodeJid'](_0x1acb8d['user']['id']) ? _0x1acb8d['user'] : _0x0_0x5d3ef9['contacts'][_0x13230a] || {};
            return (_0x4e1dce ? '' : _0x134337['name']) || _0x134337['subject'] || _0x134337['verifiedName'] || _0x0_0x3554e8('+' + _0x2457b9['replace']('@s.whatsapp.net', ''))['number']?.['international'];
        };
        _0x1acb8d['public'] = !![];
        _0x1acb8d['serializeM'] = _0x36d7ee => smsg(_0x1acb8d, _0x36d7ee, _0x0_0x5d3ef9);
        const _0x309170 = _0x5951b6['creds']?.['registered'] === !![];
        if (_0x309170) {
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
        _0x1acb8d['ev']['on']('connection.update', async _0x54142f => {
            const {
                connection: _0x5f14f6,
                lastDisconnect: _0x14f50c,
                qr: _0x1ec179
            } = _0x54142f;
            if (_0x5f14f6 === 'open') {
                printLog('success', 'Bot\x20connected\x20successfully!');
                try {
                    const _0x4e820e = await _0x0_0x5d3ef9['getBotMode']();
                    const _0x17901c = process['uptime']();
                    const _0x54de3b = Math['floor'](_0x17901c / 0xe10);
                    const _0x46cdaa = Math['floor'](_0x17901c % 0xe10 / 0x3c);
                    const _0x408da2 = 'https://raw.githubusercontent.com/NOSTRA-DevOps/Nova-MD/refs/heads/main/assets/logo.PNG';
                    let _0x133f49 = null;
                    try {
                        const _0xbaf2fb = await fetch(_0x408da2);
                        if (_0xbaf2fb['ok']) {
                            const _0xa45ae0 = await _0xbaf2fb['arrayBuffer']();
                            _0x133f49 = Buffer['from'](_0xa45ae0);
                        }
                    } catch (_0x19901e) {
                        const _0x5579ea = _0x0_0x3f6909['join'](process['cwd'](), 'assets', 'logo.PNG');
                        if (_0x0_0x2fd287['existsSync'](_0x5579ea)) {
                            _0x133f49 = _0x0_0x2fd287['readFileSync'](_0x5579ea);
                        }
                    }
                    let _0x1ddc5b = '╭━━━━『\x20*' + (_0x0_0x17afdf['botName'] || 'NOVA-MD') + '\x20INFO*\x20』━━━⬣\x0a';
                    _0x1ddc5b += '┃\x0a';
                    _0x1ddc5b += '┃\x20✨\x20*Status:*\x20✅\x20ONLINE\x0a';
                    _0x1ddc5b += '┃\x20🤖\x20*Version:*\x20' + (_0x0_0x17afdf['version'] || '2.5.0') + '\x20(Stable)\x0a';
                    _0x1ddc5b += '┃\x20⚙️\x20*Mode:*\x20' + _0x4e820e['toUpperCase']() + '\x0a';
                    _0x1ddc5b += '┃\x20⏰\x20*Uptime:*\x20' + _0x54de3b + 'h\x20' + _0x46cdaa + 'm\x0a';
                    _0x1ddc5b += '┃\x20📊\x20*Prefixes:*\x20' + _0x0_0x17afdf['prefixes']['join']('\x20') + '\x0a';
                    _0x1ddc5b += '┃\x20📦\x20*Plugins:*\x20' + _0x0_0x1d85b0['commands']['size'] + '\x0a';
                    _0x1ddc5b += '┃\x20💾\x20*Storage:*\x20' + _0x0_0x5d3ef9['getStats']()['backend']['toUpperCase']() + '\x0a';
                    _0x1ddc5b += '┃\x0a';
                    _0x1ddc5b += '┃━━━━━━━━━━━━━━━━━━⬣\x0a';
                    _0x1ddc5b += '┃\x0a';
                    _0x1ddc5b += '┃\x20🌐\x20*JOIN\x20CHANNELS*\x0a';
                    _0x1ddc5b += '┃\x0a';
                    _0x1ddc5b += '┃\x20💬\x20*FaceBook:*\x0a';
                    _0x1ddc5b += '┃\x20https://www.facebook.com/profile.php?id=61591828051151\x0a';
                    _0x1ddc5b += '┃\x0a';
                    _0x1ddc5b += '┃\x20📱\x20*Telegram:*\x0a';
                    _0x1ddc5b += '┃\x20https://t.me/addlist/CpQzYQfWwwxmYTk0\x0a';
                    _0x1ddc5b += '┃\x0a';
                    _0x1ddc5b += '┃\x20▶️\x20*YouTube:*\x0a';
                    _0x1ddc5b += '┃\x20https://youtube.com/@labokingfreesurf\x0a';
                    _0x1ddc5b += '┃\x0a';
                    _0x1ddc5b += '┃━━━━━━━━━━━━━━━━━━⬣\x0a';
                    _0x1ddc5b += '┃\x0a';
                    _0x1ddc5b += '┃\x20✨\x20_Powered\x20by\x20NOSTRA._\x0a';
                    _0x1ddc5b += '╰━━━━━━━━━━━━━━━━━━⬣';
                    const _0x45ec57 = _0x1acb8d['user']['id']['split'](':')[0x0] + '@s.whatsapp.net';
                    if (_0x133f49) {
                        await _0x1acb8d['sendMessage'](_0x45ec57, {
                            'image': _0x133f49,
                            'caption': _0x1ddc5b,
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
                        await _0x1acb8d['sendMessage'](_0x45ec57, {
                            'text': _0x1ddc5b,
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
                } catch (_0x202d6d) {
                    printLog('error', 'Failed\x20to\x20send\x20automatic\x20about\x20message:\x20' + _0x202d6d['message']);
                }
                const _0x53e6dc = await _0x0_0x5d3ef9['getSetting']('global', 'stealthMode');
                if (_0x53e6dc && _0x53e6dc['enabled']) {
                    printLog('info', '👻\x20STEALTH\x20MODE\x20ACTIVE');
                }
                printLog('success', 'Connected\x20to\x20=>\x20' + JSON['stringify'](_0x1acb8d['user'], null, 0x2));
                await delay(0x7cf);
                try {
                    owner = JSON['parse'](_0x0_0x2fd287['readFileSync']('./data/owner.json', 'utf-8'));
                } catch (_0x464342) {
                }
                printLog('info', '[\x20' + (_0x0_0x17afdf['botName'] || 'NOVA-MD') + '\x20]');
                printLog('info', 'WA\x20NUMBER\x20\x20:\x20' + (owner[0x0] || _0x0_0x17afdf['ownerNumber'] || ''));
                printLog('success', 'Bot\x20Connected\x20Successfully!');
                printLog('info', 'Plugins\x20\x20\x20:\x20' + _0x0_0x1d85b0['commands']['size']);
                printLog('info', 'Prefixes\x20\x20\x20:\x20' + _0x0_0x17afdf['prefixes']['join'](',\x20'));
                printLog('store', 'Backend\x20\x20\x20\x20:\x20' + _0x0_0x5d3ef9['getStats']()['backend']);
                console['log']();
            }
            if (_0x5f14f6 === 'close') {
                const _0x3310a2 = _0x14f50c?.['error']?.['output']?.['statusCode'];
                const _0x151133 = _0x3310a2 !== DisconnectReason['loggedOut'] && _0x3310a2 !== 0x191;
                if (_0x3310a2 === DisconnectReason['loggedOut'] || _0x3310a2 === 0x191) {
                    try {
                        rmSync('./session', {
                            'recursive': !![],
                            'force': !![]
                        });
                    } catch (_0x3d93e2) {
                    }
                    await delay(0xbb8);
                    startNovaXCode();
                    return;
                }
                if (_0x151133) {
                    printLog('connection', 'Reconnecting\x20in\x205\x20seconds...');
                    await delay(0x1388);
                    startNovaXCode();
                }
            }
        });
        _0x1acb8d['ev']['on']('call', async _0x32be6d => {
            await handleCall(_0x1acb8d, _0x32be6d);
        });
        _0x1acb8d['ev']['on']('group-participants.update', async _0x24b8cb => {
            await handleGroupParticipantUpdate(_0x1acb8d, _0x24b8cb);
        });
        _0x1acb8d['ev']['on']('status.update', async _0x59c0e7 => {
            await handleStatus(_0x1acb8d, _0x59c0e7);
        });
        _0x1acb8d['ev']['on']('messages.reaction', async _0x18886a => {
            await handleStatus(_0x1acb8d, _0x18886a);
        });
        return _0x1acb8d;
    } catch (_0x32efb0) {
        printLog('error', 'Error\x20in\x20startNovaXCode:\x20' + _0x32efb0['message']);
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
    printLog('info', '📱\x20Open\x20http://localhost:' + (_0x0_0x17afdf['port'] || 0x1388) + '/pairing\x20in\x20your\x20browser\x20if\x20it\x27s\x20local');
    printLog('info', '📱\x20For\x20web\x20servic\x20deployment,\x20click\x20the\x20service\x20URL\x20and\x20add\x20/pairing\x20at\x20the\x20end');
    const _0x1d7adf = 0x1e * 0x3c * 0x3e8;
    const _0x485287 = Date['now']();
    const _0x644cd9 = 0xbb8;
    return new Promise((_0x393ae3, _0x3e47b3) => {
        const _0x473d68 = setInterval(() => {
            if (hasValidSession()) {
                clearInterval(_0x473d68);
                printLog('success', '✅\x20Session\x20detected!\x20Starting\x20bot...');
                _0x393ae3();
            }
            if (Date['now']() - _0x485287 > _0x1d7adf) {
                clearInterval(_0x473d68);
                _0x3e47b3(new Error('Session\x20creation\x20timeout\x20(30\x20minutes)'));
            }
        }, _0x644cd9);
    });
}
async function main() {
    await compileAll();
    await _0x0_0x1d85b0['loadCommands']();
    printLog('info', 'Starting\x20NOVA-MD\x20BOT...');
    if (hasValidSession()) {
        printLog('success', '✅\x20Valid\x20session\x20found,\x20starting\x20bot...');
        await delay(0xbb8);
        startNovaXCode()['catch'](_0x475393 => {
            printLog('error', 'Fatal\x20error:\x20' + _0x475393['message']);
            if (rl && !rlClosed)
                rl['close']();
            process['exit'](0x1);
        });
    } else {
        printLog('info', '🌐\x20No\x20session\x20found.\x20Launching\x20web\x20pairing\x20interface...');
        printLog('info', '📱\x20Open\x20http://localhost:' + (_0x0_0x17afdf['port'] || 0x1388) + '/pairing\x20in\x20your\x20browser\x20to\x20connect\x20WhatsApp');
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
            startNovaXCode()['catch'](_0x55a176 => {
                printLog('error', 'Fatal\x20error:\x20' + _0x55a176['message']);
                if (rl && !rlClosed)
                    rl['close']();
                process['exit'](0x1);
            });
        } catch (_0x2506f5) {
            printLog('error', 'Session\x20creation\x20failed:\x20' + _0x2506f5['message']);
            if (rl && !rlClosed)
                rl['close']();
            process['exit'](0x1);
        }
    }
}
main();
const sessionDir = _0x0_0x3f6909['join'](process['cwd'](), 'session');
setInterval(() => {
    if (!_0x0_0x2fd287['existsSync'](sessionDir))
        return;
    _0x0_0x2fd287['readdir'](sessionDir, (_0x39c944, _0x19c8ac) => {
        if (_0x39c944)
            return;
        for (const _0x47925c of _0x19c8ac) {
            if (_0x47925c === 'creds.json')
                continue;
            if (_0x47925c['startsWith']('app-state-sync-key-'))
                continue;
            _0x0_0x2fd287['unlink'](_0x0_0x3f6909['join'](sessionDir, _0x47925c), () => {
            });
        }
    });
}, 0x3 * 0x3c * 0x3e8);
const customTemp = _0x0_0x3f6909['join'](process['cwd'](), 'temp');
if (!_0x0_0x2fd287['existsSync'](customTemp))
    _0x0_0x2fd287['mkdirSync'](customTemp, { 'recursive': !![] });
process.env.TMPDIR = customTemp;
process.env.TEMP = customTemp;
process.env.TMP = customTemp;
setInterval(() => {
    _0x0_0x2fd287['readdir'](customTemp, (_0x2e2f52, _0x3911a8) => {
        if (_0x2e2f52)
            return;
        for (const _0x3bb51e of _0x3911a8) {
            const _0x5db324 = _0x0_0x3f6909['join'](customTemp, _0x3bb51e);
            _0x0_0x2fd287['stat'](_0x5db324, (_0x4c677d, _0x4d9906) => {
                if (!_0x4c677d && Date['now']() - _0x4d9906['mtimeMs'] > 0x3 * 0x3c * 0x3c * 0x3e8) {
                    _0x0_0x2fd287['unlink'](_0x5db324, () => {
                    });
                }
            });
        }
    });
}, 0x1 * 0x3c * 0x3c * 0x3e8);
const folders = [
    _0x0_0x3f6909['join'](__dirname, './lib'),
    _0x0_0x3f6909['join'](__dirname, './plugins')
];
folders['forEach'](_0x23769c => {
    if (!_0x0_0x2fd287['existsSync'](_0x23769c))
        return;
    _0x0_0x2fd287['readdirSync'](_0x23769c)['filter'](_0x527c3b => _0x527c3b['endsWith']('.js'))['forEach'](_0x1f6944 => {
        const _0xe1f435 = _0x0_0x3f6909['join'](_0x23769c, _0x1f6944);
        try {
            const _0x1a7b4e = _0x0_0x2fd287['readFileSync'](_0xe1f435, 'utf-8');
            const _0x56d0b9 = _0x0_0x475ff6(_0x1a7b4e, _0x1f6944, {
                'sourceType': 'module',
                'allowAwaitOutsideFunction': !![]
            });
            if (_0x56d0b9) {
                console['error'](_0x0_0x4b599e['red']('❌\x20Syntax\x20error\x20in\x20' + _0xe1f435 + ':\x0a' + _0x56d0b9));
            }
        } catch (_0x13ecb4) {
            console['error'](_0x0_0x4b599e['yellow']('⚠️\x20Cannot\x20read\x20file\x20' + _0xe1f435 + ':\x0a' + _0x13ecb4));
        }
    });
});
process['on']('uncaughtException', _0x59299c => {
    printLog('error', 'Uncaught\x20Exception:\x20' + _0x59299c['message']);
    console['error'](_0x59299c['stack']);
    writeErrorLog({
        'type': 'uncaughtException',
        'error': _0x59299c['message'],
        'stack': _0x59299c['stack'],
        'timestamp': new Date()['toISOString']()
    });
});
process['on']('unhandledRejection', _0xebc897 => {
    printLog('error', 'Unhandled\x20Rejection:\x20' + _0xebc897['message']);
    console['error'](_0xebc897['stack']);
    writeErrorLog({
        'type': 'unhandledRejection',
        'error': _0xebc897['message'],
        'stack': _0xebc897['stack'],
        'timestamp': new Date()['toISOString']()
    });
});
server['on']('error', _0x1ff36a => {
    if (_0x1ff36a['code'] === 'EADDRINUSE') {
        printLog('error', 'Address\x20localhost:' + PORT + '\x20in\x20use');
        writeErrorLog({
            'type': 'serverError',
            'error': 'Address\x20localhost:' + PORT + '\x20in\x20use',
            'timestamp': new Date()['toISOString']()
        });
        server['close']();
    } else {
        printLog('error', 'Server\x20error:\x20' + _0x1ff36a['message']);
        writeErrorLog({
            'type': 'serverError',
            'error': _0x1ff36a['message'],
            'stack': _0x1ff36a['stack'],
            'timestamp': new Date()['toISOString']()
        });
    }
});