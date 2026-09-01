import _0x0_0x5728db from 'axios';
import _0x0_0x4ecf17 from 'form-data';
import { fileTypeFromBuffer } from 'file-type';
async function uploadImage(_0x2415d2) {
    try {
        if (!Buffer['isBuffer'](_0x2415d2)) {
            throw new Error('Invalid\x20buffer');
        }
        if (_0x2415d2['length'] > 0xa * 0x400 * 0x400) {
            throw new Error('File\x20exceeds\x2010MB\x20limit');
        }
        const _0xc41465 = await fileTypeFromBuffer(_0x2415d2);
        if (!_0xc41465?.['ext']) {
            throw new Error('Unable\x20to\x20detect\x20file\x20type');
        }
        const _0x36cf78 = new _0x0_0x4ecf17();
        _0x36cf78['append']('reqtype', 'fileupload');
        _0x36cf78['append']('userhash', '');
        _0x36cf78['append']('fileToUpload', _0x2415d2, 'upload.' + _0xc41465['ext']);
        const _0x140759 = await _0x0_0x5728db['post']('https://catbox.moe/user/api.php', _0x36cf78, {
            'headers': _0x36cf78['getHeaders'](),
            'timeout': 0x7530
        });
        if (typeof _0x140759['data'] !== 'string' || !_0x140759['data']['startsWith']('https://')) {
            throw new Error('Catbox\x20upload\x20failed');
        }
        return _0x140759['data'];
    } catch (_0x23d74f) {
        console['error']('[UPLOAD]\x20Catbox\x20error:', _0x23d74f['message']);
        throw _0x23d74f;
    }
}
export {
    uploadImage
};