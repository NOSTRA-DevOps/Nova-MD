import 'dotenv/config';
import _0x0_0x337386, {
    existsSync,
    mkdirSync,
    rmSync
} from 'fs';
import _0x0_0x41ae9e, { dirname } from 'path';
import _0x0_0x405853 from 'chalk';
import _0x0_0x43a334 from 'syntax-error';
import { parsePhoneNumber as _0x0_0x3f358b } from 'awesome-phonenumber';
import _0x0_0x5b5ecf from 'readline';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { smsg } from './lib/myfunc.js';
import { compileAll } from './lib/compile.js';
import _0x0_0x4577d4, {
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    Browsers,
    jidDecode,
    jidNormalizedUser,
    makeCacheableSignalKeyStore,
    delay
} from '@whiskeysockets/baileys';
import _0x0_0x1bd780 from 'node-cache';
import _0x0_0x23545a from 'pino';
import _0x0_0x496176 from './config.js';
import _0x0_0x261e2d from './lib/lightweight_store.js';
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
import _0x0_0x308c20 from './lib/commandHandler.js';
import _0x0_0x17c95b from './lib/sessionManager.js';
_0x0_0x261e2d['readFromFile']();
setInterval(() => _0x0_0x261e2d['writeToFile'](), _0x0_0x496176['storeWriteInterval'] || 0x2710);
setInterval(() => {
    if (global['gc']) {
        global['gc']();
        console['log']('🧹\x20Garbage\x20collection\x20completed');
    }
}, 0xea60);
setInterval(() => {
    const _0x154a7d = process['memoryUsage']()['rss'] / 0x400 / 0x400;
    if (_0x154a7d > 0x190) {
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
_0x0_0x337386['mkdirSync']('./data', { 'recursive': !![] });
for (const [file, def] of Object['entries'](DATA_DEFAULTS)) {
    const fp = './data/' + file;
    if (!_0x0_0x337386['existsSync'](fp))
        _0x0_0x337386['writeFileSync'](fp, JSON['stringify'](def, null, 0x2));
}
let owner = [];
try {
    owner = JSON['parse'](_0x0_0x337386['readFileSync']('./data/owner.json', 'utf-8'));
} catch {
    owner = [];
}
global['botname'] = _0x0_0x496176['botName'] || 'NOVA-MD';
global['themeemoji'] = '•';
const pairingCode = ![];
const useMobile = process['argv']['includes']('--mobile');
let rl = null;
let rlClosed = ![];
if (process['stdin']['isTTY'] && !_0x0_0x496176['pairingNumber']) {
    rl = _0x0_0x5b5ecf['createInterface']({
        'input': process['stdin'],
        'output': process['stdout']
    });
    rl['on']('close', () => {
        rlClosed = !![];
    });
}
const question = _0x5b8833 => {
    if (rl && !rlClosed) {
        return new Promise(_0x33276c => rl['question'](_0x5b8833, _0x33276c));
    } else {
        return Promise['resolve'](_0x0_0x496176['ownerNumber'] || '237676250509');
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
    const _0x19edb9 = _0x0_0x41ae9e['join'](__dirname, 'session');
    if (!existsSync(_0x19edb9)) {
        mkdirSync(_0x19edb9, { 'recursive': !![] });
    }
    return _0x19edb9;
}
function hasValidSession() {
    return _0x0_0x17c95b['hasValidSession']();
}
server['listen'](PORT, () => {
    printLog('success', 'Server\x20listening\x20on\x20port\x20' + PORT);
    printLog('info', '🌐\x20Web\x20interface\x20available\x20at:\x20http://localhost:' + PORT + '/pairing');
});
async function startNovaXCode() {
    try {
        const {version: _0x142164} = await fetchLatestBaileysVersion();
        ensureSessionDirectory();
        await delay(0x3e8);
        const {
            state: _0x5061ef,
            saveCreds: _0x1bf3d2
        } = await useMultiFileAuthState('./session');
        const _0x4eec4f = async () => {
            ensureSessionDirectory();
            await _0x1bf3d2();
        };
        const _0x3da1e8 = new _0x0_0x1bd780();
        const _0x1101b0 = await _0x0_0x261e2d['getSetting']('global', 'stealthMode');
        const _0x492dd2 = _0x1101b0 && _0x1101b0['enabled'];
        const _0x1d6c8c = _0x0_0x4577d4({
            'version': _0x142164,
            'logger': _0x0_0x23545a({ 'level': 'silent' }),
            'browser': Browsers['macOS']('Chrome'),
            'auth': {
                'creds': _0x5061ef['creds'],
                'keys': makeCacheableSignalKeyStore(_0x5061ef['keys'], _0x0_0x23545a({ 'level': 'fatal' })['child']({ 'level': 'fatal' }))
            },
            'markOnlineOnConnect': !_0x492dd2,
            'generateHighQualityLinkPreview': !![],
            'syncFullHistory': ![],
            'getMessage': async _0x1eb9e2 => {
                const _0x1ee9aa = jidNormalizedUser(_0x1eb9e2['remoteJid']);
                const _0x41d4bf = await _0x0_0x261e2d['loadMessage'](_0x1ee9aa, _0x1eb9e2['id']);
                return _0x41d4bf?.['message'] || '';
            },
            'msgRetryCounterCache': _0x3da1e8,
            'defaultQueryTimeoutMs': 0xea60,
            'connectTimeoutMs': 0xea60,
            'keepAliveIntervalMs': 0x2710
        });
        _0x1d6c8c['store'] = _0x0_0x261e2d;
        const _0x3fe469 = _0x1d6c8c['sendPresenceUpdate'];
        const _0x39809e = _0x1d6c8c['readMessages'];
        const _0x58cd70 = _0x1d6c8c['sendReceipt'];
        _0x1d6c8c['sendPresenceUpdate'] = async function (..._0x3fec95) {
            const _0x5d8fd9 = await _0x0_0x261e2d['getSetting']('global', 'stealthMode');
            if (_0x5d8fd9 && _0x5d8fd9['enabled']) {
                printLog('info', '👻\x20Blocked\x20presence\x20update\x20(stealth\x20mode)');
                return;
            }
            return _0x3fe469['apply'](this, _0x3fec95);
        };
        _0x1d6c8c['readMessages'] = async function (..._0x14f6ef) {
            const _0x1c8ae6 = await _0x0_0x261e2d['getSetting']('global', 'stealthMode');
            if (_0x1c8ae6 && _0x1c8ae6['enabled'])
                return;
            return _0x39809e['apply'](this, _0x14f6ef);
        };
        if (_0x58cd70) {
            _0x1d6c8c['sendReceipt'] = async function (..._0x377b87) {
                const _0x20e2c8 = await _0x0_0x261e2d['getSetting']('global', 'stealthMode');
                if (_0x20e2c8 && _0x20e2c8['enabled'])
                    return;
                return _0x58cd70['apply'](this, _0x377b87);
            };
        }
        const _0x5105a6 = _0x1d6c8c['query'];
        _0x1d6c8c['query'] = async function (_0x2071f9, ..._0xe2842) {
            const _0x2eb8f1 = await _0x0_0x261e2d['getSetting']('global', 'stealthMode');
            if (_0x2eb8f1 && _0x2eb8f1['enabled']) {
                if (_0x2071f9 && _0x2071f9['tag'] === 'receipt')
                    return;
                if (_0x2071f9 && _0x2071f9['attrs'] && (_0x2071f9['attrs']['type'] === 'read' || _0x2071f9['attrs']['type'] === 'read-self'))
                    return;
            }
            return _0x5105a6['apply'](this, [
                _0x2071f9,
                ..._0xe2842
            ]);
        };
        _0x1d6c8c['isGhostMode'] = async () => {
            const _0x193f9a = await _0x0_0x261e2d['getSetting']('global', 'stealthMode');
            return _0x193f9a && _0x193f9a['enabled'];
        };
        _0x1d6c8c['ev']['on']('creds.update', _0x4eec4f);
        _0x0_0x261e2d['bind'](_0x1d6c8c['ev']);
        _0x1d6c8c['ev']['on']('messages.upsert', async _0x5b5918 => {
            try {
                const _0xd0a8ae = _0x5b5918['messages'][0x0];
                if (!_0xd0a8ae['message'])
                    return;
                _0xd0a8ae['message'] = Object['keys'](_0xd0a8ae['message'])[0x0] === 'ephemeralMessage' ? _0xd0a8ae['message']['ephemeralMessage']['message'] : _0xd0a8ae['message'];
                if (_0xd0a8ae['key'] && _0xd0a8ae['key']['remoteJid'] === 'status@broadcast') {
                    await handleStatus(_0x1d6c8c, _0x5b5918);
                    return;
                }
                if (!_0x1d6c8c['public'] && !_0xd0a8ae['key']['fromMe'] && _0x5b5918['type'] === 'notify') {
                    const _0x2f0e47 = _0xd0a8ae['key']?.['remoteJid']?.['endsWith']('@g.us');
                    if (!_0x2f0e47)
                        return;
                }
                if (_0xd0a8ae['key']['id']['startsWith']('BAE5') && _0xd0a8ae['key']['id']['length'] === 0x10)
                    return;
                if (_0x1d6c8c?.['msgRetryCounterCache']) {
                    _0x1d6c8c['msgRetryCounterCache']['clear']();
                }
                try {
                    await handleMessages(_0x1d6c8c, _0x5b5918);
                } catch (_0x308333) {
                    printLog('error', 'Error\x20in\x20handleMessages:\x20' + _0x308333['message']);
                    if (_0xd0a8ae['key'] && _0xd0a8ae['key']['remoteJid']) {
                        await _0x1d6c8c['sendMessage'](_0xd0a8ae['key']['remoteJid'], {
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
            } catch (_0x1e85b5) {
                printLog('error', 'Error\x20in\x20messages.upsert:\x20' + _0x1e85b5['message']);
            }
        });
        _0x1d6c8c['decodeJid'] = _0x84b38f => {
            if (!_0x84b38f)
                return _0x84b38f;
            if (/:\d+@/gi['test'](_0x84b38f)) {
                const _0x3ef7ca = jidDecode(_0x84b38f) || {};
                return _0x3ef7ca['user'] && _0x3ef7ca['server'] && _0x3ef7ca['user'] + '@' + _0x3ef7ca['server'] || _0x84b38f;
            } else
                return _0x84b38f;
        };
        _0x1d6c8c['ev']['on']('contacts.update', _0x227926 => {
            for (const _0x440139 of _0x227926) {
                const _0x109479 = _0x1d6c8c['decodeJid'](_0x440139['id']);
                if (_0x0_0x261e2d && _0x0_0x261e2d['contacts'])
                    _0x0_0x261e2d['contacts'][_0x109479] = {
                        'id': _0x109479,
                        'name': _0x440139['notify']
                    };
            }
        });
        _0x1d6c8c['getName'] = (_0x3bf175, _0x53497d = ![]) => {
            const _0x124fe7 = _0x1d6c8c['decodeJid'](_0x3bf175);
            _0x53497d = _0x1d6c8c['withoutContact'] || _0x53497d;
            let _0x5ae93a;
            if (_0x124fe7['endsWith']('@g.us'))
                return new Promise(async _0x4a2880 => {
                    _0x5ae93a = _0x0_0x261e2d['contacts'][_0x124fe7] || {};
                    if (!(_0x5ae93a['name'] || _0x5ae93a['subject']))
                        _0x5ae93a = _0x1d6c8c['groupMetadata'](_0x124fe7) || {};
                    _0x4a2880(_0x5ae93a['name'] || _0x5ae93a['subject'] || _0x0_0x3f358b('+' + _0x124fe7['replace']('@s.whatsapp.net', ''))['number']?.['international']);
                });
            else
                _0x5ae93a = _0x124fe7 === '0@s.whatsapp.net' ? {
                    'id': _0x124fe7,
                    'name': 'WhatsApp'
                } : _0x124fe7 === _0x1d6c8c['decodeJid'](_0x1d6c8c['user']['id']) ? _0x1d6c8c['user'] : _0x0_0x261e2d['contacts'][_0x124fe7] || {};
            return (_0x53497d ? '' : _0x5ae93a['name']) || _0x5ae93a['subject'] || _0x5ae93a['verifiedName'] || _0x0_0x3f358b('+' + _0x3bf175['replace']('@s.whatsapp.net', ''))['number']?.['international'];
        };
        _0x1d6c8c['public'] = !![];
        _0x1d6c8c['serializeM'] = _0x1fd268 => smsg(_0x1d6c8c, _0x1fd268, _0x0_0x261e2d);
        const _0xf59027 = _0x5061ef['creds']?.['registered'] === !![];
        if (_0xf59027) {
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
        _0x1d6c8c['ev']['on']('connection.update', async _0x2e4513 => {
            const {
                connection: _0x1ba625,
                lastDisconnect: _0x515345,
                qr: _0x1ce6e2
            } = _0x2e4513;
            if (_0x1ba625 === 'open') {
                printLog('success', 'Bot\x20connected\x20successfully!');
                try {
                    const _0x3b715d = await _0x0_0x261e2d['getBotMode']();
                    const _0xc00b9f = process['uptime']();
                    const _0x54b361 = Math['floor'](_0xc00b9f / 0xe10);
                    const _0xe07202 = Math['floor'](_0xc00b9f % 0xe10 / 0x3c);
                    const _0x1eb169 = 'https://raw.githubusercontent.com/NOSTRA-DevOps/Nova-MD/refs/heads/main/assets/logo.PNG';
                    let _0x5f075a = null;
                    try {
                        const _0x21c87a = await fetch(_0x1eb169);
                        if (_0x21c87a['ok']) {
                            const _0x25f4cb = await _0x21c87a['arrayBuffer']();
                            _0x5f075a = Buffer['from'](_0x25f4cb);
                        }
                    } catch (_0x44f445) {
                        const _0x14bc05 = _0x0_0x41ae9e['join'](process['cwd'](), 'assets', 'logo.PNG');
                        if (_0x0_0x337386['existsSync'](_0x14bc05)) {
                            _0x5f075a = _0x0_0x337386['readFileSync'](_0x14bc05);
                        }
                    }
                    let _0x52d4ab = '╭━━━━『\x20*' + (_0x0_0x496176['botName'] || 'NOVA-MD') + '*\x20』━━⬣\x0a';
                    _0x52d4ab += '┃\x0a';
                    _0x52d4ab += '┃\x20✨\x20*Status:*\x20✅\x20ONLINE\x0a';
                    _0x52d4ab += '┃\x20🤖\x20*Version:*\x20' + (_0x0_0x496176['version'] || '2.5.0') + '\x20(Stable)\x0a';
                    _0x52d4ab += '┃\x20⚙️\x20*Mode:*\x20' + _0x3b715d['toUpperCase']() + '\x0a';
                    _0x52d4ab += '┃\x20⏰\x20*Uptime:*\x20' + _0x54b361 + 'h\x20' + _0xe07202 + 'm\x0a';
                    _0x52d4ab += '┃\x20📊\x20*Prefixes:*\x20' + _0x0_0x496176['prefixes']['join']('\x20') + '\x0a';
                    _0x52d4ab += '┃\x20📦\x20*Plugins:*\x20' + _0x0_0x308c20['commands']['size'] + '\x0a';
                    _0x52d4ab += '┃\x20💾\x20*Storage:*\x20' + _0x0_0x261e2d['getStats']()['backend']['toUpperCase']() + '\x0a';
                    _0x52d4ab += '┃\x0a';
                    _0x52d4ab += '┃━━━━━━━━━━━━━━━━━━⬣\x0a';
                    _0x52d4ab += '┃\x0a';
                    _0x52d4ab += '┃\x20🌐\x20*JOIN\x20CHANNELS*\x0a';
                    _0x52d4ab += '┃\x0a';
                    _0x52d4ab += '┃\x20💬\x20*FaceBook:*\x0a';
                    _0x52d4ab += '┃\x20https://www.facebook.com/profile.php?id=61591828051151\x0a';
                    _0x52d4ab += '┃\x0a';
                    _0x52d4ab += '┃\x20📱\x20*Telegram:*\x0a';
                    _0x52d4ab += '┃\x20https://t.me/addlist/CpQzYQfWwwxmYTk0\x0a';
                    _0x52d4ab += '┃\x0a';
                    _0x52d4ab += '┃\x20▶️\x20*YouTube:*\x0a';
                    _0x52d4ab += '┃\x20https://youtube.com/@labokingfreesurf\x0a';
                    _0x52d4ab += '┃\x0a';
                    _0x52d4ab += '┃━━━━━━━━━━━━━━━━━━⬣\x0a';
                    _0x52d4ab += '┃\x0a';
                    _0x52d4ab += '┃\x20✨\x20_Powered\x20by\x20NOSTRA._\x0a';
                    _0x52d4ab += '╰━━━━━━━━━━━━━━━━━━⬣';
                    const _0x36f7c3 = _0x1d6c8c['user']['id']['split'](':')[0x0] + '@s.whatsapp.net';
                    if (_0x5f075a) {
                        await _0x1d6c8c['sendMessage'](_0x36f7c3, {
                            'image': _0x5f075a,
                            'caption': _0x52d4ab,
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
                        await _0x1d6c8c['sendMessage'](_0x36f7c3, {
                            'text': _0x52d4ab,
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
                } catch (_0x578a99) {
                    printLog('error', 'Failed\x20to\x20send\x20automatic\x20about\x20message:\x20' + _0x578a99['message']);
                }
                const _0x1cd56a = await _0x0_0x261e2d['getSetting']('global', 'stealthMode');
                if (_0x1cd56a && _0x1cd56a['enabled']) {
                    printLog('info', '👻\x20STEALTH\x20MODE\x20ACTIVE');
                }
                printLog('success', 'Connected\x20to\x20=>\x20' + JSON['stringify'](_0x1d6c8c['user'], null, 0x2));
                await delay(0x7cf);
                try {
                    owner = JSON['parse'](_0x0_0x337386['readFileSync']('./data/owner.json', 'utf-8'));
                } catch (_0x903e6f) {
                }
                printLog('info', '[\x20' + (_0x0_0x496176['botName'] || 'NOVA-MD') + '\x20]');
                printLog('info', 'WA\x20NUMBER\x20\x20:\x20' + (owner[0x0] || _0x0_0x496176['ownerNumber'] || ''));
                printLog('success', 'Bot\x20Connected\x20Successfully!');
                printLog('info', 'Plugins\x20\x20\x20:\x20' + _0x0_0x308c20['commands']['size']);
                printLog('info', 'Prefixes\x20\x20\x20:\x20' + _0x0_0x496176['prefixes']['join'](',\x20'));
                printLog('store', 'Backend\x20\x20\x20\x20:\x20' + _0x0_0x261e2d['getStats']()['backend']);
                console['log']();
            }
            if (_0x1ba625 === 'close') {
                const _0x14e0d7 = _0x515345?.['error']?.['output']?.['statusCode'];
                const _0x2bc59b = _0x14e0d7 !== DisconnectReason['loggedOut'] && _0x14e0d7 !== 0x191;
                if (_0x14e0d7 === DisconnectReason['loggedOut'] || _0x14e0d7 === 0x191) {
                    try {
                        rmSync('./session', {
                            'recursive': !![],
                            'force': !![]
                        });
                    } catch (_0x224e93) {
                    }
                    await delay(0xbb8);
                    startNovaXCode();
                    return;
                }
                if (_0x2bc59b) {
                    printLog('connection', 'Reconnecting\x20in\x205\x20seconds...');
                    await delay(0x1388);
                    startNovaXCode();
                }
            }
        });
        _0x1d6c8c['ev']['on']('call', async _0x3a1ad0 => {
            await handleCall(_0x1d6c8c, _0x3a1ad0);
        });
        _0x1d6c8c['ev']['on']('group-participants.update', async _0x310b8b => {
            await handleGroupParticipantUpdate(_0x1d6c8c, _0x310b8b);
        });
        _0x1d6c8c['ev']['on']('status.update', async _0xb69f68 => {
            await handleStatus(_0x1d6c8c, _0xb69f68);
        });
        _0x1d6c8c['ev']['on']('messages.reaction', async _0x1f1d0f => {
            await handleStatus(_0x1d6c8c, _0x1f1d0f);
        });
        return _0x1d6c8c;
    } catch (_0x4bc25c) {
        printLog('error', 'Error\x20in\x20startNovaXCode:\x20' + _0x4bc25c['message']);
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
    printLog('info', '📱\x20Open\x20http://localhost:' + (_0x0_0x496176['port'] || 0x1388) + '/pairing\x20in\x20your\x20browser\x20if\x20it\x27s\x20local');
    printLog('info', '📱\x20For\x20web\x20servic\x20deployment,\x20click\x20the\x20service\x20URL\x20and\x20add\x20/pairing\x20at\x20the\x20end');
    const _0x3c4367 = 0x1e * 0x3c * 0x3e8;
    const _0x48f03c = Date['now']();
    const _0x43e69f = 0xbb8;
    return new Promise((_0x5c2fa2, _0x329c4d) => {
        const _0x17b457 = setInterval(() => {
            if (hasValidSession()) {
                clearInterval(_0x17b457);
                printLog('success', '✅\x20Session\x20detected!\x20Starting\x20bot...');
                _0x5c2fa2();
            }
            if (Date['now']() - _0x48f03c > _0x3c4367) {
                clearInterval(_0x17b457);
                _0x329c4d(new Error('Session\x20creation\x20timeout\x20(30\x20minutes)'));
            }
        }, _0x43e69f);
    });
}
async function main() {
    await compileAll();
    await _0x0_0x308c20['loadCommands']();
    printLog('info', 'Starting\x20NOVA-MD\x20BOT...');
    if (hasValidSession()) {
        printLog('success', '✅\x20Valid\x20session\x20found,\x20starting\x20bot...');
        await delay(0xbb8);
        startNovaXCode()['catch'](_0x49337b => {
            printLog('error', 'Fatal\x20error:\x20' + _0x49337b['message']);
            if (rl && !rlClosed)
                rl['close']();
            process['exit'](0x1);
        });
    } else {
        printLog('info', '🌐\x20No\x20session\x20found.\x20Launching\x20web\x20pairing\x20interface...');
        printLog('info', '📱\x20Open\x20http://localhost:' + (_0x0_0x496176['port'] || 0x1388) + '/pairing\x20in\x20your\x20browser\x20to\x20connect\x20WhatsApp');
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
            startNovaXCode()['catch'](_0x2470fb => {
                printLog('error', 'Fatal\x20error:\x20' + _0x2470fb['message']);
                if (rl && !rlClosed)
                    rl['close']();
                process['exit'](0x1);
            });
        } catch (_0x1f36a3) {
            printLog('error', 'Session\x20creation\x20failed:\x20' + _0x1f36a3['message']);
            if (rl && !rlClosed)
                rl['close']();
            process['exit'](0x1);
        }
    }
}
main();
const sessionDir = _0x0_0x41ae9e['join'](process['cwd'](), 'session');
setInterval(() => {
    if (!_0x0_0x337386['existsSync'](sessionDir))
        return;
    _0x0_0x337386['readdir'](sessionDir, (_0x1d7b02, _0x2fb01f) => {
        if (_0x1d7b02)
            return;
        for (const _0xf9c614 of _0x2fb01f) {
            if (_0xf9c614 === 'creds.json')
                continue;
            if (_0xf9c614['startsWith']('app-state-sync-key-'))
                continue;
            _0x0_0x337386['unlink'](_0x0_0x41ae9e['join'](sessionDir, _0xf9c614), () => {
            });
        }
    });
}, 0x3 * 0x3c * 0x3e8);
const customTemp = _0x0_0x41ae9e['join'](process['cwd'](), 'temp');
if (!_0x0_0x337386['existsSync'](customTemp))
    _0x0_0x337386['mkdirSync'](customTemp, { 'recursive': !![] });
process.env.TMPDIR = customTemp;
process.env.TEMP = customTemp;
process.env.TMP = customTemp;
setInterval(() => {
    _0x0_0x337386['readdir'](customTemp, (_0x3f8a2f, _0x36d22d) => {
        if (_0x3f8a2f)
            return;
        for (const _0x54aca6 of _0x36d22d) {
            const _0xfef35f = _0x0_0x41ae9e['join'](customTemp, _0x54aca6);
            _0x0_0x337386['stat'](_0xfef35f, (_0x48c8ad, _0x2d68ae) => {
                if (!_0x48c8ad && Date['now']() - _0x2d68ae['mtimeMs'] > 0x3 * 0x3c * 0x3c * 0x3e8) {
                    _0x0_0x337386['unlink'](_0xfef35f, () => {
                    });
                }
            });
        }
    });
}, 0x1 * 0x3c * 0x3c * 0x3e8);
const folders = [
    _0x0_0x41ae9e['join'](__dirname, './lib'),
    _0x0_0x41ae9e['join'](__dirname, './plugins')
];
folders['forEach'](_0x568fa2 => {
    if (!_0x0_0x337386['existsSync'](_0x568fa2))
        return;
    _0x0_0x337386['readdirSync'](_0x568fa2)['filter'](_0x5b429f => _0x5b429f['endsWith']('.js'))['forEach'](_0x56a131 => {
        const _0x32eb3b = _0x0_0x41ae9e['join'](_0x568fa2, _0x56a131);
        try {
            const _0x3ff3a2 = _0x0_0x337386['readFileSync'](_0x32eb3b, 'utf-8');
            const _0x70307d = _0x0_0x43a334(_0x3ff3a2, _0x56a131, {
                'sourceType': 'module',
                'allowAwaitOutsideFunction': !![]
            });
            if (_0x70307d) {
                console['error'](_0x0_0x405853['red']('❌\x20Syntax\x20error\x20in\x20' + _0x32eb3b + ':\x0a' + _0x70307d));
            }
        } catch (_0x1e3541) {
            console['error'](_0x0_0x405853['yellow']('⚠️\x20Cannot\x20read\x20file\x20' + _0x32eb3b + ':\x0a' + _0x1e3541));
        }
    });
});
process['on']('uncaughtException', _0x40f3b2 => {
    printLog('error', 'Uncaught\x20Exception:\x20' + _0x40f3b2['message']);
    console['error'](_0x40f3b2['stack']);
    writeErrorLog({
        'type': 'uncaughtException',
        'error': _0x40f3b2['message'],
        'stack': _0x40f3b2['stack'],
        'timestamp': new Date()['toISOString']()
    });
});
process['on']('unhandledRejection', _0x37fab6 => {
    printLog('error', 'Unhandled\x20Rejection:\x20' + _0x37fab6['message']);
    console['error'](_0x37fab6['stack']);
    writeErrorLog({
        'type': 'unhandledRejection',
        'error': _0x37fab6['message'],
        'stack': _0x37fab6['stack'],
        'timestamp': new Date()['toISOString']()
    });
});
server['on']('error', _0x3a33bd => {
    if (_0x3a33bd['code'] === 'EADDRINUSE') {
        printLog('error', 'Address\x20localhost:' + PORT + '\x20in\x20use');
        writeErrorLog({
            'type': 'serverError',
            'error': 'Address\x20localhost:' + PORT + '\x20in\x20use',
            'timestamp': new Date()['toISOString']()
        });
        server['close']();
    } else {
        printLog('error', 'Server\x20error:\x20' + _0x3a33bd['message']);
        writeErrorLog({
            'type': 'serverError',
            'error': _0x3a33bd['message'],
            'stack': _0x3a33bd['stack'],
            'timestamp': new Date()['toISOString']()
        });
    }
});