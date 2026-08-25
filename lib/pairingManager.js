import _0x0_0x4b728c from 'fs-extra';
import _0x0_0x262559 from 'pino';
import _0x0_0x45f01c from 'qrcode';
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
import _0x0_0x8bf3f4 from 'awesome-phonenumber';
import _0x0_0x3b6be8 from './sessionManager.js';
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
        const _0x12613b = Date['now']()['toString']() + Math['random']()['toString'](0x24)['substring'](0x2, 0x9);
        const _0x2cf3a6 = './temp_session_' + _0x12613b;
        const _0x24b3f1 = {
            'sessionId': _0x12613b,
            'sessionDir': _0x2cf3a6,
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
        this['sessions']['set'](_0x12613b, _0x24b3f1);
        return _0x12613b;
    }
    async ['createPairSession'](_0x20e4ba) {
        if (!_0x20e4ba)
            throw new Error('Phone\x20number\x20is\x20required');
        _0x20e4ba = _0x20e4ba['replace'](/[^0-9]/g, '');
        const _0x234798 = _0x0_0x8bf3f4('+' + _0x20e4ba);
        if (!_0x234798['isValid']())
            throw new Error('Invalid\x20phone\x20number');
        _0x20e4ba = _0x234798['getNumber']('e164')['replace']('+', '');
        const _0x1f40d7 = Date['now']()['toString']() + Math['random']()['toString'](0x24)['substring'](0x2, 0x9);
        const _0x5483bd = './temp_session_' + _0x1f40d7;
        const _0x5cf7b1 = {
            'sessionId': _0x1f40d7,
            'sessionDir': _0x5483bd,
            'phoneNumber': _0x20e4ba,
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
        this['sessions']['set'](_0x1f40d7, _0x5cf7b1);
        return _0x1f40d7;
    }
    async ['removeSessionDir'](_0x54bd06) {
        try {
            if (await _0x0_0x4b728c['pathExists'](_0x54bd06)) {
                await _0x0_0x4b728c['remove'](_0x54bd06);
                return !![];
            }
        } catch (_0x149f3d) {
            console['error']('Error\x20removing\x20session\x20dir:', _0x149f3d);
        }
        return ![];
    }
    async ['cleanupSessions']() {
        const _0x979357 = Date['now']();
        const _0x4d4a0d = [];
        for (const [_0x41e7ce, _0x5db58c] of this['sessions']['entries']()) {
            if (_0x979357 - _0x5db58c['createdAt'] > SESSION_TIMEOUT) {
                _0x4d4a0d['push'](_0x41e7ce);
            }
        }
        for (const _0x56b82d of _0x4d4a0d) {
            const _0x5248a9 = this['sessions']['get'](_0x56b82d);
            await this['cleanup'](_0x56b82d, 'session_expired');
        }
    }
    async ['cleanup'](_0x37a2ce, _0x1c385a = 'unknown') {
        const _0x1670b9 = this['sessions']['get'](_0x37a2ce);
        if (!_0x1670b9)
            return;
        if (_0x1670b9['isCleaningUp'])
            return;
        console['log']('🧹\x20Cleanup\x20session\x20' + _0x37a2ce + '\x20-\x20' + _0x1c385a);
        if (_0x1c385a === 'session_complete' || _0x1670b9['sessionCompleted']) {
            if (_0x1670b9['timeoutHandle']) {
                clearTimeout(_0x1670b9['timeoutHandle']);
                _0x1670b9['timeoutHandle'] = null;
            }
            this['sessions']['delete'](_0x37a2ce);
            console['log']('✅\x20Socket\x20handed\x20over\x20to\x20index.js\x20successfully.');
            return;
        }
        _0x1670b9['isCleaningUp'] = !![];
        if (_0x1670b9['timeoutHandle']) {
            clearTimeout(_0x1670b9['timeoutHandle']);
            _0x1670b9['timeoutHandle'] = null;
        }
        if (_0x1670b9['currentSocket']) {
            try {
                _0x1670b9['currentSocket']['ev']['removeAllListeners']();
                await _0x1670b9['currentSocket']['end']();
            } catch (_0x2286eb) {
            }
            _0x1670b9['currentSocket'] = null;
        }
        setTimeout(async () => {
            await this['removeSessionDir'](_0x1670b9['sessionDir']);
            this['sessions']['delete'](_0x37a2ce);
        }, 0x1388);
    }
    async ['saveSessionData'](_0x545a8b, _0x3c69fd, _0x4c5944) {
        if (this['sessionSaveInProgress']['get'](_0x4c5944)) {
            console['log']('⏳\x20Session\x20save\x20already\x20in\x20progress...');
            return;
        }
        this['sessionSaveInProgress']['set'](_0x4c5944, !![]);
        try {
            const _0x442ec8 = _0x545a8b['sessionDir'] + '/creds.json';
            const _0x45f2c5 = './session';
            if (!_0x0_0x4b728c['existsSync'](_0x442ec8)) {
                console['log']('❌\x20No\x20credentials\x20file\x20found');
                this['sessionSaveInProgress']['delete'](_0x4c5944);
                return;
            }
            const _0x1fccee = await _0x0_0x4b728c['readFile'](_0x442ec8, 'utf-8');
            const _0x438bc3 = JSON['parse'](_0x1fccee);
            if (!_0x438bc3['me']?.['id']) {
                console['log']('⚠️\x20Session\x20not\x20valid\x20(no\x20me.id)');
                this['sessionSaveInProgress']['delete'](_0x4c5944);
                return;
            }
            console['log']('✅\x20Session\x20valid:\x20me.id\x20=\x20' + _0x438bc3['me']['id']);
            if (!_0x438bc3['registered']) {
                _0x438bc3['registered'] = !![];
                _0x0_0x4b728c['writeFileSync'](_0x442ec8, JSON['stringify'](_0x438bc3, null, 0x2));
                console['log']('🔧\x20Forced\x20registered:\x20true');
            }
            if (!await _0x0_0x4b728c['pathExists'](_0x45f2c5)) {
                await _0x0_0x4b728c['mkdir'](_0x45f2c5, { 'recursive': !![] });
            }
            await _0x0_0x4b728c['copy'](_0x545a8b['sessionDir'], _0x45f2c5);
            console['log']('✅\x20Session\x20credentials\x20saved\x20to\x20main\x20session\x20directory');
            let _0x1c32cc = _0x545a8b['phoneNumber'] || null;
            if (!_0x1c32cc && _0x438bc3['me']?.['id']) {
                _0x1c32cc = _0x438bc3['me']['id']['split'](':')[0x0];
            }
            const _0x3cc079 = await _0x0_0x3b6be8['saveSession'](_0x438bc3, _0x1c32cc);
            console['log']('✅\x20Session\x20saved\x20to\x20database:\x20' + _0x3cc079);
            const _0x2b0252 = _0x3c69fd['authState']['creds']['me']?.['id'] ? jidNormalizedUser(_0x3c69fd['authState']['creds']['me']['id']) : jidNormalizedUser(_0x545a8b['phoneNumber'] + '@s.whatsapp.net');
            if (_0x2b0252) {
                const _0x3b9df0 = await _0x3c69fd['sendMessage'](_0x2b0252, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x3cc079 + '`\x0a\x0a📌\x20*SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE\x20DON\x27T\x20SHARE\x20IT*\x20✅' });
                await _0x3c69fd['sendMessage'](_0x2b0252, {
                    'text': MESSAGE,
                    'quoted': _0x3b9df0
                });
                console['log']('✅\x20Success\x20message\x20sent');
            }
            _0x545a8b['sessionCompleted'] = !![];
            _0x545a8b['sessionSaved'] = !![];
            setTimeout(async () => {
                await this['cleanup'](_0x4c5944, 'session_complete');
            }, 0x1388);
        } catch (_0x1fe8ad) {
            console['error']('❌\x20Error\x20saving\x20session:', _0x1fe8ad);
        } finally {
            this['sessionSaveInProgress']['delete'](_0x4c5944);
        }
    }
    async ['initiateQRSession'](_0xe907) {
        const _0xe57fea = this['sessions']['get'](_0xe907);
        if (!_0xe57fea)
            throw new Error('Session\x20not\x20found');
        return new Promise(async (_0x14c4d8, _0xd03cc7) => {
            try {
                const {version: _0x5f4be6} = await fetchLatestBaileysVersion();
                if (!await _0x0_0x4b728c['pathExists'](_0xe57fea['sessionDir'])) {
                    await _0x0_0x4b728c['mkdir'](_0xe57fea['sessionDir'], { 'recursive': !![] });
                }
                const {
                    state: _0x2e813c,
                    saveCreds: _0x16c1b9
                } = await useMultiFileAuthState(_0xe57fea['sessionDir']);
                _0xe57fea['currentSocket'] = makeWASocket({
                    'version': _0x5f4be6,
                    'logger': _0x0_0x262559({ 'level': 'silent' }),
                    'browser': Browsers['macOS']('Chrome'),
                    'auth': {
                        'creds': _0x2e813c['creds'],
                        'keys': makeCacheableSignalKeyStore(_0x2e813c['keys'], _0x0_0x262559({ 'level': 'fatal' })['child']({ 'level': 'fatal' }))
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
                const _0x1e2cc5 = _0xe57fea['currentSocket'];
                _0x1e2cc5['ev']['on']('creds.update', async _0x4de7a6 => {
                    console['log']('🔄\x20creds.update\x20triggered');
                    await _0x16c1b9();
                    if (_0x4de7a6['me']?.['id']) {
                        console['log']('✅\x20Session\x20valid\x20via\x20creds.update:\x20' + _0x4de7a6['me']['id']);
                        _0xe57fea['credsUpdated'] = !![];
                        if (!_0x4de7a6['registered']) {
                            _0x4de7a6['registered'] = !![];
                            await _0x16c1b9();
                            console['log']('🔧\x20Forced\x20registered:\x20true\x20via\x20creds.update');
                        }
                        if (!_0xe57fea['sessionSaved'] && !_0xe57fea['sessionCompleted']) {
                            await this['saveSessionData'](_0xe57fea, _0x1e2cc5, _0xe907);
                        }
                    }
                });
                const _0x269490 = async _0x5e739d => {
                    if (_0xe57fea['qrGenerated'] || _0xe57fea['sessionCompleted'] || _0xe57fea['isCleaningUp'])
                        return;
                    _0xe57fea['qrGenerated'] = !![];
                    try {
                        const _0x277039 = await _0x0_0x45f01c['toDataURL'](_0x5e739d, { 'errorCorrectionLevel': 'M' });
                        _0x14c4d8({
                            'type': 'qr',
                            'qr': _0x277039,
                            'sessionId': _0xe907
                        });
                    } catch (_0x346475) {
                        console['error']('Error\x20generating\x20QR\x20code:', _0x346475);
                        _0xd03cc7(_0x346475);
                    }
                };
                _0x1e2cc5['ev']['on']('connection.update', async _0x48698e => {
                    if (_0xe57fea['isCleaningUp'])
                        return;
                    const {
                        connection: _0x41cddf,
                        lastDisconnect: _0x452e6d,
                        qr: _0x219439,
                        isNewLogin: _0x48bc7f
                    } = _0x48698e;
                    if (_0x219439 && !_0xe57fea['qrGenerated'] && !_0xe57fea['sessionCompleted']) {
                        await _0x269490(_0x219439);
                    }
                    if (_0x48bc7f) {
                        console['log']('🔐\x20New\x20login\x20via\x20QR\x20code');
                    }
                    if (_0x41cddf === 'open') {
                        console['log']('🔐\x20Connection\x20open');
                        if (_0xe57fea['sessionSaved'] || _0xe57fea['sessionCompleted'])
                            return;
                        if (_0xe57fea['credsUpdated']) {
                            const _0x26ce1a = await this['saveSessionData'](_0xe57fea, _0x1e2cc5, _0xe907);
                            const _0x408b6e = Object['keys'](_0x1e2cc5['authState']['creds']['me'] || {})['length'] > 0x0 ? jidNormalizedUser(_0x1e2cc5['authState']['creds']['me']['id']) : null;
                            if (_0x408b6e) {
                                await delay(0x7d0);
                                const _0x5a9cd2 = await _0x1e2cc5['sendMessage'](_0x408b6e, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x26ce1a + '`\x0a\x0a📌\x20SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE,DON\x27T\x20SHARE\x20IT!' });
                                await _0x1e2cc5['sendMessage'](_0x408b6e, { 'quoted': _0x5a9cd2 });
                            }
                        } else {
                            console['log']('⏳\x20Waiting\x20for\x20session\x20to\x20be\x20ready...');
                            await delay(0xbb8);
                            const _0xd9955a = _0xe57fea['sessionDir'] + '/creds.json';
                            if (_0x0_0x4b728c['existsSync'](_0xd9955a)) {
                                try {
                                    const _0x4481bd = await _0x0_0x4b728c['readFile'](_0xd9955a, 'utf-8');
                                    const _0x2ed404 = JSON['parse'](_0x4481bd);
                                    if (_0x2ed404['me']?.['id']) {
                                        console['log']('✅\x20Session\x20found\x20via\x20file\x20check');
                                        const _0x118a98 = await this['saveSessionData'](_0xe57fea, _0x1e2cc5, _0xe907);
                                        const _0x347801 = Object['keys'](_0x1e2cc5['authState']['creds']['me'] || {})['length'] > 0x0 ? jidNormalizedUser(_0x1e2cc5['authState']['creds']['me']['id']) : null;
                                        if (_0x347801) {
                                            await delay(0x7d0);
                                            const _0x5407e7 = await _0x1e2cc5['sendMessage'](_0x347801, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x118a98 + '`\x0a\x0a📌\x20SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE,DON\x27T\x20SHARE\x20IT!' });
                                            await _0x1e2cc5['sendMessage'](_0x347801, { 'quoted': _0x5407e7 });
                                        }
                                    }
                                } catch (_0x4603e0) {
                                    console['log']('⚠️\x20File\x20check\x20failed:', _0x4603e0['message']);
                                }
                            }
                        }
                    }
                    if (_0x41cddf === 'close') {
                        console['log']('🔌\x20Connection\x20closed');
                        const _0x29a181 = _0x452e6d?.['error']?.['output']?.['statusCode'];
                        if (_0x29a181 === DisconnectReason['restartRequired']) {
                            console['log']('🔄\x20Restart\x20required\x20-\x20Baileys\x20will\x20reconnect\x20automatically');
                            const _0x15c7fe = _0xe57fea['sessionDir'] + '/creds.json';
                            if (_0x0_0x4b728c['existsSync'](_0x15c7fe)) {
                                try {
                                    const _0x8b290c = await _0x0_0x4b728c['readFile'](_0x15c7fe, 'utf-8');
                                    const _0x42158b = JSON['parse'](_0x8b290c);
                                    if (_0x42158b['me']?.['id']) {
                                        console['log']('✅\x20Session\x20found\x20via\x20file\x20check');
                                        const _0x18f64a = await this['saveSessionData'](_0xe57fea, _0x1e2cc5, _0xe907);
                                        const _0x2564ce = Object['keys'](_0x1e2cc5['authState']['creds']['me'] || {})['length'] > 0x0 ? jidNormalizedUser(_0x1e2cc5['authState']['creds']['me']['id']) : null;
                                        if (_0x2564ce) {
                                            await delay(0x7d0);
                                            const _0xbfdf93 = await _0x1e2cc5['sendMessage'](_0x2564ce, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x18f64a + '`\x0a\x0a📌\x20SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE,DON\x27T\x20SHARE\x20IT!' });
                                            await _0x1e2cc5['sendMessage'](_0x2564ce, { 'quoted': _0xbfdf93 });
                                        }
                                    }
                                } catch (_0x5bfc82) {
                                    console['log']('⚠️\x20File\x20check\x20failed:', _0x5bfc82['message']);
                                }
                            }
                            return;
                        }
                        if (_0xe57fea['sessionSaved'] || _0xe57fea['sessionCompleted']) {
                            await this['cleanup'](_0xe907, 'session_complete');
                            return;
                        }
                        if (_0x29a181 === DisconnectReason['loggedOut'] || _0x29a181 === 0x191) {
                            await this['cleanup'](_0xe907, 'logged_out');
                            _0xd03cc7(new Error('Invalid\x20QR\x20code\x20or\x20session\x20expired'));
                        } else {
                            if (_0xe57fea['reconnectAttempts'] < MAX_RECONNECT_ATTEMPTS) {
                                _0xe57fea['reconnectAttempts']++;
                                await delay(0x7d0);
                                await this['initiateQRSession'](_0xe907);
                            } else {
                                await this['cleanup'](_0xe907, 'max_reconnects');
                                _0xd03cc7(new Error('Max\x20reconnection\x20attempts\x20reached'));
                            }
                        }
                    }
                });
                _0xe57fea['timeoutHandle'] = setTimeout(async () => {
                    if (!_0xe57fea['sessionCompleted'] && !_0xe57fea['isCleaningUp']) {
                        await this['cleanup'](_0xe907, 'timeout');
                        _0xd03cc7(new Error('Session\x20timeout'));
                    }
                }, SESSION_TIMEOUT);
            } catch (_0x4922b2) {
                console['error']('Error\x20initiating\x20QR\x20session:', _0x4922b2);
                _0xd03cc7(_0x4922b2);
            }
        });
    }
    async ['initiatePairSession'](_0x15d0d5) {
        const _0x51f049 = this['sessions']['get'](_0x15d0d5);
        if (!_0x51f049)
            throw new Error('Session\x20not\x20found');
        return new Promise(async (_0x2aeca2, _0x21468f) => {
            try {
                const {version: _0x35eecb} = await fetchLatestBaileysVersion();
                if (!await _0x0_0x4b728c['pathExists'](_0x51f049['sessionDir'])) {
                    await _0x0_0x4b728c['mkdir'](_0x51f049['sessionDir'], { 'recursive': !![] });
                }
                const {
                    state: _0x40a000,
                    saveCreds: _0x1e0d6a
                } = await useMultiFileAuthState(_0x51f049['sessionDir']);
                _0x51f049['currentSocket'] = makeWASocket({
                    'version': _0x35eecb,
                    'logger': _0x0_0x262559({ 'level': 'silent' }),
                    'browser': Browsers['macOS']('Chrome'),
                    'auth': {
                        'creds': _0x40a000['creds'],
                        'keys': makeCacheableSignalKeyStore(_0x40a000['keys'], _0x0_0x262559({ 'level': 'fatal' })['child']({ 'level': 'fatal' }))
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
                const _0x21e151 = _0x51f049['currentSocket'];
                _0x21e151['ev']['on']('connection.update', async _0x5963f2 => {
                    if (_0x51f049['isCleaningUp'])
                        return;
                    const {
                        connection: _0x1509c6,
                        lastDisconnect: _0x5de475,
                        isNewLogin: _0x2d0bd3
                    } = _0x5963f2;
                    if (_0x1509c6 === 'open') {
                        if (_0x51f049['sessionCompleted'])
                            return;
                        _0x51f049['sessionCompleted'] = !![];
                        try {
                            const _0x33900b = _0x51f049['sessionDir'] + '/creds.json';
                            const _0x25e7ad = './session';
                            if (!await _0x0_0x4b728c['pathExists'](_0x25e7ad)) {
                                await _0x0_0x4b728c['mkdir'](_0x25e7ad, { 'recursive': !![] });
                            }
                            if (await _0x0_0x4b728c['pathExists'](_0x33900b)) {
                                await _0x0_0x4b728c['copy'](_0x51f049['sessionDir'], _0x25e7ad);
                                console['log']('✅\x20Session\x20credentials\x20saved\x20to\x20main\x20session\x20directory');
                            }
                            await delay(0xbb8);
                            if (_0x0_0x4b728c['existsSync'](_0x33900b)) {
                                const _0x113fa5 = JSON['parse'](await _0x0_0x4b728c['readFile'](_0x33900b, 'utf-8'));
                                const _0x4d7f0f = _0x51f049['phoneNumber'] || Object['keys'](_0x113fa5['me'] || {})[0x0]?.['split']('@')[0x0] || null;
                                const _0x59769c = await _0x0_0x3b6be8['saveSession'](_0x113fa5, _0x4d7f0f);
                                console['log']('✅\x20Session\x20saved\x20to\x20database:\x20' + _0x59769c);
                                const _0x4f6887 = Object['keys'](_0x21e151['authState']['creds']['me'] || {})['length'] > 0x0 ? jidNormalizedUser(_0x21e151['authState']['creds']['me']['id']) : jidNormalizedUser(_0x51f049['phoneNumber'] + '@s.whatsapp.net');
                                if (_0x4f6887) {
                                    await delay(0x7d0);
                                    const _0x26d657 = await _0x21e151['sendMessage'](_0x4f6887, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x59769c + '`\x0a\x0a📌\x20SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE,DON\x27T\x20SHARE\x20IT!' });
                                    await _0x21e151['sendMessage'](_0x4f6887, { 'quoted': _0x26d657 });
                                }
                            }
                        } catch (_0x12bf30) {
                            console['error']('Error\x20saving\x20session:', _0x12bf30);
                        } finally {
                            setTimeout(async () => {
                                await this['cleanup'](_0x15d0d5, 'session_complete');
                            }, 0x2710);
                        }
                    }
                    if (_0x2d0bd3)
                        console['log']('🔐\x20New\x20login\x20via\x20pair\x20code\x20for\x20' + _0x51f049['phoneNumber']);
                    if (_0x1509c6 === 'close') {
                        if (_0x51f049['sessionCompleted'] || _0x51f049['isCleaningUp']) {
                            await this['cleanup'](_0x15d0d5, 'already_complete');
                            return;
                        }
                        const _0x2bfa6d = _0x5de475?.['error']?.['output']?.['statusCode'];
                        if (_0x2bfa6d === DisconnectReason['loggedOut'] || _0x2bfa6d === 0x191) {
                            await this['cleanup'](_0x15d0d5, 'logged_out');
                            _0x21468f(new Error('Invalid\x20pairing\x20code\x20or\x20session\x20expired'));
                        } else if (_0x51f049['pairingCodeSent'] && !_0x51f049['sessionCompleted']) {
                            if (_0x51f049['reconnectAttempts'] < MAX_RECONNECT_ATTEMPTS) {
                                _0x51f049['reconnectAttempts']++;
                                await delay(0x7d0);
                                await this['initiatePairSession'](_0x15d0d5);
                            } else {
                                await this['cleanup'](_0x15d0d5, 'max_reconnects');
                                _0x21468f(new Error('Max\x20reconnection\x20attempts\x20reached'));
                            }
                        }
                    }
                });
                if (!_0x21e151['authState']['creds']['registered'] && !_0x51f049['pairingCodeSent'] && !_0x51f049['isCleaningUp']) {
                    await delay(0x5dc);
                    try {
                        _0x51f049['pairingCodeSent'] = !![];
                        let _0x1a2d08 = await _0x21e151['requestPairingCode'](_0x51f049['phoneNumber']);
                        _0x1a2d08 = _0x1a2d08?.['match'](/.{1,4}/g)?.['join']('-') || _0x1a2d08;
                        _0x2aeca2({
                            'type': 'pair',
                            'code': _0x1a2d08,
                            'sessionId': _0x15d0d5,
                            'phoneNumber': _0x51f049['phoneNumber']
                        });
                    } catch (_0x77b903) {
                        _0x51f049['pairingCodeSent'] = ![];
                        _0x21468f(new Error('Failed\x20to\x20get\x20pairing\x20code:\x20' + _0x77b903['message']));
                    }
                }
                _0x21e151['ev']['on']('creds.update', _0x1e0d6a);
                _0x51f049['timeoutHandle'] = setTimeout(async () => {
                    if (!_0x51f049['sessionCompleted'] && !_0x51f049['isCleaningUp']) {
                        await this['cleanup'](_0x15d0d5, 'timeout');
                        _0x21468f(new Error('Pairing\x20timeout'));
                    }
                }, SESSION_TIMEOUT);
            } catch (_0x325b99) {
                console['error']('Error\x20initiating\x20pair\x20session:', _0x325b99);
                _0x21468f(_0x325b99);
            }
        });
    }
    ['isSessionComplete'](_0x5dd214) {
        const _0x1c58e1 = this['sessions']['get'](_0x5dd214);
        if (!_0x1c58e1)
            return ![];
        if (!_0x1c58e1['sessionCompleted'])
            return ![];
        try {
            const _0x7cb898 = _0x1c58e1['sessionDir'] + '/creds.json';
            const _0x4eea4e = './session/creds.json';
            let _0x48f16f = _0x0_0x4b728c['existsSync'](_0x4eea4e) ? _0x4eea4e : _0x0_0x4b728c['existsSync'](_0x7cb898) ? _0x7cb898 : null;
            if (_0x48f16f) {
                const _0x165e59 = JSON['parse'](_0x0_0x4b728c['readFileSync'](_0x48f16f, 'utf-8'));
                return _0x165e59['registered'] === !![] && !!_0x165e59['me']?.['id'];
            }
        } catch (_0x21d4eb) {
            console['error']('Error\x20verifying\x20physical\x20creds\x20in\x20isSessionComplete:', _0x21d4eb);
            return ![];
        }
        return ![];
    }
}
export default new PairingManager();