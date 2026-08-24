import _0x0_0xf87b98 from 'fs';
import _0x0_0x571ee5 from 'path';
function cleanupTempFiles() {
    const _0x355572 = _0x0_0x571ee5['join'](process['cwd'](), 'temp');
    if (!_0x0_0xf87b98['existsSync'](_0x355572)) {
        return;
    }
    _0x0_0xf87b98['readdir'](_0x355572, (_0x44879a, _0x57541f) => {
        if (_0x44879a) {
            console['error']('Error\x20reading\x20temp\x20directory:', _0x44879a);
            return;
        }
        let _0x397e4b = 0x0;
        const _0x28da34 = Date['now']();
        const _0x21de2f = 0x1 * 0x3c * 0x3c * 0x3e8;
        _0x57541f['forEach'](_0x1962cb => {
            const _0x42ccc4 = _0x0_0x571ee5['join'](_0x355572, _0x1962cb);
            _0x0_0xf87b98['stat'](_0x42ccc4, (_0x5f07ce, _0x26589d) => {
                if (_0x5f07ce)
                    return;
                if (_0x28da34 - _0x26589d['mtimeMs'] > _0x21de2f) {
                    _0x0_0xf87b98['unlink'](_0x42ccc4, _0x389071 => {
                        if (!_0x389071) {
                            _0x397e4b++;
                            console['log']('Cleaned\x20temp\x20file:\x20' + _0x1962cb);
                        }
                    });
                }
            });
        });
        if (_0x397e4b > 0x0) {
            console['log']('Cleaned\x20' + _0x397e4b + '\x20temp\x20files');
        }
    });
}
cleanupTempFiles();
setInterval(cleanupTempFiles, 0x3c * 0x3c * 0x3e8);
export default { 'cleanupTempFiles': cleanupTempFiles };