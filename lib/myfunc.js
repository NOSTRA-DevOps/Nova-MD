import {
    proto,
    getContentType
} from '@whiskeysockets/baileys';
import _0x0_0x1bd43c from 'axios';
import _0x0_0x164a09 from 'moment-timezone';
import { sizeFormatter } from 'human-readable';
import _0x0_0xdaf7b1 from 'util';
import _0x0_0x4b0be4 from 'sharp';
export const unixTimestampSeconds = (_0x38a6a9 = new Date()) => Math['floor'](_0x38a6a9['getTime']() / 0x3e8);
export const generateMessageTag = _0xe34a86 => {
    let _0x2b7f31 = unixTimestampSeconds()['toString']();
    if (_0xe34a86)
        _0x2b7f31 += '.--' + _0xe34a86;
    return _0x2b7f31;
};
export const processTime = (_0x173a5b, _0x12e948) => _0x0_0x164a09['duration'](_0x12e948['valueOf']() - _0x0_0x164a09(_0x173a5b * 0x3e8)['valueOf']())['asSeconds']();
export const getRandom = _0x1d40f8 => '' + Math['floor'](Math['random']() * 0x2710) + _0x1d40f8;
const BROWSER_HEADERS = {
    'DNT': '1',
    'Upgrade-Insecure-Request': '1'
};
export const getBuffer = async (_0x450d96, _0x3a0eec = {}) => {
    try {
        const _0x18168a = await _0x0_0x1bd43c({
            'method': 'get',
            'url': _0x450d96,
            'headers': BROWSER_HEADERS,
            ..._0x3a0eec,
            'responseType': 'arraybuffer'
        });
        return _0x18168a['data'];
    } catch (_0x5b45a2) {
        return _0x5b45a2;
    }
};
export const getImg = async (_0x3082e7, _0x188db0 = {}) => {
    try {
        const _0x58e85d = await _0x0_0x1bd43c({
            'method': 'get',
            'url': _0x3082e7,
            'headers': BROWSER_HEADERS,
            ..._0x188db0,
            'responseType': 'arraybuffer'
        });
        return _0x58e85d['data'];
    } catch (_0x5d7ac1) {
        return _0x5d7ac1;
    }
};
export const fetchJson = async (_0x1b0a55, _0x59494f = {}) => {
    try {
        const _0x5dfaf9 = await _0x0_0x1bd43c({
            'method': 'GET',
            'url': _0x1b0a55,
            'headers': { 'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/95.0.4638.69\x20Safari/537.36' },
            ..._0x59494f
        });
        return _0x5dfaf9['data'];
    } catch (_0xac2387) {
        return _0xac2387;
    }
};
export const runtime = _0x480028 => {
    _0x480028 = Number(_0x480028);
    const _0x53d248 = Math['floor'](_0x480028 / (0xe10 * 0x18));
    const _0x30bfd1 = Math['floor'](_0x480028 % (0xe10 * 0x18) / 0xe10);
    const _0x3f7bcb = Math['floor'](_0x480028 % 0xe10 / 0x3c);
    const _0x48ab10 = Math['floor'](_0x480028 % 0x3c);
    const _0x4910fc = _0x53d248 > 0x0 ? _0x53d248 + (_0x53d248 === 0x1 ? '\x20day,\x20' : '\x20days,\x20') : '';
    const _0x1dfe61 = _0x30bfd1 > 0x0 ? _0x30bfd1 + (_0x30bfd1 === 0x1 ? '\x20hour,\x20' : '\x20hours,\x20') : '';
    const _0x24cf7e = _0x3f7bcb > 0x0 ? _0x3f7bcb + (_0x3f7bcb === 0x1 ? '\x20minute,\x20' : '\x20minutes,\x20') : '';
    const _0x27f838 = _0x48ab10 > 0x0 ? _0x48ab10 + (_0x48ab10 === 0x1 ? '\x20second' : '\x20seconds') : '';
    return _0x4910fc + _0x1dfe61 + _0x24cf7e + _0x27f838;
};
export const clockString = _0xda9a1f => {
    const _0x32e1cb = isNaN(_0xda9a1f) ? '--' : Math['floor'](_0xda9a1f / 0x36ee80);
    const _0x2a74d4 = isNaN(_0xda9a1f) ? '--' : Math['floor'](_0xda9a1f / 0xea60) % 0x3c;
    const _0x39cbf3 = isNaN(_0xda9a1f) ? '--' : Math['floor'](_0xda9a1f / 0x3e8) % 0x3c;
    return [
        _0x32e1cb,
        _0x2a74d4,
        _0x39cbf3
    ]['map'](_0x4fbf02 => _0x4fbf02['toString']()['padStart'](0x2, '0'))['join'](':');
};
export const sleep = _0xf0bf81 => new Promise(_0x3272ff => setTimeout(_0x3272ff, _0xf0bf81));
export const isUrl = _0x11faa2 => _0x11faa2['match'](new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'));
export const getTime = (_0x409b9e, _0x853729) => {
    if (_0x853729)
        return _0x0_0x164a09(_0x853729)['locale']('en')['format'](_0x409b9e);
    return _0x0_0x164a09['tz']('Asia/Karachi')['locale']('en')['format'](_0x409b9e);
};
export const formatDate = (_0x3132e4, _0x34e812 = 'en') => {
    const _0x49f74b = new Date(_0x3132e4);
    return _0x49f74b['toLocaleDateString'](_0x34e812, {
        'weekday': 'long',
        'day': 'numeric',
        'month': 'long',
        'year': 'numeric',
        'hour': 'numeric',
        'minute': 'numeric',
        'second': 'numeric'
    });
};
export const tanggal = _0x2a2ea6 => {
    const _0x243b9e = [
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
    const _0x5312b6 = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ];
    const _0x703ed = new Date(_0x2a2ea6);
    const _0xae10f8 = _0x703ed['getDate']();
    const _0x55701b = _0x703ed['getMonth']();
    const _0x570da1 = _0x5312b6[_0x703ed['getDay']()];
    const _0x4afd4f = _0x703ed['getFullYear']();
    const _0x25233a = _0x4afd4f < 0x3e8 ? _0x4afd4f + 0x76c : _0x4afd4f;
    return _0x570da1 + ',\x20' + _0xae10f8 + '\x20-\x20' + _0x243b9e[_0x55701b] + '\x20-\x20' + _0x25233a;
};
export const jam = (_0x30f662, _0x35defc = {}) => {
    const _0x5d8074 = _0x35defc['format'] ?? 'HH:mm';
    const _0x4255f0 = _0x35defc['timeZone'] ? _0x0_0x164a09(_0x30f662)['tz'](_0x35defc['timeZone'])['format'](_0x5d8074) : _0x0_0x164a09(_0x30f662)['format'](_0x5d8074);
    return _0x4255f0;
};
export const formatp = sizeFormatter({
    'std': 'JEDEC',
    'decimalPlaces': 0x2,
    'keepTrailingZeroes': ![],
    'render': (_0x4d2b96, _0x2d7840) => _0x4d2b96 + '\x20' + _0x2d7840 + 'B'
});
export const json = _0xc355a => JSON['stringify'](_0xc355a, null, 0x2);
export const logic = (_0x2dcb99, _0x3c4a31, _0x560f7e) => {
    if (_0x3c4a31['length'] !== _0x560f7e['length'])
        throw new Error('Input\x20and\x20Output\x20must\x20have\x20same\x20length');
    for (let _0x514695 = 0x0; _0x514695 < _0x3c4a31['length']; _0x514695++) {
        if (_0x0_0xdaf7b1['isDeepStrictEqual'](_0x2dcb99, _0x3c4a31[_0x514695]))
            return _0x560f7e[_0x514695];
    }
    return null;
};
export const generateProfilePicture = async _0x431283 => {
    const _0xc48a28 = _0x0_0x4b0be4(_0x431283);
    const {
        width: width = 0x0,
        height: height = 0x0
    } = await _0xc48a28['metadata']();
    const _0x11c2f6 = Math['min'](width, height);
    const _0xff6581 = await _0xc48a28['extract']({
        'left': 0x0,
        'top': 0x0,
        'width': _0x11c2f6,
        'height': _0x11c2f6
    })['resize'](0x2d0, 0x2d0)['jpeg']()['toBuffer']();
    return {
        'img': _0xff6581,
        'preview': _0xff6581
    };
};
export const reSize = async (_0x27f82c, _0x120acd, _0x494741) => _0x0_0x4b0be4(_0x27f82c)['resize'](_0x120acd, _0x494741)['jpeg']()['toBuffer']();
export const bytesToSize = (_0x1cbeb4, _0x46e69c = 0x2) => {
    if (_0x1cbeb4 === 0x0)
        return '0\x20Bytes';
    const _0x52d0ce = 0x400;
    const _0x497c40 = _0x46e69c < 0x0 ? 0x0 : _0x46e69c;
    const _0x213fb4 = [
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
    const _0x74531d = Math['floor'](Math['log'](_0x1cbeb4) / Math['log'](_0x52d0ce));
    return parseFloat((_0x1cbeb4 / Math['pow'](_0x52d0ce, _0x74531d))['toFixed'](_0x497c40)) + '\x20' + _0x213fb4[_0x74531d];
};
export const getSizeMedia = _0x358efc => {
    return new Promise((_0x540792, _0x5d7c9d) => {
        if (typeof _0x358efc === 'string' && /http/['test'](_0x358efc)) {
            _0x0_0x1bd43c['get'](_0x358efc)['then'](_0x6a44c4 => {
                const _0x16cd86 = parseInt(_0x6a44c4['headers']['content-length'], 0xa);
                const _0x4075bd = bytesToSize(_0x16cd86, 0x3);
                if (!isNaN(_0x16cd86))
                    _0x540792(_0x4075bd);
                else
                    _0x5d7c9d('Invalid\x20content-length');
            })['catch'](_0x5d7c9d);
        } else if (Buffer['isBuffer'](_0x358efc)) {
            const _0x20ba7e = Buffer['byteLength'](_0x358efc);
            const _0x57ac70 = bytesToSize(_0x20ba7e, 0x3);
            if (!isNaN(_0x20ba7e))
                _0x540792(_0x57ac70);
            else
                _0x5d7c9d('Invalid\x20buffer\x20length');
        } else {
            _0x5d7c9d('Invalid\x20input:\x20must\x20be\x20a\x20URL\x20string\x20or\x20Buffer');
        }
    });
};
export const parseMention = (_0x410b38 = '') => [..._0x410b38['matchAll'](/@([0-9]{5,16}|0)/g)]['map'](_0x37f769 => _0x37f769[0x1] + '@s.whatsapp.net');
export const getGroupAdmins = _0x4c1b25 => {
    const _0x56d5b6 = [];
    for (const _0x503bbc of _0x4c1b25) {
        if (_0x503bbc['admin'] === 'superadmin' || _0x503bbc['admin'] === 'admin')
            _0x56d5b6['push'](_0x503bbc['id']);
    }
    return _0x56d5b6;
};
export const smsg = (_0x574580, _0x41e9b5, _0x307f5c) => {
    if (!_0x41e9b5)
        return _0x41e9b5;
    const _0x20f478 = proto['WebMessageInfo'];
    if (_0x41e9b5['key']) {
        _0x41e9b5['id'] = _0x41e9b5['key']['id'];
        _0x41e9b5['isBaileys'] = _0x41e9b5['id']['startsWith']('BAE5') && _0x41e9b5['id']['length'] === 0x10;
        _0x41e9b5['chat'] = _0x41e9b5['key']['remoteJid'];
        _0x41e9b5['fromMe'] = _0x41e9b5['key']['fromMe'];
        _0x41e9b5['isGroup'] = _0x41e9b5['chat']['endsWith']('@g.us');
        _0x41e9b5['sender'] = _0x574580['decodeJid'](_0x41e9b5['fromMe'] && _0x574580['user']['id'] || _0x41e9b5['participant'] || _0x41e9b5['key']['participant'] || _0x41e9b5['chat'] || '');
        if (_0x41e9b5['isGroup'])
            _0x41e9b5['participant'] = _0x574580['decodeJid'](_0x41e9b5['key']['participant']) || '';
    }
    if (_0x41e9b5['message']) {
        _0x41e9b5['mtype'] = getContentType(_0x41e9b5['message']);
        _0x41e9b5['msg'] = _0x41e9b5['mtype'] === 'viewOnceMessage' ? _0x41e9b5['message'][_0x41e9b5['mtype']]['message'][getContentType(_0x41e9b5['message'][_0x41e9b5['mtype']]['message'])] : _0x41e9b5['message'][_0x41e9b5['mtype']];
        _0x41e9b5['body'] = _0x41e9b5['message']['conversation'] || _0x41e9b5['msg']?.['caption'] || _0x41e9b5['msg']?.['text'] || _0x41e9b5['mtype'] === 'listResponseMessage' && _0x41e9b5['msg']?.['singleSelectReply']?.['selectedRowId'] || _0x41e9b5['mtype'] === 'buttonsResponseMessage' && _0x41e9b5['msg']?.['selectedButtonId'] || _0x41e9b5['mtype'] === 'viewOnceMessage' && _0x41e9b5['msg']?.['caption'] || _0x41e9b5['text'];
        const _0x399b7a = _0x41e9b5['quoted'] = _0x41e9b5['msg']?.['contextInfo'] ? _0x41e9b5['msg']['contextInfo']['quotedMessage'] : null;
        _0x41e9b5['mentionedJid'] = _0x41e9b5['msg']?.['contextInfo'] ? _0x41e9b5['msg']['contextInfo']['mentionedJid'] : [];
        if (_0x41e9b5['quoted']) {
            let _0x3aadb3 = getContentType(_0x399b7a);
            _0x41e9b5['quoted'] = _0x41e9b5['quoted'][_0x3aadb3];
            if (['productMessage']['includes'](_0x3aadb3)) {
                _0x3aadb3 = getContentType(_0x41e9b5['quoted']);
                _0x41e9b5['quoted'] = _0x41e9b5['quoted'][_0x3aadb3];
            }
            if (typeof _0x41e9b5['quoted'] === 'string')
                _0x41e9b5['quoted'] = { 'text': _0x41e9b5['quoted'] };
            _0x41e9b5['quoted']['mtype'] = _0x3aadb3;
            _0x41e9b5['quoted']['id'] = _0x41e9b5['msg']['contextInfo']['stanzaId'];
            _0x41e9b5['quoted']['chat'] = _0x41e9b5['msg']['contextInfo']['remoteJid'] || _0x41e9b5['chat'];
            _0x41e9b5['quoted']['isBaileys'] = _0x41e9b5['quoted']['id'] ? _0x41e9b5['quoted']['id']['startsWith']('BAE5') && _0x41e9b5['quoted']['id']['length'] === 0x10 : ![];
            _0x41e9b5['quoted']['sender'] = _0x574580['decodeJid'](_0x41e9b5['msg']['contextInfo']['participant']);
            _0x41e9b5['quoted']['fromMe'] = _0x41e9b5['quoted']['sender'] === (_0x574580['user'] && _0x574580['user']['id']);
            _0x41e9b5['quoted']['text'] = _0x41e9b5['quoted']['text'] || _0x41e9b5['quoted']['caption'] || _0x41e9b5['quoted']['conversation'] || _0x41e9b5['quoted']['contentText'] || _0x41e9b5['quoted']['selectedDisplayText'] || _0x41e9b5['quoted']['title'] || '';
            _0x41e9b5['quoted']['mentionedJid'] = _0x41e9b5['msg']['contextInfo'] ? _0x41e9b5['msg']['contextInfo']['mentionedJid'] : [];
            _0x41e9b5['getQuotedObj'] = _0x41e9b5['getQuotedMessage'] = async () => {
                if (!_0x41e9b5['quoted']['id'])
                    return ![];
                const _0xd78c63 = await _0x307f5c['loadMessage'](_0x41e9b5['chat'], _0x41e9b5['quoted']['id'], _0x574580);
                return smsg(_0x574580, _0xd78c63, _0x307f5c);
            };
            const _0x5e52f5 = _0x41e9b5['quoted']['fakeObj'] = _0x20f478['fromObject']({
                'key': {
                    'remoteJid': _0x41e9b5['quoted']['chat'],
                    'fromMe': _0x41e9b5['quoted']['fromMe'],
                    'id': _0x41e9b5['quoted']['id']
                },
                'message': _0x399b7a,
                ..._0x41e9b5['isGroup'] ? { 'participant': _0x41e9b5['quoted']['sender'] } : {}
            });
            _0x41e9b5['quoted']['delete'] = () => _0x574580['sendMessage'](_0x41e9b5['quoted']['chat'], { 'delete': _0x5e52f5['key'] });
            _0x41e9b5['quoted']['copyNForward'] = (_0x290b35, _0x4fed67 = ![], _0x7e8394 = {}) => _0x574580['copyNForward'](_0x290b35, _0x5e52f5, _0x4fed67, _0x7e8394);
            _0x41e9b5['quoted']['download'] = () => _0x574580['downloadMediaMessage'](_0x41e9b5['quoted']);
        }
    }
    if (_0x41e9b5['msg']?.['url'])
        _0x41e9b5['download'] = () => _0x574580['downloadMediaMessage'](_0x41e9b5['msg']);
    _0x41e9b5['text'] = _0x41e9b5['msg']?.['text'] || _0x41e9b5['msg']?.['caption'] || _0x41e9b5['message']?.['conversation'] || _0x41e9b5['msg']?.['contentText'] || _0x41e9b5['msg']?.['selectedDisplayText'] || _0x41e9b5['msg']?.['title'] || '';
    _0x41e9b5['reply'] = (_0x11320b, _0x385cdf = _0x41e9b5['chat'], _0x322e02 = {}) => Buffer['isBuffer'](_0x11320b) ? _0x574580['sendMedia'](_0x385cdf, _0x11320b, 'file', '', _0x41e9b5, { ..._0x322e02 }) : _0x574580['sendText'](_0x385cdf, _0x11320b, _0x41e9b5, { ..._0x322e02 });
    _0x41e9b5['copy'] = () => smsg(_0x574580, _0x20f478['fromObject'](_0x20f478['toObject'](_0x41e9b5)), _0x307f5c);
    _0x41e9b5['copyNForward'] = (_0x5228f5 = _0x41e9b5['chat'], _0x158bc3 = ![], _0x214e92 = {}) => _0x574580['copyNForward'](_0x5228f5, _0x41e9b5, _0x158bc3, _0x214e92);
    return _0x41e9b5;
};