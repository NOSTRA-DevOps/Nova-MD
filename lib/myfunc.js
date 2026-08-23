import {
    proto,
    getContentType
} from '@whiskeysockets/baileys';
import _0x0_0x3e1e6b from 'axios';
import _0x0_0xfef3c5 from 'moment-timezone';
import { sizeFormatter } from 'human-readable';
import _0x0_0x1a4a6a from 'util';
import _0x0_0x3201a3 from 'sharp';
export const unixTimestampSeconds = (_0x3ac65f = new Date()) => Math['floor'](_0x3ac65f['getTime']() / 0x3e8);
export const generateMessageTag = _0x50c8b4 => {
    let _0x166e29 = unixTimestampSeconds()['toString']();
    if (_0x50c8b4)
        _0x166e29 += '.--' + _0x50c8b4;
    return _0x166e29;
};
export const processTime = (_0x47f46e, _0x17e057) => _0x0_0xfef3c5['duration'](_0x17e057['valueOf']() - _0x0_0xfef3c5(_0x47f46e * 0x3e8)['valueOf']())['asSeconds']();
export const getRandom = _0xff95c5 => '' + Math['floor'](Math['random']() * 0x2710) + _0xff95c5;
const BROWSER_HEADERS = {
    'DNT': '1',
    'Upgrade-Insecure-Request': '1'
};
export const getBuffer = async (_0x20b078, _0x3e7012 = {}) => {
    try {
        const _0x45275a = await _0x0_0x3e1e6b({
            'method': 'get',
            'url': _0x20b078,
            'headers': BROWSER_HEADERS,
            ..._0x3e7012,
            'responseType': 'arraybuffer'
        });
        return _0x45275a['data'];
    } catch (_0x4a03f9) {
        return _0x4a03f9;
    }
};
export const getImg = async (_0x4a574f, _0x2ab149 = {}) => {
    try {
        const _0x47cada = await _0x0_0x3e1e6b({
            'method': 'get',
            'url': _0x4a574f,
            'headers': BROWSER_HEADERS,
            ..._0x2ab149,
            'responseType': 'arraybuffer'
        });
        return _0x47cada['data'];
    } catch (_0x5d3c20) {
        return _0x5d3c20;
    }
};
export const fetchJson = async (_0x42aca5, _0x31ed12 = {}) => {
    try {
        const _0x3c02de = await _0x0_0x3e1e6b({
            'method': 'GET',
            'url': _0x42aca5,
            'headers': { 'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/95.0.4638.69\x20Safari/537.36' },
            ..._0x31ed12
        });
        return _0x3c02de['data'];
    } catch (_0x16526f) {
        return _0x16526f;
    }
};
export const runtime = _0x5a9252 => {
    _0x5a9252 = Number(_0x5a9252);
    const _0x2b697a = Math['floor'](_0x5a9252 / (0xe10 * 0x18));
    const _0x4e08f6 = Math['floor'](_0x5a9252 % (0xe10 * 0x18) / 0xe10);
    const _0x1ded5b = Math['floor'](_0x5a9252 % 0xe10 / 0x3c);
    const _0x2e4b1d = Math['floor'](_0x5a9252 % 0x3c);
    const _0x26e5f2 = _0x2b697a > 0x0 ? _0x2b697a + (_0x2b697a === 0x1 ? '\x20day,\x20' : '\x20days,\x20') : '';
    const _0x184cad = _0x4e08f6 > 0x0 ? _0x4e08f6 + (_0x4e08f6 === 0x1 ? '\x20hour,\x20' : '\x20hours,\x20') : '';
    const _0x41a050 = _0x1ded5b > 0x0 ? _0x1ded5b + (_0x1ded5b === 0x1 ? '\x20minute,\x20' : '\x20minutes,\x20') : '';
    const _0x468b34 = _0x2e4b1d > 0x0 ? _0x2e4b1d + (_0x2e4b1d === 0x1 ? '\x20second' : '\x20seconds') : '';
    return _0x26e5f2 + _0x184cad + _0x41a050 + _0x468b34;
};
export const clockString = _0x272ff7 => {
    const _0x5bd4c1 = isNaN(_0x272ff7) ? '--' : Math['floor'](_0x272ff7 / 0x36ee80);
    const _0x1b93f7 = isNaN(_0x272ff7) ? '--' : Math['floor'](_0x272ff7 / 0xea60) % 0x3c;
    const _0x229e1c = isNaN(_0x272ff7) ? '--' : Math['floor'](_0x272ff7 / 0x3e8) % 0x3c;
    return [
        _0x5bd4c1,
        _0x1b93f7,
        _0x229e1c
    ]['map'](_0x24d093 => _0x24d093['toString']()['padStart'](0x2, '0'))['join'](':');
};
export const sleep = _0xc430db => new Promise(_0x523e9c => setTimeout(_0x523e9c, _0xc430db));
export const isUrl = _0x2ddbdb => _0x2ddbdb['match'](new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'));
export const getTime = (_0x4f656a, _0x5774fd) => {
    if (_0x5774fd)
        return _0x0_0xfef3c5(_0x5774fd)['locale']('en')['format'](_0x4f656a);
    return _0x0_0xfef3c5['tz']('Asia/Karachi')['locale']('en')['format'](_0x4f656a);
};
export const formatDate = (_0x2e9420, _0x5393f3 = 'en') => {
    const _0x247d89 = new Date(_0x2e9420);
    return _0x247d89['toLocaleDateString'](_0x5393f3, {
        'weekday': 'long',
        'day': 'numeric',
        'month': 'long',
        'year': 'numeric',
        'hour': 'numeric',
        'minute': 'numeric',
        'second': 'numeric'
    });
};
export const tanggal = _0x3b119a => {
    const _0x2d71bc = [
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
    const _0x2a0eb9 = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ];
    const _0x3b2010 = new Date(_0x3b119a);
    const _0x237bcc = _0x3b2010['getDate']();
    const _0x98a9bd = _0x3b2010['getMonth']();
    const _0x2eec38 = _0x2a0eb9[_0x3b2010['getDay']()];
    const _0x5510d0 = _0x3b2010['getFullYear']();
    const _0xc016d6 = _0x5510d0 < 0x3e8 ? _0x5510d0 + 0x76c : _0x5510d0;
    return _0x2eec38 + ',\x20' + _0x237bcc + '\x20-\x20' + _0x2d71bc[_0x98a9bd] + '\x20-\x20' + _0xc016d6;
};
export const jam = (_0x4069f6, _0x133aae = {}) => {
    const _0x1ababf = _0x133aae['format'] ?? 'HH:mm';
    const _0x5a1471 = _0x133aae['timeZone'] ? _0x0_0xfef3c5(_0x4069f6)['tz'](_0x133aae['timeZone'])['format'](_0x1ababf) : _0x0_0xfef3c5(_0x4069f6)['format'](_0x1ababf);
    return _0x5a1471;
};
export const formatp = sizeFormatter({
    'std': 'JEDEC',
    'decimalPlaces': 0x2,
    'keepTrailingZeroes': ![],
    'render': (_0x45ce1c, _0x1fdc86) => _0x45ce1c + '\x20' + _0x1fdc86 + 'B'
});
export const json = _0x45078e => JSON['stringify'](_0x45078e, null, 0x2);
export const logic = (_0x3baf87, _0x3527fc, _0x193ddd) => {
    if (_0x3527fc['length'] !== _0x193ddd['length'])
        throw new Error('Input\x20and\x20Output\x20must\x20have\x20same\x20length');
    for (let _0x409b28 = 0x0; _0x409b28 < _0x3527fc['length']; _0x409b28++) {
        if (_0x0_0x1a4a6a['isDeepStrictEqual'](_0x3baf87, _0x3527fc[_0x409b28]))
            return _0x193ddd[_0x409b28];
    }
    return null;
};
export const generateProfilePicture = async _0x52f6ee => {
    const _0x3ef989 = _0x0_0x3201a3(_0x52f6ee);
    const {
        width: width = 0x0,
        height: height = 0x0
    } = await _0x3ef989['metadata']();
    const _0xfd2a18 = Math['min'](width, height);
    const _0x2ef396 = await _0x3ef989['extract']({
        'left': 0x0,
        'top': 0x0,
        'width': _0xfd2a18,
        'height': _0xfd2a18
    })['resize'](0x2d0, 0x2d0)['jpeg']()['toBuffer']();
    return {
        'img': _0x2ef396,
        'preview': _0x2ef396
    };
};
export const reSize = async (_0x213d9a, _0x3d4706, _0x32644e) => _0x0_0x3201a3(_0x213d9a)['resize'](_0x3d4706, _0x32644e)['jpeg']()['toBuffer']();
export const bytesToSize = (_0x37314d, _0x40dfed = 0x2) => {
    if (_0x37314d === 0x0)
        return '0\x20Bytes';
    const _0x5369e1 = 0x400;
    const _0x4e9395 = _0x40dfed < 0x0 ? 0x0 : _0x40dfed;
    const _0x5084be = [
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
    const _0x4d0cdb = Math['floor'](Math['log'](_0x37314d) / Math['log'](_0x5369e1));
    return parseFloat((_0x37314d / Math['pow'](_0x5369e1, _0x4d0cdb))['toFixed'](_0x4e9395)) + '\x20' + _0x5084be[_0x4d0cdb];
};
export const getSizeMedia = _0x4085ab => {
    return new Promise((_0x5da25e, _0x56c951) => {
        if (typeof _0x4085ab === 'string' && /http/['test'](_0x4085ab)) {
            _0x0_0x3e1e6b['get'](_0x4085ab)['then'](_0x4aecf8 => {
                const _0x2a646c = parseInt(_0x4aecf8['headers']['content-length'], 0xa);
                const _0x371d11 = bytesToSize(_0x2a646c, 0x3);
                if (!isNaN(_0x2a646c))
                    _0x5da25e(_0x371d11);
                else
                    _0x56c951('Invalid\x20content-length');
            })['catch'](_0x56c951);
        } else if (Buffer['isBuffer'](_0x4085ab)) {
            const _0x5714cf = Buffer['byteLength'](_0x4085ab);
            const _0x8b1eef = bytesToSize(_0x5714cf, 0x3);
            if (!isNaN(_0x5714cf))
                _0x5da25e(_0x8b1eef);
            else
                _0x56c951('Invalid\x20buffer\x20length');
        } else {
            _0x56c951('Invalid\x20input:\x20must\x20be\x20a\x20URL\x20string\x20or\x20Buffer');
        }
    });
};
export const parseMention = (_0xa0f026 = '') => [..._0xa0f026['matchAll'](/@([0-9]{5,16}|0)/g)]['map'](_0x7de6ea => _0x7de6ea[0x1] + '@s.whatsapp.net');
export const getGroupAdmins = _0x5e5127 => {
    const _0x35c5d8 = [];
    for (const _0x22bd06 of _0x5e5127) {
        if (_0x22bd06['admin'] === 'superadmin' || _0x22bd06['admin'] === 'admin')
            _0x35c5d8['push'](_0x22bd06['id']);
    }
    return _0x35c5d8;
};
export const smsg = (_0x4b467a, _0x39a06e, _0x10f905) => {
    if (!_0x39a06e)
        return _0x39a06e;
    const _0x29c2b7 = proto['WebMessageInfo'];
    if (_0x39a06e['key']) {
        _0x39a06e['id'] = _0x39a06e['key']['id'];
        _0x39a06e['isBaileys'] = _0x39a06e['id']['startsWith']('BAE5') && _0x39a06e['id']['length'] === 0x10;
        _0x39a06e['chat'] = _0x39a06e['key']['remoteJid'];
        _0x39a06e['fromMe'] = _0x39a06e['key']['fromMe'];
        _0x39a06e['isGroup'] = _0x39a06e['chat']['endsWith']('@g.us');
        _0x39a06e['sender'] = _0x4b467a['decodeJid'](_0x39a06e['fromMe'] && _0x4b467a['user']['id'] || _0x39a06e['participant'] || _0x39a06e['key']['participant'] || _0x39a06e['chat'] || '');
        if (_0x39a06e['isGroup'])
            _0x39a06e['participant'] = _0x4b467a['decodeJid'](_0x39a06e['key']['participant']) || '';
    }
    if (_0x39a06e['message']) {
        _0x39a06e['mtype'] = getContentType(_0x39a06e['message']);
        _0x39a06e['msg'] = _0x39a06e['mtype'] === 'viewOnceMessage' ? _0x39a06e['message'][_0x39a06e['mtype']]['message'][getContentType(_0x39a06e['message'][_0x39a06e['mtype']]['message'])] : _0x39a06e['message'][_0x39a06e['mtype']];
        _0x39a06e['body'] = _0x39a06e['message']['conversation'] || _0x39a06e['msg']?.['caption'] || _0x39a06e['msg']?.['text'] || _0x39a06e['mtype'] === 'listResponseMessage' && _0x39a06e['msg']?.['singleSelectReply']?.['selectedRowId'] || _0x39a06e['mtype'] === 'buttonsResponseMessage' && _0x39a06e['msg']?.['selectedButtonId'] || _0x39a06e['mtype'] === 'viewOnceMessage' && _0x39a06e['msg']?.['caption'] || _0x39a06e['text'];
        const _0x1847a5 = _0x39a06e['quoted'] = _0x39a06e['msg']?.['contextInfo'] ? _0x39a06e['msg']['contextInfo']['quotedMessage'] : null;
        _0x39a06e['mentionedJid'] = _0x39a06e['msg']?.['contextInfo'] ? _0x39a06e['msg']['contextInfo']['mentionedJid'] : [];
        if (_0x39a06e['quoted']) {
            let _0x561d35 = getContentType(_0x1847a5);
            _0x39a06e['quoted'] = _0x39a06e['quoted'][_0x561d35];
            if (['productMessage']['includes'](_0x561d35)) {
                _0x561d35 = getContentType(_0x39a06e['quoted']);
                _0x39a06e['quoted'] = _0x39a06e['quoted'][_0x561d35];
            }
            if (typeof _0x39a06e['quoted'] === 'string')
                _0x39a06e['quoted'] = { 'text': _0x39a06e['quoted'] };
            _0x39a06e['quoted']['mtype'] = _0x561d35;
            _0x39a06e['quoted']['id'] = _0x39a06e['msg']['contextInfo']['stanzaId'];
            _0x39a06e['quoted']['chat'] = _0x39a06e['msg']['contextInfo']['remoteJid'] || _0x39a06e['chat'];
            _0x39a06e['quoted']['isBaileys'] = _0x39a06e['quoted']['id'] ? _0x39a06e['quoted']['id']['startsWith']('BAE5') && _0x39a06e['quoted']['id']['length'] === 0x10 : ![];
            _0x39a06e['quoted']['sender'] = _0x4b467a['decodeJid'](_0x39a06e['msg']['contextInfo']['participant']);
            _0x39a06e['quoted']['fromMe'] = _0x39a06e['quoted']['sender'] === (_0x4b467a['user'] && _0x4b467a['user']['id']);
            _0x39a06e['quoted']['text'] = _0x39a06e['quoted']['text'] || _0x39a06e['quoted']['caption'] || _0x39a06e['quoted']['conversation'] || _0x39a06e['quoted']['contentText'] || _0x39a06e['quoted']['selectedDisplayText'] || _0x39a06e['quoted']['title'] || '';
            _0x39a06e['quoted']['mentionedJid'] = _0x39a06e['msg']['contextInfo'] ? _0x39a06e['msg']['contextInfo']['mentionedJid'] : [];
            _0x39a06e['getQuotedObj'] = _0x39a06e['getQuotedMessage'] = async () => {
                if (!_0x39a06e['quoted']['id'])
                    return ![];
                const _0x26ffc4 = await _0x10f905['loadMessage'](_0x39a06e['chat'], _0x39a06e['quoted']['id'], _0x4b467a);
                return smsg(_0x4b467a, _0x26ffc4, _0x10f905);
            };
            const _0x3b1da1 = _0x39a06e['quoted']['fakeObj'] = _0x29c2b7['fromObject']({
                'key': {
                    'remoteJid': _0x39a06e['quoted']['chat'],
                    'fromMe': _0x39a06e['quoted']['fromMe'],
                    'id': _0x39a06e['quoted']['id']
                },
                'message': _0x1847a5,
                ..._0x39a06e['isGroup'] ? { 'participant': _0x39a06e['quoted']['sender'] } : {}
            });
            _0x39a06e['quoted']['delete'] = () => _0x4b467a['sendMessage'](_0x39a06e['quoted']['chat'], { 'delete': _0x3b1da1['key'] });
            _0x39a06e['quoted']['copyNForward'] = (_0x3828d9, _0x386551 = ![], _0x30d55c = {}) => _0x4b467a['copyNForward'](_0x3828d9, _0x3b1da1, _0x386551, _0x30d55c);
            _0x39a06e['quoted']['download'] = () => _0x4b467a['downloadMediaMessage'](_0x39a06e['quoted']);
        }
    }
    if (_0x39a06e['msg']?.['url'])
        _0x39a06e['download'] = () => _0x4b467a['downloadMediaMessage'](_0x39a06e['msg']);
    _0x39a06e['text'] = _0x39a06e['msg']?.['text'] || _0x39a06e['msg']?.['caption'] || _0x39a06e['message']?.['conversation'] || _0x39a06e['msg']?.['contentText'] || _0x39a06e['msg']?.['selectedDisplayText'] || _0x39a06e['msg']?.['title'] || '';
    _0x39a06e['reply'] = (_0x15db6f, _0x4e2ded = _0x39a06e['chat'], _0x27fd82 = {}) => Buffer['isBuffer'](_0x15db6f) ? _0x4b467a['sendMedia'](_0x4e2ded, _0x15db6f, 'file', '', _0x39a06e, { ..._0x27fd82 }) : _0x4b467a['sendText'](_0x4e2ded, _0x15db6f, _0x39a06e, { ..._0x27fd82 });
    _0x39a06e['copy'] = () => smsg(_0x4b467a, _0x29c2b7['fromObject'](_0x29c2b7['toObject'](_0x39a06e)), _0x10f905);
    _0x39a06e['copyNForward'] = (_0x13258a = _0x39a06e['chat'], _0xd8599a = ![], _0x28b816 = {}) => _0x4b467a['copyNForward'](_0x13258a, _0x39a06e, _0xd8599a, _0x28b816);
    return _0x39a06e;
};