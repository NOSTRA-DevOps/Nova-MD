import 'dotenv/config';
import _0x0_0x4f74aa, {
    existsSync,
    mkdirSync,
    rmSync
} from 'fs';
import _0x0_0x30d644, { dirname } from 'path';
import _0x0_0xb7a62a from 'chalk';
import _0x0_0x4fa705 from 'syntax-error';
import { parsePhoneNumber as _0x0_0x4ddeee } from 'awesome-phonenumber';
import _0x0_0x2e7286 from 'readline';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { smsg } from './lib/myfunc.js';
import { compileAll } from './lib/compile.js';
import _0x0_0x4b0049, {
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    Browsers,
    jidDecode,
    jidNormalizedUser,
    makeCacheableSignalKeyStore,
    delay
} from '@whiskeysockets/baileys';
import _0x0_0x27d517 from 'node-cache';
import _0x0_0x188c77 from 'pino';
import _0x0_0x5e062d from './config.js';
import _0x0_0x4276ab from './lib/lightweight_store.js';
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
import _0x0_0x225126 from './lib/commandHandler.js';
import _0x0_0x4e9f57 from './lib/sessionManager.js';
_0x0_0x4276ab['readFromFile']();
setInterval(() => _0x0_0x4276ab['writeToFile'](), _0x0_0x5e062d['storeWriteInterval'] || 0x2710);
setInterval(() => {
    if (global['gc']) {
        global['gc']();
        console['log']('🧹\x20Garbage\x20collection\x20completed');
    }
}, 0xea60);
setInterval(() => {
    const _0x2ac197 = process['memoryUsage']()['rss'] / 0x400 / 0x400;
    if (_0x2ac197 > 0x190) {
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
_0x0_0x4f74aa['mkdirSync']('./data', { 'recursive': !![] });
for (const [file, def] of Object['entries'](DATA_DEFAULTS)) {
    const fp = './data/' + file;
    if (!_0x0_0x4f74aa['existsSync'](fp))
        _0x0_0x4f74aa['writeFileSync'](fp, JSON['stringify'](def, null, 0x2));
}
let owner = [];
try {
    owner = JSON['parse'](_0x0_0x4f74aa['readFileSync']('./data/owner.json', 'utf-8'));
} catch {
    owner = [];
}
global['botname'] = _0x0_0x5e062d['botName'] || 'NOVA-MD';
global['themeemoji'] = '•';
const pairingCode = ![];
const useMobile = process['argv']['includes']('--mobile');
let rl = null;
let rlClosed = ![];
if (process['stdin']['isTTY'] && !_0x0_0x5e062d['pairingNumber']) {
    rl = _0x0_0x2e7286['createInterface']({
        'input': process['stdin'],
        'output': process['stdout']
    });
    rl['on']('close', () => {
        rlClosed = !![];
    });
}
const question = _0x187ed1 => {
    if (rl && !rlClosed) {
        return new Promise(_0x15fc10 => rl['question'](_0x187ed1, _0x15fc10));
    } else {
        return Promise['resolve'](_0x0_0x5e062d['ownerNumber'] || '237676250509');
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
    const _0x325f5c = _0x0_0x30d644['join'](__dirname, 'session');
    if (!existsSync(_0x325f5c)) {
        mkdirSync(_0x325f5c, { 'recursive': !![] });
    }
    return _0x325f5c;
}
function hasValidSession() {
    return _0x0_0x4e9f57['hasValidSession']();
}
server['listen'](PORT, () => {
    printLog('success', 'Server\x20listening\x20on\x20port\x20' + PORT);
    printLog('info', '🌐\x20Web\x20interface\x20available\x20at:\x20http://localhost:' + PORT + '/pairing');
});
async function startNovaXCode() {
    try {
        const {version: _0x42da76} = await fetchLatestBaileysVersion();
        ensureSessionDirectory();
        await delay(0x3e8);
        const {
            state: _0x3b4dc4,
            saveCreds: _0x19fe8c
        } = await useMultiFileAuthState('./session');
        const _0xd05dae = async () => {
            ensureSessionDirectory();
            await _0x19fe8c();
        };
        const _0x100b25 = new _0x0_0x27d517();
        const _0x40eff3 = await _0x0_0x4276ab['getSetting']('global', 'stealthMode');
        const _0x3b33e1 = _0x40eff3 && _0x40eff3['enabled'];
        const _0x1c6291 = _0x0_0x4b0049({
            'version': _0x42da76,
            'logger': _0x0_0x188c77({ 'level': 'silent' }),
            'browser': Browsers['macOS']('Chrome'),
            'auth': {
                'creds': _0x3b4dc4['creds'],
                'keys': makeCacheableSignalKeyStore(_0x3b4dc4['keys'], _0x0_0x188c77({ 'level': 'fatal' })['child']({ 'level': 'fatal' }))
            },
            'markOnlineOnConnect': !_0x3b33e1,
            'generateHighQualityLinkPreview': !![],
            'syncFullHistory': ![],
            'getMessage': async _0x4503ee => {
                const _0x19755a = jidNormalizedUser(_0x4503ee['remoteJid']);
                const _0x4a41a7 = await _0x0_0x4276ab['loadMessage'](_0x19755a, _0x4503ee['id']);
                return _0x4a41a7?.['message'] || '';
            },
            'msgRetryCounterCache': _0x100b25,
            'defaultQueryTimeoutMs': 0xea60,
            'connectTimeoutMs': 0xea60,
            'keepAliveIntervalMs': 0x2710
        });
        _0x1c6291['store'] = _0x0_0x4276ab;
        const _0x664e50 = _0x1c6291['sendPresenceUpdate'];
        const _0x3f5b43 = _0x1c6291['readMessages'];
        const _0x4ea909 = _0x1c6291['sendReceipt'];
        _0x1c6291['sendPresenceUpdate'] = async function (..._0x3ebb1f) {
            const _0x28a9ac = await _0x0_0x4276ab['getSetting']('global', 'stealthMode');
            if (_0x28a9ac && _0x28a9ac['enabled']) {
                printLog('info', '👻\x20Blocked\x20presence\x20update\x20(stealth\x20mode)');
                return;
            }
            return _0x664e50['apply'](this, _0x3ebb1f);
        };
        _0x1c6291['readMessages'] = async function (..._0x54e598) {
            const _0x3ff1e7 = await _0x0_0x4276ab['getSetting']('global', 'stealthMode');
            if (_0x3ff1e7 && _0x3ff1e7['enabled'])
                return;
            return _0x3f5b43['apply'](this, _0x54e598);
        };
        if (_0x4ea909) {
            _0x1c6291['sendReceipt'] = async function (..._0x271f2e) {
                const _0xeb65f7 = await _0x0_0x4276ab['getSetting']('global', 'stealthMode');
                if (_0xeb65f7 && _0xeb65f7['enabled'])
                    return;
                return _0x4ea909['apply'](this, _0x271f2e);
            };
        }
        const _0x4f87ac = _0x1c6291['query'];
        _0x1c6291['query'] = async function (_0x14d85e, ..._0x59de3d) {
            const _0x5bb607 = await _0x0_0x4276ab['getSetting']('global', 'stealthMode');
            if (_0x5bb607 && _0x5bb607['enabled']) {
                if (_0x14d85e && _0x14d85e['tag'] === 'receipt')
                    return;
                if (_0x14d85e && _0x14d85e['attrs'] && (_0x14d85e['attrs']['type'] === 'read' || _0x14d85e['attrs']['type'] === 'read-self'))
                    return;
            }
            return _0x4f87ac['apply'](this, [
                _0x14d85e,
                ..._0x59de3d
            ]);
        };
        _0x1c6291['isGhostMode'] = async () => {
            const _0x1b0680 = await _0x0_0x4276ab['getSetting']('global', 'stealthMode');
            return _0x1b0680 && _0x1b0680['enabled'];
        };
        _0x1c6291['ev']['on']('creds.update', _0xd05dae);
        _0x0_0x4276ab['bind'](_0x1c6291['ev']);
        _0x1c6291['ev']['on']('messages.upsert', async _0x12e853 => {
            try {
                const _0x2f70ea = _0x12e853['messages'][0x0];
                if (!_0x2f70ea['message'])
                    return;
                _0x2f70ea['message'] = Object['keys'](_0x2f70ea['message'])[0x0] === 'ephemeralMessage' ? _0x2f70ea['message']['ephemeralMessage']['message'] : _0x2f70ea['message'];
                if (_0x2f70ea['key'] && _0x2f70ea['key']['remoteJid'] === 'status@broadcast') {
                    await handleStatus(_0x1c6291, _0x12e853);
                    return;
                }
                if (!_0x1c6291['public'] && !_0x2f70ea['key']['fromMe'] && _0x12e853['type'] === 'notify') {
                    const _0x188308 = _0x2f70ea['key']?.['remoteJid']?.['endsWith']('@g.us');
                    if (!_0x188308)
                        return;
                }
                if (_0x2f70ea['key']['id']['startsWith']('BAE5') && _0x2f70ea['key']['id']['length'] === 0x10)
                    return;
                if (_0x1c6291?.['msgRetryCounterCache']) {
                    _0x1c6291['msgRetryCounterCache']['clear']();
                }
                try {
                    await handleMessages(_0x1c6291, _0x12e853);
                } catch (_0x21d025) {
                    printLog('error', 'Error\x20in\x20handleMessages:\x20' + _0x21d025['message']);
                    if (_0x2f70ea['key'] && _0x2f70ea['key']['remoteJid']) {
                        await _0x1c6291['sendMessage'](_0x2f70ea['key']['remoteJid'], {
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
            } catch (_0x4a2168) {
                printLog('error', 'Error\x20in\x20messages.upsert:\x20' + _0x4a2168['message']);
            }
        });
        _0x1c6291['decodeJid'] = _0x11fc1c => {
            if (!_0x11fc1c)
                return _0x11fc1c;
            if (/:\d+@/gi['test'](_0x11fc1c)) {
                const _0x45b526 = jidDecode(_0x11fc1c) || {};
                return _0x45b526['user'] && _0x45b526['server'] && _0x45b526['user'] + '@' + _0x45b526['server'] || _0x11fc1c;
            } else
                return _0x11fc1c;
        };
        _0x1c6291['ev']['on']('contacts.update', _0x50ddd7 => {
            for (const _0x2debcc of _0x50ddd7) {
                const _0xf245c4 = _0x1c6291['decodeJid'](_0x2debcc['id']);
                if (_0x0_0x4276ab && _0x0_0x4276ab['contacts'])
                    _0x0_0x4276ab['contacts'][_0xf245c4] = {
                        'id': _0xf245c4,
                        'name': _0x2debcc['notify']
                    };
            }
        });
        _0x1c6291['getName'] = (_0x2c7488, _0x55bcaf = ![]) => {
            const _0x2e2c04 = _0x1c6291['decodeJid'](_0x2c7488);
            _0x55bcaf = _0x1c6291['withoutContact'] || _0x55bcaf;
            let _0x88ae92;
            if (_0x2e2c04['endsWith']('@g.us'))
                return new Promise(async _0x432683 => {
                    _0x88ae92 = _0x0_0x4276ab['contacts'][_0x2e2c04] || {};
                    if (!(_0x88ae92['name'] || _0x88ae92['subject']))
                        _0x88ae92 = _0x1c6291['groupMetadata'](_0x2e2c04) || {};
                    _0x432683(_0x88ae92['name'] || _0x88ae92['subject'] || _0x0_0x4ddeee('+' + _0x2e2c04['replace']('@s.whatsapp.net', ''))['number']?.['international']);
                });
            else
                _0x88ae92 = _0x2e2c04 === '0@s.whatsapp.net' ? {
                    'id': _0x2e2c04,
                    'name': 'WhatsApp'
                } : _0x2e2c04 === _0x1c6291['decodeJid'](_0x1c6291['user']['id']) ? _0x1c6291['user'] : _0x0_0x4276ab['contacts'][_0x2e2c04] || {};
            return (_0x55bcaf ? '' : _0x88ae92['name']) || _0x88ae92['subject'] || _0x88ae92['verifiedName'] || _0x0_0x4ddeee('+' + _0x2c7488['replace']('@s.whatsapp.net', ''))['number']?.['international'];
        };
        _0x1c6291['public'] = !![];
        _0x1c6291['serializeM'] = _0x4dbf1c => smsg(_0x1c6291, _0x4dbf1c, _0x0_0x4276ab);
        const _0x37ea23 = _0x3b4dc4['creds']?.['registered'] === !![];
        if (_0x37ea23) {
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
        _0x1c6291['ev']['on']('connection.update', async _0x3dfcb5 => {
            const {
                connection: _0x5239c8,
                lastDisconnect: _0x4f9a73,
                qr: _0x451abd
            } = _0x3dfcb5;
            if (_0x5239c8 === 'open') {
                printLog('success', 'Bot\x20connected\x20successfully!');
                try {
                    const _0x13142d = await _0x0_0x4276ab['getBotMode']();
                    const _0x2d7b5f = process['uptime']();
                    const _0x780763 = Math['floor'](_0x2d7b5f / 0xe10);
                    const _0x11c700 = Math['floor'](_0x2d7b5f % 0xe10 / 0x3c);
                    const _0x2bbe32 = 'https://raw.githubusercontent.com/NOVA-X-Code/Nova-MD/refs/heads/main/assets/logo.PNG';
                    let _0x2cd80e = null;
                    try {
                        const _0x5af46d = await fetch(_0x2bbe32);
                        if (_0x5af46d['ok']) {
                            const _0x566692 = await _0x5af46d['arrayBuffer']();
                            _0x2cd80e = Buffer['from'](_0x566692);
                        }
                    } catch (_0x3c681f) {
                        const _0x2301c5 = _0x0_0x30d644['join'](process['cwd'](), 'assets', 'logo.PNG');
                        if (_0x0_0x4f74aa['existsSync'](_0x2301c5)) {
                            _0x2cd80e = _0x0_0x4f74aa['readFileSync'](_0x2301c5);
                        }
                    }
                    let _0x188ede = '╭━━『\x20*' + (_0x0_0x5e062d['botName'] || 'NOVA-MD') + '\x20INFO*\x20』━⬣\x0a';
                    _0x188ede += '┃\x0a';
                    _0x188ede += '┃\x20✨\x20*Status:*\x20✅\x20ONLINE\x0a';
                    _0x188ede += '┃\x20🤖\x20*Version:*\x20' + (_0x0_0x5e062d['version'] || '2.5.0') + '\x20(Stable)\x0a';
                    _0x188ede += '┃\x20⚙️\x20*Mode:*\x20' + _0x13142d['toUpperCase']() + '\x0a';
                    _0x188ede += '┃\x20⏰\x20*Uptime:*\x20' + _0x780763 + 'h\x20' + _0x11c700 + 'm\x0a';
                    _0x188ede += '┃\x20📊\x20*Prefixes:*\x20' + _0x0_0x5e062d['prefixes']['join']('\x20') + '\x0a';
                    _0x188ede += '┃\x20📦\x20*Plugins:*\x20' + _0x0_0x225126['commands']['size'] + '\x0a';
                    _0x188ede += '┃\x20💾\x20*Storage:*\x20' + _0x0_0x4276ab['getStats']()['backend']['toUpperCase']() + '\x0a';
                    _0x188ede += '┃\x0a';
                    _0x188ede += '┃━━━━━━━━━━━━━━━━━━⬣\x0a';
                    _0x188ede += '┃\x0a';
                    _0x188ede += '┃\x20🌐\x20*JOIN\x20CHANNELS*\x0a';
                    _0x188ede += '┃\x0a';
                    _0x188ede += '┃\x20💬\x20*FaceBook:*\x0a';
                    _0x188ede += '┃\x20https://www.facebook.com/profile.php?id=61591828051151\x0a';
                    _0x188ede += '┃\x0a';
                    _0x188ede += '┃\x20📱\x20*Telegram:*\x0a';
                    _0x188ede += '┃\x20https://t.me/addlist/CpQzYQfWwwxmYTk0\x0a';
                    _0x188ede += '┃\x0a';
                    _0x188ede += '┃\x20▶️\x20*YouTube:*\x0a';
                    _0x188ede += '┃\x20https://youtube.com/@labokingfreesurf\x0a';
                    _0x188ede += '┃\x0a';
                    _0x188ede += '┃━━━━━━━━━━━━━━━━━━⬣\x0a';
                    _0x188ede += '┃\x0a';
                    _0x188ede += '┃\x20✨\x20_Powered\x20by\x20NOSTRA._\x0a';
                    _0x188ede += '╰━━━━━━━━━━━━━━⬣';
                    const _0x5aea1c = _0x1c6291['user']['id']['split'](':')[0x0] + '@s.whatsapp.net';
                    if (_0x2cd80e) {
                        await _0x1c6291['sendMessage'](_0x5aea1c, {
                            'image': _0x2cd80e,
                            'caption': _0x188ede,
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
                        await _0x1c6291['sendMessage'](_0x5aea1c, {
                            'text': _0x188ede,
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
                } catch (_0x101573) {
                    printLog('error', 'Failed\x20to\x20send\x20automatic\x20about\x20message:\x20' + _0x101573['message']);
                }
                const _0x4ed4f6 = await _0x0_0x4276ab['getSetting']('global', 'stealthMode');
                if (_0x4ed4f6 && _0x4ed4f6['enabled']) {
                    printLog('info', '👻\x20STEALTH\x20MODE\x20ACTIVE');
                }
                printLog('success', 'Connected\x20to\x20=>\x20' + JSON['stringify'](_0x1c6291['user'], null, 0x2));
                await delay(0x7cf);
                try {
                    owner = JSON['parse'](_0x0_0x4f74aa['readFileSync']('./data/owner.json', 'utf-8'));
                } catch (_0x521855) {
                }
                printLog('info', '[\x20' + (_0x0_0x5e062d['botName'] || 'NOVA-MD') + '\x20]');
                printLog('info', 'WA\x20NUMBER\x20\x20:\x20' + (owner[0x0] || _0x0_0x5e062d['ownerNumber'] || ''));
                printLog('success', 'Bot\x20Connected\x20Successfully!');
                printLog('info', 'Plugins\x20\x20\x20:\x20' + _0x0_0x225126['commands']['size']);
                printLog('info', 'Prefixes\x20\x20\x20:\x20' + _0x0_0x5e062d['prefixes']['join'](',\x20'));
                printLog('store', 'Backend\x20\x20\x20\x20:\x20' + _0x0_0x4276ab['getStats']()['backend']);
                console['log']();
            }
            if (_0x5239c8 === 'close') {
                const _0x39dd80 = _0x4f9a73?.['error']?.['output']?.['statusCode'];
                const _0x1770d6 = _0x39dd80 !== DisconnectReason['loggedOut'] && _0x39dd80 !== 0x191;
                if (_0x39dd80 === DisconnectReason['loggedOut'] || _0x39dd80 === 0x191) {
                    try {
                        rmSync('./session', {
                            'recursive': !![],
                            'force': !![]
                        });
                    } catch (_0x3ff49b) {
                    }
                    await delay(0xbb8);
                    startNovaXCode();
                    return;
                }
                if (_0x1770d6) {
                    printLog('connection', 'Reconnecting\x20in\x205\x20seconds...');
                    await delay(0x1388);
                    startNovaXCode();
                }
            }
        });
        _0x1c6291['ev']['on']('call', async _0x50ecb7 => {
            await handleCall(_0x1c6291, _0x50ecb7);
        });
        _0x1c6291['ev']['on']('group-participants.update', async _0x3413d3 => {
            await handleGroupParticipantUpdate(_0x1c6291, _0x3413d3);
        });
        _0x1c6291['ev']['on']('status.update', async _0x11181e => {
            await handleStatus(_0x1c6291, _0x11181e);
        });
        _0x1c6291['ev']['on']('messages.reaction', async _0x67c705 => {
            await handleStatus(_0x1c6291, _0x67c705);
        });
        return _0x1c6291;
    } catch (_0x1e10c1) {
        printLog('error', 'Error\x20in\x20startNovaXCode:\x20' + _0x1e10c1['message']);
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
    printLog('info', '📱\x20Open\x20http://localhost:' + (_0x0_0x5e062d['port'] || 0x1388) + '/pairing\x20in\x20your\x20browser\x20if\x20it\x27s\x20local');
    printLog('info', '📱\x20For\x20web\x20servic\x20deployment,\x20click\x20the\x20service\x20URL\x20and\x20add\x20/pairing\x20at\x20the\x20end');
    const _0x350953 = 0x1e * 0x3c * 0x3e8;
    const _0x1e8dc9 = Date['now']();
    const _0x2e1120 = 0xbb8;
    return new Promise((_0x19f37b, _0xe3a618) => {
        const _0x47c146 = setInterval(() => {
            if (hasValidSession()) {
                clearInterval(_0x47c146);
                printLog('success', '✅\x20Session\x20detected!\x20Starting\x20bot...');
                _0x19f37b();
            }
            if (Date['now']() - _0x1e8dc9 > _0x350953) {
                clearInterval(_0x47c146);
                _0xe3a618(new Error('Session\x20creation\x20timeout\x20(30\x20minutes)'));
            }
        }, _0x2e1120);
    });
}
async function main() {
    await compileAll();
    await _0x0_0x225126['loadCommands']();
    printLog('info', 'Starting\x20NOVA-MD\x20BOT...');
    if (hasValidSession()) {
        printLog('success', '✅\x20Valid\x20session\x20found,\x20starting\x20bot...');
        await delay(0xbb8);
        startNovaXCode()['catch'](_0x56ca5e => {
            printLog('error', 'Fatal\x20error:\x20' + _0x56ca5e['message']);
            if (rl && !rlClosed)
                rl['close']();
            process['exit'](0x1);
        });
    } else {
        printLog('info', '🌐\x20No\x20session\x20found.\x20Launching\x20web\x20pairing\x20interface...');
        printLog('info', '📱\x20Open\x20http://localhost:' + (_0x0_0x5e062d['port'] || 0x1388) + '/pairing\x20in\x20your\x20browser\x20to\x20connect\x20WhatsApp');
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
            startNovaXCode()['catch'](_0x3a46db => {
                printLog('error', 'Fatal\x20error:\x20' + _0x3a46db['message']);
                if (rl && !rlClosed)
                    rl['close']();
                process['exit'](0x1);
            });
        } catch (_0x507213) {
            printLog('error', 'Session\x20creation\x20failed:\x20' + _0x507213['message']);
            if (rl && !rlClosed)
                rl['close']();
            process['exit'](0x1);
        }
    }
}
main();
const sessionDir = _0x0_0x30d644['join'](process['cwd'](), 'session');
setInterval(() => {
    if (!_0x0_0x4f74aa['existsSync'](sessionDir))
        return;
    _0x0_0x4f74aa['readdir'](sessionDir, (_0x16840c, _0x30d5f1) => {
        if (_0x16840c)
            return;
        for (const _0x20527b of _0x30d5f1) {
            if (_0x20527b === 'creds.json')
                continue;
            if (_0x20527b['startsWith']('app-state-sync-key-'))
                continue;
            _0x0_0x4f74aa['unlink'](_0x0_0x30d644['join'](sessionDir, _0x20527b), () => {
            });
        }
    });
}, 0x3 * 0x3c * 0x3e8);
const customTemp = _0x0_0x30d644['join'](process['cwd'](), 'temp');
if (!_0x0_0x4f74aa['existsSync'](customTemp))
    _0x0_0x4f74aa['mkdirSync'](customTemp, { 'recursive': !![] });
process.env.TMPDIR = customTemp;
process.env.TEMP = customTemp;
process.env.TMP = customTemp;
setInterval(() => {
    _0x0_0x4f74aa['readdir'](customTemp, (_0x3b48b8, _0x3cc838) => {
        if (_0x3b48b8)
            return;
        for (const _0x2a47c2 of _0x3cc838) {
            const _0x4570c0 = _0x0_0x30d644['join'](customTemp, _0x2a47c2);
            _0x0_0x4f74aa['stat'](_0x4570c0, (_0xa09f99, _0x3172b5) => {
                if (!_0xa09f99 && Date['now']() - _0x3172b5['mtimeMs'] > 0x3 * 0x3c * 0x3c * 0x3e8) {
                    _0x0_0x4f74aa['unlink'](_0x4570c0, () => {
                    });
                }
            });
        }
    });
}, 0x1 * 0x3c * 0x3c * 0x3e8);
const folders = [
    _0x0_0x30d644['join'](__dirname, './lib'),
    _0x0_0x30d644['join'](__dirname, './plugins')
];
folders['forEach'](_0x4a84ec => {
    if (!_0x0_0x4f74aa['existsSync'](_0x4a84ec))
        return;
    _0x0_0x4f74aa['readdirSync'](_0x4a84ec)['filter'](_0x17b364 => _0x17b364['endsWith']('.js'))['forEach'](_0x382ae5 => {
        const _0x296ea9 = _0x0_0x30d644['join'](_0x4a84ec, _0x382ae5);
        try {
            const _0x2500bf = _0x0_0x4f74aa['readFileSync'](_0x296ea9, 'utf-8');
            const _0x41c04f = _0x0_0x4fa705(_0x2500bf, _0x382ae5, {
                'sourceType': 'module',
                'allowAwaitOutsideFunction': !![]
            });
            if (_0x41c04f) {
                console['error'](_0x0_0xb7a62a['red']('❌\x20Syntax\x20error\x20in\x20' + _0x296ea9 + ':\x0a' + _0x41c04f));
            }
        } catch (_0x3a724b) {
            console['error'](_0x0_0xb7a62a['yellow']('⚠️\x20Cannot\x20read\x20file\x20' + _0x296ea9 + ':\x0a' + _0x3a724b));
        }
    });
});
process['on']('uncaughtException', _0xb84de2 => {
    printLog('error', 'Uncaught\x20Exception:\x20' + _0xb84de2['message']);
    console['error'](_0xb84de2['stack']);
    writeErrorLog({
        'type': 'uncaughtException',
        'error': _0xb84de2['message'],
        'stack': _0xb84de2['stack'],
        'timestamp': new Date()['toISOString']()
    });
});
process['on']('unhandledRejection', _0x43205f => {
    printLog('error', 'Unhandled\x20Rejection:\x20' + _0x43205f['message']);
    console['error'](_0x43205f['stack']);
    writeErrorLog({
        'type': 'unhandledRejection',
        'error': _0x43205f['message'],
        'stack': _0x43205f['stack'],
        'timestamp': new Date()['toISOString']()
    });
});
server['on']('error', _0x48d362 => {
    if (_0x48d362['code'] === 'EADDRINUSE') {
        printLog('error', 'Address\x20localhost:' + PORT + '\x20in\x20use');
        writeErrorLog({
            'type': 'serverError',
            'error': 'Address\x20localhost:' + PORT + '\x20in\x20use',
            'timestamp': new Date()['toISOString']()
        });
        server['close']();
    } else {
        printLog('error', 'Server\x20error:\x20' + _0x48d362['message']);
        writeErrorLog({
            'type': 'serverError',
            'error': _0x48d362['message'],
            'stack': _0x48d362['stack'],
            'timestamp': new Date()['toISOString']()
        });
    }
});