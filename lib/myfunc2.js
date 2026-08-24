import _0x0_0x2903e6 from 'axios';
import * as _0x0_0x3d9daf from 'cheerio';
import _0x0_0x380c39 from 'form-data';
import _0x0_0x385170, { promises as _0x0_0xab7ec9 } from 'fs';
import _0x0_0x1c37e1 from 'child_process';
const {unlink} = _0x0_0xab7ec9;
const DEFAULT_HEADERS = { 'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/95.0.4638.69\x20Safari/537.36' };
export const sleep = _0x4ba3eb => {
    return new Promise(_0x27fc5f => setTimeout(_0x27fc5f, _0x4ba3eb));
};
export const fetchJson = async (_0x3d517d, _0x1f6cd2 = {}) => {
    try {
        const _0x18d515 = await _0x0_0x2903e6({
            'method': 'GET',
            'url': _0x3d517d,
            'headers': DEFAULT_HEADERS,
            ..._0x1f6cd2
        });
        return _0x18d515['data'];
    } catch (_0x37fc53) {
        return _0x37fc53;
    }
};
export const fetchBuffer = async (_0x4cba64, _0x2287fb = {}) => {
    try {
        const _0x18007e = await _0x0_0x2903e6({
            'method': 'GET',
            'url': _0x4cba64,
            'headers': {
                'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/78.0.3904.70\x20Safari/537.36',
                'DNT': '1',
                'Upgrade-Insecure-Request': '1'
            },
            ..._0x2287fb,
            'responseType': 'arraybuffer'
        });
        return _0x18007e['data'];
    } catch (_0x4e0123) {
        return _0x4e0123;
    }
};
export const webp2mp4File = _0xce3cff => {
    return new Promise((_0x2737bb, _0x5c2787) => {
        const _0x5bb4d1 = new _0x0_0x380c39();
        _0x5bb4d1['append']('new-image-url', '');
        _0x5bb4d1['append']('new-image', _0x0_0x385170['createReadStream'](_0xce3cff));
        _0x0_0x2903e6({
            'method': 'post',
            'url': 'https://s6.ezgif.com/webp-to-mp4',
            'data': _0x5bb4d1,
            'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x5bb4d1['_boundary'] }
        })['then'](({data: _0x4d983d}) => {
            const _0x31bea6 = new _0x0_0x380c39();
            const _0x18285f = _0x0_0x3d9daf['load'](_0x4d983d);
            const _0xcb7f39 = _0x18285f('input[name=\x22file\x22]')['attr']('value');
            _0x31bea6['append']('file', _0xcb7f39);
            _0x31bea6['append']('convert', 'Convert\x20WebP\x20to\x20MP4!');
            _0x0_0x2903e6({
                'method': 'post',
                'url': 'https://ezgif.com/webp-to-mp4/' + _0xcb7f39,
                'data': _0x31bea6,
                'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x31bea6['_boundary'] }
            })['then'](({data: _0x1176ea}) => {
                const _0xe58691 = _0x0_0x3d9daf['load'](_0x1176ea);
                const _0x2e57e9 = 'https:' + _0xe58691('div#output\x20>\x20p.outfile\x20>\x20video\x20>\x20source')['attr']('src');
                _0x2737bb({
                    'status': !![],
                    'message': 'Created\x20By\x20Eternity',
                    'result': _0x2e57e9
                });
            })['catch'](_0x5c2787);
        })['catch'](_0x5c2787);
    });
};
export const fetchUrl = async (_0x301587, _0xfaccf4 = {}) => {
    try {
        const _0x34f538 = await _0x0_0x2903e6({
            'method': 'GET',
            'url': _0x301587,
            'headers': DEFAULT_HEADERS,
            ..._0xfaccf4
        });
        return _0x34f538['data'];
    } catch (_0x547119) {
        return _0x547119;
    }
};
export const WAVersion = async () => {
    const _0x23bf8c = await fetchUrl('https://web.whatsapp.com/check-update?version=1&platform=web');
    const _0x2ce2db = [_0x23bf8c['currentVersion']['replace'](/[.]/g, ',\x20')];
    return _0x2ce2db;
};
export const getRandom = _0x18ee28 => {
    return '' + Math['floor'](Math['random']() * 0x2710) + _0x18ee28;
};
export const isUrl = _0x19d1b5 => {
    return _0x19d1b5['match'](new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/, 'gi'));
};
export const isNumber = _0x2ac5e7 => {
    const _0xaeb0a6 = parseInt(String(_0x2ac5e7), 0xa);
    return typeof _0xaeb0a6 === 'number' && !isNaN(_0xaeb0a6);
};
export const TelegraPh = _0x3c5a4a => {
    return new Promise(async (_0x1715bf, _0x38868a) => {
        if (!_0x0_0x385170['existsSync'](_0x3c5a4a))
            return _0x38868a(new Error('File\x20not\x20Found'));
        try {
            const _0x250dbb = new _0x0_0x380c39();
            _0x250dbb['append']('file', _0x0_0x385170['createReadStream'](_0x3c5a4a));
            const _0x5d4a25 = await _0x0_0x2903e6({
                'url': 'https://telegra.ph/upload',
                'method': 'POST',
                'headers': { ..._0x250dbb['getHeaders']() },
                'data': _0x250dbb
            });
            return _0x1715bf('https://telegra.ph' + _0x5d4a25['data'][0x0]['src']);
        } catch (_0x38a341) {
            return _0x38868a(new Error(String(_0x38a341)));
        }
    });
};
export const buffergif = async _0x392ff9 => {
    const _0x1b47e4 = Math['random']()['toString'](0x24);
    const _0x48d2c1 = './XeonMedia/trash/' + _0x1b47e4 + '.gif';
    const _0x5873cf = './XeonMedia/trash/' + _0x1b47e4 + '.mp4';
    _0x0_0x385170['writeFileSync'](_0x48d2c1, _0x392ff9);
    _0x0_0x1c37e1['exec']('ffmpeg\x20-i\x20' + _0x48d2c1 + '\x20-movflags\x20faststart\x20-pix_fmt\x20yuv420p\x20-vf\x20\x22scale=trunc(iw/2)*2:trunc(ih/2)*2\x22\x20' + _0x5873cf);
    await sleep(0xfa0);
    const _0x4cc1b9 = _0x0_0x385170['readFileSync'](_0x5873cf);
    await Promise['all']([
        unlink(_0x5873cf)['catch'](() => {
        }),
        unlink(_0x48d2c1)['catch'](() => {
        })
    ]);
    return _0x4cc1b9;
};