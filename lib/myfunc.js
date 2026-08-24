import {
    proto,
    getContentType
} from '@whiskeysockets/baileys';
import _0x0_0x1ec104 from 'axios';
import _0x0_0x3092ff from 'moment-timezone';
import { sizeFormatter } from 'human-readable';
import _0x0_0x54fbde from 'util';
import _0x0_0x1df7cb from 'sharp';
export const unixTimestampSeconds = (_0x1054ff = new Date()) => Math['floor'](_0x1054ff['getTime']() / 0x3e8);
export const generateMessageTag = _0x105101 => {
    let _0x4ae066 = unixTimestampSeconds()['toString']();
    if (_0x105101)
        _0x4ae066 += '.--' + _0x105101;
    return _0x4ae066;
};
export const processTime = (_0x527f34, _0x1be5b7) => _0x0_0x3092ff['duration'](_0x1be5b7['valueOf']() - _0x0_0x3092ff(_0x527f34 * 0x3e8)['valueOf']())['asSeconds']();
export const getRandom = _0x1df005 => '' + Math['floor'](Math['random']() * 0x2710) + _0x1df005;
const BROWSER_HEADERS = {
    'DNT': '1',
    'Upgrade-Insecure-Request': '1'
};
export const getBuffer = async (_0x577fa0, _0x21b792 = {}) => {
    try {
        const _0x5d061c = await _0x0_0x1ec104({
            'method': 'get',
            'url': _0x577fa0,
            'headers': BROWSER_HEADERS,
            ..._0x21b792,
            'responseType': 'arraybuffer'
        });
        return _0x5d061c['data'];
    } catch (_0x47dabb) {
        return _0x47dabb;
    }
};
export const getImg = async (_0x406e, _0x4a1b13 = {}) => {
    try {
        const _0x5a4694 = await _0x0_0x1ec104({
            'method': 'get',
            'url': _0x406e,
            'headers': BROWSER_HEADERS,
            ..._0x4a1b13,
            'responseType': 'arraybuffer'
        });
        return _0x5a4694['data'];
    } catch (_0x1767fa) {
        return _0x1767fa;
    }
};
export const fetchJson = async (_0x381b7d, _0x5266cb = {}) => {
    try {
        const _0x4921ed = await _0x0_0x1ec104({
            'method': 'GET',
            'url': _0x381b7d,
            'headers': { 'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/95.0.4638.69\x20Safari/537.36' },
            ..._0x5266cb
        });
        return _0x4921ed['data'];
    } catch (_0x561954) {
        return _0x561954;
    }
};
export const runtime = _0x20f03b => {
    _0x20f03b = Number(_0x20f03b);
    const _0x459a24 = Math['floor'](_0x20f03b / (0xe10 * 0x18));
    const _0xbd672 = Math['floor'](_0x20f03b % (0xe10 * 0x18) / 0xe10);
    const _0xbad2de = Math['floor'](_0x20f03b % 0xe10 / 0x3c);
    const _0x51bf88 = Math['floor'](_0x20f03b % 0x3c);
    const _0xee1781 = _0x459a24 > 0x0 ? _0x459a24 + (_0x459a24 === 0x1 ? '\x20day,\x20' : '\x20days,\x20') : '';
    const _0x1befa2 = _0xbd672 > 0x0 ? _0xbd672 + (_0xbd672 === 0x1 ? '\x20hour,\x20' : '\x20hours,\x20') : '';
    const _0x5a8c0e = _0xbad2de > 0x0 ? _0xbad2de + (_0xbad2de === 0x1 ? '\x20minute,\x20' : '\x20minutes,\x20') : '';
    const _0x3fe843 = _0x51bf88 > 0x0 ? _0x51bf88 + (_0x51bf88 === 0x1 ? '\x20second' : '\x20seconds') : '';
    return _0xee1781 + _0x1befa2 + _0x5a8c0e + _0x3fe843;
};
export const clockString = _0x3a15db => {
    const _0x4cd90c = isNaN(_0x3a15db) ? '--' : Math['floor'](_0x3a15db / 0x36ee80);
    const _0xc49c = isNaN(_0x3a15db) ? '--' : Math['floor'](_0x3a15db / 0xea60) % 0x3c;
    const _0x40d891 = isNaN(_0x3a15db) ? '--' : Math['floor'](_0x3a15db / 0x3e8) % 0x3c;
    return [
        _0x4cd90c,
        _0xc49c,
        _0x40d891
    ]['map'](_0x3cadca => _0x3cadca['toString']()['padStart'](0x2, '0'))['join'](':');
};
export const sleep = _0x266237 => new Promise(_0xfa9852 => setTimeout(_0xfa9852, _0x266237));
export const isUrl = _0x543b13 => _0x543b13['match'](new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'));
export const getTime = (_0x9864a, _0x3d9605) => {
    if (_0x3d9605)
        return _0x0_0x3092ff(_0x3d9605)['locale']('en')['format'](_0x9864a);
    return _0x0_0x3092ff['tz']('Asia/Karachi')['locale']('en')['format'](_0x9864a);
};
export const formatDate = (_0x135696, _0x408711 = 'en') => {
    const _0x3c78b9 = new Date(_0x135696);
    return _0x3c78b9['toLocaleDateString'](_0x408711, {
        'weekday': 'long',
        'day': 'numeric',
        'month': 'long',
        'year': 'numeric',
        'hour': 'numeric',
        'minute': 'numeric',
        'second': 'numeric'
    });
};
export const tanggal = _0x546568 => {
    const _0x57123f = [
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
    const _0x12aabe = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ];
    const _0x5a6ac8 = new Date(_0x546568);
    const _0x53d927 = _0x5a6ac8['getDate']();
    const _0x3a9d9f = _0x5a6ac8['getMonth']();
    const _0x3fc1cc = _0x12aabe[_0x5a6ac8['getDay']()];
    const _0x73c74a = _0x5a6ac8['getFullYear']();
    const _0x496f8d = _0x73c74a < 0x3e8 ? _0x73c74a + 0x76c : _0x73c74a;
    return _0x3fc1cc + ',\x20' + _0x53d927 + '\x20-\x20' + _0x57123f[_0x3a9d9f] + '\x20-\x20' + _0x496f8d;
};
export const jam = (_0x54ea70, _0x4475df = {}) => {
    const _0x1e3d15 = _0x4475df['format'] ?? 'HH:mm';
    const _0x12bb11 = _0x4475df['timeZone'] ? _0x0_0x3092ff(_0x54ea70)['tz'](_0x4475df['timeZone'])['format'](_0x1e3d15) : _0x0_0x3092ff(_0x54ea70)['format'](_0x1e3d15);
    return _0x12bb11;
};
export const formatp = sizeFormatter({
    'std': 'JEDEC',
    'decimalPlaces': 0x2,
    'keepTrailingZeroes': ![],
    'render': (_0x155007, _0x4f9110) => _0x155007 + '\x20' + _0x4f9110 + 'B'
});
export const json = _0x5c4926 => JSON['stringify'](_0x5c4926, null, 0x2);
export const logic = (_0x1981f5, _0xa1830b, _0x29e9b4) => {
    if (_0xa1830b['length'] !== _0x29e9b4['length'])
        throw new Error('Input\x20and\x20Output\x20must\x20have\x20same\x20length');
    for (let _0x33a3ef = 0x0; _0x33a3ef < _0xa1830b['length']; _0x33a3ef++) {
        if (_0x0_0x54fbde['isDeepStrictEqual'](_0x1981f5, _0xa1830b[_0x33a3ef]))
            return _0x29e9b4[_0x33a3ef];
    }
    return null;
};
export const generateProfilePicture = async _0x365599 => {
    const _0x3c9130 = _0x0_0x1df7cb(_0x365599);
    const {
        width: width = 0x0,
        height: height = 0x0
    } = await _0x3c9130['metadata']();
    const _0x3e48af = Math['min'](width, height);
    const _0x3c1790 = await _0x3c9130['extract']({
        'left': 0x0,
        'top': 0x0,
        'width': _0x3e48af,
        'height': _0x3e48af
    })['resize'](0x2d0, 0x2d0)['jpeg']()['toBuffer']();
    return {
        'img': _0x3c1790,
        'preview': _0x3c1790
    };
};
export const reSize = async (_0x376699, _0x55931a, _0x14c085) => _0x0_0x1df7cb(_0x376699)['resize'](_0x55931a, _0x14c085)['jpeg']()['toBuffer']();
export const bytesToSize = (_0x23f6eb, _0x341ec6 = 0x2) => {
    if (_0x23f6eb === 0x0)
        return '0\x20Bytes';
    const _0x3d68e1 = 0x400;
    const _0x45577b = _0x341ec6 < 0x0 ? 0x0 : _0x341ec6;
    const _0x4ac216 = [
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
    const _0x491bf4 = Math['floor'](Math['log'](_0x23f6eb) / Math['log'](_0x3d68e1));
    return parseFloat((_0x23f6eb / Math['pow'](_0x3d68e1, _0x491bf4))['toFixed'](_0x45577b)) + '\x20' + _0x4ac216[_0x491bf4];
};
export const getSizeMedia = _0x17602c => {
    return new Promise((_0x15dc0b, _0x123abd) => {
        if (typeof _0x17602c === 'string' && /http/['test'](_0x17602c)) {
            _0x0_0x1ec104['get'](_0x17602c)['then'](_0xb6d079 => {
                const _0x31c830 = parseInt(_0xb6d079['headers']['content-length'], 0xa);
                const _0x5cca85 = bytesToSize(_0x31c830, 0x3);
                if (!isNaN(_0x31c830))
                    _0x15dc0b(_0x5cca85);
                else
                    _0x123abd('Invalid\x20content-length');
            })['catch'](_0x123abd);
        } else if (Buffer['isBuffer'](_0x17602c)) {
            const _0x3a4b95 = Buffer['byteLength'](_0x17602c);
            const _0x5c90bc = bytesToSize(_0x3a4b95, 0x3);
            if (!isNaN(_0x3a4b95))
                _0x15dc0b(_0x5c90bc);
            else
                _0x123abd('Invalid\x20buffer\x20length');
        } else {
            _0x123abd('Invalid\x20input:\x20must\x20be\x20a\x20URL\x20string\x20or\x20Buffer');
        }
    });
};
export const parseMention = (_0x450183 = '') => [..._0x450183['matchAll'](/@([0-9]{5,16}|0)/g)]['map'](_0xa47512 => _0xa47512[0x1] + '@s.whatsapp.net');
export const getGroupAdmins = _0x5ae4b7 => {
    const _0x3924c8 = [];
    for (const _0x2288e5 of _0x5ae4b7) {
        if (_0x2288e5['admin'] === 'superadmin' || _0x2288e5['admin'] === 'admin')
            _0x3924c8['push'](_0x2288e5['id']);
    }
    return _0x3924c8;
};
export const smsg = (_0x228d24, _0xcef32c, _0x4817d3) => {
    if (!_0xcef32c)
        return _0xcef32c;
    const _0x4aeb4 = proto['WebMessageInfo'];
    if (_0xcef32c['key']) {
        _0xcef32c['id'] = _0xcef32c['key']['id'];
        _0xcef32c['isBaileys'] = _0xcef32c['id']['startsWith']('BAE5') && _0xcef32c['id']['length'] === 0x10;
        _0xcef32c['chat'] = _0xcef32c['key']['remoteJid'];
        _0xcef32c['fromMe'] = _0xcef32c['key']['fromMe'];
        _0xcef32c['isGroup'] = _0xcef32c['chat']['endsWith']('@g.us');
        _0xcef32c['sender'] = _0x228d24['decodeJid'](_0xcef32c['fromMe'] && _0x228d24['user']['id'] || _0xcef32c['participant'] || _0xcef32c['key']['participant'] || _0xcef32c['chat'] || '');
        if (_0xcef32c['isGroup'])
            _0xcef32c['participant'] = _0x228d24['decodeJid'](_0xcef32c['key']['participant']) || '';
    }
    if (_0xcef32c['message']) {
        _0xcef32c['mtype'] = getContentType(_0xcef32c['message']);
        _0xcef32c['msg'] = _0xcef32c['mtype'] === 'viewOnceMessage' ? _0xcef32c['message'][_0xcef32c['mtype']]['message'][getContentType(_0xcef32c['message'][_0xcef32c['mtype']]['message'])] : _0xcef32c['message'][_0xcef32c['mtype']];
        _0xcef32c['body'] = _0xcef32c['message']['conversation'] || _0xcef32c['msg']?.['caption'] || _0xcef32c['msg']?.['text'] || _0xcef32c['mtype'] === 'listResponseMessage' && _0xcef32c['msg']?.['singleSelectReply']?.['selectedRowId'] || _0xcef32c['mtype'] === 'buttonsResponseMessage' && _0xcef32c['msg']?.['selectedButtonId'] || _0xcef32c['mtype'] === 'viewOnceMessage' && _0xcef32c['msg']?.['caption'] || _0xcef32c['text'];
        const _0x3ffc58 = _0xcef32c['quoted'] = _0xcef32c['msg']?.['contextInfo'] ? _0xcef32c['msg']['contextInfo']['quotedMessage'] : null;
        _0xcef32c['mentionedJid'] = _0xcef32c['msg']?.['contextInfo'] ? _0xcef32c['msg']['contextInfo']['mentionedJid'] : [];
        if (_0xcef32c['quoted']) {
            let _0x10e50b = getContentType(_0x3ffc58);
            _0xcef32c['quoted'] = _0xcef32c['quoted'][_0x10e50b];
            if (['productMessage']['includes'](_0x10e50b)) {
                _0x10e50b = getContentType(_0xcef32c['quoted']);
                _0xcef32c['quoted'] = _0xcef32c['quoted'][_0x10e50b];
            }
            if (typeof _0xcef32c['quoted'] === 'string')
                _0xcef32c['quoted'] = { 'text': _0xcef32c['quoted'] };
            _0xcef32c['quoted']['mtype'] = _0x10e50b;
            _0xcef32c['quoted']['id'] = _0xcef32c['msg']['contextInfo']['stanzaId'];
            _0xcef32c['quoted']['chat'] = _0xcef32c['msg']['contextInfo']['remoteJid'] || _0xcef32c['chat'];
            _0xcef32c['quoted']['isBaileys'] = _0xcef32c['quoted']['id'] ? _0xcef32c['quoted']['id']['startsWith']('BAE5') && _0xcef32c['quoted']['id']['length'] === 0x10 : ![];
            _0xcef32c['quoted']['sender'] = _0x228d24['decodeJid'](_0xcef32c['msg']['contextInfo']['participant']);
            _0xcef32c['quoted']['fromMe'] = _0xcef32c['quoted']['sender'] === (_0x228d24['user'] && _0x228d24['user']['id']);
            _0xcef32c['quoted']['text'] = _0xcef32c['quoted']['text'] || _0xcef32c['quoted']['caption'] || _0xcef32c['quoted']['conversation'] || _0xcef32c['quoted']['contentText'] || _0xcef32c['quoted']['selectedDisplayText'] || _0xcef32c['quoted']['title'] || '';
            _0xcef32c['quoted']['mentionedJid'] = _0xcef32c['msg']['contextInfo'] ? _0xcef32c['msg']['contextInfo']['mentionedJid'] : [];
            _0xcef32c['getQuotedObj'] = _0xcef32c['getQuotedMessage'] = async () => {
                if (!_0xcef32c['quoted']['id'])
                    return ![];
                const _0x1e7fb5 = await _0x4817d3['loadMessage'](_0xcef32c['chat'], _0xcef32c['quoted']['id'], _0x228d24);
                return smsg(_0x228d24, _0x1e7fb5, _0x4817d3);
            };
            const _0x15295d = _0xcef32c['quoted']['fakeObj'] = _0x4aeb4['fromObject']({
                'key': {
                    'remoteJid': _0xcef32c['quoted']['chat'],
                    'fromMe': _0xcef32c['quoted']['fromMe'],
                    'id': _0xcef32c['quoted']['id']
                },
                'message': _0x3ffc58,
                ..._0xcef32c['isGroup'] ? { 'participant': _0xcef32c['quoted']['sender'] } : {}
            });
            _0xcef32c['quoted']['delete'] = () => _0x228d24['sendMessage'](_0xcef32c['quoted']['chat'], { 'delete': _0x15295d['key'] });
            _0xcef32c['quoted']['copyNForward'] = (_0x4eb9c8, _0x2ce14b = ![], _0x5bbb54 = {}) => _0x228d24['copyNForward'](_0x4eb9c8, _0x15295d, _0x2ce14b, _0x5bbb54);
            _0xcef32c['quoted']['download'] = () => _0x228d24['downloadMediaMessage'](_0xcef32c['quoted']);
        }
    }
    if (_0xcef32c['msg']?.['url'])
        _0xcef32c['download'] = () => _0x228d24['downloadMediaMessage'](_0xcef32c['msg']);
    _0xcef32c['text'] = _0xcef32c['msg']?.['text'] || _0xcef32c['msg']?.['caption'] || _0xcef32c['message']?.['conversation'] || _0xcef32c['msg']?.['contentText'] || _0xcef32c['msg']?.['selectedDisplayText'] || _0xcef32c['msg']?.['title'] || '';
    _0xcef32c['reply'] = (_0x4b7756, _0x137acc = _0xcef32c['chat'], _0x5951ce = {}) => Buffer['isBuffer'](_0x4b7756) ? _0x228d24['sendMedia'](_0x137acc, _0x4b7756, 'file', '', _0xcef32c, { ..._0x5951ce }) : _0x228d24['sendText'](_0x137acc, _0x4b7756, _0xcef32c, { ..._0x5951ce });
    _0xcef32c['copy'] = () => smsg(_0x228d24, _0x4aeb4['fromObject'](_0x4aeb4['toObject'](_0xcef32c)), _0x4817d3);
    _0xcef32c['copyNForward'] = (_0x34ab65 = _0xcef32c['chat'], _0x560e4b = ![], _0x4a8429 = {}) => _0x228d24['copyNForward'](_0x34ab65, _0xcef32c, _0x560e4b, _0x4a8429);
    return _0xcef32c;
};