import _0x0_0x38f539 from 'axios';
import _0x0_0x14b5d4 from 'form-data';
import { fileTypeFromBuffer } from 'file-type';
import _0x0_0x3e33f2 from 'fs';
import * as _0x0_0x26b475 from 'cheerio';
function TelegraPh(_0x2269c3) {
    return new Promise(async (_0x5b109a, _0x1488c2) => {
        if (!_0x0_0x3e33f2['existsSync'](_0x2269c3))
            return _0x1488c2(new Error('File\x20not\x20Found'));
        try {
            const _0x2091c7 = new _0x0_0x14b5d4();
            _0x2091c7['append']('file', _0x0_0x3e33f2['createReadStream'](_0x2269c3));
            const _0x5047cb = await _0x0_0x38f539({
                'url': 'https://telegra.ph/upload',
                'method': 'POST',
                'headers': { ..._0x2091c7['getHeaders']() },
                'data': _0x2091c7
            });
            return _0x5b109a('https://telegra.ph' + _0x5047cb['data'][0x0]['src']);
        } catch (_0x5b8d62) {
            return _0x1488c2(new Error(String(_0x5b8d62)));
        }
    });
}
async function UploadFileUgu(_0x1cf93b) {
    return new Promise(async (_0x941dc6, _0xb3e00c) => {
        const _0x4f40e6 = new _0x0_0x14b5d4();
        _0x4f40e6['append']('files[]', _0x0_0x3e33f2['createReadStream'](_0x1cf93b));
        await _0x0_0x38f539({
            'url': 'https://uguu.se/upload.php',
            'method': 'POST',
            'headers': {
                'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/90.0.4430.212\x20Safari/537.36',
                ..._0x4f40e6['getHeaders']()
            },
            'data': _0x4f40e6
        })['then'](_0x56f2e5 => {
            _0x941dc6(_0x56f2e5['data']['files'][0x0]);
        })['catch'](_0x22b359 => _0xb3e00c(_0x22b359));
    });
}
function webp2mp4File(_0x3a0cf9) {
    return new Promise((_0x482998, _0x1efd8b) => {
        const _0x52d1d0 = new _0x0_0x14b5d4();
        _0x52d1d0['append']('new-image-url', '');
        _0x52d1d0['append']('new-image', _0x0_0x3e33f2['createReadStream'](_0x3a0cf9));
        _0x0_0x38f539({
            'method': 'post',
            'url': 'https://s6.ezgif.com/webp-to-mp4',
            'data': _0x52d1d0,
            'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x52d1d0['_boundary'] }
        })['then'](({data: _0xf12e8f}) => {
            const _0x43bb0a = new _0x0_0x14b5d4();
            const _0x490d18 = _0x0_0x26b475['load'](_0xf12e8f);
            const _0xf86e1b = _0x490d18('input[name=\x22file\x22]')['attr']('value');
            _0x43bb0a['append']('file', _0xf86e1b);
            _0x43bb0a['append']('convert', 'Convert\x20WebP\x20to\x20MP4!');
            _0x0_0x38f539({
                'method': 'post',
                'url': 'https://ezgif.com/webp-to-mp4/' + _0xf86e1b,
                'data': _0x43bb0a,
                'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x43bb0a['_boundary'] }
            })['then'](({data: _0x57a178}) => {
                const _0xa0ff88 = _0x0_0x26b475['load'](_0x57a178);
                const _0x134000 = 'https:' + _0xa0ff88('div#output\x20>\x20p.outfile\x20>\x20video\x20>\x20source')['attr']('src');
                _0x482998({
                    'status': !![],
                    'message': 'Created\x20By\x20NOSTRA',
                    'result': _0x134000
                });
            })['catch'](_0x1efd8b);
        })['catch'](_0x1efd8b);
    });
}
async function floNime(_0x4fcb16, _0x2ad32e = {}) {
    const {ext: _0x179bce} = await fileTypeFromBuffer(_0x4fcb16) || _0x2ad32e['ext'];
    const _0xd8fb49 = new _0x0_0x14b5d4();
    _0xd8fb49['append']('file', _0x4fcb16, 'tmp.' + _0x179bce);
    const _0x335376 = await fetch('https://flonime.my.id/upload', {
        'method': 'POST',
        'body': _0xd8fb49
    })['then'](_0x5b0453 => _0x5b0453['json']());
    return _0x335376;
}
export {
    TelegraPh,
    UploadFileUgu,
    webp2mp4File,
    floNime
};