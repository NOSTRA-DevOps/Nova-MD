import _0x0_0x2f2089 from 'fs';
import _0x0_0x3bc996 from 'path';
const LOG_DIR = _0x0_0x3bc996['join'](process['cwd'](), 'logs');
if (!_0x0_0x2f2089['existsSync'](LOG_DIR))
    _0x0_0x2f2089['mkdirSync'](LOG_DIR, { 'recursive': !![] });
const LOG_FILE = _0x0_0x3bc996['join'](LOG_DIR, 'error.log');
const MAX_SIZE_BYTES = 0x1 * 0x400 * 0x400;
const MAX_BACKUPS = 0x3;
function rotateLogs() {
    try {
        if (!_0x0_0x2f2089['existsSync'](LOG_FILE))
            return;
        const _0x2475c7 = _0x0_0x2f2089['statSync'](LOG_FILE);
        if (_0x2475c7['size'] < MAX_SIZE_BYTES)
            return;
        for (let _0x5609d7 = MAX_BACKUPS - 0x1; _0x5609d7 >= 0x1; _0x5609d7--) {
            const _0x36aafb = LOG_FILE + '.' + _0x5609d7;
            const _0x474143 = LOG_FILE + '.' + (_0x5609d7 + 0x1);
            if (_0x0_0x2f2089['existsSync'](_0x36aafb))
                _0x0_0x2f2089['renameSync'](_0x36aafb, _0x474143);
        }
        _0x0_0x2f2089['renameSync'](LOG_FILE, LOG_FILE + '.1');
    } catch (_0x4a5c58) {
        console['error']('Log\x20rotation\x20failed:', _0x4a5c58['message']);
    }
}
export function writeErrorLog(_0x38369c) {
    try {
        rotateLogs();
        _0x0_0x2f2089['appendFileSync'](LOG_FILE, JSON['stringify'](_0x38369c) + '\x0a');
    } catch (_0x53d09e) {
        console['error']('Failed\x20to\x20write\x20error\x20log:', _0x53d09e['message']);
    }
}