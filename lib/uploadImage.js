import _0x0_0xe6137e from 'axios';
import _0x0_0x355210 from 'form-data';
import { fileTypeFromBuffer } from 'file-type';
async function uploadImage(_0x5b6819) {
    try {
        if (!Buffer['isBuffer'](_0x5b6819)) {
            throw new Error('Invalid\x20buffer');
        }
        if (_0x5b6819['length'] > 0xa * 0x400 * 0x400) {
            throw new Error('File\x20exceeds\x2010MB\x20limit');
        }
        const _0x2e0205 = await fileTypeFromBuffer(_0x5b6819);
        if (!_0x2e0205?.['ext']) {
            throw new Error('Unable\x20to\x20detect\x20file\x20type');
        }
        const _0x50967a = new _0x0_0x355210();
        _0x50967a['append']('reqtype', 'fileupload');
        _0x50967a['append']('userhash', '');
        _0x50967a['append']('fileToUpload', _0x5b6819, 'upload.' + _0x2e0205['ext']);
        const _0xde7c44 = await _0x0_0xe6137e['post']('https://catbox.moe/user/api.php', _0x50967a, {
            'headers': _0x50967a['getHeaders'](),
            'timeout': 0x7530
        });
        if (typeof _0xde7c44['data'] !== 'string' || !_0xde7c44['data']['startsWith']('https://')) {
            throw new Error('Catbox\x20upload\x20failed');
        }
        return _0xde7c44['data'];
    } catch (_0x7fae8c) {
        console['error']('[UPLOAD]\x20Catbox\x20error:', _0x7fae8c['message']);
        throw _0x7fae8c;
    }
}
export {
    uploadImage
};