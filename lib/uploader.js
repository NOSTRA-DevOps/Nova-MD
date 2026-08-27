import _0x0_0x5d811d from 'axios';
import _0x0_0x468e61 from 'form-data';
import { fileTypeFromBuffer } from 'file-type';
import _0x0_0x570146 from 'fs';
import * as _0x0_0x2d6324 from 'cheerio';
function TelegraPh(_0x1007ec) {
    return new Promise(async (_0x1b92d6, _0x34fbf0) => {
        if (!_0x0_0x570146['existsSync'](_0x1007ec))
            return _0x34fbf0(new Error('File\x20not\x20Found'));
        try {
            const _0x315da8 = new _0x0_0x468e61();
            _0x315da8['append']('file', _0x0_0x570146['createReadStream'](_0x1007ec));
            const _0x2e100e = await _0x0_0x5d811d({
                'url': 'https://telegra.ph/upload',
                'method': 'POST',
                'headers': { ..._0x315da8['getHeaders']() },
                'data': _0x315da8
            });
            return _0x1b92d6('https://telegra.ph' + _0x2e100e['data'][0x0]['src']);
        } catch (_0x1218a8) {
            return _0x34fbf0(new Error(String(_0x1218a8)));
        }
    });
}
async function UploadFileUgu(_0x549835) {
    return new Promise(async (_0x25359f, _0x37e14a) => {
        const _0x1333ca = new _0x0_0x468e61();
        _0x1333ca['append']('files[]', _0x0_0x570146['createReadStream'](_0x549835));
        await _0x0_0x5d811d({
            'url': 'https://uguu.se/upload.php',
            'method': 'POST',
            'headers': {
                'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/90.0.4430.212\x20Safari/537.36',
                ..._0x1333ca['getHeaders']()
            },
            'data': _0x1333ca
        })['then'](_0xc1321d => {
            _0x25359f(_0xc1321d['data']['files'][0x0]);
        })['catch'](_0x50e449 => _0x37e14a(_0x50e449));
    });
}
function webp2mp4File(_0x183439) {
    return new Promise((_0x105340, _0x5a112a) => {
        const _0x37464d = new _0x0_0x468e61();
        _0x37464d['append']('new-image-url', '');
        _0x37464d['append']('new-image', _0x0_0x570146['createReadStream'](_0x183439));
        _0x0_0x5d811d({
            'method': 'post',
            'url': 'https://s6.ezgif.com/webp-to-mp4',
            'data': _0x37464d,
            'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x37464d['_boundary'] }
        })['then'](({data: _0x238a59}) => {
            const _0x3884cf = new _0x0_0x468e61();
            const _0x56c898 = _0x0_0x2d6324['load'](_0x238a59);
            const _0x254ee8 = _0x56c898('input[name=\x22file\x22]')['attr']('value');
            _0x3884cf['append']('file', _0x254ee8);
            _0x3884cf['append']('convert', 'Convert\x20WebP\x20to\x20MP4!');
            _0x0_0x5d811d({
                'method': 'post',
                'url': 'https://ezgif.com/webp-to-mp4/' + _0x254ee8,
                'data': _0x3884cf,
                'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x3884cf['_boundary'] }
            })['then'](({data: _0x1c54b6}) => {
                const _0x39d93d = _0x0_0x2d6324['load'](_0x1c54b6);
                const _0x456d3f = 'https:' + _0x39d93d('div#output\x20>\x20p.outfile\x20>\x20video\x20>\x20source')['attr']('src');
                _0x105340({
                    'status': !![],
                    'message': 'Created\x20By\x20NOSTRA',
                    'result': _0x456d3f
                });
            })['catch'](_0x5a112a);
        })['catch'](_0x5a112a);
    });
}
async function floNime(_0xb972b, _0x95997f = {}) {
    const {ext: _0x797d8f} = await fileTypeFromBuffer(_0xb972b) || _0x95997f['ext'];
    const _0x3e6575 = new _0x0_0x468e61();
    _0x3e6575['append']('file', _0xb972b, 'tmp.' + _0x797d8f);
    const _0xdd1ef6 = await fetch('https://flonime.my.id/upload', {
        'method': 'POST',
        'body': _0x3e6575
    })['then'](_0x2e1a87 => _0x2e1a87['json']());
    return _0xdd1ef6;
}
export {
    TelegraPh,
    UploadFileUgu,
    webp2mp4File,
    floNime
};