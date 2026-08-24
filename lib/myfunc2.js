import _0x0_0x581e8b from 'axios';
import * as _0x0_0x4c3d6f from 'cheerio';
import _0x0_0x18fa38 from 'form-data';
import _0x0_0x2c83e7, { promises as _0x0_0x34b83e } from 'fs';
import _0x0_0x4bad8d from 'child_process';
const {unlink} = _0x0_0x34b83e;
const DEFAULT_HEADERS = { 'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/95.0.4638.69\x20Safari/537.36' };
export const sleep = _0x375e2b => {
    return new Promise(_0x4f5a35 => setTimeout(_0x4f5a35, _0x375e2b));
};
export const fetchJson = async (_0x4e2527, _0x2d6bb3 = {}) => {
    try {
        const _0x201f95 = await _0x0_0x581e8b({
            'method': 'GET',
            'url': _0x4e2527,
            'headers': DEFAULT_HEADERS,
            ..._0x2d6bb3
        });
        return _0x201f95['data'];
    } catch (_0x3726b5) {
        return _0x3726b5;
    }
};
export const fetchBuffer = async (_0x315ffe, _0x3fb732 = {}) => {
    try {
        const _0x53f173 = await _0x0_0x581e8b({
            'method': 'GET',
            'url': _0x315ffe,
            'headers': {
                'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/78.0.3904.70\x20Safari/537.36',
                'DNT': '1',
                'Upgrade-Insecure-Request': '1'
            },
            ..._0x3fb732,
            'responseType': 'arraybuffer'
        });
        return _0x53f173['data'];
    } catch (_0x5b340e) {
        return _0x5b340e;
    }
};
export const webp2mp4File = _0x482039 => {
    return new Promise((_0x3c1431, _0x2b78df) => {
        const _0xce191 = new _0x0_0x18fa38();
        _0xce191['append']('new-image-url', '');
        _0xce191['append']('new-image', _0x0_0x2c83e7['createReadStream'](_0x482039));
        _0x0_0x581e8b({
            'method': 'post',
            'url': 'https://s6.ezgif.com/webp-to-mp4',
            'data': _0xce191,
            'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0xce191['_boundary'] }
        })['then'](({data: _0x1f459a}) => {
            const _0x26c446 = new _0x0_0x18fa38();
            const _0x5813b9 = _0x0_0x4c3d6f['load'](_0x1f459a);
            const _0x2c0c17 = _0x5813b9('input[name=\x22file\x22]')['attr']('value');
            _0x26c446['append']('file', _0x2c0c17);
            _0x26c446['append']('convert', 'Convert\x20WebP\x20to\x20MP4!');
            _0x0_0x581e8b({
                'method': 'post',
                'url': 'https://ezgif.com/webp-to-mp4/' + _0x2c0c17,
                'data': _0x26c446,
                'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x26c446['_boundary'] }
            })['then'](({data: _0x44889c}) => {
                const _0x122c17 = _0x0_0x4c3d6f['load'](_0x44889c);
                const _0x159942 = 'https:' + _0x122c17('div#output\x20>\x20p.outfile\x20>\x20video\x20>\x20source')['attr']('src');
                _0x3c1431({
                    'status': !![],
                    'message': 'Created\x20By\x20Eternity',
                    'result': _0x159942
                });
            })['catch'](_0x2b78df);
        })['catch'](_0x2b78df);
    });
};
export const fetchUrl = async (_0x2a0c98, _0x485447 = {}) => {
    try {
        const _0x4c8318 = await _0x0_0x581e8b({
            'method': 'GET',
            'url': _0x2a0c98,
            'headers': DEFAULT_HEADERS,
            ..._0x485447
        });
        return _0x4c8318['data'];
    } catch (_0x29420e) {
        return _0x29420e;
    }
};
export const WAVersion = async () => {
    const _0x1d1f21 = await fetchUrl('https://web.whatsapp.com/check-update?version=1&platform=web');
    const _0x5bc59d = [_0x1d1f21['currentVersion']['replace'](/[.]/g, ',\x20')];
    return _0x5bc59d;
};
export const getRandom = _0x5ccc5a => {
    return '' + Math['floor'](Math['random']() * 0x2710) + _0x5ccc5a;
};
export const isUrl = _0x1e9e29 => {
    return _0x1e9e29['match'](new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/, 'gi'));
};
export const isNumber = _0x6a15e2 => {
    const _0x55337a = parseInt(String(_0x6a15e2), 0xa);
    return typeof _0x55337a === 'number' && !isNaN(_0x55337a);
};
export const TelegraPh = _0x946ab1 => {
    return new Promise(async (_0x2e03f0, _0x136dc5) => {
        if (!_0x0_0x2c83e7['existsSync'](_0x946ab1))
            return _0x136dc5(new Error('File\x20not\x20Found'));
        try {
            const _0x429895 = new _0x0_0x18fa38();
            _0x429895['append']('file', _0x0_0x2c83e7['createReadStream'](_0x946ab1));
            const _0x1c5bcc = await _0x0_0x581e8b({
                'url': 'https://telegra.ph/upload',
                'method': 'POST',
                'headers': { ..._0x429895['getHeaders']() },
                'data': _0x429895
            });
            return _0x2e03f0('https://telegra.ph' + _0x1c5bcc['data'][0x0]['src']);
        } catch (_0x25cafc) {
            return _0x136dc5(new Error(String(_0x25cafc)));
        }
    });
};
export const buffergif = async _0x278096 => {
    const _0x3d2619 = Math['random']()['toString'](0x24);
    const _0x2cb864 = './XeonMedia/trash/' + _0x3d2619 + '.gif';
    const _0x95cc90 = './XeonMedia/trash/' + _0x3d2619 + '.mp4';
    _0x0_0x2c83e7['writeFileSync'](_0x2cb864, _0x278096);
    _0x0_0x4bad8d['exec']('ffmpeg\x20-i\x20' + _0x2cb864 + '\x20-movflags\x20faststart\x20-pix_fmt\x20yuv420p\x20-vf\x20\x22scale=trunc(iw/2)*2:trunc(ih/2)*2\x22\x20' + _0x95cc90);
    await sleep(0xfa0);
    const _0x2f2677 = _0x0_0x2c83e7['readFileSync'](_0x95cc90);
    await Promise['all']([
        unlink(_0x95cc90)['catch'](() => {
        }),
        unlink(_0x2cb864)['catch'](() => {
        })
    ]);
    return _0x2f2677;
};