import _0x0_0x252932 from 'fs';
import _0x0_0x1b098a from 'path';
const LOG_DIR = _0x0_0x1b098a['join'](process['cwd'](), 'logs');
if (!_0x0_0x252932['existsSync'](LOG_DIR))
    _0x0_0x252932['mkdirSync'](LOG_DIR, { 'recursive': !![] });
const LOG_FILE = _0x0_0x1b098a['join'](LOG_DIR, 'error.log');
const MAX_SIZE_BYTES = 0x1 * 0x400 * 0x400;
const MAX_BACKUPS = 0x3;
function rotateLogs() {
    try {
        if (!_0x0_0x252932['existsSync'](LOG_FILE))
            return;
        const _0x1a0a0c = _0x0_0x252932['statSync'](LOG_FILE);
        if (_0x1a0a0c['size'] < MAX_SIZE_BYTES)
            return;
        for (let _0x27b041 = MAX_BACKUPS - 0x1; _0x27b041 >= 0x1; _0x27b041--) {
            const _0x141b43 = LOG_FILE + '.' + _0x27b041;
            const _0x3f48d7 = LOG_FILE + '.' + (_0x27b041 + 0x1);
            if (_0x0_0x252932['existsSync'](_0x141b43))
                _0x0_0x252932['renameSync'](_0x141b43, _0x3f48d7);
        }
        _0x0_0x252932['renameSync'](LOG_FILE, LOG_FILE + '.1');
    } catch (_0x36d575) {
        console['error']('Log\x20rotation\x20failed:', _0x36d575['message']);
    }
}
export function writeErrorLog(_0x47f24f) {
    try {
        rotateLogs();
        _0x0_0x252932['appendFileSync'](LOG_FILE, JSON['stringify'](_0x47f24f) + '\x0a');
    } catch (_0x379678) {
        console['error']('Failed\x20to\x20write\x20error\x20log:', _0x379678['message']);
    }
}