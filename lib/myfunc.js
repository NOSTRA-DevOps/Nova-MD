import {
    proto,
    getContentType
} from '@whiskeysockets/baileys';
import _0x0_0x23fb8c from 'axios';
import _0x0_0x1a9eb2 from 'moment-timezone';
import { sizeFormatter } from 'human-readable';
import _0x0_0x1c374a from 'util';
import _0x0_0x4b01f2 from 'sharp';
export const unixTimestampSeconds = (_0x293c93 = new Date()) => Math['floor'](_0x293c93['getTime']() / 0x3e8);
export const generateMessageTag = _0x13a54c => {
    let _0x5e1b7e = unixTimestampSeconds()['toString']();
    if (_0x13a54c)
        _0x5e1b7e += '.--' + _0x13a54c;
    return _0x5e1b7e;
};
export const processTime = (_0x3106c2, _0x42d08b) => _0x0_0x1a9eb2['duration'](_0x42d08b['valueOf']() - _0x0_0x1a9eb2(_0x3106c2 * 0x3e8)['valueOf']())['asSeconds']();
export const getRandom = _0x470c3d => '' + Math['floor'](Math['random']() * 0x2710) + _0x470c3d;
const BROWSER_HEADERS = {
    'DNT': '1',
    'Upgrade-Insecure-Request': '1'
};
export const getBuffer = async (_0xc6ca7f, _0x34dbf1 = {}) => {
    try {
        const _0x48090f = await _0x0_0x23fb8c({
            'method': 'get',
            'url': _0xc6ca7f,
            'headers': BROWSER_HEADERS,
            ..._0x34dbf1,
            'responseType': 'arraybuffer'
        });
        return _0x48090f['data'];
    } catch (_0xb03626) {
        return _0xb03626;
    }
};
export const getImg = async (_0x4c92e4, _0x341a0f = {}) => {
    try {
        const _0x34184b = await _0x0_0x23fb8c({
            'method': 'get',
            'url': _0x4c92e4,
            'headers': BROWSER_HEADERS,
            ..._0x341a0f,
            'responseType': 'arraybuffer'
        });
        return _0x34184b['data'];
    } catch (_0x497090) {
        return _0x497090;
    }
};
export const fetchJson = async (_0x280a71, _0x1061bd = {}) => {
    try {
        const _0x35bdba = await _0x0_0x23fb8c({
            'method': 'GET',
            'url': _0x280a71,
            'headers': { 'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/95.0.4638.69\x20Safari/537.36' },
            ..._0x1061bd
        });
        return _0x35bdba['data'];
    } catch (_0x46f63f) {
        return _0x46f63f;
    }
};
export const runtime = _0x1ce640 => {
    _0x1ce640 = Number(_0x1ce640);
    const _0x3713f7 = Math['floor'](_0x1ce640 / (0xe10 * 0x18));
    const _0x18c3ba = Math['floor'](_0x1ce640 % (0xe10 * 0x18) / 0xe10);
    const _0x31d051 = Math['floor'](_0x1ce640 % 0xe10 / 0x3c);
    const _0x11e8f8 = Math['floor'](_0x1ce640 % 0x3c);
    const _0x41a049 = _0x3713f7 > 0x0 ? _0x3713f7 + (_0x3713f7 === 0x1 ? '\x20day,\x20' : '\x20days,\x20') : '';
    const _0x335cc3 = _0x18c3ba > 0x0 ? _0x18c3ba + (_0x18c3ba === 0x1 ? '\x20hour,\x20' : '\x20hours,\x20') : '';
    const _0x440ad2 = _0x31d051 > 0x0 ? _0x31d051 + (_0x31d051 === 0x1 ? '\x20minute,\x20' : '\x20minutes,\x20') : '';
    const _0x573df7 = _0x11e8f8 > 0x0 ? _0x11e8f8 + (_0x11e8f8 === 0x1 ? '\x20second' : '\x20seconds') : '';
    return _0x41a049 + _0x335cc3 + _0x440ad2 + _0x573df7;
};
export const clockString = _0x5b0f8c => {
    const _0x4c94a5 = isNaN(_0x5b0f8c) ? '--' : Math['floor'](_0x5b0f8c / 0x36ee80);
    const _0xbb4357 = isNaN(_0x5b0f8c) ? '--' : Math['floor'](_0x5b0f8c / 0xea60) % 0x3c;
    const _0x2d29b1 = isNaN(_0x5b0f8c) ? '--' : Math['floor'](_0x5b0f8c / 0x3e8) % 0x3c;
    return [
        _0x4c94a5,
        _0xbb4357,
        _0x2d29b1
    ]['map'](_0x157142 => _0x157142['toString']()['padStart'](0x2, '0'))['join'](':');
};
export const sleep = _0xce704e => new Promise(_0x5e67ce => setTimeout(_0x5e67ce, _0xce704e));
export const isUrl = _0x5714a4 => _0x5714a4['match'](new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'));
export const getTime = (_0x35dc94, _0x80ca4a) => {
    if (_0x80ca4a)
        return _0x0_0x1a9eb2(_0x80ca4a)['locale']('en')['format'](_0x35dc94);
    return _0x0_0x1a9eb2['tz']('Asia/Karachi')['locale']('en')['format'](_0x35dc94);
};
export const formatDate = (_0x1bc04a, _0x664423 = 'en') => {
    const _0x188b2a = new Date(_0x1bc04a);
    return _0x188b2a['toLocaleDateString'](_0x664423, {
        'weekday': 'long',
        'day': 'numeric',
        'month': 'long',
        'year': 'numeric',
        'hour': 'numeric',
        'minute': 'numeric',
        'second': 'numeric'
    });
};
export const tanggal = _0x3b0894 => {
    const _0x4ed103 = [
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
    const _0x1f79b5 = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ];
    const _0x55bc7d = new Date(_0x3b0894);
    const _0x54db31 = _0x55bc7d['getDate']();
    const _0x49ca89 = _0x55bc7d['getMonth']();
    const _0x48d0a9 = _0x1f79b5[_0x55bc7d['getDay']()];
    const _0x286b9d = _0x55bc7d['getFullYear']();
    const _0x344192 = _0x286b9d < 0x3e8 ? _0x286b9d + 0x76c : _0x286b9d;
    return _0x48d0a9 + ',\x20' + _0x54db31 + '\x20-\x20' + _0x4ed103[_0x49ca89] + '\x20-\x20' + _0x344192;
};
export const jam = (_0x394171, _0x16e14c = {}) => {
    const _0x4c3e80 = _0x16e14c['format'] ?? 'HH:mm';
    const _0x48408d = _0x16e14c['timeZone'] ? _0x0_0x1a9eb2(_0x394171)['tz'](_0x16e14c['timeZone'])['format'](_0x4c3e80) : _0x0_0x1a9eb2(_0x394171)['format'](_0x4c3e80);
    return _0x48408d;
};
export const formatp = sizeFormatter({
    'std': 'JEDEC',
    'decimalPlaces': 0x2,
    'keepTrailingZeroes': ![],
    'render': (_0x47b7a5, _0xf9f11) => _0x47b7a5 + '\x20' + _0xf9f11 + 'B'
});
export const json = _0x1a6792 => JSON['stringify'](_0x1a6792, null, 0x2);
export const logic = (_0xd99467, _0x5a8b87, _0x25217e) => {
    if (_0x5a8b87['length'] !== _0x25217e['length'])
        throw new Error('Input\x20and\x20Output\x20must\x20have\x20same\x20length');
    for (let _0x5b20f4 = 0x0; _0x5b20f4 < _0x5a8b87['length']; _0x5b20f4++) {
        if (_0x0_0x1c374a['isDeepStrictEqual'](_0xd99467, _0x5a8b87[_0x5b20f4]))
            return _0x25217e[_0x5b20f4];
    }
    return null;
};
export const generateProfilePicture = async _0x458907 => {
    const _0x5ec53c = _0x0_0x4b01f2(_0x458907);
    const {
        width: width = 0x0,
        height: height = 0x0
    } = await _0x5ec53c['metadata']();
    const _0x12cf6c = Math['min'](width, height);
    const _0x2d8c54 = await _0x5ec53c['extract']({
        'left': 0x0,
        'top': 0x0,
        'width': _0x12cf6c,
        'height': _0x12cf6c
    })['resize'](0x2d0, 0x2d0)['jpeg']()['toBuffer']();
    return {
        'img': _0x2d8c54,
        'preview': _0x2d8c54
    };
};
export const reSize = async (_0x448cbe, _0x13fda1, _0x644ee2) => _0x0_0x4b01f2(_0x448cbe)['resize'](_0x13fda1, _0x644ee2)['jpeg']()['toBuffer']();
export const bytesToSize = (_0x590068, _0x33287d = 0x2) => {
    if (_0x590068 === 0x0)
        return '0\x20Bytes';
    const _0x3e6ff4 = 0x400;
    const _0x856079 = _0x33287d < 0x0 ? 0x0 : _0x33287d;
    const _0x3287af = [
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
    const _0x1b520e = Math['floor'](Math['log'](_0x590068) / Math['log'](_0x3e6ff4));
    return parseFloat((_0x590068 / Math['pow'](_0x3e6ff4, _0x1b520e))['toFixed'](_0x856079)) + '\x20' + _0x3287af[_0x1b520e];
};
export const getSizeMedia = _0x120f9a => {
    return new Promise((_0x4a9258, _0x391be9) => {
        if (typeof _0x120f9a === 'string' && /http/['test'](_0x120f9a)) {
            _0x0_0x23fb8c['get'](_0x120f9a)['then'](_0x2ed765 => {
                const _0x574b19 = parseInt(_0x2ed765['headers']['content-length'], 0xa);
                const _0x4507dc = bytesToSize(_0x574b19, 0x3);
                if (!isNaN(_0x574b19))
                    _0x4a9258(_0x4507dc);
                else
                    _0x391be9('Invalid\x20content-length');
            })['catch'](_0x391be9);
        } else if (Buffer['isBuffer'](_0x120f9a)) {
            const _0x1dc5f8 = Buffer['byteLength'](_0x120f9a);
            const _0x2c0b6b = bytesToSize(_0x1dc5f8, 0x3);
            if (!isNaN(_0x1dc5f8))
                _0x4a9258(_0x2c0b6b);
            else
                _0x391be9('Invalid\x20buffer\x20length');
        } else {
            _0x391be9('Invalid\x20input:\x20must\x20be\x20a\x20URL\x20string\x20or\x20Buffer');
        }
    });
};
export const parseMention = (_0xc2a1d9 = '') => [..._0xc2a1d9['matchAll'](/@([0-9]{5,16}|0)/g)]['map'](_0x33c66c => _0x33c66c[0x1] + '@s.whatsapp.net');
export const getGroupAdmins = _0x14ce2e => {
    const _0x157c53 = [];
    for (const _0x356ab3 of _0x14ce2e) {
        if (_0x356ab3['admin'] === 'superadmin' || _0x356ab3['admin'] === 'admin')
            _0x157c53['push'](_0x356ab3['id']);
    }
    return _0x157c53;
};
export const smsg = (_0x397833, _0x50acd0, _0x175551) => {
    if (!_0x50acd0)
        return _0x50acd0;
    const _0x9bee36 = proto['WebMessageInfo'];
    if (_0x50acd0['key']) {
        _0x50acd0['id'] = _0x50acd0['key']['id'];
        _0x50acd0['isBaileys'] = _0x50acd0['id']['startsWith']('BAE5') && _0x50acd0['id']['length'] === 0x10;
        _0x50acd0['chat'] = _0x50acd0['key']['remoteJid'];
        _0x50acd0['fromMe'] = _0x50acd0['key']['fromMe'];
        _0x50acd0['isGroup'] = _0x50acd0['chat']['endsWith']('@g.us');
        _0x50acd0['sender'] = _0x397833['decodeJid'](_0x50acd0['fromMe'] && _0x397833['user']['id'] || _0x50acd0['participant'] || _0x50acd0['key']['participant'] || _0x50acd0['chat'] || '');
        if (_0x50acd0['isGroup'])
            _0x50acd0['participant'] = _0x397833['decodeJid'](_0x50acd0['key']['participant']) || '';
    }
    if (_0x50acd0['message']) {
        _0x50acd0['mtype'] = getContentType(_0x50acd0['message']);
        _0x50acd0['msg'] = _0x50acd0['mtype'] === 'viewOnceMessage' ? _0x50acd0['message'][_0x50acd0['mtype']]['message'][getContentType(_0x50acd0['message'][_0x50acd0['mtype']]['message'])] : _0x50acd0['message'][_0x50acd0['mtype']];
        _0x50acd0['body'] = _0x50acd0['message']['conversation'] || _0x50acd0['msg']?.['caption'] || _0x50acd0['msg']?.['text'] || _0x50acd0['mtype'] === 'listResponseMessage' && _0x50acd0['msg']?.['singleSelectReply']?.['selectedRowId'] || _0x50acd0['mtype'] === 'buttonsResponseMessage' && _0x50acd0['msg']?.['selectedButtonId'] || _0x50acd0['mtype'] === 'viewOnceMessage' && _0x50acd0['msg']?.['caption'] || _0x50acd0['text'];
        const _0x186221 = _0x50acd0['quoted'] = _0x50acd0['msg']?.['contextInfo'] ? _0x50acd0['msg']['contextInfo']['quotedMessage'] : null;
        _0x50acd0['mentionedJid'] = _0x50acd0['msg']?.['contextInfo'] ? _0x50acd0['msg']['contextInfo']['mentionedJid'] : [];
        if (_0x50acd0['quoted']) {
            let _0x596794 = getContentType(_0x186221);
            _0x50acd0['quoted'] = _0x50acd0['quoted'][_0x596794];
            if (['productMessage']['includes'](_0x596794)) {
                _0x596794 = getContentType(_0x50acd0['quoted']);
                _0x50acd0['quoted'] = _0x50acd0['quoted'][_0x596794];
            }
            if (typeof _0x50acd0['quoted'] === 'string')
                _0x50acd0['quoted'] = { 'text': _0x50acd0['quoted'] };
            _0x50acd0['quoted']['mtype'] = _0x596794;
            _0x50acd0['quoted']['id'] = _0x50acd0['msg']['contextInfo']['stanzaId'];
            _0x50acd0['quoted']['chat'] = _0x50acd0['msg']['contextInfo']['remoteJid'] || _0x50acd0['chat'];
            _0x50acd0['quoted']['isBaileys'] = _0x50acd0['quoted']['id'] ? _0x50acd0['quoted']['id']['startsWith']('BAE5') && _0x50acd0['quoted']['id']['length'] === 0x10 : ![];
            _0x50acd0['quoted']['sender'] = _0x397833['decodeJid'](_0x50acd0['msg']['contextInfo']['participant']);
            _0x50acd0['quoted']['fromMe'] = _0x50acd0['quoted']['sender'] === (_0x397833['user'] && _0x397833['user']['id']);
            _0x50acd0['quoted']['text'] = _0x50acd0['quoted']['text'] || _0x50acd0['quoted']['caption'] || _0x50acd0['quoted']['conversation'] || _0x50acd0['quoted']['contentText'] || _0x50acd0['quoted']['selectedDisplayText'] || _0x50acd0['quoted']['title'] || '';
            _0x50acd0['quoted']['mentionedJid'] = _0x50acd0['msg']['contextInfo'] ? _0x50acd0['msg']['contextInfo']['mentionedJid'] : [];
            _0x50acd0['getQuotedObj'] = _0x50acd0['getQuotedMessage'] = async () => {
                if (!_0x50acd0['quoted']['id'])
                    return ![];
                const _0x56f949 = await _0x175551['loadMessage'](_0x50acd0['chat'], _0x50acd0['quoted']['id'], _0x397833);
                return smsg(_0x397833, _0x56f949, _0x175551);
            };
            const _0x3247eb = _0x50acd0['quoted']['fakeObj'] = _0x9bee36['fromObject']({
                'key': {
                    'remoteJid': _0x50acd0['quoted']['chat'],
                    'fromMe': _0x50acd0['quoted']['fromMe'],
                    'id': _0x50acd0['quoted']['id']
                },
                'message': _0x186221,
                ..._0x50acd0['isGroup'] ? { 'participant': _0x50acd0['quoted']['sender'] } : {}
            });
            _0x50acd0['quoted']['delete'] = () => _0x397833['sendMessage'](_0x50acd0['quoted']['chat'], { 'delete': _0x3247eb['key'] });
            _0x50acd0['quoted']['copyNForward'] = (_0x5f31a7, _0x2af49a = ![], _0x34735a = {}) => _0x397833['copyNForward'](_0x5f31a7, _0x3247eb, _0x2af49a, _0x34735a);
            _0x50acd0['quoted']['download'] = () => _0x397833['downloadMediaMessage'](_0x50acd0['quoted']);
        }
    }
    if (_0x50acd0['msg']?.['url'])
        _0x50acd0['download'] = () => _0x397833['downloadMediaMessage'](_0x50acd0['msg']);
    _0x50acd0['text'] = _0x50acd0['msg']?.['text'] || _0x50acd0['msg']?.['caption'] || _0x50acd0['message']?.['conversation'] || _0x50acd0['msg']?.['contentText'] || _0x50acd0['msg']?.['selectedDisplayText'] || _0x50acd0['msg']?.['title'] || '';
    _0x50acd0['reply'] = (_0x322450, _0x1aa766 = _0x50acd0['chat'], _0x34c275 = {}) => Buffer['isBuffer'](_0x322450) ? _0x397833['sendMedia'](_0x1aa766, _0x322450, 'file', '', _0x50acd0, { ..._0x34c275 }) : _0x397833['sendText'](_0x1aa766, _0x322450, _0x50acd0, { ..._0x34c275 });
    _0x50acd0['copy'] = () => smsg(_0x397833, _0x9bee36['fromObject'](_0x9bee36['toObject'](_0x50acd0)), _0x175551);
    _0x50acd0['copyNForward'] = (_0x4f3822 = _0x50acd0['chat'], _0x3ca65e = ![], _0x259e7b = {}) => _0x397833['copyNForward'](_0x4f3822, _0x50acd0, _0x3ca65e, _0x259e7b);
    return _0x50acd0;
};