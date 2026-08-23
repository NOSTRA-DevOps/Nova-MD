import _0x0_0xf64031 from 'fs';
import _0x0_0x221eda from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const bannedFilePath = './data/banned.json';
async function isBanned(_0x5f4a87) {
    try {
        if (HAS_DB) {
            const _0x461092 = await _0x0_0x221eda['getSetting']('global', 'banned');
            return (_0x461092 || [])['includes'](_0x5f4a87);
        } else {
            if (!_0x0_0xf64031['existsSync'](bannedFilePath)) {
                return ![];
            }
            const _0x2f8b1a = JSON['parse'](_0x0_0xf64031['readFileSync'](bannedFilePath, 'utf8'));
            return _0x2f8b1a['includes'](_0x5f4a87);
        }
    } catch (_0x21c024) {
        console['error']('Error\x20checking\x20banned\x20status:', _0x21c024);
        return ![];
    }
}
export {
    isBanned
};