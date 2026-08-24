import _0x0_0x26239f from 'fs';
import _0x0_0x179623 from 'path';
const LOG_DIR = _0x0_0x179623['join'](process['cwd'](), 'logs');
if (!_0x0_0x26239f['existsSync'](LOG_DIR))
    _0x0_0x26239f['mkdirSync'](LOG_DIR, { 'recursive': !![] });
const LOG_FILE = _0x0_0x179623['join'](LOG_DIR, 'error.log');
const MAX_SIZE_BYTES = 0x1 * 0x400 * 0x400;
const MAX_BACKUPS = 0x3;
function rotateLogs() {
    try {
        if (!_0x0_0x26239f['existsSync'](LOG_FILE))
            return;
        const _0x510e3e = _0x0_0x26239f['statSync'](LOG_FILE);
        if (_0x510e3e['size'] < MAX_SIZE_BYTES)
            return;
        for (let _0x5708e2 = MAX_BACKUPS - 0x1; _0x5708e2 >= 0x1; _0x5708e2--) {
            const _0x3d524b = LOG_FILE + '.' + _0x5708e2;
            const _0x1a157d = LOG_FILE + '.' + (_0x5708e2 + 0x1);
            if (_0x0_0x26239f['existsSync'](_0x3d524b))
                _0x0_0x26239f['renameSync'](_0x3d524b, _0x1a157d);
        }
        _0x0_0x26239f['renameSync'](LOG_FILE, LOG_FILE + '.1');
    } catch (_0x44fc88) {
        console['error']('Log\x20rotation\x20failed:', _0x44fc88['message']);
    }
}
export function writeErrorLog(_0x286987) {
    try {
        rotateLogs();
        _0x0_0x26239f['appendFileSync'](LOG_FILE, JSON['stringify'](_0x286987) + '\x0a');
    } catch (_0x12f02a) {
        console['error']('Failed\x20to\x20write\x20error\x20log:', _0x12f02a['message']);
    }
}