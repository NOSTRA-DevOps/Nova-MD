import {
    proto,
    getContentType
} from '@whiskeysockets/baileys';
import _0x0_0x2e9364 from 'axios';
import _0x0_0x537f3c from 'moment-timezone';
import { sizeFormatter } from 'human-readable';
import _0x0_0x212f64 from 'util';
import _0x0_0x1e706b from 'sharp';
export const unixTimestampSeconds = (_0xa4718e = new Date()) => Math['floor'](_0xa4718e['getTime']() / 0x3e8);
export const generateMessageTag = _0x7290b9 => {
    let _0x1bcbd3 = unixTimestampSeconds()['toString']();
    if (_0x7290b9)
        _0x1bcbd3 += '.--' + _0x7290b9;
    return _0x1bcbd3;
};
export const processTime = (_0x405317, _0x541b77) => _0x0_0x537f3c['duration'](_0x541b77['valueOf']() - _0x0_0x537f3c(_0x405317 * 0x3e8)['valueOf']())['asSeconds']();
export const getRandom = _0x34ca37 => '' + Math['floor'](Math['random']() * 0x2710) + _0x34ca37;
const BROWSER_HEADERS = {
    'DNT': '1',
    'Upgrade-Insecure-Request': '1'
};
export const getBuffer = async (_0x419780, _0x1b1189 = {}) => {
    try {
        const _0x4e23d9 = await _0x0_0x2e9364({
            'method': 'get',
            'url': _0x419780,
            'headers': BROWSER_HEADERS,
            ..._0x1b1189,
            'responseType': 'arraybuffer'
        });
        return _0x4e23d9['data'];
    } catch (_0x35bbbc) {
        return _0x35bbbc;
    }
};
export const getImg = async (_0x441db3, _0x20c3e1 = {}) => {
    try {
        const _0x24a344 = await _0x0_0x2e9364({
            'method': 'get',
            'url': _0x441db3,
            'headers': BROWSER_HEADERS,
            ..._0x20c3e1,
            'responseType': 'arraybuffer'
        });
        return _0x24a344['data'];
    } catch (_0x42e1d0) {
        return _0x42e1d0;
    }
};
export const fetchJson = async (_0xfb92f6, _0x27e1be = {}) => {
    try {
        const _0x14f927 = await _0x0_0x2e9364({
            'method': 'GET',
            'url': _0xfb92f6,
            'headers': { 'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/95.0.4638.69\x20Safari/537.36' },
            ..._0x27e1be
        });
        return _0x14f927['data'];
    } catch (_0x46fa8b) {
        return _0x46fa8b;
    }
};
export const runtime = _0x41da0a => {
    _0x41da0a = Number(_0x41da0a);
    const _0x1af2b6 = Math['floor'](_0x41da0a / (0xe10 * 0x18));
    const _0x1df636 = Math['floor'](_0x41da0a % (0xe10 * 0x18) / 0xe10);
    const _0x2720dc = Math['floor'](_0x41da0a % 0xe10 / 0x3c);
    const _0x11ea22 = Math['floor'](_0x41da0a % 0x3c);
    const _0x47f202 = _0x1af2b6 > 0x0 ? _0x1af2b6 + (_0x1af2b6 === 0x1 ? '\x20day,\x20' : '\x20days,\x20') : '';
    const _0x3ec472 = _0x1df636 > 0x0 ? _0x1df636 + (_0x1df636 === 0x1 ? '\x20hour,\x20' : '\x20hours,\x20') : '';
    const _0x5b5b19 = _0x2720dc > 0x0 ? _0x2720dc + (_0x2720dc === 0x1 ? '\x20minute,\x20' : '\x20minutes,\x20') : '';
    const _0x1df45a = _0x11ea22 > 0x0 ? _0x11ea22 + (_0x11ea22 === 0x1 ? '\x20second' : '\x20seconds') : '';
    return _0x47f202 + _0x3ec472 + _0x5b5b19 + _0x1df45a;
};
export const clockString = _0x183c67 => {
    const _0x129a14 = isNaN(_0x183c67) ? '--' : Math['floor'](_0x183c67 / 0x36ee80);
    const _0x5ae76f = isNaN(_0x183c67) ? '--' : Math['floor'](_0x183c67 / 0xea60) % 0x3c;
    const _0x2ec80b = isNaN(_0x183c67) ? '--' : Math['floor'](_0x183c67 / 0x3e8) % 0x3c;
    return [
        _0x129a14,
        _0x5ae76f,
        _0x2ec80b
    ]['map'](_0x5112ea => _0x5112ea['toString']()['padStart'](0x2, '0'))['join'](':');
};
export const sleep = _0x240752 => new Promise(_0x3c6a8d => setTimeout(_0x3c6a8d, _0x240752));
export const isUrl = _0x366d71 => _0x366d71['match'](new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'));
export const getTime = (_0x4f8a49, _0x5e2d18) => {
    if (_0x5e2d18)
        return _0x0_0x537f3c(_0x5e2d18)['locale']('en')['format'](_0x4f8a49);
    return _0x0_0x537f3c['tz']('Asia/Karachi')['locale']('en')['format'](_0x4f8a49);
};
export const formatDate = (_0x481ae6, _0x301bf8 = 'en') => {
    const _0x187154 = new Date(_0x481ae6);
    return _0x187154['toLocaleDateString'](_0x301bf8, {
        'weekday': 'long',
        'day': 'numeric',
        'month': 'long',
        'year': 'numeric',
        'hour': 'numeric',
        'minute': 'numeric',
        'second': 'numeric'
    });
};
export const tanggal = _0x41fe70 => {
    const _0x5c9ae5 = [
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
    const _0x480a3b = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ];
    const _0x3bee66 = new Date(_0x41fe70);
    const _0x474fe4 = _0x3bee66['getDate']();
    const _0x4c4ca7 = _0x3bee66['getMonth']();
    const _0x749be8 = _0x480a3b[_0x3bee66['getDay']()];
    const _0x5eb76e = _0x3bee66['getFullYear']();
    const _0x13707a = _0x5eb76e < 0x3e8 ? _0x5eb76e + 0x76c : _0x5eb76e;
    return _0x749be8 + ',\x20' + _0x474fe4 + '\x20-\x20' + _0x5c9ae5[_0x4c4ca7] + '\x20-\x20' + _0x13707a;
};
export const jam = (_0xc8cee8, _0x1ec418 = {}) => {
    const _0x1b8fd = _0x1ec418['format'] ?? 'HH:mm';
    const _0x53a55c = _0x1ec418['timeZone'] ? _0x0_0x537f3c(_0xc8cee8)['tz'](_0x1ec418['timeZone'])['format'](_0x1b8fd) : _0x0_0x537f3c(_0xc8cee8)['format'](_0x1b8fd);
    return _0x53a55c;
};
export const formatp = sizeFormatter({
    'std': 'JEDEC',
    'decimalPlaces': 0x2,
    'keepTrailingZeroes': ![],
    'render': (_0x269e91, _0x54346b) => _0x269e91 + '\x20' + _0x54346b + 'B'
});
export const json = _0x22d2a5 => JSON['stringify'](_0x22d2a5, null, 0x2);
export const logic = (_0x20e295, _0x29892f, _0x552007) => {
    if (_0x29892f['length'] !== _0x552007['length'])
        throw new Error('Input\x20and\x20Output\x20must\x20have\x20same\x20length');
    for (let _0x5ab33c = 0x0; _0x5ab33c < _0x29892f['length']; _0x5ab33c++) {
        if (_0x0_0x212f64['isDeepStrictEqual'](_0x20e295, _0x29892f[_0x5ab33c]))
            return _0x552007[_0x5ab33c];
    }
    return null;
};
export const generateProfilePicture = async _0x16661a => {
    const _0x547418 = _0x0_0x1e706b(_0x16661a);
    const {
        width: width = 0x0,
        height: height = 0x0
    } = await _0x547418['metadata']();
    const _0x159fe0 = Math['min'](width, height);
    const _0x674772 = await _0x547418['extract']({
        'left': 0x0,
        'top': 0x0,
        'width': _0x159fe0,
        'height': _0x159fe0
    })['resize'](0x2d0, 0x2d0)['jpeg']()['toBuffer']();
    return {
        'img': _0x674772,
        'preview': _0x674772
    };
};
export const reSize = async (_0x3673c2, _0x1adbcd, _0x496401) => _0x0_0x1e706b(_0x3673c2)['resize'](_0x1adbcd, _0x496401)['jpeg']()['toBuffer']();
export const bytesToSize = (_0x5691b6, _0x1a76a9 = 0x2) => {
    if (_0x5691b6 === 0x0)
        return '0\x20Bytes';
    const _0x26b2e1 = 0x400;
    const _0x5608eb = _0x1a76a9 < 0x0 ? 0x0 : _0x1a76a9;
    const _0x1de651 = [
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
    const _0x13dfc5 = Math['floor'](Math['log'](_0x5691b6) / Math['log'](_0x26b2e1));
    return parseFloat((_0x5691b6 / Math['pow'](_0x26b2e1, _0x13dfc5))['toFixed'](_0x5608eb)) + '\x20' + _0x1de651[_0x13dfc5];
};
export const getSizeMedia = _0x45a4f6 => {
    return new Promise((_0x32761f, _0x1c563a) => {
        if (typeof _0x45a4f6 === 'string' && /http/['test'](_0x45a4f6)) {
            _0x0_0x2e9364['get'](_0x45a4f6)['then'](_0x4317fb => {
                const _0x3703ed = parseInt(_0x4317fb['headers']['content-length'], 0xa);
                const _0x5ded4e = bytesToSize(_0x3703ed, 0x3);
                if (!isNaN(_0x3703ed))
                    _0x32761f(_0x5ded4e);
                else
                    _0x1c563a('Invalid\x20content-length');
            })['catch'](_0x1c563a);
        } else if (Buffer['isBuffer'](_0x45a4f6)) {
            const _0x4df882 = Buffer['byteLength'](_0x45a4f6);
            const _0x280e09 = bytesToSize(_0x4df882, 0x3);
            if (!isNaN(_0x4df882))
                _0x32761f(_0x280e09);
            else
                _0x1c563a('Invalid\x20buffer\x20length');
        } else {
            _0x1c563a('Invalid\x20input:\x20must\x20be\x20a\x20URL\x20string\x20or\x20Buffer');
        }
    });
};
export const parseMention = (_0x2bdf28 = '') => [..._0x2bdf28['matchAll'](/@([0-9]{5,16}|0)/g)]['map'](_0x54ca3f => _0x54ca3f[0x1] + '@s.whatsapp.net');
export const getGroupAdmins = _0x5eee87 => {
    const _0x320b97 = [];
    for (const _0x2aeb3d of _0x5eee87) {
        if (_0x2aeb3d['admin'] === 'superadmin' || _0x2aeb3d['admin'] === 'admin')
            _0x320b97['push'](_0x2aeb3d['id']);
    }
    return _0x320b97;
};
export const smsg = (_0xc011f4, _0x478cb4, _0x36890f) => {
    if (!_0x478cb4)
        return _0x478cb4;
    const _0x3d183f = proto['WebMessageInfo'];
    if (_0x478cb4['key']) {
        _0x478cb4['id'] = _0x478cb4['key']['id'];
        _0x478cb4['isBaileys'] = _0x478cb4['id']['startsWith']('BAE5') && _0x478cb4['id']['length'] === 0x10;
        _0x478cb4['chat'] = _0x478cb4['key']['remoteJid'];
        _0x478cb4['fromMe'] = _0x478cb4['key']['fromMe'];
        _0x478cb4['isGroup'] = _0x478cb4['chat']['endsWith']('@g.us');
        _0x478cb4['sender'] = _0xc011f4['decodeJid'](_0x478cb4['fromMe'] && _0xc011f4['user']['id'] || _0x478cb4['participant'] || _0x478cb4['key']['participant'] || _0x478cb4['chat'] || '');
        if (_0x478cb4['isGroup'])
            _0x478cb4['participant'] = _0xc011f4['decodeJid'](_0x478cb4['key']['participant']) || '';
    }
    if (_0x478cb4['message']) {
        _0x478cb4['mtype'] = getContentType(_0x478cb4['message']);
        _0x478cb4['msg'] = _0x478cb4['mtype'] === 'viewOnceMessage' ? _0x478cb4['message'][_0x478cb4['mtype']]['message'][getContentType(_0x478cb4['message'][_0x478cb4['mtype']]['message'])] : _0x478cb4['message'][_0x478cb4['mtype']];
        _0x478cb4['body'] = _0x478cb4['message']['conversation'] || _0x478cb4['msg']?.['caption'] || _0x478cb4['msg']?.['text'] || _0x478cb4['mtype'] === 'listResponseMessage' && _0x478cb4['msg']?.['singleSelectReply']?.['selectedRowId'] || _0x478cb4['mtype'] === 'buttonsResponseMessage' && _0x478cb4['msg']?.['selectedButtonId'] || _0x478cb4['mtype'] === 'viewOnceMessage' && _0x478cb4['msg']?.['caption'] || _0x478cb4['text'];
        const _0x15c748 = _0x478cb4['quoted'] = _0x478cb4['msg']?.['contextInfo'] ? _0x478cb4['msg']['contextInfo']['quotedMessage'] : null;
        _0x478cb4['mentionedJid'] = _0x478cb4['msg']?.['contextInfo'] ? _0x478cb4['msg']['contextInfo']['mentionedJid'] : [];
        if (_0x478cb4['quoted']) {
            let _0x248566 = getContentType(_0x15c748);
            _0x478cb4['quoted'] = _0x478cb4['quoted'][_0x248566];
            if (['productMessage']['includes'](_0x248566)) {
                _0x248566 = getContentType(_0x478cb4['quoted']);
                _0x478cb4['quoted'] = _0x478cb4['quoted'][_0x248566];
            }
            if (typeof _0x478cb4['quoted'] === 'string')
                _0x478cb4['quoted'] = { 'text': _0x478cb4['quoted'] };
            _0x478cb4['quoted']['mtype'] = _0x248566;
            _0x478cb4['quoted']['id'] = _0x478cb4['msg']['contextInfo']['stanzaId'];
            _0x478cb4['quoted']['chat'] = _0x478cb4['msg']['contextInfo']['remoteJid'] || _0x478cb4['chat'];
            _0x478cb4['quoted']['isBaileys'] = _0x478cb4['quoted']['id'] ? _0x478cb4['quoted']['id']['startsWith']('BAE5') && _0x478cb4['quoted']['id']['length'] === 0x10 : ![];
            _0x478cb4['quoted']['sender'] = _0xc011f4['decodeJid'](_0x478cb4['msg']['contextInfo']['participant']);
            _0x478cb4['quoted']['fromMe'] = _0x478cb4['quoted']['sender'] === (_0xc011f4['user'] && _0xc011f4['user']['id']);
            _0x478cb4['quoted']['text'] = _0x478cb4['quoted']['text'] || _0x478cb4['quoted']['caption'] || _0x478cb4['quoted']['conversation'] || _0x478cb4['quoted']['contentText'] || _0x478cb4['quoted']['selectedDisplayText'] || _0x478cb4['quoted']['title'] || '';
            _0x478cb4['quoted']['mentionedJid'] = _0x478cb4['msg']['contextInfo'] ? _0x478cb4['msg']['contextInfo']['mentionedJid'] : [];
            _0x478cb4['getQuotedObj'] = _0x478cb4['getQuotedMessage'] = async () => {
                if (!_0x478cb4['quoted']['id'])
                    return ![];
                const _0x3ce380 = await _0x36890f['loadMessage'](_0x478cb4['chat'], _0x478cb4['quoted']['id'], _0xc011f4);
                return smsg(_0xc011f4, _0x3ce380, _0x36890f);
            };
            const _0x53343b = _0x478cb4['quoted']['fakeObj'] = _0x3d183f['fromObject']({
                'key': {
                    'remoteJid': _0x478cb4['quoted']['chat'],
                    'fromMe': _0x478cb4['quoted']['fromMe'],
                    'id': _0x478cb4['quoted']['id']
                },
                'message': _0x15c748,
                ..._0x478cb4['isGroup'] ? { 'participant': _0x478cb4['quoted']['sender'] } : {}
            });
            _0x478cb4['quoted']['delete'] = () => _0xc011f4['sendMessage'](_0x478cb4['quoted']['chat'], { 'delete': _0x53343b['key'] });
            _0x478cb4['quoted']['copyNForward'] = (_0x4dc7e0, _0x38089a = ![], _0xf6e996 = {}) => _0xc011f4['copyNForward'](_0x4dc7e0, _0x53343b, _0x38089a, _0xf6e996);
            _0x478cb4['quoted']['download'] = () => _0xc011f4['downloadMediaMessage'](_0x478cb4['quoted']);
        }
    }
    if (_0x478cb4['msg']?.['url'])
        _0x478cb4['download'] = () => _0xc011f4['downloadMediaMessage'](_0x478cb4['msg']);
    _0x478cb4['text'] = _0x478cb4['msg']?.['text'] || _0x478cb4['msg']?.['caption'] || _0x478cb4['message']?.['conversation'] || _0x478cb4['msg']?.['contentText'] || _0x478cb4['msg']?.['selectedDisplayText'] || _0x478cb4['msg']?.['title'] || '';
    _0x478cb4['reply'] = (_0x300a6c, _0x23b388 = _0x478cb4['chat'], _0x3a035b = {}) => Buffer['isBuffer'](_0x300a6c) ? _0xc011f4['sendMedia'](_0x23b388, _0x300a6c, 'file', '', _0x478cb4, { ..._0x3a035b }) : _0xc011f4['sendText'](_0x23b388, _0x300a6c, _0x478cb4, { ..._0x3a035b });
    _0x478cb4['copy'] = () => smsg(_0xc011f4, _0x3d183f['fromObject'](_0x3d183f['toObject'](_0x478cb4)), _0x36890f);
    _0x478cb4['copyNForward'] = (_0x166d4d = _0x478cb4['chat'], _0x13bb48 = ![], _0x4e96c2 = {}) => _0xc011f4['copyNForward'](_0x166d4d, _0x478cb4, _0x13bb48, _0x4e96c2);
    return _0x478cb4;
};