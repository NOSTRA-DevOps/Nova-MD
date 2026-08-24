import _0x0_0x4784ae from 'fs';
import _0x0_0x3c5e85 from 'path';
const LOG_DIR = _0x0_0x3c5e85['join'](process['cwd'](), 'logs');
if (!_0x0_0x4784ae['existsSync'](LOG_DIR))
    _0x0_0x4784ae['mkdirSync'](LOG_DIR, { 'recursive': !![] });
const LOG_FILE = _0x0_0x3c5e85['join'](LOG_DIR, 'error.log');
const MAX_SIZE_BYTES = 0x1 * 0x400 * 0x400;
const MAX_BACKUPS = 0x3;
function rotateLogs() {
    try {
        if (!_0x0_0x4784ae['existsSync'](LOG_FILE))
            return;
        const _0x4e2dc8 = _0x0_0x4784ae['statSync'](LOG_FILE);
        if (_0x4e2dc8['size'] < MAX_SIZE_BYTES)
            return;
        for (let _0x1b17a0 = MAX_BACKUPS - 0x1; _0x1b17a0 >= 0x1; _0x1b17a0--) {
            const _0x3685ec = LOG_FILE + '.' + _0x1b17a0;
            const _0x2f1ea5 = LOG_FILE + '.' + (_0x1b17a0 + 0x1);
            if (_0x0_0x4784ae['existsSync'](_0x3685ec))
                _0x0_0x4784ae['renameSync'](_0x3685ec, _0x2f1ea5);
        }
        _0x0_0x4784ae['renameSync'](LOG_FILE, LOG_FILE + '.1');
    } catch (_0x403ed6) {
        console['error']('Log\x20rotation\x20failed:', _0x403ed6['message']);
    }
}
export function writeErrorLog(_0x5d5ff3) {
    try {
        rotateLogs();
        _0x0_0x4784ae['appendFileSync'](LOG_FILE, JSON['stringify'](_0x5d5ff3) + '\x0a');
    } catch (_0x2ab83d) {
        console['error']('Failed\x20to\x20write\x20error\x20log:', _0x2ab83d['message']);
    }
}