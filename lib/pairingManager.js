import _0x0_0x121d5e from 'fs-extra';
import _0x0_0x3cfe4c from 'pino';
import _0x0_0x3b0231 from 'qrcode';
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
import _0x0_0x229189 from 'awesome-phonenumber';
import _0x0_0x5494db from './sessionManager.js';
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
        const _0x142e64 = Date['now']()['toString']() + Math['random']()['toString'](0x24)['substring'](0x2, 0x9);
        const _0x2910c6 = './temp_session_' + _0x142e64;
        const _0x1b58c4 = {
            'sessionId': _0x142e64,
            'sessionDir': _0x2910c6,
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
        this['sessions']['set'](_0x142e64, _0x1b58c4);
        return _0x142e64;
    }
    async ['createPairSession'](_0x29ee1d) {
        if (!_0x29ee1d)
            throw new Error('Phone\x20number\x20is\x20required');
        _0x29ee1d = _0x29ee1d['replace'](/[^0-9]/g, '');
        const _0x202a0a = _0x0_0x229189('+' + _0x29ee1d);
        if (!_0x202a0a['isValid']())
            throw new Error('Invalid\x20phone\x20number');
        _0x29ee1d = _0x202a0a['getNumber']('e164')['replace']('+', '');
        const _0x1ae8c6 = Date['now']()['toString']() + Math['random']()['toString'](0x24)['substring'](0x2, 0x9);
        const _0x2f74f4 = './temp_session_' + _0x1ae8c6;
        const _0x3c0b0e = {
            'sessionId': _0x1ae8c6,
            'sessionDir': _0x2f74f4,
            'phoneNumber': _0x29ee1d,
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
        this['sessions']['set'](_0x1ae8c6, _0x3c0b0e);
        return _0x1ae8c6;
    }
    async ['removeSessionDir'](_0x3dec2c) {
        try {
            if (await _0x0_0x121d5e['pathExists'](_0x3dec2c)) {
                await _0x0_0x121d5e['remove'](_0x3dec2c);
                return !![];
            }
        } catch (_0x315e00) {
            console['error']('Error\x20removing\x20session\x20dir:', _0x315e00);
        }
        return ![];
    }
    async ['cleanupSessions']() {
        const _0x540be9 = Date['now']();
        const _0x239930 = [];
        for (const [_0x5f5836, _0xc8fe16] of this['sessions']['entries']()) {
            if (_0x540be9 - _0xc8fe16['createdAt'] > SESSION_TIMEOUT) {
                _0x239930['push'](_0x5f5836);
            }
        }
        for (const _0x2915bd of _0x239930) {
            const _0x40805a = this['sessions']['get'](_0x2915bd);
            await this['cleanup'](_0x2915bd, 'session_expired');
        }
    }
    async ['cleanup'](_0x577675, _0x354645 = 'unknown') {
        const _0x1fd0e9 = this['sessions']['get'](_0x577675);
        if (!_0x1fd0e9)
            return;
        if (_0x1fd0e9['isCleaningUp'])
            return;
        console['log']('🧹\x20Cleanup\x20session\x20' + _0x577675 + '\x20-\x20' + _0x354645);
        if (_0x354645 === 'session_complete' || _0x1fd0e9['sessionCompleted']) {
            if (_0x1fd0e9['timeoutHandle']) {
                clearTimeout(_0x1fd0e9['timeoutHandle']);
                _0x1fd0e9['timeoutHandle'] = null;
            }
            this['sessions']['delete'](_0x577675);
            console['log']('✅\x20Socket\x20handed\x20over\x20to\x20index.js\x20successfully.');
            return;
        }
        _0x1fd0e9['isCleaningUp'] = !![];
        if (_0x1fd0e9['timeoutHandle']) {
            clearTimeout(_0x1fd0e9['timeoutHandle']);
            _0x1fd0e9['timeoutHandle'] = null;
        }
        if (_0x1fd0e9['currentSocket']) {
            try {
                _0x1fd0e9['currentSocket']['ev']['removeAllListeners']();
                await _0x1fd0e9['currentSocket']['end']();
            } catch (_0xbeee52) {
            }
            _0x1fd0e9['currentSocket'] = null;
        }
        setTimeout(async () => {
            await this['removeSessionDir'](_0x1fd0e9['sessionDir']);
            this['sessions']['delete'](_0x577675);
        }, 0x1388);
    }
    async ['saveSessionData'](_0x430d7e, _0x178c35, _0x2b8e3b) {
        if (this['sessionSaveInProgress']['get'](_0x2b8e3b)) {
            console['log']('⏳\x20Session\x20save\x20already\x20in\x20progress...');
            return;
        }
        this['sessionSaveInProgress']['set'](_0x2b8e3b, !![]);
        try {
            const _0x3a0417 = _0x430d7e['sessionDir'] + '/creds.json';
            const _0x3dbf29 = './session';
            if (!_0x0_0x121d5e['existsSync'](_0x3a0417)) {
                console['log']('❌\x20No\x20credentials\x20file\x20found');
                this['sessionSaveInProgress']['delete'](_0x2b8e3b);
                return;
            }
            const _0x582de0 = await _0x0_0x121d5e['readFile'](_0x3a0417, 'utf-8');
            const _0x4b33b7 = JSON['parse'](_0x582de0);
            if (!_0x4b33b7['me']?.['id']) {
                console['log']('⚠️\x20Session\x20not\x20valid\x20(no\x20me.id)');
                this['sessionSaveInProgress']['delete'](_0x2b8e3b);
                return;
            }
            console['log']('✅\x20Session\x20valid:\x20me.id\x20=\x20' + _0x4b33b7['me']['id']);
            if (!_0x4b33b7['registered']) {
                _0x4b33b7['registered'] = !![];
                _0x0_0x121d5e['writeFileSync'](_0x3a0417, JSON['stringify'](_0x4b33b7, null, 0x2));
                console['log']('🔧\x20Forced\x20registered:\x20true');
            }
            if (!await _0x0_0x121d5e['pathExists'](_0x3dbf29)) {
                await _0x0_0x121d5e['mkdir'](_0x3dbf29, { 'recursive': !![] });
            }
            await _0x0_0x121d5e['copy'](_0x430d7e['sessionDir'], _0x3dbf29);
            console['log']('✅\x20Session\x20credentials\x20saved\x20to\x20main\x20session\x20directory');
            let _0x19083c = _0x430d7e['phoneNumber'] || null;
            if (!_0x19083c && _0x4b33b7['me']?.['id']) {
                _0x19083c = _0x4b33b7['me']['id']['split'](':')[0x0];
            }
            const _0x4d3176 = await _0x0_0x5494db['saveSession'](_0x4b33b7, _0x19083c);
            console['log']('✅\x20Session\x20saved\x20to\x20database:\x20' + _0x4d3176);
            const _0xb8081b = _0x178c35['authState']['creds']['me']?.['id'] ? jidNormalizedUser(_0x178c35['authState']['creds']['me']['id']) : jidNormalizedUser(_0x430d7e['phoneNumber'] + '@s.whatsapp.net');
            if (_0xb8081b) {
                const _0x477d90 = await _0x178c35['sendMessage'](_0xb8081b, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x4d3176 + '`\x0a\x0a📌\x20*SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE\x20DON\x27T\x20SHARE\x20IT*\x20✅' });
                await _0x178c35['sendMessage'](_0xb8081b, {
                    'text': MESSAGE,
                    'quoted': _0x477d90
                });
                console['log']('✅\x20Success\x20message\x20sent');
            }
            _0x430d7e['sessionCompleted'] = !![];
            _0x430d7e['sessionSaved'] = !![];
            setTimeout(async () => {
                await this['cleanup'](_0x2b8e3b, 'session_complete');
            }, 0x1388);
        } catch (_0x42a887) {
            console['error']('❌\x20Error\x20saving\x20session:', _0x42a887);
        } finally {
            this['sessionSaveInProgress']['delete'](_0x2b8e3b);
        }
    }
    async ['initiateQRSession'](_0x5143b4) {
        const _0x22711d = this['sessions']['get'](_0x5143b4);
        if (!_0x22711d)
            throw new Error('Session\x20not\x20found');
        return new Promise(async (_0x44f9a4, _0x190862) => {
            try {
                const {version: _0x3f59c3} = await fetchLatestBaileysVersion();
                if (!await _0x0_0x121d5e['pathExists'](_0x22711d['sessionDir'])) {
                    await _0x0_0x121d5e['mkdir'](_0x22711d['sessionDir'], { 'recursive': !![] });
                }
                const {
                    state: _0x13b2e,
                    saveCreds: _0x2054ea
                } = await useMultiFileAuthState(_0x22711d['sessionDir']);
                _0x22711d['currentSocket'] = makeWASocket({
                    'version': _0x3f59c3,
                    'logger': _0x0_0x3cfe4c({ 'level': 'silent' }),
                    'browser': Browsers['macOS']('Chrome'),
                    'auth': {
                        'creds': _0x13b2e['creds'],
                        'keys': makeCacheableSignalKeyStore(_0x13b2e['keys'], _0x0_0x3cfe4c({ 'level': 'fatal' })['child']({ 'level': 'fatal' }))
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
                const _0x35c85d = _0x22711d['currentSocket'];
                _0x35c85d['ev']['on']('creds.update', async _0x7014e1 => {
                    console['log']('🔄\x20creds.update\x20triggered');
                    await _0x2054ea();
                    if (_0x7014e1['me']?.['id']) {
                        console['log']('✅\x20Session\x20valid\x20via\x20creds.update:\x20' + _0x7014e1['me']['id']);
                        _0x22711d['credsUpdated'] = !![];
                        if (!_0x7014e1['registered']) {
                            _0x7014e1['registered'] = !![];
                            await _0x2054ea();
                            console['log']('🔧\x20Forced\x20registered:\x20true\x20via\x20creds.update');
                        }
                        if (!_0x22711d['sessionSaved'] && !_0x22711d['sessionCompleted']) {
                            await this['saveSessionData'](_0x22711d, _0x35c85d, _0x5143b4);
                        }
                    }
                });
                const _0x581986 = async _0x145e5e => {
                    if (_0x22711d['qrGenerated'] || _0x22711d['sessionCompleted'] || _0x22711d['isCleaningUp'])
                        return;
                    _0x22711d['qrGenerated'] = !![];
                    try {
                        const _0x381131 = await _0x0_0x3b0231['toDataURL'](_0x145e5e, { 'errorCorrectionLevel': 'M' });
                        _0x44f9a4({
                            'type': 'qr',
                            'qr': _0x381131,
                            'sessionId': _0x5143b4
                        });
                    } catch (_0x29cdeb) {
                        console['error']('Error\x20generating\x20QR\x20code:', _0x29cdeb);
                        _0x190862(_0x29cdeb);
                    }
                };
                _0x35c85d['ev']['on']('connection.update', async _0x23bae9 => {
                    if (_0x22711d['isCleaningUp'])
                        return;
                    const {
                        connection: _0x3f02c9,
                        lastDisconnect: _0x5cba87,
                        qr: _0x478ebb,
                        isNewLogin: _0x139b50
                    } = _0x23bae9;
                    if (_0x478ebb && !_0x22711d['qrGenerated'] && !_0x22711d['sessionCompleted']) {
                        await _0x581986(_0x478ebb);
                    }
                    if (_0x139b50) {
                        console['log']('🔐\x20New\x20login\x20via\x20QR\x20code');
                    }
                    if (_0x3f02c9 === 'open') {
                        console['log']('🔐\x20Connection\x20open');
                        if (_0x22711d['sessionSaved'] || _0x22711d['sessionCompleted'])
                            return;
                        if (_0x22711d['credsUpdated']) {
                            const _0x27f88c = await this['saveSessionData'](_0x22711d, _0x35c85d, _0x5143b4);
                            const _0x189c7d = Object['keys'](_0x35c85d['authState']['creds']['me'] || {})['length'] > 0x0 ? jidNormalizedUser(_0x35c85d['authState']['creds']['me']['id']) : null;
                            if (_0x189c7d) {
                                await delay(0x7d0);
                                const _0x5969f8 = await _0x35c85d['sendMessage'](_0x189c7d, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x27f88c + '`\x0a\x0a📌\x20SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE,DON\x27T\x20SHARE\x20IT!' });
                                await _0x35c85d['sendMessage'](_0x189c7d, { 'quoted': _0x5969f8 });
                            }
                        } else {
                            console['log']('⏳\x20Waiting\x20for\x20session\x20to\x20be\x20ready...');
                            await delay(0xbb8);
                            const _0xa06a77 = _0x22711d['sessionDir'] + '/creds.json';
                            if (_0x0_0x121d5e['existsSync'](_0xa06a77)) {
                                try {
                                    const _0x4726fc = await _0x0_0x121d5e['readFile'](_0xa06a77, 'utf-8');
                                    const _0x6c5b1a = JSON['parse'](_0x4726fc);
                                    if (_0x6c5b1a['me']?.['id']) {
                                        console['log']('✅\x20Session\x20found\x20via\x20file\x20check');
                                        const _0x9d837f = await this['saveSessionData'](_0x22711d, _0x35c85d, _0x5143b4);
                                        const _0x471d0b = Object['keys'](_0x35c85d['authState']['creds']['me'] || {})['length'] > 0x0 ? jidNormalizedUser(_0x35c85d['authState']['creds']['me']['id']) : null;
                                        if (_0x471d0b) {
                                            await delay(0x7d0);
                                            const _0x155ae3 = await _0x35c85d['sendMessage'](_0x471d0b, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x9d837f + '`\x0a\x0a📌\x20SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE,DON\x27T\x20SHARE\x20IT!' });
                                            await _0x35c85d['sendMessage'](_0x471d0b, { 'quoted': _0x155ae3 });
                                        }
                                    }
                                } catch (_0x4e623d) {
                                    console['log']('⚠️\x20File\x20check\x20failed:', _0x4e623d['message']);
                                }
                            }
                        }
                    }
                    if (_0x3f02c9 === 'close') {
                        console['log']('🔌\x20Connection\x20closed');
                        const _0x331410 = _0x5cba87?.['error']?.['output']?.['statusCode'];
                        if (_0x331410 === DisconnectReason['restartRequired']) {
                            console['log']('🔄\x20Restart\x20required\x20-\x20Baileys\x20will\x20reconnect\x20automatically');
                            return;
                        }
                        if (_0x22711d['sessionSaved'] || _0x22711d['sessionCompleted']) {
                            await this['cleanup'](_0x5143b4, 'session_complete');
                            return;
                        }
                        if (_0x331410 === DisconnectReason['loggedOut'] || _0x331410 === 0x191) {
                            await this['cleanup'](_0x5143b4, 'logged_out');
                            _0x190862(new Error('Invalid\x20QR\x20code\x20or\x20session\x20expired'));
                        } else {
                            if (_0x22711d['reconnectAttempts'] < MAX_RECONNECT_ATTEMPTS) {
                                _0x22711d['reconnectAttempts']++;
                                await delay(0x7d0);
                                await this['initiateQRSession'](_0x5143b4);
                            } else {
                                await this['cleanup'](_0x5143b4, 'max_reconnects');
                                _0x190862(new Error('Max\x20reconnection\x20attempts\x20reached'));
                            }
                        }
                    }
                });
                _0x22711d['timeoutHandle'] = setTimeout(async () => {
                    if (!_0x22711d['sessionCompleted'] && !_0x22711d['isCleaningUp']) {
                        await this['cleanup'](_0x5143b4, 'timeout');
                        _0x190862(new Error('Session\x20timeout'));
                    }
                }, SESSION_TIMEOUT);
            } catch (_0x58af0e) {
                console['error']('Error\x20initiating\x20QR\x20session:', _0x58af0e);
                _0x190862(_0x58af0e);
            }
        });
    }
    async ['initiatePairSession'](_0x5ac3cf) {
        const _0x2ca415 = this['sessions']['get'](_0x5ac3cf);
        if (!_0x2ca415)
            throw new Error('Session\x20not\x20found');
        return new Promise(async (_0x32d9dc, _0xbd83bb) => {
            try {
                const {version: _0x48b3e5} = await fetchLatestBaileysVersion();
                if (!await _0x0_0x121d5e['pathExists'](_0x2ca415['sessionDir'])) {
                    await _0x0_0x121d5e['mkdir'](_0x2ca415['sessionDir'], { 'recursive': !![] });
                }
                const {
                    state: _0x21c8fd,
                    saveCreds: _0x3e5414
                } = await useMultiFileAuthState(_0x2ca415['sessionDir']);
                _0x2ca415['currentSocket'] = makeWASocket({
                    'version': _0x48b3e5,
                    'logger': _0x0_0x3cfe4c({ 'level': 'silent' }),
                    'browser': Browsers['macOS']('Chrome'),
                    'auth': {
                        'creds': _0x21c8fd['creds'],
                        'keys': makeCacheableSignalKeyStore(_0x21c8fd['keys'], _0x0_0x3cfe4c({ 'level': 'fatal' })['child']({ 'level': 'fatal' }))
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
                const _0x5bf2a1 = _0x2ca415['currentSocket'];
                _0x5bf2a1['ev']['on']('connection.update', async _0x2b5903 => {
                    if (_0x2ca415['isCleaningUp'])
                        return;
                    const {
                        connection: _0x518463,
                        lastDisconnect: _0x12b40c,
                        isNewLogin: _0x4dd09b
                    } = _0x2b5903;
                    if (_0x518463 === 'open') {
                        if (_0x2ca415['sessionCompleted'])
                            return;
                        _0x2ca415['sessionCompleted'] = !![];
                        try {
                            const _0x4b0f99 = _0x2ca415['sessionDir'] + '/creds.json';
                            const _0x4cc1f9 = './session';
                            if (!await _0x0_0x121d5e['pathExists'](_0x4cc1f9)) {
                                await _0x0_0x121d5e['mkdir'](_0x4cc1f9, { 'recursive': !![] });
                            }
                            if (await _0x0_0x121d5e['pathExists'](_0x4b0f99)) {
                                await _0x0_0x121d5e['copy'](_0x2ca415['sessionDir'], _0x4cc1f9);
                                console['log']('✅\x20Session\x20credentials\x20saved\x20to\x20main\x20session\x20directory');
                            }
                            await delay(0xbb8);
                            if (_0x0_0x121d5e['existsSync'](_0x4b0f99)) {
                                const _0xbbfc20 = JSON['parse'](await _0x0_0x121d5e['readFile'](_0x4b0f99, 'utf-8'));
                                const _0x4ad318 = _0x2ca415['phoneNumber'] || Object['keys'](_0xbbfc20['me'] || {})[0x0]?.['split']('@')[0x0] || null;
                                const _0x50bb93 = await _0x0_0x5494db['saveSession'](_0xbbfc20, _0x4ad318);
                                console['log']('✅\x20Session\x20saved\x20to\x20database:\x20' + _0x50bb93);
                                const _0x1dc33a = Object['keys'](_0x5bf2a1['authState']['creds']['me'] || {})['length'] > 0x0 ? jidNormalizedUser(_0x5bf2a1['authState']['creds']['me']['id']) : jidNormalizedUser(_0x2ca415['phoneNumber'] + '@s.whatsapp.net');
                                if (_0x1dc33a) {
                                    await delay(0x7d0);
                                    const _0x354ecb = await _0x5bf2a1['sendMessage'](_0x1dc33a, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x50bb93 + '`\x0a\x0a📌\x20SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE,DON\x27T\x20SHARE\x20IT!' });
                                    await _0x5bf2a1['sendMessage'](_0x1dc33a, { 'quoted': _0x354ecb });
                                }
                            }
                        } catch (_0x4074fc) {
                            console['error']('Error\x20saving\x20session:', _0x4074fc);
                        } finally {
                            setTimeout(async () => {
                                await this['cleanup'](_0x5ac3cf, 'session_complete');
                            }, 0x2710);
                        }
                    }
                    if (_0x4dd09b)
                        console['log']('🔐\x20New\x20login\x20via\x20pair\x20code\x20for\x20' + _0x2ca415['phoneNumber']);
                    if (_0x518463 === 'close') {
                        if (_0x2ca415['sessionCompleted'] || _0x2ca415['isCleaningUp']) {
                            await this['cleanup'](_0x5ac3cf, 'already_complete');
                            return;
                        }
                        const _0x52d100 = _0x12b40c?.['error']?.['output']?.['statusCode'];
                        if (_0x52d100 === DisconnectReason['loggedOut'] || _0x52d100 === 0x191) {
                            await this['cleanup'](_0x5ac3cf, 'logged_out');
                            _0xbd83bb(new Error('Invalid\x20pairing\x20code\x20or\x20session\x20expired'));
                        } else if (_0x2ca415['pairingCodeSent'] && !_0x2ca415['sessionCompleted']) {
                            if (_0x2ca415['reconnectAttempts'] < MAX_RECONNECT_ATTEMPTS) {
                                _0x2ca415['reconnectAttempts']++;
                                await delay(0x7d0);
                                await this['initiatePairSession'](_0x5ac3cf);
                            } else {
                                await this['cleanup'](_0x5ac3cf, 'max_reconnects');
                                _0xbd83bb(new Error('Max\x20reconnection\x20attempts\x20reached'));
                            }
                        }
                    }
                });
                if (!_0x5bf2a1['authState']['creds']['registered'] && !_0x2ca415['pairingCodeSent'] && !_0x2ca415['isCleaningUp']) {
                    await delay(0x5dc);
                    try {
                        _0x2ca415['pairingCodeSent'] = !![];
                        let _0x5b2680 = await _0x5bf2a1['requestPairingCode'](_0x2ca415['phoneNumber']);
                        _0x5b2680 = _0x5b2680?.['match'](/.{1,4}/g)?.['join']('-') || _0x5b2680;
                        _0x32d9dc({
                            'type': 'pair',
                            'code': _0x5b2680,
                            'sessionId': _0x5ac3cf,
                            'phoneNumber': _0x2ca415['phoneNumber']
                        });
                    } catch (_0x141bef) {
                        _0x2ca415['pairingCodeSent'] = ![];
                        _0xbd83bb(new Error('Failed\x20to\x20get\x20pairing\x20code:\x20' + _0x141bef['message']));
                    }
                }
                _0x5bf2a1['ev']['on']('creds.update', _0x3e5414);
                _0x2ca415['timeoutHandle'] = setTimeout(async () => {
                    if (!_0x2ca415['sessionCompleted'] && !_0x2ca415['isCleaningUp']) {
                        await this['cleanup'](_0x5ac3cf, 'timeout');
                        _0xbd83bb(new Error('Pairing\x20timeout'));
                    }
                }, SESSION_TIMEOUT);
            } catch (_0x152bcf) {
                console['error']('Error\x20initiating\x20pair\x20session:', _0x152bcf);
                _0xbd83bb(_0x152bcf);
            }
        });
    }
    ['isSessionComplete'](_0x28ba84) {
        const _0x1d98ee = this['sessions']['get'](_0x28ba84);
        if (!_0x1d98ee)
            return ![];
        if (!_0x1d98ee['sessionCompleted'])
            return ![];
        try {
            const _0x5ce1db = _0x1d98ee['sessionDir'] + '/creds.json';
            const _0x5d510f = './session/creds.json';
            let _0x55f0a0 = _0x0_0x121d5e['existsSync'](_0x5d510f) ? _0x5d510f : _0x0_0x121d5e['existsSync'](_0x5ce1db) ? _0x5ce1db : null;
            if (_0x55f0a0) {
                const _0x2371f7 = JSON['parse'](_0x0_0x121d5e['readFileSync'](_0x55f0a0, 'utf-8'));
                return _0x2371f7['registered'] === !![] && !!_0x2371f7['me']?.['id'];
            }
        } catch (_0x57930a) {
            console['error']('Error\x20verifying\x20physical\x20creds\x20in\x20isSessionComplete:', _0x57930a);
            return ![];
        }
        return ![];
    }
}
export default new PairingManager();