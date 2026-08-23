import _0x0_0x5124f5, {
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    Browsers
} from '@whiskeysockets/baileys';
import _0x0_0x1d77f8 from 'node-cache';
import _0x0_0x4f4205 from 'pino';
import _0x0_0x3cdbff from 'fs';
import _0x0_0x2974af, { dirname } from 'path';
import { fileURLToPath } from 'url';
import _0x0_0x28d64b from './lightweight_store.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
if (!global['conns'])
    global['conns'] = [];
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL);
export function generateSessionId(_0x45ab1e = 0x6, _0x5b1c0a = 0x4) {
    const _0x56be6f = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let _0x11b3e5 = '';
    for (let _0x16f23f = 0x0; _0x16f23f < _0x45ab1e; _0x16f23f++) {
        _0x11b3e5 += _0x56be6f['charAt'](Math['floor'](Math['random']() * _0x56be6f['length']));
    }
    const _0x1092a3 = String(Math['floor'](Math['random']() * Math['pow'](0xa, _0x5b1c0a)))['padStart'](_0x5b1c0a, '0');
    return 'NOVA' + _0x11b3e5 + _0x1092a3;
}
export async function saveCloneToMainDB(_0x5662fb, _0x382724, _0x398d25, _0x4a1257, _0x56c50e, _0xfa3bc4 = null) {
    try {
        let _0x4c1377 = null;
        if (_0xfa3bc4 && _0xfa3bc4 > 0x0) {
            _0x4c1377 = Date['now']() + _0xfa3bc4 * 0x18 * 0x3c * 0x3c * 0x3e8;
        }
        const _0x2d6584 = {
            'phoneNumber': _0x382724,
            'dbUrl': _0x398d25 || 'local',
            'dbType': _0x4a1257 || 'local',
            'status': _0x56c50e || 'configured',
            'createdAt': Date['now'](),
            'updatedAt': Date['now'](),
            'expiryDays': _0xfa3bc4 || null,
            'expiresAt': _0x4c1377,
            'expired': ![]
        };
        if (HAS_DB) {
            await _0x0_0x28d64b['saveSetting']('clones', _0x5662fb, _0x2d6584);
            console['log']('✅\x20[Clone\x20' + _0x5662fb + ']\x20Saved\x20to\x20main\x20database' + (_0xfa3bc4 ? '\x20(expires\x20in\x20' + _0xfa3bc4 + '\x20days)' : ''));
        } else {
            const _0x3c9b1c = _0x0_0x2974af['join'](process['cwd'](), 'session', 'clones');
            if (!_0x0_0x3cdbff['existsSync'](_0x3c9b1c)) {
                _0x0_0x3cdbff['mkdirSync'](_0x3c9b1c, { 'recursive': !![] });
            }
            _0x0_0x3cdbff['writeFileSync'](_0x0_0x2974af['join'](_0x3c9b1c, _0x5662fb + '.json'), JSON['stringify'](_0x2d6584, null, 0x2));
            console['log']('✅\x20[Clone\x20' + _0x5662fb + ']\x20Saved\x20locally' + (_0xfa3bc4 ? '\x20(expires\x20in\x20' + _0xfa3bc4 + '\x20days)' : ''));
        }
        return !![];
    } catch (_0x22b3d2) {
        console['error']('❌\x20Failed\x20to\x20save\x20clone\x20' + _0x5662fb + ':', _0x22b3d2['message']);
        return ![];
    }
}
export async function getAllClonesFromMainDB() {
    try {
        let _0x27f200 = [];
        if (HAS_DB) {
            const _0x5e279a = await _0x0_0x28d64b['getSetting']('clones', 'all') || {};
            _0x27f200 = Object['entries'](_0x5e279a)['map'](([_0x52daac, _0x292a25]) => ({
                'authId': _0x52daac,
                'phoneNumber': _0x292a25['phoneNumber'],
                'dbType': _0x292a25['dbType'] || 'local',
                'status': _0x292a25['status'] || 'unknown',
                'createdAt': _0x292a25['createdAt'],
                'updatedAt': _0x292a25['updatedAt'],
                'expiryDays': _0x292a25['expiryDays'] || null,
                'expiresAt': _0x292a25['expiresAt'] || null,
                'expired': _0x292a25['expired'] || ![]
            }));
        } else {
            const _0x2cd55a = _0x0_0x2974af['join'](process['cwd'](), 'session', 'clones');
            if (!_0x0_0x3cdbff['existsSync'](_0x2cd55a))
                return [];
            const _0x1e95d8 = _0x0_0x3cdbff['readdirSync'](_0x2cd55a)['filter'](_0x2e6a5a => _0x2e6a5a['endsWith']('.json'));
            for (const _0x2065bc of _0x1e95d8) {
                const _0x5184bd = _0x2065bc['replace']('.json', '');
                const _0xec356a = JSON['parse'](_0x0_0x3cdbff['readFileSync'](_0x0_0x2974af['join'](_0x2cd55a, _0x2065bc), 'utf-8'));
                _0x27f200['push']({
                    'authId': _0x5184bd,
                    'phoneNumber': _0xec356a['phoneNumber'],
                    'dbType': _0xec356a['dbType'] || 'local',
                    'status': _0xec356a['status'] || 'unknown',
                    'createdAt': _0xec356a['createdAt'],
                    'updatedAt': _0xec356a['updatedAt'],
                    'expiryDays': _0xec356a['expiryDays'] || null,
                    'expiresAt': _0xec356a['expiresAt'] || null,
                    'expired': _0xec356a['expired'] || ![]
                });
            }
        }
        const _0x226ca2 = Date['now']();
        for (const _0x241db8 of _0x27f200) {
            if (_0x241db8['expiresAt'] && _0x241db8['expiresAt'] < _0x226ca2 && !_0x241db8['expired']) {
                _0x241db8['expired'] = !![];
                _0x241db8['status'] = 'expired';
                await updateCloneStatus(_0x241db8['authId'], 'expired', !![]);
            }
        }
        return _0x27f200;
    } catch (_0x50c099) {
        console['error']('Failed\x20to\x20get\x20all\x20clones:', _0x50c099['message']);
        return [];
    }
}
async function updateCloneStatus(_0x29fffa, _0x1eda1b, _0x384920 = ![]) {
    try {
        let _0x4de554 = null;
        if (HAS_DB) {
            _0x4de554 = await _0x0_0x28d64b['getSetting']('clones', _0x29fffa);
        } else {
            const _0x2c213a = _0x0_0x2974af['join'](process['cwd'](), 'session', 'clones');
            const _0x404f8f = _0x0_0x2974af['join'](_0x2c213a, _0x29fffa + '.json');
            if (_0x0_0x3cdbff['existsSync'](_0x404f8f)) {
                _0x4de554 = JSON['parse'](_0x0_0x3cdbff['readFileSync'](_0x404f8f, 'utf-8'));
            }
        }
        if (_0x4de554) {
            _0x4de554['status'] = _0x1eda1b;
            _0x4de554['expired'] = _0x384920;
            _0x4de554['updatedAt'] = Date['now']();
            if (HAS_DB) {
                await _0x0_0x28d64b['saveSetting']('clones', _0x29fffa, _0x4de554);
            } else {
                const _0xd3d670 = _0x0_0x2974af['join'](process['cwd'](), 'session', 'clones');
                const _0x3d5360 = _0x0_0x2974af['join'](_0xd3d670, _0x29fffa + '.json');
                _0x0_0x3cdbff['writeFileSync'](_0x3d5360, JSON['stringify'](_0x4de554, null, 0x2));
            }
        }
    } catch (_0x1c417f) {
        console['error']('Failed\x20to\x20update\x20clone\x20status\x20' + _0x29fffa + ':', _0x1c417f['message']);
    }
}
export async function getCloneByPhoneNumber(_0x19322f) {
    const _0xca909d = await getAllClonesFromMainDB();
    return _0xca909d['filter'](_0x4b653e => _0x4b653e['phoneNumber'] === _0x19322f);
}
export async function deleteCloneFromMainDB(_0x409aa1) {
    try {
        if (HAS_DB) {
            await _0x0_0x28d64b['saveSetting']('clones', _0x409aa1, null);
        } else {
            const _0x614dd6 = _0x0_0x2974af['join'](process['cwd'](), 'session', 'clones');
            const _0x3f5442 = _0x0_0x2974af['join'](_0x614dd6, _0x409aa1 + '.json');
            if (_0x0_0x3cdbff['existsSync'](_0x3f5442)) {
                _0x0_0x3cdbff['unlinkSync'](_0x3f5442);
            }
        }
        console['log']('✅\x20[Clone\x20' + _0x409aa1 + ']\x20Removed\x20from\x20main\x20database');
        return !![];
    } catch (_0x157d0e) {
        console['error']('Failed\x20to\x20delete\x20clone\x20' + _0x409aa1 + ':', _0x157d0e['message']);
        return ![];
    }
}
export async function startClone(_0x445154, _0x4c1443, _0x3bb807, _0x45c2b9, _0x2dfaf9, _0x1cafe0, _0x48bd66, _0x40e52d) {
    try {
        const {
            state: _0x9fc722,
            saveCreds: _0x47f41f
        } = await useMultiFileAuthState(_0x445154);
        const {version: _0xd90990} = await fetchLatestBaileysVersion();
        const _0x253dc9 = new _0x0_0x1d77f8();
        const _0x2a64b8 = _0x0_0x5124f5({
            'version': _0xd90990,
            'logger': _0x0_0x4f4205({ 'level': 'silent' }),
            'printQRInTerminal': ![],
            'browser': Browsers['macOS']('Chrome'),
            'auth': {
                'creds': _0x9fc722['creds'],
                'keys': makeCacheableSignalKeyStore(_0x9fc722['keys'], _0x0_0x4f4205({ 'level': 'fatal' }))
            },
            'markOnlineOnConnect': !![],
            'msgRetryCounterCache': _0x253dc9,
            'connectTimeoutMs': 0x1d4c0,
            'defaultQueryTimeoutMs': 0x0,
            'keepAliveIntervalMs': 0x7530,
            'mobile': ![]
        });
        let _0x19de5a = null;
        if (!_0x2a64b8['authState']['creds']['registered']) {
            await new Promise(_0x41ea46 => setTimeout(_0x41ea46, 0x1770));
            try {
                let _0x3aae43 = await _0x2a64b8['requestPairingCode'](_0x4c1443);
                _0x19de5a = _0x3aae43?.['match'](/.{1,4}/g)?.['join']('-') || _0x3aae43;
                await saveCloneToMainDB(_0x3bb807, _0x4c1443, _0x2dfaf9 || 'local', _0x45c2b9, 'pairing', _0x1cafe0);
            } catch (_0x518c91) {
                console['error']('Pairing\x20Error:', _0x518c91);
                throw new Error('Failed\x20to\x20get\x20pairing\x20code:\x20' + _0x518c91['message']);
            }
        }
        _0x2a64b8['ev']['on']('creds.update', async () => {
            await _0x47f41f();
            try {
                const _0x2b6869 = JSON['parse'](_0x0_0x3cdbff['readFileSync'](_0x0_0x2974af['join'](_0x445154, 'creds.json'), 'utf-8'));
                await saveCloneToMainDB(_0x3bb807, _0x4c1443, _0x2dfaf9 || 'local', _0x45c2b9, 'active', _0x1cafe0);
            } catch (_0x448f73) {
                console['error']('Creds\x20save\x20error:', _0x448f73['message']);
            }
        });
        _0x2a64b8['ev']['on']('connection.update', async _0x54f285 => {
            const {
                connection: _0x36a01c,
                lastDisconnect: _0x70c793
            } = _0x54f285;
            if (_0x36a01c === 'open') {
                global['conns']['push'](_0x2a64b8);
                await saveCloneToMainDB(_0x3bb807, _0x4c1443, _0x2dfaf9 || 'local', _0x45c2b9, 'online', _0x1cafe0);
                if (_0x48bd66) {
                    await _0x48bd66(_0x2a64b8, _0x3bb807, _0x4c1443);
                }
            }
            if (_0x36a01c === 'close') {
                const _0x3cf34a = _0x70c793?.['error']?.['output']?.['statusCode'];
                if (_0x3cf34a !== DisconnectReason['loggedOut']) {
                    console['log']('🔄\x20[Clone\x20' + _0x3bb807 + ']\x20Reconnecting...');
                    setTimeout(() => startClone(_0x445154, _0x4c1443, _0x3bb807, _0x45c2b9, _0x2dfaf9, _0x1cafe0, _0x48bd66, _0x40e52d), 0x1388);
                } else {
                    await saveCloneToMainDB(_0x3bb807, _0x4c1443, _0x2dfaf9 || 'local', _0x45c2b9, 'offline', _0x1cafe0);
                    const _0x1f74e1 = global['conns']['indexOf'](_0x2a64b8);
                    if (_0x1f74e1 > -0x1)
                        global['conns']['splice'](_0x1f74e1, 0x1);
                    if (_0x40e52d) {
                        await _0x40e52d(_0x2a64b8, _0x3bb807, _0x4c1443);
                    }
                }
            }
        });
        try {
            const {handleMessages: _0x49e48d} = await import('./messageHandler.js');
            _0x2a64b8['ev']['on']('messages.upsert', async _0x386643 => {
                await _0x49e48d(_0x2a64b8, _0x386643);
            });
        } catch (_0x54f4a4) {
            console['error']('Handler\x20linkage\x20failed:', _0x54f4a4['message']);
        }
        return {
            'conn': _0x2a64b8,
            'pairingCode': _0x19de5a
        };
    } catch (_0xccd3b9) {
        console['error']('Failed\x20to\x20start\x20clone\x20' + _0x3bb807 + ':', _0xccd3b9['message']);
        throw _0xccd3b9;
    }
}
export async function deleteClone(_0x383092) {
    try {
        const _0x8129b1 = global['conns']['findIndex'](_0x59bb69 => {
            try {
                return _0x59bb69['authState']?.['creds']?.['me']?.['id']?.['includes'](_0x383092) || _0x59bb69['user']?.['id']?.['includes'](_0x383092);
            } catch (_0xd446a1) {
                return ![];
            }
        });
        if (_0x8129b1 > -0x1) {
            try {
                await global['conns'][_0x8129b1]['end']();
                global['conns']['splice'](_0x8129b1, 0x1);
                console['log']('✅\x20[Clone\x20' + _0x383092 + ']\x20Disconnected');
            } catch (_0x32c3b6) {
                console['error']('Failed\x20to\x20disconnect\x20clone\x20' + _0x383092 + ':', _0x32c3b6['message']);
            }
        }
        await deleteCloneFromMainDB(_0x383092);
        const _0x517cd6 = _0x0_0x2974af['join'](process['cwd'](), 'session', 'clones', _0x383092);
        if (_0x0_0x3cdbff['existsSync'](_0x517cd6)) {
            _0x0_0x3cdbff['rmSync'](_0x517cd6, {
                'recursive': !![],
                'force': !![]
            });
        }
        return { 'success': !![] };
    } catch (_0x460b12) {
        console['error']('Failed\x20to\x20delete\x20clone\x20' + _0x383092 + ':', _0x460b12['message']);
        return {
            'success': ![],
            'error': _0x460b12['message']
        };
    }
}
export async function checkAndCleanExpiredClones() {
    try {
        const _0x2f962c = await getAllClonesFromMainDB();
        const _0xd6355a = Date['now']();
        let _0x5e35b5 = 0x0;
        for (const _0x341f61 of _0x2f962c) {
            if (_0x341f61['expiresAt'] && _0x341f61['expiresAt'] < _0xd6355a && !_0x341f61['expired']) {
                console['log']('🧹\x20Cleaning\x20expired\x20clone:\x20' + _0x341f61['authId'] + '\x20(' + _0x341f61['phoneNumber'] + ')');
                await deleteClone(_0x341f61['authId']);
                _0x5e35b5++;
            }
        }
        if (_0x5e35b5 > 0x0) {
            console['log']('✅\x20Cleaned\x20' + _0x5e35b5 + '\x20expired\x20clones');
        }
        return _0x5e35b5;
    } catch (_0x4f66c0) {
        console['error']('Failed\x20to\x20check\x20expired\x20clones:', _0x4f66c0['message']);
        return 0x0;
    }
}
export async function isCloneOwner(_0x3640ad, _0x5b79e9) {
    try {
        const _0x24b024 = await getAllClonesFromMainDB();
        const _0x462f0a = _0x24b024['find'](_0x2a35d6 => _0x2a35d6['authId'] === _0x5b79e9);
        if (!_0x462f0a)
            return ![];
        const _0x3e3f89 = _0x3640ad['split']('@')[0x0];
        return _0x462f0a['phoneNumber'] === _0x3e3f89;
    } catch (_0x7a0f41) {
        console['error']('Check\x20clone\x20owner\x20error:', _0x7a0f41['message']);
        return ![];
    }
}