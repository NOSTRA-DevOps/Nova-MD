import _0x0_0x331996 from 'fs';
import _0x0_0x23ea45 from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const bannedFilePath = './data/banned.json';
async function isBanned(_0x4f6c78) {
    try {
        if (HAS_DB) {
            const _0x5a9f40 = await _0x0_0x23ea45['getSetting']('global', 'banned');
            return (_0x5a9f40 || [])['includes'](_0x4f6c78);
        } else {
            if (!_0x0_0x331996['existsSync'](bannedFilePath)) {
                return ![];
            }
            const _0x4b579e = JSON['parse'](_0x0_0x331996['readFileSync'](bannedFilePath, 'utf8'));
            return _0x4b579e['includes'](_0x4f6c78);
        }
    } catch (_0x57e496) {
        console['error']('Error\x20checking\x20banned\x20status:', _0x57e496);
        return ![];
    }
}
export {
    isBanned
};