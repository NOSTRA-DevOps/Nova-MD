import _0x0_0x5f18ad from 'fs-extra';
import _0x0_0x1eed28 from 'pino';
import _0x0_0x479004 from 'qrcode';
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
import _0x0_0x2f8bf3 from 'awesome-phonenumber';
import _0x0_0x5750f8 from './sessionManager.js';
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
        const _0x322330 = Date['now']()['toString']() + Math['random']()['toString'](0x24)['substring'](0x2, 0x9);
        const _0x13ba34 = './temp_session_' + _0x322330;
        const _0x520c7e = {
            'sessionId': _0x322330,
            'sessionDir': _0x13ba34,
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
        this['sessions']['set'](_0x322330, _0x520c7e);
        return _0x322330;
    }
    async ['createPairSession'](_0x17ec47) {
        if (!_0x17ec47)
            throw new Error('Phone\x20number\x20is\x20required');
        _0x17ec47 = _0x17ec47['replace'](/[^0-9]/g, '');
        const _0x136328 = _0x0_0x2f8bf3('+' + _0x17ec47);
        if (!_0x136328['isValid']())
            throw new Error('Invalid\x20phone\x20number');
        _0x17ec47 = _0x136328['getNumber']('e164')['replace']('+', '');
        const _0xba6318 = Date['now']()['toString']() + Math['random']()['toString'](0x24)['substring'](0x2, 0x9);
        const _0x17e8b3 = './temp_session_' + _0xba6318;
        const _0x319cb0 = {
            'sessionId': _0xba6318,
            'sessionDir': _0x17e8b3,
            'phoneNumber': _0x17ec47,
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
        this['sessions']['set'](_0xba6318, _0x319cb0);
        return _0xba6318;
    }
    async ['removeSessionDir'](_0xacb815) {
        try {
            if (await _0x0_0x5f18ad['pathExists'](_0xacb815)) {
                await _0x0_0x5f18ad['remove'](_0xacb815);
                return !![];
            }
        } catch (_0x596969) {
            console['error']('Error\x20removing\x20session\x20dir:', _0x596969);
        }
        return ![];
    }
    async ['cleanupSessions']() {
        const _0x5e89cb = Date['now']();
        const _0x4e8f38 = [];
        for (const [_0x218633, _0x34d83b] of this['sessions']['entries']()) {
            if (_0x5e89cb - _0x34d83b['createdAt'] > SESSION_TIMEOUT) {
                _0x4e8f38['push'](_0x218633);
            }
        }
        for (const _0x219e53 of _0x4e8f38) {
            const _0x31be5c = this['sessions']['get'](_0x219e53);
            await this['cleanup'](_0x219e53, 'session_expired');
        }
    }
    async ['cleanup'](_0x57f911, _0x4a255a = 'unknown') {
        const _0x42af98 = this['sessions']['get'](_0x57f911);
        if (!_0x42af98)
            return;
        if (_0x42af98['isCleaningUp'])
            return;
        console['log']('🧹\x20Cleanup\x20session\x20' + _0x57f911 + '\x20-\x20' + _0x4a255a);
        if (_0x4a255a === 'session_complete' || _0x42af98['sessionCompleted']) {
            if (_0x42af98['timeoutHandle']) {
                clearTimeout(_0x42af98['timeoutHandle']);
                _0x42af98['timeoutHandle'] = null;
            }
            this['sessions']['delete'](_0x57f911);
            console['log']('✅\x20Socket\x20handed\x20over\x20to\x20index.js\x20successfully.');
            return;
        }
        _0x42af98['isCleaningUp'] = !![];
        if (_0x42af98['timeoutHandle']) {
            clearTimeout(_0x42af98['timeoutHandle']);
            _0x42af98['timeoutHandle'] = null;
        }
        if (_0x42af98['currentSocket']) {
            try {
                _0x42af98['currentSocket']['ev']['removeAllListeners']();
                await _0x42af98['currentSocket']['end']();
            } catch (_0x3f2c2b) {
            }
            _0x42af98['currentSocket'] = null;
        }
        setTimeout(async () => {
            await this['removeSessionDir'](_0x42af98['sessionDir']);
            this['sessions']['delete'](_0x57f911);
        }, 0x1388);
    }
    async ['saveSessionData'](_0x472f56, _0x5efcd5, _0x2b202f) {
        if (this['sessionSaveInProgress']['get'](_0x2b202f)) {
            console['log']('⏳\x20Session\x20save\x20already\x20in\x20progress...');
            return;
        }
        this['sessionSaveInProgress']['set'](_0x2b202f, !![]);
        try {
            const _0x155039 = _0x472f56['sessionDir'] + '/creds.json';
            const _0x5855a1 = './session';
            if (!_0x0_0x5f18ad['existsSync'](_0x155039)) {
                console['log']('❌\x20No\x20credentials\x20file\x20found');
                this['sessionSaveInProgress']['delete'](_0x2b202f);
                return;
            }
            const _0xb324c3 = await _0x0_0x5f18ad['readFile'](_0x155039, 'utf-8');
            const _0xdcbdea = JSON['parse'](_0xb324c3);
            if (!_0xdcbdea['me']?.['id']) {
                console['log']('⚠️\x20Session\x20not\x20valid\x20(no\x20me.id)');
                this['sessionSaveInProgress']['delete'](_0x2b202f);
                return;
            }
            console['log']('✅\x20Session\x20valid:\x20me.id\x20=\x20' + _0xdcbdea['me']['id']);
            if (!_0xdcbdea['registered']) {
                _0xdcbdea['registered'] = !![];
                _0x0_0x5f18ad['writeFileSync'](_0x155039, JSON['stringify'](_0xdcbdea, null, 0x2));
                console['log']('🔧\x20Forced\x20registered:\x20true');
            }
            if (!await _0x0_0x5f18ad['pathExists'](_0x5855a1)) {
                await _0x0_0x5f18ad['mkdir'](_0x5855a1, { 'recursive': !![] });
            }
            await _0x0_0x5f18ad['copy'](_0x472f56['sessionDir'], _0x5855a1);
            console['log']('✅\x20Session\x20credentials\x20saved\x20to\x20main\x20session\x20directory');
            let _0x48ebee = _0x472f56['phoneNumber'] || null;
            if (!_0x48ebee && _0xdcbdea['me']?.['id']) {
                _0x48ebee = _0xdcbdea['me']['id']['split'](':')[0x0];
            }
            const _0x97c767 = await _0x0_0x5750f8['saveSession'](_0xdcbdea, _0x48ebee);
            console['log']('✅\x20Session\x20saved\x20to\x20database:\x20' + _0x97c767);
            const _0x4182a0 = _0x5efcd5['authState']['creds']['me']?.['id'] ? jidNormalizedUser(_0x5efcd5['authState']['creds']['me']['id']) : jidNormalizedUser(_0x472f56['phoneNumber'] + '@s.whatsapp.net');
            if (_0x4182a0) {
                const _0x2faa1a = await _0x5efcd5['sendMessage'](_0x4182a0, { 'text': '✅\x20*Session\x20ID:*\x20`' + _0x97c767 + '`\x0a\x0a📌\x20*SESSION\x20SAVED\x20INSIDE\x20YOUR\x20DATABASE\x20DON\x27T\x20SHARE\x20IT*\x20✅' });
                await _0x5efcd5['sendMessage'](_0x4182a0, {
                    'text': MESSAGE,
                    'quoted': _0x2faa1a
                });
                console['log']('✅\x20Success\x20message\x20sent');
            }
            _0x472f56['sessionCompleted'] = !![];
            _0x472f56['sessionSaved'] = !![];
            setTimeout(async () => {
                await this['cleanup'](_0x2b202f, 'session_complete');
            }, 0x1388);
        } catch (_0xd397a1) {
            console['error']('❌\x20Error\x20saving\x20session:', _0xd397a1);
        } finally {
            this['sessionSaveInProgress']['delete'](_0x2b202f);
        }
    }
    async ['initiateQRSession'](_0x2822dd) {
        const _0x116ad4 = this['sessions']['get'](_0x2822dd);
        if (!_0x116ad4)
            throw new Error('Session\x20not\x20found');
        return new Promise(async (_0x4d1177, _0x457cf7) => {
            try {
                const {version: _0xcb2c1f} = await fetchLatestBaileysVersion();
                if (!await _0x0_0x5f18ad['pathExists'](_0x116ad4['sessionDir'])) {
                    await _0x0_0x5f18ad['mkdir'](_0x116ad4['sessionDir'], { 'recursive': !![] });
                }
                const {
                    state: _0x41caa7,
                    saveCreds: _0x4bd7b2
                } = await useMultiFileAuthState(_0x116ad4['sessionDir']);
                _0x116ad4['currentSocket'] = makeWASocket({
                    'version': _0xcb2c1f,
                    'logger': _0x0_0x1eed28({ 'level': 'silent' }),
                    'browser': Browsers['macOS']('Chrome'),
                    'auth': {
                        'creds': _0x41caa7['creds'],
                        'keys': makeCacheableSignalKeyStore(_0x41caa7['keys'], _0x0_0x1eed28({ 'level': 'fatal' })['child']({ 'level': 'fatal' }))
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
                const _0x2e3aef = _0x116ad4['currentSocket'];
                _0x2e3aef['ev']['on']('creds.update', async _0x1aae22 => {
                    console['log']('🔄\x20creds.update\x20triggered');
                    await _0x4bd7b2();
                    if (_0x1aae22['me']?.['id']) {
                        console['log']('✅\x20Session\x20valid\x20via\x20creds.update:\x20' + _0x1aae22['me']['id']);
                        _0x116ad4['credsUpdated'] = !![];
                        if (!_0x1aae22['registered']) {
                            _0x1aae22['registered'] = !![];
                            await _0x4bd7b2();
                            console['log']('🔧\x20Forced\x20registered:\x20true\x20via\x20creds.update');
                        }
                        if (!_0x116ad4['sessionSaved'] && !_0x116ad4['sessionCompleted']) {
                            await this['saveSessionData'](_0x116ad4, _0x2e3aef, _0x2822dd);
                        }
                    }
                });
                const _0xc5552b = async _0x3f631f => {
                    if (_0x116ad4['qrGenerated'] || _0x116ad4['sessionCompleted'] || _0x116ad4['isCleaningUp'])
                        return;
                    _0x116ad4['qrGenerated'] = !![];
                    try {
                        const _0x35b225 = await _0x0_0x479004['toDataURL'](_0x3f631f, { 'errorCorrectionLevel': 'M' });
                        _0x4d1177({
                            'type': 'qr',
                            'qr': _0x35b225,
                            'sessionId': _0x2822dd
                        });
                    } catch (_0x59926a) {
                        console['error']('Error\x20generating\x20QR\x20code:', _0x59926a);
                        _0x457cf7(_0x59926a);
                    }
                };
                _0x2e3aef['ev']['on']('connection.update', async _0x3820e0 => {
                    if (_0x116ad4['isCleaningUp'])
                        return;
                    const {
                        connection: _0x3350e7,
                        lastDisconnect: _0x424de8,
                        qr: _0x581fe7,
                        isNewLogin: _0x57d706
                    } = _0x3820e0;
                    if (_0x581fe7 && !_0x116ad4['qrGenerated'] && !_0x116ad4['sessionCompleted']) {
                        await _0xc5552b(_0x581fe7);
                    }
                    if (_0x57d706) {
                        console['log']('🔐\x20New\x20login\x20via\x20QR\x20code');
                    }
                    if (_0x3350e7 === 'open') {
                        console['log']('🔐\x20Connection\x20open');
                        if (_0x116ad4['sessionSaved'] || _0x116ad4['sessionCompleted'])
                            return;
                        if (_0x116ad4['credsUpdated']) {
                            await this['saveSessionData'](_0x116ad4, _0x2e3aef, _0x2822dd);
                        } else {
                            console['log']('⏳\x20Waiting\x20for\x20session\x20to\x20be\x20ready...');
                            await delay(0xbb8);
                            const _0x375b5e = _0x116ad4['sessionDir'] + '/creds.json';
                            if (_0x0_0x5f18ad['existsSync'](_0x375b5e)) {
                                try {
                                    const _0x14ed4e = await _0x0_0x5f18ad['readFile'](_0x375b5e, 'utf-8');
                                    const _0x135326 = JSON['parse'](_0x14ed4e);
                                    if (_0x135326['me']?.['id']) {
                                        console['log']('✅\x20Session\x20found\x20via\x20file\x20check');
                                        await this['saveSessionData'](_0x116ad4, _0x2e3aef, _0x2822dd);
                                    }
                                } catch (_0x413c43) {
                                    console['log']('⚠️\x20File\x20check\x20failed:', _0x413c43['message']);
                                }
                            }
                        }
                    }
                    if (_0x3350e7 === 'close') {
                        console['log']('🔌\x20Connection\x20closed');
                        const _0x282f4f = _0x424de8?.['error']?.['output']?.['statusCode'];
                        if (_0x282f4f === DisconnectReason['restartRequired']) {
                            console['log']('🔄\x20Restart\x20required\x20-\x20Baileys\x20will\x20reconnect\x20automatically');
                            return;
                        }
                        if (_0x116ad4['sessionSaved'] || _0x116ad4['sessionCompleted']) {
                            await this['cleanup'](_0x2822dd, 'session_complete');
                            return;
                        }
                        if (_0x282f4f === DisconnectReason['loggedOut'] || _0x282f4f === 0x191) {
                            await this['cleanup'](_0x2822dd, 'logged_out');
                            _0x457cf7(new Error('Invalid\x20QR\x20code\x20or\x20session\x20expired'));
                        } else {
                            if (_0x116ad4['reconnectAttempts'] < MAX_RECONNECT_ATTEMPTS) {
                                _0x116ad4['reconnectAttempts']++;
                                await delay(0x7d0);
                                await this['initiateQRSession'](_0x2822dd);
                            } else {
                                await this['cleanup'](_0x2822dd, 'max_reconnects');
                                _0x457cf7(new Error('Max\x20reconnection\x20attempts\x20reached'));
                            }
                        }
                    }
                });
                _0x116ad4['timeoutHandle'] = setTimeout(async () => {
                    if (!_0x116ad4['sessionCompleted'] && !_0x116ad4['isCleaningUp']) {
                        await this['cleanup'](_0x2822dd, 'timeout');
                        _0x457cf7(new Error('Session\x20timeout'));
                    }
                }, SESSION_TIMEOUT);
            } catch (_0x437154) {
                console['error']('Error\x20initiating\x20QR\x20session:', _0x437154);
                _0x457cf7(_0x437154);
            }
        });
    }
    async ['initiatePairSession'](_0x4e9e72) {
        const _0x1c9e99 = this['sessions']['get'](_0x4e9e72);
        if (!_0x1c9e99)
            throw new Error('Session\x20not\x20found');
        return new Promise(async (_0x13942c, _0x1c49dd) => {
            try {
                const {version: _0x48ea88} = await fetchLatestBaileysVersion();
                if (!await _0x0_0x5f18ad['pathExists'](_0x1c9e99['sessionDir'])) {
                    await _0x0_0x5f18ad['mkdir'](_0x1c9e99['sessionDir'], { 'recursive': !![] });
                }
                const {
                    state: _0xe22b05,
                    saveCreds: _0x271890
                } = await useMultiFileAuthState(_0x1c9e99['sessionDir']);
                _0x1c9e99['currentSocket'] = makeWASocket({
                    'version': _0x48ea88,
                    'logger': _0x0_0x1eed28({ 'level': 'silent' }),
                    'browser': Browsers['macOS']('Chrome'),
                    'auth': {
                        'creds': _0xe22b05['creds'],
                        'keys': makeCacheableSignalKeyStore(_0xe22b05['keys'], _0x0_0x1eed28({ 'level': 'fatal' })['child']({ 'level': 'fatal' }))
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
                const _0x43a754 = _0x1c9e99['currentSocket'];
                _0x43a754['ev']['on']('creds.update', async _0x531c19 => {
                    console['log']('🔄\x20creds.update\x20triggered\x20(pair)');
                    await _0x271890();
                    if (_0x531c19['me']?.['id']) {
                        console['log']('✅\x20Session\x20valid\x20via\x20creds.update:\x20' + _0x531c19['me']['id']);
                        _0x1c9e99['credsUpdated'] = !![];
                        if (!_0x531c19['registered']) {
                            _0x531c19['registered'] = !![];
                            await _0x271890();
                            console['log']('🔧\x20Forced\x20registered:\x20true');
                        }
                        if (!_0x1c9e99['sessionSaved'] && !_0x1c9e99['sessionCompleted']) {
                            await this['saveSessionData'](_0x1c9e99, _0x43a754, _0x4e9e72);
                        }
                    }
                });
                _0x43a754['ev']['on']('connection.update', async _0x543797 => {
                    if (_0x1c9e99['isCleaningUp'])
                        return;
                    const {
                        connection: _0x215cb3,
                        lastDisconnect: _0x312200,
                        isNewLogin: _0x1ef485
                    } = _0x543797;
                    if (_0x1ef485) {
                        console['log']('🔐\x20New\x20login\x20via\x20pair\x20code\x20for\x20' + _0x1c9e99['phoneNumber']);
                    }
                    if (_0x215cb3 === 'open') {
                        console['log']('🔐\x20Connection\x20open\x20(pair)');
                        if (_0x1c9e99['sessionSaved'] || _0x1c9e99['sessionCompleted'])
                            return;
                        if (_0x1c9e99['credsUpdated']) {
                            await this['saveSessionData'](_0x1c9e99, _0x43a754, _0x4e9e72);
                        } else {
                            console['log']('⏳\x20Waiting\x20for\x20session\x20to\x20be\x20ready...');
                            await delay(0xbb8);
                            const _0x477a47 = _0x1c9e99['sessionDir'] + '/creds.json';
                            if (_0x0_0x5f18ad['existsSync'](_0x477a47)) {
                                try {
                                    const _0x30af29 = await _0x0_0x5f18ad['readFile'](_0x477a47, 'utf-8');
                                    const _0x4ec29d = JSON['parse'](_0x30af29);
                                    if (_0x4ec29d['me']?.['id']) {
                                        console['log']('✅\x20Session\x20found\x20via\x20file\x20check\x20(pair)');
                                        await this['saveSessionData'](_0x1c9e99, _0x43a754, _0x4e9e72);
                                    }
                                } catch (_0x2a3567) {
                                    console['log']('⚠️\x20File\x20check\x20failed:', _0x2a3567['message']);
                                }
                            }
                        }
                    }
                    if (_0x215cb3 === 'close') {
                        console['log']('🔌\x20Connection\x20closed\x20(pair)');
                        if (_0x1c9e99['sessionSaved'] || _0x1c9e99['sessionCompleted']) {
                            await this['cleanup'](_0x4e9e72, 'session_complete');
                            return;
                        }
                        const _0x558457 = _0x312200?.['error']?.['output']?.['statusCode'];
                        if (_0x558457 === DisconnectReason['loggedOut'] || _0x558457 === 0x191) {
                            await this['cleanup'](_0x4e9e72, 'logged_out');
                            _0x1c49dd(new Error('Invalid\x20pairing\x20code\x20or\x20session\x20expired'));
                        } else if (_0x1c9e99['pairingCodeSent'] && !_0x1c9e99['sessionCompleted']) {
                            if (_0x1c9e99['reconnectAttempts'] < MAX_RECONNECT_ATTEMPTS) {
                                _0x1c9e99['reconnectAttempts']++;
                                await delay(0x7d0);
                                await this['initiatePairSession'](_0x4e9e72);
                            } else {
                                await this['cleanup'](_0x4e9e72, 'max_reconnects');
                                _0x1c49dd(new Error('Max\x20reconnection\x20attempts\x20reached'));
                            }
                        }
                    }
                });
                if (!_0x43a754['authState']['creds']['registered'] && !_0x1c9e99['pairingCodeSent'] && !_0x1c9e99['isCleaningUp']) {
                    await delay(0x5dc);
                    try {
                        _0x1c9e99['pairingCodeSent'] = !![];
                        let _0x3675c3 = await _0x43a754['requestPairingCode'](_0x1c9e99['phoneNumber']);
                        _0x3675c3 = _0x3675c3?.['match'](/.{1,4}/g)?.['join']('-') || _0x3675c3;
                        _0x13942c({
                            'type': 'pair',
                            'code': _0x3675c3,
                            'sessionId': _0x4e9e72,
                            'phoneNumber': _0x1c9e99['phoneNumber']
                        });
                    } catch (_0x2c11a7) {
                        _0x1c9e99['pairingCodeSent'] = ![];
                        _0x1c49dd(new Error('Failed\x20to\x20get\x20pairing\x20code:\x20' + _0x2c11a7['message']));
                    }
                }
                _0x1c9e99['timeoutHandle'] = setTimeout(async () => {
                    if (!_0x1c9e99['sessionCompleted'] && !_0x1c9e99['isCleaningUp']) {
                        await this['cleanup'](_0x4e9e72, 'timeout');
                        _0x1c49dd(new Error('Pairing\x20timeout'));
                    }
                }, SESSION_TIMEOUT);
            } catch (_0x1d4b54) {
                console['error']('Error\x20initiating\x20pair\x20session:', _0x1d4b54);
                _0x1c49dd(_0x1d4b54);
            }
        });
    }
    ['isSessionComplete'](_0x2d95b8) {
        const _0x1d8ef6 = this['sessions']['get'](_0x2d95b8);
        if (!_0x1d8ef6)
            return ![];
        if (!_0x1d8ef6['sessionCompleted'])
            return ![];
        try {
            const _0x544877 = _0x1d8ef6['sessionDir'] + '/creds.json';
            const _0x1b5e24 = './session/creds.json';
            let _0x5d0cf5 = _0x0_0x5f18ad['existsSync'](_0x1b5e24) ? _0x1b5e24 : _0x0_0x5f18ad['existsSync'](_0x544877) ? _0x544877 : null;
            if (_0x5d0cf5) {
                const _0x538fc1 = JSON['parse'](_0x0_0x5f18ad['readFileSync'](_0x5d0cf5, 'utf-8'));
                return _0x538fc1['registered'] === !![] && !!_0x538fc1['me']?.['id'];
            }
        } catch (_0x107a99) {
            console['error']('Error\x20verifying\x20physical\x20creds\x20in\x20isSessionComplete:', _0x107a99);
            return ![];
        }
        return ![];
    }
}
export default new PairingManager();