import _0x0_0x30735b from 'fs';
import _0x0_0x47cac7 from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const bannedFilePath = './data/banned.json';
async function isBanned(_0x5d2c5b) {
    try {
        if (HAS_DB) {
            const _0x4f847f = await _0x0_0x47cac7['getSetting']('global', 'banned');
            return (_0x4f847f || [])['includes'](_0x5d2c5b);
        } else {
            if (!_0x0_0x30735b['existsSync'](bannedFilePath)) {
                return ![];
            }
            const _0x22e8ca = JSON['parse'](_0x0_0x30735b['readFileSync'](bannedFilePath, 'utf8'));
            return _0x22e8ca['includes'](_0x5d2c5b);
        }
    } catch (_0x361f77) {
        console['error']('Error\x20checking\x20banned\x20status:', _0x361f77);
        return ![];
    }
}
export {
    isBanned
};