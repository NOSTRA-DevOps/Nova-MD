import _0x0_0x58a78d from 'axios';
import * as _0x0_0x13a93e from 'cheerio';
import _0x0_0x4ddb37 from 'form-data';
import _0x0_0x3e23b8, { promises as _0x0_0xcc3c63 } from 'fs';
import _0x0_0xed0267 from 'child_process';
const {unlink} = _0x0_0xcc3c63;
const DEFAULT_HEADERS = { 'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/95.0.4638.69\x20Safari/537.36' };
export const sleep = _0x4234e0 => {
    return new Promise(_0x33a7b0 => setTimeout(_0x33a7b0, _0x4234e0));
};
export const fetchJson = async (_0x172057, _0x38c013 = {}) => {
    try {
        const _0x19e24d = await _0x0_0x58a78d({
            'method': 'GET',
            'url': _0x172057,
            'headers': DEFAULT_HEADERS,
            ..._0x38c013
        });
        return _0x19e24d['data'];
    } catch (_0x3ee8f3) {
        return _0x3ee8f3;
    }
};
export const fetchBuffer = async (_0x48565d, _0x368230 = {}) => {
    try {
        const _0x5de783 = await _0x0_0x58a78d({
            'method': 'GET',
            'url': _0x48565d,
            'headers': {
                'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/78.0.3904.70\x20Safari/537.36',
                'DNT': '1',
                'Upgrade-Insecure-Request': '1'
            },
            ..._0x368230,
            'responseType': 'arraybuffer'
        });
        return _0x5de783['data'];
    } catch (_0xb9b76a) {
        return _0xb9b76a;
    }
};
export const webp2mp4File = _0x6d99d4 => {
    return new Promise((_0x43c7c4, _0x31917d) => {
        const _0x53b6f8 = new _0x0_0x4ddb37();
        _0x53b6f8['append']('new-image-url', '');
        _0x53b6f8['append']('new-image', _0x0_0x3e23b8['createReadStream'](_0x6d99d4));
        _0x0_0x58a78d({
            'method': 'post',
            'url': 'https://s6.ezgif.com/webp-to-mp4',
            'data': _0x53b6f8,
            'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x53b6f8['_boundary'] }
        })['then'](({data: _0x46fbb1}) => {
            const _0x2475db = new _0x0_0x4ddb37();
            const _0x1b3e72 = _0x0_0x13a93e['load'](_0x46fbb1);
            const _0x4ba52b = _0x1b3e72('input[name=\x22file\x22]')['attr']('value');
            _0x2475db['append']('file', _0x4ba52b);
            _0x2475db['append']('convert', 'Convert\x20WebP\x20to\x20MP4!');
            _0x0_0x58a78d({
                'method': 'post',
                'url': 'https://ezgif.com/webp-to-mp4/' + _0x4ba52b,
                'data': _0x2475db,
                'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x2475db['_boundary'] }
            })['then'](({data: _0xf1eb72}) => {
                const _0x2390e7 = _0x0_0x13a93e['load'](_0xf1eb72);
                const _0x25d30f = 'https:' + _0x2390e7('div#output\x20>\x20p.outfile\x20>\x20video\x20>\x20source')['attr']('src');
                _0x43c7c4({
                    'status': !![],
                    'message': 'Created\x20By\x20Eternity',
                    'result': _0x25d30f
                });
            })['catch'](_0x31917d);
        })['catch'](_0x31917d);
    });
};
export const fetchUrl = async (_0x2c466a, _0x25e299 = {}) => {
    try {
        const _0x17549b = await _0x0_0x58a78d({
            'method': 'GET',
            'url': _0x2c466a,
            'headers': DEFAULT_HEADERS,
            ..._0x25e299
        });
        return _0x17549b['data'];
    } catch (_0x4da5fc) {
        return _0x4da5fc;
    }
};
export const WAVersion = async () => {
    const _0x433a71 = await fetchUrl('https://web.whatsapp.com/check-update?version=1&platform=web');
    const _0x2d83aa = [_0x433a71['currentVersion']['replace'](/[.]/g, ',\x20')];
    return _0x2d83aa;
};
export const getRandom = _0x23b94b => {
    return '' + Math['floor'](Math['random']() * 0x2710) + _0x23b94b;
};
export const isUrl = _0x305094 => {
    return _0x305094['match'](new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/, 'gi'));
};
export const isNumber = _0x17a1f2 => {
    const _0x355f4e = parseInt(String(_0x17a1f2), 0xa);
    return typeof _0x355f4e === 'number' && !isNaN(_0x355f4e);
};
export const TelegraPh = _0x5ef3a7 => {
    return new Promise(async (_0x694dc0, _0x38497b) => {
        if (!_0x0_0x3e23b8['existsSync'](_0x5ef3a7))
            return _0x38497b(new Error('File\x20not\x20Found'));
        try {
            const _0x61470a = new _0x0_0x4ddb37();
            _0x61470a['append']('file', _0x0_0x3e23b8['createReadStream'](_0x5ef3a7));
            const _0x259f44 = await _0x0_0x58a78d({
                'url': 'https://telegra.ph/upload',
                'method': 'POST',
                'headers': { ..._0x61470a['getHeaders']() },
                'data': _0x61470a
            });
            return _0x694dc0('https://telegra.ph' + _0x259f44['data'][0x0]['src']);
        } catch (_0x146e69) {
            return _0x38497b(new Error(String(_0x146e69)));
        }
    });
};
export const buffergif = async _0x234a6c => {
    const _0x308d92 = Math['random']()['toString'](0x24);
    const _0x43b230 = './XeonMedia/trash/' + _0x308d92 + '.gif';
    const _0x2da2a5 = './XeonMedia/trash/' + _0x308d92 + '.mp4';
    _0x0_0x3e23b8['writeFileSync'](_0x43b230, _0x234a6c);
    _0x0_0xed0267['exec']('ffmpeg\x20-i\x20' + _0x43b230 + '\x20-movflags\x20faststart\x20-pix_fmt\x20yuv420p\x20-vf\x20\x22scale=trunc(iw/2)*2:trunc(ih/2)*2\x22\x20' + _0x2da2a5);
    await sleep(0xfa0);
    const _0x201d60 = _0x0_0x3e23b8['readFileSync'](_0x2da2a5);
    await Promise['all']([
        unlink(_0x2da2a5)['catch'](() => {
        }),
        unlink(_0x43b230)['catch'](() => {
        })
    ]);
    return _0x201d60;
};