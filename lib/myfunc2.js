import _0x0_0x13f825 from 'axios';
import * as _0x0_0x5d5515 from 'cheerio';
import _0x0_0x1a1ea7 from 'form-data';
import _0x0_0xd3e73c, { promises as _0x0_0x553919 } from 'fs';
import _0x0_0xbc9550 from 'child_process';
const {unlink} = _0x0_0x553919;
const DEFAULT_HEADERS = { 'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/95.0.4638.69\x20Safari/537.36' };
export const sleep = _0x1c91a2 => {
    return new Promise(_0x4ee584 => setTimeout(_0x4ee584, _0x1c91a2));
};
export const fetchJson = async (_0x29c066, _0x54e6ee = {}) => {
    try {
        const _0x21106f = await _0x0_0x13f825({
            'method': 'GET',
            'url': _0x29c066,
            'headers': DEFAULT_HEADERS,
            ..._0x54e6ee
        });
        return _0x21106f['data'];
    } catch (_0x29bff7) {
        return _0x29bff7;
    }
};
export const fetchBuffer = async (_0x3e527e, _0x1c4d79 = {}) => {
    try {
        const _0x21cc7d = await _0x0_0x13f825({
            'method': 'GET',
            'url': _0x3e527e,
            'headers': {
                'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/78.0.3904.70\x20Safari/537.36',
                'DNT': '1',
                'Upgrade-Insecure-Request': '1'
            },
            ..._0x1c4d79,
            'responseType': 'arraybuffer'
        });
        return _0x21cc7d['data'];
    } catch (_0x32a82a) {
        return _0x32a82a;
    }
};
export const webp2mp4File = _0x5df6a9 => {
    return new Promise((_0x392a2f, _0xf911ae) => {
        const _0x39649e = new _0x0_0x1a1ea7();
        _0x39649e['append']('new-image-url', '');
        _0x39649e['append']('new-image', _0x0_0xd3e73c['createReadStream'](_0x5df6a9));
        _0x0_0x13f825({
            'method': 'post',
            'url': 'https://s6.ezgif.com/webp-to-mp4',
            'data': _0x39649e,
            'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x39649e['_boundary'] }
        })['then'](({data: _0xabadde}) => {
            const _0x34a950 = new _0x0_0x1a1ea7();
            const _0x4b0206 = _0x0_0x5d5515['load'](_0xabadde);
            const _0x387383 = _0x4b0206('input[name=\x22file\x22]')['attr']('value');
            _0x34a950['append']('file', _0x387383);
            _0x34a950['append']('convert', 'Convert\x20WebP\x20to\x20MP4!');
            _0x0_0x13f825({
                'method': 'post',
                'url': 'https://ezgif.com/webp-to-mp4/' + _0x387383,
                'data': _0x34a950,
                'headers': { 'Content-Type': 'multipart/form-data;\x20boundary=' + _0x34a950['_boundary'] }
            })['then'](({data: _0x1d93b9}) => {
                const _0x168aa4 = _0x0_0x5d5515['load'](_0x1d93b9);
                const _0x30137d = 'https:' + _0x168aa4('div#output\x20>\x20p.outfile\x20>\x20video\x20>\x20source')['attr']('src');
                _0x392a2f({
                    'status': !![],
                    'message': 'Created\x20By\x20Eternity',
                    'result': _0x30137d
                });
            })['catch'](_0xf911ae);
        })['catch'](_0xf911ae);
    });
};
export const fetchUrl = async (_0x8c94a1, _0x5efee4 = {}) => {
    try {
        const _0x154ad7 = await _0x0_0x13f825({
            'method': 'GET',
            'url': _0x8c94a1,
            'headers': DEFAULT_HEADERS,
            ..._0x5efee4
        });
        return _0x154ad7['data'];
    } catch (_0xc30fbe) {
        return _0xc30fbe;
    }
};
export const WAVersion = async () => {
    const _0x27212f = await fetchUrl('https://web.whatsapp.com/check-update?version=1&platform=web');
    const _0x5c722a = [_0x27212f['currentVersion']['replace'](/[.]/g, ',\x20')];
    return _0x5c722a;
};
export const getRandom = _0x564e82 => {
    return '' + Math['floor'](Math['random']() * 0x2710) + _0x564e82;
};
export const isUrl = _0x33bfda => {
    return _0x33bfda['match'](new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/, 'gi'));
};
export const isNumber = _0x55b25a => {
    const _0x49ed43 = parseInt(String(_0x55b25a), 0xa);
    return typeof _0x49ed43 === 'number' && !isNaN(_0x49ed43);
};
export const TelegraPh = _0x1081c2 => {
    return new Promise(async (_0x2823bd, _0x2c8fe4) => {
        if (!_0x0_0xd3e73c['existsSync'](_0x1081c2))
            return _0x2c8fe4(new Error('File\x20not\x20Found'));
        try {
            const _0x1d7534 = new _0x0_0x1a1ea7();
            _0x1d7534['append']('file', _0x0_0xd3e73c['createReadStream'](_0x1081c2));
            const _0x11d1ba = await _0x0_0x13f825({
                'url': 'https://telegra.ph/upload',
                'method': 'POST',
                'headers': { ..._0x1d7534['getHeaders']() },
                'data': _0x1d7534
            });
            return _0x2823bd('https://telegra.ph' + _0x11d1ba['data'][0x0]['src']);
        } catch (_0x4da1cd) {
            return _0x2c8fe4(new Error(String(_0x4da1cd)));
        }
    });
};
export const buffergif = async _0x8f51fe => {
    const _0x4a9b8e = Math['random']()['toString'](0x24);
    const _0x280bda = './XeonMedia/trash/' + _0x4a9b8e + '.gif';
    const _0x5c8777 = './XeonMedia/trash/' + _0x4a9b8e + '.mp4';
    _0x0_0xd3e73c['writeFileSync'](_0x280bda, _0x8f51fe);
    _0x0_0xbc9550['exec']('ffmpeg\x20-i\x20' + _0x280bda + '\x20-movflags\x20faststart\x20-pix_fmt\x20yuv420p\x20-vf\x20\x22scale=trunc(iw/2)*2:trunc(ih/2)*2\x22\x20' + _0x5c8777);
    await sleep(0xfa0);
    const _0x1b4b9e = _0x0_0xd3e73c['readFileSync'](_0x5c8777);
    await Promise['all']([
        unlink(_0x5c8777)['catch'](() => {
        }),
        unlink(_0x280bda)['catch'](() => {
        })
    ]);
    return _0x1b4b9e;
};