import _0x0_0x52a638 from 'fs';
import _0x0_0x5160a8 from 'path';
const LOG_DIR = _0x0_0x5160a8['join'](process['cwd'](), 'logs');
if (!_0x0_0x52a638['existsSync'](LOG_DIR))
    _0x0_0x52a638['mkdirSync'](LOG_DIR, { 'recursive': !![] });
const LOG_FILE = _0x0_0x5160a8['join'](LOG_DIR, 'error.log');
const MAX_SIZE_BYTES = 0x1 * 0x400 * 0x400;
const MAX_BACKUPS = 0x3;
function rotateLogs() {
    try {
        if (!_0x0_0x52a638['existsSync'](LOG_FILE))
            return;
        const _0x556120 = _0x0_0x52a638['statSync'](LOG_FILE);
        if (_0x556120['size'] < MAX_SIZE_BYTES)
            return;
        for (let _0x25a7b6 = MAX_BACKUPS - 0x1; _0x25a7b6 >= 0x1; _0x25a7b6--) {
            const _0x2baaf8 = LOG_FILE + '.' + _0x25a7b6;
            const _0xcb65d1 = LOG_FILE + '.' + (_0x25a7b6 + 0x1);
            if (_0x0_0x52a638['existsSync'](_0x2baaf8))
                _0x0_0x52a638['renameSync'](_0x2baaf8, _0xcb65d1);
        }
        _0x0_0x52a638['renameSync'](LOG_FILE, LOG_FILE + '.1');
    } catch (_0x275cd7) {
        console['error']('Log\x20rotation\x20failed:', _0x275cd7['message']);
    }
}
export function writeErrorLog(_0x3e9dd1) {
    try {
        rotateLogs();
        _0x0_0x52a638['appendFileSync'](LOG_FILE, JSON['stringify'](_0x3e9dd1) + '\x0a');
    } catch (_0x24896b) {
        console['error']('Failed\x20to\x20write\x20error\x20log:', _0x24896b['message']);
    }
}