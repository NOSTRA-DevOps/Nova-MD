import _0x0_0x4ffeca from 'axios';
import _0x0_0x152b43 from 'form-data';
import { fileTypeFromBuffer } from 'file-type';
async function uploadImage(_0x344f48) {
    try {
        if (!Buffer['isBuffer'](_0x344f48)) {
            throw new Error('Invalid\x20buffer');
        }
        if (_0x344f48['length'] > 0xa * 0x400 * 0x400) {
            throw new Error('File\x20exceeds\x2010MB\x20limit');
        }
        const _0x4f04d9 = await fileTypeFromBuffer(_0x344f48);
        if (!_0x4f04d9?.['ext']) {
            throw new Error('Unable\x20to\x20detect\x20file\x20type');
        }
        const _0xab78dc = new _0x0_0x152b43();
        _0xab78dc['append']('reqtype', 'fileupload');
        _0xab78dc['append']('userhash', '');
        _0xab78dc['append']('fileToUpload', _0x344f48, 'upload.' + _0x4f04d9['ext']);
        const _0x6960c4 = await _0x0_0x4ffeca['post']('https://catbox.moe/user/api.php', _0xab78dc, {
            'headers': _0xab78dc['getHeaders'](),
            'timeout': 0x7530
        });
        if (typeof _0x6960c4['data'] !== 'string' || !_0x6960c4['data']['startsWith']('https://')) {
            throw new Error('Catbox\x20upload\x20failed');
        }
        return _0x6960c4['data'];
    } catch (_0x287940) {
        console['error']('[UPLOAD]\x20Catbox\x20error:', _0x287940['message']);
        throw _0x287940;
    }
}
export {
    uploadImage
};