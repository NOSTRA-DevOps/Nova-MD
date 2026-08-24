import _0x0_0x36f64f from 'axios';
import * as _0x0_0x34112e from 'cheerio';
import _0x0_0x28d6fc from 'form-data';
import _0x0_0x45da67, { promises as _0x0_0x531ee4 } from 'fs';
import _0x0_0x107975 from 'child_process';
const {unlink} = _0x0_0x531ee4;
const DEFAULT_HEADERS = { 'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/95.0.4638.69\x20Safari/537.36' };
export const sleep = _0x3ff22f => {
    return new Promise(_0x23ce67 => setTimeout(_0x23ce67, _0x3ff22f));
};
export const fetchJson = async (_0x4c01bf, _0x3754e7 = {}) => {
    try {
        const _0x100344 = await _0x0_0x36f64f({
            'method': 'GET',
            'url': _0x4c01bf,
            'headers': DEFAULT_HEADERS,
            ..._0x3754e7
        });
        return _0x100344['data'];
    } catch (_0x35ab3d) {
        return _0x35ab3d;
    }
};
export const fetchBuffer = async (_0x5c9cb9, _0x27b3cd = {}) => {
    try {
        const _0x4c6597 = await _0x0_0x36f64f({
            'method': 'GET',
            'url': _0x5c9cb9,
            'headers': {
                'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/78.0.3904.70\x20Safari/537.36',
                'DNT': '1',
                'Upgrade-Insecure-Request': '1'
            },
            ..._0x27b3cd,
            'responseType': 'arraybuffer'
        });
        return _0x4c6597['data'];
    } catch (_0x4780c6) {
        return _0x4780c6;
    }
};
export const webp2mp4File = _0x14930c => {
    return new Promise((_0x3bb076, _0x177c24) => {
        const _0x40bbed = new _0x0_0x28d6fc();
        _0x40bbed['append']('new-image-url', '');
        _0x40bbed['append']('new-image', _0x0_0x45da67['createReadStream'](_0x14930c));
        _0x0_0x36f64f({
            'method': 'post',
            'url': 'https://s6.ezgif.com/webp-to-mp4',
            'data': _0x40bbed,
            'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x40bbed['_boundary'] }
        })['then'](({data: _0x32f4fa}) => {
            const _0x1fa078 = new _0x0_0x28d6fc();
            const _0xebef01 = _0x0_0x34112e['load'](_0x32f4fa);
            const _0x1d667b = _0xebef01('input[name=\x22file\x22]')['attr']('value');
            _0x1fa078['append']('file', _0x1d667b);
            _0x1fa078['append']('convert', 'Convert\x20WebP\x20to\x20MP4!');
            _0x0_0x36f64f({
                'method': 'post',
                'url': 'https://ezgif.com/webp-to-mp4/' + _0x1d667b,
                'data': _0x1fa078,
                'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x1fa078['_boundary'] }
            })['then'](({data: _0x4a236f}) => {
                const _0x2408ec = _0x0_0x34112e['load'](_0x4a236f);
                const _0x160d89 = 'https:' + _0x2408ec('div#output\x20>\x20p.outfile\x20>\x20video\x20>\x20source')['attr']('src');
                _0x3bb076({
                    'status': !![],
                    'message': 'Created\x20By\x20Eternity',
                    'result': _0x160d89
                });
            })['catch'](_0x177c24);
        })['catch'](_0x177c24);
    });
};
export const fetchUrl = async (_0x50010b, _0x56b0b0 = {}) => {
    try {
        const _0x49ede6 = await _0x0_0x36f64f({
            'method': 'GET',
            'url': _0x50010b,
            'headers': DEFAULT_HEADERS,
            ..._0x56b0b0
        });
        return _0x49ede6['data'];
    } catch (_0x39a5b3) {
        return _0x39a5b3;
    }
};
export const WAVersion = async () => {
    const _0x382f35 = await fetchUrl('https://web.whatsapp.com/check-update?version=1&platform=web');
    const _0x419928 = [_0x382f35['currentVersion']['replace'](/[.]/g, ',\x20')];
    return _0x419928;
};
export const getRandom = _0x30f84e => {
    return '' + Math['floor'](Math['random']() * 0x2710) + _0x30f84e;
};
export const isUrl = _0x44d0f0 => {
    return _0x44d0f0['match'](new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/, 'gi'));
};
export const isNumber = _0x419591 => {
    const _0x38b34f = parseInt(String(_0x419591), 0xa);
    return typeof _0x38b34f === 'number' && !isNaN(_0x38b34f);
};
export const TelegraPh = _0x34283a => {
    return new Promise(async (_0x271ed1, _0x5dbfea) => {
        if (!_0x0_0x45da67['existsSync'](_0x34283a))
            return _0x5dbfea(new Error('File\x20not\x20Found'));
        try {
            const _0x146887 = new _0x0_0x28d6fc();
            _0x146887['append']('file', _0x0_0x45da67['createReadStream'](_0x34283a));
            const _0x8a7217 = await _0x0_0x36f64f({
                'url': 'https://telegra.ph/upload',
                'method': 'POST',
                'headers': { ..._0x146887['getHeaders']() },
                'data': _0x146887
            });
            return _0x271ed1('https://telegra.ph' + _0x8a7217['data'][0x0]['src']);
        } catch (_0x2eab78) {
            return _0x5dbfea(new Error(String(_0x2eab78)));
        }
    });
};
export const buffergif = async _0x357192 => {
    const _0x1a7faf = Math['random']()['toString'](0x24);
    const _0x221bf6 = './XeonMedia/trash/' + _0x1a7faf + '.gif';
    const _0x173e2b = './XeonMedia/trash/' + _0x1a7faf + '.mp4';
    _0x0_0x45da67['writeFileSync'](_0x221bf6, _0x357192);
    _0x0_0x107975['exec']('ffmpeg\x20-i\x20' + _0x221bf6 + '\x20-movflags\x20faststart\x20-pix_fmt\x20yuv420p\x20-vf\x20\x22scale=trunc(iw/2)*2:trunc(ih/2)*2\x22\x20' + _0x173e2b);
    await sleep(0xfa0);
    const _0xf70400 = _0x0_0x45da67['readFileSync'](_0x173e2b);
    await Promise['all']([
        unlink(_0x173e2b)['catch'](() => {
        }),
        unlink(_0x221bf6)['catch'](() => {
        })
    ]);
    return _0xf70400;
};