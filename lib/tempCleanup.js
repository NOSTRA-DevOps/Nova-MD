import _0x0_0x3315c8 from 'fs';
import _0x0_0x484afe from 'path';
function cleanupTempFiles() {
    const _0x342fe5 = _0x0_0x484afe['join'](process['cwd'](), 'temp');
    if (!_0x0_0x3315c8['existsSync'](_0x342fe5)) {
        return;
    }
    _0x0_0x3315c8['readdir'](_0x342fe5, (_0x3b2179, _0x8f1dc) => {
        if (_0x3b2179) {
            console['error']('Error\x20reading\x20temp\x20directory:', _0x3b2179);
            return;
        }
        let _0x165f7c = 0x0;
        const _0x5f226a = Date['now']();
        const _0x59114a = 0x1 * 0x3c * 0x3c * 0x3e8;
        _0x8f1dc['forEach'](_0x4e6f19 => {
            const _0x4257ee = _0x0_0x484afe['join'](_0x342fe5, _0x4e6f19);
            _0x0_0x3315c8['stat'](_0x4257ee, (_0x50959c, _0x420b77) => {
                if (_0x50959c)
                    return;
                if (_0x5f226a - _0x420b77['mtimeMs'] > _0x59114a) {
                    _0x0_0x3315c8['unlink'](_0x4257ee, _0x2e27fb => {
                        if (!_0x2e27fb) {
                            _0x165f7c++;
                            console['log']('Cleaned\x20temp\x20file:\x20' + _0x4e6f19);
                        }
                    });
                }
            });
        });
        if (_0x165f7c > 0x0) {
            console['log']('Cleaned\x20' + _0x165f7c + '\x20temp\x20files');
        }
    });
}
cleanupTempFiles();
setInterval(cleanupTempFiles, 0x3c * 0x3c * 0x3e8);
export default { 'cleanupTempFiles': cleanupTempFiles };