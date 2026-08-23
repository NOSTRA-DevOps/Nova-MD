import _0x0_0x522e7e from 'fs-extra';
import _0x0_0x362c4e from 'pino';
import _0x0_0x2155fd from 'qrcode';
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
import _0x0_0x1f2d48 from 'awesome-phonenumber';
import _0x0_0x59309b from './sessionManager.js';
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
        const _0xe64fca = Date['now']()['toString']() + Math['random']()['toString'](0x24)['substring'](0x2, 0x9);
        const _0x25fd60 = './temp_session_' + _0xe64fca;
        const _0x510e2f = {
            'sessionId': _0xe64fca,
            'sessionDir': _0x25fd60,
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
        this['sessions']['set'](_0xe64fca, _0x510e2f);
        return _0xe64fca;
    }
    async ['createPairSession'](_0x4790dc) {
        if (!_0x4790dc)
            throw new Error('Phone\x20number\x20is\x20required');
        _0x4790dc = _0x4790dc['replace'](/[^0-9]/g, '');
        const _0xb846dd = _0x0_0x1f2d48('+' + _0x4790dc);
        if (!_0xb846dd['isValid']())
            throw new Error('Invalid\x20phone\x20number');
        _0x4790dc = _0xb846dd['getNumber']('e164')['replace']('+', '');
        const _0x5293aa = Date['now']()['toString']() + Math['random']()['toString'](0x24)['substring'](0x2, 0x9);
        const _0xf4a8b0 = './temp_session_' + _0x5293aa;
        const _0x2dfe78 = {
            'sessionId': _0x5293aa,
            'sessionDir': _0xf4a8b0,
            'phoneNumber': _0x4790dc,
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
        this['sessions']['set'](_0x5293aa, _0x2dfe78);
        return _0x5293aa;
    }
    async ['removeSessionDir'](_0x451737) {
        try {
            if (await _0x0_0x522e7e['pathExists'](_0x451737)) {
                await _0x0_0x522e7e['remove'](_0x451737);
                return !![];
            }
        } catch (_0x23fc9b) {
            console['error']('Error\x20removing\x20session\x20dir:', _0x23fc9b);
        }
        return ![];
    }
    async ['cleanupSessions']() {
        const _0x5c715c = Date['now']();
        const _0xf06c51 = [];
        for (const [_0x2e3f01, _0x141f18] of this['sessions']['entries']()) {
            if (_0x5c715c - _0x141f18['createdAt'] > SESSION_TIMEOUT) {
                _0xf06c51['push'](_0x2e3f01);
            }
        }
        for (const _0x3568e7 of _0xf06c51) {
            const _0x122f0d = this['sessions']['get'](_0x3568e7);
            await this['cleanup'](_0x3568e7, 'session_expired');
        }
    }
    async ['cleanup'](_0x454874, _0x3dec45 = 'unknown') {
        const _0x21fd09 = this['sessions']['get'](_0x454874);
        if (!_0x21fd09)
            return;
        if (_0x21fd09['isCleaningUp'])
            return;
        console['log']('🧹\x20Cleanup\x20session\x20' + _0x454874 + '\x20-\x20' + _0x3dec45);
        if (_0x3dec45 === 'session_complete' || _0x21fd09['sessionCompleted']) {
            if (_0x21fd09['timeoutHandle']) {
                clearTimeout(_0x21fd09['timeoutHandle']);
                _0x21fd09['timeoutHandle'] = null;
            }
            this['sessions']['delete'](_0x454874);
            console['log']('✅\x20Socket\x20handed\x20over\x20to\x20index.js\x20successfully.');
            return;
        }
        _0x21fd09['isCleaningUp'] = !![];
        if (_0x21fd09['timeoutHandle']) {
            clearTimeout(_0x21fd09['timeoutHandle']);
            _0x21fd09['timeoutHandle'] = null;
        }
        if (_0x21fd09['currentSocket']) {
            try {
                _0x21fd09['currentSocket']['ev']['removeAllListeners']();
                await _0x21fd09['currentSocket']['end']();
            } catch (_0x2f6f04) {
            }
            _0x21fd09['currentSocket'] = null;
        }
        setTimeout(async () => {
            await this['removeSessionDir'](_0x21fd09['sessionDir']);
            this['sessions']['delete'](_0x454874);
        }, 0x1388);
    }
    async ['saveSessionData'](_0x48be9c, _0x2bdf84, _0x36e56c) {
        if (this['sessionSaveInProgress']['get'](_0x36e56c)) {
            console['log']('⏳\x20Session\x20save\x20already\x20in\x20progress...');
            return;
        }
        this['sessionSaveInProgress']['set'](_0x36e56c, !![]);
        try {
            const _0x5ae548 = _0x48be9c['sessionDir'] + '/creds.json';
            const _0x1efbbc = './session';
            if (!_0x0_0x522e7e['existsSync'](_0x5ae548)) {
                console['log']('❌\x20No\x20credentials\x20file\x20found');
                this['sessionSaveInProgress']['delete'](_0x36e56c);
                return;
            }
            const _0x5901dd = await _0x0_0x522e7e['readFile'](_0x5ae548, 'utf-8');
            const _0x3991de = JSON['parse'](_0x5901dd);
            if (!_0x3991de['me']?.['id']) {
                console['log']('⚠️\x20Session\x20not\x20valid\x20(no\x20me.id)');
                this['sessionSaveInProgress']['delete'](_0x36e56c);
                return;
            }
            console['log']('✅\x20Session\x20valid:\x20me.id\x20=\x20' + _0x3991de['me']['id']);
            if (!_0x3991de['registered']) {
                _0x3991de['registered'] = !![];
                _0x0_0x522e7e['writeFileSync'](_0x5ae548, JSON['stringify'](_0x3991de, null, 0x2));
                console['log']('🔧\x20Forced\x20registered:\x20true');
            }
            if (!await _0x0_0x522e7e['pathExists'](_0x1efbbc)) {
                await _0x0_0x522e7e['mkdir'](_0x1efbbc, { 'recursive': !![] });
            }
            await _0x0_0x522e7e['copy'](_0x48be9c['sessionDir'], _0x1efbbc);
            console['log']('✅\x20Session\x20credentials\x20saved\x20to\x20main\x20session\x20directory');
            let _0x1001ac = _0x48be9c['phoneNumber'] || null;
            if (!_0x1001ac && _0x3991de['me']?.['id']) {
                _0x1001ac = _0x3991de['me']['id']['split'](':')[0x0];
            }
            const _0x16de2b = await _0x0_0x59309b['saveSession'](_0x3991de, _0x1001ac);
            console['log']('✅\x20Session\x20saved\x20to\x20database:\x20' + _0x16de2b);
            const _0x2f53fd = _0x2bdf84['authState']['creds']['me']?.['id'] ? jidNormalizedUser(_0x2bdf84['authState']['creds']['me']['id']) : jidNormalizedUser(_0x48be9c['phoneNumber'] + '@s.whatsapp.net');
            if (_0x2f53fd) {
                const _0x348b58 = await _0x2bdf84['sendMessage'](_0x2f53fd, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x16de2b + '`\x0a\x0a📌\x20*SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE\x20DON\x27T\x20SHARE\x20IT*\x20✅' });
                await _0x2bdf84['sendMessage'](_0x2f53fd, {
                    'text': MESSAGE,
                    'quoted': _0x348b58
                });
                console['log']('✅\x20Success\x20message\x20sent');
            }
            _0x48be9c['sessionCompleted'] = !![];
            _0x48be9c['sessionSaved'] = !![];
            setTimeout(async () => {
                await this['cleanup'](_0x36e56c, 'session_complete');
            }, 0x1388);
        } catch (_0x575021) {
            console['error']('❌\x20Error\x20saving\x20session:', _0x575021);
        } finally {
            this['sessionSaveInProgress']['delete'](_0x36e56c);
        }
    }
    async ['initiateQRSession'](_0x29f8a5) {
        const _0x1dda27 = this['sessions']['get'](_0x29f8a5);
        if (!_0x1dda27)
            throw new Error('Session\x20not\x20found');
        return new Promise(async (_0x2fabf3, _0x38d18b) => {
            try {
                const {version: _0x27b45b} = await fetchLatestBaileysVersion();
                if (!await _0x0_0x522e7e['pathExists'](_0x1dda27['sessionDir'])) {
                    await _0x0_0x522e7e['mkdir'](_0x1dda27['sessionDir'], { 'recursive': !![] });
                }
                const {
                    state: _0x3fbf65,
                    saveCreds: _0x4b32cb
                } = await useMultiFileAuthState(_0x1dda27['sessionDir']);
                _0x1dda27['currentSocket'] = makeWASocket({
                    'version': _0x27b45b,
                    'logger': _0x0_0x362c4e({ 'level': 'silent' }),
                    'browser': Browsers['macOS']('Chrome'),
                    'auth': {
                        'creds': _0x3fbf65['creds'],
                        'keys': makeCacheableSignalKeyStore(_0x3fbf65['keys'], _0x0_0x362c4e({ 'level': 'fatal' })['child']({ 'level': 'fatal' }))
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
                const _0x386543 = _0x1dda27['currentSocket'];
                _0x386543['ev']['on']('creds.update', async _0x4b59ca => {
                    console['log']('🔄\x20creds.update\x20triggered');
                    await _0x4b32cb();
                    if (_0x4b59ca['me']?.['id']) {
                        console['log']('✅\x20Session\x20valid\x20via\x20creds.update:\x20' + _0x4b59ca['me']['id']);
                        _0x1dda27['credsUpdated'] = !![];
                        if (!_0x4b59ca['registered']) {
                            _0x4b59ca['registered'] = !![];
                            await _0x4b32cb();
                            console['log']('🔧\x20Forced\x20registered:\x20true\x20via\x20creds.update');
                        }
                        if (!_0x1dda27['sessionSaved'] && !_0x1dda27['sessionCompleted']) {
                            await this['saveSessionData'](_0x1dda27, _0x386543, _0x29f8a5);
                        }
                    }
                });
                const _0x42f294 = async _0x380b28 => {
                    if (_0x1dda27['qrGenerated'] || _0x1dda27['sessionCompleted'] || _0x1dda27['isCleaningUp'])
                        return;
                    _0x1dda27['qrGenerated'] = !![];
                    try {
                        const _0xe46a99 = await _0x0_0x2155fd['toDataURL'](_0x380b28, { 'errorCorrectionLevel': 'M' });
                        _0x2fabf3({
                            'type': 'qr',
                            'qr': _0xe46a99,
                            'sessionId': _0x29f8a5
                        });
                    } catch (_0x2b586c) {
                        console['error']('Error\x20generating\x20QR\x20code:', _0x2b586c);
                        _0x38d18b(_0x2b586c);
                    }
                };
                _0x386543['ev']['on']('connection.update', async _0x37b6cd => {
                    if (_0x1dda27['isCleaningUp'])
                        return;
                    const {
                        connection: _0x42cee8,
                        lastDisconnect: _0xa6023f,
                        qr: _0x852ec6,
                        isNewLogin: _0x490d58
                    } = _0x37b6cd;
                    if (_0x852ec6 && !_0x1dda27['qrGenerated'] && !_0x1dda27['sessionCompleted']) {
                        await _0x42f294(_0x852ec6);
                    }
                    if (_0x490d58) {
                        console['log']('🔐\x20New\x20login\x20via\x20QR\x20code');
                    }
                    if (_0x42cee8 === 'open') {
                        console['log']('🔐\x20Connection\x20open');
                        if (_0x1dda27['sessionSaved'] || _0x1dda27['sessionCompleted'])
                            return;
                        if (_0x1dda27['credsUpdated']) {
                            const _0x354bb7 = await this['saveSessionData'](_0x1dda27, _0x386543, _0x29f8a5);
                            const _0x11e86f = Object['keys'](_0x386543['authState']['creds']['me'] || {})['length'] > 0x0 ? jidNormalizedUser(_0x386543['authState']['creds']['me']['id']) : null;
                            if (_0x11e86f) {
                                await delay(0x7d0);
                                const _0x2a3f03 = await _0x386543['sendMessage'](_0x11e86f, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x354bb7 + '`\x0a\x0a📌\x20SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE,DON\x27T\x20SHARE\x20IT!' });
                                await _0x386543['sendMessage'](_0x11e86f, { 'quoted': _0x2a3f03 });
                            }
                        } else {
                            console['log']('⏳\x20Waiting\x20for\x20session\x20to\x20be\x20ready...');
                            await delay(0xbb8);
                            const _0x5ba9f2 = _0x1dda27['sessionDir'] + '/creds.json';
                            if (_0x0_0x522e7e['existsSync'](_0x5ba9f2)) {
                                try {
                                    const _0x19c8f3 = await _0x0_0x522e7e['readFile'](_0x5ba9f2, 'utf-8');
                                    const _0x3b0458 = JSON['parse'](_0x19c8f3);
                                    if (_0x3b0458['me']?.['id']) {
                                        console['log']('✅\x20Session\x20found\x20via\x20file\x20check');
                                        const _0x5c3aba = await this['saveSessionData'](_0x1dda27, _0x386543, _0x29f8a5);
                                        const _0x5708ac = Object['keys'](_0x386543['authState']['creds']['me'] || {})['length'] > 0x0 ? jidNormalizedUser(_0x386543['authState']['creds']['me']['id']) : null;
                                        if (_0x5708ac) {
                                            await delay(0x7d0);
                                            const _0x208571 = await _0x386543['sendMessage'](_0x5708ac, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x5c3aba + '`\x0a\x0a📌\x20SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE,DON\x27T\x20SHARE\x20IT!' });
                                            await _0x386543['sendMessage'](_0x5708ac, { 'quoted': _0x208571 });
                                        }
                                    }
                                } catch (_0x203370) {
                                    console['log']('⚠️\x20File\x20check\x20failed:', _0x203370['message']);
                                }
                            }
                        }
                    }
                    if (_0x42cee8 === 'close') {
                        console['log']('🔌\x20Connection\x20closed');
                        const _0x30f620 = _0xa6023f?.['error']?.['output']?.['statusCode'];
                        if (_0x30f620 === DisconnectReason['restartRequired']) {
                            console['log']('🔄\x20Restart\x20required\x20-\x20Baileys\x20will\x20reconnect\x20automatically');
                            return;
                        }
                        if (_0x1dda27['sessionSaved'] || _0x1dda27['sessionCompleted']) {
                            await this['cleanup'](_0x29f8a5, 'session_complete');
                            return;
                        }
                        if (_0x30f620 === DisconnectReason['loggedOut'] || _0x30f620 === 0x191) {
                            await this['cleanup'](_0x29f8a5, 'logged_out');
                            _0x38d18b(new Error('Invalid\x20QR\x20code\x20or\x20session\x20expired'));
                        } else {
                            if (_0x1dda27['reconnectAttempts'] < MAX_RECONNECT_ATTEMPTS) {
                                _0x1dda27['reconnectAttempts']++;
                                await delay(0x7d0);
                                await this['initiateQRSession'](_0x29f8a5);
                            } else {
                                await this['cleanup'](_0x29f8a5, 'max_reconnects');
                                _0x38d18b(new Error('Max\x20reconnection\x20attempts\x20reached'));
                            }
                        }
                    }
                });
                _0x1dda27['timeoutHandle'] = setTimeout(async () => {
                    if (!_0x1dda27['sessionCompleted'] && !_0x1dda27['isCleaningUp']) {
                        await this['cleanup'](_0x29f8a5, 'timeout');
                        _0x38d18b(new Error('Session\x20timeout'));
                    }
                }, SESSION_TIMEOUT);
            } catch (_0x4bdd04) {
                console['error']('Error\x20initiating\x20QR\x20session:', _0x4bdd04);
                _0x38d18b(_0x4bdd04);
            }
        });
    }
    async ['initiatePairSession'](_0x239624) {
        const _0x5e5705 = this['sessions']['get'](_0x239624);
        if (!_0x5e5705)
            throw new Error('Session\x20not\x20found');
        return new Promise(async (_0x402c02, _0x5c6abd) => {
            try {
                const {version: _0x518751} = await fetchLatestBaileysVersion();
                if (!await _0x0_0x522e7e['pathExists'](_0x5e5705['sessionDir'])) {
                    await _0x0_0x522e7e['mkdir'](_0x5e5705['sessionDir'], { 'recursive': !![] });
                }
                const {
                    state: _0x16a78d,
                    saveCreds: _0x224ba8
                } = await useMultiFileAuthState(_0x5e5705['sessionDir']);
                _0x5e5705['currentSocket'] = makeWASocket({
                    'version': _0x518751,
                    'logger': _0x0_0x362c4e({ 'level': 'silent' }),
                    'browser': Browsers['macOS']('Chrome'),
                    'auth': {
                        'creds': _0x16a78d['creds'],
                        'keys': makeCacheableSignalKeyStore(_0x16a78d['keys'], _0x0_0x362c4e({ 'level': 'fatal' })['child']({ 'level': 'fatal' }))
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
                const _0x1d289c = _0x5e5705['currentSocket'];
                _0x1d289c['ev']['on']('connection.update', async _0xc16867 => {
                    if (_0x5e5705['isCleaningUp'])
                        return;
                    const {
                        connection: _0x24d378,
                        lastDisconnect: _0x1271d7,
                        isNewLogin: _0x1bc6bd
                    } = _0xc16867;
                    if (_0x24d378 === 'open') {
                        if (_0x5e5705['sessionCompleted'])
                            return;
                        _0x5e5705['sessionCompleted'] = !![];
                        try {
                            const _0x4037ce = _0x5e5705['sessionDir'] + '/creds.json';
                            const _0x3abbbf = './session';
                            if (!await _0x0_0x522e7e['pathExists'](_0x3abbbf)) {
                                await _0x0_0x522e7e['mkdir'](_0x3abbbf, { 'recursive': !![] });
                            }
                            if (await _0x0_0x522e7e['pathExists'](_0x4037ce)) {
                                await _0x0_0x522e7e['copy'](_0x5e5705['sessionDir'], _0x3abbbf);
                                console['log']('✅\x20Session\x20credentials\x20saved\x20to\x20main\x20session\x20directory');
                            }
                            await delay(0xbb8);
                            if (_0x0_0x522e7e['existsSync'](_0x4037ce)) {
                                const _0x17cc95 = JSON['parse'](await _0x0_0x522e7e['readFile'](_0x4037ce, 'utf-8'));
                                const _0x3b9744 = _0x5e5705['phoneNumber'] || Object['keys'](_0x17cc95['me'] || {})[0x0]?.['split']('@')[0x0] || null;
                                const _0x181784 = await _0x0_0x59309b['saveSession'](_0x17cc95, _0x3b9744);
                                console['log']('✅\x20Session\x20saved\x20to\x20database:\x20' + _0x181784);
                                const _0x2c1814 = Object['keys'](_0x1d289c['authState']['creds']['me'] || {})['length'] > 0x0 ? jidNormalizedUser(_0x1d289c['authState']['creds']['me']['id']) : jidNormalizedUser(_0x5e5705['phoneNumber'] + '@s.whatsapp.net');
                                if (_0x2c1814) {
                                    await delay(0x7d0);
                                    const _0x3e9d82 = await _0x1d289c['sendMessage'](_0x2c1814, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x181784 + '`\x0a\x0a📌\x20SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE,DON\x27T\x20SHARE\x20IT!' });
                                    await _0x1d289c['sendMessage'](_0x2c1814, { 'quoted': _0x3e9d82 });
                                }
                            }
                        } catch (_0x1011ce) {
                            console['error']('Error\x20saving\x20session:', _0x1011ce);
                        } finally {
                            setTimeout(async () => {
                                await this['cleanup'](_0x239624, 'session_complete');
                            }, 0x2710);
                        }
                    }
                    if (_0x1bc6bd)
                        console['log']('🔐\x20New\x20login\x20via\x20pair\x20code\x20for\x20' + _0x5e5705['phoneNumber']);
                    if (_0x24d378 === 'close') {
                        if (_0x5e5705['sessionCompleted'] || _0x5e5705['isCleaningUp']) {
                            await this['cleanup'](_0x239624, 'already_complete');
                            return;
                        }
                        const _0x47fb9f = _0x1271d7?.['error']?.['output']?.['statusCode'];
                        if (_0x47fb9f === DisconnectReason['loggedOut'] || _0x47fb9f === 0x191) {
                            await this['cleanup'](_0x239624, 'logged_out');
                            _0x5c6abd(new Error('Invalid\x20pairing\x20code\x20or\x20session\x20expired'));
                        } else if (_0x5e5705['pairingCodeSent'] && !_0x5e5705['sessionCompleted']) {
                            if (_0x5e5705['reconnectAttempts'] < MAX_RECONNECT_ATTEMPTS) {
                                _0x5e5705['reconnectAttempts']++;
                                await delay(0x7d0);
                                await this['initiatePairSession'](_0x239624);
                            } else {
                                await this['cleanup'](_0x239624, 'max_reconnects');
                                _0x5c6abd(new Error('Max\x20reconnection\x20attempts\x20reached'));
                            }
                        }
                    }
                });
                if (!_0x1d289c['authState']['creds']['registered'] && !_0x5e5705['pairingCodeSent'] && !_0x5e5705['isCleaningUp']) {
                    await delay(0x5dc);
                    try {
                        _0x5e5705['pairingCodeSent'] = !![];
                        let _0x358963 = await _0x1d289c['requestPairingCode'](_0x5e5705['phoneNumber']);
                        _0x358963 = _0x358963?.['match'](/.{1,4}/g)?.['join']('-') || _0x358963;
                        _0x402c02({
                            'type': 'pair',
                            'code': _0x358963,
                            'sessionId': _0x239624,
                            'phoneNumber': _0x5e5705['phoneNumber']
                        });
                    } catch (_0x29d9c2) {
                        _0x5e5705['pairingCodeSent'] = ![];
                        _0x5c6abd(new Error('Failed\x20to\x20get\x20pairing\x20code:\x20' + _0x29d9c2['message']));
                    }
                }
                _0x1d289c['ev']['on']('creds.update', _0x224ba8);
                _0x5e5705['timeoutHandle'] = setTimeout(async () => {
                    if (!_0x5e5705['sessionCompleted'] && !_0x5e5705['isCleaningUp']) {
                        await this['cleanup'](_0x239624, 'timeout');
                        _0x5c6abd(new Error('Pairing\x20timeout'));
                    }
                }, SESSION_TIMEOUT);
            } catch (_0x58dfd1) {
                console['error']('Error\x20initiating\x20pair\x20session:', _0x58dfd1);
                _0x5c6abd(_0x58dfd1);
            }
        });
    }
    ['isSessionComplete'](_0x762483) {
        const _0x584fc6 = this['sessions']['get'](_0x762483);
        if (!_0x584fc6)
            return ![];
        if (!_0x584fc6['sessionCompleted'])
            return ![];
        try {
            const _0x225beb = _0x584fc6['sessionDir'] + '/creds.json';
            const _0x117e3a = './session/creds.json';
            let _0x569e04 = _0x0_0x522e7e['existsSync'](_0x117e3a) ? _0x117e3a : _0x0_0x522e7e['existsSync'](_0x225beb) ? _0x225beb : null;
            if (_0x569e04) {
                const _0x359f34 = JSON['parse'](_0x0_0x522e7e['readFileSync'](_0x569e04, 'utf-8'));
                return _0x359f34['registered'] === !![] && !!_0x359f34['me']?.['id'];
            }
        } catch (_0x4bc7ab) {
            console['error']('Error\x20verifying\x20physical\x20creds\x20in\x20isSessionComplete:', _0x4bc7ab);
            return ![];
        }
        return ![];
    }
}
export default new PairingManager();