import _0x0_0x5bac13 from 'axios';
import _0x0_0x3bbfad from 'form-data';
import { fileTypeFromBuffer } from 'file-type';
async function uploadImage(_0x5bf1c4) {
    try {
        if (!Buffer['isBuffer'](_0x5bf1c4)) {
            throw new Error('Invalid\x20buffer');
        }
        if (_0x5bf1c4['length'] > 0xa * 0x400 * 0x400) {
            throw new Error('File\x20exceeds\x2010MB\x20limit');
        }
        const _0xcce877 = await fileTypeFromBuffer(_0x5bf1c4);
        if (!_0xcce877?.['ext']) {
            throw new Error('Unable\x20to\x20detect\x20file\x20type');
        }
        const _0x5f4b0 = new _0x0_0x3bbfad();
        _0x5f4b0['append']('reqtype', 'fileupload');
        _0x5f4b0['append']('userhash', '');
        _0x5f4b0['append']('fileToUpload', _0x5bf1c4, 'upload.' + _0xcce877['ext']);
        const _0x560907 = await _0x0_0x5bac13['post']('https://catbox.moe/user/api.php', _0x5f4b0, {
            'headers': _0x5f4b0['getHeaders'](),
            'timeout': 0x7530
        });
        if (typeof _0x560907['data'] !== 'string' || !_0x560907['data']['startsWith']('https://')) {
            throw new Error('Catbox\x20upload\x20failed');
        }
        return _0x560907['data'];
    } catch (_0x1cdd23) {
        console['error']('[UPLOAD]\x20Catbox\x20error:', _0x1cdd23['message']);
        throw _0x1cdd23;
    }
}
export {
    uploadImage
};