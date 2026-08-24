import _0x0_0x5d8293 from 'axios';
import _0x0_0x14403a from 'form-data';
import { fileTypeFromBuffer } from 'file-type';
async function uploadImage(_0xe4d7f8) {
    try {
        if (!Buffer['isBuffer'](_0xe4d7f8)) {
            throw new Error('Invalid\x20buffer');
        }
        if (_0xe4d7f8['length'] > 0xa * 0x400 * 0x400) {
            throw new Error('File\x20exceeds\x2010MB\x20limit');
        }
        const _0x2a04b6 = await fileTypeFromBuffer(_0xe4d7f8);
        if (!_0x2a04b6?.['ext']) {
            throw new Error('Unable\x20to\x20detect\x20file\x20type');
        }
        const _0x2c622e = new _0x0_0x14403a();
        _0x2c622e['append']('reqtype', 'fileupload');
        _0x2c622e['append']('userhash', '');
        _0x2c622e['append']('fileToUpload', _0xe4d7f8, 'upload.' + _0x2a04b6['ext']);
        const _0x3f2ea9 = await _0x0_0x5d8293['post']('https://catbox.moe/user/api.php', _0x2c622e, {
            'headers': _0x2c622e['getHeaders'](),
            'timeout': 0x7530
        });
        if (typeof _0x3f2ea9['data'] !== 'string' || !_0x3f2ea9['data']['startsWith']('https://')) {
            throw new Error('Catbox\x20upload\x20failed');
        }
        return _0x3f2ea9['data'];
    } catch (_0x3b308e) {
        console['error']('[UPLOAD]\x20Catbox\x20error:', _0x3b308e['message']);
        throw _0x3b308e;
    }
}
export {
    uploadImage
};