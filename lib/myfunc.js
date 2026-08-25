import {
    proto,
    getContentType
} from '@whiskeysockets/baileys';
import _0x0_0x4c0eb1 from 'axios';
import _0x0_0x4c63dc from 'moment-timezone';
import { sizeFormatter } from 'human-readable';
import _0x0_0x440357 from 'util';
import _0x0_0x453deb from 'sharp';
export const unixTimestampSeconds = (_0x4933dd = new Date()) => Math['floor'](_0x4933dd['getTime']() / 0x3e8);
export const generateMessageTag = _0x5282aa => {
    let _0x265b6c = unixTimestampSeconds()['toString']();
    if (_0x5282aa)
        _0x265b6c += '.--' + _0x5282aa;
    return _0x265b6c;
};
export const processTime = (_0x115134, _0x2cf699) => _0x0_0x4c63dc['duration'](_0x2cf699['valueOf']() - _0x0_0x4c63dc(_0x115134 * 0x3e8)['valueOf']())['asSeconds']();
export const getRandom = _0x498b2d => '' + Math['floor'](Math['random']() * 0x2710) + _0x498b2d;
const BROWSER_HEADERS = {
    'DNT': '1',
    'Upgrade-Insecure-Request': '1'
};
export const getBuffer = async (_0x27d501, _0xf24894 = {}) => {
    try {
        const _0x50cbdf = await _0x0_0x4c0eb1({
            'method': 'get',
            'url': _0x27d501,
            'headers': BROWSER_HEADERS,
            ..._0xf24894,
            'responseType': 'arraybuffer'
        });
        return _0x50cbdf['data'];
    } catch (_0x23c3c6) {
        return _0x23c3c6;
    }
};
export const getImg = async (_0x45d199, _0x4c0f2e = {}) => {
    try {
        const _0x5f38db = await _0x0_0x4c0eb1({
            'method': 'get',
            'url': _0x45d199,
            'headers': BROWSER_HEADERS,
            ..._0x4c0f2e,
            'responseType': 'arraybuffer'
        });
        return _0x5f38db['data'];
    } catch (_0x4f9366) {
        return _0x4f9366;
    }
};
export const fetchJson = async (_0x52f37b, _0x24e739 = {}) => {
    try {
        const _0x345caf = await _0x0_0x4c0eb1({
            'method': 'GET',
            'url': _0x52f37b,
            'headers': { 'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/95.0.4638.69\x20Safari/537.36' },
            ..._0x24e739
        });
        return _0x345caf['data'];
    } catch (_0xffe87f) {
        return _0xffe87f;
    }
};
export const runtime = _0x2aa5dc => {
    _0x2aa5dc = Number(_0x2aa5dc);
    const _0x5ec3ed = Math['floor'](_0x2aa5dc / (0xe10 * 0x18));
    const _0x86ad27 = Math['floor'](_0x2aa5dc % (0xe10 * 0x18) / 0xe10);
    const _0x589d06 = Math['floor'](_0x2aa5dc % 0xe10 / 0x3c);
    const _0x3c6c10 = Math['floor'](_0x2aa5dc % 0x3c);
    const _0x430cf2 = _0x5ec3ed > 0x0 ? _0x5ec3ed + (_0x5ec3ed === 0x1 ? '\x20day,\x20' : '\x20days,\x20') : '';
    const _0xb728ec = _0x86ad27 > 0x0 ? _0x86ad27 + (_0x86ad27 === 0x1 ? '\x20hour,\x20' : '\x20hours,\x20') : '';
    const _0x4e9ea5 = _0x589d06 > 0x0 ? _0x589d06 + (_0x589d06 === 0x1 ? '\x20minute,\x20' : '\x20minutes,\x20') : '';
    const _0x24fe45 = _0x3c6c10 > 0x0 ? _0x3c6c10 + (_0x3c6c10 === 0x1 ? '\x20second' : '\x20seconds') : '';
    return _0x430cf2 + _0xb728ec + _0x4e9ea5 + _0x24fe45;
};
export const clockString = _0x28d6d => {
    const _0x1ad4fa = isNaN(_0x28d6d) ? '--' : Math['floor'](_0x28d6d / 0x36ee80);
    const _0x215e69 = isNaN(_0x28d6d) ? '--' : Math['floor'](_0x28d6d / 0xea60) % 0x3c;
    const _0x6a8c0b = isNaN(_0x28d6d) ? '--' : Math['floor'](_0x28d6d / 0x3e8) % 0x3c;
    return [
        _0x1ad4fa,
        _0x215e69,
        _0x6a8c0b
    ]['map'](_0x1c1f84 => _0x1c1f84['toString']()['padStart'](0x2, '0'))['join'](':');
};
export const sleep = _0xc2dac4 => new Promise(_0x14895b => setTimeout(_0x14895b, _0xc2dac4));
export const isUrl = _0x20832d => _0x20832d['match'](new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'));
export const getTime = (_0x3ca0bc, _0x2173b4) => {
    if (_0x2173b4)
        return _0x0_0x4c63dc(_0x2173b4)['locale']('en')['format'](_0x3ca0bc);
    return _0x0_0x4c63dc['tz']('Asia/Karachi')['locale']('en')['format'](_0x3ca0bc);
};
export const formatDate = (_0x3a16a7, _0x3066eb = 'en') => {
    const _0x4425dc = new Date(_0x3a16a7);
    return _0x4425dc['toLocaleDateString'](_0x3066eb, {
        'weekday': 'long',
        'day': 'numeric',
        'month': 'long',
        'year': 'numeric',
        'hour': 'numeric',
        'minute': 'numeric',
        'second': 'numeric'
    });
};
export const tanggal = _0x3ab6d3 => {
    const _0x16be0a = [
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
    const _0x244066 = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ];
    const _0x26e89e = new Date(_0x3ab6d3);
    const _0x497be4 = _0x26e89e['getDate']();
    const _0x5b5ffd = _0x26e89e['getMonth']();
    const _0xcb072d = _0x244066[_0x26e89e['getDay']()];
    const _0x3c90a7 = _0x26e89e['getFullYear']();
    const _0x34abc0 = _0x3c90a7 < 0x3e8 ? _0x3c90a7 + 0x76c : _0x3c90a7;
    return _0xcb072d + ',\x20' + _0x497be4 + '\x20-\x20' + _0x16be0a[_0x5b5ffd] + '\x20-\x20' + _0x34abc0;
};
export const jam = (_0x3d49ca, _0x45f51f = {}) => {
    const _0x754ecd = _0x45f51f['format'] ?? 'HH:mm';
    const _0x5eb245 = _0x45f51f['timeZone'] ? _0x0_0x4c63dc(_0x3d49ca)['tz'](_0x45f51f['timeZone'])['format'](_0x754ecd) : _0x0_0x4c63dc(_0x3d49ca)['format'](_0x754ecd);
    return _0x5eb245;
};
export const formatp = sizeFormatter({
    'std': 'JEDEC',
    'decimalPlaces': 0x2,
    'keepTrailingZeroes': ![],
    'render': (_0x3f91db, _0x4aa28d) => _0x3f91db + '\x20' + _0x4aa28d + 'B'
});
export const json = _0x8518ed => JSON['stringify'](_0x8518ed, null, 0x2);
export const logic = (_0x44c00d, _0x371047, _0x6fcfe1) => {
    if (_0x371047['length'] !== _0x6fcfe1['length'])
        throw new Error('Input\x20and\x20Output\x20must\x20have\x20same\x20length');
    for (let _0x2af067 = 0x0; _0x2af067 < _0x371047['length']; _0x2af067++) {
        if (_0x0_0x440357['isDeepStrictEqual'](_0x44c00d, _0x371047[_0x2af067]))
            return _0x6fcfe1[_0x2af067];
    }
    return null;
};
export const generateProfilePicture = async _0x2485ab => {
    const _0x1a920b = _0x0_0x453deb(_0x2485ab);
    const {
        width: width = 0x0,
        height: height = 0x0
    } = await _0x1a920b['metadata']();
    const _0x2247bb = Math['min'](width, height);
    const _0x517415 = await _0x1a920b['extract']({
        'left': 0x0,
        'top': 0x0,
        'width': _0x2247bb,
        'height': _0x2247bb
    })['resize'](0x2d0, 0x2d0)['jpeg']()['toBuffer']();
    return {
        'img': _0x517415,
        'preview': _0x517415
    };
};
export const reSize = async (_0x17b148, _0x4d8caf, _0xaa6548) => _0x0_0x453deb(_0x17b148)['resize'](_0x4d8caf, _0xaa6548)['jpeg']()['toBuffer']();
export const bytesToSize = (_0x597baa, _0x32f68f = 0x2) => {
    if (_0x597baa === 0x0)
        return '0\x20Bytes';
    const _0x501367 = 0x400;
    const _0x317f72 = _0x32f68f < 0x0 ? 0x0 : _0x32f68f;
    const _0xca01c3 = [
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
    const _0x262fcd = Math['floor'](Math['log'](_0x597baa) / Math['log'](_0x501367));
    return parseFloat((_0x597baa / Math['pow'](_0x501367, _0x262fcd))['toFixed'](_0x317f72)) + '\x20' + _0xca01c3[_0x262fcd];
};
export const getSizeMedia = _0x450c6c => {
    return new Promise((_0x480259, _0x4a2bbe) => {
        if (typeof _0x450c6c === 'string' && /http/['test'](_0x450c6c)) {
            _0x0_0x4c0eb1['get'](_0x450c6c)['then'](_0x1f6a0e => {
                const _0x4ad5f3 = parseInt(_0x1f6a0e['headers']['content-length'], 0xa);
                const _0x41681f = bytesToSize(_0x4ad5f3, 0x3);
                if (!isNaN(_0x4ad5f3))
                    _0x480259(_0x41681f);
                else
                    _0x4a2bbe('Invalid\x20content-length');
            })['catch'](_0x4a2bbe);
        } else if (Buffer['isBuffer'](_0x450c6c)) {
            const _0x30708a = Buffer['byteLength'](_0x450c6c);
            const _0x49845a = bytesToSize(_0x30708a, 0x3);
            if (!isNaN(_0x30708a))
                _0x480259(_0x49845a);
            else
                _0x4a2bbe('Invalid\x20buffer\x20length');
        } else {
            _0x4a2bbe('Invalid\x20input:\x20must\x20be\x20a\x20URL\x20string\x20or\x20Buffer');
        }
    });
};
export const parseMention = (_0x289d34 = '') => [..._0x289d34['matchAll'](/@([0-9]{5,16}|0)/g)]['map'](_0x24692f => _0x24692f[0x1] + '@s.whatsapp.net');
export const getGroupAdmins = _0x5be5df => {
    const _0x269dfe = [];
    for (const _0x4435f3 of _0x5be5df) {
        if (_0x4435f3['admin'] === 'superadmin' || _0x4435f3['admin'] === 'admin')
            _0x269dfe['push'](_0x4435f3['id']);
    }
    return _0x269dfe;
};
export const smsg = (_0x5e207b, _0x1e7c23, _0x5c7f13) => {
    if (!_0x1e7c23)
        return _0x1e7c23;
    const _0x3a1430 = proto['WebMessageInfo'];
    if (_0x1e7c23['key']) {
        _0x1e7c23['id'] = _0x1e7c23['key']['id'];
        _0x1e7c23['isBaileys'] = _0x1e7c23['id']['startsWith']('BAE5') && _0x1e7c23['id']['length'] === 0x10;
        _0x1e7c23['chat'] = _0x1e7c23['key']['remoteJid'];
        _0x1e7c23['fromMe'] = _0x1e7c23['key']['fromMe'];
        _0x1e7c23['isGroup'] = _0x1e7c23['chat']['endsWith']('@g.us');
        _0x1e7c23['sender'] = _0x5e207b['decodeJid'](_0x1e7c23['fromMe'] && _0x5e207b['user']['id'] || _0x1e7c23['participant'] || _0x1e7c23['key']['participant'] || _0x1e7c23['chat'] || '');
        if (_0x1e7c23['isGroup'])
            _0x1e7c23['participant'] = _0x5e207b['decodeJid'](_0x1e7c23['key']['participant']) || '';
    }
    if (_0x1e7c23['message']) {
        _0x1e7c23['mtype'] = getContentType(_0x1e7c23['message']);
        _0x1e7c23['msg'] = _0x1e7c23['mtype'] === 'viewOnceMessage' ? _0x1e7c23['message'][_0x1e7c23['mtype']]['message'][getContentType(_0x1e7c23['message'][_0x1e7c23['mtype']]['message'])] : _0x1e7c23['message'][_0x1e7c23['mtype']];
        _0x1e7c23['body'] = _0x1e7c23['message']['conversation'] || _0x1e7c23['msg']?.['caption'] || _0x1e7c23['msg']?.['text'] || _0x1e7c23['mtype'] === 'listResponseMessage' && _0x1e7c23['msg']?.['singleSelectReply']?.['selectedRowId'] || _0x1e7c23['mtype'] === 'buttonsResponseMessage' && _0x1e7c23['msg']?.['selectedButtonId'] || _0x1e7c23['mtype'] === 'viewOnceMessage' && _0x1e7c23['msg']?.['caption'] || _0x1e7c23['text'];
        const _0x1eba38 = _0x1e7c23['quoted'] = _0x1e7c23['msg']?.['contextInfo'] ? _0x1e7c23['msg']['contextInfo']['quotedMessage'] : null;
        _0x1e7c23['mentionedJid'] = _0x1e7c23['msg']?.['contextInfo'] ? _0x1e7c23['msg']['contextInfo']['mentionedJid'] : [];
        if (_0x1e7c23['quoted']) {
            let _0x274186 = getContentType(_0x1eba38);
            _0x1e7c23['quoted'] = _0x1e7c23['quoted'][_0x274186];
            if (['productMessage']['includes'](_0x274186)) {
                _0x274186 = getContentType(_0x1e7c23['quoted']);
                _0x1e7c23['quoted'] = _0x1e7c23['quoted'][_0x274186];
            }
            if (typeof _0x1e7c23['quoted'] === 'string')
                _0x1e7c23['quoted'] = { 'text': _0x1e7c23['quoted'] };
            _0x1e7c23['quoted']['mtype'] = _0x274186;
            _0x1e7c23['quoted']['id'] = _0x1e7c23['msg']['contextInfo']['stanzaId'];
            _0x1e7c23['quoted']['chat'] = _0x1e7c23['msg']['contextInfo']['remoteJid'] || _0x1e7c23['chat'];
            _0x1e7c23['quoted']['isBaileys'] = _0x1e7c23['quoted']['id'] ? _0x1e7c23['quoted']['id']['startsWith']('BAE5') && _0x1e7c23['quoted']['id']['length'] === 0x10 : ![];
            _0x1e7c23['quoted']['sender'] = _0x5e207b['decodeJid'](_0x1e7c23['msg']['contextInfo']['participant']);
            _0x1e7c23['quoted']['fromMe'] = _0x1e7c23['quoted']['sender'] === (_0x5e207b['user'] && _0x5e207b['user']['id']);
            _0x1e7c23['quoted']['text'] = _0x1e7c23['quoted']['text'] || _0x1e7c23['quoted']['caption'] || _0x1e7c23['quoted']['conversation'] || _0x1e7c23['quoted']['contentText'] || _0x1e7c23['quoted']['selectedDisplayText'] || _0x1e7c23['quoted']['title'] || '';
            _0x1e7c23['quoted']['mentionedJid'] = _0x1e7c23['msg']['contextInfo'] ? _0x1e7c23['msg']['contextInfo']['mentionedJid'] : [];
            _0x1e7c23['getQuotedObj'] = _0x1e7c23['getQuotedMessage'] = async () => {
                if (!_0x1e7c23['quoted']['id'])
                    return ![];
                const _0x6f1f24 = await _0x5c7f13['loadMessage'](_0x1e7c23['chat'], _0x1e7c23['quoted']['id'], _0x5e207b);
                return smsg(_0x5e207b, _0x6f1f24, _0x5c7f13);
            };
            const _0x59c848 = _0x1e7c23['quoted']['fakeObj'] = _0x3a1430['fromObject']({
                'key': {
                    'remoteJid': _0x1e7c23['quoted']['chat'],
                    'fromMe': _0x1e7c23['quoted']['fromMe'],
                    'id': _0x1e7c23['quoted']['id']
                },
                'message': _0x1eba38,
                ..._0x1e7c23['isGroup'] ? { 'participant': _0x1e7c23['quoted']['sender'] } : {}
            });
            _0x1e7c23['quoted']['delete'] = () => _0x5e207b['sendMessage'](_0x1e7c23['quoted']['chat'], { 'delete': _0x59c848['key'] });
            _0x1e7c23['quoted']['copyNForward'] = (_0x57920e, _0x4dbec3 = ![], _0x167235 = {}) => _0x5e207b['copyNForward'](_0x57920e, _0x59c848, _0x4dbec3, _0x167235);
            _0x1e7c23['quoted']['download'] = () => _0x5e207b['downloadMediaMessage'](_0x1e7c23['quoted']);
        }
    }
    if (_0x1e7c23['msg']?.['url'])
        _0x1e7c23['download'] = () => _0x5e207b['downloadMediaMessage'](_0x1e7c23['msg']);
    _0x1e7c23['text'] = _0x1e7c23['msg']?.['text'] || _0x1e7c23['msg']?.['caption'] || _0x1e7c23['message']?.['conversation'] || _0x1e7c23['msg']?.['contentText'] || _0x1e7c23['msg']?.['selectedDisplayText'] || _0x1e7c23['msg']?.['title'] || '';
    _0x1e7c23['reply'] = (_0x2cd863, _0x19f666 = _0x1e7c23['chat'], _0x2d7f45 = {}) => Buffer['isBuffer'](_0x2cd863) ? _0x5e207b['sendMedia'](_0x19f666, _0x2cd863, 'file', '', _0x1e7c23, { ..._0x2d7f45 }) : _0x5e207b['sendText'](_0x19f666, _0x2cd863, _0x1e7c23, { ..._0x2d7f45 });
    _0x1e7c23['copy'] = () => smsg(_0x5e207b, _0x3a1430['fromObject'](_0x3a1430['toObject'](_0x1e7c23)), _0x5c7f13);
    _0x1e7c23['copyNForward'] = (_0x413c3d = _0x1e7c23['chat'], _0x55a34f = ![], _0x10824c = {}) => _0x5e207b['copyNForward'](_0x413c3d, _0x1e7c23, _0x55a34f, _0x10824c);
    return _0x1e7c23;
};