import _0x0_0x18e661 from 'axios';
import * as _0x0_0x2ceb2b from 'cheerio';
import _0x0_0x1d52cb from 'form-data';
import _0x0_0x40867a, { promises as _0x0_0x3a49e9 } from 'fs';
import _0x0_0x570074 from 'child_process';
const {unlink} = _0x0_0x3a49e9;
const DEFAULT_HEADERS = { 'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/95.0.4638.69\x20Safari/537.36' };
export const sleep = _0x3cc7c4 => {
    return new Promise(_0x5d5392 => setTimeout(_0x5d5392, _0x3cc7c4));
};
export const fetchJson = async (_0x241f27, _0x32da92 = {}) => {
    try {
        const _0x2f75c4 = await _0x0_0x18e661({
            'method': 'GET',
            'url': _0x241f27,
            'headers': DEFAULT_HEADERS,
            ..._0x32da92
        });
        return _0x2f75c4['data'];
    } catch (_0x32d713) {
        return _0x32d713;
    }
};
export const fetchBuffer = async (_0x79b00, _0x385bc2 = {}) => {
    try {
        const _0x489f48 = await _0x0_0x18e661({
            'method': 'GET',
            'url': _0x79b00,
            'headers': {
                'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/78.0.3904.70\x20Safari/537.36',
                'DNT': '1',
                'Upgrade-Insecure-Request': '1'
            },
            ..._0x385bc2,
            'responseType': 'arraybuffer'
        });
        return _0x489f48['data'];
    } catch (_0x389a87) {
        return _0x389a87;
    }
};
export const webp2mp4File = _0x309d9c => {
    return new Promise((_0x254708, _0x523cad) => {
        const _0x54243d = new _0x0_0x1d52cb();
        _0x54243d['append']('new-image-url', '');
        _0x54243d['append']('new-image', _0x0_0x40867a['createReadStream'](_0x309d9c));
        _0x0_0x18e661({
            'method': 'post',
            'url': 'https://s6.ezgif.com/webp-to-mp4',
            'data': _0x54243d,
            'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x54243d['_boundary'] }
        })['then'](({data: _0x20060b}) => {
            const _0xf30c5c = new _0x0_0x1d52cb();
            const _0xc3f47d = _0x0_0x2ceb2b['load'](_0x20060b);
            const _0x1c2220 = _0xc3f47d('input[name=\x22file\x22]')['attr']('value');
            _0xf30c5c['append']('file', _0x1c2220);
            _0xf30c5c['append']('convert', 'Convert\x20WebP\x20to\x20MP4!');
            _0x0_0x18e661({
                'method': 'post',
                'url': 'https://ezgif.com/webp-to-mp4/' + _0x1c2220,
                'data': _0xf30c5c,
                'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0xf30c5c['_boundary'] }
            })['then'](({data: _0x398fac}) => {
                const _0x513ec1 = _0x0_0x2ceb2b['load'](_0x398fac);
                const _0x39b42b = 'https:' + _0x513ec1('div#output\x20>\x20p.outfile\x20>\x20video\x20>\x20source')['attr']('src');
                _0x254708({
                    'status': !![],
                    'message': 'Created\x20By\x20Eternity',
                    'result': _0x39b42b
                });
            })['catch'](_0x523cad);
        })['catch'](_0x523cad);
    });
};
export const fetchUrl = async (_0x361b31, _0x2a7b5f = {}) => {
    try {
        const _0x5d0206 = await _0x0_0x18e661({
            'method': 'GET',
            'url': _0x361b31,
            'headers': DEFAULT_HEADERS,
            ..._0x2a7b5f
        });
        return _0x5d0206['data'];
    } catch (_0x303ce6) {
        return _0x303ce6;
    }
};
export const WAVersion = async () => {
    const _0x450c7c = await fetchUrl('https://web.whatsapp.com/check-update?version=1&platform=web');
    const _0x3eb8a2 = [_0x450c7c['currentVersion']['replace'](/[.]/g, ',\x20')];
    return _0x3eb8a2;
};
export const getRandom = _0x12c846 => {
    return '' + Math['floor'](Math['random']() * 0x2710) + _0x12c846;
};
export const isUrl = _0x1c4c5f => {
    return _0x1c4c5f['match'](new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/, 'gi'));
};
export const isNumber = _0x45bcd4 => {
    const _0x44fac5 = parseInt(String(_0x45bcd4), 0xa);
    return typeof _0x44fac5 === 'number' && !isNaN(_0x44fac5);
};
export const TelegraPh = _0x4026e5 => {
    return new Promise(async (_0x14c5eb, _0x5cdf7c) => {
        if (!_0x0_0x40867a['existsSync'](_0x4026e5))
            return _0x5cdf7c(new Error('File\x20not\x20Found'));
        try {
            const _0x8228fc = new _0x0_0x1d52cb();
            _0x8228fc['append']('file', _0x0_0x40867a['createReadStream'](_0x4026e5));
            const _0x485d38 = await _0x0_0x18e661({
                'url': 'https://telegra.ph/upload',
                'method': 'POST',
                'headers': { ..._0x8228fc['getHeaders']() },
                'data': _0x8228fc
            });
            return _0x14c5eb('https://telegra.ph' + _0x485d38['data'][0x0]['src']);
        } catch (_0x558944) {
            return _0x5cdf7c(new Error(String(_0x558944)));
        }
    });
};
export const buffergif = async _0x1191ca => {
    const _0x415711 = Math['random']()['toString'](0x24);
    const _0x411602 = './XeonMedia/trash/' + _0x415711 + '.gif';
    const _0x163938 = './XeonMedia/trash/' + _0x415711 + '.mp4';
    _0x0_0x40867a['writeFileSync'](_0x411602, _0x1191ca);
    _0x0_0x570074['exec']('ffmpeg\x20-i\x20' + _0x411602 + '\x20-movflags\x20faststart\x20-pix_fmt\x20yuv420p\x20-vf\x20\x22scale=trunc(iw/2)*2:trunc(ih/2)*2\x22\x20' + _0x163938);
    await sleep(0xfa0);
    const _0x129b5b = _0x0_0x40867a['readFileSync'](_0x163938);
    await Promise['all']([
        unlink(_0x163938)['catch'](() => {
        }),
        unlink(_0x411602)['catch'](() => {
        })
    ]);
    return _0x129b5b;
};