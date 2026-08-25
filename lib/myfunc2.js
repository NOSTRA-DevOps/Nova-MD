import _0x0_0xac255c from 'axios';
import * as _0x0_0x2c3bee from 'cheerio';
import _0x0_0x94d574 from 'form-data';
import _0x0_0x1705df, { promises as _0x0_0x26fd9b } from 'fs';
import _0x0_0x216241 from 'child_process';
const {unlink} = _0x0_0x26fd9b;
const DEFAULT_HEADERS = { 'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/95.0.4638.69\x20Safari/537.36' };
export const sleep = _0x291b26 => {
    return new Promise(_0x38e8bf => setTimeout(_0x38e8bf, _0x291b26));
};
export const fetchJson = async (_0x209678, _0x765c48 = {}) => {
    try {
        const _0x1d0a2b = await _0x0_0xac255c({
            'method': 'GET',
            'url': _0x209678,
            'headers': DEFAULT_HEADERS,
            ..._0x765c48
        });
        return _0x1d0a2b['data'];
    } catch (_0x32c6f0) {
        return _0x32c6f0;
    }
};
export const fetchBuffer = async (_0x1e25d7, _0x59a069 = {}) => {
    try {
        const _0x3fc135 = await _0x0_0xac255c({
            'method': 'GET',
            'url': _0x1e25d7,
            'headers': {
                'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/78.0.3904.70\x20Safari/537.36',
                'DNT': '1',
                'Upgrade-Insecure-Request': '1'
            },
            ..._0x59a069,
            'responseType': 'arraybuffer'
        });
        return _0x3fc135['data'];
    } catch (_0x284094) {
        return _0x284094;
    }
};
export const webp2mp4File = _0x212144 => {
    return new Promise((_0x416dba, _0x2ad7e0) => {
        const _0xe24b2c = new _0x0_0x94d574();
        _0xe24b2c['append']('new-image-url', '');
        _0xe24b2c['append']('new-image', _0x0_0x1705df['createReadStream'](_0x212144));
        _0x0_0xac255c({
            'method': 'post',
            'url': 'https://s6.ezgif.com/webp-to-mp4',
            'data': _0xe24b2c,
            'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0xe24b2c['_boundary'] }
        })['then'](({data: _0x556862}) => {
            const _0x473742 = new _0x0_0x94d574();
            const _0x149aea = _0x0_0x2c3bee['load'](_0x556862);
            const _0x20b77b = _0x149aea('input[name=\x22file\x22]')['attr']('value');
            _0x473742['append']('file', _0x20b77b);
            _0x473742['append']('convert', 'Convert\x20WebP\x20to\x20MP4!');
            _0x0_0xac255c({
                'method': 'post',
                'url': 'https://ezgif.com/webp-to-mp4/' + _0x20b77b,
                'data': _0x473742,
                'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x473742['_boundary'] }
            })['then'](({data: _0x312642}) => {
                const _0xb903cc = _0x0_0x2c3bee['load'](_0x312642);
                const _0x1e746e = 'https:' + _0xb903cc('div#output\x20>\x20p.outfile\x20>\x20video\x20>\x20source')['attr']('src');
                _0x416dba({
                    'status': !![],
                    'message': 'Created\x20By\x20Eternity',
                    'result': _0x1e746e
                });
            })['catch'](_0x2ad7e0);
        })['catch'](_0x2ad7e0);
    });
};
export const fetchUrl = async (_0x1fbe03, _0x4bd6d9 = {}) => {
    try {
        const _0x214eec = await _0x0_0xac255c({
            'method': 'GET',
            'url': _0x1fbe03,
            'headers': DEFAULT_HEADERS,
            ..._0x4bd6d9
        });
        return _0x214eec['data'];
    } catch (_0x428810) {
        return _0x428810;
    }
};
export const WAVersion = async () => {
    const _0x272aaf = await fetchUrl('https://web.whatsapp.com/check-update?version=1&platform=web');
    const _0xaba071 = [_0x272aaf['currentVersion']['replace'](/[.]/g, ',\x20')];
    return _0xaba071;
};
export const getRandom = _0x23ad25 => {
    return '' + Math['floor'](Math['random']() * 0x2710) + _0x23ad25;
};
export const isUrl = _0x4c79ad => {
    return _0x4c79ad['match'](new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/, 'gi'));
};
export const isNumber = _0x5a8253 => {
    const _0x35d63c = parseInt(String(_0x5a8253), 0xa);
    return typeof _0x35d63c === 'number' && !isNaN(_0x35d63c);
};
export const TelegraPh = _0x388474 => {
    return new Promise(async (_0x13871f, _0x171e05) => {
        if (!_0x0_0x1705df['existsSync'](_0x388474))
            return _0x171e05(new Error('File\x20not\x20Found'));
        try {
            const _0x310b31 = new _0x0_0x94d574();
            _0x310b31['append']('file', _0x0_0x1705df['createReadStream'](_0x388474));
            const _0x4599d2 = await _0x0_0xac255c({
                'url': 'https://telegra.ph/upload',
                'method': 'POST',
                'headers': { ..._0x310b31['getHeaders']() },
                'data': _0x310b31
            });
            return _0x13871f('https://telegra.ph' + _0x4599d2['data'][0x0]['src']);
        } catch (_0x58467) {
            return _0x171e05(new Error(String(_0x58467)));
        }
    });
};
export const buffergif = async _0x3e6c45 => {
    const _0x289ec2 = Math['random']()['toString'](0x24);
    const _0xe6e905 = './XeonMedia/trash/' + _0x289ec2 + '.gif';
    const _0x5d1c61 = './XeonMedia/trash/' + _0x289ec2 + '.mp4';
    _0x0_0x1705df['writeFileSync'](_0xe6e905, _0x3e6c45);
    _0x0_0x216241['exec']('ffmpeg\x20-i\x20' + _0xe6e905 + '\x20-movflags\x20faststart\x20-pix_fmt\x20yuv420p\x20-vf\x20\x22scale=trunc(iw/2)*2:trunc(ih/2)*2\x22\x20' + _0x5d1c61);
    await sleep(0xfa0);
    const _0x5c92b2 = _0x0_0x1705df['readFileSync'](_0x5d1c61);
    await Promise['all']([
        unlink(_0x5d1c61)['catch'](() => {
        }),
        unlink(_0xe6e905)['catch'](() => {
        })
    ]);
    return _0x5c92b2;
};