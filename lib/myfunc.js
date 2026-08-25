import {
    proto,
    getContentType
} from '@whiskeysockets/baileys';
import _0x0_0x43a9e1 from 'axios';
import _0x0_0x2d9b99 from 'moment-timezone';
import { sizeFormatter } from 'human-readable';
import _0x0_0x466a42 from 'util';
import _0x0_0x527732 from 'sharp';
export const unixTimestampSeconds = (_0x234828 = new Date()) => Math['floor'](_0x234828['getTime']() / 0x3e8);
export const generateMessageTag = _0x2de668 => {
    let _0xc567b = unixTimestampSeconds()['toString']();
    if (_0x2de668)
        _0xc567b += '.--' + _0x2de668;
    return _0xc567b;
};
export const processTime = (_0x31b829, _0x576f3d) => _0x0_0x2d9b99['duration'](_0x576f3d['valueOf']() - _0x0_0x2d9b99(_0x31b829 * 0x3e8)['valueOf']())['asSeconds']();
export const getRandom = _0x51f6ba => '' + Math['floor'](Math['random']() * 0x2710) + _0x51f6ba;
const BROWSER_HEADERS = {
    'DNT': '1',
    'Upgrade-Insecure-Request': '1'
};
export const getBuffer = async (_0xb5755f, _0x358ada = {}) => {
    try {
        const _0x2058eb = await _0x0_0x43a9e1({
            'method': 'get',
            'url': _0xb5755f,
            'headers': BROWSER_HEADERS,
            ..._0x358ada,
            'responseType': 'arraybuffer'
        });
        return _0x2058eb['data'];
    } catch (_0xfa46ab) {
        return _0xfa46ab;
    }
};
export const getImg = async (_0xd5fda6, _0x46de87 = {}) => {
    try {
        const _0x538d6e = await _0x0_0x43a9e1({
            'method': 'get',
            'url': _0xd5fda6,
            'headers': BROWSER_HEADERS,
            ..._0x46de87,
            'responseType': 'arraybuffer'
        });
        return _0x538d6e['data'];
    } catch (_0xcd77f1) {
        return _0xcd77f1;
    }
};
export const fetchJson = async (_0x1a7034, _0x5b7d58 = {}) => {
    try {
        const _0x2b02c7 = await _0x0_0x43a9e1({
            'method': 'GET',
            'url': _0x1a7034,
            'headers': { 'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/95.0.4638.69\x20Safari/537.36' },
            ..._0x5b7d58
        });
        return _0x2b02c7['data'];
    } catch (_0x87f978) {
        return _0x87f978;
    }
};
export const runtime = _0x4fbf66 => {
    _0x4fbf66 = Number(_0x4fbf66);
    const _0x1735cb = Math['floor'](_0x4fbf66 / (0xe10 * 0x18));
    const _0x25aeaf = Math['floor'](_0x4fbf66 % (0xe10 * 0x18) / 0xe10);
    const _0x49a250 = Math['floor'](_0x4fbf66 % 0xe10 / 0x3c);
    const _0x5a6a07 = Math['floor'](_0x4fbf66 % 0x3c);
    const _0x5d7c31 = _0x1735cb > 0x0 ? _0x1735cb + (_0x1735cb === 0x1 ? '\x20day,\x20' : '\x20days,\x20') : '';
    const _0x3f93b6 = _0x25aeaf > 0x0 ? _0x25aeaf + (_0x25aeaf === 0x1 ? '\x20hour,\x20' : '\x20hours,\x20') : '';
    const _0x38da28 = _0x49a250 > 0x0 ? _0x49a250 + (_0x49a250 === 0x1 ? '\x20minute,\x20' : '\x20minutes,\x20') : '';
    const _0x36c083 = _0x5a6a07 > 0x0 ? _0x5a6a07 + (_0x5a6a07 === 0x1 ? '\x20second' : '\x20seconds') : '';
    return _0x5d7c31 + _0x3f93b6 + _0x38da28 + _0x36c083;
};
export const clockString = _0x5e648e => {
    const _0x1483d2 = isNaN(_0x5e648e) ? '--' : Math['floor'](_0x5e648e / 0x36ee80);
    const _0x33d724 = isNaN(_0x5e648e) ? '--' : Math['floor'](_0x5e648e / 0xea60) % 0x3c;
    const _0x66ddfb = isNaN(_0x5e648e) ? '--' : Math['floor'](_0x5e648e / 0x3e8) % 0x3c;
    return [
        _0x1483d2,
        _0x33d724,
        _0x66ddfb
    ]['map'](_0x3a726a => _0x3a726a['toString']()['padStart'](0x2, '0'))['join'](':');
};
export const sleep = _0x247094 => new Promise(_0x1e22f7 => setTimeout(_0x1e22f7, _0x247094));
export const isUrl = _0x208dfb => _0x208dfb['match'](new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'));
export const getTime = (_0x4d775d, _0x2e576d) => {
    if (_0x2e576d)
        return _0x0_0x2d9b99(_0x2e576d)['locale']('en')['format'](_0x4d775d);
    return _0x0_0x2d9b99['tz']('Asia/Karachi')['locale']('en')['format'](_0x4d775d);
};
export const formatDate = (_0x5cc462, _0x28040f = 'en') => {
    const _0x31b32f = new Date(_0x5cc462);
    return _0x31b32f['toLocaleDateString'](_0x28040f, {
        'weekday': 'long',
        'day': 'numeric',
        'month': 'long',
        'year': 'numeric',
        'hour': 'numeric',
        'minute': 'numeric',
        'second': 'numeric'
    });
};
export const tanggal = _0x5503a6 => {
    const _0x572c3f = [
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
    const _0x313c2d = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ];
    const _0x1332e3 = new Date(_0x5503a6);
    const _0x2c7659 = _0x1332e3['getDate']();
    const _0xcab012 = _0x1332e3['getMonth']();
    const _0x260db0 = _0x313c2d[_0x1332e3['getDay']()];
    const _0x3e45ce = _0x1332e3['getFullYear']();
    const _0x57b9dc = _0x3e45ce < 0x3e8 ? _0x3e45ce + 0x76c : _0x3e45ce;
    return _0x260db0 + ',\x20' + _0x2c7659 + '\x20-\x20' + _0x572c3f[_0xcab012] + '\x20-\x20' + _0x57b9dc;
};
export const jam = (_0x13ee6a, _0x37a3e4 = {}) => {
    const _0x2ff87e = _0x37a3e4['format'] ?? 'HH:mm';
    const _0x5602dd = _0x37a3e4['timeZone'] ? _0x0_0x2d9b99(_0x13ee6a)['tz'](_0x37a3e4['timeZone'])['format'](_0x2ff87e) : _0x0_0x2d9b99(_0x13ee6a)['format'](_0x2ff87e);
    return _0x5602dd;
};
export const formatp = sizeFormatter({
    'std': 'JEDEC',
    'decimalPlaces': 0x2,
    'keepTrailingZeroes': ![],
    'render': (_0x2db160, _0x1e3e21) => _0x2db160 + '\x20' + _0x1e3e21 + 'B'
});
export const json = _0xd75ec => JSON['stringify'](_0xd75ec, null, 0x2);
export const logic = (_0x2058f8, _0x2097fa, _0x230864) => {
    if (_0x2097fa['length'] !== _0x230864['length'])
        throw new Error('Input\x20and\x20Output\x20must\x20have\x20same\x20length');
    for (let _0x31a604 = 0x0; _0x31a604 < _0x2097fa['length']; _0x31a604++) {
        if (_0x0_0x466a42['isDeepStrictEqual'](_0x2058f8, _0x2097fa[_0x31a604]))
            return _0x230864[_0x31a604];
    }
    return null;
};
export const generateProfilePicture = async _0x26555a => {
    const _0x3c4ec6 = _0x0_0x527732(_0x26555a);
    const {
        width: width = 0x0,
        height: height = 0x0
    } = await _0x3c4ec6['metadata']();
    const _0x23342c = Math['min'](width, height);
    const _0x42fa5e = await _0x3c4ec6['extract']({
        'left': 0x0,
        'top': 0x0,
        'width': _0x23342c,
        'height': _0x23342c
    })['resize'](0x2d0, 0x2d0)['jpeg']()['toBuffer']();
    return {
        'img': _0x42fa5e,
        'preview': _0x42fa5e
    };
};
export const reSize = async (_0x4a3bf1, _0x28d0ee, _0x41f517) => _0x0_0x527732(_0x4a3bf1)['resize'](_0x28d0ee, _0x41f517)['jpeg']()['toBuffer']();
export const bytesToSize = (_0x29c62e, _0x5bc7a6 = 0x2) => {
    if (_0x29c62e === 0x0)
        return '0\x20Bytes';
    const _0x5d9f29 = 0x400;
    const _0x8f345 = _0x5bc7a6 < 0x0 ? 0x0 : _0x5bc7a6;
    const _0x45d14b = [
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
    const _0x1e2a15 = Math['floor'](Math['log'](_0x29c62e) / Math['log'](_0x5d9f29));
    return parseFloat((_0x29c62e / Math['pow'](_0x5d9f29, _0x1e2a15))['toFixed'](_0x8f345)) + '\x20' + _0x45d14b[_0x1e2a15];
};
export const getSizeMedia = _0x43738c => {
    return new Promise((_0x4f99b2, _0x5d693b) => {
        if (typeof _0x43738c === 'string' && /http/['test'](_0x43738c)) {
            _0x0_0x43a9e1['get'](_0x43738c)['then'](_0x5bc068 => {
                const _0x2cd49a = parseInt(_0x5bc068['headers']['content-length'], 0xa);
                const _0x4a2732 = bytesToSize(_0x2cd49a, 0x3);
                if (!isNaN(_0x2cd49a))
                    _0x4f99b2(_0x4a2732);
                else
                    _0x5d693b('Invalid\x20content-length');
            })['catch'](_0x5d693b);
        } else if (Buffer['isBuffer'](_0x43738c)) {
            const _0x2c3e40 = Buffer['byteLength'](_0x43738c);
            const _0x52928c = bytesToSize(_0x2c3e40, 0x3);
            if (!isNaN(_0x2c3e40))
                _0x4f99b2(_0x52928c);
            else
                _0x5d693b('Invalid\x20buffer\x20length');
        } else {
            _0x5d693b('Invalid\x20input:\x20must\x20be\x20a\x20URL\x20string\x20or\x20Buffer');
        }
    });
};
export const parseMention = (_0x3c190b = '') => [..._0x3c190b['matchAll'](/@([0-9]{5,16}|0)/g)]['map'](_0x3859ec => _0x3859ec[0x1] + '@s.whatsapp.net');
export const getGroupAdmins = _0x4a0f55 => {
    const _0x3a9dfb = [];
    for (const _0x1e46d6 of _0x4a0f55) {
        if (_0x1e46d6['admin'] === 'superadmin' || _0x1e46d6['admin'] === 'admin')
            _0x3a9dfb['push'](_0x1e46d6['id']);
    }
    return _0x3a9dfb;
};
export const smsg = (_0x5ac61d, _0x1abc3a, _0x2f6101) => {
    if (!_0x1abc3a)
        return _0x1abc3a;
    const _0x123f87 = proto['WebMessageInfo'];
    if (_0x1abc3a['key']) {
        _0x1abc3a['id'] = _0x1abc3a['key']['id'];
        _0x1abc3a['isBaileys'] = _0x1abc3a['id']['startsWith']('BAE5') && _0x1abc3a['id']['length'] === 0x10;
        _0x1abc3a['chat'] = _0x1abc3a['key']['remoteJid'];
        _0x1abc3a['fromMe'] = _0x1abc3a['key']['fromMe'];
        _0x1abc3a['isGroup'] = _0x1abc3a['chat']['endsWith']('@g.us');
        _0x1abc3a['sender'] = _0x5ac61d['decodeJid'](_0x1abc3a['fromMe'] && _0x5ac61d['user']['id'] || _0x1abc3a['participant'] || _0x1abc3a['key']['participant'] || _0x1abc3a['chat'] || '');
        if (_0x1abc3a['isGroup'])
            _0x1abc3a['participant'] = _0x5ac61d['decodeJid'](_0x1abc3a['key']['participant']) || '';
    }
    if (_0x1abc3a['message']) {
        _0x1abc3a['mtype'] = getContentType(_0x1abc3a['message']);
        _0x1abc3a['msg'] = _0x1abc3a['mtype'] === 'viewOnceMessage' ? _0x1abc3a['message'][_0x1abc3a['mtype']]['message'][getContentType(_0x1abc3a['message'][_0x1abc3a['mtype']]['message'])] : _0x1abc3a['message'][_0x1abc3a['mtype']];
        _0x1abc3a['body'] = _0x1abc3a['message']['conversation'] || _0x1abc3a['msg']?.['caption'] || _0x1abc3a['msg']?.['text'] || _0x1abc3a['mtype'] === 'listResponseMessage' && _0x1abc3a['msg']?.['singleSelectReply']?.['selectedRowId'] || _0x1abc3a['mtype'] === 'buttonsResponseMessage' && _0x1abc3a['msg']?.['selectedButtonId'] || _0x1abc3a['mtype'] === 'viewOnceMessage' && _0x1abc3a['msg']?.['caption'] || _0x1abc3a['text'];
        const _0x3b3cb1 = _0x1abc3a['quoted'] = _0x1abc3a['msg']?.['contextInfo'] ? _0x1abc3a['msg']['contextInfo']['quotedMessage'] : null;
        _0x1abc3a['mentionedJid'] = _0x1abc3a['msg']?.['contextInfo'] ? _0x1abc3a['msg']['contextInfo']['mentionedJid'] : [];
        if (_0x1abc3a['quoted']) {
            let _0x5b4562 = getContentType(_0x3b3cb1);
            _0x1abc3a['quoted'] = _0x1abc3a['quoted'][_0x5b4562];
            if (['productMessage']['includes'](_0x5b4562)) {
                _0x5b4562 = getContentType(_0x1abc3a['quoted']);
                _0x1abc3a['quoted'] = _0x1abc3a['quoted'][_0x5b4562];
            }
            if (typeof _0x1abc3a['quoted'] === 'string')
                _0x1abc3a['quoted'] = { 'text': _0x1abc3a['quoted'] };
            _0x1abc3a['quoted']['mtype'] = _0x5b4562;
            _0x1abc3a['quoted']['id'] = _0x1abc3a['msg']['contextInfo']['stanzaId'];
            _0x1abc3a['quoted']['chat'] = _0x1abc3a['msg']['contextInfo']['remoteJid'] || _0x1abc3a['chat'];
            _0x1abc3a['quoted']['isBaileys'] = _0x1abc3a['quoted']['id'] ? _0x1abc3a['quoted']['id']['startsWith']('BAE5') && _0x1abc3a['quoted']['id']['length'] === 0x10 : ![];
            _0x1abc3a['quoted']['sender'] = _0x5ac61d['decodeJid'](_0x1abc3a['msg']['contextInfo']['participant']);
            _0x1abc3a['quoted']['fromMe'] = _0x1abc3a['quoted']['sender'] === (_0x5ac61d['user'] && _0x5ac61d['user']['id']);
            _0x1abc3a['quoted']['text'] = _0x1abc3a['quoted']['text'] || _0x1abc3a['quoted']['caption'] || _0x1abc3a['quoted']['conversation'] || _0x1abc3a['quoted']['contentText'] || _0x1abc3a['quoted']['selectedDisplayText'] || _0x1abc3a['quoted']['title'] || '';
            _0x1abc3a['quoted']['mentionedJid'] = _0x1abc3a['msg']['contextInfo'] ? _0x1abc3a['msg']['contextInfo']['mentionedJid'] : [];
            _0x1abc3a['getQuotedObj'] = _0x1abc3a['getQuotedMessage'] = async () => {
                if (!_0x1abc3a['quoted']['id'])
                    return ![];
                const _0x30b8c6 = await _0x2f6101['loadMessage'](_0x1abc3a['chat'], _0x1abc3a['quoted']['id'], _0x5ac61d);
                return smsg(_0x5ac61d, _0x30b8c6, _0x2f6101);
            };
            const _0x1c39b6 = _0x1abc3a['quoted']['fakeObj'] = _0x123f87['fromObject']({
                'key': {
                    'remoteJid': _0x1abc3a['quoted']['chat'],
                    'fromMe': _0x1abc3a['quoted']['fromMe'],
                    'id': _0x1abc3a['quoted']['id']
                },
                'message': _0x3b3cb1,
                ..._0x1abc3a['isGroup'] ? { 'participant': _0x1abc3a['quoted']['sender'] } : {}
            });
            _0x1abc3a['quoted']['delete'] = () => _0x5ac61d['sendMessage'](_0x1abc3a['quoted']['chat'], { 'delete': _0x1c39b6['key'] });
            _0x1abc3a['quoted']['copyNForward'] = (_0xd15491, _0x25f270 = ![], _0x266697 = {}) => _0x5ac61d['copyNForward'](_0xd15491, _0x1c39b6, _0x25f270, _0x266697);
            _0x1abc3a['quoted']['download'] = () => _0x5ac61d['downloadMediaMessage'](_0x1abc3a['quoted']);
        }
    }
    if (_0x1abc3a['msg']?.['url'])
        _0x1abc3a['download'] = () => _0x5ac61d['downloadMediaMessage'](_0x1abc3a['msg']);
    _0x1abc3a['text'] = _0x1abc3a['msg']?.['text'] || _0x1abc3a['msg']?.['caption'] || _0x1abc3a['message']?.['conversation'] || _0x1abc3a['msg']?.['contentText'] || _0x1abc3a['msg']?.['selectedDisplayText'] || _0x1abc3a['msg']?.['title'] || '';
    _0x1abc3a['reply'] = (_0x38245d, _0x1e47dd = _0x1abc3a['chat'], _0x4bb2d9 = {}) => Buffer['isBuffer'](_0x38245d) ? _0x5ac61d['sendMedia'](_0x1e47dd, _0x38245d, 'file', '', _0x1abc3a, { ..._0x4bb2d9 }) : _0x5ac61d['sendText'](_0x1e47dd, _0x38245d, _0x1abc3a, { ..._0x4bb2d9 });
    _0x1abc3a['copy'] = () => smsg(_0x5ac61d, _0x123f87['fromObject'](_0x123f87['toObject'](_0x1abc3a)), _0x2f6101);
    _0x1abc3a['copyNForward'] = (_0x5656d5 = _0x1abc3a['chat'], _0xaf2fa5 = ![], _0x34afb0 = {}) => _0x5ac61d['copyNForward'](_0x5656d5, _0x1abc3a, _0xaf2fa5, _0x34afb0);
    return _0x1abc3a;
};