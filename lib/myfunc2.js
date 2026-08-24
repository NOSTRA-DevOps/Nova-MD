import _0x0_0x22fd52 from 'axios';
import * as _0x0_0x451262 from 'cheerio';
import _0x0_0x49ffa6 from 'form-data';
import _0x0_0xac6c2f, { promises as _0x0_0x998c6f } from 'fs';
import _0x0_0x1d52d9 from 'child_process';
const {unlink} = _0x0_0x998c6f;
const DEFAULT_HEADERS = { 'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/95.0.4638.69\x20Safari/537.36' };
export const sleep = _0x51a14e => {
    return new Promise(_0x58fb01 => setTimeout(_0x58fb01, _0x51a14e));
};
export const fetchJson = async (_0x3fe4c9, _0x5a8738 = {}) => {
    try {
        const _0x34e15e = await _0x0_0x22fd52({
            'method': 'GET',
            'url': _0x3fe4c9,
            'headers': DEFAULT_HEADERS,
            ..._0x5a8738
        });
        return _0x34e15e['data'];
    } catch (_0x455e34) {
        return _0x455e34;
    }
};
export const fetchBuffer = async (_0x294151, _0xad8566 = {}) => {
    try {
        const _0x3acfb9 = await _0x0_0x22fd52({
            'method': 'GET',
            'url': _0x294151,
            'headers': {
                'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/78.0.3904.70\x20Safari/537.36',
                'DNT': '1',
                'Upgrade-Insecure-Request': '1'
            },
            ..._0xad8566,
            'responseType': 'arraybuffer'
        });
        return _0x3acfb9['data'];
    } catch (_0x49bd82) {
        return _0x49bd82;
    }
};
export const webp2mp4File = _0x1643a2 => {
    return new Promise((_0x17dbf6, _0x424953) => {
        const _0x44a63e = new _0x0_0x49ffa6();
        _0x44a63e['append']('new-image-url', '');
        _0x44a63e['append']('new-image', _0x0_0xac6c2f['createReadStream'](_0x1643a2));
        _0x0_0x22fd52({
            'method': 'post',
            'url': 'https://s6.ezgif.com/webp-to-mp4',
            'data': _0x44a63e,
            'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x44a63e['_boundary'] }
        })['then'](({data: _0x447e62}) => {
            const _0x161b8e = new _0x0_0x49ffa6();
            const _0x476807 = _0x0_0x451262['load'](_0x447e62);
            const _0x5e703f = _0x476807('input[name=\x22file\x22]')['attr']('value');
            _0x161b8e['append']('file', _0x5e703f);
            _0x161b8e['append']('convert', 'Convert\x20WebP\x20to\x20MP4!');
            _0x0_0x22fd52({
                'method': 'post',
                'url': 'https://ezgif.com/webp-to-mp4/' + _0x5e703f,
                'data': _0x161b8e,
                'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x161b8e['_boundary'] }
            })['then'](({data: _0x1ef931}) => {
                const _0x210f26 = _0x0_0x451262['load'](_0x1ef931);
                const _0x24b761 = 'https:' + _0x210f26('div#output\x20>\x20p.outfile\x20>\x20video\x20>\x20source')['attr']('src');
                _0x17dbf6({
                    'status': !![],
                    'message': 'Created\x20By\x20Eternity',
                    'result': _0x24b761
                });
            })['catch'](_0x424953);
        })['catch'](_0x424953);
    });
};
export const fetchUrl = async (_0x4fcf40, _0x565d84 = {}) => {
    try {
        const _0x4dc665 = await _0x0_0x22fd52({
            'method': 'GET',
            'url': _0x4fcf40,
            'headers': DEFAULT_HEADERS,
            ..._0x565d84
        });
        return _0x4dc665['data'];
    } catch (_0x437d48) {
        return _0x437d48;
    }
};
export const WAVersion = async () => {
    const _0x2cad0f = await fetchUrl('https://web.whatsapp.com/check-update?version=1&platform=web');
    const _0x30b888 = [_0x2cad0f['currentVersion']['replace'](/[.]/g, ',\x20')];
    return _0x30b888;
};
export const getRandom = _0x1173be => {
    return '' + Math['floor'](Math['random']() * 0x2710) + _0x1173be;
};
export const isUrl = _0x141fe1 => {
    return _0x141fe1['match'](new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/, 'gi'));
};
export const isNumber = _0x24ec4d => {
    const _0x1f3c76 = parseInt(String(_0x24ec4d), 0xa);
    return typeof _0x1f3c76 === 'number' && !isNaN(_0x1f3c76);
};
export const TelegraPh = _0x21e304 => {
    return new Promise(async (_0x29d6b9, _0x51845b) => {
        if (!_0x0_0xac6c2f['existsSync'](_0x21e304))
            return _0x51845b(new Error('File\x20not\x20Found'));
        try {
            const _0x15f614 = new _0x0_0x49ffa6();
            _0x15f614['append']('file', _0x0_0xac6c2f['createReadStream'](_0x21e304));
            const _0x4f3c50 = await _0x0_0x22fd52({
                'url': 'https://telegra.ph/upload',
                'method': 'POST',
                'headers': { ..._0x15f614['getHeaders']() },
                'data': _0x15f614
            });
            return _0x29d6b9('https://telegra.ph' + _0x4f3c50['data'][0x0]['src']);
        } catch (_0x5cd794) {
            return _0x51845b(new Error(String(_0x5cd794)));
        }
    });
};
export const buffergif = async _0x4ff59b => {
    const _0x3aaa59 = Math['random']()['toString'](0x24);
    const _0x18cde3 = './XeonMedia/trash/' + _0x3aaa59 + '.gif';
    const _0xfb4d0b = './XeonMedia/trash/' + _0x3aaa59 + '.mp4';
    _0x0_0xac6c2f['writeFileSync'](_0x18cde3, _0x4ff59b);
    _0x0_0x1d52d9['exec']('ffmpeg\x20-i\x20' + _0x18cde3 + '\x20-movflags\x20faststart\x20-pix_fmt\x20yuv420p\x20-vf\x20\x22scale=trunc(iw/2)*2:trunc(ih/2)*2\x22\x20' + _0xfb4d0b);
    await sleep(0xfa0);
    const _0x313a87 = _0x0_0xac6c2f['readFileSync'](_0xfb4d0b);
    await Promise['all']([
        unlink(_0xfb4d0b)['catch'](() => {
        }),
        unlink(_0x18cde3)['catch'](() => {
        })
    ]);
    return _0x313a87;
};