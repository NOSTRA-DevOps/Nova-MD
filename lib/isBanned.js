import _0x0_0x3d5411 from 'fs';
import _0x0_0x30c733 from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const bannedFilePath = './data/banned.json';
async function isBanned(_0x13f08e) {
    try {
        if (HAS_DB) {
            const _0x42c6e6 = await _0x0_0x30c733['getSetting']('global', 'banned');
            return (_0x42c6e6 || [])['includes'](_0x13f08e);
        } else {
            if (!_0x0_0x3d5411['existsSync'](bannedFilePath)) {
                return ![];
            }
            const _0x2194db = JSON['parse'](_0x0_0x3d5411['readFileSync'](bannedFilePath, 'utf8'));
            return _0x2194db['includes'](_0x13f08e);
        }
    } catch (_0x3099ed) {
        console['error']('Error\x20checking\x20banned\x20status:', _0x3099ed);
        return ![];
    }
}
export {
    isBanned
};