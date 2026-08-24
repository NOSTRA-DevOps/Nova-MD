import _0x0_0x22fc66 from 'fs';
import _0x0_0x3fd0bd from 'path';
const LOG_DIR = _0x0_0x3fd0bd['join'](process['cwd'](), 'logs');
if (!_0x0_0x22fc66['existsSync'](LOG_DIR))
    _0x0_0x22fc66['mkdirSync'](LOG_DIR, { 'recursive': !![] });
const LOG_FILE = _0x0_0x3fd0bd['join'](LOG_DIR, 'error.log');
const MAX_SIZE_BYTES = 0x1 * 0x400 * 0x400;
const MAX_BACKUPS = 0x3;
function rotateLogs() {
    try {
        if (!_0x0_0x22fc66['existsSync'](LOG_FILE))
            return;
        const _0x1edcbc = _0x0_0x22fc66['statSync'](LOG_FILE);
        if (_0x1edcbc['size'] < MAX_SIZE_BYTES)
            return;
        for (let _0x5a8d01 = MAX_BACKUPS - 0x1; _0x5a8d01 >= 0x1; _0x5a8d01--) {
            const _0xf051c4 = LOG_FILE + '.' + _0x5a8d01;
            const _0x9a98f3 = LOG_FILE + '.' + (_0x5a8d01 + 0x1);
            if (_0x0_0x22fc66['existsSync'](_0xf051c4))
                _0x0_0x22fc66['renameSync'](_0xf051c4, _0x9a98f3);
        }
        _0x0_0x22fc66['renameSync'](LOG_FILE, LOG_FILE + '.1');
    } catch (_0x37d24e) {
        console['error']('Log\x20rotation\x20failed:', _0x37d24e['message']);
    }
}
export function writeErrorLog(_0x138ab2) {
    try {
        rotateLogs();
        _0x0_0x22fc66['appendFileSync'](LOG_FILE, JSON['stringify'](_0x138ab2) + '\x0a');
    } catch (_0x41edaa) {
        console['error']('Failed\x20to\x20write\x20error\x20log:', _0x41edaa['message']);
    }
}