import _0x0_0x15da86 from 'fs';
import _0x0_0x3dc557 from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
const __filename = fileURLToPath(import.meta.url);
const __dirname = _0x0_0x3dc557['dirname'](__filename);
const require = createRequire(import.meta.url);
const SESSION_DIR = _0x0_0x3dc557['join'](process['cwd'](), 'session');
const CREDS_FILE = _0x0_0x3dc557['join'](SESSION_DIR, 'creds.json');
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const DB_TYPE = MONGO_URL ? 'mongodb' : POSTGRES_URL ? 'postgresql' : MYSQL_URL ? 'mysql' : 'local';
class SessionManager {
    constructor() {
        this['db'] = null;
        this['dbType'] = DB_TYPE;
        this['initialized'] = ![];
        this['sessionCache'] = null;
    }
    async ['init']() {
        if (this['initialized'])
            return;
        try {
            if (this['dbType'] === 'mongodb' && MONGO_URL) {
                await this['initMongoDB']();
            } else if (this['dbType'] === 'postgresql' && POSTGRES_URL) {
                await this['initPostgreSQL']();
            } else if (this['dbType'] === 'mysql' && MYSQL_URL) {
                await this['initMySQL']();
            } else {
                console['log']('💾\x20Using\x20local\x20file\x20storage\x20for\x20sessions');
            }
            this['initialized'] = !![];
        } catch (_0x51ad7a) {
            console['error']('❌\x20Session\x20DB\x20initialization\x20failed:', _0x51ad7a['message']);
            console['log']('💾\x20Falling\x20back\x20to\x20local\x20file\x20storage');
            this['dbType'] = 'local';
            this['initialized'] = !![];
        }
    }
    async ['initMongoDB']() {
        try {
            const _0x4f59cc = require('mongoose');
            await _0x4f59cc['connect'](MONGO_URL);
            const _0x5c046d = new _0x4f59cc['Schema']({
                'sessionId': {
                    'type': String,
                    'unique': !![],
                    'required': !![]
                },
                'creds': {
                    'type': Object,
                    'required': !![]
                },
                'registered': {
                    'type': Boolean,
                    'default': ![]
                },
                'phoneNumber': { 'type': String },
                'deviceId': { 'type': String },
                'createdAt': {
                    'type': Date,
                    'default': Date['now']
                },
                'updatedAt': {
                    'type': Date,
                    'default': Date['now']
                }
            });
            this['SessionModel'] = _0x4f59cc['model']('Session', _0x5c046d);
            this['db'] = this['SessionModel'];
            console['log']('✅\x20MongoDB\x20session\x20storage\x20initialized');
        } catch (_0x283ab3) {
            throw new Error('MongoDB\x20init\x20failed:\x20' + _0x283ab3['message']);
        }
    }
    async ['initPostgreSQL']() {
        try {
            const _0x3606ca = require('pg');
            const {Pool: _0x42c33f} = _0x3606ca;
            this['pool'] = new _0x42c33f({
                'connectionString': POSTGRES_URL,
                'ssl': process.env.NODE_ENV === 'production' ? { 'rejectUnauthorized': ![] } : ![]
            });
            await this['pool']['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20sessions\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20session_id\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20creds\x20JSONB\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20registered\x20BOOLEAN\x20DEFAULT\x20FALSE,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20phone_number\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20device_id\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20created_at\x20TIMESTAMP\x20DEFAULT\x20CURRENT_TIMESTAMP,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20updated_at\x20TIMESTAMP\x20DEFAULT\x20CURRENT_TIMESTAMP\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
            await this['pool']['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20INDEX\x20IF\x20NOT\x20EXISTS\x20idx_sessions_session_id\x20ON\x20sessions(session_id)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
            console['log']('✅\x20PostgreSQL\x20session\x20storage\x20initialized');
        } catch (_0x46746d) {
            throw new Error('PostgreSQL\x20init\x20failed:\x20' + _0x46746d['message']);
        }
    }
    async ['initMySQL']() {
        try {
            const _0x28a5f4 = require('mysql2/promise');
            this['mysqlConn'] = await _0x28a5f4['createConnection'](MYSQL_URL);
            await this['mysqlConn']['execute']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20sessions\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20session_id\x20VARCHAR(255)\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20creds\x20JSON\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20registered\x20BOOLEAN\x20DEFAULT\x20FALSE,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20phone_number\x20VARCHAR(50),\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20device_id\x20VARCHAR(255),\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20created_at\x20TIMESTAMP\x20DEFAULT\x20CURRENT_TIMESTAMP,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20updated_at\x20TIMESTAMP\x20DEFAULT\x20CURRENT_TIMESTAMP\x20ON\x20UPDATE\x20CURRENT_TIMESTAMP,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20INDEX\x20idx_session_id\x20(session_id)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x20ENGINE=InnoDB\x20DEFAULT\x20CHARSET=utf8mb4\x20COLLATE=utf8mb4_unicode_ci\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
            console['log']('✅\x20MySQL\x20session\x20storage\x20initialized');
        } catch (_0x5c926a) {
            throw new Error('MySQL\x20init\x20failed:\x20' + _0x5c926a['message']);
        }
    }
    async ['saveSession'](_0x39e74b, _0x5e5ba7 = null) {
        await this['init']();
        const _0x3bc89a = this['generateSessionId']();
        const _0x13bd37 = _0x39e74b['registered'] === !![] || !!_0x39e74b['me']?.['id'];
        this['saveLocal'](_0x39e74b);
        try {
            if (this['dbType'] === 'mongodb' && this['db']) {
                await this['db']['updateOne']({ 'sessionId': _0x3bc89a }, {
                    'sessionId': _0x3bc89a,
                    'creds': _0x39e74b,
                    'registered': _0x13bd37,
                    'phoneNumber': _0x5e5ba7,
                    'deviceId': _0x39e74b['deviceId'] || null,
                    'updatedAt': new Date()
                }, { 'upsert': !![] });
                console['log']('✅\x20Session\x20saved\x20to\x20MongoDB:\x20' + _0x3bc89a);
            } else if (this['dbType'] === 'postgresql' && this['pool']) {
                await this['pool']['query']('INSERT\x20INTO\x20sessions\x20(session_id,\x20creds,\x20registered,\x20phone_number,\x20device_id,\x20updated_at)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20VALUES\x20($1,\x20$2,\x20$3,\x20$4,\x20$5,\x20CURRENT_TIMESTAMP)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(session_id)\x20DO\x20UPDATE\x20SET\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20creds\x20=\x20EXCLUDED.creds,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20registered\x20=\x20EXCLUDED.registered,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20phone_number\x20=\x20EXCLUDED.phone_number,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20device_id\x20=\x20EXCLUDED.device_id,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20updated_at\x20=\x20CURRENT_TIMESTAMP', [
                    _0x3bc89a,
                    _0x39e74b,
                    _0x13bd37,
                    _0x5e5ba7,
                    _0x39e74b['deviceId'] || null
                ]);
                console['log']('✅\x20Session\x20saved\x20to\x20PostgreSQL:\x20' + _0x3bc89a);
            } else if (this['dbType'] === 'mysql' && this['mysqlConn']) {
                await this['mysqlConn']['execute']('INSERT\x20INTO\x20sessions\x20(session_id,\x20creds,\x20registered,\x20phone_number,\x20device_id,\x20updated_at)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20VALUES\x20(?,\x20?,\x20?,\x20?,\x20?,\x20CURRENT_TIMESTAMP)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20creds\x20=\x20VALUES(creds),\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20registered\x20=\x20VALUES(registered),\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20phone_number\x20=\x20VALUES(phone_number),\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20device_id\x20=\x20VALUES(device_id),\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20updated_at\x20=\x20CURRENT_TIMESTAMP', [
                    _0x3bc89a,
                    JSON['stringify'](_0x39e74b),
                    _0x13bd37,
                    _0x5e5ba7,
                    _0x39e74b['deviceId'] || null
                ]);
                console['log']('✅\x20Session\x20saved\x20to\x20MySQL:\x20' + _0x3bc89a);
            }
        } catch (_0x1d3a49) {
            console['error']('❌\x20DB\x20session\x20save\x20failed:', _0x1d3a49['message']);
        }
        return _0x3bc89a;
    }
    async ['loadSession']() {
        await this['init']();
        try {
            if (this['dbType'] === 'mongodb' && this['db']) {
                const _0x16e8ed = await this['db']['findOne']({ 'registered': !![] })['sort']({ 'updatedAt': -0x1 });
                if (_0x16e8ed) {
                    console['log']('✅\x20Session\x20loaded\x20from\x20MongoDB:\x20' + _0x16e8ed['sessionId']);
                    this['saveLocal'](_0x16e8ed['creds']);
                    return _0x16e8ed['creds'];
                }
            } else if (this['dbType'] === 'postgresql' && this['pool']) {
                const _0x555a6a = await this['pool']['query']('SELECT\x20session_id,\x20creds\x20FROM\x20sessions\x20WHERE\x20registered\x20=\x20true\x20ORDER\x20BY\x20updated_at\x20DESC\x20LIMIT\x201');
                if (_0x555a6a['rows']['length'] > 0x0) {
                    console['log']('✅\x20Session\x20loaded\x20from\x20PostgreSQL:\x20' + _0x555a6a['rows'][0x0]['session_id']);
                    this['saveLocal'](_0x555a6a['rows'][0x0]['creds']);
                    return _0x555a6a['rows'][0x0]['creds'];
                }
            } else if (this['dbType'] === 'mysql' && this['mysqlConn']) {
                const [_0x3cf8fa] = await this['mysqlConn']['execute']('SELECT\x20session_id,\x20creds\x20FROM\x20sessions\x20WHERE\x20registered\x20=\x20true\x20ORDER\x20BY\x20updated_at\x20DESC\x20LIMIT\x201');
                if (_0x3cf8fa['length'] > 0x0) {
                    console['log']('✅\x20Session\x20loaded\x20from\x20MySQL:\x20' + _0x3cf8fa[0x0]['session_id']);
                    this['saveLocal'](_0x3cf8fa[0x0]['creds']);
                    return _0x3cf8fa[0x0]['creds'];
                }
            }
        } catch (_0x3273e2) {
            console['error']('❌\x20DB\x20session\x20load\x20failed:', _0x3273e2['message']);
        }
        const _0x4fa0c3 = this['loadLocal']();
        if (_0x4fa0c3) {
            console['log']('📂\x20Session\x20loaded\x20from\x20local\x20file');
            return _0x4fa0c3;
        }
        console['log']('⚠️\x20No\x20session\x20found');
        return null;
    }
    ['saveLocal'](_0x283e92) {
        try {
            if (!_0x0_0x15da86['existsSync'](SESSION_DIR)) {
                _0x0_0x15da86['mkdirSync'](SESSION_DIR, { 'recursive': !![] });
            }
            _0x0_0x15da86['writeFileSync'](CREDS_FILE, JSON['stringify'](_0x283e92, null, 0x2));
            return !![];
        } catch (_0x3f78d1) {
            console['error']('❌\x20Local\x20save\x20failed:', _0x3f78d1['message']);
            return ![];
        }
    }
    ['loadLocal']() {
        try {
            if (_0x0_0x15da86['existsSync'](CREDS_FILE)) {
                return JSON['parse'](_0x0_0x15da86['readFileSync'](CREDS_FILE, 'utf-8'));
            }
            return null;
        } catch (_0x47bd44) {
            console['error']('❌\x20Local\x20load\x20failed:', _0x47bd44['message']);
            return null;
        }
    }
    ['generateSessionId']() {
        const _0x59f96b = 'abcdefghijklmnopqrstuvwxyz0123456789';
        const _0xc81f71 = Array['from']({ 'length': 0x6 }, () => _0x59f96b[Math['floor'](Math['random']() * _0x59f96b['length'])])['join']('');
        const _0x2a0995 = String(Math['floor'](Math['random']() * 0x2710))['padStart'](0x4, '0');
        return 'NOVA-' + _0xc81f71 + _0x2a0995;
    }
    ['hasValidSession']() {
        try {
            const _0x3eb709 = this['loadLocal']();
            if (!_0x3eb709)
                return ![];
            if (!_0x3eb709['noiseKey'] || !_0x3eb709['signedIdentityKey'] || !_0x3eb709['signedPreKey']) {
                return ![];
            }
            if (_0x3eb709['registered'] !== !![] && !_0x3eb709['me']?.['id']) {
                return ![];
            }
            return !![];
        } catch (_0x39ff9e) {
            return ![];
        }
    }
    async ['deleteSession']() {
        try {
            if (this['dbType'] === 'mongodb' && this['db']) {
                await this['db']['deleteMany']({});
                console['log']('🗑️\x20MongoDB\x20session\x20deleted');
            } else if (this['dbType'] === 'postgresql' && this['pool']) {
                await this['pool']['query']('DELETE\x20FROM\x20sessions');
                console['log']('🗑️\x20PostgreSQL\x20session\x20deleted');
            } else if (this['dbType'] === 'mysql' && this['mysqlConn']) {
                await this['mysqlConn']['execute']('DELETE\x20FROM\x20sessions');
                console['log']('🗑️\x20MySQL\x20session\x20deleted');
            }
        } catch (_0x1d0478) {
            console['error']('❌\x20DB\x20delete\x20failed:', _0x1d0478['message']);
        }
        try {
            if (_0x0_0x15da86['existsSync'](CREDS_FILE)) {
                _0x0_0x15da86['unlinkSync'](CREDS_FILE);
                console['log']('🗑️\x20Local\x20session\x20deleted');
            }
        } catch (_0x4112b1) {
            console['error']('❌\x20Local\x20delete\x20failed:', _0x4112b1['message']);
        }
    }
    async ['close']() {
        try {
            if (this['dbType'] === 'mongodb') {
                const _0x1f02e4 = require('mongoose');
                await _0x1f02e4['connection']['close']();
            } else if (this['dbType'] === 'postgresql' && this['pool']) {
                await this['pool']['end']();
            } else if (this['dbType'] === 'mysql' && this['mysqlConn']) {
                await this['mysqlConn']['end']();
            }
            console['log']('🔒\x20Session\x20database\x20closed');
        } catch (_0xe8db01) {
            console['error']('❌\x20Close\x20failed:', _0xe8db01['message']);
        }
    }
}
export default new SessionManager();