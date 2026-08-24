import _0x0_0x3b6384 from 'fs';
import _0x0_0x2111a8 from 'path';
function cleanupTempFiles() {
    const _0x30e356 = _0x0_0x2111a8['join'](process['cwd'](), 'temp');
    if (!_0x0_0x3b6384['existsSync'](_0x30e356)) {
        return;
    }
    _0x0_0x3b6384['readdir'](_0x30e356, (_0x433f65, _0x2f437d) => {
        if (_0x433f65) {
            console['error']('Error\x20reading\x20temp\x20directory:', _0x433f65);
            return;
        }
        let _0x85b6ed = 0x0;
        const _0x16ab2b = Date['now']();
        const _0x385648 = 0x1 * 0x3c * 0x3c * 0x3e8;
        _0x2f437d['forEach'](_0x101ba2 => {
            const _0x4ea11e = _0x0_0x2111a8['join'](_0x30e356, _0x101ba2);
            _0x0_0x3b6384['stat'](_0x4ea11e, (_0x144666, _0x50898a) => {
                if (_0x144666)
                    return;
                if (_0x16ab2b - _0x50898a['mtimeMs'] > _0x385648) {
                    _0x0_0x3b6384['unlink'](_0x4ea11e, _0x506a32 => {
                        if (!_0x506a32) {
                            _0x85b6ed++;
                            console['log']('Cleaned\x20temp\x20file:\x20' + _0x101ba2);
                        }
                    });
                }
            });
        });
        if (_0x85b6ed > 0x0) {
            console['log']('Cleaned\x20' + _0x85b6ed + '\x20temp\x20files');
        }
    });
}
cleanupTempFiles();
setInterval(cleanupTempFiles, 0x3c * 0x3c * 0x3e8);
export default { 'cleanupTempFiles': cleanupTempFiles };