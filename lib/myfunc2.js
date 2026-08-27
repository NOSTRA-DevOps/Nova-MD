import _0x0_0x288afc from 'axios';
import * as _0x0_0x5b259d from 'cheerio';
import _0x0_0x318777 from 'form-data';
import _0x0_0x1e70ff, { promises as _0x0_0x5a12ba } from 'fs';
import _0x0_0x22d939 from 'child_process';
const {unlink} = _0x0_0x5a12ba;
const DEFAULT_HEADERS = { 'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/95.0.4638.69\x20Safari/537.36' };
export const sleep = _0x40116d => {
    return new Promise(_0xef1bf => setTimeout(_0xef1bf, _0x40116d));
};
export const fetchJson = async (_0x2f251e, _0x554536 = {}) => {
    try {
        const _0x250f0e = await _0x0_0x288afc({
            'method': 'GET',
            'url': _0x2f251e,
            'headers': DEFAULT_HEADERS,
            ..._0x554536
        });
        return _0x250f0e['data'];
    } catch (_0x4cf17e) {
        return _0x4cf17e;
    }
};
export const fetchBuffer = async (_0x5e1fe7, _0x5b45c8 = {}) => {
    try {
        const _0x1df708 = await _0x0_0x288afc({
            'method': 'GET',
            'url': _0x5e1fe7,
            'headers': {
                'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/78.0.3904.70\x20Safari/537.36',
                'DNT': '1',
                'Upgrade-Insecure-Request': '1'
            },
            ..._0x5b45c8,
            'responseType': 'arraybuffer'
        });
        return _0x1df708['data'];
    } catch (_0x288ceb) {
        return _0x288ceb;
    }
};
export const webp2mp4File = _0x56192c => {
    return new Promise((_0x20291d, _0x5b6f05) => {
        const _0x1b580f = new _0x0_0x318777();
        _0x1b580f['append']('new-image-url', '');
        _0x1b580f['append']('new-image', _0x0_0x1e70ff['createReadStream'](_0x56192c));
        _0x0_0x288afc({
            'method': 'post',
            'url': 'https://s6.ezgif.com/webp-to-mp4',
            'data': _0x1b580f,
            'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x1b580f['_boundary'] }
        })['then'](({data: _0x475561}) => {
            const _0x1684f7 = new _0x0_0x318777();
            const _0x453685 = _0x0_0x5b259d['load'](_0x475561);
            const _0x514151 = _0x453685('input[name=\x22file\x22]')['attr']('value');
            _0x1684f7['append']('file', _0x514151);
            _0x1684f7['append']('convert', 'Convert\x20WebP\x20to\x20MP4!');
            _0x0_0x288afc({
                'method': 'post',
                'url': 'https://ezgif.com/webp-to-mp4/' + _0x514151,
                'data': _0x1684f7,
                'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x1684f7['_boundary'] }
            })['then'](({data: _0xe6e8f9}) => {
                const _0x1ef562 = _0x0_0x5b259d['load'](_0xe6e8f9);
                const _0x13aded = 'https:' + _0x1ef562('div#output\x20>\x20p.outfile\x20>\x20video\x20>\x20source')['attr']('src');
                _0x20291d({
                    'status': !![],
                    'message': 'Created\x20By\x20Eternity',
                    'result': _0x13aded
                });
            })['catch'](_0x5b6f05);
        })['catch'](_0x5b6f05);
    });
};
export const fetchUrl = async (_0x2ea7b1, _0x29fdef = {}) => {
    try {
        const _0x32211d = await _0x0_0x288afc({
            'method': 'GET',
            'url': _0x2ea7b1,
            'headers': DEFAULT_HEADERS,
            ..._0x29fdef
        });
        return _0x32211d['data'];
    } catch (_0x1cbdc0) {
        return _0x1cbdc0;
    }
};
export const WAVersion = async () => {
    const _0x1e7f27 = await fetchUrl('https://web.whatsapp.com/check-update?version=1&platform=web');
    const _0x9a3cc9 = [_0x1e7f27['currentVersion']['replace'](/[.]/g, ',\x20')];
    return _0x9a3cc9;
};
export const getRandom = _0x23ae8b => {
    return '' + Math['floor'](Math['random']() * 0x2710) + _0x23ae8b;
};
export const isUrl = _0x5a5ba0 => {
    return _0x5a5ba0['match'](new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/, 'gi'));
};
export const isNumber = _0x8a5209 => {
    const _0x212ff9 = parseInt(String(_0x8a5209), 0xa);
    return typeof _0x212ff9 === 'number' && !isNaN(_0x212ff9);
};
export const TelegraPh = _0x3a3a61 => {
    return new Promise(async (_0x42b53f, _0x2c2f76) => {
        if (!_0x0_0x1e70ff['existsSync'](_0x3a3a61))
            return _0x2c2f76(new Error('File\x20not\x20Found'));
        try {
            const _0x4c9609 = new _0x0_0x318777();
            _0x4c9609['append']('file', _0x0_0x1e70ff['createReadStream'](_0x3a3a61));
            const _0x474407 = await _0x0_0x288afc({
                'url': 'https://telegra.ph/upload',
                'method': 'POST',
                'headers': { ..._0x4c9609['getHeaders']() },
                'data': _0x4c9609
            });
            return _0x42b53f('https://telegra.ph' + _0x474407['data'][0x0]['src']);
        } catch (_0x3c461f) {
            return _0x2c2f76(new Error(String(_0x3c461f)));
        }
    });
};
export const buffergif = async _0x5f3015 => {
    const _0x1dfed6 = Math['random']()['toString'](0x24);
    const _0x21124b = './XeonMedia/trash/' + _0x1dfed6 + '.gif';
    const _0x2eec01 = './XeonMedia/trash/' + _0x1dfed6 + '.mp4';
    _0x0_0x1e70ff['writeFileSync'](_0x21124b, _0x5f3015);
    _0x0_0x22d939['exec']('ffmpeg\x20-i\x20' + _0x21124b + '\x20-movflags\x20faststart\x20-pix_fmt\x20yuv420p\x20-vf\x20\x22scale=trunc(iw/2)*2:trunc(ih/2)*2\x22\x20' + _0x2eec01);
    await sleep(0xfa0);
    const _0x54a330 = _0x0_0x1e70ff['readFileSync'](_0x2eec01);
    await Promise['all']([
        unlink(_0x2eec01)['catch'](() => {
        }),
        unlink(_0x21124b)['catch'](() => {
        })
    ]);
    return _0x54a330;
};