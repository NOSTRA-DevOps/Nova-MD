import {
    proto,
    getContentType
} from '@whiskeysockets/baileys';
import _0x0_0x3c85f1 from 'axios';
import _0x0_0x73591a from 'moment-timezone';
import { sizeFormatter } from 'human-readable';
import _0x0_0xfa4c2b from 'util';
import _0x0_0x15013c from 'sharp';
export const unixTimestampSeconds = (_0x44e8bd = new Date()) => Math['floor'](_0x44e8bd['getTime']() / 0x3e8);
export const generateMessageTag = _0xa2db61 => {
    let _0x71d49a = unixTimestampSeconds()['toString']();
    if (_0xa2db61)
        _0x71d49a += '.--' + _0xa2db61;
    return _0x71d49a;
};
export const processTime = (_0xe5b0e3, _0x553ebb) => _0x0_0x73591a['duration'](_0x553ebb['valueOf']() - _0x0_0x73591a(_0xe5b0e3 * 0x3e8)['valueOf']())['asSeconds']();
export const getRandom = _0x11e85e => '' + Math['floor'](Math['random']() * 0x2710) + _0x11e85e;
const BROWSER_HEADERS = {
    'DNT': '1',
    'Upgrade-Insecure-Request': '1'
};
export const getBuffer = async (_0x331bf1, _0x4c221d = {}) => {
    try {
        const _0x28ac76 = await _0x0_0x3c85f1({
            'method': 'get',
            'url': _0x331bf1,
            'headers': BROWSER_HEADERS,
            ..._0x4c221d,
            'responseType': 'arraybuffer'
        });
        return _0x28ac76['data'];
    } catch (_0x492f76) {
        return _0x492f76;
    }
};
export const getImg = async (_0x382280, _0x5c20ef = {}) => {
    try {
        const _0x508fb9 = await _0x0_0x3c85f1({
            'method': 'get',
            'url': _0x382280,
            'headers': BROWSER_HEADERS,
            ..._0x5c20ef,
            'responseType': 'arraybuffer'
        });
        return _0x508fb9['data'];
    } catch (_0xc7f759) {
        return _0xc7f759;
    }
};
export const fetchJson = async (_0x20dcdc, _0x206299 = {}) => {
    try {
        const _0x2ad767 = await _0x0_0x3c85f1({
            'method': 'GET',
            'url': _0x20dcdc,
            'headers': { 'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/95.0.4638.69\x20Safari/537.36' },
            ..._0x206299
        });
        return _0x2ad767['data'];
    } catch (_0xaf429a) {
        return _0xaf429a;
    }
};
export const runtime = _0xff1eeb => {
    _0xff1eeb = Number(_0xff1eeb);
    const _0x3fe436 = Math['floor'](_0xff1eeb / (0xe10 * 0x18));
    const _0x196cde = Math['floor'](_0xff1eeb % (0xe10 * 0x18) / 0xe10);
    const _0x5196be = Math['floor'](_0xff1eeb % 0xe10 / 0x3c);
    const _0x3a0cf8 = Math['floor'](_0xff1eeb % 0x3c);
    const _0x2019f8 = _0x3fe436 > 0x0 ? _0x3fe436 + (_0x3fe436 === 0x1 ? '\x20day,\x20' : '\x20days,\x20') : '';
    const _0x2ff8fe = _0x196cde > 0x0 ? _0x196cde + (_0x196cde === 0x1 ? '\x20hour,\x20' : '\x20hours,\x20') : '';
    const _0x19ecd6 = _0x5196be > 0x0 ? _0x5196be + (_0x5196be === 0x1 ? '\x20minute,\x20' : '\x20minutes,\x20') : '';
    const _0x5a6ba6 = _0x3a0cf8 > 0x0 ? _0x3a0cf8 + (_0x3a0cf8 === 0x1 ? '\x20second' : '\x20seconds') : '';
    return _0x2019f8 + _0x2ff8fe + _0x19ecd6 + _0x5a6ba6;
};
export const clockString = _0x26db85 => {
    const _0x5417f2 = isNaN(_0x26db85) ? '--' : Math['floor'](_0x26db85 / 0x36ee80);
    const _0x2b15d3 = isNaN(_0x26db85) ? '--' : Math['floor'](_0x26db85 / 0xea60) % 0x3c;
    const _0xb5708a = isNaN(_0x26db85) ? '--' : Math['floor'](_0x26db85 / 0x3e8) % 0x3c;
    return [
        _0x5417f2,
        _0x2b15d3,
        _0xb5708a
    ]['map'](_0x3ea941 => _0x3ea941['toString']()['padStart'](0x2, '0'))['join'](':');
};
export const sleep = _0xdf8640 => new Promise(_0x29f714 => setTimeout(_0x29f714, _0xdf8640));
export const isUrl = _0x3fba04 => _0x3fba04['match'](new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'));
export const getTime = (_0x1d36c2, _0x5d3534) => {
    if (_0x5d3534)
        return _0x0_0x73591a(_0x5d3534)['locale']('en')['format'](_0x1d36c2);
    return _0x0_0x73591a['tz']('Asia/Karachi')['locale']('en')['format'](_0x1d36c2);
};
export const formatDate = (_0x5790e8, _0x4866fd = 'en') => {
    const _0x31de43 = new Date(_0x5790e8);
    return _0x31de43['toLocaleDateString'](_0x4866fd, {
        'weekday': 'long',
        'day': 'numeric',
        'month': 'long',
        'year': 'numeric',
        'hour': 'numeric',
        'minute': 'numeric',
        'second': 'numeric'
    });
};
export const tanggal = _0x29b056 => {
    const _0x6bf791 = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];
    const _0x42597 = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ];
    const _0x1b62db = new Date(_0x29b056);
    const _0xd3cc75 = _0x1b62db['getDate']();
    const _0x596af9 = _0x1b62db['getMonth']();
    const _0x4f7732 = _0x42597[_0x1b62db['getDay']()];
    const _0x51f73b = _0x1b62db['getFullYear']();
    const _0x2fa6a7 = _0x51f73b < 0x3e8 ? _0x51f73b + 0x76c : _0x51f73b;
    return _0x4f7732 + ',\x20' + _0xd3cc75 + '\x20-\x20' + _0x6bf791[_0x596af9] + '\x20-\x20' + _0x2fa6a7;
};
export const jam = (_0x1c3d9a, _0x236133 = {}) => {
    const _0x583c8d = _0x236133['format'] ?? 'HH:mm';
    const _0x4e1809 = _0x236133['timeZone'] ? _0x0_0x73591a(_0x1c3d9a)['tz'](_0x236133['timeZone'])['format'](_0x583c8d) : _0x0_0x73591a(_0x1c3d9a)['format'](_0x583c8d);
    return _0x4e1809;
};
export const formatp = sizeFormatter({
    'std': 'JEDEC',
    'decimalPlaces': 0x2,
    'keepTrailingZeroes': ![],
    'render': (_0x7a3b2e, _0x422fce) => _0x7a3b2e + '\x20' + _0x422fce + 'B'
});
export const json = _0x57c502 => JSON['stringify'](_0x57c502, null, 0x2);
export const logic = (_0x1dda80, _0x31d565, _0x45c57f) => {
    if (_0x31d565['length'] !== _0x45c57f['length'])
        throw new Error('Input\x20and\x20Output\x20must\x20have\x20same\x20length');
    for (let _0x556e26 = 0x0; _0x556e26 < _0x31d565['length']; _0x556e26++) {
        if (_0x0_0xfa4c2b['isDeepStrictEqual'](_0x1dda80, _0x31d565[_0x556e26]))
            return _0x45c57f[_0x556e26];
    }
    return null;
};
export const generateProfilePicture = async _0x7e0a60 => {
    const _0x350851 = _0x0_0x15013c(_0x7e0a60);
    const {
        width: width = 0x0,
        height: height = 0x0
    } = await _0x350851['metadata']();
    const _0x57ac9f = Math['min'](width, height);
    const _0x220915 = await _0x350851['extract']({
        'left': 0x0,
        'top': 0x0,
        'width': _0x57ac9f,
        'height': _0x57ac9f
    })['resize'](0x2d0, 0x2d0)['jpeg']()['toBuffer']();
    return {
        'img': _0x220915,
        'preview': _0x220915
    };
};
export const reSize = async (_0x3cf324, _0x29b335, _0x4a52b7) => _0x0_0x15013c(_0x3cf324)['resize'](_0x29b335, _0x4a52b7)['jpeg']()['toBuffer']();
export const bytesToSize = (_0x4e0d32, _0x1724b7 = 0x2) => {
    if (_0x4e0d32 === 0x0)
        return '0\x20Bytes';
    const _0x28f9f5 = 0x400;
    const _0x2752bd = _0x1724b7 < 0x0 ? 0x0 : _0x1724b7;
    const _0x4d5122 = [
        'Bytes',
        'KB',
        'MB',
        'GB',
        'TB',
        'PB',
        'EB',
        'ZB',
        'YB'
    ];
    const _0x332365 = Math['floor'](Math['log'](_0x4e0d32) / Math['log'](_0x28f9f5));
    return parseFloat((_0x4e0d32 / Math['pow'](_0x28f9f5, _0x332365))['toFixed'](_0x2752bd)) + '\x20' + _0x4d5122[_0x332365];
};
export const getSizeMedia = _0xbb9d98 => {
    return new Promise((_0x336bf4, _0x23d3c2) => {
        if (typeof _0xbb9d98 === 'string' && /http/['test'](_0xbb9d98)) {
            _0x0_0x3c85f1['get'](_0xbb9d98)['then'](_0x2e8827 => {
                const _0x1388d9 = parseInt(_0x2e8827['headers']['content-length'], 0xa);
                const _0x11fa61 = bytesToSize(_0x1388d9, 0x3);
                if (!isNaN(_0x1388d9))
                    _0x336bf4(_0x11fa61);
                else
                    _0x23d3c2('Invalid\x20content-length');
            })['catch'](_0x23d3c2);
        } else if (Buffer['isBuffer'](_0xbb9d98)) {
            const _0x2b258e = Buffer['byteLength'](_0xbb9d98);
            const _0x2aeadc = bytesToSize(_0x2b258e, 0x3);
            if (!isNaN(_0x2b258e))
                _0x336bf4(_0x2aeadc);
            else
                _0x23d3c2('Invalid\x20buffer\x20length');
        } else {
            _0x23d3c2('Invalid\x20input:\x20must\x20be\x20a\x20URL\x20string\x20or\x20Buffer');
        }
    });
};
export const parseMention = (_0x2e0b2b = '') => [..._0x2e0b2b['matchAll'](/@([0-9]{5,16}|0)/g)]['map'](_0x316f32 => _0x316f32[0x1] + '@s.whatsapp.net');
export const getGroupAdmins = _0x4c6ffb => {
    const _0x413917 = [];
    for (const _0x214caa of _0x4c6ffb) {
        if (_0x214caa['admin'] === 'superadmin' || _0x214caa['admin'] === 'admin')
            _0x413917['push'](_0x214caa['id']);
    }
    return _0x413917;
};
export const smsg = (_0x10df84, _0x4b2515, _0x11a821) => {
    if (!_0x4b2515)
        return _0x4b2515;
    const _0x3a95c7 = proto['WebMessageInfo'];
    if (_0x4b2515['key']) {
        _0x4b2515['id'] = _0x4b2515['key']['id'];
        _0x4b2515['isBaileys'] = _0x4b2515['id']['startsWith']('BAE5') && _0x4b2515['id']['length'] === 0x10;
        _0x4b2515['chat'] = _0x4b2515['key']['remoteJid'];
        _0x4b2515['fromMe'] = _0x4b2515['key']['fromMe'];
        _0x4b2515['isGroup'] = _0x4b2515['chat']['endsWith']('@g.us');
        _0x4b2515['sender'] = _0x10df84['decodeJid'](_0x4b2515['fromMe'] && _0x10df84['user']['id'] || _0x4b2515['participant'] || _0x4b2515['key']['participant'] || _0x4b2515['chat'] || '');
        if (_0x4b2515['isGroup'])
            _0x4b2515['participant'] = _0x10df84['decodeJid'](_0x4b2515['key']['participant']) || '';
    }
    if (_0x4b2515['message']) {
        _0x4b2515['mtype'] = getContentType(_0x4b2515['message']);
        _0x4b2515['msg'] = _0x4b2515['mtype'] === 'viewOnceMessage' ? _0x4b2515['message'][_0x4b2515['mtype']]['message'][getContentType(_0x4b2515['message'][_0x4b2515['mtype']]['message'])] : _0x4b2515['message'][_0x4b2515['mtype']];
        _0x4b2515['body'] = _0x4b2515['message']['conversation'] || _0x4b2515['msg']?.['caption'] || _0x4b2515['msg']?.['text'] || _0x4b2515['mtype'] === 'listResponseMessage' && _0x4b2515['msg']?.['singleSelectReply']?.['selectedRowId'] || _0x4b2515['mtype'] === 'buttonsResponseMessage' && _0x4b2515['msg']?.['selectedButtonId'] || _0x4b2515['mtype'] === 'viewOnceMessage' && _0x4b2515['msg']?.['caption'] || _0x4b2515['text'];
        const _0x16a5f4 = _0x4b2515['quoted'] = _0x4b2515['msg']?.['contextInfo'] ? _0x4b2515['msg']['contextInfo']['quotedMessage'] : null;
        _0x4b2515['mentionedJid'] = _0x4b2515['msg']?.['contextInfo'] ? _0x4b2515['msg']['contextInfo']['mentionedJid'] : [];
        if (_0x4b2515['quoted']) {
            let _0x5ab7e6 = getContentType(_0x16a5f4);
            _0x4b2515['quoted'] = _0x4b2515['quoted'][_0x5ab7e6];
            if (['productMessage']['includes'](_0x5ab7e6)) {
                _0x5ab7e6 = getContentType(_0x4b2515['quoted']);
                _0x4b2515['quoted'] = _0x4b2515['quoted'][_0x5ab7e6];
            }
            if (typeof _0x4b2515['quoted'] === 'string')
                _0x4b2515['quoted'] = { 'text': _0x4b2515['quoted'] };
            _0x4b2515['quoted']['mtype'] = _0x5ab7e6;
            _0x4b2515['quoted']['id'] = _0x4b2515['msg']['contextInfo']['stanzaId'];
            _0x4b2515['quoted']['chat'] = _0x4b2515['msg']['contextInfo']['remoteJid'] || _0x4b2515['chat'];
            _0x4b2515['quoted']['isBaileys'] = _0x4b2515['quoted']['id'] ? _0x4b2515['quoted']['id']['startsWith']('BAE5') && _0x4b2515['quoted']['id']['length'] === 0x10 : ![];
            _0x4b2515['quoted']['sender'] = _0x10df84['decodeJid'](_0x4b2515['msg']['contextInfo']['participant']);
            _0x4b2515['quoted']['fromMe'] = _0x4b2515['quoted']['sender'] === (_0x10df84['user'] && _0x10df84['user']['id']);
            _0x4b2515['quoted']['text'] = _0x4b2515['quoted']['text'] || _0x4b2515['quoted']['caption'] || _0x4b2515['quoted']['conversation'] || _0x4b2515['quoted']['contentText'] || _0x4b2515['quoted']['selectedDisplayText'] || _0x4b2515['quoted']['title'] || '';
            _0x4b2515['quoted']['mentionedJid'] = _0x4b2515['msg']['contextInfo'] ? _0x4b2515['msg']['contextInfo']['mentionedJid'] : [];
            _0x4b2515['getQuotedObj'] = _0x4b2515['getQuotedMessage'] = async () => {
                if (!_0x4b2515['quoted']['id'])
                    return ![];
                const _0x28a9ea = await _0x11a821['loadMessage'](_0x4b2515['chat'], _0x4b2515['quoted']['id'], _0x10df84);
                return smsg(_0x10df84, _0x28a9ea, _0x11a821);
            };
            const _0x42af13 = _0x4b2515['quoted']['fakeObj'] = _0x3a95c7['fromObject']({
                'key': {
                    'remoteJid': _0x4b2515['quoted']['chat'],
                    'fromMe': _0x4b2515['quoted']['fromMe'],
                    'id': _0x4b2515['quoted']['id']
                },
                'message': _0x16a5f4,
                ..._0x4b2515['isGroup'] ? { 'participant': _0x4b2515['quoted']['sender'] } : {}
            });
            _0x4b2515['quoted']['delete'] = () => _0x10df84['sendMessage'](_0x4b2515['quoted']['chat'], { 'delete': _0x42af13['key'] });
            _0x4b2515['quoted']['copyNForward'] = (_0x589811, _0x49f27b = ![], _0x2308a2 = {}) => _0x10df84['copyNForward'](_0x589811, _0x42af13, _0x49f27b, _0x2308a2);
            _0x4b2515['quoted']['download'] = () => _0x10df84['downloadMediaMessage'](_0x4b2515['quoted']);
        }
    }
    if (_0x4b2515['msg']?.['url'])
        _0x4b2515['download'] = () => _0x10df84['downloadMediaMessage'](_0x4b2515['msg']);
    _0x4b2515['text'] = _0x4b2515['msg']?.['text'] || _0x4b2515['msg']?.['caption'] || _0x4b2515['message']?.['conversation'] || _0x4b2515['msg']?.['contentText'] || _0x4b2515['msg']?.['selectedDisplayText'] || _0x4b2515['msg']?.['title'] || '';
    _0x4b2515['reply'] = (_0x5d6e25, _0xc0f80 = _0x4b2515['chat'], _0x2a7c02 = {}) => Buffer['isBuffer'](_0x5d6e25) ? _0x10df84['sendMedia'](_0xc0f80, _0x5d6e25, 'file', '', _0x4b2515, { ..._0x2a7c02 }) : _0x10df84['sendText'](_0xc0f80, _0x5d6e25, _0x4b2515, { ..._0x2a7c02 });
    _0x4b2515['copy'] = () => smsg(_0x10df84, _0x3a95c7['fromObject'](_0x3a95c7['toObject'](_0x4b2515)), _0x11a821);
    _0x4b2515['copyNForward'] = (_0x19d049 = _0x4b2515['chat'], _0x24ac73 = ![], _0x2dea03 = {}) => _0x10df84['copyNForward'](_0x19d049, _0x4b2515, _0x24ac73, _0x2dea03);
    return _0x4b2515;
};