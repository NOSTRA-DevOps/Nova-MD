import {
    proto,
    getContentType
} from '@whiskeysockets/baileys';
import _0x0_0x5a71e4 from 'axios';
import _0x0_0xf6213e from 'moment-timezone';
import { sizeFormatter } from 'human-readable';
import _0x0_0x5e6825 from 'util';
import _0x0_0x568c08 from 'sharp';
export const unixTimestampSeconds = (_0x24e6c8 = new Date()) => Math['floor'](_0x24e6c8['getTime']() / 0x3e8);
export const generateMessageTag = _0x1237ab => {
    let _0x2f98aa = unixTimestampSeconds()['toString']();
    if (_0x1237ab)
        _0x2f98aa += '.--' + _0x1237ab;
    return _0x2f98aa;
};
export const processTime = (_0x47afc5, _0x1e77ca) => _0x0_0xf6213e['duration'](_0x1e77ca['valueOf']() - _0x0_0xf6213e(_0x47afc5 * 0x3e8)['valueOf']())['asSeconds']();
export const getRandom = _0x546226 => '' + Math['floor'](Math['random']() * 0x2710) + _0x546226;
const BROWSER_HEADERS = {
    'DNT': '1',
    'Upgrade-Insecure-Request': '1'
};
export const getBuffer = async (_0xf89d55, _0xbefa91 = {}) => {
    try {
        const _0x252490 = await _0x0_0x5a71e4({
            'method': 'get',
            'url': _0xf89d55,
            'headers': BROWSER_HEADERS,
            ..._0xbefa91,
            'responseType': 'arraybuffer'
        });
        return _0x252490['data'];
    } catch (_0x264dd1) {
        return _0x264dd1;
    }
};
export const getImg = async (_0x3afab5, _0x17c69f = {}) => {
    try {
        const _0x4ec8af = await _0x0_0x5a71e4({
            'method': 'get',
            'url': _0x3afab5,
            'headers': BROWSER_HEADERS,
            ..._0x17c69f,
            'responseType': 'arraybuffer'
        });
        return _0x4ec8af['data'];
    } catch (_0x4188cb) {
        return _0x4188cb;
    }
};
export const fetchJson = async (_0x37bbae, _0x14c0a6 = {}) => {
    try {
        const _0x5c3db1 = await _0x0_0x5a71e4({
            'method': 'GET',
            'url': _0x37bbae,
            'headers': { 'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/95.0.4638.69\x20Safari/537.36' },
            ..._0x14c0a6
        });
        return _0x5c3db1['data'];
    } catch (_0x44c225) {
        return _0x44c225;
    }
};
export const runtime = _0x5837ea => {
    _0x5837ea = Number(_0x5837ea);
    const _0x57c09e = Math['floor'](_0x5837ea / (0xe10 * 0x18));
    const _0xb515d5 = Math['floor'](_0x5837ea % (0xe10 * 0x18) / 0xe10);
    const _0x1a7736 = Math['floor'](_0x5837ea % 0xe10 / 0x3c);
    const _0x396f78 = Math['floor'](_0x5837ea % 0x3c);
    const _0x1a807b = _0x57c09e > 0x0 ? _0x57c09e + (_0x57c09e === 0x1 ? '\x20day,\x20' : '\x20days,\x20') : '';
    const _0x304d08 = _0xb515d5 > 0x0 ? _0xb515d5 + (_0xb515d5 === 0x1 ? '\x20hour,\x20' : '\x20hours,\x20') : '';
    const _0x5649da = _0x1a7736 > 0x0 ? _0x1a7736 + (_0x1a7736 === 0x1 ? '\x20minute,\x20' : '\x20minutes,\x20') : '';
    const _0x3c8585 = _0x396f78 > 0x0 ? _0x396f78 + (_0x396f78 === 0x1 ? '\x20second' : '\x20seconds') : '';
    return _0x1a807b + _0x304d08 + _0x5649da + _0x3c8585;
};
export const clockString = _0x17b832 => {
    const _0x502ebe = isNaN(_0x17b832) ? '--' : Math['floor'](_0x17b832 / 0x36ee80);
    const _0x285862 = isNaN(_0x17b832) ? '--' : Math['floor'](_0x17b832 / 0xea60) % 0x3c;
    const _0x1e1160 = isNaN(_0x17b832) ? '--' : Math['floor'](_0x17b832 / 0x3e8) % 0x3c;
    return [
        _0x502ebe,
        _0x285862,
        _0x1e1160
    ]['map'](_0x558938 => _0x558938['toString']()['padStart'](0x2, '0'))['join'](':');
};
export const sleep = _0x16a76f => new Promise(_0x172faf => setTimeout(_0x172faf, _0x16a76f));
export const isUrl = _0x5f8389 => _0x5f8389['match'](new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'));
export const getTime = (_0x4a20ba, _0xa0239d) => {
    if (_0xa0239d)
        return _0x0_0xf6213e(_0xa0239d)['locale']('en')['format'](_0x4a20ba);
    return _0x0_0xf6213e['tz']('Asia/Karachi')['locale']('en')['format'](_0x4a20ba);
};
export const formatDate = (_0xa835f, _0x49851a = 'en') => {
    const _0x36f1e6 = new Date(_0xa835f);
    return _0x36f1e6['toLocaleDateString'](_0x49851a, {
        'weekday': 'long',
        'day': 'numeric',
        'month': 'long',
        'year': 'numeric',
        'hour': 'numeric',
        'minute': 'numeric',
        'second': 'numeric'
    });
};
export const tanggal = _0x221a5f => {
    const _0x40278d = [
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
    const _0x2f275d = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ];
    const _0x5761a6 = new Date(_0x221a5f);
    const _0x440f08 = _0x5761a6['getDate']();
    const _0x295078 = _0x5761a6['getMonth']();
    const _0x4269a5 = _0x2f275d[_0x5761a6['getDay']()];
    const _0x35364c = _0x5761a6['getFullYear']();
    const _0x1c5307 = _0x35364c < 0x3e8 ? _0x35364c + 0x76c : _0x35364c;
    return _0x4269a5 + ',\x20' + _0x440f08 + '\x20-\x20' + _0x40278d[_0x295078] + '\x20-\x20' + _0x1c5307;
};
export const jam = (_0x323af1, _0x6107f4 = {}) => {
    const _0x15c004 = _0x6107f4['format'] ?? 'HH:mm';
    const _0x120609 = _0x6107f4['timeZone'] ? _0x0_0xf6213e(_0x323af1)['tz'](_0x6107f4['timeZone'])['format'](_0x15c004) : _0x0_0xf6213e(_0x323af1)['format'](_0x15c004);
    return _0x120609;
};
export const formatp = sizeFormatter({
    'std': 'JEDEC',
    'decimalPlaces': 0x2,
    'keepTrailingZeroes': ![],
    'render': (_0x3cdc11, _0x10c04f) => _0x3cdc11 + '\x20' + _0x10c04f + 'B'
});
export const json = _0x81875c => JSON['stringify'](_0x81875c, null, 0x2);
export const logic = (_0x2a0cec, _0x5dac6a, _0x2e8e42) => {
    if (_0x5dac6a['length'] !== _0x2e8e42['length'])
        throw new Error('Input\x20and\x20Output\x20must\x20have\x20same\x20length');
    for (let _0x4463a6 = 0x0; _0x4463a6 < _0x5dac6a['length']; _0x4463a6++) {
        if (_0x0_0x5e6825['isDeepStrictEqual'](_0x2a0cec, _0x5dac6a[_0x4463a6]))
            return _0x2e8e42[_0x4463a6];
    }
    return null;
};
export const generateProfilePicture = async _0x378990 => {
    const _0x528236 = _0x0_0x568c08(_0x378990);
    const {
        width: width = 0x0,
        height: height = 0x0
    } = await _0x528236['metadata']();
    const _0x44f77f = Math['min'](width, height);
    const _0x4d7e27 = await _0x528236['extract']({
        'left': 0x0,
        'top': 0x0,
        'width': _0x44f77f,
        'height': _0x44f77f
    })['resize'](0x2d0, 0x2d0)['jpeg']()['toBuffer']();
    return {
        'img': _0x4d7e27,
        'preview': _0x4d7e27
    };
};
export const reSize = async (_0x7f62ed, _0x30c2a9, _0x5f0fc7) => _0x0_0x568c08(_0x7f62ed)['resize'](_0x30c2a9, _0x5f0fc7)['jpeg']()['toBuffer']();
export const bytesToSize = (_0x98547a, _0x4b5c6d = 0x2) => {
    if (_0x98547a === 0x0)
        return '0\x20Bytes';
    const _0x3d6000 = 0x400;
    const _0xbb9082 = _0x4b5c6d < 0x0 ? 0x0 : _0x4b5c6d;
    const _0x3dfe2b = [
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
    const _0x4a12b2 = Math['floor'](Math['log'](_0x98547a) / Math['log'](_0x3d6000));
    return parseFloat((_0x98547a / Math['pow'](_0x3d6000, _0x4a12b2))['toFixed'](_0xbb9082)) + '\x20' + _0x3dfe2b[_0x4a12b2];
};
export const getSizeMedia = _0x35cd9d => {
    return new Promise((_0x145a77, _0x2f36f6) => {
        if (typeof _0x35cd9d === 'string' && /http/['test'](_0x35cd9d)) {
            _0x0_0x5a71e4['get'](_0x35cd9d)['then'](_0x37c8c4 => {
                const _0x22047b = parseInt(_0x37c8c4['headers']['content-length'], 0xa);
                const _0x2668e1 = bytesToSize(_0x22047b, 0x3);
                if (!isNaN(_0x22047b))
                    _0x145a77(_0x2668e1);
                else
                    _0x2f36f6('Invalid\x20content-length');
            })['catch'](_0x2f36f6);
        } else if (Buffer['isBuffer'](_0x35cd9d)) {
            const _0x2438a5 = Buffer['byteLength'](_0x35cd9d);
            const _0x10bac8 = bytesToSize(_0x2438a5, 0x3);
            if (!isNaN(_0x2438a5))
                _0x145a77(_0x10bac8);
            else
                _0x2f36f6('Invalid\x20buffer\x20length');
        } else {
            _0x2f36f6('Invalid\x20input:\x20must\x20be\x20a\x20URL\x20string\x20or\x20Buffer');
        }
    });
};
export const parseMention = (_0x417341 = '') => [..._0x417341['matchAll'](/@([0-9]{5,16}|0)/g)]['map'](_0x3a6870 => _0x3a6870[0x1] + '@s.whatsapp.net');
export const getGroupAdmins = _0x377575 => {
    const _0x1be093 = [];
    for (const _0x123824 of _0x377575) {
        if (_0x123824['admin'] === 'superadmin' || _0x123824['admin'] === 'admin')
            _0x1be093['push'](_0x123824['id']);
    }
    return _0x1be093;
};
export const smsg = (_0x2168a8, _0x42f146, _0x172019) => {
    if (!_0x42f146)
        return _0x42f146;
    const _0x597a69 = proto['WebMessageInfo'];
    if (_0x42f146['key']) {
        _0x42f146['id'] = _0x42f146['key']['id'];
        _0x42f146['isBaileys'] = _0x42f146['id']['startsWith']('BAE5') && _0x42f146['id']['length'] === 0x10;
        _0x42f146['chat'] = _0x42f146['key']['remoteJid'];
        _0x42f146['fromMe'] = _0x42f146['key']['fromMe'];
        _0x42f146['isGroup'] = _0x42f146['chat']['endsWith']('@g.us');
        _0x42f146['sender'] = _0x2168a8['decodeJid'](_0x42f146['fromMe'] && _0x2168a8['user']['id'] || _0x42f146['participant'] || _0x42f146['key']['participant'] || _0x42f146['chat'] || '');
        if (_0x42f146['isGroup'])
            _0x42f146['participant'] = _0x2168a8['decodeJid'](_0x42f146['key']['participant']) || '';
    }
    if (_0x42f146['message']) {
        _0x42f146['mtype'] = getContentType(_0x42f146['message']);
        _0x42f146['msg'] = _0x42f146['mtype'] === 'viewOnceMessage' ? _0x42f146['message'][_0x42f146['mtype']]['message'][getContentType(_0x42f146['message'][_0x42f146['mtype']]['message'])] : _0x42f146['message'][_0x42f146['mtype']];
        _0x42f146['body'] = _0x42f146['message']['conversation'] || _0x42f146['msg']?.['caption'] || _0x42f146['msg']?.['text'] || _0x42f146['mtype'] === 'listResponseMessage' && _0x42f146['msg']?.['singleSelectReply']?.['selectedRowId'] || _0x42f146['mtype'] === 'buttonsResponseMessage' && _0x42f146['msg']?.['selectedButtonId'] || _0x42f146['mtype'] === 'viewOnceMessage' && _0x42f146['msg']?.['caption'] || _0x42f146['text'];
        const _0x3bd363 = _0x42f146['quoted'] = _0x42f146['msg']?.['contextInfo'] ? _0x42f146['msg']['contextInfo']['quotedMessage'] : null;
        _0x42f146['mentionedJid'] = _0x42f146['msg']?.['contextInfo'] ? _0x42f146['msg']['contextInfo']['mentionedJid'] : [];
        if (_0x42f146['quoted']) {
            let _0x352c94 = getContentType(_0x3bd363);
            _0x42f146['quoted'] = _0x42f146['quoted'][_0x352c94];
            if (['productMessage']['includes'](_0x352c94)) {
                _0x352c94 = getContentType(_0x42f146['quoted']);
                _0x42f146['quoted'] = _0x42f146['quoted'][_0x352c94];
            }
            if (typeof _0x42f146['quoted'] === 'string')
                _0x42f146['quoted'] = { 'text': _0x42f146['quoted'] };
            _0x42f146['quoted']['mtype'] = _0x352c94;
            _0x42f146['quoted']['id'] = _0x42f146['msg']['contextInfo']['stanzaId'];
            _0x42f146['quoted']['chat'] = _0x42f146['msg']['contextInfo']['remoteJid'] || _0x42f146['chat'];
            _0x42f146['quoted']['isBaileys'] = _0x42f146['quoted']['id'] ? _0x42f146['quoted']['id']['startsWith']('BAE5') && _0x42f146['quoted']['id']['length'] === 0x10 : ![];
            _0x42f146['quoted']['sender'] = _0x2168a8['decodeJid'](_0x42f146['msg']['contextInfo']['participant']);
            _0x42f146['quoted']['fromMe'] = _0x42f146['quoted']['sender'] === (_0x2168a8['user'] && _0x2168a8['user']['id']);
            _0x42f146['quoted']['text'] = _0x42f146['quoted']['text'] || _0x42f146['quoted']['caption'] || _0x42f146['quoted']['conversation'] || _0x42f146['quoted']['contentText'] || _0x42f146['quoted']['selectedDisplayText'] || _0x42f146['quoted']['title'] || '';
            _0x42f146['quoted']['mentionedJid'] = _0x42f146['msg']['contextInfo'] ? _0x42f146['msg']['contextInfo']['mentionedJid'] : [];
            _0x42f146['getQuotedObj'] = _0x42f146['getQuotedMessage'] = async () => {
                if (!_0x42f146['quoted']['id'])
                    return ![];
                const _0x15c9d2 = await _0x172019['loadMessage'](_0x42f146['chat'], _0x42f146['quoted']['id'], _0x2168a8);
                return smsg(_0x2168a8, _0x15c9d2, _0x172019);
            };
            const _0x12c9d0 = _0x42f146['quoted']['fakeObj'] = _0x597a69['fromObject']({
                'key': {
                    'remoteJid': _0x42f146['quoted']['chat'],
                    'fromMe': _0x42f146['quoted']['fromMe'],
                    'id': _0x42f146['quoted']['id']
                },
                'message': _0x3bd363,
                ..._0x42f146['isGroup'] ? { 'participant': _0x42f146['quoted']['sender'] } : {}
            });
            _0x42f146['quoted']['delete'] = () => _0x2168a8['sendMessage'](_0x42f146['quoted']['chat'], { 'delete': _0x12c9d0['key'] });
            _0x42f146['quoted']['copyNForward'] = (_0x194441, _0x28c171 = ![], _0x27c3a7 = {}) => _0x2168a8['copyNForward'](_0x194441, _0x12c9d0, _0x28c171, _0x27c3a7);
            _0x42f146['quoted']['download'] = () => _0x2168a8['downloadMediaMessage'](_0x42f146['quoted']);
        }
    }
    if (_0x42f146['msg']?.['url'])
        _0x42f146['download'] = () => _0x2168a8['downloadMediaMessage'](_0x42f146['msg']);
    _0x42f146['text'] = _0x42f146['msg']?.['text'] || _0x42f146['msg']?.['caption'] || _0x42f146['message']?.['conversation'] || _0x42f146['msg']?.['contentText'] || _0x42f146['msg']?.['selectedDisplayText'] || _0x42f146['msg']?.['title'] || '';
    _0x42f146['reply'] = (_0x5b609c, _0x667f2a = _0x42f146['chat'], _0x40a625 = {}) => Buffer['isBuffer'](_0x5b609c) ? _0x2168a8['sendMedia'](_0x667f2a, _0x5b609c, 'file', '', _0x42f146, { ..._0x40a625 }) : _0x2168a8['sendText'](_0x667f2a, _0x5b609c, _0x42f146, { ..._0x40a625 });
    _0x42f146['copy'] = () => smsg(_0x2168a8, _0x597a69['fromObject'](_0x597a69['toObject'](_0x42f146)), _0x172019);
    _0x42f146['copyNForward'] = (_0x34f8a0 = _0x42f146['chat'], _0x4d9661 = ![], _0x5e0034 = {}) => _0x2168a8['copyNForward'](_0x34f8a0, _0x42f146, _0x4d9661, _0x5e0034);
    return _0x42f146;
};