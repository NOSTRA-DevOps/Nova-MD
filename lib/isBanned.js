import _0x0_0x542fe7 from 'fs';
import _0x0_0x27bd0d from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const bannedFilePath = './data/banned.json';
async function isBanned(_0x225725) {
    try {
        if (HAS_DB) {
            const _0xb5e3b2 = await _0x0_0x27bd0d['getSetting']('global', 'banned');
            return (_0xb5e3b2 || [])['includes'](_0x225725);
        } else {
            if (!_0x0_0x542fe7['existsSync'](bannedFilePath)) {
                return ![];
            }
            const _0x22b136 = JSON['parse'](_0x0_0x542fe7['readFileSync'](bannedFilePath, 'utf8'));
            return _0x22b136['includes'](_0x225725);
        }
    } catch (_0x82da4e) {
        console['error']('Error\x20checking\x20banned\x20status:', _0x82da4e);
        return ![];
    }
}
export {
    isBanned
};