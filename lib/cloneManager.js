import _0x0_0x4bef78, {
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    Browsers
} from '@whiskeysockets/baileys';
import _0x0_0x116bce from 'node-cache';
import _0x0_0x39eff9 from 'pino';
import _0x0_0xbb80a4 from 'fs';
import _0x0_0x38f144, { dirname } from 'path';
import { fileURLToPath } from 'url';
import _0x0_0x3f9461 from './lightweight_store.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
if (!global['conns'])
    global['conns'] = [];
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL);
export function generateSessionId(_0x4df14f = 0x6, _0x53ccba = 0x4) {
    const _0x1e1f11 = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let _0x16a017 = '';
    for (let _0xd4c359 = 0x0; _0xd4c359 < _0x4df14f; _0xd4c359++) {
        _0x16a017 += _0x1e1f11['charAt'](Math['floor'](Math['random']() * _0x1e1f11['length']));
    }
    const _0x445e7f = String(Math['floor'](Math['random']() * Math['pow'](0xa, _0x53ccba)))['padStart'](_0x53ccba, '0');
    return 'NOVA' + _0x16a017 + _0x445e7f;
}
export async function saveCloneToMainDB(_0x180c4a, _0x4c1629, _0x135596, _0x478e56, _0xeb3e31, _0x287e0b = null) {
    try {
        let _0x333d12 = null;
        if (_0x287e0b && _0x287e0b > 0x0) {
            _0x333d12 = Date['now']() + _0x287e0b * 0x18 * 0x3c * 0x3c * 0x3e8;
        }
        const _0x1784da = {
            'phoneNumber': _0x4c1629,
            'dbUrl': _0x135596 || 'local',
            'dbType': _0x478e56 || 'local',
            'status': _0xeb3e31 || 'configured',
            'createdAt': Date['now'](),
            'updatedAt': Date['now'](),
            'expiryDays': _0x287e0b || null,
            'expiresAt': _0x333d12,
            'expired': ![]
        };
        if (HAS_DB) {
            await _0x0_0x3f9461['saveSetting']('clones', _0x180c4a, _0x1784da);
            console['log']('✅\x20[Clone\x20' + _0x180c4a + ']\x20Saved\x20to\x20main\x20database' + (_0x287e0b ? '\x20(expires\x20in\x20' + _0x287e0b + '\x20days)' : ''));
        } else {
            const _0x3ec58e = _0x0_0x38f144['join'](process['cwd'](), 'session', 'clones');
            if (!_0x0_0xbb80a4['existsSync'](_0x3ec58e)) {
                _0x0_0xbb80a4['mkdirSync'](_0x3ec58e, { 'recursive': !![] });
            }
            _0x0_0xbb80a4['writeFileSync'](_0x0_0x38f144['join'](_0x3ec58e, _0x180c4a + '.json'), JSON['stringify'](_0x1784da, null, 0x2));
            console['log']('✅\x20[Clone\x20' + _0x180c4a + ']\x20Saved\x20locally' + (_0x287e0b ? '\x20(expires\x20in\x20' + _0x287e0b + '\x20days)' : ''));
        }
        return !![];
    } catch (_0x5fb06e) {
        console['error']('❌\x20Failed\x20to\x20save\x20clone\x20' + _0x180c4a + ':', _0x5fb06e['message']);
        return ![];
    }
}
export async function getAllClonesFromMainDB() {
    try {
        let _0x25b10c = [];
        if (HAS_DB) {
            const _0x163f00 = await _0x0_0x3f9461['getSetting']('clones', 'all') || {};
            _0x25b10c = Object['entries'](_0x163f00)['map'](([_0x47547f, _0xe354b3]) => ({
                'authId': _0x47547f,
                'phoneNumber': _0xe354b3['phoneNumber'],
                'dbType': _0xe354b3['dbType'] || 'local',
                'status': _0xe354b3['status'] || 'unknown',
                'createdAt': _0xe354b3['createdAt'],
                'updatedAt': _0xe354b3['updatedAt'],
                'expiryDays': _0xe354b3['expiryDays'] || null,
                'expiresAt': _0xe354b3['expiresAt'] || null,
                'expired': _0xe354b3['expired'] || ![]
            }));
        } else {
            const _0x2e1096 = _0x0_0x38f144['join'](process['cwd'](), 'session', 'clones');
            if (!_0x0_0xbb80a4['existsSync'](_0x2e1096))
                return [];
            const _0x325015 = _0x0_0xbb80a4['readdirSync'](_0x2e1096)['filter'](_0x3d8252 => _0x3d8252['endsWith']('.json'));
            for (const _0x51ad0c of _0x325015) {
                const _0x8385f1 = _0x51ad0c['replace']('.json', '');
                const _0x21281c = JSON['parse'](_0x0_0xbb80a4['readFileSync'](_0x0_0x38f144['join'](_0x2e1096, _0x51ad0c), 'utf-8'));
                _0x25b10c['push']({
                    'authId': _0x8385f1,
                    'phoneNumber': _0x21281c['phoneNumber'],
                    'dbType': _0x21281c['dbType'] || 'local',
                    'status': _0x21281c['status'] || 'unknown',
                    'createdAt': _0x21281c['createdAt'],
                    'updatedAt': _0x21281c['updatedAt'],
                    'expiryDays': _0x21281c['expiryDays'] || null,
                    'expiresAt': _0x21281c['expiresAt'] || null,
                    'expired': _0x21281c['expired'] || ![]
                });
            }
        }
        const _0x4d6dab = Date['now']();
        for (const _0x3cf75b of _0x25b10c) {
            if (_0x3cf75b['expiresAt'] && _0x3cf75b['expiresAt'] < _0x4d6dab && !_0x3cf75b['expired']) {
                _0x3cf75b['expired'] = !![];
                _0x3cf75b['status'] = 'expired';
                await updateCloneStatus(_0x3cf75b['authId'], 'expired', !![]);
            }
        }
        return _0x25b10c;
    } catch (_0x579078) {
        console['error']('Failed\x20to\x20get\x20all\x20clones:', _0x579078['message']);
        return [];
    }
}
async function updateCloneStatus(_0x13a5be, _0x2f4a98, _0x2a818c = ![]) {
    try {
        let _0x3451e1 = null;
        if (HAS_DB) {
            _0x3451e1 = await _0x0_0x3f9461['getSetting']('clones', _0x13a5be);
        } else {
            const _0x3c6f8f = _0x0_0x38f144['join'](process['cwd'](), 'session', 'clones');
            const _0x1f8053 = _0x0_0x38f144['join'](_0x3c6f8f, _0x13a5be + '.json');
            if (_0x0_0xbb80a4['existsSync'](_0x1f8053)) {
                _0x3451e1 = JSON['parse'](_0x0_0xbb80a4['readFileSync'](_0x1f8053, 'utf-8'));
            }
        }
        if (_0x3451e1) {
            _0x3451e1['status'] = _0x2f4a98;
            _0x3451e1['expired'] = _0x2a818c;
            _0x3451e1['updatedAt'] = Date['now']();
            if (HAS_DB) {
                await _0x0_0x3f9461['saveSetting']('clones', _0x13a5be, _0x3451e1);
            } else {
                const _0x1d3d13 = _0x0_0x38f144['join'](process['cwd'](), 'session', 'clones');
                const _0x158810 = _0x0_0x38f144['join'](_0x1d3d13, _0x13a5be + '.json');
                _0x0_0xbb80a4['writeFileSync'](_0x158810, JSON['stringify'](_0x3451e1, null, 0x2));
            }
        }
    } catch (_0x2e86f8) {
        console['error']('Failed\x20to\x20update\x20clone\x20status\x20' + _0x13a5be + ':', _0x2e86f8['message']);
    }
}
export async function getCloneByPhoneNumber(_0x59fc2a) {
    const _0xb8149a = await getAllClonesFromMainDB();
    return _0xb8149a['filter'](_0x55b0f2 => _0x55b0f2['phoneNumber'] === _0x59fc2a);
}
export async function deleteCloneFromMainDB(_0x1d7f5b) {
    try {
        if (HAS_DB) {
            await _0x0_0x3f9461['saveSetting']('clones', _0x1d7f5b, null);
        } else {
            const _0x159c0f = _0x0_0x38f144['join'](process['cwd'](), 'session', 'clones');
            const _0x2d6b42 = _0x0_0x38f144['join'](_0x159c0f, _0x1d7f5b + '.json');
            if (_0x0_0xbb80a4['existsSync'](_0x2d6b42)) {
                _0x0_0xbb80a4['unlinkSync'](_0x2d6b42);
            }
        }
        console['log']('✅\x20[Clone\x20' + _0x1d7f5b + ']\x20Removed\x20from\x20main\x20database');
        return !![];
    } catch (_0x5aa546) {
        console['error']('Failed\x20to\x20delete\x20clone\x20' + _0x1d7f5b + ':', _0x5aa546['message']);
        return ![];
    }
}
export async function startClone(_0x342cd4, _0x41ebfc, _0x43e1c6, _0xfb5b5b, _0x350d7f, _0x356c07, _0x113cd0, _0x251643) {
    try {
        const {
            state: _0x1c3525,
            saveCreds: _0xbcedbc
        } = await useMultiFileAuthState(_0x342cd4);
        const {version: _0x39c591} = await fetchLatestBaileysVersion();
        const _0x2cd507 = new _0x0_0x116bce();
        const _0x4123d2 = _0x0_0x4bef78({
            'version': _0x39c591,
            'logger': _0x0_0x39eff9({ 'level': 'silent' }),
            'printQRInTerminal': ![],
            'browser': Browsers['macOS']('Chrome'),
            'auth': {
                'creds': _0x1c3525['creds'],
                'keys': makeCacheableSignalKeyStore(_0x1c3525['keys'], _0x0_0x39eff9({ 'level': 'fatal' }))
            },
            'markOnlineOnConnect': !![],
            'msgRetryCounterCache': _0x2cd507,
            'connectTimeoutMs': 0x1d4c0,
            'defaultQueryTimeoutMs': 0x0,
            'keepAliveIntervalMs': 0x7530,
            'mobile': ![]
        });
        let _0x3c9624 = null;
        if (!_0x4123d2['authState']['creds']['registered']) {
            await new Promise(_0x568697 => setTimeout(_0x568697, 0x1770));
            try {
                let _0x24384e = await _0x4123d2['requestPairingCode'](_0x41ebfc);
                _0x3c9624 = _0x24384e?.['match'](/.{1,4}/g)?.['join']('-') || _0x24384e;
                await saveCloneToMainDB(_0x43e1c6, _0x41ebfc, _0x350d7f || 'local', _0xfb5b5b, 'pairing', _0x356c07);
            } catch (_0x20ec45) {
                console['error']('Pairing\x20Error:', _0x20ec45);
                throw new Error('Failed\x20to\x20get\x20pairing\x20code:\x20' + _0x20ec45['message']);
            }
        }
        _0x4123d2['ev']['on']('creds.update', async () => {
            await _0xbcedbc();
            try {
                const _0x203014 = JSON['parse'](_0x0_0xbb80a4['readFileSync'](_0x0_0x38f144['join'](_0x342cd4, 'creds.json'), 'utf-8'));
                await saveCloneToMainDB(_0x43e1c6, _0x41ebfc, _0x350d7f || 'local', _0xfb5b5b, 'active', _0x356c07);
            } catch (_0x428c43) {
                console['error']('Creds\x20save\x20error:', _0x428c43['message']);
            }
        });
        _0x4123d2['ev']['on']('connection.update', async _0x31d860 => {
            const {
                connection: _0x21c997,
                lastDisconnect: _0xb181a6
            } = _0x31d860;
            if (_0x21c997 === 'open') {
                global['conns']['push'](_0x4123d2);
                await saveCloneToMainDB(_0x43e1c6, _0x41ebfc, _0x350d7f || 'local', _0xfb5b5b, 'online', _0x356c07);
                if (_0x113cd0) {
                    await _0x113cd0(_0x4123d2, _0x43e1c6, _0x41ebfc);
                }
            }
            if (_0x21c997 === 'close') {
                const _0x1baef5 = _0xb181a6?.['error']?.['output']?.['statusCode'];
                if (_0x1baef5 !== DisconnectReason['loggedOut']) {
                    console['log']('🔄\x20[Clone\x20' + _0x43e1c6 + ']\x20Reconnecting...');
                    setTimeout(() => startClone(_0x342cd4, _0x41ebfc, _0x43e1c6, _0xfb5b5b, _0x350d7f, _0x356c07, _0x113cd0, _0x251643), 0x1388);
                } else {
                    await saveCloneToMainDB(_0x43e1c6, _0x41ebfc, _0x350d7f || 'local', _0xfb5b5b, 'offline', _0x356c07);
                    const _0xa06cb0 = global['conns']['indexOf'](_0x4123d2);
                    if (_0xa06cb0 > -0x1)
                        global['conns']['splice'](_0xa06cb0, 0x1);
                    if (_0x251643) {
                        await _0x251643(_0x4123d2, _0x43e1c6, _0x41ebfc);
                    }
                }
            }
        });
        try {
            const {handleMessages: _0x49a0d9} = await import('./messageHandler.js');
            _0x4123d2['ev']['on']('messages.upsert', async _0x381582 => {
                await _0x49a0d9(_0x4123d2, _0x381582);
            });
        } catch (_0x588b4c) {
            console['error']('Handler\x20linkage\x20failed:', _0x588b4c['message']);
        }
        return {
            'conn': _0x4123d2,
            'pairingCode': _0x3c9624
        };
    } catch (_0x5d16e9) {
        console['error']('Failed\x20to\x20start\x20clone\x20' + _0x43e1c6 + ':', _0x5d16e9['message']);
        throw _0x5d16e9;
    }
}
export async function deleteClone(_0x227635) {
    try {
        const _0x4136d3 = global['conns']['findIndex'](_0x49f48a => {
            try {
                return _0x49f48a['authState']?.['creds']?.['me']?.['id']?.['includes'](_0x227635) || _0x49f48a['user']?.['id']?.['includes'](_0x227635);
            } catch (_0x4a95fc) {
                return ![];
            }
        });
        if (_0x4136d3 > -0x1) {
            try {
                await global['conns'][_0x4136d3]['end']();
                global['conns']['splice'](_0x4136d3, 0x1);
                console['log']('✅\x20[Clone\x20' + _0x227635 + ']\x20Disconnected');
            } catch (_0x246c31) {
                console['error']('Failed\x20to\x20disconnect\x20clone\x20' + _0x227635 + ':', _0x246c31['message']);
            }
        }
        await deleteCloneFromMainDB(_0x227635);
        const _0x4a9946 = _0x0_0x38f144['join'](process['cwd'](), 'session', 'clones', _0x227635);
        if (_0x0_0xbb80a4['existsSync'](_0x4a9946)) {
            _0x0_0xbb80a4['rmSync'](_0x4a9946, {
                'recursive': !![],
                'force': !![]
            });
        }
        return { 'success': !![] };
    } catch (_0x413215) {
        console['error']('Failed\x20to\x20delete\x20clone\x20' + _0x227635 + ':', _0x413215['message']);
        return {
            'success': ![],
            'error': _0x413215['message']
        };
    }
}
export async function checkAndCleanExpiredClones() {
    try {
        const _0x27da45 = await getAllClonesFromMainDB();
        const _0x30bf85 = Date['now']();
        let _0x251777 = 0x0;
        for (const _0x14d441 of _0x27da45) {
            if (_0x14d441['expiresAt'] && _0x14d441['expiresAt'] < _0x30bf85 && !_0x14d441['expired']) {
                console['log']('🧹\x20Cleaning\x20expired\x20clone:\x20' + _0x14d441['authId'] + '\x20(' + _0x14d441['phoneNumber'] + ')');
                await deleteClone(_0x14d441['authId']);
                _0x251777++;
            }
        }
        if (_0x251777 > 0x0) {
            console['log']('✅\x20Cleaned\x20' + _0x251777 + '\x20expired\x20clones');
        }
        return _0x251777;
    } catch (_0x5c9595) {
        console['error']('Failed\x20to\x20check\x20expired\x20clones:', _0x5c9595['message']);
        return 0x0;
    }
}
export async function isCloneOwner(_0x2fd885, _0x1002e8) {
    try {
        const _0x56da8e = await getAllClonesFromMainDB();
        const _0x5adc79 = _0x56da8e['find'](_0x230e45 => _0x230e45['authId'] === _0x1002e8);
        if (!_0x5adc79)
            return ![];
        const _0x13b5fd = _0x2fd885['split']('@')[0x0];
        return _0x5adc79['phoneNumber'] === _0x13b5fd;
    } catch (_0xd76a01) {
        console['error']('Check\x20clone\x20owner\x20error:', _0xd76a01['message']);
        return ![];
    }
}