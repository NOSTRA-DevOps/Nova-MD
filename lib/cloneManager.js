import _0x0_0x3105d5, {
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    Browsers
} from '@whiskeysockets/baileys';
import _0x0_0x3e43ff from 'node-cache';
import _0x0_0x15762b from 'pino';
import _0x0_0x2fd9d9 from 'fs';
import _0x0_0x565268, { dirname } from 'path';
import { fileURLToPath } from 'url';
import _0x0_0xc7b8eb from './lightweight_store.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
if (!global['conns'])
    global['conns'] = [];
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL);
export function generateSessionId(_0x5d39bf = 0x6, _0x171b7b = 0x4) {
    const _0x2e0ac4 = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let _0xd69d9e = '';
    for (let _0x39199d = 0x0; _0x39199d < _0x5d39bf; _0x39199d++) {
        _0xd69d9e += _0x2e0ac4['charAt'](Math['floor'](Math['random']() * _0x2e0ac4['length']));
    }
    const _0x272a3c = String(Math['floor'](Math['random']() * Math['pow'](0xa, _0x171b7b)))['padStart'](_0x171b7b, '0');
    return 'NOVA' + _0xd69d9e + _0x272a3c;
}
export async function saveCloneToMainDB(_0x329775, _0x4eff12, _0x118e53, _0x140f18, _0x507822, _0x3f3bc6 = null) {
    try {
        let _0x2f9190 = null;
        if (_0x3f3bc6 && _0x3f3bc6 > 0x0) {
            _0x2f9190 = Date['now']() + _0x3f3bc6 * 0x18 * 0x3c * 0x3c * 0x3e8;
        }
        const _0xa38e73 = {
            'phoneNumber': _0x4eff12,
            'dbUrl': _0x118e53 || 'local',
            'dbType': _0x140f18 || 'local',
            'status': _0x507822 || 'configured',
            'createdAt': Date['now'](),
            'updatedAt': Date['now'](),
            'expiryDays': _0x3f3bc6 || null,
            'expiresAt': _0x2f9190,
            'expired': ![]
        };
        if (HAS_DB) {
            await _0x0_0xc7b8eb['saveSetting']('clones', _0x329775, _0xa38e73);
            console['log']('✅\x20[Clone\x20' + _0x329775 + ']\x20Saved\x20to\x20main\x20database' + (_0x3f3bc6 ? '\x20(expires\x20in\x20' + _0x3f3bc6 + '\x20days)' : ''));
        } else {
            const _0x72f85d = _0x0_0x565268['join'](process['cwd'](), 'session', 'clones');
            if (!_0x0_0x2fd9d9['existsSync'](_0x72f85d)) {
                _0x0_0x2fd9d9['mkdirSync'](_0x72f85d, { 'recursive': !![] });
            }
            _0x0_0x2fd9d9['writeFileSync'](_0x0_0x565268['join'](_0x72f85d, _0x329775 + '.json'), JSON['stringify'](_0xa38e73, null, 0x2));
            console['log']('✅\x20[Clone\x20' + _0x329775 + ']\x20Saved\x20locally' + (_0x3f3bc6 ? '\x20(expires\x20in\x20' + _0x3f3bc6 + '\x20days)' : ''));
        }
        return !![];
    } catch (_0x4535ff) {
        console['error']('❌\x20Failed\x20to\x20save\x20clone\x20' + _0x329775 + ':', _0x4535ff['message']);
        return ![];
    }
}
export async function getAllClonesFromMainDB() {
    try {
        let _0x448296 = [];
        if (HAS_DB) {
            const _0x3aa9b3 = await _0x0_0xc7b8eb['getSetting']('clones', 'all') || {};
            _0x448296 = Object['entries'](_0x3aa9b3)['map'](([_0x3d4c09, _0x2416ef]) => ({
                'authId': _0x3d4c09,
                'phoneNumber': _0x2416ef['phoneNumber'],
                'dbType': _0x2416ef['dbType'] || 'local',
                'status': _0x2416ef['status'] || 'unknown',
                'createdAt': _0x2416ef['createdAt'],
                'updatedAt': _0x2416ef['updatedAt'],
                'expiryDays': _0x2416ef['expiryDays'] || null,
                'expiresAt': _0x2416ef['expiresAt'] || null,
                'expired': _0x2416ef['expired'] || ![]
            }));
        } else {
            const _0x554e75 = _0x0_0x565268['join'](process['cwd'](), 'session', 'clones');
            if (!_0x0_0x2fd9d9['existsSync'](_0x554e75))
                return [];
            const _0x49dcbe = _0x0_0x2fd9d9['readdirSync'](_0x554e75)['filter'](_0x41aae8 => _0x41aae8['endsWith']('.json'));
            for (const _0x3b23c6 of _0x49dcbe) {
                const _0x1327be = _0x3b23c6['replace']('.json', '');
                const _0x230c11 = JSON['parse'](_0x0_0x2fd9d9['readFileSync'](_0x0_0x565268['join'](_0x554e75, _0x3b23c6), 'utf-8'));
                _0x448296['push']({
                    'authId': _0x1327be,
                    'phoneNumber': _0x230c11['phoneNumber'],
                    'dbType': _0x230c11['dbType'] || 'local',
                    'status': _0x230c11['status'] || 'unknown',
                    'createdAt': _0x230c11['createdAt'],
                    'updatedAt': _0x230c11['updatedAt'],
                    'expiryDays': _0x230c11['expiryDays'] || null,
                    'expiresAt': _0x230c11['expiresAt'] || null,
                    'expired': _0x230c11['expired'] || ![]
                });
            }
        }
        const _0xf3a56a = Date['now']();
        for (const _0x819b5c of _0x448296) {
            if (_0x819b5c['expiresAt'] && _0x819b5c['expiresAt'] < _0xf3a56a && !_0x819b5c['expired']) {
                _0x819b5c['expired'] = !![];
                _0x819b5c['status'] = 'expired';
                await updateCloneStatus(_0x819b5c['authId'], 'expired', !![]);
            }
        }
        return _0x448296;
    } catch (_0x1c6700) {
        console['error']('Failed\x20to\x20get\x20all\x20clones:', _0x1c6700['message']);
        return [];
    }
}
async function updateCloneStatus(_0x3c0307, _0x1a0dc3, _0x1de1c0 = ![]) {
    try {
        let _0x273eff = null;
        if (HAS_DB) {
            _0x273eff = await _0x0_0xc7b8eb['getSetting']('clones', _0x3c0307);
        } else {
            const _0x263dc1 = _0x0_0x565268['join'](process['cwd'](), 'session', 'clones');
            const _0x9c712b = _0x0_0x565268['join'](_0x263dc1, _0x3c0307 + '.json');
            if (_0x0_0x2fd9d9['existsSync'](_0x9c712b)) {
                _0x273eff = JSON['parse'](_0x0_0x2fd9d9['readFileSync'](_0x9c712b, 'utf-8'));
            }
        }
        if (_0x273eff) {
            _0x273eff['status'] = _0x1a0dc3;
            _0x273eff['expired'] = _0x1de1c0;
            _0x273eff['updatedAt'] = Date['now']();
            if (HAS_DB) {
                await _0x0_0xc7b8eb['saveSetting']('clones', _0x3c0307, _0x273eff);
            } else {
                const _0x4e447d = _0x0_0x565268['join'](process['cwd'](), 'session', 'clones');
                const _0x16b348 = _0x0_0x565268['join'](_0x4e447d, _0x3c0307 + '.json');
                _0x0_0x2fd9d9['writeFileSync'](_0x16b348, JSON['stringify'](_0x273eff, null, 0x2));
            }
        }
    } catch (_0x56fe00) {
        console['error']('Failed\x20to\x20update\x20clone\x20status\x20' + _0x3c0307 + ':', _0x56fe00['message']);
    }
}
export async function getCloneByPhoneNumber(_0x36945b) {
    const _0x3421c2 = await getAllClonesFromMainDB();
    return _0x3421c2['filter'](_0x4c82a4 => _0x4c82a4['phoneNumber'] === _0x36945b);
}
export async function deleteCloneFromMainDB(_0x55260d) {
    try {
        if (HAS_DB) {
            await _0x0_0xc7b8eb['saveSetting']('clones', _0x55260d, null);
        } else {
            const _0x3120e6 = _0x0_0x565268['join'](process['cwd'](), 'session', 'clones');
            const _0x5fb93a = _0x0_0x565268['join'](_0x3120e6, _0x55260d + '.json');
            if (_0x0_0x2fd9d9['existsSync'](_0x5fb93a)) {
                _0x0_0x2fd9d9['unlinkSync'](_0x5fb93a);
            }
        }
        console['log']('✅\x20[Clone\x20' + _0x55260d + ']\x20Removed\x20from\x20main\x20database');
        return !![];
    } catch (_0x1a0362) {
        console['error']('Failed\x20to\x20delete\x20clone\x20' + _0x55260d + ':', _0x1a0362['message']);
        return ![];
    }
}
export async function startClone(_0x5b2c87, _0x2dbcfa, _0x2f9c1b, _0xb09837, _0x28dbdb, _0x273881, _0x1b190a, _0x43df01) {
    try {
        const {
            state: _0x3203e7,
            saveCreds: _0x5a9634
        } = await useMultiFileAuthState(_0x5b2c87);
        const {version: _0x165579} = await fetchLatestBaileysVersion();
        const _0x3e0827 = new _0x0_0x3e43ff();
        const _0x2e8685 = _0x0_0x3105d5({
            'version': _0x165579,
            'logger': _0x0_0x15762b({ 'level': 'silent' }),
            'printQRInTerminal': ![],
            'browser': Browsers['macOS']('Chrome'),
            'auth': {
                'creds': _0x3203e7['creds'],
                'keys': makeCacheableSignalKeyStore(_0x3203e7['keys'], _0x0_0x15762b({ 'level': 'fatal' }))
            },
            'markOnlineOnConnect': !![],
            'msgRetryCounterCache': _0x3e0827,
            'connectTimeoutMs': 0x1d4c0,
            'defaultQueryTimeoutMs': 0x0,
            'keepAliveIntervalMs': 0x7530,
            'mobile': ![]
        });
        let _0xd4302e = null;
        if (!_0x2e8685['authState']['creds']['registered']) {
            await new Promise(_0x2cf5be => setTimeout(_0x2cf5be, 0x1770));
            try {
                let _0xed5ed1 = await _0x2e8685['requestPairingCode'](_0x2dbcfa);
                _0xd4302e = _0xed5ed1?.['match'](/.{1,4}/g)?.['join']('-') || _0xed5ed1;
                await saveCloneToMainDB(_0x2f9c1b, _0x2dbcfa, _0x28dbdb || 'local', _0xb09837, 'pairing', _0x273881);
            } catch (_0x5d557f) {
                console['error']('Pairing\x20Error:', _0x5d557f);
                throw new Error('Failed\x20to\x20get\x20pairing\x20code:\x20' + _0x5d557f['message']);
            }
        }
        _0x2e8685['ev']['on']('creds.update', async () => {
            await _0x5a9634();
            try {
                const _0x440edc = JSON['parse'](_0x0_0x2fd9d9['readFileSync'](_0x0_0x565268['join'](_0x5b2c87, 'creds.json'), 'utf-8'));
                await saveCloneToMainDB(_0x2f9c1b, _0x2dbcfa, _0x28dbdb || 'local', _0xb09837, 'active', _0x273881);
            } catch (_0x5bbcdf) {
                console['error']('Creds\x20save\x20error:', _0x5bbcdf['message']);
            }
        });
        _0x2e8685['ev']['on']('connection.update', async _0x2b408b => {
            const {
                connection: _0x4c443a,
                lastDisconnect: _0x435da1
            } = _0x2b408b;
            if (_0x4c443a === 'open') {
                global['conns']['push'](_0x2e8685);
                await saveCloneToMainDB(_0x2f9c1b, _0x2dbcfa, _0x28dbdb || 'local', _0xb09837, 'online', _0x273881);
                if (_0x1b190a) {
                    await _0x1b190a(_0x2e8685, _0x2f9c1b, _0x2dbcfa);
                }
            }
            if (_0x4c443a === 'close') {
                const _0x18b765 = _0x435da1?.['error']?.['output']?.['statusCode'];
                if (_0x18b765 !== DisconnectReason['loggedOut']) {
                    console['log']('🔄\x20[Clone\x20' + _0x2f9c1b + ']\x20Reconnecting...');
                    setTimeout(() => startClone(_0x5b2c87, _0x2dbcfa, _0x2f9c1b, _0xb09837, _0x28dbdb, _0x273881, _0x1b190a, _0x43df01), 0x1388);
                } else {
                    await saveCloneToMainDB(_0x2f9c1b, _0x2dbcfa, _0x28dbdb || 'local', _0xb09837, 'offline', _0x273881);
                    const _0x2f6ff8 = global['conns']['indexOf'](_0x2e8685);
                    if (_0x2f6ff8 > -0x1)
                        global['conns']['splice'](_0x2f6ff8, 0x1);
                    if (_0x43df01) {
                        await _0x43df01(_0x2e8685, _0x2f9c1b, _0x2dbcfa);
                    }
                }
            }
        });
        try {
            const {handleMessages: _0x29a866} = await import('./messageHandler.js');
            _0x2e8685['ev']['on']('messages.upsert', async _0x398e57 => {
                await _0x29a866(_0x2e8685, _0x398e57);
            });
        } catch (_0x4638ac) {
            console['error']('Handler\x20linkage\x20failed:', _0x4638ac['message']);
        }
        return {
            'conn': _0x2e8685,
            'pairingCode': _0xd4302e
        };
    } catch (_0x58e871) {
        console['error']('Failed\x20to\x20start\x20clone\x20' + _0x2f9c1b + ':', _0x58e871['message']);
        throw _0x58e871;
    }
}
export async function deleteClone(_0x10bd83) {
    try {
        const _0x460b75 = global['conns']['findIndex'](_0x452c53 => {
            try {
                return _0x452c53['authState']?.['creds']?.['me']?.['id']?.['includes'](_0x10bd83) || _0x452c53['user']?.['id']?.['includes'](_0x10bd83);
            } catch (_0x412039) {
                return ![];
            }
        });
        if (_0x460b75 > -0x1) {
            try {
                await global['conns'][_0x460b75]['end']();
                global['conns']['splice'](_0x460b75, 0x1);
                console['log']('✅\x20[Clone\x20' + _0x10bd83 + ']\x20Disconnected');
            } catch (_0x881bac) {
                console['error']('Failed\x20to\x20disconnect\x20clone\x20' + _0x10bd83 + ':', _0x881bac['message']);
            }
        }
        await deleteCloneFromMainDB(_0x10bd83);
        const _0x6ed1e3 = _0x0_0x565268['join'](process['cwd'](), 'session', 'clones', _0x10bd83);
        if (_0x0_0x2fd9d9['existsSync'](_0x6ed1e3)) {
            _0x0_0x2fd9d9['rmSync'](_0x6ed1e3, {
                'recursive': !![],
                'force': !![]
            });
        }
        return { 'success': !![] };
    } catch (_0x10a95d) {
        console['error']('Failed\x20to\x20delete\x20clone\x20' + _0x10bd83 + ':', _0x10a95d['message']);
        return {
            'success': ![],
            'error': _0x10a95d['message']
        };
    }
}
export async function checkAndCleanExpiredClones() {
    try {
        const _0x378c85 = await getAllClonesFromMainDB();
        const _0x4f12ec = Date['now']();
        let _0x412fbf = 0x0;
        for (const _0x936282 of _0x378c85) {
            if (_0x936282['expiresAt'] && _0x936282['expiresAt'] < _0x4f12ec && !_0x936282['expired']) {
                console['log']('🧹\x20Cleaning\x20expired\x20clone:\x20' + _0x936282['authId'] + '\x20(' + _0x936282['phoneNumber'] + ')');
                await deleteClone(_0x936282['authId']);
                _0x412fbf++;
            }
        }
        if (_0x412fbf > 0x0) {
            console['log']('✅\x20Cleaned\x20' + _0x412fbf + '\x20expired\x20clones');
        }
        return _0x412fbf;
    } catch (_0x239644) {
        console['error']('Failed\x20to\x20check\x20expired\x20clones:', _0x239644['message']);
        return 0x0;
    }
}
export async function isCloneOwner(_0x3e9a3c, _0x3d9f74) {
    try {
        const _0x54ecd3 = await getAllClonesFromMainDB();
        const _0x57b1c0 = _0x54ecd3['find'](_0x4993f3 => _0x4993f3['authId'] === _0x3d9f74);
        if (!_0x57b1c0)
            return ![];
        const _0x2ba609 = _0x3e9a3c['split']('@')[0x0];
        return _0x57b1c0['phoneNumber'] === _0x2ba609;
    } catch (_0x168142) {
        console['error']('Check\x20clone\x20owner\x20error:', _0x168142['message']);
        return ![];
    }
}