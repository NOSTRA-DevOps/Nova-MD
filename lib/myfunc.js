import {
    proto,
    getContentType
} from '@whiskeysockets/baileys';
import _0x0_0x583fd3 from 'axios';
import _0x0_0x2a37c6 from 'moment-timezone';
import { sizeFormatter } from 'human-readable';
import _0x0_0x34338a from 'util';
import _0x0_0x31d512 from 'sharp';
export const unixTimestampSeconds = (_0xd0a617 = new Date()) => Math['floor'](_0xd0a617['getTime']() / 0x3e8);
export const generateMessageTag = _0x58268b => {
    let _0x42c199 = unixTimestampSeconds()['toString']();
    if (_0x58268b)
        _0x42c199 += '.--' + _0x58268b;
    return _0x42c199;
};
export const processTime = (_0x4db696, _0x2d766e) => _0x0_0x2a37c6['duration'](_0x2d766e['valueOf']() - _0x0_0x2a37c6(_0x4db696 * 0x3e8)['valueOf']())['asSeconds']();
export const getRandom = _0x577c93 => '' + Math['floor'](Math['random']() * 0x2710) + _0x577c93;
const BROWSER_HEADERS = {
    'DNT': '1',
    'Upgrade-Insecure-Request': '1'
};
export const getBuffer = async (_0x574bbc, _0x4923df = {}) => {
    try {
        const _0xc47f5b = await _0x0_0x583fd3({
            'method': 'get',
            'url': _0x574bbc,
            'headers': BROWSER_HEADERS,
            ..._0x4923df,
            'responseType': 'arraybuffer'
        });
        return _0xc47f5b['data'];
    } catch (_0x5eaacc) {
        return _0x5eaacc;
    }
};
export const getImg = async (_0xd78166, _0x3906a8 = {}) => {
    try {
        const _0x53ee74 = await _0x0_0x583fd3({
            'method': 'get',
            'url': _0xd78166,
            'headers': BROWSER_HEADERS,
            ..._0x3906a8,
            'responseType': 'arraybuffer'
        });
        return _0x53ee74['data'];
    } catch (_0x5b26a3) {
        return _0x5b26a3;
    }
};
export const fetchJson = async (_0x3a9338, _0x1b882b = {}) => {
    try {
        const _0x122c26 = await _0x0_0x583fd3({
            'method': 'GET',
            'url': _0x3a9338,
            'headers': { 'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/95.0.4638.69\x20Safari/537.36' },
            ..._0x1b882b
        });
        return _0x122c26['data'];
    } catch (_0x43ec2d) {
        return _0x43ec2d;
    }
};
export const runtime = _0x5b966c => {
    _0x5b966c = Number(_0x5b966c);
    const _0x262398 = Math['floor'](_0x5b966c / (0xe10 * 0x18));
    const _0x2222a6 = Math['floor'](_0x5b966c % (0xe10 * 0x18) / 0xe10);
    const _0x4cd14e = Math['floor'](_0x5b966c % 0xe10 / 0x3c);
    const _0x454f68 = Math['floor'](_0x5b966c % 0x3c);
    const _0x55573c = _0x262398 > 0x0 ? _0x262398 + (_0x262398 === 0x1 ? '\x20day,\x20' : '\x20days,\x20') : '';
    const _0x459fe5 = _0x2222a6 > 0x0 ? _0x2222a6 + (_0x2222a6 === 0x1 ? '\x20hour,\x20' : '\x20hours,\x20') : '';
    const _0x270f84 = _0x4cd14e > 0x0 ? _0x4cd14e + (_0x4cd14e === 0x1 ? '\x20minute,\x20' : '\x20minutes,\x20') : '';
    const _0x46a487 = _0x454f68 > 0x0 ? _0x454f68 + (_0x454f68 === 0x1 ? '\x20second' : '\x20seconds') : '';
    return _0x55573c + _0x459fe5 + _0x270f84 + _0x46a487;
};
export const clockString = _0x11a822 => {
    const _0x27ef61 = isNaN(_0x11a822) ? '--' : Math['floor'](_0x11a822 / 0x36ee80);
    const _0xcbb016 = isNaN(_0x11a822) ? '--' : Math['floor'](_0x11a822 / 0xea60) % 0x3c;
    const _0x40137f = isNaN(_0x11a822) ? '--' : Math['floor'](_0x11a822 / 0x3e8) % 0x3c;
    return [
        _0x27ef61,
        _0xcbb016,
        _0x40137f
    ]['map'](_0x2659ca => _0x2659ca['toString']()['padStart'](0x2, '0'))['join'](':');
};
export const sleep = _0x2e4572 => new Promise(_0x37fa29 => setTimeout(_0x37fa29, _0x2e4572));
export const isUrl = _0x170aba => _0x170aba['match'](new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'));
export const getTime = (_0x38d0c8, _0x3cc49b) => {
    if (_0x3cc49b)
        return _0x0_0x2a37c6(_0x3cc49b)['locale']('en')['format'](_0x38d0c8);
    return _0x0_0x2a37c6['tz']('Asia/Karachi')['locale']('en')['format'](_0x38d0c8);
};
export const formatDate = (_0x126edc, _0x393228 = 'en') => {
    const _0xee85a5 = new Date(_0x126edc);
    return _0xee85a5['toLocaleDateString'](_0x393228, {
        'weekday': 'long',
        'day': 'numeric',
        'month': 'long',
        'year': 'numeric',
        'hour': 'numeric',
        'minute': 'numeric',
        'second': 'numeric'
    });
};
export const tanggal = _0x22e5f8 => {
    const _0xaa34e5 = [
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
    const _0x46162f = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ];
    const _0x4d6f7b = new Date(_0x22e5f8);
    const _0x7c1adc = _0x4d6f7b['getDate']();
    const _0x46c1d3 = _0x4d6f7b['getMonth']();
    const _0x51c39f = _0x46162f[_0x4d6f7b['getDay']()];
    const _0xb81511 = _0x4d6f7b['getFullYear']();
    const _0x584692 = _0xb81511 < 0x3e8 ? _0xb81511 + 0x76c : _0xb81511;
    return _0x51c39f + ',\x20' + _0x7c1adc + '\x20-\x20' + _0xaa34e5[_0x46c1d3] + '\x20-\x20' + _0x584692;
};
export const jam = (_0x1e158e, _0x540ec3 = {}) => {
    const _0x566d57 = _0x540ec3['format'] ?? 'HH:mm';
    const _0x4ab808 = _0x540ec3['timeZone'] ? _0x0_0x2a37c6(_0x1e158e)['tz'](_0x540ec3['timeZone'])['format'](_0x566d57) : _0x0_0x2a37c6(_0x1e158e)['format'](_0x566d57);
    return _0x4ab808;
};
export const formatp = sizeFormatter({
    'std': 'JEDEC',
    'decimalPlaces': 0x2,
    'keepTrailingZeroes': ![],
    'render': (_0x43996b, _0x31b170) => _0x43996b + '\x20' + _0x31b170 + 'B'
});
export const json = _0x37fa52 => JSON['stringify'](_0x37fa52, null, 0x2);
export const logic = (_0x53c8b7, _0xa0cf5a, _0x3ff195) => {
    if (_0xa0cf5a['length'] !== _0x3ff195['length'])
        throw new Error('Input\x20and\x20Output\x20must\x20have\x20same\x20length');
    for (let _0x474cc9 = 0x0; _0x474cc9 < _0xa0cf5a['length']; _0x474cc9++) {
        if (_0x0_0x34338a['isDeepStrictEqual'](_0x53c8b7, _0xa0cf5a[_0x474cc9]))
            return _0x3ff195[_0x474cc9];
    }
    return null;
};
export const generateProfilePicture = async _0x5d3129 => {
    const _0x4f911f = _0x0_0x31d512(_0x5d3129);
    const {
        width: width = 0x0,
        height: height = 0x0
    } = await _0x4f911f['metadata']();
    const _0x55a450 = Math['min'](width, height);
    const _0x29b77e = await _0x4f911f['extract']({
        'left': 0x0,
        'top': 0x0,
        'width': _0x55a450,
        'height': _0x55a450
    })['resize'](0x2d0, 0x2d0)['jpeg']()['toBuffer']();
    return {
        'img': _0x29b77e,
        'preview': _0x29b77e
    };
};
export const reSize = async (_0x404939, _0x3b32c9, _0x3556c0) => _0x0_0x31d512(_0x404939)['resize'](_0x3b32c9, _0x3556c0)['jpeg']()['toBuffer']();
export const bytesToSize = (_0x2ff4f6, _0xef95e = 0x2) => {
    if (_0x2ff4f6 === 0x0)
        return '0\x20Bytes';
    const _0x44bfa9 = 0x400;
    const _0x1fd931 = _0xef95e < 0x0 ? 0x0 : _0xef95e;
    const _0x538cdd = [
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
    const _0x228886 = Math['floor'](Math['log'](_0x2ff4f6) / Math['log'](_0x44bfa9));
    return parseFloat((_0x2ff4f6 / Math['pow'](_0x44bfa9, _0x228886))['toFixed'](_0x1fd931)) + '\x20' + _0x538cdd[_0x228886];
};
export const getSizeMedia = _0x52dfd => {
    return new Promise((_0x41ccf1, _0x6dcf0d) => {
        if (typeof _0x52dfd === 'string' && /http/['test'](_0x52dfd)) {
            _0x0_0x583fd3['get'](_0x52dfd)['then'](_0x5ece1a => {
                const _0x53abc8 = parseInt(_0x5ece1a['headers']['content-length'], 0xa);
                const _0x5319f1 = bytesToSize(_0x53abc8, 0x3);
                if (!isNaN(_0x53abc8))
                    _0x41ccf1(_0x5319f1);
                else
                    _0x6dcf0d('Invalid\x20content-length');
            })['catch'](_0x6dcf0d);
        } else if (Buffer['isBuffer'](_0x52dfd)) {
            const _0x3ebe3e = Buffer['byteLength'](_0x52dfd);
            const _0x15b7fb = bytesToSize(_0x3ebe3e, 0x3);
            if (!isNaN(_0x3ebe3e))
                _0x41ccf1(_0x15b7fb);
            else
                _0x6dcf0d('Invalid\x20buffer\x20length');
        } else {
            _0x6dcf0d('Invalid\x20input:\x20must\x20be\x20a\x20URL\x20string\x20or\x20Buffer');
        }
    });
};
export const parseMention = (_0x5e3517 = '') => [..._0x5e3517['matchAll'](/@([0-9]{5,16}|0)/g)]['map'](_0x5edcb4 => _0x5edcb4[0x1] + '@s.whatsapp.net');
export const getGroupAdmins = _0x4f2c73 => {
    const _0x344a6f = [];
    for (const _0x1f58a2 of _0x4f2c73) {
        if (_0x1f58a2['admin'] === 'superadmin' || _0x1f58a2['admin'] === 'admin')
            _0x344a6f['push'](_0x1f58a2['id']);
    }
    return _0x344a6f;
};
export const smsg = (_0x31b2c3, _0x25414c, _0x3402ee) => {
    if (!_0x25414c)
        return _0x25414c;
    const _0xfec4c1 = proto['WebMessageInfo'];
    if (_0x25414c['key']) {
        _0x25414c['id'] = _0x25414c['key']['id'];
        _0x25414c['isBaileys'] = _0x25414c['id']['startsWith']('BAE5') && _0x25414c['id']['length'] === 0x10;
        _0x25414c['chat'] = _0x25414c['key']['remoteJid'];
        _0x25414c['fromMe'] = _0x25414c['key']['fromMe'];
        _0x25414c['isGroup'] = _0x25414c['chat']['endsWith']('@g.us');
        _0x25414c['sender'] = _0x31b2c3['decodeJid'](_0x25414c['fromMe'] && _0x31b2c3['user']['id'] || _0x25414c['participant'] || _0x25414c['key']['participant'] || _0x25414c['chat'] || '');
        if (_0x25414c['isGroup'])
            _0x25414c['participant'] = _0x31b2c3['decodeJid'](_0x25414c['key']['participant']) || '';
    }
    if (_0x25414c['message']) {
        _0x25414c['mtype'] = getContentType(_0x25414c['message']);
        _0x25414c['msg'] = _0x25414c['mtype'] === 'viewOnceMessage' ? _0x25414c['message'][_0x25414c['mtype']]['message'][getContentType(_0x25414c['message'][_0x25414c['mtype']]['message'])] : _0x25414c['message'][_0x25414c['mtype']];
        _0x25414c['body'] = _0x25414c['message']['conversation'] || _0x25414c['msg']?.['caption'] || _0x25414c['msg']?.['text'] || _0x25414c['mtype'] === 'listResponseMessage' && _0x25414c['msg']?.['singleSelectReply']?.['selectedRowId'] || _0x25414c['mtype'] === 'buttonsResponseMessage' && _0x25414c['msg']?.['selectedButtonId'] || _0x25414c['mtype'] === 'viewOnceMessage' && _0x25414c['msg']?.['caption'] || _0x25414c['text'];
        const _0x576b47 = _0x25414c['quoted'] = _0x25414c['msg']?.['contextInfo'] ? _0x25414c['msg']['contextInfo']['quotedMessage'] : null;
        _0x25414c['mentionedJid'] = _0x25414c['msg']?.['contextInfo'] ? _0x25414c['msg']['contextInfo']['mentionedJid'] : [];
        if (_0x25414c['quoted']) {
            let _0x1653a5 = getContentType(_0x576b47);
            _0x25414c['quoted'] = _0x25414c['quoted'][_0x1653a5];
            if (['productMessage']['includes'](_0x1653a5)) {
                _0x1653a5 = getContentType(_0x25414c['quoted']);
                _0x25414c['quoted'] = _0x25414c['quoted'][_0x1653a5];
            }
            if (typeof _0x25414c['quoted'] === 'string')
                _0x25414c['quoted'] = { 'text': _0x25414c['quoted'] };
            _0x25414c['quoted']['mtype'] = _0x1653a5;
            _0x25414c['quoted']['id'] = _0x25414c['msg']['contextInfo']['stanzaId'];
            _0x25414c['quoted']['chat'] = _0x25414c['msg']['contextInfo']['remoteJid'] || _0x25414c['chat'];
            _0x25414c['quoted']['isBaileys'] = _0x25414c['quoted']['id'] ? _0x25414c['quoted']['id']['startsWith']('BAE5') && _0x25414c['quoted']['id']['length'] === 0x10 : ![];
            _0x25414c['quoted']['sender'] = _0x31b2c3['decodeJid'](_0x25414c['msg']['contextInfo']['participant']);
            _0x25414c['quoted']['fromMe'] = _0x25414c['quoted']['sender'] === (_0x31b2c3['user'] && _0x31b2c3['user']['id']);
            _0x25414c['quoted']['text'] = _0x25414c['quoted']['text'] || _0x25414c['quoted']['caption'] || _0x25414c['quoted']['conversation'] || _0x25414c['quoted']['contentText'] || _0x25414c['quoted']['selectedDisplayText'] || _0x25414c['quoted']['title'] || '';
            _0x25414c['quoted']['mentionedJid'] = _0x25414c['msg']['contextInfo'] ? _0x25414c['msg']['contextInfo']['mentionedJid'] : [];
            _0x25414c['getQuotedObj'] = _0x25414c['getQuotedMessage'] = async () => {
                if (!_0x25414c['quoted']['id'])
                    return ![];
                const _0x33ce10 = await _0x3402ee['loadMessage'](_0x25414c['chat'], _0x25414c['quoted']['id'], _0x31b2c3);
                return smsg(_0x31b2c3, _0x33ce10, _0x3402ee);
            };
            const _0x3c7cb4 = _0x25414c['quoted']['fakeObj'] = _0xfec4c1['fromObject']({
                'key': {
                    'remoteJid': _0x25414c['quoted']['chat'],
                    'fromMe': _0x25414c['quoted']['fromMe'],
                    'id': _0x25414c['quoted']['id']
                },
                'message': _0x576b47,
                ..._0x25414c['isGroup'] ? { 'participant': _0x25414c['quoted']['sender'] } : {}
            });
            _0x25414c['quoted']['delete'] = () => _0x31b2c3['sendMessage'](_0x25414c['quoted']['chat'], { 'delete': _0x3c7cb4['key'] });
            _0x25414c['quoted']['copyNForward'] = (_0x304341, _0x5eb8ff = ![], _0x135944 = {}) => _0x31b2c3['copyNForward'](_0x304341, _0x3c7cb4, _0x5eb8ff, _0x135944);
            _0x25414c['quoted']['download'] = () => _0x31b2c3['downloadMediaMessage'](_0x25414c['quoted']);
        }
    }
    if (_0x25414c['msg']?.['url'])
        _0x25414c['download'] = () => _0x31b2c3['downloadMediaMessage'](_0x25414c['msg']);
    _0x25414c['text'] = _0x25414c['msg']?.['text'] || _0x25414c['msg']?.['caption'] || _0x25414c['message']?.['conversation'] || _0x25414c['msg']?.['contentText'] || _0x25414c['msg']?.['selectedDisplayText'] || _0x25414c['msg']?.['title'] || '';
    _0x25414c['reply'] = (_0x40bc75, _0x3f9e7c = _0x25414c['chat'], _0x3bce19 = {}) => Buffer['isBuffer'](_0x40bc75) ? _0x31b2c3['sendMedia'](_0x3f9e7c, _0x40bc75, 'file', '', _0x25414c, { ..._0x3bce19 }) : _0x31b2c3['sendText'](_0x3f9e7c, _0x40bc75, _0x25414c, { ..._0x3bce19 });
    _0x25414c['copy'] = () => smsg(_0x31b2c3, _0xfec4c1['fromObject'](_0xfec4c1['toObject'](_0x25414c)), _0x3402ee);
    _0x25414c['copyNForward'] = (_0x1b2dac = _0x25414c['chat'], _0x5f04bb = ![], _0x53c9e9 = {}) => _0x31b2c3['copyNForward'](_0x1b2dac, _0x25414c, _0x5f04bb, _0x53c9e9);
    return _0x25414c;
};