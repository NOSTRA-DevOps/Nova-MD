import _0x0_0x3758a9 from 'fs';
import _0x0_0x421e51 from 'path';
function cleanupTempFiles() {
    const _0x3e6ba6 = _0x0_0x421e51['join'](process['cwd'](), 'temp');
    if (!_0x0_0x3758a9['existsSync'](_0x3e6ba6)) {
        return;
    }
    _0x0_0x3758a9['readdir'](_0x3e6ba6, (_0x31c4d3, _0x4fe45e) => {
        if (_0x31c4d3) {
            console['error']('Error\x20reading\x20temp\x20directory:', _0x31c4d3);
            return;
        }
        let _0x1b5827 = 0x0;
        const _0x3a52d8 = Date['now']();
        const _0x479386 = 0x1 * 0x3c * 0x3c * 0x3e8;
        _0x4fe45e['forEach'](_0x450ba4 => {
            const _0x3105f0 = _0x0_0x421e51['join'](_0x3e6ba6, _0x450ba4);
            _0x0_0x3758a9['stat'](_0x3105f0, (_0x4ce158, _0x1d8917) => {
                if (_0x4ce158)
                    return;
                if (_0x3a52d8 - _0x1d8917['mtimeMs'] > _0x479386) {
                    _0x0_0x3758a9['unlink'](_0x3105f0, _0x22b558 => {
                        if (!_0x22b558) {
                            _0x1b5827++;
                            console['log']('Cleaned\x20temp\x20file:\x20' + _0x450ba4);
                        }
                    });
                }
            });
        });
        if (_0x1b5827 > 0x0) {
            console['log']('Cleaned\x20' + _0x1b5827 + '\x20temp\x20files');
        }
    });
}
cleanupTempFiles();
setInterval(cleanupTempFiles, 0x3c * 0x3c * 0x3e8);
export default { 'cleanupTempFiles': cleanupTempFiles };