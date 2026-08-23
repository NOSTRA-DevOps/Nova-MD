import 'dotenv/config';
import _0x0_0x1fb74c, {
    existsSync,
    mkdirSync,
    rmSync
} from 'fs';
import _0x0_0x2d449c, { dirname } from 'path';
import _0x0_0x27f15d from 'chalk';
import _0x0_0x186526 from 'syntax-error';
import { parsePhoneNumber as _0x0_0x232689 } from 'awesome-phonenumber';
import _0x0_0x13f4aa from 'readline';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { smsg } from './lib/myfunc.js';
import { compileAll } from './lib/compile.js';
import _0x0_0x303fbd, {
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    Browsers,
    jidDecode,
    jidNormalizedUser,
    makeCacheableSignalKeyStore,
    delay
} from '@whiskeysockets/baileys';
import _0x0_0x309754 from 'node-cache';
import _0x0_0x2537a7 from 'pino';
import _0x0_0x22be26 from './config.js';
import _0x0_0x82879e from './lib/lightweight_store.js';
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
import _0x0_0x5581c6 from './lib/commandHandler.js';
import _0x0_0x549403 from './lib/sessionManager.js';
_0x0_0x82879e['readFromFile']();
setInterval(() => _0x0_0x82879e['writeToFile'](), _0x0_0x22be26['storeWriteInterval'] || 0x2710);
setInterval(() => {
    if (global['gc']) {
        global['gc']();
        console['log']('🧹\x20Garbage\x20collection\x20completed');
    }
}, 0xea60);
setInterval(() => {
    const _0x2af6e1 = process['memoryUsage']()['rss'] / 0x400 / 0x400;
    if (_0x2af6e1 > 0x190) {
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
_0x0_0x1fb74c['mkdirSync']('./data', { 'recursive': !![] });
for (const [file, def] of Object['entries'](DATA_DEFAULTS)) {
    const fp = './data/' + file;
    if (!_0x0_0x1fb74c['existsSync'](fp))
        _0x0_0x1fb74c['writeFileSync'](fp, JSON['stringify'](def, null, 0x2));
}
let owner = [];
try {
    owner = JSON['parse'](_0x0_0x1fb74c['readFileSync']('./data/owner.json', 'utf-8'));
} catch {
    owner = [];
}
global['botname'] = _0x0_0x22be26['botName'] || 'NOVA-MD';
global['themeemoji'] = '•';
const pairingCode = ![];
const useMobile = process['argv']['includes']('--mobile');
let rl = null;
let rlClosed = ![];
if (process['stdin']['isTTY'] && !_0x0_0x22be26['pairingNumber']) {
    rl = _0x0_0x13f4aa['createInterface']({
        'input': process['stdin'],
        'output': process['stdout']
    });
    rl['on']('close', () => {
        rlClosed = !![];
    });
}
const question = _0x5f3e81 => {
    if (rl && !rlClosed) {
        return new Promise(_0x28e289 => rl['question'](_0x5f3e81, _0x28e289));
    } else {
        return Promise['resolve'](_0x0_0x22be26['ownerNumber'] || '237676250509');
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
    const _0x54fa7a = _0x0_0x2d449c['join'](__dirname, 'session');
    if (!existsSync(_0x54fa7a)) {
        mkdirSync(_0x54fa7a, { 'recursive': !![] });
    }
    return _0x54fa7a;
}
function hasValidSession() {
    return _0x0_0x549403['hasValidSession']();
}
server['listen'](PORT, () => {
    printLog('success', 'Server\x20listening\x20on\x20port\x20' + PORT);
    printLog('info', '🌐\x20Web\x20interface\x20available\x20at:\x20http://localhost:' + PORT + '/pairing');
});
async function startNovaXCode() {
    try {
        const {version: _0x50aa8c} = await fetchLatestBaileysVersion();
        ensureSessionDirectory();
        await delay(0x3e8);
        const {
            state: _0x5dc988,
            saveCreds: _0x20ab40
        } = await useMultiFileAuthState('./session');
        const _0x297d1e = async () => {
            ensureSessionDirectory();
            await _0x20ab40();
        };
        const _0x18d7e1 = new _0x0_0x309754();
        const _0x53658b = await _0x0_0x82879e['getSetting']('global', 'stealthMode');
        const _0x507cfa = _0x53658b && _0x53658b['enabled'];
        const _0x3e0bdb = _0x0_0x303fbd({
            'version': _0x50aa8c,
            'logger': _0x0_0x2537a7({ 'level': 'silent' }),
            'browser': Browsers['macOS']('Chrome'),
            'auth': {
                'creds': _0x5dc988['creds'],
                'keys': makeCacheableSignalKeyStore(_0x5dc988['keys'], _0x0_0x2537a7({ 'level': 'fatal' })['child']({ 'level': 'fatal' }))
            },
            'markOnlineOnConnect': !_0x507cfa,
            'generateHighQualityLinkPreview': !![],
            'syncFullHistory': ![],
            'getMessage': async _0x3cf8e4 => {
                const _0x3ac934 = jidNormalizedUser(_0x3cf8e4['remoteJid']);
                const _0x30236c = await _0x0_0x82879e['loadMessage'](_0x3ac934, _0x3cf8e4['id']);
                return _0x30236c?.['message'] || '';
            },
            'msgRetryCounterCache': _0x18d7e1,
            'defaultQueryTimeoutMs': 0xea60,
            'connectTimeoutMs': 0xea60,
            'keepAliveIntervalMs': 0x2710
        });
        _0x3e0bdb['store'] = _0x0_0x82879e;
        const _0x2ca9de = _0x3e0bdb['sendPresenceUpdate'];
        const _0x4e1856 = _0x3e0bdb['readMessages'];
        const _0x3d0ff2 = _0x3e0bdb['sendReceipt'];
        _0x3e0bdb['sendPresenceUpdate'] = async function (..._0x42e7e4) {
            const _0x2c625e = await _0x0_0x82879e['getSetting']('global', 'stealthMode');
            if (_0x2c625e && _0x2c625e['enabled']) {
                printLog('info', '👻\x20Blocked\x20presence\x20update\x20(stealth\x20mode)');
                return;
            }
            return _0x2ca9de['apply'](this, _0x42e7e4);
        };
        _0x3e0bdb['readMessages'] = async function (..._0x2f41c4) {
            const _0x2dc418 = await _0x0_0x82879e['getSetting']('global', 'stealthMode');
            if (_0x2dc418 && _0x2dc418['enabled'])
                return;
            return _0x4e1856['apply'](this, _0x2f41c4);
        };
        if (_0x3d0ff2) {
            _0x3e0bdb['sendReceipt'] = async function (..._0x1b7fc7) {
                const _0x56215c = await _0x0_0x82879e['getSetting']('global', 'stealthMode');
                if (_0x56215c && _0x56215c['enabled'])
                    return;
                return _0x3d0ff2['apply'](this, _0x1b7fc7);
            };
        }
        const _0x475956 = _0x3e0bdb['query'];
        _0x3e0bdb['query'] = async function (_0x75148f, ..._0xfe2367) {
            const _0xe9e31a = await _0x0_0x82879e['getSetting']('global', 'stealthMode');
            if (_0xe9e31a && _0xe9e31a['enabled']) {
                if (_0x75148f && _0x75148f['tag'] === 'receipt')
                    return;
                if (_0x75148f && _0x75148f['attrs'] && (_0x75148f['attrs']['type'] === 'read' || _0x75148f['attrs']['type'] === 'read-self'))
                    return;
            }
            return _0x475956['apply'](this, [
                _0x75148f,
                ..._0xfe2367
            ]);
        };
        _0x3e0bdb['isGhostMode'] = async () => {
            const _0x15dd08 = await _0x0_0x82879e['getSetting']('global', 'stealthMode');
            return _0x15dd08 && _0x15dd08['enabled'];
        };
        _0x3e0bdb['ev']['on']('creds.update', _0x297d1e);
        _0x0_0x82879e['bind'](_0x3e0bdb['ev']);
        _0x3e0bdb['ev']['on']('messages.upsert', async _0x48c10a => {
            try {
                const _0x4e106f = _0x48c10a['messages'][0x0];
                if (!_0x4e106f['message'])
                    return;
                _0x4e106f['message'] = Object['keys'](_0x4e106f['message'])[0x0] === 'ephemeralMessage' ? _0x4e106f['message']['ephemeralMessage']['message'] : _0x4e106f['message'];
                if (_0x4e106f['key'] && _0x4e106f['key']['remoteJid'] === 'status@broadcast') {
                    await handleStatus(_0x3e0bdb, _0x48c10a);
                    return;
                }
                if (!_0x3e0bdb['public'] && !_0x4e106f['key']['fromMe'] && _0x48c10a['type'] === 'notify') {
                    const _0x2f589d = _0x4e106f['key']?.['remoteJid']?.['endsWith']('@g.us');
                    if (!_0x2f589d)
                        return;
                }
                if (_0x4e106f['key']['id']['startsWith']('BAE5') && _0x4e106f['key']['id']['length'] === 0x10)
                    return;
                if (_0x3e0bdb?.['msgRetryCounterCache']) {
                    _0x3e0bdb['msgRetryCounterCache']['clear']();
                }
                try {
                    await handleMessages(_0x3e0bdb, _0x48c10a);
                } catch (_0xe84d37) {
                    printLog('error', 'Error\x20in\x20handleMessages:\x20' + _0xe84d37['message']);
                    if (_0x4e106f['key'] && _0x4e106f['key']['remoteJid']) {
                        await _0x3e0bdb['sendMessage'](_0x4e106f['key']['remoteJid'], {
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
            } catch (_0x292e6f) {
                printLog('error', 'Error\x20in\x20messages.upsert:\x20' + _0x292e6f['message']);
            }
        });
        _0x3e0bdb['decodeJid'] = _0x1832f4 => {
            if (!_0x1832f4)
                return _0x1832f4;
            if (/:\d+@/gi['test'](_0x1832f4)) {
                const _0xc6c243 = jidDecode(_0x1832f4) || {};
                return _0xc6c243['user'] && _0xc6c243['server'] && _0xc6c243['user'] + '@' + _0xc6c243['server'] || _0x1832f4;
            } else
                return _0x1832f4;
        };
        _0x3e0bdb['ev']['on']('contacts.update', _0x223912 => {
            for (const _0x505222 of _0x223912) {
                const _0x1211b3 = _0x3e0bdb['decodeJid'](_0x505222['id']);
                if (_0x0_0x82879e && _0x0_0x82879e['contacts'])
                    _0x0_0x82879e['contacts'][_0x1211b3] = {
                        'id': _0x1211b3,
                        'name': _0x505222['notify']
                    };
            }
        });
        _0x3e0bdb['getName'] = (_0xf90579, _0x1e8089 = ![]) => {
            const _0x58c3cc = _0x3e0bdb['decodeJid'](_0xf90579);
            _0x1e8089 = _0x3e0bdb['withoutContact'] || _0x1e8089;
            let _0x26dc59;
            if (_0x58c3cc['endsWith']('@g.us'))
                return new Promise(async _0x8f6498 => {
                    _0x26dc59 = _0x0_0x82879e['contacts'][_0x58c3cc] || {};
                    if (!(_0x26dc59['name'] || _0x26dc59['subject']))
                        _0x26dc59 = _0x3e0bdb['groupMetadata'](_0x58c3cc) || {};
                    _0x8f6498(_0x26dc59['name'] || _0x26dc59['subject'] || _0x0_0x232689('+' + _0x58c3cc['replace']('@s.whatsapp.net', ''))['number']?.['international']);
                });
            else
                _0x26dc59 = _0x58c3cc === '0@s.whatsapp.net' ? {
                    'id': _0x58c3cc,
                    'name': 'WhatsApp'
                } : _0x58c3cc === _0x3e0bdb['decodeJid'](_0x3e0bdb['user']['id']) ? _0x3e0bdb['user'] : _0x0_0x82879e['contacts'][_0x58c3cc] || {};
            return (_0x1e8089 ? '' : _0x26dc59['name']) || _0x26dc59['subject'] || _0x26dc59['verifiedName'] || _0x0_0x232689('+' + _0xf90579['replace']('@s.whatsapp.net', ''))['number']?.['international'];
        };
        _0x3e0bdb['public'] = !![];
        _0x3e0bdb['serializeM'] = _0x5bf7d4 => smsg(_0x3e0bdb, _0x5bf7d4, _0x0_0x82879e);
        const _0x32202b = _0x5dc988['creds']?.['registered'] === !![];
        if (_0x32202b) {
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
        _0x3e0bdb['ev']['on']('connection.update', async _0x32cc52 => {
            const {
                connection: _0x1808ea,
                lastDisconnect: _0x5e258c,
                qr: _0x38bd74
            } = _0x32cc52;
            if (_0x1808ea === 'open') {
                printLog('success', 'Bot\x20connected\x20successfully!');
                try {
                    const _0x138beb = await _0x0_0x82879e['getBotMode']();
                    const _0x518ce6 = process['uptime']();
                    const _0x45ee4e = Math['floor'](_0x518ce6 / 0xe10);
                    const _0x384af3 = Math['floor'](_0x518ce6 % 0xe10 / 0x3c);
                    const _0x2b1b6a = 'https://raw.githubusercontent.com/NOSTRA-DevOps/Nova-MD/refs/heads/main/assets/logo.PNG';
                    let _0x36dc5c = null;
                    try {
                        const _0x4ef638 = await fetch(_0x2b1b6a);
                        if (_0x4ef638['ok']) {
                            const _0x26810e = await _0x4ef638['arrayBuffer']();
                            _0x36dc5c = Buffer['from'](_0x26810e);
                        }
                    } catch (_0x88cd7d) {
                        const _0x381d5d = _0x0_0x2d449c['join'](process['cwd'](), 'assets', 'logo.PNG');
                        if (_0x0_0x1fb74c['existsSync'](_0x381d5d)) {
                            _0x36dc5c = _0x0_0x1fb74c['readFileSync'](_0x381d5d);
                        }
                    }
                    let _0x2b2609 = '╭━━『\x20*' + (_0x0_0x22be26['botName'] || 'NOVA-MD') + '\x20INFO*\x20』━⬣\x0a';
                    _0x2b2609 += '┃\x0a';
                    _0x2b2609 += '┃\x20✨\x20*Status:*\x20✅\x20ONLINE\x0a';
                    _0x2b2609 += '┃\x20🤖\x20*Version:*\x20' + (_0x0_0x22be26['version'] || '2.5.0') + '\x20(Stable)\x0a';
                    _0x2b2609 += '┃\x20⚙️\x20*Mode:*\x20' + _0x138beb['toUpperCase']() + '\x0a';
                    _0x2b2609 += '┃\x20⏰\x20*Uptime:*\x20' + _0x45ee4e + 'h\x20' + _0x384af3 + 'm\x0a';
                    _0x2b2609 += '┃\x20📊\x20*Prefixes:*\x20' + _0x0_0x22be26['prefixes']['join']('\x20') + '\x0a';
                    _0x2b2609 += '┃\x20📦\x20*Plugins:*\x20' + _0x0_0x5581c6['commands']['size'] + '\x0a';
                    _0x2b2609 += '┃\x20💾\x20*Storage:*\x20' + _0x0_0x82879e['getStats']()['backend']['toUpperCase']() + '\x0a';
                    _0x2b2609 += '┃\x0a';
                    _0x2b2609 += '┃━━━━━━━━━━━━━━━━━━⬣\x0a';
                    _0x2b2609 += '┃\x0a';
                    _0x2b2609 += '┃\x20🌐\x20*JOIN\x20CHANNELS*\x0a';
                    _0x2b2609 += '┃\x0a';
                    _0x2b2609 += '┃\x20💬\x20*FaceBook:*\x0a';
                    _0x2b2609 += '┃\x20https://www.facebook.com/profile.php?id=61591828051151\x0a';
                    _0x2b2609 += '┃\x0a';
                    _0x2b2609 += '┃\x20📱\x20*Telegram:*\x0a';
                    _0x2b2609 += '┃\x20https://t.me/addlist/CpQzYQfWwwxmYTk0\x0a';
                    _0x2b2609 += '┃\x0a';
                    _0x2b2609 += '┃\x20▶️\x20*YouTube:*\x0a';
                    _0x2b2609 += '┃\x20https://youtube.com/@labokingfreesurf\x0a';
                    _0x2b2609 += '┃\x0a';
                    _0x2b2609 += '┃━━━━━━━━━━━━━━━━━━⬣\x0a';
                    _0x2b2609 += '┃\x0a';
                    _0x2b2609 += '┃\x20✨\x20_Powered\x20by\x20NOSTRA._\x0a';
                    _0x2b2609 += '╰━━━━━━━━━━━━━━⬣';
                    const _0x1bca45 = _0x3e0bdb['user']['id']['split'](':')[0x0] + '@s.whatsapp.net';
                    if (_0x36dc5c) {
                        await _0x3e0bdb['sendMessage'](_0x1bca45, {
                            'image': _0x36dc5c,
                            'caption': _0x2b2609,
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
                        await _0x3e0bdb['sendMessage'](_0x1bca45, {
                            'text': _0x2b2609,
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
                } catch (_0x223a3e) {
                    printLog('error', 'Failed\x20to\x20send\x20automatic\x20about\x20message:\x20' + _0x223a3e['message']);
                }
                const _0x5af554 = await _0x0_0x82879e['getSetting']('global', 'stealthMode');
                if (_0x5af554 && _0x5af554['enabled']) {
                    printLog('info', '👻\x20STEALTH\x20MODE\x20ACTIVE');
                }
                printLog('success', 'Connected\x20to\x20=>\x20' + JSON['stringify'](_0x3e0bdb['user'], null, 0x2));
                await delay(0x7cf);
                try {
                    owner = JSON['parse'](_0x0_0x1fb74c['readFileSync']('./data/owner.json', 'utf-8'));
                } catch (_0x328757) {
                }
                printLog('info', '[\x20' + (_0x0_0x22be26['botName'] || 'NOVA-MD') + '\x20]');
                printLog('info', 'WA\x20NUMBER\x20\x20:\x20' + (owner[0x0] || _0x0_0x22be26['ownerNumber'] || ''));
                printLog('success', 'Bot\x20Connected\x20Successfully!');
                printLog('info', 'Plugins\x20\x20\x20:\x20' + _0x0_0x5581c6['commands']['size']);
                printLog('info', 'Prefixes\x20\x20\x20:\x20' + _0x0_0x22be26['prefixes']['join'](',\x20'));
                printLog('store', 'Backend\x20\x20\x20\x20:\x20' + _0x0_0x82879e['getStats']()['backend']);
                console['log']();
            }
            if (_0x1808ea === 'close') {
                const _0x33a157 = _0x5e258c?.['error']?.['output']?.['statusCode'];
                const _0x3a1e73 = _0x33a157 !== DisconnectReason['loggedOut'] && _0x33a157 !== 0x191;
                if (_0x33a157 === DisconnectReason['loggedOut'] || _0x33a157 === 0x191) {
                    try {
                        rmSync('./session', {
                            'recursive': !![],
                            'force': !![]
                        });
                    } catch (_0x488217) {
                    }
                    await delay(0xbb8);
                    startNovaXCode();
                    return;
                }
                if (_0x3a1e73) {
                    printLog('connection', 'Reconnecting\x20in\x205\x20seconds...');
                    await delay(0x1388);
                    startNovaXCode();
                }
            }
        });
        _0x3e0bdb['ev']['on']('call', async _0x53b52e => {
            await handleCall(_0x3e0bdb, _0x53b52e);
        });
        _0x3e0bdb['ev']['on']('group-participants.update', async _0x11d6b7 => {
            await handleGroupParticipantUpdate(_0x3e0bdb, _0x11d6b7);
        });
        _0x3e0bdb['ev']['on']('status.update', async _0x36e30d => {
            await handleStatus(_0x3e0bdb, _0x36e30d);
        });
        _0x3e0bdb['ev']['on']('messages.reaction', async _0x62f9db => {
            await handleStatus(_0x3e0bdb, _0x62f9db);
        });
        return _0x3e0bdb;
    } catch (_0x517ecf) {
        printLog('error', 'Error\x20in\x20startNovaXCode:\x20' + _0x517ecf['message']);
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
    printLog('info', '📱\x20Open\x20http://localhost:' + (_0x0_0x22be26['port'] || 0x1388) + '/pairing\x20in\x20your\x20browser\x20if\x20it\x27s\x20local');
    printLog('info', '📱\x20For\x20web\x20servic\x20deployment,\x20click\x20the\x20service\x20URL\x20and\x20add\x20/pairing\x20at\x20the\x20end');
    const _0x5cb06c = 0x1e * 0x3c * 0x3e8;
    const _0x4b9a93 = Date['now']();
    const _0x5810be = 0xbb8;
    return new Promise((_0x2793cb, _0x34ee14) => {
        const _0x3cd9bb = setInterval(() => {
            if (hasValidSession()) {
                clearInterval(_0x3cd9bb);
                printLog('success', '✅\x20Session\x20detected!\x20Starting\x20bot...');
                _0x2793cb();
            }
            if (Date['now']() - _0x4b9a93 > _0x5cb06c) {
                clearInterval(_0x3cd9bb);
                _0x34ee14(new Error('Session\x20creation\x20timeout\x20(30\x20minutes)'));
            }
        }, _0x5810be);
    });
}
async function main() {
    await compileAll();
    await _0x0_0x5581c6['loadCommands']();
    printLog('info', 'Starting\x20NOVA-MD\x20BOT...');
    if (hasValidSession()) {
        printLog('success', '✅\x20Valid\x20session\x20found,\x20starting\x20bot...');
        await delay(0xbb8);
        startNovaXCode()['catch'](_0x53c09d => {
            printLog('error', 'Fatal\x20error:\x20' + _0x53c09d['message']);
            if (rl && !rlClosed)
                rl['close']();
            process['exit'](0x1);
        });
    } else {
        printLog('info', '🌐\x20No\x20session\x20found.\x20Launching\x20web\x20pairing\x20interface...');
        printLog('info', '📱\x20Open\x20http://localhost:' + (_0x0_0x22be26['port'] || 0x1388) + '/pairing\x20in\x20your\x20browser\x20to\x20connect\x20WhatsApp');
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
            startNovaXCode()['catch'](_0x41d462 => {
                printLog('error', 'Fatal\x20error:\x20' + _0x41d462['message']);
                if (rl && !rlClosed)
                    rl['close']();
                process['exit'](0x1);
            });
        } catch (_0x252c30) {
            printLog('error', 'Session\x20creation\x20failed:\x20' + _0x252c30['message']);
            if (rl && !rlClosed)
                rl['close']();
            process['exit'](0x1);
        }
    }
}
main();
const sessionDir = _0x0_0x2d449c['join'](process['cwd'](), 'session');
setInterval(() => {
    if (!_0x0_0x1fb74c['existsSync'](sessionDir))
        return;
    _0x0_0x1fb74c['readdir'](sessionDir, (_0xcccf6, _0x5dd438) => {
        if (_0xcccf6)
            return;
        for (const _0x3972e8 of _0x5dd438) {
            if (_0x3972e8 === 'creds.json')
                continue;
            if (_0x3972e8['startsWith']('app-state-sync-key-'))
                continue;
            _0x0_0x1fb74c['unlink'](_0x0_0x2d449c['join'](sessionDir, _0x3972e8), () => {
            });
        }
    });
}, 0x3 * 0x3c * 0x3e8);
const customTemp = _0x0_0x2d449c['join'](process['cwd'](), 'temp');
if (!_0x0_0x1fb74c['existsSync'](customTemp))
    _0x0_0x1fb74c['mkdirSync'](customTemp, { 'recursive': !![] });
process.env.TMPDIR = customTemp;
process.env.TEMP = customTemp;
process.env.TMP = customTemp;
setInterval(() => {
    _0x0_0x1fb74c['readdir'](customTemp, (_0x34c85f, _0x890c16) => {
        if (_0x34c85f)
            return;
        for (const _0x9bc9eb of _0x890c16) {
            const _0x6824bd = _0x0_0x2d449c['join'](customTemp, _0x9bc9eb);
            _0x0_0x1fb74c['stat'](_0x6824bd, (_0x56d3cc, _0x1cf572) => {
                if (!_0x56d3cc && Date['now']() - _0x1cf572['mtimeMs'] > 0x3 * 0x3c * 0x3c * 0x3e8) {
                    _0x0_0x1fb74c['unlink'](_0x6824bd, () => {
                    });
                }
            });
        }
    });
}, 0x1 * 0x3c * 0x3c * 0x3e8);
const folders = [
    _0x0_0x2d449c['join'](__dirname, './lib'),
    _0x0_0x2d449c['join'](__dirname, './plugins')
];
folders['forEach'](_0x7dbd0e => {
    if (!_0x0_0x1fb74c['existsSync'](_0x7dbd0e))
        return;
    _0x0_0x1fb74c['readdirSync'](_0x7dbd0e)['filter'](_0x480ec7 => _0x480ec7['endsWith']('.js'))['forEach'](_0x3dfce9 => {
        const _0x27be53 = _0x0_0x2d449c['join'](_0x7dbd0e, _0x3dfce9);
        try {
            const _0x21c04e = _0x0_0x1fb74c['readFileSync'](_0x27be53, 'utf-8');
            const _0x3c04a2 = _0x0_0x186526(_0x21c04e, _0x3dfce9, {
                'sourceType': 'module',
                'allowAwaitOutsideFunction': !![]
            });
            if (_0x3c04a2) {
                console['error'](_0x0_0x27f15d['red']('❌\x20Syntax\x20error\x20in\x20' + _0x27be53 + ':\x0a' + _0x3c04a2));
            }
        } catch (_0x1d28c2) {
            console['error'](_0x0_0x27f15d['yellow']('⚠️\x20Cannot\x20read\x20file\x20' + _0x27be53 + ':\x0a' + _0x1d28c2));
        }
    });
});
process['on']('uncaughtException', _0x4b949e => {
    printLog('error', 'Uncaught\x20Exception:\x20' + _0x4b949e['message']);
    console['error'](_0x4b949e['stack']);
    writeErrorLog({
        'type': 'uncaughtException',
        'error': _0x4b949e['message'],
        'stack': _0x4b949e['stack'],
        'timestamp': new Date()['toISOString']()
    });
});
process['on']('unhandledRejection', _0x1d5139 => {
    printLog('error', 'Unhandled\x20Rejection:\x20' + _0x1d5139['message']);
    console['error'](_0x1d5139['stack']);
    writeErrorLog({
        'type': 'unhandledRejection',
        'error': _0x1d5139['message'],
        'stack': _0x1d5139['stack'],
        'timestamp': new Date()['toISOString']()
    });
});
server['on']('error', _0xfcb410 => {
    if (_0xfcb410['code'] === 'EADDRINUSE') {
        printLog('error', 'Address\x20localhost:' + PORT + '\x20in\x20use');
        writeErrorLog({
            'type': 'serverError',
            'error': 'Address\x20localhost:' + PORT + '\x20in\x20use',
            'timestamp': new Date()['toISOString']()
        });
        server['close']();
    } else {
        printLog('error', 'Server\x20error:\x20' + _0xfcb410['message']);
        writeErrorLog({
            'type': 'serverError',
            'error': _0xfcb410['message'],
            'stack': _0xfcb410['stack'],
            'timestamp': new Date()['toISOString']()
        });
    }
});