import _0x0_0x1055be from 'fs-extra';
import _0x0_0x238692 from 'pino';
import _0x0_0x3be680 from 'qrcode';
import {
    makeWASocket,
    useMultiFileAuthState,
    makeCacheableSignalKeyStore,
    Browsers,
    jidNormalizedUser,
    fetchLatestBaileysVersion,
    DisconnectReason,
    delay
} from '@whiskeysockets/baileys';
import _0x0_0x5e1058 from 'awesome-phonenumber';
import _0x0_0x2fe8a3 from './sessionManager.js';
const MAX_RECONNECT_ATTEMPTS = 0x3;
const SESSION_TIMEOUT = 0x5 * 0x3c * 0x3e8;
const MESSAGE = '\x0a*LOGIN\x20SUCCESSFULL*\x20✅\x0a\x0a*Gɪᴠᴇ\x20ᴀ\x20ꜱᴛᴀʀ\x20ᴛᴏ\x20ʀᴇᴘᴏ\x20ꜰᴏʀ\x20ᴄᴏᴜʀᴀɢᴇ*\x20🌟\x0ahttps://github.com/NOSTRA-DevOps/Nova-MD\x0a\x0a*Sᴜᴘᴘᴏʀᴛ\x20Gʀᴏᴜᴘ\x20ꜰᴏʀ\x20ϙᴜᴇʀʏ*\x20💭\x0ahttps://t.me/Nostra_DigitalCenter\x0ahttps://t.me/LaboKingFreeSurf\x0ahttps://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y\x0a\x0a*NOSTRA\x20COMMUNITY*\x0ahttps://chat.whatsapp.com/LUkXjJNfWrT8Fz7akxosH0\x0a*Yᴏᴜ-ᴛᴜʙᴇ\x20ᴛᴜᴛᴏʀɪᴀʟꜱ*\x20🪄\x20\x0ahttps://youtube.com/@LaboKingFreeSurf\x0a\x0a*NOVA-MD--WHATSAPP*\x20🥀\x0a';
class PairingManager {
    constructor() {
        this['sessions'] = new Map();
        this['cleanupInterval'] = setInterval(() => this['cleanupSessions'](), 0xea60);
        this['sessionSaveInProgress'] = new Map();
    }
    async ['createQRSession']() {
        const _0x1f1efb = Date['now']()['toString']() + Math['random']()['toString'](0x24)['substring'](0x2, 0x9);
        const _0x3ea019 = './temp_session_' + _0x1f1efb;
        const _0x1e808b = {
            'sessionId': _0x1f1efb,
            'sessionDir': _0x3ea019,
            'qrGenerated': ![],
            'sessionCompleted': ![],
            'responseSent': ![],
            'reconnectAttempts': 0x0,
            'currentSocket': null,
            'timeoutHandle': null,
            'isCleaningUp': ![],
            'createdAt': Date['now'](),
            'mode': 'qr',
            'credsUpdated': ![],
            'sessionSaved': ![]
        };
        this['sessions']['set'](_0x1f1efb, _0x1e808b);
        return _0x1f1efb;
    }
    async ['createPairSession'](_0x4c021a) {
        if (!_0x4c021a)
            throw new Error('Phone\x20number\x20is\x20required');
        _0x4c021a = _0x4c021a['replace'](/[^0-9]/g, '');
        const _0x3d04b5 = _0x0_0x5e1058('+' + _0x4c021a);
        if (!_0x3d04b5['isValid']())
            throw new Error('Invalid\x20phone\x20number');
        _0x4c021a = _0x3d04b5['getNumber']('e164')['replace']('+', '');
        const _0x15bfac = Date['now']()['toString']() + Math['random']()['toString'](0x24)['substring'](0x2, 0x9);
        const _0x19d4fe = './temp_session_' + _0x15bfac;
        const _0x22f8cd = {
            'sessionId': _0x15bfac,
            'sessionDir': _0x19d4fe,
            'phoneNumber': _0x4c021a,
            'pairingCodeSent': ![],
            'sessionCompleted': ![],
            'responseSent': ![],
            'reconnectAttempts': 0x0,
            'currentSocket': null,
            'timeoutHandle': null,
            'isCleaningUp': ![],
            'createdAt': Date['now'](),
            'mode': 'pair',
            'credsUpdated': ![],
            'sessionSaved': ![]
        };
        this['sessions']['set'](_0x15bfac, _0x22f8cd);
        return _0x15bfac;
    }
    async ['removeSessionDir'](_0x2fd553) {
        try {
            if (await _0x0_0x1055be['pathExists'](_0x2fd553)) {
                await _0x0_0x1055be['remove'](_0x2fd553);
                return !![];
            }
        } catch (_0x526361) {
            console['error']('Error\x20removing\x20session\x20dir:', _0x526361);
        }
        return ![];
    }
    async ['cleanupSessions']() {
        const _0x2e47f5 = Date['now']();
        const _0x117807 = [];
        for (const [_0x1bb991, _0x36eca4] of this['sessions']['entries']()) {
            if (_0x2e47f5 - _0x36eca4['createdAt'] > SESSION_TIMEOUT) {
                _0x117807['push'](_0x1bb991);
            }
        }
        for (const _0x556798 of _0x117807) {
            const _0xce51e8 = this['sessions']['get'](_0x556798);
            await this['cleanup'](_0x556798, 'session_expired');
        }
    }
    async ['cleanup'](_0x5789b9, _0x35e8fe = 'unknown') {
        const _0x32066b = this['sessions']['get'](_0x5789b9);
        if (!_0x32066b)
            return;
        if (_0x32066b['isCleaningUp'])
            return;
        console['log']('🧹\x20Cleanup\x20session\x20' + _0x5789b9 + '\x20-\x20' + _0x35e8fe);
        if (_0x35e8fe === 'session_complete' || _0x32066b['sessionCompleted']) {
            if (_0x32066b['timeoutHandle']) {
                clearTimeout(_0x32066b['timeoutHandle']);
                _0x32066b['timeoutHandle'] = null;
            }
            this['sessions']['delete'](_0x5789b9);
            console['log']('✅\x20Socket\x20handed\x20over\x20to\x20index.js\x20successfully.');
            return;
        }
        _0x32066b['isCleaningUp'] = !![];
        if (_0x32066b['timeoutHandle']) {
            clearTimeout(_0x32066b['timeoutHandle']);
            _0x32066b['timeoutHandle'] = null;
        }
        if (_0x32066b['currentSocket']) {
            try {
                _0x32066b['currentSocket']['ev']['removeAllListeners']();
                await _0x32066b['currentSocket']['end']();
            } catch (_0x5e7464) {
            }
            _0x32066b['currentSocket'] = null;
        }
        setTimeout(async () => {
            await this['removeSessionDir'](_0x32066b['sessionDir']);
            this['sessions']['delete'](_0x5789b9);
        }, 0x1388);
    }
    async ['saveSessionData'](_0x2126c2, _0x26fda9, _0x259108) {
        if (this['sessionSaveInProgress']['get'](_0x259108)) {
            console['log']('⏳\x20Session\x20save\x20already\x20in\x20progress...');
            return;
        }
        this['sessionSaveInProgress']['set'](_0x259108, !![]);
        try {
            const _0x349aa9 = _0x2126c2['sessionDir'] + '/creds.json';
            const _0x335d74 = './session';
            if (!_0x0_0x1055be['existsSync'](_0x349aa9)) {
                console['log']('❌\x20No\x20credentials\x20file\x20found');
                this['sessionSaveInProgress']['delete'](_0x259108);
                return;
            }
            const _0x25424b = await _0x0_0x1055be['readFile'](_0x349aa9, 'utf-8');
            const _0x41e1ae = JSON['parse'](_0x25424b);
            if (!_0x41e1ae['me']?.['id']) {
                console['log']('⚠️\x20Session\x20not\x20valid\x20(no\x20me.id)');
                this['sessionSaveInProgress']['delete'](_0x259108);
                return;
            }
            console['log']('✅\x20Session\x20valid:\x20me.id\x20=\x20' + _0x41e1ae['me']['id']);
            if (!_0x41e1ae['registered']) {
                _0x41e1ae['registered'] = !![];
                _0x0_0x1055be['writeFileSync'](_0x349aa9, JSON['stringify'](_0x41e1ae, null, 0x2));
                console['log']('🔧\x20Forced\x20registered:\x20true');
            }
            if (!await _0x0_0x1055be['pathExists'](_0x335d74)) {
                await _0x0_0x1055be['mkdir'](_0x335d74, { 'recursive': !![] });
            }
            await _0x0_0x1055be['copy'](_0x2126c2['sessionDir'], _0x335d74);
            console['log']('✅\x20Session\x20credentials\x20saved\x20to\x20main\x20session\x20directory');
            let _0x2968c6 = _0x2126c2['phoneNumber'] || null;
            if (!_0x2968c6 && _0x41e1ae['me']?.['id']) {
                _0x2968c6 = _0x41e1ae['me']['id']['split'](':')[0x0];
            }
            const _0x58c476 = await _0x0_0x2fe8a3['saveSession'](_0x41e1ae, _0x2968c6);
            console['log']('✅\x20Session\x20saved\x20to\x20database:\x20' + _0x58c476);
            const _0x34a2e1 = _0x26fda9['authState']['creds']['me']?.['id'] ? jidNormalizedUser(_0x26fda9['authState']['creds']['me']['id']) : jidNormalizedUser(_0x2126c2['phoneNumber'] + '@s.whatsapp.net');
            if (_0x34a2e1) {
                const _0x2aa2b0 = await _0x26fda9['sendMessage'](_0x34a2e1, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x58c476 + '`\x0a\x0a📌\x20*SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE\x20DON\x27T\x20SHARE\x20IT*\x20✅' });
                await _0x26fda9['sendMessage'](_0x34a2e1, {
                    'text': MESSAGE,
                    'quoted': _0x2aa2b0
                });
                console['log']('✅\x20Success\x20message\x20sent');
            }
            _0x2126c2['sessionCompleted'] = !![];
            _0x2126c2['sessionSaved'] = !![];
            setTimeout(async () => {
                await this['cleanup'](_0x259108, 'session_complete');
            }, 0x1388);
        } catch (_0x4a2fe3) {
            console['error']('❌\x20Error\x20saving\x20session:', _0x4a2fe3);
        } finally {
            this['sessionSaveInProgress']['delete'](_0x259108);
        }
    }
    async ['initiateQRSession'](_0x31c374) {
        const _0x28ed97 = this['sessions']['get'](_0x31c374);
        if (!_0x28ed97)
            throw new Error('Session\x20not\x20found');
        return new Promise(async (_0x2bc513, _0x4bfcc2) => {
            try {
                const {version: _0x4ba135} = await fetchLatestBaileysVersion();
                if (!await _0x0_0x1055be['pathExists'](_0x28ed97['sessionDir'])) {
                    await _0x0_0x1055be['mkdir'](_0x28ed97['sessionDir'], { 'recursive': !![] });
                }
                const {
                    state: _0x3810b1,
                    saveCreds: _0x53d398
                } = await useMultiFileAuthState(_0x28ed97['sessionDir']);
                _0x28ed97['currentSocket'] = makeWASocket({
                    'version': _0x4ba135,
                    'logger': _0x0_0x238692({ 'level': 'silent' }),
                    'browser': Browsers['macOS']('Chrome'),
                    'auth': {
                        'creds': _0x3810b1['creds'],
                        'keys': makeCacheableSignalKeyStore(_0x3810b1['keys'], _0x0_0x238692({ 'level': 'fatal' })['child']({ 'level': 'fatal' }))
                    },
                    'printQRInTerminal': ![],
                    'markOnlineOnConnect': ![],
                    'generateHighQualityLinkPreview': ![],
                    'defaultQueryTimeoutMs': 0x927c0,
                    'connectTimeoutMs': 0xea60,
                    'keepAliveIntervalMs': 0x7530,
                    'retryRequestDelayMs': 0xfa,
                    'maxRetries': 0x3
                });
                const _0x2d09b2 = _0x28ed97['currentSocket'];
                _0x2d09b2['ev']['on']('creds.update', async _0x2012fd => {
                    console['log']('🔄\x20creds.update\x20triggered');
                    await _0x53d398();
                    if (_0x2012fd['me']?.['id']) {
                        console['log']('✅\x20Session\x20valid\x20via\x20creds.update:\x20' + _0x2012fd['me']['id']);
                        _0x28ed97['credsUpdated'] = !![];
                        if (!_0x2012fd['registered']) {
                            _0x2012fd['registered'] = !![];
                            await _0x53d398();
                            console['log']('🔧\x20Forced\x20registered:\x20true\x20via\x20creds.update');
                        }
                        if (!_0x28ed97['sessionSaved'] && !_0x28ed97['sessionCompleted']) {
                            await this['saveSessionData'](_0x28ed97, _0x2d09b2, _0x31c374);
                        }
                    }
                });
                const _0x313f70 = async _0x301ecf => {
                    if (_0x28ed97['qrGenerated'] || _0x28ed97['sessionCompleted'] || _0x28ed97['isCleaningUp'])
                        return;
                    _0x28ed97['qrGenerated'] = !![];
                    try {
                        const _0x4335d4 = await _0x0_0x3be680['toDataURL'](_0x301ecf, { 'errorCorrectionLevel': 'M' });
                        _0x2bc513({
                            'type': 'qr',
                            'qr': _0x4335d4,
                            'sessionId': _0x31c374
                        });
                    } catch (_0x3a76c8) {
                        console['error']('Error\x20generating\x20QR\x20code:', _0x3a76c8);
                        _0x4bfcc2(_0x3a76c8);
                    }
                };
                _0x2d09b2['ev']['on']('connection.update', async _0x7b7df6 => {
                    if (_0x28ed97['isCleaningUp'])
                        return;
                    const {
                        connection: _0x47e281,
                        lastDisconnect: _0x4539db,
                        qr: _0x18f183,
                        isNewLogin: _0x443fac
                    } = _0x7b7df6;
                    if (_0x18f183 && !_0x28ed97['qrGenerated'] && !_0x28ed97['sessionCompleted']) {
                        await _0x313f70(_0x18f183);
                    }
                    if (_0x443fac) {
                        console['log']('🔐\x20New\x20login\x20via\x20QR\x20code');
                    }
                    if (_0x47e281 === 'open') {
                        console['log']('🔐\x20Connection\x20open');
                        if (_0x28ed97['sessionSaved'] || _0x28ed97['sessionCompleted'])
                            return;
                        if (_0x28ed97['credsUpdated']) {
                            const _0x100f67 = await this['saveSessionData'](_0x28ed97, _0x2d09b2, _0x31c374);
                            const _0x58daa0 = Object['keys'](_0x2d09b2['authState']['creds']['me'] || {})['length'] > 0x0 ? jidNormalizedUser(_0x2d09b2['authState']['creds']['me']['id']) : null;
                            if (_0x58daa0) {
                                await delay(0x7d0);
                                const _0x1328f4 = await _0x2d09b2['sendMessage'](_0x58daa0, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x100f67 + '`\x0a\x0a📌\x20SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE,DON\x27T\x20SHARE\x20IT!' });
                                await _0x2d09b2['sendMessage'](_0x58daa0, { 'quoted': _0x1328f4 });
                            }
                        } else {
                            console['log']('⏳\x20Waiting\x20for\x20session\x20to\x20be\x20ready...');
                            await delay(0xbb8);
                            const _0x329c42 = _0x28ed97['sessionDir'] + '/creds.json';
                            if (_0x0_0x1055be['existsSync'](_0x329c42)) {
                                try {
                                    const _0x5d05e5 = await _0x0_0x1055be['readFile'](_0x329c42, 'utf-8');
                                    const _0x1c9778 = JSON['parse'](_0x5d05e5);
                                    if (_0x1c9778['me']?.['id']) {
                                        console['log']('✅\x20Session\x20found\x20via\x20file\x20check');
                                        const _0x26d42a = await this['saveSessionData'](_0x28ed97, _0x2d09b2, _0x31c374);
                                        const _0x56c387 = Object['keys'](_0x2d09b2['authState']['creds']['me'] || {})['length'] > 0x0 ? jidNormalizedUser(_0x2d09b2['authState']['creds']['me']['id']) : null;
                                        if (_0x56c387) {
                                            await delay(0x7d0);
                                            const _0x414415 = await _0x2d09b2['sendMessage'](_0x56c387, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x26d42a + '`\x0a\x0a📌\x20SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE,DON\x27T\x20SHARE\x20IT!' });
                                            await _0x2d09b2['sendMessage'](_0x56c387, { 'quoted': _0x414415 });
                                        }
                                    }
                                } catch (_0x321dd8) {
                                    console['log']('⚠️\x20File\x20check\x20failed:', _0x321dd8['message']);
                                }
                            }
                        }
                    }
                    if (_0x47e281 === 'close') {
                        console['log']('🔌\x20Connection\x20closed');
                        const _0x5f48ed = _0x4539db?.['error']?.['output']?.['statusCode'];
                        if (_0x5f48ed === DisconnectReason['restartRequired']) {
                            console['log']('🔄\x20Restart\x20required\x20-\x20Baileys\x20will\x20reconnect\x20automatically');
                            return;
                        }
                        if (_0x28ed97['sessionSaved'] || _0x28ed97['sessionCompleted']) {
                            await this['cleanup'](_0x31c374, 'session_complete');
                            return;
                        }
                        if (_0x5f48ed === DisconnectReason['loggedOut'] || _0x5f48ed === 0x191) {
                            await this['cleanup'](_0x31c374, 'logged_out');
                            _0x4bfcc2(new Error('Invalid\x20QR\x20code\x20or\x20session\x20expired'));
                        } else {
                            if (_0x28ed97['reconnectAttempts'] < MAX_RECONNECT_ATTEMPTS) {
                                _0x28ed97['reconnectAttempts']++;
                                await delay(0x7d0);
                                await this['initiateQRSession'](_0x31c374);
                            } else {
                                await this['cleanup'](_0x31c374, 'max_reconnects');
                                _0x4bfcc2(new Error('Max\x20reconnection\x20attempts\x20reached'));
                            }
                        }
                    }
                });
                _0x28ed97['timeoutHandle'] = setTimeout(async () => {
                    if (!_0x28ed97['sessionCompleted'] && !_0x28ed97['isCleaningUp']) {
                        await this['cleanup'](_0x31c374, 'timeout');
                        _0x4bfcc2(new Error('Session\x20timeout'));
                    }
                }, SESSION_TIMEOUT);
            } catch (_0x35dd94) {
                console['error']('Error\x20initiating\x20QR\x20session:', _0x35dd94);
                _0x4bfcc2(_0x35dd94);
            }
        });
    }
    async ['initiatePairSession'](_0x26ef21) {
        const _0x488dde = this['sessions']['get'](_0x26ef21);
        if (!_0x488dde)
            throw new Error('Session\x20not\x20found');
        return new Promise(async (_0x3a2be4, _0x215b47) => {
            try {
                const {version: _0x46e29a} = await fetchLatestBaileysVersion();
                if (!await _0x0_0x1055be['pathExists'](_0x488dde['sessionDir'])) {
                    await _0x0_0x1055be['mkdir'](_0x488dde['sessionDir'], { 'recursive': !![] });
                }
                const {
                    state: _0x9244ce,
                    saveCreds: _0x5ee1c5
                } = await useMultiFileAuthState(_0x488dde['sessionDir']);
                _0x488dde['currentSocket'] = makeWASocket({
                    'version': _0x46e29a,
                    'logger': _0x0_0x238692({ 'level': 'silent' }),
                    'browser': Browsers['macOS']('Chrome'),
                    'auth': {
                        'creds': _0x9244ce['creds'],
                        'keys': makeCacheableSignalKeyStore(_0x9244ce['keys'], _0x0_0x238692({ 'level': 'fatal' })['child']({ 'level': 'fatal' }))
                    },
                    'printQRInTerminal': ![],
                    'markOnlineOnConnect': ![],
                    'generateHighQualityLinkPreview': ![],
                    'defaultQueryTimeoutMs': 0xea60,
                    'connectTimeoutMs': 0xea60,
                    'keepAliveIntervalMs': 0x7530,
                    'retryRequestDelayMs': 0xfa,
                    'maxRetries': 0x3
                });
                const _0x269cb2 = _0x488dde['currentSocket'];
                _0x269cb2['ev']['on']('connection.update', async _0x506a61 => {
                    if (_0x488dde['isCleaningUp'])
                        return;
                    const {
                        connection: _0x28dcc3,
                        lastDisconnect: _0x40dacd,
                        isNewLogin: _0x250f24
                    } = _0x506a61;
                    if (_0x28dcc3 === 'open') {
                        if (_0x488dde['sessionCompleted'])
                            return;
                        _0x488dde['sessionCompleted'] = !![];
                        try {
                            const _0x39c4a0 = _0x488dde['sessionDir'] + '/creds.json';
                            const _0x58264a = './session';
                            if (!await _0x0_0x1055be['pathExists'](_0x58264a)) {
                                await _0x0_0x1055be['mkdir'](_0x58264a, { 'recursive': !![] });
                            }
                            if (await _0x0_0x1055be['pathExists'](_0x39c4a0)) {
                                await _0x0_0x1055be['copy'](_0x488dde['sessionDir'], _0x58264a);
                                console['log']('✅\x20Session\x20credentials\x20saved\x20to\x20main\x20session\x20directory');
                            }
                            await delay(0xbb8);
                            if (_0x0_0x1055be['existsSync'](_0x39c4a0)) {
                                const _0x510f1f = JSON['parse'](await _0x0_0x1055be['readFile'](_0x39c4a0, 'utf-8'));
                                const _0x4b4685 = _0x488dde['phoneNumber'] || Object['keys'](_0x510f1f['me'] || {})[0x0]?.['split']('@')[0x0] || null;
                                const _0x2f6c53 = await _0x0_0x2fe8a3['saveSession'](_0x510f1f, _0x4b4685);
                                console['log']('✅\x20Session\x20saved\x20to\x20database:\x20' + _0x2f6c53);
                                const _0x379e87 = Object['keys'](_0x269cb2['authState']['creds']['me'] || {})['length'] > 0x0 ? jidNormalizedUser(_0x269cb2['authState']['creds']['me']['id']) : jidNormalizedUser(_0x488dde['phoneNumber'] + '@s.whatsapp.net');
                                if (_0x379e87) {
                                    await delay(0x7d0);
                                    const _0x2333a4 = await _0x269cb2['sendMessage'](_0x379e87, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x2f6c53 + '`\x0a\x0a📌\x20SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE,DON\x27T\x20SHARE\x20IT!' });
                                    await _0x269cb2['sendMessage'](_0x379e87, { 'quoted': _0x2333a4 });
                                }
                            }
                        } catch (_0x5b67f6) {
                            console['error']('Error\x20saving\x20session:', _0x5b67f6);
                        } finally {
                            setTimeout(async () => {
                                await this['cleanup'](_0x26ef21, 'session_complete');
                            }, 0x2710);
                        }
                    }
                    if (_0x250f24)
                        console['log']('🔐\x20New\x20login\x20via\x20pair\x20code\x20for\x20' + _0x488dde['phoneNumber']);
                    if (_0x28dcc3 === 'close') {
                        if (_0x488dde['sessionCompleted'] || _0x488dde['isCleaningUp']) {
                            await this['cleanup'](_0x26ef21, 'already_complete');
                            return;
                        }
                        const _0x4c1cf5 = _0x40dacd?.['error']?.['output']?.['statusCode'];
                        if (_0x4c1cf5 === DisconnectReason['loggedOut'] || _0x4c1cf5 === 0x191) {
                            await this['cleanup'](_0x26ef21, 'logged_out');
                            _0x215b47(new Error('Invalid\x20pairing\x20code\x20or\x20session\x20expired'));
                        } else if (_0x488dde['pairingCodeSent'] && !_0x488dde['sessionCompleted']) {
                            if (_0x488dde['reconnectAttempts'] < MAX_RECONNECT_ATTEMPTS) {
                                _0x488dde['reconnectAttempts']++;
                                await delay(0x7d0);
                                await this['initiatePairSession'](_0x26ef21);
                            } else {
                                await this['cleanup'](_0x26ef21, 'max_reconnects');
                                _0x215b47(new Error('Max\x20reconnection\x20attempts\x20reached'));
                            }
                        }
                    }
                });
                if (!_0x269cb2['authState']['creds']['registered'] && !_0x488dde['pairingCodeSent'] && !_0x488dde['isCleaningUp']) {
                    await delay(0x5dc);
                    try {
                        _0x488dde['pairingCodeSent'] = !![];
                        let _0x497816 = await _0x269cb2['requestPairingCode'](_0x488dde['phoneNumber']);
                        _0x497816 = _0x497816?.['match'](/.{1,4}/g)?.['join']('-') || _0x497816;
                        _0x3a2be4({
                            'type': 'pair',
                            'code': _0x497816,
                            'sessionId': _0x26ef21,
                            'phoneNumber': _0x488dde['phoneNumber']
                        });
                    } catch (_0x5eab40) {
                        _0x488dde['pairingCodeSent'] = ![];
                        _0x215b47(new Error('Failed\x20to\x20get\x20pairing\x20code:\x20' + _0x5eab40['message']));
                    }
                }
                _0x269cb2['ev']['on']('creds.update', _0x5ee1c5);
                _0x488dde['timeoutHandle'] = setTimeout(async () => {
                    if (!_0x488dde['sessionCompleted'] && !_0x488dde['isCleaningUp']) {
                        await this['cleanup'](_0x26ef21, 'timeout');
                        _0x215b47(new Error('Pairing\x20timeout'));
                    }
                }, SESSION_TIMEOUT);
            } catch (_0x2799ae) {
                console['error']('Error\x20initiating\x20pair\x20session:', _0x2799ae);
                _0x215b47(_0x2799ae);
            }
        });
    }
    ['isSessionComplete'](_0xe6cd2b) {
        const _0x59056c = this['sessions']['get'](_0xe6cd2b);
        if (!_0x59056c)
            return ![];
        if (!_0x59056c['sessionCompleted'])
            return ![];
        try {
            const _0x159ec9 = _0x59056c['sessionDir'] + '/creds.json';
            const _0x17bfef = './session/creds.json';
            let _0xf50ab8 = _0x0_0x1055be['existsSync'](_0x17bfef) ? _0x17bfef : _0x0_0x1055be['existsSync'](_0x159ec9) ? _0x159ec9 : null;
            if (_0xf50ab8) {
                const _0x348818 = JSON['parse'](_0x0_0x1055be['readFileSync'](_0xf50ab8, 'utf-8'));
                return _0x348818['registered'] === !![] && !!_0x348818['me']?.['id'];
            }
        } catch (_0x355a0b) {
            console['error']('Error\x20verifying\x20physical\x20creds\x20in\x20isSessionComplete:', _0x355a0b);
            return ![];
        }
        return ![];
    }
}
export default new PairingManager();