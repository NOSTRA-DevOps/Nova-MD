import _0x0_0x3f08b6 from 'axios';
import _0x0_0x4a673e from 'form-data';
import { fileTypeFromBuffer } from 'file-type';
async function uploadImage(_0x234462) {
    try {
        if (!Buffer['isBuffer'](_0x234462)) {
            throw new Error('Invalid\x20buffer');
        }
        if (_0x234462['length'] > 0xa * 0x400 * 0x400) {
            throw new Error('File\x20exceeds\x2010MB\x20limit');
        }
        const _0x389080 = await fileTypeFromBuffer(_0x234462);
        if (!_0x389080?.['ext']) {
            throw new Error('Unable\x20to\x20detect\x20file\x20type');
        }
        const _0xd4c2c8 = new _0x0_0x4a673e();
        _0xd4c2c8['append']('reqtype', 'fileupload');
        _0xd4c2c8['append']('userhash', '');
        _0xd4c2c8['append']('fileToUpload', _0x234462, 'upload.' + _0x389080['ext']);
        const _0xae3ffd = await _0x0_0x3f08b6['post']('https://catbox.moe/user/api.php', _0xd4c2c8, {
            'headers': _0xd4c2c8['getHeaders'](),
            'timeout': 0x7530
        });
        if (typeof _0xae3ffd['data'] !== 'string' || !_0xae3ffd['data']['startsWith']('https://')) {
            throw new Error('Catbox\x20upload\x20failed');
        }
        return _0xae3ffd['data'];
    } catch (_0x3617ac) {
        console['error']('[UPLOAD]\x20Catbox\x20error:', _0x3617ac['message']);
        throw _0x3617ac;
    }
}
export {
    uploadImage
};