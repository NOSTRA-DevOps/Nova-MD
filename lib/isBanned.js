import _0x0_0xfc059b from 'fs';
import _0x0_0xc5328c from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const bannedFilePath = './data/banned.json';
async function isBanned(_0x52f9ec) {
    try {
        if (HAS_DB) {
            const _0x2a14da = await _0x0_0xc5328c['getSetting']('global', 'banned');
            return (_0x2a14da || [])['includes'](_0x52f9ec);
        } else {
            if (!_0x0_0xfc059b['existsSync'](bannedFilePath)) {
                return ![];
            }
            const _0x2a7921 = JSON['parse'](_0x0_0xfc059b['readFileSync'](bannedFilePath, 'utf8'));
            return _0x2a7921['includes'](_0x52f9ec);
        }
    } catch (_0x108de6) {
        console['error']('Error\x20checking\x20banned\x20status:', _0x108de6);
        return ![];
    }
}
export {
    isBanned
};