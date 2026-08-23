import _0x0_0x431b16 from 'axios';
import _0x0_0x4c6bc9 from 'form-data';
import { fileTypeFromBuffer } from 'file-type';
import _0x0_0x3ba840 from 'fs';
import * as _0x0_0x34b833 from 'cheerio';
function TelegraPh(_0x1b6882) {
    return new Promise(async (_0x3fe230, _0x18be8d) => {
        if (!_0x0_0x3ba840['existsSync'](_0x1b6882))
            return _0x18be8d(new Error('File\x20not\x20Found'));
        try {
            const _0x2f1b8b = new _0x0_0x4c6bc9();
            _0x2f1b8b['append']('file', _0x0_0x3ba840['createReadStream'](_0x1b6882));
            const _0x2dca47 = await _0x0_0x431b16({
                'url': 'https://telegra.ph/upload',
                'method': 'POST',
                'headers': { ..._0x2f1b8b['getHeaders']() },
                'data': _0x2f1b8b
            });
            return _0x3fe230('https://telegra.ph' + _0x2dca47['data'][0x0]['src']);
        } catch (_0x1715d9) {
            return _0x18be8d(new Error(String(_0x1715d9)));
        }
    });
}
async function UploadFileUgu(_0x307a5d) {
    return new Promise(async (_0x373066, _0xfc90ce) => {
        const _0x1107fe = new _0x0_0x4c6bc9();
        _0x1107fe['append']('files[]', _0x0_0x3ba840['createReadStream'](_0x307a5d));
        await _0x0_0x431b16({
            'url': 'https://uguu.se/upload.php',
            'method': 'POST',
            'headers': {
                'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/90.0.4430.212\x20Safari/537.36',
                ..._0x1107fe['getHeaders']()
            },
            'data': _0x1107fe
        })['then'](_0x364011 => {
            _0x373066(_0x364011['data']['files'][0x0]);
        })['catch'](_0x45424a => _0xfc90ce(_0x45424a));
    });
}
function webp2mp4File(_0x43376c) {
    return new Promise((_0x4fcacf, _0x217d40) => {
        const _0x282829 = new _0x0_0x4c6bc9();
        _0x282829['append']('new-image-url', '');
        _0x282829['append']('new-image', _0x0_0x3ba840['createReadStream'](_0x43376c));
        _0x0_0x431b16({
            'method': 'post',
            'url': 'https://s6.ezgif.com/webp-to-mp4',
            'data': _0x282829,
            'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x282829['_boundary'] }
        })['then'](({data: _0x30e5cb}) => {
            const _0x1eabb4 = new _0x0_0x4c6bc9();
            const _0x4d0664 = _0x0_0x34b833['load'](_0x30e5cb);
            const _0x14a4a4 = _0x4d0664('input[name=\x22file\x22]')['attr']('value');
            _0x1eabb4['append']('file', _0x14a4a4);
            _0x1eabb4['append']('convert', 'Convert\x20WebP\x20to\x20MP4!');
            _0x0_0x431b16({
                'method': 'post',
                'url': 'https://ezgif.com/webp-to-mp4/' + _0x14a4a4,
                'data': _0x1eabb4,
                'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x1eabb4['_boundary'] }
            })['then'](({data: _0x19ce1e}) => {
                const _0x61f345 = _0x0_0x34b833['load'](_0x19ce1e);
                const _0x3b4f00 = 'https:' + _0x61f345('div#output\x20>\x20p.outfile\x20>\x20video\x20>\x20source')['attr']('src');
                _0x4fcacf({
                    'status': !![],
                    'message': 'Created\x20By\x20NOSTRA',
                    'result': _0x3b4f00
                });
            })['catch'](_0x217d40);
        })['catch'](_0x217d40);
    });
}
async function floNime(_0x3a3c2f, _0x38bd02 = {}) {
    const {ext: _0x325ffa} = await fileTypeFromBuffer(_0x3a3c2f) || _0x38bd02['ext'];
    const _0x5e9e17 = new _0x0_0x4c6bc9();
    _0x5e9e17['append']('file', _0x3a3c2f, 'tmp.' + _0x325ffa);
    const _0x4f18b1 = await fetch('https://flonime.my.id/upload', {
        'method': 'POST',
        'body': _0x5e9e17
    })['then'](_0x393b63 => _0x393b63['json']());
    return _0x4f18b1;
}
export {
    TelegraPh,
    UploadFileUgu,
    webp2mp4File,
    floNime
};