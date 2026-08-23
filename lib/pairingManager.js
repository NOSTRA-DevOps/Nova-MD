import _0x0_0x29149e from 'fs-extra';
import _0x0_0x36db71 from 'pino';
import _0x0_0x1a4820 from 'qrcode';
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
import _0x0_0x3ad8bd from 'awesome-phonenumber';
import _0x0_0x32d1ae from './sessionManager.js';
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
        const _0x9b07eb = Date['now']()['toString']() + Math['random']()['toString'](0x24)['substring'](0x2, 0x9);
        const _0x5a0394 = './temp_session_' + _0x9b07eb;
        const _0x3f2a82 = {
            'sessionId': _0x9b07eb,
            'sessionDir': _0x5a0394,
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
        this['sessions']['set'](_0x9b07eb, _0x3f2a82);
        return _0x9b07eb;
    }
    async ['createPairSession'](_0xee4f27) {
        if (!_0xee4f27)
            throw new Error('Phone\x20number\x20is\x20required');
        _0xee4f27 = _0xee4f27['replace'](/[^0-9]/g, '');
        const _0xb4b245 = _0x0_0x3ad8bd('+' + _0xee4f27);
        if (!_0xb4b245['isValid']())
            throw new Error('Invalid\x20phone\x20number');
        _0xee4f27 = _0xb4b245['getNumber']('e164')['replace']('+', '');
        const _0x1feb15 = Date['now']()['toString']() + Math['random']()['toString'](0x24)['substring'](0x2, 0x9);
        const _0x2d12c4 = './temp_session_' + _0x1feb15;
        const _0x4751b1 = {
            'sessionId': _0x1feb15,
            'sessionDir': _0x2d12c4,
            'phoneNumber': _0xee4f27,
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
        this['sessions']['set'](_0x1feb15, _0x4751b1);
        return _0x1feb15;
    }
    async ['removeSessionDir'](_0x1a5490) {
        try {
            if (await _0x0_0x29149e['pathExists'](_0x1a5490)) {
                await _0x0_0x29149e['remove'](_0x1a5490);
                return !![];
            }
        } catch (_0x5f4a2c) {
            console['error']('Error\x20removing\x20session\x20dir:', _0x5f4a2c);
        }
        return ![];
    }
    async ['cleanupSessions']() {
        const _0x5636f2 = Date['now']();
        const _0xf7ef52 = [];
        for (const [_0xf756b6, _0x44b951] of this['sessions']['entries']()) {
            if (_0x5636f2 - _0x44b951['createdAt'] > SESSION_TIMEOUT) {
                _0xf7ef52['push'](_0xf756b6);
            }
        }
        for (const _0x1c8efa of _0xf7ef52) {
            const _0x3a5d34 = this['sessions']['get'](_0x1c8efa);
            await this['cleanup'](_0x1c8efa, 'session_expired');
        }
    }
    async ['cleanup'](_0x24279f, _0x4c1372 = 'unknown') {
        const _0x53be1f = this['sessions']['get'](_0x24279f);
        if (!_0x53be1f)
            return;
        if (_0x53be1f['isCleaningUp'])
            return;
        console['log']('🧹\x20Cleanup\x20session\x20' + _0x24279f + '\x20-\x20' + _0x4c1372);
        if (_0x4c1372 === 'session_complete' || _0x53be1f['sessionCompleted']) {
            if (_0x53be1f['timeoutHandle']) {
                clearTimeout(_0x53be1f['timeoutHandle']);
                _0x53be1f['timeoutHandle'] = null;
            }
            this['sessions']['delete'](_0x24279f);
            console['log']('✅\x20Socket\x20handed\x20over\x20to\x20index.js\x20successfully.');
            return;
        }
        _0x53be1f['isCleaningUp'] = !![];
        if (_0x53be1f['timeoutHandle']) {
            clearTimeout(_0x53be1f['timeoutHandle']);
            _0x53be1f['timeoutHandle'] = null;
        }
        if (_0x53be1f['currentSocket']) {
            try {
                _0x53be1f['currentSocket']['ev']['removeAllListeners']();
                await _0x53be1f['currentSocket']['end']();
            } catch (_0x4ef5a2) {
            }
            _0x53be1f['currentSocket'] = null;
        }
        setTimeout(async () => {
            await this['removeSessionDir'](_0x53be1f['sessionDir']);
            this['sessions']['delete'](_0x24279f);
        }, 0x1388);
    }
    async ['saveSessionData'](_0x303c34, _0x4786bc, _0x2b3554) {
        if (this['sessionSaveInProgress']['get'](_0x2b3554)) {
            console['log']('⏳\x20Session\x20save\x20already\x20in\x20progress...');
            return;
        }
        this['sessionSaveInProgress']['set'](_0x2b3554, !![]);
        try {
            const _0x5cc76f = _0x303c34['sessionDir'] + '/creds.json';
            const _0x3aa524 = './session';
            if (!_0x0_0x29149e['existsSync'](_0x5cc76f)) {
                console['log']('❌\x20No\x20credentials\x20file\x20found');
                this['sessionSaveInProgress']['delete'](_0x2b3554);
                return;
            }
            const _0x38679b = await _0x0_0x29149e['readFile'](_0x5cc76f, 'utf-8');
            const _0x179ba3 = JSON['parse'](_0x38679b);
            if (!_0x179ba3['me']?.['id']) {
                console['log']('⚠️\x20Session\x20not\x20valid\x20(no\x20me.id)');
                this['sessionSaveInProgress']['delete'](_0x2b3554);
                return;
            }
            console['log']('✅\x20Session\x20valid:\x20me.id\x20=\x20' + _0x179ba3['me']['id']);
            if (!_0x179ba3['registered']) {
                _0x179ba3['registered'] = !![];
                _0x0_0x29149e['writeFileSync'](_0x5cc76f, JSON['stringify'](_0x179ba3, null, 0x2));
                console['log']('🔧\x20Forced\x20registered:\x20true');
            }
            if (!await _0x0_0x29149e['pathExists'](_0x3aa524)) {
                await _0x0_0x29149e['mkdir'](_0x3aa524, { 'recursive': !![] });
            }
            await _0x0_0x29149e['copy'](_0x303c34['sessionDir'], _0x3aa524);
            console['log']('✅\x20Session\x20credentials\x20saved\x20to\x20main\x20session\x20directory');
            let _0x696384 = _0x303c34['phoneNumber'] || null;
            if (!_0x696384 && _0x179ba3['me']?.['id']) {
                _0x696384 = _0x179ba3['me']['id']['split'](':')[0x0];
            }
            const _0x3e4e56 = await _0x0_0x32d1ae['saveSession'](_0x179ba3, _0x696384);
            console['log']('✅\x20Session\x20saved\x20to\x20database:\x20' + _0x3e4e56);
            const _0x4b10da = _0x4786bc['authState']['creds']['me']?.['id'] ? jidNormalizedUser(_0x4786bc['authState']['creds']['me']['id']) : jidNormalizedUser(_0x303c34['phoneNumber'] + '@s.whatsapp.net');
            if (_0x4b10da) {
                const _0xe17bab = await _0x4786bc['sendMessage'](_0x4b10da, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x3e4e56 + '`\x0a\x0a📌\x20*SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE\x20DON\x27T\x20SHARE\x20IT*\x20✅' });
                await _0x4786bc['sendMessage'](_0x4b10da, {
                    'text': MESSAGE,
                    'quoted': _0xe17bab
                });
                console['log']('✅\x20Success\x20message\x20sent');
            }
            _0x303c34['sessionCompleted'] = !![];
            _0x303c34['sessionSaved'] = !![];
            setTimeout(async () => {
                await this['cleanup'](_0x2b3554, 'session_complete');
            }, 0x1388);
        } catch (_0x49ea01) {
            console['error']('❌\x20Error\x20saving\x20session:', _0x49ea01);
        } finally {
            this['sessionSaveInProgress']['delete'](_0x2b3554);
        }
    }
    async ['initiateQRSession'](_0x4c3d9c) {
        const _0x1f89ef = this['sessions']['get'](_0x4c3d9c);
        if (!_0x1f89ef)
            throw new Error('Session\x20not\x20found');
        return new Promise(async (_0x4c1a89, _0x539bfe) => {
            try {
                const {version: _0x489f51} = await fetchLatestBaileysVersion();
                if (!await _0x0_0x29149e['pathExists'](_0x1f89ef['sessionDir'])) {
                    await _0x0_0x29149e['mkdir'](_0x1f89ef['sessionDir'], { 'recursive': !![] });
                }
                const {
                    state: _0x3f9c0e,
                    saveCreds: _0x2cffe0
                } = await useMultiFileAuthState(_0x1f89ef['sessionDir']);
                _0x1f89ef['currentSocket'] = makeWASocket({
                    'version': _0x489f51,
                    'logger': _0x0_0x36db71({ 'level': 'silent' }),
                    'browser': Browsers['macOS']('Chrome'),
                    'auth': {
                        'creds': _0x3f9c0e['creds'],
                        'keys': makeCacheableSignalKeyStore(_0x3f9c0e['keys'], _0x0_0x36db71({ 'level': 'fatal' })['child']({ 'level': 'fatal' }))
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
                const _0x3973b5 = _0x1f89ef['currentSocket'];
                _0x3973b5['ev']['on']('creds.update', async _0x3650bf => {
                    console['log']('🔄\x20creds.update\x20triggered');
                    await _0x2cffe0();
                    if (_0x3650bf['me']?.['id']) {
                        console['log']('✅\x20Session\x20valid\x20via\x20creds.update:\x20' + _0x3650bf['me']['id']);
                        _0x1f89ef['credsUpdated'] = !![];
                        if (!_0x3650bf['registered']) {
                            _0x3650bf['registered'] = !![];
                            await _0x2cffe0();
                            console['log']('🔧\x20Forced\x20registered:\x20true\x20via\x20creds.update');
                        }
                        if (!_0x1f89ef['sessionSaved'] && !_0x1f89ef['sessionCompleted']) {
                            await this['saveSessionData'](_0x1f89ef, _0x3973b5, _0x4c3d9c);
                        }
                    }
                });
                const _0x566506 = async _0x10e30d => {
                    if (_0x1f89ef['qrGenerated'] || _0x1f89ef['sessionCompleted'] || _0x1f89ef['isCleaningUp'])
                        return;
                    _0x1f89ef['qrGenerated'] = !![];
                    try {
                        const _0x29ca4a = await _0x0_0x1a4820['toDataURL'](_0x10e30d, { 'errorCorrectionLevel': 'M' });
                        _0x4c1a89({
                            'type': 'qr',
                            'qr': _0x29ca4a,
                            'sessionId': _0x4c3d9c
                        });
                    } catch (_0x354f5b) {
                        console['error']('Error\x20generating\x20QR\x20code:', _0x354f5b);
                        _0x539bfe(_0x354f5b);
                    }
                };
                _0x3973b5['ev']['on']('connection.update', async _0x3c2121 => {
                    if (_0x1f89ef['isCleaningUp'])
                        return;
                    const {
                        connection: _0xac9eb1,
                        lastDisconnect: _0xbbfff8,
                        qr: _0x46215b,
                        isNewLogin: _0x4ba2b7
                    } = _0x3c2121;
                    if (_0x46215b && !_0x1f89ef['qrGenerated'] && !_0x1f89ef['sessionCompleted']) {
                        await _0x566506(_0x46215b);
                    }
                    if (_0x4ba2b7) {
                        console['log']('🔐\x20New\x20login\x20via\x20QR\x20code');
                    }
                    if (_0xac9eb1 === 'open') {
                        console['log']('🔐\x20Connection\x20open');
                        if (_0x1f89ef['sessionSaved'] || _0x1f89ef['sessionCompleted'])
                            return;
                        if (_0x1f89ef['credsUpdated']) {
                            const _0x19e650 = await this['saveSessionData'](_0x1f89ef, _0x3973b5, _0x4c3d9c);
                            const _0x341768 = Object['keys'](_0x3973b5['authState']['creds']['me'] || {})['length'] > 0x0 ? jidNormalizedUser(_0x3973b5['authState']['creds']['me']['id']) : null;
                            if (_0x341768) {
                                await delay(0x7d0);
                                const _0x55622d = await _0x3973b5['sendMessage'](_0x341768, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x19e650 + '`\x0a\x0a📌\x20SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE,DON\x27T\x20SHARE\x20IT!' });
                                await _0x3973b5['sendMessage'](_0x341768, { 'quoted': _0x55622d });
                            }
                        } else {
                            console['log']('⏳\x20Waiting\x20for\x20session\x20to\x20be\x20ready...');
                            await delay(0xbb8);
                            const _0x5176e3 = _0x1f89ef['sessionDir'] + '/creds.json';
                            if (_0x0_0x29149e['existsSync'](_0x5176e3)) {
                                try {
                                    const _0xf23625 = await _0x0_0x29149e['readFile'](_0x5176e3, 'utf-8');
                                    const _0xa4b195 = JSON['parse'](_0xf23625);
                                    if (_0xa4b195['me']?.['id']) {
                                        console['log']('✅\x20Session\x20found\x20via\x20file\x20check');
                                        const _0x338015 = await this['saveSessionData'](_0x1f89ef, _0x3973b5, _0x4c3d9c);
                                        const _0x27d803 = Object['keys'](_0x3973b5['authState']['creds']['me'] || {})['length'] > 0x0 ? jidNormalizedUser(_0x3973b5['authState']['creds']['me']['id']) : null;
                                        if (_0x27d803) {
                                            await delay(0x7d0);
                                            const _0x2ddf5e = await _0x3973b5['sendMessage'](_0x27d803, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x338015 + '`\x0a\x0a📌\x20SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE,DON\x27T\x20SHARE\x20IT!' });
                                            await _0x3973b5['sendMessage'](_0x27d803, { 'quoted': _0x2ddf5e });
                                        }
                                    }
                                } catch (_0x1d908c) {
                                    console['log']('⚠️\x20File\x20check\x20failed:', _0x1d908c['message']);
                                }
                            }
                        }
                    }
                    if (_0xac9eb1 === 'close') {
                        console['log']('🔌\x20Connection\x20closed');
                        const _0x2c085e = _0xbbfff8?.['error']?.['output']?.['statusCode'];
                        if (_0x2c085e === DisconnectReason['restartRequired']) {
                            console['log']('🔄\x20Restart\x20required\x20-\x20Baileys\x20will\x20reconnect\x20automatically');
                            return;
                        }
                        if (_0x1f89ef['sessionSaved'] || _0x1f89ef['sessionCompleted']) {
                            await this['cleanup'](_0x4c3d9c, 'session_complete');
                            return;
                        }
                        if (_0x2c085e === DisconnectReason['loggedOut'] || _0x2c085e === 0x191) {
                            await this['cleanup'](_0x4c3d9c, 'logged_out');
                            _0x539bfe(new Error('Invalid\x20QR\x20code\x20or\x20session\x20expired'));
                        } else {
                            if (_0x1f89ef['reconnectAttempts'] < MAX_RECONNECT_ATTEMPTS) {
                                _0x1f89ef['reconnectAttempts']++;
                                await delay(0x7d0);
                                await this['initiateQRSession'](_0x4c3d9c);
                            } else {
                                await this['cleanup'](_0x4c3d9c, 'max_reconnects');
                                _0x539bfe(new Error('Max\x20reconnection\x20attempts\x20reached'));
                            }
                        }
                    }
                });
                _0x1f89ef['timeoutHandle'] = setTimeout(async () => {
                    if (!_0x1f89ef['sessionCompleted'] && !_0x1f89ef['isCleaningUp']) {
                        await this['cleanup'](_0x4c3d9c, 'timeout');
                        _0x539bfe(new Error('Session\x20timeout'));
                    }
                }, SESSION_TIMEOUT);
            } catch (_0x2db686) {
                console['error']('Error\x20initiating\x20QR\x20session:', _0x2db686);
                _0x539bfe(_0x2db686);
            }
        });
    }
    async ['initiatePairSession'](_0x48af83) {
        const _0x3ed4d0 = this['sessions']['get'](_0x48af83);
        if (!_0x3ed4d0)
            throw new Error('Session\x20not\x20found');
        return new Promise(async (_0xbe0658, _0x35074e) => {
            try {
                const {version: _0x8f5790} = await fetchLatestBaileysVersion();
                if (!await _0x0_0x29149e['pathExists'](_0x3ed4d0['sessionDir'])) {
                    await _0x0_0x29149e['mkdir'](_0x3ed4d0['sessionDir'], { 'recursive': !![] });
                }
                const {
                    state: _0x21607f,
                    saveCreds: _0x9ec950
                } = await useMultiFileAuthState(_0x3ed4d0['sessionDir']);
                _0x3ed4d0['currentSocket'] = makeWASocket({
                    'version': _0x8f5790,
                    'logger': _0x0_0x36db71({ 'level': 'silent' }),
                    'browser': Browsers['macOS']('Chrome'),
                    'auth': {
                        'creds': _0x21607f['creds'],
                        'keys': makeCacheableSignalKeyStore(_0x21607f['keys'], _0x0_0x36db71({ 'level': 'fatal' })['child']({ 'level': 'fatal' }))
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
                const _0x347a68 = _0x3ed4d0['currentSocket'];
                _0x347a68['ev']['on']('connection.update', async _0x1b5344 => {
                    if (_0x3ed4d0['isCleaningUp'])
                        return;
                    const {
                        connection: _0x5a8fc1,
                        lastDisconnect: _0x45d523,
                        isNewLogin: _0x289ddc
                    } = _0x1b5344;
                    if (_0x5a8fc1 === 'open') {
                        if (_0x3ed4d0['sessionCompleted'])
                            return;
                        _0x3ed4d0['sessionCompleted'] = !![];
                        try {
                            const _0x40f0e6 = _0x3ed4d0['sessionDir'] + '/creds.json';
                            const _0x1827dc = './session';
                            if (!await _0x0_0x29149e['pathExists'](_0x1827dc)) {
                                await _0x0_0x29149e['mkdir'](_0x1827dc, { 'recursive': !![] });
                            }
                            if (await _0x0_0x29149e['pathExists'](_0x40f0e6)) {
                                await _0x0_0x29149e['copy'](_0x3ed4d0['sessionDir'], _0x1827dc);
                                console['log']('✅\x20Session\x20credentials\x20saved\x20to\x20main\x20session\x20directory');
                            }
                            await delay(0xbb8);
                            if (_0x0_0x29149e['existsSync'](_0x40f0e6)) {
                                const _0x53617f = JSON['parse'](await _0x0_0x29149e['readFile'](_0x40f0e6, 'utf-8'));
                                const _0x2901eb = _0x3ed4d0['phoneNumber'] || Object['keys'](_0x53617f['me'] || {})[0x0]?.['split']('@')[0x0] || null;
                                const _0x177728 = await _0x0_0x32d1ae['saveSession'](_0x53617f, _0x2901eb);
                                console['log']('✅\x20Session\x20saved\x20to\x20database:\x20' + _0x177728);
                                const _0xf2ba = Object['keys'](_0x347a68['authState']['creds']['me'] || {})['length'] > 0x0 ? jidNormalizedUser(_0x347a68['authState']['creds']['me']['id']) : jidNormalizedUser(_0x3ed4d0['phoneNumber'] + '@s.whatsapp.net');
                                if (_0xf2ba) {
                                    await delay(0x7d0);
                                    const _0x41a57d = await _0x347a68['sendMessage'](_0xf2ba, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x177728 + '`\x0a\x0a📌\x20SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE,DON\x27T\x20SHARE\x20IT!' });
                                    await _0x347a68['sendMessage'](_0xf2ba, { 'quoted': _0x41a57d });
                                }
                            }
                        } catch (_0x33caf9) {
                            console['error']('Error\x20saving\x20session:', _0x33caf9);
                        } finally {
                            setTimeout(async () => {
                                await this['cleanup'](_0x48af83, 'session_complete');
                            }, 0x2710);
                        }
                    }
                    if (_0x289ddc)
                        console['log']('🔐\x20New\x20login\x20via\x20pair\x20code\x20for\x20' + _0x3ed4d0['phoneNumber']);
                    if (_0x5a8fc1 === 'close') {
                        if (_0x3ed4d0['sessionCompleted'] || _0x3ed4d0['isCleaningUp']) {
                            await this['cleanup'](_0x48af83, 'already_complete');
                            return;
                        }
                        const _0x1b0c82 = _0x45d523?.['error']?.['output']?.['statusCode'];
                        if (_0x1b0c82 === DisconnectReason['loggedOut'] || _0x1b0c82 === 0x191) {
                            await this['cleanup'](_0x48af83, 'logged_out');
                            _0x35074e(new Error('Invalid\x20pairing\x20code\x20or\x20session\x20expired'));
                        } else if (_0x3ed4d0['pairingCodeSent'] && !_0x3ed4d0['sessionCompleted']) {
                            if (_0x3ed4d0['reconnectAttempts'] < MAX_RECONNECT_ATTEMPTS) {
                                _0x3ed4d0['reconnectAttempts']++;
                                await delay(0x7d0);
                                await this['initiatePairSession'](_0x48af83);
                            } else {
                                await this['cleanup'](_0x48af83, 'max_reconnects');
                                _0x35074e(new Error('Max\x20reconnection\x20attempts\x20reached'));
                            }
                        }
                    }
                });
                if (!_0x347a68['authState']['creds']['registered'] && !_0x3ed4d0['pairingCodeSent'] && !_0x3ed4d0['isCleaningUp']) {
                    await delay(0x5dc);
                    try {
                        _0x3ed4d0['pairingCodeSent'] = !![];
                        let _0x262afa = await _0x347a68['requestPairingCode'](_0x3ed4d0['phoneNumber']);
                        _0x262afa = _0x262afa?.['match'](/.{1,4}/g)?.['join']('-') || _0x262afa;
                        _0xbe0658({
                            'type': 'pair',
                            'code': _0x262afa,
                            'sessionId': _0x48af83,
                            'phoneNumber': _0x3ed4d0['phoneNumber']
                        });
                    } catch (_0x39befe) {
                        _0x3ed4d0['pairingCodeSent'] = ![];
                        _0x35074e(new Error('Failed\x20to\x20get\x20pairing\x20code:\x20' + _0x39befe['message']));
                    }
                }
                _0x347a68['ev']['on']('creds.update', _0x9ec950);
                _0x3ed4d0['timeoutHandle'] = setTimeout(async () => {
                    if (!_0x3ed4d0['sessionCompleted'] && !_0x3ed4d0['isCleaningUp']) {
                        await this['cleanup'](_0x48af83, 'timeout');
                        _0x35074e(new Error('Pairing\x20timeout'));
                    }
                }, SESSION_TIMEOUT);
            } catch (_0x3a02e0) {
                console['error']('Error\x20initiating\x20pair\x20session:', _0x3a02e0);
                _0x35074e(_0x3a02e0);
            }
        });
    }
    ['isSessionComplete'](_0x2e54df) {
        const _0x5633a4 = this['sessions']['get'](_0x2e54df);
        if (!_0x5633a4)
            return ![];
        if (!_0x5633a4['sessionCompleted'])
            return ![];
        try {
            const _0x53a80c = _0x5633a4['sessionDir'] + '/creds.json';
            const _0x6aa7f9 = './session/creds.json';
            let _0x3ae4c5 = _0x0_0x29149e['existsSync'](_0x6aa7f9) ? _0x6aa7f9 : _0x0_0x29149e['existsSync'](_0x53a80c) ? _0x53a80c : null;
            if (_0x3ae4c5) {
                const _0x343e85 = JSON['parse'](_0x0_0x29149e['readFileSync'](_0x3ae4c5, 'utf-8'));
                return _0x343e85['registered'] === !![] && !!_0x343e85['me']?.['id'];
            }
        } catch (_0x20254f) {
            console['error']('Error\x20verifying\x20physical\x20creds\x20in\x20isSessionComplete:', _0x20254f);
            return ![];
        }
        return ![];
    }
}
export default new PairingManager();