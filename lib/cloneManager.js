import _0x0_0x5c0895, {
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    Browsers
} from '@whiskeysockets/baileys';
import _0x0_0x11a724 from 'node-cache';
import _0x0_0x3e30e8 from 'pino';
import _0x0_0x5881d2 from 'fs';
import _0x0_0x12e0fb, { dirname } from 'path';
import { fileURLToPath } from 'url';
import _0x0_0x3b9a01 from './lightweight_store.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
if (!global['conns'])
    global['conns'] = [];
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL);
export function generateSessionId(_0x61ed1d = 0x6, _0x117058 = 0x4) {
    const _0x226534 = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let _0x5d8141 = '';
    for (let _0x822dde = 0x0; _0x822dde < _0x61ed1d; _0x822dde++) {
        _0x5d8141 += _0x226534['charAt'](Math['floor'](Math['random']() * _0x226534['length']));
    }
    const _0x4a6bae = String(Math['floor'](Math['random']() * Math['pow'](0xa, _0x117058)))['padStart'](_0x117058, '0');
    return 'NOVA' + _0x5d8141 + _0x4a6bae;
}
export async function saveCloneToMainDB(_0x278efe, _0xae39d7, _0x2fed2c, _0x53f625, _0x4d56b4, _0x4d9842 = null) {
    try {
        let _0x4a410c = null;
        if (_0x4d9842 && _0x4d9842 > 0x0) {
            _0x4a410c = Date['now']() + _0x4d9842 * 0x18 * 0x3c * 0x3c * 0x3e8;
        }
        const _0x592ccd = {
            'phoneNumber': _0xae39d7,
            'dbUrl': _0x2fed2c || 'local',
            'dbType': _0x53f625 || 'local',
            'status': _0x4d56b4 || 'configured',
            'createdAt': Date['now'](),
            'updatedAt': Date['now'](),
            'expiryDays': _0x4d9842 || null,
            'expiresAt': _0x4a410c,
            'expired': ![]
        };
        if (HAS_DB) {
            await _0x0_0x3b9a01['saveSetting']('clones', _0x278efe, _0x592ccd);
            console['log']('✅\x20[Clone\x20' + _0x278efe + ']\x20Saved\x20to\x20main\x20database' + (_0x4d9842 ? '\x20(expires\x20in\x20' + _0x4d9842 + '\x20days)' : ''));
        } else {
            const _0x416f69 = _0x0_0x12e0fb['join'](process['cwd'](), 'session', 'clones');
            if (!_0x0_0x5881d2['existsSync'](_0x416f69)) {
                _0x0_0x5881d2['mkdirSync'](_0x416f69, { 'recursive': !![] });
            }
            _0x0_0x5881d2['writeFileSync'](_0x0_0x12e0fb['join'](_0x416f69, _0x278efe + '.json'), JSON['stringify'](_0x592ccd, null, 0x2));
            console['log']('✅\x20[Clone\x20' + _0x278efe + ']\x20Saved\x20locally' + (_0x4d9842 ? '\x20(expires\x20in\x20' + _0x4d9842 + '\x20days)' : ''));
        }
        return !![];
    } catch (_0x354c3e) {
        console['error']('❌\x20Failed\x20to\x20save\x20clone\x20' + _0x278efe + ':', _0x354c3e['message']);
        return ![];
    }
}
export async function getAllClonesFromMainDB() {
    try {
        let _0x2177d9 = [];
        if (HAS_DB) {
            const _0x1a88b8 = await _0x0_0x3b9a01['getSetting']('clones', 'all') || {};
            _0x2177d9 = Object['entries'](_0x1a88b8)['map'](([_0x1bcc57, _0x2315b4]) => ({
                'authId': _0x1bcc57,
                'phoneNumber': _0x2315b4['phoneNumber'],
                'dbType': _0x2315b4['dbType'] || 'local',
                'status': _0x2315b4['status'] || 'unknown',
                'createdAt': _0x2315b4['createdAt'],
                'updatedAt': _0x2315b4['updatedAt'],
                'expiryDays': _0x2315b4['expiryDays'] || null,
                'expiresAt': _0x2315b4['expiresAt'] || null,
                'expired': _0x2315b4['expired'] || ![]
            }));
        } else {
            const _0x3f55b3 = _0x0_0x12e0fb['join'](process['cwd'](), 'session', 'clones');
            if (!_0x0_0x5881d2['existsSync'](_0x3f55b3))
                return [];
            const _0x477a57 = _0x0_0x5881d2['readdirSync'](_0x3f55b3)['filter'](_0x55441b => _0x55441b['endsWith']('.json'));
            for (const _0x465330 of _0x477a57) {
                const _0x3e865b = _0x465330['replace']('.json', '');
                const _0x281d2a = JSON['parse'](_0x0_0x5881d2['readFileSync'](_0x0_0x12e0fb['join'](_0x3f55b3, _0x465330), 'utf-8'));
                _0x2177d9['push']({
                    'authId': _0x3e865b,
                    'phoneNumber': _0x281d2a['phoneNumber'],
                    'dbType': _0x281d2a['dbType'] || 'local',
                    'status': _0x281d2a['status'] || 'unknown',
                    'createdAt': _0x281d2a['createdAt'],
                    'updatedAt': _0x281d2a['updatedAt'],
                    'expiryDays': _0x281d2a['expiryDays'] || null,
                    'expiresAt': _0x281d2a['expiresAt'] || null,
                    'expired': _0x281d2a['expired'] || ![]
                });
            }
        }
        const _0x2a7d4f = Date['now']();
        for (const _0xc346b3 of _0x2177d9) {
            if (_0xc346b3['expiresAt'] && _0xc346b3['expiresAt'] < _0x2a7d4f && !_0xc346b3['expired']) {
                _0xc346b3['expired'] = !![];
                _0xc346b3['status'] = 'expired';
                await updateCloneStatus(_0xc346b3['authId'], 'expired', !![]);
            }
        }
        return _0x2177d9;
    } catch (_0x2d9948) {
        console['error']('Failed\x20to\x20get\x20all\x20clones:', _0x2d9948['message']);
        return [];
    }
}
async function updateCloneStatus(_0x1fc9cd, _0x5ba7a4, _0x3d95f9 = ![]) {
    try {
        let _0x2e330e = null;
        if (HAS_DB) {
            _0x2e330e = await _0x0_0x3b9a01['getSetting']('clones', _0x1fc9cd);
        } else {
            const _0x33ade4 = _0x0_0x12e0fb['join'](process['cwd'](), 'session', 'clones');
            const _0x298450 = _0x0_0x12e0fb['join'](_0x33ade4, _0x1fc9cd + '.json');
            if (_0x0_0x5881d2['existsSync'](_0x298450)) {
                _0x2e330e = JSON['parse'](_0x0_0x5881d2['readFileSync'](_0x298450, 'utf-8'));
            }
        }
        if (_0x2e330e) {
            _0x2e330e['status'] = _0x5ba7a4;
            _0x2e330e['expired'] = _0x3d95f9;
            _0x2e330e['updatedAt'] = Date['now']();
            if (HAS_DB) {
                await _0x0_0x3b9a01['saveSetting']('clones', _0x1fc9cd, _0x2e330e);
            } else {
                const _0x275b44 = _0x0_0x12e0fb['join'](process['cwd'](), 'session', 'clones');
                const _0x3360a0 = _0x0_0x12e0fb['join'](_0x275b44, _0x1fc9cd + '.json');
                _0x0_0x5881d2['writeFileSync'](_0x3360a0, JSON['stringify'](_0x2e330e, null, 0x2));
            }
        }
    } catch (_0x11b220) {
        console['error']('Failed\x20to\x20update\x20clone\x20status\x20' + _0x1fc9cd + ':', _0x11b220['message']);
    }
}
export async function getCloneByPhoneNumber(_0x2892f6) {
    const _0x530834 = await getAllClonesFromMainDB();
    return _0x530834['filter'](_0x119442 => _0x119442['phoneNumber'] === _0x2892f6);
}
export async function deleteCloneFromMainDB(_0x277ce1) {
    try {
        if (HAS_DB) {
            await _0x0_0x3b9a01['saveSetting']('clones', _0x277ce1, null);
        } else {
            const _0x463623 = _0x0_0x12e0fb['join'](process['cwd'](), 'session', 'clones');
            const _0x29ffcd = _0x0_0x12e0fb['join'](_0x463623, _0x277ce1 + '.json');
            if (_0x0_0x5881d2['existsSync'](_0x29ffcd)) {
                _0x0_0x5881d2['unlinkSync'](_0x29ffcd);
            }
        }
        console['log']('✅\x20[Clone\x20' + _0x277ce1 + ']\x20Removed\x20from\x20main\x20database');
        return !![];
    } catch (_0x4a042f) {
        console['error']('Failed\x20to\x20delete\x20clone\x20' + _0x277ce1 + ':', _0x4a042f['message']);
        return ![];
    }
}
export async function startClone(_0x2e29cc, _0xdba864, _0x2e8ab6, _0x3643c2, _0x20560d, _0x5b4cb4, _0x4450f5, _0x29f680) {
    try {
        const {
            state: _0x3d1c29,
            saveCreds: _0x52401d
        } = await useMultiFileAuthState(_0x2e29cc);
        const {version: _0xe1f058} = await fetchLatestBaileysVersion();
        const _0xf3c348 = new _0x0_0x11a724();
        const _0x542b1f = _0x0_0x5c0895({
            'version': _0xe1f058,
            'logger': _0x0_0x3e30e8({ 'level': 'silent' }),
            'printQRInTerminal': ![],
            'browser': Browsers['macOS']('Chrome'),
            'auth': {
                'creds': _0x3d1c29['creds'],
                'keys': makeCacheableSignalKeyStore(_0x3d1c29['keys'], _0x0_0x3e30e8({ 'level': 'fatal' }))
            },
            'markOnlineOnConnect': !![],
            'msgRetryCounterCache': _0xf3c348,
            'connectTimeoutMs': 0x1d4c0,
            'defaultQueryTimeoutMs': 0x0,
            'keepAliveIntervalMs': 0x7530,
            'mobile': ![]
        });
        let _0x18177a = null;
        if (!_0x542b1f['authState']['creds']['registered']) {
            await new Promise(_0x300078 => setTimeout(_0x300078, 0x1770));
            try {
                let _0x16fe4d = await _0x542b1f['requestPairingCode'](_0xdba864);
                _0x18177a = _0x16fe4d?.['match'](/.{1,4}/g)?.['join']('-') || _0x16fe4d;
                await saveCloneToMainDB(_0x2e8ab6, _0xdba864, _0x20560d || 'local', _0x3643c2, 'pairing', _0x5b4cb4);
            } catch (_0x1b508f) {
                console['error']('Pairing\x20Error:', _0x1b508f);
                throw new Error('Failed\x20to\x20get\x20pairing\x20code:\x20' + _0x1b508f['message']);
            }
        }
        _0x542b1f['ev']['on']('creds.update', async () => {
            await _0x52401d();
            try {
                const _0x2d16a1 = JSON['parse'](_0x0_0x5881d2['readFileSync'](_0x0_0x12e0fb['join'](_0x2e29cc, 'creds.json'), 'utf-8'));
                await saveCloneToMainDB(_0x2e8ab6, _0xdba864, _0x20560d || 'local', _0x3643c2, 'active', _0x5b4cb4);
            } catch (_0x1b06d1) {
                console['error']('Creds\x20save\x20error:', _0x1b06d1['message']);
            }
        });
        _0x542b1f['ev']['on']('connection.update', async _0x47be99 => {
            const {
                connection: _0x2ed8c4,
                lastDisconnect: _0x17613e
            } = _0x47be99;
            if (_0x2ed8c4 === 'open') {
                global['conns']['push'](_0x542b1f);
                await saveCloneToMainDB(_0x2e8ab6, _0xdba864, _0x20560d || 'local', _0x3643c2, 'online', _0x5b4cb4);
                if (_0x4450f5) {
                    await _0x4450f5(_0x542b1f, _0x2e8ab6, _0xdba864);
                }
            }
            if (_0x2ed8c4 === 'close') {
                const _0x39aa4e = _0x17613e?.['error']?.['output']?.['statusCode'];
                if (_0x39aa4e !== DisconnectReason['loggedOut']) {
                    console['log']('🔄\x20[Clone\x20' + _0x2e8ab6 + ']\x20Reconnecting...');
                    setTimeout(() => startClone(_0x2e29cc, _0xdba864, _0x2e8ab6, _0x3643c2, _0x20560d, _0x5b4cb4, _0x4450f5, _0x29f680), 0x1388);
                } else {
                    await saveCloneToMainDB(_0x2e8ab6, _0xdba864, _0x20560d || 'local', _0x3643c2, 'offline', _0x5b4cb4);
                    const _0x2a088e = global['conns']['indexOf'](_0x542b1f);
                    if (_0x2a088e > -0x1)
                        global['conns']['splice'](_0x2a088e, 0x1);
                    if (_0x29f680) {
                        await _0x29f680(_0x542b1f, _0x2e8ab6, _0xdba864);
                    }
                }
            }
        });
        try {
            const {handleMessages: _0x532c14} = await import('./messageHandler.js');
            _0x542b1f['ev']['on']('messages.upsert', async _0x32c7a5 => {
                await _0x532c14(_0x542b1f, _0x32c7a5);
            });
        } catch (_0x4b72b4) {
            console['error']('Handler\x20linkage\x20failed:', _0x4b72b4['message']);
        }
        return {
            'conn': _0x542b1f,
            'pairingCode': _0x18177a
        };
    } catch (_0x38119a) {
        console['error']('Failed\x20to\x20start\x20clone\x20' + _0x2e8ab6 + ':', _0x38119a['message']);
        throw _0x38119a;
    }
}
export async function deleteClone(_0x48eea8) {
    try {
        const _0x3d02da = global['conns']['findIndex'](_0x3c9924 => {
            try {
                return _0x3c9924['authState']?.['creds']?.['me']?.['id']?.['includes'](_0x48eea8) || _0x3c9924['user']?.['id']?.['includes'](_0x48eea8);
            } catch (_0x17b2d5) {
                return ![];
            }
        });
        if (_0x3d02da > -0x1) {
            try {
                await global['conns'][_0x3d02da]['end']();
                global['conns']['splice'](_0x3d02da, 0x1);
                console['log']('✅\x20[Clone\x20' + _0x48eea8 + ']\x20Disconnected');
            } catch (_0x276e50) {
                console['error']('Failed\x20to\x20disconnect\x20clone\x20' + _0x48eea8 + ':', _0x276e50['message']);
            }
        }
        await deleteCloneFromMainDB(_0x48eea8);
        const _0x586676 = _0x0_0x12e0fb['join'](process['cwd'](), 'session', 'clones', _0x48eea8);
        if (_0x0_0x5881d2['existsSync'](_0x586676)) {
            _0x0_0x5881d2['rmSync'](_0x586676, {
                'recursive': !![],
                'force': !![]
            });
        }
        return { 'success': !![] };
    } catch (_0x10a4fa) {
        console['error']('Failed\x20to\x20delete\x20clone\x20' + _0x48eea8 + ':', _0x10a4fa['message']);
        return {
            'success': ![],
            'error': _0x10a4fa['message']
        };
    }
}
export async function checkAndCleanExpiredClones() {
    try {
        const _0x5e5b5d = await getAllClonesFromMainDB();
        const _0x113d5f = Date['now']();
        let _0x123306 = 0x0;
        for (const _0x3c37fd of _0x5e5b5d) {
            if (_0x3c37fd['expiresAt'] && _0x3c37fd['expiresAt'] < _0x113d5f && !_0x3c37fd['expired']) {
                console['log']('🧹\x20Cleaning\x20expired\x20clone:\x20' + _0x3c37fd['authId'] + '\x20(' + _0x3c37fd['phoneNumber'] + ')');
                await deleteClone(_0x3c37fd['authId']);
                _0x123306++;
            }
        }
        if (_0x123306 > 0x0) {
            console['log']('✅\x20Cleaned\x20' + _0x123306 + '\x20expired\x20clones');
        }
        return _0x123306;
    } catch (_0x2a0012) {
        console['error']('Failed\x20to\x20check\x20expired\x20clones:', _0x2a0012['message']);
        return 0x0;
    }
}
export async function isCloneOwner(_0x40c92d, _0x2eb8e1) {
    try {
        const _0x5a511e = await getAllClonesFromMainDB();
        const _0x3ec221 = _0x5a511e['find'](_0x5f0b9c => _0x5f0b9c['authId'] === _0x2eb8e1);
        if (!_0x3ec221)
            return ![];
        const _0x5bb37b = _0x40c92d['split']('@')[0x0];
        return _0x3ec221['phoneNumber'] === _0x5bb37b;
    } catch (_0x278eca) {
        console['error']('Check\x20clone\x20owner\x20error:', _0x278eca['message']);
        return ![];
    }
}