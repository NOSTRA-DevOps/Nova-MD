import 'dotenv/config';
import _0x0_0x5d76fc, {
    existsSync,
    mkdirSync,
    rmSync
} from 'fs';
import _0x0_0xc6214, { dirname } from 'path';
import _0x0_0x5a7eff from 'chalk';
import _0x0_0x554ea6 from 'syntax-error';
import { parsePhoneNumber as _0x0_0x1782f7 } from 'awesome-phonenumber';
import _0x0_0x17d9cd from 'readline';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { smsg } from './lib/myfunc.js';
import { compileAll } from './lib/compile.js';
import _0x0_0x54f0b6, {
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    Browsers,
    jidDecode,
    jidNormalizedUser,
    makeCacheableSignalKeyStore,
    delay
} from '@whiskeysockets/baileys';
import _0x0_0x51e6d1 from 'node-cache';
import _0x0_0x41caa0 from 'pino';
import _0x0_0x5ac8bb from './config.js';
import _0x0_0x2ca53f from './lib/lightweight_store.js';
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
import _0x0_0x792699 from './lib/commandHandler.js';
import _0x0_0x47daff from './lib/sessionManager.js';
_0x0_0x2ca53f['readFromFile']();
setInterval(() => _0x0_0x2ca53f['writeToFile'](), _0x0_0x5ac8bb['storeWriteInterval'] || 0x2710);
setInterval(() => {
    if (global['gc']) {
        global['gc']();
        console['log']('🧹\x20Garbage\x20collection\x20completed');
    }
}, 0xea60);
setInterval(() => {
    const _0x67be16 = process['memoryUsage']()['rss'] / 0x400 / 0x400;
    if (_0x67be16 > 0x190) {
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
_0x0_0x5d76fc['mkdirSync']('./data', { 'recursive': !![] });
for (const [file, def] of Object['entries'](DATA_DEFAULTS)) {
    const fp = './data/' + file;
    if (!_0x0_0x5d76fc['existsSync'](fp))
        _0x0_0x5d76fc['writeFileSync'](fp, JSON['stringify'](def, null, 0x2));
}
let owner = [];
try {
    owner = JSON['parse'](_0x0_0x5d76fc['readFileSync']('./data/owner.json', 'utf-8'));
} catch {
    owner = [];
}
global['botname'] = _0x0_0x5ac8bb['botName'] || 'NOVA-MD';
global['themeemoji'] = '•';
const pairingCode = ![];
const useMobile = process['argv']['includes']('--mobile');
let rl = null;
let rlClosed = ![];
if (process['stdin']['isTTY'] && !_0x0_0x5ac8bb['pairingNumber']) {
    rl = _0x0_0x17d9cd['createInterface']({
        'input': process['stdin'],
        'output': process['stdout']
    });
    rl['on']('close', () => {
        rlClosed = !![];
    });
}
const question = _0x7e2200 => {
    if (rl && !rlClosed) {
        return new Promise(_0x132607 => rl['question'](_0x7e2200, _0x132607));
    } else {
        return Promise['resolve'](_0x0_0x5ac8bb['ownerNumber'] || '237676250509');
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
    const _0x27250b = _0x0_0xc6214['join'](__dirname, 'session');
    if (!existsSync(_0x27250b)) {
        mkdirSync(_0x27250b, { 'recursive': !![] });
    }
    return _0x27250b;
}
function hasValidSession() {
    return _0x0_0x47daff['hasValidSession']();
}
server['listen'](PORT, () => {
    printLog('success', 'Server\x20listening\x20on\x20port\x20' + PORT);
    printLog('info', '🌐\x20Web\x20interface\x20available\x20at:\x20http://localhost:' + PORT + '/pairing');
});
async function startNovaXCode() {
    try {
        const {version: _0x612583} = await fetchLatestBaileysVersion();
        ensureSessionDirectory();
        await delay(0x3e8);
        const {
            state: _0x44bbec,
            saveCreds: _0x250be0
        } = await useMultiFileAuthState('./session');
        const _0x3496e2 = async () => {
            ensureSessionDirectory();
            await _0x250be0();
        };
        const _0x11d97e = new _0x0_0x51e6d1();
        const _0x373083 = await _0x0_0x2ca53f['getSetting']('global', 'stealthMode');
        const _0x2fb68b = _0x373083 && _0x373083['enabled'];
        const _0x411485 = _0x0_0x54f0b6({
            'version': _0x612583,
            'logger': _0x0_0x41caa0({ 'level': 'silent' }),
            'browser': Browsers['macOS']('Chrome'),
            'auth': {
                'creds': _0x44bbec['creds'],
                'keys': makeCacheableSignalKeyStore(_0x44bbec['keys'], _0x0_0x41caa0({ 'level': 'fatal' })['child']({ 'level': 'fatal' }))
            },
            'markOnlineOnConnect': !_0x2fb68b,
            'generateHighQualityLinkPreview': !![],
            'syncFullHistory': ![],
            'getMessage': async _0x545dfc => {
                const _0x2e3ab5 = jidNormalizedUser(_0x545dfc['remoteJid']);
                const _0x1ea43e = await _0x0_0x2ca53f['loadMessage'](_0x2e3ab5, _0x545dfc['id']);
                return _0x1ea43e?.['message'] || '';
            },
            'msgRetryCounterCache': _0x11d97e,
            'defaultQueryTimeoutMs': 0xea60,
            'connectTimeoutMs': 0xea60,
            'keepAliveIntervalMs': 0x2710
        });
        _0x411485['store'] = _0x0_0x2ca53f;
        const _0x26b3ce = _0x411485['sendPresenceUpdate'];
        const _0x38fca0 = _0x411485['readMessages'];
        const _0x55b281 = _0x411485['sendReceipt'];
        _0x411485['sendPresenceUpdate'] = async function (..._0x4d722c) {
            const _0xa0dc35 = await _0x0_0x2ca53f['getSetting']('global', 'stealthMode');
            if (_0xa0dc35 && _0xa0dc35['enabled']) {
                printLog('info', '👻\x20Blocked\x20presence\x20update\x20(stealth\x20mode)');
                return;
            }
            return _0x26b3ce['apply'](this, _0x4d722c);
        };
        _0x411485['readMessages'] = async function (..._0x4b11db) {
            const _0x5ec95f = await _0x0_0x2ca53f['getSetting']('global', 'stealthMode');
            if (_0x5ec95f && _0x5ec95f['enabled'])
                return;
            return _0x38fca0['apply'](this, _0x4b11db);
        };
        if (_0x55b281) {
            _0x411485['sendReceipt'] = async function (..._0x3532d4) {
                const _0x333616 = await _0x0_0x2ca53f['getSetting']('global', 'stealthMode');
                if (_0x333616 && _0x333616['enabled'])
                    return;
                return _0x55b281['apply'](this, _0x3532d4);
            };
        }
        const _0x1ba09b = _0x411485['query'];
        _0x411485['query'] = async function (_0x30a7b8, ..._0x161bbe) {
            const _0x2ae0a3 = await _0x0_0x2ca53f['getSetting']('global', 'stealthMode');
            if (_0x2ae0a3 && _0x2ae0a3['enabled']) {
                if (_0x30a7b8 && _0x30a7b8['tag'] === 'receipt')
                    return;
                if (_0x30a7b8 && _0x30a7b8['attrs'] && (_0x30a7b8['attrs']['type'] === 'read' || _0x30a7b8['attrs']['type'] === 'read-self'))
                    return;
            }
            return _0x1ba09b['apply'](this, [
                _0x30a7b8,
                ..._0x161bbe
            ]);
        };
        _0x411485['isGhostMode'] = async () => {
            const _0x81032a = await _0x0_0x2ca53f['getSetting']('global', 'stealthMode');
            return _0x81032a && _0x81032a['enabled'];
        };
        _0x411485['ev']['on']('creds.update', _0x3496e2);
        _0x0_0x2ca53f['bind'](_0x411485['ev']);
        _0x411485['ev']['on']('messages.upsert', async _0x5f334b => {
            try {
                const _0x1f238e = _0x5f334b['messages'][0x0];
                if (!_0x1f238e['message'])
                    return;
                _0x1f238e['message'] = Object['keys'](_0x1f238e['message'])[0x0] === 'ephemeralMessage' ? _0x1f238e['message']['ephemeralMessage']['message'] : _0x1f238e['message'];
                if (_0x1f238e['key'] && _0x1f238e['key']['remoteJid'] === 'status@broadcast') {
                    await handleStatus(_0x411485, _0x5f334b);
                    return;
                }
                if (!_0x411485['public'] && !_0x1f238e['key']['fromMe'] && _0x5f334b['type'] === 'notify') {
                    const _0x398ce6 = _0x1f238e['key']?.['remoteJid']?.['endsWith']('@g.us');
                    if (!_0x398ce6)
                        return;
                }
                if (_0x1f238e['key']['id']['startsWith']('BAE5') && _0x1f238e['key']['id']['length'] === 0x10)
                    return;
                if (_0x411485?.['msgRetryCounterCache']) {
                    _0x411485['msgRetryCounterCache']['clear']();
                }
                try {
                    await handleMessages(_0x411485, _0x5f334b);
                } catch (_0x3fbddf) {
                    printLog('error', 'Error\x20in\x20handleMessages:\x20' + _0x3fbddf['message']);
                    if (_0x1f238e['key'] && _0x1f238e['key']['remoteJid']) {
                        await _0x411485['sendMessage'](_0x1f238e['key']['remoteJid'], {
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
            } catch (_0x386111) {
                printLog('error', 'Error\x20in\x20messages.upsert:\x20' + _0x386111['message']);
            }
        });
        _0x411485['decodeJid'] = _0x33288e => {
            if (!_0x33288e)
                return _0x33288e;
            if (/:\d+@/gi['test'](_0x33288e)) {
                const _0x5fc01c = jidDecode(_0x33288e) || {};
                return _0x5fc01c['user'] && _0x5fc01c['server'] && _0x5fc01c['user'] + '@' + _0x5fc01c['server'] || _0x33288e;
            } else
                return _0x33288e;
        };
        _0x411485['ev']['on']('contacts.update', _0x260ecc => {
            for (const _0x3569bd of _0x260ecc) {
                const _0x2019ff = _0x411485['decodeJid'](_0x3569bd['id']);
                if (_0x0_0x2ca53f && _0x0_0x2ca53f['contacts'])
                    _0x0_0x2ca53f['contacts'][_0x2019ff] = {
                        'id': _0x2019ff,
                        'name': _0x3569bd['notify']
                    };
            }
        });
        _0x411485['getName'] = (_0x482f7b, _0x40dd6c = ![]) => {
            const _0x3111e1 = _0x411485['decodeJid'](_0x482f7b);
            _0x40dd6c = _0x411485['withoutContact'] || _0x40dd6c;
            let _0x43f5f8;
            if (_0x3111e1['endsWith']('@g.us'))
                return new Promise(async _0x129688 => {
                    _0x43f5f8 = _0x0_0x2ca53f['contacts'][_0x3111e1] || {};
                    if (!(_0x43f5f8['name'] || _0x43f5f8['subject']))
                        _0x43f5f8 = _0x411485['groupMetadata'](_0x3111e1) || {};
                    _0x129688(_0x43f5f8['name'] || _0x43f5f8['subject'] || _0x0_0x1782f7('+' + _0x3111e1['replace']('@s.whatsapp.net', ''))['number']?.['international']);
                });
            else
                _0x43f5f8 = _0x3111e1 === '0@s.whatsapp.net' ? {
                    'id': _0x3111e1,
                    'name': 'WhatsApp'
                } : _0x3111e1 === _0x411485['decodeJid'](_0x411485['user']['id']) ? _0x411485['user'] : _0x0_0x2ca53f['contacts'][_0x3111e1] || {};
            return (_0x40dd6c ? '' : _0x43f5f8['name']) || _0x43f5f8['subject'] || _0x43f5f8['verifiedName'] || _0x0_0x1782f7('+' + _0x482f7b['replace']('@s.whatsapp.net', ''))['number']?.['international'];
        };
        _0x411485['public'] = !![];
        _0x411485['serializeM'] = _0x13c2b4 => smsg(_0x411485, _0x13c2b4, _0x0_0x2ca53f);
        const _0x197dee = _0x44bbec['creds']?.['registered'] === !![];
        if (_0x197dee) {
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
        _0x411485['ev']['on']('connection.update', async _0x5b53bf => {
            const {
                connection: _0x329882,
                lastDisconnect: _0x89427e,
                qr: _0x457e34
            } = _0x5b53bf;
            if (_0x329882 === 'open') {
                printLog('success', 'Bot\x20connected\x20successfully!');
                try {
                    const _0x1de700 = await _0x0_0x2ca53f['getBotMode']();
                    const _0x1e192e = process['uptime']();
                    const _0x3bd4c2 = Math['floor'](_0x1e192e / 0xe10);
                    const _0x31209d = Math['floor'](_0x1e192e % 0xe10 / 0x3c);
                    const _0x94411 = 'https://raw.githubusercontent.com/NOSTRA-DevOps/Nova-MD/refs/heads/main/assets/logo.PNG';
                    let _0x27f506 = null;
                    try {
                        const _0x56277c = await fetch(_0x94411);
                        if (_0x56277c['ok']) {
                            const _0x38d214 = await _0x56277c['arrayBuffer']();
                            _0x27f506 = Buffer['from'](_0x38d214);
                        }
                    } catch (_0x18209d) {
                        const _0x39a3cf = _0x0_0xc6214['join'](process['cwd'](), 'assets', 'logo.PNG');
                        if (_0x0_0x5d76fc['existsSync'](_0x39a3cf)) {
                            _0x27f506 = _0x0_0x5d76fc['readFileSync'](_0x39a3cf);
                        }
                    }
                    let _0x11210d = '╭━━━━『\x20*' + (_0x0_0x5ac8bb['botName'] || 'NOVA-MD') + '\x20INFO*\x20』━━━⬣\x0a';
                    _0x11210d += '┃\x0a';
                    _0x11210d += '┃\x20✨\x20*Status:*\x20✅\x20ONLINE\x0a';
                    _0x11210d += '┃\x20🤖\x20*Version:*\x20' + (_0x0_0x5ac8bb['version'] || '2.5.0') + '\x20(Stable)\x0a';
                    _0x11210d += '┃\x20⚙️\x20*Mode:*\x20' + _0x1de700['toUpperCase']() + '\x0a';
                    _0x11210d += '┃\x20⏰\x20*Uptime:*\x20' + _0x3bd4c2 + 'h\x20' + _0x31209d + 'm\x0a';
                    _0x11210d += '┃\x20📊\x20*Prefixes:*\x20' + _0x0_0x5ac8bb['prefixes']['join']('\x20') + '\x0a';
                    _0x11210d += '┃\x20📦\x20*Plugins:*\x20' + _0x0_0x792699['commands']['size'] + '\x0a';
                    _0x11210d += '┃\x20💾\x20*Storage:*\x20' + _0x0_0x2ca53f['getStats']()['backend']['toUpperCase']() + '\x0a';
                    _0x11210d += '┃\x0a';
                    _0x11210d += '┃━━━━━━━━━━━━━━━━━━⬣\x0a';
                    _0x11210d += '┃\x0a';
                    _0x11210d += '┃\x20🌐\x20*JOIN\x20CHANNELS*\x0a';
                    _0x11210d += '┃\x0a';
                    _0x11210d += '┃\x20💬\x20*FaceBook:*\x0a';
                    _0x11210d += '┃\x20https://www.facebook.com/profile.php?id=61591828051151\x0a';
                    _0x11210d += '┃\x0a';
                    _0x11210d += '┃\x20📱\x20*Telegram:*\x0a';
                    _0x11210d += '┃\x20https://t.me/addlist/CpQzYQfWwwxmYTk0\x0a';
                    _0x11210d += '┃\x0a';
                    _0x11210d += '┃\x20▶️\x20*YouTube:*\x0a';
                    _0x11210d += '┃\x20https://youtube.com/@labokingfreesurf\x0a';
                    _0x11210d += '┃\x0a';
                    _0x11210d += '┃━━━━━━━━━━━━━━━━━━⬣\x0a';
                    _0x11210d += '┃\x0a';
                    _0x11210d += '┃\x20✨\x20_Powered\x20by\x20NOSTRA._\x0a';
                    _0x11210d += '╰━━━━━━━━━━━━━━━━━━⬣';
                    const _0xdcd425 = _0x411485['user']['id']['split'](':')[0x0] + '@s.whatsapp.net';
                    if (_0x27f506) {
                        await _0x411485['sendMessage'](_0xdcd425, {
                            'image': _0x27f506,
                            'caption': _0x11210d,
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
                        await _0x411485['sendMessage'](_0xdcd425, {
                            'text': _0x11210d,
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
                } catch (_0x1a474a) {
                    printLog('error', 'Failed\x20to\x20send\x20automatic\x20about\x20message:\x20' + _0x1a474a['message']);
                }
                const _0x1bb193 = await _0x0_0x2ca53f['getSetting']('global', 'stealthMode');
                if (_0x1bb193 && _0x1bb193['enabled']) {
                    printLog('info', '👻\x20STEALTH\x20MODE\x20ACTIVE');
                }
                printLog('success', 'Connected\x20to\x20=>\x20' + JSON['stringify'](_0x411485['user'], null, 0x2));
                await delay(0x7cf);
                try {
                    owner = JSON['parse'](_0x0_0x5d76fc['readFileSync']('./data/owner.json', 'utf-8'));
                } catch (_0x3569d5) {
                }
                printLog('info', '[\x20' + (_0x0_0x5ac8bb['botName'] || 'NOVA-MD') + '\x20]');
                printLog('info', 'WA\x20NUMBER\x20\x20:\x20' + (owner[0x0] || _0x0_0x5ac8bb['ownerNumber'] || ''));
                printLog('success', 'Bot\x20Connected\x20Successfully!');
                printLog('info', 'Plugins\x20\x20\x20:\x20' + _0x0_0x792699['commands']['size']);
                printLog('info', 'Prefixes\x20\x20\x20:\x20' + _0x0_0x5ac8bb['prefixes']['join'](',\x20'));
                printLog('store', 'Backend\x20\x20\x20\x20:\x20' + _0x0_0x2ca53f['getStats']()['backend']);
                console['log']();
            }
            if (_0x329882 === 'close') {
                const _0xf5fe3e = _0x89427e?.['error']?.['output']?.['statusCode'];
                const _0x59cc79 = _0xf5fe3e !== DisconnectReason['loggedOut'] && _0xf5fe3e !== 0x191;
                if (_0xf5fe3e === DisconnectReason['loggedOut'] || _0xf5fe3e === 0x191) {
                    try {
                        rmSync('./session', {
                            'recursive': !![],
                            'force': !![]
                        });
                    } catch (_0x4dccdb) {
                    }
                    await delay(0xbb8);
                    startNovaXCode();
                    return;
                }
                if (_0x59cc79) {
                    printLog('connection', 'Reconnecting\x20in\x205\x20seconds...');
                    await delay(0x1388);
                    startNovaXCode();
                }
            }
        });
        _0x411485['ev']['on']('call', async _0x231324 => {
            await handleCall(_0x411485, _0x231324);
        });
        _0x411485['ev']['on']('group-participants.update', async _0x5c9b42 => {
            await handleGroupParticipantUpdate(_0x411485, _0x5c9b42);
        });
        _0x411485['ev']['on']('status.update', async _0x82a706 => {
            await handleStatus(_0x411485, _0x82a706);
        });
        _0x411485['ev']['on']('messages.reaction', async _0xb5f036 => {
            await handleStatus(_0x411485, _0xb5f036);
        });
        return _0x411485;
    } catch (_0x42927c) {
        printLog('error', 'Error\x20in\x20startNovaXCode:\x20' + _0x42927c['message']);
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
    printLog('info', '📱\x20Open\x20http://localhost:' + (_0x0_0x5ac8bb['port'] || 0x1388) + '/pairing\x20in\x20your\x20browser\x20if\x20it\x27s\x20local');
    printLog('info', '📱\x20For\x20web\x20servic\x20deployment,\x20click\x20the\x20service\x20URL\x20and\x20add\x20/pairing\x20at\x20the\x20end');
    const _0x359640 = 0x1e * 0x3c * 0x3e8;
    const _0x255428 = Date['now']();
    const _0x242c30 = 0xbb8;
    return new Promise((_0x1bf582, _0x36618d) => {
        const _0x16c262 = setInterval(() => {
            if (hasValidSession()) {
                clearInterval(_0x16c262);
                printLog('success', '✅\x20Session\x20detected!\x20Starting\x20bot...');
                _0x1bf582();
            }
            if (Date['now']() - _0x255428 > _0x359640) {
                clearInterval(_0x16c262);
                _0x36618d(new Error('Session\x20creation\x20timeout\x20(30\x20minutes)'));
            }
        }, _0x242c30);
    });
}
async function main() {
    await compileAll();
    await _0x0_0x792699['loadCommands']();
    printLog('info', 'Starting\x20NOVA-MD\x20BOT...');
    if (hasValidSession()) {
        printLog('success', '✅\x20Valid\x20session\x20found,\x20starting\x20bot...');
        await delay(0xbb8);
        startNovaXCode()['catch'](_0x107621 => {
            printLog('error', 'Fatal\x20error:\x20' + _0x107621['message']);
            if (rl && !rlClosed)
                rl['close']();
            process['exit'](0x1);
        });
    } else {
        printLog('info', '🌐\x20No\x20session\x20found.\x20Launching\x20web\x20pairing\x20interface...');
        printLog('info', '📱\x20Open\x20http://localhost:' + (_0x0_0x5ac8bb['port'] || 0x1388) + '/pairing\x20in\x20your\x20browser\x20to\x20connect\x20WhatsApp');
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
            startNovaXCode()['catch'](_0x51d184 => {
                printLog('error', 'Fatal\x20error:\x20' + _0x51d184['message']);
                if (rl && !rlClosed)
                    rl['close']();
                process['exit'](0x1);
            });
        } catch (_0x1e3701) {
            printLog('error', 'Session\x20creation\x20failed:\x20' + _0x1e3701['message']);
            if (rl && !rlClosed)
                rl['close']();
            process['exit'](0x1);
        }
    }
}
main();
const sessionDir = _0x0_0xc6214['join'](process['cwd'](), 'session');
setInterval(() => {
    if (!_0x0_0x5d76fc['existsSync'](sessionDir))
        return;
    _0x0_0x5d76fc['readdir'](sessionDir, (_0x54fc80, _0x2af1b0) => {
        if (_0x54fc80)
            return;
        for (const _0x4199f of _0x2af1b0) {
            if (_0x4199f === 'creds.json')
                continue;
            if (_0x4199f['startsWith']('app-state-sync-key-'))
                continue;
            _0x0_0x5d76fc['unlink'](_0x0_0xc6214['join'](sessionDir, _0x4199f), () => {
            });
        }
    });
}, 0x3 * 0x3c * 0x3e8);
const customTemp = _0x0_0xc6214['join'](process['cwd'](), 'temp');
if (!_0x0_0x5d76fc['existsSync'](customTemp))
    _0x0_0x5d76fc['mkdirSync'](customTemp, { 'recursive': !![] });
process.env.TMPDIR = customTemp;
process.env.TEMP = customTemp;
process.env.TMP = customTemp;
setInterval(() => {
    _0x0_0x5d76fc['readdir'](customTemp, (_0x3986bc, _0x1e52c6) => {
        if (_0x3986bc)
            return;
        for (const _0x3d0491 of _0x1e52c6) {
            const _0x385659 = _0x0_0xc6214['join'](customTemp, _0x3d0491);
            _0x0_0x5d76fc['stat'](_0x385659, (_0x329154, _0x36a8bd) => {
                if (!_0x329154 && Date['now']() - _0x36a8bd['mtimeMs'] > 0x3 * 0x3c * 0x3c * 0x3e8) {
                    _0x0_0x5d76fc['unlink'](_0x385659, () => {
                    });
                }
            });
        }
    });
}, 0x1 * 0x3c * 0x3c * 0x3e8);
const folders = [
    _0x0_0xc6214['join'](__dirname, './lib'),
    _0x0_0xc6214['join'](__dirname, './plugins')
];
folders['forEach'](_0x869e29 => {
    if (!_0x0_0x5d76fc['existsSync'](_0x869e29))
        return;
    _0x0_0x5d76fc['readdirSync'](_0x869e29)['filter'](_0x343aaa => _0x343aaa['endsWith']('.js'))['forEach'](_0x5aa73d => {
        const _0x39285c = _0x0_0xc6214['join'](_0x869e29, _0x5aa73d);
        try {
            const _0x3c7d14 = _0x0_0x5d76fc['readFileSync'](_0x39285c, 'utf-8');
            const _0x3dcff6 = _0x0_0x554ea6(_0x3c7d14, _0x5aa73d, {
                'sourceType': 'module',
                'allowAwaitOutsideFunction': !![]
            });
            if (_0x3dcff6) {
                console['error'](_0x0_0x5a7eff['red']('❌\x20Syntax\x20error\x20in\x20' + _0x39285c + ':\x0a' + _0x3dcff6));
            }
        } catch (_0x4ac8e2) {
            console['error'](_0x0_0x5a7eff['yellow']('⚠️\x20Cannot\x20read\x20file\x20' + _0x39285c + ':\x0a' + _0x4ac8e2));
        }
    });
});
process['on']('uncaughtException', _0x5bef8e => {
    printLog('error', 'Uncaught\x20Exception:\x20' + _0x5bef8e['message']);
    console['error'](_0x5bef8e['stack']);
    writeErrorLog({
        'type': 'uncaughtException',
        'error': _0x5bef8e['message'],
        'stack': _0x5bef8e['stack'],
        'timestamp': new Date()['toISOString']()
    });
});
process['on']('unhandledRejection', _0xb922de => {
    printLog('error', 'Unhandled\x20Rejection:\x20' + _0xb922de['message']);
    console['error'](_0xb922de['stack']);
    writeErrorLog({
        'type': 'unhandledRejection',
        'error': _0xb922de['message'],
        'stack': _0xb922de['stack'],
        'timestamp': new Date()['toISOString']()
    });
});
server['on']('error', _0x1be818 => {
    if (_0x1be818['code'] === 'EADDRINUSE') {
        printLog('error', 'Address\x20localhost:' + PORT + '\x20in\x20use');
        writeErrorLog({
            'type': 'serverError',
            'error': 'Address\x20localhost:' + PORT + '\x20in\x20use',
            'timestamp': new Date()['toISOString']()
        });
        server['close']();
    } else {
        printLog('error', 'Server\x20error:\x20' + _0x1be818['message']);
        writeErrorLog({
            'type': 'serverError',
            'error': _0x1be818['message'],
            'stack': _0x1be818['stack'],
            'timestamp': new Date()['toISOString']()
        });
    }
});