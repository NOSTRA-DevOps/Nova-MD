import _0x0_0x390f17 from 'fs-extra';
import _0x0_0xd80564 from 'pino';
import _0x0_0x13717b from 'qrcode';
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
import _0x0_0x506e4b from 'awesome-phonenumber';
import _0x0_0x15f769 from './sessionManager.js';
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
        const _0x4b9814 = Date['now']()['toString']() + Math['random']()['toString'](0x24)['substring'](0x2, 0x9);
        const _0x553211 = './temp_session_' + _0x4b9814;
        const _0x2cb78d = {
            'sessionId': _0x4b9814,
            'sessionDir': _0x553211,
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
        this['sessions']['set'](_0x4b9814, _0x2cb78d);
        return _0x4b9814;
    }
    async ['createPairSession'](_0x1771cf) {
        if (!_0x1771cf)
            throw new Error('Phone\x20number\x20is\x20required');
        _0x1771cf = _0x1771cf['replace'](/[^0-9]/g, '');
        const _0x38aade = _0x0_0x506e4b('+' + _0x1771cf);
        if (!_0x38aade['isValid']())
            throw new Error('Invalid\x20phone\x20number');
        _0x1771cf = _0x38aade['getNumber']('e164')['replace']('+', '');
        const _0x5112cc = Date['now']()['toString']() + Math['random']()['toString'](0x24)['substring'](0x2, 0x9);
        const _0xe61bcc = './temp_session_' + _0x5112cc;
        const _0x5bb634 = {
            'sessionId': _0x5112cc,
            'sessionDir': _0xe61bcc,
            'phoneNumber': _0x1771cf,
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
        this['sessions']['set'](_0x5112cc, _0x5bb634);
        return _0x5112cc;
    }
    async ['removeSessionDir'](_0x3ed9ac) {
        try {
            if (await _0x0_0x390f17['pathExists'](_0x3ed9ac)) {
                await _0x0_0x390f17['remove'](_0x3ed9ac);
                return !![];
            }
        } catch (_0x1d037b) {
            console['error']('Error\x20removing\x20session\x20dir:', _0x1d037b);
        }
        return ![];
    }
    async ['cleanupSessions']() {
        const _0x24bf55 = Date['now']();
        const _0x5155d5 = [];
        for (const [_0x4a18a8, _0xc45ba5] of this['sessions']['entries']()) {
            if (_0x24bf55 - _0xc45ba5['createdAt'] > SESSION_TIMEOUT) {
                _0x5155d5['push'](_0x4a18a8);
            }
        }
        for (const _0x1566e4 of _0x5155d5) {
            const _0x2e1bdb = this['sessions']['get'](_0x1566e4);
            await this['cleanup'](_0x1566e4, 'session_expired');
        }
    }
    async ['cleanup'](_0x4a4303, _0x3fe879 = 'unknown') {
        const _0x515cf6 = this['sessions']['get'](_0x4a4303);
        if (!_0x515cf6)
            return;
        if (_0x515cf6['isCleaningUp'])
            return;
        console['log']('🧹\x20Cleanup\x20session\x20' + _0x4a4303 + '\x20-\x20' + _0x3fe879);
        if (_0x3fe879 === 'session_complete' || _0x515cf6['sessionCompleted']) {
            if (_0x515cf6['timeoutHandle']) {
                clearTimeout(_0x515cf6['timeoutHandle']);
                _0x515cf6['timeoutHandle'] = null;
            }
            this['sessions']['delete'](_0x4a4303);
            console['log']('✅\x20Socket\x20handed\x20over\x20to\x20index.js\x20successfully.');
            return;
        }
        _0x515cf6['isCleaningUp'] = !![];
        if (_0x515cf6['timeoutHandle']) {
            clearTimeout(_0x515cf6['timeoutHandle']);
            _0x515cf6['timeoutHandle'] = null;
        }
        if (_0x515cf6['currentSocket']) {
            try {
                _0x515cf6['currentSocket']['ev']['removeAllListeners']();
                await _0x515cf6['currentSocket']['end']();
            } catch (_0x1764da) {
            }
            _0x515cf6['currentSocket'] = null;
        }
        setTimeout(async () => {
            await this['removeSessionDir'](_0x515cf6['sessionDir']);
            this['sessions']['delete'](_0x4a4303);
        }, 0x1388);
    }
    async ['saveSessionData'](_0x186740, _0x7c80f6, _0xaf5395) {
        if (this['sessionSaveInProgress']['get'](_0xaf5395)) {
            console['log']('⏳\x20Session\x20save\x20already\x20in\x20progress...');
            return;
        }
        this['sessionSaveInProgress']['set'](_0xaf5395, !![]);
        try {
            const _0x1bbfb1 = _0x186740['sessionDir'] + '/creds.json';
            const _0x2a1b6f = './session';
            if (!_0x0_0x390f17['existsSync'](_0x1bbfb1)) {
                console['log']('❌\x20No\x20credentials\x20file\x20found');
                this['sessionSaveInProgress']['delete'](_0xaf5395);
                return;
            }
            const _0x261b55 = await _0x0_0x390f17['readFile'](_0x1bbfb1, 'utf-8');
            const _0x2f34cb = JSON['parse'](_0x261b55);
            if (!_0x2f34cb['me']?.['id']) {
                console['log']('⚠️\x20Session\x20not\x20valid\x20(no\x20me.id)');
                this['sessionSaveInProgress']['delete'](_0xaf5395);
                return;
            }
            console['log']('✅\x20Session\x20valid:\x20me.id\x20=\x20' + _0x2f34cb['me']['id']);
            if (!_0x2f34cb['registered']) {
                _0x2f34cb['registered'] = !![];
                _0x0_0x390f17['writeFileSync'](_0x1bbfb1, JSON['stringify'](_0x2f34cb, null, 0x2));
                console['log']('🔧\x20Forced\x20registered:\x20true');
            }
            if (!await _0x0_0x390f17['pathExists'](_0x2a1b6f)) {
                await _0x0_0x390f17['mkdir'](_0x2a1b6f, { 'recursive': !![] });
            }
            await _0x0_0x390f17['copy'](_0x186740['sessionDir'], _0x2a1b6f);
            console['log']('✅\x20Session\x20credentials\x20saved\x20to\x20main\x20session\x20directory');
            let _0x369bfd = _0x186740['phoneNumber'] || null;
            if (!_0x369bfd && _0x2f34cb['me']?.['id']) {
                _0x369bfd = _0x2f34cb['me']['id']['split'](':')[0x0];
            }
            const _0xe7b2f = await _0x0_0x15f769['saveSession'](_0x2f34cb, _0x369bfd);
            console['log']('✅\x20Session\x20saved\x20to\x20database:\x20' + _0xe7b2f);
            const _0x44136b = _0x7c80f6['authState']['creds']['me']?.['id'] ? jidNormalizedUser(_0x7c80f6['authState']['creds']['me']['id']) : jidNormalizedUser(_0x186740['phoneNumber'] + '@s.whatsapp.net');
            if (_0x44136b) {
                const _0x1ad46f = await _0x7c80f6['sendMessage'](_0x44136b, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0xe7b2f + '`\x0a\x0a📌\x20*SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE\x20DON\x27T\x20SHARE\x20IT*\x20✅' });
                await _0x7c80f6['sendMessage'](_0x44136b, {
                    'text': MESSAGE,
                    'quoted': _0x1ad46f
                });
                console['log']('✅\x20Success\x20message\x20sent');
            }
            _0x186740['sessionCompleted'] = !![];
            _0x186740['sessionSaved'] = !![];
            setTimeout(async () => {
                await this['cleanup'](_0xaf5395, 'session_complete');
            }, 0x1388);
        } catch (_0x58b846) {
            console['error']('❌\x20Error\x20saving\x20session:', _0x58b846);
        } finally {
            this['sessionSaveInProgress']['delete'](_0xaf5395);
        }
    }
    async ['initiateQRSession'](_0x3c2a65) {
        const _0x275b0f = this['sessions']['get'](_0x3c2a65);
        if (!_0x275b0f)
            throw new Error('Session\x20not\x20found');
        return new Promise(async (_0x1756f6, _0x4b4826) => {
            try {
                const {version: _0x23f195} = await fetchLatestBaileysVersion();
                if (!await _0x0_0x390f17['pathExists'](_0x275b0f['sessionDir'])) {
                    await _0x0_0x390f17['mkdir'](_0x275b0f['sessionDir'], { 'recursive': !![] });
                }
                const {
                    state: _0x3209a7,
                    saveCreds: _0x4bd598
                } = await useMultiFileAuthState(_0x275b0f['sessionDir']);
                _0x275b0f['currentSocket'] = makeWASocket({
                    'version': _0x23f195,
                    'logger': _0x0_0xd80564({ 'level': 'silent' }),
                    'browser': Browsers['macOS']('Chrome'),
                    'auth': {
                        'creds': _0x3209a7['creds'],
                        'keys': makeCacheableSignalKeyStore(_0x3209a7['keys'], _0x0_0xd80564({ 'level': 'fatal' })['child']({ 'level': 'fatal' }))
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
                const _0x476ab0 = _0x275b0f['currentSocket'];
                _0x476ab0['ev']['on']('creds.update', async _0x2d8b8f => {
                    console['log']('🔄\x20creds.update\x20triggered');
                    await _0x4bd598();
                    if (_0x2d8b8f['me']?.['id']) {
                        console['log']('✅\x20Session\x20valid\x20via\x20creds.update:\x20' + _0x2d8b8f['me']['id']);
                        _0x275b0f['credsUpdated'] = !![];
                        if (!_0x2d8b8f['registered']) {
                            _0x2d8b8f['registered'] = !![];
                            await _0x4bd598();
                            console['log']('🔧\x20Forced\x20registered:\x20true\x20via\x20creds.update');
                        }
                        if (!_0x275b0f['sessionSaved'] && !_0x275b0f['sessionCompleted']) {
                            await this['saveSessionData'](_0x275b0f, _0x476ab0, _0x3c2a65);
                        }
                    }
                });
                const _0x485abc = async _0x162410 => {
                    if (_0x275b0f['qrGenerated'] || _0x275b0f['sessionCompleted'] || _0x275b0f['isCleaningUp'])
                        return;
                    _0x275b0f['qrGenerated'] = !![];
                    try {
                        const _0x3b8ed0 = await _0x0_0x13717b['toDataURL'](_0x162410, { 'errorCorrectionLevel': 'M' });
                        _0x1756f6({
                            'type': 'qr',
                            'qr': _0x3b8ed0,
                            'sessionId': _0x3c2a65
                        });
                    } catch (_0x21a776) {
                        console['error']('Error\x20generating\x20QR\x20code:', _0x21a776);
                        _0x4b4826(_0x21a776);
                    }
                };
                _0x476ab0['ev']['on']('connection.update', async _0x201718 => {
                    if (_0x275b0f['isCleaningUp'])
                        return;
                    const {
                        connection: _0x18d74a,
                        lastDisconnect: _0x4febd7,
                        qr: _0x571dde,
                        isNewLogin: _0x5e4b81
                    } = _0x201718;
                    if (_0x571dde && !_0x275b0f['qrGenerated'] && !_0x275b0f['sessionCompleted']) {
                        await _0x485abc(_0x571dde);
                    }
                    if (_0x5e4b81) {
                        console['log']('🔐\x20New\x20login\x20via\x20QR\x20code');
                    }
                    if (_0x18d74a === 'open') {
                        console['log']('🔐\x20Connection\x20open');
                        if (_0x275b0f['sessionSaved'] || _0x275b0f['sessionCompleted'])
                            return;
                        if (_0x275b0f['credsUpdated']) {
                            const _0x22264f = await this['saveSessionData'](_0x275b0f, _0x476ab0, _0x3c2a65);
                            const _0xaea7b4 = Object['keys'](_0x476ab0['authState']['creds']['me'] || {})['length'] > 0x0 ? jidNormalizedUser(_0x476ab0['authState']['creds']['me']['id']) : null;
                            if (_0xaea7b4) {
                                await delay(0x7d0);
                                const _0x2bbdff = await _0x476ab0['sendMessage'](_0xaea7b4, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x22264f + '`\x0a\x0a📌\x20SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE,DON\x27T\x20SHARE\x20IT!' });
                                await _0x476ab0['sendMessage'](_0xaea7b4, { 'quoted': _0x2bbdff });
                            }
                        } else {
                            console['log']('⏳\x20Waiting\x20for\x20session\x20to\x20be\x20ready...');
                            await delay(0xbb8);
                            const _0x5a5a6e = _0x275b0f['sessionDir'] + '/creds.json';
                            if (_0x0_0x390f17['existsSync'](_0x5a5a6e)) {
                                try {
                                    const _0x5f2350 = await _0x0_0x390f17['readFile'](_0x5a5a6e, 'utf-8');
                                    const _0x117a7c = JSON['parse'](_0x5f2350);
                                    if (_0x117a7c['me']?.['id']) {
                                        console['log']('✅\x20Session\x20found\x20via\x20file\x20check');
                                        const _0x17628b = await this['saveSessionData'](_0x275b0f, _0x476ab0, _0x3c2a65);
                                        const _0x48070c = Object['keys'](_0x476ab0['authState']['creds']['me'] || {})['length'] > 0x0 ? jidNormalizedUser(_0x476ab0['authState']['creds']['me']['id']) : null;
                                        if (_0x48070c) {
                                            await delay(0x7d0);
                                            const _0x24062c = await _0x476ab0['sendMessage'](_0x48070c, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x17628b + '`\x0a\x0a📌\x20SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE,DON\x27T\x20SHARE\x20IT!' });
                                            await _0x476ab0['sendMessage'](_0x48070c, { 'quoted': _0x24062c });
                                        }
                                    }
                                } catch (_0x25f4f8) {
                                    console['log']('⚠️\x20File\x20check\x20failed:', _0x25f4f8['message']);
                                }
                            }
                        }
                    }
                    if (_0x18d74a === 'close') {
                        console['log']('🔌\x20Connection\x20closed');
                        const _0xed6d24 = _0x4febd7?.['error']?.['output']?.['statusCode'];
                        if (_0xed6d24 === DisconnectReason['restartRequired']) {
                            console['log']('🔄\x20Restart\x20required\x20-\x20Baileys\x20will\x20reconnect\x20automatically');
                            return;
                        }
                        if (_0x275b0f['sessionSaved'] || _0x275b0f['sessionCompleted']) {
                            await this['cleanup'](_0x3c2a65, 'session_complete');
                            return;
                        }
                        if (_0xed6d24 === DisconnectReason['loggedOut'] || _0xed6d24 === 0x191) {
                            await this['cleanup'](_0x3c2a65, 'logged_out');
                            _0x4b4826(new Error('Invalid\x20QR\x20code\x20or\x20session\x20expired'));
                        } else {
                            if (_0x275b0f['reconnectAttempts'] < MAX_RECONNECT_ATTEMPTS) {
                                _0x275b0f['reconnectAttempts']++;
                                await delay(0x7d0);
                                await this['initiateQRSession'](_0x3c2a65);
                            } else {
                                await this['cleanup'](_0x3c2a65, 'max_reconnects');
                                _0x4b4826(new Error('Max\x20reconnection\x20attempts\x20reached'));
                            }
                        }
                    }
                });
                _0x275b0f['timeoutHandle'] = setTimeout(async () => {
                    if (!_0x275b0f['sessionCompleted'] && !_0x275b0f['isCleaningUp']) {
                        await this['cleanup'](_0x3c2a65, 'timeout');
                        _0x4b4826(new Error('Session\x20timeout'));
                    }
                }, SESSION_TIMEOUT);
            } catch (_0x29568a) {
                console['error']('Error\x20initiating\x20QR\x20session:', _0x29568a);
                _0x4b4826(_0x29568a);
            }
        });
    }
    async ['initiatePairSession'](_0x912c2) {
        const _0xc44211 = this['sessions']['get'](_0x912c2);
        if (!_0xc44211)
            throw new Error('Session\x20not\x20found');
        return new Promise(async (_0x4ace0a, _0x38d13a) => {
            try {
                const {version: _0x3e083c} = await fetchLatestBaileysVersion();
                if (!await _0x0_0x390f17['pathExists'](_0xc44211['sessionDir'])) {
                    await _0x0_0x390f17['mkdir'](_0xc44211['sessionDir'], { 'recursive': !![] });
                }
                const {
                    state: _0x2d17de,
                    saveCreds: _0x225ece
                } = await useMultiFileAuthState(_0xc44211['sessionDir']);
                _0xc44211['currentSocket'] = makeWASocket({
                    'version': _0x3e083c,
                    'logger': _0x0_0xd80564({ 'level': 'silent' }),
                    'browser': Browsers['macOS']('Chrome'),
                    'auth': {
                        'creds': _0x2d17de['creds'],
                        'keys': makeCacheableSignalKeyStore(_0x2d17de['keys'], _0x0_0xd80564({ 'level': 'fatal' })['child']({ 'level': 'fatal' }))
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
                const _0x379258 = _0xc44211['currentSocket'];
                _0x379258['ev']['on']('connection.update', async _0x17b704 => {
                    if (_0xc44211['isCleaningUp'])
                        return;
                    const {
                        connection: _0x3d768f,
                        lastDisconnect: _0x132b60,
                        isNewLogin: _0x2443d7
                    } = _0x17b704;
                    if (_0x3d768f === 'open') {
                        if (_0xc44211['sessionCompleted'])
                            return;
                        _0xc44211['sessionCompleted'] = !![];
                        try {
                            const _0x5f5347 = _0xc44211['sessionDir'] + '/creds.json';
                            const _0x32d7cd = './session';
                            if (!await _0x0_0x390f17['pathExists'](_0x32d7cd)) {
                                await _0x0_0x390f17['mkdir'](_0x32d7cd, { 'recursive': !![] });
                            }
                            if (await _0x0_0x390f17['pathExists'](_0x5f5347)) {
                                await _0x0_0x390f17['copy'](_0xc44211['sessionDir'], _0x32d7cd);
                                console['log']('✅\x20Session\x20credentials\x20saved\x20to\x20main\x20session\x20directory');
                            }
                            await delay(0xbb8);
                            if (_0x0_0x390f17['existsSync'](_0x5f5347)) {
                                const _0x1ad42b = JSON['parse'](await _0x0_0x390f17['readFile'](_0x5f5347, 'utf-8'));
                                const _0x25ab05 = _0xc44211['phoneNumber'] || Object['keys'](_0x1ad42b['me'] || {})[0x0]?.['split']('@')[0x0] || null;
                                const _0x5b60a4 = await _0x0_0x15f769['saveSession'](_0x1ad42b, _0x25ab05);
                                console['log']('✅\x20Session\x20saved\x20to\x20database:\x20' + _0x5b60a4);
                                const _0x7cfa0c = Object['keys'](_0x379258['authState']['creds']['me'] || {})['length'] > 0x0 ? jidNormalizedUser(_0x379258['authState']['creds']['me']['id']) : jidNormalizedUser(_0xc44211['phoneNumber'] + '@s.whatsapp.net');
                                if (_0x7cfa0c) {
                                    await delay(0x7d0);
                                    const _0x1d8605 = await _0x379258['sendMessage'](_0x7cfa0c, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x5b60a4 + '`\x0a\x0a📌\x20SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE,DON\x27T\x20SHARE\x20IT!' });
                                    await _0x379258['sendMessage'](_0x7cfa0c, { 'quoted': _0x1d8605 });
                                }
                            }
                        } catch (_0x1551b1) {
                            console['error']('Error\x20saving\x20session:', _0x1551b1);
                        } finally {
                            setTimeout(async () => {
                                await this['cleanup'](_0x912c2, 'session_complete');
                            }, 0x2710);
                        }
                    }
                    if (_0x2443d7)
                        console['log']('🔐\x20New\x20login\x20via\x20pair\x20code\x20for\x20' + _0xc44211['phoneNumber']);
                    if (_0x3d768f === 'close') {
                        if (_0xc44211['sessionCompleted'] || _0xc44211['isCleaningUp']) {
                            await this['cleanup'](_0x912c2, 'already_complete');
                            return;
                        }
                        const _0x4fe74b = _0x132b60?.['error']?.['output']?.['statusCode'];
                        if (_0x4fe74b === DisconnectReason['loggedOut'] || _0x4fe74b === 0x191) {
                            await this['cleanup'](_0x912c2, 'logged_out');
                            _0x38d13a(new Error('Invalid\x20pairing\x20code\x20or\x20session\x20expired'));
                        } else if (_0xc44211['pairingCodeSent'] && !_0xc44211['sessionCompleted']) {
                            if (_0xc44211['reconnectAttempts'] < MAX_RECONNECT_ATTEMPTS) {
                                _0xc44211['reconnectAttempts']++;
                                await delay(0x7d0);
                                await this['initiatePairSession'](_0x912c2);
                            } else {
                                await this['cleanup'](_0x912c2, 'max_reconnects');
                                _0x38d13a(new Error('Max\x20reconnection\x20attempts\x20reached'));
                            }
                        }
                    }
                });
                if (!_0x379258['authState']['creds']['registered'] && !_0xc44211['pairingCodeSent'] && !_0xc44211['isCleaningUp']) {
                    await delay(0x5dc);
                    try {
                        _0xc44211['pairingCodeSent'] = !![];
                        let _0x2de086 = await _0x379258['requestPairingCode'](_0xc44211['phoneNumber']);
                        _0x2de086 = _0x2de086?.['match'](/.{1,4}/g)?.['join']('-') || _0x2de086;
                        _0x4ace0a({
                            'type': 'pair',
                            'code': _0x2de086,
                            'sessionId': _0x912c2,
                            'phoneNumber': _0xc44211['phoneNumber']
                        });
                    } catch (_0x308127) {
                        _0xc44211['pairingCodeSent'] = ![];
                        _0x38d13a(new Error('Failed\x20to\x20get\x20pairing\x20code:\x20' + _0x308127['message']));
                    }
                }
                _0x379258['ev']['on']('creds.update', _0x225ece);
                _0xc44211['timeoutHandle'] = setTimeout(async () => {
                    if (!_0xc44211['sessionCompleted'] && !_0xc44211['isCleaningUp']) {
                        await this['cleanup'](_0x912c2, 'timeout');
                        _0x38d13a(new Error('Pairing\x20timeout'));
                    }
                }, SESSION_TIMEOUT);
            } catch (_0x47839a) {
                console['error']('Error\x20initiating\x20pair\x20session:', _0x47839a);
                _0x38d13a(_0x47839a);
            }
        });
    }
    ['isSessionComplete'](_0x33ac65) {
        const _0x16c217 = this['sessions']['get'](_0x33ac65);
        if (!_0x16c217)
            return ![];
        if (!_0x16c217['sessionCompleted'])
            return ![];
        try {
            const _0xa0d195 = _0x16c217['sessionDir'] + '/creds.json';
            const _0x5600a4 = './session/creds.json';
            let _0x25eb3a = _0x0_0x390f17['existsSync'](_0x5600a4) ? _0x5600a4 : _0x0_0x390f17['existsSync'](_0xa0d195) ? _0xa0d195 : null;
            if (_0x25eb3a) {
                const _0x5bf40c = JSON['parse'](_0x0_0x390f17['readFileSync'](_0x25eb3a, 'utf-8'));
                return _0x5bf40c['registered'] === !![] && !!_0x5bf40c['me']?.['id'];
            }
        } catch (_0x3a9a69) {
            console['error']('Error\x20verifying\x20physical\x20creds\x20in\x20isSessionComplete:', _0x3a9a69);
            return ![];
        }
        return ![];
    }
}
export default new PairingManager();