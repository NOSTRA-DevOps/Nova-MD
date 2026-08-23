import _0x0_0x594c7d, {
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    Browsers
} from '@whiskeysockets/baileys';
import _0x0_0x271e45 from 'node-cache';
import _0x0_0x4f733e from 'pino';
import _0x0_0x1e332b from 'fs';
import _0x0_0x231054, { dirname } from 'path';
import { fileURLToPath } from 'url';
import _0x0_0x55c4ff from './lightweight_store.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
if (!global['conns'])
    global['conns'] = [];
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL);
export function generateSessionId(_0x5c524e = 0x6, _0x454293 = 0x4) {
    const _0x640414 = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let _0x5a8439 = '';
    for (let _0x3f5950 = 0x0; _0x3f5950 < _0x5c524e; _0x3f5950++) {
        _0x5a8439 += _0x640414['charAt'](Math['floor'](Math['random']() * _0x640414['length']));
    }
    const _0x4e4578 = String(Math['floor'](Math['random']() * Math['pow'](0xa, _0x454293)))['padStart'](_0x454293, '0');
    return 'NOVA' + _0x5a8439 + _0x4e4578;
}
export async function saveCloneToMainDB(_0x4e26b5, _0x2016b2, _0x45410a, _0x48d9da, _0x504a5e, _0x479ccc = null) {
    try {
        let _0xa7b3e2 = null;
        if (_0x479ccc && _0x479ccc > 0x0) {
            _0xa7b3e2 = Date['now']() + _0x479ccc * 0x18 * 0x3c * 0x3c * 0x3e8;
        }
        const _0x3dc4ce = {
            'phoneNumber': _0x2016b2,
            'dbUrl': _0x45410a || 'local',
            'dbType': _0x48d9da || 'local',
            'status': _0x504a5e || 'configured',
            'createdAt': Date['now'](),
            'updatedAt': Date['now'](),
            'expiryDays': _0x479ccc || null,
            'expiresAt': _0xa7b3e2,
            'expired': ![]
        };
        if (HAS_DB) {
            await _0x0_0x55c4ff['saveSetting']('clones', _0x4e26b5, _0x3dc4ce);
            console['log']('✅\x20[Clone\x20' + _0x4e26b5 + ']\x20Saved\x20to\x20main\x20database' + (_0x479ccc ? '\x20(expires\x20in\x20' + _0x479ccc + '\x20days)' : ''));
        } else {
            const _0x1f8e89 = _0x0_0x231054['join'](process['cwd'](), 'session', 'clones');
            if (!_0x0_0x1e332b['existsSync'](_0x1f8e89)) {
                _0x0_0x1e332b['mkdirSync'](_0x1f8e89, { 'recursive': !![] });
            }
            _0x0_0x1e332b['writeFileSync'](_0x0_0x231054['join'](_0x1f8e89, _0x4e26b5 + '.json'), JSON['stringify'](_0x3dc4ce, null, 0x2));
            console['log']('✅\x20[Clone\x20' + _0x4e26b5 + ']\x20Saved\x20locally' + (_0x479ccc ? '\x20(expires\x20in\x20' + _0x479ccc + '\x20days)' : ''));
        }
        return !![];
    } catch (_0x236e34) {
        console['error']('❌\x20Failed\x20to\x20save\x20clone\x20' + _0x4e26b5 + ':', _0x236e34['message']);
        return ![];
    }
}
export async function getAllClonesFromMainDB() {
    try {
        let _0xcd9511 = [];
        if (HAS_DB) {
            const _0x7db8dd = await _0x0_0x55c4ff['getSetting']('clones', 'all') || {};
            _0xcd9511 = Object['entries'](_0x7db8dd)['map'](([_0x36ab2e, _0x2aa496]) => ({
                'authId': _0x36ab2e,
                'phoneNumber': _0x2aa496['phoneNumber'],
                'dbType': _0x2aa496['dbType'] || 'local',
                'status': _0x2aa496['status'] || 'unknown',
                'createdAt': _0x2aa496['createdAt'],
                'updatedAt': _0x2aa496['updatedAt'],
                'expiryDays': _0x2aa496['expiryDays'] || null,
                'expiresAt': _0x2aa496['expiresAt'] || null,
                'expired': _0x2aa496['expired'] || ![]
            }));
        } else {
            const _0x58f9d3 = _0x0_0x231054['join'](process['cwd'](), 'session', 'clones');
            if (!_0x0_0x1e332b['existsSync'](_0x58f9d3))
                return [];
            const _0x43d63e = _0x0_0x1e332b['readdirSync'](_0x58f9d3)['filter'](_0x293a26 => _0x293a26['endsWith']('.json'));
            for (const _0x2890e3 of _0x43d63e) {
                const _0x44a7e2 = _0x2890e3['replace']('.json', '');
                const _0x91050f = JSON['parse'](_0x0_0x1e332b['readFileSync'](_0x0_0x231054['join'](_0x58f9d3, _0x2890e3), 'utf-8'));
                _0xcd9511['push']({
                    'authId': _0x44a7e2,
                    'phoneNumber': _0x91050f['phoneNumber'],
                    'dbType': _0x91050f['dbType'] || 'local',
                    'status': _0x91050f['status'] || 'unknown',
                    'createdAt': _0x91050f['createdAt'],
                    'updatedAt': _0x91050f['updatedAt'],
                    'expiryDays': _0x91050f['expiryDays'] || null,
                    'expiresAt': _0x91050f['expiresAt'] || null,
                    'expired': _0x91050f['expired'] || ![]
                });
            }
        }
        const _0xab1c42 = Date['now']();
        for (const _0xc7117d of _0xcd9511) {
            if (_0xc7117d['expiresAt'] && _0xc7117d['expiresAt'] < _0xab1c42 && !_0xc7117d['expired']) {
                _0xc7117d['expired'] = !![];
                _0xc7117d['status'] = 'expired';
                await updateCloneStatus(_0xc7117d['authId'], 'expired', !![]);
            }
        }
        return _0xcd9511;
    } catch (_0x1b43a9) {
        console['error']('Failed\x20to\x20get\x20all\x20clones:', _0x1b43a9['message']);
        return [];
    }
}
async function updateCloneStatus(_0x509d49, _0x27c269, _0x17ba20 = ![]) {
    try {
        let _0xeed5d6 = null;
        if (HAS_DB) {
            _0xeed5d6 = await _0x0_0x55c4ff['getSetting']('clones', _0x509d49);
        } else {
            const _0x23cd5f = _0x0_0x231054['join'](process['cwd'](), 'session', 'clones');
            const _0x5bec4e = _0x0_0x231054['join'](_0x23cd5f, _0x509d49 + '.json');
            if (_0x0_0x1e332b['existsSync'](_0x5bec4e)) {
                _0xeed5d6 = JSON['parse'](_0x0_0x1e332b['readFileSync'](_0x5bec4e, 'utf-8'));
            }
        }
        if (_0xeed5d6) {
            _0xeed5d6['status'] = _0x27c269;
            _0xeed5d6['expired'] = _0x17ba20;
            _0xeed5d6['updatedAt'] = Date['now']();
            if (HAS_DB) {
                await _0x0_0x55c4ff['saveSetting']('clones', _0x509d49, _0xeed5d6);
            } else {
                const _0x2e03f5 = _0x0_0x231054['join'](process['cwd'](), 'session', 'clones');
                const _0x1b9aa6 = _0x0_0x231054['join'](_0x2e03f5, _0x509d49 + '.json');
                _0x0_0x1e332b['writeFileSync'](_0x1b9aa6, JSON['stringify'](_0xeed5d6, null, 0x2));
            }
        }
    } catch (_0xedd859) {
        console['error']('Failed\x20to\x20update\x20clone\x20status\x20' + _0x509d49 + ':', _0xedd859['message']);
    }
}
export async function getCloneByPhoneNumber(_0x2c0e25) {
    const _0x106676 = await getAllClonesFromMainDB();
    return _0x106676['filter'](_0x4e7c89 => _0x4e7c89['phoneNumber'] === _0x2c0e25);
}
export async function deleteCloneFromMainDB(_0x1834e7) {
    try {
        if (HAS_DB) {
            await _0x0_0x55c4ff['saveSetting']('clones', _0x1834e7, null);
        } else {
            const _0x4b2cd2 = _0x0_0x231054['join'](process['cwd'](), 'session', 'clones');
            const _0x416c9e = _0x0_0x231054['join'](_0x4b2cd2, _0x1834e7 + '.json');
            if (_0x0_0x1e332b['existsSync'](_0x416c9e)) {
                _0x0_0x1e332b['unlinkSync'](_0x416c9e);
            }
        }
        console['log']('✅\x20[Clone\x20' + _0x1834e7 + ']\x20Removed\x20from\x20main\x20database');
        return !![];
    } catch (_0x39d7f4) {
        console['error']('Failed\x20to\x20delete\x20clone\x20' + _0x1834e7 + ':', _0x39d7f4['message']);
        return ![];
    }
}
export async function startClone(_0x496c01, _0x20388, _0x31ecde, _0x5092fc, _0x5a473e, _0x45f202, _0x4c91c5, _0x224432) {
    try {
        const {
            state: _0x4ee335,
            saveCreds: _0x404e40
        } = await useMultiFileAuthState(_0x496c01);
        const {version: _0xa589d} = await fetchLatestBaileysVersion();
        const _0x1677d2 = new _0x0_0x271e45();
        const _0x5cb98e = _0x0_0x594c7d({
            'version': _0xa589d,
            'logger': _0x0_0x4f733e({ 'level': 'silent' }),
            'printQRInTerminal': ![],
            'browser': Browsers['macOS']('Chrome'),
            'auth': {
                'creds': _0x4ee335['creds'],
                'keys': makeCacheableSignalKeyStore(_0x4ee335['keys'], _0x0_0x4f733e({ 'level': 'fatal' }))
            },
            'markOnlineOnConnect': !![],
            'msgRetryCounterCache': _0x1677d2,
            'connectTimeoutMs': 0x1d4c0,
            'defaultQueryTimeoutMs': 0x0,
            'keepAliveIntervalMs': 0x7530,
            'mobile': ![]
        });
        let _0x19ddc0 = null;
        if (!_0x5cb98e['authState']['creds']['registered']) {
            await new Promise(_0x4ca70d => setTimeout(_0x4ca70d, 0x1770));
            try {
                let _0x25f337 = await _0x5cb98e['requestPairingCode'](_0x20388);
                _0x19ddc0 = _0x25f337?.['match'](/.{1,4}/g)?.['join']('-') || _0x25f337;
                await saveCloneToMainDB(_0x31ecde, _0x20388, _0x5a473e || 'local', _0x5092fc, 'pairing', _0x45f202);
            } catch (_0x53493f) {
                console['error']('Pairing\x20Error:', _0x53493f);
                throw new Error('Failed\x20to\x20get\x20pairing\x20code:\x20' + _0x53493f['message']);
            }
        }
        _0x5cb98e['ev']['on']('creds.update', async () => {
            await _0x404e40();
            try {
                const _0xa6e4d6 = JSON['parse'](_0x0_0x1e332b['readFileSync'](_0x0_0x231054['join'](_0x496c01, 'creds.json'), 'utf-8'));
                await saveCloneToMainDB(_0x31ecde, _0x20388, _0x5a473e || 'local', _0x5092fc, 'active', _0x45f202);
            } catch (_0x4f8452) {
                console['error']('Creds\x20save\x20error:', _0x4f8452['message']);
            }
        });
        _0x5cb98e['ev']['on']('connection.update', async _0x58dbb6 => {
            const {
                connection: _0x59575a,
                lastDisconnect: _0x546494
            } = _0x58dbb6;
            if (_0x59575a === 'open') {
                global['conns']['push'](_0x5cb98e);
                await saveCloneToMainDB(_0x31ecde, _0x20388, _0x5a473e || 'local', _0x5092fc, 'online', _0x45f202);
                if (_0x4c91c5) {
                    await _0x4c91c5(_0x5cb98e, _0x31ecde, _0x20388);
                }
            }
            if (_0x59575a === 'close') {
                const _0x2ea57c = _0x546494?.['error']?.['output']?.['statusCode'];
                if (_0x2ea57c !== DisconnectReason['loggedOut']) {
                    console['log']('🔄\x20[Clone\x20' + _0x31ecde + ']\x20Reconnecting...');
                    setTimeout(() => startClone(_0x496c01, _0x20388, _0x31ecde, _0x5092fc, _0x5a473e, _0x45f202, _0x4c91c5, _0x224432), 0x1388);
                } else {
                    await saveCloneToMainDB(_0x31ecde, _0x20388, _0x5a473e || 'local', _0x5092fc, 'offline', _0x45f202);
                    const _0x58e1a6 = global['conns']['indexOf'](_0x5cb98e);
                    if (_0x58e1a6 > -0x1)
                        global['conns']['splice'](_0x58e1a6, 0x1);
                    if (_0x224432) {
                        await _0x224432(_0x5cb98e, _0x31ecde, _0x20388);
                    }
                }
            }
        });
        try {
            const {handleMessages: _0x20f77f} = await import('./messageHandler.js');
            _0x5cb98e['ev']['on']('messages.upsert', async _0x18dda8 => {
                await _0x20f77f(_0x5cb98e, _0x18dda8);
            });
        } catch (_0x10b823) {
            console['error']('Handler\x20linkage\x20failed:', _0x10b823['message']);
        }
        return {
            'conn': _0x5cb98e,
            'pairingCode': _0x19ddc0
        };
    } catch (_0x289b6f) {
        console['error']('Failed\x20to\x20start\x20clone\x20' + _0x31ecde + ':', _0x289b6f['message']);
        throw _0x289b6f;
    }
}
export async function deleteClone(_0x3bfc1b) {
    try {
        const _0x19d719 = global['conns']['findIndex'](_0x428360 => {
            try {
                return _0x428360['authState']?.['creds']?.['me']?.['id']?.['includes'](_0x3bfc1b) || _0x428360['user']?.['id']?.['includes'](_0x3bfc1b);
            } catch (_0x4d99f3) {
                return ![];
            }
        });
        if (_0x19d719 > -0x1) {
            try {
                await global['conns'][_0x19d719]['end']();
                global['conns']['splice'](_0x19d719, 0x1);
                console['log']('✅\x20[Clone\x20' + _0x3bfc1b + ']\x20Disconnected');
            } catch (_0x4ddf64) {
                console['error']('Failed\x20to\x20disconnect\x20clone\x20' + _0x3bfc1b + ':', _0x4ddf64['message']);
            }
        }
        await deleteCloneFromMainDB(_0x3bfc1b);
        const _0x35bf82 = _0x0_0x231054['join'](process['cwd'](), 'session', 'clones', _0x3bfc1b);
        if (_0x0_0x1e332b['existsSync'](_0x35bf82)) {
            _0x0_0x1e332b['rmSync'](_0x35bf82, {
                'recursive': !![],
                'force': !![]
            });
        }
        return { 'success': !![] };
    } catch (_0x26238a) {
        console['error']('Failed\x20to\x20delete\x20clone\x20' + _0x3bfc1b + ':', _0x26238a['message']);
        return {
            'success': ![],
            'error': _0x26238a['message']
        };
    }
}
export async function checkAndCleanExpiredClones() {
    try {
        const _0xacfaf0 = await getAllClonesFromMainDB();
        const _0xb7971 = Date['now']();
        let _0x49a9f6 = 0x0;
        for (const _0x2dcd43 of _0xacfaf0) {
            if (_0x2dcd43['expiresAt'] && _0x2dcd43['expiresAt'] < _0xb7971 && !_0x2dcd43['expired']) {
                console['log']('🧹\x20Cleaning\x20expired\x20clone:\x20' + _0x2dcd43['authId'] + '\x20(' + _0x2dcd43['phoneNumber'] + ')');
                await deleteClone(_0x2dcd43['authId']);
                _0x49a9f6++;
            }
        }
        if (_0x49a9f6 > 0x0) {
            console['log']('✅\x20Cleaned\x20' + _0x49a9f6 + '\x20expired\x20clones');
        }
        return _0x49a9f6;
    } catch (_0x268b9d) {
        console['error']('Failed\x20to\x20check\x20expired\x20clones:', _0x268b9d['message']);
        return 0x0;
    }
}
export async function isCloneOwner(_0x39c3c9, _0x2fbcf3) {
    try {
        const _0x2ca704 = await getAllClonesFromMainDB();
        const _0x598abc = _0x2ca704['find'](_0x55a746 => _0x55a746['authId'] === _0x2fbcf3);
        if (!_0x598abc)
            return ![];
        const _0x220eb8 = _0x39c3c9['split']('@')[0x0];
        return _0x598abc['phoneNumber'] === _0x220eb8;
    } catch (_0x364492) {
        console['error']('Check\x20clone\x20owner\x20error:', _0x364492['message']);
        return ![];
    }
}