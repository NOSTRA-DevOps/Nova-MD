import _0x0_0x2e6fdf from 'fs';
import _0x0_0x165e7c from 'path';
const LOG_DIR = _0x0_0x165e7c['join'](process['cwd'](), 'logs');
if (!_0x0_0x2e6fdf['existsSync'](LOG_DIR))
    _0x0_0x2e6fdf['mkdirSync'](LOG_DIR, { 'recursive': !![] });
const LOG_FILE = _0x0_0x165e7c['join'](LOG_DIR, 'error.log');
const MAX_SIZE_BYTES = 0x1 * 0x400 * 0x400;
const MAX_BACKUPS = 0x3;
function rotateLogs() {
    try {
        if (!_0x0_0x2e6fdf['existsSync'](LOG_FILE))
            return;
        const _0x1009dd = _0x0_0x2e6fdf['statSync'](LOG_FILE);
        if (_0x1009dd['size'] < MAX_SIZE_BYTES)
            return;
        for (let _0x41a6e9 = MAX_BACKUPS - 0x1; _0x41a6e9 >= 0x1; _0x41a6e9--) {
            const _0x317a9b = LOG_FILE + '.' + _0x41a6e9;
            const _0x4315f2 = LOG_FILE + '.' + (_0x41a6e9 + 0x1);
            if (_0x0_0x2e6fdf['existsSync'](_0x317a9b))
                _0x0_0x2e6fdf['renameSync'](_0x317a9b, _0x4315f2);
        }
        _0x0_0x2e6fdf['renameSync'](LOG_FILE, LOG_FILE + '.1');
    } catch (_0x5931d7) {
        console['error']('Log\x20rotation\x20failed:', _0x5931d7['message']);
    }
}
export function writeErrorLog(_0x383445) {
    try {
        rotateLogs();
        _0x0_0x2e6fdf['appendFileSync'](LOG_FILE, JSON['stringify'](_0x383445) + '\x0a');
    } catch (_0x8bac83) {
        console['error']('Failed\x20to\x20write\x20error\x20log:', _0x8bac83['message']);
    }
}