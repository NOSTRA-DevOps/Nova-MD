import _0x0_0x3741bc from 'axios';
import * as _0x0_0x46c3ab from 'cheerio';
import _0x0_0x58c123 from 'form-data';
import _0x0_0x444ac3, { promises as _0x0_0x9f738 } from 'fs';
import _0x0_0xaf3502 from 'child_process';
const {unlink} = _0x0_0x9f738;
const DEFAULT_HEADERS = { 'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/95.0.4638.69\x20Safari/537.36' };
export const sleep = _0x42905b => {
    return new Promise(_0x3f488b => setTimeout(_0x3f488b, _0x42905b));
};
export const fetchJson = async (_0x1c836c, _0x221f6e = {}) => {
    try {
        const _0x40dbad = await _0x0_0x3741bc({
            'method': 'GET',
            'url': _0x1c836c,
            'headers': DEFAULT_HEADERS,
            ..._0x221f6e
        });
        return _0x40dbad['data'];
    } catch (_0x20294d) {
        return _0x20294d;
    }
};
export const fetchBuffer = async (_0x45d70c, _0x40d48e = {}) => {
    try {
        const _0x1870c3 = await _0x0_0x3741bc({
            'method': 'GET',
            'url': _0x45d70c,
            'headers': {
                'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/78.0.3904.70\x20Safari/537.36',
                'DNT': '1',
                'Upgrade-Insecure-Request': '1'
            },
            ..._0x40d48e,
            'responseType': 'arraybuffer'
        });
        return _0x1870c3['data'];
    } catch (_0x472f86) {
        return _0x472f86;
    }
};
export const webp2mp4File = _0x5a202c => {
    return new Promise((_0x1a7b4d, _0x357627) => {
        const _0x4311f4 = new _0x0_0x58c123();
        _0x4311f4['append']('new-image-url', '');
        _0x4311f4['append']('new-image', _0x0_0x444ac3['createReadStream'](_0x5a202c));
        _0x0_0x3741bc({
            'method': 'post',
            'url': 'https://s6.ezgif.com/webp-to-mp4',
            'data': _0x4311f4,
            'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x4311f4['_boundary'] }
        })['then'](({data: _0x28161c}) => {
            const _0x15f397 = new _0x0_0x58c123();
            const _0x5d1cde = _0x0_0x46c3ab['load'](_0x28161c);
            const _0x5f1d65 = _0x5d1cde('input[name=\x22file\x22]')['attr']('value');
            _0x15f397['append']('file', _0x5f1d65);
            _0x15f397['append']('convert', 'Convert\x20WebP\x20to\x20MP4!');
            _0x0_0x3741bc({
                'method': 'post',
                'url': 'https://ezgif.com/webp-to-mp4/' + _0x5f1d65,
                'data': _0x15f397,
                'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x15f397['_boundary'] }
            })['then'](({data: _0x4c6e17}) => {
                const _0xeefa9c = _0x0_0x46c3ab['load'](_0x4c6e17);
                const _0x2a1b9a = 'https:' + _0xeefa9c('div#output\x20>\x20p.outfile\x20>\x20video\x20>\x20source')['attr']('src');
                _0x1a7b4d({
                    'status': !![],
                    'message': 'Created\x20By\x20Eternity',
                    'result': _0x2a1b9a
                });
            })['catch'](_0x357627);
        })['catch'](_0x357627);
    });
};
export const fetchUrl = async (_0x5e1ee8, _0x162445 = {}) => {
    try {
        const _0x5df744 = await _0x0_0x3741bc({
            'method': 'GET',
            'url': _0x5e1ee8,
            'headers': DEFAULT_HEADERS,
            ..._0x162445
        });
        return _0x5df744['data'];
    } catch (_0x988f78) {
        return _0x988f78;
    }
};
export const WAVersion = async () => {
    const _0x5ca458 = await fetchUrl('https://web.whatsapp.com/check-update?version=1&platform=web');
    const _0x8839e8 = [_0x5ca458['currentVersion']['replace'](/[.]/g, ',\x20')];
    return _0x8839e8;
};
export const getRandom = _0x43db8f => {
    return '' + Math['floor'](Math['random']() * 0x2710) + _0x43db8f;
};
export const isUrl = _0x45e984 => {
    return _0x45e984['match'](new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/, 'gi'));
};
export const isNumber = _0x5428f4 => {
    const _0x3b99ec = parseInt(String(_0x5428f4), 0xa);
    return typeof _0x3b99ec === 'number' && !isNaN(_0x3b99ec);
};
export const TelegraPh = _0x3edf09 => {
    return new Promise(async (_0x3789ef, _0x3cb89a) => {
        if (!_0x0_0x444ac3['existsSync'](_0x3edf09))
            return _0x3cb89a(new Error('File\x20not\x20Found'));
        try {
            const _0x348f78 = new _0x0_0x58c123();
            _0x348f78['append']('file', _0x0_0x444ac3['createReadStream'](_0x3edf09));
            const _0x3fd715 = await _0x0_0x3741bc({
                'url': 'https://telegra.ph/upload',
                'method': 'POST',
                'headers': { ..._0x348f78['getHeaders']() },
                'data': _0x348f78
            });
            return _0x3789ef('https://telegra.ph' + _0x3fd715['data'][0x0]['src']);
        } catch (_0x49c456) {
            return _0x3cb89a(new Error(String(_0x49c456)));
        }
    });
};
export const buffergif = async _0x19b8be => {
    const _0x1d87f2 = Math['random']()['toString'](0x24);
    const _0xc23354 = './XeonMedia/trash/' + _0x1d87f2 + '.gif';
    const _0x176498 = './XeonMedia/trash/' + _0x1d87f2 + '.mp4';
    _0x0_0x444ac3['writeFileSync'](_0xc23354, _0x19b8be);
    _0x0_0xaf3502['exec']('ffmpeg\x20-i\x20' + _0xc23354 + '\x20-movflags\x20faststart\x20-pix_fmt\x20yuv420p\x20-vf\x20\x22scale=trunc(iw/2)*2:trunc(ih/2)*2\x22\x20' + _0x176498);
    await sleep(0xfa0);
    const _0x30e2c5 = _0x0_0x444ac3['readFileSync'](_0x176498);
    await Promise['all']([
        unlink(_0x176498)['catch'](() => {
        }),
        unlink(_0xc23354)['catch'](() => {
        })
    ]);
    return _0x30e2c5;
};