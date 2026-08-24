import _0x0_0x50cede from 'fs';
import _0x0_0x1f3735 from 'path';
function cleanupTempFiles() {
    const _0x2eb72c = _0x0_0x1f3735['join'](process['cwd'](), 'temp');
    if (!_0x0_0x50cede['existsSync'](_0x2eb72c)) {
        return;
    }
    _0x0_0x50cede['readdir'](_0x2eb72c, (_0x539657, _0x38ed2f) => {
        if (_0x539657) {
            console['error']('Error\x20reading\x20temp\x20directory:', _0x539657);
            return;
        }
        let _0x4f5abb = 0x0;
        const _0x17fea5 = Date['now']();
        const _0x2fe260 = 0x1 * 0x3c * 0x3c * 0x3e8;
        _0x38ed2f['forEach'](_0x285ca0 => {
            const _0x2a0a09 = _0x0_0x1f3735['join'](_0x2eb72c, _0x285ca0);
            _0x0_0x50cede['stat'](_0x2a0a09, (_0x4879e5, _0x5944fd) => {
                if (_0x4879e5)
                    return;
                if (_0x17fea5 - _0x5944fd['mtimeMs'] > _0x2fe260) {
                    _0x0_0x50cede['unlink'](_0x2a0a09, _0xecc9f7 => {
                        if (!_0xecc9f7) {
                            _0x4f5abb++;
                            console['log']('Cleaned\x20temp\x20file:\x20' + _0x285ca0);
                        }
                    });
                }
            });
        });
        if (_0x4f5abb > 0x0) {
            console['log']('Cleaned\x20' + _0x4f5abb + '\x20temp\x20files');
        }
    });
}
cleanupTempFiles();
setInterval(cleanupTempFiles, 0x3c * 0x3c * 0x3e8);
export default { 'cleanupTempFiles': cleanupTempFiles };