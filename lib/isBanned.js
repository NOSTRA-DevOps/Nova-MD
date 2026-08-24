import _0x0_0x7c4d33 from 'fs';
import _0x0_0x5aafc9 from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const bannedFilePath = './data/banned.json';
async function isBanned(_0x1701bc) {
    try {
        if (HAS_DB) {
            const _0x20aeac = await _0x0_0x5aafc9['getSetting']('global', 'banned');
            return (_0x20aeac || [])['includes'](_0x1701bc);
        } else {
            if (!_0x0_0x7c4d33['existsSync'](bannedFilePath)) {
                return ![];
            }
            const _0x988917 = JSON['parse'](_0x0_0x7c4d33['readFileSync'](bannedFilePath, 'utf8'));
            return _0x988917['includes'](_0x1701bc);
        }
    } catch (_0x195c30) {
        console['error']('Error\x20checking\x20banned\x20status:', _0x195c30);
        return ![];
    }
}
export {
    isBanned
};