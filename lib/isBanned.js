import _0x0_0xad035b from 'fs';
import _0x0_0x451533 from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const bannedFilePath = './data/banned.json';
async function isBanned(_0x54fafe) {
    try {
        if (HAS_DB) {
            const _0x39c020 = await _0x0_0x451533['getSetting']('global', 'banned');
            return (_0x39c020 || [])['includes'](_0x54fafe);
        } else {
            if (!_0x0_0xad035b['existsSync'](bannedFilePath)) {
                return ![];
            }
            const _0x37561b = JSON['parse'](_0x0_0xad035b['readFileSync'](bannedFilePath, 'utf8'));
            return _0x37561b['includes'](_0x54fafe);
        }
    } catch (_0x2c9e21) {
        console['error']('Error\x20checking\x20banned\x20status:', _0x2c9e21);
        return ![];
    }
}
export {
    isBanned
};