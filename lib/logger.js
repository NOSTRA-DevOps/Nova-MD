import _0x0_0x3582b9 from 'fs';
import _0x0_0x5dd0ad from 'path';
const LOG_DIR = _0x0_0x5dd0ad['join'](process['cwd'](), 'logs');
if (!_0x0_0x3582b9['existsSync'](LOG_DIR))
    _0x0_0x3582b9['mkdirSync'](LOG_DIR, { 'recursive': !![] });
const LOG_FILE = _0x0_0x5dd0ad['join'](LOG_DIR, 'error.log');
const MAX_SIZE_BYTES = 0x1 * 0x400 * 0x400;
const MAX_BACKUPS = 0x3;
function rotateLogs() {
    try {
        if (!_0x0_0x3582b9['existsSync'](LOG_FILE))
            return;
        const _0x1b624a = _0x0_0x3582b9['statSync'](LOG_FILE);
        if (_0x1b624a['size'] < MAX_SIZE_BYTES)
            return;
        for (let _0x547ec3 = MAX_BACKUPS - 0x1; _0x547ec3 >= 0x1; _0x547ec3--) {
            const _0x12fb29 = LOG_FILE + '.' + _0x547ec3;
            const _0x4ee540 = LOG_FILE + '.' + (_0x547ec3 + 0x1);
            if (_0x0_0x3582b9['existsSync'](_0x12fb29))
                _0x0_0x3582b9['renameSync'](_0x12fb29, _0x4ee540);
        }
        _0x0_0x3582b9['renameSync'](LOG_FILE, LOG_FILE + '.1');
    } catch (_0x4e2640) {
        console['error']('Log\x20rotation\x20failed:', _0x4e2640['message']);
    }
}
export function writeErrorLog(_0x2f7927) {
    try {
        rotateLogs();
        _0x0_0x3582b9['appendFileSync'](LOG_FILE, JSON['stringify'](_0x2f7927) + '\x0a');
    } catch (_0x1d58a4) {
        console['error']('Failed\x20to\x20write\x20error\x20log:', _0x1d58a4['message']);
    }
}