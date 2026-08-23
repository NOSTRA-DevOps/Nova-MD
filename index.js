import 'dotenv/config';
import _0x0_0x240dcb, {
    existsSync,
    mkdirSync,
    rmSync
} from 'fs';
import _0x0_0x1ccbed, { dirname } from 'path';
import _0x0_0x20b265 from 'chalk';
import _0x0_0x1c5b7e from 'syntax-error';
import { parsePhoneNumber as _0x0_0x5d83c2 } from 'awesome-phonenumber';
import _0x0_0x3b0f5b from 'readline';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { smsg } from './lib/myfunc.js';
import { compileAll } from './lib/compile.js';
import _0x0_0x39beb8, {
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    Browsers,
    jidDecode,
    jidNormalizedUser,
    makeCacheableSignalKeyStore,
    delay
} from '@whiskeysockets/baileys';
import _0x0_0x2d3951 from 'node-cache';
import _0x0_0x3349bf from 'pino';
import _0x0_0x128b18 from './config.js';
import _0x0_0x5dced9 from './lib/lightweight_store.js';
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
import _0x0_0x2adf44 from './lib/commandHandler.js';
import _0x0_0x34e388 from './lib/sessionManager.js';
_0x0_0x5dced9['readFromFile']();
setInterval(() => _0x0_0x5dced9['writeToFile'](), _0x0_0x128b18['storeWriteInterval'] || 0x2710);
setInterval(() => {
    if (global['gc']) {
        global['gc']();
        console['log']('🧹\x20Garbage\x20collection\x20completed');
    }
}, 0xea60);
setInterval(() => {
    const _0x6759ca = process['memoryUsage']()['rss'] / 0x400 / 0x400;
    if (_0x6759ca > 0x190) {
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
_0x0_0x240dcb['mkdirSync']('./data', { 'recursive': !![] });
for (const [file, def] of Object['entries'](DATA_DEFAULTS)) {
    const fp = './data/' + file;
    if (!_0x0_0x240dcb['existsSync'](fp))
        _0x0_0x240dcb['writeFileSync'](fp, JSON['stringify'](def, null, 0x2));
}
let owner = [];
try {
    owner = JSON['parse'](_0x0_0x240dcb['readFileSync']('./data/owner.json', 'utf-8'));
} catch {
    owner = [];
}
global['botname'] = _0x0_0x128b18['botName'] || 'NOVA-MD';
global['themeemoji'] = '•';
const pairingCode = ![];
const useMobile = process['argv']['includes']('--mobile');
let rl = null;
let rlClosed = ![];
if (process['stdin']['isTTY'] && !_0x0_0x128b18['pairingNumber']) {
    rl = _0x0_0x3b0f5b['createInterface']({
        'input': process['stdin'],
        'output': process['stdout']
    });
    rl['on']('close', () => {
        rlClosed = !![];
    });
}
const question = _0x440aa7 => {
    if (rl && !rlClosed) {
        return new Promise(_0x43f144 => rl['question'](_0x440aa7, _0x43f144));
    } else {
        return Promise['resolve'](_0x0_0x128b18['ownerNumber'] || '237676250509');
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
    const _0x326762 = _0x0_0x1ccbed['join'](__dirname, 'session');
    if (!existsSync(_0x326762)) {
        mkdirSync(_0x326762, { 'recursive': !![] });
    }
    return _0x326762;
}
function hasValidSession() {
    return _0x0_0x34e388['hasValidSession']();
}
server['listen'](PORT, () => {
    printLog('success', 'Server\x20listening\x20on\x20port\x20' + PORT);
    printLog('info', '🌐\x20Web\x20interface\x20available\x20at:\x20http://localhost:' + PORT + '/pairing');
});
async function startNovaXCode() {
    try {
        const {version: _0x6011ea} = await fetchLatestBaileysVersion();
        ensureSessionDirectory();
        await delay(0x3e8);
        const {
            state: _0x4a826f,
            saveCreds: _0x2c3799
        } = await useMultiFileAuthState('./session');
        const _0x392702 = async () => {
            ensureSessionDirectory();
            await _0x2c3799();
        };
        const _0x4fff0a = new _0x0_0x2d3951();
        const _0x1d70a3 = await _0x0_0x5dced9['getSetting']('global', 'stealthMode');
        const _0x5574bf = _0x1d70a3 && _0x1d70a3['enabled'];
        const _0x375ed8 = _0x0_0x39beb8({
            'version': _0x6011ea,
            'logger': _0x0_0x3349bf({ 'level': 'silent' }),
            'browser': Browsers['macOS']('Chrome'),
            'auth': {
                'creds': _0x4a826f['creds'],
                'keys': makeCacheableSignalKeyStore(_0x4a826f['keys'], _0x0_0x3349bf({ 'level': 'fatal' })['child']({ 'level': 'fatal' }))
            },
            'markOnlineOnConnect': !_0x5574bf,
            'generateHighQualityLinkPreview': !![],
            'syncFullHistory': ![],
            'getMessage': async _0x57a7d7 => {
                const _0x41e203 = jidNormalizedUser(_0x57a7d7['remoteJid']);
                const _0x21bf18 = await _0x0_0x5dced9['loadMessage'](_0x41e203, _0x57a7d7['id']);
                return _0x21bf18?.['message'] || '';
            },
            'msgRetryCounterCache': _0x4fff0a,
            'defaultQueryTimeoutMs': 0xea60,
            'connectTimeoutMs': 0xea60,
            'keepAliveIntervalMs': 0x2710
        });
        _0x375ed8['store'] = _0x0_0x5dced9;
        const _0x56424d = _0x375ed8['sendPresenceUpdate'];
        const _0x2c49a3 = _0x375ed8['readMessages'];
        const _0x11aae1 = _0x375ed8['sendReceipt'];
        _0x375ed8['sendPresenceUpdate'] = async function (..._0x24a1d2) {
            const _0x3b96e5 = await _0x0_0x5dced9['getSetting']('global', 'stealthMode');
            if (_0x3b96e5 && _0x3b96e5['enabled']) {
                printLog('info', '👻\x20Blocked\x20presence\x20update\x20(stealth\x20mode)');
                return;
            }
            return _0x56424d['apply'](this, _0x24a1d2);
        };
        _0x375ed8['readMessages'] = async function (..._0x59c852) {
            const _0x4ea181 = await _0x0_0x5dced9['getSetting']('global', 'stealthMode');
            if (_0x4ea181 && _0x4ea181['enabled'])
                return;
            return _0x2c49a3['apply'](this, _0x59c852);
        };
        if (_0x11aae1) {
            _0x375ed8['sendReceipt'] = async function (..._0x4392ac) {
                const _0x4dd94d = await _0x0_0x5dced9['getSetting']('global', 'stealthMode');
                if (_0x4dd94d && _0x4dd94d['enabled'])
                    return;
                return _0x11aae1['apply'](this, _0x4392ac);
            };
        }
        const _0x426e58 = _0x375ed8['query'];
        _0x375ed8['query'] = async function (_0x283895, ..._0x3a1dba) {
            const _0x77938a = await _0x0_0x5dced9['getSetting']('global', 'stealthMode');
            if (_0x77938a && _0x77938a['enabled']) {
                if (_0x283895 && _0x283895['tag'] === 'receipt')
                    return;
                if (_0x283895 && _0x283895['attrs'] && (_0x283895['attrs']['type'] === 'read' || _0x283895['attrs']['type'] === 'read-self'))
                    return;
            }
            return _0x426e58['apply'](this, [
                _0x283895,
                ..._0x3a1dba
            ]);
        };
        _0x375ed8['isGhostMode'] = async () => {
            const _0x3e0af8 = await _0x0_0x5dced9['getSetting']('global', 'stealthMode');
            return _0x3e0af8 && _0x3e0af8['enabled'];
        };
        _0x375ed8['ev']['on']('creds.update', _0x392702);
        _0x0_0x5dced9['bind'](_0x375ed8['ev']);
        _0x375ed8['ev']['on']('messages.upsert', async _0x457f8d => {
            try {
                const _0x5ded3e = _0x457f8d['messages'][0x0];
                if (!_0x5ded3e['message'])
                    return;
                _0x5ded3e['message'] = Object['keys'](_0x5ded3e['message'])[0x0] === 'ephemeralMessage' ? _0x5ded3e['message']['ephemeralMessage']['message'] : _0x5ded3e['message'];
                if (_0x5ded3e['key'] && _0x5ded3e['key']['remoteJid'] === 'status@broadcast') {
                    await handleStatus(_0x375ed8, _0x457f8d);
                    return;
                }
                if (!_0x375ed8['public'] && !_0x5ded3e['key']['fromMe'] && _0x457f8d['type'] === 'notify') {
                    const _0x1c06a8 = _0x5ded3e['key']?.['remoteJid']?.['endsWith']('@g.us');
                    if (!_0x1c06a8)
                        return;
                }
                if (_0x5ded3e['key']['id']['startsWith']('BAE5') && _0x5ded3e['key']['id']['length'] === 0x10)
                    return;
                if (_0x375ed8?.['msgRetryCounterCache']) {
                    _0x375ed8['msgRetryCounterCache']['clear']();
                }
                try {
                    await handleMessages(_0x375ed8, _0x457f8d);
                } catch (_0x28532c) {
                    printLog('error', 'Error\x20in\x20handleMessages:\x20' + _0x28532c['message']);
                    if (_0x5ded3e['key'] && _0x5ded3e['key']['remoteJid']) {
                        await _0x375ed8['sendMessage'](_0x5ded3e['key']['remoteJid'], {
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
            } catch (_0x4b36af) {
                printLog('error', 'Error\x20in\x20messages.upsert:\x20' + _0x4b36af['message']);
            }
        });
        _0x375ed8['decodeJid'] = _0x374cfe => {
            if (!_0x374cfe)
                return _0x374cfe;
            if (/:\d+@/gi['test'](_0x374cfe)) {
                const _0x3c5984 = jidDecode(_0x374cfe) || {};
                return _0x3c5984['user'] && _0x3c5984['server'] && _0x3c5984['user'] + '@' + _0x3c5984['server'] || _0x374cfe;
            } else
                return _0x374cfe;
        };
        _0x375ed8['ev']['on']('contacts.update', _0x28eeae => {
            for (const _0x398763 of _0x28eeae) {
                const _0x1c6fdf = _0x375ed8['decodeJid'](_0x398763['id']);
                if (_0x0_0x5dced9 && _0x0_0x5dced9['contacts'])
                    _0x0_0x5dced9['contacts'][_0x1c6fdf] = {
                        'id': _0x1c6fdf,
                        'name': _0x398763['notify']
                    };
            }
        });
        _0x375ed8['getName'] = (_0x56e31a, _0x32414b = ![]) => {
            const _0x2d10de = _0x375ed8['decodeJid'](_0x56e31a);
            _0x32414b = _0x375ed8['withoutContact'] || _0x32414b;
            let _0x22db7f;
            if (_0x2d10de['endsWith']('@g.us'))
                return new Promise(async _0x11840e => {
                    _0x22db7f = _0x0_0x5dced9['contacts'][_0x2d10de] || {};
                    if (!(_0x22db7f['name'] || _0x22db7f['subject']))
                        _0x22db7f = _0x375ed8['groupMetadata'](_0x2d10de) || {};
                    _0x11840e(_0x22db7f['name'] || _0x22db7f['subject'] || _0x0_0x5d83c2('+' + _0x2d10de['replace']('@s.whatsapp.net', ''))['number']?.['international']);
                });
            else
                _0x22db7f = _0x2d10de === '0@s.whatsapp.net' ? {
                    'id': _0x2d10de,
                    'name': 'WhatsApp'
                } : _0x2d10de === _0x375ed8['decodeJid'](_0x375ed8['user']['id']) ? _0x375ed8['user'] : _0x0_0x5dced9['contacts'][_0x2d10de] || {};
            return (_0x32414b ? '' : _0x22db7f['name']) || _0x22db7f['subject'] || _0x22db7f['verifiedName'] || _0x0_0x5d83c2('+' + _0x56e31a['replace']('@s.whatsapp.net', ''))['number']?.['international'];
        };
        _0x375ed8['public'] = !![];
        _0x375ed8['serializeM'] = _0x48eba7 => smsg(_0x375ed8, _0x48eba7, _0x0_0x5dced9);
        const _0x1f1f00 = _0x4a826f['creds']?.['registered'] === !![];
        if (_0x1f1f00) {
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
        _0x375ed8['ev']['on']('connection.update', async _0x5adb36 => {
            const {
                connection: _0x14002b,
                lastDisconnect: _0x7a2546,
                qr: _0x50ba5d
            } = _0x5adb36;
            if (_0x14002b === 'open') {
                printLog('success', 'Bot\x20connected\x20successfully!');
                try {
                    const _0x302d1f = await _0x0_0x5dced9['getBotMode']();
                    const _0xae9110 = process['uptime']();
                    const _0x5c7f58 = Math['floor'](_0xae9110 / 0xe10);
                    const _0x294d11 = Math['floor'](_0xae9110 % 0xe10 / 0x3c);
                    const _0x51b48f = 'https://raw.githubusercontent.com/NOSTRA-DevOps/Nova-MD/refs/heads/main/assets/logo.PNG';
                    let _0x1726b7 = null;
                    try {
                        const _0x32229a = await fetch(_0x51b48f);
                        if (_0x32229a['ok']) {
                            const _0x5e9c9a = await _0x32229a['arrayBuffer']();
                            _0x1726b7 = Buffer['from'](_0x5e9c9a);
                        }
                    } catch (_0x2cfa5a) {
                        const _0x4b80d0 = _0x0_0x1ccbed['join'](process['cwd'](), 'assets', 'logo.PNG');
                        if (_0x0_0x240dcb['existsSync'](_0x4b80d0)) {
                            _0x1726b7 = _0x0_0x240dcb['readFileSync'](_0x4b80d0);
                        }
                    }
                    let _0x5c13a3 = '╭━━『\x20*' + (_0x0_0x128b18['botName'] || 'NOVA-MD') + '\x20INFO*\x20』━⬣\x0a';
                    _0x5c13a3 += '┃\x0a';
                    _0x5c13a3 += '┃\x20✨\x20*Status:*\x20✅\x20ONLINE\x0a';
                    _0x5c13a3 += '┃\x20🤖\x20*Version:*\x20' + (_0x0_0x128b18['version'] || '2.5.0') + '\x20(Stable)\x0a';
                    _0x5c13a3 += '┃\x20⚙️\x20*Mode:*\x20' + _0x302d1f['toUpperCase']() + '\x0a';
                    _0x5c13a3 += '┃\x20⏰\x20*Uptime:*\x20' + _0x5c7f58 + 'h\x20' + _0x294d11 + 'm\x0a';
                    _0x5c13a3 += '┃\x20📊\x20*Prefixes:*\x20' + _0x0_0x128b18['prefixes']['join']('\x20') + '\x0a';
                    _0x5c13a3 += '┃\x20📦\x20*Plugins:*\x20' + _0x0_0x2adf44['commands']['size'] + '\x0a';
                    _0x5c13a3 += '┃\x20💾\x20*Storage:*\x20' + _0x0_0x5dced9['getStats']()['backend']['toUpperCase']() + '\x0a';
                    _0x5c13a3 += '┃\x0a';
                    _0x5c13a3 += '┃━━━━━━━━━━━━━━━━━━⬣\x0a';
                    _0x5c13a3 += '┃\x0a';
                    _0x5c13a3 += '┃\x20🌐\x20*JOIN\x20CHANNELS*\x0a';
                    _0x5c13a3 += '┃\x0a';
                    _0x5c13a3 += '┃\x20💬\x20*FaceBook:*\x0a';
                    _0x5c13a3 += '┃\x20https://www.facebook.com/profile.php?id=61591828051151\x0a';
                    _0x5c13a3 += '┃\x0a';
                    _0x5c13a3 += '┃\x20📱\x20*Telegram:*\x0a';
                    _0x5c13a3 += '┃\x20https://t.me/addlist/CpQzYQfWwwxmYTk0\x0a';
                    _0x5c13a3 += '┃\x0a';
                    _0x5c13a3 += '┃\x20▶️\x20*YouTube:*\x0a';
                    _0x5c13a3 += '┃\x20https://youtube.com/@labokingfreesurf\x0a';
                    _0x5c13a3 += '┃\x0a';
                    _0x5c13a3 += '┃━━━━━━━━━━━━━━━━━━⬣\x0a';
                    _0x5c13a3 += '┃\x0a';
                    _0x5c13a3 += '┃\x20✨\x20_Powered\x20by\x20NOSTRA._\x0a';
                    _0x5c13a3 += '╰━━━━━━━━━━━━━━⬣';
                    const _0x3db19b = _0x375ed8['user']['id']['split'](':')[0x0] + '@s.whatsapp.net';
                    if (_0x1726b7) {
                        await _0x375ed8['sendMessage'](_0x3db19b, {
                            'image': _0x1726b7,
                            'caption': _0x5c13a3,
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
                        await _0x375ed8['sendMessage'](_0x3db19b, {
                            'text': _0x5c13a3,
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
                } catch (_0x28304a) {
                    printLog('error', 'Failed\x20to\x20send\x20automatic\x20about\x20message:\x20' + _0x28304a['message']);
                }
                const _0x5b794c = await _0x0_0x5dced9['getSetting']('global', 'stealthMode');
                if (_0x5b794c && _0x5b794c['enabled']) {
                    printLog('info', '👻\x20STEALTH\x20MODE\x20ACTIVE');
                }
                printLog('success', 'Connected\x20to\x20=>\x20' + JSON['stringify'](_0x375ed8['user'], null, 0x2));
                await delay(0x7cf);
                try {
                    owner = JSON['parse'](_0x0_0x240dcb['readFileSync']('./data/owner.json', 'utf-8'));
                } catch (_0x4954e9) {
                }
                printLog('info', '[\x20' + (_0x0_0x128b18['botName'] || 'NOVA-MD') + '\x20]');
                printLog('info', 'WA\x20NUMBER\x20\x20:\x20' + (owner[0x0] || _0x0_0x128b18['ownerNumber'] || ''));
                printLog('success', 'Bot\x20Connected\x20Successfully!');
                printLog('info', 'Plugins\x20\x20\x20:\x20' + _0x0_0x2adf44['commands']['size']);
                printLog('info', 'Prefixes\x20\x20\x20:\x20' + _0x0_0x128b18['prefixes']['join'](',\x20'));
                printLog('store', 'Backend\x20\x20\x20\x20:\x20' + _0x0_0x5dced9['getStats']()['backend']);
                console['log']();
            }
            if (_0x14002b === 'close') {
                const _0xa73726 = _0x7a2546?.['error']?.['output']?.['statusCode'];
                const _0x36c1b5 = _0xa73726 !== DisconnectReason['loggedOut'] && _0xa73726 !== 0x191;
                if (_0xa73726 === DisconnectReason['loggedOut'] || _0xa73726 === 0x191) {
                    try {
                        rmSync('./session', {
                            'recursive': !![],
                            'force': !![]
                        });
                    } catch (_0x3c8f8f) {
                    }
                    await delay(0xbb8);
                    startNovaXCode();
                    return;
                }
                if (_0x36c1b5) {
                    printLog('connection', 'Reconnecting\x20in\x205\x20seconds...');
                    await delay(0x1388);
                    startNovaXCode();
                }
            }
        });
        _0x375ed8['ev']['on']('call', async _0x14be00 => {
            await handleCall(_0x375ed8, _0x14be00);
        });
        _0x375ed8['ev']['on']('group-participants.update', async _0x17742a => {
            await handleGroupParticipantUpdate(_0x375ed8, _0x17742a);
        });
        _0x375ed8['ev']['on']('status.update', async _0x20d33d => {
            await handleStatus(_0x375ed8, _0x20d33d);
        });
        _0x375ed8['ev']['on']('messages.reaction', async _0x549bb4 => {
            await handleStatus(_0x375ed8, _0x549bb4);
        });
        return _0x375ed8;
    } catch (_0x4bdb0b) {
        printLog('error', 'Error\x20in\x20startNovaXCode:\x20' + _0x4bdb0b['message']);
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
    printLog('info', '📱\x20Open\x20http://localhost:' + (_0x0_0x128b18['port'] || 0x1388) + '/pairing\x20in\x20your\x20browser\x20if\x20it\x27s\x20local');
    printLog('info', '📱\x20For\x20web\x20servic\x20deployment,\x20click\x20the\x20service\x20URL\x20and\x20add\x20/pairing\x20at\x20the\x20end');
    const _0x342a7d = 0x1e * 0x3c * 0x3e8;
    const _0x44923e = Date['now']();
    const _0x269368 = 0xbb8;
    return new Promise((_0x50a9e8, _0x4e6313) => {
        const _0x431886 = setInterval(() => {
            if (hasValidSession()) {
                clearInterval(_0x431886);
                printLog('success', '✅\x20Session\x20detected!\x20Starting\x20bot...');
                _0x50a9e8();
            }
            if (Date['now']() - _0x44923e > _0x342a7d) {
                clearInterval(_0x431886);
                _0x4e6313(new Error('Session\x20creation\x20timeout\x20(30\x20minutes)'));
            }
        }, _0x269368);
    });
}
async function main() {
    await compileAll();
    await _0x0_0x2adf44['loadCommands']();
    printLog('info', 'Starting\x20NOVA-MD\x20BOT...');
    if (hasValidSession()) {
        printLog('success', '✅\x20Valid\x20session\x20found,\x20starting\x20bot...');
        await delay(0xbb8);
        startNovaXCode()['catch'](_0x2c79f9 => {
            printLog('error', 'Fatal\x20error:\x20' + _0x2c79f9['message']);
            if (rl && !rlClosed)
                rl['close']();
            process['exit'](0x1);
        });
    } else {
        printLog('info', '🌐\x20No\x20session\x20found.\x20Launching\x20web\x20pairing\x20interface...');
        printLog('info', '📱\x20Open\x20http://localhost:' + (_0x0_0x128b18['port'] || 0x1388) + '/pairing\x20in\x20your\x20browser\x20to\x20connect\x20WhatsApp');
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
            startNovaXCode()['catch'](_0x3b3626 => {
                printLog('error', 'Fatal\x20error:\x20' + _0x3b3626['message']);
                if (rl && !rlClosed)
                    rl['close']();
                process['exit'](0x1);
            });
        } catch (_0xf3f8ad) {
            printLog('error', 'Session\x20creation\x20failed:\x20' + _0xf3f8ad['message']);
            if (rl && !rlClosed)
                rl['close']();
            process['exit'](0x1);
        }
    }
}
main();
const sessionDir = _0x0_0x1ccbed['join'](process['cwd'](), 'session');
setInterval(() => {
    if (!_0x0_0x240dcb['existsSync'](sessionDir))
        return;
    _0x0_0x240dcb['readdir'](sessionDir, (_0x13918d, _0x396fb5) => {
        if (_0x13918d)
            return;
        for (const _0x230059 of _0x396fb5) {
            if (_0x230059 === 'creds.json')
                continue;
            if (_0x230059['startsWith']('app-state-sync-key-'))
                continue;
            _0x0_0x240dcb['unlink'](_0x0_0x1ccbed['join'](sessionDir, _0x230059), () => {
            });
        }
    });
}, 0x3 * 0x3c * 0x3e8);
const customTemp = _0x0_0x1ccbed['join'](process['cwd'](), 'temp');
if (!_0x0_0x240dcb['existsSync'](customTemp))
    _0x0_0x240dcb['mkdirSync'](customTemp, { 'recursive': !![] });
process.env.TMPDIR = customTemp;
process.env.TEMP = customTemp;
process.env.TMP = customTemp;
setInterval(() => {
    _0x0_0x240dcb['readdir'](customTemp, (_0xfc4949, _0x431b89) => {
        if (_0xfc4949)
            return;
        for (const _0x4f4117 of _0x431b89) {
            const _0x47c9ef = _0x0_0x1ccbed['join'](customTemp, _0x4f4117);
            _0x0_0x240dcb['stat'](_0x47c9ef, (_0xbd181, _0x4d95fc) => {
                if (!_0xbd181 && Date['now']() - _0x4d95fc['mtimeMs'] > 0x3 * 0x3c * 0x3c * 0x3e8) {
                    _0x0_0x240dcb['unlink'](_0x47c9ef, () => {
                    });
                }
            });
        }
    });
}, 0x1 * 0x3c * 0x3c * 0x3e8);
const folders = [
    _0x0_0x1ccbed['join'](__dirname, './lib'),
    _0x0_0x1ccbed['join'](__dirname, './plugins')
];
folders['forEach'](_0x589d30 => {
    if (!_0x0_0x240dcb['existsSync'](_0x589d30))
        return;
    _0x0_0x240dcb['readdirSync'](_0x589d30)['filter'](_0x5caee4 => _0x5caee4['endsWith']('.js'))['forEach'](_0x51c5b1 => {
        const _0x56c525 = _0x0_0x1ccbed['join'](_0x589d30, _0x51c5b1);
        try {
            const _0x2f835d = _0x0_0x240dcb['readFileSync'](_0x56c525, 'utf-8');
            const _0x15c082 = _0x0_0x1c5b7e(_0x2f835d, _0x51c5b1, {
                'sourceType': 'module',
                'allowAwaitOutsideFunction': !![]
            });
            if (_0x15c082) {
                console['error'](_0x0_0x20b265['red']('❌\x20Syntax\x20error\x20in\x20' + _0x56c525 + ':\x0a' + _0x15c082));
            }
        } catch (_0x2daa15) {
            console['error'](_0x0_0x20b265['yellow']('⚠️\x20Cannot\x20read\x20file\x20' + _0x56c525 + ':\x0a' + _0x2daa15));
        }
    });
});
process['on']('uncaughtException', _0x4cab42 => {
    printLog('error', 'Uncaught\x20Exception:\x20' + _0x4cab42['message']);
    console['error'](_0x4cab42['stack']);
    writeErrorLog({
        'type': 'uncaughtException',
        'error': _0x4cab42['message'],
        'stack': _0x4cab42['stack'],
        'timestamp': new Date()['toISOString']()
    });
});
process['on']('unhandledRejection', _0x1622aa => {
    printLog('error', 'Unhandled\x20Rejection:\x20' + _0x1622aa['message']);
    console['error'](_0x1622aa['stack']);
    writeErrorLog({
        'type': 'unhandledRejection',
        'error': _0x1622aa['message'],
        'stack': _0x1622aa['stack'],
        'timestamp': new Date()['toISOString']()
    });
});
server['on']('error', _0x526fcf => {
    if (_0x526fcf['code'] === 'EADDRINUSE') {
        printLog('error', 'Address\x20localhost:' + PORT + '\x20in\x20use');
        writeErrorLog({
            'type': 'serverError',
            'error': 'Address\x20localhost:' + PORT + '\x20in\x20use',
            'timestamp': new Date()['toISOString']()
        });
        server['close']();
    } else {
        printLog('error', 'Server\x20error:\x20' + _0x526fcf['message']);
        writeErrorLog({
            'type': 'serverError',
            'error': _0x526fcf['message'],
            'stack': _0x526fcf['stack'],
            'timestamp': new Date()['toISOString']()
        });
    }
});