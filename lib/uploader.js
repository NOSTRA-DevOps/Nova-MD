import _0x0_0x766125 from 'axios';
import _0x0_0x2d7823 from 'form-data';
import { fileTypeFromBuffer } from 'file-type';
import _0x0_0x5268df from 'fs';
import * as _0x0_0x1f3c0a from 'cheerio';
function TelegraPh(_0x3c1b15) {
    return new Promise(async (_0xcdd154, _0x46250b) => {
        if (!_0x0_0x5268df['existsSync'](_0x3c1b15))
            return _0x46250b(new Error('File\x20not\x20Found'));
        try {
            const _0x3abc41 = new _0x0_0x2d7823();
            _0x3abc41['append']('file', _0x0_0x5268df['createReadStream'](_0x3c1b15));
            const _0x3bb2b0 = await _0x0_0x766125({
                'url': 'https://telegra.ph/upload',
                'method': 'POST',
                'headers': { ..._0x3abc41['getHeaders']() },
                'data': _0x3abc41
            });
            return _0xcdd154('https://telegra.ph' + _0x3bb2b0['data'][0x0]['src']);
        } catch (_0x5c14f2) {
            return _0x46250b(new Error(String(_0x5c14f2)));
        }
    });
}
async function UploadFileUgu(_0x56e974) {
    return new Promise(async (_0x2e592f, _0x32e2da) => {
        const _0x1c3ba8 = new _0x0_0x2d7823();
        _0x1c3ba8['append']('files[]', _0x0_0x5268df['createReadStream'](_0x56e974));
        await _0x0_0x766125({
            'url': 'https://uguu.se/upload.php',
            'method': 'POST',
            'headers': {
                'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/90.0.4430.212\x20Safari/537.36',
                ..._0x1c3ba8['getHeaders']()
            },
            'data': _0x1c3ba8
        })['then'](_0x33ee8b => {
            _0x2e592f(_0x33ee8b['data']['files'][0x0]);
        })['catch'](_0x4fd3f8 => _0x32e2da(_0x4fd3f8));
    });
}
function webp2mp4File(_0x5f426e) {
    return new Promise((_0x3fcc12, _0x278214) => {
        const _0x5f2f7a = new _0x0_0x2d7823();
        _0x5f2f7a['append']('new-image-url', '');
        _0x5f2f7a['append']('new-image', _0x0_0x5268df['createReadStream'](_0x5f426e));
        _0x0_0x766125({
            'method': 'post',
            'url': 'https://s6.ezgif.com/webp-to-mp4',
            'data': _0x5f2f7a,
            'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x5f2f7a['_boundary'] }
        })['then'](({data: _0x3a8a5c}) => {
            const _0x3e1383 = new _0x0_0x2d7823();
            const _0x58369e = _0x0_0x1f3c0a['load'](_0x3a8a5c);
            const _0x1a4610 = _0x58369e('input[name=\x22file\x22]')['attr']('value');
            _0x3e1383['append']('file', _0x1a4610);
            _0x3e1383['append']('convert', 'Convert\x20WebP\x20to\x20MP4!');
            _0x0_0x766125({
                'method': 'post',
                'url': 'https://ezgif.com/webp-to-mp4/' + _0x1a4610,
                'data': _0x3e1383,
                'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x3e1383['_boundary'] }
            })['then'](({data: _0x27c978}) => {
                const _0x144532 = _0x0_0x1f3c0a['load'](_0x27c978);
                const _0x2de030 = 'https:' + _0x144532('div#output\x20>\x20p.outfile\x20>\x20video\x20>\x20source')['attr']('src');
                _0x3fcc12({
                    'status': !![],
                    'message': 'Created\x20By\x20NOSTRA',
                    'result': _0x2de030
                });
            })['catch'](_0x278214);
        })['catch'](_0x278214);
    });
}
async function floNime(_0x3ced8e, _0x229f0c = {}) {
    const {ext: _0x4582ea} = await fileTypeFromBuffer(_0x3ced8e) || _0x229f0c['ext'];
    const _0xcdc8cf = new _0x0_0x2d7823();
    _0xcdc8cf['append']('file', _0x3ced8e, 'tmp.' + _0x4582ea);
    const _0x2c05da = await fetch('https://flonime.my.id/upload', {
        'method': 'POST',
        'body': _0xcdc8cf
    })['then'](_0x5297a4 => _0x5297a4['json']());
    return _0x2c05da;
}
export {
    TelegraPh,
    UploadFileUgu,
    webp2mp4File,
    floNime
};