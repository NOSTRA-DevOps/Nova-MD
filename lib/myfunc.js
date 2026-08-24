import {
    proto,
    getContentType
} from '@whiskeysockets/baileys';
import _0x0_0x379c03 from 'axios';
import _0x0_0x17b33f from 'moment-timezone';
import { sizeFormatter } from 'human-readable';
import _0x0_0x313f84 from 'util';
import _0x0_0xfe6a31 from 'sharp';
export const unixTimestampSeconds = (_0x19c2d3 = new Date()) => Math['floor'](_0x19c2d3['getTime']() / 0x3e8);
export const generateMessageTag = _0x1557a1 => {
    let _0x2febfe = unixTimestampSeconds()['toString']();
    if (_0x1557a1)
        _0x2febfe += '.--' + _0x1557a1;
    return _0x2febfe;
};
export const processTime = (_0x1ea544, _0x187225) => _0x0_0x17b33f['duration'](_0x187225['valueOf']() - _0x0_0x17b33f(_0x1ea544 * 0x3e8)['valueOf']())['asSeconds']();
export const getRandom = _0x147a38 => '' + Math['floor'](Math['random']() * 0x2710) + _0x147a38;
const BROWSER_HEADERS = {
    'DNT': '1',
    'Upgrade-Insecure-Request': '1'
};
export const getBuffer = async (_0x572fda, _0x1dbaf1 = {}) => {
    try {
        const _0xf02cb7 = await _0x0_0x379c03({
            'method': 'get',
            'url': _0x572fda,
            'headers': BROWSER_HEADERS,
            ..._0x1dbaf1,
            'responseType': 'arraybuffer'
        });
        return _0xf02cb7['data'];
    } catch (_0x1d9603) {
        return _0x1d9603;
    }
};
export const getImg = async (_0x4c2e03, _0x4bb0bd = {}) => {
    try {
        const _0x593292 = await _0x0_0x379c03({
            'method': 'get',
            'url': _0x4c2e03,
            'headers': BROWSER_HEADERS,
            ..._0x4bb0bd,
            'responseType': 'arraybuffer'
        });
        return _0x593292['data'];
    } catch (_0x33b194) {
        return _0x33b194;
    }
};
export const fetchJson = async (_0x2095d1, _0x134596 = {}) => {
    try {
        const _0x39f8da = await _0x0_0x379c03({
            'method': 'GET',
            'url': _0x2095d1,
            'headers': { 'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/95.0.4638.69\x20Safari/537.36' },
            ..._0x134596
        });
        return _0x39f8da['data'];
    } catch (_0x4e2d7b) {
        return _0x4e2d7b;
    }
};
export const runtime = _0x1301f1 => {
    _0x1301f1 = Number(_0x1301f1);
    const _0x197283 = Math['floor'](_0x1301f1 / (0xe10 * 0x18));
    const _0xf1144f = Math['floor'](_0x1301f1 % (0xe10 * 0x18) / 0xe10);
    const _0x3c9f39 = Math['floor'](_0x1301f1 % 0xe10 / 0x3c);
    const _0x24d4c7 = Math['floor'](_0x1301f1 % 0x3c);
    const _0x251d38 = _0x197283 > 0x0 ? _0x197283 + (_0x197283 === 0x1 ? '\x20day,\x20' : '\x20days,\x20') : '';
    const _0x1bc04f = _0xf1144f > 0x0 ? _0xf1144f + (_0xf1144f === 0x1 ? '\x20hour,\x20' : '\x20hours,\x20') : '';
    const _0x31a167 = _0x3c9f39 > 0x0 ? _0x3c9f39 + (_0x3c9f39 === 0x1 ? '\x20minute,\x20' : '\x20minutes,\x20') : '';
    const _0x4fe48a = _0x24d4c7 > 0x0 ? _0x24d4c7 + (_0x24d4c7 === 0x1 ? '\x20second' : '\x20seconds') : '';
    return _0x251d38 + _0x1bc04f + _0x31a167 + _0x4fe48a;
};
export const clockString = _0x25bc45 => {
    const _0xe0d676 = isNaN(_0x25bc45) ? '--' : Math['floor'](_0x25bc45 / 0x36ee80);
    const _0xea73b2 = isNaN(_0x25bc45) ? '--' : Math['floor'](_0x25bc45 / 0xea60) % 0x3c;
    const _0x34e991 = isNaN(_0x25bc45) ? '--' : Math['floor'](_0x25bc45 / 0x3e8) % 0x3c;
    return [
        _0xe0d676,
        _0xea73b2,
        _0x34e991
    ]['map'](_0x3980e9 => _0x3980e9['toString']()['padStart'](0x2, '0'))['join'](':');
};
export const sleep = _0x4db3e1 => new Promise(_0x3b538d => setTimeout(_0x3b538d, _0x4db3e1));
export const isUrl = _0x3cf26b => _0x3cf26b['match'](new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'));
export const getTime = (_0x26758e, _0x4e4dde) => {
    if (_0x4e4dde)
        return _0x0_0x17b33f(_0x4e4dde)['locale']('en')['format'](_0x26758e);
    return _0x0_0x17b33f['tz']('Asia/Karachi')['locale']('en')['format'](_0x26758e);
};
export const formatDate = (_0xb0928c, _0x1c3823 = 'en') => {
    const _0x340eaa = new Date(_0xb0928c);
    return _0x340eaa['toLocaleDateString'](_0x1c3823, {
        'weekday': 'long',
        'day': 'numeric',
        'month': 'long',
        'year': 'numeric',
        'hour': 'numeric',
        'minute': 'numeric',
        'second': 'numeric'
    });
};
export const tanggal = _0x3168ce => {
    const _0x2af97e = [
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
    const _0xc1df67 = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ];
    const _0x5c48cc = new Date(_0x3168ce);
    const _0x27da6e = _0x5c48cc['getDate']();
    const _0xedc611 = _0x5c48cc['getMonth']();
    const _0x4b446a = _0xc1df67[_0x5c48cc['getDay']()];
    const _0x2ee5b1 = _0x5c48cc['getFullYear']();
    const _0x216dbe = _0x2ee5b1 < 0x3e8 ? _0x2ee5b1 + 0x76c : _0x2ee5b1;
    return _0x4b446a + ',\x20' + _0x27da6e + '\x20-\x20' + _0x2af97e[_0xedc611] + '\x20-\x20' + _0x216dbe;
};
export const jam = (_0x36ef1a, _0x379d19 = {}) => {
    const _0x4184d6 = _0x379d19['format'] ?? 'HH:mm';
    const _0xc67657 = _0x379d19['timeZone'] ? _0x0_0x17b33f(_0x36ef1a)['tz'](_0x379d19['timeZone'])['format'](_0x4184d6) : _0x0_0x17b33f(_0x36ef1a)['format'](_0x4184d6);
    return _0xc67657;
};
export const formatp = sizeFormatter({
    'std': 'JEDEC',
    'decimalPlaces': 0x2,
    'keepTrailingZeroes': ![],
    'render': (_0x484ab4, _0x30f1df) => _0x484ab4 + '\x20' + _0x30f1df + 'B'
});
export const json = _0x3c0c24 => JSON['stringify'](_0x3c0c24, null, 0x2);
export const logic = (_0x49aa9e, _0x37653d, _0x582ed1) => {
    if (_0x37653d['length'] !== _0x582ed1['length'])
        throw new Error('Input\x20and\x20Output\x20must\x20have\x20same\x20length');
    for (let _0x178283 = 0x0; _0x178283 < _0x37653d['length']; _0x178283++) {
        if (_0x0_0x313f84['isDeepStrictEqual'](_0x49aa9e, _0x37653d[_0x178283]))
            return _0x582ed1[_0x178283];
    }
    return null;
};
export const generateProfilePicture = async _0x243e24 => {
    const _0x1c9f31 = _0x0_0xfe6a31(_0x243e24);
    const {
        width: width = 0x0,
        height: height = 0x0
    } = await _0x1c9f31['metadata']();
    const _0x55fc3b = Math['min'](width, height);
    const _0x33ae88 = await _0x1c9f31['extract']({
        'left': 0x0,
        'top': 0x0,
        'width': _0x55fc3b,
        'height': _0x55fc3b
    })['resize'](0x2d0, 0x2d0)['jpeg']()['toBuffer']();
    return {
        'img': _0x33ae88,
        'preview': _0x33ae88
    };
};
export const reSize = async (_0x3d7f28, _0x4a85dc, _0x2d8f8e) => _0x0_0xfe6a31(_0x3d7f28)['resize'](_0x4a85dc, _0x2d8f8e)['jpeg']()['toBuffer']();
export const bytesToSize = (_0x8ae32c, _0x3dbfdb = 0x2) => {
    if (_0x8ae32c === 0x0)
        return '0\x20Bytes';
    const _0x29c843 = 0x400;
    const _0x43b083 = _0x3dbfdb < 0x0 ? 0x0 : _0x3dbfdb;
    const _0x1f38f7 = [
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
    const _0x3bd3d4 = Math['floor'](Math['log'](_0x8ae32c) / Math['log'](_0x29c843));
    return parseFloat((_0x8ae32c / Math['pow'](_0x29c843, _0x3bd3d4))['toFixed'](_0x43b083)) + '\x20' + _0x1f38f7[_0x3bd3d4];
};
export const getSizeMedia = _0x1f6f59 => {
    return new Promise((_0x534501, _0xd943ab) => {
        if (typeof _0x1f6f59 === 'string' && /http/['test'](_0x1f6f59)) {
            _0x0_0x379c03['get'](_0x1f6f59)['then'](_0x287785 => {
                const _0x5242b0 = parseInt(_0x287785['headers']['content-length'], 0xa);
                const _0x21f46a = bytesToSize(_0x5242b0, 0x3);
                if (!isNaN(_0x5242b0))
                    _0x534501(_0x21f46a);
                else
                    _0xd943ab('Invalid\x20content-length');
            })['catch'](_0xd943ab);
        } else if (Buffer['isBuffer'](_0x1f6f59)) {
            const _0x150d64 = Buffer['byteLength'](_0x1f6f59);
            const _0x561395 = bytesToSize(_0x150d64, 0x3);
            if (!isNaN(_0x150d64))
                _0x534501(_0x561395);
            else
                _0xd943ab('Invalid\x20buffer\x20length');
        } else {
            _0xd943ab('Invalid\x20input:\x20must\x20be\x20a\x20URL\x20string\x20or\x20Buffer');
        }
    });
};
export const parseMention = (_0x14acb1 = '') => [..._0x14acb1['matchAll'](/@([0-9]{5,16}|0)/g)]['map'](_0x4400a8 => _0x4400a8[0x1] + '@s.whatsapp.net');
export const getGroupAdmins = _0x17fc1b => {
    const _0x4a1375 = [];
    for (const _0x5083ef of _0x17fc1b) {
        if (_0x5083ef['admin'] === 'superadmin' || _0x5083ef['admin'] === 'admin')
            _0x4a1375['push'](_0x5083ef['id']);
    }
    return _0x4a1375;
};
export const smsg = (_0x2cc1c6, _0x4a7b27, _0x2ef840) => {
    if (!_0x4a7b27)
        return _0x4a7b27;
    const _0xd5d536 = proto['WebMessageInfo'];
    if (_0x4a7b27['key']) {
        _0x4a7b27['id'] = _0x4a7b27['key']['id'];
        _0x4a7b27['isBaileys'] = _0x4a7b27['id']['startsWith']('BAE5') && _0x4a7b27['id']['length'] === 0x10;
        _0x4a7b27['chat'] = _0x4a7b27['key']['remoteJid'];
        _0x4a7b27['fromMe'] = _0x4a7b27['key']['fromMe'];
        _0x4a7b27['isGroup'] = _0x4a7b27['chat']['endsWith']('@g.us');
        _0x4a7b27['sender'] = _0x2cc1c6['decodeJid'](_0x4a7b27['fromMe'] && _0x2cc1c6['user']['id'] || _0x4a7b27['participant'] || _0x4a7b27['key']['participant'] || _0x4a7b27['chat'] || '');
        if (_0x4a7b27['isGroup'])
            _0x4a7b27['participant'] = _0x2cc1c6['decodeJid'](_0x4a7b27['key']['participant']) || '';
    }
    if (_0x4a7b27['message']) {
        _0x4a7b27['mtype'] = getContentType(_0x4a7b27['message']);
        _0x4a7b27['msg'] = _0x4a7b27['mtype'] === 'viewOnceMessage' ? _0x4a7b27['message'][_0x4a7b27['mtype']]['message'][getContentType(_0x4a7b27['message'][_0x4a7b27['mtype']]['message'])] : _0x4a7b27['message'][_0x4a7b27['mtype']];
        _0x4a7b27['body'] = _0x4a7b27['message']['conversation'] || _0x4a7b27['msg']?.['caption'] || _0x4a7b27['msg']?.['text'] || _0x4a7b27['mtype'] === 'listResponseMessage' && _0x4a7b27['msg']?.['singleSelectReply']?.['selectedRowId'] || _0x4a7b27['mtype'] === 'buttonsResponseMessage' && _0x4a7b27['msg']?.['selectedButtonId'] || _0x4a7b27['mtype'] === 'viewOnceMessage' && _0x4a7b27['msg']?.['caption'] || _0x4a7b27['text'];
        const _0x1c4c4a = _0x4a7b27['quoted'] = _0x4a7b27['msg']?.['contextInfo'] ? _0x4a7b27['msg']['contextInfo']['quotedMessage'] : null;
        _0x4a7b27['mentionedJid'] = _0x4a7b27['msg']?.['contextInfo'] ? _0x4a7b27['msg']['contextInfo']['mentionedJid'] : [];
        if (_0x4a7b27['quoted']) {
            let _0x3454da = getContentType(_0x1c4c4a);
            _0x4a7b27['quoted'] = _0x4a7b27['quoted'][_0x3454da];
            if (['productMessage']['includes'](_0x3454da)) {
                _0x3454da = getContentType(_0x4a7b27['quoted']);
                _0x4a7b27['quoted'] = _0x4a7b27['quoted'][_0x3454da];
            }
            if (typeof _0x4a7b27['quoted'] === 'string')
                _0x4a7b27['quoted'] = { 'text': _0x4a7b27['quoted'] };
            _0x4a7b27['quoted']['mtype'] = _0x3454da;
            _0x4a7b27['quoted']['id'] = _0x4a7b27['msg']['contextInfo']['stanzaId'];
            _0x4a7b27['quoted']['chat'] = _0x4a7b27['msg']['contextInfo']['remoteJid'] || _0x4a7b27['chat'];
            _0x4a7b27['quoted']['isBaileys'] = _0x4a7b27['quoted']['id'] ? _0x4a7b27['quoted']['id']['startsWith']('BAE5') && _0x4a7b27['quoted']['id']['length'] === 0x10 : ![];
            _0x4a7b27['quoted']['sender'] = _0x2cc1c6['decodeJid'](_0x4a7b27['msg']['contextInfo']['participant']);
            _0x4a7b27['quoted']['fromMe'] = _0x4a7b27['quoted']['sender'] === (_0x2cc1c6['user'] && _0x2cc1c6['user']['id']);
            _0x4a7b27['quoted']['text'] = _0x4a7b27['quoted']['text'] || _0x4a7b27['quoted']['caption'] || _0x4a7b27['quoted']['conversation'] || _0x4a7b27['quoted']['contentText'] || _0x4a7b27['quoted']['selectedDisplayText'] || _0x4a7b27['quoted']['title'] || '';
            _0x4a7b27['quoted']['mentionedJid'] = _0x4a7b27['msg']['contextInfo'] ? _0x4a7b27['msg']['contextInfo']['mentionedJid'] : [];
            _0x4a7b27['getQuotedObj'] = _0x4a7b27['getQuotedMessage'] = async () => {
                if (!_0x4a7b27['quoted']['id'])
                    return ![];
                const _0x3d2c6a = await _0x2ef840['loadMessage'](_0x4a7b27['chat'], _0x4a7b27['quoted']['id'], _0x2cc1c6);
                return smsg(_0x2cc1c6, _0x3d2c6a, _0x2ef840);
            };
            const _0x5c9268 = _0x4a7b27['quoted']['fakeObj'] = _0xd5d536['fromObject']({
                'key': {
                    'remoteJid': _0x4a7b27['quoted']['chat'],
                    'fromMe': _0x4a7b27['quoted']['fromMe'],
                    'id': _0x4a7b27['quoted']['id']
                },
                'message': _0x1c4c4a,
                ..._0x4a7b27['isGroup'] ? { 'participant': _0x4a7b27['quoted']['sender'] } : {}
            });
            _0x4a7b27['quoted']['delete'] = () => _0x2cc1c6['sendMessage'](_0x4a7b27['quoted']['chat'], { 'delete': _0x5c9268['key'] });
            _0x4a7b27['quoted']['copyNForward'] = (_0x19a4d5, _0x3391bd = ![], _0x1ec52e = {}) => _0x2cc1c6['copyNForward'](_0x19a4d5, _0x5c9268, _0x3391bd, _0x1ec52e);
            _0x4a7b27['quoted']['download'] = () => _0x2cc1c6['downloadMediaMessage'](_0x4a7b27['quoted']);
        }
    }
    if (_0x4a7b27['msg']?.['url'])
        _0x4a7b27['download'] = () => _0x2cc1c6['downloadMediaMessage'](_0x4a7b27['msg']);
    _0x4a7b27['text'] = _0x4a7b27['msg']?.['text'] || _0x4a7b27['msg']?.['caption'] || _0x4a7b27['message']?.['conversation'] || _0x4a7b27['msg']?.['contentText'] || _0x4a7b27['msg']?.['selectedDisplayText'] || _0x4a7b27['msg']?.['title'] || '';
    _0x4a7b27['reply'] = (_0x4a324b, _0x148234 = _0x4a7b27['chat'], _0x61a25a = {}) => Buffer['isBuffer'](_0x4a324b) ? _0x2cc1c6['sendMedia'](_0x148234, _0x4a324b, 'file', '', _0x4a7b27, { ..._0x61a25a }) : _0x2cc1c6['sendText'](_0x148234, _0x4a324b, _0x4a7b27, { ..._0x61a25a });
    _0x4a7b27['copy'] = () => smsg(_0x2cc1c6, _0xd5d536['fromObject'](_0xd5d536['toObject'](_0x4a7b27)), _0x2ef840);
    _0x4a7b27['copyNForward'] = (_0x2313ce = _0x4a7b27['chat'], _0x3a949d = ![], _0x1f0da7 = {}) => _0x2cc1c6['copyNForward'](_0x2313ce, _0x4a7b27, _0x3a949d, _0x1f0da7);
    return _0x4a7b27;
};