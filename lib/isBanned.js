import _0x0_0x317144 from 'fs';
import _0x0_0x1f7ec2 from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const bannedFilePath = './data/banned.json';
async function isBanned(_0x534818) {
    try {
        if (HAS_DB) {
            const _0x257864 = await _0x0_0x1f7ec2['getSetting']('global', 'banned');
            return (_0x257864 || [])['includes'](_0x534818);
        } else {
            if (!_0x0_0x317144['existsSync'](bannedFilePath)) {
                return ![];
            }
            const _0x7bf324 = JSON['parse'](_0x0_0x317144['readFileSync'](bannedFilePath, 'utf8'));
            return _0x7bf324['includes'](_0x534818);
        }
    } catch (_0x372db7) {
        console['error']('Error\x20checking\x20banned\x20status:', _0x372db7);
        return ![];
    }
}
export {
    isBanned
};