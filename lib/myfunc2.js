import _0x0_0x4955ca from 'axios';
import * as _0x0_0x565461 from 'cheerio';
import _0x0_0x63383f from 'form-data';
import _0x0_0x3806d3, { promises as _0x0_0x173926 } from 'fs';
import _0x0_0x1afa7f from 'child_process';
const {unlink} = _0x0_0x173926;
const DEFAULT_HEADERS = { 'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/95.0.4638.69\x20Safari/537.36' };
export const sleep = _0x3a2ce7 => {
    return new Promise(_0x1442b1 => setTimeout(_0x1442b1, _0x3a2ce7));
};
export const fetchJson = async (_0x40ea7b, _0x49157e = {}) => {
    try {
        const _0x667d44 = await _0x0_0x4955ca({
            'method': 'GET',
            'url': _0x40ea7b,
            'headers': DEFAULT_HEADERS,
            ..._0x49157e
        });
        return _0x667d44['data'];
    } catch (_0x257c6f) {
        return _0x257c6f;
    }
};
export const fetchBuffer = async (_0x1b8236, _0x2a8878 = {}) => {
    try {
        const _0x1c8f98 = await _0x0_0x4955ca({
            'method': 'GET',
            'url': _0x1b8236,
            'headers': {
                'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/78.0.3904.70\x20Safari/537.36',
                'DNT': '1',
                'Upgrade-Insecure-Request': '1'
            },
            ..._0x2a8878,
            'responseType': 'arraybuffer'
        });
        return _0x1c8f98['data'];
    } catch (_0x10767d) {
        return _0x10767d;
    }
};
export const webp2mp4File = _0x564d11 => {
    return new Promise((_0x20b996, _0x3a6534) => {
        const _0x4e961f = new _0x0_0x63383f();
        _0x4e961f['append']('new-image-url', '');
        _0x4e961f['append']('new-image', _0x0_0x3806d3['createReadStream'](_0x564d11));
        _0x0_0x4955ca({
            'method': 'post',
            'url': 'https://s6.ezgif.com/webp-to-mp4',
            'data': _0x4e961f,
            'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x4e961f['_boundary'] }
        })['then'](({data: _0x4cffef}) => {
            const _0x2afde2 = new _0x0_0x63383f();
            const _0x2a9dc2 = _0x0_0x565461['load'](_0x4cffef);
            const _0x5012c2 = _0x2a9dc2('input[name=\x22file\x22]')['attr']('value');
            _0x2afde2['append']('file', _0x5012c2);
            _0x2afde2['append']('convert', 'Convert\x20WebP\x20to\x20MP4!');
            _0x0_0x4955ca({
                'method': 'post',
                'url': 'https://ezgif.com/webp-to-mp4/' + _0x5012c2,
                'data': _0x2afde2,
                'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x2afde2['_boundary'] }
            })['then'](({data: _0x322532}) => {
                const _0xfb3a23 = _0x0_0x565461['load'](_0x322532);
                const _0x506898 = 'https:' + _0xfb3a23('div#output\x20>\x20p.outfile\x20>\x20video\x20>\x20source')['attr']('src');
                _0x20b996({
                    'status': !![],
                    'message': 'Created\x20By\x20Eternity',
                    'result': _0x506898
                });
            })['catch'](_0x3a6534);
        })['catch'](_0x3a6534);
    });
};
export const fetchUrl = async (_0x26d270, _0x4deee7 = {}) => {
    try {
        const _0x2a860e = await _0x0_0x4955ca({
            'method': 'GET',
            'url': _0x26d270,
            'headers': DEFAULT_HEADERS,
            ..._0x4deee7
        });
        return _0x2a860e['data'];
    } catch (_0x418d74) {
        return _0x418d74;
    }
};
export const WAVersion = async () => {
    const _0x32d44b = await fetchUrl('https://web.whatsapp.com/check-update?version=1&platform=web');
    const _0x425367 = [_0x32d44b['currentVersion']['replace'](/[.]/g, ',\x20')];
    return _0x425367;
};
export const getRandom = _0x426e6a => {
    return '' + Math['floor'](Math['random']() * 0x2710) + _0x426e6a;
};
export const isUrl = _0x492409 => {
    return _0x492409['match'](new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/, 'gi'));
};
export const isNumber = _0x26e232 => {
    const _0x201d68 = parseInt(String(_0x26e232), 0xa);
    return typeof _0x201d68 === 'number' && !isNaN(_0x201d68);
};
export const TelegraPh = _0x52b8d3 => {
    return new Promise(async (_0x5d2b3c, _0x3804a1) => {
        if (!_0x0_0x3806d3['existsSync'](_0x52b8d3))
            return _0x3804a1(new Error('File\x20not\x20Found'));
        try {
            const _0x42e2c7 = new _0x0_0x63383f();
            _0x42e2c7['append']('file', _0x0_0x3806d3['createReadStream'](_0x52b8d3));
            const _0x38bdf7 = await _0x0_0x4955ca({
                'url': 'https://telegra.ph/upload',
                'method': 'POST',
                'headers': { ..._0x42e2c7['getHeaders']() },
                'data': _0x42e2c7
            });
            return _0x5d2b3c('https://telegra.ph' + _0x38bdf7['data'][0x0]['src']);
        } catch (_0x5e594f) {
            return _0x3804a1(new Error(String(_0x5e594f)));
        }
    });
};
export const buffergif = async _0x1bc935 => {
    const _0x223f7b = Math['random']()['toString'](0x24);
    const _0x4fda73 = './XeonMedia/trash/' + _0x223f7b + '.gif';
    const _0x1463d3 = './XeonMedia/trash/' + _0x223f7b + '.mp4';
    _0x0_0x3806d3['writeFileSync'](_0x4fda73, _0x1bc935);
    _0x0_0x1afa7f['exec']('ffmpeg\x20-i\x20' + _0x4fda73 + '\x20-movflags\x20faststart\x20-pix_fmt\x20yuv420p\x20-vf\x20\x22scale=trunc(iw/2)*2:trunc(ih/2)*2\x22\x20' + _0x1463d3);
    await sleep(0xfa0);
    const _0x2e6252 = _0x0_0x3806d3['readFileSync'](_0x1463d3);
    await Promise['all']([
        unlink(_0x1463d3)['catch'](() => {
        }),
        unlink(_0x4fda73)['catch'](() => {
        })
    ]);
    return _0x2e6252;
};