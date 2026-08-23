import _0x0_0x28e08b from 'fs';
import _0x0_0x12a358 from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const bannedFilePath = './data/banned.json';
async function isBanned(_0x21cee2) {
    try {
        if (HAS_DB) {
            const _0xf5582a = await _0x0_0x12a358['getSetting']('global', 'banned');
            return (_0xf5582a || [])['includes'](_0x21cee2);
        } else {
            if (!_0x0_0x28e08b['existsSync'](bannedFilePath)) {
                return ![];
            }
            const _0x5692b8 = JSON['parse'](_0x0_0x28e08b['readFileSync'](bannedFilePath, 'utf8'));
            return _0x5692b8['includes'](_0x21cee2);
        }
    } catch (_0x5dd0d7) {
        console['error']('Error\x20checking\x20banned\x20status:', _0x5dd0d7);
        return ![];
    }
}
export {
    isBanned
};