import _0x0_0x1108e2 from 'axios';
import _0x0_0x1e835b from 'form-data';
import { fileTypeFromBuffer } from 'file-type';
import _0x0_0x2abf58 from 'fs';
import * as _0x0_0x4c6453 from 'cheerio';
function TelegraPh(_0x473bed) {
    return new Promise(async (_0x23ca34, _0xa6b5c9) => {
        if (!_0x0_0x2abf58['existsSync'](_0x473bed))
            return _0xa6b5c9(new Error('File\x20not\x20Found'));
        try {
            const _0xe00984 = new _0x0_0x1e835b();
            _0xe00984['append']('file', _0x0_0x2abf58['createReadStream'](_0x473bed));
            const _0x596dc5 = await _0x0_0x1108e2({
                'url': 'https://telegra.ph/upload',
                'method': 'POST',
                'headers': { ..._0xe00984['getHeaders']() },
                'data': _0xe00984
            });
            return _0x23ca34('https://telegra.ph' + _0x596dc5['data'][0x0]['src']);
        } catch (_0x52ca04) {
            return _0xa6b5c9(new Error(String(_0x52ca04)));
        }
    });
}
async function UploadFileUgu(_0xa4d946) {
    return new Promise(async (_0x15efe5, _0x12e553) => {
        const _0x1d2680 = new _0x0_0x1e835b();
        _0x1d2680['append']('files[]', _0x0_0x2abf58['createReadStream'](_0xa4d946));
        await _0x0_0x1108e2({
            'url': 'https://uguu.se/upload.php',
            'method': 'POST',
            'headers': {
                'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/90.0.4430.212\x20Safari/537.36',
                ..._0x1d2680['getHeaders']()
            },
            'data': _0x1d2680
        })['then'](_0x4618b6 => {
            _0x15efe5(_0x4618b6['data']['files'][0x0]);
        })['catch'](_0x3aa577 => _0x12e553(_0x3aa577));
    });
}
function webp2mp4File(_0x196719) {
    return new Promise((_0x30403f, _0x158885) => {
        const _0x504eab = new _0x0_0x1e835b();
        _0x504eab['append']('new-image-url', '');
        _0x504eab['append']('new-image', _0x0_0x2abf58['createReadStream'](_0x196719));
        _0x0_0x1108e2({
            'method': 'post',
            'url': 'https://s6.ezgif.com/webp-to-mp4',
            'data': _0x504eab,
            'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x504eab['_boundary'] }
        })['then'](({data: _0x347b84}) => {
            const _0x4cc5e5 = new _0x0_0x1e835b();
            const _0x2058cb = _0x0_0x4c6453['load'](_0x347b84);
            const _0x2dda67 = _0x2058cb('input[name=\x22file\x22]')['attr']('value');
            _0x4cc5e5['append']('file', _0x2dda67);
            _0x4cc5e5['append']('convert', 'Convert\x20WebP\x20to\x20MP4!');
            _0x0_0x1108e2({
                'method': 'post',
                'url': 'https://ezgif.com/webp-to-mp4/' + _0x2dda67,
                'data': _0x4cc5e5,
                'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x4cc5e5['_boundary'] }
            })['then'](({data: _0x5a4fa9}) => {
                const _0x225de8 = _0x0_0x4c6453['load'](_0x5a4fa9);
                const _0x471243 = 'https:' + _0x225de8('div#output\x20>\x20p.outfile\x20>\x20video\x20>\x20source')['attr']('src');
                _0x30403f({
                    'status': !![],
                    'message': 'Created\x20By\x20NOSTRA',
                    'result': _0x471243
                });
            })['catch'](_0x158885);
        })['catch'](_0x158885);
    });
}
async function floNime(_0x50a5d0, _0x12fcc3 = {}) {
    const {ext: _0x120057} = await fileTypeFromBuffer(_0x50a5d0) || _0x12fcc3['ext'];
    const _0xbb967a = new _0x0_0x1e835b();
    _0xbb967a['append']('file', _0x50a5d0, 'tmp.' + _0x120057);
    const _0x1e3ec2 = await fetch('https://flonime.my.id/upload', {
        'method': 'POST',
        'body': _0xbb967a
    })['then'](_0xecf982 => _0xecf982['json']());
    return _0x1e3ec2;
}
export {
    TelegraPh,
    UploadFileUgu,
    webp2mp4File,
    floNime
};