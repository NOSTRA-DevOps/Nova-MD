import _0x0_0x557c1b from 'fs-extra';
import _0x0_0x2af274 from 'pino';
import _0x0_0x3fae55 from 'qrcode';
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
import _0x0_0x334cad from 'awesome-phonenumber';
import _0x0_0x542b56 from './sessionManager.js';
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
        const _0xe7ca8f = Date['now']()['toString']() + Math['random']()['toString'](0x24)['substring'](0x2, 0x9);
        const _0x44192e = './temp_session_' + _0xe7ca8f;
        const _0x45dd66 = {
            'sessionId': _0xe7ca8f,
            'sessionDir': _0x44192e,
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
        this['sessions']['set'](_0xe7ca8f, _0x45dd66);
        return _0xe7ca8f;
    }
    async ['createPairSession'](_0x42a680) {
        if (!_0x42a680)
            throw new Error('Phone\x20number\x20is\x20required');
        _0x42a680 = _0x42a680['replace'](/[^0-9]/g, '');
        const _0x9f4804 = _0x0_0x334cad('+' + _0x42a680);
        if (!_0x9f4804['isValid']())
            throw new Error('Invalid\x20phone\x20number');
        _0x42a680 = _0x9f4804['getNumber']('e164')['replace']('+', '');
        const _0x829eba = Date['now']()['toString']() + Math['random']()['toString'](0x24)['substring'](0x2, 0x9);
        const _0x4f0185 = './temp_session_' + _0x829eba;
        const _0x43d64f = {
            'sessionId': _0x829eba,
            'sessionDir': _0x4f0185,
            'phoneNumber': _0x42a680,
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
        this['sessions']['set'](_0x829eba, _0x43d64f);
        return _0x829eba;
    }
    async ['removeSessionDir'](_0x47336f) {
        try {
            if (await _0x0_0x557c1b['pathExists'](_0x47336f)) {
                await _0x0_0x557c1b['remove'](_0x47336f);
                return !![];
            }
        } catch (_0x1e0219) {
            console['error']('Error\x20removing\x20session\x20dir:', _0x1e0219);
        }
        return ![];
    }
    async ['cleanupSessions']() {
        const _0x248889 = Date['now']();
        const _0x5f5c08 = [];
        for (const [_0x2636fa, _0xe2c35] of this['sessions']['entries']()) {
            if (_0x248889 - _0xe2c35['createdAt'] > SESSION_TIMEOUT) {
                _0x5f5c08['push'](_0x2636fa);
            }
        }
        for (const _0x17bfca of _0x5f5c08) {
            const _0x33abb8 = this['sessions']['get'](_0x17bfca);
            await this['cleanup'](_0x17bfca, 'session_expired');
        }
    }
    async ['cleanup'](_0x5b6960, _0x413cf2 = 'unknown') {
        const _0x3ac83e = this['sessions']['get'](_0x5b6960);
        if (!_0x3ac83e)
            return;
        if (_0x3ac83e['isCleaningUp'])
            return;
        console['log']('🧹\x20Cleanup\x20session\x20' + _0x5b6960 + '\x20-\x20' + _0x413cf2);
        if (_0x413cf2 === 'session_complete' || _0x3ac83e['sessionCompleted']) {
            if (_0x3ac83e['timeoutHandle']) {
                clearTimeout(_0x3ac83e['timeoutHandle']);
                _0x3ac83e['timeoutHandle'] = null;
            }
            this['sessions']['delete'](_0x5b6960);
            console['log']('✅\x20Socket\x20handed\x20over\x20to\x20index.js\x20successfully.');
            return;
        }
        _0x3ac83e['isCleaningUp'] = !![];
        if (_0x3ac83e['timeoutHandle']) {
            clearTimeout(_0x3ac83e['timeoutHandle']);
            _0x3ac83e['timeoutHandle'] = null;
        }
        if (_0x3ac83e['currentSocket']) {
            try {
                _0x3ac83e['currentSocket']['ev']['removeAllListeners']();
                await _0x3ac83e['currentSocket']['end']();
            } catch (_0x46a8ef) {
            }
            _0x3ac83e['currentSocket'] = null;
        }
        setTimeout(async () => {
            await this['removeSessionDir'](_0x3ac83e['sessionDir']);
            this['sessions']['delete'](_0x5b6960);
        }, 0x1388);
    }
    async ['saveSessionData'](_0x49b411, _0x2c107a, _0x3261b8) {
        if (this['sessionSaveInProgress']['get'](_0x3261b8)) {
            console['log']('⏳\x20Session\x20save\x20already\x20in\x20progress...');
            return;
        }
        this['sessionSaveInProgress']['set'](_0x3261b8, !![]);
        try {
            const _0x3774c4 = _0x49b411['sessionDir'] + '/creds.json';
            const _0x5923d6 = './session';
            if (!_0x0_0x557c1b['existsSync'](_0x3774c4)) {
                console['log']('❌\x20No\x20credentials\x20file\x20found');
                this['sessionSaveInProgress']['delete'](_0x3261b8);
                return;
            }
            const _0x1629ce = await _0x0_0x557c1b['readFile'](_0x3774c4, 'utf-8');
            const _0x4d92df = JSON['parse'](_0x1629ce);
            if (!_0x4d92df['me']?.['id']) {
                console['log']('⚠️\x20Session\x20not\x20valid\x20(no\x20me.id)');
                this['sessionSaveInProgress']['delete'](_0x3261b8);
                return;
            }
            console['log']('✅\x20Session\x20valid:\x20me.id\x20=\x20' + _0x4d92df['me']['id']);
            if (!_0x4d92df['registered']) {
                _0x4d92df['registered'] = !![];
                _0x0_0x557c1b['writeFileSync'](_0x3774c4, JSON['stringify'](_0x4d92df, null, 0x2));
                console['log']('🔧\x20Forced\x20registered:\x20true');
            }
            if (!await _0x0_0x557c1b['pathExists'](_0x5923d6)) {
                await _0x0_0x557c1b['mkdir'](_0x5923d6, { 'recursive': !![] });
            }
            await _0x0_0x557c1b['copy'](_0x49b411['sessionDir'], _0x5923d6);
            console['log']('✅\x20Session\x20credentials\x20saved\x20to\x20main\x20session\x20directory');
            let _0x44293b = _0x49b411['phoneNumber'] || null;
            if (!_0x44293b && _0x4d92df['me']?.['id']) {
                _0x44293b = _0x4d92df['me']['id']['split'](':')[0x0];
            }
            const _0x208123 = await _0x0_0x542b56['saveSession'](_0x4d92df, _0x44293b);
            console['log']('✅\x20Session\x20saved\x20to\x20database:\x20' + _0x208123);
            const _0x2768cc = _0x2c107a['authState']['creds']['me']?.['id'] ? jidNormalizedUser(_0x2c107a['authState']['creds']['me']['id']) : jidNormalizedUser(_0x49b411['phoneNumber'] + '@s.whatsapp.net');
            if (_0x2768cc) {
                const _0x5b350a = await _0x2c107a['sendMessage'](_0x2768cc, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x208123 + '`\x0a\x0a📌\x20*SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE\x20DON\x27T\x20SHARE\x20IT*\x20✅' });
                await _0x2c107a['sendMessage'](_0x2768cc, {
                    'text': MESSAGE,
                    'quoted': _0x5b350a
                });
                console['log']('✅\x20Success\x20message\x20sent');
            }
            _0x49b411['sessionCompleted'] = !![];
            _0x49b411['sessionSaved'] = !![];
            setTimeout(async () => {
                await this['cleanup'](_0x3261b8, 'session_complete');
            }, 0x1388);
        } catch (_0x3e6783) {
            console['error']('❌\x20Error\x20saving\x20session:', _0x3e6783);
        } finally {
            this['sessionSaveInProgress']['delete'](_0x3261b8);
        }
    }
    async ['initiateQRSession'](_0x30123b) {
        const _0x3cd236 = this['sessions']['get'](_0x30123b);
        if (!_0x3cd236)
            throw new Error('Session\x20not\x20found');
        return new Promise(async (_0x55da72, _0x1ba823) => {
            try {
                const {version: _0x132fb0} = await fetchLatestBaileysVersion();
                if (!await _0x0_0x557c1b['pathExists'](_0x3cd236['sessionDir'])) {
                    await _0x0_0x557c1b['mkdir'](_0x3cd236['sessionDir'], { 'recursive': !![] });
                }
                const {
                    state: _0x2aca32,
                    saveCreds: _0x379567
                } = await useMultiFileAuthState(_0x3cd236['sessionDir']);
                _0x3cd236['currentSocket'] = makeWASocket({
                    'version': _0x132fb0,
                    'logger': _0x0_0x2af274({ 'level': 'silent' }),
                    'browser': Browsers['macOS']('Chrome'),
                    'auth': {
                        'creds': _0x2aca32['creds'],
                        'keys': makeCacheableSignalKeyStore(_0x2aca32['keys'], _0x0_0x2af274({ 'level': 'fatal' })['child']({ 'level': 'fatal' }))
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
                const _0x199343 = _0x3cd236['currentSocket'];
                _0x199343['ev']['on']('creds.update', async _0x24e35e => {
                    console['log']('🔄\x20creds.update\x20triggered');
                    await _0x379567();
                    if (_0x24e35e['me']?.['id']) {
                        console['log']('✅\x20Session\x20valid\x20via\x20creds.update:\x20' + _0x24e35e['me']['id']);
                        _0x3cd236['credsUpdated'] = !![];
                        if (!_0x24e35e['registered']) {
                            _0x24e35e['registered'] = !![];
                            await _0x379567();
                            console['log']('🔧\x20Forced\x20registered:\x20true\x20via\x20creds.update');
                        }
                        if (!_0x3cd236['sessionSaved'] && !_0x3cd236['sessionCompleted']) {
                            await this['saveSessionData'](_0x3cd236, _0x199343, _0x30123b);
                        }
                    }
                });
                const _0xf10f8a = async _0x430250 => {
                    if (_0x3cd236['qrGenerated'] || _0x3cd236['sessionCompleted'] || _0x3cd236['isCleaningUp'])
                        return;
                    _0x3cd236['qrGenerated'] = !![];
                    try {
                        const _0x358080 = await _0x0_0x3fae55['toDataURL'](_0x430250, { 'errorCorrectionLevel': 'M' });
                        _0x55da72({
                            'type': 'qr',
                            'qr': _0x358080,
                            'sessionId': _0x30123b
                        });
                    } catch (_0x5273e2) {
                        console['error']('Error\x20generating\x20QR\x20code:', _0x5273e2);
                        _0x1ba823(_0x5273e2);
                    }
                };
                _0x199343['ev']['on']('connection.update', async _0x4f418b => {
                    if (_0x3cd236['isCleaningUp'])
                        return;
                    const {
                        connection: _0x2b3164,
                        lastDisconnect: _0xb8209,
                        qr: _0x4e0615,
                        isNewLogin: _0x69428e
                    } = _0x4f418b;
                    if (_0x4e0615 && !_0x3cd236['qrGenerated'] && !_0x3cd236['sessionCompleted']) {
                        await _0xf10f8a(_0x4e0615);
                    }
                    if (_0x69428e) {
                        console['log']('🔐\x20New\x20login\x20via\x20QR\x20code');
                    }
                    if (_0x2b3164 === 'open') {
                        console['log']('🔐\x20Connection\x20open');
                        if (_0x3cd236['sessionSaved'] || _0x3cd236['sessionCompleted'])
                            return;
                        if (_0x3cd236['credsUpdated']) {
                            const _0x503a83 = await this['saveSessionData'](_0x3cd236, _0x199343, _0x30123b);
                            const _0x408ef2 = Object['keys'](_0x199343['authState']['creds']['me'] || {})['length'] > 0x0 ? jidNormalizedUser(_0x199343['authState']['creds']['me']['id']) : null;
                            if (_0x408ef2) {
                                await delay(0x7d0);
                                const _0x451b95 = await _0x199343['sendMessage'](_0x408ef2, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x503a83 + '`\x0a\x0a📌\x20SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE,DON\x27T\x20SHARE\x20IT!' });
                                await _0x199343['sendMessage'](_0x408ef2, { 'quoted': _0x451b95 });
                            }
                        } else {
                            console['log']('⏳\x20Waiting\x20for\x20session\x20to\x20be\x20ready...');
                            await delay(0xbb8);
                            const _0x3e673d = _0x3cd236['sessionDir'] + '/creds.json';
                            if (_0x0_0x557c1b['existsSync'](_0x3e673d)) {
                                try {
                                    const _0x241cdd = await _0x0_0x557c1b['readFile'](_0x3e673d, 'utf-8');
                                    const _0x40ea07 = JSON['parse'](_0x241cdd);
                                    if (_0x40ea07['me']?.['id']) {
                                        console['log']('✅\x20Session\x20found\x20via\x20file\x20check');
                                        const _0x5ef9db = await this['saveSessionData'](_0x3cd236, _0x199343, _0x30123b);
                                        const _0x42ef5a = Object['keys'](_0x199343['authState']['creds']['me'] || {})['length'] > 0x0 ? jidNormalizedUser(_0x199343['authState']['creds']['me']['id']) : null;
                                        if (_0x42ef5a) {
                                            await delay(0x7d0);
                                            const _0x183422 = await _0x199343['sendMessage'](_0x42ef5a, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x5ef9db + '`\x0a\x0a📌\x20SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE,DON\x27T\x20SHARE\x20IT!' });
                                            await _0x199343['sendMessage'](_0x42ef5a, { 'quoted': _0x183422 });
                                        }
                                    }
                                } catch (_0x29887a) {
                                    console['log']('⚠️\x20File\x20check\x20failed:', _0x29887a['message']);
                                }
                            }
                        }
                    }
                    if (_0x2b3164 === 'close') {
                        console['log']('🔌\x20Connection\x20closed');
                        const _0x42edd4 = _0xb8209?.['error']?.['output']?.['statusCode'];
                        if (_0x42edd4 === DisconnectReason['restartRequired']) {
                            console['log']('🔄\x20Restart\x20required\x20-\x20Baileys\x20will\x20reconnect\x20automatically');
                            const _0x383ff2 = _0x3cd236['sessionDir'] + '/creds.json';
                            if (_0x0_0x557c1b['existsSync'](_0x383ff2)) {
                                try {
                                    const _0x495c83 = await _0x0_0x557c1b['readFile'](_0x383ff2, 'utf-8');
                                    const _0x59429d = JSON['parse'](_0x495c83);
                                    if (_0x59429d['me']?.['id']) {
                                        console['log']('✅\x20Session\x20found\x20via\x20file\x20check');
                                        const _0x29bd39 = await this['saveSessionData'](_0x3cd236, _0x199343, _0x30123b);
                                        const _0x4218f3 = Object['keys'](_0x199343['authState']['creds']['me'] || {})['length'] > 0x0 ? jidNormalizedUser(_0x199343['authState']['creds']['me']['id']) : null;
                                        if (_0x4218f3) {
                                            await delay(0x7d0);
                                            const _0x199eb7 = await _0x199343['sendMessage'](_0x4218f3, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x29bd39 + '`\x0a\x0a📌\x20SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE,DON\x27T\x20SHARE\x20IT!' });
                                            await _0x199343['sendMessage'](_0x4218f3, { 'quoted': _0x199eb7 });
                                        }
                                    }
                                } catch (_0x31eeef) {
                                    console['log']('⚠️\x20File\x20check\x20failed:', _0x31eeef['message']);
                                }
                            }
                            return;
                        }
                        if (_0x3cd236['sessionSaved'] || _0x3cd236['sessionCompleted']) {
                            await this['cleanup'](_0x30123b, 'session_complete');
                            return;
                        }
                        if (_0x42edd4 === DisconnectReason['loggedOut'] || _0x42edd4 === 0x191) {
                            await this['cleanup'](_0x30123b, 'logged_out');
                            _0x1ba823(new Error('Invalid\x20QR\x20code\x20or\x20session\x20expired'));
                        } else {
                            if (_0x3cd236['reconnectAttempts'] < MAX_RECONNECT_ATTEMPTS) {
                                _0x3cd236['reconnectAttempts']++;
                                await delay(0x7d0);
                                await this['initiateQRSession'](_0x30123b);
                            } else {
                                await this['cleanup'](_0x30123b, 'max_reconnects');
                                _0x1ba823(new Error('Max\x20reconnection\x20attempts\x20reached'));
                            }
                        }
                    }
                });
                _0x3cd236['timeoutHandle'] = setTimeout(async () => {
                    if (!_0x3cd236['sessionCompleted'] && !_0x3cd236['isCleaningUp']) {
                        await this['cleanup'](_0x30123b, 'timeout');
                        _0x1ba823(new Error('Session\x20timeout'));
                    }
                }, SESSION_TIMEOUT);
            } catch (_0x549711) {
                console['error']('Error\x20initiating\x20QR\x20session:', _0x549711);
                _0x1ba823(_0x549711);
            }
        });
    }
    async ['initiatePairSession'](_0x13e066) {
        const _0x365dd5 = this['sessions']['get'](_0x13e066);
        if (!_0x365dd5)
            throw new Error('Session\x20not\x20found');
        return new Promise(async (_0x504b84, _0x454603) => {
            try {
                const {version: _0x1a6b37} = await fetchLatestBaileysVersion();
                if (!await _0x0_0x557c1b['pathExists'](_0x365dd5['sessionDir'])) {
                    await _0x0_0x557c1b['mkdir'](_0x365dd5['sessionDir'], { 'recursive': !![] });
                }
                const {
                    state: _0x4c7e34,
                    saveCreds: _0x234f21
                } = await useMultiFileAuthState(_0x365dd5['sessionDir']);
                _0x365dd5['currentSocket'] = makeWASocket({
                    'version': _0x1a6b37,
                    'logger': _0x0_0x2af274({ 'level': 'silent' }),
                    'browser': Browsers['macOS']('Chrome'),
                    'auth': {
                        'creds': _0x4c7e34['creds'],
                        'keys': makeCacheableSignalKeyStore(_0x4c7e34['keys'], _0x0_0x2af274({ 'level': 'fatal' })['child']({ 'level': 'fatal' }))
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
                const _0x480364 = _0x365dd5['currentSocket'];
                _0x480364['ev']['on']('connection.update', async _0x3f641d => {
                    if (_0x365dd5['isCleaningUp'])
                        return;
                    const {
                        connection: _0x1235fe,
                        lastDisconnect: _0x161213,
                        isNewLogin: _0x46d2cc
                    } = _0x3f641d;
                    if (_0x1235fe === 'open') {
                        if (_0x365dd5['sessionCompleted'])
                            return;
                        _0x365dd5['sessionCompleted'] = !![];
                        try {
                            const _0x53a8e2 = _0x365dd5['sessionDir'] + '/creds.json';
                            const _0x2bd590 = './session';
                            if (!await _0x0_0x557c1b['pathExists'](_0x2bd590)) {
                                await _0x0_0x557c1b['mkdir'](_0x2bd590, { 'recursive': !![] });
                            }
                            if (await _0x0_0x557c1b['pathExists'](_0x53a8e2)) {
                                await _0x0_0x557c1b['copy'](_0x365dd5['sessionDir'], _0x2bd590);
                                console['log']('✅\x20Session\x20credentials\x20saved\x20to\x20main\x20session\x20directory');
                            }
                            await delay(0xbb8);
                            if (_0x0_0x557c1b['existsSync'](_0x53a8e2)) {
                                const _0x8c2af0 = JSON['parse'](await _0x0_0x557c1b['readFile'](_0x53a8e2, 'utf-8'));
                                const _0xfb44f = _0x365dd5['phoneNumber'] || Object['keys'](_0x8c2af0['me'] || {})[0x0]?.['split']('@')[0x0] || null;
                                const _0xc7879a = await _0x0_0x542b56['saveSession'](_0x8c2af0, _0xfb44f);
                                console['log']('✅\x20Session\x20saved\x20to\x20database:\x20' + _0xc7879a);
                                const _0x4343ed = Object['keys'](_0x480364['authState']['creds']['me'] || {})['length'] > 0x0 ? jidNormalizedUser(_0x480364['authState']['creds']['me']['id']) : jidNormalizedUser(_0x365dd5['phoneNumber'] + '@s.whatsapp.net');
                                if (_0x4343ed) {
                                    await delay(0x7d0);
                                    const _0x397ab9 = await _0x480364['sendMessage'](_0x4343ed, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0xc7879a + '`\x0a\x0a📌\x20SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE,DON\x27T\x20SHARE\x20IT!' });
                                    await _0x480364['sendMessage'](_0x4343ed, { 'quoted': _0x397ab9 });
                                }
                            }
                        } catch (_0x13e53e) {
                            console['error']('Error\x20saving\x20session:', _0x13e53e);
                        } finally {
                            setTimeout(async () => {
                                await this['cleanup'](_0x13e066, 'session_complete');
                            }, 0x2710);
                        }
                    }
                    if (_0x46d2cc)
                        console['log']('🔐\x20New\x20login\x20via\x20pair\x20code\x20for\x20' + _0x365dd5['phoneNumber']);
                    if (_0x1235fe === 'close') {
                        if (_0x365dd5['sessionCompleted'] || _0x365dd5['isCleaningUp']) {
                            await this['cleanup'](_0x13e066, 'already_complete');
                            return;
                        }
                        const _0x10d628 = _0x161213?.['error']?.['output']?.['statusCode'];
                        if (_0x10d628 === DisconnectReason['loggedOut'] || _0x10d628 === 0x191) {
                            await this['cleanup'](_0x13e066, 'logged_out');
                            _0x454603(new Error('Invalid\x20pairing\x20code\x20or\x20session\x20expired'));
                        } else if (_0x365dd5['pairingCodeSent'] && !_0x365dd5['sessionCompleted']) {
                            if (_0x365dd5['reconnectAttempts'] < MAX_RECONNECT_ATTEMPTS) {
                                _0x365dd5['reconnectAttempts']++;
                                await delay(0x7d0);
                                await this['initiatePairSession'](_0x13e066);
                            } else {
                                await this['cleanup'](_0x13e066, 'max_reconnects');
                                _0x454603(new Error('Max\x20reconnection\x20attempts\x20reached'));
                            }
                        }
                    }
                });
                if (!_0x480364['authState']['creds']['registered'] && !_0x365dd5['pairingCodeSent'] && !_0x365dd5['isCleaningUp']) {
                    await delay(0x5dc);
                    try {
                        _0x365dd5['pairingCodeSent'] = !![];
                        let _0x5a2e24 = await _0x480364['requestPairingCode'](_0x365dd5['phoneNumber']);
                        _0x5a2e24 = _0x5a2e24?.['match'](/.{1,4}/g)?.['join']('-') || _0x5a2e24;
                        _0x504b84({
                            'type': 'pair',
                            'code': _0x5a2e24,
                            'sessionId': _0x13e066,
                            'phoneNumber': _0x365dd5['phoneNumber']
                        });
                    } catch (_0x3c4d25) {
                        _0x365dd5['pairingCodeSent'] = ![];
                        _0x454603(new Error('Failed\x20to\x20get\x20pairing\x20code:\x20' + _0x3c4d25['message']));
                    }
                }
                _0x480364['ev']['on']('creds.update', _0x234f21);
                _0x365dd5['timeoutHandle'] = setTimeout(async () => {
                    if (!_0x365dd5['sessionCompleted'] && !_0x365dd5['isCleaningUp']) {
                        await this['cleanup'](_0x13e066, 'timeout');
                        _0x454603(new Error('Pairing\x20timeout'));
                    }
                }, SESSION_TIMEOUT);
            } catch (_0x1f80c0) {
                console['error']('Error\x20initiating\x20pair\x20session:', _0x1f80c0);
                _0x454603(_0x1f80c0);
            }
        });
    }
    ['isSessionComplete'](_0x4d2536) {
        const _0x14798d = this['sessions']['get'](_0x4d2536);
        if (!_0x14798d)
            return ![];
        if (!_0x14798d['sessionCompleted'])
            return ![];
        try {
            const _0x580f9c = _0x14798d['sessionDir'] + '/creds.json';
            const _0x539669 = './session/creds.json';
            let _0x555007 = _0x0_0x557c1b['existsSync'](_0x539669) ? _0x539669 : _0x0_0x557c1b['existsSync'](_0x580f9c) ? _0x580f9c : null;
            if (_0x555007) {
                const _0x4bfb80 = JSON['parse'](_0x0_0x557c1b['readFileSync'](_0x555007, 'utf-8'));
                return _0x4bfb80['registered'] === !![] && !!_0x4bfb80['me']?.['id'];
            }
        } catch (_0x12ccde) {
            console['error']('Error\x20verifying\x20physical\x20creds\x20in\x20isSessionComplete:', _0x12ccde);
            return ![];
        }
        return ![];
    }
}
export default new PairingManager();