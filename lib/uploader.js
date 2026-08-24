import _0x0_0xe54862 from 'axios';
import _0x0_0x301392 from 'form-data';
import { fileTypeFromBuffer } from 'file-type';
import _0x0_0x5eec57 from 'fs';
import * as _0x0_0x320249 from 'cheerio';
function TelegraPh(_0x44ad62) {
    return new Promise(async (_0x2ad250, _0x15f2b4) => {
        if (!_0x0_0x5eec57['existsSync'](_0x44ad62))
            return _0x15f2b4(new Error('File\x20not\x20Found'));
        try {
            const _0x40960c = new _0x0_0x301392();
            _0x40960c['append']('file', _0x0_0x5eec57['createReadStream'](_0x44ad62));
            const _0x4e40d7 = await _0x0_0xe54862({
                'url': 'https://telegra.ph/upload',
                'method': 'POST',
                'headers': { ..._0x40960c['getHeaders']() },
                'data': _0x40960c
            });
            return _0x2ad250('https://telegra.ph' + _0x4e40d7['data'][0x0]['src']);
        } catch (_0x2b8786) {
            return _0x15f2b4(new Error(String(_0x2b8786)));
        }
    });
}
async function UploadFileUgu(_0x13e5c7) {
    return new Promise(async (_0x5896c7, _0x1975a0) => {
        const _0x1fec73 = new _0x0_0x301392();
        _0x1fec73['append']('files[]', _0x0_0x5eec57['createReadStream'](_0x13e5c7));
        await _0x0_0xe54862({
            'url': 'https://uguu.se/upload.php',
            'method': 'POST',
            'headers': {
                'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/90.0.4430.212\x20Safari/537.36',
                ..._0x1fec73['getHeaders']()
            },
            'data': _0x1fec73
        })['then'](_0x502ea3 => {
            _0x5896c7(_0x502ea3['data']['files'][0x0]);
        })['catch'](_0x2dddfd => _0x1975a0(_0x2dddfd));
    });
}
function webp2mp4File(_0x10036f) {
    return new Promise((_0x1673fa, _0x39f62f) => {
        const _0x47006b = new _0x0_0x301392();
        _0x47006b['append']('new-image-url', '');
        _0x47006b['append']('new-image', _0x0_0x5eec57['createReadStream'](_0x10036f));
        _0x0_0xe54862({
            'method': 'post',
            'url': 'https://s6.ezgif.com/webp-to-mp4',
            'data': _0x47006b,
            'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x47006b['_boundary'] }
        })['then'](({data: _0x2a3d0a}) => {
            const _0x372fee = new _0x0_0x301392();
            const _0x4e1ef5 = _0x0_0x320249['load'](_0x2a3d0a);
            const _0x40d91a = _0x4e1ef5('input[name=\x22file\x22]')['attr']('value');
            _0x372fee['append']('file', _0x40d91a);
            _0x372fee['append']('convert', 'Convert\x20WebP\x20to\x20MP4!');
            _0x0_0xe54862({
                'method': 'post',
                'url': 'https://ezgif.com/webp-to-mp4/' + _0x40d91a,
                'data': _0x372fee,
                'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x372fee['_boundary'] }
            })['then'](({data: _0x2acf78}) => {
                const _0x2adb9b = _0x0_0x320249['load'](_0x2acf78);
                const _0x359bd9 = 'https:' + _0x2adb9b('div#output\x20>\x20p.outfile\x20>\x20video\x20>\x20source')['attr']('src');
                _0x1673fa({
                    'status': !![],
                    'message': 'Created\x20By\x20NOSTRA',
                    'result': _0x359bd9
                });
            })['catch'](_0x39f62f);
        })['catch'](_0x39f62f);
    });
}
async function floNime(_0x2bf8c5, _0x1e1f9e = {}) {
    const {ext: _0x47377b} = await fileTypeFromBuffer(_0x2bf8c5) || _0x1e1f9e['ext'];
    const _0x2b2f89 = new _0x0_0x301392();
    _0x2b2f89['append']('file', _0x2bf8c5, 'tmp.' + _0x47377b);
    const _0x488c8 = await fetch('https://flonime.my.id/upload', {
        'method': 'POST',
        'body': _0x2b2f89
    })['then'](_0xf7953e => _0xf7953e['json']());
    return _0x488c8;
}
export {
    TelegraPh,
    UploadFileUgu,
    webp2mp4File,
    floNime
};