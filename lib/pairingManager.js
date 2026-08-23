import _0x0_0x50bcaf from 'fs-extra';
import _0x0_0x4c612b from 'pino';
import _0x0_0x1422a0 from 'qrcode';
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
import _0x0_0x41d84d from 'awesome-phonenumber';
import _0x0_0x105497 from './sessionManager.js';
const MAX_RECONNECT_ATTEMPTS = 0x3;
const SESSION_TIMEOUT = 0x5 * 0x3c * 0x3e8;
const MESSAGE = '\x0a*LOGIN\x20SUCCESSFULL*\x20✅\x0a\x0a*Gɪᴠᴇ\x20ᴀ\x20ꜱᴛᴀʀ\x20ᴛᴏ\x20ʀᴇᴘᴏ\x20ꜰᴏʀ\x20ᴄᴏᴜʀᴀɢᴇ*\x20🌟\x0ahttps://github.com/NOVA-X-Code/Nova-MD\x0a\x0a*Sᴜᴘᴘᴏʀᴛ\x20Gʀᴏᴜᴘ\x20ꜰᴏʀ\x20ϙᴜᴇʀʏ*\x20💭\x0ahttps://t.me/Nostra_DigitalCenter\x0ahttps://t.me/LaboKingFreeSurf\x0ahttps://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y\x0a\x0a*NOSTRA\x20COMMUNITY*\x0ahttps://chat.whatsapp.com/LUkXjJNfWrT8Fz7akxosH0\x0a*Yᴏᴜ-ᴛᴜʙᴇ\x20ᴛᴜᴛᴏʀɪᴀʟꜱ*\x20🪄\x20\x0ahttps://youtube.com/@LaboKingFreeSurf\x0a\x0a*NOVA-MD--WHATSAPP*\x20🥀\x0a';
class PairingManager {
    constructor() {
        this['sessions'] = new Map();
        this['cleanupInterval'] = setInterval(() => this['cleanupSessions'](), 0xea60);
        this['sessionSaveInProgress'] = new Map();
    }
    async ['createQRSession']() {
        const _0x121822 = Date['now']()['toString']() + Math['random']()['toString'](0x24)['substring'](0x2, 0x9);
        const _0x36d30d = './temp_session_' + _0x121822;
        const _0x85bde6 = {
            'sessionId': _0x121822,
            'sessionDir': _0x36d30d,
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
        this['sessions']['set'](_0x121822, _0x85bde6);
        return _0x121822;
    }
    async ['createPairSession'](_0x1f51f1) {
        if (!_0x1f51f1)
            throw new Error('Phone\x20number\x20is\x20required');
        _0x1f51f1 = _0x1f51f1['replace'](/[^0-9]/g, '');
        const _0x4b3490 = _0x0_0x41d84d('+' + _0x1f51f1);
        if (!_0x4b3490['isValid']())
            throw new Error('Invalid\x20phone\x20number');
        _0x1f51f1 = _0x4b3490['getNumber']('e164')['replace']('+', '');
        const _0x16bf54 = Date['now']()['toString']() + Math['random']()['toString'](0x24)['substring'](0x2, 0x9);
        const _0x228f26 = './temp_session_' + _0x16bf54;
        const _0x4e331f = {
            'sessionId': _0x16bf54,
            'sessionDir': _0x228f26,
            'phoneNumber': _0x1f51f1,
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
        this['sessions']['set'](_0x16bf54, _0x4e331f);
        return _0x16bf54;
    }
    async ['removeSessionDir'](_0x55443d) {
        try {
            if (await _0x0_0x50bcaf['pathExists'](_0x55443d)) {
                await _0x0_0x50bcaf['remove'](_0x55443d);
                return !![];
            }
        } catch (_0x4c1c78) {
            console['error']('Error\x20removing\x20session\x20dir:', _0x4c1c78);
        }
        return ![];
    }
    async ['cleanupSessions']() {
        const _0x20a744 = Date['now']();
        const _0x347ebb = [];
        for (const [_0x53ad3e, _0x5ebf0a] of this['sessions']['entries']()) {
            if (_0x20a744 - _0x5ebf0a['createdAt'] > SESSION_TIMEOUT) {
                _0x347ebb['push'](_0x53ad3e);
            }
        }
        for (const _0x19f927 of _0x347ebb) {
            const _0x4d25b8 = this['sessions']['get'](_0x19f927);
            await this['cleanup'](_0x19f927, 'session_expired');
        }
    }
    async ['cleanup'](_0x1ecc9a, _0x19bb25 = 'unknown') {
        const _0x192737 = this['sessions']['get'](_0x1ecc9a);
        if (!_0x192737)
            return;
        if (_0x192737['isCleaningUp'])
            return;
        console['log']('🧹\x20Cleanup\x20session\x20' + _0x1ecc9a + '\x20-\x20' + _0x19bb25);
        if (_0x19bb25 === 'session_complete' || _0x192737['sessionCompleted']) {
            if (_0x192737['timeoutHandle']) {
                clearTimeout(_0x192737['timeoutHandle']);
                _0x192737['timeoutHandle'] = null;
            }
            this['sessions']['delete'](_0x1ecc9a);
            console['log']('✅\x20Socket\x20handed\x20over\x20to\x20index.js\x20successfully.');
            return;
        }
        _0x192737['isCleaningUp'] = !![];
        if (_0x192737['timeoutHandle']) {
            clearTimeout(_0x192737['timeoutHandle']);
            _0x192737['timeoutHandle'] = null;
        }
        if (_0x192737['currentSocket']) {
            try {
                _0x192737['currentSocket']['ev']['removeAllListeners']();
                await _0x192737['currentSocket']['end']();
            } catch (_0x2680d1) {
            }
            _0x192737['currentSocket'] = null;
        }
        setTimeout(async () => {
            await this['removeSessionDir'](_0x192737['sessionDir']);
            this['sessions']['delete'](_0x1ecc9a);
        }, 0x1388);
    }
    async ['saveSessionData'](_0x56059c, _0x263de4, _0x1fe805) {
        if (this['sessionSaveInProgress']['get'](_0x1fe805)) {
            console['log']('⏳\x20Session\x20save\x20already\x20in\x20progress...');
            return;
        }
        this['sessionSaveInProgress']['set'](_0x1fe805, !![]);
        try {
            const _0x501f2d = _0x56059c['sessionDir'] + '/creds.json';
            const _0x1a5105 = './session';
            if (!_0x0_0x50bcaf['existsSync'](_0x501f2d)) {
                console['log']('❌\x20No\x20credentials\x20file\x20found');
                this['sessionSaveInProgress']['delete'](_0x1fe805);
                return;
            }
            const _0x208526 = await _0x0_0x50bcaf['readFile'](_0x501f2d, 'utf-8');
            const _0x52f0f4 = JSON['parse'](_0x208526);
            if (!_0x52f0f4['me']?.['id']) {
                console['log']('⚠️\x20Session\x20not\x20valid\x20(no\x20me.id)');
                this['sessionSaveInProgress']['delete'](_0x1fe805);
                return;
            }
            console['log']('✅\x20Session\x20valid:\x20me.id\x20=\x20' + _0x52f0f4['me']['id']);
            if (!_0x52f0f4['registered']) {
                _0x52f0f4['registered'] = !![];
                _0x0_0x50bcaf['writeFileSync'](_0x501f2d, JSON['stringify'](_0x52f0f4, null, 0x2));
                console['log']('🔧\x20Forced\x20registered:\x20true');
            }
            if (!await _0x0_0x50bcaf['pathExists'](_0x1a5105)) {
                await _0x0_0x50bcaf['mkdir'](_0x1a5105, { 'recursive': !![] });
            }
            await _0x0_0x50bcaf['copy'](_0x56059c['sessionDir'], _0x1a5105);
            console['log']('✅\x20Session\x20credentials\x20saved\x20to\x20main\x20session\x20directory');
            let _0x39a776 = _0x56059c['phoneNumber'] || null;
            if (!_0x39a776 && _0x52f0f4['me']?.['id']) {
                _0x39a776 = _0x52f0f4['me']['id']['split'](':')[0x0];
            }
            const _0x448e80 = await _0x0_0x105497['saveSession'](_0x52f0f4, _0x39a776);
            console['log']('✅\x20Session\x20saved\x20to\x20database:\x20' + _0x448e80);
            const _0x446724 = _0x263de4['authState']['creds']['me']?.['id'] ? jidNormalizedUser(_0x263de4['authState']['creds']['me']['id']) : jidNormalizedUser(_0x56059c['phoneNumber'] + '@s.whatsapp.net');
            if (_0x446724) {
                const _0x4cb0d2 = await _0x263de4['sendMessage'](_0x446724, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x448e80 + '`\x0a\x0a📌\x20*SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE\x20DON\x27T\x20SHARE\x20IT*\x20✅' });
                await _0x263de4['sendMessage'](_0x446724, {
                    'text': MESSAGE,
                    'quoted': _0x4cb0d2
                });
                console['log']('✅\x20Success\x20message\x20sent');
            }
            _0x56059c['sessionCompleted'] = !![];
            _0x56059c['sessionSaved'] = !![];
            setTimeout(async () => {
                await this['cleanup'](_0x1fe805, 'session_complete');
            }, 0x1388);
        } catch (_0xa693aa) {
            console['error']('❌\x20Error\x20saving\x20session:', _0xa693aa);
        } finally {
            this['sessionSaveInProgress']['delete'](_0x1fe805);
        }
    }
    async ['initiateQRSession'](_0x361ab3) {
        const _0x31b04b = this['sessions']['get'](_0x361ab3);
        if (!_0x31b04b)
            throw new Error('Session\x20not\x20found');
        return new Promise(async (_0xbe51c2, _0x174978) => {
            try {
                const {version: _0xc4b79a} = await fetchLatestBaileysVersion();
                if (!await _0x0_0x50bcaf['pathExists'](_0x31b04b['sessionDir'])) {
                    await _0x0_0x50bcaf['mkdir'](_0x31b04b['sessionDir'], { 'recursive': !![] });
                }
                const {
                    state: _0x44a10e,
                    saveCreds: _0xb6282c
                } = await useMultiFileAuthState(_0x31b04b['sessionDir']);
                _0x31b04b['currentSocket'] = makeWASocket({
                    'version': _0xc4b79a,
                    'logger': _0x0_0x4c612b({ 'level': 'silent' }),
                    'browser': Browsers['macOS']('Chrome'),
                    'auth': {
                        'creds': _0x44a10e['creds'],
                        'keys': makeCacheableSignalKeyStore(_0x44a10e['keys'], _0x0_0x4c612b({ 'level': 'fatal' })['child']({ 'level': 'fatal' }))
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
                const _0x1da298 = _0x31b04b['currentSocket'];
                _0x1da298['ev']['on']('creds.update', async _0x23377c => {
                    console['log']('🔄\x20creds.update\x20triggered');
                    await _0xb6282c();
                    if (_0x23377c['me']?.['id']) {
                        console['log']('✅\x20Session\x20valid\x20via\x20creds.update:\x20' + _0x23377c['me']['id']);
                        _0x31b04b['credsUpdated'] = !![];
                        if (!_0x23377c['registered']) {
                            _0x23377c['registered'] = !![];
                            await _0xb6282c();
                            console['log']('🔧\x20Forced\x20registered:\x20true\x20via\x20creds.update');
                        }
                        if (!_0x31b04b['sessionSaved'] && !_0x31b04b['sessionCompleted']) {
                            await this['saveSessionData'](_0x31b04b, _0x1da298, _0x361ab3);
                        }
                    }
                });
                const _0x4d803a = async _0xc0f42e => {
                    if (_0x31b04b['qrGenerated'] || _0x31b04b['sessionCompleted'] || _0x31b04b['isCleaningUp'])
                        return;
                    _0x31b04b['qrGenerated'] = !![];
                    try {
                        const _0x528d7e = await _0x0_0x1422a0['toDataURL'](_0xc0f42e, { 'errorCorrectionLevel': 'M' });
                        _0xbe51c2({
                            'type': 'qr',
                            'qr': _0x528d7e,
                            'sessionId': _0x361ab3
                        });
                    } catch (_0x2603d7) {
                        console['error']('Error\x20generating\x20QR\x20code:', _0x2603d7);
                        _0x174978(_0x2603d7);
                    }
                };
                _0x1da298['ev']['on']('connection.update', async _0x2347b3 => {
                    if (_0x31b04b['isCleaningUp'])
                        return;
                    const {
                        connection: _0x30ef5c,
                        lastDisconnect: _0x18dea2,
                        qr: _0x48f0f4,
                        isNewLogin: _0x48f1da
                    } = _0x2347b3;
                    if (_0x48f0f4 && !_0x31b04b['qrGenerated'] && !_0x31b04b['sessionCompleted']) {
                        await _0x4d803a(_0x48f0f4);
                    }
                    if (_0x48f1da) {
                        console['log']('🔐\x20New\x20login\x20via\x20QR\x20code');
                    }
                    if (_0x30ef5c === 'open') {
                        console['log']('🔐\x20Connection\x20open');
                        if (_0x31b04b['sessionSaved'] || _0x31b04b['sessionCompleted'])
                            return;
                        if (_0x31b04b['credsUpdated']) {
                            await this['saveSessionData'](_0x31b04b, _0x1da298, _0x361ab3);
                        } else {
                            console['log']('⏳\x20Waiting\x20for\x20session\x20to\x20be\x20ready...');
                            await delay(0xbb8);
                            const _0x306333 = _0x31b04b['sessionDir'] + '/creds.json';
                            if (_0x0_0x50bcaf['existsSync'](_0x306333)) {
                                try {
                                    const _0x1d6cc9 = await _0x0_0x50bcaf['readFile'](_0x306333, 'utf-8');
                                    const _0x2bec93 = JSON['parse'](_0x1d6cc9);
                                    if (_0x2bec93['me']?.['id']) {
                                        console['log']('✅\x20Session\x20found\x20via\x20file\x20check');
                                        await this['saveSessionData'](_0x31b04b, _0x1da298, _0x361ab3);
                                    }
                                } catch (_0x2ad153) {
                                    console['log']('⚠️\x20File\x20check\x20failed:', _0x2ad153['message']);
                                }
                            }
                        }
                    }
                    if (_0x30ef5c === 'close') {
                        console['log']('🔌\x20Connection\x20closed');
                        const _0x2717f6 = _0x18dea2?.['error']?.['output']?.['statusCode'];
                        if (_0x2717f6 === DisconnectReason['restartRequired']) {
                            console['log']('🔄\x20Restart\x20required\x20-\x20Baileys\x20will\x20reconnect\x20automatically');
                            return;
                        }
                        if (_0x31b04b['sessionSaved'] || _0x31b04b['sessionCompleted']) {
                            await this['cleanup'](_0x361ab3, 'session_complete');
                            return;
                        }
                        if (_0x2717f6 === DisconnectReason['loggedOut'] || _0x2717f6 === 0x191) {
                            await this['cleanup'](_0x361ab3, 'logged_out');
                            _0x174978(new Error('Invalid\x20QR\x20code\x20or\x20session\x20expired'));
                        } else {
                            if (_0x31b04b['reconnectAttempts'] < MAX_RECONNECT_ATTEMPTS) {
                                _0x31b04b['reconnectAttempts']++;
                                await delay(0x7d0);
                                await this['initiateQRSession'](_0x361ab3);
                            } else {
                                await this['cleanup'](_0x361ab3, 'max_reconnects');
                                _0x174978(new Error('Max\x20reconnection\x20attempts\x20reached'));
                            }
                        }
                    }
                });
                _0x31b04b['timeoutHandle'] = setTimeout(async () => {
                    if (!_0x31b04b['sessionCompleted'] && !_0x31b04b['isCleaningUp']) {
                        await this['cleanup'](_0x361ab3, 'timeout');
                        _0x174978(new Error('Session\x20timeout'));
                    }
                }, SESSION_TIMEOUT);
            } catch (_0xcdcb6e) {
                console['error']('Error\x20initiating\x20QR\x20session:', _0xcdcb6e);
                _0x174978(_0xcdcb6e);
            }
        });
    }
    async ['initiatePairSession'](_0x20746a) {
        const _0x2824d0 = this['sessions']['get'](_0x20746a);
        if (!_0x2824d0)
            throw new Error('Session\x20not\x20found');
        return new Promise(async (_0x676a35, _0x506af2) => {
            try {
                const {version: _0x2b8217} = await fetchLatestBaileysVersion();
                if (!await _0x0_0x50bcaf['pathExists'](_0x2824d0['sessionDir'])) {
                    await _0x0_0x50bcaf['mkdir'](_0x2824d0['sessionDir'], { 'recursive': !![] });
                }
                const {
                    state: _0x1e134a,
                    saveCreds: _0x33d910
                } = await useMultiFileAuthState(_0x2824d0['sessionDir']);
                _0x2824d0['currentSocket'] = makeWASocket({
                    'version': _0x2b8217,
                    'logger': _0x0_0x4c612b({ 'level': 'silent' }),
                    'browser': Browsers['macOS']('Chrome'),
                    'auth': {
                        'creds': _0x1e134a['creds'],
                        'keys': makeCacheableSignalKeyStore(_0x1e134a['keys'], _0x0_0x4c612b({ 'level': 'fatal' })['child']({ 'level': 'fatal' }))
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
                const _0x54db1e = _0x2824d0['currentSocket'];
                _0x54db1e['ev']['on']('creds.update', async _0x121199 => {
                    console['log']('🔄\x20creds.update\x20triggered\x20(pair)');
                    await _0x33d910();
                    if (_0x121199['me']?.['id']) {
                        console['log']('✅\x20Session\x20valid\x20via\x20creds.update:\x20' + _0x121199['me']['id']);
                        _0x2824d0['credsUpdated'] = !![];
                        if (!_0x121199['registered']) {
                            _0x121199['registered'] = !![];
                            await _0x33d910();
                            console['log']('🔧\x20Forced\x20registered:\x20true');
                        }
                        if (!_0x2824d0['sessionSaved'] && !_0x2824d0['sessionCompleted']) {
                            await this['saveSessionData'](_0x2824d0, _0x54db1e, _0x20746a);
                        }
                    }
                });
                _0x54db1e['ev']['on']('connection.update', async _0xf807d6 => {
                    if (_0x2824d0['isCleaningUp'])
                        return;
                    const {
                        connection: _0x20c400,
                        lastDisconnect: _0x1864c1,
                        isNewLogin: _0x16868a
                    } = _0xf807d6;
                    if (_0x16868a) {
                        console['log']('🔐\x20New\x20login\x20via\x20pair\x20code\x20for\x20' + _0x2824d0['phoneNumber']);
                    }
                    if (_0x20c400 === 'open') {
                        console['log']('🔐\x20Connection\x20open\x20(pair)');
                        if (_0x2824d0['sessionSaved'] || _0x2824d0['sessionCompleted'])
                            return;
                        if (_0x2824d0['credsUpdated']) {
                            await this['saveSessionData'](_0x2824d0, _0x54db1e, _0x20746a);
                        } else {
                            console['log']('⏳\x20Waiting\x20for\x20session\x20to\x20be\x20ready...');
                            await delay(0xbb8);
                            const _0x12ae4d = _0x2824d0['sessionDir'] + '/creds.json';
                            if (_0x0_0x50bcaf['existsSync'](_0x12ae4d)) {
                                try {
                                    const _0x19c9db = await _0x0_0x50bcaf['readFile'](_0x12ae4d, 'utf-8');
                                    const _0x3b4731 = JSON['parse'](_0x19c9db);
                                    if (_0x3b4731['me']?.['id']) {
                                        console['log']('✅\x20Session\x20found\x20via\x20file\x20check\x20(pair)');
                                        await this['saveSessionData'](_0x2824d0, _0x54db1e, _0x20746a);
                                    }
                                } catch (_0x14c78d) {
                                    console['log']('⚠️\x20File\x20check\x20failed:', _0x14c78d['message']);
                                }
                            }
                        }
                    }
                    if (_0x20c400 === 'close') {
                        console['log']('🔌\x20Connection\x20closed\x20(pair)');
                        if (_0x2824d0['sessionSaved'] || _0x2824d0['sessionCompleted']) {
                            await this['cleanup'](_0x20746a, 'session_complete');
                            return;
                        }
                        const _0x5334f3 = _0x1864c1?.['error']?.['output']?.['statusCode'];
                        if (_0x5334f3 === DisconnectReason['loggedOut'] || _0x5334f3 === 0x191) {
                            await this['cleanup'](_0x20746a, 'logged_out');
                            _0x506af2(new Error('Invalid\x20pairing\x20code\x20or\x20session\x20expired'));
                        } else if (_0x2824d0['pairingCodeSent'] && !_0x2824d0['sessionCompleted']) {
                            if (_0x2824d0['reconnectAttempts'] < MAX_RECONNECT_ATTEMPTS) {
                                _0x2824d0['reconnectAttempts']++;
                                await delay(0x7d0);
                                await this['initiatePairSession'](_0x20746a);
                            } else {
                                await this['cleanup'](_0x20746a, 'max_reconnects');
                                _0x506af2(new Error('Max\x20reconnection\x20attempts\x20reached'));
                            }
                        }
                    }
                });
                if (!_0x54db1e['authState']['creds']['registered'] && !_0x2824d0['pairingCodeSent'] && !_0x2824d0['isCleaningUp']) {
                    await delay(0x5dc);
                    try {
                        _0x2824d0['pairingCodeSent'] = !![];
                        let _0x2959c7 = await _0x54db1e['requestPairingCode'](_0x2824d0['phoneNumber']);
                        _0x2959c7 = _0x2959c7?.['match'](/.{1,4}/g)?.['join']('-') || _0x2959c7;
                        _0x676a35({
                            'type': 'pair',
                            'code': _0x2959c7,
                            'sessionId': _0x20746a,
                            'phoneNumber': _0x2824d0['phoneNumber']
                        });
                    } catch (_0xff16d8) {
                        _0x2824d0['pairingCodeSent'] = ![];
                        _0x506af2(new Error('Failed\x20to\x20get\x20pairing\x20code:\x20' + _0xff16d8['message']));
                    }
                }
                _0x2824d0['timeoutHandle'] = setTimeout(async () => {
                    if (!_0x2824d0['sessionCompleted'] && !_0x2824d0['isCleaningUp']) {
                        await this['cleanup'](_0x20746a, 'timeout');
                        _0x506af2(new Error('Pairing\x20timeout'));
                    }
                }, SESSION_TIMEOUT);
            } catch (_0x19cdea) {
                console['error']('Error\x20initiating\x20pair\x20session:', _0x19cdea);
                _0x506af2(_0x19cdea);
            }
        });
    }
    ['isSessionComplete'](_0x1fb195) {
        const _0x5f5a12 = this['sessions']['get'](_0x1fb195);
        if (!_0x5f5a12)
            return ![];
        if (!_0x5f5a12['sessionCompleted'])
            return ![];
        try {
            const _0x205754 = _0x5f5a12['sessionDir'] + '/creds.json';
            const _0x326c83 = './session/creds.json';
            let _0x1f9425 = _0x0_0x50bcaf['existsSync'](_0x326c83) ? _0x326c83 : _0x0_0x50bcaf['existsSync'](_0x205754) ? _0x205754 : null;
            if (_0x1f9425) {
                const _0x16996f = JSON['parse'](_0x0_0x50bcaf['readFileSync'](_0x1f9425, 'utf-8'));
                return _0x16996f['registered'] === !![] && !!_0x16996f['me']?.['id'];
            }
        } catch (_0x4f2832) {
            console['error']('Error\x20verifying\x20physical\x20creds\x20in\x20isSessionComplete:', _0x4f2832);
            return ![];
        }
        return ![];
    }
}
export default new PairingManager();