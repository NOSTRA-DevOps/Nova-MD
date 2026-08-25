import 'dotenv/config';
import _0x0_0x83eef7, {
    existsSync,
    mkdirSync,
    rmSync
} from 'fs';
import _0x0_0x4a39d5, { dirname } from 'path';
import _0x0_0x4ea449 from 'chalk';
import _0x0_0x28c9b4 from 'syntax-error';
import { parsePhoneNumber as _0x0_0x544355 } from 'awesome-phonenumber';
import _0x0_0x76712a from 'readline';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { smsg } from './lib/myfunc.js';
import { compileAll } from './lib/compile.js';
import _0x0_0x5a8dd7, {
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    Browsers,
    jidDecode,
    jidNormalizedUser,
    makeCacheableSignalKeyStore,
    delay
} from '@whiskeysockets/baileys';
import _0x0_0x121341 from 'node-cache';
import _0x0_0x43e7eb from 'pino';
import _0x0_0x4016a4 from './config.js';
import _0x0_0x8f014e from './lib/lightweight_store.js';
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
import _0x0_0x1e21bf from './lib/commandHandler.js';
import _0x0_0x47aceb from './lib/sessionManager.js';
_0x0_0x8f014e['readFromFile']();
setInterval(() => _0x0_0x8f014e['writeToFile'](), _0x0_0x4016a4['storeWriteInterval'] || 0x2710);
setInterval(() => {
    if (global['gc']) {
        global['gc']();
        console['log']('🧹\x20Garbage\x20collection\x20completed');
    }
}, 0xea60);
setInterval(() => {
    const _0x503dbc = process['memoryUsage']()['rss'] / 0x400 / 0x400;
    if (_0x503dbc > 0x190) {
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
_0x0_0x83eef7['mkdirSync']('./data', { 'recursive': !![] });
for (const [file, def] of Object['entries'](DATA_DEFAULTS)) {
    const fp = './data/' + file;
    if (!_0x0_0x83eef7['existsSync'](fp))
        _0x0_0x83eef7['writeFileSync'](fp, JSON['stringify'](def, null, 0x2));
}
let owner = [];
try {
    owner = JSON['parse'](_0x0_0x83eef7['readFileSync']('./data/owner.json', 'utf-8'));
} catch {
    owner = [];
}
global['botname'] = _0x0_0x4016a4['botName'] || 'NOVA-MD';
global['themeemoji'] = '•';
const pairingCode = ![];
const useMobile = process['argv']['includes']('--mobile');
let rl = null;
let rlClosed = ![];
if (process['stdin']['isTTY'] && !_0x0_0x4016a4['pairingNumber']) {
    rl = _0x0_0x76712a['createInterface']({
        'input': process['stdin'],
        'output': process['stdout']
    });
    rl['on']('close', () => {
        rlClosed = !![];
    });
}
const question = _0x2c54b6 => {
    if (rl && !rlClosed) {
        return new Promise(_0x402cb7 => rl['question'](_0x2c54b6, _0x402cb7));
    } else {
        return Promise['resolve'](_0x0_0x4016a4['ownerNumber'] || '237676250509');
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
    const _0x27179f = _0x0_0x4a39d5['join'](__dirname, 'session');
    if (!existsSync(_0x27179f)) {
        mkdirSync(_0x27179f, { 'recursive': !![] });
    }
    return _0x27179f;
}
function hasValidSession() {
    return _0x0_0x47aceb['hasValidSession']();
}
server['listen'](PORT, () => {
    printLog('success', 'Server\x20listening\x20on\x20port\x20' + PORT);
    printLog('info', '🌐\x20Web\x20interface\x20available\x20at:\x20http://localhost:' + PORT + '/pairing');
});
async function startNovaXCode() {
    try {
        const {version: _0x5464fa} = await fetchLatestBaileysVersion();
        ensureSessionDirectory();
        await delay(0x3e8);
        const {
            state: _0x3d109e,
            saveCreds: _0xdd2e78
        } = await useMultiFileAuthState('./session');
        const _0x35a6df = async () => {
            ensureSessionDirectory();
            await _0xdd2e78();
        };
        const _0x380e53 = new _0x0_0x121341();
        const _0x597696 = await _0x0_0x8f014e['getSetting']('global', 'stealthMode');
        const _0x37819a = _0x597696 && _0x597696['enabled'];
        const _0x24a328 = _0x0_0x5a8dd7({
            'version': _0x5464fa,
            'logger': _0x0_0x43e7eb({ 'level': 'silent' }),
            'browser': Browsers['macOS']('Chrome'),
            'auth': {
                'creds': _0x3d109e['creds'],
                'keys': makeCacheableSignalKeyStore(_0x3d109e['keys'], _0x0_0x43e7eb({ 'level': 'fatal' })['child']({ 'level': 'fatal' }))
            },
            'markOnlineOnConnect': !_0x37819a,
            'generateHighQualityLinkPreview': !![],
            'syncFullHistory': ![],
            'getMessage': async _0x221b28 => {
                const _0x17d5d4 = jidNormalizedUser(_0x221b28['remoteJid']);
                const _0x2a0872 = await _0x0_0x8f014e['loadMessage'](_0x17d5d4, _0x221b28['id']);
                return _0x2a0872?.['message'] || '';
            },
            'msgRetryCounterCache': _0x380e53,
            'defaultQueryTimeoutMs': 0xea60,
            'connectTimeoutMs': 0xea60,
            'keepAliveIntervalMs': 0x2710
        });
        _0x24a328['store'] = _0x0_0x8f014e;
        const _0x156c94 = _0x24a328['sendPresenceUpdate'];
        const _0x3bd584 = _0x24a328['readMessages'];
        const _0x3d4a61 = _0x24a328['sendReceipt'];
        _0x24a328['sendPresenceUpdate'] = async function (..._0x1d97fe) {
            const _0x5403c9 = await _0x0_0x8f014e['getSetting']('global', 'stealthMode');
            if (_0x5403c9 && _0x5403c9['enabled']) {
                printLog('info', '👻\x20Blocked\x20presence\x20update\x20(stealth\x20mode)');
                return;
            }
            return _0x156c94['apply'](this, _0x1d97fe);
        };
        _0x24a328['readMessages'] = async function (..._0xab10ee) {
            const _0x96566d = await _0x0_0x8f014e['getSetting']('global', 'stealthMode');
            if (_0x96566d && _0x96566d['enabled'])
                return;
            return _0x3bd584['apply'](this, _0xab10ee);
        };
        if (_0x3d4a61) {
            _0x24a328['sendReceipt'] = async function (..._0x328bee) {
                const _0x53ff2e = await _0x0_0x8f014e['getSetting']('global', 'stealthMode');
                if (_0x53ff2e && _0x53ff2e['enabled'])
                    return;
                return _0x3d4a61['apply'](this, _0x328bee);
            };
        }
        const _0x53a34 = _0x24a328['query'];
        _0x24a328['query'] = async function (_0xe5e38d, ..._0x1dc8f0) {
            const _0x1689a7 = await _0x0_0x8f014e['getSetting']('global', 'stealthMode');
            if (_0x1689a7 && _0x1689a7['enabled']) {
                if (_0xe5e38d && _0xe5e38d['tag'] === 'receipt')
                    return;
                if (_0xe5e38d && _0xe5e38d['attrs'] && (_0xe5e38d['attrs']['type'] === 'read' || _0xe5e38d['attrs']['type'] === 'read-self'))
                    return;
            }
            return _0x53a34['apply'](this, [
                _0xe5e38d,
                ..._0x1dc8f0
            ]);
        };
        _0x24a328['isGhostMode'] = async () => {
            const _0x2d106f = await _0x0_0x8f014e['getSetting']('global', 'stealthMode');
            return _0x2d106f && _0x2d106f['enabled'];
        };
        _0x24a328['ev']['on']('creds.update', _0x35a6df);
        _0x0_0x8f014e['bind'](_0x24a328['ev']);
        _0x24a328['ev']['on']('messages.upsert', async _0x45681d => {
            try {
                const _0x3dab5d = _0x45681d['messages'][0x0];
                if (!_0x3dab5d['message'])
                    return;
                _0x3dab5d['message'] = Object['keys'](_0x3dab5d['message'])[0x0] === 'ephemeralMessage' ? _0x3dab5d['message']['ephemeralMessage']['message'] : _0x3dab5d['message'];
                if (_0x3dab5d['key'] && _0x3dab5d['key']['remoteJid'] === 'status@broadcast') {
                    await handleStatus(_0x24a328, _0x45681d);
                    return;
                }
                if (!_0x24a328['public'] && !_0x3dab5d['key']['fromMe'] && _0x45681d['type'] === 'notify') {
                    const _0x262345 = _0x3dab5d['key']?.['remoteJid']?.['endsWith']('@g.us');
                    if (!_0x262345)
                        return;
                }
                if (_0x3dab5d['key']['id']['startsWith']('BAE5') && _0x3dab5d['key']['id']['length'] === 0x10)
                    return;
                if (_0x24a328?.['msgRetryCounterCache']) {
                    _0x24a328['msgRetryCounterCache']['clear']();
                }
                try {
                    await handleMessages(_0x24a328, _0x45681d);
                } catch (_0xe85245) {
                    printLog('error', 'Error\x20in\x20handleMessages:\x20' + _0xe85245['message']);
                    if (_0x3dab5d['key'] && _0x3dab5d['key']['remoteJid']) {
                        await _0x24a328['sendMessage'](_0x3dab5d['key']['remoteJid'], {
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
            } catch (_0x1c2d17) {
                printLog('error', 'Error\x20in\x20messages.upsert:\x20' + _0x1c2d17['message']);
            }
        });
        _0x24a328['decodeJid'] = _0x56ae51 => {
            if (!_0x56ae51)
                return _0x56ae51;
            if (/:\d+@/gi['test'](_0x56ae51)) {
                const _0xb33ca5 = jidDecode(_0x56ae51) || {};
                return _0xb33ca5['user'] && _0xb33ca5['server'] && _0xb33ca5['user'] + '@' + _0xb33ca5['server'] || _0x56ae51;
            } else
                return _0x56ae51;
        };
        _0x24a328['ev']['on']('contacts.update', _0x1dfb4c => {
            for (const _0x55532f of _0x1dfb4c) {
                const _0x3b7811 = _0x24a328['decodeJid'](_0x55532f['id']);
                if (_0x0_0x8f014e && _0x0_0x8f014e['contacts'])
                    _0x0_0x8f014e['contacts'][_0x3b7811] = {
                        'id': _0x3b7811,
                        'name': _0x55532f['notify']
                    };
            }
        });
        _0x24a328['getName'] = (_0x17c474, _0x15d544 = ![]) => {
            const _0x58c861 = _0x24a328['decodeJid'](_0x17c474);
            _0x15d544 = _0x24a328['withoutContact'] || _0x15d544;
            let _0x5b75c8;
            if (_0x58c861['endsWith']('@g.us'))
                return new Promise(async _0x5dbde0 => {
                    _0x5b75c8 = _0x0_0x8f014e['contacts'][_0x58c861] || {};
                    if (!(_0x5b75c8['name'] || _0x5b75c8['subject']))
                        _0x5b75c8 = _0x24a328['groupMetadata'](_0x58c861) || {};
                    _0x5dbde0(_0x5b75c8['name'] || _0x5b75c8['subject'] || _0x0_0x544355('+' + _0x58c861['replace']('@s.whatsapp.net', ''))['number']?.['international']);
                });
            else
                _0x5b75c8 = _0x58c861 === '0@s.whatsapp.net' ? {
                    'id': _0x58c861,
                    'name': 'WhatsApp'
                } : _0x58c861 === _0x24a328['decodeJid'](_0x24a328['user']['id']) ? _0x24a328['user'] : _0x0_0x8f014e['contacts'][_0x58c861] || {};
            return (_0x15d544 ? '' : _0x5b75c8['name']) || _0x5b75c8['subject'] || _0x5b75c8['verifiedName'] || _0x0_0x544355('+' + _0x17c474['replace']('@s.whatsapp.net', ''))['number']?.['international'];
        };
        _0x24a328['public'] = !![];
        _0x24a328['serializeM'] = _0x405a8e => smsg(_0x24a328, _0x405a8e, _0x0_0x8f014e);
        const _0x5b6d75 = _0x3d109e['creds']?.['registered'] === !![];
        if (_0x5b6d75) {
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
        _0x24a328['ev']['on']('connection.update', async _0x558fb9 => {
            const {
                connection: _0x460d75,
                lastDisconnect: _0x246c64,
                qr: _0x435d9d
            } = _0x558fb9;
            if (_0x460d75 === 'open') {
                printLog('success', 'Bot\x20connected\x20successfully!');
                try {
                    const _0x2ee07b = await _0x0_0x8f014e['getBotMode']();
                    const _0x9c2b82 = process['uptime']();
                    const _0x449f40 = Math['floor'](_0x9c2b82 / 0xe10);
                    const _0x11cdbc = Math['floor'](_0x9c2b82 % 0xe10 / 0x3c);
                    const _0x5efeea = 'https://raw.githubusercontent.com/NOSTRA-DevOps/Nova-MD/refs/heads/main/assets/logo.PNG';
                    let _0x5d58ef = null;
                    try {
                        const _0x665c55 = await fetch(_0x5efeea);
                        if (_0x665c55['ok']) {
                            const _0x5441dd = await _0x665c55['arrayBuffer']();
                            _0x5d58ef = Buffer['from'](_0x5441dd);
                        }
                    } catch (_0x1283f1) {
                        const _0x37e436 = _0x0_0x4a39d5['join'](process['cwd'](), 'assets', 'logo.PNG');
                        if (_0x0_0x83eef7['existsSync'](_0x37e436)) {
                            _0x5d58ef = _0x0_0x83eef7['readFileSync'](_0x37e436);
                        }
                    }
                    let _0x5f31c6 = '╭━━━━『\x20*' + (_0x0_0x4016a4['botName'] || 'NOVA-MD') + '*\x20』━━⬣\x0a';
                    _0x5f31c6 += '┃\x0a';
                    _0x5f31c6 += '┃\x20✨\x20*Status:*\x20✅\x20ONLINE\x0a';
                    _0x5f31c6 += '┃\x20🤖\x20*Version:*\x20' + (_0x0_0x4016a4['version'] || '2.0.0') + '\x0a';
                    _0x5f31c6 += '┃\x20⚙️\x20*Mode:*\x20' + _0x2ee07b['toUpperCase']() + '\x0a';
                    _0x5f31c6 += '┃\x20⏰\x20*Uptime:*\x20' + _0x449f40 + 'h\x20' + _0x11cdbc + 'm\x0a';
                    _0x5f31c6 += '┃\x20📊\x20*Prefixes:*\x20' + _0x0_0x4016a4['prefixes']['join']('\x20') + '\x0a';
                    _0x5f31c6 += '┃\x20📦\x20*Plugins:*\x20' + _0x0_0x1e21bf['commands']['size'] + '\x0a';
                    _0x5f31c6 += '┃\x20💾\x20*Storage:*\x20' + _0x0_0x8f014e['getStats']()['backend']['toUpperCase']() + '\x0a';
                    _0x5f31c6 += '┃\x0a';
                    _0x5f31c6 += '┃━━━━━━━━━━━━━━━━━⬣\x0a';
                    _0x5f31c6 += '┃\x0a';
                    _0x5f31c6 += '┃\x20🌐\x20*JOIN\x20CHANNELS*\x0a';
                    _0x5f31c6 += '┃\x0a';
                    _0x5f31c6 += '┃\x20💬\x20*FaceBook:*\x0a';
                    _0x5f31c6 += '┃\x20https://www.facebook.com/profile.php?id=61591828051151\x0a';
                    _0x5f31c6 += '┃\x0a';
                    _0x5f31c6 += '┃\x20📱\x20*Telegram:*\x0a';
                    _0x5f31c6 += '┃\x20https://t.me/addlist/CpQzYQfWwwxmYTk0\x0a';
                    _0x5f31c6 += '┃\x0a';
                    _0x5f31c6 += '┃\x20▶️\x20*YouTube:*\x0a';
                    _0x5f31c6 += '┃\x20https://youtube.com/@labokingfreesurf\x0a';
                    _0x5f31c6 += '┃\x0a';
                    _0x5f31c6 += '┃━━━━━━━━━━━━━━━━━⬣\x0a';
                    _0x5f31c6 += '┃\x0a';
                    _0x5f31c6 += '┃\x20✨\x20_Powered\x20by\x20NOSTRA._\x0a';
                    _0x5f31c6 += '╰━━━━━━━━━━━━━━━━━⬣';
                    const _0x5294d7 = _0x24a328['user']['id']['split'](':')[0x0] + '@s.whatsapp.net';
                    _0x0_0x4016a4['ownerNumber'] = _0x5294d7;
                    if (_0x5d58ef) {
                        await _0x24a328['sendMessage'](_0x5294d7, {
                            'image': _0x5d58ef,
                            'caption': _0x5f31c6,
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
                        await _0x24a328['sendMessage'](_0x5294d7, {
                            'text': _0x5f31c6,
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
                } catch (_0x336b89) {
                    printLog('error', 'Failed\x20to\x20send\x20automatic\x20about\x20message:\x20' + _0x336b89['message']);
                }
                const _0x11fabb = await _0x0_0x8f014e['getSetting']('global', 'stealthMode');
                if (_0x11fabb && _0x11fabb['enabled']) {
                    printLog('info', '👻\x20STEALTH\x20MODE\x20ACTIVE');
                }
                printLog('success', 'Connected\x20to\x20=>\x20' + JSON['stringify'](_0x24a328['user'], null, 0x2));
                await delay(0x7cf);
                try {
                    owner = JSON['parse'](_0x0_0x83eef7['readFileSync']('./data/owner.json', 'utf-8'));
                } catch (_0x4d4e54) {
                }
                printLog('info', '[\x20' + (_0x0_0x4016a4['botName'] || 'NOVA-MD') + '\x20]');
                printLog('info', 'WA\x20NUMBER\x20\x20:\x20' + (owner[0x0] || _0x0_0x4016a4['ownerNumber'] || ''));
                printLog('success', 'Bot\x20Connected\x20Successfully!');
                printLog('info', 'Plugins\x20\x20\x20:\x20' + _0x0_0x1e21bf['commands']['size']);
                printLog('info', 'Prefixes\x20\x20\x20:\x20' + _0x0_0x4016a4['prefixes']['join'](',\x20'));
                printLog('store', 'Backend\x20\x20\x20\x20:\x20' + _0x0_0x8f014e['getStats']()['backend']);
                console['log']();
            }
            if (_0x460d75 === 'close') {
                const _0x5e1b6e = _0x246c64?.['error']?.['output']?.['statusCode'];
                const _0x36b35c = _0x5e1b6e !== DisconnectReason['loggedOut'] && _0x5e1b6e !== 0x191;
                if (_0x5e1b6e === DisconnectReason['loggedOut'] || _0x5e1b6e === 0x191) {
                    try {
                        rmSync('./session', {
                            'recursive': !![],
                            'force': !![]
                        });
                    } catch (_0xe14078) {
                    }
                    await delay(0xbb8);
                    startNovaXCode();
                    return;
                }
                if (_0x36b35c) {
                    printLog('connection', 'Reconnecting\x20in\x205\x20seconds...');
                    await delay(0x1388);
                    startNovaXCode();
                }
            }
        });
        _0x24a328['ev']['on']('call', async _0xdd4309 => {
            await handleCall(_0x24a328, _0xdd4309);
        });
        _0x24a328['ev']['on']('group-participants.update', async _0x18d3d7 => {
            await handleGroupParticipantUpdate(_0x24a328, _0x18d3d7);
        });
        _0x24a328['ev']['on']('status.update', async _0x2a0ab6 => {
            await handleStatus(_0x24a328, _0x2a0ab6);
        });
        _0x24a328['ev']['on']('messages.reaction', async _0x3d6b04 => {
            await handleStatus(_0x24a328, _0x3d6b04);
        });
        return _0x24a328;
    } catch (_0x4509b7) {
        printLog('error', 'Error\x20in\x20startNovaXCode:\x20' + _0x4509b7['message']);
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
    printLog('info', '📱\x20Open\x20http://localhost:' + (_0x0_0x4016a4['port'] || 0x1388) + '/pairing\x20in\x20your\x20browser\x20if\x20it\x27s\x20local');
    printLog('info', '📱\x20For\x20web\x20servic\x20deployment,\x20click\x20the\x20service\x20URL\x20and\x20add\x20/pairing\x20at\x20the\x20end');
    const _0x57eafb = 0x1e * 0x3c * 0x3e8;
    const _0x3f8a30 = Date['now']();
    const _0x5872bb = 0xbb8;
    return new Promise((_0x31d5e8, _0x2ccbaf) => {
        const _0x57ccb3 = setInterval(() => {
            if (hasValidSession()) {
                clearInterval(_0x57ccb3);
                printLog('success', '✅\x20Session\x20detected!\x20Starting\x20bot...');
                _0x31d5e8();
            }
            if (Date['now']() - _0x3f8a30 > _0x57eafb) {
                clearInterval(_0x57ccb3);
                _0x2ccbaf(new Error('Session\x20creation\x20timeout\x20(30\x20minutes)'));
            }
        }, _0x5872bb);
    });
}
async function main() {
    await compileAll();
    await _0x0_0x1e21bf['loadCommands']();
    printLog('info', 'Starting\x20NOVA-MD\x20BOT...');
    if (hasValidSession()) {
        printLog('success', '✅\x20Valid\x20session\x20found,\x20starting\x20bot...');
        await delay(0xbb8);
        startNovaXCode()['catch'](_0x110ae6 => {
            printLog('error', 'Fatal\x20error:\x20' + _0x110ae6['message']);
            if (rl && !rlClosed)
                rl['close']();
            process['exit'](0x1);
        });
    } else {
        printLog('info', '🌐\x20No\x20session\x20found.\x20Launching\x20web\x20pairing\x20interface...');
        printLog('info', '📱\x20Open\x20http://localhost:' + (_0x0_0x4016a4['port'] || 0x1388) + '/pairing\x20in\x20your\x20browser\x20to\x20connect\x20WhatsApp');
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
            startNovaXCode()['catch'](_0x327a3d => {
                printLog('error', 'Fatal\x20error:\x20' + _0x327a3d['message']);
                if (rl && !rlClosed)
                    rl['close']();
                process['exit'](0x1);
            });
        } catch (_0x56e5c1) {
            printLog('error', 'Session\x20creation\x20failed:\x20' + _0x56e5c1['message']);
            if (rl && !rlClosed)
                rl['close']();
            process['exit'](0x1);
        }
    }
}
main();
const sessionDir = _0x0_0x4a39d5['join'](process['cwd'](), 'session');
setInterval(() => {
    if (!_0x0_0x83eef7['existsSync'](sessionDir))
        return;
    _0x0_0x83eef7['readdir'](sessionDir, (_0x57a7d8, _0x1ec946) => {
        if (_0x57a7d8)
            return;
        for (const _0x45e30 of _0x1ec946) {
            if (_0x45e30 === 'creds.json')
                continue;
            if (_0x45e30['startsWith']('app-state-sync-key-'))
                continue;
            _0x0_0x83eef7['unlink'](_0x0_0x4a39d5['join'](sessionDir, _0x45e30), () => {
            });
        }
    });
}, 0x3 * 0x3c * 0x3e8);
const customTemp = _0x0_0x4a39d5['join'](process['cwd'](), 'temp');
if (!_0x0_0x83eef7['existsSync'](customTemp))
    _0x0_0x83eef7['mkdirSync'](customTemp, { 'recursive': !![] });
process.env.TMPDIR = customTemp;
process.env.TEMP = customTemp;
process.env.TMP = customTemp;
setInterval(() => {
    _0x0_0x83eef7['readdir'](customTemp, (_0x16f229, _0x112c59) => {
        if (_0x16f229)
            return;
        for (const _0x55ad27 of _0x112c59) {
            const _0x6a5035 = _0x0_0x4a39d5['join'](customTemp, _0x55ad27);
            _0x0_0x83eef7['stat'](_0x6a5035, (_0x166656, _0x12be60) => {
                if (!_0x166656 && Date['now']() - _0x12be60['mtimeMs'] > 0x3 * 0x3c * 0x3c * 0x3e8) {
                    _0x0_0x83eef7['unlink'](_0x6a5035, () => {
                    });
                }
            });
        }
    });
}, 0x1 * 0x3c * 0x3c * 0x3e8);
const folders = [
    _0x0_0x4a39d5['join'](__dirname, './lib'),
    _0x0_0x4a39d5['join'](__dirname, './plugins')
];
folders['forEach'](_0x2a3f4b => {
    if (!_0x0_0x83eef7['existsSync'](_0x2a3f4b))
        return;
    _0x0_0x83eef7['readdirSync'](_0x2a3f4b)['filter'](_0x3696c7 => _0x3696c7['endsWith']('.js'))['forEach'](_0x46c360 => {
        const _0x572bea = _0x0_0x4a39d5['join'](_0x2a3f4b, _0x46c360);
        try {
            const _0x5e30c4 = _0x0_0x83eef7['readFileSync'](_0x572bea, 'utf-8');
            const _0x5d26ee = _0x0_0x28c9b4(_0x5e30c4, _0x46c360, {
                'sourceType': 'module',
                'allowAwaitOutsideFunction': !![]
            });
            if (_0x5d26ee) {
                console['error'](_0x0_0x4ea449['red']('❌\x20Syntax\x20error\x20in\x20' + _0x572bea + ':\x0a' + _0x5d26ee));
            }
        } catch (_0x7e9336) {
            console['error'](_0x0_0x4ea449['yellow']('⚠️\x20Cannot\x20read\x20file\x20' + _0x572bea + ':\x0a' + _0x7e9336));
        }
    });
});
process['on']('uncaughtException', _0x51e905 => {
    printLog('error', 'Uncaught\x20Exception:\x20' + _0x51e905['message']);
    console['error'](_0x51e905['stack']);
    writeErrorLog({
        'type': 'uncaughtException',
        'error': _0x51e905['message'],
        'stack': _0x51e905['stack'],
        'timestamp': new Date()['toISOString']()
    });
});
process['on']('unhandledRejection', _0x3c2112 => {
    printLog('error', 'Unhandled\x20Rejection:\x20' + _0x3c2112['message']);
    console['error'](_0x3c2112['stack']);
    writeErrorLog({
        'type': 'unhandledRejection',
        'error': _0x3c2112['message'],
        'stack': _0x3c2112['stack'],
        'timestamp': new Date()['toISOString']()
    });
});
server['on']('error', _0x18112f => {
    if (_0x18112f['code'] === 'EADDRINUSE') {
        printLog('error', 'Address\x20localhost:' + PORT + '\x20in\x20use');
        writeErrorLog({
            'type': 'serverError',
            'error': 'Address\x20localhost:' + PORT + '\x20in\x20use',
            'timestamp': new Date()['toISOString']()
        });
        server['close']();
    } else {
        printLog('error', 'Server\x20error:\x20' + _0x18112f['message']);
        writeErrorLog({
            'type': 'serverError',
            'error': _0x18112f['message'],
            'stack': _0x18112f['stack'],
            'timestamp': new Date()['toISOString']()
        });
    }
});