import _0x0_0x17a7b2 from 'fs-extra';
import _0x0_0x276844 from 'pino';
import _0x0_0x13d6c0 from 'qrcode';
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
import _0x0_0x5bd76e from 'awesome-phonenumber';
import _0x0_0x2275b4 from './sessionManager.js';
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
        const _0x35c435 = Date['now']()['toString']() + Math['random']()['toString'](0x24)['substring'](0x2, 0x9);
        const _0x29eda4 = './temp_session_' + _0x35c435;
        const _0x1e9a07 = {
            'sessionId': _0x35c435,
            'sessionDir': _0x29eda4,
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
        this['sessions']['set'](_0x35c435, _0x1e9a07);
        return _0x35c435;
    }
    async ['createPairSession'](_0x22ac45) {
        if (!_0x22ac45)
            throw new Error('Phone\x20number\x20is\x20required');
        _0x22ac45 = _0x22ac45['replace'](/[^0-9]/g, '');
        const _0x365968 = _0x0_0x5bd76e('+' + _0x22ac45);
        if (!_0x365968['isValid']())
            throw new Error('Invalid\x20phone\x20number');
        _0x22ac45 = _0x365968['getNumber']('e164')['replace']('+', '');
        const _0x353f8b = Date['now']()['toString']() + Math['random']()['toString'](0x24)['substring'](0x2, 0x9);
        const _0x44668d = './temp_session_' + _0x353f8b;
        const _0x13203a = {
            'sessionId': _0x353f8b,
            'sessionDir': _0x44668d,
            'phoneNumber': _0x22ac45,
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
        this['sessions']['set'](_0x353f8b, _0x13203a);
        return _0x353f8b;
    }
    async ['removeSessionDir'](_0x538a4d) {
        try {
            if (await _0x0_0x17a7b2['pathExists'](_0x538a4d)) {
                await _0x0_0x17a7b2['remove'](_0x538a4d);
                return !![];
            }
        } catch (_0x16f111) {
            console['error']('Error\x20removing\x20session\x20dir:', _0x16f111);
        }
        return ![];
    }
    async ['cleanupSessions']() {
        const _0xcb12b5 = Date['now']();
        const _0xa5398c = [];
        for (const [_0x4c9d23, _0x5f2496] of this['sessions']['entries']()) {
            if (_0xcb12b5 - _0x5f2496['createdAt'] > SESSION_TIMEOUT) {
                _0xa5398c['push'](_0x4c9d23);
            }
        }
        for (const _0x2764d9 of _0xa5398c) {
            const _0x771e2a = this['sessions']['get'](_0x2764d9);
            await this['cleanup'](_0x2764d9, 'session_expired');
        }
    }
    async ['cleanup'](_0x1024d5, _0x37f818 = 'unknown') {
        const _0x396c8c = this['sessions']['get'](_0x1024d5);
        if (!_0x396c8c)
            return;
        if (_0x396c8c['isCleaningUp'])
            return;
        console['log']('🧹\x20Cleanup\x20session\x20' + _0x1024d5 + '\x20-\x20' + _0x37f818);
        if (_0x37f818 === 'session_complete' || _0x396c8c['sessionCompleted']) {
            if (_0x396c8c['timeoutHandle']) {
                clearTimeout(_0x396c8c['timeoutHandle']);
                _0x396c8c['timeoutHandle'] = null;
            }
            this['sessions']['delete'](_0x1024d5);
            console['log']('✅\x20Socket\x20handed\x20over\x20to\x20index.js\x20successfully.');
            return;
        }
        _0x396c8c['isCleaningUp'] = !![];
        if (_0x396c8c['timeoutHandle']) {
            clearTimeout(_0x396c8c['timeoutHandle']);
            _0x396c8c['timeoutHandle'] = null;
        }
        if (_0x396c8c['currentSocket']) {
            try {
                _0x396c8c['currentSocket']['ev']['removeAllListeners']();
                await _0x396c8c['currentSocket']['end']();
            } catch (_0x5a4b30) {
            }
            _0x396c8c['currentSocket'] = null;
        }
        setTimeout(async () => {
            await this['removeSessionDir'](_0x396c8c['sessionDir']);
            this['sessions']['delete'](_0x1024d5);
        }, 0x1388);
    }
    async ['saveSessionData'](_0x1c542b, _0x1467c6, _0x57e56e) {
        if (this['sessionSaveInProgress']['get'](_0x57e56e)) {
            console['log']('⏳\x20Session\x20save\x20already\x20in\x20progress...');
            return;
        }
        this['sessionSaveInProgress']['set'](_0x57e56e, !![]);
        try {
            const _0x3d8deb = _0x1c542b['sessionDir'] + '/creds.json';
            const _0x3cbaa5 = './session';
            if (!_0x0_0x17a7b2['existsSync'](_0x3d8deb)) {
                console['log']('❌\x20No\x20credentials\x20file\x20found');
                this['sessionSaveInProgress']['delete'](_0x57e56e);
                return;
            }
            const _0xeb2d95 = await _0x0_0x17a7b2['readFile'](_0x3d8deb, 'utf-8');
            const _0x419ea0 = JSON['parse'](_0xeb2d95);
            if (!_0x419ea0['me']?.['id']) {
                console['log']('⚠️\x20Session\x20not\x20valid\x20(no\x20me.id)');
                this['sessionSaveInProgress']['delete'](_0x57e56e);
                return;
            }
            console['log']('✅\x20Session\x20valid:\x20me.id\x20=\x20' + _0x419ea0['me']['id']);
            if (!_0x419ea0['registered']) {
                _0x419ea0['registered'] = !![];
                _0x0_0x17a7b2['writeFileSync'](_0x3d8deb, JSON['stringify'](_0x419ea0, null, 0x2));
                console['log']('🔧\x20Forced\x20registered:\x20true');
            }
            if (!await _0x0_0x17a7b2['pathExists'](_0x3cbaa5)) {
                await _0x0_0x17a7b2['mkdir'](_0x3cbaa5, { 'recursive': !![] });
            }
            await _0x0_0x17a7b2['copy'](_0x1c542b['sessionDir'], _0x3cbaa5);
            console['log']('✅\x20Session\x20credentials\x20saved\x20to\x20main\x20session\x20directory');
            let _0x24213a = _0x1c542b['phoneNumber'] || null;
            if (!_0x24213a && _0x419ea0['me']?.['id']) {
                _0x24213a = _0x419ea0['me']['id']['split'](':')[0x0];
            }
            const _0x2cb94c = await _0x0_0x2275b4['saveSession'](_0x419ea0, _0x24213a);
            console['log']('✅\x20Session\x20saved\x20to\x20database:\x20' + _0x2cb94c);
            const _0x123f2d = _0x1467c6['authState']['creds']['me']?.['id'] ? jidNormalizedUser(_0x1467c6['authState']['creds']['me']['id']) : jidNormalizedUser(_0x1c542b['phoneNumber'] + '@s.whatsapp.net');
            if (_0x123f2d) {
                const _0x4aeb15 = await _0x1467c6['sendMessage'](_0x123f2d, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x2cb94c + '`\x0a\x0a📌\x20*SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE\x20DON\x27T\x20SHARE\x20IT*\x20✅' });
                await _0x1467c6['sendMessage'](_0x123f2d, {
                    'text': MESSAGE,
                    'quoted': _0x4aeb15
                });
                console['log']('✅\x20Success\x20message\x20sent');
            }
            _0x1c542b['sessionCompleted'] = !![];
            _0x1c542b['sessionSaved'] = !![];
            setTimeout(async () => {
                await this['cleanup'](_0x57e56e, 'session_complete');
            }, 0x1388);
        } catch (_0x4c3f78) {
            console['error']('❌\x20Error\x20saving\x20session:', _0x4c3f78);
        } finally {
            this['sessionSaveInProgress']['delete'](_0x57e56e);
        }
    }
    async ['initiateQRSession'](_0x1cca2b) {
        const _0x2dba1a = this['sessions']['get'](_0x1cca2b);
        if (!_0x2dba1a)
            throw new Error('Session\x20not\x20found');
        return new Promise(async (_0x2d54dd, _0x18fca8) => {
            try {
                const {version: _0x8a0111} = await fetchLatestBaileysVersion();
                if (!await _0x0_0x17a7b2['pathExists'](_0x2dba1a['sessionDir'])) {
                    await _0x0_0x17a7b2['mkdir'](_0x2dba1a['sessionDir'], { 'recursive': !![] });
                }
                const {
                    state: _0x2b788a,
                    saveCreds: _0xe3b405
                } = await useMultiFileAuthState(_0x2dba1a['sessionDir']);
                _0x2dba1a['currentSocket'] = makeWASocket({
                    'version': _0x8a0111,
                    'logger': _0x0_0x276844({ 'level': 'silent' }),
                    'browser': Browsers['macOS']('Chrome'),
                    'auth': {
                        'creds': _0x2b788a['creds'],
                        'keys': makeCacheableSignalKeyStore(_0x2b788a['keys'], _0x0_0x276844({ 'level': 'fatal' })['child']({ 'level': 'fatal' }))
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
                const _0x3bfbbc = _0x2dba1a['currentSocket'];
                _0x3bfbbc['ev']['on']('creds.update', async _0xf1dbfd => {
                    console['log']('🔄\x20creds.update\x20triggered');
                    await _0xe3b405();
                    if (_0xf1dbfd['me']?.['id']) {
                        console['log']('✅\x20Session\x20valid\x20via\x20creds.update:\x20' + _0xf1dbfd['me']['id']);
                        _0x2dba1a['credsUpdated'] = !![];
                        if (!_0xf1dbfd['registered']) {
                            _0xf1dbfd['registered'] = !![];
                            await _0xe3b405();
                            console['log']('🔧\x20Forced\x20registered:\x20true\x20via\x20creds.update');
                        }
                        if (!_0x2dba1a['sessionSaved'] && !_0x2dba1a['sessionCompleted']) {
                            await this['saveSessionData'](_0x2dba1a, _0x3bfbbc, _0x1cca2b);
                        }
                    }
                });
                const _0x557360 = async _0x57e95 => {
                    if (_0x2dba1a['qrGenerated'] || _0x2dba1a['sessionCompleted'] || _0x2dba1a['isCleaningUp'])
                        return;
                    _0x2dba1a['qrGenerated'] = !![];
                    try {
                        const _0x49d6bc = await _0x0_0x13d6c0['toDataURL'](_0x57e95, { 'errorCorrectionLevel': 'M' });
                        _0x2d54dd({
                            'type': 'qr',
                            'qr': _0x49d6bc,
                            'sessionId': _0x1cca2b
                        });
                    } catch (_0x4958f0) {
                        console['error']('Error\x20generating\x20QR\x20code:', _0x4958f0);
                        _0x18fca8(_0x4958f0);
                    }
                };
                _0x3bfbbc['ev']['on']('connection.update', async _0x51b8ea => {
                    if (_0x2dba1a['isCleaningUp'])
                        return;
                    const {
                        connection: _0x42398b,
                        lastDisconnect: _0x369724,
                        qr: _0xddcfe8,
                        isNewLogin: _0x5c4d91
                    } = _0x51b8ea;
                    if (_0xddcfe8 && !_0x2dba1a['qrGenerated'] && !_0x2dba1a['sessionCompleted']) {
                        await _0x557360(_0xddcfe8);
                    }
                    if (_0x5c4d91) {
                        console['log']('🔐\x20New\x20login\x20via\x20QR\x20code');
                    }
                    if (_0x42398b === 'open') {
                        console['log']('🔐\x20Connection\x20open');
                        if (_0x2dba1a['sessionSaved'] || _0x2dba1a['sessionCompleted'])
                            return;
                        if (_0x2dba1a['credsUpdated']) {
                            const _0x1e0f6f = await this['saveSessionData'](_0x2dba1a, _0x3bfbbc, _0x1cca2b);
                            const _0x43ad55 = Object['keys'](_0x3bfbbc['authState']['creds']['me'] || {})['length'] > 0x0 ? jidNormalizedUser(_0x3bfbbc['authState']['creds']['me']['id']) : null;
                            if (_0x43ad55) {
                                await delay(0x7d0);
                                const _0x459483 = await _0x3bfbbc['sendMessage'](_0x43ad55, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x1e0f6f + '`\x0a\x0a📌\x20SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE,DON\x27T\x20SHARE\x20IT!' });
                                await _0x3bfbbc['sendMessage'](_0x43ad55, { 'quoted': _0x459483 });
                            }
                        } else {
                            console['log']('⏳\x20Waiting\x20for\x20session\x20to\x20be\x20ready...');
                            await delay(0xbb8);
                            const _0x591845 = _0x2dba1a['sessionDir'] + '/creds.json';
                            if (_0x0_0x17a7b2['existsSync'](_0x591845)) {
                                try {
                                    const _0x3cc40a = await _0x0_0x17a7b2['readFile'](_0x591845, 'utf-8');
                                    const _0x38436d = JSON['parse'](_0x3cc40a);
                                    if (_0x38436d['me']?.['id']) {
                                        console['log']('✅\x20Session\x20found\x20via\x20file\x20check');
                                        const _0x11fbf5 = await this['saveSessionData'](_0x2dba1a, _0x3bfbbc, _0x1cca2b);
                                        const _0x1bea3c = Object['keys'](_0x3bfbbc['authState']['creds']['me'] || {})['length'] > 0x0 ? jidNormalizedUser(_0x3bfbbc['authState']['creds']['me']['id']) : null;
                                        if (_0x1bea3c) {
                                            await delay(0x7d0);
                                            const _0x69090e = await _0x3bfbbc['sendMessage'](_0x1bea3c, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x11fbf5 + '`\x0a\x0a📌\x20SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE,DON\x27T\x20SHARE\x20IT!' });
                                            await _0x3bfbbc['sendMessage'](_0x1bea3c, { 'quoted': _0x69090e });
                                        }
                                    }
                                } catch (_0x266da2) {
                                    console['log']('⚠️\x20File\x20check\x20failed:', _0x266da2['message']);
                                }
                            }
                        }
                    }
                    if (_0x42398b === 'close') {
                        console['log']('🔌\x20Connection\x20closed');
                        const _0x211b04 = _0x369724?.['error']?.['output']?.['statusCode'];
                        if (_0x211b04 === DisconnectReason['restartRequired']) {
                            console['log']('🔄\x20Restart\x20required\x20-\x20Baileys\x20will\x20reconnect\x20automatically');
                            return;
                        }
                        if (_0x2dba1a['sessionSaved'] || _0x2dba1a['sessionCompleted']) {
                            await this['cleanup'](_0x1cca2b, 'session_complete');
                            return;
                        }
                        if (_0x211b04 === DisconnectReason['loggedOut'] || _0x211b04 === 0x191) {
                            await this['cleanup'](_0x1cca2b, 'logged_out');
                            _0x18fca8(new Error('Invalid\x20QR\x20code\x20or\x20session\x20expired'));
                        } else {
                            if (_0x2dba1a['reconnectAttempts'] < MAX_RECONNECT_ATTEMPTS) {
                                _0x2dba1a['reconnectAttempts']++;
                                await delay(0x7d0);
                                await this['initiateQRSession'](_0x1cca2b);
                            } else {
                                await this['cleanup'](_0x1cca2b, 'max_reconnects');
                                _0x18fca8(new Error('Max\x20reconnection\x20attempts\x20reached'));
                            }
                        }
                    }
                });
                _0x2dba1a['timeoutHandle'] = setTimeout(async () => {
                    if (!_0x2dba1a['sessionCompleted'] && !_0x2dba1a['isCleaningUp']) {
                        await this['cleanup'](_0x1cca2b, 'timeout');
                        _0x18fca8(new Error('Session\x20timeout'));
                    }
                }, SESSION_TIMEOUT);
            } catch (_0x564ce4) {
                console['error']('Error\x20initiating\x20QR\x20session:', _0x564ce4);
                _0x18fca8(_0x564ce4);
            }
        });
    }
    async ['initiatePairSession'](_0x220ce9) {
        const _0x53bbcf = this['sessions']['get'](_0x220ce9);
        if (!_0x53bbcf)
            throw new Error('Session\x20not\x20found');
        return new Promise(async (_0x486ddf, _0x1aa3bf) => {
            try {
                const {version: _0x37b335} = await fetchLatestBaileysVersion();
                if (!await _0x0_0x17a7b2['pathExists'](_0x53bbcf['sessionDir'])) {
                    await _0x0_0x17a7b2['mkdir'](_0x53bbcf['sessionDir'], { 'recursive': !![] });
                }
                const {
                    state: _0x406f7a,
                    saveCreds: _0x2691ff
                } = await useMultiFileAuthState(_0x53bbcf['sessionDir']);
                _0x53bbcf['currentSocket'] = makeWASocket({
                    'version': _0x37b335,
                    'logger': _0x0_0x276844({ 'level': 'silent' }),
                    'browser': Browsers['macOS']('Chrome'),
                    'auth': {
                        'creds': _0x406f7a['creds'],
                        'keys': makeCacheableSignalKeyStore(_0x406f7a['keys'], _0x0_0x276844({ 'level': 'fatal' })['child']({ 'level': 'fatal' }))
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
                const _0x55ca46 = _0x53bbcf['currentSocket'];
                _0x55ca46['ev']['on']('connection.update', async _0x11c029 => {
                    if (_0x53bbcf['isCleaningUp'])
                        return;
                    const {
                        connection: _0xd42d99,
                        lastDisconnect: _0xd9ed83,
                        isNewLogin: _0x27586f
                    } = _0x11c029;
                    if (_0xd42d99 === 'open') {
                        if (_0x53bbcf['sessionCompleted'])
                            return;
                        _0x53bbcf['sessionCompleted'] = !![];
                        try {
                            const _0xbc8bb1 = _0x53bbcf['sessionDir'] + '/creds.json';
                            const _0x49ade3 = './session';
                            if (!await _0x0_0x17a7b2['pathExists'](_0x49ade3)) {
                                await _0x0_0x17a7b2['mkdir'](_0x49ade3, { 'recursive': !![] });
                            }
                            if (await _0x0_0x17a7b2['pathExists'](_0xbc8bb1)) {
                                await _0x0_0x17a7b2['copy'](_0x53bbcf['sessionDir'], _0x49ade3);
                                console['log']('✅\x20Session\x20credentials\x20saved\x20to\x20main\x20session\x20directory');
                            }
                            await delay(0xbb8);
                            if (_0x0_0x17a7b2['existsSync'](_0xbc8bb1)) {
                                const _0x4c530f = JSON['parse'](await _0x0_0x17a7b2['readFile'](_0xbc8bb1, 'utf-8'));
                                const _0x336363 = _0x53bbcf['phoneNumber'] || Object['keys'](_0x4c530f['me'] || {})[0x0]?.['split']('@')[0x0] || null;
                                const _0xb8cee5 = await _0x0_0x2275b4['saveSession'](_0x4c530f, _0x336363);
                                console['log']('✅\x20Session\x20saved\x20to\x20database:\x20' + _0xb8cee5);
                                const _0x420223 = Object['keys'](_0x55ca46['authState']['creds']['me'] || {})['length'] > 0x0 ? jidNormalizedUser(_0x55ca46['authState']['creds']['me']['id']) : jidNormalizedUser(_0x53bbcf['phoneNumber'] + '@s.whatsapp.net');
                                if (_0x420223) {
                                    await delay(0x7d0);
                                    const _0x146b11 = await _0x55ca46['sendMessage'](_0x420223, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0xb8cee5 + '`\x0a\x0a📌\x20SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE,DON\x27T\x20SHARE\x20IT!' });
                                    await _0x55ca46['sendMessage'](_0x420223, { 'quoted': _0x146b11 });
                                }
                            }
                        } catch (_0x1971c4) {
                            console['error']('Error\x20saving\x20session:', _0x1971c4);
                        } finally {
                            setTimeout(async () => {
                                await this['cleanup'](_0x220ce9, 'session_complete');
                            }, 0x2710);
                        }
                    }
                    if (_0x27586f)
                        console['log']('🔐\x20New\x20login\x20via\x20pair\x20code\x20for\x20' + _0x53bbcf['phoneNumber']);
                    if (_0xd42d99 === 'close') {
                        if (_0x53bbcf['sessionCompleted'] || _0x53bbcf['isCleaningUp']) {
                            await this['cleanup'](_0x220ce9, 'already_complete');
                            return;
                        }
                        const _0x1f2d87 = _0xd9ed83?.['error']?.['output']?.['statusCode'];
                        if (_0x1f2d87 === DisconnectReason['loggedOut'] || _0x1f2d87 === 0x191) {
                            await this['cleanup'](_0x220ce9, 'logged_out');
                            _0x1aa3bf(new Error('Invalid\x20pairing\x20code\x20or\x20session\x20expired'));
                        } else if (_0x53bbcf['pairingCodeSent'] && !_0x53bbcf['sessionCompleted']) {
                            if (_0x53bbcf['reconnectAttempts'] < MAX_RECONNECT_ATTEMPTS) {
                                _0x53bbcf['reconnectAttempts']++;
                                await delay(0x7d0);
                                await this['initiatePairSession'](_0x220ce9);
                            } else {
                                await this['cleanup'](_0x220ce9, 'max_reconnects');
                                _0x1aa3bf(new Error('Max\x20reconnection\x20attempts\x20reached'));
                            }
                        }
                    }
                });
                if (!_0x55ca46['authState']['creds']['registered'] && !_0x53bbcf['pairingCodeSent'] && !_0x53bbcf['isCleaningUp']) {
                    await delay(0x5dc);
                    try {
                        _0x53bbcf['pairingCodeSent'] = !![];
                        let _0x1f5bc4 = await _0x55ca46['requestPairingCode'](_0x53bbcf['phoneNumber']);
                        _0x1f5bc4 = _0x1f5bc4?.['match'](/.{1,4}/g)?.['join']('-') || _0x1f5bc4;
                        _0x486ddf({
                            'type': 'pair',
                            'code': _0x1f5bc4,
                            'sessionId': _0x220ce9,
                            'phoneNumber': _0x53bbcf['phoneNumber']
                        });
                    } catch (_0x42fc0d) {
                        _0x53bbcf['pairingCodeSent'] = ![];
                        _0x1aa3bf(new Error('Failed\x20to\x20get\x20pairing\x20code:\x20' + _0x42fc0d['message']));
                    }
                }
                _0x55ca46['ev']['on']('creds.update', _0x2691ff);
                _0x53bbcf['timeoutHandle'] = setTimeout(async () => {
                    if (!_0x53bbcf['sessionCompleted'] && !_0x53bbcf['isCleaningUp']) {
                        await this['cleanup'](_0x220ce9, 'timeout');
                        _0x1aa3bf(new Error('Pairing\x20timeout'));
                    }
                }, SESSION_TIMEOUT);
            } catch (_0x4ddec9) {
                console['error']('Error\x20initiating\x20pair\x20session:', _0x4ddec9);
                _0x1aa3bf(_0x4ddec9);
            }
        });
    }
    ['isSessionComplete'](_0x571a69) {
        const _0x292aac = this['sessions']['get'](_0x571a69);
        if (!_0x292aac)
            return ![];
        if (!_0x292aac['sessionCompleted'])
            return ![];
        try {
            const _0x18ad91 = _0x292aac['sessionDir'] + '/creds.json';
            const _0xd71da6 = './session/creds.json';
            let _0x27f3 = _0x0_0x17a7b2['existsSync'](_0xd71da6) ? _0xd71da6 : _0x0_0x17a7b2['existsSync'](_0x18ad91) ? _0x18ad91 : null;
            if (_0x27f3) {
                const _0x514698 = JSON['parse'](_0x0_0x17a7b2['readFileSync'](_0x27f3, 'utf-8'));
                return _0x514698['registered'] === !![] && !!_0x514698['me']?.['id'];
            }
        } catch (_0x1bae8b) {
            console['error']('Error\x20verifying\x20physical\x20creds\x20in\x20isSessionComplete:', _0x1bae8b);
            return ![];
        }
        return ![];
    }
}
export default new PairingManager();