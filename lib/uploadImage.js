import _0x0_0x6a5091 from 'axios';
import _0x0_0x5d6cac from 'form-data';
import { fileTypeFromBuffer } from 'file-type';
async function uploadImage(_0x4959c1) {
    try {
        if (!Buffer['isBuffer'](_0x4959c1)) {
            throw new Error('Invalid\x20buffer');
        }
        if (_0x4959c1['length'] > 0xa * 0x400 * 0x400) {
            throw new Error('File\x20exceeds\x2010MB\x20limit');
        }
        const _0x4f6bc7 = await fileTypeFromBuffer(_0x4959c1);
        if (!_0x4f6bc7?.['ext']) {
            throw new Error('Unable\x20to\x20detect\x20file\x20type');
        }
        const _0x58d780 = new _0x0_0x5d6cac();
        _0x58d780['append']('reqtype', 'fileupload');
        _0x58d780['append']('userhash', '');
        _0x58d780['append']('fileToUpload', _0x4959c1, 'upload.' + _0x4f6bc7['ext']);
        const _0x5489bc = await _0x0_0x6a5091['post']('https://catbox.moe/user/api.php', _0x58d780, {
            'headers': _0x58d780['getHeaders'](),
            'timeout': 0x7530
        });
        if (typeof _0x5489bc['data'] !== 'string' || !_0x5489bc['data']['startsWith']('https://')) {
            throw new Error('Catbox\x20upload\x20failed');
        }
        return _0x5489bc['data'];
    } catch (_0x55348c) {
        console['error']('[UPLOAD]\x20Catbox\x20error:', _0x55348c['message']);
        throw _0x55348c;
    }
}
export {
    uploadImage
};