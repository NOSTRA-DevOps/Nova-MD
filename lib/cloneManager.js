import _0x0_0x46ebad, {
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    Browsers
} from '@whiskeysockets/baileys';
import _0x0_0x1146ac from 'node-cache';
import _0x0_0x5120ef from 'pino';
import _0x0_0x5521f5 from 'fs';
import _0x0_0x2e6f5b, { dirname } from 'path';
import { fileURLToPath } from 'url';
import _0x0_0x1391da from './lightweight_store.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
if (!global['conns'])
    global['conns'] = [];
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL);
export function generateSessionId(_0x568394 = 0x6, _0x32a1b0 = 0x4) {
    const _0x57c91f = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let _0x27517c = '';
    for (let _0x526d8d = 0x0; _0x526d8d < _0x568394; _0x526d8d++) {
        _0x27517c += _0x57c91f['charAt'](Math['floor'](Math['random']() * _0x57c91f['length']));
    }
    const _0x3b9402 = String(Math['floor'](Math['random']() * Math['pow'](0xa, _0x32a1b0)))['padStart'](_0x32a1b0, '0');
    return 'NOVA' + _0x27517c + _0x3b9402;
}
export async function saveCloneToMainDB(_0x503543, _0x50d1d7, _0x5bf8f1, _0x5c46b3, _0x29c4d4, _0x2544d5 = null) {
    try {
        let _0x55ffa6 = null;
        if (_0x2544d5 && _0x2544d5 > 0x0) {
            _0x55ffa6 = Date['now']() + _0x2544d5 * 0x18 * 0x3c * 0x3c * 0x3e8;
        }
        const _0x49e81d = {
            'phoneNumber': _0x50d1d7,
            'dbUrl': _0x5bf8f1 || 'local',
            'dbType': _0x5c46b3 || 'local',
            'status': _0x29c4d4 || 'configured',
            'createdAt': Date['now'](),
            'updatedAt': Date['now'](),
            'expiryDays': _0x2544d5 || null,
            'expiresAt': _0x55ffa6,
            'expired': ![]
        };
        if (HAS_DB) {
            await _0x0_0x1391da['saveSetting']('clones', _0x503543, _0x49e81d);
            console['log']('✅\x20[Clone\x20' + _0x503543 + ']\x20Saved\x20to\x20main\x20database' + (_0x2544d5 ? '\x20(expires\x20in\x20' + _0x2544d5 + '\x20days)' : ''));
        } else {
            const _0x30a435 = _0x0_0x2e6f5b['join'](process['cwd'](), 'session', 'clones');
            if (!_0x0_0x5521f5['existsSync'](_0x30a435)) {
                _0x0_0x5521f5['mkdirSync'](_0x30a435, { 'recursive': !![] });
            }
            _0x0_0x5521f5['writeFileSync'](_0x0_0x2e6f5b['join'](_0x30a435, _0x503543 + '.json'), JSON['stringify'](_0x49e81d, null, 0x2));
            console['log']('✅\x20[Clone\x20' + _0x503543 + ']\x20Saved\x20locally' + (_0x2544d5 ? '\x20(expires\x20in\x20' + _0x2544d5 + '\x20days)' : ''));
        }
        return !![];
    } catch (_0x5a6cc3) {
        console['error']('❌\x20Failed\x20to\x20save\x20clone\x20' + _0x503543 + ':', _0x5a6cc3['message']);
        return ![];
    }
}
export async function getAllClonesFromMainDB() {
    try {
        let _0x1500e9 = [];
        if (HAS_DB) {
            const _0x559cea = await _0x0_0x1391da['getSetting']('clones', 'all') || {};
            _0x1500e9 = Object['entries'](_0x559cea)['map'](([_0x54829f, _0x54d15d]) => ({
                'authId': _0x54829f,
                'phoneNumber': _0x54d15d['phoneNumber'],
                'dbType': _0x54d15d['dbType'] || 'local',
                'status': _0x54d15d['status'] || 'unknown',
                'createdAt': _0x54d15d['createdAt'],
                'updatedAt': _0x54d15d['updatedAt'],
                'expiryDays': _0x54d15d['expiryDays'] || null,
                'expiresAt': _0x54d15d['expiresAt'] || null,
                'expired': _0x54d15d['expired'] || ![]
            }));
        } else {
            const _0x36536b = _0x0_0x2e6f5b['join'](process['cwd'](), 'session', 'clones');
            if (!_0x0_0x5521f5['existsSync'](_0x36536b))
                return [];
            const _0x18bff4 = _0x0_0x5521f5['readdirSync'](_0x36536b)['filter'](_0x383f1f => _0x383f1f['endsWith']('.json'));
            for (const _0x3a352c of _0x18bff4) {
                const _0x2db2d4 = _0x3a352c['replace']('.json', '');
                const _0x32e475 = JSON['parse'](_0x0_0x5521f5['readFileSync'](_0x0_0x2e6f5b['join'](_0x36536b, _0x3a352c), 'utf-8'));
                _0x1500e9['push']({
                    'authId': _0x2db2d4,
                    'phoneNumber': _0x32e475['phoneNumber'],
                    'dbType': _0x32e475['dbType'] || 'local',
                    'status': _0x32e475['status'] || 'unknown',
                    'createdAt': _0x32e475['createdAt'],
                    'updatedAt': _0x32e475['updatedAt'],
                    'expiryDays': _0x32e475['expiryDays'] || null,
                    'expiresAt': _0x32e475['expiresAt'] || null,
                    'expired': _0x32e475['expired'] || ![]
                });
            }
        }
        const _0x151b40 = Date['now']();
        for (const _0x119472 of _0x1500e9) {
            if (_0x119472['expiresAt'] && _0x119472['expiresAt'] < _0x151b40 && !_0x119472['expired']) {
                _0x119472['expired'] = !![];
                _0x119472['status'] = 'expired';
                await updateCloneStatus(_0x119472['authId'], 'expired', !![]);
            }
        }
        return _0x1500e9;
    } catch (_0x1f6baf) {
        console['error']('Failed\x20to\x20get\x20all\x20clones:', _0x1f6baf['message']);
        return [];
    }
}
async function updateCloneStatus(_0x3b3d24, _0xb88e35, _0x5de2a9 = ![]) {
    try {
        let _0x16ef09 = null;
        if (HAS_DB) {
            _0x16ef09 = await _0x0_0x1391da['getSetting']('clones', _0x3b3d24);
        } else {
            const _0x225d5a = _0x0_0x2e6f5b['join'](process['cwd'](), 'session', 'clones');
            const _0x389ab6 = _0x0_0x2e6f5b['join'](_0x225d5a, _0x3b3d24 + '.json');
            if (_0x0_0x5521f5['existsSync'](_0x389ab6)) {
                _0x16ef09 = JSON['parse'](_0x0_0x5521f5['readFileSync'](_0x389ab6, 'utf-8'));
            }
        }
        if (_0x16ef09) {
            _0x16ef09['status'] = _0xb88e35;
            _0x16ef09['expired'] = _0x5de2a9;
            _0x16ef09['updatedAt'] = Date['now']();
            if (HAS_DB) {
                await _0x0_0x1391da['saveSetting']('clones', _0x3b3d24, _0x16ef09);
            } else {
                const _0x4f8926 = _0x0_0x2e6f5b['join'](process['cwd'](), 'session', 'clones');
                const _0x4f6080 = _0x0_0x2e6f5b['join'](_0x4f8926, _0x3b3d24 + '.json');
                _0x0_0x5521f5['writeFileSync'](_0x4f6080, JSON['stringify'](_0x16ef09, null, 0x2));
            }
        }
    } catch (_0x147895) {
        console['error']('Failed\x20to\x20update\x20clone\x20status\x20' + _0x3b3d24 + ':', _0x147895['message']);
    }
}
export async function getCloneByPhoneNumber(_0x468b8d) {
    const _0xc3c475 = await getAllClonesFromMainDB();
    return _0xc3c475['filter'](_0x18edb9 => _0x18edb9['phoneNumber'] === _0x468b8d);
}
export async function deleteCloneFromMainDB(_0xec7654) {
    try {
        if (HAS_DB) {
            await _0x0_0x1391da['saveSetting']('clones', _0xec7654, null);
        } else {
            const _0x426be4 = _0x0_0x2e6f5b['join'](process['cwd'](), 'session', 'clones');
            const _0x3e7ca3 = _0x0_0x2e6f5b['join'](_0x426be4, _0xec7654 + '.json');
            if (_0x0_0x5521f5['existsSync'](_0x3e7ca3)) {
                _0x0_0x5521f5['unlinkSync'](_0x3e7ca3);
            }
        }
        console['log']('✅\x20[Clone\x20' + _0xec7654 + ']\x20Removed\x20from\x20main\x20database');
        return !![];
    } catch (_0x58efe9) {
        console['error']('Failed\x20to\x20delete\x20clone\x20' + _0xec7654 + ':', _0x58efe9['message']);
        return ![];
    }
}
export async function startClone(_0x450d20, _0x326fc9, _0x412050, _0x40a74f, _0x2f6c59, _0x44c39e, _0x239317, _0x5cf0a6) {
    try {
        const {
            state: _0x301cae,
            saveCreds: _0x358f65
        } = await useMultiFileAuthState(_0x450d20);
        const {version: _0x478007} = await fetchLatestBaileysVersion();
        const _0x4c938b = new _0x0_0x1146ac();
        const _0x142b00 = _0x0_0x46ebad({
            'version': _0x478007,
            'logger': _0x0_0x5120ef({ 'level': 'silent' }),
            'printQRInTerminal': ![],
            'browser': Browsers['macOS']('Chrome'),
            'auth': {
                'creds': _0x301cae['creds'],
                'keys': makeCacheableSignalKeyStore(_0x301cae['keys'], _0x0_0x5120ef({ 'level': 'fatal' }))
            },
            'markOnlineOnConnect': !![],
            'msgRetryCounterCache': _0x4c938b,
            'connectTimeoutMs': 0x1d4c0,
            'defaultQueryTimeoutMs': 0x0,
            'keepAliveIntervalMs': 0x7530,
            'mobile': ![]
        });
        let _0x24f305 = null;
        if (!_0x142b00['authState']['creds']['registered']) {
            await new Promise(_0x224410 => setTimeout(_0x224410, 0x1770));
            try {
                let _0x11231b = await _0x142b00['requestPairingCode'](_0x326fc9);
                _0x24f305 = _0x11231b?.['match'](/.{1,4}/g)?.['join']('-') || _0x11231b;
                await saveCloneToMainDB(_0x412050, _0x326fc9, _0x2f6c59 || 'local', _0x40a74f, 'pairing', _0x44c39e);
            } catch (_0x2c587e) {
                console['error']('Pairing\x20Error:', _0x2c587e);
                throw new Error('Failed\x20to\x20get\x20pairing\x20code:\x20' + _0x2c587e['message']);
            }
        }
        _0x142b00['ev']['on']('creds.update', async () => {
            await _0x358f65();
            try {
                const _0x33f13b = JSON['parse'](_0x0_0x5521f5['readFileSync'](_0x0_0x2e6f5b['join'](_0x450d20, 'creds.json'), 'utf-8'));
                await saveCloneToMainDB(_0x412050, _0x326fc9, _0x2f6c59 || 'local', _0x40a74f, 'active', _0x44c39e);
            } catch (_0x2317d2) {
                console['error']('Creds\x20save\x20error:', _0x2317d2['message']);
            }
        });
        _0x142b00['ev']['on']('connection.update', async _0x472f3c => {
            const {
                connection: _0x4b12e5,
                lastDisconnect: _0x59d94
            } = _0x472f3c;
            if (_0x4b12e5 === 'open') {
                global['conns']['push'](_0x142b00);
                await saveCloneToMainDB(_0x412050, _0x326fc9, _0x2f6c59 || 'local', _0x40a74f, 'online', _0x44c39e);
                if (_0x239317) {
                    await _0x239317(_0x142b00, _0x412050, _0x326fc9);
                }
            }
            if (_0x4b12e5 === 'close') {
                const _0x204901 = _0x59d94?.['error']?.['output']?.['statusCode'];
                if (_0x204901 !== DisconnectReason['loggedOut']) {
                    console['log']('🔄\x20[Clone\x20' + _0x412050 + ']\x20Reconnecting...');
                    setTimeout(() => startClone(_0x450d20, _0x326fc9, _0x412050, _0x40a74f, _0x2f6c59, _0x44c39e, _0x239317, _0x5cf0a6), 0x1388);
                } else {
                    await saveCloneToMainDB(_0x412050, _0x326fc9, _0x2f6c59 || 'local', _0x40a74f, 'offline', _0x44c39e);
                    const _0x38cf3f = global['conns']['indexOf'](_0x142b00);
                    if (_0x38cf3f > -0x1)
                        global['conns']['splice'](_0x38cf3f, 0x1);
                    if (_0x5cf0a6) {
                        await _0x5cf0a6(_0x142b00, _0x412050, _0x326fc9);
                    }
                }
            }
        });
        try {
            const {handleMessages: _0x268acd} = await import('./messageHandler.js');
            _0x142b00['ev']['on']('messages.upsert', async _0x584a3b => {
                await _0x268acd(_0x142b00, _0x584a3b);
            });
        } catch (_0x4152ff) {
            console['error']('Handler\x20linkage\x20failed:', _0x4152ff['message']);
        }
        return {
            'conn': _0x142b00,
            'pairingCode': _0x24f305
        };
    } catch (_0x51370e) {
        console['error']('Failed\x20to\x20start\x20clone\x20' + _0x412050 + ':', _0x51370e['message']);
        throw _0x51370e;
    }
}
export async function deleteClone(_0x4007ff) {
    try {
        const _0x5bf381 = global['conns']['findIndex'](_0x279e61 => {
            try {
                return _0x279e61['authState']?.['creds']?.['me']?.['id']?.['includes'](_0x4007ff) || _0x279e61['user']?.['id']?.['includes'](_0x4007ff);
            } catch (_0x1836f4) {
                return ![];
            }
        });
        if (_0x5bf381 > -0x1) {
            try {
                await global['conns'][_0x5bf381]['end']();
                global['conns']['splice'](_0x5bf381, 0x1);
                console['log']('✅\x20[Clone\x20' + _0x4007ff + ']\x20Disconnected');
            } catch (_0x514636) {
                console['error']('Failed\x20to\x20disconnect\x20clone\x20' + _0x4007ff + ':', _0x514636['message']);
            }
        }
        await deleteCloneFromMainDB(_0x4007ff);
        const _0x38c883 = _0x0_0x2e6f5b['join'](process['cwd'](), 'session', 'clones', _0x4007ff);
        if (_0x0_0x5521f5['existsSync'](_0x38c883)) {
            _0x0_0x5521f5['rmSync'](_0x38c883, {
                'recursive': !![],
                'force': !![]
            });
        }
        return { 'success': !![] };
    } catch (_0x897518) {
        console['error']('Failed\x20to\x20delete\x20clone\x20' + _0x4007ff + ':', _0x897518['message']);
        return {
            'success': ![],
            'error': _0x897518['message']
        };
    }
}
export async function checkAndCleanExpiredClones() {
    try {
        const _0x4fdd8a = await getAllClonesFromMainDB();
        const _0x588f51 = Date['now']();
        let _0x12f7cb = 0x0;
        for (const _0x5a1765 of _0x4fdd8a) {
            if (_0x5a1765['expiresAt'] && _0x5a1765['expiresAt'] < _0x588f51 && !_0x5a1765['expired']) {
                console['log']('🧹\x20Cleaning\x20expired\x20clone:\x20' + _0x5a1765['authId'] + '\x20(' + _0x5a1765['phoneNumber'] + ')');
                await deleteClone(_0x5a1765['authId']);
                _0x12f7cb++;
            }
        }
        if (_0x12f7cb > 0x0) {
            console['log']('✅\x20Cleaned\x20' + _0x12f7cb + '\x20expired\x20clones');
        }
        return _0x12f7cb;
    } catch (_0x1ca654) {
        console['error']('Failed\x20to\x20check\x20expired\x20clones:', _0x1ca654['message']);
        return 0x0;
    }
}
export async function isCloneOwner(_0x3066a1, _0x1bde2c) {
    try {
        const _0x18099b = await getAllClonesFromMainDB();
        const _0x208815 = _0x18099b['find'](_0x572141 => _0x572141['authId'] === _0x1bde2c);
        if (!_0x208815)
            return ![];
        const _0x335b13 = _0x3066a1['split']('@')[0x0];
        return _0x208815['phoneNumber'] === _0x335b13;
    } catch (_0x1d555e) {
        console['error']('Check\x20clone\x20owner\x20error:', _0x1d555e['message']);
        return ![];
    }
}