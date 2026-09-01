import _0x0_0x76c6e5 from 'axios';
import * as _0x0_0x4618d7 from 'cheerio';
import _0x0_0x570617 from 'form-data';
import _0x0_0x25b59e, { promises as _0x0_0xb819af } from 'fs';
import _0x0_0x355832 from 'child_process';
const {unlink} = _0x0_0xb819af;
const DEFAULT_HEADERS = { 'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/95.0.4638.69\x20Safari/537.36' };
export const sleep = _0x5c8f7d => {
    return new Promise(_0x3b3b00 => setTimeout(_0x3b3b00, _0x5c8f7d));
};
export const fetchJson = async (_0x430da3, _0x265845 = {}) => {
    try {
        const _0x2a34c9 = await _0x0_0x76c6e5({
            'method': 'GET',
            'url': _0x430da3,
            'headers': DEFAULT_HEADERS,
            ..._0x265845
        });
        return _0x2a34c9['data'];
    } catch (_0x5da5c8) {
        return _0x5da5c8;
    }
};
export const fetchBuffer = async (_0x44eecf, _0x30ac67 = {}) => {
    try {
        const _0x581c0b = await _0x0_0x76c6e5({
            'method': 'GET',
            'url': _0x44eecf,
            'headers': {
                'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/78.0.3904.70\x20Safari/537.36',
                'DNT': '1',
                'Upgrade-Insecure-Request': '1'
            },
            ..._0x30ac67,
            'responseType': 'arraybuffer'
        });
        return _0x581c0b['data'];
    } catch (_0x4db707) {
        return _0x4db707;
    }
};
export const webp2mp4File = _0x5c0f9a => {
    return new Promise((_0x2bdee4, _0x378697) => {
        const _0x53913 = new _0x0_0x570617();
        _0x53913['append']('new-image-url', '');
        _0x53913['append']('new-image', _0x0_0x25b59e['createReadStream'](_0x5c0f9a));
        _0x0_0x76c6e5({
            'method': 'post',
            'url': 'https://s6.ezgif.com/webp-to-mp4',
            'data': _0x53913,
            'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x53913['_boundary'] }
        })['then'](({data: _0x23afab}) => {
            const _0x821699 = new _0x0_0x570617();
            const _0x134f23 = _0x0_0x4618d7['load'](_0x23afab);
            const _0x134d6b = _0x134f23('input[name=\x22file\x22]')['attr']('value');
            _0x821699['append']('file', _0x134d6b);
            _0x821699['append']('convert', 'Convert\x20WebP\x20to\x20MP4!');
            _0x0_0x76c6e5({
                'method': 'post',
                'url': 'https://ezgif.com/webp-to-mp4/' + _0x134d6b,
                'data': _0x821699,
                'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x821699['_boundary'] }
            })['then'](({data: _0x1608ec}) => {
                const _0x3813ff = _0x0_0x4618d7['load'](_0x1608ec);
                const _0x1743bb = 'https:' + _0x3813ff('div#output\x20>\x20p.outfile\x20>\x20video\x20>\x20source')['attr']('src');
                _0x2bdee4({
                    'status': !![],
                    'message': 'Created\x20By\x20Eternity',
                    'result': _0x1743bb
                });
            })['catch'](_0x378697);
        })['catch'](_0x378697);
    });
};
export const fetchUrl = async (_0x8e9e09, _0x6cd95f = {}) => {
    try {
        const _0xa549df = await _0x0_0x76c6e5({
            'method': 'GET',
            'url': _0x8e9e09,
            'headers': DEFAULT_HEADERS,
            ..._0x6cd95f
        });
        return _0xa549df['data'];
    } catch (_0x365d37) {
        return _0x365d37;
    }
};
export const WAVersion = async () => {
    const _0x38f04b = await fetchUrl('https://web.whatsapp.com/check-update?version=1&platform=web');
    const _0x354f1f = [_0x38f04b['currentVersion']['replace'](/[.]/g, ',\x20')];
    return _0x354f1f;
};
export const getRandom = _0x20a059 => {
    return '' + Math['floor'](Math['random']() * 0x2710) + _0x20a059;
};
export const isUrl = _0x43348b => {
    return _0x43348b['match'](new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/, 'gi'));
};
export const isNumber = _0x107487 => {
    const _0x355301 = parseInt(String(_0x107487), 0xa);
    return typeof _0x355301 === 'number' && !isNaN(_0x355301);
};
export const TelegraPh = _0x59090b => {
    return new Promise(async (_0x34d478, _0x17e57b) => {
        if (!_0x0_0x25b59e['existsSync'](_0x59090b))
            return _0x17e57b(new Error('File\x20not\x20Found'));
        try {
            const _0x299518 = new _0x0_0x570617();
            _0x299518['append']('file', _0x0_0x25b59e['createReadStream'](_0x59090b));
            const _0x468934 = await _0x0_0x76c6e5({
                'url': 'https://telegra.ph/upload',
                'method': 'POST',
                'headers': { ..._0x299518['getHeaders']() },
                'data': _0x299518
            });
            return _0x34d478('https://telegra.ph' + _0x468934['data'][0x0]['src']);
        } catch (_0x155ffc) {
            return _0x17e57b(new Error(String(_0x155ffc)));
        }
    });
};
export const buffergif = async _0x978c63 => {
    const _0x1875fa = Math['random']()['toString'](0x24);
    const _0x1cd082 = './XeonMedia/trash/' + _0x1875fa + '.gif';
    const _0x2da802 = './XeonMedia/trash/' + _0x1875fa + '.mp4';
    _0x0_0x25b59e['writeFileSync'](_0x1cd082, _0x978c63);
    _0x0_0x355832['exec']('ffmpeg\x20-i\x20' + _0x1cd082 + '\x20-movflags\x20faststart\x20-pix_fmt\x20yuv420p\x20-vf\x20\x22scale=trunc(iw/2)*2:trunc(ih/2)*2\x22\x20' + _0x2da802);
    await sleep(0xfa0);
    const _0x25d92a = _0x0_0x25b59e['readFileSync'](_0x2da802);
    await Promise['all']([
        unlink(_0x2da802)['catch'](() => {
        }),
        unlink(_0x1cd082)['catch'](() => {
        })
    ]);
    return _0x25d92a;
};