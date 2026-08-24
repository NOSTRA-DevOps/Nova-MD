import {
    proto,
    getContentType
} from '@whiskeysockets/baileys';
import _0x0_0x5b7247 from 'axios';
import _0x0_0x5cd654 from 'moment-timezone';
import { sizeFormatter } from 'human-readable';
import _0x0_0x483125 from 'util';
import _0x0_0xa9497 from 'sharp';
export const unixTimestampSeconds = (_0x4ae0d8 = new Date()) => Math['floor'](_0x4ae0d8['getTime']() / 0x3e8);
export const generateMessageTag = _0x2e2189 => {
    let _0x323a43 = unixTimestampSeconds()['toString']();
    if (_0x2e2189)
        _0x323a43 += '.--' + _0x2e2189;
    return _0x323a43;
};
export const processTime = (_0x9c92b8, _0xd59bcc) => _0x0_0x5cd654['duration'](_0xd59bcc['valueOf']() - _0x0_0x5cd654(_0x9c92b8 * 0x3e8)['valueOf']())['asSeconds']();
export const getRandom = _0x230033 => '' + Math['floor'](Math['random']() * 0x2710) + _0x230033;
const BROWSER_HEADERS = {
    'DNT': '1',
    'Upgrade-Insecure-Request': '1'
};
export const getBuffer = async (_0x297e4e, _0x34a98c = {}) => {
    try {
        const _0x303c9c = await _0x0_0x5b7247({
            'method': 'get',
            'url': _0x297e4e,
            'headers': BROWSER_HEADERS,
            ..._0x34a98c,
            'responseType': 'arraybuffer'
        });
        return _0x303c9c['data'];
    } catch (_0x3a5af1) {
        return _0x3a5af1;
    }
};
export const getImg = async (_0x43e1ba, _0x210197 = {}) => {
    try {
        const _0x40c060 = await _0x0_0x5b7247({
            'method': 'get',
            'url': _0x43e1ba,
            'headers': BROWSER_HEADERS,
            ..._0x210197,
            'responseType': 'arraybuffer'
        });
        return _0x40c060['data'];
    } catch (_0x5afc6b) {
        return _0x5afc6b;
    }
};
export const fetchJson = async (_0x114ed7, _0x543f98 = {}) => {
    try {
        const _0x4c1221 = await _0x0_0x5b7247({
            'method': 'GET',
            'url': _0x114ed7,
            'headers': { 'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/95.0.4638.69\x20Safari/537.36' },
            ..._0x543f98
        });
        return _0x4c1221['data'];
    } catch (_0xd9a3b5) {
        return _0xd9a3b5;
    }
};
export const runtime = _0x274525 => {
    _0x274525 = Number(_0x274525);
    const _0x196764 = Math['floor'](_0x274525 / (0xe10 * 0x18));
    const _0x393349 = Math['floor'](_0x274525 % (0xe10 * 0x18) / 0xe10);
    const _0x2a22ba = Math['floor'](_0x274525 % 0xe10 / 0x3c);
    const _0x5a8ace = Math['floor'](_0x274525 % 0x3c);
    const _0x5b33d2 = _0x196764 > 0x0 ? _0x196764 + (_0x196764 === 0x1 ? '\x20day,\x20' : '\x20days,\x20') : '';
    const _0x2d8fa4 = _0x393349 > 0x0 ? _0x393349 + (_0x393349 === 0x1 ? '\x20hour,\x20' : '\x20hours,\x20') : '';
    const _0x4bd6eb = _0x2a22ba > 0x0 ? _0x2a22ba + (_0x2a22ba === 0x1 ? '\x20minute,\x20' : '\x20minutes,\x20') : '';
    const _0x1e2431 = _0x5a8ace > 0x0 ? _0x5a8ace + (_0x5a8ace === 0x1 ? '\x20second' : '\x20seconds') : '';
    return _0x5b33d2 + _0x2d8fa4 + _0x4bd6eb + _0x1e2431;
};
export const clockString = _0x563832 => {
    const _0x3922b0 = isNaN(_0x563832) ? '--' : Math['floor'](_0x563832 / 0x36ee80);
    const _0x35c3fa = isNaN(_0x563832) ? '--' : Math['floor'](_0x563832 / 0xea60) % 0x3c;
    const _0x321ddd = isNaN(_0x563832) ? '--' : Math['floor'](_0x563832 / 0x3e8) % 0x3c;
    return [
        _0x3922b0,
        _0x35c3fa,
        _0x321ddd
    ]['map'](_0x1f9696 => _0x1f9696['toString']()['padStart'](0x2, '0'))['join'](':');
};
export const sleep = _0x2e3d59 => new Promise(_0x34e16b => setTimeout(_0x34e16b, _0x2e3d59));
export const isUrl = _0x2499c4 => _0x2499c4['match'](new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'));
export const getTime = (_0x53a56e, _0x1a7294) => {
    if (_0x1a7294)
        return _0x0_0x5cd654(_0x1a7294)['locale']('en')['format'](_0x53a56e);
    return _0x0_0x5cd654['tz']('Asia/Karachi')['locale']('en')['format'](_0x53a56e);
};
export const formatDate = (_0x54a14a, _0x13c993 = 'en') => {
    const _0x439452 = new Date(_0x54a14a);
    return _0x439452['toLocaleDateString'](_0x13c993, {
        'weekday': 'long',
        'day': 'numeric',
        'month': 'long',
        'year': 'numeric',
        'hour': 'numeric',
        'minute': 'numeric',
        'second': 'numeric'
    });
};
export const tanggal = _0x4b0cf7 => {
    const _0x35068f = [
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
    const _0x5ad0fe = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ];
    const _0x4c678d = new Date(_0x4b0cf7);
    const _0x3d825f = _0x4c678d['getDate']();
    const _0x1e11d3 = _0x4c678d['getMonth']();
    const _0x1b30f8 = _0x5ad0fe[_0x4c678d['getDay']()];
    const _0x5a3a53 = _0x4c678d['getFullYear']();
    const _0x409c43 = _0x5a3a53 < 0x3e8 ? _0x5a3a53 + 0x76c : _0x5a3a53;
    return _0x1b30f8 + ',\x20' + _0x3d825f + '\x20-\x20' + _0x35068f[_0x1e11d3] + '\x20-\x20' + _0x409c43;
};
export const jam = (_0x341ee3, _0xc78203 = {}) => {
    const _0x1a7763 = _0xc78203['format'] ?? 'HH:mm';
    const _0x294a2a = _0xc78203['timeZone'] ? _0x0_0x5cd654(_0x341ee3)['tz'](_0xc78203['timeZone'])['format'](_0x1a7763) : _0x0_0x5cd654(_0x341ee3)['format'](_0x1a7763);
    return _0x294a2a;
};
export const formatp = sizeFormatter({
    'std': 'JEDEC',
    'decimalPlaces': 0x2,
    'keepTrailingZeroes': ![],
    'render': (_0x5cdede, _0x467a26) => _0x5cdede + '\x20' + _0x467a26 + 'B'
});
export const json = _0x237b39 => JSON['stringify'](_0x237b39, null, 0x2);
export const logic = (_0x1b26bd, _0x153464, _0x165937) => {
    if (_0x153464['length'] !== _0x165937['length'])
        throw new Error('Input\x20and\x20Output\x20must\x20have\x20same\x20length');
    for (let _0xf37c45 = 0x0; _0xf37c45 < _0x153464['length']; _0xf37c45++) {
        if (_0x0_0x483125['isDeepStrictEqual'](_0x1b26bd, _0x153464[_0xf37c45]))
            return _0x165937[_0xf37c45];
    }
    return null;
};
export const generateProfilePicture = async _0x2a9335 => {
    const _0x2318bc = _0x0_0xa9497(_0x2a9335);
    const {
        width: width = 0x0,
        height: height = 0x0
    } = await _0x2318bc['metadata']();
    const _0xa755ad = Math['min'](width, height);
    const _0x4cc0ab = await _0x2318bc['extract']({
        'left': 0x0,
        'top': 0x0,
        'width': _0xa755ad,
        'height': _0xa755ad
    })['resize'](0x2d0, 0x2d0)['jpeg']()['toBuffer']();
    return {
        'img': _0x4cc0ab,
        'preview': _0x4cc0ab
    };
};
export const reSize = async (_0x3b9158, _0x204cf5, _0x440074) => _0x0_0xa9497(_0x3b9158)['resize'](_0x204cf5, _0x440074)['jpeg']()['toBuffer']();
export const bytesToSize = (_0x2e5229, _0x3abb0f = 0x2) => {
    if (_0x2e5229 === 0x0)
        return '0\x20Bytes';
    const _0x2fbb8e = 0x400;
    const _0x2f1099 = _0x3abb0f < 0x0 ? 0x0 : _0x3abb0f;
    const _0x4d0810 = [
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
    const _0x3257b8 = Math['floor'](Math['log'](_0x2e5229) / Math['log'](_0x2fbb8e));
    return parseFloat((_0x2e5229 / Math['pow'](_0x2fbb8e, _0x3257b8))['toFixed'](_0x2f1099)) + '\x20' + _0x4d0810[_0x3257b8];
};
export const getSizeMedia = _0x805aee => {
    return new Promise((_0x174f24, _0x56b405) => {
        if (typeof _0x805aee === 'string' && /http/['test'](_0x805aee)) {
            _0x0_0x5b7247['get'](_0x805aee)['then'](_0x5bfeee => {
                const _0x336dac = parseInt(_0x5bfeee['headers']['content-length'], 0xa);
                const _0x4efdb3 = bytesToSize(_0x336dac, 0x3);
                if (!isNaN(_0x336dac))
                    _0x174f24(_0x4efdb3);
                else
                    _0x56b405('Invalid\x20content-length');
            })['catch'](_0x56b405);
        } else if (Buffer['isBuffer'](_0x805aee)) {
            const _0x3b1a59 = Buffer['byteLength'](_0x805aee);
            const _0x2a6022 = bytesToSize(_0x3b1a59, 0x3);
            if (!isNaN(_0x3b1a59))
                _0x174f24(_0x2a6022);
            else
                _0x56b405('Invalid\x20buffer\x20length');
        } else {
            _0x56b405('Invalid\x20input:\x20must\x20be\x20a\x20URL\x20string\x20or\x20Buffer');
        }
    });
};
export const parseMention = (_0x1f74b = '') => [..._0x1f74b['matchAll'](/@([0-9]{5,16}|0)/g)]['map'](_0x5bd7cb => _0x5bd7cb[0x1] + '@s.whatsapp.net');
export const getGroupAdmins = _0x425f29 => {
    const _0x3d45ff = [];
    for (const _0x608c7d of _0x425f29) {
        if (_0x608c7d['admin'] === 'superadmin' || _0x608c7d['admin'] === 'admin')
            _0x3d45ff['push'](_0x608c7d['id']);
    }
    return _0x3d45ff;
};
export const smsg = (_0x2f18e1, _0x2825e6, _0x3357b6) => {
    if (!_0x2825e6)
        return _0x2825e6;
    const _0xaa5da6 = proto['WebMessageInfo'];
    if (_0x2825e6['key']) {
        _0x2825e6['id'] = _0x2825e6['key']['id'];
        _0x2825e6['isBaileys'] = _0x2825e6['id']['startsWith']('BAE5') && _0x2825e6['id']['length'] === 0x10;
        _0x2825e6['chat'] = _0x2825e6['key']['remoteJid'];
        _0x2825e6['fromMe'] = _0x2825e6['key']['fromMe'];
        _0x2825e6['isGroup'] = _0x2825e6['chat']['endsWith']('@g.us');
        _0x2825e6['sender'] = _0x2f18e1['decodeJid'](_0x2825e6['fromMe'] && _0x2f18e1['user']['id'] || _0x2825e6['participant'] || _0x2825e6['key']['participant'] || _0x2825e6['chat'] || '');
        if (_0x2825e6['isGroup'])
            _0x2825e6['participant'] = _0x2f18e1['decodeJid'](_0x2825e6['key']['participant']) || '';
    }
    if (_0x2825e6['message']) {
        _0x2825e6['mtype'] = getContentType(_0x2825e6['message']);
        _0x2825e6['msg'] = _0x2825e6['mtype'] === 'viewOnceMessage' ? _0x2825e6['message'][_0x2825e6['mtype']]['message'][getContentType(_0x2825e6['message'][_0x2825e6['mtype']]['message'])] : _0x2825e6['message'][_0x2825e6['mtype']];
        _0x2825e6['body'] = _0x2825e6['message']['conversation'] || _0x2825e6['msg']?.['caption'] || _0x2825e6['msg']?.['text'] || _0x2825e6['mtype'] === 'listResponseMessage' && _0x2825e6['msg']?.['singleSelectReply']?.['selectedRowId'] || _0x2825e6['mtype'] === 'buttonsResponseMessage' && _0x2825e6['msg']?.['selectedButtonId'] || _0x2825e6['mtype'] === 'viewOnceMessage' && _0x2825e6['msg']?.['caption'] || _0x2825e6['text'];
        const _0x3d7898 = _0x2825e6['quoted'] = _0x2825e6['msg']?.['contextInfo'] ? _0x2825e6['msg']['contextInfo']['quotedMessage'] : null;
        _0x2825e6['mentionedJid'] = _0x2825e6['msg']?.['contextInfo'] ? _0x2825e6['msg']['contextInfo']['mentionedJid'] : [];
        if (_0x2825e6['quoted']) {
            let _0x402977 = getContentType(_0x3d7898);
            _0x2825e6['quoted'] = _0x2825e6['quoted'][_0x402977];
            if (['productMessage']['includes'](_0x402977)) {
                _0x402977 = getContentType(_0x2825e6['quoted']);
                _0x2825e6['quoted'] = _0x2825e6['quoted'][_0x402977];
            }
            if (typeof _0x2825e6['quoted'] === 'string')
                _0x2825e6['quoted'] = { 'text': _0x2825e6['quoted'] };
            _0x2825e6['quoted']['mtype'] = _0x402977;
            _0x2825e6['quoted']['id'] = _0x2825e6['msg']['contextInfo']['stanzaId'];
            _0x2825e6['quoted']['chat'] = _0x2825e6['msg']['contextInfo']['remoteJid'] || _0x2825e6['chat'];
            _0x2825e6['quoted']['isBaileys'] = _0x2825e6['quoted']['id'] ? _0x2825e6['quoted']['id']['startsWith']('BAE5') && _0x2825e6['quoted']['id']['length'] === 0x10 : ![];
            _0x2825e6['quoted']['sender'] = _0x2f18e1['decodeJid'](_0x2825e6['msg']['contextInfo']['participant']);
            _0x2825e6['quoted']['fromMe'] = _0x2825e6['quoted']['sender'] === (_0x2f18e1['user'] && _0x2f18e1['user']['id']);
            _0x2825e6['quoted']['text'] = _0x2825e6['quoted']['text'] || _0x2825e6['quoted']['caption'] || _0x2825e6['quoted']['conversation'] || _0x2825e6['quoted']['contentText'] || _0x2825e6['quoted']['selectedDisplayText'] || _0x2825e6['quoted']['title'] || '';
            _0x2825e6['quoted']['mentionedJid'] = _0x2825e6['msg']['contextInfo'] ? _0x2825e6['msg']['contextInfo']['mentionedJid'] : [];
            _0x2825e6['getQuotedObj'] = _0x2825e6['getQuotedMessage'] = async () => {
                if (!_0x2825e6['quoted']['id'])
                    return ![];
                const _0x34a9ee = await _0x3357b6['loadMessage'](_0x2825e6['chat'], _0x2825e6['quoted']['id'], _0x2f18e1);
                return smsg(_0x2f18e1, _0x34a9ee, _0x3357b6);
            };
            const _0x31dfa0 = _0x2825e6['quoted']['fakeObj'] = _0xaa5da6['fromObject']({
                'key': {
                    'remoteJid': _0x2825e6['quoted']['chat'],
                    'fromMe': _0x2825e6['quoted']['fromMe'],
                    'id': _0x2825e6['quoted']['id']
                },
                'message': _0x3d7898,
                ..._0x2825e6['isGroup'] ? { 'participant': _0x2825e6['quoted']['sender'] } : {}
            });
            _0x2825e6['quoted']['delete'] = () => _0x2f18e1['sendMessage'](_0x2825e6['quoted']['chat'], { 'delete': _0x31dfa0['key'] });
            _0x2825e6['quoted']['copyNForward'] = (_0x3a2752, _0x4cafae = ![], _0x5245d3 = {}) => _0x2f18e1['copyNForward'](_0x3a2752, _0x31dfa0, _0x4cafae, _0x5245d3);
            _0x2825e6['quoted']['download'] = () => _0x2f18e1['downloadMediaMessage'](_0x2825e6['quoted']);
        }
    }
    if (_0x2825e6['msg']?.['url'])
        _0x2825e6['download'] = () => _0x2f18e1['downloadMediaMessage'](_0x2825e6['msg']);
    _0x2825e6['text'] = _0x2825e6['msg']?.['text'] || _0x2825e6['msg']?.['caption'] || _0x2825e6['message']?.['conversation'] || _0x2825e6['msg']?.['contentText'] || _0x2825e6['msg']?.['selectedDisplayText'] || _0x2825e6['msg']?.['title'] || '';
    _0x2825e6['reply'] = (_0x5c5f0e, _0x15bdbe = _0x2825e6['chat'], _0x33cf77 = {}) => Buffer['isBuffer'](_0x5c5f0e) ? _0x2f18e1['sendMedia'](_0x15bdbe, _0x5c5f0e, 'file', '', _0x2825e6, { ..._0x33cf77 }) : _0x2f18e1['sendText'](_0x15bdbe, _0x5c5f0e, _0x2825e6, { ..._0x33cf77 });
    _0x2825e6['copy'] = () => smsg(_0x2f18e1, _0xaa5da6['fromObject'](_0xaa5da6['toObject'](_0x2825e6)), _0x3357b6);
    _0x2825e6['copyNForward'] = (_0x17db13 = _0x2825e6['chat'], _0x4e5b1e = ![], _0x5b0d52 = {}) => _0x2f18e1['copyNForward'](_0x17db13, _0x2825e6, _0x4e5b1e, _0x5b0d52);
    return _0x2825e6;
};