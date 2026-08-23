import _0x0_0x34f0cc from 'fs';
import _0x0_0x1b5f12 from 'path';
function cleanupTempFiles() {
    const _0xcf07ca = _0x0_0x1b5f12['join'](process['cwd'](), 'temp');
    if (!_0x0_0x34f0cc['existsSync'](_0xcf07ca)) {
        return;
    }
    _0x0_0x34f0cc['readdir'](_0xcf07ca, (_0x31fc76, _0x156bca) => {
        if (_0x31fc76) {
            console['error']('Error\x20reading\x20temp\x20directory:', _0x31fc76);
            return;
        }
        let _0x4286f7 = 0x0;
        const _0x37c4a2 = Date['now']();
        const _0x5e6ab8 = 0x1 * 0x3c * 0x3c * 0x3e8;
        _0x156bca['forEach'](_0x2ce86a => {
            const _0x50dc19 = _0x0_0x1b5f12['join'](_0xcf07ca, _0x2ce86a);
            _0x0_0x34f0cc['stat'](_0x50dc19, (_0x26f4d0, _0x51dd71) => {
                if (_0x26f4d0)
                    return;
                if (_0x37c4a2 - _0x51dd71['mtimeMs'] > _0x5e6ab8) {
                    _0x0_0x34f0cc['unlink'](_0x50dc19, _0x5e326a => {
                        if (!_0x5e326a) {
                            _0x4286f7++;
                            console['log']('Cleaned\x20temp\x20file:\x20' + _0x2ce86a);
                        }
                    });
                }
            });
        });
        if (_0x4286f7 > 0x0) {
            console['log']('Cleaned\x20' + _0x4286f7 + '\x20temp\x20files');
        }
    });
}
cleanupTempFiles();
setInterval(cleanupTempFiles, 0x3c * 0x3c * 0x3e8);
export default { 'cleanupTempFiles': cleanupTempFiles };