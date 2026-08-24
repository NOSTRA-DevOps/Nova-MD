import _0x0_0x5a2b2c from 'fs';
import _0x0_0x535b72 from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const bannedFilePath = './data/banned.json';
async function isBanned(_0x2fd9c4) {
    try {
        if (HAS_DB) {
            const _0x4d3274 = await _0x0_0x535b72['getSetting']('global', 'banned');
            return (_0x4d3274 || [])['includes'](_0x2fd9c4);
        } else {
            if (!_0x0_0x5a2b2c['existsSync'](bannedFilePath)) {
                return ![];
            }
            const _0x3946db = JSON['parse'](_0x0_0x5a2b2c['readFileSync'](bannedFilePath, 'utf8'));
            return _0x3946db['includes'](_0x2fd9c4);
        }
    } catch (_0x71a378) {
        console['error']('Error\x20checking\x20banned\x20status:', _0x71a378);
        return ![];
    }
}
export {
    isBanned
};