import _0x0_0x1ec2a7 from 'axios';
import _0x0_0xbdcfc8 from 'form-data';
import { fileTypeFromBuffer } from 'file-type';
async function uploadImage(_0x2e76f4) {
    try {
        if (!Buffer['isBuffer'](_0x2e76f4)) {
            throw new Error('Invalid\x20buffer');
        }
        if (_0x2e76f4['length'] > 0xa * 0x400 * 0x400) {
            throw new Error('File\x20exceeds\x2010MB\x20limit');
        }
        const _0x3a20a2 = await fileTypeFromBuffer(_0x2e76f4);
        if (!_0x3a20a2?.['ext']) {
            throw new Error('Unable\x20to\x20detect\x20file\x20type');
        }
        const _0x24d7dd = new _0x0_0xbdcfc8();
        _0x24d7dd['append']('reqtype', 'fileupload');
        _0x24d7dd['append']('userhash', '');
        _0x24d7dd['append']('fileToUpload', _0x2e76f4, 'upload.' + _0x3a20a2['ext']);
        const _0x29b886 = await _0x0_0x1ec2a7['post']('https://catbox.moe/user/api.php', _0x24d7dd, {
            'headers': _0x24d7dd['getHeaders'](),
            'timeout': 0x7530
        });
        if (typeof _0x29b886['data'] !== 'string' || !_0x29b886['data']['startsWith']('https://')) {
            throw new Error('Catbox\x20upload\x20failed');
        }
        return _0x29b886['data'];
    } catch (_0x52111c) {
        console['error']('[UPLOAD]\x20Catbox\x20error:', _0x52111c['message']);
        throw _0x52111c;
    }
}
export {
    uploadImage
};