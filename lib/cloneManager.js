import _0x0_0x4586c9, {
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    Browsers
} from '@whiskeysockets/baileys';
import _0x0_0x146613 from 'node-cache';
import _0x0_0x224b47 from 'pino';
import _0x0_0x4815b4 from 'fs';
import _0x0_0x270966, { dirname } from 'path';
import { fileURLToPath } from 'url';
import _0x0_0x1c8118 from './lightweight_store.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
if (!global['conns'])
    global['conns'] = [];
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL);
export function generateSessionId(_0x155849 = 0x6, _0x2ea5dc = 0x4) {
    const _0x472a1a = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let _0x57447f = '';
    for (let _0x26de08 = 0x0; _0x26de08 < _0x155849; _0x26de08++) {
        _0x57447f += _0x472a1a['charAt'](Math['floor'](Math['random']() * _0x472a1a['length']));
    }
    const _0x409d7a = String(Math['floor'](Math['random']() * Math['pow'](0xa, _0x2ea5dc)))['padStart'](_0x2ea5dc, '0');
    return 'NOVA' + _0x57447f + _0x409d7a;
}
export async function saveCloneToMainDB(_0x2e5432, _0x465826, _0x1064d1, _0x9fb5ba, _0x1a2b99, _0x11a1a2 = null) {
    try {
        let _0x8452f = null;
        if (_0x11a1a2 && _0x11a1a2 > 0x0) {
            _0x8452f = Date['now']() + _0x11a1a2 * 0x18 * 0x3c * 0x3c * 0x3e8;
        }
        const _0x539e7d = {
            'phoneNumber': _0x465826,
            'dbUrl': _0x1064d1 || 'local',
            'dbType': _0x9fb5ba || 'local',
            'status': _0x1a2b99 || 'configured',
            'createdAt': Date['now'](),
            'updatedAt': Date['now'](),
            'expiryDays': _0x11a1a2 || null,
            'expiresAt': _0x8452f,
            'expired': ![]
        };
        if (HAS_DB) {
            await _0x0_0x1c8118['saveSetting']('clones', _0x2e5432, _0x539e7d);
            console['log']('✅\x20[Clone\x20' + _0x2e5432 + ']\x20Saved\x20to\x20main\x20database' + (_0x11a1a2 ? '\x20(expires\x20in\x20' + _0x11a1a2 + '\x20days)' : ''));
        } else {
            const _0x27b3b4 = _0x0_0x270966['join'](process['cwd'](), 'session', 'clones');
            if (!_0x0_0x4815b4['existsSync'](_0x27b3b4)) {
                _0x0_0x4815b4['mkdirSync'](_0x27b3b4, { 'recursive': !![] });
            }
            _0x0_0x4815b4['writeFileSync'](_0x0_0x270966['join'](_0x27b3b4, _0x2e5432 + '.json'), JSON['stringify'](_0x539e7d, null, 0x2));
            console['log']('✅\x20[Clone\x20' + _0x2e5432 + ']\x20Saved\x20locally' + (_0x11a1a2 ? '\x20(expires\x20in\x20' + _0x11a1a2 + '\x20days)' : ''));
        }
        return !![];
    } catch (_0x4e9874) {
        console['error']('❌\x20Failed\x20to\x20save\x20clone\x20' + _0x2e5432 + ':', _0x4e9874['message']);
        return ![];
    }
}
export async function getAllClonesFromMainDB() {
    try {
        let _0x20a1ac = [];
        if (HAS_DB) {
            const _0x5f4660 = await _0x0_0x1c8118['getSetting']('clones', 'all') || {};
            _0x20a1ac = Object['entries'](_0x5f4660)['map'](([_0x286644, _0x23faa1]) => ({
                'authId': _0x286644,
                'phoneNumber': _0x23faa1['phoneNumber'],
                'dbType': _0x23faa1['dbType'] || 'local',
                'status': _0x23faa1['status'] || 'unknown',
                'createdAt': _0x23faa1['createdAt'],
                'updatedAt': _0x23faa1['updatedAt'],
                'expiryDays': _0x23faa1['expiryDays'] || null,
                'expiresAt': _0x23faa1['expiresAt'] || null,
                'expired': _0x23faa1['expired'] || ![]
            }));
        } else {
            const _0x302ce4 = _0x0_0x270966['join'](process['cwd'](), 'session', 'clones');
            if (!_0x0_0x4815b4['existsSync'](_0x302ce4))
                return [];
            const _0x2cd459 = _0x0_0x4815b4['readdirSync'](_0x302ce4)['filter'](_0x3e3b9c => _0x3e3b9c['endsWith']('.json'));
            for (const _0x3fdc76 of _0x2cd459) {
                const _0x147b82 = _0x3fdc76['replace']('.json', '');
                const _0x42710f = JSON['parse'](_0x0_0x4815b4['readFileSync'](_0x0_0x270966['join'](_0x302ce4, _0x3fdc76), 'utf-8'));
                _0x20a1ac['push']({
                    'authId': _0x147b82,
                    'phoneNumber': _0x42710f['phoneNumber'],
                    'dbType': _0x42710f['dbType'] || 'local',
                    'status': _0x42710f['status'] || 'unknown',
                    'createdAt': _0x42710f['createdAt'],
                    'updatedAt': _0x42710f['updatedAt'],
                    'expiryDays': _0x42710f['expiryDays'] || null,
                    'expiresAt': _0x42710f['expiresAt'] || null,
                    'expired': _0x42710f['expired'] || ![]
                });
            }
        }
        const _0x55d8d3 = Date['now']();
        for (const _0x12e07e of _0x20a1ac) {
            if (_0x12e07e['expiresAt'] && _0x12e07e['expiresAt'] < _0x55d8d3 && !_0x12e07e['expired']) {
                _0x12e07e['expired'] = !![];
                _0x12e07e['status'] = 'expired';
                await updateCloneStatus(_0x12e07e['authId'], 'expired', !![]);
            }
        }
        return _0x20a1ac;
    } catch (_0x2ed97d) {
        console['error']('Failed\x20to\x20get\x20all\x20clones:', _0x2ed97d['message']);
        return [];
    }
}
async function updateCloneStatus(_0x21a3f5, _0x2558a5, _0x30414b = ![]) {
    try {
        let _0x2b37e9 = null;
        if (HAS_DB) {
            _0x2b37e9 = await _0x0_0x1c8118['getSetting']('clones', _0x21a3f5);
        } else {
            const _0x4eb82c = _0x0_0x270966['join'](process['cwd'](), 'session', 'clones');
            const _0x227ee8 = _0x0_0x270966['join'](_0x4eb82c, _0x21a3f5 + '.json');
            if (_0x0_0x4815b4['existsSync'](_0x227ee8)) {
                _0x2b37e9 = JSON['parse'](_0x0_0x4815b4['readFileSync'](_0x227ee8, 'utf-8'));
            }
        }
        if (_0x2b37e9) {
            _0x2b37e9['status'] = _0x2558a5;
            _0x2b37e9['expired'] = _0x30414b;
            _0x2b37e9['updatedAt'] = Date['now']();
            if (HAS_DB) {
                await _0x0_0x1c8118['saveSetting']('clones', _0x21a3f5, _0x2b37e9);
            } else {
                const _0x53caa3 = _0x0_0x270966['join'](process['cwd'](), 'session', 'clones');
                const _0xc2c3fa = _0x0_0x270966['join'](_0x53caa3, _0x21a3f5 + '.json');
                _0x0_0x4815b4['writeFileSync'](_0xc2c3fa, JSON['stringify'](_0x2b37e9, null, 0x2));
            }
        }
    } catch (_0x4ad43f) {
        console['error']('Failed\x20to\x20update\x20clone\x20status\x20' + _0x21a3f5 + ':', _0x4ad43f['message']);
    }
}
export async function getCloneByPhoneNumber(_0xdb7bca) {
    const _0x314671 = await getAllClonesFromMainDB();
    return _0x314671['filter'](_0x5b6bce => _0x5b6bce['phoneNumber'] === _0xdb7bca);
}
export async function deleteCloneFromMainDB(_0x49cd27) {
    try {
        if (HAS_DB) {
            await _0x0_0x1c8118['saveSetting']('clones', _0x49cd27, null);
        } else {
            const _0x563546 = _0x0_0x270966['join'](process['cwd'](), 'session', 'clones');
            const _0x33432f = _0x0_0x270966['join'](_0x563546, _0x49cd27 + '.json');
            if (_0x0_0x4815b4['existsSync'](_0x33432f)) {
                _0x0_0x4815b4['unlinkSync'](_0x33432f);
            }
        }
        console['log']('✅\x20[Clone\x20' + _0x49cd27 + ']\x20Removed\x20from\x20main\x20database');
        return !![];
    } catch (_0x29a503) {
        console['error']('Failed\x20to\x20delete\x20clone\x20' + _0x49cd27 + ':', _0x29a503['message']);
        return ![];
    }
}
export async function startClone(_0x1b9294, _0x460bd8, _0x3da639, _0x672476, _0x28fc1a, _0x33788b, _0xeb72bc, _0x342aba) {
    try {
        const {
            state: _0x14c494,
            saveCreds: _0xf2fe31
        } = await useMultiFileAuthState(_0x1b9294);
        const {version: _0x37d97c} = await fetchLatestBaileysVersion();
        const _0x634e5f = new _0x0_0x146613();
        const _0x1071f4 = _0x0_0x4586c9({
            'version': _0x37d97c,
            'logger': _0x0_0x224b47({ 'level': 'silent' }),
            'printQRInTerminal': ![],
            'browser': Browsers['macOS']('Chrome'),
            'auth': {
                'creds': _0x14c494['creds'],
                'keys': makeCacheableSignalKeyStore(_0x14c494['keys'], _0x0_0x224b47({ 'level': 'fatal' }))
            },
            'markOnlineOnConnect': !![],
            'msgRetryCounterCache': _0x634e5f,
            'connectTimeoutMs': 0x1d4c0,
            'defaultQueryTimeoutMs': 0x0,
            'keepAliveIntervalMs': 0x7530,
            'mobile': ![]
        });
        let _0x23b9dc = null;
        if (!_0x1071f4['authState']['creds']['registered']) {
            await new Promise(_0x4b9a42 => setTimeout(_0x4b9a42, 0x1770));
            try {
                let _0x48a70c = await _0x1071f4['requestPairingCode'](_0x460bd8);
                _0x23b9dc = _0x48a70c?.['match'](/.{1,4}/g)?.['join']('-') || _0x48a70c;
                await saveCloneToMainDB(_0x3da639, _0x460bd8, _0x28fc1a || 'local', _0x672476, 'pairing', _0x33788b);
            } catch (_0x2920c8) {
                console['error']('Pairing\x20Error:', _0x2920c8);
                throw new Error('Failed\x20to\x20get\x20pairing\x20code:\x20' + _0x2920c8['message']);
            }
        }
        _0x1071f4['ev']['on']('creds.update', async () => {
            await _0xf2fe31();
            try {
                const _0x81d076 = JSON['parse'](_0x0_0x4815b4['readFileSync'](_0x0_0x270966['join'](_0x1b9294, 'creds.json'), 'utf-8'));
                await saveCloneToMainDB(_0x3da639, _0x460bd8, _0x28fc1a || 'local', _0x672476, 'active', _0x33788b);
            } catch (_0x17fe9a) {
                console['error']('Creds\x20save\x20error:', _0x17fe9a['message']);
            }
        });
        _0x1071f4['ev']['on']('connection.update', async _0x437777 => {
            const {
                connection: _0xaf7a10,
                lastDisconnect: _0x3c31a8
            } = _0x437777;
            if (_0xaf7a10 === 'open') {
                global['conns']['push'](_0x1071f4);
                await saveCloneToMainDB(_0x3da639, _0x460bd8, _0x28fc1a || 'local', _0x672476, 'online', _0x33788b);
                if (_0xeb72bc) {
                    await _0xeb72bc(_0x1071f4, _0x3da639, _0x460bd8);
                }
            }
            if (_0xaf7a10 === 'close') {
                const _0x282499 = _0x3c31a8?.['error']?.['output']?.['statusCode'];
                if (_0x282499 !== DisconnectReason['loggedOut']) {
                    console['log']('🔄\x20[Clone\x20' + _0x3da639 + ']\x20Reconnecting...');
                    setTimeout(() => startClone(_0x1b9294, _0x460bd8, _0x3da639, _0x672476, _0x28fc1a, _0x33788b, _0xeb72bc, _0x342aba), 0x1388);
                } else {
                    await saveCloneToMainDB(_0x3da639, _0x460bd8, _0x28fc1a || 'local', _0x672476, 'offline', _0x33788b);
                    const _0x25edb7 = global['conns']['indexOf'](_0x1071f4);
                    if (_0x25edb7 > -0x1)
                        global['conns']['splice'](_0x25edb7, 0x1);
                    if (_0x342aba) {
                        await _0x342aba(_0x1071f4, _0x3da639, _0x460bd8);
                    }
                }
            }
        });
        try {
            const {handleMessages: _0x219e1f} = await import('./messageHandler.js');
            _0x1071f4['ev']['on']('messages.upsert', async _0xabf828 => {
                await _0x219e1f(_0x1071f4, _0xabf828);
            });
        } catch (_0x3507aa) {
            console['error']('Handler\x20linkage\x20failed:', _0x3507aa['message']);
        }
        return {
            'conn': _0x1071f4,
            'pairingCode': _0x23b9dc
        };
    } catch (_0x2f7f21) {
        console['error']('Failed\x20to\x20start\x20clone\x20' + _0x3da639 + ':', _0x2f7f21['message']);
        throw _0x2f7f21;
    }
}
export async function deleteClone(_0x576a8d) {
    try {
        const _0x38dc5a = global['conns']['findIndex'](_0x5d6dfa => {
            try {
                return _0x5d6dfa['authState']?.['creds']?.['me']?.['id']?.['includes'](_0x576a8d) || _0x5d6dfa['user']?.['id']?.['includes'](_0x576a8d);
            } catch (_0x15dfcf) {
                return ![];
            }
        });
        if (_0x38dc5a > -0x1) {
            try {
                await global['conns'][_0x38dc5a]['end']();
                global['conns']['splice'](_0x38dc5a, 0x1);
                console['log']('✅\x20[Clone\x20' + _0x576a8d + ']\x20Disconnected');
            } catch (_0x181463) {
                console['error']('Failed\x20to\x20disconnect\x20clone\x20' + _0x576a8d + ':', _0x181463['message']);
            }
        }
        await deleteCloneFromMainDB(_0x576a8d);
        const _0xd4e2af = _0x0_0x270966['join'](process['cwd'](), 'session', 'clones', _0x576a8d);
        if (_0x0_0x4815b4['existsSync'](_0xd4e2af)) {
            _0x0_0x4815b4['rmSync'](_0xd4e2af, {
                'recursive': !![],
                'force': !![]
            });
        }
        return { 'success': !![] };
    } catch (_0xafe874) {
        console['error']('Failed\x20to\x20delete\x20clone\x20' + _0x576a8d + ':', _0xafe874['message']);
        return {
            'success': ![],
            'error': _0xafe874['message']
        };
    }
}
export async function checkAndCleanExpiredClones() {
    try {
        const _0x162278 = await getAllClonesFromMainDB();
        const _0x51b6b3 = Date['now']();
        let _0x236b1b = 0x0;
        for (const _0x1917ec of _0x162278) {
            if (_0x1917ec['expiresAt'] && _0x1917ec['expiresAt'] < _0x51b6b3 && !_0x1917ec['expired']) {
                console['log']('🧹\x20Cleaning\x20expired\x20clone:\x20' + _0x1917ec['authId'] + '\x20(' + _0x1917ec['phoneNumber'] + ')');
                await deleteClone(_0x1917ec['authId']);
                _0x236b1b++;
            }
        }
        if (_0x236b1b > 0x0) {
            console['log']('✅\x20Cleaned\x20' + _0x236b1b + '\x20expired\x20clones');
        }
        return _0x236b1b;
    } catch (_0x2f5e42) {
        console['error']('Failed\x20to\x20check\x20expired\x20clones:', _0x2f5e42['message']);
        return 0x0;
    }
}
export async function isCloneOwner(_0x5a7ab5, _0x10608f) {
    try {
        const _0x1f32ce = await getAllClonesFromMainDB();
        const _0x17270a = _0x1f32ce['find'](_0x5d09d7 => _0x5d09d7['authId'] === _0x10608f);
        if (!_0x17270a)
            return ![];
        const _0x419279 = _0x5a7ab5['split']('@')[0x0];
        return _0x17270a['phoneNumber'] === _0x419279;
    } catch (_0xfc123) {
        console['error']('Check\x20clone\x20owner\x20error:', _0xfc123['message']);
        return ![];
    }
}