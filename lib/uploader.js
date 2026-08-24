import _0x0_0x5f5266 from 'axios';
import _0x0_0x2dca30 from 'form-data';
import { fileTypeFromBuffer } from 'file-type';
import _0x0_0x4d38d6 from 'fs';
import * as _0x0_0x4e5c0 from 'cheerio';
function TelegraPh(_0x4e475d) {
    return new Promise(async (_0x22cb98, _0xff65ce) => {
        if (!_0x0_0x4d38d6['existsSync'](_0x4e475d))
            return _0xff65ce(new Error('File\x20not\x20Found'));
        try {
            const _0x5b849c = new _0x0_0x2dca30();
            _0x5b849c['append']('file', _0x0_0x4d38d6['createReadStream'](_0x4e475d));
            const _0x230db7 = await _0x0_0x5f5266({
                'url': 'https://telegra.ph/upload',
                'method': 'POST',
                'headers': { ..._0x5b849c['getHeaders']() },
                'data': _0x5b849c
            });
            return _0x22cb98('https://telegra.ph' + _0x230db7['data'][0x0]['src']);
        } catch (_0x5c0010) {
            return _0xff65ce(new Error(String(_0x5c0010)));
        }
    });
}
async function UploadFileUgu(_0x2e05d9) {
    return new Promise(async (_0x2bff1b, _0x3242f4) => {
        const _0x278c7f = new _0x0_0x2dca30();
        _0x278c7f['append']('files[]', _0x0_0x4d38d6['createReadStream'](_0x2e05d9));
        await _0x0_0x5f5266({
            'url': 'https://uguu.se/upload.php',
            'method': 'POST',
            'headers': {
                'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/90.0.4430.212\x20Safari/537.36',
                ..._0x278c7f['getHeaders']()
            },
            'data': _0x278c7f
        })['then'](_0x5ea07f => {
            _0x2bff1b(_0x5ea07f['data']['files'][0x0]);
        })['catch'](_0x114a7a => _0x3242f4(_0x114a7a));
    });
}
function webp2mp4File(_0x463d5e) {
    return new Promise((_0x2ab21b, _0x23d459) => {
        const _0x20f745 = new _0x0_0x2dca30();
        _0x20f745['append']('new-image-url', '');
        _0x20f745['append']('new-image', _0x0_0x4d38d6['createReadStream'](_0x463d5e));
        _0x0_0x5f5266({
            'method': 'post',
            'url': 'https://s6.ezgif.com/webp-to-mp4',
            'data': _0x20f745,
            'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x20f745['_boundary'] }
        })['then'](({data: _0x266ae4}) => {
            const _0x34a406 = new _0x0_0x2dca30();
            const _0x1dc2d6 = _0x0_0x4e5c0['load'](_0x266ae4);
            const _0x20bd36 = _0x1dc2d6('input[name=\x22file\x22]')['attr']('value');
            _0x34a406['append']('file', _0x20bd36);
            _0x34a406['append']('convert', 'Convert\x20WebP\x20to\x20MP4!');
            _0x0_0x5f5266({
                'method': 'post',
                'url': 'https://ezgif.com/webp-to-mp4/' + _0x20bd36,
                'data': _0x34a406,
                'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x34a406['_boundary'] }
            })['then'](({data: _0x2e28e4}) => {
                const _0x296def = _0x0_0x4e5c0['load'](_0x2e28e4);
                const _0x5b4a57 = 'https:' + _0x296def('div#output\x20>\x20p.outfile\x20>\x20video\x20>\x20source')['attr']('src');
                _0x2ab21b({
                    'status': !![],
                    'message': 'Created\x20By\x20NOSTRA',
                    'result': _0x5b4a57
                });
            })['catch'](_0x23d459);
        })['catch'](_0x23d459);
    });
}
async function floNime(_0x1afaac, _0x1625b9 = {}) {
    const {ext: _0x2d8561} = await fileTypeFromBuffer(_0x1afaac) || _0x1625b9['ext'];
    const _0x574744 = new _0x0_0x2dca30();
    _0x574744['append']('file', _0x1afaac, 'tmp.' + _0x2d8561);
    const _0x22ca07 = await fetch('https://flonime.my.id/upload', {
        'method': 'POST',
        'body': _0x574744
    })['then'](_0x39b379 => _0x39b379['json']());
    return _0x22ca07;
}
export {
    TelegraPh,
    UploadFileUgu,
    webp2mp4File,
    floNime
};