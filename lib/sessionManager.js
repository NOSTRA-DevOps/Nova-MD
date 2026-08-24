import _0x0_0x220ae3 from 'fs';
import _0x0_0xefbf67 from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
const __filename = fileURLToPath(import.meta.url);
const __dirname = _0x0_0xefbf67['dirname'](__filename);
const require = createRequire(import.meta.url);
const SESSION_DIR = _0x0_0xefbf67['join'](process['cwd'](), 'session');
const CREDS_FILE = _0x0_0xefbf67['join'](SESSION_DIR, 'creds.json');
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
        } catch (_0xe6198) {
            console['error']('❌\x20Session\x20DB\x20initialization\x20failed:', _0xe6198['message']);
            console['log']('💾\x20Falling\x20back\x20to\x20local\x20file\x20storage');
            this['dbType'] = 'local';
            this['initialized'] = !![];
        }
    }
    async ['initMongoDB']() {
        try {
            const _0x3c964a = require('mongoose');
            await _0x3c964a['connect'](MONGO_URL);
            const _0x526dff = new _0x3c964a['Schema']({
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
            this['SessionModel'] = _0x3c964a['model']('Session', _0x526dff);
            this['db'] = this['SessionModel'];
            console['log']('✅\x20MongoDB\x20session\x20storage\x20initialized');
        } catch (_0x16acc5) {
            throw new Error('MongoDB\x20init\x20failed:\x20' + _0x16acc5['message']);
        }
    }
    async ['initPostgreSQL']() {
        try {
            const _0x40b736 = require('pg');
            const {Pool: _0x4648a6} = _0x40b736;
            this['pool'] = new _0x4648a6({
                'connectionString': POSTGRES_URL,
                'ssl': process.env.NODE_ENV === 'production' ? { 'rejectUnauthorized': ![] } : ![]
            });
            await this['pool']['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20sessions\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20session_id\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20creds\x20JSONB\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20registered\x20BOOLEAN\x20DEFAULT\x20FALSE,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20phone_number\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20device_id\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20created_at\x20TIMESTAMP\x20DEFAULT\x20CURRENT_TIMESTAMP,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20updated_at\x20TIMESTAMP\x20DEFAULT\x20CURRENT_TIMESTAMP\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
            await this['pool']['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20INDEX\x20IF\x20NOT\x20EXISTS\x20idx_sessions_session_id\x20ON\x20sessions(session_id)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
            console['log']('✅\x20PostgreSQL\x20session\x20storage\x20initialized');
        } catch (_0x4d5bc4) {
            throw new Error('PostgreSQL\x20init\x20failed:\x20' + _0x4d5bc4['message']);
        }
    }
    async ['initMySQL']() {
        try {
            const _0x3d9552 = require('mysql2/promise');
            this['mysqlConn'] = await _0x3d9552['createConnection'](MYSQL_URL);
            await this['mysqlConn']['execute']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20sessions\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20session_id\x20VARCHAR(255)\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20creds\x20JSON\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20registered\x20BOOLEAN\x20DEFAULT\x20FALSE,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20phone_number\x20VARCHAR(50),\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20device_id\x20VARCHAR(255),\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20created_at\x20TIMESTAMP\x20DEFAULT\x20CURRENT_TIMESTAMP,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20updated_at\x20TIMESTAMP\x20DEFAULT\x20CURRENT_TIMESTAMP\x20ON\x20UPDATE\x20CURRENT_TIMESTAMP,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20INDEX\x20idx_session_id\x20(session_id)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x20ENGINE=InnoDB\x20DEFAULT\x20CHARSET=utf8mb4\x20COLLATE=utf8mb4_unicode_ci\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
            console['log']('✅\x20MySQL\x20session\x20storage\x20initialized');
        } catch (_0x2af3fe) {
            throw new Error('MySQL\x20init\x20failed:\x20' + _0x2af3fe['message']);
        }
    }
    async ['saveSession'](_0x21e8d1, _0x5dc78d = null) {
        await this['init']();
        const _0x29f757 = this['generateSessionId']();
        const _0x591df7 = _0x21e8d1['registered'] === !![] || !!_0x21e8d1['me']?.['id'];
        this['saveLocal'](_0x21e8d1);
        try {
            if (this['dbType'] === 'mongodb' && this['db']) {
                await this['db']['updateOne']({ 'sessionId': _0x29f757 }, {
                    'sessionId': _0x29f757,
                    'creds': _0x21e8d1,
                    'registered': _0x591df7,
                    'phoneNumber': _0x5dc78d,
                    'deviceId': _0x21e8d1['deviceId'] || null,
                    'updatedAt': new Date()
                }, { 'upsert': !![] });
                console['log']('✅\x20Session\x20saved\x20to\x20MongoDB:\x20' + _0x29f757);
            } else if (this['dbType'] === 'postgresql' && this['pool']) {
                await this['pool']['query']('INSERT\x20INTO\x20sessions\x20(session_id,\x20creds,\x20registered,\x20phone_number,\x20device_id,\x20updated_at)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20VALUES\x20($1,\x20$2,\x20$3,\x20$4,\x20$5,\x20CURRENT_TIMESTAMP)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(session_id)\x20DO\x20UPDATE\x20SET\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20creds\x20=\x20EXCLUDED.creds,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20registered\x20=\x20EXCLUDED.registered,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20phone_number\x20=\x20EXCLUDED.phone_number,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20device_id\x20=\x20EXCLUDED.device_id,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20updated_at\x20=\x20CURRENT_TIMESTAMP', [
                    _0x29f757,
                    _0x21e8d1,
                    _0x591df7,
                    _0x5dc78d,
                    _0x21e8d1['deviceId'] || null
                ]);
                console['log']('✅\x20Session\x20saved\x20to\x20PostgreSQL:\x20' + _0x29f757);
            } else if (this['dbType'] === 'mysql' && this['mysqlConn']) {
                await this['mysqlConn']['execute']('INSERT\x20INTO\x20sessions\x20(session_id,\x20creds,\x20registered,\x20phone_number,\x20device_id,\x20updated_at)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20VALUES\x20(?,\x20?,\x20?,\x20?,\x20?,\x20CURRENT_TIMESTAMP)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20creds\x20=\x20VALUES(creds),\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20registered\x20=\x20VALUES(registered),\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20phone_number\x20=\x20VALUES(phone_number),\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20device_id\x20=\x20VALUES(device_id),\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20updated_at\x20=\x20CURRENT_TIMESTAMP', [
                    _0x29f757,
                    JSON['stringify'](_0x21e8d1),
                    _0x591df7,
                    _0x5dc78d,
                    _0x21e8d1['deviceId'] || null
                ]);
                console['log']('✅\x20Session\x20saved\x20to\x20MySQL:\x20' + _0x29f757);
            }
        } catch (_0x18bc79) {
            console['error']('❌\x20DB\x20session\x20save\x20failed:', _0x18bc79['message']);
        }
        return _0x29f757;
    }
    async ['loadSession']() {
        await this['init']();
        try {
            if (this['dbType'] === 'mongodb' && this['db']) {
                const _0x16f5fe = await this['db']['findOne']({ 'registered': !![] })['sort']({ 'updatedAt': -0x1 });
                if (_0x16f5fe) {
                    console['log']('✅\x20Session\x20loaded\x20from\x20MongoDB:\x20' + _0x16f5fe['sessionId']);
                    this['saveLocal'](_0x16f5fe['creds']);
                    return _0x16f5fe['creds'];
                }
            } else if (this['dbType'] === 'postgresql' && this['pool']) {
                const _0x2954e7 = await this['pool']['query']('SELECT\x20session_id,\x20creds\x20FROM\x20sessions\x20WHERE\x20registered\x20=\x20true\x20ORDER\x20BY\x20updated_at\x20DESC\x20LIMIT\x201');
                if (_0x2954e7['rows']['length'] > 0x0) {
                    console['log']('✅\x20Session\x20loaded\x20from\x20PostgreSQL:\x20' + _0x2954e7['rows'][0x0]['session_id']);
                    this['saveLocal'](_0x2954e7['rows'][0x0]['creds']);
                    return _0x2954e7['rows'][0x0]['creds'];
                }
            } else if (this['dbType'] === 'mysql' && this['mysqlConn']) {
                const [_0x4b3779] = await this['mysqlConn']['execute']('SELECT\x20session_id,\x20creds\x20FROM\x20sessions\x20WHERE\x20registered\x20=\x20true\x20ORDER\x20BY\x20updated_at\x20DESC\x20LIMIT\x201');
                if (_0x4b3779['length'] > 0x0) {
                    console['log']('✅\x20Session\x20loaded\x20from\x20MySQL:\x20' + _0x4b3779[0x0]['session_id']);
                    this['saveLocal'](_0x4b3779[0x0]['creds']);
                    return _0x4b3779[0x0]['creds'];
                }
            }
        } catch (_0x2b6c6a) {
            console['error']('❌\x20DB\x20session\x20load\x20failed:', _0x2b6c6a['message']);
        }
        const _0xf9f105 = this['loadLocal']();
        if (_0xf9f105) {
            console['log']('📂\x20Session\x20loaded\x20from\x20local\x20file');
            return _0xf9f105;
        }
        console['log']('⚠️\x20No\x20session\x20found');
        return null;
    }
    ['saveLocal'](_0x5f31e9) {
        try {
            if (!_0x0_0x220ae3['existsSync'](SESSION_DIR)) {
                _0x0_0x220ae3['mkdirSync'](SESSION_DIR, { 'recursive': !![] });
            }
            _0x0_0x220ae3['writeFileSync'](CREDS_FILE, JSON['stringify'](_0x5f31e9, null, 0x2));
            return !![];
        } catch (_0x25f4bc) {
            console['error']('❌\x20Local\x20save\x20failed:', _0x25f4bc['message']);
            return ![];
        }
    }
    ['loadLocal']() {
        try {
            if (_0x0_0x220ae3['existsSync'](CREDS_FILE)) {
                return JSON['parse'](_0x0_0x220ae3['readFileSync'](CREDS_FILE, 'utf-8'));
            }
            return null;
        } catch (_0x2100b8) {
            console['error']('❌\x20Local\x20load\x20failed:', _0x2100b8['message']);
            return null;
        }
    }
    ['generateSessionId']() {
        const _0x5e08e0 = 'abcdefghijklmnopqrstuvwxyz0123456789';
        const _0x50bc85 = Array['from']({ 'length': 0x6 }, () => _0x5e08e0[Math['floor'](Math['random']() * _0x5e08e0['length'])])['join']('');
        const _0x51164e = String(Math['floor'](Math['random']() * 0x2710))['padStart'](0x4, '0');
        return 'NOVA-' + _0x50bc85 + _0x51164e;
    }
    ['hasValidSession']() {
        try {
            const _0x2734b1 = this['loadLocal']();
            if (!_0x2734b1)
                return ![];
            if (!_0x2734b1['noiseKey'] || !_0x2734b1['signedIdentityKey'] || !_0x2734b1['signedPreKey']) {
                return ![];
            }
            if (_0x2734b1['registered'] !== !![] && !_0x2734b1['me']?.['id']) {
                return ![];
            }
            return !![];
        } catch (_0x18084c) {
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
        } catch (_0x5aa9ee) {
            console['error']('❌\x20DB\x20delete\x20failed:', _0x5aa9ee['message']);
        }
        try {
            if (_0x0_0x220ae3['existsSync'](CREDS_FILE)) {
                _0x0_0x220ae3['unlinkSync'](CREDS_FILE);
                console['log']('🗑️\x20Local\x20session\x20deleted');
            }
        } catch (_0x1c5e5a) {
            console['error']('❌\x20Local\x20delete\x20failed:', _0x1c5e5a['message']);
        }
    }
    async ['close']() {
        try {
            if (this['dbType'] === 'mongodb') {
                const _0x4fc7ec = require('mongoose');
                await _0x4fc7ec['connection']['close']();
            } else if (this['dbType'] === 'postgresql' && this['pool']) {
                await this['pool']['end']();
            } else if (this['dbType'] === 'mysql' && this['mysqlConn']) {
                await this['mysqlConn']['end']();
            }
            console['log']('🔒\x20Session\x20database\x20closed');
        } catch (_0x348eb4) {
            console['error']('❌\x20Close\x20failed:', _0x348eb4['message']);
        }
    }
}
export default new SessionManager();