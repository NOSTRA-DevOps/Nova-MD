import _0x0_0xb75d4e from 'fs';
import _0x0_0xd907f5 from 'path';
function cleanupTempFiles() {
    const _0x256d17 = _0x0_0xd907f5['join'](process['cwd'](), 'temp');
    if (!_0x0_0xb75d4e['existsSync'](_0x256d17)) {
        return;
    }
    _0x0_0xb75d4e['readdir'](_0x256d17, (_0x4179d8, _0x1b1fc1) => {
        if (_0x4179d8) {
            console['error']('Error\x20reading\x20temp\x20directory:', _0x4179d8);
            return;
        }
        let _0x2911f6 = 0x0;
        const _0x34f1ff = Date['now']();
        const _0x380f12 = 0x1 * 0x3c * 0x3c * 0x3e8;
        _0x1b1fc1['forEach'](_0x169cc6 => {
            const _0x5551fe = _0x0_0xd907f5['join'](_0x256d17, _0x169cc6);
            _0x0_0xb75d4e['stat'](_0x5551fe, (_0xcb525f, _0x1067aa) => {
                if (_0xcb525f)
                    return;
                if (_0x34f1ff - _0x1067aa['mtimeMs'] > _0x380f12) {
                    _0x0_0xb75d4e['unlink'](_0x5551fe, _0x263b77 => {
                        if (!_0x263b77) {
                            _0x2911f6++;
                            console['log']('Cleaned\x20temp\x20file:\x20' + _0x169cc6);
                        }
                    });
                }
            });
        });
        if (_0x2911f6 > 0x0) {
            console['log']('Cleaned\x20' + _0x2911f6 + '\x20temp\x20files');
        }
    });
}
cleanupTempFiles();
setInterval(cleanupTempFiles, 0x3c * 0x3c * 0x3e8);
export default { 'cleanupTempFiles': cleanupTempFiles };