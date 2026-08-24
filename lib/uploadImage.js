import _0x0_0x39b94c from 'axios';
import _0x0_0x2d83ed from 'form-data';
import { fileTypeFromBuffer } from 'file-type';
async function uploadImage(_0x2aaefb) {
    try {
        if (!Buffer['isBuffer'](_0x2aaefb)) {
            throw new Error('Invalid\x20buffer');
        }
        if (_0x2aaefb['length'] > 0xa * 0x400 * 0x400) {
            throw new Error('File\x20exceeds\x2010MB\x20limit');
        }
        const _0x48a7cb = await fileTypeFromBuffer(_0x2aaefb);
        if (!_0x48a7cb?.['ext']) {
            throw new Error('Unable\x20to\x20detect\x20file\x20type');
        }
        const _0x591c3b = new _0x0_0x2d83ed();
        _0x591c3b['append']('reqtype', 'fileupload');
        _0x591c3b['append']('userhash', '');
        _0x591c3b['append']('fileToUpload', _0x2aaefb, 'upload.' + _0x48a7cb['ext']);
        const _0x3044e8 = await _0x0_0x39b94c['post']('https://catbox.moe/user/api.php', _0x591c3b, {
            'headers': _0x591c3b['getHeaders'](),
            'timeout': 0x7530
        });
        if (typeof _0x3044e8['data'] !== 'string' || !_0x3044e8['data']['startsWith']('https://')) {
            throw new Error('Catbox\x20upload\x20failed');
        }
        return _0x3044e8['data'];
    } catch (_0x606454) {
        console['error']('[UPLOAD]\x20Catbox\x20error:', _0x606454['message']);
        throw _0x606454;
    }
}
export {
    uploadImage
};