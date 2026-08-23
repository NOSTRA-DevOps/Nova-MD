import _0x0_0x48a0fa from 'fs';
import _0x0_0x11b18f from 'path';
const LOG_DIR = _0x0_0x11b18f['join'](process['cwd'](), 'logs');
if (!_0x0_0x48a0fa['existsSync'](LOG_DIR))
    _0x0_0x48a0fa['mkdirSync'](LOG_DIR, { 'recursive': !![] });
const LOG_FILE = _0x0_0x11b18f['join'](LOG_DIR, 'error.log');
const MAX_SIZE_BYTES = 0x1 * 0x400 * 0x400;
const MAX_BACKUPS = 0x3;
function rotateLogs() {
    try {
        if (!_0x0_0x48a0fa['existsSync'](LOG_FILE))
            return;
        const _0x4c6746 = _0x0_0x48a0fa['statSync'](LOG_FILE);
        if (_0x4c6746['size'] < MAX_SIZE_BYTES)
            return;
        for (let _0x229e41 = MAX_BACKUPS - 0x1; _0x229e41 >= 0x1; _0x229e41--) {
            const _0x1d4e87 = LOG_FILE + '.' + _0x229e41;
            const _0x1a53b2 = LOG_FILE + '.' + (_0x229e41 + 0x1);
            if (_0x0_0x48a0fa['existsSync'](_0x1d4e87))
                _0x0_0x48a0fa['renameSync'](_0x1d4e87, _0x1a53b2);
        }
        _0x0_0x48a0fa['renameSync'](LOG_FILE, LOG_FILE + '.1');
    } catch (_0x787374) {
        console['error']('Log\x20rotation\x20failed:', _0x787374['message']);
    }
}
export function writeErrorLog(_0x1d4315) {
    try {
        rotateLogs();
        _0x0_0x48a0fa['appendFileSync'](LOG_FILE, JSON['stringify'](_0x1d4315) + '\x0a');
    } catch (_0x3c4c89) {
        console['error']('Failed\x20to\x20write\x20error\x20log:', _0x3c4c89['message']);
    }
}