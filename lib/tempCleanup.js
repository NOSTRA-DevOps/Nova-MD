import _0x0_0x4686d3 from 'fs';
import _0x0_0x1241e5 from 'path';
function cleanupTempFiles() {
    const _0x1746af = _0x0_0x1241e5['join'](process['cwd'](), 'temp');
    if (!_0x0_0x4686d3['existsSync'](_0x1746af)) {
        return;
    }
    _0x0_0x4686d3['readdir'](_0x1746af, (_0x4700a2, _0x2b73c2) => {
        if (_0x4700a2) {
            console['error']('Error\x20reading\x20temp\x20directory:', _0x4700a2);
            return;
        }
        let _0x308423 = 0x0;
        const _0x231d9e = Date['now']();
        const _0x5845ba = 0x1 * 0x3c * 0x3c * 0x3e8;
        _0x2b73c2['forEach'](_0x57e3bb => {
            const _0x4eae68 = _0x0_0x1241e5['join'](_0x1746af, _0x57e3bb);
            _0x0_0x4686d3['stat'](_0x4eae68, (_0x357bdb, _0x3ba57d) => {
                if (_0x357bdb)
                    return;
                if (_0x231d9e - _0x3ba57d['mtimeMs'] > _0x5845ba) {
                    _0x0_0x4686d3['unlink'](_0x4eae68, _0xe453d2 => {
                        if (!_0xe453d2) {
                            _0x308423++;
                            console['log']('Cleaned\x20temp\x20file:\x20' + _0x57e3bb);
                        }
                    });
                }
            });
        });
        if (_0x308423 > 0x0) {
            console['log']('Cleaned\x20' + _0x308423 + '\x20temp\x20files');
        }
    });
}
cleanupTempFiles();
setInterval(cleanupTempFiles, 0x3c * 0x3c * 0x3e8);
export default { 'cleanupTempFiles': cleanupTempFiles };