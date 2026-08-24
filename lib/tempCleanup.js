import _0x0_0x12452a from 'fs';
import _0x0_0x3a47de from 'path';
function cleanupTempFiles() {
    const _0x34380e = _0x0_0x3a47de['join'](process['cwd'](), 'temp');
    if (!_0x0_0x12452a['existsSync'](_0x34380e)) {
        return;
    }
    _0x0_0x12452a['readdir'](_0x34380e, (_0x2d3dfb, _0x422e43) => {
        if (_0x2d3dfb) {
            console['error']('Error\x20reading\x20temp\x20directory:', _0x2d3dfb);
            return;
        }
        let _0x563932 = 0x0;
        const _0x3538b3 = Date['now']();
        const _0x252b44 = 0x1 * 0x3c * 0x3c * 0x3e8;
        _0x422e43['forEach'](_0x7ea66b => {
            const _0x5dac44 = _0x0_0x3a47de['join'](_0x34380e, _0x7ea66b);
            _0x0_0x12452a['stat'](_0x5dac44, (_0x7658cd, _0x59ba1c) => {
                if (_0x7658cd)
                    return;
                if (_0x3538b3 - _0x59ba1c['mtimeMs'] > _0x252b44) {
                    _0x0_0x12452a['unlink'](_0x5dac44, _0x1da107 => {
                        if (!_0x1da107) {
                            _0x563932++;
                            console['log']('Cleaned\x20temp\x20file:\x20' + _0x7ea66b);
                        }
                    });
                }
            });
        });
        if (_0x563932 > 0x0) {
            console['log']('Cleaned\x20' + _0x563932 + '\x20temp\x20files');
        }
    });
}
cleanupTempFiles();
setInterval(cleanupTempFiles, 0x3c * 0x3c * 0x3e8);
export default { 'cleanupTempFiles': cleanupTempFiles };