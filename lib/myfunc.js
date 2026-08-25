import {
    proto,
    getContentType
} from '@whiskeysockets/baileys';
import _0x0_0x47b8b4 from 'axios';
import _0x0_0x10aa9f from 'moment-timezone';
import { sizeFormatter } from 'human-readable';
import _0x0_0x366611 from 'util';
import _0x0_0x59ee30 from 'sharp';
export const unixTimestampSeconds = (_0x438647 = new Date()) => Math['floor'](_0x438647['getTime']() / 0x3e8);
export const generateMessageTag = _0x398233 => {
    let _0x1e30e3 = unixTimestampSeconds()['toString']();
    if (_0x398233)
        _0x1e30e3 += '.--' + _0x398233;
    return _0x1e30e3;
};
export const processTime = (_0x55f286, _0xf547cd) => _0x0_0x10aa9f['duration'](_0xf547cd['valueOf']() - _0x0_0x10aa9f(_0x55f286 * 0x3e8)['valueOf']())['asSeconds']();
export const getRandom = _0x5b2770 => '' + Math['floor'](Math['random']() * 0x2710) + _0x5b2770;
const BROWSER_HEADERS = {
    'DNT': '1',
    'Upgrade-Insecure-Request': '1'
};
export const getBuffer = async (_0x342d27, _0xf5d8e6 = {}) => {
    try {
        const _0xe2d462 = await _0x0_0x47b8b4({
            'method': 'get',
            'url': _0x342d27,
            'headers': BROWSER_HEADERS,
            ..._0xf5d8e6,
            'responseType': 'arraybuffer'
        });
        return _0xe2d462['data'];
    } catch (_0xe7cb9) {
        return _0xe7cb9;
    }
};
export const getImg = async (_0x2aa36a, _0x53d76c = {}) => {
    try {
        const _0x193fa4 = await _0x0_0x47b8b4({
            'method': 'get',
            'url': _0x2aa36a,
            'headers': BROWSER_HEADERS,
            ..._0x53d76c,
            'responseType': 'arraybuffer'
        });
        return _0x193fa4['data'];
    } catch (_0x5b59dd) {
        return _0x5b59dd;
    }
};
export const fetchJson = async (_0x661194, _0x86d627 = {}) => {
    try {
        const _0x5d8638 = await _0x0_0x47b8b4({
            'method': 'GET',
            'url': _0x661194,
            'headers': { 'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/95.0.4638.69\x20Safari/537.36' },
            ..._0x86d627
        });
        return _0x5d8638['data'];
    } catch (_0xef1f8e) {
        return _0xef1f8e;
    }
};
export const runtime = _0x5f2d2b => {
    _0x5f2d2b = Number(_0x5f2d2b);
    const _0x227225 = Math['floor'](_0x5f2d2b / (0xe10 * 0x18));
    const _0x588577 = Math['floor'](_0x5f2d2b % (0xe10 * 0x18) / 0xe10);
    const _0x55e5ff = Math['floor'](_0x5f2d2b % 0xe10 / 0x3c);
    const _0x4e10b6 = Math['floor'](_0x5f2d2b % 0x3c);
    const _0x23a154 = _0x227225 > 0x0 ? _0x227225 + (_0x227225 === 0x1 ? '\x20day,\x20' : '\x20days,\x20') : '';
    const _0x564461 = _0x588577 > 0x0 ? _0x588577 + (_0x588577 === 0x1 ? '\x20hour,\x20' : '\x20hours,\x20') : '';
    const _0x482879 = _0x55e5ff > 0x0 ? _0x55e5ff + (_0x55e5ff === 0x1 ? '\x20minute,\x20' : '\x20minutes,\x20') : '';
    const _0x5477c8 = _0x4e10b6 > 0x0 ? _0x4e10b6 + (_0x4e10b6 === 0x1 ? '\x20second' : '\x20seconds') : '';
    return _0x23a154 + _0x564461 + _0x482879 + _0x5477c8;
};
export const clockString = _0x1ff1d5 => {
    const _0x4c5670 = isNaN(_0x1ff1d5) ? '--' : Math['floor'](_0x1ff1d5 / 0x36ee80);
    const _0x1a5627 = isNaN(_0x1ff1d5) ? '--' : Math['floor'](_0x1ff1d5 / 0xea60) % 0x3c;
    const _0x459e05 = isNaN(_0x1ff1d5) ? '--' : Math['floor'](_0x1ff1d5 / 0x3e8) % 0x3c;
    return [
        _0x4c5670,
        _0x1a5627,
        _0x459e05
    ]['map'](_0x989dc6 => _0x989dc6['toString']()['padStart'](0x2, '0'))['join'](':');
};
export const sleep = _0x31c9c0 => new Promise(_0x37096d => setTimeout(_0x37096d, _0x31c9c0));
export const isUrl = _0x3aa7cf => _0x3aa7cf['match'](new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'));
export const getTime = (_0x2bbf83, _0x5cf2d3) => {
    if (_0x5cf2d3)
        return _0x0_0x10aa9f(_0x5cf2d3)['locale']('en')['format'](_0x2bbf83);
    return _0x0_0x10aa9f['tz']('Asia/Karachi')['locale']('en')['format'](_0x2bbf83);
};
export const formatDate = (_0x140b2d, _0x596064 = 'en') => {
    const _0x32f2d0 = new Date(_0x140b2d);
    return _0x32f2d0['toLocaleDateString'](_0x596064, {
        'weekday': 'long',
        'day': 'numeric',
        'month': 'long',
        'year': 'numeric',
        'hour': 'numeric',
        'minute': 'numeric',
        'second': 'numeric'
    });
};
export const tanggal = _0x48b62c => {
    const _0x31d9f2 = [
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
    const _0x7dde49 = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ];
    const _0x5a7ee7 = new Date(_0x48b62c);
    const _0x200cca = _0x5a7ee7['getDate']();
    const _0x5d41b2 = _0x5a7ee7['getMonth']();
    const _0x275829 = _0x7dde49[_0x5a7ee7['getDay']()];
    const _0xc4d201 = _0x5a7ee7['getFullYear']();
    const _0x5ce7de = _0xc4d201 < 0x3e8 ? _0xc4d201 + 0x76c : _0xc4d201;
    return _0x275829 + ',\x20' + _0x200cca + '\x20-\x20' + _0x31d9f2[_0x5d41b2] + '\x20-\x20' + _0x5ce7de;
};
export const jam = (_0x5bda75, _0xc46fc8 = {}) => {
    const _0x567534 = _0xc46fc8['format'] ?? 'HH:mm';
    const _0x5a578e = _0xc46fc8['timeZone'] ? _0x0_0x10aa9f(_0x5bda75)['tz'](_0xc46fc8['timeZone'])['format'](_0x567534) : _0x0_0x10aa9f(_0x5bda75)['format'](_0x567534);
    return _0x5a578e;
};
export const formatp = sizeFormatter({
    'std': 'JEDEC',
    'decimalPlaces': 0x2,
    'keepTrailingZeroes': ![],
    'render': (_0x52a4a1, _0x5912e8) => _0x52a4a1 + '\x20' + _0x5912e8 + 'B'
});
export const json = _0x2939b5 => JSON['stringify'](_0x2939b5, null, 0x2);
export const logic = (_0xbe2ae, _0x53b106, _0x2b7fd5) => {
    if (_0x53b106['length'] !== _0x2b7fd5['length'])
        throw new Error('Input\x20and\x20Output\x20must\x20have\x20same\x20length');
    for (let _0x58e75e = 0x0; _0x58e75e < _0x53b106['length']; _0x58e75e++) {
        if (_0x0_0x366611['isDeepStrictEqual'](_0xbe2ae, _0x53b106[_0x58e75e]))
            return _0x2b7fd5[_0x58e75e];
    }
    return null;
};
export const generateProfilePicture = async _0x31cb62 => {
    const _0x59e59d = _0x0_0x59ee30(_0x31cb62);
    const {
        width: width = 0x0,
        height: height = 0x0
    } = await _0x59e59d['metadata']();
    const _0x104ae9 = Math['min'](width, height);
    const _0x21fbe3 = await _0x59e59d['extract']({
        'left': 0x0,
        'top': 0x0,
        'width': _0x104ae9,
        'height': _0x104ae9
    })['resize'](0x2d0, 0x2d0)['jpeg']()['toBuffer']();
    return {
        'img': _0x21fbe3,
        'preview': _0x21fbe3
    };
};
export const reSize = async (_0x40f5fe, _0x3f2992, _0x142a9d) => _0x0_0x59ee30(_0x40f5fe)['resize'](_0x3f2992, _0x142a9d)['jpeg']()['toBuffer']();
export const bytesToSize = (_0x18aa50, _0x1edd98 = 0x2) => {
    if (_0x18aa50 === 0x0)
        return '0\x20Bytes';
    const _0x4f537b = 0x400;
    const _0x1dad27 = _0x1edd98 < 0x0 ? 0x0 : _0x1edd98;
    const _0x49a46e = [
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
    const _0x458fba = Math['floor'](Math['log'](_0x18aa50) / Math['log'](_0x4f537b));
    return parseFloat((_0x18aa50 / Math['pow'](_0x4f537b, _0x458fba))['toFixed'](_0x1dad27)) + '\x20' + _0x49a46e[_0x458fba];
};
export const getSizeMedia = _0x4a13ed => {
    return new Promise((_0x4ce2ba, _0xc117f6) => {
        if (typeof _0x4a13ed === 'string' && /http/['test'](_0x4a13ed)) {
            _0x0_0x47b8b4['get'](_0x4a13ed)['then'](_0x2a1b3d => {
                const _0x647d25 = parseInt(_0x2a1b3d['headers']['content-length'], 0xa);
                const _0x3dfe05 = bytesToSize(_0x647d25, 0x3);
                if (!isNaN(_0x647d25))
                    _0x4ce2ba(_0x3dfe05);
                else
                    _0xc117f6('Invalid\x20content-length');
            })['catch'](_0xc117f6);
        } else if (Buffer['isBuffer'](_0x4a13ed)) {
            const _0x1bc4a0 = Buffer['byteLength'](_0x4a13ed);
            const _0x15d6ca = bytesToSize(_0x1bc4a0, 0x3);
            if (!isNaN(_0x1bc4a0))
                _0x4ce2ba(_0x15d6ca);
            else
                _0xc117f6('Invalid\x20buffer\x20length');
        } else {
            _0xc117f6('Invalid\x20input:\x20must\x20be\x20a\x20URL\x20string\x20or\x20Buffer');
        }
    });
};
export const parseMention = (_0x2c257c = '') => [..._0x2c257c['matchAll'](/@([0-9]{5,16}|0)/g)]['map'](_0xa4db7c => _0xa4db7c[0x1] + '@s.whatsapp.net');
export const getGroupAdmins = _0x26cac9 => {
    const _0x523d73 = [];
    for (const _0x5e0be3 of _0x26cac9) {
        if (_0x5e0be3['admin'] === 'superadmin' || _0x5e0be3['admin'] === 'admin')
            _0x523d73['push'](_0x5e0be3['id']);
    }
    return _0x523d73;
};
export const smsg = (_0xe8abfb, _0x56c3ee, _0x38e89f) => {
    if (!_0x56c3ee)
        return _0x56c3ee;
    const _0x552af8 = proto['WebMessageInfo'];
    if (_0x56c3ee['key']) {
        _0x56c3ee['id'] = _0x56c3ee['key']['id'];
        _0x56c3ee['isBaileys'] = _0x56c3ee['id']['startsWith']('BAE5') && _0x56c3ee['id']['length'] === 0x10;
        _0x56c3ee['chat'] = _0x56c3ee['key']['remoteJid'];
        _0x56c3ee['fromMe'] = _0x56c3ee['key']['fromMe'];
        _0x56c3ee['isGroup'] = _0x56c3ee['chat']['endsWith']('@g.us');
        _0x56c3ee['sender'] = _0xe8abfb['decodeJid'](_0x56c3ee['fromMe'] && _0xe8abfb['user']['id'] || _0x56c3ee['participant'] || _0x56c3ee['key']['participant'] || _0x56c3ee['chat'] || '');
        if (_0x56c3ee['isGroup'])
            _0x56c3ee['participant'] = _0xe8abfb['decodeJid'](_0x56c3ee['key']['participant']) || '';
    }
    if (_0x56c3ee['message']) {
        _0x56c3ee['mtype'] = getContentType(_0x56c3ee['message']);
        _0x56c3ee['msg'] = _0x56c3ee['mtype'] === 'viewOnceMessage' ? _0x56c3ee['message'][_0x56c3ee['mtype']]['message'][getContentType(_0x56c3ee['message'][_0x56c3ee['mtype']]['message'])] : _0x56c3ee['message'][_0x56c3ee['mtype']];
        _0x56c3ee['body'] = _0x56c3ee['message']['conversation'] || _0x56c3ee['msg']?.['caption'] || _0x56c3ee['msg']?.['text'] || _0x56c3ee['mtype'] === 'listResponseMessage' && _0x56c3ee['msg']?.['singleSelectReply']?.['selectedRowId'] || _0x56c3ee['mtype'] === 'buttonsResponseMessage' && _0x56c3ee['msg']?.['selectedButtonId'] || _0x56c3ee['mtype'] === 'viewOnceMessage' && _0x56c3ee['msg']?.['caption'] || _0x56c3ee['text'];
        const _0x283a0a = _0x56c3ee['quoted'] = _0x56c3ee['msg']?.['contextInfo'] ? _0x56c3ee['msg']['contextInfo']['quotedMessage'] : null;
        _0x56c3ee['mentionedJid'] = _0x56c3ee['msg']?.['contextInfo'] ? _0x56c3ee['msg']['contextInfo']['mentionedJid'] : [];
        if (_0x56c3ee['quoted']) {
            let _0x11fc72 = getContentType(_0x283a0a);
            _0x56c3ee['quoted'] = _0x56c3ee['quoted'][_0x11fc72];
            if (['productMessage']['includes'](_0x11fc72)) {
                _0x11fc72 = getContentType(_0x56c3ee['quoted']);
                _0x56c3ee['quoted'] = _0x56c3ee['quoted'][_0x11fc72];
            }
            if (typeof _0x56c3ee['quoted'] === 'string')
                _0x56c3ee['quoted'] = { 'text': _0x56c3ee['quoted'] };
            _0x56c3ee['quoted']['mtype'] = _0x11fc72;
            _0x56c3ee['quoted']['id'] = _0x56c3ee['msg']['contextInfo']['stanzaId'];
            _0x56c3ee['quoted']['chat'] = _0x56c3ee['msg']['contextInfo']['remoteJid'] || _0x56c3ee['chat'];
            _0x56c3ee['quoted']['isBaileys'] = _0x56c3ee['quoted']['id'] ? _0x56c3ee['quoted']['id']['startsWith']('BAE5') && _0x56c3ee['quoted']['id']['length'] === 0x10 : ![];
            _0x56c3ee['quoted']['sender'] = _0xe8abfb['decodeJid'](_0x56c3ee['msg']['contextInfo']['participant']);
            _0x56c3ee['quoted']['fromMe'] = _0x56c3ee['quoted']['sender'] === (_0xe8abfb['user'] && _0xe8abfb['user']['id']);
            _0x56c3ee['quoted']['text'] = _0x56c3ee['quoted']['text'] || _0x56c3ee['quoted']['caption'] || _0x56c3ee['quoted']['conversation'] || _0x56c3ee['quoted']['contentText'] || _0x56c3ee['quoted']['selectedDisplayText'] || _0x56c3ee['quoted']['title'] || '';
            _0x56c3ee['quoted']['mentionedJid'] = _0x56c3ee['msg']['contextInfo'] ? _0x56c3ee['msg']['contextInfo']['mentionedJid'] : [];
            _0x56c3ee['getQuotedObj'] = _0x56c3ee['getQuotedMessage'] = async () => {
                if (!_0x56c3ee['quoted']['id'])
                    return ![];
                const _0xcfb58f = await _0x38e89f['loadMessage'](_0x56c3ee['chat'], _0x56c3ee['quoted']['id'], _0xe8abfb);
                return smsg(_0xe8abfb, _0xcfb58f, _0x38e89f);
            };
            const _0xeba172 = _0x56c3ee['quoted']['fakeObj'] = _0x552af8['fromObject']({
                'key': {
                    'remoteJid': _0x56c3ee['quoted']['chat'],
                    'fromMe': _0x56c3ee['quoted']['fromMe'],
                    'id': _0x56c3ee['quoted']['id']
                },
                'message': _0x283a0a,
                ..._0x56c3ee['isGroup'] ? { 'participant': _0x56c3ee['quoted']['sender'] } : {}
            });
            _0x56c3ee['quoted']['delete'] = () => _0xe8abfb['sendMessage'](_0x56c3ee['quoted']['chat'], { 'delete': _0xeba172['key'] });
            _0x56c3ee['quoted']['copyNForward'] = (_0x17f0c1, _0x4c4da5 = ![], _0x275b88 = {}) => _0xe8abfb['copyNForward'](_0x17f0c1, _0xeba172, _0x4c4da5, _0x275b88);
            _0x56c3ee['quoted']['download'] = () => _0xe8abfb['downloadMediaMessage'](_0x56c3ee['quoted']);
        }
    }
    if (_0x56c3ee['msg']?.['url'])
        _0x56c3ee['download'] = () => _0xe8abfb['downloadMediaMessage'](_0x56c3ee['msg']);
    _0x56c3ee['text'] = _0x56c3ee['msg']?.['text'] || _0x56c3ee['msg']?.['caption'] || _0x56c3ee['message']?.['conversation'] || _0x56c3ee['msg']?.['contentText'] || _0x56c3ee['msg']?.['selectedDisplayText'] || _0x56c3ee['msg']?.['title'] || '';
    _0x56c3ee['reply'] = (_0x2b0c2f, _0x170ff0 = _0x56c3ee['chat'], _0x4a0976 = {}) => Buffer['isBuffer'](_0x2b0c2f) ? _0xe8abfb['sendMedia'](_0x170ff0, _0x2b0c2f, 'file', '', _0x56c3ee, { ..._0x4a0976 }) : _0xe8abfb['sendText'](_0x170ff0, _0x2b0c2f, _0x56c3ee, { ..._0x4a0976 });
    _0x56c3ee['copy'] = () => smsg(_0xe8abfb, _0x552af8['fromObject'](_0x552af8['toObject'](_0x56c3ee)), _0x38e89f);
    _0x56c3ee['copyNForward'] = (_0xcae327 = _0x56c3ee['chat'], _0xfe08cb = ![], _0xa3145e = {}) => _0xe8abfb['copyNForward'](_0xcae327, _0x56c3ee, _0xfe08cb, _0xa3145e);
    return _0x56c3ee;
};