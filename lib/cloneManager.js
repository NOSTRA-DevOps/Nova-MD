import _0x0_0x5f5bc3, {
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    Browsers
} from '@whiskeysockets/baileys';
import _0x0_0x2f3a21 from 'node-cache';
import _0x0_0x3492e1 from 'pino';
import _0x0_0xe00e9a from 'fs';
import _0x0_0x5887b6, { dirname } from 'path';
import { fileURLToPath } from 'url';
import _0x0_0x2f7ec7 from './lightweight_store.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
if (!global['conns'])
    global['conns'] = [];
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL);
export function generateSessionId(_0x5eebf2 = 0x6, _0x55e7ef = 0x4) {
    const _0x536691 = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let _0x22f6e0 = '';
    for (let _0x561e10 = 0x0; _0x561e10 < _0x5eebf2; _0x561e10++) {
        _0x22f6e0 += _0x536691['charAt'](Math['floor'](Math['random']() * _0x536691['length']));
    }
    const _0x547162 = String(Math['floor'](Math['random']() * Math['pow'](0xa, _0x55e7ef)))['padStart'](_0x55e7ef, '0');
    return 'NOVA' + _0x22f6e0 + _0x547162;
}
export async function saveCloneToMainDB(_0x43bd6b, _0x48aeba, _0x1694d9, _0x4e6725, _0x2a78d9, _0x432eea = null) {
    try {
        let _0x2534a9 = null;
        if (_0x432eea && _0x432eea > 0x0) {
            _0x2534a9 = Date['now']() + _0x432eea * 0x18 * 0x3c * 0x3c * 0x3e8;
        }
        const _0xc0c64a = {
            'phoneNumber': _0x48aeba,
            'dbUrl': _0x1694d9 || 'local',
            'dbType': _0x4e6725 || 'local',
            'status': _0x2a78d9 || 'configured',
            'createdAt': Date['now'](),
            'updatedAt': Date['now'](),
            'expiryDays': _0x432eea || null,
            'expiresAt': _0x2534a9,
            'expired': ![]
        };
        if (HAS_DB) {
            await _0x0_0x2f7ec7['saveSetting']('clones', _0x43bd6b, _0xc0c64a);
            console['log']('✅\x20[Clone\x20' + _0x43bd6b + ']\x20Saved\x20to\x20main\x20database' + (_0x432eea ? '\x20(expires\x20in\x20' + _0x432eea + '\x20days)' : ''));
        } else {
            const _0x466da7 = _0x0_0x5887b6['join'](process['cwd'](), 'session', 'clones');
            if (!_0x0_0xe00e9a['existsSync'](_0x466da7)) {
                _0x0_0xe00e9a['mkdirSync'](_0x466da7, { 'recursive': !![] });
            }
            _0x0_0xe00e9a['writeFileSync'](_0x0_0x5887b6['join'](_0x466da7, _0x43bd6b + '.json'), JSON['stringify'](_0xc0c64a, null, 0x2));
            console['log']('✅\x20[Clone\x20' + _0x43bd6b + ']\x20Saved\x20locally' + (_0x432eea ? '\x20(expires\x20in\x20' + _0x432eea + '\x20days)' : ''));
        }
        return !![];
    } catch (_0x6d44aa) {
        console['error']('❌\x20Failed\x20to\x20save\x20clone\x20' + _0x43bd6b + ':', _0x6d44aa['message']);
        return ![];
    }
}
export async function getAllClonesFromMainDB() {
    try {
        let _0x3de699 = [];
        if (HAS_DB) {
            const _0x4db0cb = await _0x0_0x2f7ec7['getSetting']('clones', 'all') || {};
            _0x3de699 = Object['entries'](_0x4db0cb)['map'](([_0x5c7b0c, _0x20eef6]) => ({
                'authId': _0x5c7b0c,
                'phoneNumber': _0x20eef6['phoneNumber'],
                'dbType': _0x20eef6['dbType'] || 'local',
                'status': _0x20eef6['status'] || 'unknown',
                'createdAt': _0x20eef6['createdAt'],
                'updatedAt': _0x20eef6['updatedAt'],
                'expiryDays': _0x20eef6['expiryDays'] || null,
                'expiresAt': _0x20eef6['expiresAt'] || null,
                'expired': _0x20eef6['expired'] || ![]
            }));
        } else {
            const _0x59ffdf = _0x0_0x5887b6['join'](process['cwd'](), 'session', 'clones');
            if (!_0x0_0xe00e9a['existsSync'](_0x59ffdf))
                return [];
            const _0x24e8cb = _0x0_0xe00e9a['readdirSync'](_0x59ffdf)['filter'](_0x2fd3dd => _0x2fd3dd['endsWith']('.json'));
            for (const _0x40ec1b of _0x24e8cb) {
                const _0x5955a4 = _0x40ec1b['replace']('.json', '');
                const _0x2b0e1d = JSON['parse'](_0x0_0xe00e9a['readFileSync'](_0x0_0x5887b6['join'](_0x59ffdf, _0x40ec1b), 'utf-8'));
                _0x3de699['push']({
                    'authId': _0x5955a4,
                    'phoneNumber': _0x2b0e1d['phoneNumber'],
                    'dbType': _0x2b0e1d['dbType'] || 'local',
                    'status': _0x2b0e1d['status'] || 'unknown',
                    'createdAt': _0x2b0e1d['createdAt'],
                    'updatedAt': _0x2b0e1d['updatedAt'],
                    'expiryDays': _0x2b0e1d['expiryDays'] || null,
                    'expiresAt': _0x2b0e1d['expiresAt'] || null,
                    'expired': _0x2b0e1d['expired'] || ![]
                });
            }
        }
        const _0x1b1297 = Date['now']();
        for (const _0x4cf624 of _0x3de699) {
            if (_0x4cf624['expiresAt'] && _0x4cf624['expiresAt'] < _0x1b1297 && !_0x4cf624['expired']) {
                _0x4cf624['expired'] = !![];
                _0x4cf624['status'] = 'expired';
                await updateCloneStatus(_0x4cf624['authId'], 'expired', !![]);
            }
        }
        return _0x3de699;
    } catch (_0x164600) {
        console['error']('Failed\x20to\x20get\x20all\x20clones:', _0x164600['message']);
        return [];
    }
}
async function updateCloneStatus(_0x1f9059, _0x28c286, _0x2e1258 = ![]) {
    try {
        let _0x352328 = null;
        if (HAS_DB) {
            _0x352328 = await _0x0_0x2f7ec7['getSetting']('clones', _0x1f9059);
        } else {
            const _0x1ed29a = _0x0_0x5887b6['join'](process['cwd'](), 'session', 'clones');
            const _0x6c6740 = _0x0_0x5887b6['join'](_0x1ed29a, _0x1f9059 + '.json');
            if (_0x0_0xe00e9a['existsSync'](_0x6c6740)) {
                _0x352328 = JSON['parse'](_0x0_0xe00e9a['readFileSync'](_0x6c6740, 'utf-8'));
            }
        }
        if (_0x352328) {
            _0x352328['status'] = _0x28c286;
            _0x352328['expired'] = _0x2e1258;
            _0x352328['updatedAt'] = Date['now']();
            if (HAS_DB) {
                await _0x0_0x2f7ec7['saveSetting']('clones', _0x1f9059, _0x352328);
            } else {
                const _0x363b2b = _0x0_0x5887b6['join'](process['cwd'](), 'session', 'clones');
                const _0x43ef48 = _0x0_0x5887b6['join'](_0x363b2b, _0x1f9059 + '.json');
                _0x0_0xe00e9a['writeFileSync'](_0x43ef48, JSON['stringify'](_0x352328, null, 0x2));
            }
        }
    } catch (_0x47b8a4) {
        console['error']('Failed\x20to\x20update\x20clone\x20status\x20' + _0x1f9059 + ':', _0x47b8a4['message']);
    }
}
export async function getCloneByPhoneNumber(_0x3fab74) {
    const _0x4f4708 = await getAllClonesFromMainDB();
    return _0x4f4708['filter'](_0x5ef579 => _0x5ef579['phoneNumber'] === _0x3fab74);
}
export async function deleteCloneFromMainDB(_0x3e8b94) {
    try {
        if (HAS_DB) {
            await _0x0_0x2f7ec7['saveSetting']('clones', _0x3e8b94, null);
        } else {
            const _0x1cc43f = _0x0_0x5887b6['join'](process['cwd'](), 'session', 'clones');
            const _0x40bb7d = _0x0_0x5887b6['join'](_0x1cc43f, _0x3e8b94 + '.json');
            if (_0x0_0xe00e9a['existsSync'](_0x40bb7d)) {
                _0x0_0xe00e9a['unlinkSync'](_0x40bb7d);
            }
        }
        console['log']('✅\x20[Clone\x20' + _0x3e8b94 + ']\x20Removed\x20from\x20main\x20database');
        return !![];
    } catch (_0x3ec531) {
        console['error']('Failed\x20to\x20delete\x20clone\x20' + _0x3e8b94 + ':', _0x3ec531['message']);
        return ![];
    }
}
export async function startClone(_0x2f85b4, _0x27b2b8, _0x375df7, _0x2cfbe0, _0x460974, _0x3fa0dc, _0x12fd3f, _0x3df3fb) {
    try {
        const {
            state: _0x4c97e0,
            saveCreds: _0x5c0f7b
        } = await useMultiFileAuthState(_0x2f85b4);
        const {version: _0x64386c} = await fetchLatestBaileysVersion();
        const _0x3bcc7d = new _0x0_0x2f3a21();
        const _0x492731 = _0x0_0x5f5bc3({
            'version': _0x64386c,
            'logger': _0x0_0x3492e1({ 'level': 'silent' }),
            'printQRInTerminal': ![],
            'browser': Browsers['macOS']('Chrome'),
            'auth': {
                'creds': _0x4c97e0['creds'],
                'keys': makeCacheableSignalKeyStore(_0x4c97e0['keys'], _0x0_0x3492e1({ 'level': 'fatal' }))
            },
            'markOnlineOnConnect': !![],
            'msgRetryCounterCache': _0x3bcc7d,
            'connectTimeoutMs': 0x1d4c0,
            'defaultQueryTimeoutMs': 0x0,
            'keepAliveIntervalMs': 0x7530,
            'mobile': ![]
        });
        let _0x11c9e2 = null;
        if (!_0x492731['authState']['creds']['registered']) {
            await new Promise(_0x30c062 => setTimeout(_0x30c062, 0x1770));
            try {
                let _0x6405f3 = await _0x492731['requestPairingCode'](_0x27b2b8);
                _0x11c9e2 = _0x6405f3?.['match'](/.{1,4}/g)?.['join']('-') || _0x6405f3;
                await saveCloneToMainDB(_0x375df7, _0x27b2b8, _0x460974 || 'local', _0x2cfbe0, 'pairing', _0x3fa0dc);
            } catch (_0x5cb527) {
                console['error']('Pairing\x20Error:', _0x5cb527);
                throw new Error('Failed\x20to\x20get\x20pairing\x20code:\x20' + _0x5cb527['message']);
            }
        }
        _0x492731['ev']['on']('creds.update', async () => {
            await _0x5c0f7b();
            try {
                const _0xd1661b = JSON['parse'](_0x0_0xe00e9a['readFileSync'](_0x0_0x5887b6['join'](_0x2f85b4, 'creds.json'), 'utf-8'));
                await saveCloneToMainDB(_0x375df7, _0x27b2b8, _0x460974 || 'local', _0x2cfbe0, 'active', _0x3fa0dc);
            } catch (_0x465402) {
                console['error']('Creds\x20save\x20error:', _0x465402['message']);
            }
        });
        _0x492731['ev']['on']('connection.update', async _0x9c30f4 => {
            const {
                connection: _0x58f6df,
                lastDisconnect: _0x462371
            } = _0x9c30f4;
            if (_0x58f6df === 'open') {
                global['conns']['push'](_0x492731);
                await saveCloneToMainDB(_0x375df7, _0x27b2b8, _0x460974 || 'local', _0x2cfbe0, 'online', _0x3fa0dc);
                if (_0x12fd3f) {
                    await _0x12fd3f(_0x492731, _0x375df7, _0x27b2b8);
                }
            }
            if (_0x58f6df === 'close') {
                const _0x189989 = _0x462371?.['error']?.['output']?.['statusCode'];
                if (_0x189989 !== DisconnectReason['loggedOut']) {
                    console['log']('🔄\x20[Clone\x20' + _0x375df7 + ']\x20Reconnecting...');
                    setTimeout(() => startClone(_0x2f85b4, _0x27b2b8, _0x375df7, _0x2cfbe0, _0x460974, _0x3fa0dc, _0x12fd3f, _0x3df3fb), 0x1388);
                } else {
                    await saveCloneToMainDB(_0x375df7, _0x27b2b8, _0x460974 || 'local', _0x2cfbe0, 'offline', _0x3fa0dc);
                    const _0x2272db = global['conns']['indexOf'](_0x492731);
                    if (_0x2272db > -0x1)
                        global['conns']['splice'](_0x2272db, 0x1);
                    if (_0x3df3fb) {
                        await _0x3df3fb(_0x492731, _0x375df7, _0x27b2b8);
                    }
                }
            }
        });
        try {
            const {handleMessages: _0x4e32ea} = await import('./messageHandler.js');
            _0x492731['ev']['on']('messages.upsert', async _0x464af4 => {
                await _0x4e32ea(_0x492731, _0x464af4);
            });
        } catch (_0x5e2ec3) {
            console['error']('Handler\x20linkage\x20failed:', _0x5e2ec3['message']);
        }
        return {
            'conn': _0x492731,
            'pairingCode': _0x11c9e2
        };
    } catch (_0x4507a3) {
        console['error']('Failed\x20to\x20start\x20clone\x20' + _0x375df7 + ':', _0x4507a3['message']);
        throw _0x4507a3;
    }
}
export async function deleteClone(_0x1d169a) {
    try {
        const _0x4974e0 = global['conns']['findIndex'](_0x6d6025 => {
            try {
                return _0x6d6025['authState']?.['creds']?.['me']?.['id']?.['includes'](_0x1d169a) || _0x6d6025['user']?.['id']?.['includes'](_0x1d169a);
            } catch (_0x272f01) {
                return ![];
            }
        });
        if (_0x4974e0 > -0x1) {
            try {
                await global['conns'][_0x4974e0]['end']();
                global['conns']['splice'](_0x4974e0, 0x1);
                console['log']('✅\x20[Clone\x20' + _0x1d169a + ']\x20Disconnected');
            } catch (_0x2ffec8) {
                console['error']('Failed\x20to\x20disconnect\x20clone\x20' + _0x1d169a + ':', _0x2ffec8['message']);
            }
        }
        await deleteCloneFromMainDB(_0x1d169a);
        const _0x55ef31 = _0x0_0x5887b6['join'](process['cwd'](), 'session', 'clones', _0x1d169a);
        if (_0x0_0xe00e9a['existsSync'](_0x55ef31)) {
            _0x0_0xe00e9a['rmSync'](_0x55ef31, {
                'recursive': !![],
                'force': !![]
            });
        }
        return { 'success': !![] };
    } catch (_0x3dd84d) {
        console['error']('Failed\x20to\x20delete\x20clone\x20' + _0x1d169a + ':', _0x3dd84d['message']);
        return {
            'success': ![],
            'error': _0x3dd84d['message']
        };
    }
}
export async function checkAndCleanExpiredClones() {
    try {
        const _0x4d850d = await getAllClonesFromMainDB();
        const _0x7f8e03 = Date['now']();
        let _0x26d6cf = 0x0;
        for (const _0x1a8c6d of _0x4d850d) {
            if (_0x1a8c6d['expiresAt'] && _0x1a8c6d['expiresAt'] < _0x7f8e03 && !_0x1a8c6d['expired']) {
                console['log']('🧹\x20Cleaning\x20expired\x20clone:\x20' + _0x1a8c6d['authId'] + '\x20(' + _0x1a8c6d['phoneNumber'] + ')');
                await deleteClone(_0x1a8c6d['authId']);
                _0x26d6cf++;
            }
        }
        if (_0x26d6cf > 0x0) {
            console['log']('✅\x20Cleaned\x20' + _0x26d6cf + '\x20expired\x20clones');
        }
        return _0x26d6cf;
    } catch (_0x5b6515) {
        console['error']('Failed\x20to\x20check\x20expired\x20clones:', _0x5b6515['message']);
        return 0x0;
    }
}
export async function isCloneOwner(_0x568d25, _0x423ead) {
    try {
        const _0x38ef0a = await getAllClonesFromMainDB();
        const _0x2968a7 = _0x38ef0a['find'](_0x291bab => _0x291bab['authId'] === _0x423ead);
        if (!_0x2968a7)
            return ![];
        const _0x557542 = _0x568d25['split']('@')[0x0];
        return _0x2968a7['phoneNumber'] === _0x557542;
    } catch (_0x2d7983) {
        console['error']('Check\x20clone\x20owner\x20error:', _0x2d7983['message']);
        return ![];
    }
}