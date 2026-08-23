import _0x0_0x244081 from 'axios';
import _0x0_0x4a59f7 from 'form-data';
import { fileTypeFromBuffer } from 'file-type';
import _0x0_0x3a744f from 'fs';
import * as _0x0_0x110dee from 'cheerio';
function TelegraPh(_0x157d6c) {
    return new Promise(async (_0x4c49e4, _0xaee259) => {
        if (!_0x0_0x3a744f['existsSync'](_0x157d6c))
            return _0xaee259(new Error('File\x20not\x20Found'));
        try {
            const _0x1191e5 = new _0x0_0x4a59f7();
            _0x1191e5['append']('file', _0x0_0x3a744f['createReadStream'](_0x157d6c));
            const _0x283ffb = await _0x0_0x244081({
                'url': 'https://telegra.ph/upload',
                'method': 'POST',
                'headers': { ..._0x1191e5['getHeaders']() },
                'data': _0x1191e5
            });
            return _0x4c49e4('https://telegra.ph' + _0x283ffb['data'][0x0]['src']);
        } catch (_0x242bbb) {
            return _0xaee259(new Error(String(_0x242bbb)));
        }
    });
}
async function UploadFileUgu(_0xf5c368) {
    return new Promise(async (_0x56e5d9, _0x14c82d) => {
        const _0x1d8f07 = new _0x0_0x4a59f7();
        _0x1d8f07['append']('files[]', _0x0_0x3a744f['createReadStream'](_0xf5c368));
        await _0x0_0x244081({
            'url': 'https://uguu.se/upload.php',
            'method': 'POST',
            'headers': {
                'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/90.0.4430.212\x20Safari/537.36',
                ..._0x1d8f07['getHeaders']()
            },
            'data': _0x1d8f07
        })['then'](_0x5abc97 => {
            _0x56e5d9(_0x5abc97['data']['files'][0x0]);
        })['catch'](_0x58c792 => _0x14c82d(_0x58c792));
    });
}
function webp2mp4File(_0x4f9349) {
    return new Promise((_0x92d320, _0x335e27) => {
        const _0x285a61 = new _0x0_0x4a59f7();
        _0x285a61['append']('new-image-url', '');
        _0x285a61['append']('new-image', _0x0_0x3a744f['createReadStream'](_0x4f9349));
        _0x0_0x244081({
            'method': 'post',
            'url': 'https://s6.ezgif.com/webp-to-mp4',
            'data': _0x285a61,
            'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x285a61['_boundary'] }
        })['then'](({data: _0x3983bc}) => {
            const _0x39f2a1 = new _0x0_0x4a59f7();
            const _0x301392 = _0x0_0x110dee['load'](_0x3983bc);
            const _0x261611 = _0x301392('input[name=\x22file\x22]')['attr']('value');
            _0x39f2a1['append']('file', _0x261611);
            _0x39f2a1['append']('convert', 'Convert\x20WebP\x20to\x20MP4!');
            _0x0_0x244081({
                'method': 'post',
                'url': 'https://ezgif.com/webp-to-mp4/' + _0x261611,
                'data': _0x39f2a1,
                'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x39f2a1['_boundary'] }
            })['then'](({data: _0x11d8b3}) => {
                const _0xef63cb = _0x0_0x110dee['load'](_0x11d8b3);
                const _0x3e19fe = 'https:' + _0xef63cb('div#output\x20>\x20p.outfile\x20>\x20video\x20>\x20source')['attr']('src');
                _0x92d320({
                    'status': !![],
                    'message': 'Created\x20By\x20NOSTRA',
                    'result': _0x3e19fe
                });
            })['catch'](_0x335e27);
        })['catch'](_0x335e27);
    });
}
async function floNime(_0x2e0c8c, _0x1450a4 = {}) {
    const {ext: _0xf9b8d0} = await fileTypeFromBuffer(_0x2e0c8c) || _0x1450a4['ext'];
    const _0xd02b23 = new _0x0_0x4a59f7();
    _0xd02b23['append']('file', _0x2e0c8c, 'tmp.' + _0xf9b8d0);
    const _0x1bd62c = await fetch('https://flonime.my.id/upload', {
        'method': 'POST',
        'body': _0xd02b23
    })['then'](_0x100a30 => _0x100a30['json']());
    return _0x1bd62c;
}
export {
    TelegraPh,
    UploadFileUgu,
    webp2mp4File,
    floNime
};