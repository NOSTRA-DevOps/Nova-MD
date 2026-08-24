import _0x0_0x21417d from 'axios';
import * as _0x0_0xdd9a77 from 'cheerio';
import _0x0_0x1bdc70 from 'form-data';
import _0x0_0x1d28ba, { promises as _0x0_0x438183 } from 'fs';
import _0x0_0x44a062 from 'child_process';
const {unlink} = _0x0_0x438183;
const DEFAULT_HEADERS = { 'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/95.0.4638.69\x20Safari/537.36' };
export const sleep = _0x22829d => {
    return new Promise(_0x26ae9b => setTimeout(_0x26ae9b, _0x22829d));
};
export const fetchJson = async (_0x3ce743, _0x5539b1 = {}) => {
    try {
        const _0xcc284b = await _0x0_0x21417d({
            'method': 'GET',
            'url': _0x3ce743,
            'headers': DEFAULT_HEADERS,
            ..._0x5539b1
        });
        return _0xcc284b['data'];
    } catch (_0xd40563) {
        return _0xd40563;
    }
};
export const fetchBuffer = async (_0x4a0aa0, _0x1ff0e1 = {}) => {
    try {
        const _0x640806 = await _0x0_0x21417d({
            'method': 'GET',
            'url': _0x4a0aa0,
            'headers': {
                'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/78.0.3904.70\x20Safari/537.36',
                'DNT': '1',
                'Upgrade-Insecure-Request': '1'
            },
            ..._0x1ff0e1,
            'responseType': 'arraybuffer'
        });
        return _0x640806['data'];
    } catch (_0xa81a84) {
        return _0xa81a84;
    }
};
export const webp2mp4File = _0x164c9a => {
    return new Promise((_0x196f62, _0x767c5e) => {
        const _0x5da967 = new _0x0_0x1bdc70();
        _0x5da967['append']('new-image-url', '');
        _0x5da967['append']('new-image', _0x0_0x1d28ba['createReadStream'](_0x164c9a));
        _0x0_0x21417d({
            'method': 'post',
            'url': 'https://s6.ezgif.com/webp-to-mp4',
            'data': _0x5da967,
            'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x5da967['_boundary'] }
        })['then'](({data: _0x3f1526}) => {
            const _0x4b13a0 = new _0x0_0x1bdc70();
            const _0x129310 = _0x0_0xdd9a77['load'](_0x3f1526);
            const _0x34b6e2 = _0x129310('input[name=\x22file\x22]')['attr']('value');
            _0x4b13a0['append']('file', _0x34b6e2);
            _0x4b13a0['append']('convert', 'Convert\x20WebP\x20to\x20MP4!');
            _0x0_0x21417d({
                'method': 'post',
                'url': 'https://ezgif.com/webp-to-mp4/' + _0x34b6e2,
                'data': _0x4b13a0,
                'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x4b13a0['_boundary'] }
            })['then'](({data: _0x407f13}) => {
                const _0xf36421 = _0x0_0xdd9a77['load'](_0x407f13);
                const _0x41447f = 'https:' + _0xf36421('div#output\x20>\x20p.outfile\x20>\x20video\x20>\x20source')['attr']('src');
                _0x196f62({
                    'status': !![],
                    'message': 'Created\x20By\x20Eternity',
                    'result': _0x41447f
                });
            })['catch'](_0x767c5e);
        })['catch'](_0x767c5e);
    });
};
export const fetchUrl = async (_0x1d27d6, _0x569661 = {}) => {
    try {
        const _0x2728f6 = await _0x0_0x21417d({
            'method': 'GET',
            'url': _0x1d27d6,
            'headers': DEFAULT_HEADERS,
            ..._0x569661
        });
        return _0x2728f6['data'];
    } catch (_0x4f74cd) {
        return _0x4f74cd;
    }
};
export const WAVersion = async () => {
    const _0x339c08 = await fetchUrl('https://web.whatsapp.com/check-update?version=1&platform=web');
    const _0x3aeaa4 = [_0x339c08['currentVersion']['replace'](/[.]/g, ',\x20')];
    return _0x3aeaa4;
};
export const getRandom = _0x5d52db => {
    return '' + Math['floor'](Math['random']() * 0x2710) + _0x5d52db;
};
export const isUrl = _0x488166 => {
    return _0x488166['match'](new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/, 'gi'));
};
export const isNumber = _0x580100 => {
    const _0x1f1200 = parseInt(String(_0x580100), 0xa);
    return typeof _0x1f1200 === 'number' && !isNaN(_0x1f1200);
};
export const TelegraPh = _0x1be887 => {
    return new Promise(async (_0x15091f, _0x3b63cd) => {
        if (!_0x0_0x1d28ba['existsSync'](_0x1be887))
            return _0x3b63cd(new Error('File\x20not\x20Found'));
        try {
            const _0x440482 = new _0x0_0x1bdc70();
            _0x440482['append']('file', _0x0_0x1d28ba['createReadStream'](_0x1be887));
            const _0x28604e = await _0x0_0x21417d({
                'url': 'https://telegra.ph/upload',
                'method': 'POST',
                'headers': { ..._0x440482['getHeaders']() },
                'data': _0x440482
            });
            return _0x15091f('https://telegra.ph' + _0x28604e['data'][0x0]['src']);
        } catch (_0x474cdb) {
            return _0x3b63cd(new Error(String(_0x474cdb)));
        }
    });
};
export const buffergif = async _0xaa73fc => {
    const _0x16bda7 = Math['random']()['toString'](0x24);
    const _0x15b9d5 = './XeonMedia/trash/' + _0x16bda7 + '.gif';
    const _0x4eab86 = './XeonMedia/trash/' + _0x16bda7 + '.mp4';
    _0x0_0x1d28ba['writeFileSync'](_0x15b9d5, _0xaa73fc);
    _0x0_0x44a062['exec']('ffmpeg\x20-i\x20' + _0x15b9d5 + '\x20-movflags\x20faststart\x20-pix_fmt\x20yuv420p\x20-vf\x20\x22scale=trunc(iw/2)*2:trunc(ih/2)*2\x22\x20' + _0x4eab86);
    await sleep(0xfa0);
    const _0x86bcec = _0x0_0x1d28ba['readFileSync'](_0x4eab86);
    await Promise['all']([
        unlink(_0x4eab86)['catch'](() => {
        }),
        unlink(_0x15b9d5)['catch'](() => {
        })
    ]);
    return _0x86bcec;
};