import _0x0_0x4b06e2 from 'fs-extra';
import _0x0_0x5366e6 from 'pino';
import _0x0_0x1b4faa from 'qrcode';
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
import _0x0_0x40194c from 'awesome-phonenumber';
import _0x0_0x1f190c from './sessionManager.js';
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
        const _0x10cfbf = Date['now']()['toString']() + Math['random']()['toString'](0x24)['substring'](0x2, 0x9);
        const _0x2eb98a = './temp_session_' + _0x10cfbf;
        const _0x392657 = {
            'sessionId': _0x10cfbf,
            'sessionDir': _0x2eb98a,
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
        this['sessions']['set'](_0x10cfbf, _0x392657);
        return _0x10cfbf;
    }
    async ['createPairSession'](_0x3ed42e) {
        if (!_0x3ed42e)
            throw new Error('Phone\x20number\x20is\x20required');
        _0x3ed42e = _0x3ed42e['replace'](/[^0-9]/g, '');
        const _0x49c750 = _0x0_0x40194c('+' + _0x3ed42e);
        if (!_0x49c750['isValid']())
            throw new Error('Invalid\x20phone\x20number');
        _0x3ed42e = _0x49c750['getNumber']('e164')['replace']('+', '');
        const _0x2e138b = Date['now']()['toString']() + Math['random']()['toString'](0x24)['substring'](0x2, 0x9);
        const _0x47d603 = './temp_session_' + _0x2e138b;
        const _0xc0b479 = {
            'sessionId': _0x2e138b,
            'sessionDir': _0x47d603,
            'phoneNumber': _0x3ed42e,
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
        this['sessions']['set'](_0x2e138b, _0xc0b479);
        return _0x2e138b;
    }
    async ['removeSessionDir'](_0x32cf24) {
        try {
            if (await _0x0_0x4b06e2['pathExists'](_0x32cf24)) {
                await _0x0_0x4b06e2['remove'](_0x32cf24);
                return !![];
            }
        } catch (_0x43e7a8) {
            console['error']('Error\x20removing\x20session\x20dir:', _0x43e7a8);
        }
        return ![];
    }
    async ['cleanupSessions']() {
        const _0x51a493 = Date['now']();
        const _0x2e4bf5 = [];
        for (const [_0x399441, _0x17d652] of this['sessions']['entries']()) {
            if (_0x51a493 - _0x17d652['createdAt'] > SESSION_TIMEOUT) {
                _0x2e4bf5['push'](_0x399441);
            }
        }
        for (const _0x24a9c9 of _0x2e4bf5) {
            const _0x1ff40a = this['sessions']['get'](_0x24a9c9);
            await this['cleanup'](_0x24a9c9, 'session_expired');
        }
    }
    async ['cleanup'](_0x416216, _0x4d4812 = 'unknown') {
        const _0x510f00 = this['sessions']['get'](_0x416216);
        if (!_0x510f00)
            return;
        if (_0x510f00['isCleaningUp'])
            return;
        console['log']('🧹\x20Cleanup\x20session\x20' + _0x416216 + '\x20-\x20' + _0x4d4812);
        if (_0x4d4812 === 'session_complete' || _0x510f00['sessionCompleted']) {
            if (_0x510f00['timeoutHandle']) {
                clearTimeout(_0x510f00['timeoutHandle']);
                _0x510f00['timeoutHandle'] = null;
            }
            this['sessions']['delete'](_0x416216);
            console['log']('✅\x20Socket\x20handed\x20over\x20to\x20index.js\x20successfully.');
            return;
        }
        _0x510f00['isCleaningUp'] = !![];
        if (_0x510f00['timeoutHandle']) {
            clearTimeout(_0x510f00['timeoutHandle']);
            _0x510f00['timeoutHandle'] = null;
        }
        if (_0x510f00['currentSocket']) {
            try {
                _0x510f00['currentSocket']['ev']['removeAllListeners']();
                await _0x510f00['currentSocket']['end']();
            } catch (_0x4338cc) {
            }
            _0x510f00['currentSocket'] = null;
        }
        setTimeout(async () => {
            await this['removeSessionDir'](_0x510f00['sessionDir']);
            this['sessions']['delete'](_0x416216);
        }, 0x1388);
    }
    async ['saveSessionData'](_0x5ae739, _0x5b35bc, _0x35b057) {
        if (this['sessionSaveInProgress']['get'](_0x35b057)) {
            console['log']('⏳\x20Session\x20save\x20already\x20in\x20progress...');
            return;
        }
        this['sessionSaveInProgress']['set'](_0x35b057, !![]);
        try {
            const _0x27ad7e = _0x5ae739['sessionDir'] + '/creds.json';
            const _0x5b61ec = './session';
            if (!_0x0_0x4b06e2['existsSync'](_0x27ad7e)) {
                console['log']('❌\x20No\x20credentials\x20file\x20found');
                this['sessionSaveInProgress']['delete'](_0x35b057);
                return;
            }
            const _0x554ad5 = await _0x0_0x4b06e2['readFile'](_0x27ad7e, 'utf-8');
            const _0x380fe2 = JSON['parse'](_0x554ad5);
            if (!_0x380fe2['me']?.['id']) {
                console['log']('⚠️\x20Session\x20not\x20valid\x20(no\x20me.id)');
                this['sessionSaveInProgress']['delete'](_0x35b057);
                return;
            }
            console['log']('✅\x20Session\x20valid:\x20me.id\x20=\x20' + _0x380fe2['me']['id']);
            if (!_0x380fe2['registered']) {
                _0x380fe2['registered'] = !![];
                _0x0_0x4b06e2['writeFileSync'](_0x27ad7e, JSON['stringify'](_0x380fe2, null, 0x2));
                console['log']('🔧\x20Forced\x20registered:\x20true');
            }
            if (!await _0x0_0x4b06e2['pathExists'](_0x5b61ec)) {
                await _0x0_0x4b06e2['mkdir'](_0x5b61ec, { 'recursive': !![] });
            }
            await _0x0_0x4b06e2['copy'](_0x5ae739['sessionDir'], _0x5b61ec);
            console['log']('✅\x20Session\x20credentials\x20saved\x20to\x20main\x20session\x20directory');
            let _0x232e53 = _0x5ae739['phoneNumber'] || null;
            if (!_0x232e53 && _0x380fe2['me']?.['id']) {
                _0x232e53 = _0x380fe2['me']['id']['split'](':')[0x0];
            }
            const _0x13c12b = await _0x0_0x1f190c['saveSession'](_0x380fe2, _0x232e53);
            console['log']('✅\x20Session\x20saved\x20to\x20database:\x20' + _0x13c12b);
            const _0x4839f8 = _0x5b35bc['authState']['creds']['me']?.['id'] ? jidNormalizedUser(_0x5b35bc['authState']['creds']['me']['id']) : jidNormalizedUser(_0x5ae739['phoneNumber'] + '@s.whatsapp.net');
            if (_0x4839f8) {
                const _0x5ea1d1 = await _0x5b35bc['sendMessage'](_0x4839f8, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x13c12b + '`\x0a\x0a📌\x20*SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE\x20DON\x27T\x20SHARE\x20IT*\x20✅' });
                await _0x5b35bc['sendMessage'](_0x4839f8, {
                    'text': MESSAGE,
                    'quoted': _0x5ea1d1
                });
                console['log']('✅\x20Success\x20message\x20sent');
            }
            _0x5ae739['sessionCompleted'] = !![];
            _0x5ae739['sessionSaved'] = !![];
            setTimeout(async () => {
                await this['cleanup'](_0x35b057, 'session_complete');
            }, 0x1388);
        } catch (_0x2d3a60) {
            console['error']('❌\x20Error\x20saving\x20session:', _0x2d3a60);
        } finally {
            this['sessionSaveInProgress']['delete'](_0x35b057);
        }
    }
    async ['initiateQRSession'](_0x545460) {
        const _0x30a857 = this['sessions']['get'](_0x545460);
        if (!_0x30a857)
            throw new Error('Session\x20not\x20found');
        return new Promise(async (_0x6594ab, _0x59ca78) => {
            try {
                const {version: _0x3e6344} = await fetchLatestBaileysVersion();
                if (!await _0x0_0x4b06e2['pathExists'](_0x30a857['sessionDir'])) {
                    await _0x0_0x4b06e2['mkdir'](_0x30a857['sessionDir'], { 'recursive': !![] });
                }
                const {
                    state: _0x2e19f5,
                    saveCreds: _0x47b481
                } = await useMultiFileAuthState(_0x30a857['sessionDir']);
                _0x30a857['currentSocket'] = makeWASocket({
                    'version': _0x3e6344,
                    'logger': _0x0_0x5366e6({ 'level': 'silent' }),
                    'browser': Browsers['macOS']('Chrome'),
                    'auth': {
                        'creds': _0x2e19f5['creds'],
                        'keys': makeCacheableSignalKeyStore(_0x2e19f5['keys'], _0x0_0x5366e6({ 'level': 'fatal' })['child']({ 'level': 'fatal' }))
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
                const _0x4892c5 = _0x30a857['currentSocket'];
                _0x4892c5['ev']['on']('creds.update', async _0x9c6591 => {
                    console['log']('🔄\x20creds.update\x20triggered');
                    await _0x47b481();
                    if (_0x9c6591['me']?.['id']) {
                        console['log']('✅\x20Session\x20valid\x20via\x20creds.update:\x20' + _0x9c6591['me']['id']);
                        _0x30a857['credsUpdated'] = !![];
                        if (!_0x9c6591['registered']) {
                            _0x9c6591['registered'] = !![];
                            await _0x47b481();
                            console['log']('🔧\x20Forced\x20registered:\x20true\x20via\x20creds.update');
                        }
                        if (!_0x30a857['sessionSaved'] && !_0x30a857['sessionCompleted']) {
                            await this['saveSessionData'](_0x30a857, _0x4892c5, _0x545460);
                        }
                    }
                });
                const _0x587eaf = async _0x49da9b => {
                    if (_0x30a857['qrGenerated'] || _0x30a857['sessionCompleted'] || _0x30a857['isCleaningUp'])
                        return;
                    _0x30a857['qrGenerated'] = !![];
                    try {
                        const _0x29b4ea = await _0x0_0x1b4faa['toDataURL'](_0x49da9b, { 'errorCorrectionLevel': 'M' });
                        _0x6594ab({
                            'type': 'qr',
                            'qr': _0x29b4ea,
                            'sessionId': _0x545460
                        });
                    } catch (_0x1fe1ed) {
                        console['error']('Error\x20generating\x20QR\x20code:', _0x1fe1ed);
                        _0x59ca78(_0x1fe1ed);
                    }
                };
                _0x4892c5['ev']['on']('connection.update', async _0x24cfa5 => {
                    if (_0x30a857['isCleaningUp'])
                        return;
                    const {
                        connection: _0x30b7c4,
                        lastDisconnect: _0x1d046d,
                        qr: _0x2e2cab,
                        isNewLogin: _0x2a505e
                    } = _0x24cfa5;
                    if (_0x2e2cab && !_0x30a857['qrGenerated'] && !_0x30a857['sessionCompleted']) {
                        await _0x587eaf(_0x2e2cab);
                    }
                    if (_0x2a505e) {
                        console['log']('🔐\x20New\x20login\x20via\x20QR\x20code');
                    }
                    if (_0x30b7c4 === 'open') {
                        console['log']('🔐\x20Connection\x20open');
                        if (_0x30a857['sessionSaved'] || _0x30a857['sessionCompleted'])
                            return;
                        if (_0x30a857['credsUpdated']) {
                            const _0x1609bd = await this['saveSessionData'](_0x30a857, _0x4892c5, _0x545460);
                            const _0x352849 = Object['keys'](_0x4892c5['authState']['creds']['me'] || {})['length'] > 0x0 ? jidNormalizedUser(_0x4892c5['authState']['creds']['me']['id']) : null;
                            if (_0x352849) {
                                await delay(0x7d0);
                                const _0x2d2e11 = await _0x4892c5['sendMessage'](_0x352849, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x1609bd + '`\x0a\x0a📌\x20SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE,DON\x27T\x20SHARE\x20IT!' });
                                await _0x4892c5['sendMessage'](_0x352849, { 'quoted': _0x2d2e11 });
                            }
                        } else {
                            console['log']('⏳\x20Waiting\x20for\x20session\x20to\x20be\x20ready...');
                            await delay(0xbb8);
                            const _0x517b35 = _0x30a857['sessionDir'] + '/creds.json';
                            if (_0x0_0x4b06e2['existsSync'](_0x517b35)) {
                                try {
                                    const _0x4f115b = await _0x0_0x4b06e2['readFile'](_0x517b35, 'utf-8');
                                    const _0x50436d = JSON['parse'](_0x4f115b);
                                    if (_0x50436d['me']?.['id']) {
                                        console['log']('✅\x20Session\x20found\x20via\x20file\x20check');
                                        const _0x9e81b4 = await this['saveSessionData'](_0x30a857, _0x4892c5, _0x545460);
                                        const _0x1327b6 = Object['keys'](_0x4892c5['authState']['creds']['me'] || {})['length'] > 0x0 ? jidNormalizedUser(_0x4892c5['authState']['creds']['me']['id']) : null;
                                        if (_0x1327b6) {
                                            await delay(0x7d0);
                                            const _0x48fb76 = await _0x4892c5['sendMessage'](_0x1327b6, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x9e81b4 + '`\x0a\x0a📌\x20SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE,DON\x27T\x20SHARE\x20IT!' });
                                            await _0x4892c5['sendMessage'](_0x1327b6, { 'quoted': _0x48fb76 });
                                        }
                                    }
                                } catch (_0x275faa) {
                                    console['log']('⚠️\x20File\x20check\x20failed:', _0x275faa['message']);
                                }
                            }
                        }
                    }
                    if (_0x30b7c4 === 'close') {
                        console['log']('🔌\x20Connection\x20closed');
                        const _0x488bf1 = _0x1d046d?.['error']?.['output']?.['statusCode'];
                        if (_0x488bf1 === DisconnectReason['restartRequired']) {
                            console['log']('🔄\x20Restart\x20required\x20-\x20Baileys\x20will\x20reconnect\x20automatically');
                            return;
                        }
                        if (_0x30a857['sessionSaved'] || _0x30a857['sessionCompleted']) {
                            await this['cleanup'](_0x545460, 'session_complete');
                            return;
                        }
                        if (_0x488bf1 === DisconnectReason['loggedOut'] || _0x488bf1 === 0x191) {
                            await this['cleanup'](_0x545460, 'logged_out');
                            _0x59ca78(new Error('Invalid\x20QR\x20code\x20or\x20session\x20expired'));
                        } else {
                            if (_0x30a857['reconnectAttempts'] < MAX_RECONNECT_ATTEMPTS) {
                                _0x30a857['reconnectAttempts']++;
                                await delay(0x7d0);
                                await this['initiateQRSession'](_0x545460);
                            } else {
                                await this['cleanup'](_0x545460, 'max_reconnects');
                                _0x59ca78(new Error('Max\x20reconnection\x20attempts\x20reached'));
                            }
                        }
                    }
                });
                _0x30a857['timeoutHandle'] = setTimeout(async () => {
                    if (!_0x30a857['sessionCompleted'] && !_0x30a857['isCleaningUp']) {
                        await this['cleanup'](_0x545460, 'timeout');
                        _0x59ca78(new Error('Session\x20timeout'));
                    }
                }, SESSION_TIMEOUT);
            } catch (_0x3032a4) {
                console['error']('Error\x20initiating\x20QR\x20session:', _0x3032a4);
                _0x59ca78(_0x3032a4);
            }
        });
    }
    async ['initiatePairSession'](_0x5ea46d) {
        const _0x21fa41 = this['sessions']['get'](_0x5ea46d);
        if (!_0x21fa41)
            throw new Error('Session\x20not\x20found');
        return new Promise(async (_0xd83749, _0x4fc363) => {
            try {
                const {version: _0x1f0049} = await fetchLatestBaileysVersion();
                if (!await _0x0_0x4b06e2['pathExists'](_0x21fa41['sessionDir'])) {
                    await _0x0_0x4b06e2['mkdir'](_0x21fa41['sessionDir'], { 'recursive': !![] });
                }
                const {
                    state: _0x2eea52,
                    saveCreds: _0x4777d6
                } = await useMultiFileAuthState(_0x21fa41['sessionDir']);
                _0x21fa41['currentSocket'] = makeWASocket({
                    'version': _0x1f0049,
                    'logger': _0x0_0x5366e6({ 'level': 'silent' }),
                    'browser': Browsers['macOS']('Chrome'),
                    'auth': {
                        'creds': _0x2eea52['creds'],
                        'keys': makeCacheableSignalKeyStore(_0x2eea52['keys'], _0x0_0x5366e6({ 'level': 'fatal' })['child']({ 'level': 'fatal' }))
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
                const _0x58bb92 = _0x21fa41['currentSocket'];
                _0x58bb92['ev']['on']('connection.update', async _0x2badec => {
                    if (_0x21fa41['isCleaningUp'])
                        return;
                    const {
                        connection: _0x313e01,
                        lastDisconnect: _0x5841fb,
                        isNewLogin: _0x26c018
                    } = _0x2badec;
                    if (_0x313e01 === 'open') {
                        if (_0x21fa41['sessionCompleted'])
                            return;
                        _0x21fa41['sessionCompleted'] = !![];
                        try {
                            const _0x4fe474 = _0x21fa41['sessionDir'] + '/creds.json';
                            const _0xd3ba27 = './session';
                            if (!await _0x0_0x4b06e2['pathExists'](_0xd3ba27)) {
                                await _0x0_0x4b06e2['mkdir'](_0xd3ba27, { 'recursive': !![] });
                            }
                            if (await _0x0_0x4b06e2['pathExists'](_0x4fe474)) {
                                await _0x0_0x4b06e2['copy'](_0x21fa41['sessionDir'], _0xd3ba27);
                                console['log']('✅\x20Session\x20credentials\x20saved\x20to\x20main\x20session\x20directory');
                            }
                            await delay(0xbb8);
                            if (_0x0_0x4b06e2['existsSync'](_0x4fe474)) {
                                const _0x2802c5 = JSON['parse'](await _0x0_0x4b06e2['readFile'](_0x4fe474, 'utf-8'));
                                const _0x195429 = _0x21fa41['phoneNumber'] || Object['keys'](_0x2802c5['me'] || {})[0x0]?.['split']('@')[0x0] || null;
                                const _0x39477e = await _0x0_0x1f190c['saveSession'](_0x2802c5, _0x195429);
                                console['log']('✅\x20Session\x20saved\x20to\x20database:\x20' + _0x39477e);
                                const _0x153341 = Object['keys'](_0x58bb92['authState']['creds']['me'] || {})['length'] > 0x0 ? jidNormalizedUser(_0x58bb92['authState']['creds']['me']['id']) : jidNormalizedUser(_0x21fa41['phoneNumber'] + '@s.whatsapp.net');
                                if (_0x153341) {
                                    await delay(0x7d0);
                                    const _0x361468 = await _0x58bb92['sendMessage'](_0x153341, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x39477e + '`\x0a\x0a📌\x20SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE,DON\x27T\x20SHARE\x20IT!' });
                                    await _0x58bb92['sendMessage'](_0x153341, { 'quoted': _0x361468 });
                                }
                            }
                        } catch (_0x3241fb) {
                            console['error']('Error\x20saving\x20session:', _0x3241fb);
                        } finally {
                            setTimeout(async () => {
                                await this['cleanup'](_0x5ea46d, 'session_complete');
                            }, 0x2710);
                        }
                    }
                    if (_0x26c018)
                        console['log']('🔐\x20New\x20login\x20via\x20pair\x20code\x20for\x20' + _0x21fa41['phoneNumber']);
                    if (_0x313e01 === 'close') {
                        if (_0x21fa41['sessionCompleted'] || _0x21fa41['isCleaningUp']) {
                            await this['cleanup'](_0x5ea46d, 'already_complete');
                            return;
                        }
                        const _0x2058c7 = _0x5841fb?.['error']?.['output']?.['statusCode'];
                        if (_0x2058c7 === DisconnectReason['loggedOut'] || _0x2058c7 === 0x191) {
                            await this['cleanup'](_0x5ea46d, 'logged_out');
                            _0x4fc363(new Error('Invalid\x20pairing\x20code\x20or\x20session\x20expired'));
                        } else if (_0x21fa41['pairingCodeSent'] && !_0x21fa41['sessionCompleted']) {
                            if (_0x21fa41['reconnectAttempts'] < MAX_RECONNECT_ATTEMPTS) {
                                _0x21fa41['reconnectAttempts']++;
                                await delay(0x7d0);
                                await this['initiatePairSession'](_0x5ea46d);
                            } else {
                                await this['cleanup'](_0x5ea46d, 'max_reconnects');
                                _0x4fc363(new Error('Max\x20reconnection\x20attempts\x20reached'));
                            }
                        }
                    }
                });
                if (!_0x58bb92['authState']['creds']['registered'] && !_0x21fa41['pairingCodeSent'] && !_0x21fa41['isCleaningUp']) {
                    await delay(0x5dc);
                    try {
                        _0x21fa41['pairingCodeSent'] = !![];
                        let _0x49a82f = await _0x58bb92['requestPairingCode'](_0x21fa41['phoneNumber']);
                        _0x49a82f = _0x49a82f?.['match'](/.{1,4}/g)?.['join']('-') || _0x49a82f;
                        _0xd83749({
                            'type': 'pair',
                            'code': _0x49a82f,
                            'sessionId': _0x5ea46d,
                            'phoneNumber': _0x21fa41['phoneNumber']
                        });
                    } catch (_0x46ce95) {
                        _0x21fa41['pairingCodeSent'] = ![];
                        _0x4fc363(new Error('Failed\x20to\x20get\x20pairing\x20code:\x20' + _0x46ce95['message']));
                    }
                }
                _0x58bb92['ev']['on']('creds.update', _0x4777d6);
                _0x21fa41['timeoutHandle'] = setTimeout(async () => {
                    if (!_0x21fa41['sessionCompleted'] && !_0x21fa41['isCleaningUp']) {
                        await this['cleanup'](_0x5ea46d, 'timeout');
                        _0x4fc363(new Error('Pairing\x20timeout'));
                    }
                }, SESSION_TIMEOUT);
            } catch (_0x41cdbc) {
                console['error']('Error\x20initiating\x20pair\x20session:', _0x41cdbc);
                _0x4fc363(_0x41cdbc);
            }
        });
    }
    ['isSessionComplete'](_0x5219e2) {
        const _0x2f8a7f = this['sessions']['get'](_0x5219e2);
        if (!_0x2f8a7f)
            return ![];
        if (!_0x2f8a7f['sessionCompleted'])
            return ![];
        try {
            const _0x55fcdb = _0x2f8a7f['sessionDir'] + '/creds.json';
            const _0x1d8c26 = './session/creds.json';
            let _0x12e8c9 = _0x0_0x4b06e2['existsSync'](_0x1d8c26) ? _0x1d8c26 : _0x0_0x4b06e2['existsSync'](_0x55fcdb) ? _0x55fcdb : null;
            if (_0x12e8c9) {
                const _0x287436 = JSON['parse'](_0x0_0x4b06e2['readFileSync'](_0x12e8c9, 'utf-8'));
                return _0x287436['registered'] === !![] && !!_0x287436['me']?.['id'];
            }
        } catch (_0x2d8ada) {
            console['error']('Error\x20verifying\x20physical\x20creds\x20in\x20isSessionComplete:', _0x2d8ada);
            return ![];
        }
        return ![];
    }
}
export default new PairingManager();