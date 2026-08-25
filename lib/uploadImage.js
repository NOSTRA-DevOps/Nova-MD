import _0x0_0xbcb42f from 'axios';
import _0x0_0x48bad0 from 'form-data';
import { fileTypeFromBuffer } from 'file-type';
async function uploadImage(_0x35f4b4) {
    try {
        if (!Buffer['isBuffer'](_0x35f4b4)) {
            throw new Error('Invalid\x20buffer');
        }
        if (_0x35f4b4['length'] > 0xa * 0x400 * 0x400) {
            throw new Error('File\x20exceeds\x2010MB\x20limit');
        }
        const _0x2a436d = await fileTypeFromBuffer(_0x35f4b4);
        if (!_0x2a436d?.['ext']) {
            throw new Error('Unable\x20to\x20detect\x20file\x20type');
        }
        const _0x1b358e = new _0x0_0x48bad0();
        _0x1b358e['append']('reqtype', 'fileupload');
        _0x1b358e['append']('userhash', '');
        _0x1b358e['append']('fileToUpload', _0x35f4b4, 'upload.' + _0x2a436d['ext']);
        const _0x265f1d = await _0x0_0xbcb42f['post']('https://catbox.moe/user/api.php', _0x1b358e, {
            'headers': _0x1b358e['getHeaders'](),
            'timeout': 0x7530
        });
        if (typeof _0x265f1d['data'] !== 'string' || !_0x265f1d['data']['startsWith']('https://')) {
            throw new Error('Catbox\x20upload\x20failed');
        }
        return _0x265f1d['data'];
    } catch (_0x273f65) {
        console['error']('[UPLOAD]\x20Catbox\x20error:', _0x273f65['message']);
        throw _0x273f65;
    }
}
export {
    uploadImage
};