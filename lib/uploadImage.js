import _0x0_0x4523f2 from 'axios';
import _0x0_0x46d12b from 'form-data';
import { fileTypeFromBuffer } from 'file-type';
async function uploadImage(_0x56fbf7) {
    try {
        if (!Buffer['isBuffer'](_0x56fbf7)) {
            throw new Error('Invalid\x20buffer');
        }
        if (_0x56fbf7['length'] > 0xa * 0x400 * 0x400) {
            throw new Error('File\x20exceeds\x2010MB\x20limit');
        }
        const _0x14546a = await fileTypeFromBuffer(_0x56fbf7);
        if (!_0x14546a?.['ext']) {
            throw new Error('Unable\x20to\x20detect\x20file\x20type');
        }
        const _0x40da5c = new _0x0_0x46d12b();
        _0x40da5c['append']('reqtype', 'fileupload');
        _0x40da5c['append']('userhash', '');
        _0x40da5c['append']('fileToUpload', _0x56fbf7, 'upload.' + _0x14546a['ext']);
        const _0x49f12a = await _0x0_0x4523f2['post']('https://catbox.moe/user/api.php', _0x40da5c, {
            'headers': _0x40da5c['getHeaders'](),
            'timeout': 0x7530
        });
        if (typeof _0x49f12a['data'] !== 'string' || !_0x49f12a['data']['startsWith']('https://')) {
            throw new Error('Catbox\x20upload\x20failed');
        }
        return _0x49f12a['data'];
    } catch (_0x4a9556) {
        console['error']('[UPLOAD]\x20Catbox\x20error:', _0x4a9556['message']);
        throw _0x4a9556;
    }
}
export {
    uploadImage
};