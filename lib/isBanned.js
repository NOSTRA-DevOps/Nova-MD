import _0x0_0x424855 from 'fs';
import _0x0_0x575c14 from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const bannedFilePath = './data/banned.json';
async function isBanned(_0x484ce8) {
    try {
        if (HAS_DB) {
            const _0x2552a6 = await _0x0_0x575c14['getSetting']('global', 'banned');
            return (_0x2552a6 || [])['includes'](_0x484ce8);
        } else {
            if (!_0x0_0x424855['existsSync'](bannedFilePath)) {
                return ![];
            }
            const _0x342c66 = JSON['parse'](_0x0_0x424855['readFileSync'](bannedFilePath, 'utf8'));
            return _0x342c66['includes'](_0x484ce8);
        }
    } catch (_0x4ac9d6) {
        console['error']('Error\x20checking\x20banned\x20status:', _0x4ac9d6);
        return ![];
    }
}
export {
    isBanned
};