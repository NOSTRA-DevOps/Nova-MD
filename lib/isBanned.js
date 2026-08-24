import _0x0_0x1ee765 from 'fs';
import _0x0_0x1aa695 from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const bannedFilePath = './data/banned.json';
async function isBanned(_0x3b3b94) {
    try {
        if (HAS_DB) {
            const _0x1e9bfc = await _0x0_0x1aa695['getSetting']('global', 'banned');
            return (_0x1e9bfc || [])['includes'](_0x3b3b94);
        } else {
            if (!_0x0_0x1ee765['existsSync'](bannedFilePath)) {
                return ![];
            }
            const _0x53c3ad = JSON['parse'](_0x0_0x1ee765['readFileSync'](bannedFilePath, 'utf8'));
            return _0x53c3ad['includes'](_0x3b3b94);
        }
    } catch (_0x54d193) {
        console['error']('Error\x20checking\x20banned\x20status:', _0x54d193);
        return ![];
    }
}
export {
    isBanned
};