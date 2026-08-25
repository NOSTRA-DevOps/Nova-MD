import _0x0_0x412f07 from 'fs';
import _0x0_0x3283e8 from 'path';
const LOG_DIR = _0x0_0x3283e8['join'](process['cwd'](), 'logs');
if (!_0x0_0x412f07['existsSync'](LOG_DIR))
    _0x0_0x412f07['mkdirSync'](LOG_DIR, { 'recursive': !![] });
const LOG_FILE = _0x0_0x3283e8['join'](LOG_DIR, 'error.log');
const MAX_SIZE_BYTES = 0x1 * 0x400 * 0x400;
const MAX_BACKUPS = 0x3;
function rotateLogs() {
    try {
        if (!_0x0_0x412f07['existsSync'](LOG_FILE))
            return;
        const _0xeb4e6 = _0x0_0x412f07['statSync'](LOG_FILE);
        if (_0xeb4e6['size'] < MAX_SIZE_BYTES)
            return;
        for (let _0x557127 = MAX_BACKUPS - 0x1; _0x557127 >= 0x1; _0x557127--) {
            const _0x2d7628 = LOG_FILE + '.' + _0x557127;
            const _0x22490c = LOG_FILE + '.' + (_0x557127 + 0x1);
            if (_0x0_0x412f07['existsSync'](_0x2d7628))
                _0x0_0x412f07['renameSync'](_0x2d7628, _0x22490c);
        }
        _0x0_0x412f07['renameSync'](LOG_FILE, LOG_FILE + '.1');
    } catch (_0x14bd57) {
        console['error']('Log\x20rotation\x20failed:', _0x14bd57['message']);
    }
}
export function writeErrorLog(_0x386c58) {
    try {
        rotateLogs();
        _0x0_0x412f07['appendFileSync'](LOG_FILE, JSON['stringify'](_0x386c58) + '\x0a');
    } catch (_0x5a4830) {
        console['error']('Failed\x20to\x20write\x20error\x20log:', _0x5a4830['message']);
    }
}