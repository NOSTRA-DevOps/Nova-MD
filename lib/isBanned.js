import _0x0_0x4f1d65 from 'fs';
import _0x0_0x46a28e from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const bannedFilePath = './data/banned.json';
async function isBanned(_0x2a80fb) {
    try {
        if (HAS_DB) {
            const _0xf32e6b = await _0x0_0x46a28e['getSetting']('global', 'banned');
            return (_0xf32e6b || [])['includes'](_0x2a80fb);
        } else {
            if (!_0x0_0x4f1d65['existsSync'](bannedFilePath)) {
                return ![];
            }
            const _0x7698c3 = JSON['parse'](_0x0_0x4f1d65['readFileSync'](bannedFilePath, 'utf8'));
            return _0x7698c3['includes'](_0x2a80fb);
        }
    } catch (_0x1057d6) {
        console['error']('Error\x20checking\x20banned\x20status:', _0x1057d6);
        return ![];
    }
}
export {
    isBanned
};