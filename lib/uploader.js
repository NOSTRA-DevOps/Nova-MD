import _0x0_0x1562d0 from 'axios';
import _0x0_0x5354ed from 'form-data';
import { fileTypeFromBuffer } from 'file-type';
import _0x0_0x1989a0 from 'fs';
import * as _0x0_0x327cc9 from 'cheerio';
function TelegraPh(_0x2829df) {
    return new Promise(async (_0x2a1bd2, _0x3378d9) => {
        if (!_0x0_0x1989a0['existsSync'](_0x2829df))
            return _0x3378d9(new Error('File\x20not\x20Found'));
        try {
            const _0x136b82 = new _0x0_0x5354ed();
            _0x136b82['append']('file', _0x0_0x1989a0['createReadStream'](_0x2829df));
            const _0x34e85d = await _0x0_0x1562d0({
                'url': 'https://telegra.ph/upload',
                'method': 'POST',
                'headers': { ..._0x136b82['getHeaders']() },
                'data': _0x136b82
            });
            return _0x2a1bd2('https://telegra.ph' + _0x34e85d['data'][0x0]['src']);
        } catch (_0x27e2fd) {
            return _0x3378d9(new Error(String(_0x27e2fd)));
        }
    });
}
async function UploadFileUgu(_0x39bb78) {
    return new Promise(async (_0x376039, _0x32e5e1) => {
        const _0x38e7d8 = new _0x0_0x5354ed();
        _0x38e7d8['append']('files[]', _0x0_0x1989a0['createReadStream'](_0x39bb78));
        await _0x0_0x1562d0({
            'url': 'https://uguu.se/upload.php',
            'method': 'POST',
            'headers': {
                'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/90.0.4430.212\x20Safari/537.36',
                ..._0x38e7d8['getHeaders']()
            },
            'data': _0x38e7d8
        })['then'](_0x1209b2 => {
            _0x376039(_0x1209b2['data']['files'][0x0]);
        })['catch'](_0x40eb16 => _0x32e5e1(_0x40eb16));
    });
}
function webp2mp4File(_0x4e08d4) {
    return new Promise((_0x13487e, _0x5b0fe0) => {
        const _0x482faa = new _0x0_0x5354ed();
        _0x482faa['append']('new-image-url', '');
        _0x482faa['append']('new-image', _0x0_0x1989a0['createReadStream'](_0x4e08d4));
        _0x0_0x1562d0({
            'method': 'post',
            'url': 'https://s6.ezgif.com/webp-to-mp4',
            'data': _0x482faa,
            'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x482faa['_boundary'] }
        })['then'](({data: _0x5867ff}) => {
            const _0x835011 = new _0x0_0x5354ed();
            const _0x270916 = _0x0_0x327cc9['load'](_0x5867ff);
            const _0x234b4d = _0x270916('input[name=\x22file\x22]')['attr']('value');
            _0x835011['append']('file', _0x234b4d);
            _0x835011['append']('convert', 'Convert\x20WebP\x20to\x20MP4!');
            _0x0_0x1562d0({
                'method': 'post',
                'url': 'https://ezgif.com/webp-to-mp4/' + _0x234b4d,
                'data': _0x835011,
                'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x835011['_boundary'] }
            })['then'](({data: _0x263fa7}) => {
                const _0x3a7c58 = _0x0_0x327cc9['load'](_0x263fa7);
                const _0x5f3b96 = 'https:' + _0x3a7c58('div#output\x20>\x20p.outfile\x20>\x20video\x20>\x20source')['attr']('src');
                _0x13487e({
                    'status': !![],
                    'message': 'Created\x20By\x20NOSTRA',
                    'result': _0x5f3b96
                });
            })['catch'](_0x5b0fe0);
        })['catch'](_0x5b0fe0);
    });
}
async function floNime(_0x266483, _0x4e477c = {}) {
    const {ext: _0x2e958c} = await fileTypeFromBuffer(_0x266483) || _0x4e477c['ext'];
    const _0x52e8e1 = new _0x0_0x5354ed();
    _0x52e8e1['append']('file', _0x266483, 'tmp.' + _0x2e958c);
    const _0x315693 = await fetch('https://flonime.my.id/upload', {
        'method': 'POST',
        'body': _0x52e8e1
    })['then'](_0x4bf40c => _0x4bf40c['json']());
    return _0x315693;
}
export {
    TelegraPh,
    UploadFileUgu,
    webp2mp4File,
    floNime
};