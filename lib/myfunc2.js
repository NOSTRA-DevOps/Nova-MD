import _0x0_0x3d705c from 'axios';
import * as _0x0_0x3756fb from 'cheerio';
import _0x0_0x2b2e5a from 'form-data';
import _0x0_0x1e2ea9, { promises as _0x0_0xe9c93c } from 'fs';
import _0x0_0x3d5b26 from 'child_process';
const {unlink} = _0x0_0xe9c93c;
const DEFAULT_HEADERS = { 'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/95.0.4638.69\x20Safari/537.36' };
export const sleep = _0x1f1a01 => {
    return new Promise(_0x1d1bb0 => setTimeout(_0x1d1bb0, _0x1f1a01));
};
export const fetchJson = async (_0x322cc7, _0x3f1bb0 = {}) => {
    try {
        const _0x5ecee3 = await _0x0_0x3d705c({
            'method': 'GET',
            'url': _0x322cc7,
            'headers': DEFAULT_HEADERS,
            ..._0x3f1bb0
        });
        return _0x5ecee3['data'];
    } catch (_0x55d002) {
        return _0x55d002;
    }
};
export const fetchBuffer = async (_0x2a56db, _0x552091 = {}) => {
    try {
        const _0x3d25b2 = await _0x0_0x3d705c({
            'method': 'GET',
            'url': _0x2a56db,
            'headers': {
                'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/78.0.3904.70\x20Safari/537.36',
                'DNT': '1',
                'Upgrade-Insecure-Request': '1'
            },
            ..._0x552091,
            'responseType': 'arraybuffer'
        });
        return _0x3d25b2['data'];
    } catch (_0x459fda) {
        return _0x459fda;
    }
};
export const webp2mp4File = _0x1d31ff => {
    return new Promise((_0x34d1b5, _0x58c7b9) => {
        const _0x9c1eb7 = new _0x0_0x2b2e5a();
        _0x9c1eb7['append']('new-image-url', '');
        _0x9c1eb7['append']('new-image', _0x0_0x1e2ea9['createReadStream'](_0x1d31ff));
        _0x0_0x3d705c({
            'method': 'post',
            'url': 'https://s6.ezgif.com/webp-to-mp4',
            'data': _0x9c1eb7,
            'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x9c1eb7['_boundary'] }
        })['then'](({data: _0x592032}) => {
            const _0xf4b3a = new _0x0_0x2b2e5a();
            const _0x2be0a3 = _0x0_0x3756fb['load'](_0x592032);
            const _0x325bc3 = _0x2be0a3('input[name=\x22file\x22]')['attr']('value');
            _0xf4b3a['append']('file', _0x325bc3);
            _0xf4b3a['append']('convert', 'Convert\x20WebP\x20to\x20MP4!');
            _0x0_0x3d705c({
                'method': 'post',
                'url': 'https://ezgif.com/webp-to-mp4/' + _0x325bc3,
                'data': _0xf4b3a,
                'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0xf4b3a['_boundary'] }
            })['then'](({data: _0x2f6500}) => {
                const _0x1ecc63 = _0x0_0x3756fb['load'](_0x2f6500);
                const _0x3a5e37 = 'https:' + _0x1ecc63('div#output\x20>\x20p.outfile\x20>\x20video\x20>\x20source')['attr']('src');
                _0x34d1b5({
                    'status': !![],
                    'message': 'Created\x20By\x20Eternity',
                    'result': _0x3a5e37
                });
            })['catch'](_0x58c7b9);
        })['catch'](_0x58c7b9);
    });
};
export const fetchUrl = async (_0x509e8f, _0x88e7e9 = {}) => {
    try {
        const _0x24ce36 = await _0x0_0x3d705c({
            'method': 'GET',
            'url': _0x509e8f,
            'headers': DEFAULT_HEADERS,
            ..._0x88e7e9
        });
        return _0x24ce36['data'];
    } catch (_0x158394) {
        return _0x158394;
    }
};
export const WAVersion = async () => {
    const _0x120381 = await fetchUrl('https://web.whatsapp.com/check-update?version=1&platform=web');
    const _0x86513c = [_0x120381['currentVersion']['replace'](/[.]/g, ',\x20')];
    return _0x86513c;
};
export const getRandom = _0x3fc498 => {
    return '' + Math['floor'](Math['random']() * 0x2710) + _0x3fc498;
};
export const isUrl = _0x1dc9ed => {
    return _0x1dc9ed['match'](new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/, 'gi'));
};
export const isNumber = _0x5e24ab => {
    const _0x719627 = parseInt(String(_0x5e24ab), 0xa);
    return typeof _0x719627 === 'number' && !isNaN(_0x719627);
};
export const TelegraPh = _0x1fc540 => {
    return new Promise(async (_0x50e131, _0x47dc49) => {
        if (!_0x0_0x1e2ea9['existsSync'](_0x1fc540))
            return _0x47dc49(new Error('File\x20not\x20Found'));
        try {
            const _0x4bcb7c = new _0x0_0x2b2e5a();
            _0x4bcb7c['append']('file', _0x0_0x1e2ea9['createReadStream'](_0x1fc540));
            const _0x56ef37 = await _0x0_0x3d705c({
                'url': 'https://telegra.ph/upload',
                'method': 'POST',
                'headers': { ..._0x4bcb7c['getHeaders']() },
                'data': _0x4bcb7c
            });
            return _0x50e131('https://telegra.ph' + _0x56ef37['data'][0x0]['src']);
        } catch (_0x161252) {
            return _0x47dc49(new Error(String(_0x161252)));
        }
    });
};
export const buffergif = async _0x159f8d => {
    const _0x1dfdc0 = Math['random']()['toString'](0x24);
    const _0x2e93a4 = './XeonMedia/trash/' + _0x1dfdc0 + '.gif';
    const _0x310304 = './XeonMedia/trash/' + _0x1dfdc0 + '.mp4';
    _0x0_0x1e2ea9['writeFileSync'](_0x2e93a4, _0x159f8d);
    _0x0_0x3d5b26['exec']('ffmpeg\x20-i\x20' + _0x2e93a4 + '\x20-movflags\x20faststart\x20-pix_fmt\x20yuv420p\x20-vf\x20\x22scale=trunc(iw/2)*2:trunc(ih/2)*2\x22\x20' + _0x310304);
    await sleep(0xfa0);
    const _0x4287cb = _0x0_0x1e2ea9['readFileSync'](_0x310304);
    await Promise['all']([
        unlink(_0x310304)['catch'](() => {
        }),
        unlink(_0x2e93a4)['catch'](() => {
        })
    ]);
    return _0x4287cb;
};