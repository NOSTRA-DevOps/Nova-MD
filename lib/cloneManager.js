import _0x0_0x71285a, {
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    Browsers
} from '@whiskeysockets/baileys';
import _0x0_0x30c865 from 'node-cache';
import _0x0_0x429372 from 'pino';
import _0x0_0x2f8411 from 'fs';
import _0x0_0x2f1e3d, { dirname } from 'path';
import { fileURLToPath } from 'url';
import _0x0_0x4f0e92 from './lightweight_store.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
if (!global['conns'])
    global['conns'] = [];
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL);
export function generateSessionId(_0x55f247 = 0x6, _0x44e511 = 0x4) {
    const _0x2987dd = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let _0x5be2f9 = '';
    for (let _0x371a82 = 0x0; _0x371a82 < _0x55f247; _0x371a82++) {
        _0x5be2f9 += _0x2987dd['charAt'](Math['floor'](Math['random']() * _0x2987dd['length']));
    }
    const _0x3b905d = String(Math['floor'](Math['random']() * Math['pow'](0xa, _0x44e511)))['padStart'](_0x44e511, '0');
    return 'NOVA' + _0x5be2f9 + _0x3b905d;
}
export async function saveCloneToMainDB(_0xd48e86, _0x38302b, _0x47c61d, _0x1ce1be, _0x55b44f, _0x5dabeb = null) {
    try {
        let _0xb8357 = null;
        if (_0x5dabeb && _0x5dabeb > 0x0) {
            _0xb8357 = Date['now']() + _0x5dabeb * 0x18 * 0x3c * 0x3c * 0x3e8;
        }
        const _0x8c4223 = {
            'phoneNumber': _0x38302b,
            'dbUrl': _0x47c61d || 'local',
            'dbType': _0x1ce1be || 'local',
            'status': _0x55b44f || 'configured',
            'createdAt': Date['now'](),
            'updatedAt': Date['now'](),
            'expiryDays': _0x5dabeb || null,
            'expiresAt': _0xb8357,
            'expired': ![]
        };
        if (HAS_DB) {
            await _0x0_0x4f0e92['saveSetting']('clones', _0xd48e86, _0x8c4223);
            console['log']('✅\x20[Clone\x20' + _0xd48e86 + ']\x20Saved\x20to\x20main\x20database' + (_0x5dabeb ? '\x20(expires\x20in\x20' + _0x5dabeb + '\x20days)' : ''));
        } else {
            const _0x4ebfc3 = _0x0_0x2f1e3d['join'](process['cwd'](), 'session', 'clones');
            if (!_0x0_0x2f8411['existsSync'](_0x4ebfc3)) {
                _0x0_0x2f8411['mkdirSync'](_0x4ebfc3, { 'recursive': !![] });
            }
            _0x0_0x2f8411['writeFileSync'](_0x0_0x2f1e3d['join'](_0x4ebfc3, _0xd48e86 + '.json'), JSON['stringify'](_0x8c4223, null, 0x2));
            console['log']('✅\x20[Clone\x20' + _0xd48e86 + ']\x20Saved\x20locally' + (_0x5dabeb ? '\x20(expires\x20in\x20' + _0x5dabeb + '\x20days)' : ''));
        }
        return !![];
    } catch (_0x17084f) {
        console['error']('❌\x20Failed\x20to\x20save\x20clone\x20' + _0xd48e86 + ':', _0x17084f['message']);
        return ![];
    }
}
export async function getAllClonesFromMainDB() {
    try {
        let _0x2bbc97 = [];
        if (HAS_DB) {
            const _0x46d787 = await _0x0_0x4f0e92['getSetting']('clones', 'all') || {};
            _0x2bbc97 = Object['entries'](_0x46d787)['map'](([_0x1a5078, _0x421e32]) => ({
                'authId': _0x1a5078,
                'phoneNumber': _0x421e32['phoneNumber'],
                'dbType': _0x421e32['dbType'] || 'local',
                'status': _0x421e32['status'] || 'unknown',
                'createdAt': _0x421e32['createdAt'],
                'updatedAt': _0x421e32['updatedAt'],
                'expiryDays': _0x421e32['expiryDays'] || null,
                'expiresAt': _0x421e32['expiresAt'] || null,
                'expired': _0x421e32['expired'] || ![]
            }));
        } else {
            const _0x404544 = _0x0_0x2f1e3d['join'](process['cwd'](), 'session', 'clones');
            if (!_0x0_0x2f8411['existsSync'](_0x404544))
                return [];
            const _0x355ce2 = _0x0_0x2f8411['readdirSync'](_0x404544)['filter'](_0x8537e2 => _0x8537e2['endsWith']('.json'));
            for (const _0x44e1df of _0x355ce2) {
                const _0x374879 = _0x44e1df['replace']('.json', '');
                const _0x385529 = JSON['parse'](_0x0_0x2f8411['readFileSync'](_0x0_0x2f1e3d['join'](_0x404544, _0x44e1df), 'utf-8'));
                _0x2bbc97['push']({
                    'authId': _0x374879,
                    'phoneNumber': _0x385529['phoneNumber'],
                    'dbType': _0x385529['dbType'] || 'local',
                    'status': _0x385529['status'] || 'unknown',
                    'createdAt': _0x385529['createdAt'],
                    'updatedAt': _0x385529['updatedAt'],
                    'expiryDays': _0x385529['expiryDays'] || null,
                    'expiresAt': _0x385529['expiresAt'] || null,
                    'expired': _0x385529['expired'] || ![]
                });
            }
        }
        const _0x41f283 = Date['now']();
        for (const _0x491376 of _0x2bbc97) {
            if (_0x491376['expiresAt'] && _0x491376['expiresAt'] < _0x41f283 && !_0x491376['expired']) {
                _0x491376['expired'] = !![];
                _0x491376['status'] = 'expired';
                await updateCloneStatus(_0x491376['authId'], 'expired', !![]);
            }
        }
        return _0x2bbc97;
    } catch (_0x544e5e) {
        console['error']('Failed\x20to\x20get\x20all\x20clones:', _0x544e5e['message']);
        return [];
    }
}
async function updateCloneStatus(_0x4fbc21, _0x9af75c, _0x48b3f7 = ![]) {
    try {
        let _0x40d0ef = null;
        if (HAS_DB) {
            _0x40d0ef = await _0x0_0x4f0e92['getSetting']('clones', _0x4fbc21);
        } else {
            const _0x53e3e1 = _0x0_0x2f1e3d['join'](process['cwd'](), 'session', 'clones');
            const _0x6ef568 = _0x0_0x2f1e3d['join'](_0x53e3e1, _0x4fbc21 + '.json');
            if (_0x0_0x2f8411['existsSync'](_0x6ef568)) {
                _0x40d0ef = JSON['parse'](_0x0_0x2f8411['readFileSync'](_0x6ef568, 'utf-8'));
            }
        }
        if (_0x40d0ef) {
            _0x40d0ef['status'] = _0x9af75c;
            _0x40d0ef['expired'] = _0x48b3f7;
            _0x40d0ef['updatedAt'] = Date['now']();
            if (HAS_DB) {
                await _0x0_0x4f0e92['saveSetting']('clones', _0x4fbc21, _0x40d0ef);
            } else {
                const _0x206829 = _0x0_0x2f1e3d['join'](process['cwd'](), 'session', 'clones');
                const _0x13c956 = _0x0_0x2f1e3d['join'](_0x206829, _0x4fbc21 + '.json');
                _0x0_0x2f8411['writeFileSync'](_0x13c956, JSON['stringify'](_0x40d0ef, null, 0x2));
            }
        }
    } catch (_0x1fa75c) {
        console['error']('Failed\x20to\x20update\x20clone\x20status\x20' + _0x4fbc21 + ':', _0x1fa75c['message']);
    }
}
export async function getCloneByPhoneNumber(_0x5cbd36) {
    const _0x2b044f = await getAllClonesFromMainDB();
    return _0x2b044f['filter'](_0x2b82f6 => _0x2b82f6['phoneNumber'] === _0x5cbd36);
}
export async function deleteCloneFromMainDB(_0x374004) {
    try {
        if (HAS_DB) {
            await _0x0_0x4f0e92['saveSetting']('clones', _0x374004, null);
        } else {
            const _0x4d4fca = _0x0_0x2f1e3d['join'](process['cwd'](), 'session', 'clones');
            const _0x362720 = _0x0_0x2f1e3d['join'](_0x4d4fca, _0x374004 + '.json');
            if (_0x0_0x2f8411['existsSync'](_0x362720)) {
                _0x0_0x2f8411['unlinkSync'](_0x362720);
            }
        }
        console['log']('✅\x20[Clone\x20' + _0x374004 + ']\x20Removed\x20from\x20main\x20database');
        return !![];
    } catch (_0x3351e0) {
        console['error']('Failed\x20to\x20delete\x20clone\x20' + _0x374004 + ':', _0x3351e0['message']);
        return ![];
    }
}
export async function startClone(_0x37fe1d, _0x5de4af, _0xbb4ae8, _0x2be700, _0x269327, _0x3867db, _0x173726, _0x208629) {
    try {
        const {
            state: _0x2355d8,
            saveCreds: _0x3dbe27
        } = await useMultiFileAuthState(_0x37fe1d);
        const {version: _0x47f057} = await fetchLatestBaileysVersion();
        const _0x4f1841 = new _0x0_0x30c865();
        const _0x21e2bc = _0x0_0x71285a({
            'version': _0x47f057,
            'logger': _0x0_0x429372({ 'level': 'silent' }),
            'printQRInTerminal': ![],
            'browser': Browsers['macOS']('Chrome'),
            'auth': {
                'creds': _0x2355d8['creds'],
                'keys': makeCacheableSignalKeyStore(_0x2355d8['keys'], _0x0_0x429372({ 'level': 'fatal' }))
            },
            'markOnlineOnConnect': !![],
            'msgRetryCounterCache': _0x4f1841,
            'connectTimeoutMs': 0x1d4c0,
            'defaultQueryTimeoutMs': 0x0,
            'keepAliveIntervalMs': 0x7530,
            'mobile': ![]
        });
        let _0x2b258d = null;
        if (!_0x21e2bc['authState']['creds']['registered']) {
            await new Promise(_0x2b86fc => setTimeout(_0x2b86fc, 0x1770));
            try {
                let _0x156a13 = await _0x21e2bc['requestPairingCode'](_0x5de4af);
                _0x2b258d = _0x156a13?.['match'](/.{1,4}/g)?.['join']('-') || _0x156a13;
                await saveCloneToMainDB(_0xbb4ae8, _0x5de4af, _0x269327 || 'local', _0x2be700, 'pairing', _0x3867db);
            } catch (_0xc96353) {
                console['error']('Pairing\x20Error:', _0xc96353);
                throw new Error('Failed\x20to\x20get\x20pairing\x20code:\x20' + _0xc96353['message']);
            }
        }
        _0x21e2bc['ev']['on']('creds.update', async () => {
            await _0x3dbe27();
            try {
                const _0x465765 = JSON['parse'](_0x0_0x2f8411['readFileSync'](_0x0_0x2f1e3d['join'](_0x37fe1d, 'creds.json'), 'utf-8'));
                await saveCloneToMainDB(_0xbb4ae8, _0x5de4af, _0x269327 || 'local', _0x2be700, 'active', _0x3867db);
            } catch (_0xc5b82f) {
                console['error']('Creds\x20save\x20error:', _0xc5b82f['message']);
            }
        });
        _0x21e2bc['ev']['on']('connection.update', async _0xb75694 => {
            const {
                connection: _0x2eda0c,
                lastDisconnect: _0x3cbe1e
            } = _0xb75694;
            if (_0x2eda0c === 'open') {
                global['conns']['push'](_0x21e2bc);
                await saveCloneToMainDB(_0xbb4ae8, _0x5de4af, _0x269327 || 'local', _0x2be700, 'online', _0x3867db);
                if (_0x173726) {
                    await _0x173726(_0x21e2bc, _0xbb4ae8, _0x5de4af);
                }
            }
            if (_0x2eda0c === 'close') {
                const _0x55b01d = _0x3cbe1e?.['error']?.['output']?.['statusCode'];
                if (_0x55b01d !== DisconnectReason['loggedOut']) {
                    console['log']('🔄\x20[Clone\x20' + _0xbb4ae8 + ']\x20Reconnecting...');
                    setTimeout(() => startClone(_0x37fe1d, _0x5de4af, _0xbb4ae8, _0x2be700, _0x269327, _0x3867db, _0x173726, _0x208629), 0x1388);
                } else {
                    await saveCloneToMainDB(_0xbb4ae8, _0x5de4af, _0x269327 || 'local', _0x2be700, 'offline', _0x3867db);
                    const _0x9f8da = global['conns']['indexOf'](_0x21e2bc);
                    if (_0x9f8da > -0x1)
                        global['conns']['splice'](_0x9f8da, 0x1);
                    if (_0x208629) {
                        await _0x208629(_0x21e2bc, _0xbb4ae8, _0x5de4af);
                    }
                }
            }
        });
        try {
            const {handleMessages: _0x2b1c54} = await import('./messageHandler.js');
            _0x21e2bc['ev']['on']('messages.upsert', async _0x4b3172 => {
                await _0x2b1c54(_0x21e2bc, _0x4b3172);
            });
        } catch (_0x19cbb1) {
            console['error']('Handler\x20linkage\x20failed:', _0x19cbb1['message']);
        }
        return {
            'conn': _0x21e2bc,
            'pairingCode': _0x2b258d
        };
    } catch (_0x4b6d07) {
        console['error']('Failed\x20to\x20start\x20clone\x20' + _0xbb4ae8 + ':', _0x4b6d07['message']);
        throw _0x4b6d07;
    }
}
export async function deleteClone(_0x57f8db) {
    try {
        const _0x15179d = global['conns']['findIndex'](_0x274278 => {
            try {
                return _0x274278['authState']?.['creds']?.['me']?.['id']?.['includes'](_0x57f8db) || _0x274278['user']?.['id']?.['includes'](_0x57f8db);
            } catch (_0x292afd) {
                return ![];
            }
        });
        if (_0x15179d > -0x1) {
            try {
                await global['conns'][_0x15179d]['end']();
                global['conns']['splice'](_0x15179d, 0x1);
                console['log']('✅\x20[Clone\x20' + _0x57f8db + ']\x20Disconnected');
            } catch (_0x302fc) {
                console['error']('Failed\x20to\x20disconnect\x20clone\x20' + _0x57f8db + ':', _0x302fc['message']);
            }
        }
        await deleteCloneFromMainDB(_0x57f8db);
        const _0x2a527f = _0x0_0x2f1e3d['join'](process['cwd'](), 'session', 'clones', _0x57f8db);
        if (_0x0_0x2f8411['existsSync'](_0x2a527f)) {
            _0x0_0x2f8411['rmSync'](_0x2a527f, {
                'recursive': !![],
                'force': !![]
            });
        }
        return { 'success': !![] };
    } catch (_0xfef74b) {
        console['error']('Failed\x20to\x20delete\x20clone\x20' + _0x57f8db + ':', _0xfef74b['message']);
        return {
            'success': ![],
            'error': _0xfef74b['message']
        };
    }
}
export async function checkAndCleanExpiredClones() {
    try {
        const _0x3fd173 = await getAllClonesFromMainDB();
        const _0x4c3739 = Date['now']();
        let _0x10e0bd = 0x0;
        for (const _0x29c913 of _0x3fd173) {
            if (_0x29c913['expiresAt'] && _0x29c913['expiresAt'] < _0x4c3739 && !_0x29c913['expired']) {
                console['log']('🧹\x20Cleaning\x20expired\x20clone:\x20' + _0x29c913['authId'] + '\x20(' + _0x29c913['phoneNumber'] + ')');
                await deleteClone(_0x29c913['authId']);
                _0x10e0bd++;
            }
        }
        if (_0x10e0bd > 0x0) {
            console['log']('✅\x20Cleaned\x20' + _0x10e0bd + '\x20expired\x20clones');
        }
        return _0x10e0bd;
    } catch (_0x35b250) {
        console['error']('Failed\x20to\x20check\x20expired\x20clones:', _0x35b250['message']);
        return 0x0;
    }
}
export async function isCloneOwner(_0x39837c, _0x119e76) {
    try {
        const _0x3d09d5 = await getAllClonesFromMainDB();
        const _0x4435ea = _0x3d09d5['find'](_0x1a8ed3 => _0x1a8ed3['authId'] === _0x119e76);
        if (!_0x4435ea)
            return ![];
        const _0x39c145 = _0x39837c['split']('@')[0x0];
        return _0x4435ea['phoneNumber'] === _0x39c145;
    } catch (_0x449ce5) {
        console['error']('Check\x20clone\x20owner\x20error:', _0x449ce5['message']);
        return ![];
    }
}