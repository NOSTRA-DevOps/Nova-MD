import _0x0_0x25a6e9 from 'fs-extra';
import _0x0_0x1b749b from 'pino';
import _0x0_0xaed51b from 'qrcode';
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
import _0x0_0x1d9476 from 'awesome-phonenumber';
import _0x0_0x20ef67 from './sessionManager.js';
const MAX_RECONNECT_ATTEMPTS = 0x3;
const SESSION_TIMEOUT = 0x5 * 0x3c * 0x3e8;
const _MESSAGE = '\x0a*LOGIN\x20SUCCESSFULL*\x20✅\x0a\x0a*Gɪᴠᴇ\x20ᴀ\x20ꜱᴛᴀʀ\x20ᴛᴏ\x20ʀᴇᴘᴏ\x20ꜰᴏʀ\x20ᴄᴏᴜʀᴀɢᴇ*\x20🌟\x0ahttps://github.com/NOSTRA-DevOps/Nova-MD\x0a\x0a*Sᴜᴘᴘᴏʀᴛ\x20Gʀᴏᴜᴘ\x20ꜰᴏʀ\x20ϙᴜᴇʀʏ*\x20💭\x0ahttps://t.me/Nostra_DigitalCenter\x0ahttps://t.me/LaboKingFreeSurf\x0ahttps://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y\x0a\x0a*NOSTRA\x20COMMUNITY*\x0ahttps://chat.whatsapp.com/LUkXjJNfWrT8Fz7akxosH0\x0a*Yᴏᴜ-ᴛᴜʙᴇ\x20ᴛᴜᴛᴏʀɪᴀʟꜱ*\x20🪄\x20\x0ahttps://youtube.com/@LaboKingFreeSurf\x0a\x0a*NOVA-MD--WHATSAPP*\x20🥀\x0a';
class PairingManager {
    constructor() {
        this['sessions'] = new Map();
        this['cleanupInterval'] = setInterval(() => this['cleanupSessions'](), 0xea60);
        this['sessionSaveInProgress'] = new Map();
    }
    async ['createQRSession']() {
        const _0x114ab4 = Date['now']()['toString']() + Math['random']()['toString'](0x24)['substring'](0x2, 0x9);
        const _0x22affd = './temp_session_' + _0x114ab4;
        const _0x1cd312 = {
            'sessionId': _0x114ab4,
            'sessionDir': _0x22affd,
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
        this['sessions']['set'](_0x114ab4, _0x1cd312);
        return _0x114ab4;
    }
    async ['createPairSession'](_0x260805) {
        if (!_0x260805)
            throw new Error('Phone\x20number\x20is\x20required');
        _0x260805 = _0x260805['replace'](/[^0-9]/g, '');
        const _0x834ef6 = _0x0_0x1d9476('+' + _0x260805);
        if (!_0x834ef6['isValid']())
            throw new Error('Invalid\x20phone\x20number');
        _0x260805 = _0x834ef6['getNumber']('e164')['replace']('+', '');
        const _0x4c7bce = Date['now']()['toString']() + Math['random']()['toString'](0x24)['substring'](0x2, 0x9);
        const _0x539a94 = './temp_session_' + _0x4c7bce;
        const _0x1925d9 = {
            'sessionId': _0x4c7bce,
            'sessionDir': _0x539a94,
            'phoneNumber': _0x260805,
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
        this['sessions']['set'](_0x4c7bce, _0x1925d9);
        return _0x4c7bce;
    }
    async ['removeSessionDir'](_0x412866) {
        try {
            if (await _0x0_0x25a6e9['pathExists'](_0x412866)) {
                await _0x0_0x25a6e9['remove'](_0x412866);
                return !![];
            }
        } catch (_0x41bd) {
            console['error']('Error\x20removing\x20session\x20dir:', _0x41bd);
        }
        return ![];
    }
    async ['cleanupSessions']() {
        const _0x53c1de = Date['now']();
        const _0x2ed30c = [];
        for (const [_0x370713, _0x115378] of this['sessions']['entries']()) {
            if (_0x53c1de - _0x115378['createdAt'] > SESSION_TIMEOUT) {
                _0x2ed30c['push'](_0x370713);
            }
        }
        for (const _0x121d45 of _0x2ed30c) {
            const _0x21b272 = this['sessions']['get'](_0x121d45);
            await this['cleanup'](_0x121d45, 'session_expired');
        }
    }
    async ['cleanup'](_0x59568d, _0x133bbc = 'unknown') {
        const _0x2f7000 = this['sessions']['get'](_0x59568d);
        if (!_0x2f7000)
            return;
        if (_0x2f7000['isCleaningUp'])
            return;
        console['log']('🧹\x20Cleanup\x20session\x20' + _0x59568d + '\x20-\x20' + _0x133bbc);
        if (_0x133bbc === 'session_complete' || _0x2f7000['sessionCompleted']) {
            if (_0x2f7000['timeoutHandle']) {
                clearTimeout(_0x2f7000['timeoutHandle']);
                _0x2f7000['timeoutHandle'] = null;
            }
            this['sessions']['delete'](_0x59568d);
            console['log']('✅\x20Socket\x20handed\x20over\x20to\x20index.js\x20successfully.');
            return;
        }
        _0x2f7000['isCleaningUp'] = !![];
        if (_0x2f7000['timeoutHandle']) {
            clearTimeout(_0x2f7000['timeoutHandle']);
            _0x2f7000['timeoutHandle'] = null;
        }
        if (_0x2f7000['currentSocket']) {
            try {
                _0x2f7000['currentSocket']['ev']['removeAllListeners']();
                await _0x2f7000['currentSocket']['end']();
            } catch (_0x1faba7) {
            }
            _0x2f7000['currentSocket'] = null;
        }
        setTimeout(async () => {
            await this['removeSessionDir'](_0x2f7000['sessionDir']);
            this['sessions']['delete'](_0x59568d);
        }, 0x1388);
    }
    async ['saveSessionData'](_0x5a0be6, _0xc65d8f, _0x1711c0) {
        if (this['sessionSaveInProgress']['get'](_0x1711c0)) {
            console['log']('⏳\x20Session\x20save\x20already\x20in\x20progress...');
            return;
        }
        this['sessionSaveInProgress']['set'](_0x1711c0, !![]);
        try {
            const _0x11f5e7 = _0x5a0be6['sessionDir'] + '/creds.json';
            const _0x373925 = './session';
            if (!_0x0_0x25a6e9['existsSync'](_0x11f5e7)) {
                console['log']('❌\x20No\x20credentials\x20file\x20found');
                this['sessionSaveInProgress']['delete'](_0x1711c0);
                return;
            }
            const _0xbe4da3 = await _0x0_0x25a6e9['readFile'](_0x11f5e7, 'utf-8');
            const _0x3f1d32 = JSON['parse'](_0xbe4da3);
            if (!_0x3f1d32['me']?.['id']) {
                console['log']('⚠️\x20Session\x20not\x20valid\x20(no\x20me.id)');
                this['sessionSaveInProgress']['delete'](_0x1711c0);
                return;
            }
            console['log']('✅\x20Session\x20valid:\x20me.id\x20=\x20' + _0x3f1d32['me']['id']);
            if (!_0x3f1d32['registered']) {
                _0x3f1d32['registered'] = !![];
                _0x0_0x25a6e9['writeFileSync'](_0x11f5e7, JSON['stringify'](_0x3f1d32, null, 0x2));
                console['log']('🔧\x20Forced\x20registered:\x20true');
            }
            if (!await _0x0_0x25a6e9['pathExists'](_0x373925)) {
                await _0x0_0x25a6e9['mkdir'](_0x373925, { 'recursive': !![] });
            }
            await _0x0_0x25a6e9['copy'](_0x5a0be6['sessionDir'], _0x373925);
            console['log']('✅\x20Session\x20credentials\x20saved\x20to\x20main\x20session\x20directory');
            let _0x5077b8 = _0x5a0be6['phoneNumber'] || null;
            if (!_0x5077b8 && _0x3f1d32['me']?.['id']) {
                _0x5077b8 = _0x3f1d32['me']['id']['split'](':')[0x0];
            }
            const _0x1e1793 = await _0x0_0x20ef67['saveSession'](_0x3f1d32, _0x5077b8);
            console['log']('✅\x20Session\x20saved\x20to\x20database:\x20' + _0x1e1793);
            const _0x1a3dda = _0xc65d8f['authState']['creds']['me']?.['id'] ? jidNormalizedUser(_0xc65d8f['authState']['creds']['me']['id']) : jidNormalizedUser(_0x5a0be6['phoneNumber'] + '@s.whatsapp.net');
            if (_0x1a3dda) {
                const _0x4ac358 = await _0xc65d8f['sendMessage'](_0x1a3dda, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x1e1793 + '`\x0a\x0a📌\x20*SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE\x20DON\x27T\x20SHARE\x20IT*\x20✅' });
                await _0xc65d8f['sendMessage'](_0x1a3dda, { 'quoted': _0x4ac358 });
                console['log']('✅\x20Success\x20message\x20sent');
            }
            _0x5a0be6['sessionCompleted'] = !![];
            _0x5a0be6['sessionSaved'] = !![];
            setTimeout(async () => {
                await this['cleanup'](_0x1711c0, 'session_complete');
            }, 0x1388);
        } catch (_0x56d041) {
            console['error']('❌\x20Error\x20saving\x20session:', _0x56d041);
        } finally {
            this['sessionSaveInProgress']['delete'](_0x1711c0);
        }
    }
    async ['initiateQRSession'](_0x3f9ec3) {
        const _0xcacb85 = this['sessions']['get'](_0x3f9ec3);
        if (!_0xcacb85)
            throw new Error('Session\x20not\x20found');
        return new Promise(async (_0x5659f1, _0xc4f9) => {
            try {
                const {version: _0x25acc6} = await fetchLatestBaileysVersion();
                if (!await _0x0_0x25a6e9['pathExists'](_0xcacb85['sessionDir'])) {
                    await _0x0_0x25a6e9['mkdir'](_0xcacb85['sessionDir'], { 'recursive': !![] });
                }
                const {
                    state: _0x82fbee,
                    saveCreds: _0x1767cd
                } = await useMultiFileAuthState(_0xcacb85['sessionDir']);
                _0xcacb85['currentSocket'] = makeWASocket({
                    'version': _0x25acc6,
                    'logger': _0x0_0x1b749b({ 'level': 'silent' }),
                    'browser': Browsers['macOS']('Chrome'),
                    'auth': {
                        'creds': _0x82fbee['creds'],
                        'keys': makeCacheableSignalKeyStore(_0x82fbee['keys'], _0x0_0x1b749b({ 'level': 'fatal' })['child']({ 'level': 'fatal' }))
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
                const _0x222014 = _0xcacb85['currentSocket'];
                _0x222014['ev']['on']('creds.update', async _0x289e12 => {
                    console['log']('🔄\x20creds.update\x20triggered');
                    await _0x1767cd();
                    if (_0x289e12['me']?.['id']) {
                        console['log']('✅\x20Session\x20valid\x20via\x20creds.update:\x20' + _0x289e12['me']['id']);
                        _0xcacb85['credsUpdated'] = !![];
                        if (!_0x289e12['registered']) {
                            _0x289e12['registered'] = !![];
                            await _0x1767cd();
                            console['log']('🔧\x20Forced\x20registered:\x20true\x20via\x20creds.update');
                        }
                        if (!_0xcacb85['sessionSaved'] && !_0xcacb85['sessionCompleted']) {
                            await this['saveSessionData'](_0xcacb85, _0x222014, _0x3f9ec3);
                        }
                    }
                });
                const _0xca798e = async _0x358b5d => {
                    if (_0xcacb85['qrGenerated'] || _0xcacb85['sessionCompleted'] || _0xcacb85['isCleaningUp'])
                        return;
                    _0xcacb85['qrGenerated'] = !![];
                    try {
                        const _0x201207 = await _0x0_0xaed51b['toDataURL'](_0x358b5d, { 'errorCorrectionLevel': 'M' });
                        _0x5659f1({
                            'type': 'qr',
                            'qr': _0x201207,
                            'sessionId': _0x3f9ec3
                        });
                    } catch (_0xed6d2a) {
                        console['error']('Error\x20generating\x20QR\x20code:', _0xed6d2a);
                        _0xc4f9(_0xed6d2a);
                    }
                };
                _0x222014['ev']['on']('connection.update', async _0x5887ff => {
                    if (_0xcacb85['isCleaningUp'])
                        return;
                    const {
                        connection: _0x3011eb,
                        lastDisconnect: _0x8729e,
                        qr: _0x3dd4b9,
                        isNewLogin: _0x2faa6c
                    } = _0x5887ff;
                    if (_0x3dd4b9 && !_0xcacb85['qrGenerated'] && !_0xcacb85['sessionCompleted']) {
                        await _0xca798e(_0x3dd4b9);
                    }
                    if (_0x2faa6c) {
                        console['log']('🔐\x20New\x20login\x20via\x20QR\x20code');
                    }
                    if (_0x3011eb === 'open') {
                        console['log']('🔐\x20Connection\x20open');
                        if (_0xcacb85['sessionSaved'] || _0xcacb85['sessionCompleted'])
                            return;
                        if (_0xcacb85['credsUpdated']) {
                            const _0x2d41eb = await this['saveSessionData'](_0xcacb85, _0x222014, _0x3f9ec3);
                            const _0x5172e2 = Object['keys'](_0x222014['authState']['creds']['me'] || {})['length'] > 0x0 ? jidNormalizedUser(_0x222014['authState']['creds']['me']['id']) : null;
                            if (_0x5172e2) {
                                await delay(0x7d0);
                                const _0x5748e2 = await _0x222014['sendMessage'](_0x5172e2, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x2d41eb + '`\x0a\x0a📌\x20SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE,DON\x27T\x20SHARE\x20IT!' });
                                await _0x222014['sendMessage'](_0x5172e2, { 'quoted': _0x5748e2 });
                            }
                        } else {
                            console['log']('⏳\x20Waiting\x20for\x20session\x20to\x20be\x20ready...');
                            await delay(0xbb8);
                            const _0x39b265 = _0xcacb85['sessionDir'] + '/creds.json';
                            if (_0x0_0x25a6e9['existsSync'](_0x39b265)) {
                                try {
                                    const _0x39fa28 = await _0x0_0x25a6e9['readFile'](_0x39b265, 'utf-8');
                                    const _0x3739c3 = JSON['parse'](_0x39fa28);
                                    if (_0x3739c3['me']?.['id']) {
                                        console['log']('✅\x20Session\x20found\x20via\x20file\x20check');
                                        const _0x49b4f1 = await this['saveSessionData'](_0xcacb85, _0x222014, _0x3f9ec3);
                                        const _0x2f4ac = Object['keys'](_0x222014['authState']['creds']['me'] || {})['length'] > 0x0 ? jidNormalizedUser(_0x222014['authState']['creds']['me']['id']) : null;
                                        if (_0x2f4ac) {
                                            await delay(0x7d0);
                                            const _0x36d5d3 = await _0x222014['sendMessage'](_0x2f4ac, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x49b4f1 + '`\x0a\x0a📌\x20SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE,DON\x27T\x20SHARE\x20IT!' });
                                            await _0x222014['sendMessage'](_0x2f4ac, { 'quoted': _0x36d5d3 });
                                        }
                                    }
                                } catch (_0x485759) {
                                    console['log']('⚠️\x20File\x20check\x20failed:', _0x485759['message']);
                                }
                            }
                        }
                    }
                    if (_0x3011eb === 'close') {
                        console['log']('🔌\x20Connection\x20closed');
                        const _0x5bde39 = _0x8729e?.['error']?.['output']?.['statusCode'];
                        if (_0x5bde39 === DisconnectReason['restartRequired']) {
                            console['log']('🔄\x20Restart\x20required\x20-\x20Baileys\x20will\x20reconnect\x20automatically');
                            const _0x358f3c = _0xcacb85['sessionDir'] + '/creds.json';
                            if (_0x0_0x25a6e9['existsSync'](_0x358f3c)) {
                                try {
                                    const _0x1bac46 = await _0x0_0x25a6e9['readFile'](_0x358f3c, 'utf-8');
                                    const _0x59c94f = JSON['parse'](_0x1bac46);
                                    if (_0x59c94f['me']?.['id']) {
                                        console['log']('✅\x20Session\x20found\x20via\x20file\x20check');
                                        const _0x426691 = await this['saveSessionData'](_0xcacb85, _0x222014, _0x3f9ec3);
                                        const _0x56f62a = Object['keys'](_0x222014['authState']['creds']['me'] || {})['length'] > 0x0 ? jidNormalizedUser(_0x222014['authState']['creds']['me']['id']) : null;
                                        if (_0x56f62a) {
                                            await delay(0x7d0);
                                            const _0x1958dc = await _0x222014['sendMessage'](_0x56f62a, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x426691 + '`\x0a\x0a📌\x20SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE,DON\x27T\x20SHARE\x20IT!' });
                                            await _0x222014['sendMessage'](_0x56f62a, { 'quoted': _0x1958dc });
                                        }
                                    }
                                } catch (_0x5e630c) {
                                    console['log']('⚠️\x20File\x20check\x20failed:', _0x5e630c['message']);
                                }
                            }
                            return;
                        }
                        if (_0xcacb85['sessionSaved'] || _0xcacb85['sessionCompleted']) {
                            await this['cleanup'](_0x3f9ec3, 'session_complete');
                            return;
                        }
                        if (_0x5bde39 === DisconnectReason['loggedOut'] || _0x5bde39 === 0x191) {
                            await this['cleanup'](_0x3f9ec3, 'logged_out');
                            _0xc4f9(new Error('Invalid\x20QR\x20code\x20or\x20session\x20expired'));
                        } else {
                            if (_0xcacb85['reconnectAttempts'] < MAX_RECONNECT_ATTEMPTS) {
                                _0xcacb85['reconnectAttempts']++;
                                await delay(0x7d0);
                                await this['initiateQRSession'](_0x3f9ec3);
                            } else {
                                await this['cleanup'](_0x3f9ec3, 'max_reconnects');
                                _0xc4f9(new Error('Max\x20reconnection\x20attempts\x20reached'));
                            }
                        }
                    }
                });
                _0xcacb85['timeoutHandle'] = setTimeout(async () => {
                    if (!_0xcacb85['sessionCompleted'] && !_0xcacb85['isCleaningUp']) {
                        await this['cleanup'](_0x3f9ec3, 'timeout');
                        _0xc4f9(new Error('Session\x20timeout'));
                    }
                }, SESSION_TIMEOUT);
            } catch (_0x14b1d2) {
                console['error']('Error\x20initiating\x20QR\x20session:', _0x14b1d2);
                _0xc4f9(_0x14b1d2);
            }
        });
    }
    async ['initiatePairSession'](_0x191a60) {
        const _0x34b924 = this['sessions']['get'](_0x191a60);
        if (!_0x34b924)
            throw new Error('Session\x20not\x20found');
        return new Promise(async (_0x1b0621, _0x338660) => {
            try {
                const {version: _0x147bb2} = await fetchLatestBaileysVersion();
                if (!await _0x0_0x25a6e9['pathExists'](_0x34b924['sessionDir'])) {
                    await _0x0_0x25a6e9['mkdir'](_0x34b924['sessionDir'], { 'recursive': !![] });
                }
                const {
                    state: _0x288362,
                    saveCreds: _0x23f925
                } = await useMultiFileAuthState(_0x34b924['sessionDir']);
                _0x34b924['currentSocket'] = makeWASocket({
                    'version': _0x147bb2,
                    'logger': _0x0_0x1b749b({ 'level': 'silent' }),
                    'browser': Browsers['macOS']('Chrome'),
                    'auth': {
                        'creds': _0x288362['creds'],
                        'keys': makeCacheableSignalKeyStore(_0x288362['keys'], _0x0_0x1b749b({ 'level': 'fatal' })['child']({ 'level': 'fatal' }))
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
                const _0x242cd2 = _0x34b924['currentSocket'];
                _0x242cd2['ev']['on']('connection.update', async _0xecc262 => {
                    if (_0x34b924['isCleaningUp'])
                        return;
                    const {
                        connection: _0x1072da,
                        lastDisconnect: _0x296091,
                        isNewLogin: _0x5d671b
                    } = _0xecc262;
                    if (_0x1072da === 'open') {
                        if (_0x34b924['sessionCompleted'])
                            return;
                        _0x34b924['sessionCompleted'] = !![];
                        try {
                            const _0x3f1329 = _0x34b924['sessionDir'] + '/creds.json';
                            const _0x1ca0bd = './session';
                            if (!await _0x0_0x25a6e9['pathExists'](_0x1ca0bd)) {
                                await _0x0_0x25a6e9['mkdir'](_0x1ca0bd, { 'recursive': !![] });
                            }
                            if (await _0x0_0x25a6e9['pathExists'](_0x3f1329)) {
                                await _0x0_0x25a6e9['copy'](_0x34b924['sessionDir'], _0x1ca0bd);
                                console['log']('✅\x20Session\x20credentials\x20saved\x20to\x20main\x20session\x20directory');
                            }
                            await delay(0xbb8);
                            if (_0x0_0x25a6e9['existsSync'](_0x3f1329)) {
                                const _0x555cf4 = JSON['parse'](await _0x0_0x25a6e9['readFile'](_0x3f1329, 'utf-8'));
                                const _0x1c005b = _0x34b924['phoneNumber'] || Object['keys'](_0x555cf4['me'] || {})[0x0]?.['split']('@')[0x0] || null;
                                const _0x518151 = await _0x0_0x20ef67['saveSession'](_0x555cf4, _0x1c005b);
                                console['log']('✅\x20Session\x20saved\x20to\x20database:\x20' + _0x518151);
                                const _0x1927f5 = Object['keys'](_0x242cd2['authState']['creds']['me'] || {})['length'] > 0x0 ? jidNormalizedUser(_0x242cd2['authState']['creds']['me']['id']) : jidNormalizedUser(_0x34b924['phoneNumber'] + '@s.whatsapp.net');
                                if (_0x1927f5) {
                                    await delay(0x7d0);
                                    const _0x440405 = await _0x242cd2['sendMessage'](_0x1927f5, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x518151 + '`\x0a\x0a📌\x20SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE,DON\x27T\x20SHARE\x20IT!' });
                                    await _0x242cd2['sendMessage'](_0x1927f5, { 'quoted': _0x440405 });
                                }
                            }
                        } catch (_0x164342) {
                            console['error']('Error\x20saving\x20session:', _0x164342);
                        } finally {
                            setTimeout(async () => {
                                await this['cleanup'](_0x191a60, 'session_complete');
                            }, 0x2710);
                        }
                    }
                    if (_0x5d671b)
                        console['log']('🔐\x20New\x20login\x20via\x20pair\x20code\x20for\x20' + _0x34b924['phoneNumber']);
                    if (_0x1072da === 'close') {
                        if (_0x34b924['sessionCompleted'] || _0x34b924['isCleaningUp']) {
                            await this['cleanup'](_0x191a60, 'already_complete');
                            return;
                        }
                        const _0x25af56 = _0x296091?.['error']?.['output']?.['statusCode'];
                        if (_0x25af56 === DisconnectReason['loggedOut'] || _0x25af56 === 0x191) {
                            await this['cleanup'](_0x191a60, 'logged_out');
                            _0x338660(new Error('Invalid\x20pairing\x20code\x20or\x20session\x20expired'));
                        } else if (_0x34b924['pairingCodeSent'] && !_0x34b924['sessionCompleted']) {
                            if (_0x34b924['reconnectAttempts'] < MAX_RECONNECT_ATTEMPTS) {
                                _0x34b924['reconnectAttempts']++;
                                await delay(0x7d0);
                                await this['initiatePairSession'](_0x191a60);
                            } else {
                                await this['cleanup'](_0x191a60, 'max_reconnects');
                                _0x338660(new Error('Max\x20reconnection\x20attempts\x20reached'));
                            }
                        }
                    }
                });
                if (!_0x242cd2['authState']['creds']['registered'] && !_0x34b924['pairingCodeSent'] && !_0x34b924['isCleaningUp']) {
                    await delay(0x5dc);
                    try {
                        _0x34b924['pairingCodeSent'] = !![];
                        let _0xcd008c = await _0x242cd2['requestPairingCode'](_0x34b924['phoneNumber']);
                        _0xcd008c = _0xcd008c?.['match'](/.{1,4}/g)?.['join']('-') || _0xcd008c;
                        _0x1b0621({
                            'type': 'pair',
                            'code': _0xcd008c,
                            'sessionId': _0x191a60,
                            'phoneNumber': _0x34b924['phoneNumber']
                        });
                    } catch (_0x760e36) {
                        _0x34b924['pairingCodeSent'] = ![];
                        _0x338660(new Error('Failed\x20to\x20get\x20pairing\x20code:\x20' + _0x760e36['message']));
                    }
                }
                _0x242cd2['ev']['on']('creds.update', _0x23f925);
                _0x34b924['timeoutHandle'] = setTimeout(async () => {
                    if (!_0x34b924['sessionCompleted'] && !_0x34b924['isCleaningUp']) {
                        await this['cleanup'](_0x191a60, 'timeout');
                        _0x338660(new Error('Pairing\x20timeout'));
                    }
                }, SESSION_TIMEOUT);
            } catch (_0x1910b7) {
                console['error']('Error\x20initiating\x20pair\x20session:', _0x1910b7);
                _0x338660(_0x1910b7);
            }
        });
    }
    ['isSessionComplete'](_0x3afd3d) {
        const _0x17af62 = this['sessions']['get'](_0x3afd3d);
        if (!_0x17af62)
            return ![];
        if (!_0x17af62['sessionCompleted'])
            return ![];
        try {
            const _0x53adc4 = _0x17af62['sessionDir'] + '/creds.json';
            const _0x34a371 = './session/creds.json';
            let _0x34186f = _0x0_0x25a6e9['existsSync'](_0x34a371) ? _0x34a371 : _0x0_0x25a6e9['existsSync'](_0x53adc4) ? _0x53adc4 : null;
            if (_0x34186f) {
                const _0x5c4629 = JSON['parse'](_0x0_0x25a6e9['readFileSync'](_0x34186f, 'utf-8'));
                return _0x5c4629['registered'] === !![] && !!_0x5c4629['me']?.['id'];
            }
        } catch (_0x3e0c00) {
            console['error']('Error\x20verifying\x20physical\x20creds\x20in\x20isSessionComplete:', _0x3e0c00);
            return ![];
        }
        return ![];
    }
}
export default new PairingManager();