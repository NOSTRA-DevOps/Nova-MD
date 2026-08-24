import 'dotenv/config';
import _0x0_0x1b69c6, {
    existsSync,
    mkdirSync,
    rmSync
} from 'fs';
import _0x0_0x2f0156, { dirname } from 'path';
import _0x0_0x34c8da from 'chalk';
import _0x0_0x160300 from 'syntax-error';
import { parsePhoneNumber as _0x0_0xa602dd } from 'awesome-phonenumber';
import _0x0_0x3db14a from 'readline';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { smsg } from './lib/myfunc.js';
import { compileAll } from './lib/compile.js';
import _0x0_0x9a9564, {
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    Browsers,
    jidDecode,
    jidNormalizedUser,
    makeCacheableSignalKeyStore,
    delay
} from '@whiskeysockets/baileys';
import _0x0_0x1981d0 from 'node-cache';
import _0x0_0x226e28 from 'pino';
import _0x0_0x51dd03 from './config.js';
import _0x0_0x3e133f from './lib/lightweight_store.js';
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
import _0x0_0x3d043f from './lib/commandHandler.js';
import _0x0_0x407a47 from './lib/sessionManager.js';
_0x0_0x3e133f['readFromFile']();
setInterval(() => _0x0_0x3e133f['writeToFile'](), _0x0_0x51dd03['storeWriteInterval'] || 0x2710);
setInterval(() => {
    if (global['gc']) {
        global['gc']();
        console['log']('🧹\x20Garbage\x20collection\x20completed');
    }
}, 0xea60);
setInterval(() => {
    const _0x3542ac = process['memoryUsage']()['rss'] / 0x400 / 0x400;
    if (_0x3542ac > 0x190) {
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
_0x0_0x1b69c6['mkdirSync']('./data', { 'recursive': !![] });
for (const [file, def] of Object['entries'](DATA_DEFAULTS)) {
    const fp = './data/' + file;
    if (!_0x0_0x1b69c6['existsSync'](fp))
        _0x0_0x1b69c6['writeFileSync'](fp, JSON['stringify'](def, null, 0x2));
}
let owner = [];
try {
    owner = JSON['parse'](_0x0_0x1b69c6['readFileSync']('./data/owner.json', 'utf-8'));
} catch {
    owner = [];
}
global['botname'] = _0x0_0x51dd03['botName'] || 'NOVA-MD';
global['themeemoji'] = '•';
const pairingCode = ![];
const useMobile = process['argv']['includes']('--mobile');
let rl = null;
let rlClosed = ![];
if (process['stdin']['isTTY'] && !_0x0_0x51dd03['pairingNumber']) {
    rl = _0x0_0x3db14a['createInterface']({
        'input': process['stdin'],
        'output': process['stdout']
    });
    rl['on']('close', () => {
        rlClosed = !![];
    });
}
const question = _0x184fd6 => {
    if (rl && !rlClosed) {
        return new Promise(_0x599b25 => rl['question'](_0x184fd6, _0x599b25));
    } else {
        return Promise['resolve'](_0x0_0x51dd03['ownerNumber'] || '237676250509');
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
    const _0x3ceba8 = _0x0_0x2f0156['join'](__dirname, 'session');
    if (!existsSync(_0x3ceba8)) {
        mkdirSync(_0x3ceba8, { 'recursive': !![] });
    }
    return _0x3ceba8;
}
function hasValidSession() {
    return _0x0_0x407a47['hasValidSession']();
}
server['listen'](PORT, () => {
    printLog('success', 'Server\x20listening\x20on\x20port\x20' + PORT);
    printLog('info', '🌐\x20Web\x20interface\x20available\x20at:\x20http://localhost:' + PORT + '/pairing');
});
async function startNovaXCode() {
    try {
        const {version: _0x1bf768} = await fetchLatestBaileysVersion();
        ensureSessionDirectory();
        await delay(0x3e8);
        const {
            state: _0x586b91,
            saveCreds: _0x40f52d
        } = await useMultiFileAuthState('./session');
        const _0x42ca73 = async () => {
            ensureSessionDirectory();
            await _0x40f52d();
        };
        const _0x1899ad = new _0x0_0x1981d0();
        const _0x452fa3 = await _0x0_0x3e133f['getSetting']('global', 'stealthMode');
        const _0x347d04 = _0x452fa3 && _0x452fa3['enabled'];
        const _0x2ed375 = _0x0_0x9a9564({
            'version': _0x1bf768,
            'logger': _0x0_0x226e28({ 'level': 'silent' }),
            'browser': Browsers['macOS']('Chrome'),
            'auth': {
                'creds': _0x586b91['creds'],
                'keys': makeCacheableSignalKeyStore(_0x586b91['keys'], _0x0_0x226e28({ 'level': 'fatal' })['child']({ 'level': 'fatal' }))
            },
            'markOnlineOnConnect': !_0x347d04,
            'generateHighQualityLinkPreview': !![],
            'syncFullHistory': ![],
            'getMessage': async _0x355972 => {
                const _0x417a8d = jidNormalizedUser(_0x355972['remoteJid']);
                const _0x109242 = await _0x0_0x3e133f['loadMessage'](_0x417a8d, _0x355972['id']);
                return _0x109242?.['message'] || '';
            },
            'msgRetryCounterCache': _0x1899ad,
            'defaultQueryTimeoutMs': 0xea60,
            'connectTimeoutMs': 0xea60,
            'keepAliveIntervalMs': 0x2710
        });
        _0x2ed375['store'] = _0x0_0x3e133f;
        const _0x16b73b = _0x2ed375['sendPresenceUpdate'];
        const _0x281127 = _0x2ed375['readMessages'];
        const _0x36c12c = _0x2ed375['sendReceipt'];
        _0x2ed375['sendPresenceUpdate'] = async function (..._0x387385) {
            const _0x28d5f6 = await _0x0_0x3e133f['getSetting']('global', 'stealthMode');
            if (_0x28d5f6 && _0x28d5f6['enabled']) {
                printLog('info', '👻\x20Blocked\x20presence\x20update\x20(stealth\x20mode)');
                return;
            }
            return _0x16b73b['apply'](this, _0x387385);
        };
        _0x2ed375['readMessages'] = async function (..._0x472e17) {
            const _0x4546eb = await _0x0_0x3e133f['getSetting']('global', 'stealthMode');
            if (_0x4546eb && _0x4546eb['enabled'])
                return;
            return _0x281127['apply'](this, _0x472e17);
        };
        if (_0x36c12c) {
            _0x2ed375['sendReceipt'] = async function (..._0x8328f3) {
                const _0x4ad953 = await _0x0_0x3e133f['getSetting']('global', 'stealthMode');
                if (_0x4ad953 && _0x4ad953['enabled'])
                    return;
                return _0x36c12c['apply'](this, _0x8328f3);
            };
        }
        const _0x8d1897 = _0x2ed375['query'];
        _0x2ed375['query'] = async function (_0x47f56e, ..._0x175d4d) {
            const _0x4f2077 = await _0x0_0x3e133f['getSetting']('global', 'stealthMode');
            if (_0x4f2077 && _0x4f2077['enabled']) {
                if (_0x47f56e && _0x47f56e['tag'] === 'receipt')
                    return;
                if (_0x47f56e && _0x47f56e['attrs'] && (_0x47f56e['attrs']['type'] === 'read' || _0x47f56e['attrs']['type'] === 'read-self'))
                    return;
            }
            return _0x8d1897['apply'](this, [
                _0x47f56e,
                ..._0x175d4d
            ]);
        };
        _0x2ed375['isGhostMode'] = async () => {
            const _0x99b9a5 = await _0x0_0x3e133f['getSetting']('global', 'stealthMode');
            return _0x99b9a5 && _0x99b9a5['enabled'];
        };
        _0x2ed375['ev']['on']('creds.update', _0x42ca73);
        _0x0_0x3e133f['bind'](_0x2ed375['ev']);
        _0x2ed375['ev']['on']('messages.upsert', async _0x440450 => {
            try {
                const _0x420568 = _0x440450['messages'][0x0];
                if (!_0x420568['message'])
                    return;
                _0x420568['message'] = Object['keys'](_0x420568['message'])[0x0] === 'ephemeralMessage' ? _0x420568['message']['ephemeralMessage']['message'] : _0x420568['message'];
                if (_0x420568['key'] && _0x420568['key']['remoteJid'] === 'status@broadcast') {
                    await handleStatus(_0x2ed375, _0x440450);
                    return;
                }
                if (!_0x2ed375['public'] && !_0x420568['key']['fromMe'] && _0x440450['type'] === 'notify') {
                    const _0x5dde82 = _0x420568['key']?.['remoteJid']?.['endsWith']('@g.us');
                    if (!_0x5dde82)
                        return;
                }
                if (_0x420568['key']['id']['startsWith']('BAE5') && _0x420568['key']['id']['length'] === 0x10)
                    return;
                if (_0x2ed375?.['msgRetryCounterCache']) {
                    _0x2ed375['msgRetryCounterCache']['clear']();
                }
                try {
                    await handleMessages(_0x2ed375, _0x440450);
                } catch (_0x3d176b) {
                    printLog('error', 'Error\x20in\x20handleMessages:\x20' + _0x3d176b['message']);
                    if (_0x420568['key'] && _0x420568['key']['remoteJid']) {
                        await _0x2ed375['sendMessage'](_0x420568['key']['remoteJid'], {
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
            } catch (_0x3b369c) {
                printLog('error', 'Error\x20in\x20messages.upsert:\x20' + _0x3b369c['message']);
            }
        });
        _0x2ed375['decodeJid'] = _0x135c29 => {
            if (!_0x135c29)
                return _0x135c29;
            if (/:\d+@/gi['test'](_0x135c29)) {
                const _0x7f20ae = jidDecode(_0x135c29) || {};
                return _0x7f20ae['user'] && _0x7f20ae['server'] && _0x7f20ae['user'] + '@' + _0x7f20ae['server'] || _0x135c29;
            } else
                return _0x135c29;
        };
        _0x2ed375['ev']['on']('contacts.update', _0x4a3d6e => {
            for (const _0x4e88cd of _0x4a3d6e) {
                const _0x561151 = _0x2ed375['decodeJid'](_0x4e88cd['id']);
                if (_0x0_0x3e133f && _0x0_0x3e133f['contacts'])
                    _0x0_0x3e133f['contacts'][_0x561151] = {
                        'id': _0x561151,
                        'name': _0x4e88cd['notify']
                    };
            }
        });
        _0x2ed375['getName'] = (_0x2cd872, _0x48af82 = ![]) => {
            const _0x51f7f5 = _0x2ed375['decodeJid'](_0x2cd872);
            _0x48af82 = _0x2ed375['withoutContact'] || _0x48af82;
            let _0x1fc626;
            if (_0x51f7f5['endsWith']('@g.us'))
                return new Promise(async _0x20386a => {
                    _0x1fc626 = _0x0_0x3e133f['contacts'][_0x51f7f5] || {};
                    if (!(_0x1fc626['name'] || _0x1fc626['subject']))
                        _0x1fc626 = _0x2ed375['groupMetadata'](_0x51f7f5) || {};
                    _0x20386a(_0x1fc626['name'] || _0x1fc626['subject'] || _0x0_0xa602dd('+' + _0x51f7f5['replace']('@s.whatsapp.net', ''))['number']?.['international']);
                });
            else
                _0x1fc626 = _0x51f7f5 === '0@s.whatsapp.net' ? {
                    'id': _0x51f7f5,
                    'name': 'WhatsApp'
                } : _0x51f7f5 === _0x2ed375['decodeJid'](_0x2ed375['user']['id']) ? _0x2ed375['user'] : _0x0_0x3e133f['contacts'][_0x51f7f5] || {};
            return (_0x48af82 ? '' : _0x1fc626['name']) || _0x1fc626['subject'] || _0x1fc626['verifiedName'] || _0x0_0xa602dd('+' + _0x2cd872['replace']('@s.whatsapp.net', ''))['number']?.['international'];
        };
        _0x2ed375['public'] = !![];
        _0x2ed375['serializeM'] = _0x4fe38b => smsg(_0x2ed375, _0x4fe38b, _0x0_0x3e133f);
        const _0x95a107 = _0x586b91['creds']?.['registered'] === !![];
        if (_0x95a107) {
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
        _0x2ed375['ev']['on']('connection.update', async _0x10a538 => {
            const {
                connection: _0xc91fe9,
                lastDisconnect: _0x312061,
                qr: _0x382cf2
            } = _0x10a538;
            if (_0xc91fe9 === 'open') {
                printLog('success', 'Bot\x20connected\x20successfully!');
                try {
                    const _0xd4c1c9 = await _0x0_0x3e133f['getBotMode']();
                    const _0x358860 = process['uptime']();
                    const _0x95ef7a = Math['floor'](_0x358860 / 0xe10);
                    const _0x517e77 = Math['floor'](_0x358860 % 0xe10 / 0x3c);
                    const _0x178129 = 'https://raw.githubusercontent.com/NOSTRA-DevOps/Nova-MD/refs/heads/main/assets/logo.PNG';
                    let _0x155ff1 = null;
                    try {
                        const _0x24389b = await fetch(_0x178129);
                        if (_0x24389b['ok']) {
                            const _0xd14783 = await _0x24389b['arrayBuffer']();
                            _0x155ff1 = Buffer['from'](_0xd14783);
                        }
                    } catch (_0x4664bf) {
                        const _0x42eb54 = _0x0_0x2f0156['join'](process['cwd'](), 'assets', 'logo.PNG');
                        if (_0x0_0x1b69c6['existsSync'](_0x42eb54)) {
                            _0x155ff1 = _0x0_0x1b69c6['readFileSync'](_0x42eb54);
                        }
                    }
                    let _0x26c3b6 = '╭━━━━『\x20*' + (_0x0_0x51dd03['botName'] || 'NOVA-MD') + '\x20INFO*\x20』━━━⬣\x0a';
                    _0x26c3b6 += '┃\x0a';
                    _0x26c3b6 += '┃\x20✨\x20*Status:*\x20✅\x20ONLINE\x0a';
                    _0x26c3b6 += '┃\x20🤖\x20*Version:*\x20' + (_0x0_0x51dd03['version'] || '2.5.0') + '\x20(Stable)\x0a';
                    _0x26c3b6 += '┃\x20⚙️\x20*Mode:*\x20' + _0xd4c1c9['toUpperCase']() + '\x0a';
                    _0x26c3b6 += '┃\x20⏰\x20*Uptime:*\x20' + _0x95ef7a + 'h\x20' + _0x517e77 + 'm\x0a';
                    _0x26c3b6 += '┃\x20📊\x20*Prefixes:*\x20' + _0x0_0x51dd03['prefixes']['join']('\x20') + '\x0a';
                    _0x26c3b6 += '┃\x20📦\x20*Plugins:*\x20' + _0x0_0x3d043f['commands']['size'] + '\x0a';
                    _0x26c3b6 += '┃\x20💾\x20*Storage:*\x20' + _0x0_0x3e133f['getStats']()['backend']['toUpperCase']() + '\x0a';
                    _0x26c3b6 += '┃\x0a';
                    _0x26c3b6 += '┃━━━━━━━━━━━━━━━━━━⬣\x0a';
                    _0x26c3b6 += '┃\x0a';
                    _0x26c3b6 += '┃\x20🌐\x20*JOIN\x20CHANNELS*\x0a';
                    _0x26c3b6 += '┃\x0a';
                    _0x26c3b6 += '┃\x20💬\x20*FaceBook:*\x0a';
                    _0x26c3b6 += '┃\x20https://www.facebook.com/profile.php?id=61591828051151\x0a';
                    _0x26c3b6 += '┃\x0a';
                    _0x26c3b6 += '┃\x20📱\x20*Telegram:*\x0a';
                    _0x26c3b6 += '┃\x20https://t.me/addlist/CpQzYQfWwwxmYTk0\x0a';
                    _0x26c3b6 += '┃\x0a';
                    _0x26c3b6 += '┃\x20▶️\x20*YouTube:*\x0a';
                    _0x26c3b6 += '┃\x20https://youtube.com/@labokingfreesurf\x0a';
                    _0x26c3b6 += '┃\x0a';
                    _0x26c3b6 += '┃━━━━━━━━━━━━━━━━━━⬣\x0a';
                    _0x26c3b6 += '┃\x0a';
                    _0x26c3b6 += '┃\x20✨\x20_Powered\x20by\x20NOSTRA._\x0a';
                    _0x26c3b6 += '╰━━━━━━━━━━━━━━━━━━⬣';
                    const _0x3f7797 = _0x2ed375['user']['id']['split'](':')[0x0] + '@s.whatsapp.net';
                    if (_0x155ff1) {
                        await _0x2ed375['sendMessage'](_0x3f7797, {
                            'image': _0x155ff1,
                            'caption': _0x26c3b6,
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
                        await _0x2ed375['sendMessage'](_0x3f7797, {
                            'text': _0x26c3b6,
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
                } catch (_0x5ad69e) {
                    printLog('error', 'Failed\x20to\x20send\x20automatic\x20about\x20message:\x20' + _0x5ad69e['message']);
                }
                const _0x292e17 = await _0x0_0x3e133f['getSetting']('global', 'stealthMode');
                if (_0x292e17 && _0x292e17['enabled']) {
                    printLog('info', '👻\x20STEALTH\x20MODE\x20ACTIVE');
                }
                printLog('success', 'Connected\x20to\x20=>\x20' + JSON['stringify'](_0x2ed375['user'], null, 0x2));
                await delay(0x7cf);
                try {
                    owner = JSON['parse'](_0x0_0x1b69c6['readFileSync']('./data/owner.json', 'utf-8'));
                } catch (_0x14de96) {
                }
                printLog('info', '[\x20' + (_0x0_0x51dd03['botName'] || 'NOVA-MD') + '\x20]');
                printLog('info', 'WA\x20NUMBER\x20\x20:\x20' + (owner[0x0] || _0x0_0x51dd03['ownerNumber'] || ''));
                printLog('success', 'Bot\x20Connected\x20Successfully!');
                printLog('info', 'Plugins\x20\x20\x20:\x20' + _0x0_0x3d043f['commands']['size']);
                printLog('info', 'Prefixes\x20\x20\x20:\x20' + _0x0_0x51dd03['prefixes']['join'](',\x20'));
                printLog('store', 'Backend\x20\x20\x20\x20:\x20' + _0x0_0x3e133f['getStats']()['backend']);
                console['log']();
            }
            if (_0xc91fe9 === 'close') {
                const _0xfa9559 = _0x312061?.['error']?.['output']?.['statusCode'];
                const _0x50d733 = _0xfa9559 !== DisconnectReason['loggedOut'] && _0xfa9559 !== 0x191;
                if (_0xfa9559 === DisconnectReason['loggedOut'] || _0xfa9559 === 0x191) {
                    try {
                        rmSync('./session', {
                            'recursive': !![],
                            'force': !![]
                        });
                    } catch (_0x1e790b) {
                    }
                    await delay(0xbb8);
                    startNovaXCode();
                    return;
                }
                if (_0x50d733) {
                    printLog('connection', 'Reconnecting\x20in\x205\x20seconds...');
                    await delay(0x1388);
                    startNovaXCode();
                }
            }
        });
        _0x2ed375['ev']['on']('call', async _0x3c5641 => {
            await handleCall(_0x2ed375, _0x3c5641);
        });
        _0x2ed375['ev']['on']('group-participants.update', async _0x3d8033 => {
            await handleGroupParticipantUpdate(_0x2ed375, _0x3d8033);
        });
        _0x2ed375['ev']['on']('status.update', async _0x3b131b => {
            await handleStatus(_0x2ed375, _0x3b131b);
        });
        _0x2ed375['ev']['on']('messages.reaction', async _0x4a09b1 => {
            await handleStatus(_0x2ed375, _0x4a09b1);
        });
        return _0x2ed375;
    } catch (_0x34acb0) {
        printLog('error', 'Error\x20in\x20startNovaXCode:\x20' + _0x34acb0['message']);
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
    printLog('info', '📱\x20Open\x20http://localhost:' + (_0x0_0x51dd03['port'] || 0x1388) + '/pairing\x20in\x20your\x20browser\x20if\x20it\x27s\x20local');
    printLog('info', '📱\x20For\x20web\x20servic\x20deployment,\x20click\x20the\x20service\x20URL\x20and\x20add\x20/pairing\x20at\x20the\x20end');
    const _0x4ac851 = 0x1e * 0x3c * 0x3e8;
    const _0x158f1e = Date['now']();
    const _0x4c79f1 = 0xbb8;
    return new Promise((_0xa09d4, _0x4a5087) => {
        const _0x53b36d = setInterval(() => {
            if (hasValidSession()) {
                clearInterval(_0x53b36d);
                printLog('success', '✅\x20Session\x20detected!\x20Starting\x20bot...');
                _0xa09d4();
            }
            if (Date['now']() - _0x158f1e > _0x4ac851) {
                clearInterval(_0x53b36d);
                _0x4a5087(new Error('Session\x20creation\x20timeout\x20(30\x20minutes)'));
            }
        }, _0x4c79f1);
    });
}
async function main() {
    await compileAll();
    await _0x0_0x3d043f['loadCommands']();
    printLog('info', 'Starting\x20NOVA-MD\x20BOT...');
    if (hasValidSession()) {
        printLog('success', '✅\x20Valid\x20session\x20found,\x20starting\x20bot...');
        await delay(0xbb8);
        startNovaXCode()['catch'](_0x1559e8 => {
            printLog('error', 'Fatal\x20error:\x20' + _0x1559e8['message']);
            if (rl && !rlClosed)
                rl['close']();
            process['exit'](0x1);
        });
    } else {
        printLog('info', '🌐\x20No\x20session\x20found.\x20Launching\x20web\x20pairing\x20interface...');
        printLog('info', '📱\x20Open\x20http://localhost:' + (_0x0_0x51dd03['port'] || 0x1388) + '/pairing\x20in\x20your\x20browser\x20to\x20connect\x20WhatsApp');
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
            startNovaXCode()['catch'](_0x19e651 => {
                printLog('error', 'Fatal\x20error:\x20' + _0x19e651['message']);
                if (rl && !rlClosed)
                    rl['close']();
                process['exit'](0x1);
            });
        } catch (_0x19731b) {
            printLog('error', 'Session\x20creation\x20failed:\x20' + _0x19731b['message']);
            if (rl && !rlClosed)
                rl['close']();
            process['exit'](0x1);
        }
    }
}
main();
const sessionDir = _0x0_0x2f0156['join'](process['cwd'](), 'session');
setInterval(() => {
    if (!_0x0_0x1b69c6['existsSync'](sessionDir))
        return;
    _0x0_0x1b69c6['readdir'](sessionDir, (_0x256ff4, _0x1f4b22) => {
        if (_0x256ff4)
            return;
        for (const _0x409956 of _0x1f4b22) {
            if (_0x409956 === 'creds.json')
                continue;
            if (_0x409956['startsWith']('app-state-sync-key-'))
                continue;
            _0x0_0x1b69c6['unlink'](_0x0_0x2f0156['join'](sessionDir, _0x409956), () => {
            });
        }
    });
}, 0x3 * 0x3c * 0x3e8);
const customTemp = _0x0_0x2f0156['join'](process['cwd'](), 'temp');
if (!_0x0_0x1b69c6['existsSync'](customTemp))
    _0x0_0x1b69c6['mkdirSync'](customTemp, { 'recursive': !![] });
process.env.TMPDIR = customTemp;
process.env.TEMP = customTemp;
process.env.TMP = customTemp;
setInterval(() => {
    _0x0_0x1b69c6['readdir'](customTemp, (_0x134445, _0x355031) => {
        if (_0x134445)
            return;
        for (const _0x26e132 of _0x355031) {
            const _0x3c0f05 = _0x0_0x2f0156['join'](customTemp, _0x26e132);
            _0x0_0x1b69c6['stat'](_0x3c0f05, (_0x318e8f, _0x4b237b) => {
                if (!_0x318e8f && Date['now']() - _0x4b237b['mtimeMs'] > 0x3 * 0x3c * 0x3c * 0x3e8) {
                    _0x0_0x1b69c6['unlink'](_0x3c0f05, () => {
                    });
                }
            });
        }
    });
}, 0x1 * 0x3c * 0x3c * 0x3e8);
const folders = [
    _0x0_0x2f0156['join'](__dirname, './lib'),
    _0x0_0x2f0156['join'](__dirname, './plugins')
];
folders['forEach'](_0x8221c4 => {
    if (!_0x0_0x1b69c6['existsSync'](_0x8221c4))
        return;
    _0x0_0x1b69c6['readdirSync'](_0x8221c4)['filter'](_0x438cbf => _0x438cbf['endsWith']('.js'))['forEach'](_0x53c4dc => {
        const _0x44c662 = _0x0_0x2f0156['join'](_0x8221c4, _0x53c4dc);
        try {
            const _0x381add = _0x0_0x1b69c6['readFileSync'](_0x44c662, 'utf-8');
            const _0x24a041 = _0x0_0x160300(_0x381add, _0x53c4dc, {
                'sourceType': 'module',
                'allowAwaitOutsideFunction': !![]
            });
            if (_0x24a041) {
                console['error'](_0x0_0x34c8da['red']('❌\x20Syntax\x20error\x20in\x20' + _0x44c662 + ':\x0a' + _0x24a041));
            }
        } catch (_0x49d993) {
            console['error'](_0x0_0x34c8da['yellow']('⚠️\x20Cannot\x20read\x20file\x20' + _0x44c662 + ':\x0a' + _0x49d993));
        }
    });
});
process['on']('uncaughtException', _0x127ca4 => {
    printLog('error', 'Uncaught\x20Exception:\x20' + _0x127ca4['message']);
    console['error'](_0x127ca4['stack']);
    writeErrorLog({
        'type': 'uncaughtException',
        'error': _0x127ca4['message'],
        'stack': _0x127ca4['stack'],
        'timestamp': new Date()['toISOString']()
    });
});
process['on']('unhandledRejection', _0xea3058 => {
    printLog('error', 'Unhandled\x20Rejection:\x20' + _0xea3058['message']);
    console['error'](_0xea3058['stack']);
    writeErrorLog({
        'type': 'unhandledRejection',
        'error': _0xea3058['message'],
        'stack': _0xea3058['stack'],
        'timestamp': new Date()['toISOString']()
    });
});
server['on']('error', _0x276e6b => {
    if (_0x276e6b['code'] === 'EADDRINUSE') {
        printLog('error', 'Address\x20localhost:' + PORT + '\x20in\x20use');
        writeErrorLog({
            'type': 'serverError',
            'error': 'Address\x20localhost:' + PORT + '\x20in\x20use',
            'timestamp': new Date()['toISOString']()
        });
        server['close']();
    } else {
        printLog('error', 'Server\x20error:\x20' + _0x276e6b['message']);
        writeErrorLog({
            'type': 'serverError',
            'error': _0x276e6b['message'],
            'stack': _0x276e6b['stack'],
            'timestamp': new Date()['toISOString']()
        });
    }
});