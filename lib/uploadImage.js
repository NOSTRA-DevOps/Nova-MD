import _0x0_0x8494f from 'axios';
import _0x0_0x2cba7d from 'form-data';
import { fileTypeFromBuffer } from 'file-type';
async function uploadImage(_0x5922fa) {
    try {
        if (!Buffer['isBuffer'](_0x5922fa)) {
            throw new Error('Invalid\x20buffer');
        }
        if (_0x5922fa['length'] > 0xa * 0x400 * 0x400) {
            throw new Error('File\x20exceeds\x2010MB\x20limit');
        }
        const _0x548a5d = await fileTypeFromBuffer(_0x5922fa);
        if (!_0x548a5d?.['ext']) {
            throw new Error('Unable\x20to\x20detect\x20file\x20type');
        }
        const _0x564ff8 = new _0x0_0x2cba7d();
        _0x564ff8['append']('reqtype', 'fileupload');
        _0x564ff8['append']('userhash', '');
        _0x564ff8['append']('fileToUpload', _0x5922fa, 'upload.' + _0x548a5d['ext']);
        const _0x10d7b6 = await _0x0_0x8494f['post']('https://catbox.moe/user/api.php', _0x564ff8, {
            'headers': _0x564ff8['getHeaders'](),
            'timeout': 0x7530
        });
        if (typeof _0x10d7b6['data'] !== 'string' || !_0x10d7b6['data']['startsWith']('https://')) {
            throw new Error('Catbox\x20upload\x20failed');
        }
        return _0x10d7b6['data'];
    } catch (_0x58362b) {
        console['error']('[UPLOAD]\x20Catbox\x20error:', _0x58362b['message']);
        throw _0x58362b;
    }
}
export {
    uploadImage
};