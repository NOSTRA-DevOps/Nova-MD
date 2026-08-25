import _0x0_0x3dd1b4 from 'axios';
import * as _0x0_0x5d1d0a from 'cheerio';
import _0x0_0x182f03 from 'form-data';
import _0x0_0x582b36, { promises as _0x0_0x5b949a } from 'fs';
import _0x0_0x4c5fac from 'child_process';
const {unlink} = _0x0_0x5b949a;
const DEFAULT_HEADERS = { 'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/95.0.4638.69\x20Safari/537.36' };
export const sleep = _0xd47242 => {
    return new Promise(_0x534b27 => setTimeout(_0x534b27, _0xd47242));
};
export const fetchJson = async (_0x2bff4c, _0x3d1e3 = {}) => {
    try {
        const _0x15d9c2 = await _0x0_0x3dd1b4({
            'method': 'GET',
            'url': _0x2bff4c,
            'headers': DEFAULT_HEADERS,
            ..._0x3d1e3
        });
        return _0x15d9c2['data'];
    } catch (_0xa5a384) {
        return _0xa5a384;
    }
};
export const fetchBuffer = async (_0x4d80f0, _0x1d93a2 = {}) => {
    try {
        const _0x1fc897 = await _0x0_0x3dd1b4({
            'method': 'GET',
            'url': _0x4d80f0,
            'headers': {
                'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/78.0.3904.70\x20Safari/537.36',
                'DNT': '1',
                'Upgrade-Insecure-Request': '1'
            },
            ..._0x1d93a2,
            'responseType': 'arraybuffer'
        });
        return _0x1fc897['data'];
    } catch (_0x482f1e) {
        return _0x482f1e;
    }
};
export const webp2mp4File = _0xb5456b => {
    return new Promise((_0x1b6ed8, _0x503220) => {
        const _0x35bca3 = new _0x0_0x182f03();
        _0x35bca3['append']('new-image-url', '');
        _0x35bca3['append']('new-image', _0x0_0x582b36['createReadStream'](_0xb5456b));
        _0x0_0x3dd1b4({
            'method': 'post',
            'url': 'https://s6.ezgif.com/webp-to-mp4',
            'data': _0x35bca3,
            'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x35bca3['_boundary'] }
        })['then'](({data: _0x297636}) => {
            const _0x6902b9 = new _0x0_0x182f03();
            const _0x5ae3fd = _0x0_0x5d1d0a['load'](_0x297636);
            const _0x2c125d = _0x5ae3fd('input[name=\x22file\x22]')['attr']('value');
            _0x6902b9['append']('file', _0x2c125d);
            _0x6902b9['append']('convert', 'Convert\x20WebP\x20to\x20MP4!');
            _0x0_0x3dd1b4({
                'method': 'post',
                'url': 'https://ezgif.com/webp-to-mp4/' + _0x2c125d,
                'data': _0x6902b9,
                'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x6902b9['_boundary'] }
            })['then'](({data: _0xc373ee}) => {
                const _0x4a1c23 = _0x0_0x5d1d0a['load'](_0xc373ee);
                const _0x46d1ae = 'https:' + _0x4a1c23('div#output\x20>\x20p.outfile\x20>\x20video\x20>\x20source')['attr']('src');
                _0x1b6ed8({
                    'status': !![],
                    'message': 'Created\x20By\x20Eternity',
                    'result': _0x46d1ae
                });
            })['catch'](_0x503220);
        })['catch'](_0x503220);
    });
};
export const fetchUrl = async (_0x59dd64, _0x57f009 = {}) => {
    try {
        const _0x14455a = await _0x0_0x3dd1b4({
            'method': 'GET',
            'url': _0x59dd64,
            'headers': DEFAULT_HEADERS,
            ..._0x57f009
        });
        return _0x14455a['data'];
    } catch (_0x577542) {
        return _0x577542;
    }
};
export const WAVersion = async () => {
    const _0x3beaab = await fetchUrl('https://web.whatsapp.com/check-update?version=1&platform=web');
    const _0x39a845 = [_0x3beaab['currentVersion']['replace'](/[.]/g, ',\x20')];
    return _0x39a845;
};
export const getRandom = _0x27c1f0 => {
    return '' + Math['floor'](Math['random']() * 0x2710) + _0x27c1f0;
};
export const isUrl = _0x1e3911 => {
    return _0x1e3911['match'](new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/, 'gi'));
};
export const isNumber = _0x4528f6 => {
    const _0x37565b = parseInt(String(_0x4528f6), 0xa);
    return typeof _0x37565b === 'number' && !isNaN(_0x37565b);
};
export const TelegraPh = _0xfcec5a => {
    return new Promise(async (_0x399183, _0x81b835) => {
        if (!_0x0_0x582b36['existsSync'](_0xfcec5a))
            return _0x81b835(new Error('File\x20not\x20Found'));
        try {
            const _0x4d3cd6 = new _0x0_0x182f03();
            _0x4d3cd6['append']('file', _0x0_0x582b36['createReadStream'](_0xfcec5a));
            const _0x4e40ba = await _0x0_0x3dd1b4({
                'url': 'https://telegra.ph/upload',
                'method': 'POST',
                'headers': { ..._0x4d3cd6['getHeaders']() },
                'data': _0x4d3cd6
            });
            return _0x399183('https://telegra.ph' + _0x4e40ba['data'][0x0]['src']);
        } catch (_0x19a6cb) {
            return _0x81b835(new Error(String(_0x19a6cb)));
        }
    });
};
export const buffergif = async _0x487833 => {
    const _0x3563e3 = Math['random']()['toString'](0x24);
    const _0x24ae59 = './XeonMedia/trash/' + _0x3563e3 + '.gif';
    const _0x35ecb4 = './XeonMedia/trash/' + _0x3563e3 + '.mp4';
    _0x0_0x582b36['writeFileSync'](_0x24ae59, _0x487833);
    _0x0_0x4c5fac['exec']('ffmpeg\x20-i\x20' + _0x24ae59 + '\x20-movflags\x20faststart\x20-pix_fmt\x20yuv420p\x20-vf\x20\x22scale=trunc(iw/2)*2:trunc(ih/2)*2\x22\x20' + _0x35ecb4);
    await sleep(0xfa0);
    const _0x364af7 = _0x0_0x582b36['readFileSync'](_0x35ecb4);
    await Promise['all']([
        unlink(_0x35ecb4)['catch'](() => {
        }),
        unlink(_0x24ae59)['catch'](() => {
        })
    ]);
    return _0x364af7;
};