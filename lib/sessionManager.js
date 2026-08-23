import _0x0_0x550ea1 from 'fs';
import _0x0_0x19b1b4 from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
const __filename = fileURLToPath(import.meta.url);
const __dirname = _0x0_0x19b1b4['dirname'](__filename);
const require = createRequire(import.meta.url);
const SESSION_DIR = _0x0_0x19b1b4['join'](process['cwd'](), 'session');
const CREDS_FILE = _0x0_0x19b1b4['join'](SESSION_DIR, 'creds.json');
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
        } catch (_0xb87e1) {
            console['error']('❌\x20Session\x20DB\x20initialization\x20failed:', _0xb87e1['message']);
            console['log']('💾\x20Falling\x20back\x20to\x20local\x20file\x20storage');
            this['dbType'] = 'local';
            this['initialized'] = !![];
        }
    }
    async ['initMongoDB']() {
        try {
            const _0x10f870 = require('mongoose');
            await _0x10f870['connect'](MONGO_URL);
            const _0x169629 = new _0x10f870['Schema']({
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
            this['SessionModel'] = _0x10f870['model']('Session', _0x169629);
            this['db'] = this['SessionModel'];
            console['log']('✅\x20MongoDB\x20session\x20storage\x20initialized');
        } catch (_0x9dae2) {
            throw new Error('MongoDB\x20init\x20failed:\x20' + _0x9dae2['message']);
        }
    }
    async ['initPostgreSQL']() {
        try {
            const _0x3e3da5 = require('pg');
            const {Pool: _0xd8778b} = _0x3e3da5;
            this['pool'] = new _0xd8778b({
                'connectionString': POSTGRES_URL,
                'ssl': process.env.NODE_ENV === 'production' ? { 'rejectUnauthorized': ![] } : ![]
            });
            await this['pool']['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20sessions\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20session_id\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20creds\x20JSONB\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20registered\x20BOOLEAN\x20DEFAULT\x20FALSE,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20phone_number\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20device_id\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20created_at\x20TIMESTAMP\x20DEFAULT\x20CURRENT_TIMESTAMP,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20updated_at\x20TIMESTAMP\x20DEFAULT\x20CURRENT_TIMESTAMP\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
            await this['pool']['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20INDEX\x20IF\x20NOT\x20EXISTS\x20idx_sessions_session_id\x20ON\x20sessions(session_id)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
            console['log']('✅\x20PostgreSQL\x20session\x20storage\x20initialized');
        } catch (_0x34edfd) {
            throw new Error('PostgreSQL\x20init\x20failed:\x20' + _0x34edfd['message']);
        }
    }
    async ['initMySQL']() {
        try {
            const _0xd54d56 = require('mysql2/promise');
            this['mysqlConn'] = await _0xd54d56['createConnection'](MYSQL_URL);
            await this['mysqlConn']['execute']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20sessions\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20session_id\x20VARCHAR(255)\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20creds\x20JSON\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20registered\x20BOOLEAN\x20DEFAULT\x20FALSE,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20phone_number\x20VARCHAR(50),\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20device_id\x20VARCHAR(255),\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20created_at\x20TIMESTAMP\x20DEFAULT\x20CURRENT_TIMESTAMP,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20updated_at\x20TIMESTAMP\x20DEFAULT\x20CURRENT_TIMESTAMP\x20ON\x20UPDATE\x20CURRENT_TIMESTAMP,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20INDEX\x20idx_session_id\x20(session_id)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x20ENGINE=InnoDB\x20DEFAULT\x20CHARSET=utf8mb4\x20COLLATE=utf8mb4_unicode_ci\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
            console['log']('✅\x20MySQL\x20session\x20storage\x20initialized');
        } catch (_0x29e6c6) {
            throw new Error('MySQL\x20init\x20failed:\x20' + _0x29e6c6['message']);
        }
    }
    async ['saveSession'](_0x1e5f4b, _0x30efbb = null) {
        await this['init']();
        const _0x40685b = this['generateSessionId']();
        const _0x24842c = _0x1e5f4b['registered'] === !![] || !!_0x1e5f4b['me']?.['id'];
        this['saveLocal'](_0x1e5f4b);
        try {
            if (this['dbType'] === 'mongodb' && this['db']) {
                await this['db']['updateOne']({ 'sessionId': _0x40685b }, {
                    'sessionId': _0x40685b,
                    'creds': _0x1e5f4b,
                    'registered': _0x24842c,
                    'phoneNumber': _0x30efbb,
                    'deviceId': _0x1e5f4b['deviceId'] || null,
                    'updatedAt': new Date()
                }, { 'upsert': !![] });
                console['log']('✅\x20Session\x20saved\x20to\x20MongoDB:\x20' + _0x40685b);
            } else if (this['dbType'] === 'postgresql' && this['pool']) {
                await this['pool']['query']('INSERT\x20INTO\x20sessions\x20(session_id,\x20creds,\x20registered,\x20phone_number,\x20device_id,\x20updated_at)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20VALUES\x20($1,\x20$2,\x20$3,\x20$4,\x20$5,\x20CURRENT_TIMESTAMP)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(session_id)\x20DO\x20UPDATE\x20SET\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20creds\x20=\x20EXCLUDED.creds,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20registered\x20=\x20EXCLUDED.registered,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20phone_number\x20=\x20EXCLUDED.phone_number,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20device_id\x20=\x20EXCLUDED.device_id,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20updated_at\x20=\x20CURRENT_TIMESTAMP', [
                    _0x40685b,
                    _0x1e5f4b,
                    _0x24842c,
                    _0x30efbb,
                    _0x1e5f4b['deviceId'] || null
                ]);
                console['log']('✅\x20Session\x20saved\x20to\x20PostgreSQL:\x20' + _0x40685b);
            } else if (this['dbType'] === 'mysql' && this['mysqlConn']) {
                await this['mysqlConn']['execute']('INSERT\x20INTO\x20sessions\x20(session_id,\x20creds,\x20registered,\x20phone_number,\x20device_id,\x20updated_at)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20VALUES\x20(?,\x20?,\x20?,\x20?,\x20?,\x20CURRENT_TIMESTAMP)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20creds\x20=\x20VALUES(creds),\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20registered\x20=\x20VALUES(registered),\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20phone_number\x20=\x20VALUES(phone_number),\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20device_id\x20=\x20VALUES(device_id),\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20updated_at\x20=\x20CURRENT_TIMESTAMP', [
                    _0x40685b,
                    JSON['stringify'](_0x1e5f4b),
                    _0x24842c,
                    _0x30efbb,
                    _0x1e5f4b['deviceId'] || null
                ]);
                console['log']('✅\x20Session\x20saved\x20to\x20MySQL:\x20' + _0x40685b);
            }
        } catch (_0x3a4b7e) {
            console['error']('❌\x20DB\x20session\x20save\x20failed:', _0x3a4b7e['message']);
        }
        return _0x40685b;
    }
    async ['loadSession']() {
        await this['init']();
        try {
            if (this['dbType'] === 'mongodb' && this['db']) {
                const _0x1ee886 = await this['db']['findOne']({ 'registered': !![] })['sort']({ 'updatedAt': -0x1 });
                if (_0x1ee886) {
                    console['log']('✅\x20Session\x20loaded\x20from\x20MongoDB:\x20' + _0x1ee886['sessionId']);
                    this['saveLocal'](_0x1ee886['creds']);
                    return _0x1ee886['creds'];
                }
            } else if (this['dbType'] === 'postgresql' && this['pool']) {
                const _0x4f0df4 = await this['pool']['query']('SELECT\x20session_id,\x20creds\x20FROM\x20sessions\x20WHERE\x20registered\x20=\x20true\x20ORDER\x20BY\x20updated_at\x20DESC\x20LIMIT\x201');
                if (_0x4f0df4['rows']['length'] > 0x0) {
                    console['log']('✅\x20Session\x20loaded\x20from\x20PostgreSQL:\x20' + _0x4f0df4['rows'][0x0]['session_id']);
                    this['saveLocal'](_0x4f0df4['rows'][0x0]['creds']);
                    return _0x4f0df4['rows'][0x0]['creds'];
                }
            } else if (this['dbType'] === 'mysql' && this['mysqlConn']) {
                const [_0x282505] = await this['mysqlConn']['execute']('SELECT\x20session_id,\x20creds\x20FROM\x20sessions\x20WHERE\x20registered\x20=\x20true\x20ORDER\x20BY\x20updated_at\x20DESC\x20LIMIT\x201');
                if (_0x282505['length'] > 0x0) {
                    console['log']('✅\x20Session\x20loaded\x20from\x20MySQL:\x20' + _0x282505[0x0]['session_id']);
                    this['saveLocal'](_0x282505[0x0]['creds']);
                    return _0x282505[0x0]['creds'];
                }
            }
        } catch (_0x443b84) {
            console['error']('❌\x20DB\x20session\x20load\x20failed:', _0x443b84['message']);
        }
        const _0x29b20c = this['loadLocal']();
        if (_0x29b20c) {
            console['log']('📂\x20Session\x20loaded\x20from\x20local\x20file');
            return _0x29b20c;
        }
        console['log']('⚠️\x20No\x20session\x20found');
        return null;
    }
    ['saveLocal'](_0x3614b9) {
        try {
            if (!_0x0_0x550ea1['existsSync'](SESSION_DIR)) {
                _0x0_0x550ea1['mkdirSync'](SESSION_DIR, { 'recursive': !![] });
            }
            _0x0_0x550ea1['writeFileSync'](CREDS_FILE, JSON['stringify'](_0x3614b9, null, 0x2));
            return !![];
        } catch (_0x2adf33) {
            console['error']('❌\x20Local\x20save\x20failed:', _0x2adf33['message']);
            return ![];
        }
    }
    ['loadLocal']() {
        try {
            if (_0x0_0x550ea1['existsSync'](CREDS_FILE)) {
                return JSON['parse'](_0x0_0x550ea1['readFileSync'](CREDS_FILE, 'utf-8'));
            }
            return null;
        } catch (_0x58021a) {
            console['error']('❌\x20Local\x20load\x20failed:', _0x58021a['message']);
            return null;
        }
    }
    ['generateSessionId']() {
        const _0x256d9a = 'abcdefghijklmnopqrstuvwxyz0123456789';
        const _0x4353dc = Array['from']({ 'length': 0x6 }, () => _0x256d9a[Math['floor'](Math['random']() * _0x256d9a['length'])])['join']('');
        const _0x3ae809 = String(Math['floor'](Math['random']() * 0x2710))['padStart'](0x4, '0');
        return 'NOVA-' + _0x4353dc + _0x3ae809;
    }
    ['hasValidSession']() {
        try {
            const _0x460546 = this['loadLocal']();
            if (!_0x460546)
                return ![];
            if (!_0x460546['noiseKey'] || !_0x460546['signedIdentityKey'] || !_0x460546['signedPreKey']) {
                return ![];
            }
            if (_0x460546['registered'] !== !![] && !_0x460546['me']?.['id']) {
                return ![];
            }
            return !![];
        } catch (_0x33caf1) {
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
        } catch (_0x2cf52b) {
            console['error']('❌\x20DB\x20delete\x20failed:', _0x2cf52b['message']);
        }
        try {
            if (_0x0_0x550ea1['existsSync'](CREDS_FILE)) {
                _0x0_0x550ea1['unlinkSync'](CREDS_FILE);
                console['log']('🗑️\x20Local\x20session\x20deleted');
            }
        } catch (_0x226427) {
            console['error']('❌\x20Local\x20delete\x20failed:', _0x226427['message']);
        }
    }
    async ['close']() {
        try {
            if (this['dbType'] === 'mongodb') {
                const _0x790b07 = require('mongoose');
                await _0x790b07['connection']['close']();
            } else if (this['dbType'] === 'postgresql' && this['pool']) {
                await this['pool']['end']();
            } else if (this['dbType'] === 'mysql' && this['mysqlConn']) {
                await this['mysqlConn']['end']();
            }
            console['log']('🔒\x20Session\x20database\x20closed');
        } catch (_0x3721c2) {
            console['error']('❌\x20Close\x20failed:', _0x3721c2['message']);
        }
    }
}
export default new SessionManager();