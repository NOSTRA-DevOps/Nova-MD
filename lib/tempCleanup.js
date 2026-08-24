import _0x0_0x1e8e57 from 'fs';
import _0x0_0x3702f8 from 'path';
function cleanupTempFiles() {
    const _0x54fa3c = _0x0_0x3702f8['join'](process['cwd'](), 'temp');
    if (!_0x0_0x1e8e57['existsSync'](_0x54fa3c)) {
        return;
    }
    _0x0_0x1e8e57['readdir'](_0x54fa3c, (_0x1b56a1, _0x44720d) => {
        if (_0x1b56a1) {
            console['error']('Error\x20reading\x20temp\x20directory:', _0x1b56a1);
            return;
        }
        let _0x41f47b = 0x0;
        const _0x746834 = Date['now']();
        const _0x80d0c6 = 0x1 * 0x3c * 0x3c * 0x3e8;
        _0x44720d['forEach'](_0x4e3217 => {
            const _0x206ad4 = _0x0_0x3702f8['join'](_0x54fa3c, _0x4e3217);
            _0x0_0x1e8e57['stat'](_0x206ad4, (_0xf63604, _0x4d2faf) => {
                if (_0xf63604)
                    return;
                if (_0x746834 - _0x4d2faf['mtimeMs'] > _0x80d0c6) {
                    _0x0_0x1e8e57['unlink'](_0x206ad4, _0x5d5043 => {
                        if (!_0x5d5043) {
                            _0x41f47b++;
                            console['log']('Cleaned\x20temp\x20file:\x20' + _0x4e3217);
                        }
                    });
                }
            });
        });
        if (_0x41f47b > 0x0) {
            console['log']('Cleaned\x20' + _0x41f47b + '\x20temp\x20files');
        }
    });
}
cleanupTempFiles();
setInterval(cleanupTempFiles, 0x3c * 0x3c * 0x3e8);
export default { 'cleanupTempFiles': cleanupTempFiles };