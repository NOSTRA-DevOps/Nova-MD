import _0x0_0xbc98ce from 'axios';
import _0x0_0x4f2fe2 from 'form-data';
import { fileTypeFromBuffer } from 'file-type';
import _0x0_0xf7cefb from 'fs';
import * as _0x0_0x49a027 from 'cheerio';
function TelegraPh(_0x596b3e) {
    return new Promise(async (_0x43922a, _0x483820) => {
        if (!_0x0_0xf7cefb['existsSync'](_0x596b3e))
            return _0x483820(new Error('File\x20not\x20Found'));
        try {
            const _0x11e6d1 = new _0x0_0x4f2fe2();
            _0x11e6d1['append']('file', _0x0_0xf7cefb['createReadStream'](_0x596b3e));
            const _0x512a80 = await _0x0_0xbc98ce({
                'url': 'https://telegra.ph/upload',
                'method': 'POST',
                'headers': { ..._0x11e6d1['getHeaders']() },
                'data': _0x11e6d1
            });
            return _0x43922a('https://telegra.ph' + _0x512a80['data'][0x0]['src']);
        } catch (_0x1845b9) {
            return _0x483820(new Error(String(_0x1845b9)));
        }
    });
}
async function UploadFileUgu(_0x384277) {
    return new Promise(async (_0x1324b3, _0x14a9ad) => {
        const _0x3a195a = new _0x0_0x4f2fe2();
        _0x3a195a['append']('files[]', _0x0_0xf7cefb['createReadStream'](_0x384277));
        await _0x0_0xbc98ce({
            'url': 'https://uguu.se/upload.php',
            'method': 'POST',
            'headers': {
                'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/90.0.4430.212\x20Safari/537.36',
                ..._0x3a195a['getHeaders']()
            },
            'data': _0x3a195a
        })['then'](_0x424740 => {
            _0x1324b3(_0x424740['data']['files'][0x0]);
        })['catch'](_0x12c074 => _0x14a9ad(_0x12c074));
    });
}
function webp2mp4File(_0x2b2438) {
    return new Promise((_0x41a83b, _0xc0b4c1) => {
        const _0x2ffa49 = new _0x0_0x4f2fe2();
        _0x2ffa49['append']('new-image-url', '');
        _0x2ffa49['append']('new-image', _0x0_0xf7cefb['createReadStream'](_0x2b2438));
        _0x0_0xbc98ce({
            'method': 'post',
            'url': 'https://s6.ezgif.com/webp-to-mp4',
            'data': _0x2ffa49,
            'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x2ffa49['_boundary'] }
        })['then'](({data: _0x11f23b}) => {
            const _0x1cbde3 = new _0x0_0x4f2fe2();
            const _0x3c5d9b = _0x0_0x49a027['load'](_0x11f23b);
            const _0x4af721 = _0x3c5d9b('input[name=\x22file\x22]')['attr']('value');
            _0x1cbde3['append']('file', _0x4af721);
            _0x1cbde3['append']('convert', 'Convert\x20WebP\x20to\x20MP4!');
            _0x0_0xbc98ce({
                'method': 'post',
                'url': 'https://ezgif.com/webp-to-mp4/' + _0x4af721,
                'data': _0x1cbde3,
                'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x1cbde3['_boundary'] }
            })['then'](({data: _0x199571}) => {
                const _0x17482c = _0x0_0x49a027['load'](_0x199571);
                const _0x46c50f = 'https:' + _0x17482c('div#output\x20>\x20p.outfile\x20>\x20video\x20>\x20source')['attr']('src');
                _0x41a83b({
                    'status': !![],
                    'message': 'Created\x20By\x20NOSTRA',
                    'result': _0x46c50f
                });
            })['catch'](_0xc0b4c1);
        })['catch'](_0xc0b4c1);
    });
}
async function floNime(_0x380cb5, _0x15f96c = {}) {
    const {ext: _0x556dee} = await fileTypeFromBuffer(_0x380cb5) || _0x15f96c['ext'];
    const _0x5f4a87 = new _0x0_0x4f2fe2();
    _0x5f4a87['append']('file', _0x380cb5, 'tmp.' + _0x556dee);
    const _0x13ccef = await fetch('https://flonime.my.id/upload', {
        'method': 'POST',
        'body': _0x5f4a87
    })['then'](_0xd5f59 => _0xd5f59['json']());
    return _0x13ccef;
}
export {
    TelegraPh,
    UploadFileUgu,
    webp2mp4File,
    floNime
};