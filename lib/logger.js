import _0x0_0x47ddc3 from 'fs';
import _0x0_0x1585db from 'path';
const LOG_DIR = _0x0_0x1585db['join'](process['cwd'](), 'logs');
if (!_0x0_0x47ddc3['existsSync'](LOG_DIR))
    _0x0_0x47ddc3['mkdirSync'](LOG_DIR, { 'recursive': !![] });
const LOG_FILE = _0x0_0x1585db['join'](LOG_DIR, 'error.log');
const MAX_SIZE_BYTES = 0x1 * 0x400 * 0x400;
const MAX_BACKUPS = 0x3;
function rotateLogs() {
    try {
        if (!_0x0_0x47ddc3['existsSync'](LOG_FILE))
            return;
        const _0x4df547 = _0x0_0x47ddc3['statSync'](LOG_FILE);
        if (_0x4df547['size'] < MAX_SIZE_BYTES)
            return;
        for (let _0x10138b = MAX_BACKUPS - 0x1; _0x10138b >= 0x1; _0x10138b--) {
            const _0x19b013 = LOG_FILE + '.' + _0x10138b;
            const _0x40edc0 = LOG_FILE + '.' + (_0x10138b + 0x1);
            if (_0x0_0x47ddc3['existsSync'](_0x19b013))
                _0x0_0x47ddc3['renameSync'](_0x19b013, _0x40edc0);
        }
        _0x0_0x47ddc3['renameSync'](LOG_FILE, LOG_FILE + '.1');
    } catch (_0x4c1b42) {
        console['error']('Log\x20rotation\x20failed:', _0x4c1b42['message']);
    }
}
export function writeErrorLog(_0x8ef84d) {
    try {
        rotateLogs();
        _0x0_0x47ddc3['appendFileSync'](LOG_FILE, JSON['stringify'](_0x8ef84d) + '\x0a');
    } catch (_0x1efcd6) {
        console['error']('Failed\x20to\x20write\x20error\x20log:', _0x1efcd6['message']);
    }
}