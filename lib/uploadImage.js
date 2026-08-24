import _0x0_0x4a0d94 from 'axios';
import _0x0_0xdfa2e7 from 'form-data';
import { fileTypeFromBuffer } from 'file-type';
async function uploadImage(_0x4511cd) {
    try {
        if (!Buffer['isBuffer'](_0x4511cd)) {
            throw new Error('Invalid\x20buffer');
        }
        if (_0x4511cd['length'] > 0xa * 0x400 * 0x400) {
            throw new Error('File\x20exceeds\x2010MB\x20limit');
        }
        const _0xdec240 = await fileTypeFromBuffer(_0x4511cd);
        if (!_0xdec240?.['ext']) {
            throw new Error('Unable\x20to\x20detect\x20file\x20type');
        }
        const _0x3b964c = new _0x0_0xdfa2e7();
        _0x3b964c['append']('reqtype', 'fileupload');
        _0x3b964c['append']('userhash', '');
        _0x3b964c['append']('fileToUpload', _0x4511cd, 'upload.' + _0xdec240['ext']);
        const _0x3bf8d8 = await _0x0_0x4a0d94['post']('https://catbox.moe/user/api.php', _0x3b964c, {
            'headers': _0x3b964c['getHeaders'](),
            'timeout': 0x7530
        });
        if (typeof _0x3bf8d8['data'] !== 'string' || !_0x3bf8d8['data']['startsWith']('https://')) {
            throw new Error('Catbox\x20upload\x20failed');
        }
        return _0x3bf8d8['data'];
    } catch (_0x4c3e84) {
        console['error']('[UPLOAD]\x20Catbox\x20error:', _0x4c3e84['message']);
        throw _0x4c3e84;
    }
}
export {
    uploadImage
};