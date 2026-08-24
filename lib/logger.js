import _0x0_0x4a20ef from 'fs';
import _0x0_0x425197 from 'path';
const LOG_DIR = _0x0_0x425197['join'](process['cwd'](), 'logs');
if (!_0x0_0x4a20ef['existsSync'](LOG_DIR))
    _0x0_0x4a20ef['mkdirSync'](LOG_DIR, { 'recursive': !![] });
const LOG_FILE = _0x0_0x425197['join'](LOG_DIR, 'error.log');
const MAX_SIZE_BYTES = 0x1 * 0x400 * 0x400;
const MAX_BACKUPS = 0x3;
function rotateLogs() {
    try {
        if (!_0x0_0x4a20ef['existsSync'](LOG_FILE))
            return;
        const _0x216716 = _0x0_0x4a20ef['statSync'](LOG_FILE);
        if (_0x216716['size'] < MAX_SIZE_BYTES)
            return;
        for (let _0x170833 = MAX_BACKUPS - 0x1; _0x170833 >= 0x1; _0x170833--) {
            const _0xcb558c = LOG_FILE + '.' + _0x170833;
            const _0x198aad = LOG_FILE + '.' + (_0x170833 + 0x1);
            if (_0x0_0x4a20ef['existsSync'](_0xcb558c))
                _0x0_0x4a20ef['renameSync'](_0xcb558c, _0x198aad);
        }
        _0x0_0x4a20ef['renameSync'](LOG_FILE, LOG_FILE + '.1');
    } catch (_0x1599f5) {
        console['error']('Log\x20rotation\x20failed:', _0x1599f5['message']);
    }
}
export function writeErrorLog(_0x5a7ed7) {
    try {
        rotateLogs();
        _0x0_0x4a20ef['appendFileSync'](LOG_FILE, JSON['stringify'](_0x5a7ed7) + '\x0a');
    } catch (_0x475dde) {
        console['error']('Failed\x20to\x20write\x20error\x20log:', _0x475dde['message']);
    }
}