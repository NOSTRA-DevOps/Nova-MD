import _0x0_0x49deec from 'axios';
import _0x0_0x49840c from 'form-data';
import { fileTypeFromBuffer } from 'file-type';
import _0x0_0x58713d from 'fs';
import * as _0x0_0x13b8c4 from 'cheerio';
function TelegraPh(_0x5d9627) {
    return new Promise(async (_0x1216d0, _0x12bac6) => {
        if (!_0x0_0x58713d['existsSync'](_0x5d9627))
            return _0x12bac6(new Error('File\x20not\x20Found'));
        try {
            const _0x13d083 = new _0x0_0x49840c();
            _0x13d083['append']('file', _0x0_0x58713d['createReadStream'](_0x5d9627));
            const _0x39b71d = await _0x0_0x49deec({
                'url': 'https://telegra.ph/upload',
                'method': 'POST',
                'headers': { ..._0x13d083['getHeaders']() },
                'data': _0x13d083
            });
            return _0x1216d0('https://telegra.ph' + _0x39b71d['data'][0x0]['src']);
        } catch (_0x574a06) {
            return _0x12bac6(new Error(String(_0x574a06)));
        }
    });
}
async function UploadFileUgu(_0x35f02f) {
    return new Promise(async (_0x5d64af, _0x1c5d88) => {
        const _0xb2b210 = new _0x0_0x49840c();
        _0xb2b210['append']('files[]', _0x0_0x58713d['createReadStream'](_0x35f02f));
        await _0x0_0x49deec({
            'url': 'https://uguu.se/upload.php',
            'method': 'POST',
            'headers': {
                'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/90.0.4430.212\x20Safari/537.36',
                ..._0xb2b210['getHeaders']()
            },
            'data': _0xb2b210
        })['then'](_0x360701 => {
            _0x5d64af(_0x360701['data']['files'][0x0]);
        })['catch'](_0x196141 => _0x1c5d88(_0x196141));
    });
}
function webp2mp4File(_0x587a47) {
    return new Promise((_0x28026c, _0x422c5b) => {
        const _0x51788f = new _0x0_0x49840c();
        _0x51788f['append']('new-image-url', '');
        _0x51788f['append']('new-image', _0x0_0x58713d['createReadStream'](_0x587a47));
        _0x0_0x49deec({
            'method': 'post',
            'url': 'https://s6.ezgif.com/webp-to-mp4',
            'data': _0x51788f,
            'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x51788f['_boundary'] }
        })['then'](({data: _0x49efb3}) => {
            const _0x12aee0 = new _0x0_0x49840c();
            const _0x26164b = _0x0_0x13b8c4['load'](_0x49efb3);
            const _0x5be0ec = _0x26164b('input[name=\x22file\x22]')['attr']('value');
            _0x12aee0['append']('file', _0x5be0ec);
            _0x12aee0['append']('convert', 'Convert\x20WebP\x20to\x20MP4!');
            _0x0_0x49deec({
                'method': 'post',
                'url': 'https://ezgif.com/webp-to-mp4/' + _0x5be0ec,
                'data': _0x12aee0,
                'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x12aee0['_boundary'] }
            })['then'](({data: _0x10302c}) => {
                const _0x2f57f1 = _0x0_0x13b8c4['load'](_0x10302c);
                const _0x231f0e = 'https:' + _0x2f57f1('div#output\x20>\x20p.outfile\x20>\x20video\x20>\x20source')['attr']('src');
                _0x28026c({
                    'status': !![],
                    'message': 'Created\x20By\x20NOSTRA',
                    'result': _0x231f0e
                });
            })['catch'](_0x422c5b);
        })['catch'](_0x422c5b);
    });
}
async function floNime(_0x4d892f, _0x5bdd9e = {}) {
    const {ext: _0x8ab9d5} = await fileTypeFromBuffer(_0x4d892f) || _0x5bdd9e['ext'];
    const _0x123be7 = new _0x0_0x49840c();
    _0x123be7['append']('file', _0x4d892f, 'tmp.' + _0x8ab9d5);
    const _0x464f41 = await fetch('https://flonime.my.id/upload', {
        'method': 'POST',
        'body': _0x123be7
    })['then'](_0x1537e9 => _0x1537e9['json']());
    return _0x464f41;
}
export {
    TelegraPh,
    UploadFileUgu,
    webp2mp4File,
    floNime
};