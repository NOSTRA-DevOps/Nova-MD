import _0x0_0xabe00b, {
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    Browsers
} from '@whiskeysockets/baileys';
import _0x0_0x146523 from 'node-cache';
import _0x0_0x1afb18 from 'pino';
import _0x0_0x1d42b4 from 'fs';
import _0x0_0xa36db3, { dirname } from 'path';
import { fileURLToPath } from 'url';
import _0x0_0xc4628c from './lightweight_store.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
if (!global['conns'])
    global['conns'] = [];
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL);
export function generateSessionId(_0x4c5051 = 0x6, _0x54773c = 0x4) {
    const _0x241ec1 = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let _0x2d949e = '';
    for (let _0xf88c1 = 0x0; _0xf88c1 < _0x4c5051; _0xf88c1++) {
        _0x2d949e += _0x241ec1['charAt'](Math['floor'](Math['random']() * _0x241ec1['length']));
    }
    const _0x4e73e9 = String(Math['floor'](Math['random']() * Math['pow'](0xa, _0x54773c)))['padStart'](_0x54773c, '0');
    return 'NOVA' + _0x2d949e + _0x4e73e9;
}
export async function saveCloneToMainDB(_0x4a03df, _0x545da2, _0x5a8469, _0x5afb0e, _0x4c0d99, _0x380e57 = null) {
    try {
        let _0x498e03 = null;
        if (_0x380e57 && _0x380e57 > 0x0) {
            _0x498e03 = Date['now']() + _0x380e57 * 0x18 * 0x3c * 0x3c * 0x3e8;
        }
        const _0x3df9d4 = {
            'phoneNumber': _0x545da2,
            'dbUrl': _0x5a8469 || 'local',
            'dbType': _0x5afb0e || 'local',
            'status': _0x4c0d99 || 'configured',
            'createdAt': Date['now'](),
            'updatedAt': Date['now'](),
            'expiryDays': _0x380e57 || null,
            'expiresAt': _0x498e03,
            'expired': ![]
        };
        if (HAS_DB) {
            await _0x0_0xc4628c['saveSetting']('clones', _0x4a03df, _0x3df9d4);
            console['log']('✅\x20[Clone\x20' + _0x4a03df + ']\x20Saved\x20to\x20main\x20database' + (_0x380e57 ? '\x20(expires\x20in\x20' + _0x380e57 + '\x20days)' : ''));
        } else {
            const _0x4ca03f = _0x0_0xa36db3['join'](process['cwd'](), 'session', 'clones');
            if (!_0x0_0x1d42b4['existsSync'](_0x4ca03f)) {
                _0x0_0x1d42b4['mkdirSync'](_0x4ca03f, { 'recursive': !![] });
            }
            _0x0_0x1d42b4['writeFileSync'](_0x0_0xa36db3['join'](_0x4ca03f, _0x4a03df + '.json'), JSON['stringify'](_0x3df9d4, null, 0x2));
            console['log']('✅\x20[Clone\x20' + _0x4a03df + ']\x20Saved\x20locally' + (_0x380e57 ? '\x20(expires\x20in\x20' + _0x380e57 + '\x20days)' : ''));
        }
        return !![];
    } catch (_0x227a65) {
        console['error']('❌\x20Failed\x20to\x20save\x20clone\x20' + _0x4a03df + ':', _0x227a65['message']);
        return ![];
    }
}
export async function getAllClonesFromMainDB() {
    try {
        let _0x59a700 = [];
        if (HAS_DB) {
            const _0x373714 = await _0x0_0xc4628c['getSetting']('clones', 'all') || {};
            _0x59a700 = Object['entries'](_0x373714)['map'](([_0x416bc6, _0x2b5666]) => ({
                'authId': _0x416bc6,
                'phoneNumber': _0x2b5666['phoneNumber'],
                'dbType': _0x2b5666['dbType'] || 'local',
                'status': _0x2b5666['status'] || 'unknown',
                'createdAt': _0x2b5666['createdAt'],
                'updatedAt': _0x2b5666['updatedAt'],
                'expiryDays': _0x2b5666['expiryDays'] || null,
                'expiresAt': _0x2b5666['expiresAt'] || null,
                'expired': _0x2b5666['expired'] || ![]
            }));
        } else {
            const _0x4eab8e = _0x0_0xa36db3['join'](process['cwd'](), 'session', 'clones');
            if (!_0x0_0x1d42b4['existsSync'](_0x4eab8e))
                return [];
            const _0x258de3 = _0x0_0x1d42b4['readdirSync'](_0x4eab8e)['filter'](_0x3c9ed4 => _0x3c9ed4['endsWith']('.json'));
            for (const _0x1db0e4 of _0x258de3) {
                const _0x1bdc3b = _0x1db0e4['replace']('.json', '');
                const _0x5781b5 = JSON['parse'](_0x0_0x1d42b4['readFileSync'](_0x0_0xa36db3['join'](_0x4eab8e, _0x1db0e4), 'utf-8'));
                _0x59a700['push']({
                    'authId': _0x1bdc3b,
                    'phoneNumber': _0x5781b5['phoneNumber'],
                    'dbType': _0x5781b5['dbType'] || 'local',
                    'status': _0x5781b5['status'] || 'unknown',
                    'createdAt': _0x5781b5['createdAt'],
                    'updatedAt': _0x5781b5['updatedAt'],
                    'expiryDays': _0x5781b5['expiryDays'] || null,
                    'expiresAt': _0x5781b5['expiresAt'] || null,
                    'expired': _0x5781b5['expired'] || ![]
                });
            }
        }
        const _0x57cf2d = Date['now']();
        for (const _0x4e665a of _0x59a700) {
            if (_0x4e665a['expiresAt'] && _0x4e665a['expiresAt'] < _0x57cf2d && !_0x4e665a['expired']) {
                _0x4e665a['expired'] = !![];
                _0x4e665a['status'] = 'expired';
                await updateCloneStatus(_0x4e665a['authId'], 'expired', !![]);
            }
        }
        return _0x59a700;
    } catch (_0xcec0b7) {
        console['error']('Failed\x20to\x20get\x20all\x20clones:', _0xcec0b7['message']);
        return [];
    }
}
async function updateCloneStatus(_0x2203f0, _0x3c0e41, _0x57a1c9 = ![]) {
    try {
        let _0x4e3d36 = null;
        if (HAS_DB) {
            _0x4e3d36 = await _0x0_0xc4628c['getSetting']('clones', _0x2203f0);
        } else {
            const _0x25999b = _0x0_0xa36db3['join'](process['cwd'](), 'session', 'clones');
            const _0x263db9 = _0x0_0xa36db3['join'](_0x25999b, _0x2203f0 + '.json');
            if (_0x0_0x1d42b4['existsSync'](_0x263db9)) {
                _0x4e3d36 = JSON['parse'](_0x0_0x1d42b4['readFileSync'](_0x263db9, 'utf-8'));
            }
        }
        if (_0x4e3d36) {
            _0x4e3d36['status'] = _0x3c0e41;
            _0x4e3d36['expired'] = _0x57a1c9;
            _0x4e3d36['updatedAt'] = Date['now']();
            if (HAS_DB) {
                await _0x0_0xc4628c['saveSetting']('clones', _0x2203f0, _0x4e3d36);
            } else {
                const _0x18f568 = _0x0_0xa36db3['join'](process['cwd'](), 'session', 'clones');
                const _0x576b57 = _0x0_0xa36db3['join'](_0x18f568, _0x2203f0 + '.json');
                _0x0_0x1d42b4['writeFileSync'](_0x576b57, JSON['stringify'](_0x4e3d36, null, 0x2));
            }
        }
    } catch (_0x4a8ca7) {
        console['error']('Failed\x20to\x20update\x20clone\x20status\x20' + _0x2203f0 + ':', _0x4a8ca7['message']);
    }
}
export async function getCloneByPhoneNumber(_0x5614c5) {
    const _0xbe33dd = await getAllClonesFromMainDB();
    return _0xbe33dd['filter'](_0x44949e => _0x44949e['phoneNumber'] === _0x5614c5);
}
export async function deleteCloneFromMainDB(_0x438337) {
    try {
        if (HAS_DB) {
            await _0x0_0xc4628c['saveSetting']('clones', _0x438337, null);
        } else {
            const _0xbf8dc5 = _0x0_0xa36db3['join'](process['cwd'](), 'session', 'clones');
            const _0x3d0caa = _0x0_0xa36db3['join'](_0xbf8dc5, _0x438337 + '.json');
            if (_0x0_0x1d42b4['existsSync'](_0x3d0caa)) {
                _0x0_0x1d42b4['unlinkSync'](_0x3d0caa);
            }
        }
        console['log']('✅\x20[Clone\x20' + _0x438337 + ']\x20Removed\x20from\x20main\x20database');
        return !![];
    } catch (_0xb73499) {
        console['error']('Failed\x20to\x20delete\x20clone\x20' + _0x438337 + ':', _0xb73499['message']);
        return ![];
    }
}
export async function startClone(_0x1780dd, _0xa8f385, _0x3aa75d, _0x51c511, _0x3c37e1, _0x3c66dc, _0x39e0a5, _0x25196e) {
    try {
        const {
            state: _0x28c188,
            saveCreds: _0x438118
        } = await useMultiFileAuthState(_0x1780dd);
        const {version: _0x1cdd01} = await fetchLatestBaileysVersion();
        const _0x3331aa = new _0x0_0x146523();
        const _0x1d5e5d = _0x0_0xabe00b({
            'version': _0x1cdd01,
            'logger': _0x0_0x1afb18({ 'level': 'silent' }),
            'printQRInTerminal': ![],
            'browser': Browsers['macOS']('Chrome'),
            'auth': {
                'creds': _0x28c188['creds'],
                'keys': makeCacheableSignalKeyStore(_0x28c188['keys'], _0x0_0x1afb18({ 'level': 'fatal' }))
            },
            'markOnlineOnConnect': !![],
            'msgRetryCounterCache': _0x3331aa,
            'connectTimeoutMs': 0x1d4c0,
            'defaultQueryTimeoutMs': 0x0,
            'keepAliveIntervalMs': 0x7530,
            'mobile': ![]
        });
        let _0x163a69 = null;
        if (!_0x1d5e5d['authState']['creds']['registered']) {
            await new Promise(_0xb236d5 => setTimeout(_0xb236d5, 0x1770));
            try {
                let _0x5f5e00 = await _0x1d5e5d['requestPairingCode'](_0xa8f385);
                _0x163a69 = _0x5f5e00?.['match'](/.{1,4}/g)?.['join']('-') || _0x5f5e00;
                await saveCloneToMainDB(_0x3aa75d, _0xa8f385, _0x3c37e1 || 'local', _0x51c511, 'pairing', _0x3c66dc);
            } catch (_0x49f6ad) {
                console['error']('Pairing\x20Error:', _0x49f6ad);
                throw new Error('Failed\x20to\x20get\x20pairing\x20code:\x20' + _0x49f6ad['message']);
            }
        }
        _0x1d5e5d['ev']['on']('creds.update', async () => {
            await _0x438118();
            try {
                const _0x16c146 = JSON['parse'](_0x0_0x1d42b4['readFileSync'](_0x0_0xa36db3['join'](_0x1780dd, 'creds.json'), 'utf-8'));
                await saveCloneToMainDB(_0x3aa75d, _0xa8f385, _0x3c37e1 || 'local', _0x51c511, 'active', _0x3c66dc);
            } catch (_0x15fc6e) {
                console['error']('Creds\x20save\x20error:', _0x15fc6e['message']);
            }
        });
        _0x1d5e5d['ev']['on']('connection.update', async _0x1dba1a => {
            const {
                connection: _0x216a7c,
                lastDisconnect: _0x42885f
            } = _0x1dba1a;
            if (_0x216a7c === 'open') {
                global['conns']['push'](_0x1d5e5d);
                await saveCloneToMainDB(_0x3aa75d, _0xa8f385, _0x3c37e1 || 'local', _0x51c511, 'online', _0x3c66dc);
                if (_0x39e0a5) {
                    await _0x39e0a5(_0x1d5e5d, _0x3aa75d, _0xa8f385);
                }
            }
            if (_0x216a7c === 'close') {
                const _0x411a9e = _0x42885f?.['error']?.['output']?.['statusCode'];
                if (_0x411a9e !== DisconnectReason['loggedOut']) {
                    console['log']('🔄\x20[Clone\x20' + _0x3aa75d + ']\x20Reconnecting...');
                    setTimeout(() => startClone(_0x1780dd, _0xa8f385, _0x3aa75d, _0x51c511, _0x3c37e1, _0x3c66dc, _0x39e0a5, _0x25196e), 0x1388);
                } else {
                    await saveCloneToMainDB(_0x3aa75d, _0xa8f385, _0x3c37e1 || 'local', _0x51c511, 'offline', _0x3c66dc);
                    const _0x48243f = global['conns']['indexOf'](_0x1d5e5d);
                    if (_0x48243f > -0x1)
                        global['conns']['splice'](_0x48243f, 0x1);
                    if (_0x25196e) {
                        await _0x25196e(_0x1d5e5d, _0x3aa75d, _0xa8f385);
                    }
                }
            }
        });
        try {
            const {handleMessages: _0x1f2917} = await import('./messageHandler.js');
            _0x1d5e5d['ev']['on']('messages.upsert', async _0x4e6a35 => {
                await _0x1f2917(_0x1d5e5d, _0x4e6a35);
            });
        } catch (_0x1d1cdf) {
            console['error']('Handler\x20linkage\x20failed:', _0x1d1cdf['message']);
        }
        return {
            'conn': _0x1d5e5d,
            'pairingCode': _0x163a69
        };
    } catch (_0x591aa8) {
        console['error']('Failed\x20to\x20start\x20clone\x20' + _0x3aa75d + ':', _0x591aa8['message']);
        throw _0x591aa8;
    }
}
export async function deleteClone(_0x55fb60) {
    try {
        const _0x38cb8d = global['conns']['findIndex'](_0x131d06 => {
            try {
                return _0x131d06['authState']?.['creds']?.['me']?.['id']?.['includes'](_0x55fb60) || _0x131d06['user']?.['id']?.['includes'](_0x55fb60);
            } catch (_0x1e1a49) {
                return ![];
            }
        });
        if (_0x38cb8d > -0x1) {
            try {
                await global['conns'][_0x38cb8d]['end']();
                global['conns']['splice'](_0x38cb8d, 0x1);
                console['log']('✅\x20[Clone\x20' + _0x55fb60 + ']\x20Disconnected');
            } catch (_0x508a1c) {
                console['error']('Failed\x20to\x20disconnect\x20clone\x20' + _0x55fb60 + ':', _0x508a1c['message']);
            }
        }
        await deleteCloneFromMainDB(_0x55fb60);
        const _0x4d189b = _0x0_0xa36db3['join'](process['cwd'](), 'session', 'clones', _0x55fb60);
        if (_0x0_0x1d42b4['existsSync'](_0x4d189b)) {
            _0x0_0x1d42b4['rmSync'](_0x4d189b, {
                'recursive': !![],
                'force': !![]
            });
        }
        return { 'success': !![] };
    } catch (_0x238f12) {
        console['error']('Failed\x20to\x20delete\x20clone\x20' + _0x55fb60 + ':', _0x238f12['message']);
        return {
            'success': ![],
            'error': _0x238f12['message']
        };
    }
}
export async function checkAndCleanExpiredClones() {
    try {
        const _0x50700a = await getAllClonesFromMainDB();
        const _0x1aad70 = Date['now']();
        let _0x47730d = 0x0;
        for (const _0x4ae430 of _0x50700a) {
            if (_0x4ae430['expiresAt'] && _0x4ae430['expiresAt'] < _0x1aad70 && !_0x4ae430['expired']) {
                console['log']('🧹\x20Cleaning\x20expired\x20clone:\x20' + _0x4ae430['authId'] + '\x20(' + _0x4ae430['phoneNumber'] + ')');
                await deleteClone(_0x4ae430['authId']);
                _0x47730d++;
            }
        }
        if (_0x47730d > 0x0) {
            console['log']('✅\x20Cleaned\x20' + _0x47730d + '\x20expired\x20clones');
        }
        return _0x47730d;
    } catch (_0x4239b8) {
        console['error']('Failed\x20to\x20check\x20expired\x20clones:', _0x4239b8['message']);
        return 0x0;
    }
}
export async function isCloneOwner(_0x44844d, _0x440456) {
    try {
        const _0x26d257 = await getAllClonesFromMainDB();
        const _0x2bd879 = _0x26d257['find'](_0x4e725f => _0x4e725f['authId'] === _0x440456);
        if (!_0x2bd879)
            return ![];
        const _0x145a49 = _0x44844d['split']('@')[0x0];
        return _0x2bd879['phoneNumber'] === _0x145a49;
    } catch (_0x492ab7) {
        console['error']('Check\x20clone\x20owner\x20error:', _0x492ab7['message']);
        return ![];
    }
}