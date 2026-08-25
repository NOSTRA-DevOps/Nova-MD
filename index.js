import 'dotenv/config';
import _0x0_0x247a37, {
    existsSync,
    mkdirSync,
    rmSync
} from 'fs';
import _0x0_0x46aad7, { dirname } from 'path';
import _0x0_0x18459c from 'chalk';
import _0x0_0x560a9a from 'syntax-error';
import { parsePhoneNumber as _0x0_0x234db0 } from 'awesome-phonenumber';
import _0x0_0x4133e3 from 'readline';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { smsg } from './lib/myfunc.js';
import { updateOwnerNumberFromSession } from './lib/updateOwnerConfig.js';
import { compileAll } from './lib/compile.js';
import _0x0_0x5208b5, {
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    Browsers,
    jidDecode,
    jidNormalizedUser,
    makeCacheableSignalKeyStore,
    delay
} from '@whiskeysockets/baileys';
import _0x0_0x30842a from 'node-cache';
import _0x0_0x2a6399 from 'pino';
import _0x0_0x267610 from './config.js';
import _0x0_0x184059 from './lib/lightweight_store.js';
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
import _0x0_0x1ff55c from './lib/commandHandler.js';
import _0x0_0x5b98d0 from './lib/sessionManager.js';
_0x0_0x184059['readFromFile']();
setInterval(() => _0x0_0x184059['writeToFile'](), _0x0_0x267610['storeWriteInterval'] || 0x2710);
setInterval(() => {
    if (global['gc']) {
        global['gc']();
        console['log']('🧹\x20Garbage\x20collection\x20completed');
    }
}, 0xea60);
setInterval(() => {
    const _0x5d440b = process['memoryUsage']()['rss'] / 0x400 / 0x400;
    if (_0x5d440b > 0x190) {
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
_0x0_0x247a37['mkdirSync']('./data', { 'recursive': !![] });
for (const [file, def] of Object['entries'](DATA_DEFAULTS)) {
    const fp = './data/' + file;
    if (!_0x0_0x247a37['existsSync'](fp))
        _0x0_0x247a37['writeFileSync'](fp, JSON['stringify'](def, null, 0x2));
}
let owner = [];
try {
    owner = JSON['parse'](_0x0_0x247a37['readFileSync']('./data/owner.json', 'utf-8'));
} catch {
    owner = [];
}
global['botname'] = _0x0_0x267610['botName'] || 'NOVA-MD';
global['themeemoji'] = '•';
const pairingCode = ![];
const useMobile = process['argv']['includes']('--mobile');
let rl = null;
let rlClosed = ![];
if (process['stdin']['isTTY'] && !_0x0_0x267610['pairingNumber']) {
    rl = _0x0_0x4133e3['createInterface']({
        'input': process['stdin'],
        'output': process['stdout']
    });
    rl['on']('close', () => {
        rlClosed = !![];
    });
}
const question = _0x450011 => {
    if (rl && !rlClosed) {
        return new Promise(_0xc7b911 => rl['question'](_0x450011, _0xc7b911));
    } else {
        return Promise['resolve'](_0x0_0x267610['ownerNumber'] || '237676250509');
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
    const _0x2de5de = _0x0_0x46aad7['join'](__dirname, 'session');
    if (!existsSync(_0x2de5de)) {
        mkdirSync(_0x2de5de, { 'recursive': !![] });
    }
    return _0x2de5de;
}
function hasValidSession() {
    return _0x0_0x5b98d0['hasValidSession']();
}
server['listen'](PORT, () => {
    printLog('success', 'Server\x20listening\x20on\x20port\x20' + PORT);
    printLog('info', '🌐\x20Web\x20interface\x20available\x20at:\x20http://localhost:' + PORT + '/pairing');
});
async function startNovaXCode() {
    try {
        const {version: _0x363e44} = await fetchLatestBaileysVersion();
        ensureSessionDirectory();
        await delay(0x3e8);
        const {
            state: _0x1d244c,
            saveCreds: _0x111a2f
        } = await useMultiFileAuthState('./session');
        const _0x547e56 = async () => {
            ensureSessionDirectory();
            await _0x111a2f();
        };
        const _0x268183 = new _0x0_0x30842a();
        const _0x5bfbf6 = await _0x0_0x184059['getSetting']('global', 'stealthMode');
        const _0x40ac44 = _0x5bfbf6 && _0x5bfbf6['enabled'];
        const _0x93109c = _0x0_0x5208b5({
            'version': _0x363e44,
            'logger': _0x0_0x2a6399({ 'level': 'silent' }),
            'browser': Browsers['macOS']('Chrome'),
            'auth': {
                'creds': _0x1d244c['creds'],
                'keys': makeCacheableSignalKeyStore(_0x1d244c['keys'], _0x0_0x2a6399({ 'level': 'fatal' })['child']({ 'level': 'fatal' }))
            },
            'markOnlineOnConnect': !_0x40ac44,
            'generateHighQualityLinkPreview': !![],
            'syncFullHistory': ![],
            'getMessage': async _0x20dd16 => {
                const _0x130ed7 = jidNormalizedUser(_0x20dd16['remoteJid']);
                const _0x39deba = await _0x0_0x184059['loadMessage'](_0x130ed7, _0x20dd16['id']);
                return _0x39deba?.['message'] || '';
            },
            'msgRetryCounterCache': _0x268183,
            'defaultQueryTimeoutMs': 0xea60,
            'connectTimeoutMs': 0xea60,
            'keepAliveIntervalMs': 0x2710
        });
        _0x93109c['store'] = _0x0_0x184059;
        const _0x39a2ae = _0x93109c['sendPresenceUpdate'];
        const _0x2c7ad8 = _0x93109c['readMessages'];
        const _0x47f4d1 = _0x93109c['sendReceipt'];
        _0x93109c['sendPresenceUpdate'] = async function (..._0x394000) {
            const _0x3e91e1 = await _0x0_0x184059['getSetting']('global', 'stealthMode');
            if (_0x3e91e1 && _0x3e91e1['enabled']) {
                printLog('info', '👻\x20Blocked\x20presence\x20update\x20(stealth\x20mode)');
                return;
            }
            return _0x39a2ae['apply'](this, _0x394000);
        };
        _0x93109c['readMessages'] = async function (..._0x5a6358) {
            const _0x5b247e = await _0x0_0x184059['getSetting']('global', 'stealthMode');
            if (_0x5b247e && _0x5b247e['enabled'])
                return;
            return _0x2c7ad8['apply'](this, _0x5a6358);
        };
        if (_0x47f4d1) {
            _0x93109c['sendReceipt'] = async function (..._0x3ce71e) {
                const _0x1a255e = await _0x0_0x184059['getSetting']('global', 'stealthMode');
                if (_0x1a255e && _0x1a255e['enabled'])
                    return;
                return _0x47f4d1['apply'](this, _0x3ce71e);
            };
        }
        const _0x8bc36a = _0x93109c['query'];
        _0x93109c['query'] = async function (_0x425398, ..._0x286ba1) {
            const _0x4bace7 = await _0x0_0x184059['getSetting']('global', 'stealthMode');
            if (_0x4bace7 && _0x4bace7['enabled']) {
                if (_0x425398 && _0x425398['tag'] === 'receipt')
                    return;
                if (_0x425398 && _0x425398['attrs'] && (_0x425398['attrs']['type'] === 'read' || _0x425398['attrs']['type'] === 'read-self'))
                    return;
            }
            return _0x8bc36a['apply'](this, [
                _0x425398,
                ..._0x286ba1
            ]);
        };
        _0x93109c['isGhostMode'] = async () => {
            const _0x46a734 = await _0x0_0x184059['getSetting']('global', 'stealthMode');
            return _0x46a734 && _0x46a734['enabled'];
        };
        _0x93109c['ev']['on']('creds.update', _0x547e56);
        _0x0_0x184059['bind'](_0x93109c['ev']);
        _0x93109c['ev']['on']('messages.upsert', async _0x8d4020 => {
            try {
                const _0x4d7509 = _0x8d4020['messages'][0x0];
                if (!_0x4d7509['message'])
                    return;
                _0x4d7509['message'] = Object['keys'](_0x4d7509['message'])[0x0] === 'ephemeralMessage' ? _0x4d7509['message']['ephemeralMessage']['message'] : _0x4d7509['message'];
                if (_0x4d7509['key'] && _0x4d7509['key']['remoteJid'] === 'status@broadcast') {
                    await handleStatus(_0x93109c, _0x8d4020);
                    return;
                }
                if (!_0x93109c['public'] && !_0x4d7509['key']['fromMe'] && _0x8d4020['type'] === 'notify') {
                    const _0xa40256 = _0x4d7509['key']?.['remoteJid']?.['endsWith']('@g.us');
                    if (!_0xa40256)
                        return;
                }
                if (_0x4d7509['key']['id']['startsWith']('BAE5') && _0x4d7509['key']['id']['length'] === 0x10)
                    return;
                if (_0x93109c?.['msgRetryCounterCache']) {
                    _0x93109c['msgRetryCounterCache']['clear']();
                }
                try {
                    await handleMessages(_0x93109c, _0x8d4020);
                } catch (_0x404b08) {
                    printLog('error', 'Error\x20in\x20handleMessages:\x20' + _0x404b08['message']);
                    if (_0x4d7509['key'] && _0x4d7509['key']['remoteJid']) {
                        await _0x93109c['sendMessage'](_0x4d7509['key']['remoteJid'], {
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
            } catch (_0x2e2e81) {
                printLog('error', 'Error\x20in\x20messages.upsert:\x20' + _0x2e2e81['message']);
            }
        });
        _0x93109c['decodeJid'] = _0x4c4812 => {
            if (!_0x4c4812)
                return _0x4c4812;
            if (/:\d+@/gi['test'](_0x4c4812)) {
                const _0x3b892b = jidDecode(_0x4c4812) || {};
                return _0x3b892b['user'] && _0x3b892b['server'] && _0x3b892b['user'] + '@' + _0x3b892b['server'] || _0x4c4812;
            } else
                return _0x4c4812;
        };
        _0x93109c['ev']['on']('contacts.update', _0x2b1b58 => {
            for (const _0xd24272 of _0x2b1b58) {
                const _0x5c7810 = _0x93109c['decodeJid'](_0xd24272['id']);
                if (_0x0_0x184059 && _0x0_0x184059['contacts'])
                    _0x0_0x184059['contacts'][_0x5c7810] = {
                        'id': _0x5c7810,
                        'name': _0xd24272['notify']
                    };
            }
        });
        _0x93109c['getName'] = (_0xe9e33e, _0x5260b9 = ![]) => {
            const _0x18901e = _0x93109c['decodeJid'](_0xe9e33e);
            _0x5260b9 = _0x93109c['withoutContact'] || _0x5260b9;
            let _0x4d048f;
            if (_0x18901e['endsWith']('@g.us'))
                return new Promise(async _0x2fb6e6 => {
                    _0x4d048f = _0x0_0x184059['contacts'][_0x18901e] || {};
                    if (!(_0x4d048f['name'] || _0x4d048f['subject']))
                        _0x4d048f = _0x93109c['groupMetadata'](_0x18901e) || {};
                    _0x2fb6e6(_0x4d048f['name'] || _0x4d048f['subject'] || _0x0_0x234db0('+' + _0x18901e['replace']('@s.whatsapp.net', ''))['number']?.['international']);
                });
            else
                _0x4d048f = _0x18901e === '0@s.whatsapp.net' ? {
                    'id': _0x18901e,
                    'name': 'WhatsApp'
                } : _0x18901e === _0x93109c['decodeJid'](_0x93109c['user']['id']) ? _0x93109c['user'] : _0x0_0x184059['contacts'][_0x18901e] || {};
            return (_0x5260b9 ? '' : _0x4d048f['name']) || _0x4d048f['subject'] || _0x4d048f['verifiedName'] || _0x0_0x234db0('+' + _0xe9e33e['replace']('@s.whatsapp.net', ''))['number']?.['international'];
        };
        _0x93109c['public'] = !![];
        _0x93109c['serializeM'] = _0x3d4af2 => smsg(_0x93109c, _0x3d4af2, _0x0_0x184059);
        const _0x4e8323 = _0x1d244c['creds']?.['registered'] === !![];
        if (_0x4e8323) {
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
        _0x93109c['ev']['on']('connection.update', async _0x461ffb => {
            const {
                connection: _0x2a838f,
                lastDisconnect: _0xcc0668,
                qr: _0x1d52ae
            } = _0x461ffb;
            if (_0x2a838f === 'open') {
                printLog('success', 'Bot\x20connected\x20successfully!');
                try {
                    await updateOwnerNumberFromSession();
                    console['log']('✅\x20Bot\x20connected\x20and\x20owner\x20number\x20updated');
                    const _0x9b54d6 = await _0x0_0x184059['getBotMode']();
                    const _0x3edf62 = process['uptime']();
                    const _0x522dd0 = Math['floor'](_0x3edf62 / 0xe10);
                    const _0x43670c = Math['floor'](_0x3edf62 % 0xe10 / 0x3c);
                    const _0x5dd969 = 'https://raw.githubusercontent.com/NOSTRA-DevOps/Nova-MD/refs/heads/main/assets/logo.PNG';
                    let _0x4e9856 = null;
                    try {
                        const _0x4c4523 = await fetch(_0x5dd969);
                        if (_0x4c4523['ok']) {
                            const _0x2429b4 = await _0x4c4523['arrayBuffer']();
                            _0x4e9856 = Buffer['from'](_0x2429b4);
                        }
                    } catch (_0x1aad28) {
                        const _0x2ab747 = _0x0_0x46aad7['join'](process['cwd'](), 'assets', 'logo.PNG');
                        if (_0x0_0x247a37['existsSync'](_0x2ab747)) {
                            _0x4e9856 = _0x0_0x247a37['readFileSync'](_0x2ab747);
                        }
                    }
                    let _0x1380a4 = '╭━━━━『\x20*' + (_0x0_0x267610['botName'] || 'NOVA-MD') + '*\x20』━━⬣\x0a';
                    _0x1380a4 += '┃\x0a';
                    _0x1380a4 += '┃\x20✨\x20*Status:*\x20✅\x20ONLINE\x0a';
                    _0x1380a4 += '┃\x20🤖\x20*Version:*\x20' + (_0x0_0x267610['version'] || '2.0.0') + '\x0a';
                    _0x1380a4 += '┃\x20⚙️\x20*Mode:*\x20' + _0x9b54d6['toUpperCase']() + '\x0a';
                    _0x1380a4 += '┃\x20⏰\x20*Uptime:*\x20' + _0x522dd0 + 'h\x20' + _0x43670c + 'm\x0a';
                    _0x1380a4 += '┃\x20📊\x20*Prefixes:*\x20' + _0x0_0x267610['prefixes']['join']('\x20') + '\x0a';
                    _0x1380a4 += '┃\x20📦\x20*Plugins:*\x20' + _0x0_0x1ff55c['commands']['size'] + '\x0a';
                    _0x1380a4 += '┃\x20💾\x20*Storage:*\x20' + _0x0_0x184059['getStats']()['backend']['toUpperCase']() + '\x0a';
                    _0x1380a4 += '┃\x0a';
                    _0x1380a4 += '┃━━━━━━━━━━━━━━━━━⬣\x0a';
                    _0x1380a4 += '┃\x0a';
                    _0x1380a4 += '┃\x20🌐\x20*JOIN\x20CHANNELS*\x0a';
                    _0x1380a4 += '┃\x0a';
                    _0x1380a4 += '┃\x20💬\x20*FaceBook:*\x0a';
                    _0x1380a4 += '┃\x20https://www.facebook.com/profile.php?id=61591828051151\x0a';
                    _0x1380a4 += '┃\x0a';
                    _0x1380a4 += '┃\x20📱\x20*Telegram:*\x0a';
                    _0x1380a4 += '┃\x20https://t.me/addlist/CpQzYQfWwwxmYTk0\x0a';
                    _0x1380a4 += '┃\x0a';
                    _0x1380a4 += '┃\x20▶️\x20*YouTube:*\x0a';
                    _0x1380a4 += '┃\x20https://youtube.com/@labokingfreesurf\x0a';
                    _0x1380a4 += '┃\x0a';
                    _0x1380a4 += '┃━━━━━━━━━━━━━━━━━⬣\x0a';
                    _0x1380a4 += '┃\x0a';
                    _0x1380a4 += '┃\x20✨\x20_Powered\x20by\x20NOSTRA._\x0a';
                    _0x1380a4 += '╰━━━━━━━━━━━━━━━━━⬣';
                    const _0x184694 = _0x93109c['user']['id']['split'](':')[0x0] + '@s.whatsapp.net';
                    if (_0x4e9856) {
                        await _0x93109c['sendMessage'](_0x184694, {
                            'image': _0x4e9856,
                            'caption': _0x1380a4,
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
                        await _0x93109c['sendMessage'](_0x184694, {
                            'text': _0x1380a4,
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
                } catch (_0x548072) {
                    printLog('error', 'Failed\x20to\x20send\x20automatic\x20about\x20message:\x20' + _0x548072['message']);
                }
                const _0x5ec5a3 = await _0x0_0x184059['getSetting']('global', 'stealthMode');
                if (_0x5ec5a3 && _0x5ec5a3['enabled']) {
                    printLog('info', '👻\x20STEALTH\x20MODE\x20ACTIVE');
                }
                printLog('success', 'Connected\x20to\x20=>\x20' + JSON['stringify'](_0x93109c['user'], null, 0x2));
                await delay(0x7cf);
                try {
                    owner = JSON['parse'](_0x0_0x247a37['readFileSync']('./data/owner.json', 'utf-8'));
                } catch (_0x439886) {
                }
                printLog('info', '[\x20' + (_0x0_0x267610['botName'] || 'NOVA-MD') + '\x20]');
                printLog('info', 'WA\x20NUMBER\x20\x20:\x20' + (owner[0x0] || _0x0_0x267610['ownerNumber'] || ''));
                printLog('success', 'Bot\x20Connected\x20Successfully!');
                printLog('info', 'Plugins\x20\x20\x20:\x20' + _0x0_0x1ff55c['commands']['size']);
                printLog('info', 'Prefixes\x20\x20\x20:\x20' + _0x0_0x267610['prefixes']['join'](',\x20'));
                printLog('store', 'Backend\x20\x20\x20\x20:\x20' + _0x0_0x184059['getStats']()['backend']);
                console['log']();
            }
            if (_0x2a838f === 'close') {
                const _0x3e1ae7 = _0xcc0668?.['error']?.['output']?.['statusCode'];
                const _0x478423 = _0x3e1ae7 !== DisconnectReason['loggedOut'] && _0x3e1ae7 !== 0x191;
                if (_0x3e1ae7 === DisconnectReason['loggedOut'] || _0x3e1ae7 === 0x191) {
                    try {
                        rmSync('./session', {
                            'recursive': !![],
                            'force': !![]
                        });
                    } catch (_0x245d37) {
                    }
                    await delay(0xbb8);
                    startNovaXCode();
                    return;
                }
                if (_0x478423) {
                    printLog('connection', 'Reconnecting\x20in\x205\x20seconds...');
                    await delay(0x1388);
                    startNovaXCode();
                }
            }
        });
        _0x93109c['ev']['on']('call', async _0x1fc938 => {
            await handleCall(_0x93109c, _0x1fc938);
        });
        _0x93109c['ev']['on']('group-participants.update', async _0x3f402d => {
            await handleGroupParticipantUpdate(_0x93109c, _0x3f402d);
        });
        _0x93109c['ev']['on']('status.update', async _0x2b5c47 => {
            await handleStatus(_0x93109c, _0x2b5c47);
        });
        _0x93109c['ev']['on']('messages.reaction', async _0x250d5a => {
            await handleStatus(_0x93109c, _0x250d5a);
        });
        return _0x93109c;
    } catch (_0xcb36d3) {
        printLog('error', 'Error\x20in\x20startNovaXCode:\x20' + _0xcb36d3['message']);
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
    printLog('info', '📱\x20Open\x20http://localhost:' + (_0x0_0x267610['port'] || 0x1388) + '/pairing\x20in\x20your\x20browser\x20if\x20it\x27s\x20local');
    printLog('info', '📱\x20For\x20web\x20servic\x20deployment,\x20click\x20the\x20service\x20URL\x20and\x20add\x20/pairing\x20at\x20the\x20end');
    const _0x50cac8 = 0x1e * 0x3c * 0x3e8;
    const _0x573b1e = Date['now']();
    const _0xbec1c6 = 0xbb8;
    return new Promise((_0x51582c, _0x27dc43) => {
        const _0x33e01a = setInterval(() => {
            if (hasValidSession()) {
                clearInterval(_0x33e01a);
                printLog('success', '✅\x20Session\x20detected!\x20Starting\x20bot...');
                _0x51582c();
            }
            if (Date['now']() - _0x573b1e > _0x50cac8) {
                clearInterval(_0x33e01a);
                _0x27dc43(new Error('Session\x20creation\x20timeout\x20(30\x20minutes)'));
            }
        }, _0xbec1c6);
    });
}
async function main() {
    await compileAll();
    await _0x0_0x1ff55c['loadCommands']();
    printLog('info', 'Starting\x20NOVA-MD\x20BOT...');
    if (hasValidSession()) {
        printLog('success', '✅\x20Valid\x20session\x20found,\x20starting\x20bot...');
        await delay(0xbb8);
        startNovaXCode()['catch'](_0x2d3dc4 => {
            printLog('error', 'Fatal\x20error:\x20' + _0x2d3dc4['message']);
            if (rl && !rlClosed)
                rl['close']();
            process['exit'](0x1);
        });
    } else {
        printLog('info', '🌐\x20No\x20session\x20found.\x20Launching\x20web\x20pairing\x20interface...');
        printLog('info', '📱\x20Open\x20http://localhost:' + (_0x0_0x267610['port'] || 0x1388) + '/pairing\x20in\x20your\x20browser\x20to\x20connect\x20WhatsApp');
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
            startNovaXCode()['catch'](_0x316871 => {
                printLog('error', 'Fatal\x20error:\x20' + _0x316871['message']);
                if (rl && !rlClosed)
                    rl['close']();
                process['exit'](0x1);
            });
        } catch (_0x59014f) {
            printLog('error', 'Session\x20creation\x20failed:\x20' + _0x59014f['message']);
            if (rl && !rlClosed)
                rl['close']();
            process['exit'](0x1);
        }
    }
}
main();
const sessionDir = _0x0_0x46aad7['join'](process['cwd'](), 'session');
setInterval(() => {
    if (!_0x0_0x247a37['existsSync'](sessionDir))
        return;
    _0x0_0x247a37['readdir'](sessionDir, (_0x4b2cf8, _0x55a9b5) => {
        if (_0x4b2cf8)
            return;
        for (const _0x415a86 of _0x55a9b5) {
            if (_0x415a86 === 'creds.json')
                continue;
            if (_0x415a86['startsWith']('app-state-sync-key-'))
                continue;
            _0x0_0x247a37['unlink'](_0x0_0x46aad7['join'](sessionDir, _0x415a86), () => {
            });
        }
    });
}, 0x3 * 0x3c * 0x3e8);
const customTemp = _0x0_0x46aad7['join'](process['cwd'](), 'temp');
if (!_0x0_0x247a37['existsSync'](customTemp))
    _0x0_0x247a37['mkdirSync'](customTemp, { 'recursive': !![] });
process.env.TMPDIR = customTemp;
process.env.TEMP = customTemp;
process.env.TMP = customTemp;
setInterval(() => {
    _0x0_0x247a37['readdir'](customTemp, (_0x3c1a66, _0xf2ee36) => {
        if (_0x3c1a66)
            return;
        for (const _0x35a522 of _0xf2ee36) {
            const _0x5db0e6 = _0x0_0x46aad7['join'](customTemp, _0x35a522);
            _0x0_0x247a37['stat'](_0x5db0e6, (_0x6d4385, _0xedfb38) => {
                if (!_0x6d4385 && Date['now']() - _0xedfb38['mtimeMs'] > 0x3 * 0x3c * 0x3c * 0x3e8) {
                    _0x0_0x247a37['unlink'](_0x5db0e6, () => {
                    });
                }
            });
        }
    });
}, 0x1 * 0x3c * 0x3c * 0x3e8);
const folders = [
    _0x0_0x46aad7['join'](__dirname, './lib'),
    _0x0_0x46aad7['join'](__dirname, './plugins')
];
folders['forEach'](_0xe08655 => {
    if (!_0x0_0x247a37['existsSync'](_0xe08655))
        return;
    _0x0_0x247a37['readdirSync'](_0xe08655)['filter'](_0x428676 => _0x428676['endsWith']('.js'))['forEach'](_0x5c5ac0 => {
        const _0x5df1b = _0x0_0x46aad7['join'](_0xe08655, _0x5c5ac0);
        try {
            const _0x2e3cc3 = _0x0_0x247a37['readFileSync'](_0x5df1b, 'utf-8');
            const _0x34d5ec = _0x0_0x560a9a(_0x2e3cc3, _0x5c5ac0, {
                'sourceType': 'module',
                'allowAwaitOutsideFunction': !![]
            });
            if (_0x34d5ec) {
                console['error'](_0x0_0x18459c['red']('❌\x20Syntax\x20error\x20in\x20' + _0x5df1b + ':\x0a' + _0x34d5ec));
            }
        } catch (_0x1e779b) {
            console['error'](_0x0_0x18459c['yellow']('⚠️\x20Cannot\x20read\x20file\x20' + _0x5df1b + ':\x0a' + _0x1e779b));
        }
    });
});
process['on']('uncaughtException', _0x33651e => {
    printLog('error', 'Uncaught\x20Exception:\x20' + _0x33651e['message']);
    console['error'](_0x33651e['stack']);
    writeErrorLog({
        'type': 'uncaughtException',
        'error': _0x33651e['message'],
        'stack': _0x33651e['stack'],
        'timestamp': new Date()['toISOString']()
    });
});
process['on']('unhandledRejection', _0x19ea09 => {
    printLog('error', 'Unhandled\x20Rejection:\x20' + _0x19ea09['message']);
    console['error'](_0x19ea09['stack']);
    writeErrorLog({
        'type': 'unhandledRejection',
        'error': _0x19ea09['message'],
        'stack': _0x19ea09['stack'],
        'timestamp': new Date()['toISOString']()
    });
});
server['on']('error', _0x2085f0 => {
    if (_0x2085f0['code'] === 'EADDRINUSE') {
        printLog('error', 'Address\x20localhost:' + PORT + '\x20in\x20use');
        writeErrorLog({
            'type': 'serverError',
            'error': 'Address\x20localhost:' + PORT + '\x20in\x20use',
            'timestamp': new Date()['toISOString']()
        });
        server['close']();
    } else {
        printLog('error', 'Server\x20error:\x20' + _0x2085f0['message']);
        writeErrorLog({
            'type': 'serverError',
            'error': _0x2085f0['message'],
            'stack': _0x2085f0['stack'],
            'timestamp': new Date()['toISOString']()
        });
    }
});