import _0x0_0xe1d704 from 'axios';
import _0x0_0x4d0674 from 'form-data';
import { fileTypeFromBuffer } from 'file-type';
import _0x0_0x5f53cc from 'fs';
import * as _0x0_0x19ccb1 from 'cheerio';
function TelegraPh(_0x49f212) {
    return new Promise(async (_0x54c06a, _0x35483e) => {
        if (!_0x0_0x5f53cc['existsSync'](_0x49f212))
            return _0x35483e(new Error('File\x20not\x20Found'));
        try {
            const _0x421541 = new _0x0_0x4d0674();
            _0x421541['append']('file', _0x0_0x5f53cc['createReadStream'](_0x49f212));
            const _0x10e4f6 = await _0x0_0xe1d704({
                'url': 'https://telegra.ph/upload',
                'method': 'POST',
                'headers': { ..._0x421541['getHeaders']() },
                'data': _0x421541
            });
            return _0x54c06a('https://telegra.ph' + _0x10e4f6['data'][0x0]['src']);
        } catch (_0x38ceb6) {
            return _0x35483e(new Error(String(_0x38ceb6)));
        }
    });
}
async function UploadFileUgu(_0x1444f9) {
    return new Promise(async (_0x5d7984, _0x104d15) => {
        const _0x25fc34 = new _0x0_0x4d0674();
        _0x25fc34['append']('files[]', _0x0_0x5f53cc['createReadStream'](_0x1444f9));
        await _0x0_0xe1d704({
            'url': 'https://uguu.se/upload.php',
            'method': 'POST',
            'headers': {
                'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/90.0.4430.212\x20Safari/537.36',
                ..._0x25fc34['getHeaders']()
            },
            'data': _0x25fc34
        })['then'](_0x4779e2 => {
            _0x5d7984(_0x4779e2['data']['files'][0x0]);
        })['catch'](_0xcc385f => _0x104d15(_0xcc385f));
    });
}
function webp2mp4File(_0x452924) {
    return new Promise((_0x4479ec, _0x5e16fd) => {
        const _0xd9a49c = new _0x0_0x4d0674();
        _0xd9a49c['append']('new-image-url', '');
        _0xd9a49c['append']('new-image', _0x0_0x5f53cc['createReadStream'](_0x452924));
        _0x0_0xe1d704({
            'method': 'post',
            'url': 'https://s6.ezgif.com/webp-to-mp4',
            'data': _0xd9a49c,
            'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0xd9a49c['_boundary'] }
        })['then'](({data: _0x109659}) => {
            const _0xe1a897 = new _0x0_0x4d0674();
            const _0x462501 = _0x0_0x19ccb1['load'](_0x109659);
            const _0x55df65 = _0x462501('input[name=\x22file\x22]')['attr']('value');
            _0xe1a897['append']('file', _0x55df65);
            _0xe1a897['append']('convert', 'Convert\x20WebP\x20to\x20MP4!');
            _0x0_0xe1d704({
                'method': 'post',
                'url': 'https://ezgif.com/webp-to-mp4/' + _0x55df65,
                'data': _0xe1a897,
                'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0xe1a897['_boundary'] }
            })['then'](({data: _0x3a6499}) => {
                const _0xee4f61 = _0x0_0x19ccb1['load'](_0x3a6499);
                const _0x5dde22 = 'https:' + _0xee4f61('div#output\x20>\x20p.outfile\x20>\x20video\x20>\x20source')['attr']('src');
                _0x4479ec({
                    'status': !![],
                    'message': 'Created\x20By\x20NOSTRA',
                    'result': _0x5dde22
                });
            })['catch'](_0x5e16fd);
        })['catch'](_0x5e16fd);
    });
}
async function floNime(_0x50c573, _0x4023b9 = {}) {
    const {ext: _0x44f05f} = await fileTypeFromBuffer(_0x50c573) || _0x4023b9['ext'];
    const _0x219fc4 = new _0x0_0x4d0674();
    _0x219fc4['append']('file', _0x50c573, 'tmp.' + _0x44f05f);
    const _0x43b20d = await fetch('https://flonime.my.id/upload', {
        'method': 'POST',
        'body': _0x219fc4
    })['then'](_0x17f07d => _0x17f07d['json']());
    return _0x43b20d;
}
export {
    TelegraPh,
    UploadFileUgu,
    webp2mp4File,
    floNime
};