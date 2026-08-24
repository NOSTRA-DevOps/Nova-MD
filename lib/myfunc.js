import {
    proto,
    getContentType
} from '@whiskeysockets/baileys';
import _0x0_0x12a6fd from 'axios';
import _0x0_0xd7401b from 'moment-timezone';
import { sizeFormatter } from 'human-readable';
import _0x0_0x5e6b0b from 'util';
import _0x0_0x49f33f from 'sharp';
export const unixTimestampSeconds = (_0x3c7992 = new Date()) => Math['floor'](_0x3c7992['getTime']() / 0x3e8);
export const generateMessageTag = _0x13d09a => {
    let _0x2568d4 = unixTimestampSeconds()['toString']();
    if (_0x13d09a)
        _0x2568d4 += '.--' + _0x13d09a;
    return _0x2568d4;
};
export const processTime = (_0x2bb11a, _0x132bfb) => _0x0_0xd7401b['duration'](_0x132bfb['valueOf']() - _0x0_0xd7401b(_0x2bb11a * 0x3e8)['valueOf']())['asSeconds']();
export const getRandom = _0x563d42 => '' + Math['floor'](Math['random']() * 0x2710) + _0x563d42;
const BROWSER_HEADERS = {
    'DNT': '1',
    'Upgrade-Insecure-Request': '1'
};
export const getBuffer = async (_0x4d807e, _0x61bb02 = {}) => {
    try {
        const _0x64b247 = await _0x0_0x12a6fd({
            'method': 'get',
            'url': _0x4d807e,
            'headers': BROWSER_HEADERS,
            ..._0x61bb02,
            'responseType': 'arraybuffer'
        });
        return _0x64b247['data'];
    } catch (_0x5198b4) {
        return _0x5198b4;
    }
};
export const getImg = async (_0x4c2dd6, _0x2524ae = {}) => {
    try {
        const _0x5cd17f = await _0x0_0x12a6fd({
            'method': 'get',
            'url': _0x4c2dd6,
            'headers': BROWSER_HEADERS,
            ..._0x2524ae,
            'responseType': 'arraybuffer'
        });
        return _0x5cd17f['data'];
    } catch (_0x57765d) {
        return _0x57765d;
    }
};
export const fetchJson = async (_0x4d74d2, _0x16d68d = {}) => {
    try {
        const _0x9785db = await _0x0_0x12a6fd({
            'method': 'GET',
            'url': _0x4d74d2,
            'headers': { 'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/95.0.4638.69\x20Safari/537.36' },
            ..._0x16d68d
        });
        return _0x9785db['data'];
    } catch (_0x3c0704) {
        return _0x3c0704;
    }
};
export const runtime = _0x470da1 => {
    _0x470da1 = Number(_0x470da1);
    const _0x5e6f96 = Math['floor'](_0x470da1 / (0xe10 * 0x18));
    const _0x70d262 = Math['floor'](_0x470da1 % (0xe10 * 0x18) / 0xe10);
    const _0x26fcb3 = Math['floor'](_0x470da1 % 0xe10 / 0x3c);
    const _0x81ece3 = Math['floor'](_0x470da1 % 0x3c);
    const _0x2f74fa = _0x5e6f96 > 0x0 ? _0x5e6f96 + (_0x5e6f96 === 0x1 ? '\x20day,\x20' : '\x20days,\x20') : '';
    const _0x3e9b6e = _0x70d262 > 0x0 ? _0x70d262 + (_0x70d262 === 0x1 ? '\x20hour,\x20' : '\x20hours,\x20') : '';
    const _0x39ff5f = _0x26fcb3 > 0x0 ? _0x26fcb3 + (_0x26fcb3 === 0x1 ? '\x20minute,\x20' : '\x20minutes,\x20') : '';
    const _0x107f05 = _0x81ece3 > 0x0 ? _0x81ece3 + (_0x81ece3 === 0x1 ? '\x20second' : '\x20seconds') : '';
    return _0x2f74fa + _0x3e9b6e + _0x39ff5f + _0x107f05;
};
export const clockString = _0x45886b => {
    const _0x1b8a2f = isNaN(_0x45886b) ? '--' : Math['floor'](_0x45886b / 0x36ee80);
    const _0x5c4af4 = isNaN(_0x45886b) ? '--' : Math['floor'](_0x45886b / 0xea60) % 0x3c;
    const _0x4f7752 = isNaN(_0x45886b) ? '--' : Math['floor'](_0x45886b / 0x3e8) % 0x3c;
    return [
        _0x1b8a2f,
        _0x5c4af4,
        _0x4f7752
    ]['map'](_0x203a09 => _0x203a09['toString']()['padStart'](0x2, '0'))['join'](':');
};
export const sleep = _0x15041f => new Promise(_0x48aa3f => setTimeout(_0x48aa3f, _0x15041f));
export const isUrl = _0x3cafd4 => _0x3cafd4['match'](new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'));
export const getTime = (_0x12412a, _0x3d9b75) => {
    if (_0x3d9b75)
        return _0x0_0xd7401b(_0x3d9b75)['locale']('en')['format'](_0x12412a);
    return _0x0_0xd7401b['tz']('Asia/Karachi')['locale']('en')['format'](_0x12412a);
};
export const formatDate = (_0x2bb8bb, _0x23aa86 = 'en') => {
    const _0x14dee4 = new Date(_0x2bb8bb);
    return _0x14dee4['toLocaleDateString'](_0x23aa86, {
        'weekday': 'long',
        'day': 'numeric',
        'month': 'long',
        'year': 'numeric',
        'hour': 'numeric',
        'minute': 'numeric',
        'second': 'numeric'
    });
};
export const tanggal = _0x4e5e83 => {
    const _0x1df153 = [
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
    const _0x1889dd = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ];
    const _0xb58ef6 = new Date(_0x4e5e83);
    const _0xf1c7d5 = _0xb58ef6['getDate']();
    const _0x5cb86b = _0xb58ef6['getMonth']();
    const _0x8c213 = _0x1889dd[_0xb58ef6['getDay']()];
    const _0x54e740 = _0xb58ef6['getFullYear']();
    const _0xdc1325 = _0x54e740 < 0x3e8 ? _0x54e740 + 0x76c : _0x54e740;
    return _0x8c213 + ',\x20' + _0xf1c7d5 + '\x20-\x20' + _0x1df153[_0x5cb86b] + '\x20-\x20' + _0xdc1325;
};
export const jam = (_0x19c7af, _0x296b87 = {}) => {
    const _0x1a531f = _0x296b87['format'] ?? 'HH:mm';
    const _0x18af15 = _0x296b87['timeZone'] ? _0x0_0xd7401b(_0x19c7af)['tz'](_0x296b87['timeZone'])['format'](_0x1a531f) : _0x0_0xd7401b(_0x19c7af)['format'](_0x1a531f);
    return _0x18af15;
};
export const formatp = sizeFormatter({
    'std': 'JEDEC',
    'decimalPlaces': 0x2,
    'keepTrailingZeroes': ![],
    'render': (_0x2363a6, _0x1c273c) => _0x2363a6 + '\x20' + _0x1c273c + 'B'
});
export const json = _0x3e2ea0 => JSON['stringify'](_0x3e2ea0, null, 0x2);
export const logic = (_0x3fb3f4, _0x2927ac, _0x19d583) => {
    if (_0x2927ac['length'] !== _0x19d583['length'])
        throw new Error('Input\x20and\x20Output\x20must\x20have\x20same\x20length');
    for (let _0x433fc6 = 0x0; _0x433fc6 < _0x2927ac['length']; _0x433fc6++) {
        if (_0x0_0x5e6b0b['isDeepStrictEqual'](_0x3fb3f4, _0x2927ac[_0x433fc6]))
            return _0x19d583[_0x433fc6];
    }
    return null;
};
export const generateProfilePicture = async _0x162d92 => {
    const _0x3dbbe7 = _0x0_0x49f33f(_0x162d92);
    const {
        width: width = 0x0,
        height: height = 0x0
    } = await _0x3dbbe7['metadata']();
    const _0x38e4be = Math['min'](width, height);
    const _0x289e7b = await _0x3dbbe7['extract']({
        'left': 0x0,
        'top': 0x0,
        'width': _0x38e4be,
        'height': _0x38e4be
    })['resize'](0x2d0, 0x2d0)['jpeg']()['toBuffer']();
    return {
        'img': _0x289e7b,
        'preview': _0x289e7b
    };
};
export const reSize = async (_0x47fb9f, _0x302839, _0x58feac) => _0x0_0x49f33f(_0x47fb9f)['resize'](_0x302839, _0x58feac)['jpeg']()['toBuffer']();
export const bytesToSize = (_0x14bcf5, _0x5982d0 = 0x2) => {
    if (_0x14bcf5 === 0x0)
        return '0\x20Bytes';
    const _0x334ecd = 0x400;
    const _0x580fa1 = _0x5982d0 < 0x0 ? 0x0 : _0x5982d0;
    const _0x4a8e6c = [
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
    const _0x20c7fb = Math['floor'](Math['log'](_0x14bcf5) / Math['log'](_0x334ecd));
    return parseFloat((_0x14bcf5 / Math['pow'](_0x334ecd, _0x20c7fb))['toFixed'](_0x580fa1)) + '\x20' + _0x4a8e6c[_0x20c7fb];
};
export const getSizeMedia = _0x44ee4c => {
    return new Promise((_0x56dddb, _0x13f07c) => {
        if (typeof _0x44ee4c === 'string' && /http/['test'](_0x44ee4c)) {
            _0x0_0x12a6fd['get'](_0x44ee4c)['then'](_0x4c718a => {
                const _0x2eb241 = parseInt(_0x4c718a['headers']['content-length'], 0xa);
                const _0xa1931a = bytesToSize(_0x2eb241, 0x3);
                if (!isNaN(_0x2eb241))
                    _0x56dddb(_0xa1931a);
                else
                    _0x13f07c('Invalid\x20content-length');
            })['catch'](_0x13f07c);
        } else if (Buffer['isBuffer'](_0x44ee4c)) {
            const _0x318bf0 = Buffer['byteLength'](_0x44ee4c);
            const _0x2dac29 = bytesToSize(_0x318bf0, 0x3);
            if (!isNaN(_0x318bf0))
                _0x56dddb(_0x2dac29);
            else
                _0x13f07c('Invalid\x20buffer\x20length');
        } else {
            _0x13f07c('Invalid\x20input:\x20must\x20be\x20a\x20URL\x20string\x20or\x20Buffer');
        }
    });
};
export const parseMention = (_0x23b4d1 = '') => [..._0x23b4d1['matchAll'](/@([0-9]{5,16}|0)/g)]['map'](_0x1d4f71 => _0x1d4f71[0x1] + '@s.whatsapp.net');
export const getGroupAdmins = _0x20f5aa => {
    const _0xb8af9b = [];
    for (const _0x16e2c7 of _0x20f5aa) {
        if (_0x16e2c7['admin'] === 'superadmin' || _0x16e2c7['admin'] === 'admin')
            _0xb8af9b['push'](_0x16e2c7['id']);
    }
    return _0xb8af9b;
};
export const smsg = (_0x14ee3b, _0x1c5e03, _0x28a400) => {
    if (!_0x1c5e03)
        return _0x1c5e03;
    const _0xe9aabb = proto['WebMessageInfo'];
    if (_0x1c5e03['key']) {
        _0x1c5e03['id'] = _0x1c5e03['key']['id'];
        _0x1c5e03['isBaileys'] = _0x1c5e03['id']['startsWith']('BAE5') && _0x1c5e03['id']['length'] === 0x10;
        _0x1c5e03['chat'] = _0x1c5e03['key']['remoteJid'];
        _0x1c5e03['fromMe'] = _0x1c5e03['key']['fromMe'];
        _0x1c5e03['isGroup'] = _0x1c5e03['chat']['endsWith']('@g.us');
        _0x1c5e03['sender'] = _0x14ee3b['decodeJid'](_0x1c5e03['fromMe'] && _0x14ee3b['user']['id'] || _0x1c5e03['participant'] || _0x1c5e03['key']['participant'] || _0x1c5e03['chat'] || '');
        if (_0x1c5e03['isGroup'])
            _0x1c5e03['participant'] = _0x14ee3b['decodeJid'](_0x1c5e03['key']['participant']) || '';
    }
    if (_0x1c5e03['message']) {
        _0x1c5e03['mtype'] = getContentType(_0x1c5e03['message']);
        _0x1c5e03['msg'] = _0x1c5e03['mtype'] === 'viewOnceMessage' ? _0x1c5e03['message'][_0x1c5e03['mtype']]['message'][getContentType(_0x1c5e03['message'][_0x1c5e03['mtype']]['message'])] : _0x1c5e03['message'][_0x1c5e03['mtype']];
        _0x1c5e03['body'] = _0x1c5e03['message']['conversation'] || _0x1c5e03['msg']?.['caption'] || _0x1c5e03['msg']?.['text'] || _0x1c5e03['mtype'] === 'listResponseMessage' && _0x1c5e03['msg']?.['singleSelectReply']?.['selectedRowId'] || _0x1c5e03['mtype'] === 'buttonsResponseMessage' && _0x1c5e03['msg']?.['selectedButtonId'] || _0x1c5e03['mtype'] === 'viewOnceMessage' && _0x1c5e03['msg']?.['caption'] || _0x1c5e03['text'];
        const _0x5afd85 = _0x1c5e03['quoted'] = _0x1c5e03['msg']?.['contextInfo'] ? _0x1c5e03['msg']['contextInfo']['quotedMessage'] : null;
        _0x1c5e03['mentionedJid'] = _0x1c5e03['msg']?.['contextInfo'] ? _0x1c5e03['msg']['contextInfo']['mentionedJid'] : [];
        if (_0x1c5e03['quoted']) {
            let _0x47d663 = getContentType(_0x5afd85);
            _0x1c5e03['quoted'] = _0x1c5e03['quoted'][_0x47d663];
            if (['productMessage']['includes'](_0x47d663)) {
                _0x47d663 = getContentType(_0x1c5e03['quoted']);
                _0x1c5e03['quoted'] = _0x1c5e03['quoted'][_0x47d663];
            }
            if (typeof _0x1c5e03['quoted'] === 'string')
                _0x1c5e03['quoted'] = { 'text': _0x1c5e03['quoted'] };
            _0x1c5e03['quoted']['mtype'] = _0x47d663;
            _0x1c5e03['quoted']['id'] = _0x1c5e03['msg']['contextInfo']['stanzaId'];
            _0x1c5e03['quoted']['chat'] = _0x1c5e03['msg']['contextInfo']['remoteJid'] || _0x1c5e03['chat'];
            _0x1c5e03['quoted']['isBaileys'] = _0x1c5e03['quoted']['id'] ? _0x1c5e03['quoted']['id']['startsWith']('BAE5') && _0x1c5e03['quoted']['id']['length'] === 0x10 : ![];
            _0x1c5e03['quoted']['sender'] = _0x14ee3b['decodeJid'](_0x1c5e03['msg']['contextInfo']['participant']);
            _0x1c5e03['quoted']['fromMe'] = _0x1c5e03['quoted']['sender'] === (_0x14ee3b['user'] && _0x14ee3b['user']['id']);
            _0x1c5e03['quoted']['text'] = _0x1c5e03['quoted']['text'] || _0x1c5e03['quoted']['caption'] || _0x1c5e03['quoted']['conversation'] || _0x1c5e03['quoted']['contentText'] || _0x1c5e03['quoted']['selectedDisplayText'] || _0x1c5e03['quoted']['title'] || '';
            _0x1c5e03['quoted']['mentionedJid'] = _0x1c5e03['msg']['contextInfo'] ? _0x1c5e03['msg']['contextInfo']['mentionedJid'] : [];
            _0x1c5e03['getQuotedObj'] = _0x1c5e03['getQuotedMessage'] = async () => {
                if (!_0x1c5e03['quoted']['id'])
                    return ![];
                const _0x8e11e9 = await _0x28a400['loadMessage'](_0x1c5e03['chat'], _0x1c5e03['quoted']['id'], _0x14ee3b);
                return smsg(_0x14ee3b, _0x8e11e9, _0x28a400);
            };
            const _0x4466e9 = _0x1c5e03['quoted']['fakeObj'] = _0xe9aabb['fromObject']({
                'key': {
                    'remoteJid': _0x1c5e03['quoted']['chat'],
                    'fromMe': _0x1c5e03['quoted']['fromMe'],
                    'id': _0x1c5e03['quoted']['id']
                },
                'message': _0x5afd85,
                ..._0x1c5e03['isGroup'] ? { 'participant': _0x1c5e03['quoted']['sender'] } : {}
            });
            _0x1c5e03['quoted']['delete'] = () => _0x14ee3b['sendMessage'](_0x1c5e03['quoted']['chat'], { 'delete': _0x4466e9['key'] });
            _0x1c5e03['quoted']['copyNForward'] = (_0x35ce34, _0x353657 = ![], _0x1743d5 = {}) => _0x14ee3b['copyNForward'](_0x35ce34, _0x4466e9, _0x353657, _0x1743d5);
            _0x1c5e03['quoted']['download'] = () => _0x14ee3b['downloadMediaMessage'](_0x1c5e03['quoted']);
        }
    }
    if (_0x1c5e03['msg']?.['url'])
        _0x1c5e03['download'] = () => _0x14ee3b['downloadMediaMessage'](_0x1c5e03['msg']);
    _0x1c5e03['text'] = _0x1c5e03['msg']?.['text'] || _0x1c5e03['msg']?.['caption'] || _0x1c5e03['message']?.['conversation'] || _0x1c5e03['msg']?.['contentText'] || _0x1c5e03['msg']?.['selectedDisplayText'] || _0x1c5e03['msg']?.['title'] || '';
    _0x1c5e03['reply'] = (_0x42a98c, _0x3c6b1c = _0x1c5e03['chat'], _0x3c43e9 = {}) => Buffer['isBuffer'](_0x42a98c) ? _0x14ee3b['sendMedia'](_0x3c6b1c, _0x42a98c, 'file', '', _0x1c5e03, { ..._0x3c43e9 }) : _0x14ee3b['sendText'](_0x3c6b1c, _0x42a98c, _0x1c5e03, { ..._0x3c43e9 });
    _0x1c5e03['copy'] = () => smsg(_0x14ee3b, _0xe9aabb['fromObject'](_0xe9aabb['toObject'](_0x1c5e03)), _0x28a400);
    _0x1c5e03['copyNForward'] = (_0x15f678 = _0x1c5e03['chat'], _0x514b0f = ![], _0x21c38b = {}) => _0x14ee3b['copyNForward'](_0x15f678, _0x1c5e03, _0x514b0f, _0x21c38b);
    return _0x1c5e03;
};