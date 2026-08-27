import _0x0_0x3b2604, {
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    Browsers
} from '@whiskeysockets/baileys';
import _0x0_0x20632a from 'node-cache';
import _0x0_0x24395b from 'pino';
import _0x0_0x1dc5a0 from 'fs';
import _0x0_0x45e0b7, { dirname } from 'path';
import { fileURLToPath } from 'url';
import _0x0_0x575ba2 from './lightweight_store.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
if (!global['conns'])
    global['conns'] = [];
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL);
export function generateSessionId(_0x5b9f95 = 0x6, _0x10d947 = 0x4) {
    const _0x2fb8b1 = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let _0x97c9d2 = '';
    for (let _0xcd972b = 0x0; _0xcd972b < _0x5b9f95; _0xcd972b++) {
        _0x97c9d2 += _0x2fb8b1['charAt'](Math['floor'](Math['random']() * _0x2fb8b1['length']));
    }
    const _0x3220e0 = String(Math['floor'](Math['random']() * Math['pow'](0xa, _0x10d947)))['padStart'](_0x10d947, '0');
    return 'NOVA' + _0x97c9d2 + _0x3220e0;
}
export async function saveCloneToMainDB(_0x42d04f, _0x3c8a72, _0x4fcf2f, _0x436dbf, _0x534745, _0x43b359 = null) {
    try {
        let _0x19f4fc = null;
        if (_0x43b359 && _0x43b359 > 0x0) {
            _0x19f4fc = Date['now']() + _0x43b359 * 0x18 * 0x3c * 0x3c * 0x3e8;
        }
        const _0x5d0346 = {
            'phoneNumber': _0x3c8a72,
            'dbUrl': _0x4fcf2f || 'local',
            'dbType': _0x436dbf || 'local',
            'status': _0x534745 || 'configured',
            'createdAt': Date['now'](),
            'updatedAt': Date['now'](),
            'expiryDays': _0x43b359 || null,
            'expiresAt': _0x19f4fc,
            'expired': ![]
        };
        if (HAS_DB) {
            await _0x0_0x575ba2['saveSetting']('clones', _0x42d04f, _0x5d0346);
            console['log']('✅\x20[Clone\x20' + _0x42d04f + ']\x20Saved\x20to\x20main\x20database' + (_0x43b359 ? '\x20(expires\x20in\x20' + _0x43b359 + '\x20days)' : ''));
        } else {
            const _0x51321d = _0x0_0x45e0b7['join'](process['cwd'](), 'session', 'clones');
            if (!_0x0_0x1dc5a0['existsSync'](_0x51321d)) {
                _0x0_0x1dc5a0['mkdirSync'](_0x51321d, { 'recursive': !![] });
            }
            _0x0_0x1dc5a0['writeFileSync'](_0x0_0x45e0b7['join'](_0x51321d, _0x42d04f + '.json'), JSON['stringify'](_0x5d0346, null, 0x2));
            console['log']('✅\x20[Clone\x20' + _0x42d04f + ']\x20Saved\x20locally' + (_0x43b359 ? '\x20(expires\x20in\x20' + _0x43b359 + '\x20days)' : ''));
        }
        return !![];
    } catch (_0x2cc387) {
        console['error']('❌\x20Failed\x20to\x20save\x20clone\x20' + _0x42d04f + ':', _0x2cc387['message']);
        return ![];
    }
}
export async function getAllClonesFromMainDB() {
    try {
        let _0xc395a6 = [];
        if (HAS_DB) {
            const _0x4f3035 = await _0x0_0x575ba2['getSetting']('clones', 'all') || {};
            _0xc395a6 = Object['entries'](_0x4f3035)['map'](([_0xa98f1f, _0x30ec75]) => ({
                'authId': _0xa98f1f,
                'phoneNumber': _0x30ec75['phoneNumber'],
                'dbType': _0x30ec75['dbType'] || 'local',
                'status': _0x30ec75['status'] || 'unknown',
                'createdAt': _0x30ec75['createdAt'],
                'updatedAt': _0x30ec75['updatedAt'],
                'expiryDays': _0x30ec75['expiryDays'] || null,
                'expiresAt': _0x30ec75['expiresAt'] || null,
                'expired': _0x30ec75['expired'] || ![]
            }));
        } else {
            const _0x403b6a = _0x0_0x45e0b7['join'](process['cwd'](), 'session', 'clones');
            if (!_0x0_0x1dc5a0['existsSync'](_0x403b6a))
                return [];
            const _0x504cd0 = _0x0_0x1dc5a0['readdirSync'](_0x403b6a)['filter'](_0x1a7c46 => _0x1a7c46['endsWith']('.json'));
            for (const _0x1de4c0 of _0x504cd0) {
                const _0x5c389f = _0x1de4c0['replace']('.json', '');
                const _0x37d207 = JSON['parse'](_0x0_0x1dc5a0['readFileSync'](_0x0_0x45e0b7['join'](_0x403b6a, _0x1de4c0), 'utf-8'));
                _0xc395a6['push']({
                    'authId': _0x5c389f,
                    'phoneNumber': _0x37d207['phoneNumber'],
                    'dbType': _0x37d207['dbType'] || 'local',
                    'status': _0x37d207['status'] || 'unknown',
                    'createdAt': _0x37d207['createdAt'],
                    'updatedAt': _0x37d207['updatedAt'],
                    'expiryDays': _0x37d207['expiryDays'] || null,
                    'expiresAt': _0x37d207['expiresAt'] || null,
                    'expired': _0x37d207['expired'] || ![]
                });
            }
        }
        const _0x3b7303 = Date['now']();
        for (const _0x19d8dc of _0xc395a6) {
            if (_0x19d8dc['expiresAt'] && _0x19d8dc['expiresAt'] < _0x3b7303 && !_0x19d8dc['expired']) {
                _0x19d8dc['expired'] = !![];
                _0x19d8dc['status'] = 'expired';
                await updateCloneStatus(_0x19d8dc['authId'], 'expired', !![]);
            }
        }
        return _0xc395a6;
    } catch (_0x3ad99b) {
        console['error']('Failed\x20to\x20get\x20all\x20clones:', _0x3ad99b['message']);
        return [];
    }
}
async function updateCloneStatus(_0x12e034, _0x5ba1ee, _0x114de5 = ![]) {
    try {
        let _0x40e6ee = null;
        if (HAS_DB) {
            _0x40e6ee = await _0x0_0x575ba2['getSetting']('clones', _0x12e034);
        } else {
            const _0x5e5e6b = _0x0_0x45e0b7['join'](process['cwd'](), 'session', 'clones');
            const _0x50dbb4 = _0x0_0x45e0b7['join'](_0x5e5e6b, _0x12e034 + '.json');
            if (_0x0_0x1dc5a0['existsSync'](_0x50dbb4)) {
                _0x40e6ee = JSON['parse'](_0x0_0x1dc5a0['readFileSync'](_0x50dbb4, 'utf-8'));
            }
        }
        if (_0x40e6ee) {
            _0x40e6ee['status'] = _0x5ba1ee;
            _0x40e6ee['expired'] = _0x114de5;
            _0x40e6ee['updatedAt'] = Date['now']();
            if (HAS_DB) {
                await _0x0_0x575ba2['saveSetting']('clones', _0x12e034, _0x40e6ee);
            } else {
                const _0x392865 = _0x0_0x45e0b7['join'](process['cwd'](), 'session', 'clones');
                const _0x3b6ba6 = _0x0_0x45e0b7['join'](_0x392865, _0x12e034 + '.json');
                _0x0_0x1dc5a0['writeFileSync'](_0x3b6ba6, JSON['stringify'](_0x40e6ee, null, 0x2));
            }
        }
    } catch (_0x35867b) {
        console['error']('Failed\x20to\x20update\x20clone\x20status\x20' + _0x12e034 + ':', _0x35867b['message']);
    }
}
export async function getCloneByPhoneNumber(_0x2d3a57) {
    const _0x26bee5 = await getAllClonesFromMainDB();
    return _0x26bee5['filter'](_0x3b8dee => _0x3b8dee['phoneNumber'] === _0x2d3a57);
}
export async function deleteCloneFromMainDB(_0x1a56b9) {
    try {
        if (HAS_DB) {
            await _0x0_0x575ba2['saveSetting']('clones', _0x1a56b9, null);
        } else {
            const _0x15063d = _0x0_0x45e0b7['join'](process['cwd'](), 'session', 'clones');
            const _0x517d08 = _0x0_0x45e0b7['join'](_0x15063d, _0x1a56b9 + '.json');
            if (_0x0_0x1dc5a0['existsSync'](_0x517d08)) {
                _0x0_0x1dc5a0['unlinkSync'](_0x517d08);
            }
        }
        console['log']('✅\x20[Clone\x20' + _0x1a56b9 + ']\x20Removed\x20from\x20main\x20database');
        return !![];
    } catch (_0x378fe0) {
        console['error']('Failed\x20to\x20delete\x20clone\x20' + _0x1a56b9 + ':', _0x378fe0['message']);
        return ![];
    }
}
export async function startClone(_0x31f6c4, _0x15fd63, _0x20a9b0, _0x1ba40d, _0x2c8c22, _0x41258b, _0x419f2f, _0x404179) {
    try {
        const {
            state: _0x5b6034,
            saveCreds: _0x21dba4
        } = await useMultiFileAuthState(_0x31f6c4);
        const {version: _0x5aff38} = await fetchLatestBaileysVersion();
        const _0x49d21a = new _0x0_0x20632a();
        const _0x37a7e6 = _0x0_0x3b2604({
            'version': _0x5aff38,
            'logger': _0x0_0x24395b({ 'level': 'silent' }),
            'printQRInTerminal': ![],
            'browser': Browsers['macOS']('Chrome'),
            'auth': {
                'creds': _0x5b6034['creds'],
                'keys': makeCacheableSignalKeyStore(_0x5b6034['keys'], _0x0_0x24395b({ 'level': 'fatal' }))
            },
            'markOnlineOnConnect': !![],
            'msgRetryCounterCache': _0x49d21a,
            'connectTimeoutMs': 0x1d4c0,
            'defaultQueryTimeoutMs': 0x0,
            'keepAliveIntervalMs': 0x7530,
            'mobile': ![]
        });
        let _0x150ffc = null;
        if (!_0x37a7e6['authState']['creds']['registered']) {
            await new Promise(_0x3d4410 => setTimeout(_0x3d4410, 0x1770));
            try {
                let _0x38d401 = await _0x37a7e6['requestPairingCode'](_0x15fd63);
                _0x150ffc = _0x38d401?.['match'](/.{1,4}/g)?.['join']('-') || _0x38d401;
                await saveCloneToMainDB(_0x20a9b0, _0x15fd63, _0x2c8c22 || 'local', _0x1ba40d, 'pairing', _0x41258b);
            } catch (_0x3d8ec9) {
                console['error']('Pairing\x20Error:', _0x3d8ec9);
                throw new Error('Failed\x20to\x20get\x20pairing\x20code:\x20' + _0x3d8ec9['message']);
            }
        }
        _0x37a7e6['ev']['on']('creds.update', async () => {
            await _0x21dba4();
            try {
                const _0x3a9fd4 = JSON['parse'](_0x0_0x1dc5a0['readFileSync'](_0x0_0x45e0b7['join'](_0x31f6c4, 'creds.json'), 'utf-8'));
                await saveCloneToMainDB(_0x20a9b0, _0x15fd63, _0x2c8c22 || 'local', _0x1ba40d, 'active', _0x41258b);
            } catch (_0x20f6b6) {
                console['error']('Creds\x20save\x20error:', _0x20f6b6['message']);
            }
        });
        _0x37a7e6['ev']['on']('connection.update', async _0x529f94 => {
            const {
                connection: _0x4234c7,
                lastDisconnect: _0x43f27d
            } = _0x529f94;
            if (_0x4234c7 === 'open') {
                global['conns']['push'](_0x37a7e6);
                await saveCloneToMainDB(_0x20a9b0, _0x15fd63, _0x2c8c22 || 'local', _0x1ba40d, 'online', _0x41258b);
                if (_0x419f2f) {
                    await _0x419f2f(_0x37a7e6, _0x20a9b0, _0x15fd63);
                }
            }
            if (_0x4234c7 === 'close') {
                const _0x4020fa = _0x43f27d?.['error']?.['output']?.['statusCode'];
                if (_0x4020fa !== DisconnectReason['loggedOut']) {
                    console['log']('🔄\x20[Clone\x20' + _0x20a9b0 + ']\x20Reconnecting...');
                    setTimeout(() => startClone(_0x31f6c4, _0x15fd63, _0x20a9b0, _0x1ba40d, _0x2c8c22, _0x41258b, _0x419f2f, _0x404179), 0x1388);
                } else {
                    await saveCloneToMainDB(_0x20a9b0, _0x15fd63, _0x2c8c22 || 'local', _0x1ba40d, 'offline', _0x41258b);
                    const _0x326a7b = global['conns']['indexOf'](_0x37a7e6);
                    if (_0x326a7b > -0x1)
                        global['conns']['splice'](_0x326a7b, 0x1);
                    if (_0x404179) {
                        await _0x404179(_0x37a7e6, _0x20a9b0, _0x15fd63);
                    }
                }
            }
        });
        try {
            const {handleMessages: _0x371cfe} = await import('./messageHandler.js');
            _0x37a7e6['ev']['on']('messages.upsert', async _0x274063 => {
                await _0x371cfe(_0x37a7e6, _0x274063);
            });
        } catch (_0x350df5) {
            console['error']('Handler\x20linkage\x20failed:', _0x350df5['message']);
        }
        return {
            'conn': _0x37a7e6,
            'pairingCode': _0x150ffc
        };
    } catch (_0x2de240) {
        console['error']('Failed\x20to\x20start\x20clone\x20' + _0x20a9b0 + ':', _0x2de240['message']);
        throw _0x2de240;
    }
}
export async function deleteClone(_0x4c3ea6) {
    try {
        const _0x527b02 = global['conns']['findIndex'](_0x30f206 => {
            try {
                return _0x30f206['authState']?.['creds']?.['me']?.['id']?.['includes'](_0x4c3ea6) || _0x30f206['user']?.['id']?.['includes'](_0x4c3ea6);
            } catch (_0x5ec9ae) {
                return ![];
            }
        });
        if (_0x527b02 > -0x1) {
            try {
                await global['conns'][_0x527b02]['end']();
                global['conns']['splice'](_0x527b02, 0x1);
                console['log']('✅\x20[Clone\x20' + _0x4c3ea6 + ']\x20Disconnected');
            } catch (_0x52ddd2) {
                console['error']('Failed\x20to\x20disconnect\x20clone\x20' + _0x4c3ea6 + ':', _0x52ddd2['message']);
            }
        }
        await deleteCloneFromMainDB(_0x4c3ea6);
        const _0x466eee = _0x0_0x45e0b7['join'](process['cwd'](), 'session', 'clones', _0x4c3ea6);
        if (_0x0_0x1dc5a0['existsSync'](_0x466eee)) {
            _0x0_0x1dc5a0['rmSync'](_0x466eee, {
                'recursive': !![],
                'force': !![]
            });
        }
        return { 'success': !![] };
    } catch (_0x2e3533) {
        console['error']('Failed\x20to\x20delete\x20clone\x20' + _0x4c3ea6 + ':', _0x2e3533['message']);
        return {
            'success': ![],
            'error': _0x2e3533['message']
        };
    }
}
export async function checkAndCleanExpiredClones() {
    try {
        const _0x599259 = await getAllClonesFromMainDB();
        const _0x1a5959 = Date['now']();
        let _0x4720d9 = 0x0;
        for (const _0x368b72 of _0x599259) {
            if (_0x368b72['expiresAt'] && _0x368b72['expiresAt'] < _0x1a5959 && !_0x368b72['expired']) {
                console['log']('🧹\x20Cleaning\x20expired\x20clone:\x20' + _0x368b72['authId'] + '\x20(' + _0x368b72['phoneNumber'] + ')');
                await deleteClone(_0x368b72['authId']);
                _0x4720d9++;
            }
        }
        if (_0x4720d9 > 0x0) {
            console['log']('✅\x20Cleaned\x20' + _0x4720d9 + '\x20expired\x20clones');
        }
        return _0x4720d9;
    } catch (_0x482d59) {
        console['error']('Failed\x20to\x20check\x20expired\x20clones:', _0x482d59['message']);
        return 0x0;
    }
}
export async function isCloneOwner(_0x5da358, _0x187006) {
    try {
        const _0x2b6fe5 = await getAllClonesFromMainDB();
        const _0x54bd4b = _0x2b6fe5['find'](_0x13f0d3 => _0x13f0d3['authId'] === _0x187006);
        if (!_0x54bd4b)
            return ![];
        const _0x2bee24 = _0x5da358['split']('@')[0x0];
        return _0x54bd4b['phoneNumber'] === _0x2bee24;
    } catch (_0x42729b) {
        console['error']('Check\x20clone\x20owner\x20error:', _0x42729b['message']);
        return ![];
    }
}