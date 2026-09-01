import _0x0_0x13cc28, {
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    Browsers
} from '@whiskeysockets/baileys';
import _0x0_0x197a77 from 'node-cache';
import _0x0_0x1903b8 from 'pino';
import _0x0_0xa60080 from 'fs';
import _0x0_0x43568c, { dirname } from 'path';
import { fileURLToPath } from 'url';
import _0x0_0xf46224 from './lightweight_store.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
if (!global['conns'])
    global['conns'] = [];
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL);
export function generateSessionId(_0x9fdfc4 = 0x6, _0x4e1e01 = 0x4) {
    const _0x164618 = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let _0x20d717 = '';
    for (let _0x3ec8b0 = 0x0; _0x3ec8b0 < _0x9fdfc4; _0x3ec8b0++) {
        _0x20d717 += _0x164618['charAt'](Math['floor'](Math['random']() * _0x164618['length']));
    }
    const _0x41cc05 = String(Math['floor'](Math['random']() * Math['pow'](0xa, _0x4e1e01)))['padStart'](_0x4e1e01, '0');
    return 'NOVA' + _0x20d717 + _0x41cc05;
}
export async function saveCloneToMainDB(_0xcc6511, _0x5b3d6e, _0x2c1dde, _0x5579fe, _0x4867c0, _0x367c20 = null) {
    try {
        let _0x260362 = null;
        if (_0x367c20 && _0x367c20 > 0x0) {
            _0x260362 = Date['now']() + _0x367c20 * 0x18 * 0x3c * 0x3c * 0x3e8;
        }
        const _0x305284 = {
            'phoneNumber': _0x5b3d6e,
            'dbUrl': _0x2c1dde || 'local',
            'dbType': _0x5579fe || 'local',
            'status': _0x4867c0 || 'configured',
            'createdAt': Date['now'](),
            'updatedAt': Date['now'](),
            'expiryDays': _0x367c20 || null,
            'expiresAt': _0x260362,
            'expired': ![]
        };
        if (HAS_DB) {
            await _0x0_0xf46224['saveSetting']('clones', _0xcc6511, _0x305284);
            console['log']('✅\x20[Clone\x20' + _0xcc6511 + ']\x20Saved\x20to\x20main\x20database' + (_0x367c20 ? '\x20(expires\x20in\x20' + _0x367c20 + '\x20days)' : ''));
        } else {
            const _0x517275 = _0x0_0x43568c['join'](process['cwd'](), 'session', 'clones');
            if (!_0x0_0xa60080['existsSync'](_0x517275)) {
                _0x0_0xa60080['mkdirSync'](_0x517275, { 'recursive': !![] });
            }
            _0x0_0xa60080['writeFileSync'](_0x0_0x43568c['join'](_0x517275, _0xcc6511 + '.json'), JSON['stringify'](_0x305284, null, 0x2));
            console['log']('✅\x20[Clone\x20' + _0xcc6511 + ']\x20Saved\x20locally' + (_0x367c20 ? '\x20(expires\x20in\x20' + _0x367c20 + '\x20days)' : ''));
        }
        return !![];
    } catch (_0x464c37) {
        console['error']('❌\x20Failed\x20to\x20save\x20clone\x20' + _0xcc6511 + ':', _0x464c37['message']);
        return ![];
    }
}
export async function getAllClonesFromMainDB() {
    try {
        let _0x1c39c1 = [];
        if (HAS_DB) {
            const _0x33ca9a = await _0x0_0xf46224['getSetting']('clones', 'all') || {};
            _0x1c39c1 = Object['entries'](_0x33ca9a)['map'](([_0x132d1e, _0x590d91]) => ({
                'authId': _0x132d1e,
                'phoneNumber': _0x590d91['phoneNumber'],
                'dbType': _0x590d91['dbType'] || 'local',
                'status': _0x590d91['status'] || 'unknown',
                'createdAt': _0x590d91['createdAt'],
                'updatedAt': _0x590d91['updatedAt'],
                'expiryDays': _0x590d91['expiryDays'] || null,
                'expiresAt': _0x590d91['expiresAt'] || null,
                'expired': _0x590d91['expired'] || ![]
            }));
        } else {
            const _0x5b1e32 = _0x0_0x43568c['join'](process['cwd'](), 'session', 'clones');
            if (!_0x0_0xa60080['existsSync'](_0x5b1e32))
                return [];
            const _0x3efce1 = _0x0_0xa60080['readdirSync'](_0x5b1e32)['filter'](_0x43b425 => _0x43b425['endsWith']('.json'));
            for (const _0x4cf5bb of _0x3efce1) {
                const _0x509224 = _0x4cf5bb['replace']('.json', '');
                const _0xf02de0 = JSON['parse'](_0x0_0xa60080['readFileSync'](_0x0_0x43568c['join'](_0x5b1e32, _0x4cf5bb), 'utf-8'));
                _0x1c39c1['push']({
                    'authId': _0x509224,
                    'phoneNumber': _0xf02de0['phoneNumber'],
                    'dbType': _0xf02de0['dbType'] || 'local',
                    'status': _0xf02de0['status'] || 'unknown',
                    'createdAt': _0xf02de0['createdAt'],
                    'updatedAt': _0xf02de0['updatedAt'],
                    'expiryDays': _0xf02de0['expiryDays'] || null,
                    'expiresAt': _0xf02de0['expiresAt'] || null,
                    'expired': _0xf02de0['expired'] || ![]
                });
            }
        }
        const _0x3ee213 = Date['now']();
        for (const _0x5aaa38 of _0x1c39c1) {
            if (_0x5aaa38['expiresAt'] && _0x5aaa38['expiresAt'] < _0x3ee213 && !_0x5aaa38['expired']) {
                _0x5aaa38['expired'] = !![];
                _0x5aaa38['status'] = 'expired';
                await updateCloneStatus(_0x5aaa38['authId'], 'expired', !![]);
            }
        }
        return _0x1c39c1;
    } catch (_0x39c958) {
        console['error']('Failed\x20to\x20get\x20all\x20clones:', _0x39c958['message']);
        return [];
    }
}
async function updateCloneStatus(_0x5f457c, _0x3aea7e, _0x45a45e = ![]) {
    try {
        let _0x3d8e1d = null;
        if (HAS_DB) {
            _0x3d8e1d = await _0x0_0xf46224['getSetting']('clones', _0x5f457c);
        } else {
            const _0x4e97e0 = _0x0_0x43568c['join'](process['cwd'](), 'session', 'clones');
            const _0x59ae99 = _0x0_0x43568c['join'](_0x4e97e0, _0x5f457c + '.json');
            if (_0x0_0xa60080['existsSync'](_0x59ae99)) {
                _0x3d8e1d = JSON['parse'](_0x0_0xa60080['readFileSync'](_0x59ae99, 'utf-8'));
            }
        }
        if (_0x3d8e1d) {
            _0x3d8e1d['status'] = _0x3aea7e;
            _0x3d8e1d['expired'] = _0x45a45e;
            _0x3d8e1d['updatedAt'] = Date['now']();
            if (HAS_DB) {
                await _0x0_0xf46224['saveSetting']('clones', _0x5f457c, _0x3d8e1d);
            } else {
                const _0x49b4da = _0x0_0x43568c['join'](process['cwd'](), 'session', 'clones');
                const _0x2ce835 = _0x0_0x43568c['join'](_0x49b4da, _0x5f457c + '.json');
                _0x0_0xa60080['writeFileSync'](_0x2ce835, JSON['stringify'](_0x3d8e1d, null, 0x2));
            }
        }
    } catch (_0x21c39c) {
        console['error']('Failed\x20to\x20update\x20clone\x20status\x20' + _0x5f457c + ':', _0x21c39c['message']);
    }
}
export async function getCloneByPhoneNumber(_0x570414) {
    const _0x100a9e = await getAllClonesFromMainDB();
    return _0x100a9e['filter'](_0x57bc1 => _0x57bc1['phoneNumber'] === _0x570414);
}
export async function deleteCloneFromMainDB(_0x306b05) {
    try {
        if (HAS_DB) {
            await _0x0_0xf46224['saveSetting']('clones', _0x306b05, null);
        } else {
            const _0xb03ef1 = _0x0_0x43568c['join'](process['cwd'](), 'session', 'clones');
            const _0x56e45a = _0x0_0x43568c['join'](_0xb03ef1, _0x306b05 + '.json');
            if (_0x0_0xa60080['existsSync'](_0x56e45a)) {
                _0x0_0xa60080['unlinkSync'](_0x56e45a);
            }
        }
        console['log']('✅\x20[Clone\x20' + _0x306b05 + ']\x20Removed\x20from\x20main\x20database');
        return !![];
    } catch (_0x4e8c3e) {
        console['error']('Failed\x20to\x20delete\x20clone\x20' + _0x306b05 + ':', _0x4e8c3e['message']);
        return ![];
    }
}
export async function startClone(_0x2983d0, _0x3a2d3a, _0x327fa3, _0x3d0163, _0x73f9ca, _0x471f93, _0x512986, _0x8debad) {
    try {
        const {
            state: _0x8663a4,
            saveCreds: _0x280d5d
        } = await useMultiFileAuthState(_0x2983d0);
        const {version: _0x5ce349} = await fetchLatestBaileysVersion();
        const _0x1b5645 = new _0x0_0x197a77();
        const _0x17b128 = _0x0_0x13cc28({
            'version': _0x5ce349,
            'logger': _0x0_0x1903b8({ 'level': 'silent' }),
            'printQRInTerminal': ![],
            'browser': Browsers['macOS']('Chrome'),
            'auth': {
                'creds': _0x8663a4['creds'],
                'keys': makeCacheableSignalKeyStore(_0x8663a4['keys'], _0x0_0x1903b8({ 'level': 'fatal' }))
            },
            'markOnlineOnConnect': !![],
            'msgRetryCounterCache': _0x1b5645,
            'connectTimeoutMs': 0x1d4c0,
            'defaultQueryTimeoutMs': 0x0,
            'keepAliveIntervalMs': 0x7530,
            'mobile': ![]
        });
        let _0x2f1081 = null;
        if (!_0x17b128['authState']['creds']['registered']) {
            await new Promise(_0x14f34c => setTimeout(_0x14f34c, 0x1770));
            try {
                let _0x1b7af4 = await _0x17b128['requestPairingCode'](_0x3a2d3a);
                _0x2f1081 = _0x1b7af4?.['match'](/.{1,4}/g)?.['join']('-') || _0x1b7af4;
                await saveCloneToMainDB(_0x327fa3, _0x3a2d3a, _0x73f9ca || 'local', _0x3d0163, 'pairing', _0x471f93);
            } catch (_0x143f55) {
                console['error']('Pairing\x20Error:', _0x143f55);
                throw new Error('Failed\x20to\x20get\x20pairing\x20code:\x20' + _0x143f55['message']);
            }
        }
        _0x17b128['ev']['on']('creds.update', async () => {
            await _0x280d5d();
            try {
                const _0x556cde = JSON['parse'](_0x0_0xa60080['readFileSync'](_0x0_0x43568c['join'](_0x2983d0, 'creds.json'), 'utf-8'));
                await saveCloneToMainDB(_0x327fa3, _0x3a2d3a, _0x73f9ca || 'local', _0x3d0163, 'active', _0x471f93);
            } catch (_0x5f0148) {
                console['error']('Creds\x20save\x20error:', _0x5f0148['message']);
            }
        });
        _0x17b128['ev']['on']('connection.update', async _0x2a10a5 => {
            const {
                connection: _0x116aca,
                lastDisconnect: _0x33113e
            } = _0x2a10a5;
            if (_0x116aca === 'open') {
                global['conns']['push'](_0x17b128);
                await saveCloneToMainDB(_0x327fa3, _0x3a2d3a, _0x73f9ca || 'local', _0x3d0163, 'online', _0x471f93);
                if (_0x512986) {
                    await _0x512986(_0x17b128, _0x327fa3, _0x3a2d3a);
                }
            }
            if (_0x116aca === 'close') {
                const _0x82c523 = _0x33113e?.['error']?.['output']?.['statusCode'];
                if (_0x82c523 !== DisconnectReason['loggedOut']) {
                    console['log']('🔄\x20[Clone\x20' + _0x327fa3 + ']\x20Reconnecting...');
                    setTimeout(() => startClone(_0x2983d0, _0x3a2d3a, _0x327fa3, _0x3d0163, _0x73f9ca, _0x471f93, _0x512986, _0x8debad), 0x1388);
                } else {
                    await saveCloneToMainDB(_0x327fa3, _0x3a2d3a, _0x73f9ca || 'local', _0x3d0163, 'offline', _0x471f93);
                    const _0x549007 = global['conns']['indexOf'](_0x17b128);
                    if (_0x549007 > -0x1)
                        global['conns']['splice'](_0x549007, 0x1);
                    if (_0x8debad) {
                        await _0x8debad(_0x17b128, _0x327fa3, _0x3a2d3a);
                    }
                }
            }
        });
        try {
            const {handleMessages: _0x13286d} = await import('./messageHandler.js');
            _0x17b128['ev']['on']('messages.upsert', async _0x49486c => {
                await _0x13286d(_0x17b128, _0x49486c);
            });
        } catch (_0x1b17e7) {
            console['error']('Handler\x20linkage\x20failed:', _0x1b17e7['message']);
        }
        return {
            'conn': _0x17b128,
            'pairingCode': _0x2f1081
        };
    } catch (_0x2c36da) {
        console['error']('Failed\x20to\x20start\x20clone\x20' + _0x327fa3 + ':', _0x2c36da['message']);
        throw _0x2c36da;
    }
}
export async function deleteClone(_0xde251a) {
    try {
        const _0x14ac23 = global['conns']['findIndex'](_0x2aa820 => {
            try {
                return _0x2aa820['authState']?.['creds']?.['me']?.['id']?.['includes'](_0xde251a) || _0x2aa820['user']?.['id']?.['includes'](_0xde251a);
            } catch (_0x1846d5) {
                return ![];
            }
        });
        if (_0x14ac23 > -0x1) {
            try {
                await global['conns'][_0x14ac23]['end']();
                global['conns']['splice'](_0x14ac23, 0x1);
                console['log']('✅\x20[Clone\x20' + _0xde251a + ']\x20Disconnected');
            } catch (_0x599ed9) {
                console['error']('Failed\x20to\x20disconnect\x20clone\x20' + _0xde251a + ':', _0x599ed9['message']);
            }
        }
        await deleteCloneFromMainDB(_0xde251a);
        const _0x370294 = _0x0_0x43568c['join'](process['cwd'](), 'session', 'clones', _0xde251a);
        if (_0x0_0xa60080['existsSync'](_0x370294)) {
            _0x0_0xa60080['rmSync'](_0x370294, {
                'recursive': !![],
                'force': !![]
            });
        }
        return { 'success': !![] };
    } catch (_0x3c1999) {
        console['error']('Failed\x20to\x20delete\x20clone\x20' + _0xde251a + ':', _0x3c1999['message']);
        return {
            'success': ![],
            'error': _0x3c1999['message']
        };
    }
}
export async function checkAndCleanExpiredClones() {
    try {
        const _0x2c8452 = await getAllClonesFromMainDB();
        const _0x41bbd4 = Date['now']();
        let _0x3b92b1 = 0x0;
        for (const _0x36368c of _0x2c8452) {
            if (_0x36368c['expiresAt'] && _0x36368c['expiresAt'] < _0x41bbd4 && !_0x36368c['expired']) {
                console['log']('🧹\x20Cleaning\x20expired\x20clone:\x20' + _0x36368c['authId'] + '\x20(' + _0x36368c['phoneNumber'] + ')');
                await deleteClone(_0x36368c['authId']);
                _0x3b92b1++;
            }
        }
        if (_0x3b92b1 > 0x0) {
            console['log']('✅\x20Cleaned\x20' + _0x3b92b1 + '\x20expired\x20clones');
        }
        return _0x3b92b1;
    } catch (_0x26f495) {
        console['error']('Failed\x20to\x20check\x20expired\x20clones:', _0x26f495['message']);
        return 0x0;
    }
}
export async function isCloneOwner(_0x32a4e0, _0x5c6a13) {
    try {
        const _0x16ef61 = await getAllClonesFromMainDB();
        const _0x2b85d0 = _0x16ef61['find'](_0xee33de => _0xee33de['authId'] === _0x5c6a13);
        if (!_0x2b85d0)
            return ![];
        const _0x4c7d5c = _0x32a4e0['split']('@')[0x0];
        return _0x2b85d0['phoneNumber'] === _0x4c7d5c;
    } catch (_0x1d2fef) {
        console['error']('Check\x20clone\x20owner\x20error:', _0x1d2fef['message']);
        return ![];
    }
}