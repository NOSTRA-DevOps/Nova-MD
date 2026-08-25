import _0x0_0x2b7d52 from 'fs';
import _0x0_0x2b7b80 from 'path';
function cleanupTempFiles() {
    const _0x42ed80 = _0x0_0x2b7b80['join'](process['cwd'](), 'temp');
    if (!_0x0_0x2b7d52['existsSync'](_0x42ed80)) {
        return;
    }
    _0x0_0x2b7d52['readdir'](_0x42ed80, (_0x2e5869, _0x3da54a) => {
        if (_0x2e5869) {
            console['error']('Error\x20reading\x20temp\x20directory:', _0x2e5869);
            return;
        }
        let _0x4151b2 = 0x0;
        const _0x460681 = Date['now']();
        const _0x4c4a6d = 0x1 * 0x3c * 0x3c * 0x3e8;
        _0x3da54a['forEach'](_0x14a6c7 => {
            const _0x21414c = _0x0_0x2b7b80['join'](_0x42ed80, _0x14a6c7);
            _0x0_0x2b7d52['stat'](_0x21414c, (_0x23a8fa, _0x2c39b7) => {
                if (_0x23a8fa)
                    return;
                if (_0x460681 - _0x2c39b7['mtimeMs'] > _0x4c4a6d) {
                    _0x0_0x2b7d52['unlink'](_0x21414c, _0x2f7627 => {
                        if (!_0x2f7627) {
                            _0x4151b2++;
                            console['log']('Cleaned\x20temp\x20file:\x20' + _0x14a6c7);
                        }
                    });
                }
            });
        });
        if (_0x4151b2 > 0x0) {
            console['log']('Cleaned\x20' + _0x4151b2 + '\x20temp\x20files');
        }
    });
}
cleanupTempFiles();
setInterval(cleanupTempFiles, 0x3c * 0x3c * 0x3e8);
export default { 'cleanupTempFiles': cleanupTempFiles };