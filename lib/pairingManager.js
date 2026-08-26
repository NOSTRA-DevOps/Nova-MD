import _0x0_0x2d2f9c from 'fs-extra';
import _0x0_0x25ec94 from 'pino';
import _0x0_0x3b4444 from 'qrcode';
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
import _0x0_0x220aef from 'awesome-phonenumber';
import _0x0_0x512f7a from './sessionManager.js';
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
        const _0x3ff755 = Date['now']()['toString']() + Math['random']()['toString'](0x24)['substring'](0x2, 0x9);
        const _0x1f75b2 = './temp_session_' + _0x3ff755;
        const _0x31a97b = {
            'sessionId': _0x3ff755,
            'sessionDir': _0x1f75b2,
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
        this['sessions']['set'](_0x3ff755, _0x31a97b);
        return _0x3ff755;
    }
    async ['createPairSession'](_0x2fdbc7) {
        if (!_0x2fdbc7)
            throw new Error('Phone\x20number\x20is\x20required');
        _0x2fdbc7 = _0x2fdbc7['replace'](/[^0-9]/g, '');
        const _0x2d6f80 = _0x0_0x220aef('+' + _0x2fdbc7);
        if (!_0x2d6f80['isValid']())
            throw new Error('Invalid\x20phone\x20number');
        _0x2fdbc7 = _0x2d6f80['getNumber']('e164')['replace']('+', '');
        const _0x24c790 = Date['now']()['toString']() + Math['random']()['toString'](0x24)['substring'](0x2, 0x9);
        const _0x2d0196 = './temp_session_' + _0x24c790;
        const _0x38dba3 = {
            'sessionId': _0x24c790,
            'sessionDir': _0x2d0196,
            'phoneNumber': _0x2fdbc7,
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
        this['sessions']['set'](_0x24c790, _0x38dba3);
        return _0x24c790;
    }
    async ['removeSessionDir'](_0x47c9cc) {
        try {
            if (await _0x0_0x2d2f9c['pathExists'](_0x47c9cc)) {
                await _0x0_0x2d2f9c['remove'](_0x47c9cc);
                return !![];
            }
        } catch (_0x587e93) {
            console['error']('Error\x20removing\x20session\x20dir:', _0x587e93);
        }
        return ![];
    }
    async ['cleanupSessions']() {
        const _0x4b0b5c = Date['now']();
        const _0x31ba63 = [];
        for (const [_0x181a72, _0x330ba4] of this['sessions']['entries']()) {
            if (_0x4b0b5c - _0x330ba4['createdAt'] > SESSION_TIMEOUT) {
                _0x31ba63['push'](_0x181a72);
            }
        }
        for (const _0xb23e98 of _0x31ba63) {
            const _0xddd880 = this['sessions']['get'](_0xb23e98);
            await this['cleanup'](_0xb23e98, 'session_expired');
        }
    }
    async ['cleanup'](_0x391906, _0x65746d = 'unknown') {
        const _0x37235e = this['sessions']['get'](_0x391906);
        if (!_0x37235e)
            return;
        if (_0x37235e['isCleaningUp'])
            return;
        console['log']('🧹\x20Cleanup\x20session\x20' + _0x391906 + '\x20-\x20' + _0x65746d);
        if (_0x65746d === 'session_complete' || _0x37235e['sessionCompleted']) {
            if (_0x37235e['timeoutHandle']) {
                clearTimeout(_0x37235e['timeoutHandle']);
                _0x37235e['timeoutHandle'] = null;
            }
            this['sessions']['delete'](_0x391906);
            console['log']('✅\x20Socket\x20handed\x20over\x20to\x20index.js\x20successfully.');
            return;
        }
        _0x37235e['isCleaningUp'] = !![];
        if (_0x37235e['timeoutHandle']) {
            clearTimeout(_0x37235e['timeoutHandle']);
            _0x37235e['timeoutHandle'] = null;
        }
        if (_0x37235e['currentSocket']) {
            try {
                _0x37235e['currentSocket']['ev']['removeAllListeners']();
                await _0x37235e['currentSocket']['end']();
            } catch (_0x3f36db) {
            }
            _0x37235e['currentSocket'] = null;
        }
        setTimeout(async () => {
            await this['removeSessionDir'](_0x37235e['sessionDir']);
            this['sessions']['delete'](_0x391906);
        }, 0x1388);
    }
    async ['saveSessionData'](_0x6a004d, _0x4aa450, _0xc4cd25) {
        if (this['sessionSaveInProgress']['get'](_0xc4cd25)) {
            console['log']('⏳\x20Session\x20save\x20already\x20in\x20progress...');
            return;
        }
        this['sessionSaveInProgress']['set'](_0xc4cd25, !![]);
        try {
            const _0x47ba90 = _0x6a004d['sessionDir'] + '/creds.json';
            const _0x5604d0 = './session';
            if (!_0x0_0x2d2f9c['existsSync'](_0x47ba90)) {
                console['log']('❌\x20No\x20credentials\x20file\x20found');
                this['sessionSaveInProgress']['delete'](_0xc4cd25);
                return;
            }
            const _0x20a149 = await _0x0_0x2d2f9c['readFile'](_0x47ba90, 'utf-8');
            const _0x157bf3 = JSON['parse'](_0x20a149);
            if (!_0x157bf3['me']?.['id']) {
                console['log']('⚠️\x20Session\x20not\x20valid\x20(no\x20me.id)');
                this['sessionSaveInProgress']['delete'](_0xc4cd25);
                return;
            }
            console['log']('✅\x20Session\x20valid:\x20me.id\x20=\x20' + _0x157bf3['me']['id']);
            if (!_0x157bf3['registered']) {
                _0x157bf3['registered'] = !![];
                _0x0_0x2d2f9c['writeFileSync'](_0x47ba90, JSON['stringify'](_0x157bf3, null, 0x2));
                console['log']('🔧\x20Forced\x20registered:\x20true');
            }
            if (!await _0x0_0x2d2f9c['pathExists'](_0x5604d0)) {
                await _0x0_0x2d2f9c['mkdir'](_0x5604d0, { 'recursive': !![] });
            }
            await _0x0_0x2d2f9c['copy'](_0x6a004d['sessionDir'], _0x5604d0);
            console['log']('✅\x20Session\x20credentials\x20saved\x20to\x20main\x20session\x20directory');
            let _0x8c5e54 = _0x6a004d['phoneNumber'] || null;
            if (!_0x8c5e54 && _0x157bf3['me']?.['id']) {
                _0x8c5e54 = _0x157bf3['me']['id']['split'](':')[0x0];
            }
            const _0x5a7da7 = await _0x0_0x512f7a['saveSession'](_0x157bf3, _0x8c5e54);
            console['log']('✅\x20Session\x20saved\x20to\x20database:\x20' + _0x5a7da7);
            const _0x281bf9 = _0x4aa450['authState']['creds']['me']?.['id'] ? jidNormalizedUser(_0x4aa450['authState']['creds']['me']['id']) : jidNormalizedUser(_0x6a004d['phoneNumber'] + '@s.whatsapp.net');
            if (_0x281bf9) {
                const _0x4a4a76 = await _0x4aa450['sendMessage'](_0x281bf9, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x5a7da7 + '`\x0a\x0a📌\x20*SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE\x20DON\x27T\x20SHARE\x20IT*\x20✅' });
                await _0x4aa450['sendMessage'](_0x281bf9, {
                    'text': MESSAGE,
                    'quoted': _0x4a4a76
                });
                console['log']('✅\x20Success\x20message\x20sent');
            }
            _0x6a004d['sessionCompleted'] = !![];
            _0x6a004d['sessionSaved'] = !![];
            setTimeout(async () => {
                await this['cleanup'](_0xc4cd25, 'session_complete');
            }, 0x1388);
        } catch (_0x4b9341) {
            console['error']('❌\x20Error\x20saving\x20session:', _0x4b9341);
        } finally {
            this['sessionSaveInProgress']['delete'](_0xc4cd25);
        }
    }
    async ['initiateQRSession'](_0xc6a4b1) {
        const _0x12c69c = this['sessions']['get'](_0xc6a4b1);
        if (!_0x12c69c)
            throw new Error('Session\x20not\x20found');
        return new Promise(async (_0x45e609, _0x22bb9c) => {
            try {
                const {version: _0x699985} = await fetchLatestBaileysVersion();
                if (!await _0x0_0x2d2f9c['pathExists'](_0x12c69c['sessionDir'])) {
                    await _0x0_0x2d2f9c['mkdir'](_0x12c69c['sessionDir'], { 'recursive': !![] });
                }
                const {
                    state: _0x400295,
                    saveCreds: _0x2a788e
                } = await useMultiFileAuthState(_0x12c69c['sessionDir']);
                _0x12c69c['currentSocket'] = makeWASocket({
                    'version': _0x699985,
                    'logger': _0x0_0x25ec94({ 'level': 'silent' }),
                    'browser': Browsers['macOS']('Chrome'),
                    'auth': {
                        'creds': _0x400295['creds'],
                        'keys': makeCacheableSignalKeyStore(_0x400295['keys'], _0x0_0x25ec94({ 'level': 'fatal' })['child']({ 'level': 'fatal' }))
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
                const _0x19ad3b = _0x12c69c['currentSocket'];
                _0x19ad3b['ev']['on']('creds.update', async _0x3839ed => {
                    console['log']('🔄\x20creds.update\x20triggered');
                    await _0x2a788e();
                    if (_0x3839ed['me']?.['id']) {
                        console['log']('✅\x20Session\x20valid\x20via\x20creds.update:\x20' + _0x3839ed['me']['id']);
                        _0x12c69c['credsUpdated'] = !![];
                        if (!_0x3839ed['registered']) {
                            _0x3839ed['registered'] = !![];
                            await _0x2a788e();
                            console['log']('🔧\x20Forced\x20registered:\x20true\x20via\x20creds.update');
                        }
                        if (!_0x12c69c['sessionSaved'] && !_0x12c69c['sessionCompleted']) {
                            await this['saveSessionData'](_0x12c69c, _0x19ad3b, _0xc6a4b1);
                        }
                    }
                });
                const _0x4a5ef3 = async _0x3bc58c => {
                    if (_0x12c69c['qrGenerated'] || _0x12c69c['sessionCompleted'] || _0x12c69c['isCleaningUp'])
                        return;
                    _0x12c69c['qrGenerated'] = !![];
                    try {
                        const _0x56db1a = await _0x0_0x3b4444['toDataURL'](_0x3bc58c, { 'errorCorrectionLevel': 'M' });
                        _0x45e609({
                            'type': 'qr',
                            'qr': _0x56db1a,
                            'sessionId': _0xc6a4b1
                        });
                    } catch (_0x5f24d8) {
                        console['error']('Error\x20generating\x20QR\x20code:', _0x5f24d8);
                        _0x22bb9c(_0x5f24d8);
                    }
                };
                _0x19ad3b['ev']['on']('connection.update', async _0x55410b => {
                    if (_0x12c69c['isCleaningUp'])
                        return;
                    const {
                        connection: _0xfc203e,
                        lastDisconnect: _0x46a7a7,
                        qr: _0x1aa51e,
                        isNewLogin: _0x33d473
                    } = _0x55410b;
                    if (_0x1aa51e && !_0x12c69c['qrGenerated'] && !_0x12c69c['sessionCompleted']) {
                        await _0x4a5ef3(_0x1aa51e);
                    }
                    if (_0x33d473) {
                        console['log']('🔐\x20New\x20login\x20via\x20QR\x20code');
                    }
                    if (_0xfc203e === 'open') {
                        console['log']('🔐\x20Connection\x20open');
                        if (_0x12c69c['sessionSaved'] || _0x12c69c['sessionCompleted'])
                            return;
                        if (_0x12c69c['credsUpdated']) {
                            const _0x17c8a9 = await this['saveSessionData'](_0x12c69c, _0x19ad3b, _0xc6a4b1);
                            const _0x3d4e51 = Object['keys'](_0x19ad3b['authState']['creds']['me'] || {})['length'] > 0x0 ? jidNormalizedUser(_0x19ad3b['authState']['creds']['me']['id']) : null;
                            if (_0x3d4e51) {
                                await delay(0x7d0);
                                const _0x453e05 = await _0x19ad3b['sendMessage'](_0x3d4e51, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x17c8a9 + '`\x0a\x0a📌\x20SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE,DON\x27T\x20SHARE\x20IT!' });
                                await _0x19ad3b['sendMessage'](_0x3d4e51, { 'quoted': _0x453e05 });
                            }
                        } else {
                            console['log']('⏳\x20Waiting\x20for\x20session\x20to\x20be\x20ready...');
                            await delay(0xbb8);
                            const _0x25b263 = _0x12c69c['sessionDir'] + '/creds.json';
                            if (_0x0_0x2d2f9c['existsSync'](_0x25b263)) {
                                try {
                                    const _0x164bd4 = await _0x0_0x2d2f9c['readFile'](_0x25b263, 'utf-8');
                                    const _0x18155c = JSON['parse'](_0x164bd4);
                                    if (_0x18155c['me']?.['id']) {
                                        console['log']('✅\x20Session\x20found\x20via\x20file\x20check');
                                        const _0x30aeff = await this['saveSessionData'](_0x12c69c, _0x19ad3b, _0xc6a4b1);
                                        const _0x40bfd9 = Object['keys'](_0x19ad3b['authState']['creds']['me'] || {})['length'] > 0x0 ? jidNormalizedUser(_0x19ad3b['authState']['creds']['me']['id']) : null;
                                        if (_0x40bfd9) {
                                            await delay(0x7d0);
                                            const _0x24163d = await _0x19ad3b['sendMessage'](_0x40bfd9, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x30aeff + '`\x0a\x0a📌\x20SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE,DON\x27T\x20SHARE\x20IT!' });
                                            await _0x19ad3b['sendMessage'](_0x40bfd9, { 'quoted': _0x24163d });
                                        }
                                    }
                                } catch (_0x85043f) {
                                    console['log']('⚠️\x20File\x20check\x20failed:', _0x85043f['message']);
                                }
                            }
                        }
                    }
                    if (_0xfc203e === 'close') {
                        console['log']('🔌\x20Connection\x20closed');
                        const _0x44aa4a = _0x46a7a7?.['error']?.['output']?.['statusCode'];
                        if (_0x44aa4a === DisconnectReason['restartRequired']) {
                            console['log']('🔄\x20Restart\x20required\x20-\x20Baileys\x20will\x20reconnect\x20automatically');
                            const _0x2d0ae0 = _0x12c69c['sessionDir'] + '/creds.json';
                            if (_0x0_0x2d2f9c['existsSync'](_0x2d0ae0)) {
                                try {
                                    const _0x51bb5b = await _0x0_0x2d2f9c['readFile'](_0x2d0ae0, 'utf-8');
                                    const _0x14144c = JSON['parse'](_0x51bb5b);
                                    if (_0x14144c['me']?.['id']) {
                                        console['log']('✅\x20Session\x20found\x20via\x20file\x20check');
                                        const _0x3d2ef3 = await this['saveSessionData'](_0x12c69c, _0x19ad3b, _0xc6a4b1);
                                        const _0x198943 = Object['keys'](_0x19ad3b['authState']['creds']['me'] || {})['length'] > 0x0 ? jidNormalizedUser(_0x19ad3b['authState']['creds']['me']['id']) : null;
                                        if (_0x198943) {
                                            await delay(0x7d0);
                                            const _0x33c63e = await _0x19ad3b['sendMessage'](_0x198943, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x3d2ef3 + '`\x0a\x0a📌\x20SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE,DON\x27T\x20SHARE\x20IT!' });
                                            await _0x19ad3b['sendMessage'](_0x198943, { 'quoted': _0x33c63e });
                                        }
                                    }
                                } catch (_0x1a4e02) {
                                    console['log']('⚠️\x20File\x20check\x20failed:', _0x1a4e02['message']);
                                }
                            }
                            return;
                        }
                        if (_0x12c69c['sessionSaved'] || _0x12c69c['sessionCompleted']) {
                            await this['cleanup'](_0xc6a4b1, 'session_complete');
                            return;
                        }
                        if (_0x44aa4a === DisconnectReason['loggedOut'] || _0x44aa4a === 0x191) {
                            await this['cleanup'](_0xc6a4b1, 'logged_out');
                            _0x22bb9c(new Error('Invalid\x20QR\x20code\x20or\x20session\x20expired'));
                        } else {
                            if (_0x12c69c['reconnectAttempts'] < MAX_RECONNECT_ATTEMPTS) {
                                _0x12c69c['reconnectAttempts']++;
                                await delay(0x7d0);
                                await this['initiateQRSession'](_0xc6a4b1);
                            } else {
                                await this['cleanup'](_0xc6a4b1, 'max_reconnects');
                                _0x22bb9c(new Error('Max\x20reconnection\x20attempts\x20reached'));
                            }
                        }
                    }
                });
                _0x12c69c['timeoutHandle'] = setTimeout(async () => {
                    if (!_0x12c69c['sessionCompleted'] && !_0x12c69c['isCleaningUp']) {
                        await this['cleanup'](_0xc6a4b1, 'timeout');
                        _0x22bb9c(new Error('Session\x20timeout'));
                    }
                }, SESSION_TIMEOUT);
            } catch (_0x422035) {
                console['error']('Error\x20initiating\x20QR\x20session:', _0x422035);
                _0x22bb9c(_0x422035);
            }
        });
    }
    async ['initiatePairSession'](_0x5a9f4b) {
        const _0x586c8e = this['sessions']['get'](_0x5a9f4b);
        if (!_0x586c8e)
            throw new Error('Session\x20not\x20found');
        return new Promise(async (_0x48b61f, _0x347904) => {
            try {
                const {version: _0xe30dc3} = await fetchLatestBaileysVersion();
                if (!await _0x0_0x2d2f9c['pathExists'](_0x586c8e['sessionDir'])) {
                    await _0x0_0x2d2f9c['mkdir'](_0x586c8e['sessionDir'], { 'recursive': !![] });
                }
                const {
                    state: _0x46520a,
                    saveCreds: _0x2ad99
                } = await useMultiFileAuthState(_0x586c8e['sessionDir']);
                _0x586c8e['currentSocket'] = makeWASocket({
                    'version': _0xe30dc3,
                    'logger': _0x0_0x25ec94({ 'level': 'silent' }),
                    'browser': Browsers['macOS']('Chrome'),
                    'auth': {
                        'creds': _0x46520a['creds'],
                        'keys': makeCacheableSignalKeyStore(_0x46520a['keys'], _0x0_0x25ec94({ 'level': 'fatal' })['child']({ 'level': 'fatal' }))
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
                const _0x14d856 = _0x586c8e['currentSocket'];
                _0x14d856['ev']['on']('connection.update', async _0xe5fa9 => {
                    if (_0x586c8e['isCleaningUp'])
                        return;
                    const {
                        connection: _0x8dcfe7,
                        lastDisconnect: _0x3e5097,
                        isNewLogin: _0x26c2d8
                    } = _0xe5fa9;
                    if (_0x8dcfe7 === 'open') {
                        if (_0x586c8e['sessionCompleted'])
                            return;
                        _0x586c8e['sessionCompleted'] = !![];
                        try {
                            const _0xa32b09 = _0x586c8e['sessionDir'] + '/creds.json';
                            const _0x5b86d9 = './session';
                            if (!await _0x0_0x2d2f9c['pathExists'](_0x5b86d9)) {
                                await _0x0_0x2d2f9c['mkdir'](_0x5b86d9, { 'recursive': !![] });
                            }
                            if (await _0x0_0x2d2f9c['pathExists'](_0xa32b09)) {
                                await _0x0_0x2d2f9c['copy'](_0x586c8e['sessionDir'], _0x5b86d9);
                                console['log']('✅\x20Session\x20credentials\x20saved\x20to\x20main\x20session\x20directory');
                            }
                            await delay(0xbb8);
                            if (_0x0_0x2d2f9c['existsSync'](_0xa32b09)) {
                                const _0x2b72e8 = JSON['parse'](await _0x0_0x2d2f9c['readFile'](_0xa32b09, 'utf-8'));
                                const _0x153eec = _0x586c8e['phoneNumber'] || Object['keys'](_0x2b72e8['me'] || {})[0x0]?.['split']('@')[0x0] || null;
                                const _0x14cc66 = await _0x0_0x512f7a['saveSession'](_0x2b72e8, _0x153eec);
                                console['log']('✅\x20Session\x20saved\x20to\x20database:\x20' + _0x14cc66);
                                const _0x45b1cd = Object['keys'](_0x14d856['authState']['creds']['me'] || {})['length'] > 0x0 ? jidNormalizedUser(_0x14d856['authState']['creds']['me']['id']) : jidNormalizedUser(_0x586c8e['phoneNumber'] + '@s.whatsapp.net');
                                if (_0x45b1cd) {
                                    await delay(0x7d0);
                                    const _0x2c7607 = await _0x14d856['sendMessage'](_0x45b1cd, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x14cc66 + '`\x0a\x0a📌\x20SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE,DON\x27T\x20SHARE\x20IT!' });
                                    await _0x14d856['sendMessage'](_0x45b1cd, { 'quoted': _0x2c7607 });
                                }
                            }
                        } catch (_0xcd97cb) {
                            console['error']('Error\x20saving\x20session:', _0xcd97cb);
                        } finally {
                            setTimeout(async () => {
                                await this['cleanup'](_0x5a9f4b, 'session_complete');
                            }, 0x2710);
                        }
                    }
                    if (_0x26c2d8)
                        console['log']('🔐\x20New\x20login\x20via\x20pair\x20code\x20for\x20' + _0x586c8e['phoneNumber']);
                    if (_0x8dcfe7 === 'close') {
                        if (_0x586c8e['sessionCompleted'] || _0x586c8e['isCleaningUp']) {
                            await this['cleanup'](_0x5a9f4b, 'already_complete');
                            return;
                        }
                        const _0x513bd7 = _0x3e5097?.['error']?.['output']?.['statusCode'];
                        if (_0x513bd7 === DisconnectReason['loggedOut'] || _0x513bd7 === 0x191) {
                            await this['cleanup'](_0x5a9f4b, 'logged_out');
                            _0x347904(new Error('Invalid\x20pairing\x20code\x20or\x20session\x20expired'));
                        } else if (_0x586c8e['pairingCodeSent'] && !_0x586c8e['sessionCompleted']) {
                            if (_0x586c8e['reconnectAttempts'] < MAX_RECONNECT_ATTEMPTS) {
                                _0x586c8e['reconnectAttempts']++;
                                await delay(0x7d0);
                                await this['initiatePairSession'](_0x5a9f4b);
                            } else {
                                await this['cleanup'](_0x5a9f4b, 'max_reconnects');
                                _0x347904(new Error('Max\x20reconnection\x20attempts\x20reached'));
                            }
                        }
                    }
                });
                if (!_0x14d856['authState']['creds']['registered'] && !_0x586c8e['pairingCodeSent'] && !_0x586c8e['isCleaningUp']) {
                    await delay(0x5dc);
                    try {
                        _0x586c8e['pairingCodeSent'] = !![];
                        let _0x45ec33 = await _0x14d856['requestPairingCode'](_0x586c8e['phoneNumber']);
                        _0x45ec33 = _0x45ec33?.['match'](/.{1,4}/g)?.['join']('-') || _0x45ec33;
                        _0x48b61f({
                            'type': 'pair',
                            'code': _0x45ec33,
                            'sessionId': _0x5a9f4b,
                            'phoneNumber': _0x586c8e['phoneNumber']
                        });
                    } catch (_0x8e1b4b) {
                        _0x586c8e['pairingCodeSent'] = ![];
                        _0x347904(new Error('Failed\x20to\x20get\x20pairing\x20code:\x20' + _0x8e1b4b['message']));
                    }
                }
                _0x14d856['ev']['on']('creds.update', _0x2ad99);
                _0x586c8e['timeoutHandle'] = setTimeout(async () => {
                    if (!_0x586c8e['sessionCompleted'] && !_0x586c8e['isCleaningUp']) {
                        await this['cleanup'](_0x5a9f4b, 'timeout');
                        _0x347904(new Error('Pairing\x20timeout'));
                    }
                }, SESSION_TIMEOUT);
            } catch (_0x55e5d4) {
                console['error']('Error\x20initiating\x20pair\x20session:', _0x55e5d4);
                _0x347904(_0x55e5d4);
            }
        });
    }
    ['isSessionComplete'](_0x2f34e8) {
        const _0x3a0f24 = this['sessions']['get'](_0x2f34e8);
        if (!_0x3a0f24)
            return ![];
        if (!_0x3a0f24['sessionCompleted'])
            return ![];
        try {
            const _0x26305f = _0x3a0f24['sessionDir'] + '/creds.json';
            const _0x2c2f98 = './session/creds.json';
            let _0x57ce8c = _0x0_0x2d2f9c['existsSync'](_0x2c2f98) ? _0x2c2f98 : _0x0_0x2d2f9c['existsSync'](_0x26305f) ? _0x26305f : null;
            if (_0x57ce8c) {
                const _0x45c995 = JSON['parse'](_0x0_0x2d2f9c['readFileSync'](_0x57ce8c, 'utf-8'));
                return _0x45c995['registered'] === !![] && !!_0x45c995['me']?.['id'];
            }
        } catch (_0x2a4452) {
            console['error']('Error\x20verifying\x20physical\x20creds\x20in\x20isSessionComplete:', _0x2a4452);
            return ![];
        }
        return ![];
    }
}
export default new PairingManager();