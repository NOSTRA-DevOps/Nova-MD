import {
    proto,
    getContentType
} from '@whiskeysockets/baileys';
import _0x0_0x4f60e2 from 'axios';
import _0x0_0x1feb0f from 'moment-timezone';
import { sizeFormatter } from 'human-readable';
import _0x0_0x5cf4ba from 'util';
import _0x0_0x317286 from 'sharp';
export const unixTimestampSeconds = (_0x536c31 = new Date()) => Math['floor'](_0x536c31['getTime']() / 0x3e8);
export const generateMessageTag = _0x4425df => {
    let _0x47e915 = unixTimestampSeconds()['toString']();
    if (_0x4425df)
        _0x47e915 += '.--' + _0x4425df;
    return _0x47e915;
};
export const processTime = (_0x300f00, _0x3c4439) => _0x0_0x1feb0f['duration'](_0x3c4439['valueOf']() - _0x0_0x1feb0f(_0x300f00 * 0x3e8)['valueOf']())['asSeconds']();
export const getRandom = _0x7541dd => '' + Math['floor'](Math['random']() * 0x2710) + _0x7541dd;
const BROWSER_HEADERS = {
    'DNT': '1',
    'Upgrade-Insecure-Request': '1'
};
export const getBuffer = async (_0x38db13, _0x3d5f7d = {}) => {
    try {
        const _0x3f451a = await _0x0_0x4f60e2({
            'method': 'get',
            'url': _0x38db13,
            'headers': BROWSER_HEADERS,
            ..._0x3d5f7d,
            'responseType': 'arraybuffer'
        });
        return _0x3f451a['data'];
    } catch (_0x4bd6a7) {
        return _0x4bd6a7;
    }
};
export const getImg = async (_0x14e53d, _0x124e63 = {}) => {
    try {
        const _0x344e98 = await _0x0_0x4f60e2({
            'method': 'get',
            'url': _0x14e53d,
            'headers': BROWSER_HEADERS,
            ..._0x124e63,
            'responseType': 'arraybuffer'
        });
        return _0x344e98['data'];
    } catch (_0x1321ea) {
        return _0x1321ea;
    }
};
export const fetchJson = async (_0x5397fd, _0x1765f7 = {}) => {
    try {
        const _0x5190d5 = await _0x0_0x4f60e2({
            'method': 'GET',
            'url': _0x5397fd,
            'headers': { 'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/95.0.4638.69\x20Safari/537.36' },
            ..._0x1765f7
        });
        return _0x5190d5['data'];
    } catch (_0x33eda7) {
        return _0x33eda7;
    }
};
export const runtime = _0x52a8da => {
    _0x52a8da = Number(_0x52a8da);
    const _0x1463d7 = Math['floor'](_0x52a8da / (0xe10 * 0x18));
    const _0x3c1155 = Math['floor'](_0x52a8da % (0xe10 * 0x18) / 0xe10);
    const _0x55eacf = Math['floor'](_0x52a8da % 0xe10 / 0x3c);
    const _0x1d2829 = Math['floor'](_0x52a8da % 0x3c);
    const _0x2073e5 = _0x1463d7 > 0x0 ? _0x1463d7 + (_0x1463d7 === 0x1 ? '\x20day,\x20' : '\x20days,\x20') : '';
    const _0x39284e = _0x3c1155 > 0x0 ? _0x3c1155 + (_0x3c1155 === 0x1 ? '\x20hour,\x20' : '\x20hours,\x20') : '';
    const _0x23b608 = _0x55eacf > 0x0 ? _0x55eacf + (_0x55eacf === 0x1 ? '\x20minute,\x20' : '\x20minutes,\x20') : '';
    const _0xe8519c = _0x1d2829 > 0x0 ? _0x1d2829 + (_0x1d2829 === 0x1 ? '\x20second' : '\x20seconds') : '';
    return _0x2073e5 + _0x39284e + _0x23b608 + _0xe8519c;
};
export const clockString = _0x10aac9 => {
    const _0x48c61c = isNaN(_0x10aac9) ? '--' : Math['floor'](_0x10aac9 / 0x36ee80);
    const _0x5079ff = isNaN(_0x10aac9) ? '--' : Math['floor'](_0x10aac9 / 0xea60) % 0x3c;
    const _0x1ef90c = isNaN(_0x10aac9) ? '--' : Math['floor'](_0x10aac9 / 0x3e8) % 0x3c;
    return [
        _0x48c61c,
        _0x5079ff,
        _0x1ef90c
    ]['map'](_0x39ab04 => _0x39ab04['toString']()['padStart'](0x2, '0'))['join'](':');
};
export const sleep = _0x37d7f2 => new Promise(_0x3841a9 => setTimeout(_0x3841a9, _0x37d7f2));
export const isUrl = _0x11b2f3 => _0x11b2f3['match'](new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'));
export const getTime = (_0x43cabb, _0x183f2c) => {
    if (_0x183f2c)
        return _0x0_0x1feb0f(_0x183f2c)['locale']('en')['format'](_0x43cabb);
    return _0x0_0x1feb0f['tz']('Asia/Karachi')['locale']('en')['format'](_0x43cabb);
};
export const formatDate = (_0x414eeb, _0x11b413 = 'en') => {
    const _0x2808cb = new Date(_0x414eeb);
    return _0x2808cb['toLocaleDateString'](_0x11b413, {
        'weekday': 'long',
        'day': 'numeric',
        'month': 'long',
        'year': 'numeric',
        'hour': 'numeric',
        'minute': 'numeric',
        'second': 'numeric'
    });
};
export const tanggal = _0x337060 => {
    const _0x469bb4 = [
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
    const _0x144251 = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ];
    const _0x41a19c = new Date(_0x337060);
    const _0x1f965e = _0x41a19c['getDate']();
    const _0x4cf7c8 = _0x41a19c['getMonth']();
    const _0x3ba1a8 = _0x144251[_0x41a19c['getDay']()];
    const _0x58b174 = _0x41a19c['getFullYear']();
    const _0x559b3b = _0x58b174 < 0x3e8 ? _0x58b174 + 0x76c : _0x58b174;
    return _0x3ba1a8 + ',\x20' + _0x1f965e + '\x20-\x20' + _0x469bb4[_0x4cf7c8] + '\x20-\x20' + _0x559b3b;
};
export const jam = (_0x251ec1, _0x9b344e = {}) => {
    const _0x1b18a6 = _0x9b344e['format'] ?? 'HH:mm';
    const _0x3bfc79 = _0x9b344e['timeZone'] ? _0x0_0x1feb0f(_0x251ec1)['tz'](_0x9b344e['timeZone'])['format'](_0x1b18a6) : _0x0_0x1feb0f(_0x251ec1)['format'](_0x1b18a6);
    return _0x3bfc79;
};
export const formatp = sizeFormatter({
    'std': 'JEDEC',
    'decimalPlaces': 0x2,
    'keepTrailingZeroes': ![],
    'render': (_0x34f817, _0x4eca4b) => _0x34f817 + '\x20' + _0x4eca4b + 'B'
});
export const json = _0x2bc435 => JSON['stringify'](_0x2bc435, null, 0x2);
export const logic = (_0x389b70, _0x371dcf, _0x5590bd) => {
    if (_0x371dcf['length'] !== _0x5590bd['length'])
        throw new Error('Input\x20and\x20Output\x20must\x20have\x20same\x20length');
    for (let _0x2b3be3 = 0x0; _0x2b3be3 < _0x371dcf['length']; _0x2b3be3++) {
        if (_0x0_0x5cf4ba['isDeepStrictEqual'](_0x389b70, _0x371dcf[_0x2b3be3]))
            return _0x5590bd[_0x2b3be3];
    }
    return null;
};
export const generateProfilePicture = async _0x26f840 => {
    const _0x280c93 = _0x0_0x317286(_0x26f840);
    const {
        width: width = 0x0,
        height: height = 0x0
    } = await _0x280c93['metadata']();
    const _0x3ab71f = Math['min'](width, height);
    const _0x573a0e = await _0x280c93['extract']({
        'left': 0x0,
        'top': 0x0,
        'width': _0x3ab71f,
        'height': _0x3ab71f
    })['resize'](0x2d0, 0x2d0)['jpeg']()['toBuffer']();
    return {
        'img': _0x573a0e,
        'preview': _0x573a0e
    };
};
export const reSize = async (_0x53ccbf, _0x3f60c8, _0x505c7c) => _0x0_0x317286(_0x53ccbf)['resize'](_0x3f60c8, _0x505c7c)['jpeg']()['toBuffer']();
export const bytesToSize = (_0x3aef70, _0x2a1d39 = 0x2) => {
    if (_0x3aef70 === 0x0)
        return '0\x20Bytes';
    const _0x3dc35b = 0x400;
    const _0xd93d93 = _0x2a1d39 < 0x0 ? 0x0 : _0x2a1d39;
    const _0x462338 = [
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
    const _0x4b7b55 = Math['floor'](Math['log'](_0x3aef70) / Math['log'](_0x3dc35b));
    return parseFloat((_0x3aef70 / Math['pow'](_0x3dc35b, _0x4b7b55))['toFixed'](_0xd93d93)) + '\x20' + _0x462338[_0x4b7b55];
};
export const getSizeMedia = _0x9be265 => {
    return new Promise((_0x18e937, _0x2d1a40) => {
        if (typeof _0x9be265 === 'string' && /http/['test'](_0x9be265)) {
            _0x0_0x4f60e2['get'](_0x9be265)['then'](_0x116e7a => {
                const _0x1d34f8 = parseInt(_0x116e7a['headers']['content-length'], 0xa);
                const _0x1092c2 = bytesToSize(_0x1d34f8, 0x3);
                if (!isNaN(_0x1d34f8))
                    _0x18e937(_0x1092c2);
                else
                    _0x2d1a40('Invalid\x20content-length');
            })['catch'](_0x2d1a40);
        } else if (Buffer['isBuffer'](_0x9be265)) {
            const _0x54f4f9 = Buffer['byteLength'](_0x9be265);
            const _0x131b5e = bytesToSize(_0x54f4f9, 0x3);
            if (!isNaN(_0x54f4f9))
                _0x18e937(_0x131b5e);
            else
                _0x2d1a40('Invalid\x20buffer\x20length');
        } else {
            _0x2d1a40('Invalid\x20input:\x20must\x20be\x20a\x20URL\x20string\x20or\x20Buffer');
        }
    });
};
export const parseMention = (_0x1d3bb6 = '') => [..._0x1d3bb6['matchAll'](/@([0-9]{5,16}|0)/g)]['map'](_0x288407 => _0x288407[0x1] + '@s.whatsapp.net');
export const getGroupAdmins = _0x5e37eb => {
    const _0x253f31 = [];
    for (const _0x3bdb47 of _0x5e37eb) {
        if (_0x3bdb47['admin'] === 'superadmin' || _0x3bdb47['admin'] === 'admin')
            _0x253f31['push'](_0x3bdb47['id']);
    }
    return _0x253f31;
};
export const smsg = (_0x13690f, _0x6a2a9e, _0x2c5092) => {
    if (!_0x6a2a9e)
        return _0x6a2a9e;
    const _0x4cdc66 = proto['WebMessageInfo'];
    if (_0x6a2a9e['key']) {
        _0x6a2a9e['id'] = _0x6a2a9e['key']['id'];
        _0x6a2a9e['isBaileys'] = _0x6a2a9e['id']['startsWith']('BAE5') && _0x6a2a9e['id']['length'] === 0x10;
        _0x6a2a9e['chat'] = _0x6a2a9e['key']['remoteJid'];
        _0x6a2a9e['fromMe'] = _0x6a2a9e['key']['fromMe'];
        _0x6a2a9e['isGroup'] = _0x6a2a9e['chat']['endsWith']('@g.us');
        _0x6a2a9e['sender'] = _0x13690f['decodeJid'](_0x6a2a9e['fromMe'] && _0x13690f['user']['id'] || _0x6a2a9e['participant'] || _0x6a2a9e['key']['participant'] || _0x6a2a9e['chat'] || '');
        if (_0x6a2a9e['isGroup'])
            _0x6a2a9e['participant'] = _0x13690f['decodeJid'](_0x6a2a9e['key']['participant']) || '';
    }
    if (_0x6a2a9e['message']) {
        _0x6a2a9e['mtype'] = getContentType(_0x6a2a9e['message']);
        _0x6a2a9e['msg'] = _0x6a2a9e['mtype'] === 'viewOnceMessage' ? _0x6a2a9e['message'][_0x6a2a9e['mtype']]['message'][getContentType(_0x6a2a9e['message'][_0x6a2a9e['mtype']]['message'])] : _0x6a2a9e['message'][_0x6a2a9e['mtype']];
        _0x6a2a9e['body'] = _0x6a2a9e['message']['conversation'] || _0x6a2a9e['msg']?.['caption'] || _0x6a2a9e['msg']?.['text'] || _0x6a2a9e['mtype'] === 'listResponseMessage' && _0x6a2a9e['msg']?.['singleSelectReply']?.['selectedRowId'] || _0x6a2a9e['mtype'] === 'buttonsResponseMessage' && _0x6a2a9e['msg']?.['selectedButtonId'] || _0x6a2a9e['mtype'] === 'viewOnceMessage' && _0x6a2a9e['msg']?.['caption'] || _0x6a2a9e['text'];
        const _0x144e60 = _0x6a2a9e['quoted'] = _0x6a2a9e['msg']?.['contextInfo'] ? _0x6a2a9e['msg']['contextInfo']['quotedMessage'] : null;
        _0x6a2a9e['mentionedJid'] = _0x6a2a9e['msg']?.['contextInfo'] ? _0x6a2a9e['msg']['contextInfo']['mentionedJid'] : [];
        if (_0x6a2a9e['quoted']) {
            let _0x3ef507 = getContentType(_0x144e60);
            _0x6a2a9e['quoted'] = _0x6a2a9e['quoted'][_0x3ef507];
            if (['productMessage']['includes'](_0x3ef507)) {
                _0x3ef507 = getContentType(_0x6a2a9e['quoted']);
                _0x6a2a9e['quoted'] = _0x6a2a9e['quoted'][_0x3ef507];
            }
            if (typeof _0x6a2a9e['quoted'] === 'string')
                _0x6a2a9e['quoted'] = { 'text': _0x6a2a9e['quoted'] };
            _0x6a2a9e['quoted']['mtype'] = _0x3ef507;
            _0x6a2a9e['quoted']['id'] = _0x6a2a9e['msg']['contextInfo']['stanzaId'];
            _0x6a2a9e['quoted']['chat'] = _0x6a2a9e['msg']['contextInfo']['remoteJid'] || _0x6a2a9e['chat'];
            _0x6a2a9e['quoted']['isBaileys'] = _0x6a2a9e['quoted']['id'] ? _0x6a2a9e['quoted']['id']['startsWith']('BAE5') && _0x6a2a9e['quoted']['id']['length'] === 0x10 : ![];
            _0x6a2a9e['quoted']['sender'] = _0x13690f['decodeJid'](_0x6a2a9e['msg']['contextInfo']['participant']);
            _0x6a2a9e['quoted']['fromMe'] = _0x6a2a9e['quoted']['sender'] === (_0x13690f['user'] && _0x13690f['user']['id']);
            _0x6a2a9e['quoted']['text'] = _0x6a2a9e['quoted']['text'] || _0x6a2a9e['quoted']['caption'] || _0x6a2a9e['quoted']['conversation'] || _0x6a2a9e['quoted']['contentText'] || _0x6a2a9e['quoted']['selectedDisplayText'] || _0x6a2a9e['quoted']['title'] || '';
            _0x6a2a9e['quoted']['mentionedJid'] = _0x6a2a9e['msg']['contextInfo'] ? _0x6a2a9e['msg']['contextInfo']['mentionedJid'] : [];
            _0x6a2a9e['getQuotedObj'] = _0x6a2a9e['getQuotedMessage'] = async () => {
                if (!_0x6a2a9e['quoted']['id'])
                    return ![];
                const _0xc12a34 = await _0x2c5092['loadMessage'](_0x6a2a9e['chat'], _0x6a2a9e['quoted']['id'], _0x13690f);
                return smsg(_0x13690f, _0xc12a34, _0x2c5092);
            };
            const _0x187deb = _0x6a2a9e['quoted']['fakeObj'] = _0x4cdc66['fromObject']({
                'key': {
                    'remoteJid': _0x6a2a9e['quoted']['chat'],
                    'fromMe': _0x6a2a9e['quoted']['fromMe'],
                    'id': _0x6a2a9e['quoted']['id']
                },
                'message': _0x144e60,
                ..._0x6a2a9e['isGroup'] ? { 'participant': _0x6a2a9e['quoted']['sender'] } : {}
            });
            _0x6a2a9e['quoted']['delete'] = () => _0x13690f['sendMessage'](_0x6a2a9e['quoted']['chat'], { 'delete': _0x187deb['key'] });
            _0x6a2a9e['quoted']['copyNForward'] = (_0x2dfbcb, _0x2bfae4 = ![], _0x4ff5ef = {}) => _0x13690f['copyNForward'](_0x2dfbcb, _0x187deb, _0x2bfae4, _0x4ff5ef);
            _0x6a2a9e['quoted']['download'] = () => _0x13690f['downloadMediaMessage'](_0x6a2a9e['quoted']);
        }
    }
    if (_0x6a2a9e['msg']?.['url'])
        _0x6a2a9e['download'] = () => _0x13690f['downloadMediaMessage'](_0x6a2a9e['msg']);
    _0x6a2a9e['text'] = _0x6a2a9e['msg']?.['text'] || _0x6a2a9e['msg']?.['caption'] || _0x6a2a9e['message']?.['conversation'] || _0x6a2a9e['msg']?.['contentText'] || _0x6a2a9e['msg']?.['selectedDisplayText'] || _0x6a2a9e['msg']?.['title'] || '';
    _0x6a2a9e['reply'] = (_0x382a56, _0x3856b5 = _0x6a2a9e['chat'], _0x13555e = {}) => Buffer['isBuffer'](_0x382a56) ? _0x13690f['sendMedia'](_0x3856b5, _0x382a56, 'file', '', _0x6a2a9e, { ..._0x13555e }) : _0x13690f['sendText'](_0x3856b5, _0x382a56, _0x6a2a9e, { ..._0x13555e });
    _0x6a2a9e['copy'] = () => smsg(_0x13690f, _0x4cdc66['fromObject'](_0x4cdc66['toObject'](_0x6a2a9e)), _0x2c5092);
    _0x6a2a9e['copyNForward'] = (_0x3b6c0a = _0x6a2a9e['chat'], _0x2071d8 = ![], _0x476de = {}) => _0x13690f['copyNForward'](_0x3b6c0a, _0x6a2a9e, _0x2071d8, _0x476de);
    return _0x6a2a9e;
};