import _0x0_0x1f0fdc from 'axios';
import _0x0_0x2d3f07 from 'form-data';
import { fileTypeFromBuffer } from 'file-type';
import _0x0_0x49a550 from 'fs';
import * as _0x0_0x8dc142 from 'cheerio';
function TelegraPh(_0x3f67ba) {
    return new Promise(async (_0x143d2c, _0x24f452) => {
        if (!_0x0_0x49a550['existsSync'](_0x3f67ba))
            return _0x24f452(new Error('File\x20not\x20Found'));
        try {
            const _0x1560c0 = new _0x0_0x2d3f07();
            _0x1560c0['append']('file', _0x0_0x49a550['createReadStream'](_0x3f67ba));
            const _0x42b763 = await _0x0_0x1f0fdc({
                'url': 'https://telegra.ph/upload',
                'method': 'POST',
                'headers': { ..._0x1560c0['getHeaders']() },
                'data': _0x1560c0
            });
            return _0x143d2c('https://telegra.ph' + _0x42b763['data'][0x0]['src']);
        } catch (_0x31689a) {
            return _0x24f452(new Error(String(_0x31689a)));
        }
    });
}
async function UploadFileUgu(_0x9b1202) {
    return new Promise(async (_0x1a385d, _0x5c7393) => {
        const _0x6ff83e = new _0x0_0x2d3f07();
        _0x6ff83e['append']('files[]', _0x0_0x49a550['createReadStream'](_0x9b1202));
        await _0x0_0x1f0fdc({
            'url': 'https://uguu.se/upload.php',
            'method': 'POST',
            'headers': {
                'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/90.0.4430.212\x20Safari/537.36',
                ..._0x6ff83e['getHeaders']()
            },
            'data': _0x6ff83e
        })['then'](_0x93869a => {
            _0x1a385d(_0x93869a['data']['files'][0x0]);
        })['catch'](_0x4f0399 => _0x5c7393(_0x4f0399));
    });
}
function webp2mp4File(_0x22fce8) {
    return new Promise((_0x1b69ac, _0x17b5ad) => {
        const _0x12786c = new _0x0_0x2d3f07();
        _0x12786c['append']('new-image-url', '');
        _0x12786c['append']('new-image', _0x0_0x49a550['createReadStream'](_0x22fce8));
        _0x0_0x1f0fdc({
            'method': 'post',
            'url': 'https://s6.ezgif.com/webp-to-mp4',
            'data': _0x12786c,
            'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x12786c['_boundary'] }
        })['then'](({data: _0x2dc8e1}) => {
            const _0x80bec1 = new _0x0_0x2d3f07();
            const _0x18465a = _0x0_0x8dc142['load'](_0x2dc8e1);
            const _0x5c161f = _0x18465a('input[name=\x22file\x22]')['attr']('value');
            _0x80bec1['append']('file', _0x5c161f);
            _0x80bec1['append']('convert', 'Convert\x20WebP\x20to\x20MP4!');
            _0x0_0x1f0fdc({
                'method': 'post',
                'url': 'https://ezgif.com/webp-to-mp4/' + _0x5c161f,
                'data': _0x80bec1,
                'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x80bec1['_boundary'] }
            })['then'](({data: _0x178b19}) => {
                const _0x8637af = _0x0_0x8dc142['load'](_0x178b19);
                const _0x5bd9ad = 'https:' + _0x8637af('div#output\x20>\x20p.outfile\x20>\x20video\x20>\x20source')['attr']('src');
                _0x1b69ac({
                    'status': !![],
                    'message': 'Created\x20By\x20NOSTRA',
                    'result': _0x5bd9ad
                });
            })['catch'](_0x17b5ad);
        })['catch'](_0x17b5ad);
    });
}
async function floNime(_0x52afa4, _0x55ddee = {}) {
    const {ext: _0x4d4df9} = await fileTypeFromBuffer(_0x52afa4) || _0x55ddee['ext'];
    const _0x2fb6cf = new _0x0_0x2d3f07();
    _0x2fb6cf['append']('file', _0x52afa4, 'tmp.' + _0x4d4df9);
    const _0x158112 = await fetch('https://flonime.my.id/upload', {
        'method': 'POST',
        'body': _0x2fb6cf
    })['then'](_0x28efef => _0x28efef['json']());
    return _0x158112;
}
export {
    TelegraPh,
    UploadFileUgu,
    webp2mp4File,
    floNime
};