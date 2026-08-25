import _0x0_0xb9c04d from 'axios';
import _0x0_0xd849b6 from 'form-data';
import { fileTypeFromBuffer } from 'file-type';
import _0x0_0x29f526 from 'fs';
import * as _0x0_0x1d5f62 from 'cheerio';
function TelegraPh(_0x3f7201) {
    return new Promise(async (_0x10e12a, _0x1689fa) => {
        if (!_0x0_0x29f526['existsSync'](_0x3f7201))
            return _0x1689fa(new Error('File\x20not\x20Found'));
        try {
            const _0xa50d6 = new _0x0_0xd849b6();
            _0xa50d6['append']('file', _0x0_0x29f526['createReadStream'](_0x3f7201));
            const _0x5bf2d2 = await _0x0_0xb9c04d({
                'url': 'https://telegra.ph/upload',
                'method': 'POST',
                'headers': { ..._0xa50d6['getHeaders']() },
                'data': _0xa50d6
            });
            return _0x10e12a('https://telegra.ph' + _0x5bf2d2['data'][0x0]['src']);
        } catch (_0x4e1950) {
            return _0x1689fa(new Error(String(_0x4e1950)));
        }
    });
}
async function UploadFileUgu(_0x591aad) {
    return new Promise(async (_0xa01aa7, _0x80a56f) => {
        const _0x5f2daa = new _0x0_0xd849b6();
        _0x5f2daa['append']('files[]', _0x0_0x29f526['createReadStream'](_0x591aad));
        await _0x0_0xb9c04d({
            'url': 'https://uguu.se/upload.php',
            'method': 'POST',
            'headers': {
                'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/90.0.4430.212\x20Safari/537.36',
                ..._0x5f2daa['getHeaders']()
            },
            'data': _0x5f2daa
        })['then'](_0x528437 => {
            _0xa01aa7(_0x528437['data']['files'][0x0]);
        })['catch'](_0x2578e6 => _0x80a56f(_0x2578e6));
    });
}
function webp2mp4File(_0x470f67) {
    return new Promise((_0xf06500, _0x6443c) => {
        const _0x5ccfbb = new _0x0_0xd849b6();
        _0x5ccfbb['append']('new-image-url', '');
        _0x5ccfbb['append']('new-image', _0x0_0x29f526['createReadStream'](_0x470f67));
        _0x0_0xb9c04d({
            'method': 'post',
            'url': 'https://s6.ezgif.com/webp-to-mp4',
            'data': _0x5ccfbb,
            'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x5ccfbb['_boundary'] }
        })['then'](({data: _0xce7de0}) => {
            const _0x57ca6b = new _0x0_0xd849b6();
            const _0x149f40 = _0x0_0x1d5f62['load'](_0xce7de0);
            const _0x2cf1e4 = _0x149f40('input[name=\x22file\x22]')['attr']('value');
            _0x57ca6b['append']('file', _0x2cf1e4);
            _0x57ca6b['append']('convert', 'Convert\x20WebP\x20to\x20MP4!');
            _0x0_0xb9c04d({
                'method': 'post',
                'url': 'https://ezgif.com/webp-to-mp4/' + _0x2cf1e4,
                'data': _0x57ca6b,
                'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x57ca6b['_boundary'] }
            })['then'](({data: _0x1fb0f2}) => {
                const _0x2a42c1 = _0x0_0x1d5f62['load'](_0x1fb0f2);
                const _0x63867b = 'https:' + _0x2a42c1('div#output\x20>\x20p.outfile\x20>\x20video\x20>\x20source')['attr']('src');
                _0xf06500({
                    'status': !![],
                    'message': 'Created\x20By\x20NOSTRA',
                    'result': _0x63867b
                });
            })['catch'](_0x6443c);
        })['catch'](_0x6443c);
    });
}
async function floNime(_0x4e0506, _0x3e7c19 = {}) {
    const {ext: _0x20ed88} = await fileTypeFromBuffer(_0x4e0506) || _0x3e7c19['ext'];
    const _0x2a21b2 = new _0x0_0xd849b6();
    _0x2a21b2['append']('file', _0x4e0506, 'tmp.' + _0x20ed88);
    const _0x55da18 = await fetch('https://flonime.my.id/upload', {
        'method': 'POST',
        'body': _0x2a21b2
    })['then'](_0x35338a => _0x35338a['json']());
    return _0x55da18;
}
export {
    TelegraPh,
    UploadFileUgu,
    webp2mp4File,
    floNime
};