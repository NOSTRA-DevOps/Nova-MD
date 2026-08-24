import _0x0_0x4e9703 from 'fs';
import _0x0_0x1a8cc5 from 'path';
const LOG_DIR = _0x0_0x1a8cc5['join'](process['cwd'](), 'logs');
if (!_0x0_0x4e9703['existsSync'](LOG_DIR))
    _0x0_0x4e9703['mkdirSync'](LOG_DIR, { 'recursive': !![] });
const LOG_FILE = _0x0_0x1a8cc5['join'](LOG_DIR, 'error.log');
const MAX_SIZE_BYTES = 0x1 * 0x400 * 0x400;
const MAX_BACKUPS = 0x3;
function rotateLogs() {
    try {
        if (!_0x0_0x4e9703['existsSync'](LOG_FILE))
            return;
        const _0x549f1d = _0x0_0x4e9703['statSync'](LOG_FILE);
        if (_0x549f1d['size'] < MAX_SIZE_BYTES)
            return;
        for (let _0x57c037 = MAX_BACKUPS - 0x1; _0x57c037 >= 0x1; _0x57c037--) {
            const _0x5235d1 = LOG_FILE + '.' + _0x57c037;
            const _0x497b2a = LOG_FILE + '.' + (_0x57c037 + 0x1);
            if (_0x0_0x4e9703['existsSync'](_0x5235d1))
                _0x0_0x4e9703['renameSync'](_0x5235d1, _0x497b2a);
        }
        _0x0_0x4e9703['renameSync'](LOG_FILE, LOG_FILE + '.1');
    } catch (_0x21bdc3) {
        console['error']('Log\x20rotation\x20failed:', _0x21bdc3['message']);
    }
}
export function writeErrorLog(_0x175fec) {
    try {
        rotateLogs();
        _0x0_0x4e9703['appendFileSync'](LOG_FILE, JSON['stringify'](_0x175fec) + '\x0a');
    } catch (_0x44cd3f) {
        console['error']('Failed\x20to\x20write\x20error\x20log:', _0x44cd3f['message']);
    }
}