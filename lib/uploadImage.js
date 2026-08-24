import _0x0_0x5d8547 from 'axios';
import _0x0_0x11eca7 from 'form-data';
import { fileTypeFromBuffer } from 'file-type';
async function uploadImage(_0x514917) {
    try {
        if (!Buffer['isBuffer'](_0x514917)) {
            throw new Error('Invalid\x20buffer');
        }
        if (_0x514917['length'] > 0xa * 0x400 * 0x400) {
            throw new Error('File\x20exceeds\x2010MB\x20limit');
        }
        const _0x7222e2 = await fileTypeFromBuffer(_0x514917);
        if (!_0x7222e2?.['ext']) {
            throw new Error('Unable\x20to\x20detect\x20file\x20type');
        }
        const _0x483be0 = new _0x0_0x11eca7();
        _0x483be0['append']('reqtype', 'fileupload');
        _0x483be0['append']('userhash', '');
        _0x483be0['append']('fileToUpload', _0x514917, 'upload.' + _0x7222e2['ext']);
        const _0xe57f24 = await _0x0_0x5d8547['post']('https://catbox.moe/user/api.php', _0x483be0, {
            'headers': _0x483be0['getHeaders'](),
            'timeout': 0x7530
        });
        if (typeof _0xe57f24['data'] !== 'string' || !_0xe57f24['data']['startsWith']('https://')) {
            throw new Error('Catbox\x20upload\x20failed');
        }
        return _0xe57f24['data'];
    } catch (_0x48b7cb) {
        console['error']('[UPLOAD]\x20Catbox\x20error:', _0x48b7cb['message']);
        throw _0x48b7cb;
    }
}
export {
    uploadImage
};