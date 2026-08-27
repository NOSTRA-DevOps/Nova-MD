import _0x0_0x1d8abb from 'fs';
import _0x0_0x6c06cf from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const bannedFilePath = './data/banned.json';
async function isBanned(_0x3d5716) {
    try {
        if (HAS_DB) {
            const _0x80a89c = await _0x0_0x6c06cf['getSetting']('global', 'banned');
            return (_0x80a89c || [])['includes'](_0x3d5716);
        } else {
            if (!_0x0_0x1d8abb['existsSync'](bannedFilePath)) {
                return ![];
            }
            const _0x34a128 = JSON['parse'](_0x0_0x1d8abb['readFileSync'](bannedFilePath, 'utf8'));
            return _0x34a128['includes'](_0x3d5716);
        }
    } catch (_0x542b6f) {
        console['error']('Error\x20checking\x20banned\x20status:', _0x542b6f);
        return ![];
    }
}
export {
    isBanned
};