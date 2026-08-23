import {
    proto,
    getContentType
} from '@whiskeysockets/baileys';
import _0x0_0x50cc2a from 'axios';
import _0x0_0xd581e8 from 'moment-timezone';
import { sizeFormatter } from 'human-readable';
import _0x0_0x30b0d8 from 'util';
import _0x0_0x326a63 from 'sharp';
export const unixTimestampSeconds = (_0x123c02 = new Date()) => Math['floor'](_0x123c02['getTime']() / 0x3e8);
export const generateMessageTag = _0x3f4007 => {
    let _0x5d01a6 = unixTimestampSeconds()['toString']();
    if (_0x3f4007)
        _0x5d01a6 += '.--' + _0x3f4007;
    return _0x5d01a6;
};
export const processTime = (_0x5b67cc, _0x51635f) => _0x0_0xd581e8['duration'](_0x51635f['valueOf']() - _0x0_0xd581e8(_0x5b67cc * 0x3e8)['valueOf']())['asSeconds']();
export const getRandom = _0xe011fd => '' + Math['floor'](Math['random']() * 0x2710) + _0xe011fd;
const BROWSER_HEADERS = {
    'DNT': '1',
    'Upgrade-Insecure-Request': '1'
};
export const getBuffer = async (_0x1f4457, _0x3abfb2 = {}) => {
    try {
        const _0x4b8dd9 = await _0x0_0x50cc2a({
            'method': 'get',
            'url': _0x1f4457,
            'headers': BROWSER_HEADERS,
            ..._0x3abfb2,
            'responseType': 'arraybuffer'
        });
        return _0x4b8dd9['data'];
    } catch (_0x4ff59d) {
        return _0x4ff59d;
    }
};
export const getImg = async (_0x5e3d47, _0x4312f1 = {}) => {
    try {
        const _0x3e5065 = await _0x0_0x50cc2a({
            'method': 'get',
            'url': _0x5e3d47,
            'headers': BROWSER_HEADERS,
            ..._0x4312f1,
            'responseType': 'arraybuffer'
        });
        return _0x3e5065['data'];
    } catch (_0x4a494c) {
        return _0x4a494c;
    }
};
export const fetchJson = async (_0x307f2c, _0x2fac62 = {}) => {
    try {
        const _0x50c9a0 = await _0x0_0x50cc2a({
            'method': 'GET',
            'url': _0x307f2c,
            'headers': { 'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/95.0.4638.69\x20Safari/537.36' },
            ..._0x2fac62
        });
        return _0x50c9a0['data'];
    } catch (_0x274d73) {
        return _0x274d73;
    }
};
export const runtime = _0x53e174 => {
    _0x53e174 = Number(_0x53e174);
    const _0xa2e6ba = Math['floor'](_0x53e174 / (0xe10 * 0x18));
    const _0x5ea0f0 = Math['floor'](_0x53e174 % (0xe10 * 0x18) / 0xe10);
    const _0x6745ef = Math['floor'](_0x53e174 % 0xe10 / 0x3c);
    const _0x36c855 = Math['floor'](_0x53e174 % 0x3c);
    const _0x27eaab = _0xa2e6ba > 0x0 ? _0xa2e6ba + (_0xa2e6ba === 0x1 ? '\x20day,\x20' : '\x20days,\x20') : '';
    const _0x1d5fae = _0x5ea0f0 > 0x0 ? _0x5ea0f0 + (_0x5ea0f0 === 0x1 ? '\x20hour,\x20' : '\x20hours,\x20') : '';
    const _0x3c2f75 = _0x6745ef > 0x0 ? _0x6745ef + (_0x6745ef === 0x1 ? '\x20minute,\x20' : '\x20minutes,\x20') : '';
    const _0x446a9f = _0x36c855 > 0x0 ? _0x36c855 + (_0x36c855 === 0x1 ? '\x20second' : '\x20seconds') : '';
    return _0x27eaab + _0x1d5fae + _0x3c2f75 + _0x446a9f;
};
export const clockString = _0x318cf3 => {
    const _0x27e952 = isNaN(_0x318cf3) ? '--' : Math['floor'](_0x318cf3 / 0x36ee80);
    const _0x29b5d7 = isNaN(_0x318cf3) ? '--' : Math['floor'](_0x318cf3 / 0xea60) % 0x3c;
    const _0x344f6c = isNaN(_0x318cf3) ? '--' : Math['floor'](_0x318cf3 / 0x3e8) % 0x3c;
    return [
        _0x27e952,
        _0x29b5d7,
        _0x344f6c
    ]['map'](_0x3f3b6d => _0x3f3b6d['toString']()['padStart'](0x2, '0'))['join'](':');
};
export const sleep = _0x9c5ae7 => new Promise(_0x4dcd48 => setTimeout(_0x4dcd48, _0x9c5ae7));
export const isUrl = _0x4cbc2f => _0x4cbc2f['match'](new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'));
export const getTime = (_0x22235b, _0x50b984) => {
    if (_0x50b984)
        return _0x0_0xd581e8(_0x50b984)['locale']('en')['format'](_0x22235b);
    return _0x0_0xd581e8['tz']('Asia/Karachi')['locale']('en')['format'](_0x22235b);
};
export const formatDate = (_0x104a17, _0x13519f = 'en') => {
    const _0x37bf36 = new Date(_0x104a17);
    return _0x37bf36['toLocaleDateString'](_0x13519f, {
        'weekday': 'long',
        'day': 'numeric',
        'month': 'long',
        'year': 'numeric',
        'hour': 'numeric',
        'minute': 'numeric',
        'second': 'numeric'
    });
};
export const tanggal = _0x399f84 => {
    const _0x1d6eb5 = [
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
    const _0x11dd3e = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ];
    const _0x3f11d5 = new Date(_0x399f84);
    const _0x4b8363 = _0x3f11d5['getDate']();
    const _0x11cd21 = _0x3f11d5['getMonth']();
    const _0xa7bd52 = _0x11dd3e[_0x3f11d5['getDay']()];
    const _0x3aa9e6 = _0x3f11d5['getFullYear']();
    const _0x5d06fa = _0x3aa9e6 < 0x3e8 ? _0x3aa9e6 + 0x76c : _0x3aa9e6;
    return _0xa7bd52 + ',\x20' + _0x4b8363 + '\x20-\x20' + _0x1d6eb5[_0x11cd21] + '\x20-\x20' + _0x5d06fa;
};
export const jam = (_0x49f9dd, _0x39659a = {}) => {
    const _0x56c4c7 = _0x39659a['format'] ?? 'HH:mm';
    const _0xd1abf3 = _0x39659a['timeZone'] ? _0x0_0xd581e8(_0x49f9dd)['tz'](_0x39659a['timeZone'])['format'](_0x56c4c7) : _0x0_0xd581e8(_0x49f9dd)['format'](_0x56c4c7);
    return _0xd1abf3;
};
export const formatp = sizeFormatter({
    'std': 'JEDEC',
    'decimalPlaces': 0x2,
    'keepTrailingZeroes': ![],
    'render': (_0x13a81d, _0x4fa81c) => _0x13a81d + '\x20' + _0x4fa81c + 'B'
});
export const json = _0x3630d7 => JSON['stringify'](_0x3630d7, null, 0x2);
export const logic = (_0x2c9b17, _0x5533b1, _0x21a00a) => {
    if (_0x5533b1['length'] !== _0x21a00a['length'])
        throw new Error('Input\x20and\x20Output\x20must\x20have\x20same\x20length');
    for (let _0x45dcce = 0x0; _0x45dcce < _0x5533b1['length']; _0x45dcce++) {
        if (_0x0_0x30b0d8['isDeepStrictEqual'](_0x2c9b17, _0x5533b1[_0x45dcce]))
            return _0x21a00a[_0x45dcce];
    }
    return null;
};
export const generateProfilePicture = async _0x242b97 => {
    const _0x2599d8 = _0x0_0x326a63(_0x242b97);
    const {
        width: width = 0x0,
        height: height = 0x0
    } = await _0x2599d8['metadata']();
    const _0x3946a1 = Math['min'](width, height);
    const _0x9503a0 = await _0x2599d8['extract']({
        'left': 0x0,
        'top': 0x0,
        'width': _0x3946a1,
        'height': _0x3946a1
    })['resize'](0x2d0, 0x2d0)['jpeg']()['toBuffer']();
    return {
        'img': _0x9503a0,
        'preview': _0x9503a0
    };
};
export const reSize = async (_0x2df7ca, _0x14b433, _0x3a058a) => _0x0_0x326a63(_0x2df7ca)['resize'](_0x14b433, _0x3a058a)['jpeg']()['toBuffer']();
export const bytesToSize = (_0x57983d, _0x539edb = 0x2) => {
    if (_0x57983d === 0x0)
        return '0\x20Bytes';
    const _0x553462 = 0x400;
    const _0x1f44dc = _0x539edb < 0x0 ? 0x0 : _0x539edb;
    const _0x23da25 = [
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
    const _0x12cc25 = Math['floor'](Math['log'](_0x57983d) / Math['log'](_0x553462));
    return parseFloat((_0x57983d / Math['pow'](_0x553462, _0x12cc25))['toFixed'](_0x1f44dc)) + '\x20' + _0x23da25[_0x12cc25];
};
export const getSizeMedia = _0x1e3d52 => {
    return new Promise((_0x3a7c96, _0x516241) => {
        if (typeof _0x1e3d52 === 'string' && /http/['test'](_0x1e3d52)) {
            _0x0_0x50cc2a['get'](_0x1e3d52)['then'](_0x41359c => {
                const _0x2fc32b = parseInt(_0x41359c['headers']['content-length'], 0xa);
                const _0x528e5e = bytesToSize(_0x2fc32b, 0x3);
                if (!isNaN(_0x2fc32b))
                    _0x3a7c96(_0x528e5e);
                else
                    _0x516241('Invalid\x20content-length');
            })['catch'](_0x516241);
        } else if (Buffer['isBuffer'](_0x1e3d52)) {
            const _0x1a46f1 = Buffer['byteLength'](_0x1e3d52);
            const _0x37d20b = bytesToSize(_0x1a46f1, 0x3);
            if (!isNaN(_0x1a46f1))
                _0x3a7c96(_0x37d20b);
            else
                _0x516241('Invalid\x20buffer\x20length');
        } else {
            _0x516241('Invalid\x20input:\x20must\x20be\x20a\x20URL\x20string\x20or\x20Buffer');
        }
    });
};
export const parseMention = (_0x509f16 = '') => [..._0x509f16['matchAll'](/@([0-9]{5,16}|0)/g)]['map'](_0x1a07c3 => _0x1a07c3[0x1] + '@s.whatsapp.net');
export const getGroupAdmins = _0x5f5938 => {
    const _0x4a635a = [];
    for (const _0xe795d4 of _0x5f5938) {
        if (_0xe795d4['admin'] === 'superadmin' || _0xe795d4['admin'] === 'admin')
            _0x4a635a['push'](_0xe795d4['id']);
    }
    return _0x4a635a;
};
export const smsg = (_0x4b17e8, _0x4ad75d, _0x3dcd25) => {
    if (!_0x4ad75d)
        return _0x4ad75d;
    const _0x59b2e3 = proto['WebMessageInfo'];
    if (_0x4ad75d['key']) {
        _0x4ad75d['id'] = _0x4ad75d['key']['id'];
        _0x4ad75d['isBaileys'] = _0x4ad75d['id']['startsWith']('BAE5') && _0x4ad75d['id']['length'] === 0x10;
        _0x4ad75d['chat'] = _0x4ad75d['key']['remoteJid'];
        _0x4ad75d['fromMe'] = _0x4ad75d['key']['fromMe'];
        _0x4ad75d['isGroup'] = _0x4ad75d['chat']['endsWith']('@g.us');
        _0x4ad75d['sender'] = _0x4b17e8['decodeJid'](_0x4ad75d['fromMe'] && _0x4b17e8['user']['id'] || _0x4ad75d['participant'] || _0x4ad75d['key']['participant'] || _0x4ad75d['chat'] || '');
        if (_0x4ad75d['isGroup'])
            _0x4ad75d['participant'] = _0x4b17e8['decodeJid'](_0x4ad75d['key']['participant']) || '';
    }
    if (_0x4ad75d['message']) {
        _0x4ad75d['mtype'] = getContentType(_0x4ad75d['message']);
        _0x4ad75d['msg'] = _0x4ad75d['mtype'] === 'viewOnceMessage' ? _0x4ad75d['message'][_0x4ad75d['mtype']]['message'][getContentType(_0x4ad75d['message'][_0x4ad75d['mtype']]['message'])] : _0x4ad75d['message'][_0x4ad75d['mtype']];
        _0x4ad75d['body'] = _0x4ad75d['message']['conversation'] || _0x4ad75d['msg']?.['caption'] || _0x4ad75d['msg']?.['text'] || _0x4ad75d['mtype'] === 'listResponseMessage' && _0x4ad75d['msg']?.['singleSelectReply']?.['selectedRowId'] || _0x4ad75d['mtype'] === 'buttonsResponseMessage' && _0x4ad75d['msg']?.['selectedButtonId'] || _0x4ad75d['mtype'] === 'viewOnceMessage' && _0x4ad75d['msg']?.['caption'] || _0x4ad75d['text'];
        const _0x35f352 = _0x4ad75d['quoted'] = _0x4ad75d['msg']?.['contextInfo'] ? _0x4ad75d['msg']['contextInfo']['quotedMessage'] : null;
        _0x4ad75d['mentionedJid'] = _0x4ad75d['msg']?.['contextInfo'] ? _0x4ad75d['msg']['contextInfo']['mentionedJid'] : [];
        if (_0x4ad75d['quoted']) {
            let _0x1e14de = getContentType(_0x35f352);
            _0x4ad75d['quoted'] = _0x4ad75d['quoted'][_0x1e14de];
            if (['productMessage']['includes'](_0x1e14de)) {
                _0x1e14de = getContentType(_0x4ad75d['quoted']);
                _0x4ad75d['quoted'] = _0x4ad75d['quoted'][_0x1e14de];
            }
            if (typeof _0x4ad75d['quoted'] === 'string')
                _0x4ad75d['quoted'] = { 'text': _0x4ad75d['quoted'] };
            _0x4ad75d['quoted']['mtype'] = _0x1e14de;
            _0x4ad75d['quoted']['id'] = _0x4ad75d['msg']['contextInfo']['stanzaId'];
            _0x4ad75d['quoted']['chat'] = _0x4ad75d['msg']['contextInfo']['remoteJid'] || _0x4ad75d['chat'];
            _0x4ad75d['quoted']['isBaileys'] = _0x4ad75d['quoted']['id'] ? _0x4ad75d['quoted']['id']['startsWith']('BAE5') && _0x4ad75d['quoted']['id']['length'] === 0x10 : ![];
            _0x4ad75d['quoted']['sender'] = _0x4b17e8['decodeJid'](_0x4ad75d['msg']['contextInfo']['participant']);
            _0x4ad75d['quoted']['fromMe'] = _0x4ad75d['quoted']['sender'] === (_0x4b17e8['user'] && _0x4b17e8['user']['id']);
            _0x4ad75d['quoted']['text'] = _0x4ad75d['quoted']['text'] || _0x4ad75d['quoted']['caption'] || _0x4ad75d['quoted']['conversation'] || _0x4ad75d['quoted']['contentText'] || _0x4ad75d['quoted']['selectedDisplayText'] || _0x4ad75d['quoted']['title'] || '';
            _0x4ad75d['quoted']['mentionedJid'] = _0x4ad75d['msg']['contextInfo'] ? _0x4ad75d['msg']['contextInfo']['mentionedJid'] : [];
            _0x4ad75d['getQuotedObj'] = _0x4ad75d['getQuotedMessage'] = async () => {
                if (!_0x4ad75d['quoted']['id'])
                    return ![];
                const _0x2e009d = await _0x3dcd25['loadMessage'](_0x4ad75d['chat'], _0x4ad75d['quoted']['id'], _0x4b17e8);
                return smsg(_0x4b17e8, _0x2e009d, _0x3dcd25);
            };
            const _0x29b3f2 = _0x4ad75d['quoted']['fakeObj'] = _0x59b2e3['fromObject']({
                'key': {
                    'remoteJid': _0x4ad75d['quoted']['chat'],
                    'fromMe': _0x4ad75d['quoted']['fromMe'],
                    'id': _0x4ad75d['quoted']['id']
                },
                'message': _0x35f352,
                ..._0x4ad75d['isGroup'] ? { 'participant': _0x4ad75d['quoted']['sender'] } : {}
            });
            _0x4ad75d['quoted']['delete'] = () => _0x4b17e8['sendMessage'](_0x4ad75d['quoted']['chat'], { 'delete': _0x29b3f2['key'] });
            _0x4ad75d['quoted']['copyNForward'] = (_0x4afde5, _0x2245a0 = ![], _0x2caf6c = {}) => _0x4b17e8['copyNForward'](_0x4afde5, _0x29b3f2, _0x2245a0, _0x2caf6c);
            _0x4ad75d['quoted']['download'] = () => _0x4b17e8['downloadMediaMessage'](_0x4ad75d['quoted']);
        }
    }
    if (_0x4ad75d['msg']?.['url'])
        _0x4ad75d['download'] = () => _0x4b17e8['downloadMediaMessage'](_0x4ad75d['msg']);
    _0x4ad75d['text'] = _0x4ad75d['msg']?.['text'] || _0x4ad75d['msg']?.['caption'] || _0x4ad75d['message']?.['conversation'] || _0x4ad75d['msg']?.['contentText'] || _0x4ad75d['msg']?.['selectedDisplayText'] || _0x4ad75d['msg']?.['title'] || '';
    _0x4ad75d['reply'] = (_0x23c0b5, _0x9b15bc = _0x4ad75d['chat'], _0x510f4d = {}) => Buffer['isBuffer'](_0x23c0b5) ? _0x4b17e8['sendMedia'](_0x9b15bc, _0x23c0b5, 'file', '', _0x4ad75d, { ..._0x510f4d }) : _0x4b17e8['sendText'](_0x9b15bc, _0x23c0b5, _0x4ad75d, { ..._0x510f4d });
    _0x4ad75d['copy'] = () => smsg(_0x4b17e8, _0x59b2e3['fromObject'](_0x59b2e3['toObject'](_0x4ad75d)), _0x3dcd25);
    _0x4ad75d['copyNForward'] = (_0x444c2a = _0x4ad75d['chat'], _0x5c8277 = ![], _0x4a98a4 = {}) => _0x4b17e8['copyNForward'](_0x444c2a, _0x4ad75d, _0x5c8277, _0x4a98a4);
    return _0x4ad75d;
};