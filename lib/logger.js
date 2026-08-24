import _0x0_0x851591 from 'fs';
import _0x0_0x3949c5 from 'path';
const LOG_DIR = _0x0_0x3949c5['join'](process['cwd'](), 'logs');
if (!_0x0_0x851591['existsSync'](LOG_DIR))
    _0x0_0x851591['mkdirSync'](LOG_DIR, { 'recursive': !![] });
const LOG_FILE = _0x0_0x3949c5['join'](LOG_DIR, 'error.log');
const MAX_SIZE_BYTES = 0x1 * 0x400 * 0x400;
const MAX_BACKUPS = 0x3;
function rotateLogs() {
    try {
        if (!_0x0_0x851591['existsSync'](LOG_FILE))
            return;
        const _0x320477 = _0x0_0x851591['statSync'](LOG_FILE);
        if (_0x320477['size'] < MAX_SIZE_BYTES)
            return;
        for (let _0x1e0f8b = MAX_BACKUPS - 0x1; _0x1e0f8b >= 0x1; _0x1e0f8b--) {
            const _0x1725a3 = LOG_FILE + '.' + _0x1e0f8b;
            const _0x35e5af = LOG_FILE + '.' + (_0x1e0f8b + 0x1);
            if (_0x0_0x851591['existsSync'](_0x1725a3))
                _0x0_0x851591['renameSync'](_0x1725a3, _0x35e5af);
        }
        _0x0_0x851591['renameSync'](LOG_FILE, LOG_FILE + '.1');
    } catch (_0x5792ba) {
        console['error']('Log\x20rotation\x20failed:', _0x5792ba['message']);
    }
}
export function writeErrorLog(_0x26dfbd) {
    try {
        rotateLogs();
        _0x0_0x851591['appendFileSync'](LOG_FILE, JSON['stringify'](_0x26dfbd) + '\x0a');
    } catch (_0x11a526) {
        console['error']('Failed\x20to\x20write\x20error\x20log:', _0x11a526['message']);
    }
}