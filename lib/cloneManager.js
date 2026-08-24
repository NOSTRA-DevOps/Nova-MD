import _0x0_0x487e31, {
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    Browsers
} from '@whiskeysockets/baileys';
import _0x0_0x2b5690 from 'node-cache';
import _0x0_0xb2ae2e from 'pino';
import _0x0_0xb3fb06 from 'fs';
import _0x0_0x30a509, { dirname } from 'path';
import { fileURLToPath } from 'url';
import _0x0_0x1d315f from './lightweight_store.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
if (!global['conns'])
    global['conns'] = [];
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL);
export function generateSessionId(_0x276c9e = 0x6, _0x40a433 = 0x4) {
    const _0xa53992 = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let _0x3ab89a = '';
    for (let _0x285c0 = 0x0; _0x285c0 < _0x276c9e; _0x285c0++) {
        _0x3ab89a += _0xa53992['charAt'](Math['floor'](Math['random']() * _0xa53992['length']));
    }
    const _0x50a43f = String(Math['floor'](Math['random']() * Math['pow'](0xa, _0x40a433)))['padStart'](_0x40a433, '0');
    return 'NOVA' + _0x3ab89a + _0x50a43f;
}
export async function saveCloneToMainDB(_0x444bad, _0x350a9d, _0x444e4a, _0x2f4279, _0x505a3a, _0x56cea7 = null) {
    try {
        let _0x28a451 = null;
        if (_0x56cea7 && _0x56cea7 > 0x0) {
            _0x28a451 = Date['now']() + _0x56cea7 * 0x18 * 0x3c * 0x3c * 0x3e8;
        }
        const _0x107b6b = {
            'phoneNumber': _0x350a9d,
            'dbUrl': _0x444e4a || 'local',
            'dbType': _0x2f4279 || 'local',
            'status': _0x505a3a || 'configured',
            'createdAt': Date['now'](),
            'updatedAt': Date['now'](),
            'expiryDays': _0x56cea7 || null,
            'expiresAt': _0x28a451,
            'expired': ![]
        };
        if (HAS_DB) {
            await _0x0_0x1d315f['saveSetting']('clones', _0x444bad, _0x107b6b);
            console['log']('✅\x20[Clone\x20' + _0x444bad + ']\x20Saved\x20to\x20main\x20database' + (_0x56cea7 ? '\x20(expires\x20in\x20' + _0x56cea7 + '\x20days)' : ''));
        } else {
            const _0x12f5e4 = _0x0_0x30a509['join'](process['cwd'](), 'session', 'clones');
            if (!_0x0_0xb3fb06['existsSync'](_0x12f5e4)) {
                _0x0_0xb3fb06['mkdirSync'](_0x12f5e4, { 'recursive': !![] });
            }
            _0x0_0xb3fb06['writeFileSync'](_0x0_0x30a509['join'](_0x12f5e4, _0x444bad + '.json'), JSON['stringify'](_0x107b6b, null, 0x2));
            console['log']('✅\x20[Clone\x20' + _0x444bad + ']\x20Saved\x20locally' + (_0x56cea7 ? '\x20(expires\x20in\x20' + _0x56cea7 + '\x20days)' : ''));
        }
        return !![];
    } catch (_0x3e3317) {
        console['error']('❌\x20Failed\x20to\x20save\x20clone\x20' + _0x444bad + ':', _0x3e3317['message']);
        return ![];
    }
}
export async function getAllClonesFromMainDB() {
    try {
        let _0x256318 = [];
        if (HAS_DB) {
            const _0x39b40d = await _0x0_0x1d315f['getSetting']('clones', 'all') || {};
            _0x256318 = Object['entries'](_0x39b40d)['map'](([_0x9ec8b4, _0x3371ef]) => ({
                'authId': _0x9ec8b4,
                'phoneNumber': _0x3371ef['phoneNumber'],
                'dbType': _0x3371ef['dbType'] || 'local',
                'status': _0x3371ef['status'] || 'unknown',
                'createdAt': _0x3371ef['createdAt'],
                'updatedAt': _0x3371ef['updatedAt'],
                'expiryDays': _0x3371ef['expiryDays'] || null,
                'expiresAt': _0x3371ef['expiresAt'] || null,
                'expired': _0x3371ef['expired'] || ![]
            }));
        } else {
            const _0x3f206d = _0x0_0x30a509['join'](process['cwd'](), 'session', 'clones');
            if (!_0x0_0xb3fb06['existsSync'](_0x3f206d))
                return [];
            const _0x448f06 = _0x0_0xb3fb06['readdirSync'](_0x3f206d)['filter'](_0x52d8b0 => _0x52d8b0['endsWith']('.json'));
            for (const _0x5e90a6 of _0x448f06) {
                const _0x2f6de9 = _0x5e90a6['replace']('.json', '');
                const _0x4d4592 = JSON['parse'](_0x0_0xb3fb06['readFileSync'](_0x0_0x30a509['join'](_0x3f206d, _0x5e90a6), 'utf-8'));
                _0x256318['push']({
                    'authId': _0x2f6de9,
                    'phoneNumber': _0x4d4592['phoneNumber'],
                    'dbType': _0x4d4592['dbType'] || 'local',
                    'status': _0x4d4592['status'] || 'unknown',
                    'createdAt': _0x4d4592['createdAt'],
                    'updatedAt': _0x4d4592['updatedAt'],
                    'expiryDays': _0x4d4592['expiryDays'] || null,
                    'expiresAt': _0x4d4592['expiresAt'] || null,
                    'expired': _0x4d4592['expired'] || ![]
                });
            }
        }
        const _0xe66665 = Date['now']();
        for (const _0x98d38 of _0x256318) {
            if (_0x98d38['expiresAt'] && _0x98d38['expiresAt'] < _0xe66665 && !_0x98d38['expired']) {
                _0x98d38['expired'] = !![];
                _0x98d38['status'] = 'expired';
                await updateCloneStatus(_0x98d38['authId'], 'expired', !![]);
            }
        }
        return _0x256318;
    } catch (_0x4f93d2) {
        console['error']('Failed\x20to\x20get\x20all\x20clones:', _0x4f93d2['message']);
        return [];
    }
}
async function updateCloneStatus(_0x45956f, _0x105a5d, _0x407bac = ![]) {
    try {
        let _0x5bbaf4 = null;
        if (HAS_DB) {
            _0x5bbaf4 = await _0x0_0x1d315f['getSetting']('clones', _0x45956f);
        } else {
            const _0xbd036b = _0x0_0x30a509['join'](process['cwd'](), 'session', 'clones');
            const _0x226e8c = _0x0_0x30a509['join'](_0xbd036b, _0x45956f + '.json');
            if (_0x0_0xb3fb06['existsSync'](_0x226e8c)) {
                _0x5bbaf4 = JSON['parse'](_0x0_0xb3fb06['readFileSync'](_0x226e8c, 'utf-8'));
            }
        }
        if (_0x5bbaf4) {
            _0x5bbaf4['status'] = _0x105a5d;
            _0x5bbaf4['expired'] = _0x407bac;
            _0x5bbaf4['updatedAt'] = Date['now']();
            if (HAS_DB) {
                await _0x0_0x1d315f['saveSetting']('clones', _0x45956f, _0x5bbaf4);
            } else {
                const _0x422f1a = _0x0_0x30a509['join'](process['cwd'](), 'session', 'clones');
                const _0x2a6afd = _0x0_0x30a509['join'](_0x422f1a, _0x45956f + '.json');
                _0x0_0xb3fb06['writeFileSync'](_0x2a6afd, JSON['stringify'](_0x5bbaf4, null, 0x2));
            }
        }
    } catch (_0x39adb1) {
        console['error']('Failed\x20to\x20update\x20clone\x20status\x20' + _0x45956f + ':', _0x39adb1['message']);
    }
}
export async function getCloneByPhoneNumber(_0x46faa0) {
    const _0x230287 = await getAllClonesFromMainDB();
    return _0x230287['filter'](_0x1b5c72 => _0x1b5c72['phoneNumber'] === _0x46faa0);
}
export async function deleteCloneFromMainDB(_0x2f2ad0) {
    try {
        if (HAS_DB) {
            await _0x0_0x1d315f['saveSetting']('clones', _0x2f2ad0, null);
        } else {
            const _0x319f17 = _0x0_0x30a509['join'](process['cwd'](), 'session', 'clones');
            const _0x1fad5e = _0x0_0x30a509['join'](_0x319f17, _0x2f2ad0 + '.json');
            if (_0x0_0xb3fb06['existsSync'](_0x1fad5e)) {
                _0x0_0xb3fb06['unlinkSync'](_0x1fad5e);
            }
        }
        console['log']('✅\x20[Clone\x20' + _0x2f2ad0 + ']\x20Removed\x20from\x20main\x20database');
        return !![];
    } catch (_0x479522) {
        console['error']('Failed\x20to\x20delete\x20clone\x20' + _0x2f2ad0 + ':', _0x479522['message']);
        return ![];
    }
}
export async function startClone(_0x5caf97, _0x24ea98, _0x3a1b22, _0x5bcd6a, _0x2e4d21, _0x5b5596, _0x5a955c, _0x3cc9d1) {
    try {
        const {
            state: _0x47b252,
            saveCreds: _0x434d38
        } = await useMultiFileAuthState(_0x5caf97);
        const {version: _0x16b8a9} = await fetchLatestBaileysVersion();
        const _0x5ec17d = new _0x0_0x2b5690();
        const _0x8f9463 = _0x0_0x487e31({
            'version': _0x16b8a9,
            'logger': _0x0_0xb2ae2e({ 'level': 'silent' }),
            'printQRInTerminal': ![],
            'browser': Browsers['macOS']('Chrome'),
            'auth': {
                'creds': _0x47b252['creds'],
                'keys': makeCacheableSignalKeyStore(_0x47b252['keys'], _0x0_0xb2ae2e({ 'level': 'fatal' }))
            },
            'markOnlineOnConnect': !![],
            'msgRetryCounterCache': _0x5ec17d,
            'connectTimeoutMs': 0x1d4c0,
            'defaultQueryTimeoutMs': 0x0,
            'keepAliveIntervalMs': 0x7530,
            'mobile': ![]
        });
        let _0x296c29 = null;
        if (!_0x8f9463['authState']['creds']['registered']) {
            await new Promise(_0x3862ae => setTimeout(_0x3862ae, 0x1770));
            try {
                let _0x54f678 = await _0x8f9463['requestPairingCode'](_0x24ea98);
                _0x296c29 = _0x54f678?.['match'](/.{1,4}/g)?.['join']('-') || _0x54f678;
                await saveCloneToMainDB(_0x3a1b22, _0x24ea98, _0x2e4d21 || 'local', _0x5bcd6a, 'pairing', _0x5b5596);
            } catch (_0x17a669) {
                console['error']('Pairing\x20Error:', _0x17a669);
                throw new Error('Failed\x20to\x20get\x20pairing\x20code:\x20' + _0x17a669['message']);
            }
        }
        _0x8f9463['ev']['on']('creds.update', async () => {
            await _0x434d38();
            try {
                const _0x2d774d = JSON['parse'](_0x0_0xb3fb06['readFileSync'](_0x0_0x30a509['join'](_0x5caf97, 'creds.json'), 'utf-8'));
                await saveCloneToMainDB(_0x3a1b22, _0x24ea98, _0x2e4d21 || 'local', _0x5bcd6a, 'active', _0x5b5596);
            } catch (_0x10f51b) {
                console['error']('Creds\x20save\x20error:', _0x10f51b['message']);
            }
        });
        _0x8f9463['ev']['on']('connection.update', async _0x1f89c3 => {
            const {
                connection: _0x1084db,
                lastDisconnect: _0x2167d9
            } = _0x1f89c3;
            if (_0x1084db === 'open') {
                global['conns']['push'](_0x8f9463);
                await saveCloneToMainDB(_0x3a1b22, _0x24ea98, _0x2e4d21 || 'local', _0x5bcd6a, 'online', _0x5b5596);
                if (_0x5a955c) {
                    await _0x5a955c(_0x8f9463, _0x3a1b22, _0x24ea98);
                }
            }
            if (_0x1084db === 'close') {
                const _0x292363 = _0x2167d9?.['error']?.['output']?.['statusCode'];
                if (_0x292363 !== DisconnectReason['loggedOut']) {
                    console['log']('🔄\x20[Clone\x20' + _0x3a1b22 + ']\x20Reconnecting...');
                    setTimeout(() => startClone(_0x5caf97, _0x24ea98, _0x3a1b22, _0x5bcd6a, _0x2e4d21, _0x5b5596, _0x5a955c, _0x3cc9d1), 0x1388);
                } else {
                    await saveCloneToMainDB(_0x3a1b22, _0x24ea98, _0x2e4d21 || 'local', _0x5bcd6a, 'offline', _0x5b5596);
                    const _0x1c0976 = global['conns']['indexOf'](_0x8f9463);
                    if (_0x1c0976 > -0x1)
                        global['conns']['splice'](_0x1c0976, 0x1);
                    if (_0x3cc9d1) {
                        await _0x3cc9d1(_0x8f9463, _0x3a1b22, _0x24ea98);
                    }
                }
            }
        });
        try {
            const {handleMessages: _0x21c2e4} = await import('./messageHandler.js');
            _0x8f9463['ev']['on']('messages.upsert', async _0x48883b => {
                await _0x21c2e4(_0x8f9463, _0x48883b);
            });
        } catch (_0x279dda) {
            console['error']('Handler\x20linkage\x20failed:', _0x279dda['message']);
        }
        return {
            'conn': _0x8f9463,
            'pairingCode': _0x296c29
        };
    } catch (_0x238960) {
        console['error']('Failed\x20to\x20start\x20clone\x20' + _0x3a1b22 + ':', _0x238960['message']);
        throw _0x238960;
    }
}
export async function deleteClone(_0x4da94d) {
    try {
        const _0x5db6d5 = global['conns']['findIndex'](_0x40787d => {
            try {
                return _0x40787d['authState']?.['creds']?.['me']?.['id']?.['includes'](_0x4da94d) || _0x40787d['user']?.['id']?.['includes'](_0x4da94d);
            } catch (_0xaf447f) {
                return ![];
            }
        });
        if (_0x5db6d5 > -0x1) {
            try {
                await global['conns'][_0x5db6d5]['end']();
                global['conns']['splice'](_0x5db6d5, 0x1);
                console['log']('✅\x20[Clone\x20' + _0x4da94d + ']\x20Disconnected');
            } catch (_0x43026b) {
                console['error']('Failed\x20to\x20disconnect\x20clone\x20' + _0x4da94d + ':', _0x43026b['message']);
            }
        }
        await deleteCloneFromMainDB(_0x4da94d);
        const _0x320a2d = _0x0_0x30a509['join'](process['cwd'](), 'session', 'clones', _0x4da94d);
        if (_0x0_0xb3fb06['existsSync'](_0x320a2d)) {
            _0x0_0xb3fb06['rmSync'](_0x320a2d, {
                'recursive': !![],
                'force': !![]
            });
        }
        return { 'success': !![] };
    } catch (_0x4013a9) {
        console['error']('Failed\x20to\x20delete\x20clone\x20' + _0x4da94d + ':', _0x4013a9['message']);
        return {
            'success': ![],
            'error': _0x4013a9['message']
        };
    }
}
export async function checkAndCleanExpiredClones() {
    try {
        const _0x7a61be = await getAllClonesFromMainDB();
        const _0x4c3190 = Date['now']();
        let _0x59ff6a = 0x0;
        for (const _0x398cbe of _0x7a61be) {
            if (_0x398cbe['expiresAt'] && _0x398cbe['expiresAt'] < _0x4c3190 && !_0x398cbe['expired']) {
                console['log']('🧹\x20Cleaning\x20expired\x20clone:\x20' + _0x398cbe['authId'] + '\x20(' + _0x398cbe['phoneNumber'] + ')');
                await deleteClone(_0x398cbe['authId']);
                _0x59ff6a++;
            }
        }
        if (_0x59ff6a > 0x0) {
            console['log']('✅\x20Cleaned\x20' + _0x59ff6a + '\x20expired\x20clones');
        }
        return _0x59ff6a;
    } catch (_0x413409) {
        console['error']('Failed\x20to\x20check\x20expired\x20clones:', _0x413409['message']);
        return 0x0;
    }
}
export async function isCloneOwner(_0x159527, _0x19c2ec) {
    try {
        const _0x24655f = await getAllClonesFromMainDB();
        const _0x471e96 = _0x24655f['find'](_0x37c4a4 => _0x37c4a4['authId'] === _0x19c2ec);
        if (!_0x471e96)
            return ![];
        const _0x24b80c = _0x159527['split']('@')[0x0];
        return _0x471e96['phoneNumber'] === _0x24b80c;
    } catch (_0x481bd3) {
        console['error']('Check\x20clone\x20owner\x20error:', _0x481bd3['message']);
        return ![];
    }
}