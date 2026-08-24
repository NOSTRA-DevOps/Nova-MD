import _0x0_0x1ceadd, {
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    Browsers
} from '@whiskeysockets/baileys';
import _0x0_0x3ecc35 from 'node-cache';
import _0x0_0x1a0dde from 'pino';
import _0x0_0x35b48c from 'fs';
import _0x0_0x5ce58c, { dirname } from 'path';
import { fileURLToPath } from 'url';
import _0x0_0x30018b from './lightweight_store.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
if (!global['conns'])
    global['conns'] = [];
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL);
export function generateSessionId(_0x528d67 = 0x6, _0x3167f9 = 0x4) {
    const _0x1ff076 = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let _0x42e405 = '';
    for (let _0x27d5af = 0x0; _0x27d5af < _0x528d67; _0x27d5af++) {
        _0x42e405 += _0x1ff076['charAt'](Math['floor'](Math['random']() * _0x1ff076['length']));
    }
    const _0x292cfa = String(Math['floor'](Math['random']() * Math['pow'](0xa, _0x3167f9)))['padStart'](_0x3167f9, '0');
    return 'NOVA' + _0x42e405 + _0x292cfa;
}
export async function saveCloneToMainDB(_0x464c5f, _0x278e1d, _0x2ed455, _0x43c1e2, _0xac54, _0x68ced6 = null) {
    try {
        let _0x13127 = null;
        if (_0x68ced6 && _0x68ced6 > 0x0) {
            _0x13127 = Date['now']() + _0x68ced6 * 0x18 * 0x3c * 0x3c * 0x3e8;
        }
        const _0x47eb69 = {
            'phoneNumber': _0x278e1d,
            'dbUrl': _0x2ed455 || 'local',
            'dbType': _0x43c1e2 || 'local',
            'status': _0xac54 || 'configured',
            'createdAt': Date['now'](),
            'updatedAt': Date['now'](),
            'expiryDays': _0x68ced6 || null,
            'expiresAt': _0x13127,
            'expired': ![]
        };
        if (HAS_DB) {
            await _0x0_0x30018b['saveSetting']('clones', _0x464c5f, _0x47eb69);
            console['log']('✅\x20[Clone\x20' + _0x464c5f + ']\x20Saved\x20to\x20main\x20database' + (_0x68ced6 ? '\x20(expires\x20in\x20' + _0x68ced6 + '\x20days)' : ''));
        } else {
            const _0x31db56 = _0x0_0x5ce58c['join'](process['cwd'](), 'session', 'clones');
            if (!_0x0_0x35b48c['existsSync'](_0x31db56)) {
                _0x0_0x35b48c['mkdirSync'](_0x31db56, { 'recursive': !![] });
            }
            _0x0_0x35b48c['writeFileSync'](_0x0_0x5ce58c['join'](_0x31db56, _0x464c5f + '.json'), JSON['stringify'](_0x47eb69, null, 0x2));
            console['log']('✅\x20[Clone\x20' + _0x464c5f + ']\x20Saved\x20locally' + (_0x68ced6 ? '\x20(expires\x20in\x20' + _0x68ced6 + '\x20days)' : ''));
        }
        return !![];
    } catch (_0x2163a8) {
        console['error']('❌\x20Failed\x20to\x20save\x20clone\x20' + _0x464c5f + ':', _0x2163a8['message']);
        return ![];
    }
}
export async function getAllClonesFromMainDB() {
    try {
        let _0x4fe4f4 = [];
        if (HAS_DB) {
            const _0x1b8159 = await _0x0_0x30018b['getSetting']('clones', 'all') || {};
            _0x4fe4f4 = Object['entries'](_0x1b8159)['map'](([_0x378fb0, _0x352f05]) => ({
                'authId': _0x378fb0,
                'phoneNumber': _0x352f05['phoneNumber'],
                'dbType': _0x352f05['dbType'] || 'local',
                'status': _0x352f05['status'] || 'unknown',
                'createdAt': _0x352f05['createdAt'],
                'updatedAt': _0x352f05['updatedAt'],
                'expiryDays': _0x352f05['expiryDays'] || null,
                'expiresAt': _0x352f05['expiresAt'] || null,
                'expired': _0x352f05['expired'] || ![]
            }));
        } else {
            const _0xd6180c = _0x0_0x5ce58c['join'](process['cwd'](), 'session', 'clones');
            if (!_0x0_0x35b48c['existsSync'](_0xd6180c))
                return [];
            const _0x42b9e0 = _0x0_0x35b48c['readdirSync'](_0xd6180c)['filter'](_0x162d5c => _0x162d5c['endsWith']('.json'));
            for (const _0x9c4e93 of _0x42b9e0) {
                const _0x453a42 = _0x9c4e93['replace']('.json', '');
                const _0x262487 = JSON['parse'](_0x0_0x35b48c['readFileSync'](_0x0_0x5ce58c['join'](_0xd6180c, _0x9c4e93), 'utf-8'));
                _0x4fe4f4['push']({
                    'authId': _0x453a42,
                    'phoneNumber': _0x262487['phoneNumber'],
                    'dbType': _0x262487['dbType'] || 'local',
                    'status': _0x262487['status'] || 'unknown',
                    'createdAt': _0x262487['createdAt'],
                    'updatedAt': _0x262487['updatedAt'],
                    'expiryDays': _0x262487['expiryDays'] || null,
                    'expiresAt': _0x262487['expiresAt'] || null,
                    'expired': _0x262487['expired'] || ![]
                });
            }
        }
        const _0xa75f70 = Date['now']();
        for (const _0x26035e of _0x4fe4f4) {
            if (_0x26035e['expiresAt'] && _0x26035e['expiresAt'] < _0xa75f70 && !_0x26035e['expired']) {
                _0x26035e['expired'] = !![];
                _0x26035e['status'] = 'expired';
                await updateCloneStatus(_0x26035e['authId'], 'expired', !![]);
            }
        }
        return _0x4fe4f4;
    } catch (_0x1fb421) {
        console['error']('Failed\x20to\x20get\x20all\x20clones:', _0x1fb421['message']);
        return [];
    }
}
async function updateCloneStatus(_0x4d69cb, _0x1753e9, _0x582639 = ![]) {
    try {
        let _0x1cb2be = null;
        if (HAS_DB) {
            _0x1cb2be = await _0x0_0x30018b['getSetting']('clones', _0x4d69cb);
        } else {
            const _0x5f5d39 = _0x0_0x5ce58c['join'](process['cwd'](), 'session', 'clones');
            const _0x5cb4dc = _0x0_0x5ce58c['join'](_0x5f5d39, _0x4d69cb + '.json');
            if (_0x0_0x35b48c['existsSync'](_0x5cb4dc)) {
                _0x1cb2be = JSON['parse'](_0x0_0x35b48c['readFileSync'](_0x5cb4dc, 'utf-8'));
            }
        }
        if (_0x1cb2be) {
            _0x1cb2be['status'] = _0x1753e9;
            _0x1cb2be['expired'] = _0x582639;
            _0x1cb2be['updatedAt'] = Date['now']();
            if (HAS_DB) {
                await _0x0_0x30018b['saveSetting']('clones', _0x4d69cb, _0x1cb2be);
            } else {
                const _0x5e73a5 = _0x0_0x5ce58c['join'](process['cwd'](), 'session', 'clones');
                const _0x5c5a60 = _0x0_0x5ce58c['join'](_0x5e73a5, _0x4d69cb + '.json');
                _0x0_0x35b48c['writeFileSync'](_0x5c5a60, JSON['stringify'](_0x1cb2be, null, 0x2));
            }
        }
    } catch (_0xf5ad39) {
        console['error']('Failed\x20to\x20update\x20clone\x20status\x20' + _0x4d69cb + ':', _0xf5ad39['message']);
    }
}
export async function getCloneByPhoneNumber(_0x8b2a66) {
    const _0x48d835 = await getAllClonesFromMainDB();
    return _0x48d835['filter'](_0x4a2dea => _0x4a2dea['phoneNumber'] === _0x8b2a66);
}
export async function deleteCloneFromMainDB(_0x23b379) {
    try {
        if (HAS_DB) {
            await _0x0_0x30018b['saveSetting']('clones', _0x23b379, null);
        } else {
            const _0x2c2e6f = _0x0_0x5ce58c['join'](process['cwd'](), 'session', 'clones');
            const _0x2fb93c = _0x0_0x5ce58c['join'](_0x2c2e6f, _0x23b379 + '.json');
            if (_0x0_0x35b48c['existsSync'](_0x2fb93c)) {
                _0x0_0x35b48c['unlinkSync'](_0x2fb93c);
            }
        }
        console['log']('✅\x20[Clone\x20' + _0x23b379 + ']\x20Removed\x20from\x20main\x20database');
        return !![];
    } catch (_0x215b86) {
        console['error']('Failed\x20to\x20delete\x20clone\x20' + _0x23b379 + ':', _0x215b86['message']);
        return ![];
    }
}
export async function startClone(_0x458674, _0x36217f, _0x41d1f5, _0x26e435, _0x1c1e2d, _0x5d2407, _0x275b99, _0x4adf68) {
    try {
        const {
            state: _0x1869d5,
            saveCreds: _0x3c04bd
        } = await useMultiFileAuthState(_0x458674);
        const {version: _0x5ef952} = await fetchLatestBaileysVersion();
        const _0x263be7 = new _0x0_0x3ecc35();
        const _0x2fa9dc = _0x0_0x1ceadd({
            'version': _0x5ef952,
            'logger': _0x0_0x1a0dde({ 'level': 'silent' }),
            'printQRInTerminal': ![],
            'browser': Browsers['macOS']('Chrome'),
            'auth': {
                'creds': _0x1869d5['creds'],
                'keys': makeCacheableSignalKeyStore(_0x1869d5['keys'], _0x0_0x1a0dde({ 'level': 'fatal' }))
            },
            'markOnlineOnConnect': !![],
            'msgRetryCounterCache': _0x263be7,
            'connectTimeoutMs': 0x1d4c0,
            'defaultQueryTimeoutMs': 0x0,
            'keepAliveIntervalMs': 0x7530,
            'mobile': ![]
        });
        let _0x1cc766 = null;
        if (!_0x2fa9dc['authState']['creds']['registered']) {
            await new Promise(_0x3ed7f7 => setTimeout(_0x3ed7f7, 0x1770));
            try {
                let _0x598c59 = await _0x2fa9dc['requestPairingCode'](_0x36217f);
                _0x1cc766 = _0x598c59?.['match'](/.{1,4}/g)?.['join']('-') || _0x598c59;
                await saveCloneToMainDB(_0x41d1f5, _0x36217f, _0x1c1e2d || 'local', _0x26e435, 'pairing', _0x5d2407);
            } catch (_0x283f0f) {
                console['error']('Pairing\x20Error:', _0x283f0f);
                throw new Error('Failed\x20to\x20get\x20pairing\x20code:\x20' + _0x283f0f['message']);
            }
        }
        _0x2fa9dc['ev']['on']('creds.update', async () => {
            await _0x3c04bd();
            try {
                const _0x7bdc10 = JSON['parse'](_0x0_0x35b48c['readFileSync'](_0x0_0x5ce58c['join'](_0x458674, 'creds.json'), 'utf-8'));
                await saveCloneToMainDB(_0x41d1f5, _0x36217f, _0x1c1e2d || 'local', _0x26e435, 'active', _0x5d2407);
            } catch (_0x1155da) {
                console['error']('Creds\x20save\x20error:', _0x1155da['message']);
            }
        });
        _0x2fa9dc['ev']['on']('connection.update', async _0x11addc => {
            const {
                connection: _0x5d0b41,
                lastDisconnect: _0x173cf6
            } = _0x11addc;
            if (_0x5d0b41 === 'open') {
                global['conns']['push'](_0x2fa9dc);
                await saveCloneToMainDB(_0x41d1f5, _0x36217f, _0x1c1e2d || 'local', _0x26e435, 'online', _0x5d2407);
                if (_0x275b99) {
                    await _0x275b99(_0x2fa9dc, _0x41d1f5, _0x36217f);
                }
            }
            if (_0x5d0b41 === 'close') {
                const _0x49944a = _0x173cf6?.['error']?.['output']?.['statusCode'];
                if (_0x49944a !== DisconnectReason['loggedOut']) {
                    console['log']('🔄\x20[Clone\x20' + _0x41d1f5 + ']\x20Reconnecting...');
                    setTimeout(() => startClone(_0x458674, _0x36217f, _0x41d1f5, _0x26e435, _0x1c1e2d, _0x5d2407, _0x275b99, _0x4adf68), 0x1388);
                } else {
                    await saveCloneToMainDB(_0x41d1f5, _0x36217f, _0x1c1e2d || 'local', _0x26e435, 'offline', _0x5d2407);
                    const _0x5510b7 = global['conns']['indexOf'](_0x2fa9dc);
                    if (_0x5510b7 > -0x1)
                        global['conns']['splice'](_0x5510b7, 0x1);
                    if (_0x4adf68) {
                        await _0x4adf68(_0x2fa9dc, _0x41d1f5, _0x36217f);
                    }
                }
            }
        });
        try {
            const {handleMessages: _0x2f6e6f} = await import('./messageHandler.js');
            _0x2fa9dc['ev']['on']('messages.upsert', async _0x434480 => {
                await _0x2f6e6f(_0x2fa9dc, _0x434480);
            });
        } catch (_0x27d817) {
            console['error']('Handler\x20linkage\x20failed:', _0x27d817['message']);
        }
        return {
            'conn': _0x2fa9dc,
            'pairingCode': _0x1cc766
        };
    } catch (_0x3c2faf) {
        console['error']('Failed\x20to\x20start\x20clone\x20' + _0x41d1f5 + ':', _0x3c2faf['message']);
        throw _0x3c2faf;
    }
}
export async function deleteClone(_0x9cb13d) {
    try {
        const _0x38a165 = global['conns']['findIndex'](_0x264d8d => {
            try {
                return _0x264d8d['authState']?.['creds']?.['me']?.['id']?.['includes'](_0x9cb13d) || _0x264d8d['user']?.['id']?.['includes'](_0x9cb13d);
            } catch (_0x52bd0e) {
                return ![];
            }
        });
        if (_0x38a165 > -0x1) {
            try {
                await global['conns'][_0x38a165]['end']();
                global['conns']['splice'](_0x38a165, 0x1);
                console['log']('✅\x20[Clone\x20' + _0x9cb13d + ']\x20Disconnected');
            } catch (_0x4fe360) {
                console['error']('Failed\x20to\x20disconnect\x20clone\x20' + _0x9cb13d + ':', _0x4fe360['message']);
            }
        }
        await deleteCloneFromMainDB(_0x9cb13d);
        const _0x1f47ea = _0x0_0x5ce58c['join'](process['cwd'](), 'session', 'clones', _0x9cb13d);
        if (_0x0_0x35b48c['existsSync'](_0x1f47ea)) {
            _0x0_0x35b48c['rmSync'](_0x1f47ea, {
                'recursive': !![],
                'force': !![]
            });
        }
        return { 'success': !![] };
    } catch (_0x40cf6b) {
        console['error']('Failed\x20to\x20delete\x20clone\x20' + _0x9cb13d + ':', _0x40cf6b['message']);
        return {
            'success': ![],
            'error': _0x40cf6b['message']
        };
    }
}
export async function checkAndCleanExpiredClones() {
    try {
        const _0x1187c2 = await getAllClonesFromMainDB();
        const _0x13890c = Date['now']();
        let _0x569302 = 0x0;
        for (const _0xa0cba0 of _0x1187c2) {
            if (_0xa0cba0['expiresAt'] && _0xa0cba0['expiresAt'] < _0x13890c && !_0xa0cba0['expired']) {
                console['log']('🧹\x20Cleaning\x20expired\x20clone:\x20' + _0xa0cba0['authId'] + '\x20(' + _0xa0cba0['phoneNumber'] + ')');
                await deleteClone(_0xa0cba0['authId']);
                _0x569302++;
            }
        }
        if (_0x569302 > 0x0) {
            console['log']('✅\x20Cleaned\x20' + _0x569302 + '\x20expired\x20clones');
        }
        return _0x569302;
    } catch (_0xedca2c) {
        console['error']('Failed\x20to\x20check\x20expired\x20clones:', _0xedca2c['message']);
        return 0x0;
    }
}
export async function isCloneOwner(_0xb4d15, _0x5c3ff5) {
    try {
        const _0x5b8488 = await getAllClonesFromMainDB();
        const _0x4ba35e = _0x5b8488['find'](_0x5ea5e7 => _0x5ea5e7['authId'] === _0x5c3ff5);
        if (!_0x4ba35e)
            return ![];
        const _0x1df472 = _0xb4d15['split']('@')[0x0];
        return _0x4ba35e['phoneNumber'] === _0x1df472;
    } catch (_0x4b1084) {
        console['error']('Check\x20clone\x20owner\x20error:', _0x4b1084['message']);
        return ![];
    }
}