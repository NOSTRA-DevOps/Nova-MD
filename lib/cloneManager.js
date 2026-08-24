import _0x0_0x2f21d7, {
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    Browsers
} from '@whiskeysockets/baileys';
import _0x0_0x5257f2 from 'node-cache';
import _0x0_0x2162ca from 'pino';
import _0x0_0x37017e from 'fs';
import _0x0_0x5176f8, { dirname } from 'path';
import { fileURLToPath } from 'url';
import _0x0_0x3ae372 from './lightweight_store.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
if (!global['conns'])
    global['conns'] = [];
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL);
export function generateSessionId(_0x56a97e = 0x6, _0xa53911 = 0x4) {
    const _0x217d33 = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let _0x5a5cb4 = '';
    for (let _0x3c1e75 = 0x0; _0x3c1e75 < _0x56a97e; _0x3c1e75++) {
        _0x5a5cb4 += _0x217d33['charAt'](Math['floor'](Math['random']() * _0x217d33['length']));
    }
    const _0x589a89 = String(Math['floor'](Math['random']() * Math['pow'](0xa, _0xa53911)))['padStart'](_0xa53911, '0');
    return 'NOVA' + _0x5a5cb4 + _0x589a89;
}
export async function saveCloneToMainDB(_0x26085c, _0x32fefd, _0x5be5e9, _0x306a01, _0x2e547f, _0x5b7e2f = null) {
    try {
        let _0x43f9d0 = null;
        if (_0x5b7e2f && _0x5b7e2f > 0x0) {
            _0x43f9d0 = Date['now']() + _0x5b7e2f * 0x18 * 0x3c * 0x3c * 0x3e8;
        }
        const _0x4d559c = {
            'phoneNumber': _0x32fefd,
            'dbUrl': _0x5be5e9 || 'local',
            'dbType': _0x306a01 || 'local',
            'status': _0x2e547f || 'configured',
            'createdAt': Date['now'](),
            'updatedAt': Date['now'](),
            'expiryDays': _0x5b7e2f || null,
            'expiresAt': _0x43f9d0,
            'expired': ![]
        };
        if (HAS_DB) {
            await _0x0_0x3ae372['saveSetting']('clones', _0x26085c, _0x4d559c);
            console['log']('✅\x20[Clone\x20' + _0x26085c + ']\x20Saved\x20to\x20main\x20database' + (_0x5b7e2f ? '\x20(expires\x20in\x20' + _0x5b7e2f + '\x20days)' : ''));
        } else {
            const _0x6fa2bb = _0x0_0x5176f8['join'](process['cwd'](), 'session', 'clones');
            if (!_0x0_0x37017e['existsSync'](_0x6fa2bb)) {
                _0x0_0x37017e['mkdirSync'](_0x6fa2bb, { 'recursive': !![] });
            }
            _0x0_0x37017e['writeFileSync'](_0x0_0x5176f8['join'](_0x6fa2bb, _0x26085c + '.json'), JSON['stringify'](_0x4d559c, null, 0x2));
            console['log']('✅\x20[Clone\x20' + _0x26085c + ']\x20Saved\x20locally' + (_0x5b7e2f ? '\x20(expires\x20in\x20' + _0x5b7e2f + '\x20days)' : ''));
        }
        return !![];
    } catch (_0x549ce1) {
        console['error']('❌\x20Failed\x20to\x20save\x20clone\x20' + _0x26085c + ':', _0x549ce1['message']);
        return ![];
    }
}
export async function getAllClonesFromMainDB() {
    try {
        let _0x10a1eb = [];
        if (HAS_DB) {
            const _0x288847 = await _0x0_0x3ae372['getSetting']('clones', 'all') || {};
            _0x10a1eb = Object['entries'](_0x288847)['map'](([_0x1459aa, _0x305384]) => ({
                'authId': _0x1459aa,
                'phoneNumber': _0x305384['phoneNumber'],
                'dbType': _0x305384['dbType'] || 'local',
                'status': _0x305384['status'] || 'unknown',
                'createdAt': _0x305384['createdAt'],
                'updatedAt': _0x305384['updatedAt'],
                'expiryDays': _0x305384['expiryDays'] || null,
                'expiresAt': _0x305384['expiresAt'] || null,
                'expired': _0x305384['expired'] || ![]
            }));
        } else {
            const _0x5712c6 = _0x0_0x5176f8['join'](process['cwd'](), 'session', 'clones');
            if (!_0x0_0x37017e['existsSync'](_0x5712c6))
                return [];
            const _0x568921 = _0x0_0x37017e['readdirSync'](_0x5712c6)['filter'](_0x1d21f0 => _0x1d21f0['endsWith']('.json'));
            for (const _0x248951 of _0x568921) {
                const _0x4d5fba = _0x248951['replace']('.json', '');
                const _0xf29c39 = JSON['parse'](_0x0_0x37017e['readFileSync'](_0x0_0x5176f8['join'](_0x5712c6, _0x248951), 'utf-8'));
                _0x10a1eb['push']({
                    'authId': _0x4d5fba,
                    'phoneNumber': _0xf29c39['phoneNumber'],
                    'dbType': _0xf29c39['dbType'] || 'local',
                    'status': _0xf29c39['status'] || 'unknown',
                    'createdAt': _0xf29c39['createdAt'],
                    'updatedAt': _0xf29c39['updatedAt'],
                    'expiryDays': _0xf29c39['expiryDays'] || null,
                    'expiresAt': _0xf29c39['expiresAt'] || null,
                    'expired': _0xf29c39['expired'] || ![]
                });
            }
        }
        const _0xa2c82c = Date['now']();
        for (const _0x4dddfa of _0x10a1eb) {
            if (_0x4dddfa['expiresAt'] && _0x4dddfa['expiresAt'] < _0xa2c82c && !_0x4dddfa['expired']) {
                _0x4dddfa['expired'] = !![];
                _0x4dddfa['status'] = 'expired';
                await updateCloneStatus(_0x4dddfa['authId'], 'expired', !![]);
            }
        }
        return _0x10a1eb;
    } catch (_0x4ceed3) {
        console['error']('Failed\x20to\x20get\x20all\x20clones:', _0x4ceed3['message']);
        return [];
    }
}
async function updateCloneStatus(_0x903984, _0x4cde56, _0x470925 = ![]) {
    try {
        let _0x1468d5 = null;
        if (HAS_DB) {
            _0x1468d5 = await _0x0_0x3ae372['getSetting']('clones', _0x903984);
        } else {
            const _0x26e32c = _0x0_0x5176f8['join'](process['cwd'](), 'session', 'clones');
            const _0x53e5cb = _0x0_0x5176f8['join'](_0x26e32c, _0x903984 + '.json');
            if (_0x0_0x37017e['existsSync'](_0x53e5cb)) {
                _0x1468d5 = JSON['parse'](_0x0_0x37017e['readFileSync'](_0x53e5cb, 'utf-8'));
            }
        }
        if (_0x1468d5) {
            _0x1468d5['status'] = _0x4cde56;
            _0x1468d5['expired'] = _0x470925;
            _0x1468d5['updatedAt'] = Date['now']();
            if (HAS_DB) {
                await _0x0_0x3ae372['saveSetting']('clones', _0x903984, _0x1468d5);
            } else {
                const _0x318cb5 = _0x0_0x5176f8['join'](process['cwd'](), 'session', 'clones');
                const _0x1a7255 = _0x0_0x5176f8['join'](_0x318cb5, _0x903984 + '.json');
                _0x0_0x37017e['writeFileSync'](_0x1a7255, JSON['stringify'](_0x1468d5, null, 0x2));
            }
        }
    } catch (_0x4d2e98) {
        console['error']('Failed\x20to\x20update\x20clone\x20status\x20' + _0x903984 + ':', _0x4d2e98['message']);
    }
}
export async function getCloneByPhoneNumber(_0x41e47c) {
    const _0x4b2b53 = await getAllClonesFromMainDB();
    return _0x4b2b53['filter'](_0xf8a009 => _0xf8a009['phoneNumber'] === _0x41e47c);
}
export async function deleteCloneFromMainDB(_0x425987) {
    try {
        if (HAS_DB) {
            await _0x0_0x3ae372['saveSetting']('clones', _0x425987, null);
        } else {
            const _0x552da3 = _0x0_0x5176f8['join'](process['cwd'](), 'session', 'clones');
            const _0x4f28ef = _0x0_0x5176f8['join'](_0x552da3, _0x425987 + '.json');
            if (_0x0_0x37017e['existsSync'](_0x4f28ef)) {
                _0x0_0x37017e['unlinkSync'](_0x4f28ef);
            }
        }
        console['log']('✅\x20[Clone\x20' + _0x425987 + ']\x20Removed\x20from\x20main\x20database');
        return !![];
    } catch (_0x4a5e12) {
        console['error']('Failed\x20to\x20delete\x20clone\x20' + _0x425987 + ':', _0x4a5e12['message']);
        return ![];
    }
}
export async function startClone(_0x3142c2, _0xe6218e, _0x1ec5c2, _0x316570, _0x348166, _0x440b18, _0x2a22b3, _0x187a32) {
    try {
        const {
            state: _0x3c4de2,
            saveCreds: _0x2e1c54
        } = await useMultiFileAuthState(_0x3142c2);
        const {version: _0x2ee270} = await fetchLatestBaileysVersion();
        const _0x6ea866 = new _0x0_0x5257f2();
        const _0x3d8832 = _0x0_0x2f21d7({
            'version': _0x2ee270,
            'logger': _0x0_0x2162ca({ 'level': 'silent' }),
            'printQRInTerminal': ![],
            'browser': Browsers['macOS']('Chrome'),
            'auth': {
                'creds': _0x3c4de2['creds'],
                'keys': makeCacheableSignalKeyStore(_0x3c4de2['keys'], _0x0_0x2162ca({ 'level': 'fatal' }))
            },
            'markOnlineOnConnect': !![],
            'msgRetryCounterCache': _0x6ea866,
            'connectTimeoutMs': 0x1d4c0,
            'defaultQueryTimeoutMs': 0x0,
            'keepAliveIntervalMs': 0x7530,
            'mobile': ![]
        });
        let _0x5bdaa3 = null;
        if (!_0x3d8832['authState']['creds']['registered']) {
            await new Promise(_0x193bf0 => setTimeout(_0x193bf0, 0x1770));
            try {
                let _0x5079e4 = await _0x3d8832['requestPairingCode'](_0xe6218e);
                _0x5bdaa3 = _0x5079e4?.['match'](/.{1,4}/g)?.['join']('-') || _0x5079e4;
                await saveCloneToMainDB(_0x1ec5c2, _0xe6218e, _0x348166 || 'local', _0x316570, 'pairing', _0x440b18);
            } catch (_0x41fb7c) {
                console['error']('Pairing\x20Error:', _0x41fb7c);
                throw new Error('Failed\x20to\x20get\x20pairing\x20code:\x20' + _0x41fb7c['message']);
            }
        }
        _0x3d8832['ev']['on']('creds.update', async () => {
            await _0x2e1c54();
            try {
                const _0x20f443 = JSON['parse'](_0x0_0x37017e['readFileSync'](_0x0_0x5176f8['join'](_0x3142c2, 'creds.json'), 'utf-8'));
                await saveCloneToMainDB(_0x1ec5c2, _0xe6218e, _0x348166 || 'local', _0x316570, 'active', _0x440b18);
            } catch (_0x5d4bb1) {
                console['error']('Creds\x20save\x20error:', _0x5d4bb1['message']);
            }
        });
        _0x3d8832['ev']['on']('connection.update', async _0x1ec013 => {
            const {
                connection: _0x4d48f7,
                lastDisconnect: _0x2f4672
            } = _0x1ec013;
            if (_0x4d48f7 === 'open') {
                global['conns']['push'](_0x3d8832);
                await saveCloneToMainDB(_0x1ec5c2, _0xe6218e, _0x348166 || 'local', _0x316570, 'online', _0x440b18);
                if (_0x2a22b3) {
                    await _0x2a22b3(_0x3d8832, _0x1ec5c2, _0xe6218e);
                }
            }
            if (_0x4d48f7 === 'close') {
                const _0x77a48b = _0x2f4672?.['error']?.['output']?.['statusCode'];
                if (_0x77a48b !== DisconnectReason['loggedOut']) {
                    console['log']('🔄\x20[Clone\x20' + _0x1ec5c2 + ']\x20Reconnecting...');
                    setTimeout(() => startClone(_0x3142c2, _0xe6218e, _0x1ec5c2, _0x316570, _0x348166, _0x440b18, _0x2a22b3, _0x187a32), 0x1388);
                } else {
                    await saveCloneToMainDB(_0x1ec5c2, _0xe6218e, _0x348166 || 'local', _0x316570, 'offline', _0x440b18);
                    const _0x621809 = global['conns']['indexOf'](_0x3d8832);
                    if (_0x621809 > -0x1)
                        global['conns']['splice'](_0x621809, 0x1);
                    if (_0x187a32) {
                        await _0x187a32(_0x3d8832, _0x1ec5c2, _0xe6218e);
                    }
                }
            }
        });
        try {
            const {handleMessages: _0x21ed0d} = await import('./messageHandler.js');
            _0x3d8832['ev']['on']('messages.upsert', async _0x1c282c => {
                await _0x21ed0d(_0x3d8832, _0x1c282c);
            });
        } catch (_0x1f689b) {
            console['error']('Handler\x20linkage\x20failed:', _0x1f689b['message']);
        }
        return {
            'conn': _0x3d8832,
            'pairingCode': _0x5bdaa3
        };
    } catch (_0x9e4db4) {
        console['error']('Failed\x20to\x20start\x20clone\x20' + _0x1ec5c2 + ':', _0x9e4db4['message']);
        throw _0x9e4db4;
    }
}
export async function deleteClone(_0x2c6819) {
    try {
        const _0xc6cb7f = global['conns']['findIndex'](_0x33149c => {
            try {
                return _0x33149c['authState']?.['creds']?.['me']?.['id']?.['includes'](_0x2c6819) || _0x33149c['user']?.['id']?.['includes'](_0x2c6819);
            } catch (_0x3251c4) {
                return ![];
            }
        });
        if (_0xc6cb7f > -0x1) {
            try {
                await global['conns'][_0xc6cb7f]['end']();
                global['conns']['splice'](_0xc6cb7f, 0x1);
                console['log']('✅\x20[Clone\x20' + _0x2c6819 + ']\x20Disconnected');
            } catch (_0x403389) {
                console['error']('Failed\x20to\x20disconnect\x20clone\x20' + _0x2c6819 + ':', _0x403389['message']);
            }
        }
        await deleteCloneFromMainDB(_0x2c6819);
        const _0x211475 = _0x0_0x5176f8['join'](process['cwd'](), 'session', 'clones', _0x2c6819);
        if (_0x0_0x37017e['existsSync'](_0x211475)) {
            _0x0_0x37017e['rmSync'](_0x211475, {
                'recursive': !![],
                'force': !![]
            });
        }
        return { 'success': !![] };
    } catch (_0x3477c2) {
        console['error']('Failed\x20to\x20delete\x20clone\x20' + _0x2c6819 + ':', _0x3477c2['message']);
        return {
            'success': ![],
            'error': _0x3477c2['message']
        };
    }
}
export async function checkAndCleanExpiredClones() {
    try {
        const _0x2b3e89 = await getAllClonesFromMainDB();
        const _0x19c4b2 = Date['now']();
        let _0x21dc77 = 0x0;
        for (const _0x3da995 of _0x2b3e89) {
            if (_0x3da995['expiresAt'] && _0x3da995['expiresAt'] < _0x19c4b2 && !_0x3da995['expired']) {
                console['log']('🧹\x20Cleaning\x20expired\x20clone:\x20' + _0x3da995['authId'] + '\x20(' + _0x3da995['phoneNumber'] + ')');
                await deleteClone(_0x3da995['authId']);
                _0x21dc77++;
            }
        }
        if (_0x21dc77 > 0x0) {
            console['log']('✅\x20Cleaned\x20' + _0x21dc77 + '\x20expired\x20clones');
        }
        return _0x21dc77;
    } catch (_0x130db8) {
        console['error']('Failed\x20to\x20check\x20expired\x20clones:', _0x130db8['message']);
        return 0x0;
    }
}
export async function isCloneOwner(_0x3fb45e, _0x3e7d6b) {
    try {
        const _0x57185f = await getAllClonesFromMainDB();
        const _0x1a85fa = _0x57185f['find'](_0x1edbcf => _0x1edbcf['authId'] === _0x3e7d6b);
        if (!_0x1a85fa)
            return ![];
        const _0x5be75e = _0x3fb45e['split']('@')[0x0];
        return _0x1a85fa['phoneNumber'] === _0x5be75e;
    } catch (_0xa99a5b) {
        console['error']('Check\x20clone\x20owner\x20error:', _0xa99a5b['message']);
        return ![];
    }
}