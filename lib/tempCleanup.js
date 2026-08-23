import _0x0_0x695f6a from 'fs';
import _0x0_0x27a936 from 'path';
function cleanupTempFiles() {
    const _0x503741 = _0x0_0x27a936['join'](process['cwd'](), 'temp');
    if (!_0x0_0x695f6a['existsSync'](_0x503741)) {
        return;
    }
    _0x0_0x695f6a['readdir'](_0x503741, (_0x2f4e5b, _0x4b266b) => {
        if (_0x2f4e5b) {
            console['error']('Error\x20reading\x20temp\x20directory:', _0x2f4e5b);
            return;
        }
        let _0x51d8ec = 0x0;
        const _0x453539 = Date['now']();
        const _0x52dc0a = 0x1 * 0x3c * 0x3c * 0x3e8;
        _0x4b266b['forEach'](_0x309835 => {
            const _0x546707 = _0x0_0x27a936['join'](_0x503741, _0x309835);
            _0x0_0x695f6a['stat'](_0x546707, (_0xad7358, _0x201070) => {
                if (_0xad7358)
                    return;
                if (_0x453539 - _0x201070['mtimeMs'] > _0x52dc0a) {
                    _0x0_0x695f6a['unlink'](_0x546707, _0x1088f0 => {
                        if (!_0x1088f0) {
                            _0x51d8ec++;
                            console['log']('Cleaned\x20temp\x20file:\x20' + _0x309835);
                        }
                    });
                }
            });
        });
        if (_0x51d8ec > 0x0) {
            console['log']('Cleaned\x20' + _0x51d8ec + '\x20temp\x20files');
        }
    });
}
cleanupTempFiles();
setInterval(cleanupTempFiles, 0x3c * 0x3c * 0x3e8);
export default { 'cleanupTempFiles': cleanupTempFiles };