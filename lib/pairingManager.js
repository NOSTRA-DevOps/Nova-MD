import _0x0_0x2fbbc4 from 'fs-extra';
import _0x0_0x506400 from 'pino';
import _0x0_0x30adb4 from 'qrcode';
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
import _0x0_0x596056 from 'awesome-phonenumber';
import _0x0_0x51200b from './sessionManager.js';
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
        const _0x547866 = Date['now']()['toString']() + Math['random']()['toString'](0x24)['substring'](0x2, 0x9);
        const _0x18c8af = './temp_session_' + _0x547866;
        const _0x21b745 = {
            'sessionId': _0x547866,
            'sessionDir': _0x18c8af,
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
        this['sessions']['set'](_0x547866, _0x21b745);
        return _0x547866;
    }
    async ['createPairSession'](_0x3ce2cc) {
        if (!_0x3ce2cc)
            throw new Error('Phone\x20number\x20is\x20required');
        _0x3ce2cc = _0x3ce2cc['replace'](/[^0-9]/g, '');
        const _0xd3ef60 = _0x0_0x596056('+' + _0x3ce2cc);
        if (!_0xd3ef60['isValid']())
            throw new Error('Invalid\x20phone\x20number');
        _0x3ce2cc = _0xd3ef60['getNumber']('e164')['replace']('+', '');
        const _0x338053 = Date['now']()['toString']() + Math['random']()['toString'](0x24)['substring'](0x2, 0x9);
        const _0x350a91 = './temp_session_' + _0x338053;
        const _0x57d307 = {
            'sessionId': _0x338053,
            'sessionDir': _0x350a91,
            'phoneNumber': _0x3ce2cc,
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
        this['sessions']['set'](_0x338053, _0x57d307);
        return _0x338053;
    }
    async ['removeSessionDir'](_0x23452f) {
        try {
            if (await _0x0_0x2fbbc4['pathExists'](_0x23452f)) {
                await _0x0_0x2fbbc4['remove'](_0x23452f);
                return !![];
            }
        } catch (_0x45e142) {
            console['error']('Error\x20removing\x20session\x20dir:', _0x45e142);
        }
        return ![];
    }
    async ['cleanupSessions']() {
        const _0x54558d = Date['now']();
        const _0x539607 = [];
        for (const [_0x55d7a9, _0x527d7b] of this['sessions']['entries']()) {
            if (_0x54558d - _0x527d7b['createdAt'] > SESSION_TIMEOUT) {
                _0x539607['push'](_0x55d7a9);
            }
        }
        for (const _0x6f5f0d of _0x539607) {
            const _0x2c0de1 = this['sessions']['get'](_0x6f5f0d);
            await this['cleanup'](_0x6f5f0d, 'session_expired');
        }
    }
    async ['cleanup'](_0x4523e5, _0x59e9ff = 'unknown') {
        const _0x3471d = this['sessions']['get'](_0x4523e5);
        if (!_0x3471d)
            return;
        if (_0x3471d['isCleaningUp'])
            return;
        console['log']('🧹\x20Cleanup\x20session\x20' + _0x4523e5 + '\x20-\x20' + _0x59e9ff);
        if (_0x59e9ff === 'session_complete' || _0x3471d['sessionCompleted']) {
            if (_0x3471d['timeoutHandle']) {
                clearTimeout(_0x3471d['timeoutHandle']);
                _0x3471d['timeoutHandle'] = null;
            }
            this['sessions']['delete'](_0x4523e5);
            console['log']('✅\x20Socket\x20handed\x20over\x20to\x20index.js\x20successfully.');
            return;
        }
        _0x3471d['isCleaningUp'] = !![];
        if (_0x3471d['timeoutHandle']) {
            clearTimeout(_0x3471d['timeoutHandle']);
            _0x3471d['timeoutHandle'] = null;
        }
        if (_0x3471d['currentSocket']) {
            try {
                _0x3471d['currentSocket']['ev']['removeAllListeners']();
                await _0x3471d['currentSocket']['end']();
            } catch (_0x2e5c78) {
            }
            _0x3471d['currentSocket'] = null;
        }
        setTimeout(async () => {
            await this['removeSessionDir'](_0x3471d['sessionDir']);
            this['sessions']['delete'](_0x4523e5);
        }, 0x1388);
    }
    async ['saveSessionData'](_0x54011a, _0x4e0511, _0x3ed271) {
        if (this['sessionSaveInProgress']['get'](_0x3ed271)) {
            console['log']('⏳\x20Session\x20save\x20already\x20in\x20progress...');
            return;
        }
        this['sessionSaveInProgress']['set'](_0x3ed271, !![]);
        try {
            const _0x3c1492 = _0x54011a['sessionDir'] + '/creds.json';
            const _0x37b369 = './session';
            if (!_0x0_0x2fbbc4['existsSync'](_0x3c1492)) {
                console['log']('❌\x20No\x20credentials\x20file\x20found');
                this['sessionSaveInProgress']['delete'](_0x3ed271);
                return;
            }
            const _0x491e6a = await _0x0_0x2fbbc4['readFile'](_0x3c1492, 'utf-8');
            const _0x318e33 = JSON['parse'](_0x491e6a);
            if (!_0x318e33['me']?.['id']) {
                console['log']('⚠️\x20Session\x20not\x20valid\x20(no\x20me.id)');
                this['sessionSaveInProgress']['delete'](_0x3ed271);
                return;
            }
            console['log']('✅\x20Session\x20valid:\x20me.id\x20=\x20' + _0x318e33['me']['id']);
            if (!_0x318e33['registered']) {
                _0x318e33['registered'] = !![];
                _0x0_0x2fbbc4['writeFileSync'](_0x3c1492, JSON['stringify'](_0x318e33, null, 0x2));
                console['log']('🔧\x20Forced\x20registered:\x20true');
            }
            if (!await _0x0_0x2fbbc4['pathExists'](_0x37b369)) {
                await _0x0_0x2fbbc4['mkdir'](_0x37b369, { 'recursive': !![] });
            }
            await _0x0_0x2fbbc4['copy'](_0x54011a['sessionDir'], _0x37b369);
            console['log']('✅\x20Session\x20credentials\x20saved\x20to\x20main\x20session\x20directory');
            let _0x4aa7e2 = _0x54011a['phoneNumber'] || null;
            if (!_0x4aa7e2 && _0x318e33['me']?.['id']) {
                _0x4aa7e2 = _0x318e33['me']['id']['split'](':')[0x0];
            }
            const _0x553624 = await _0x0_0x51200b['saveSession'](_0x318e33, _0x4aa7e2);
            console['log']('✅\x20Session\x20saved\x20to\x20database:\x20' + _0x553624);
            const _0xeadd0a = _0x4e0511['authState']['creds']['me']?.['id'] ? jidNormalizedUser(_0x4e0511['authState']['creds']['me']['id']) : jidNormalizedUser(_0x54011a['phoneNumber'] + '@s.whatsapp.net');
            if (_0xeadd0a) {
                const _0x494c02 = await _0x4e0511['sendMessage'](_0xeadd0a, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x553624 + '`\x0a\x0a📌\x20*SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE\x20DON\x27T\x20SHARE\x20IT*\x20✅' });
                await _0x4e0511['sendMessage'](_0xeadd0a, {
                    'text': MESSAGE,
                    'quoted': _0x494c02
                });
                console['log']('✅\x20Success\x20message\x20sent');
            }
            _0x54011a['sessionCompleted'] = !![];
            _0x54011a['sessionSaved'] = !![];
            setTimeout(async () => {
                await this['cleanup'](_0x3ed271, 'session_complete');
            }, 0x1388);
        } catch (_0x9ca6e1) {
            console['error']('❌\x20Error\x20saving\x20session:', _0x9ca6e1);
        } finally {
            this['sessionSaveInProgress']['delete'](_0x3ed271);
        }
    }
    async ['initiateQRSession'](_0x5dbe0e) {
        const _0x25159d = this['sessions']['get'](_0x5dbe0e);
        if (!_0x25159d)
            throw new Error('Session\x20not\x20found');
        return new Promise(async (_0x1360d2, _0x5ab411) => {
            try {
                const {version: _0x262eb1} = await fetchLatestBaileysVersion();
                if (!await _0x0_0x2fbbc4['pathExists'](_0x25159d['sessionDir'])) {
                    await _0x0_0x2fbbc4['mkdir'](_0x25159d['sessionDir'], { 'recursive': !![] });
                }
                const {
                    state: _0x6dce29,
                    saveCreds: _0x8111f9
                } = await useMultiFileAuthState(_0x25159d['sessionDir']);
                _0x25159d['currentSocket'] = makeWASocket({
                    'version': _0x262eb1,
                    'logger': _0x0_0x506400({ 'level': 'silent' }),
                    'browser': Browsers['macOS']('Chrome'),
                    'auth': {
                        'creds': _0x6dce29['creds'],
                        'keys': makeCacheableSignalKeyStore(_0x6dce29['keys'], _0x0_0x506400({ 'level': 'fatal' })['child']({ 'level': 'fatal' }))
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
                const _0x2cbf64 = _0x25159d['currentSocket'];
                _0x2cbf64['ev']['on']('creds.update', async _0xb4f7d9 => {
                    console['log']('🔄\x20creds.update\x20triggered');
                    await _0x8111f9();
                    if (_0xb4f7d9['me']?.['id']) {
                        console['log']('✅\x20Session\x20valid\x20via\x20creds.update:\x20' + _0xb4f7d9['me']['id']);
                        _0x25159d['credsUpdated'] = !![];
                        if (!_0xb4f7d9['registered']) {
                            _0xb4f7d9['registered'] = !![];
                            await _0x8111f9();
                            console['log']('🔧\x20Forced\x20registered:\x20true\x20via\x20creds.update');
                        }
                        if (!_0x25159d['sessionSaved'] && !_0x25159d['sessionCompleted']) {
                            await this['saveSessionData'](_0x25159d, _0x2cbf64, _0x5dbe0e);
                        }
                    }
                });
                const _0xa73808 = async _0x1617fa => {
                    if (_0x25159d['qrGenerated'] || _0x25159d['sessionCompleted'] || _0x25159d['isCleaningUp'])
                        return;
                    _0x25159d['qrGenerated'] = !![];
                    try {
                        const _0x2f7469 = await _0x0_0x30adb4['toDataURL'](_0x1617fa, { 'errorCorrectionLevel': 'M' });
                        _0x1360d2({
                            'type': 'qr',
                            'qr': _0x2f7469,
                            'sessionId': _0x5dbe0e
                        });
                    } catch (_0x3097f9) {
                        console['error']('Error\x20generating\x20QR\x20code:', _0x3097f9);
                        _0x5ab411(_0x3097f9);
                    }
                };
                _0x2cbf64['ev']['on']('connection.update', async _0x11ad0a => {
                    if (_0x25159d['isCleaningUp'])
                        return;
                    const {
                        connection: _0x276d86,
                        lastDisconnect: _0x577c6e,
                        qr: _0x17c4e4,
                        isNewLogin: _0x1928a3
                    } = _0x11ad0a;
                    if (_0x17c4e4 && !_0x25159d['qrGenerated'] && !_0x25159d['sessionCompleted']) {
                        await _0xa73808(_0x17c4e4);
                    }
                    if (_0x1928a3) {
                        console['log']('🔐\x20New\x20login\x20via\x20QR\x20code');
                    }
                    if (_0x276d86 === 'open') {
                        console['log']('🔐\x20Connection\x20open');
                        if (_0x25159d['sessionSaved'] || _0x25159d['sessionCompleted'])
                            return;
                        if (_0x25159d['credsUpdated']) {
                            const _0x38cfeb = await this['saveSessionData'](_0x25159d, _0x2cbf64, _0x5dbe0e);
                            const _0x1f628c = Object['keys'](_0x2cbf64['authState']['creds']['me'] || {})['length'] > 0x0 ? jidNormalizedUser(_0x2cbf64['authState']['creds']['me']['id']) : null;
                            if (_0x1f628c) {
                                await delay(0x7d0);
                                const _0x5a15dd = await _0x2cbf64['sendMessage'](_0x1f628c, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x38cfeb + '`\x0a\x0a📌\x20SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE,DON\x27T\x20SHARE\x20IT!' });
                                await _0x2cbf64['sendMessage'](_0x1f628c, { 'quoted': _0x5a15dd });
                            }
                        } else {
                            console['log']('⏳\x20Waiting\x20for\x20session\x20to\x20be\x20ready...');
                            await delay(0xbb8);
                            const _0x1e9be0 = _0x25159d['sessionDir'] + '/creds.json';
                            if (_0x0_0x2fbbc4['existsSync'](_0x1e9be0)) {
                                try {
                                    const _0x1ea101 = await _0x0_0x2fbbc4['readFile'](_0x1e9be0, 'utf-8');
                                    const _0xca83ee = JSON['parse'](_0x1ea101);
                                    if (_0xca83ee['me']?.['id']) {
                                        console['log']('✅\x20Session\x20found\x20via\x20file\x20check');
                                        const _0x5e26cf = await this['saveSessionData'](_0x25159d, _0x2cbf64, _0x5dbe0e);
                                        const _0x4568f3 = Object['keys'](_0x2cbf64['authState']['creds']['me'] || {})['length'] > 0x0 ? jidNormalizedUser(_0x2cbf64['authState']['creds']['me']['id']) : null;
                                        if (_0x4568f3) {
                                            await delay(0x7d0);
                                            const _0x16b770 = await _0x2cbf64['sendMessage'](_0x4568f3, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x5e26cf + '`\x0a\x0a📌\x20SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE,DON\x27T\x20SHARE\x20IT!' });
                                            await _0x2cbf64['sendMessage'](_0x4568f3, { 'quoted': _0x16b770 });
                                        }
                                    }
                                } catch (_0x306797) {
                                    console['log']('⚠️\x20File\x20check\x20failed:', _0x306797['message']);
                                }
                            }
                        }
                    }
                    if (_0x276d86 === 'close') {
                        console['log']('🔌\x20Connection\x20closed');
                        const _0x3fe501 = _0x577c6e?.['error']?.['output']?.['statusCode'];
                        if (_0x3fe501 === DisconnectReason['restartRequired']) {
                            console['log']('🔄\x20Restart\x20required\x20-\x20Baileys\x20will\x20reconnect\x20automatically');
                            const _0x528362 = _0x25159d['sessionDir'] + '/creds.json';
                            if (_0x0_0x2fbbc4['existsSync'](_0x528362)) {
                                try {
                                    const _0x2f8980 = await _0x0_0x2fbbc4['readFile'](_0x528362, 'utf-8');
                                    const _0x35943d = JSON['parse'](_0x2f8980);
                                    if (_0x35943d['me']?.['id']) {
                                        console['log']('✅\x20Session\x20found\x20via\x20file\x20check');
                                        const _0x52eab2 = await this['saveSessionData'](_0x25159d, _0x2cbf64, _0x5dbe0e);
                                        const _0x6d737 = Object['keys'](_0x2cbf64['authState']['creds']['me'] || {})['length'] > 0x0 ? jidNormalizedUser(_0x2cbf64['authState']['creds']['me']['id']) : null;
                                        if (_0x6d737) {
                                            await delay(0x7d0);
                                            const _0x204b97 = await _0x2cbf64['sendMessage'](_0x6d737, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x52eab2 + '`\x0a\x0a📌\x20SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE,DON\x27T\x20SHARE\x20IT!' });
                                            await _0x2cbf64['sendMessage'](_0x6d737, { 'quoted': _0x204b97 });
                                        }
                                    }
                                } catch (_0xf787a7) {
                                    console['log']('⚠️\x20File\x20check\x20failed:', _0xf787a7['message']);
                                }
                            }
                            return;
                        }
                        if (_0x25159d['sessionSaved'] || _0x25159d['sessionCompleted']) {
                            await this['cleanup'](_0x5dbe0e, 'session_complete');
                            return;
                        }
                        if (_0x3fe501 === DisconnectReason['loggedOut'] || _0x3fe501 === 0x191) {
                            await this['cleanup'](_0x5dbe0e, 'logged_out');
                            _0x5ab411(new Error('Invalid\x20QR\x20code\x20or\x20session\x20expired'));
                        } else {
                            if (_0x25159d['reconnectAttempts'] < MAX_RECONNECT_ATTEMPTS) {
                                _0x25159d['reconnectAttempts']++;
                                await delay(0x7d0);
                                await this['initiateQRSession'](_0x5dbe0e);
                            } else {
                                await this['cleanup'](_0x5dbe0e, 'max_reconnects');
                                _0x5ab411(new Error('Max\x20reconnection\x20attempts\x20reached'));
                            }
                        }
                    }
                });
                _0x25159d['timeoutHandle'] = setTimeout(async () => {
                    if (!_0x25159d['sessionCompleted'] && !_0x25159d['isCleaningUp']) {
                        await this['cleanup'](_0x5dbe0e, 'timeout');
                        _0x5ab411(new Error('Session\x20timeout'));
                    }
                }, SESSION_TIMEOUT);
            } catch (_0x2e1564) {
                console['error']('Error\x20initiating\x20QR\x20session:', _0x2e1564);
                _0x5ab411(_0x2e1564);
            }
        });
    }
    async ['initiatePairSession'](_0x218fa1) {
        const _0x4067b2 = this['sessions']['get'](_0x218fa1);
        if (!_0x4067b2)
            throw new Error('Session\x20not\x20found');
        return new Promise(async (_0x249928, _0x7e1c7a) => {
            try {
                const {version: _0x14189c} = await fetchLatestBaileysVersion();
                if (!await _0x0_0x2fbbc4['pathExists'](_0x4067b2['sessionDir'])) {
                    await _0x0_0x2fbbc4['mkdir'](_0x4067b2['sessionDir'], { 'recursive': !![] });
                }
                const {
                    state: _0x4bd1cc,
                    saveCreds: _0x500f40
                } = await useMultiFileAuthState(_0x4067b2['sessionDir']);
                _0x4067b2['currentSocket'] = makeWASocket({
                    'version': _0x14189c,
                    'logger': _0x0_0x506400({ 'level': 'silent' }),
                    'browser': Browsers['macOS']('Chrome'),
                    'auth': {
                        'creds': _0x4bd1cc['creds'],
                        'keys': makeCacheableSignalKeyStore(_0x4bd1cc['keys'], _0x0_0x506400({ 'level': 'fatal' })['child']({ 'level': 'fatal' }))
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
                const _0x177c16 = _0x4067b2['currentSocket'];
                _0x177c16['ev']['on']('connection.update', async _0x379018 => {
                    if (_0x4067b2['isCleaningUp'])
                        return;
                    const {
                        connection: _0x35e7a9,
                        lastDisconnect: _0x301d4a,
                        isNewLogin: _0x2f3f65
                    } = _0x379018;
                    if (_0x35e7a9 === 'open') {
                        if (_0x4067b2['sessionCompleted'])
                            return;
                        _0x4067b2['sessionCompleted'] = !![];
                        try {
                            const _0x33227a = _0x4067b2['sessionDir'] + '/creds.json';
                            const _0x590477 = './session';
                            if (!await _0x0_0x2fbbc4['pathExists'](_0x590477)) {
                                await _0x0_0x2fbbc4['mkdir'](_0x590477, { 'recursive': !![] });
                            }
                            if (await _0x0_0x2fbbc4['pathExists'](_0x33227a)) {
                                await _0x0_0x2fbbc4['copy'](_0x4067b2['sessionDir'], _0x590477);
                                console['log']('✅\x20Session\x20credentials\x20saved\x20to\x20main\x20session\x20directory');
                            }
                            await delay(0xbb8);
                            if (_0x0_0x2fbbc4['existsSync'](_0x33227a)) {
                                const _0x25d113 = JSON['parse'](await _0x0_0x2fbbc4['readFile'](_0x33227a, 'utf-8'));
                                const _0x468720 = _0x4067b2['phoneNumber'] || Object['keys'](_0x25d113['me'] || {})[0x0]?.['split']('@')[0x0] || null;
                                const _0x88c312 = await _0x0_0x51200b['saveSession'](_0x25d113, _0x468720);
                                console['log']('✅\x20Session\x20saved\x20to\x20database:\x20' + _0x88c312);
                                const _0x187ca6 = Object['keys'](_0x177c16['authState']['creds']['me'] || {})['length'] > 0x0 ? jidNormalizedUser(_0x177c16['authState']['creds']['me']['id']) : jidNormalizedUser(_0x4067b2['phoneNumber'] + '@s.whatsapp.net');
                                if (_0x187ca6) {
                                    await delay(0x7d0);
                                    const _0x28f6b3 = await _0x177c16['sendMessage'](_0x187ca6, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x88c312 + '`\x0a\x0a📌\x20SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE,DON\x27T\x20SHARE\x20IT!' });
                                    await _0x177c16['sendMessage'](_0x187ca6, { 'quoted': _0x28f6b3 });
                                }
                            }
                        } catch (_0x4183b9) {
                            console['error']('Error\x20saving\x20session:', _0x4183b9);
                        } finally {
                            setTimeout(async () => {
                                await this['cleanup'](_0x218fa1, 'session_complete');
                            }, 0x2710);
                        }
                    }
                    if (_0x2f3f65)
                        console['log']('🔐\x20New\x20login\x20via\x20pair\x20code\x20for\x20' + _0x4067b2['phoneNumber']);
                    if (_0x35e7a9 === 'close') {
                        if (_0x4067b2['sessionCompleted'] || _0x4067b2['isCleaningUp']) {
                            await this['cleanup'](_0x218fa1, 'already_complete');
                            return;
                        }
                        const _0x5aa45a = _0x301d4a?.['error']?.['output']?.['statusCode'];
                        if (_0x5aa45a === DisconnectReason['loggedOut'] || _0x5aa45a === 0x191) {
                            await this['cleanup'](_0x218fa1, 'logged_out');
                            _0x7e1c7a(new Error('Invalid\x20pairing\x20code\x20or\x20session\x20expired'));
                        } else if (_0x4067b2['pairingCodeSent'] && !_0x4067b2['sessionCompleted']) {
                            if (_0x4067b2['reconnectAttempts'] < MAX_RECONNECT_ATTEMPTS) {
                                _0x4067b2['reconnectAttempts']++;
                                await delay(0x7d0);
                                await this['initiatePairSession'](_0x218fa1);
                            } else {
                                await this['cleanup'](_0x218fa1, 'max_reconnects');
                                _0x7e1c7a(new Error('Max\x20reconnection\x20attempts\x20reached'));
                            }
                        }
                    }
                });
                if (!_0x177c16['authState']['creds']['registered'] && !_0x4067b2['pairingCodeSent'] && !_0x4067b2['isCleaningUp']) {
                    await delay(0x5dc);
                    try {
                        _0x4067b2['pairingCodeSent'] = !![];
                        let _0x578eb7 = await _0x177c16['requestPairingCode'](_0x4067b2['phoneNumber']);
                        _0x578eb7 = _0x578eb7?.['match'](/.{1,4}/g)?.['join']('-') || _0x578eb7;
                        _0x249928({
                            'type': 'pair',
                            'code': _0x578eb7,
                            'sessionId': _0x218fa1,
                            'phoneNumber': _0x4067b2['phoneNumber']
                        });
                    } catch (_0x261969) {
                        _0x4067b2['pairingCodeSent'] = ![];
                        _0x7e1c7a(new Error('Failed\x20to\x20get\x20pairing\x20code:\x20' + _0x261969['message']));
                    }
                }
                _0x177c16['ev']['on']('creds.update', _0x500f40);
                _0x4067b2['timeoutHandle'] = setTimeout(async () => {
                    if (!_0x4067b2['sessionCompleted'] && !_0x4067b2['isCleaningUp']) {
                        await this['cleanup'](_0x218fa1, 'timeout');
                        _0x7e1c7a(new Error('Pairing\x20timeout'));
                    }
                }, SESSION_TIMEOUT);
            } catch (_0x287cde) {
                console['error']('Error\x20initiating\x20pair\x20session:', _0x287cde);
                _0x7e1c7a(_0x287cde);
            }
        });
    }
    ['isSessionComplete'](_0x307408) {
        const _0x3d5433 = this['sessions']['get'](_0x307408);
        if (!_0x3d5433)
            return ![];
        if (!_0x3d5433['sessionCompleted'])
            return ![];
        try {
            const _0x61a463 = _0x3d5433['sessionDir'] + '/creds.json';
            const _0x162b2a = './session/creds.json';
            let _0x28b48b = _0x0_0x2fbbc4['existsSync'](_0x162b2a) ? _0x162b2a : _0x0_0x2fbbc4['existsSync'](_0x61a463) ? _0x61a463 : null;
            if (_0x28b48b) {
                const _0x47a21a = JSON['parse'](_0x0_0x2fbbc4['readFileSync'](_0x28b48b, 'utf-8'));
                return _0x47a21a['registered'] === !![] && !!_0x47a21a['me']?.['id'];
            }
        } catch (_0x2c839e) {
            console['error']('Error\x20verifying\x20physical\x20creds\x20in\x20isSessionComplete:', _0x2c839e);
            return ![];
        }
        return ![];
    }
}
export default new PairingManager();