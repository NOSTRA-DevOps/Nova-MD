import _0x0_0x57d268 from 'fs-extra';
import _0x0_0x103c2b from 'pino';
import _0x0_0x29208f from 'qrcode';
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
import _0x0_0x14cff2 from 'awesome-phonenumber';
import _0x0_0x2609cd from './sessionManager.js';
const MAX_RECONNECT_ATTEMPTS = 0x3;
const SESSION_TIMEOUT = 0x5 * 0x3c * 0x3e8;
const _MESSAGE = '\x0a*LOGIN\x20SUCCESSFULL*\x20✅\x0a\x0a*Gɪᴠᴇ\x20ᴀ\x20ꜱᴛᴀʀ\x20ᴛᴏ\x20ʀᴇᴘᴏ\x20ꜰᴏʀ\x20ᴄᴏᴜʀᴀɢᴇ*\x20🌟\x0ahttps://github.com/NOSTRA-DevOps/Nova-MD\x0a\x0a*Sᴜᴘᴘᴏʀᴛ\x20Gʀᴏᴜᴘ\x20ꜰᴏʀ\x20ϙᴜᴇʀʏ*\x20💭\x0ahttps://t.me/Nostra_DigitalCenter\x0ahttps://t.me/LaboKingFreeSurf\x0ahttps://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y\x0a\x0a*NOSTRA\x20COMMUNITY*\x0ahttps://chat.whatsapp.com/LUkXjJNfWrT8Fz7akxosH0\x0a*Yᴏᴜ-ᴛᴜʙᴇ\x20ᴛᴜᴛᴏʀɪᴀʟꜱ*\x20🪄\x20\x0ahttps://youtube.com/@LaboKingFreeSurf\x0a\x0a*NOVA-MD--WHATSAPP*\x20🥀\x0a';
class PairingManager {
    constructor() {
        this['sessions'] = new Map();
        this['cleanupInterval'] = setInterval(() => this['cleanupSessions'](), 0xea60);
        this['sessionSaveInProgress'] = new Map();
    }
    async ['createQRSession']() {
        const _0x44d610 = Date['now']()['toString']() + Math['random']()['toString'](0x24)['substring'](0x2, 0x9);
        const _0x47c453 = './temp_session_' + _0x44d610;
        const _0x5f498d = {
            'sessionId': _0x44d610,
            'sessionDir': _0x47c453,
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
        this['sessions']['set'](_0x44d610, _0x5f498d);
        return _0x44d610;
    }
    async ['createPairSession'](_0x5e8118) {
        if (!_0x5e8118)
            throw new Error('Phone\x20number\x20is\x20required');
        _0x5e8118 = _0x5e8118['replace'](/[^0-9]/g, '');
        const _0x3e1fe9 = _0x0_0x14cff2('+' + _0x5e8118);
        if (!_0x3e1fe9['isValid']())
            throw new Error('Invalid\x20phone\x20number');
        _0x5e8118 = _0x3e1fe9['getNumber']('e164')['replace']('+', '');
        const _0x5d909d = Date['now']()['toString']() + Math['random']()['toString'](0x24)['substring'](0x2, 0x9);
        const _0xdf8a40 = './temp_session_' + _0x5d909d;
        const _0xfcc882 = {
            'sessionId': _0x5d909d,
            'sessionDir': _0xdf8a40,
            'phoneNumber': _0x5e8118,
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
        this['sessions']['set'](_0x5d909d, _0xfcc882);
        return _0x5d909d;
    }
    async ['removeSessionDir'](_0x3ef5d3) {
        try {
            if (await _0x0_0x57d268['pathExists'](_0x3ef5d3)) {
                await _0x0_0x57d268['remove'](_0x3ef5d3);
                return !![];
            }
        } catch (_0x108080) {
            console['error']('Error\x20removing\x20session\x20dir:', _0x108080);
        }
        return ![];
    }
    async ['cleanupSessions']() {
        const _0x2fc1d7 = Date['now']();
        const _0x28e400 = [];
        for (const [_0x49a772, _0x193134] of this['sessions']['entries']()) {
            if (_0x2fc1d7 - _0x193134['createdAt'] > SESSION_TIMEOUT) {
                _0x28e400['push'](_0x49a772);
            }
        }
        for (const _0x11dced of _0x28e400) {
            const _0x369b34 = this['sessions']['get'](_0x11dced);
            await this['cleanup'](_0x11dced, 'session_expired');
        }
    }
    async ['cleanup'](_0x2020a3, _0x4ffa6f = 'unknown') {
        const _0x4930b3 = this['sessions']['get'](_0x2020a3);
        if (!_0x4930b3)
            return;
        if (_0x4930b3['isCleaningUp'])
            return;
        console['log']('🧹\x20Cleanup\x20session\x20' + _0x2020a3 + '\x20-\x20' + _0x4ffa6f);
        if (_0x4ffa6f === 'session_complete' || _0x4930b3['sessionCompleted']) {
            if (_0x4930b3['timeoutHandle']) {
                clearTimeout(_0x4930b3['timeoutHandle']);
                _0x4930b3['timeoutHandle'] = null;
            }
            this['sessions']['delete'](_0x2020a3);
            console['log']('✅\x20Socket\x20handed\x20over\x20to\x20index.js\x20successfully.');
            return;
        }
        _0x4930b3['isCleaningUp'] = !![];
        if (_0x4930b3['timeoutHandle']) {
            clearTimeout(_0x4930b3['timeoutHandle']);
            _0x4930b3['timeoutHandle'] = null;
        }
        if (_0x4930b3['currentSocket']) {
            try {
                _0x4930b3['currentSocket']['ev']['removeAllListeners']();
                await _0x4930b3['currentSocket']['end']();
            } catch (_0x2536d2) {
            }
            _0x4930b3['currentSocket'] = null;
        }
        setTimeout(async () => {
            await this['removeSessionDir'](_0x4930b3['sessionDir']);
            this['sessions']['delete'](_0x2020a3);
        }, 0x1388);
    }
    async ['saveSessionData'](_0x51d973, _0x1edd55, _0x12efce) {
        if (this['sessionSaveInProgress']['get'](_0x12efce)) {
            console['log']('⏳\x20Session\x20save\x20already\x20in\x20progress...');
            return;
        }
        this['sessionSaveInProgress']['set'](_0x12efce, !![]);
        try {
            const _0x11807a = _0x51d973['sessionDir'] + '/creds.json';
            const _0x597d37 = './session';
            if (!_0x0_0x57d268['existsSync'](_0x11807a)) {
                console['log']('❌\x20No\x20credentials\x20file\x20found');
                this['sessionSaveInProgress']['delete'](_0x12efce);
                return;
            }
            const _0x3e7238 = await _0x0_0x57d268['readFile'](_0x11807a, 'utf-8');
            const _0x1fe8bf = JSON['parse'](_0x3e7238);
            if (!_0x1fe8bf['me']?.['id']) {
                console['log']('⚠️\x20Session\x20not\x20valid\x20(no\x20me.id)');
                this['sessionSaveInProgress']['delete'](_0x12efce);
                return;
            }
            console['log']('✅\x20Session\x20valid:\x20me.id\x20=\x20' + _0x1fe8bf['me']['id']);
            if (!_0x1fe8bf['registered']) {
                _0x1fe8bf['registered'] = !![];
                _0x0_0x57d268['writeFileSync'](_0x11807a, JSON['stringify'](_0x1fe8bf, null, 0x2));
                console['log']('🔧\x20Forced\x20registered:\x20true');
            }
            if (!await _0x0_0x57d268['pathExists'](_0x597d37)) {
                await _0x0_0x57d268['mkdir'](_0x597d37, { 'recursive': !![] });
            }
            await _0x0_0x57d268['copy'](_0x51d973['sessionDir'], _0x597d37);
            console['log']('✅\x20Session\x20credentials\x20saved\x20to\x20main\x20session\x20directory');
            let _0x4aa75b = _0x51d973['phoneNumber'] || null;
            if (!_0x4aa75b && _0x1fe8bf['me']?.['id']) {
                _0x4aa75b = _0x1fe8bf['me']['id']['split'](':')[0x0];
            }
            const _0x582beb = await _0x0_0x2609cd['saveSession'](_0x1fe8bf, _0x4aa75b);
            console['log']('✅\x20Session\x20saved\x20to\x20database:\x20' + _0x582beb);
            const _0x257968 = _0x1edd55['authState']['creds']['me']?.['id'] ? jidNormalizedUser(_0x1edd55['authState']['creds']['me']['id']) : jidNormalizedUser(_0x51d973['phoneNumber'] + '@s.whatsapp.net');
            if (_0x257968) {
                const _0x246acc = await _0x1edd55['sendMessage'](_0x257968, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x582beb + '`\x0a\x0a📌\x20*SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE\x20DON\x27T\x20SHARE\x20IT*\x20✅' });
                await _0x1edd55['sendMessage'](_0x257968, { 'quoted': _0x246acc });
                console['log']('✅\x20Success\x20message\x20sent');
            }
            _0x51d973['sessionCompleted'] = !![];
            _0x51d973['sessionSaved'] = !![];
            setTimeout(async () => {
                await this['cleanup'](_0x12efce, 'session_complete');
            }, 0x1388);
        } catch (_0x52cc05) {
            console['error']('❌\x20Error\x20saving\x20session:', _0x52cc05);
        } finally {
            this['sessionSaveInProgress']['delete'](_0x12efce);
        }
    }
    async ['initiateQRSession'](_0x3e1681) {
        const _0x2c38c6 = this['sessions']['get'](_0x3e1681);
        if (!_0x2c38c6)
            throw new Error('Session\x20not\x20found');
        return new Promise(async (_0x32fc22, _0x4edffb) => {
            try {
                const {version: _0x2106a2} = await fetchLatestBaileysVersion();
                if (!await _0x0_0x57d268['pathExists'](_0x2c38c6['sessionDir'])) {
                    await _0x0_0x57d268['mkdir'](_0x2c38c6['sessionDir'], { 'recursive': !![] });
                }
                const {
                    state: _0x2a4117,
                    saveCreds: _0x3f85ad
                } = await useMultiFileAuthState(_0x2c38c6['sessionDir']);
                _0x2c38c6['currentSocket'] = makeWASocket({
                    'version': _0x2106a2,
                    'logger': _0x0_0x103c2b({ 'level': 'silent' }),
                    'browser': Browsers['macOS']('Chrome'),
                    'auth': {
                        'creds': _0x2a4117['creds'],
                        'keys': makeCacheableSignalKeyStore(_0x2a4117['keys'], _0x0_0x103c2b({ 'level': 'fatal' })['child']({ 'level': 'fatal' }))
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
                const _0x2effe8 = _0x2c38c6['currentSocket'];
                _0x2effe8['ev']['on']('creds.update', async _0x3a2cd9 => {
                    console['log']('🔄\x20creds.update\x20triggered');
                    await _0x3f85ad();
                    if (_0x3a2cd9['me']?.['id']) {
                        console['log']('✅\x20Session\x20valid\x20via\x20creds.update:\x20' + _0x3a2cd9['me']['id']);
                        _0x2c38c6['credsUpdated'] = !![];
                        if (!_0x3a2cd9['registered']) {
                            _0x3a2cd9['registered'] = !![];
                            await _0x3f85ad();
                            console['log']('🔧\x20Forced\x20registered:\x20true\x20via\x20creds.update');
                        }
                        if (!_0x2c38c6['sessionSaved'] && !_0x2c38c6['sessionCompleted']) {
                            await this['saveSessionData'](_0x2c38c6, _0x2effe8, _0x3e1681);
                        }
                    }
                });
                const _0x3337b4 = async _0xd8bfe8 => {
                    if (_0x2c38c6['qrGenerated'] || _0x2c38c6['sessionCompleted'] || _0x2c38c6['isCleaningUp'])
                        return;
                    _0x2c38c6['qrGenerated'] = !![];
                    try {
                        const _0x192b33 = await _0x0_0x29208f['toDataURL'](_0xd8bfe8, { 'errorCorrectionLevel': 'M' });
                        _0x32fc22({
                            'type': 'qr',
                            'qr': _0x192b33,
                            'sessionId': _0x3e1681
                        });
                    } catch (_0x278c3d) {
                        console['error']('Error\x20generating\x20QR\x20code:', _0x278c3d);
                        _0x4edffb(_0x278c3d);
                    }
                };
                _0x2effe8['ev']['on']('connection.update', async _0x4777b7 => {
                    if (_0x2c38c6['isCleaningUp'])
                        return;
                    const {
                        connection: _0x1502af,
                        lastDisconnect: _0x5e0686,
                        qr: _0x26fa1e,
                        isNewLogin: _0x390e0d
                    } = _0x4777b7;
                    if (_0x26fa1e && !_0x2c38c6['qrGenerated'] && !_0x2c38c6['sessionCompleted']) {
                        await _0x3337b4(_0x26fa1e);
                    }
                    if (_0x390e0d) {
                        console['log']('🔐\x20New\x20login\x20via\x20QR\x20code');
                    }
                    if (_0x1502af === 'open') {
                        console['log']('🔐\x20Connection\x20open');
                        if (_0x2c38c6['sessionSaved'] || _0x2c38c6['sessionCompleted'])
                            return;
                        if (_0x2c38c6['credsUpdated']) {
                            const _0xcf93e0 = await this['saveSessionData'](_0x2c38c6, _0x2effe8, _0x3e1681);
                            const _0x106c3f = Object['keys'](_0x2effe8['authState']['creds']['me'] || {})['length'] > 0x0 ? jidNormalizedUser(_0x2effe8['authState']['creds']['me']['id']) : null;
                            if (_0x106c3f) {
                                await delay(0x7d0);
                                const _0x238043 = await _0x2effe8['sendMessage'](_0x106c3f, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0xcf93e0 + '`\x0a\x0a📌\x20SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE,DON\x27T\x20SHARE\x20IT!' });
                                await _0x2effe8['sendMessage'](_0x106c3f, { 'quoted': _0x238043 });
                            }
                        } else {
                            console['log']('⏳\x20Waiting\x20for\x20session\x20to\x20be\x20ready...');
                            await delay(0xbb8);
                            const _0x57f55e = _0x2c38c6['sessionDir'] + '/creds.json';
                            if (_0x0_0x57d268['existsSync'](_0x57f55e)) {
                                try {
                                    const _0x116708 = await _0x0_0x57d268['readFile'](_0x57f55e, 'utf-8');
                                    const _0x32508f = JSON['parse'](_0x116708);
                                    if (_0x32508f['me']?.['id']) {
                                        console['log']('✅\x20Session\x20found\x20via\x20file\x20check');
                                        const _0x156614 = await this['saveSessionData'](_0x2c38c6, _0x2effe8, _0x3e1681);
                                        const _0xc424b8 = Object['keys'](_0x2effe8['authState']['creds']['me'] || {})['length'] > 0x0 ? jidNormalizedUser(_0x2effe8['authState']['creds']['me']['id']) : null;
                                        if (_0xc424b8) {
                                            await delay(0x7d0);
                                            const _0x13c30c = await _0x2effe8['sendMessage'](_0xc424b8, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x156614 + '`\x0a\x0a📌\x20SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE,DON\x27T\x20SHARE\x20IT!' });
                                            await _0x2effe8['sendMessage'](_0xc424b8, { 'quoted': _0x13c30c });
                                        }
                                    }
                                } catch (_0x54b08d) {
                                    console['log']('⚠️\x20File\x20check\x20failed:', _0x54b08d['message']);
                                }
                            }
                        }
                    }
                    if (_0x1502af === 'close') {
                        console['log']('🔌\x20Connection\x20closed');
                        const _0x1f615f = _0x5e0686?.['error']?.['output']?.['statusCode'];
                        if (_0x1f615f === DisconnectReason['restartRequired']) {
                            console['log']('🔄\x20Restart\x20required\x20-\x20Baileys\x20will\x20reconnect\x20automatically');
                            const _0x281cae = _0x2c38c6['sessionDir'] + '/creds.json';
                            if (_0x0_0x57d268['existsSync'](_0x281cae)) {
                                try {
                                    const _0x40866b = await _0x0_0x57d268['readFile'](_0x281cae, 'utf-8');
                                    const _0x40e03d = JSON['parse'](_0x40866b);
                                    if (_0x40e03d['me']?.['id']) {
                                        console['log']('✅\x20Session\x20found\x20via\x20file\x20check');
                                        const _0x206bf3 = await this['saveSessionData'](_0x2c38c6, _0x2effe8, _0x3e1681);
                                        const _0x23e716 = Object['keys'](_0x2effe8['authState']['creds']['me'] || {})['length'] > 0x0 ? jidNormalizedUser(_0x2effe8['authState']['creds']['me']['id']) : null;
                                        if (_0x23e716) {
                                            await delay(0x7d0);
                                            const _0x454313 = await _0x2effe8['sendMessage'](_0x23e716, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x206bf3 + '`\x0a\x0a📌\x20SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE,DON\x27T\x20SHARE\x20IT!' });
                                            await _0x2effe8['sendMessage'](_0x23e716, { 'quoted': _0x454313 });
                                        }
                                    }
                                } catch (_0x5d2cb2) {
                                    console['log']('⚠️\x20File\x20check\x20failed:', _0x5d2cb2['message']);
                                }
                            }
                            return;
                        }
                        if (_0x2c38c6['sessionSaved'] || _0x2c38c6['sessionCompleted']) {
                            await this['cleanup'](_0x3e1681, 'session_complete');
                            return;
                        }
                        if (_0x1f615f === DisconnectReason['loggedOut'] || _0x1f615f === 0x191) {
                            await this['cleanup'](_0x3e1681, 'logged_out');
                            _0x4edffb(new Error('Invalid\x20QR\x20code\x20or\x20session\x20expired'));
                        } else {
                            if (_0x2c38c6['reconnectAttempts'] < MAX_RECONNECT_ATTEMPTS) {
                                _0x2c38c6['reconnectAttempts']++;
                                await delay(0x7d0);
                                await this['initiateQRSession'](_0x3e1681);
                            } else {
                                await this['cleanup'](_0x3e1681, 'max_reconnects');
                                _0x4edffb(new Error('Max\x20reconnection\x20attempts\x20reached'));
                            }
                        }
                    }
                });
                _0x2c38c6['timeoutHandle'] = setTimeout(async () => {
                    if (!_0x2c38c6['sessionCompleted'] && !_0x2c38c6['isCleaningUp']) {
                        await this['cleanup'](_0x3e1681, 'timeout');
                        _0x4edffb(new Error('Session\x20timeout'));
                    }
                }, SESSION_TIMEOUT);
            } catch (_0x11d8cc) {
                console['error']('Error\x20initiating\x20QR\x20session:', _0x11d8cc);
                _0x4edffb(_0x11d8cc);
            }
        });
    }
    async ['initiatePairSession'](_0x450f4c) {
        const _0x5eb717 = this['sessions']['get'](_0x450f4c);
        if (!_0x5eb717)
            throw new Error('Session\x20not\x20found');
        return new Promise(async (_0xeb337, _0x4b0c66) => {
            try {
                const {version: _0x2d2fbc} = await fetchLatestBaileysVersion();
                if (!await _0x0_0x57d268['pathExists'](_0x5eb717['sessionDir'])) {
                    await _0x0_0x57d268['mkdir'](_0x5eb717['sessionDir'], { 'recursive': !![] });
                }
                const {
                    state: _0x4ecd7e,
                    saveCreds: _0x13f05f
                } = await useMultiFileAuthState(_0x5eb717['sessionDir']);
                _0x5eb717['currentSocket'] = makeWASocket({
                    'version': _0x2d2fbc,
                    'logger': _0x0_0x103c2b({ 'level': 'silent' }),
                    'browser': Browsers['macOS']('Chrome'),
                    'auth': {
                        'creds': _0x4ecd7e['creds'],
                        'keys': makeCacheableSignalKeyStore(_0x4ecd7e['keys'], _0x0_0x103c2b({ 'level': 'fatal' })['child']({ 'level': 'fatal' }))
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
                const _0x21eb3a = _0x5eb717['currentSocket'];
                _0x21eb3a['ev']['on']('connection.update', async _0x2d99e6 => {
                    if (_0x5eb717['isCleaningUp'])
                        return;
                    const {
                        connection: _0x360034,
                        lastDisconnect: _0x3895ed,
                        isNewLogin: _0xd79a79
                    } = _0x2d99e6;
                    if (_0x360034 === 'open') {
                        if (_0x5eb717['sessionCompleted'])
                            return;
                        _0x5eb717['sessionCompleted'] = !![];
                        try {
                            const _0x526b15 = _0x5eb717['sessionDir'] + '/creds.json';
                            const _0x34ad25 = './session';
                            if (!await _0x0_0x57d268['pathExists'](_0x34ad25)) {
                                await _0x0_0x57d268['mkdir'](_0x34ad25, { 'recursive': !![] });
                            }
                            if (await _0x0_0x57d268['pathExists'](_0x526b15)) {
                                await _0x0_0x57d268['copy'](_0x5eb717['sessionDir'], _0x34ad25);
                                console['log']('✅\x20Session\x20credentials\x20saved\x20to\x20main\x20session\x20directory');
                            }
                            await delay(0xbb8);
                            if (_0x0_0x57d268['existsSync'](_0x526b15)) {
                                const _0x182e5e = JSON['parse'](await _0x0_0x57d268['readFile'](_0x526b15, 'utf-8'));
                                const _0x8f6a98 = _0x5eb717['phoneNumber'] || Object['keys'](_0x182e5e['me'] || {})[0x0]?.['split']('@')[0x0] || null;
                                const _0x56e293 = await _0x0_0x2609cd['saveSession'](_0x182e5e, _0x8f6a98);
                                console['log']('✅\x20Session\x20saved\x20to\x20database:\x20' + _0x56e293);
                                const _0x17dc2c = Object['keys'](_0x21eb3a['authState']['creds']['me'] || {})['length'] > 0x0 ? jidNormalizedUser(_0x21eb3a['authState']['creds']['me']['id']) : jidNormalizedUser(_0x5eb717['phoneNumber'] + '@s.whatsapp.net');
                                if (_0x17dc2c) {
                                    await delay(0x7d0);
                                    const _0x488afe = await _0x21eb3a['sendMessage'](_0x17dc2c, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x56e293 + '`\x0a\x0a📌\x20SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE,DON\x27T\x20SHARE\x20IT!' });
                                    await _0x21eb3a['sendMessage'](_0x17dc2c, { 'quoted': _0x488afe });
                                }
                            }
                        } catch (_0x5c6689) {
                            console['error']('Error\x20saving\x20session:', _0x5c6689);
                        } finally {
                            setTimeout(async () => {
                                await this['cleanup'](_0x450f4c, 'session_complete');
                            }, 0x2710);
                        }
                    }
                    if (_0xd79a79)
                        console['log']('🔐\x20New\x20login\x20via\x20pair\x20code\x20for\x20' + _0x5eb717['phoneNumber']);
                    if (_0x360034 === 'close') {
                        if (_0x5eb717['sessionCompleted'] || _0x5eb717['isCleaningUp']) {
                            await this['cleanup'](_0x450f4c, 'already_complete');
                            return;
                        }
                        const _0x520766 = _0x3895ed?.['error']?.['output']?.['statusCode'];
                        if (_0x520766 === DisconnectReason['loggedOut'] || _0x520766 === 0x191) {
                            await this['cleanup'](_0x450f4c, 'logged_out');
                            _0x4b0c66(new Error('Invalid\x20pairing\x20code\x20or\x20session\x20expired'));
                        } else if (_0x5eb717['pairingCodeSent'] && !_0x5eb717['sessionCompleted']) {
                            if (_0x5eb717['reconnectAttempts'] < MAX_RECONNECT_ATTEMPTS) {
                                _0x5eb717['reconnectAttempts']++;
                                await delay(0x7d0);
                                await this['initiatePairSession'](_0x450f4c);
                            } else {
                                await this['cleanup'](_0x450f4c, 'max_reconnects');
                                _0x4b0c66(new Error('Max\x20reconnection\x20attempts\x20reached'));
                            }
                        }
                    }
                });
                if (!_0x21eb3a['authState']['creds']['registered'] && !_0x5eb717['pairingCodeSent'] && !_0x5eb717['isCleaningUp']) {
                    await delay(0x5dc);
                    try {
                        _0x5eb717['pairingCodeSent'] = !![];
                        let _0x477b3e = await _0x21eb3a['requestPairingCode'](_0x5eb717['phoneNumber']);
                        _0x477b3e = _0x477b3e?.['match'](/.{1,4}/g)?.['join']('-') || _0x477b3e;
                        _0xeb337({
                            'type': 'pair',
                            'code': _0x477b3e,
                            'sessionId': _0x450f4c,
                            'phoneNumber': _0x5eb717['phoneNumber']
                        });
                    } catch (_0x17113b) {
                        _0x5eb717['pairingCodeSent'] = ![];
                        _0x4b0c66(new Error('Failed\x20to\x20get\x20pairing\x20code:\x20' + _0x17113b['message']));
                    }
                }
                _0x21eb3a['ev']['on']('creds.update', _0x13f05f);
                _0x5eb717['timeoutHandle'] = setTimeout(async () => {
                    if (!_0x5eb717['sessionCompleted'] && !_0x5eb717['isCleaningUp']) {
                        await this['cleanup'](_0x450f4c, 'timeout');
                        _0x4b0c66(new Error('Pairing\x20timeout'));
                    }
                }, SESSION_TIMEOUT);
            } catch (_0x53d3e2) {
                console['error']('Error\x20initiating\x20pair\x20session:', _0x53d3e2);
                _0x4b0c66(_0x53d3e2);
            }
        });
    }
    ['isSessionComplete'](_0x45dcda) {
        const _0x272a5c = this['sessions']['get'](_0x45dcda);
        if (!_0x272a5c)
            return ![];
        if (!_0x272a5c['sessionCompleted'])
            return ![];
        try {
            const _0x4ca8a1 = _0x272a5c['sessionDir'] + '/creds.json';
            const _0x42b13e = './session/creds.json';
            let _0x2369e9 = _0x0_0x57d268['existsSync'](_0x42b13e) ? _0x42b13e : _0x0_0x57d268['existsSync'](_0x4ca8a1) ? _0x4ca8a1 : null;
            if (_0x2369e9) {
                const _0x429c15 = JSON['parse'](_0x0_0x57d268['readFileSync'](_0x2369e9, 'utf-8'));
                return _0x429c15['registered'] === !![] && !!_0x429c15['me']?.['id'];
            }
        } catch (_0x135a0c) {
            console['error']('Error\x20verifying\x20physical\x20creds\x20in\x20isSessionComplete:', _0x135a0c);
            return ![];
        }
        return ![];
    }
}
export default new PairingManager();