import _0x0_0x33082c from 'fs';
import _0x0_0x40732f from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const bannedFilePath = './data/banned.json';
async function isBanned(_0x34cf48) {
    try {
        if (HAS_DB) {
            const _0x5b4e3f = await _0x0_0x40732f['getSetting']('global', 'banned');
            return (_0x5b4e3f || [])['includes'](_0x34cf48);
        } else {
            if (!_0x0_0x33082c['existsSync'](bannedFilePath)) {
                return ![];
            }
            const _0x53b0f0 = JSON['parse'](_0x0_0x33082c['readFileSync'](bannedFilePath, 'utf8'));
            return _0x53b0f0['includes'](_0x34cf48);
        }
    } catch (_0x2779f4) {
        console['error']('Error\x20checking\x20banned\x20status:', _0x2779f4);
        return ![];
    }
}
export {
    isBanned
};