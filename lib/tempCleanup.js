import _0x0_0x16b370 from 'fs';
import _0x0_0x2d5968 from 'path';
function cleanupTempFiles() {
    const _0x18ccd6 = _0x0_0x2d5968['join'](process['cwd'](), 'temp');
    if (!_0x0_0x16b370['existsSync'](_0x18ccd6)) {
        return;
    }
    _0x0_0x16b370['readdir'](_0x18ccd6, (_0x43c170, _0x1a2010) => {
        if (_0x43c170) {
            console['error']('Error\x20reading\x20temp\x20directory:', _0x43c170);
            return;
        }
        let _0x32ceb2 = 0x0;
        const _0x4beb64 = Date['now']();
        const _0x3faca8 = 0x1 * 0x3c * 0x3c * 0x3e8;
        _0x1a2010['forEach'](_0xa166af => {
            const _0x56f240 = _0x0_0x2d5968['join'](_0x18ccd6, _0xa166af);
            _0x0_0x16b370['stat'](_0x56f240, (_0x34c10c, _0x1018a3) => {
                if (_0x34c10c)
                    return;
                if (_0x4beb64 - _0x1018a3['mtimeMs'] > _0x3faca8) {
                    _0x0_0x16b370['unlink'](_0x56f240, _0x5cb2b9 => {
                        if (!_0x5cb2b9) {
                            _0x32ceb2++;
                            console['log']('Cleaned\x20temp\x20file:\x20' + _0xa166af);
                        }
                    });
                }
            });
        });
        if (_0x32ceb2 > 0x0) {
            console['log']('Cleaned\x20' + _0x32ceb2 + '\x20temp\x20files');
        }
    });
}
cleanupTempFiles();
setInterval(cleanupTempFiles, 0x3c * 0x3c * 0x3e8);
export default { 'cleanupTempFiles': cleanupTempFiles };