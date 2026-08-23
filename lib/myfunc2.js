import _0x0_0x3352ae from 'axios';
import * as _0x0_0x415c98 from 'cheerio';
import _0x0_0xc31b23 from 'form-data';
import _0x0_0x4187e6, { promises as _0x0_0x34a8b5 } from 'fs';
import _0x0_0x130e59 from 'child_process';
const {unlink} = _0x0_0x34a8b5;
const DEFAULT_HEADERS = { 'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/95.0.4638.69\x20Safari/537.36' };
export const sleep = _0x11f21e => {
    return new Promise(_0x531921 => setTimeout(_0x531921, _0x11f21e));
};
export const fetchJson = async (_0x35e11b, _0x1e5085 = {}) => {
    try {
        const _0x5525a8 = await _0x0_0x3352ae({
            'method': 'GET',
            'url': _0x35e11b,
            'headers': DEFAULT_HEADERS,
            ..._0x1e5085
        });
        return _0x5525a8['data'];
    } catch (_0x510357) {
        return _0x510357;
    }
};
export const fetchBuffer = async (_0x2b10f8, _0x24cdff = {}) => {
    try {
        const _0x388584 = await _0x0_0x3352ae({
            'method': 'GET',
            'url': _0x2b10f8,
            'headers': {
                'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/78.0.3904.70\x20Safari/537.36',
                'DNT': '1',
                'Upgrade-Insecure-Request': '1'
            },
            ..._0x24cdff,
            'responseType': 'arraybuffer'
        });
        return _0x388584['data'];
    } catch (_0x50658f) {
        return _0x50658f;
    }
};
export const webp2mp4File = _0x5ef3a4 => {
    return new Promise((_0x5cc0f5, _0xcf087a) => {
        const _0x2a35d9 = new _0x0_0xc31b23();
        _0x2a35d9['append']('new-image-url', '');
        _0x2a35d9['append']('new-image', _0x0_0x4187e6['createReadStream'](_0x5ef3a4));
        _0x0_0x3352ae({
            'method': 'post',
            'url': 'https://s6.ezgif.com/webp-to-mp4',
            'data': _0x2a35d9,
            'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x2a35d9['_boundary'] }
        })['then'](({data: _0x1d3ecf}) => {
            const _0x17f6e6 = new _0x0_0xc31b23();
            const _0x194187 = _0x0_0x415c98['load'](_0x1d3ecf);
            const _0x39900d = _0x194187('input[name=\x22file\x22]')['attr']('value');
            _0x17f6e6['append']('file', _0x39900d);
            _0x17f6e6['append']('convert', 'Convert\x20WebP\x20to\x20MP4!');
            _0x0_0x3352ae({
                'method': 'post',
                'url': 'https://ezgif.com/webp-to-mp4/' + _0x39900d,
                'data': _0x17f6e6,
                'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x17f6e6['_boundary'] }
            })['then'](({data: _0x27adf9}) => {
                const _0x40391b = _0x0_0x415c98['load'](_0x27adf9);
                const _0x16fdc7 = 'https:' + _0x40391b('div#output\x20>\x20p.outfile\x20>\x20video\x20>\x20source')['attr']('src');
                _0x5cc0f5({
                    'status': !![],
                    'message': 'Created\x20By\x20Eternity',
                    'result': _0x16fdc7
                });
            })['catch'](_0xcf087a);
        })['catch'](_0xcf087a);
    });
};
export const fetchUrl = async (_0x3fe1e6, _0x5c29d0 = {}) => {
    try {
        const _0x2e8ce9 = await _0x0_0x3352ae({
            'method': 'GET',
            'url': _0x3fe1e6,
            'headers': DEFAULT_HEADERS,
            ..._0x5c29d0
        });
        return _0x2e8ce9['data'];
    } catch (_0xbb6965) {
        return _0xbb6965;
    }
};
export const WAVersion = async () => {
    const _0x16a125 = await fetchUrl('https://web.whatsapp.com/check-update?version=1&platform=web');
    const _0x4f1cfb = [_0x16a125['currentVersion']['replace'](/[.]/g, ',\x20')];
    return _0x4f1cfb;
};
export const getRandom = _0x32b86d => {
    return '' + Math['floor'](Math['random']() * 0x2710) + _0x32b86d;
};
export const isUrl = _0x46e8f7 => {
    return _0x46e8f7['match'](new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/, 'gi'));
};
export const isNumber = _0x16cc66 => {
    const _0x4ac966 = parseInt(String(_0x16cc66), 0xa);
    return typeof _0x4ac966 === 'number' && !isNaN(_0x4ac966);
};
export const TelegraPh = _0x15d880 => {
    return new Promise(async (_0x15dabc, _0x373c43) => {
        if (!_0x0_0x4187e6['existsSync'](_0x15d880))
            return _0x373c43(new Error('File\x20not\x20Found'));
        try {
            const _0x3ef0d3 = new _0x0_0xc31b23();
            _0x3ef0d3['append']('file', _0x0_0x4187e6['createReadStream'](_0x15d880));
            const _0xa8126c = await _0x0_0x3352ae({
                'url': 'https://telegra.ph/upload',
                'method': 'POST',
                'headers': { ..._0x3ef0d3['getHeaders']() },
                'data': _0x3ef0d3
            });
            return _0x15dabc('https://telegra.ph' + _0xa8126c['data'][0x0]['src']);
        } catch (_0x4c4f51) {
            return _0x373c43(new Error(String(_0x4c4f51)));
        }
    });
};
export const buffergif = async _0x5ceff8 => {
    const _0x17488a = Math['random']()['toString'](0x24);
    const _0x46f2da = './XeonMedia/trash/' + _0x17488a + '.gif';
    const _0x38f69d = './XeonMedia/trash/' + _0x17488a + '.mp4';
    _0x0_0x4187e6['writeFileSync'](_0x46f2da, _0x5ceff8);
    _0x0_0x130e59['exec']('ffmpeg\x20-i\x20' + _0x46f2da + '\x20-movflags\x20faststart\x20-pix_fmt\x20yuv420p\x20-vf\x20\x22scale=trunc(iw/2)*2:trunc(ih/2)*2\x22\x20' + _0x38f69d);
    await sleep(0xfa0);
    const _0x5e14c3 = _0x0_0x4187e6['readFileSync'](_0x38f69d);
    await Promise['all']([
        unlink(_0x38f69d)['catch'](() => {
        }),
        unlink(_0x46f2da)['catch'](() => {
        })
    ]);
    return _0x5e14c3;
};