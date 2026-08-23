import {
    proto,
    getContentType
} from '@whiskeysockets/baileys';
import _0x0_0x1fc443 from 'axios';
import _0x0_0x57f4d4 from 'moment-timezone';
import { sizeFormatter } from 'human-readable';
import _0x0_0x20fb7b from 'util';
import _0x0_0x440af3 from 'sharp';
export const unixTimestampSeconds = (_0x56c160 = new Date()) => Math['floor'](_0x56c160['getTime']() / 0x3e8);
export const generateMessageTag = _0x182094 => {
    let _0x52965d = unixTimestampSeconds()['toString']();
    if (_0x182094)
        _0x52965d += '.--' + _0x182094;
    return _0x52965d;
};
export const processTime = (_0x53e87b, _0x5d7408) => _0x0_0x57f4d4['duration'](_0x5d7408['valueOf']() - _0x0_0x57f4d4(_0x53e87b * 0x3e8)['valueOf']())['asSeconds']();
export const getRandom = _0x39bd4d => '' + Math['floor'](Math['random']() * 0x2710) + _0x39bd4d;
const BROWSER_HEADERS = {
    'DNT': '1',
    'Upgrade-Insecure-Request': '1'
};
export const getBuffer = async (_0x1faca0, _0x37088f = {}) => {
    try {
        const _0x274d12 = await _0x0_0x1fc443({
            'method': 'get',
            'url': _0x1faca0,
            'headers': BROWSER_HEADERS,
            ..._0x37088f,
            'responseType': 'arraybuffer'
        });
        return _0x274d12['data'];
    } catch (_0x304553) {
        return _0x304553;
    }
};
export const getImg = async (_0x167368, _0x521d3e = {}) => {
    try {
        const _0x4614eb = await _0x0_0x1fc443({
            'method': 'get',
            'url': _0x167368,
            'headers': BROWSER_HEADERS,
            ..._0x521d3e,
            'responseType': 'arraybuffer'
        });
        return _0x4614eb['data'];
    } catch (_0x54bcc0) {
        return _0x54bcc0;
    }
};
export const fetchJson = async (_0x250c6d, _0x464c80 = {}) => {
    try {
        const _0x16ad17 = await _0x0_0x1fc443({
            'method': 'GET',
            'url': _0x250c6d,
            'headers': { 'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/95.0.4638.69\x20Safari/537.36' },
            ..._0x464c80
        });
        return _0x16ad17['data'];
    } catch (_0x48de96) {
        return _0x48de96;
    }
};
export const runtime = _0x44df8c => {
    _0x44df8c = Number(_0x44df8c);
    const _0x301909 = Math['floor'](_0x44df8c / (0xe10 * 0x18));
    const _0x56cfd6 = Math['floor'](_0x44df8c % (0xe10 * 0x18) / 0xe10);
    const _0x5eaf5d = Math['floor'](_0x44df8c % 0xe10 / 0x3c);
    const _0x40a2d0 = Math['floor'](_0x44df8c % 0x3c);
    const _0x260af6 = _0x301909 > 0x0 ? _0x301909 + (_0x301909 === 0x1 ? '\x20day,\x20' : '\x20days,\x20') : '';
    const _0x10ad75 = _0x56cfd6 > 0x0 ? _0x56cfd6 + (_0x56cfd6 === 0x1 ? '\x20hour,\x20' : '\x20hours,\x20') : '';
    const _0x23e068 = _0x5eaf5d > 0x0 ? _0x5eaf5d + (_0x5eaf5d === 0x1 ? '\x20minute,\x20' : '\x20minutes,\x20') : '';
    const _0x1028c4 = _0x40a2d0 > 0x0 ? _0x40a2d0 + (_0x40a2d0 === 0x1 ? '\x20second' : '\x20seconds') : '';
    return _0x260af6 + _0x10ad75 + _0x23e068 + _0x1028c4;
};
export const clockString = _0x351d99 => {
    const _0x392fc3 = isNaN(_0x351d99) ? '--' : Math['floor'](_0x351d99 / 0x36ee80);
    const _0x2beb69 = isNaN(_0x351d99) ? '--' : Math['floor'](_0x351d99 / 0xea60) % 0x3c;
    const _0x441488 = isNaN(_0x351d99) ? '--' : Math['floor'](_0x351d99 / 0x3e8) % 0x3c;
    return [
        _0x392fc3,
        _0x2beb69,
        _0x441488
    ]['map'](_0x6421f0 => _0x6421f0['toString']()['padStart'](0x2, '0'))['join'](':');
};
export const sleep = _0x515ade => new Promise(_0x3f3b73 => setTimeout(_0x3f3b73, _0x515ade));
export const isUrl = _0x293ca => _0x293ca['match'](new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'));
export const getTime = (_0x321794, _0x249aa7) => {
    if (_0x249aa7)
        return _0x0_0x57f4d4(_0x249aa7)['locale']('en')['format'](_0x321794);
    return _0x0_0x57f4d4['tz']('Asia/Karachi')['locale']('en')['format'](_0x321794);
};
export const formatDate = (_0xa4a13e, _0x1ae141 = 'en') => {
    const _0x5131c0 = new Date(_0xa4a13e);
    return _0x5131c0['toLocaleDateString'](_0x1ae141, {
        'weekday': 'long',
        'day': 'numeric',
        'month': 'long',
        'year': 'numeric',
        'hour': 'numeric',
        'minute': 'numeric',
        'second': 'numeric'
    });
};
export const tanggal = _0x27a2be => {
    const _0x286619 = [
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
    const _0x2dc315 = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ];
    const _0x47d6b6 = new Date(_0x27a2be);
    const _0x8e542a = _0x47d6b6['getDate']();
    const _0xe12d9a = _0x47d6b6['getMonth']();
    const _0x583fce = _0x2dc315[_0x47d6b6['getDay']()];
    const _0x47c0a8 = _0x47d6b6['getFullYear']();
    const _0x41597d = _0x47c0a8 < 0x3e8 ? _0x47c0a8 + 0x76c : _0x47c0a8;
    return _0x583fce + ',\x20' + _0x8e542a + '\x20-\x20' + _0x286619[_0xe12d9a] + '\x20-\x20' + _0x41597d;
};
export const jam = (_0xa9692f, _0x2ab8c5 = {}) => {
    const _0x1ad6c8 = _0x2ab8c5['format'] ?? 'HH:mm';
    const _0x13b6cc = _0x2ab8c5['timeZone'] ? _0x0_0x57f4d4(_0xa9692f)['tz'](_0x2ab8c5['timeZone'])['format'](_0x1ad6c8) : _0x0_0x57f4d4(_0xa9692f)['format'](_0x1ad6c8);
    return _0x13b6cc;
};
export const formatp = sizeFormatter({
    'std': 'JEDEC',
    'decimalPlaces': 0x2,
    'keepTrailingZeroes': ![],
    'render': (_0x3d4465, _0x4708ad) => _0x3d4465 + '\x20' + _0x4708ad + 'B'
});
export const json = _0x24e12b => JSON['stringify'](_0x24e12b, null, 0x2);
export const logic = (_0x22511a, _0x8deb2f, _0x4e48f7) => {
    if (_0x8deb2f['length'] !== _0x4e48f7['length'])
        throw new Error('Input\x20and\x20Output\x20must\x20have\x20same\x20length');
    for (let _0x4aa402 = 0x0; _0x4aa402 < _0x8deb2f['length']; _0x4aa402++) {
        if (_0x0_0x20fb7b['isDeepStrictEqual'](_0x22511a, _0x8deb2f[_0x4aa402]))
            return _0x4e48f7[_0x4aa402];
    }
    return null;
};
export const generateProfilePicture = async _0x5eb501 => {
    const _0x1bc49d = _0x0_0x440af3(_0x5eb501);
    const {
        width: width = 0x0,
        height: height = 0x0
    } = await _0x1bc49d['metadata']();
    const _0x5465cd = Math['min'](width, height);
    const _0x47cbb8 = await _0x1bc49d['extract']({
        'left': 0x0,
        'top': 0x0,
        'width': _0x5465cd,
        'height': _0x5465cd
    })['resize'](0x2d0, 0x2d0)['jpeg']()['toBuffer']();
    return {
        'img': _0x47cbb8,
        'preview': _0x47cbb8
    };
};
export const reSize = async (_0x15851d, _0x406ae4, _0x442ed8) => _0x0_0x440af3(_0x15851d)['resize'](_0x406ae4, _0x442ed8)['jpeg']()['toBuffer']();
export const bytesToSize = (_0x3c4e57, _0x51912a = 0x2) => {
    if (_0x3c4e57 === 0x0)
        return '0\x20Bytes';
    const _0xdf8941 = 0x400;
    const _0x2ce56d = _0x51912a < 0x0 ? 0x0 : _0x51912a;
    const _0x346fbd = [
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
    const _0x37f98b = Math['floor'](Math['log'](_0x3c4e57) / Math['log'](_0xdf8941));
    return parseFloat((_0x3c4e57 / Math['pow'](_0xdf8941, _0x37f98b))['toFixed'](_0x2ce56d)) + '\x20' + _0x346fbd[_0x37f98b];
};
export const getSizeMedia = _0xf75227 => {
    return new Promise((_0x5959ff, _0x1c4c3a) => {
        if (typeof _0xf75227 === 'string' && /http/['test'](_0xf75227)) {
            _0x0_0x1fc443['get'](_0xf75227)['then'](_0x23e32b => {
                const _0x36cc57 = parseInt(_0x23e32b['headers']['content-length'], 0xa);
                const _0xc5ec11 = bytesToSize(_0x36cc57, 0x3);
                if (!isNaN(_0x36cc57))
                    _0x5959ff(_0xc5ec11);
                else
                    _0x1c4c3a('Invalid\x20content-length');
            })['catch'](_0x1c4c3a);
        } else if (Buffer['isBuffer'](_0xf75227)) {
            const _0x69214f = Buffer['byteLength'](_0xf75227);
            const _0x466461 = bytesToSize(_0x69214f, 0x3);
            if (!isNaN(_0x69214f))
                _0x5959ff(_0x466461);
            else
                _0x1c4c3a('Invalid\x20buffer\x20length');
        } else {
            _0x1c4c3a('Invalid\x20input:\x20must\x20be\x20a\x20URL\x20string\x20or\x20Buffer');
        }
    });
};
export const parseMention = (_0x5cd5b3 = '') => [..._0x5cd5b3['matchAll'](/@([0-9]{5,16}|0)/g)]['map'](_0x2df106 => _0x2df106[0x1] + '@s.whatsapp.net');
export const getGroupAdmins = _0x4a2abb => {
    const _0x2dbc14 = [];
    for (const _0x433c60 of _0x4a2abb) {
        if (_0x433c60['admin'] === 'superadmin' || _0x433c60['admin'] === 'admin')
            _0x2dbc14['push'](_0x433c60['id']);
    }
    return _0x2dbc14;
};
export const smsg = (_0x30766c, _0x5dee11, _0x2abab6) => {
    if (!_0x5dee11)
        return _0x5dee11;
    const _0x59d046 = proto['WebMessageInfo'];
    if (_0x5dee11['key']) {
        _0x5dee11['id'] = _0x5dee11['key']['id'];
        _0x5dee11['isBaileys'] = _0x5dee11['id']['startsWith']('BAE5') && _0x5dee11['id']['length'] === 0x10;
        _0x5dee11['chat'] = _0x5dee11['key']['remoteJid'];
        _0x5dee11['fromMe'] = _0x5dee11['key']['fromMe'];
        _0x5dee11['isGroup'] = _0x5dee11['chat']['endsWith']('@g.us');
        _0x5dee11['sender'] = _0x30766c['decodeJid'](_0x5dee11['fromMe'] && _0x30766c['user']['id'] || _0x5dee11['participant'] || _0x5dee11['key']['participant'] || _0x5dee11['chat'] || '');
        if (_0x5dee11['isGroup'])
            _0x5dee11['participant'] = _0x30766c['decodeJid'](_0x5dee11['key']['participant']) || '';
    }
    if (_0x5dee11['message']) {
        _0x5dee11['mtype'] = getContentType(_0x5dee11['message']);
        _0x5dee11['msg'] = _0x5dee11['mtype'] === 'viewOnceMessage' ? _0x5dee11['message'][_0x5dee11['mtype']]['message'][getContentType(_0x5dee11['message'][_0x5dee11['mtype']]['message'])] : _0x5dee11['message'][_0x5dee11['mtype']];
        _0x5dee11['body'] = _0x5dee11['message']['conversation'] || _0x5dee11['msg']?.['caption'] || _0x5dee11['msg']?.['text'] || _0x5dee11['mtype'] === 'listResponseMessage' && _0x5dee11['msg']?.['singleSelectReply']?.['selectedRowId'] || _0x5dee11['mtype'] === 'buttonsResponseMessage' && _0x5dee11['msg']?.['selectedButtonId'] || _0x5dee11['mtype'] === 'viewOnceMessage' && _0x5dee11['msg']?.['caption'] || _0x5dee11['text'];
        const _0x328e13 = _0x5dee11['quoted'] = _0x5dee11['msg']?.['contextInfo'] ? _0x5dee11['msg']['contextInfo']['quotedMessage'] : null;
        _0x5dee11['mentionedJid'] = _0x5dee11['msg']?.['contextInfo'] ? _0x5dee11['msg']['contextInfo']['mentionedJid'] : [];
        if (_0x5dee11['quoted']) {
            let _0x52a50c = getContentType(_0x328e13);
            _0x5dee11['quoted'] = _0x5dee11['quoted'][_0x52a50c];
            if (['productMessage']['includes'](_0x52a50c)) {
                _0x52a50c = getContentType(_0x5dee11['quoted']);
                _0x5dee11['quoted'] = _0x5dee11['quoted'][_0x52a50c];
            }
            if (typeof _0x5dee11['quoted'] === 'string')
                _0x5dee11['quoted'] = { 'text': _0x5dee11['quoted'] };
            _0x5dee11['quoted']['mtype'] = _0x52a50c;
            _0x5dee11['quoted']['id'] = _0x5dee11['msg']['contextInfo']['stanzaId'];
            _0x5dee11['quoted']['chat'] = _0x5dee11['msg']['contextInfo']['remoteJid'] || _0x5dee11['chat'];
            _0x5dee11['quoted']['isBaileys'] = _0x5dee11['quoted']['id'] ? _0x5dee11['quoted']['id']['startsWith']('BAE5') && _0x5dee11['quoted']['id']['length'] === 0x10 : ![];
            _0x5dee11['quoted']['sender'] = _0x30766c['decodeJid'](_0x5dee11['msg']['contextInfo']['participant']);
            _0x5dee11['quoted']['fromMe'] = _0x5dee11['quoted']['sender'] === (_0x30766c['user'] && _0x30766c['user']['id']);
            _0x5dee11['quoted']['text'] = _0x5dee11['quoted']['text'] || _0x5dee11['quoted']['caption'] || _0x5dee11['quoted']['conversation'] || _0x5dee11['quoted']['contentText'] || _0x5dee11['quoted']['selectedDisplayText'] || _0x5dee11['quoted']['title'] || '';
            _0x5dee11['quoted']['mentionedJid'] = _0x5dee11['msg']['contextInfo'] ? _0x5dee11['msg']['contextInfo']['mentionedJid'] : [];
            _0x5dee11['getQuotedObj'] = _0x5dee11['getQuotedMessage'] = async () => {
                if (!_0x5dee11['quoted']['id'])
                    return ![];
                const _0x3dd88b = await _0x2abab6['loadMessage'](_0x5dee11['chat'], _0x5dee11['quoted']['id'], _0x30766c);
                return smsg(_0x30766c, _0x3dd88b, _0x2abab6);
            };
            const _0x27f768 = _0x5dee11['quoted']['fakeObj'] = _0x59d046['fromObject']({
                'key': {
                    'remoteJid': _0x5dee11['quoted']['chat'],
                    'fromMe': _0x5dee11['quoted']['fromMe'],
                    'id': _0x5dee11['quoted']['id']
                },
                'message': _0x328e13,
                ..._0x5dee11['isGroup'] ? { 'participant': _0x5dee11['quoted']['sender'] } : {}
            });
            _0x5dee11['quoted']['delete'] = () => _0x30766c['sendMessage'](_0x5dee11['quoted']['chat'], { 'delete': _0x27f768['key'] });
            _0x5dee11['quoted']['copyNForward'] = (_0x358b8e, _0x5072cd = ![], _0x2cb554 = {}) => _0x30766c['copyNForward'](_0x358b8e, _0x27f768, _0x5072cd, _0x2cb554);
            _0x5dee11['quoted']['download'] = () => _0x30766c['downloadMediaMessage'](_0x5dee11['quoted']);
        }
    }
    if (_0x5dee11['msg']?.['url'])
        _0x5dee11['download'] = () => _0x30766c['downloadMediaMessage'](_0x5dee11['msg']);
    _0x5dee11['text'] = _0x5dee11['msg']?.['text'] || _0x5dee11['msg']?.['caption'] || _0x5dee11['message']?.['conversation'] || _0x5dee11['msg']?.['contentText'] || _0x5dee11['msg']?.['selectedDisplayText'] || _0x5dee11['msg']?.['title'] || '';
    _0x5dee11['reply'] = (_0x310256, _0x225bde = _0x5dee11['chat'], _0x1f95fb = {}) => Buffer['isBuffer'](_0x310256) ? _0x30766c['sendMedia'](_0x225bde, _0x310256, 'file', '', _0x5dee11, { ..._0x1f95fb }) : _0x30766c['sendText'](_0x225bde, _0x310256, _0x5dee11, { ..._0x1f95fb });
    _0x5dee11['copy'] = () => smsg(_0x30766c, _0x59d046['fromObject'](_0x59d046['toObject'](_0x5dee11)), _0x2abab6);
    _0x5dee11['copyNForward'] = (_0x1691a8 = _0x5dee11['chat'], _0x5e4472 = ![], _0x22c74b = {}) => _0x30766c['copyNForward'](_0x1691a8, _0x5dee11, _0x5e4472, _0x22c74b);
    return _0x5dee11;
};