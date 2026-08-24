import _0x0_0x5eb541 from 'axios';
import * as _0x0_0x518902 from 'cheerio';
import _0x0_0x35d66f from 'form-data';
import _0x0_0x3b9974, { promises as _0x0_0x4ed330 } from 'fs';
import _0x0_0x52ae00 from 'child_process';
const {unlink} = _0x0_0x4ed330;
const DEFAULT_HEADERS = { 'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/95.0.4638.69\x20Safari/537.36' };
export const sleep = _0x274efb => {
    return new Promise(_0x5ea323 => setTimeout(_0x5ea323, _0x274efb));
};
export const fetchJson = async (_0x1187b9, _0x549a34 = {}) => {
    try {
        const _0x35778c = await _0x0_0x5eb541({
            'method': 'GET',
            'url': _0x1187b9,
            'headers': DEFAULT_HEADERS,
            ..._0x549a34
        });
        return _0x35778c['data'];
    } catch (_0x332482) {
        return _0x332482;
    }
};
export const fetchBuffer = async (_0x96164c, _0x3b2bff = {}) => {
    try {
        const _0x1c4497 = await _0x0_0x5eb541({
            'method': 'GET',
            'url': _0x96164c,
            'headers': {
                'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/78.0.3904.70\x20Safari/537.36',
                'DNT': '1',
                'Upgrade-Insecure-Request': '1'
            },
            ..._0x3b2bff,
            'responseType': 'arraybuffer'
        });
        return _0x1c4497['data'];
    } catch (_0x457298) {
        return _0x457298;
    }
};
export const webp2mp4File = _0x1627a6 => {
    return new Promise((_0x2463c3, _0xcc90b0) => {
        const _0x345244 = new _0x0_0x35d66f();
        _0x345244['append']('new-image-url', '');
        _0x345244['append']('new-image', _0x0_0x3b9974['createReadStream'](_0x1627a6));
        _0x0_0x5eb541({
            'method': 'post',
            'url': 'https://s6.ezgif.com/webp-to-mp4',
            'data': _0x345244,
            'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x345244['_boundary'] }
        })['then'](({data: _0x209475}) => {
            const _0x35d7f3 = new _0x0_0x35d66f();
            const _0x187b78 = _0x0_0x518902['load'](_0x209475);
            const _0x19a671 = _0x187b78('input[name=\x22file\x22]')['attr']('value');
            _0x35d7f3['append']('file', _0x19a671);
            _0x35d7f3['append']('convert', 'Convert\x20WebP\x20to\x20MP4!');
            _0x0_0x5eb541({
                'method': 'post',
                'url': 'https://ezgif.com/webp-to-mp4/' + _0x19a671,
                'data': _0x35d7f3,
                'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x35d7f3['_boundary'] }
            })['then'](({data: _0x202b89}) => {
                const _0xea20e0 = _0x0_0x518902['load'](_0x202b89);
                const _0x1b36f5 = 'https:' + _0xea20e0('div#output\x20>\x20p.outfile\x20>\x20video\x20>\x20source')['attr']('src');
                _0x2463c3({
                    'status': !![],
                    'message': 'Created\x20By\x20Eternity',
                    'result': _0x1b36f5
                });
            })['catch'](_0xcc90b0);
        })['catch'](_0xcc90b0);
    });
};
export const fetchUrl = async (_0x378d3b, _0x50731c = {}) => {
    try {
        const _0xeaf32c = await _0x0_0x5eb541({
            'method': 'GET',
            'url': _0x378d3b,
            'headers': DEFAULT_HEADERS,
            ..._0x50731c
        });
        return _0xeaf32c['data'];
    } catch (_0x5d5ea4) {
        return _0x5d5ea4;
    }
};
export const WAVersion = async () => {
    const _0x3de4fb = await fetchUrl('https://web.whatsapp.com/check-update?version=1&platform=web');
    const _0xb16718 = [_0x3de4fb['currentVersion']['replace'](/[.]/g, ',\x20')];
    return _0xb16718;
};
export const getRandom = _0x103668 => {
    return '' + Math['floor'](Math['random']() * 0x2710) + _0x103668;
};
export const isUrl = _0x202315 => {
    return _0x202315['match'](new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/, 'gi'));
};
export const isNumber = _0xef7fe => {
    const _0x8834dd = parseInt(String(_0xef7fe), 0xa);
    return typeof _0x8834dd === 'number' && !isNaN(_0x8834dd);
};
export const TelegraPh = _0x19dc55 => {
    return new Promise(async (_0x1c8839, _0x4b8767) => {
        if (!_0x0_0x3b9974['existsSync'](_0x19dc55))
            return _0x4b8767(new Error('File\x20not\x20Found'));
        try {
            const _0x49c065 = new _0x0_0x35d66f();
            _0x49c065['append']('file', _0x0_0x3b9974['createReadStream'](_0x19dc55));
            const _0x1c43b9 = await _0x0_0x5eb541({
                'url': 'https://telegra.ph/upload',
                'method': 'POST',
                'headers': { ..._0x49c065['getHeaders']() },
                'data': _0x49c065
            });
            return _0x1c8839('https://telegra.ph' + _0x1c43b9['data'][0x0]['src']);
        } catch (_0x38f6ee) {
            return _0x4b8767(new Error(String(_0x38f6ee)));
        }
    });
};
export const buffergif = async _0x48c9f8 => {
    const _0x3946ae = Math['random']()['toString'](0x24);
    const _0x1f971f = './XeonMedia/trash/' + _0x3946ae + '.gif';
    const _0xf35d4f = './XeonMedia/trash/' + _0x3946ae + '.mp4';
    _0x0_0x3b9974['writeFileSync'](_0x1f971f, _0x48c9f8);
    _0x0_0x52ae00['exec']('ffmpeg\x20-i\x20' + _0x1f971f + '\x20-movflags\x20faststart\x20-pix_fmt\x20yuv420p\x20-vf\x20\x22scale=trunc(iw/2)*2:trunc(ih/2)*2\x22\x20' + _0xf35d4f);
    await sleep(0xfa0);
    const _0x518e3a = _0x0_0x3b9974['readFileSync'](_0xf35d4f);
    await Promise['all']([
        unlink(_0xf35d4f)['catch'](() => {
        }),
        unlink(_0x1f971f)['catch'](() => {
        })
    ]);
    return _0x518e3a;
};