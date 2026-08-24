import _0x0_0x5e7394 from 'axios';
import _0x0_0x17c6e0 from 'form-data';
import { fileTypeFromBuffer } from 'file-type';
import _0x0_0x27a722 from 'fs';
import * as _0x0_0x66c70a from 'cheerio';
function TelegraPh(_0xec743f) {
    return new Promise(async (_0x3f1e50, _0x142771) => {
        if (!_0x0_0x27a722['existsSync'](_0xec743f))
            return _0x142771(new Error('File\x20not\x20Found'));
        try {
            const _0x32418d = new _0x0_0x17c6e0();
            _0x32418d['append']('file', _0x0_0x27a722['createReadStream'](_0xec743f));
            const _0x2bbc3a = await _0x0_0x5e7394({
                'url': 'https://telegra.ph/upload',
                'method': 'POST',
                'headers': { ..._0x32418d['getHeaders']() },
                'data': _0x32418d
            });
            return _0x3f1e50('https://telegra.ph' + _0x2bbc3a['data'][0x0]['src']);
        } catch (_0x3eff8a) {
            return _0x142771(new Error(String(_0x3eff8a)));
        }
    });
}
async function UploadFileUgu(_0x45f0f5) {
    return new Promise(async (_0x4b60ab, _0x3761dc) => {
        const _0x4c4e93 = new _0x0_0x17c6e0();
        _0x4c4e93['append']('files[]', _0x0_0x27a722['createReadStream'](_0x45f0f5));
        await _0x0_0x5e7394({
            'url': 'https://uguu.se/upload.php',
            'method': 'POST',
            'headers': {
                'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/90.0.4430.212\x20Safari/537.36',
                ..._0x4c4e93['getHeaders']()
            },
            'data': _0x4c4e93
        })['then'](_0x4b55bb => {
            _0x4b60ab(_0x4b55bb['data']['files'][0x0]);
        })['catch'](_0x39babc => _0x3761dc(_0x39babc));
    });
}
function webp2mp4File(_0x176e9f) {
    return new Promise((_0xf1824e, _0x385842) => {
        const _0x22e4eb = new _0x0_0x17c6e0();
        _0x22e4eb['append']('new-image-url', '');
        _0x22e4eb['append']('new-image', _0x0_0x27a722['createReadStream'](_0x176e9f));
        _0x0_0x5e7394({
            'method': 'post',
            'url': 'https://s6.ezgif.com/webp-to-mp4',
            'data': _0x22e4eb,
            'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x22e4eb['_boundary'] }
        })['then'](({data: _0x1887ab}) => {
            const _0x1c661b = new _0x0_0x17c6e0();
            const _0x1a3bb8 = _0x0_0x66c70a['load'](_0x1887ab);
            const _0x478ba2 = _0x1a3bb8('input[name=\x22file\x22]')['attr']('value');
            _0x1c661b['append']('file', _0x478ba2);
            _0x1c661b['append']('convert', 'Convert\x20WebP\x20to\x20MP4!');
            _0x0_0x5e7394({
                'method': 'post',
                'url': 'https://ezgif.com/webp-to-mp4/' + _0x478ba2,
                'data': _0x1c661b,
                'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x1c661b['_boundary'] }
            })['then'](({data: _0x8843b6}) => {
                const _0x5bc536 = _0x0_0x66c70a['load'](_0x8843b6);
                const _0x51258c = 'https:' + _0x5bc536('div#output\x20>\x20p.outfile\x20>\x20video\x20>\x20source')['attr']('src');
                _0xf1824e({
                    'status': !![],
                    'message': 'Created\x20By\x20NOSTRA',
                    'result': _0x51258c
                });
            })['catch'](_0x385842);
        })['catch'](_0x385842);
    });
}
async function floNime(_0x113e70, _0x33be0b = {}) {
    const {ext: _0x37e6e4} = await fileTypeFromBuffer(_0x113e70) || _0x33be0b['ext'];
    const _0x160ef9 = new _0x0_0x17c6e0();
    _0x160ef9['append']('file', _0x113e70, 'tmp.' + _0x37e6e4);
    const _0x5a091e = await fetch('https://flonime.my.id/upload', {
        'method': 'POST',
        'body': _0x160ef9
    })['then'](_0x48d5ec => _0x48d5ec['json']());
    return _0x5a091e;
}
export {
    TelegraPh,
    UploadFileUgu,
    webp2mp4File,
    floNime
};