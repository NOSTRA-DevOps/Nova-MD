import _0x0_0x3bb1f8 from 'fs';
import _0x0_0x2d9e7c from 'path';
function cleanupTempFiles() {
    const _0xe201a5 = _0x0_0x2d9e7c['join'](process['cwd'](), 'temp');
    if (!_0x0_0x3bb1f8['existsSync'](_0xe201a5)) {
        return;
    }
    _0x0_0x3bb1f8['readdir'](_0xe201a5, (_0x44af98, _0x931f54) => {
        if (_0x44af98) {
            console['error']('Error\x20reading\x20temp\x20directory:', _0x44af98);
            return;
        }
        let _0x57d8a7 = 0x0;
        const _0x167f12 = Date['now']();
        const _0x51b956 = 0x1 * 0x3c * 0x3c * 0x3e8;
        _0x931f54['forEach'](_0x34d7b3 => {
            const _0x33da52 = _0x0_0x2d9e7c['join'](_0xe201a5, _0x34d7b3);
            _0x0_0x3bb1f8['stat'](_0x33da52, (_0x1cf507, _0x3260cd) => {
                if (_0x1cf507)
                    return;
                if (_0x167f12 - _0x3260cd['mtimeMs'] > _0x51b956) {
                    _0x0_0x3bb1f8['unlink'](_0x33da52, _0x1e07ab => {
                        if (!_0x1e07ab) {
                            _0x57d8a7++;
                            console['log']('Cleaned\x20temp\x20file:\x20' + _0x34d7b3);
                        }
                    });
                }
            });
        });
        if (_0x57d8a7 > 0x0) {
            console['log']('Cleaned\x20' + _0x57d8a7 + '\x20temp\x20files');
        }
    });
}
cleanupTempFiles();
setInterval(cleanupTempFiles, 0x3c * 0x3c * 0x3e8);
export default { 'cleanupTempFiles': cleanupTempFiles };