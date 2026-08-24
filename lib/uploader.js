import _0x0_0x5d8be8 from 'axios';
import _0x0_0x102e40 from 'form-data';
import { fileTypeFromBuffer } from 'file-type';
import _0x0_0x29e6f9 from 'fs';
import * as _0x0_0x1a9649 from 'cheerio';
function TelegraPh(_0x3e2b0f) {
    return new Promise(async (_0x57d21b, _0x1e4d75) => {
        if (!_0x0_0x29e6f9['existsSync'](_0x3e2b0f))
            return _0x1e4d75(new Error('File\x20not\x20Found'));
        try {
            const _0xd0a68e = new _0x0_0x102e40();
            _0xd0a68e['append']('file', _0x0_0x29e6f9['createReadStream'](_0x3e2b0f));
            const _0x4e5f11 = await _0x0_0x5d8be8({
                'url': 'https://telegra.ph/upload',
                'method': 'POST',
                'headers': { ..._0xd0a68e['getHeaders']() },
                'data': _0xd0a68e
            });
            return _0x57d21b('https://telegra.ph' + _0x4e5f11['data'][0x0]['src']);
        } catch (_0x46e98e) {
            return _0x1e4d75(new Error(String(_0x46e98e)));
        }
    });
}
async function UploadFileUgu(_0x2ac3e5) {
    return new Promise(async (_0x15cfa6, _0x5723f3) => {
        const _0x411170 = new _0x0_0x102e40();
        _0x411170['append']('files[]', _0x0_0x29e6f9['createReadStream'](_0x2ac3e5));
        await _0x0_0x5d8be8({
            'url': 'https://uguu.se/upload.php',
            'method': 'POST',
            'headers': {
                'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/90.0.4430.212\x20Safari/537.36',
                ..._0x411170['getHeaders']()
            },
            'data': _0x411170
        })['then'](_0x5859a0 => {
            _0x15cfa6(_0x5859a0['data']['files'][0x0]);
        })['catch'](_0x556c43 => _0x5723f3(_0x556c43));
    });
}
function webp2mp4File(_0x46d67c) {
    return new Promise((_0x2a0f05, _0x21a72a) => {
        const _0x3eedc7 = new _0x0_0x102e40();
        _0x3eedc7['append']('new-image-url', '');
        _0x3eedc7['append']('new-image', _0x0_0x29e6f9['createReadStream'](_0x46d67c));
        _0x0_0x5d8be8({
            'method': 'post',
            'url': 'https://s6.ezgif.com/webp-to-mp4',
            'data': _0x3eedc7,
            'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x3eedc7['_boundary'] }
        })['then'](({data: _0x2b03fc}) => {
            const _0x1a335b = new _0x0_0x102e40();
            const _0xf7cd8 = _0x0_0x1a9649['load'](_0x2b03fc);
            const _0x5853f4 = _0xf7cd8('input[name=\x22file\x22]')['attr']('value');
            _0x1a335b['append']('file', _0x5853f4);
            _0x1a335b['append']('convert', 'Convert\x20WebP\x20to\x20MP4!');
            _0x0_0x5d8be8({
                'method': 'post',
                'url': 'https://ezgif.com/webp-to-mp4/' + _0x5853f4,
                'data': _0x1a335b,
                'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x1a335b['_boundary'] }
            })['then'](({data: _0x29d312}) => {
                const _0x21b216 = _0x0_0x1a9649['load'](_0x29d312);
                const _0xb72d3c = 'https:' + _0x21b216('div#output\x20>\x20p.outfile\x20>\x20video\x20>\x20source')['attr']('src');
                _0x2a0f05({
                    'status': !![],
                    'message': 'Created\x20By\x20NOSTRA',
                    'result': _0xb72d3c
                });
            })['catch'](_0x21a72a);
        })['catch'](_0x21a72a);
    });
}
async function floNime(_0x45dd20, _0x3fa993 = {}) {
    const {ext: _0x10cab5} = await fileTypeFromBuffer(_0x45dd20) || _0x3fa993['ext'];
    const _0xf8307a = new _0x0_0x102e40();
    _0xf8307a['append']('file', _0x45dd20, 'tmp.' + _0x10cab5);
    const _0x162ddc = await fetch('https://flonime.my.id/upload', {
        'method': 'POST',
        'body': _0xf8307a
    })['then'](_0x2b2522 => _0x2b2522['json']());
    return _0x162ddc;
}
export {
    TelegraPh,
    UploadFileUgu,
    webp2mp4File,
    floNime
};