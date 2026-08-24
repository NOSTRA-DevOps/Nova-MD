import _0x0_0xe365b7 from 'fs';
import _0x0_0x4336da from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const bannedFilePath = './data/banned.json';
async function isBanned(_0x281e0d) {
    try {
        if (HAS_DB) {
            const _0x246444 = await _0x0_0x4336da['getSetting']('global', 'banned');
            return (_0x246444 || [])['includes'](_0x281e0d);
        } else {
            if (!_0x0_0xe365b7['existsSync'](bannedFilePath)) {
                return ![];
            }
            const _0x46dfd2 = JSON['parse'](_0x0_0xe365b7['readFileSync'](bannedFilePath, 'utf8'));
            return _0x46dfd2['includes'](_0x281e0d);
        }
    } catch (_0x1f2b72) {
        console['error']('Error\x20checking\x20banned\x20status:', _0x1f2b72);
        return ![];
    }
}
export {
    isBanned
};