import _0x0_0x1b8c63 from 'fs';
import _0x0_0x13ea0f from 'path';
const LOG_DIR = _0x0_0x13ea0f['join'](process['cwd'](), 'logs');
if (!_0x0_0x1b8c63['existsSync'](LOG_DIR))
    _0x0_0x1b8c63['mkdirSync'](LOG_DIR, { 'recursive': !![] });
const LOG_FILE = _0x0_0x13ea0f['join'](LOG_DIR, 'error.log');
const MAX_SIZE_BYTES = 0x1 * 0x400 * 0x400;
const MAX_BACKUPS = 0x3;
function rotateLogs() {
    try {
        if (!_0x0_0x1b8c63['existsSync'](LOG_FILE))
            return;
        const _0x327f51 = _0x0_0x1b8c63['statSync'](LOG_FILE);
        if (_0x327f51['size'] < MAX_SIZE_BYTES)
            return;
        for (let _0x2b3fa7 = MAX_BACKUPS - 0x1; _0x2b3fa7 >= 0x1; _0x2b3fa7--) {
            const _0x511478 = LOG_FILE + '.' + _0x2b3fa7;
            const _0x5f5581 = LOG_FILE + '.' + (_0x2b3fa7 + 0x1);
            if (_0x0_0x1b8c63['existsSync'](_0x511478))
                _0x0_0x1b8c63['renameSync'](_0x511478, _0x5f5581);
        }
        _0x0_0x1b8c63['renameSync'](LOG_FILE, LOG_FILE + '.1');
    } catch (_0x1cab70) {
        console['error']('Log\x20rotation\x20failed:', _0x1cab70['message']);
    }
}
export function writeErrorLog(_0x20659e) {
    try {
        rotateLogs();
        _0x0_0x1b8c63['appendFileSync'](LOG_FILE, JSON['stringify'](_0x20659e) + '\x0a');
    } catch (_0x5ddca2) {
        console['error']('Failed\x20to\x20write\x20error\x20log:', _0x5ddca2['message']);
    }
}