import _0x0_0x513f13 from 'fs';
import _0x0_0x16c626 from 'path';
const LOG_DIR = _0x0_0x16c626['join'](process['cwd'](), 'logs');
if (!_0x0_0x513f13['existsSync'](LOG_DIR))
    _0x0_0x513f13['mkdirSync'](LOG_DIR, { 'recursive': !![] });
const LOG_FILE = _0x0_0x16c626['join'](LOG_DIR, 'error.log');
const MAX_SIZE_BYTES = 0x1 * 0x400 * 0x400;
const MAX_BACKUPS = 0x3;
function rotateLogs() {
    try {
        if (!_0x0_0x513f13['existsSync'](LOG_FILE))
            return;
        const _0x58e0ca = _0x0_0x513f13['statSync'](LOG_FILE);
        if (_0x58e0ca['size'] < MAX_SIZE_BYTES)
            return;
        for (let _0x1b74f7 = MAX_BACKUPS - 0x1; _0x1b74f7 >= 0x1; _0x1b74f7--) {
            const _0x1145b9 = LOG_FILE + '.' + _0x1b74f7;
            const _0x49fda0 = LOG_FILE + '.' + (_0x1b74f7 + 0x1);
            if (_0x0_0x513f13['existsSync'](_0x1145b9))
                _0x0_0x513f13['renameSync'](_0x1145b9, _0x49fda0);
        }
        _0x0_0x513f13['renameSync'](LOG_FILE, LOG_FILE + '.1');
    } catch (_0x44f2a9) {
        console['error']('Log\x20rotation\x20failed:', _0x44f2a9['message']);
    }
}
export function writeErrorLog(_0x6760aa) {
    try {
        rotateLogs();
        _0x0_0x513f13['appendFileSync'](LOG_FILE, JSON['stringify'](_0x6760aa) + '\x0a');
    } catch (_0x2daacc) {
        console['error']('Failed\x20to\x20write\x20error\x20log:', _0x2daacc['message']);
    }
}