import _0x0_0x1ca592 from 'fs';
import _0x0_0x45549a from 'path';
const LOG_DIR = _0x0_0x45549a['join'](process['cwd'](), 'logs');
if (!_0x0_0x1ca592['existsSync'](LOG_DIR))
    _0x0_0x1ca592['mkdirSync'](LOG_DIR, { 'recursive': !![] });
const LOG_FILE = _0x0_0x45549a['join'](LOG_DIR, 'error.log');
const MAX_SIZE_BYTES = 0x1 * 0x400 * 0x400;
const MAX_BACKUPS = 0x3;
function rotateLogs() {
    try {
        if (!_0x0_0x1ca592['existsSync'](LOG_FILE))
            return;
        const _0x6885e2 = _0x0_0x1ca592['statSync'](LOG_FILE);
        if (_0x6885e2['size'] < MAX_SIZE_BYTES)
            return;
        for (let _0x2395a0 = MAX_BACKUPS - 0x1; _0x2395a0 >= 0x1; _0x2395a0--) {
            const _0x58de2c = LOG_FILE + '.' + _0x2395a0;
            const _0x556595 = LOG_FILE + '.' + (_0x2395a0 + 0x1);
            if (_0x0_0x1ca592['existsSync'](_0x58de2c))
                _0x0_0x1ca592['renameSync'](_0x58de2c, _0x556595);
        }
        _0x0_0x1ca592['renameSync'](LOG_FILE, LOG_FILE + '.1');
    } catch (_0x27e4a1) {
        console['error']('Log\x20rotation\x20failed:', _0x27e4a1['message']);
    }
}
export function writeErrorLog(_0xdef2a3) {
    try {
        rotateLogs();
        _0x0_0x1ca592['appendFileSync'](LOG_FILE, JSON['stringify'](_0xdef2a3) + '\x0a');
    } catch (_0x7e6cf7) {
        console['error']('Failed\x20to\x20write\x20error\x20log:', _0x7e6cf7['message']);
    }
}