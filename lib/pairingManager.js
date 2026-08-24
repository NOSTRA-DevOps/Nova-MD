import _0x0_0x1af95d from 'fs-extra';
import _0x0_0xb26ee4 from 'pino';
import _0x0_0x1cd1c from 'qrcode';
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
import _0x0_0x5d6509 from 'awesome-phonenumber';
import _0x0_0x5ca72d from './sessionManager.js';
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
        const _0x174a0d = Date['now']()['toString']() + Math['random']()['toString'](0x24)['substring'](0x2, 0x9);
        const _0xa75f96 = './temp_session_' + _0x174a0d;
        const _0xbeb1b3 = {
            'sessionId': _0x174a0d,
            'sessionDir': _0xa75f96,
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
        this['sessions']['set'](_0x174a0d, _0xbeb1b3);
        return _0x174a0d;
    }
    async ['createPairSession'](_0xbcca98) {
        if (!_0xbcca98)
            throw new Error('Phone\x20number\x20is\x20required');
        _0xbcca98 = _0xbcca98['replace'](/[^0-9]/g, '');
        const _0x2393ff = _0x0_0x5d6509('+' + _0xbcca98);
        if (!_0x2393ff['isValid']())
            throw new Error('Invalid\x20phone\x20number');
        _0xbcca98 = _0x2393ff['getNumber']('e164')['replace']('+', '');
        const _0x3fa7ce = Date['now']()['toString']() + Math['random']()['toString'](0x24)['substring'](0x2, 0x9);
        const _0x69ac1c = './temp_session_' + _0x3fa7ce;
        const _0x1ef4db = {
            'sessionId': _0x3fa7ce,
            'sessionDir': _0x69ac1c,
            'phoneNumber': _0xbcca98,
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
        this['sessions']['set'](_0x3fa7ce, _0x1ef4db);
        return _0x3fa7ce;
    }
    async ['removeSessionDir'](_0xcba488) {
        try {
            if (await _0x0_0x1af95d['pathExists'](_0xcba488)) {
                await _0x0_0x1af95d['remove'](_0xcba488);
                return !![];
            }
        } catch (_0x2862e9) {
            console['error']('Error\x20removing\x20session\x20dir:', _0x2862e9);
        }
        return ![];
    }
    async ['cleanupSessions']() {
        const _0x19e2c8 = Date['now']();
        const _0x5b53dd = [];
        for (const [_0x52f7d9, _0x3fb7b4] of this['sessions']['entries']()) {
            if (_0x19e2c8 - _0x3fb7b4['createdAt'] > SESSION_TIMEOUT) {
                _0x5b53dd['push'](_0x52f7d9);
            }
        }
        for (const _0x407619 of _0x5b53dd) {
            const _0x5e4620 = this['sessions']['get'](_0x407619);
            await this['cleanup'](_0x407619, 'session_expired');
        }
    }
    async ['cleanup'](_0x378497, _0x3bd3d6 = 'unknown') {
        const _0x285eb6 = this['sessions']['get'](_0x378497);
        if (!_0x285eb6)
            return;
        if (_0x285eb6['isCleaningUp'])
            return;
        console['log']('🧹\x20Cleanup\x20session\x20' + _0x378497 + '\x20-\x20' + _0x3bd3d6);
        if (_0x3bd3d6 === 'session_complete' || _0x285eb6['sessionCompleted']) {
            if (_0x285eb6['timeoutHandle']) {
                clearTimeout(_0x285eb6['timeoutHandle']);
                _0x285eb6['timeoutHandle'] = null;
            }
            this['sessions']['delete'](_0x378497);
            console['log']('✅\x20Socket\x20handed\x20over\x20to\x20index.js\x20successfully.');
            return;
        }
        _0x285eb6['isCleaningUp'] = !![];
        if (_0x285eb6['timeoutHandle']) {
            clearTimeout(_0x285eb6['timeoutHandle']);
            _0x285eb6['timeoutHandle'] = null;
        }
        if (_0x285eb6['currentSocket']) {
            try {
                _0x285eb6['currentSocket']['ev']['removeAllListeners']();
                await _0x285eb6['currentSocket']['end']();
            } catch (_0x5b93a1) {
            }
            _0x285eb6['currentSocket'] = null;
        }
        setTimeout(async () => {
            await this['removeSessionDir'](_0x285eb6['sessionDir']);
            this['sessions']['delete'](_0x378497);
        }, 0x1388);
    }
    async ['saveSessionData'](_0x417d34, _0xb57c7d, _0x2ce806) {
        if (this['sessionSaveInProgress']['get'](_0x2ce806)) {
            console['log']('⏳\x20Session\x20save\x20already\x20in\x20progress...');
            return;
        }
        this['sessionSaveInProgress']['set'](_0x2ce806, !![]);
        try {
            const _0x203bf7 = _0x417d34['sessionDir'] + '/creds.json';
            const _0x45d4c0 = './session';
            if (!_0x0_0x1af95d['existsSync'](_0x203bf7)) {
                console['log']('❌\x20No\x20credentials\x20file\x20found');
                this['sessionSaveInProgress']['delete'](_0x2ce806);
                return;
            }
            const _0x2cf842 = await _0x0_0x1af95d['readFile'](_0x203bf7, 'utf-8');
            const _0x5685a8 = JSON['parse'](_0x2cf842);
            if (!_0x5685a8['me']?.['id']) {
                console['log']('⚠️\x20Session\x20not\x20valid\x20(no\x20me.id)');
                this['sessionSaveInProgress']['delete'](_0x2ce806);
                return;
            }
            console['log']('✅\x20Session\x20valid:\x20me.id\x20=\x20' + _0x5685a8['me']['id']);
            if (!_0x5685a8['registered']) {
                _0x5685a8['registered'] = !![];
                _0x0_0x1af95d['writeFileSync'](_0x203bf7, JSON['stringify'](_0x5685a8, null, 0x2));
                console['log']('🔧\x20Forced\x20registered:\x20true');
            }
            if (!await _0x0_0x1af95d['pathExists'](_0x45d4c0)) {
                await _0x0_0x1af95d['mkdir'](_0x45d4c0, { 'recursive': !![] });
            }
            await _0x0_0x1af95d['copy'](_0x417d34['sessionDir'], _0x45d4c0);
            console['log']('✅\x20Session\x20credentials\x20saved\x20to\x20main\x20session\x20directory');
            let _0x99ce29 = _0x417d34['phoneNumber'] || null;
            if (!_0x99ce29 && _0x5685a8['me']?.['id']) {
                _0x99ce29 = _0x5685a8['me']['id']['split'](':')[0x0];
            }
            const _0x42d050 = await _0x0_0x5ca72d['saveSession'](_0x5685a8, _0x99ce29);
            console['log']('✅\x20Session\x20saved\x20to\x20database:\x20' + _0x42d050);
            const _0x393b17 = _0xb57c7d['authState']['creds']['me']?.['id'] ? jidNormalizedUser(_0xb57c7d['authState']['creds']['me']['id']) : jidNormalizedUser(_0x417d34['phoneNumber'] + '@s.whatsapp.net');
            if (_0x393b17) {
                const _0x4fe755 = await _0xb57c7d['sendMessage'](_0x393b17, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x42d050 + '`\x0a\x0a📌\x20*SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE\x20DON\x27T\x20SHARE\x20IT*\x20✅' });
                await _0xb57c7d['sendMessage'](_0x393b17, {
                    'text': MESSAGE,
                    'quoted': _0x4fe755
                });
                console['log']('✅\x20Success\x20message\x20sent');
            }
            _0x417d34['sessionCompleted'] = !![];
            _0x417d34['sessionSaved'] = !![];
            setTimeout(async () => {
                await this['cleanup'](_0x2ce806, 'session_complete');
            }, 0x1388);
        } catch (_0x5dc235) {
            console['error']('❌\x20Error\x20saving\x20session:', _0x5dc235);
        } finally {
            this['sessionSaveInProgress']['delete'](_0x2ce806);
        }
    }
    async ['initiateQRSession'](_0x42df38) {
        const _0xc08880 = this['sessions']['get'](_0x42df38);
        if (!_0xc08880)
            throw new Error('Session\x20not\x20found');
        return new Promise(async (_0xb6661f, _0x4c3a53) => {
            try {
                const {version: _0x17e5e3} = await fetchLatestBaileysVersion();
                if (!await _0x0_0x1af95d['pathExists'](_0xc08880['sessionDir'])) {
                    await _0x0_0x1af95d['mkdir'](_0xc08880['sessionDir'], { 'recursive': !![] });
                }
                const {
                    state: _0x548d29,
                    saveCreds: _0x2d6b08
                } = await useMultiFileAuthState(_0xc08880['sessionDir']);
                _0xc08880['currentSocket'] = makeWASocket({
                    'version': _0x17e5e3,
                    'logger': _0x0_0xb26ee4({ 'level': 'silent' }),
                    'browser': Browsers['macOS']('Chrome'),
                    'auth': {
                        'creds': _0x548d29['creds'],
                        'keys': makeCacheableSignalKeyStore(_0x548d29['keys'], _0x0_0xb26ee4({ 'level': 'fatal' })['child']({ 'level': 'fatal' }))
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
                const _0x3e6c4f = _0xc08880['currentSocket'];
                _0x3e6c4f['ev']['on']('creds.update', async _0x1fca6d => {
                    console['log']('🔄\x20creds.update\x20triggered');
                    await _0x2d6b08();
                    if (_0x1fca6d['me']?.['id']) {
                        console['log']('✅\x20Session\x20valid\x20via\x20creds.update:\x20' + _0x1fca6d['me']['id']);
                        _0xc08880['credsUpdated'] = !![];
                        if (!_0x1fca6d['registered']) {
                            _0x1fca6d['registered'] = !![];
                            await _0x2d6b08();
                            console['log']('🔧\x20Forced\x20registered:\x20true\x20via\x20creds.update');
                        }
                        if (!_0xc08880['sessionSaved'] && !_0xc08880['sessionCompleted']) {
                            await this['saveSessionData'](_0xc08880, _0x3e6c4f, _0x42df38);
                        }
                    }
                });
                const _0x2bc0a7 = async _0xb69ce8 => {
                    if (_0xc08880['qrGenerated'] || _0xc08880['sessionCompleted'] || _0xc08880['isCleaningUp'])
                        return;
                    _0xc08880['qrGenerated'] = !![];
                    try {
                        const _0xcfcc70 = await _0x0_0x1cd1c['toDataURL'](_0xb69ce8, { 'errorCorrectionLevel': 'M' });
                        _0xb6661f({
                            'type': 'qr',
                            'qr': _0xcfcc70,
                            'sessionId': _0x42df38
                        });
                    } catch (_0x2f9139) {
                        console['error']('Error\x20generating\x20QR\x20code:', _0x2f9139);
                        _0x4c3a53(_0x2f9139);
                    }
                };
                _0x3e6c4f['ev']['on']('connection.update', async _0x544fe5 => {
                    if (_0xc08880['isCleaningUp'])
                        return;
                    const {
                        connection: _0x46738c,
                        lastDisconnect: _0x365e3b,
                        qr: _0x5ced3b,
                        isNewLogin: _0x262602
                    } = _0x544fe5;
                    if (_0x5ced3b && !_0xc08880['qrGenerated'] && !_0xc08880['sessionCompleted']) {
                        await _0x2bc0a7(_0x5ced3b);
                    }
                    if (_0x262602) {
                        console['log']('🔐\x20New\x20login\x20via\x20QR\x20code');
                    }
                    if (_0x46738c === 'open') {
                        console['log']('🔐\x20Connection\x20open');
                        if (_0xc08880['sessionSaved'] || _0xc08880['sessionCompleted'])
                            return;
                        if (_0xc08880['credsUpdated']) {
                            const _0x3349d4 = await this['saveSessionData'](_0xc08880, _0x3e6c4f, _0x42df38);
                            const _0x5bc3f4 = Object['keys'](_0x3e6c4f['authState']['creds']['me'] || {})['length'] > 0x0 ? jidNormalizedUser(_0x3e6c4f['authState']['creds']['me']['id']) : null;
                            if (_0x5bc3f4) {
                                await delay(0x7d0);
                                const _0xb9277b = await _0x3e6c4f['sendMessage'](_0x5bc3f4, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x3349d4 + '`\x0a\x0a📌\x20SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE,DON\x27T\x20SHARE\x20IT!' });
                                await _0x3e6c4f['sendMessage'](_0x5bc3f4, { 'quoted': _0xb9277b });
                            }
                        } else {
                            console['log']('⏳\x20Waiting\x20for\x20session\x20to\x20be\x20ready...');
                            await delay(0xbb8);
                            const _0x24d1ac = _0xc08880['sessionDir'] + '/creds.json';
                            if (_0x0_0x1af95d['existsSync'](_0x24d1ac)) {
                                try {
                                    const _0x16aa91 = await _0x0_0x1af95d['readFile'](_0x24d1ac, 'utf-8');
                                    const _0x144798 = JSON['parse'](_0x16aa91);
                                    if (_0x144798['me']?.['id']) {
                                        console['log']('✅\x20Session\x20found\x20via\x20file\x20check');
                                        const _0x920d9f = await this['saveSessionData'](_0xc08880, _0x3e6c4f, _0x42df38);
                                        const _0x212521 = Object['keys'](_0x3e6c4f['authState']['creds']['me'] || {})['length'] > 0x0 ? jidNormalizedUser(_0x3e6c4f['authState']['creds']['me']['id']) : null;
                                        if (_0x212521) {
                                            await delay(0x7d0);
                                            const _0x3e834c = await _0x3e6c4f['sendMessage'](_0x212521, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x920d9f + '`\x0a\x0a📌\x20SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE,DON\x27T\x20SHARE\x20IT!' });
                                            await _0x3e6c4f['sendMessage'](_0x212521, { 'quoted': _0x3e834c });
                                        }
                                    }
                                } catch (_0x5b8825) {
                                    console['log']('⚠️\x20File\x20check\x20failed:', _0x5b8825['message']);
                                }
                            }
                        }
                    }
                    if (_0x46738c === 'close') {
                        console['log']('🔌\x20Connection\x20closed');
                        const _0x1c1074 = _0x365e3b?.['error']?.['output']?.['statusCode'];
                        if (_0x1c1074 === DisconnectReason['restartRequired']) {
                            console['log']('🔄\x20Restart\x20required\x20-\x20Baileys\x20will\x20reconnect\x20automatically');
                            return;
                        }
                        if (_0xc08880['sessionSaved'] || _0xc08880['sessionCompleted']) {
                            await this['cleanup'](_0x42df38, 'session_complete');
                            return;
                        }
                        if (_0x1c1074 === DisconnectReason['loggedOut'] || _0x1c1074 === 0x191) {
                            await this['cleanup'](_0x42df38, 'logged_out');
                            _0x4c3a53(new Error('Invalid\x20QR\x20code\x20or\x20session\x20expired'));
                        } else {
                            if (_0xc08880['reconnectAttempts'] < MAX_RECONNECT_ATTEMPTS) {
                                _0xc08880['reconnectAttempts']++;
                                await delay(0x7d0);
                                await this['initiateQRSession'](_0x42df38);
                            } else {
                                await this['cleanup'](_0x42df38, 'max_reconnects');
                                _0x4c3a53(new Error('Max\x20reconnection\x20attempts\x20reached'));
                            }
                        }
                    }
                });
                _0xc08880['timeoutHandle'] = setTimeout(async () => {
                    if (!_0xc08880['sessionCompleted'] && !_0xc08880['isCleaningUp']) {
                        await this['cleanup'](_0x42df38, 'timeout');
                        _0x4c3a53(new Error('Session\x20timeout'));
                    }
                }, SESSION_TIMEOUT);
            } catch (_0x2afd45) {
                console['error']('Error\x20initiating\x20QR\x20session:', _0x2afd45);
                _0x4c3a53(_0x2afd45);
            }
        });
    }
    async ['initiatePairSession'](_0x502f97) {
        const _0x43d164 = this['sessions']['get'](_0x502f97);
        if (!_0x43d164)
            throw new Error('Session\x20not\x20found');
        return new Promise(async (_0x3d5708, _0x4e5089) => {
            try {
                const {version: _0x30c509} = await fetchLatestBaileysVersion();
                if (!await _0x0_0x1af95d['pathExists'](_0x43d164['sessionDir'])) {
                    await _0x0_0x1af95d['mkdir'](_0x43d164['sessionDir'], { 'recursive': !![] });
                }
                const {
                    state: _0x2f09c2,
                    saveCreds: _0x429748
                } = await useMultiFileAuthState(_0x43d164['sessionDir']);
                _0x43d164['currentSocket'] = makeWASocket({
                    'version': _0x30c509,
                    'logger': _0x0_0xb26ee4({ 'level': 'silent' }),
                    'browser': Browsers['macOS']('Chrome'),
                    'auth': {
                        'creds': _0x2f09c2['creds'],
                        'keys': makeCacheableSignalKeyStore(_0x2f09c2['keys'], _0x0_0xb26ee4({ 'level': 'fatal' })['child']({ 'level': 'fatal' }))
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
                const _0x357117 = _0x43d164['currentSocket'];
                _0x357117['ev']['on']('connection.update', async _0xc1fd63 => {
                    if (_0x43d164['isCleaningUp'])
                        return;
                    const {
                        connection: _0x2d83de,
                        lastDisconnect: _0x203abe,
                        isNewLogin: _0x87a47e
                    } = _0xc1fd63;
                    if (_0x2d83de === 'open') {
                        if (_0x43d164['sessionCompleted'])
                            return;
                        _0x43d164['sessionCompleted'] = !![];
                        try {
                            const _0x417c99 = _0x43d164['sessionDir'] + '/creds.json';
                            const _0xe5f8b3 = './session';
                            if (!await _0x0_0x1af95d['pathExists'](_0xe5f8b3)) {
                                await _0x0_0x1af95d['mkdir'](_0xe5f8b3, { 'recursive': !![] });
                            }
                            if (await _0x0_0x1af95d['pathExists'](_0x417c99)) {
                                await _0x0_0x1af95d['copy'](_0x43d164['sessionDir'], _0xe5f8b3);
                                console['log']('✅\x20Session\x20credentials\x20saved\x20to\x20main\x20session\x20directory');
                            }
                            await delay(0xbb8);
                            if (_0x0_0x1af95d['existsSync'](_0x417c99)) {
                                const _0x62da15 = JSON['parse'](await _0x0_0x1af95d['readFile'](_0x417c99, 'utf-8'));
                                const _0x2b4a4e = _0x43d164['phoneNumber'] || Object['keys'](_0x62da15['me'] || {})[0x0]?.['split']('@')[0x0] || null;
                                const _0x31f20c = await _0x0_0x5ca72d['saveSession'](_0x62da15, _0x2b4a4e);
                                console['log']('✅\x20Session\x20saved\x20to\x20database:\x20' + _0x31f20c);
                                const _0xe25308 = Object['keys'](_0x357117['authState']['creds']['me'] || {})['length'] > 0x0 ? jidNormalizedUser(_0x357117['authState']['creds']['me']['id']) : jidNormalizedUser(_0x43d164['phoneNumber'] + '@s.whatsapp.net');
                                if (_0xe25308) {
                                    await delay(0x7d0);
                                    const _0x548ee7 = await _0x357117['sendMessage'](_0xe25308, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x31f20c + '`\x0a\x0a📌\x20SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE,DON\x27T\x20SHARE\x20IT!' });
                                    await _0x357117['sendMessage'](_0xe25308, { 'quoted': _0x548ee7 });
                                }
                            }
                        } catch (_0x5e5569) {
                            console['error']('Error\x20saving\x20session:', _0x5e5569);
                        } finally {
                            setTimeout(async () => {
                                await this['cleanup'](_0x502f97, 'session_complete');
                            }, 0x2710);
                        }
                    }
                    if (_0x87a47e)
                        console['log']('🔐\x20New\x20login\x20via\x20pair\x20code\x20for\x20' + _0x43d164['phoneNumber']);
                    if (_0x2d83de === 'close') {
                        if (_0x43d164['sessionCompleted'] || _0x43d164['isCleaningUp']) {
                            await this['cleanup'](_0x502f97, 'already_complete');
                            return;
                        }
                        const _0x4446d1 = _0x203abe?.['error']?.['output']?.['statusCode'];
                        if (_0x4446d1 === DisconnectReason['loggedOut'] || _0x4446d1 === 0x191) {
                            await this['cleanup'](_0x502f97, 'logged_out');
                            _0x4e5089(new Error('Invalid\x20pairing\x20code\x20or\x20session\x20expired'));
                        } else if (_0x43d164['pairingCodeSent'] && !_0x43d164['sessionCompleted']) {
                            if (_0x43d164['reconnectAttempts'] < MAX_RECONNECT_ATTEMPTS) {
                                _0x43d164['reconnectAttempts']++;
                                await delay(0x7d0);
                                await this['initiatePairSession'](_0x502f97);
                            } else {
                                await this['cleanup'](_0x502f97, 'max_reconnects');
                                _0x4e5089(new Error('Max\x20reconnection\x20attempts\x20reached'));
                            }
                        }
                    }
                });
                if (!_0x357117['authState']['creds']['registered'] && !_0x43d164['pairingCodeSent'] && !_0x43d164['isCleaningUp']) {
                    await delay(0x5dc);
                    try {
                        _0x43d164['pairingCodeSent'] = !![];
                        let _0xb83ab4 = await _0x357117['requestPairingCode'](_0x43d164['phoneNumber']);
                        _0xb83ab4 = _0xb83ab4?.['match'](/.{1,4}/g)?.['join']('-') || _0xb83ab4;
                        _0x3d5708({
                            'type': 'pair',
                            'code': _0xb83ab4,
                            'sessionId': _0x502f97,
                            'phoneNumber': _0x43d164['phoneNumber']
                        });
                    } catch (_0x3ccb7d) {
                        _0x43d164['pairingCodeSent'] = ![];
                        _0x4e5089(new Error('Failed\x20to\x20get\x20pairing\x20code:\x20' + _0x3ccb7d['message']));
                    }
                }
                _0x357117['ev']['on']('creds.update', _0x429748);
                _0x43d164['timeoutHandle'] = setTimeout(async () => {
                    if (!_0x43d164['sessionCompleted'] && !_0x43d164['isCleaningUp']) {
                        await this['cleanup'](_0x502f97, 'timeout');
                        _0x4e5089(new Error('Pairing\x20timeout'));
                    }
                }, SESSION_TIMEOUT);
            } catch (_0x385c13) {
                console['error']('Error\x20initiating\x20pair\x20session:', _0x385c13);
                _0x4e5089(_0x385c13);
            }
        });
    }
    ['isSessionComplete'](_0x1a272e) {
        const _0x162462 = this['sessions']['get'](_0x1a272e);
        if (!_0x162462)
            return ![];
        if (!_0x162462['sessionCompleted'])
            return ![];
        try {
            const _0x13128b = _0x162462['sessionDir'] + '/creds.json';
            const _0x5e3837 = './session/creds.json';
            let _0x134874 = _0x0_0x1af95d['existsSync'](_0x5e3837) ? _0x5e3837 : _0x0_0x1af95d['existsSync'](_0x13128b) ? _0x13128b : null;
            if (_0x134874) {
                const _0x5020d2 = JSON['parse'](_0x0_0x1af95d['readFileSync'](_0x134874, 'utf-8'));
                return _0x5020d2['registered'] === !![] && !!_0x5020d2['me']?.['id'];
            }
        } catch (_0x35de53) {
            console['error']('Error\x20verifying\x20physical\x20creds\x20in\x20isSessionComplete:', _0x35de53);
            return ![];
        }
        return ![];
    }
}
export default new PairingManager();