import _0x0_0x4471a5 from 'axios';
import _0x0_0x2e5738 from 'form-data';
import { fileTypeFromBuffer } from 'file-type';
async function uploadImage(_0x1c9a94) {
    try {
        if (!Buffer['isBuffer'](_0x1c9a94)) {
            throw new Error('Invalid\x20buffer');
        }
        if (_0x1c9a94['length'] > 0xa * 0x400 * 0x400) {
            throw new Error('File\x20exceeds\x2010MB\x20limit');
        }
        const _0x37a438 = await fileTypeFromBuffer(_0x1c9a94);
        if (!_0x37a438?.['ext']) {
            throw new Error('Unable\x20to\x20detect\x20file\x20type');
        }
        const _0x5a6d60 = new _0x0_0x2e5738();
        _0x5a6d60['append']('reqtype', 'fileupload');
        _0x5a6d60['append']('userhash', '');
        _0x5a6d60['append']('fileToUpload', _0x1c9a94, 'upload.' + _0x37a438['ext']);
        const _0x38ca76 = await _0x0_0x4471a5['post']('https://catbox.moe/user/api.php', _0x5a6d60, {
            'headers': _0x5a6d60['getHeaders'](),
            'timeout': 0x7530
        });
        if (typeof _0x38ca76['data'] !== 'string' || !_0x38ca76['data']['startsWith']('https://')) {
            throw new Error('Catbox\x20upload\x20failed');
        }
        return _0x38ca76['data'];
    } catch (_0x302e3e) {
        console['error']('[UPLOAD]\x20Catbox\x20error:', _0x302e3e['message']);
        throw _0x302e3e;
    }
}
export {
    uploadImage
};