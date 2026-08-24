import _0x0_0x443747 from 'axios';
import _0x0_0xde347b from 'form-data';
import { fileTypeFromBuffer } from 'file-type';
async function uploadImage(_0x58db6a) {
    try {
        if (!Buffer['isBuffer'](_0x58db6a)) {
            throw new Error('Invalid\x20buffer');
        }
        if (_0x58db6a['length'] > 0xa * 0x400 * 0x400) {
            throw new Error('File\x20exceeds\x2010MB\x20limit');
        }
        const _0x7380ab = await fileTypeFromBuffer(_0x58db6a);
        if (!_0x7380ab?.['ext']) {
            throw new Error('Unable\x20to\x20detect\x20file\x20type');
        }
        const _0x564d55 = new _0x0_0xde347b();
        _0x564d55['append']('reqtype', 'fileupload');
        _0x564d55['append']('userhash', '');
        _0x564d55['append']('fileToUpload', _0x58db6a, 'upload.' + _0x7380ab['ext']);
        const _0xb2a7b0 = await _0x0_0x443747['post']('https://catbox.moe/user/api.php', _0x564d55, {
            'headers': _0x564d55['getHeaders'](),
            'timeout': 0x7530
        });
        if (typeof _0xb2a7b0['data'] !== 'string' || !_0xb2a7b0['data']['startsWith']('https://')) {
            throw new Error('Catbox\x20upload\x20failed');
        }
        return _0xb2a7b0['data'];
    } catch (_0x325ca7) {
        console['error']('[UPLOAD]\x20Catbox\x20error:', _0x325ca7['message']);
        throw _0x325ca7;
    }
}
export {
    uploadImage
};