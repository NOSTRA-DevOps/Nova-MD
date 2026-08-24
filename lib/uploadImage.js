import _0x0_0x33d853 from 'axios';
import _0x0_0x164b95 from 'form-data';
import { fileTypeFromBuffer } from 'file-type';
async function uploadImage(_0x8e9035) {
    try {
        if (!Buffer['isBuffer'](_0x8e9035)) {
            throw new Error('Invalid\x20buffer');
        }
        if (_0x8e9035['length'] > 0xa * 0x400 * 0x400) {
            throw new Error('File\x20exceeds\x2010MB\x20limit');
        }
        const _0x21fa9a = await fileTypeFromBuffer(_0x8e9035);
        if (!_0x21fa9a?.['ext']) {
            throw new Error('Unable\x20to\x20detect\x20file\x20type');
        }
        const _0x58cd5d = new _0x0_0x164b95();
        _0x58cd5d['append']('reqtype', 'fileupload');
        _0x58cd5d['append']('userhash', '');
        _0x58cd5d['append']('fileToUpload', _0x8e9035, 'upload.' + _0x21fa9a['ext']);
        const _0x3beb07 = await _0x0_0x33d853['post']('https://catbox.moe/user/api.php', _0x58cd5d, {
            'headers': _0x58cd5d['getHeaders'](),
            'timeout': 0x7530
        });
        if (typeof _0x3beb07['data'] !== 'string' || !_0x3beb07['data']['startsWith']('https://')) {
            throw new Error('Catbox\x20upload\x20failed');
        }
        return _0x3beb07['data'];
    } catch (_0x26af32) {
        console['error']('[UPLOAD]\x20Catbox\x20error:', _0x26af32['message']);
        throw _0x26af32;
    }
}
export {
    uploadImage
};