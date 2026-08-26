import _0x0_0x4ab959 from 'axios';
import * as _0x0_0x25fe90 from 'cheerio';
import _0x0_0xf0e475 from 'form-data';
import _0x0_0x4261b0, { promises as _0x0_0x4212f9 } from 'fs';
import _0x0_0x301e98 from 'child_process';
const {unlink} = _0x0_0x4212f9;
const DEFAULT_HEADERS = { 'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/95.0.4638.69\x20Safari/537.36' };
export const sleep = _0x19389c => {
    return new Promise(_0x18062d => setTimeout(_0x18062d, _0x19389c));
};
export const fetchJson = async (_0x48b858, _0x169fac = {}) => {
    try {
        const _0x39068f = await _0x0_0x4ab959({
            'method': 'GET',
            'url': _0x48b858,
            'headers': DEFAULT_HEADERS,
            ..._0x169fac
        });
        return _0x39068f['data'];
    } catch (_0x48609d) {
        return _0x48609d;
    }
};
export const fetchBuffer = async (_0x256cf0, _0x3e4c10 = {}) => {
    try {
        const _0x3cff8c = await _0x0_0x4ab959({
            'method': 'GET',
            'url': _0x256cf0,
            'headers': {
                'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/78.0.3904.70\x20Safari/537.36',
                'DNT': '1',
                'Upgrade-Insecure-Request': '1'
            },
            ..._0x3e4c10,
            'responseType': 'arraybuffer'
        });
        return _0x3cff8c['data'];
    } catch (_0x1fe722) {
        return _0x1fe722;
    }
};
export const webp2mp4File = _0x39ffc4 => {
    return new Promise((_0x499c30, _0x34e192) => {
        const _0x19c6c9 = new _0x0_0xf0e475();
        _0x19c6c9['append']('new-image-url', '');
        _0x19c6c9['append']('new-image', _0x0_0x4261b0['createReadStream'](_0x39ffc4));
        _0x0_0x4ab959({
            'method': 'post',
            'url': 'https://s6.ezgif.com/webp-to-mp4',
            'data': _0x19c6c9,
            'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x19c6c9['_boundary'] }
        })['then'](({data: _0x554e30}) => {
            const _0xe91dad = new _0x0_0xf0e475();
            const _0x4be0d1 = _0x0_0x25fe90['load'](_0x554e30);
            const _0x3aa3cd = _0x4be0d1('input[name=\x22file\x22]')['attr']('value');
            _0xe91dad['append']('file', _0x3aa3cd);
            _0xe91dad['append']('convert', 'Convert\x20WebP\x20to\x20MP4!');
            _0x0_0x4ab959({
                'method': 'post',
                'url': 'https://ezgif.com/webp-to-mp4/' + _0x3aa3cd,
                'data': _0xe91dad,
                'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0xe91dad['_boundary'] }
            })['then'](({data: _0x43ea37}) => {
                const _0xd95650 = _0x0_0x25fe90['load'](_0x43ea37);
                const _0x423cc5 = 'https:' + _0xd95650('div#output\x20>\x20p.outfile\x20>\x20video\x20>\x20source')['attr']('src');
                _0x499c30({
                    'status': !![],
                    'message': 'Created\x20By\x20Eternity',
                    'result': _0x423cc5
                });
            })['catch'](_0x34e192);
        })['catch'](_0x34e192);
    });
};
export const fetchUrl = async (_0x301bb1, _0x2cc25f = {}) => {
    try {
        const _0x35456f = await _0x0_0x4ab959({
            'method': 'GET',
            'url': _0x301bb1,
            'headers': DEFAULT_HEADERS,
            ..._0x2cc25f
        });
        return _0x35456f['data'];
    } catch (_0x3b1474) {
        return _0x3b1474;
    }
};
export const WAVersion = async () => {
    const _0x4cd24f = await fetchUrl('https://web.whatsapp.com/check-update?version=1&platform=web');
    const _0x4fb6b9 = [_0x4cd24f['currentVersion']['replace'](/[.]/g, ',\x20')];
    return _0x4fb6b9;
};
export const getRandom = _0x40368c => {
    return '' + Math['floor'](Math['random']() * 0x2710) + _0x40368c;
};
export const isUrl = _0x59b96f => {
    return _0x59b96f['match'](new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/, 'gi'));
};
export const isNumber = _0x36e07a => {
    const _0x31a6d8 = parseInt(String(_0x36e07a), 0xa);
    return typeof _0x31a6d8 === 'number' && !isNaN(_0x31a6d8);
};
export const TelegraPh = _0x433a54 => {
    return new Promise(async (_0x40b1cd, _0x4f0fa6) => {
        if (!_0x0_0x4261b0['existsSync'](_0x433a54))
            return _0x4f0fa6(new Error('File\x20not\x20Found'));
        try {
            const _0x3bc2bc = new _0x0_0xf0e475();
            _0x3bc2bc['append']('file', _0x0_0x4261b0['createReadStream'](_0x433a54));
            const _0x80355e = await _0x0_0x4ab959({
                'url': 'https://telegra.ph/upload',
                'method': 'POST',
                'headers': { ..._0x3bc2bc['getHeaders']() },
                'data': _0x3bc2bc
            });
            return _0x40b1cd('https://telegra.ph' + _0x80355e['data'][0x0]['src']);
        } catch (_0x29d44a) {
            return _0x4f0fa6(new Error(String(_0x29d44a)));
        }
    });
};
export const buffergif = async _0x36b4b7 => {
    const _0x3dea1e = Math['random']()['toString'](0x24);
    const _0x531dd9 = './XeonMedia/trash/' + _0x3dea1e + '.gif';
    const _0x563e19 = './XeonMedia/trash/' + _0x3dea1e + '.mp4';
    _0x0_0x4261b0['writeFileSync'](_0x531dd9, _0x36b4b7);
    _0x0_0x301e98['exec']('ffmpeg\x20-i\x20' + _0x531dd9 + '\x20-movflags\x20faststart\x20-pix_fmt\x20yuv420p\x20-vf\x20\x22scale=trunc(iw/2)*2:trunc(ih/2)*2\x22\x20' + _0x563e19);
    await sleep(0xfa0);
    const _0x15bc23 = _0x0_0x4261b0['readFileSync'](_0x563e19);
    await Promise['all']([
        unlink(_0x563e19)['catch'](() => {
        }),
        unlink(_0x531dd9)['catch'](() => {
        })
    ]);
    return _0x15bc23;
};