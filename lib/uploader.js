import _0x0_0x9c4581 from 'axios';
import _0x0_0xfd31f from 'form-data';
import { fileTypeFromBuffer } from 'file-type';
import _0x0_0x29cca4 from 'fs';
import * as _0x0_0x1697e2 from 'cheerio';
function TelegraPh(_0x22190b) {
    return new Promise(async (_0x2d9a41, _0x41f625) => {
        if (!_0x0_0x29cca4['existsSync'](_0x22190b))
            return _0x41f625(new Error('File\x20not\x20Found'));
        try {
            const _0x3c827f = new _0x0_0xfd31f();
            _0x3c827f['append']('file', _0x0_0x29cca4['createReadStream'](_0x22190b));
            const _0x273158 = await _0x0_0x9c4581({
                'url': 'https://telegra.ph/upload',
                'method': 'POST',
                'headers': { ..._0x3c827f['getHeaders']() },
                'data': _0x3c827f
            });
            return _0x2d9a41('https://telegra.ph' + _0x273158['data'][0x0]['src']);
        } catch (_0x45085e) {
            return _0x41f625(new Error(String(_0x45085e)));
        }
    });
}
async function UploadFileUgu(_0x29e9bc) {
    return new Promise(async (_0x8a13ca, _0x1592bb) => {
        const _0x18cb32 = new _0x0_0xfd31f();
        _0x18cb32['append']('files[]', _0x0_0x29cca4['createReadStream'](_0x29e9bc));
        await _0x0_0x9c4581({
            'url': 'https://uguu.se/upload.php',
            'method': 'POST',
            'headers': {
                'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/90.0.4430.212\x20Safari/537.36',
                ..._0x18cb32['getHeaders']()
            },
            'data': _0x18cb32
        })['then'](_0xaa902e => {
            _0x8a13ca(_0xaa902e['data']['files'][0x0]);
        })['catch'](_0x47d33d => _0x1592bb(_0x47d33d));
    });
}
function webp2mp4File(_0x212b21) {
    return new Promise((_0x3c6897, _0x183a60) => {
        const _0x5b3dd6 = new _0x0_0xfd31f();
        _0x5b3dd6['append']('new-image-url', '');
        _0x5b3dd6['append']('new-image', _0x0_0x29cca4['createReadStream'](_0x212b21));
        _0x0_0x9c4581({
            'method': 'post',
            'url': 'https://s6.ezgif.com/webp-to-mp4',
            'data': _0x5b3dd6,
            'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x5b3dd6['_boundary'] }
        })['then'](({data: _0x1c6b1b}) => {
            const _0x26d2b6 = new _0x0_0xfd31f();
            const _0x1bef06 = _0x0_0x1697e2['load'](_0x1c6b1b);
            const _0x27a31b = _0x1bef06('input[name=\x22file\x22]')['attr']('value');
            _0x26d2b6['append']('file', _0x27a31b);
            _0x26d2b6['append']('convert', 'Convert\x20WebP\x20to\x20MP4!');
            _0x0_0x9c4581({
                'method': 'post',
                'url': 'https://ezgif.com/webp-to-mp4/' + _0x27a31b,
                'data': _0x26d2b6,
                'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x26d2b6['_boundary'] }
            })['then'](({data: _0x22f187}) => {
                const _0x13f68d = _0x0_0x1697e2['load'](_0x22f187);
                const _0x4f774f = 'https:' + _0x13f68d('div#output\x20>\x20p.outfile\x20>\x20video\x20>\x20source')['attr']('src');
                _0x3c6897({
                    'status': !![],
                    'message': 'Created\x20By\x20NOSTRA',
                    'result': _0x4f774f
                });
            })['catch'](_0x183a60);
        })['catch'](_0x183a60);
    });
}
async function floNime(_0x173a76, _0x3fe50b = {}) {
    const {ext: _0x4318bf} = await fileTypeFromBuffer(_0x173a76) || _0x3fe50b['ext'];
    const _0x9b2f6b = new _0x0_0xfd31f();
    _0x9b2f6b['append']('file', _0x173a76, 'tmp.' + _0x4318bf);
    const _0x508512 = await fetch('https://flonime.my.id/upload', {
        'method': 'POST',
        'body': _0x9b2f6b
    })['then'](_0x2f3136 => _0x2f3136['json']());
    return _0x508512;
}
export {
    TelegraPh,
    UploadFileUgu,
    webp2mp4File,
    floNime
};