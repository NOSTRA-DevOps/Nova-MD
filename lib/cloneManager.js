import _0x0_0x484df9, {
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    Browsers
} from '@whiskeysockets/baileys';
import _0x0_0x3e391b from 'node-cache';
import _0x0_0x163bcb from 'pino';
import _0x0_0x476773 from 'fs';
import _0x0_0x42615f, { dirname } from 'path';
import { fileURLToPath } from 'url';
import _0x0_0x4a118b from './lightweight_store.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
if (!global['conns'])
    global['conns'] = [];
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL);
export function generateSessionId(_0x3b93e3 = 0x6, _0x58266f = 0x4) {
    const _0x3bf879 = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let _0x1799ae = '';
    for (let _0x2511b9 = 0x0; _0x2511b9 < _0x3b93e3; _0x2511b9++) {
        _0x1799ae += _0x3bf879['charAt'](Math['floor'](Math['random']() * _0x3bf879['length']));
    }
    const _0x195d11 = String(Math['floor'](Math['random']() * Math['pow'](0xa, _0x58266f)))['padStart'](_0x58266f, '0');
    return 'NOVA' + _0x1799ae + _0x195d11;
}
export async function saveCloneToMainDB(_0x30064f, _0x4aac1b, _0x3bf1e0, _0x2dae20, _0x68d987, _0x507151 = null) {
    try {
        let _0x2b3d65 = null;
        if (_0x507151 && _0x507151 > 0x0) {
            _0x2b3d65 = Date['now']() + _0x507151 * 0x18 * 0x3c * 0x3c * 0x3e8;
        }
        const _0x6551d7 = {
            'phoneNumber': _0x4aac1b,
            'dbUrl': _0x3bf1e0 || 'local',
            'dbType': _0x2dae20 || 'local',
            'status': _0x68d987 || 'configured',
            'createdAt': Date['now'](),
            'updatedAt': Date['now'](),
            'expiryDays': _0x507151 || null,
            'expiresAt': _0x2b3d65,
            'expired': ![]
        };
        if (HAS_DB) {
            await _0x0_0x4a118b['saveSetting']('clones', _0x30064f, _0x6551d7);
            console['log']('✅\x20[Clone\x20' + _0x30064f + ']\x20Saved\x20to\x20main\x20database' + (_0x507151 ? '\x20(expires\x20in\x20' + _0x507151 + '\x20days)' : ''));
        } else {
            const _0x27e8ba = _0x0_0x42615f['join'](process['cwd'](), 'session', 'clones');
            if (!_0x0_0x476773['existsSync'](_0x27e8ba)) {
                _0x0_0x476773['mkdirSync'](_0x27e8ba, { 'recursive': !![] });
            }
            _0x0_0x476773['writeFileSync'](_0x0_0x42615f['join'](_0x27e8ba, _0x30064f + '.json'), JSON['stringify'](_0x6551d7, null, 0x2));
            console['log']('✅\x20[Clone\x20' + _0x30064f + ']\x20Saved\x20locally' + (_0x507151 ? '\x20(expires\x20in\x20' + _0x507151 + '\x20days)' : ''));
        }
        return !![];
    } catch (_0x21b724) {
        console['error']('❌\x20Failed\x20to\x20save\x20clone\x20' + _0x30064f + ':', _0x21b724['message']);
        return ![];
    }
}
export async function getAllClonesFromMainDB() {
    try {
        let _0xbc73ef = [];
        if (HAS_DB) {
            const _0x582443 = await _0x0_0x4a118b['getSetting']('clones', 'all') || {};
            _0xbc73ef = Object['entries'](_0x582443)['map'](([_0xbd0056, _0x2f611c]) => ({
                'authId': _0xbd0056,
                'phoneNumber': _0x2f611c['phoneNumber'],
                'dbType': _0x2f611c['dbType'] || 'local',
                'status': _0x2f611c['status'] || 'unknown',
                'createdAt': _0x2f611c['createdAt'],
                'updatedAt': _0x2f611c['updatedAt'],
                'expiryDays': _0x2f611c['expiryDays'] || null,
                'expiresAt': _0x2f611c['expiresAt'] || null,
                'expired': _0x2f611c['expired'] || ![]
            }));
        } else {
            const _0x458e92 = _0x0_0x42615f['join'](process['cwd'](), 'session', 'clones');
            if (!_0x0_0x476773['existsSync'](_0x458e92))
                return [];
            const _0x48d6ee = _0x0_0x476773['readdirSync'](_0x458e92)['filter'](_0x3f0a7d => _0x3f0a7d['endsWith']('.json'));
            for (const _0x1ec1b2 of _0x48d6ee) {
                const _0x2285b3 = _0x1ec1b2['replace']('.json', '');
                const _0x5c5422 = JSON['parse'](_0x0_0x476773['readFileSync'](_0x0_0x42615f['join'](_0x458e92, _0x1ec1b2), 'utf-8'));
                _0xbc73ef['push']({
                    'authId': _0x2285b3,
                    'phoneNumber': _0x5c5422['phoneNumber'],
                    'dbType': _0x5c5422['dbType'] || 'local',
                    'status': _0x5c5422['status'] || 'unknown',
                    'createdAt': _0x5c5422['createdAt'],
                    'updatedAt': _0x5c5422['updatedAt'],
                    'expiryDays': _0x5c5422['expiryDays'] || null,
                    'expiresAt': _0x5c5422['expiresAt'] || null,
                    'expired': _0x5c5422['expired'] || ![]
                });
            }
        }
        const _0x5ed475 = Date['now']();
        for (const _0x5ea2c2 of _0xbc73ef) {
            if (_0x5ea2c2['expiresAt'] && _0x5ea2c2['expiresAt'] < _0x5ed475 && !_0x5ea2c2['expired']) {
                _0x5ea2c2['expired'] = !![];
                _0x5ea2c2['status'] = 'expired';
                await updateCloneStatus(_0x5ea2c2['authId'], 'expired', !![]);
            }
        }
        return _0xbc73ef;
    } catch (_0x2ac5e8) {
        console['error']('Failed\x20to\x20get\x20all\x20clones:', _0x2ac5e8['message']);
        return [];
    }
}
async function updateCloneStatus(_0x2daeeb, _0x495632, _0x315112 = ![]) {
    try {
        let _0x2e549 = null;
        if (HAS_DB) {
            _0x2e549 = await _0x0_0x4a118b['getSetting']('clones', _0x2daeeb);
        } else {
            const _0x49cb2d = _0x0_0x42615f['join'](process['cwd'](), 'session', 'clones');
            const _0x166dc3 = _0x0_0x42615f['join'](_0x49cb2d, _0x2daeeb + '.json');
            if (_0x0_0x476773['existsSync'](_0x166dc3)) {
                _0x2e549 = JSON['parse'](_0x0_0x476773['readFileSync'](_0x166dc3, 'utf-8'));
            }
        }
        if (_0x2e549) {
            _0x2e549['status'] = _0x495632;
            _0x2e549['expired'] = _0x315112;
            _0x2e549['updatedAt'] = Date['now']();
            if (HAS_DB) {
                await _0x0_0x4a118b['saveSetting']('clones', _0x2daeeb, _0x2e549);
            } else {
                const _0x591223 = _0x0_0x42615f['join'](process['cwd'](), 'session', 'clones');
                const _0x4d8592 = _0x0_0x42615f['join'](_0x591223, _0x2daeeb + '.json');
                _0x0_0x476773['writeFileSync'](_0x4d8592, JSON['stringify'](_0x2e549, null, 0x2));
            }
        }
    } catch (_0x3d4f5c) {
        console['error']('Failed\x20to\x20update\x20clone\x20status\x20' + _0x2daeeb + ':', _0x3d4f5c['message']);
    }
}
export async function getCloneByPhoneNumber(_0x4371ee) {
    const _0x3fcbd1 = await getAllClonesFromMainDB();
    return _0x3fcbd1['filter'](_0x39963f => _0x39963f['phoneNumber'] === _0x4371ee);
}
export async function deleteCloneFromMainDB(_0x409f97) {
    try {
        if (HAS_DB) {
            await _0x0_0x4a118b['saveSetting']('clones', _0x409f97, null);
        } else {
            const _0x548ffb = _0x0_0x42615f['join'](process['cwd'](), 'session', 'clones');
            const _0x48aab1 = _0x0_0x42615f['join'](_0x548ffb, _0x409f97 + '.json');
            if (_0x0_0x476773['existsSync'](_0x48aab1)) {
                _0x0_0x476773['unlinkSync'](_0x48aab1);
            }
        }
        console['log']('✅\x20[Clone\x20' + _0x409f97 + ']\x20Removed\x20from\x20main\x20database');
        return !![];
    } catch (_0x14dc5a) {
        console['error']('Failed\x20to\x20delete\x20clone\x20' + _0x409f97 + ':', _0x14dc5a['message']);
        return ![];
    }
}
export async function startClone(_0x47bfaa, _0x4d449b, _0x3a03be, _0x11889d, _0x2c7101, _0x6abc8e, _0x3053b7, _0x144c33) {
    try {
        const {
            state: _0x46a63a,
            saveCreds: _0x246049
        } = await useMultiFileAuthState(_0x47bfaa);
        const {version: _0x147a5a} = await fetchLatestBaileysVersion();
        const _0x4a1b8 = new _0x0_0x3e391b();
        const _0x319696 = _0x0_0x484df9({
            'version': _0x147a5a,
            'logger': _0x0_0x163bcb({ 'level': 'silent' }),
            'printQRInTerminal': ![],
            'browser': Browsers['macOS']('Chrome'),
            'auth': {
                'creds': _0x46a63a['creds'],
                'keys': makeCacheableSignalKeyStore(_0x46a63a['keys'], _0x0_0x163bcb({ 'level': 'fatal' }))
            },
            'markOnlineOnConnect': !![],
            'msgRetryCounterCache': _0x4a1b8,
            'connectTimeoutMs': 0x1d4c0,
            'defaultQueryTimeoutMs': 0x0,
            'keepAliveIntervalMs': 0x7530,
            'mobile': ![]
        });
        let _0x124eaf = null;
        if (!_0x319696['authState']['creds']['registered']) {
            await new Promise(_0xb33af7 => setTimeout(_0xb33af7, 0x1770));
            try {
                let _0x29bb2c = await _0x319696['requestPairingCode'](_0x4d449b);
                _0x124eaf = _0x29bb2c?.['match'](/.{1,4}/g)?.['join']('-') || _0x29bb2c;
                await saveCloneToMainDB(_0x3a03be, _0x4d449b, _0x2c7101 || 'local', _0x11889d, 'pairing', _0x6abc8e);
            } catch (_0x48c68e) {
                console['error']('Pairing\x20Error:', _0x48c68e);
                throw new Error('Failed\x20to\x20get\x20pairing\x20code:\x20' + _0x48c68e['message']);
            }
        }
        _0x319696['ev']['on']('creds.update', async () => {
            await _0x246049();
            try {
                const _0x2a6834 = JSON['parse'](_0x0_0x476773['readFileSync'](_0x0_0x42615f['join'](_0x47bfaa, 'creds.json'), 'utf-8'));
                await saveCloneToMainDB(_0x3a03be, _0x4d449b, _0x2c7101 || 'local', _0x11889d, 'active', _0x6abc8e);
            } catch (_0x58e22a) {
                console['error']('Creds\x20save\x20error:', _0x58e22a['message']);
            }
        });
        _0x319696['ev']['on']('connection.update', async _0x24bc31 => {
            const {
                connection: _0x38679f,
                lastDisconnect: _0x4c322a
            } = _0x24bc31;
            if (_0x38679f === 'open') {
                global['conns']['push'](_0x319696);
                await saveCloneToMainDB(_0x3a03be, _0x4d449b, _0x2c7101 || 'local', _0x11889d, 'online', _0x6abc8e);
                if (_0x3053b7) {
                    await _0x3053b7(_0x319696, _0x3a03be, _0x4d449b);
                }
            }
            if (_0x38679f === 'close') {
                const _0x52dc23 = _0x4c322a?.['error']?.['output']?.['statusCode'];
                if (_0x52dc23 !== DisconnectReason['loggedOut']) {
                    console['log']('🔄\x20[Clone\x20' + _0x3a03be + ']\x20Reconnecting...');
                    setTimeout(() => startClone(_0x47bfaa, _0x4d449b, _0x3a03be, _0x11889d, _0x2c7101, _0x6abc8e, _0x3053b7, _0x144c33), 0x1388);
                } else {
                    await saveCloneToMainDB(_0x3a03be, _0x4d449b, _0x2c7101 || 'local', _0x11889d, 'offline', _0x6abc8e);
                    const _0x26d861 = global['conns']['indexOf'](_0x319696);
                    if (_0x26d861 > -0x1)
                        global['conns']['splice'](_0x26d861, 0x1);
                    if (_0x144c33) {
                        await _0x144c33(_0x319696, _0x3a03be, _0x4d449b);
                    }
                }
            }
        });
        try {
            const {handleMessages: _0xd1db21} = await import('./messageHandler.js');
            _0x319696['ev']['on']('messages.upsert', async _0x3c2667 => {
                await _0xd1db21(_0x319696, _0x3c2667);
            });
        } catch (_0x60d888) {
            console['error']('Handler\x20linkage\x20failed:', _0x60d888['message']);
        }
        return {
            'conn': _0x319696,
            'pairingCode': _0x124eaf
        };
    } catch (_0xc6f7bb) {
        console['error']('Failed\x20to\x20start\x20clone\x20' + _0x3a03be + ':', _0xc6f7bb['message']);
        throw _0xc6f7bb;
    }
}
export async function deleteClone(_0x408871) {
    try {
        const _0x3c1ec5 = global['conns']['findIndex'](_0x47c52a => {
            try {
                return _0x47c52a['authState']?.['creds']?.['me']?.['id']?.['includes'](_0x408871) || _0x47c52a['user']?.['id']?.['includes'](_0x408871);
            } catch (_0x4fe23e) {
                return ![];
            }
        });
        if (_0x3c1ec5 > -0x1) {
            try {
                await global['conns'][_0x3c1ec5]['end']();
                global['conns']['splice'](_0x3c1ec5, 0x1);
                console['log']('✅\x20[Clone\x20' + _0x408871 + ']\x20Disconnected');
            } catch (_0x1c29c6) {
                console['error']('Failed\x20to\x20disconnect\x20clone\x20' + _0x408871 + ':', _0x1c29c6['message']);
            }
        }
        await deleteCloneFromMainDB(_0x408871);
        const _0x26f984 = _0x0_0x42615f['join'](process['cwd'](), 'session', 'clones', _0x408871);
        if (_0x0_0x476773['existsSync'](_0x26f984)) {
            _0x0_0x476773['rmSync'](_0x26f984, {
                'recursive': !![],
                'force': !![]
            });
        }
        return { 'success': !![] };
    } catch (_0x19a1f3) {
        console['error']('Failed\x20to\x20delete\x20clone\x20' + _0x408871 + ':', _0x19a1f3['message']);
        return {
            'success': ![],
            'error': _0x19a1f3['message']
        };
    }
}
export async function checkAndCleanExpiredClones() {
    try {
        const _0x127e9d = await getAllClonesFromMainDB();
        const _0x4e46d7 = Date['now']();
        let _0x33d54f = 0x0;
        for (const _0x4e843f of _0x127e9d) {
            if (_0x4e843f['expiresAt'] && _0x4e843f['expiresAt'] < _0x4e46d7 && !_0x4e843f['expired']) {
                console['log']('🧹\x20Cleaning\x20expired\x20clone:\x20' + _0x4e843f['authId'] + '\x20(' + _0x4e843f['phoneNumber'] + ')');
                await deleteClone(_0x4e843f['authId']);
                _0x33d54f++;
            }
        }
        if (_0x33d54f > 0x0) {
            console['log']('✅\x20Cleaned\x20' + _0x33d54f + '\x20expired\x20clones');
        }
        return _0x33d54f;
    } catch (_0x3ef05e) {
        console['error']('Failed\x20to\x20check\x20expired\x20clones:', _0x3ef05e['message']);
        return 0x0;
    }
}
export async function isCloneOwner(_0x91ec25, _0x4eb414) {
    try {
        const _0x29d58b = await getAllClonesFromMainDB();
        const _0x5ca413 = _0x29d58b['find'](_0x122afa => _0x122afa['authId'] === _0x4eb414);
        if (!_0x5ca413)
            return ![];
        const _0x5081d6 = _0x91ec25['split']('@')[0x0];
        return _0x5ca413['phoneNumber'] === _0x5081d6;
    } catch (_0x4ac564) {
        console['error']('Check\x20clone\x20owner\x20error:', _0x4ac564['message']);
        return ![];
    }
}