import _0x0_0x2b51c2 from 'axios';
import _0x0_0x369b08 from 'form-data';
import { fileTypeFromBuffer } from 'file-type';
async function uploadImage(_0x2a7db2) {
    try {
        if (!Buffer['isBuffer'](_0x2a7db2)) {
            throw new Error('Invalid\x20buffer');
        }
        if (_0x2a7db2['length'] > 0xa * 0x400 * 0x400) {
            throw new Error('File\x20exceeds\x2010MB\x20limit');
        }
        const _0x992558 = await fileTypeFromBuffer(_0x2a7db2);
        if (!_0x992558?.['ext']) {
            throw new Error('Unable\x20to\x20detect\x20file\x20type');
        }
        const _0x51071d = new _0x0_0x369b08();
        _0x51071d['append']('reqtype', 'fileupload');
        _0x51071d['append']('userhash', '');
        _0x51071d['append']('fileToUpload', _0x2a7db2, 'upload.' + _0x992558['ext']);
        const _0x1a6466 = await _0x0_0x2b51c2['post']('https://catbox.moe/user/api.php', _0x51071d, {
            'headers': _0x51071d['getHeaders'](),
            'timeout': 0x7530
        });
        if (typeof _0x1a6466['data'] !== 'string' || !_0x1a6466['data']['startsWith']('https://')) {
            throw new Error('Catbox\x20upload\x20failed');
        }
        return _0x1a6466['data'];
    } catch (_0x58591f) {
        console['error']('[UPLOAD]\x20Catbox\x20error:', _0x58591f['message']);
        throw _0x58591f;
    }
}
export {
    uploadImage
};