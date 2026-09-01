import _0x0_0x228bf3 from 'axios';
import _0x0_0x5f168a from 'form-data';
import { fileTypeFromBuffer } from 'file-type';
import _0x0_0x2ca418 from 'fs';
import * as _0x0_0x53859b from 'cheerio';
function TelegraPh(_0x23b28d) {
    return new Promise(async (_0x2dc3c2, _0x5158fc) => {
        if (!_0x0_0x2ca418['existsSync'](_0x23b28d))
            return _0x5158fc(new Error('File\x20not\x20Found'));
        try {
            const _0x4beab1 = new _0x0_0x5f168a();
            _0x4beab1['append']('file', _0x0_0x2ca418['createReadStream'](_0x23b28d));
            const _0x1143a6 = await _0x0_0x228bf3({
                'url': 'https://telegra.ph/upload',
                'method': 'POST',
                'headers': { ..._0x4beab1['getHeaders']() },
                'data': _0x4beab1
            });
            return _0x2dc3c2('https://telegra.ph' + _0x1143a6['data'][0x0]['src']);
        } catch (_0x364f66) {
            return _0x5158fc(new Error(String(_0x364f66)));
        }
    });
}
async function UploadFileUgu(_0x32483d) {
    return new Promise(async (_0x33b627, _0x19e5c6) => {
        const _0x1bc34c = new _0x0_0x5f168a();
        _0x1bc34c['append']('files[]', _0x0_0x2ca418['createReadStream'](_0x32483d));
        await _0x0_0x228bf3({
            'url': 'https://uguu.se/upload.php',
            'method': 'POST',
            'headers': {
                'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/90.0.4430.212\x20Safari/537.36',
                ..._0x1bc34c['getHeaders']()
            },
            'data': _0x1bc34c
        })['then'](_0x5b2a1e => {
            _0x33b627(_0x5b2a1e['data']['files'][0x0]);
        })['catch'](_0x2feb2d => _0x19e5c6(_0x2feb2d));
    });
}
function webp2mp4File(_0x97ffe4) {
    return new Promise((_0x2576d6, _0x4762b2) => {
        const _0x4585cf = new _0x0_0x5f168a();
        _0x4585cf['append']('new-image-url', '');
        _0x4585cf['append']('new-image', _0x0_0x2ca418['createReadStream'](_0x97ffe4));
        _0x0_0x228bf3({
            'method': 'post',
            'url': 'https://s6.ezgif.com/webp-to-mp4',
            'data': _0x4585cf,
            'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x4585cf['_boundary'] }
        })['then'](({data: _0x290fe9}) => {
            const _0x441f64 = new _0x0_0x5f168a();
            const _0x57a39f = _0x0_0x53859b['load'](_0x290fe9);
            const _0x492a66 = _0x57a39f('input[name=\x22file\x22]')['attr']('value');
            _0x441f64['append']('file', _0x492a66);
            _0x441f64['append']('convert', 'Convert\x20WebP\x20to\x20MP4!');
            _0x0_0x228bf3({
                'method': 'post',
                'url': 'https://ezgif.com/webp-to-mp4/' + _0x492a66,
                'data': _0x441f64,
                'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x441f64['_boundary'] }
            })['then'](({data: _0xd209f1}) => {
                const _0x4f7879 = _0x0_0x53859b['load'](_0xd209f1);
                const _0x42b19d = 'https:' + _0x4f7879('div#output\x20>\x20p.outfile\x20>\x20video\x20>\x20source')['attr']('src');
                _0x2576d6({
                    'status': !![],
                    'message': 'Created\x20By\x20NOSTRA',
                    'result': _0x42b19d
                });
            })['catch'](_0x4762b2);
        })['catch'](_0x4762b2);
    });
}
async function floNime(_0x23bfa2, _0x4debe5 = {}) {
    const {ext: _0x4e262d} = await fileTypeFromBuffer(_0x23bfa2) || _0x4debe5['ext'];
    const _0x35f360 = new _0x0_0x5f168a();
    _0x35f360['append']('file', _0x23bfa2, 'tmp.' + _0x4e262d);
    const _0x461984 = await fetch('https://flonime.my.id/upload', {
        'method': 'POST',
        'body': _0x35f360
    })['then'](_0x265f65 => _0x265f65['json']());
    return _0x461984;
}
export {
    TelegraPh,
    UploadFileUgu,
    webp2mp4File,
    floNime
};