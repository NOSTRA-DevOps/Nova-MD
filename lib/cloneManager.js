import _0x0_0x16698e, {
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    Browsers
} from '@whiskeysockets/baileys';
import _0x0_0x185106 from 'node-cache';
import _0x0_0x420857 from 'pino';
import _0x0_0x3bd968 from 'fs';
import _0x0_0x3594a8, { dirname } from 'path';
import { fileURLToPath } from 'url';
import _0x0_0x1e3515 from './lightweight_store.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
if (!global['conns'])
    global['conns'] = [];
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL);
export function generateSessionId(_0x5e448c = 0x6, _0x2b8aa9 = 0x4) {
    const _0x396a7f = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let _0x4e7507 = '';
    for (let _0x26b03f = 0x0; _0x26b03f < _0x5e448c; _0x26b03f++) {
        _0x4e7507 += _0x396a7f['charAt'](Math['floor'](Math['random']() * _0x396a7f['length']));
    }
    const _0x46ddd0 = String(Math['floor'](Math['random']() * Math['pow'](0xa, _0x2b8aa9)))['padStart'](_0x2b8aa9, '0');
    return 'NOVA' + _0x4e7507 + _0x46ddd0;
}
export async function saveCloneToMainDB(_0x2d11ab, _0x446521, _0x4664f7, _0x41cad2, _0x21b303, _0x3c8ddc = null) {
    try {
        let _0x1867ca = null;
        if (_0x3c8ddc && _0x3c8ddc > 0x0) {
            _0x1867ca = Date['now']() + _0x3c8ddc * 0x18 * 0x3c * 0x3c * 0x3e8;
        }
        const _0x4984a1 = {
            'phoneNumber': _0x446521,
            'dbUrl': _0x4664f7 || 'local',
            'dbType': _0x41cad2 || 'local',
            'status': _0x21b303 || 'configured',
            'createdAt': Date['now'](),
            'updatedAt': Date['now'](),
            'expiryDays': _0x3c8ddc || null,
            'expiresAt': _0x1867ca,
            'expired': ![]
        };
        if (HAS_DB) {
            await _0x0_0x1e3515['saveSetting']('clones', _0x2d11ab, _0x4984a1);
            console['log']('✅\x20[Clone\x20' + _0x2d11ab + ']\x20Saved\x20to\x20main\x20database' + (_0x3c8ddc ? '\x20(expires\x20in\x20' + _0x3c8ddc + '\x20days)' : ''));
        } else {
            const _0x38c60c = _0x0_0x3594a8['join'](process['cwd'](), 'session', 'clones');
            if (!_0x0_0x3bd968['existsSync'](_0x38c60c)) {
                _0x0_0x3bd968['mkdirSync'](_0x38c60c, { 'recursive': !![] });
            }
            _0x0_0x3bd968['writeFileSync'](_0x0_0x3594a8['join'](_0x38c60c, _0x2d11ab + '.json'), JSON['stringify'](_0x4984a1, null, 0x2));
            console['log']('✅\x20[Clone\x20' + _0x2d11ab + ']\x20Saved\x20locally' + (_0x3c8ddc ? '\x20(expires\x20in\x20' + _0x3c8ddc + '\x20days)' : ''));
        }
        return !![];
    } catch (_0x454328) {
        console['error']('❌\x20Failed\x20to\x20save\x20clone\x20' + _0x2d11ab + ':', _0x454328['message']);
        return ![];
    }
}
export async function getAllClonesFromMainDB() {
    try {
        let _0x50b32d = [];
        if (HAS_DB) {
            const _0x18759b = await _0x0_0x1e3515['getSetting']('clones', 'all') || {};
            _0x50b32d = Object['entries'](_0x18759b)['map'](([_0x5ac95a, _0x2b7a49]) => ({
                'authId': _0x5ac95a,
                'phoneNumber': _0x2b7a49['phoneNumber'],
                'dbType': _0x2b7a49['dbType'] || 'local',
                'status': _0x2b7a49['status'] || 'unknown',
                'createdAt': _0x2b7a49['createdAt'],
                'updatedAt': _0x2b7a49['updatedAt'],
                'expiryDays': _0x2b7a49['expiryDays'] || null,
                'expiresAt': _0x2b7a49['expiresAt'] || null,
                'expired': _0x2b7a49['expired'] || ![]
            }));
        } else {
            const _0x4b4437 = _0x0_0x3594a8['join'](process['cwd'](), 'session', 'clones');
            if (!_0x0_0x3bd968['existsSync'](_0x4b4437))
                return [];
            const _0x2a8b82 = _0x0_0x3bd968['readdirSync'](_0x4b4437)['filter'](_0x2e72ce => _0x2e72ce['endsWith']('.json'));
            for (const _0x2c1abe of _0x2a8b82) {
                const _0x3ab0d5 = _0x2c1abe['replace']('.json', '');
                const _0x1bd63e = JSON['parse'](_0x0_0x3bd968['readFileSync'](_0x0_0x3594a8['join'](_0x4b4437, _0x2c1abe), 'utf-8'));
                _0x50b32d['push']({
                    'authId': _0x3ab0d5,
                    'phoneNumber': _0x1bd63e['phoneNumber'],
                    'dbType': _0x1bd63e['dbType'] || 'local',
                    'status': _0x1bd63e['status'] || 'unknown',
                    'createdAt': _0x1bd63e['createdAt'],
                    'updatedAt': _0x1bd63e['updatedAt'],
                    'expiryDays': _0x1bd63e['expiryDays'] || null,
                    'expiresAt': _0x1bd63e['expiresAt'] || null,
                    'expired': _0x1bd63e['expired'] || ![]
                });
            }
        }
        const _0x3434d6 = Date['now']();
        for (const _0x1a9aac of _0x50b32d) {
            if (_0x1a9aac['expiresAt'] && _0x1a9aac['expiresAt'] < _0x3434d6 && !_0x1a9aac['expired']) {
                _0x1a9aac['expired'] = !![];
                _0x1a9aac['status'] = 'expired';
                await updateCloneStatus(_0x1a9aac['authId'], 'expired', !![]);
            }
        }
        return _0x50b32d;
    } catch (_0x44f591) {
        console['error']('Failed\x20to\x20get\x20all\x20clones:', _0x44f591['message']);
        return [];
    }
}
async function updateCloneStatus(_0x17e618, _0x58e187, _0x6d4721 = ![]) {
    try {
        let _0x12ab1a = null;
        if (HAS_DB) {
            _0x12ab1a = await _0x0_0x1e3515['getSetting']('clones', _0x17e618);
        } else {
            const _0xc138d1 = _0x0_0x3594a8['join'](process['cwd'](), 'session', 'clones');
            const _0x3bf092 = _0x0_0x3594a8['join'](_0xc138d1, _0x17e618 + '.json');
            if (_0x0_0x3bd968['existsSync'](_0x3bf092)) {
                _0x12ab1a = JSON['parse'](_0x0_0x3bd968['readFileSync'](_0x3bf092, 'utf-8'));
            }
        }
        if (_0x12ab1a) {
            _0x12ab1a['status'] = _0x58e187;
            _0x12ab1a['expired'] = _0x6d4721;
            _0x12ab1a['updatedAt'] = Date['now']();
            if (HAS_DB) {
                await _0x0_0x1e3515['saveSetting']('clones', _0x17e618, _0x12ab1a);
            } else {
                const _0x252786 = _0x0_0x3594a8['join'](process['cwd'](), 'session', 'clones');
                const _0x378cff = _0x0_0x3594a8['join'](_0x252786, _0x17e618 + '.json');
                _0x0_0x3bd968['writeFileSync'](_0x378cff, JSON['stringify'](_0x12ab1a, null, 0x2));
            }
        }
    } catch (_0x6a0c4c) {
        console['error']('Failed\x20to\x20update\x20clone\x20status\x20' + _0x17e618 + ':', _0x6a0c4c['message']);
    }
}
export async function getCloneByPhoneNumber(_0x17d46a) {
    const _0x37b157 = await getAllClonesFromMainDB();
    return _0x37b157['filter'](_0x4b26f4 => _0x4b26f4['phoneNumber'] === _0x17d46a);
}
export async function deleteCloneFromMainDB(_0x400463) {
    try {
        if (HAS_DB) {
            await _0x0_0x1e3515['saveSetting']('clones', _0x400463, null);
        } else {
            const _0x5effdc = _0x0_0x3594a8['join'](process['cwd'](), 'session', 'clones');
            const _0x2a572c = _0x0_0x3594a8['join'](_0x5effdc, _0x400463 + '.json');
            if (_0x0_0x3bd968['existsSync'](_0x2a572c)) {
                _0x0_0x3bd968['unlinkSync'](_0x2a572c);
            }
        }
        console['log']('✅\x20[Clone\x20' + _0x400463 + ']\x20Removed\x20from\x20main\x20database');
        return !![];
    } catch (_0x3e9b56) {
        console['error']('Failed\x20to\x20delete\x20clone\x20' + _0x400463 + ':', _0x3e9b56['message']);
        return ![];
    }
}
export async function startClone(_0x1108e3, _0x2974a0, _0x12592b, _0x5bc0d1, _0x11fcbb, _0x1b0aaf, _0x22a6e9, _0x1e438b) {
    try {
        const {
            state: _0x43a0d8,
            saveCreds: _0x2d6ead
        } = await useMultiFileAuthState(_0x1108e3);
        const {version: _0x5ac919} = await fetchLatestBaileysVersion();
        const _0x57c5e8 = new _0x0_0x185106();
        const _0x310e43 = _0x0_0x16698e({
            'version': _0x5ac919,
            'logger': _0x0_0x420857({ 'level': 'silent' }),
            'printQRInTerminal': ![],
            'browser': Browsers['macOS']('Chrome'),
            'auth': {
                'creds': _0x43a0d8['creds'],
                'keys': makeCacheableSignalKeyStore(_0x43a0d8['keys'], _0x0_0x420857({ 'level': 'fatal' }))
            },
            'markOnlineOnConnect': !![],
            'msgRetryCounterCache': _0x57c5e8,
            'connectTimeoutMs': 0x1d4c0,
            'defaultQueryTimeoutMs': 0x0,
            'keepAliveIntervalMs': 0x7530,
            'mobile': ![]
        });
        let _0x4eb841 = null;
        if (!_0x310e43['authState']['creds']['registered']) {
            await new Promise(_0x190608 => setTimeout(_0x190608, 0x1770));
            try {
                let _0x161926 = await _0x310e43['requestPairingCode'](_0x2974a0);
                _0x4eb841 = _0x161926?.['match'](/.{1,4}/g)?.['join']('-') || _0x161926;
                await saveCloneToMainDB(_0x12592b, _0x2974a0, _0x11fcbb || 'local', _0x5bc0d1, 'pairing', _0x1b0aaf);
            } catch (_0x4c2db6) {
                console['error']('Pairing\x20Error:', _0x4c2db6);
                throw new Error('Failed\x20to\x20get\x20pairing\x20code:\x20' + _0x4c2db6['message']);
            }
        }
        _0x310e43['ev']['on']('creds.update', async () => {
            await _0x2d6ead();
            try {
                const _0x4683c1 = JSON['parse'](_0x0_0x3bd968['readFileSync'](_0x0_0x3594a8['join'](_0x1108e3, 'creds.json'), 'utf-8'));
                await saveCloneToMainDB(_0x12592b, _0x2974a0, _0x11fcbb || 'local', _0x5bc0d1, 'active', _0x1b0aaf);
            } catch (_0x4fd06d) {
                console['error']('Creds\x20save\x20error:', _0x4fd06d['message']);
            }
        });
        _0x310e43['ev']['on']('connection.update', async _0x257160 => {
            const {
                connection: _0x5dee46,
                lastDisconnect: _0x5406b7
            } = _0x257160;
            if (_0x5dee46 === 'open') {
                global['conns']['push'](_0x310e43);
                await saveCloneToMainDB(_0x12592b, _0x2974a0, _0x11fcbb || 'local', _0x5bc0d1, 'online', _0x1b0aaf);
                if (_0x22a6e9) {
                    await _0x22a6e9(_0x310e43, _0x12592b, _0x2974a0);
                }
            }
            if (_0x5dee46 === 'close') {
                const _0xecb33a = _0x5406b7?.['error']?.['output']?.['statusCode'];
                if (_0xecb33a !== DisconnectReason['loggedOut']) {
                    console['log']('🔄\x20[Clone\x20' + _0x12592b + ']\x20Reconnecting...');
                    setTimeout(() => startClone(_0x1108e3, _0x2974a0, _0x12592b, _0x5bc0d1, _0x11fcbb, _0x1b0aaf, _0x22a6e9, _0x1e438b), 0x1388);
                } else {
                    await saveCloneToMainDB(_0x12592b, _0x2974a0, _0x11fcbb || 'local', _0x5bc0d1, 'offline', _0x1b0aaf);
                    const _0x10a36f = global['conns']['indexOf'](_0x310e43);
                    if (_0x10a36f > -0x1)
                        global['conns']['splice'](_0x10a36f, 0x1);
                    if (_0x1e438b) {
                        await _0x1e438b(_0x310e43, _0x12592b, _0x2974a0);
                    }
                }
            }
        });
        try {
            const {handleMessages: _0x5de245} = await import('./messageHandler.js');
            _0x310e43['ev']['on']('messages.upsert', async _0x4b9b53 => {
                await _0x5de245(_0x310e43, _0x4b9b53);
            });
        } catch (_0x2148cb) {
            console['error']('Handler\x20linkage\x20failed:', _0x2148cb['message']);
        }
        return {
            'conn': _0x310e43,
            'pairingCode': _0x4eb841
        };
    } catch (_0x5de79e) {
        console['error']('Failed\x20to\x20start\x20clone\x20' + _0x12592b + ':', _0x5de79e['message']);
        throw _0x5de79e;
    }
}
export async function deleteClone(_0x20c6e9) {
    try {
        const _0x1923ab = global['conns']['findIndex'](_0x326b49 => {
            try {
                return _0x326b49['authState']?.['creds']?.['me']?.['id']?.['includes'](_0x20c6e9) || _0x326b49['user']?.['id']?.['includes'](_0x20c6e9);
            } catch (_0x452b6b) {
                return ![];
            }
        });
        if (_0x1923ab > -0x1) {
            try {
                await global['conns'][_0x1923ab]['end']();
                global['conns']['splice'](_0x1923ab, 0x1);
                console['log']('✅\x20[Clone\x20' + _0x20c6e9 + ']\x20Disconnected');
            } catch (_0xfc161c) {
                console['error']('Failed\x20to\x20disconnect\x20clone\x20' + _0x20c6e9 + ':', _0xfc161c['message']);
            }
        }
        await deleteCloneFromMainDB(_0x20c6e9);
        const _0x5c1368 = _0x0_0x3594a8['join'](process['cwd'](), 'session', 'clones', _0x20c6e9);
        if (_0x0_0x3bd968['existsSync'](_0x5c1368)) {
            _0x0_0x3bd968['rmSync'](_0x5c1368, {
                'recursive': !![],
                'force': !![]
            });
        }
        return { 'success': !![] };
    } catch (_0x466671) {
        console['error']('Failed\x20to\x20delete\x20clone\x20' + _0x20c6e9 + ':', _0x466671['message']);
        return {
            'success': ![],
            'error': _0x466671['message']
        };
    }
}
export async function checkAndCleanExpiredClones() {
    try {
        const _0x2e6562 = await getAllClonesFromMainDB();
        const _0xac0045 = Date['now']();
        let _0x4a8fa2 = 0x0;
        for (const _0x1814a0 of _0x2e6562) {
            if (_0x1814a0['expiresAt'] && _0x1814a0['expiresAt'] < _0xac0045 && !_0x1814a0['expired']) {
                console['log']('🧹\x20Cleaning\x20expired\x20clone:\x20' + _0x1814a0['authId'] + '\x20(' + _0x1814a0['phoneNumber'] + ')');
                await deleteClone(_0x1814a0['authId']);
                _0x4a8fa2++;
            }
        }
        if (_0x4a8fa2 > 0x0) {
            console['log']('✅\x20Cleaned\x20' + _0x4a8fa2 + '\x20expired\x20clones');
        }
        return _0x4a8fa2;
    } catch (_0x7e7a33) {
        console['error']('Failed\x20to\x20check\x20expired\x20clones:', _0x7e7a33['message']);
        return 0x0;
    }
}
export async function isCloneOwner(_0x285a7e, _0x617b69) {
    try {
        const _0x4ea8c0 = await getAllClonesFromMainDB();
        const _0x1f029b = _0x4ea8c0['find'](_0x42409f => _0x42409f['authId'] === _0x617b69);
        if (!_0x1f029b)
            return ![];
        const _0x290ee5 = _0x285a7e['split']('@')[0x0];
        return _0x1f029b['phoneNumber'] === _0x290ee5;
    } catch (_0x4b6038) {
        console['error']('Check\x20clone\x20owner\x20error:', _0x4b6038['message']);
        return ![];
    }
}