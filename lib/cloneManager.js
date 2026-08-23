import _0x0_0x24ae7e, {
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    Browsers
} from '@whiskeysockets/baileys';
import _0x0_0x49412c from 'node-cache';
import _0x0_0x363547 from 'pino';
import _0x0_0xcfa65 from 'fs';
import _0x0_0x43a3da, { dirname } from 'path';
import { fileURLToPath } from 'url';
import _0x0_0x3f27e9 from './lightweight_store.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
if (!global['conns'])
    global['conns'] = [];
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL);
export function generateSessionId(_0x296988 = 0x6, _0x20d923 = 0x4) {
    const _0x57a89a = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let _0x1341a7 = '';
    for (let _0x5b782c = 0x0; _0x5b782c < _0x296988; _0x5b782c++) {
        _0x1341a7 += _0x57a89a['charAt'](Math['floor'](Math['random']() * _0x57a89a['length']));
    }
    const _0x511981 = String(Math['floor'](Math['random']() * Math['pow'](0xa, _0x20d923)))['padStart'](_0x20d923, '0');
    return 'NOVA' + _0x1341a7 + _0x511981;
}
export async function saveCloneToMainDB(_0x2a7f4c, _0x5ae6bb, _0x35de6c, _0x2ff90b, _0x453c3c, _0x409947 = null) {
    try {
        let _0x41a6a1 = null;
        if (_0x409947 && _0x409947 > 0x0) {
            _0x41a6a1 = Date['now']() + _0x409947 * 0x18 * 0x3c * 0x3c * 0x3e8;
        }
        const _0x385f22 = {
            'phoneNumber': _0x5ae6bb,
            'dbUrl': _0x35de6c || 'local',
            'dbType': _0x2ff90b || 'local',
            'status': _0x453c3c || 'configured',
            'createdAt': Date['now'](),
            'updatedAt': Date['now'](),
            'expiryDays': _0x409947 || null,
            'expiresAt': _0x41a6a1,
            'expired': ![]
        };
        if (HAS_DB) {
            await _0x0_0x3f27e9['saveSetting']('clones', _0x2a7f4c, _0x385f22);
            console['log']('✅\x20[Clone\x20' + _0x2a7f4c + ']\x20Saved\x20to\x20main\x20database' + (_0x409947 ? '\x20(expires\x20in\x20' + _0x409947 + '\x20days)' : ''));
        } else {
            const _0x1d6346 = _0x0_0x43a3da['join'](process['cwd'](), 'session', 'clones');
            if (!_0x0_0xcfa65['existsSync'](_0x1d6346)) {
                _0x0_0xcfa65['mkdirSync'](_0x1d6346, { 'recursive': !![] });
            }
            _0x0_0xcfa65['writeFileSync'](_0x0_0x43a3da['join'](_0x1d6346, _0x2a7f4c + '.json'), JSON['stringify'](_0x385f22, null, 0x2));
            console['log']('✅\x20[Clone\x20' + _0x2a7f4c + ']\x20Saved\x20locally' + (_0x409947 ? '\x20(expires\x20in\x20' + _0x409947 + '\x20days)' : ''));
        }
        return !![];
    } catch (_0x466788) {
        console['error']('❌\x20Failed\x20to\x20save\x20clone\x20' + _0x2a7f4c + ':', _0x466788['message']);
        return ![];
    }
}
export async function getAllClonesFromMainDB() {
    try {
        let _0x2612fd = [];
        if (HAS_DB) {
            const _0x272212 = await _0x0_0x3f27e9['getSetting']('clones', 'all') || {};
            _0x2612fd = Object['entries'](_0x272212)['map'](([_0x4cd6a0, _0x28523f]) => ({
                'authId': _0x4cd6a0,
                'phoneNumber': _0x28523f['phoneNumber'],
                'dbType': _0x28523f['dbType'] || 'local',
                'status': _0x28523f['status'] || 'unknown',
                'createdAt': _0x28523f['createdAt'],
                'updatedAt': _0x28523f['updatedAt'],
                'expiryDays': _0x28523f['expiryDays'] || null,
                'expiresAt': _0x28523f['expiresAt'] || null,
                'expired': _0x28523f['expired'] || ![]
            }));
        } else {
            const _0x1306f2 = _0x0_0x43a3da['join'](process['cwd'](), 'session', 'clones');
            if (!_0x0_0xcfa65['existsSync'](_0x1306f2))
                return [];
            const _0x35cf2d = _0x0_0xcfa65['readdirSync'](_0x1306f2)['filter'](_0xeb6a3f => _0xeb6a3f['endsWith']('.json'));
            for (const _0x5b39ea of _0x35cf2d) {
                const _0xc31135 = _0x5b39ea['replace']('.json', '');
                const _0x4d586f = JSON['parse'](_0x0_0xcfa65['readFileSync'](_0x0_0x43a3da['join'](_0x1306f2, _0x5b39ea), 'utf-8'));
                _0x2612fd['push']({
                    'authId': _0xc31135,
                    'phoneNumber': _0x4d586f['phoneNumber'],
                    'dbType': _0x4d586f['dbType'] || 'local',
                    'status': _0x4d586f['status'] || 'unknown',
                    'createdAt': _0x4d586f['createdAt'],
                    'updatedAt': _0x4d586f['updatedAt'],
                    'expiryDays': _0x4d586f['expiryDays'] || null,
                    'expiresAt': _0x4d586f['expiresAt'] || null,
                    'expired': _0x4d586f['expired'] || ![]
                });
            }
        }
        const _0xac3dd5 = Date['now']();
        for (const _0x23bd46 of _0x2612fd) {
            if (_0x23bd46['expiresAt'] && _0x23bd46['expiresAt'] < _0xac3dd5 && !_0x23bd46['expired']) {
                _0x23bd46['expired'] = !![];
                _0x23bd46['status'] = 'expired';
                await updateCloneStatus(_0x23bd46['authId'], 'expired', !![]);
            }
        }
        return _0x2612fd;
    } catch (_0x30bf9a) {
        console['error']('Failed\x20to\x20get\x20all\x20clones:', _0x30bf9a['message']);
        return [];
    }
}
async function updateCloneStatus(_0x22f7e0, _0x44fc50, _0x55894e = ![]) {
    try {
        let _0x256117 = null;
        if (HAS_DB) {
            _0x256117 = await _0x0_0x3f27e9['getSetting']('clones', _0x22f7e0);
        } else {
            const _0x215d03 = _0x0_0x43a3da['join'](process['cwd'](), 'session', 'clones');
            const _0x324c23 = _0x0_0x43a3da['join'](_0x215d03, _0x22f7e0 + '.json');
            if (_0x0_0xcfa65['existsSync'](_0x324c23)) {
                _0x256117 = JSON['parse'](_0x0_0xcfa65['readFileSync'](_0x324c23, 'utf-8'));
            }
        }
        if (_0x256117) {
            _0x256117['status'] = _0x44fc50;
            _0x256117['expired'] = _0x55894e;
            _0x256117['updatedAt'] = Date['now']();
            if (HAS_DB) {
                await _0x0_0x3f27e9['saveSetting']('clones', _0x22f7e0, _0x256117);
            } else {
                const _0x16d394 = _0x0_0x43a3da['join'](process['cwd'](), 'session', 'clones');
                const _0x161476 = _0x0_0x43a3da['join'](_0x16d394, _0x22f7e0 + '.json');
                _0x0_0xcfa65['writeFileSync'](_0x161476, JSON['stringify'](_0x256117, null, 0x2));
            }
        }
    } catch (_0x2382f1) {
        console['error']('Failed\x20to\x20update\x20clone\x20status\x20' + _0x22f7e0 + ':', _0x2382f1['message']);
    }
}
export async function getCloneByPhoneNumber(_0x3503bd) {
    const _0x548581 = await getAllClonesFromMainDB();
    return _0x548581['filter'](_0x5633ed => _0x5633ed['phoneNumber'] === _0x3503bd);
}
export async function deleteCloneFromMainDB(_0x2583b4) {
    try {
        if (HAS_DB) {
            await _0x0_0x3f27e9['saveSetting']('clones', _0x2583b4, null);
        } else {
            const _0x238b81 = _0x0_0x43a3da['join'](process['cwd'](), 'session', 'clones');
            const _0x1c9c63 = _0x0_0x43a3da['join'](_0x238b81, _0x2583b4 + '.json');
            if (_0x0_0xcfa65['existsSync'](_0x1c9c63)) {
                _0x0_0xcfa65['unlinkSync'](_0x1c9c63);
            }
        }
        console['log']('✅\x20[Clone\x20' + _0x2583b4 + ']\x20Removed\x20from\x20main\x20database');
        return !![];
    } catch (_0x4d7acb) {
        console['error']('Failed\x20to\x20delete\x20clone\x20' + _0x2583b4 + ':', _0x4d7acb['message']);
        return ![];
    }
}
export async function startClone(_0x29c70f, _0x5ae4f9, _0x22d5f1, _0x58600d, _0x517699, _0x5d73fa, _0x5bdd96, _0x2f8b5c) {
    try {
        const {
            state: _0x158de6,
            saveCreds: _0x652de3
        } = await useMultiFileAuthState(_0x29c70f);
        const {version: _0xae98b6} = await fetchLatestBaileysVersion();
        const _0x3d338f = new _0x0_0x49412c();
        const _0x2a4366 = _0x0_0x24ae7e({
            'version': _0xae98b6,
            'logger': _0x0_0x363547({ 'level': 'silent' }),
            'printQRInTerminal': ![],
            'browser': Browsers['macOS']('Chrome'),
            'auth': {
                'creds': _0x158de6['creds'],
                'keys': makeCacheableSignalKeyStore(_0x158de6['keys'], _0x0_0x363547({ 'level': 'fatal' }))
            },
            'markOnlineOnConnect': !![],
            'msgRetryCounterCache': _0x3d338f,
            'connectTimeoutMs': 0x1d4c0,
            'defaultQueryTimeoutMs': 0x0,
            'keepAliveIntervalMs': 0x7530,
            'mobile': ![]
        });
        let _0x288661 = null;
        if (!_0x2a4366['authState']['creds']['registered']) {
            await new Promise(_0xabfe5d => setTimeout(_0xabfe5d, 0x1770));
            try {
                let _0x18c7de = await _0x2a4366['requestPairingCode'](_0x5ae4f9);
                _0x288661 = _0x18c7de?.['match'](/.{1,4}/g)?.['join']('-') || _0x18c7de;
                await saveCloneToMainDB(_0x22d5f1, _0x5ae4f9, _0x517699 || 'local', _0x58600d, 'pairing', _0x5d73fa);
            } catch (_0x509462) {
                console['error']('Pairing\x20Error:', _0x509462);
                throw new Error('Failed\x20to\x20get\x20pairing\x20code:\x20' + _0x509462['message']);
            }
        }
        _0x2a4366['ev']['on']('creds.update', async () => {
            await _0x652de3();
            try {
                const _0x2af72f = JSON['parse'](_0x0_0xcfa65['readFileSync'](_0x0_0x43a3da['join'](_0x29c70f, 'creds.json'), 'utf-8'));
                await saveCloneToMainDB(_0x22d5f1, _0x5ae4f9, _0x517699 || 'local', _0x58600d, 'active', _0x5d73fa);
            } catch (_0xd5b738) {
                console['error']('Creds\x20save\x20error:', _0xd5b738['message']);
            }
        });
        _0x2a4366['ev']['on']('connection.update', async _0x3bc4b1 => {
            const {
                connection: _0x2a6417,
                lastDisconnect: _0x27e953
            } = _0x3bc4b1;
            if (_0x2a6417 === 'open') {
                global['conns']['push'](_0x2a4366);
                await saveCloneToMainDB(_0x22d5f1, _0x5ae4f9, _0x517699 || 'local', _0x58600d, 'online', _0x5d73fa);
                if (_0x5bdd96) {
                    await _0x5bdd96(_0x2a4366, _0x22d5f1, _0x5ae4f9);
                }
            }
            if (_0x2a6417 === 'close') {
                const _0x46de9b = _0x27e953?.['error']?.['output']?.['statusCode'];
                if (_0x46de9b !== DisconnectReason['loggedOut']) {
                    console['log']('🔄\x20[Clone\x20' + _0x22d5f1 + ']\x20Reconnecting...');
                    setTimeout(() => startClone(_0x29c70f, _0x5ae4f9, _0x22d5f1, _0x58600d, _0x517699, _0x5d73fa, _0x5bdd96, _0x2f8b5c), 0x1388);
                } else {
                    await saveCloneToMainDB(_0x22d5f1, _0x5ae4f9, _0x517699 || 'local', _0x58600d, 'offline', _0x5d73fa);
                    const _0x2f8d34 = global['conns']['indexOf'](_0x2a4366);
                    if (_0x2f8d34 > -0x1)
                        global['conns']['splice'](_0x2f8d34, 0x1);
                    if (_0x2f8b5c) {
                        await _0x2f8b5c(_0x2a4366, _0x22d5f1, _0x5ae4f9);
                    }
                }
            }
        });
        try {
            const {handleMessages: _0x375893} = await import('./messageHandler.js');
            _0x2a4366['ev']['on']('messages.upsert', async _0x2f3a03 => {
                await _0x375893(_0x2a4366, _0x2f3a03);
            });
        } catch (_0x5c6cd8) {
            console['error']('Handler\x20linkage\x20failed:', _0x5c6cd8['message']);
        }
        return {
            'conn': _0x2a4366,
            'pairingCode': _0x288661
        };
    } catch (_0x1ee419) {
        console['error']('Failed\x20to\x20start\x20clone\x20' + _0x22d5f1 + ':', _0x1ee419['message']);
        throw _0x1ee419;
    }
}
export async function deleteClone(_0x5d0ecd) {
    try {
        const _0x212954 = global['conns']['findIndex'](_0x4f049d => {
            try {
                return _0x4f049d['authState']?.['creds']?.['me']?.['id']?.['includes'](_0x5d0ecd) || _0x4f049d['user']?.['id']?.['includes'](_0x5d0ecd);
            } catch (_0x1c5596) {
                return ![];
            }
        });
        if (_0x212954 > -0x1) {
            try {
                await global['conns'][_0x212954]['end']();
                global['conns']['splice'](_0x212954, 0x1);
                console['log']('✅\x20[Clone\x20' + _0x5d0ecd + ']\x20Disconnected');
            } catch (_0x5524db) {
                console['error']('Failed\x20to\x20disconnect\x20clone\x20' + _0x5d0ecd + ':', _0x5524db['message']);
            }
        }
        await deleteCloneFromMainDB(_0x5d0ecd);
        const _0x556771 = _0x0_0x43a3da['join'](process['cwd'](), 'session', 'clones', _0x5d0ecd);
        if (_0x0_0xcfa65['existsSync'](_0x556771)) {
            _0x0_0xcfa65['rmSync'](_0x556771, {
                'recursive': !![],
                'force': !![]
            });
        }
        return { 'success': !![] };
    } catch (_0x34d60d) {
        console['error']('Failed\x20to\x20delete\x20clone\x20' + _0x5d0ecd + ':', _0x34d60d['message']);
        return {
            'success': ![],
            'error': _0x34d60d['message']
        };
    }
}
export async function checkAndCleanExpiredClones() {
    try {
        const _0x3f7c02 = await getAllClonesFromMainDB();
        const _0x26d6d5 = Date['now']();
        let _0x326610 = 0x0;
        for (const _0x497012 of _0x3f7c02) {
            if (_0x497012['expiresAt'] && _0x497012['expiresAt'] < _0x26d6d5 && !_0x497012['expired']) {
                console['log']('🧹\x20Cleaning\x20expired\x20clone:\x20' + _0x497012['authId'] + '\x20(' + _0x497012['phoneNumber'] + ')');
                await deleteClone(_0x497012['authId']);
                _0x326610++;
            }
        }
        if (_0x326610 > 0x0) {
            console['log']('✅\x20Cleaned\x20' + _0x326610 + '\x20expired\x20clones');
        }
        return _0x326610;
    } catch (_0x444157) {
        console['error']('Failed\x20to\x20check\x20expired\x20clones:', _0x444157['message']);
        return 0x0;
    }
}
export async function isCloneOwner(_0x4ba814, _0x34ca1e) {
    try {
        const _0xea2aa4 = await getAllClonesFromMainDB();
        const _0x2d3257 = _0xea2aa4['find'](_0x15af70 => _0x15af70['authId'] === _0x34ca1e);
        if (!_0x2d3257)
            return ![];
        const _0x3f2358 = _0x4ba814['split']('@')[0x0];
        return _0x2d3257['phoneNumber'] === _0x3f2358;
    } catch (_0x2eefce) {
        console['error']('Check\x20clone\x20owner\x20error:', _0x2eefce['message']);
        return ![];
    }
}