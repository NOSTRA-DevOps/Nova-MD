import _0x0_0x16a377 from 'fs';
import _0x0_0x39629a from 'path';
const LOG_DIR = _0x0_0x39629a['join'](process['cwd'](), 'logs');
if (!_0x0_0x16a377['existsSync'](LOG_DIR))
    _0x0_0x16a377['mkdirSync'](LOG_DIR, { 'recursive': !![] });
const LOG_FILE = _0x0_0x39629a['join'](LOG_DIR, 'error.log');
const MAX_SIZE_BYTES = 0x1 * 0x400 * 0x400;
const MAX_BACKUPS = 0x3;
function rotateLogs() {
    try {
        if (!_0x0_0x16a377['existsSync'](LOG_FILE))
            return;
        const _0x26c9b3 = _0x0_0x16a377['statSync'](LOG_FILE);
        if (_0x26c9b3['size'] < MAX_SIZE_BYTES)
            return;
        for (let _0x4a2fc0 = MAX_BACKUPS - 0x1; _0x4a2fc0 >= 0x1; _0x4a2fc0--) {
            const _0x23ecd9 = LOG_FILE + '.' + _0x4a2fc0;
            const _0x1fa39d = LOG_FILE + '.' + (_0x4a2fc0 + 0x1);
            if (_0x0_0x16a377['existsSync'](_0x23ecd9))
                _0x0_0x16a377['renameSync'](_0x23ecd9, _0x1fa39d);
        }
        _0x0_0x16a377['renameSync'](LOG_FILE, LOG_FILE + '.1');
    } catch (_0x979912) {
        console['error']('Log\x20rotation\x20failed:', _0x979912['message']);
    }
}
export function writeErrorLog(_0x3af485) {
    try {
        rotateLogs();
        _0x0_0x16a377['appendFileSync'](LOG_FILE, JSON['stringify'](_0x3af485) + '\x0a');
    } catch (_0x18fcfb) {
        console['error']('Failed\x20to\x20write\x20error\x20log:', _0x18fcfb['message']);
    }
}