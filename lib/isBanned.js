import _0x0_0x25f4bf from 'fs';
import _0x0_0x4873e4 from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const bannedFilePath = './data/banned.json';
async function isBanned(_0x58a428) {
    try {
        if (HAS_DB) {
            const _0x241104 = await _0x0_0x4873e4['getSetting']('global', 'banned');
            return (_0x241104 || [])['includes'](_0x58a428);
        } else {
            if (!_0x0_0x25f4bf['existsSync'](bannedFilePath)) {
                return ![];
            }
            const _0x589d4d = JSON['parse'](_0x0_0x25f4bf['readFileSync'](bannedFilePath, 'utf8'));
            return _0x589d4d['includes'](_0x58a428);
        }
    } catch (_0x1ffa0b) {
        console['error']('Error\x20checking\x20banned\x20status:', _0x1ffa0b);
        return ![];
    }
}
export {
    isBanned
};