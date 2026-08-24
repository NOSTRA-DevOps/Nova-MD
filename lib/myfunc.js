import {
    proto,
    getContentType
} from '@whiskeysockets/baileys';
import _0x0_0x33b483 from 'axios';
import _0x0_0x2abaa9 from 'moment-timezone';
import { sizeFormatter } from 'human-readable';
import _0x0_0x1fb9a0 from 'util';
import _0x0_0x5c061c from 'sharp';
export const unixTimestampSeconds = (_0x108435 = new Date()) => Math['floor'](_0x108435['getTime']() / 0x3e8);
export const generateMessageTag = _0x117b77 => {
    let _0xd986c8 = unixTimestampSeconds()['toString']();
    if (_0x117b77)
        _0xd986c8 += '.--' + _0x117b77;
    return _0xd986c8;
};
export const processTime = (_0xe4f5bf, _0x3d4e84) => _0x0_0x2abaa9['duration'](_0x3d4e84['valueOf']() - _0x0_0x2abaa9(_0xe4f5bf * 0x3e8)['valueOf']())['asSeconds']();
export const getRandom = _0x108f9c => '' + Math['floor'](Math['random']() * 0x2710) + _0x108f9c;
const BROWSER_HEADERS = {
    'DNT': '1',
    'Upgrade-Insecure-Request': '1'
};
export const getBuffer = async (_0x1036f3, _0x28a960 = {}) => {
    try {
        const _0x23cf35 = await _0x0_0x33b483({
            'method': 'get',
            'url': _0x1036f3,
            'headers': BROWSER_HEADERS,
            ..._0x28a960,
            'responseType': 'arraybuffer'
        });
        return _0x23cf35['data'];
    } catch (_0x4beade) {
        return _0x4beade;
    }
};
export const getImg = async (_0x4dc8c1, _0x437271 = {}) => {
    try {
        const _0x203f26 = await _0x0_0x33b483({
            'method': 'get',
            'url': _0x4dc8c1,
            'headers': BROWSER_HEADERS,
            ..._0x437271,
            'responseType': 'arraybuffer'
        });
        return _0x203f26['data'];
    } catch (_0x5a8cd9) {
        return _0x5a8cd9;
    }
};
export const fetchJson = async (_0x5b148c, _0x1d6a89 = {}) => {
    try {
        const _0xb6ea5b = await _0x0_0x33b483({
            'method': 'GET',
            'url': _0x5b148c,
            'headers': { 'User-Agent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/95.0.4638.69\x20Safari/537.36' },
            ..._0x1d6a89
        });
        return _0xb6ea5b['data'];
    } catch (_0x3522e5) {
        return _0x3522e5;
    }
};
export const runtime = _0xac3487 => {
    _0xac3487 = Number(_0xac3487);
    const _0x47b34a = Math['floor'](_0xac3487 / (0xe10 * 0x18));
    const _0x2a4b51 = Math['floor'](_0xac3487 % (0xe10 * 0x18) / 0xe10);
    const _0xc53ad4 = Math['floor'](_0xac3487 % 0xe10 / 0x3c);
    const _0x5d0545 = Math['floor'](_0xac3487 % 0x3c);
    const _0x5cef48 = _0x47b34a > 0x0 ? _0x47b34a + (_0x47b34a === 0x1 ? '\x20day,\x20' : '\x20days,\x20') : '';
    const _0x441f45 = _0x2a4b51 > 0x0 ? _0x2a4b51 + (_0x2a4b51 === 0x1 ? '\x20hour,\x20' : '\x20hours,\x20') : '';
    const _0x553fba = _0xc53ad4 > 0x0 ? _0xc53ad4 + (_0xc53ad4 === 0x1 ? '\x20minute,\x20' : '\x20minutes,\x20') : '';
    const _0x1cc209 = _0x5d0545 > 0x0 ? _0x5d0545 + (_0x5d0545 === 0x1 ? '\x20second' : '\x20seconds') : '';
    return _0x5cef48 + _0x441f45 + _0x553fba + _0x1cc209;
};
export const clockString = _0x5c51f3 => {
    const _0x2d836b = isNaN(_0x5c51f3) ? '--' : Math['floor'](_0x5c51f3 / 0x36ee80);
    const _0x4865e1 = isNaN(_0x5c51f3) ? '--' : Math['floor'](_0x5c51f3 / 0xea60) % 0x3c;
    const _0x55755d = isNaN(_0x5c51f3) ? '--' : Math['floor'](_0x5c51f3 / 0x3e8) % 0x3c;
    return [
        _0x2d836b,
        _0x4865e1,
        _0x55755d
    ]['map'](_0x426c3e => _0x426c3e['toString']()['padStart'](0x2, '0'))['join'](':');
};
export const sleep = _0x42ab56 => new Promise(_0x28da7c => setTimeout(_0x28da7c, _0x42ab56));
export const isUrl = _0x3181c2 => _0x3181c2['match'](new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'));
export const getTime = (_0x131845, _0x4293be) => {
    if (_0x4293be)
        return _0x0_0x2abaa9(_0x4293be)['locale']('en')['format'](_0x131845);
    return _0x0_0x2abaa9['tz']('Asia/Karachi')['locale']('en')['format'](_0x131845);
};
export const formatDate = (_0x2e4283, _0x19061b = 'en') => {
    const _0x2ce4e2 = new Date(_0x2e4283);
    return _0x2ce4e2['toLocaleDateString'](_0x19061b, {
        'weekday': 'long',
        'day': 'numeric',
        'month': 'long',
        'year': 'numeric',
        'hour': 'numeric',
        'minute': 'numeric',
        'second': 'numeric'
    });
};
export const tanggal = _0x31fe6f => {
    const _0xbba42b = [
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
    const _0x3d79c8 = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ];
    const _0x16e78a = new Date(_0x31fe6f);
    const _0x72dffb = _0x16e78a['getDate']();
    const _0x1a6946 = _0x16e78a['getMonth']();
    const _0x223f54 = _0x3d79c8[_0x16e78a['getDay']()];
    const _0x392db8 = _0x16e78a['getFullYear']();
    const _0x3084ce = _0x392db8 < 0x3e8 ? _0x392db8 + 0x76c : _0x392db8;
    return _0x223f54 + ',\x20' + _0x72dffb + '\x20-\x20' + _0xbba42b[_0x1a6946] + '\x20-\x20' + _0x3084ce;
};
export const jam = (_0x39fce9, _0xa50931 = {}) => {
    const _0x46b6a3 = _0xa50931['format'] ?? 'HH:mm';
    const _0x1450be = _0xa50931['timeZone'] ? _0x0_0x2abaa9(_0x39fce9)['tz'](_0xa50931['timeZone'])['format'](_0x46b6a3) : _0x0_0x2abaa9(_0x39fce9)['format'](_0x46b6a3);
    return _0x1450be;
};
export const formatp = sizeFormatter({
    'std': 'JEDEC',
    'decimalPlaces': 0x2,
    'keepTrailingZeroes': ![],
    'render': (_0x3ce6fa, _0x642021) => _0x3ce6fa + '\x20' + _0x642021 + 'B'
});
export const json = _0x3799d2 => JSON['stringify'](_0x3799d2, null, 0x2);
export const logic = (_0x79e173, _0x19f65d, _0x47fee1) => {
    if (_0x19f65d['length'] !== _0x47fee1['length'])
        throw new Error('Input\x20and\x20Output\x20must\x20have\x20same\x20length');
    for (let _0x3974d7 = 0x0; _0x3974d7 < _0x19f65d['length']; _0x3974d7++) {
        if (_0x0_0x1fb9a0['isDeepStrictEqual'](_0x79e173, _0x19f65d[_0x3974d7]))
            return _0x47fee1[_0x3974d7];
    }
    return null;
};
export const generateProfilePicture = async _0xb40a9e => {
    const _0x4fdbf6 = _0x0_0x5c061c(_0xb40a9e);
    const {
        width: width = 0x0,
        height: height = 0x0
    } = await _0x4fdbf6['metadata']();
    const _0xa53a49 = Math['min'](width, height);
    const _0x4257aa = await _0x4fdbf6['extract']({
        'left': 0x0,
        'top': 0x0,
        'width': _0xa53a49,
        'height': _0xa53a49
    })['resize'](0x2d0, 0x2d0)['jpeg']()['toBuffer']();
    return {
        'img': _0x4257aa,
        'preview': _0x4257aa
    };
};
export const reSize = async (_0x5d0e7d, _0xe0bd23, _0x55a0a5) => _0x0_0x5c061c(_0x5d0e7d)['resize'](_0xe0bd23, _0x55a0a5)['jpeg']()['toBuffer']();
export const bytesToSize = (_0x4d7f3e, _0x37f91f = 0x2) => {
    if (_0x4d7f3e === 0x0)
        return '0\x20Bytes';
    const _0xc67547 = 0x400;
    const _0x151e94 = _0x37f91f < 0x0 ? 0x0 : _0x37f91f;
    const _0x2f8523 = [
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
    const _0x21213 = Math['floor'](Math['log'](_0x4d7f3e) / Math['log'](_0xc67547));
    return parseFloat((_0x4d7f3e / Math['pow'](_0xc67547, _0x21213))['toFixed'](_0x151e94)) + '\x20' + _0x2f8523[_0x21213];
};
export const getSizeMedia = _0x2cf913 => {
    return new Promise((_0x11e52f, _0x22ec4e) => {
        if (typeof _0x2cf913 === 'string' && /http/['test'](_0x2cf913)) {
            _0x0_0x33b483['get'](_0x2cf913)['then'](_0x4311c0 => {
                const _0x331f7b = parseInt(_0x4311c0['headers']['content-length'], 0xa);
                const _0xa57c8 = bytesToSize(_0x331f7b, 0x3);
                if (!isNaN(_0x331f7b))
                    _0x11e52f(_0xa57c8);
                else
                    _0x22ec4e('Invalid\x20content-length');
            })['catch'](_0x22ec4e);
        } else if (Buffer['isBuffer'](_0x2cf913)) {
            const _0x1a760c = Buffer['byteLength'](_0x2cf913);
            const _0x3af388 = bytesToSize(_0x1a760c, 0x3);
            if (!isNaN(_0x1a760c))
                _0x11e52f(_0x3af388);
            else
                _0x22ec4e('Invalid\x20buffer\x20length');
        } else {
            _0x22ec4e('Invalid\x20input:\x20must\x20be\x20a\x20URL\x20string\x20or\x20Buffer');
        }
    });
};
export const parseMention = (_0x2d394c = '') => [..._0x2d394c['matchAll'](/@([0-9]{5,16}|0)/g)]['map'](_0x10661a => _0x10661a[0x1] + '@s.whatsapp.net');
export const getGroupAdmins = _0x41c02d => {
    const _0x304d30 = [];
    for (const _0x78c06e of _0x41c02d) {
        if (_0x78c06e['admin'] === 'superadmin' || _0x78c06e['admin'] === 'admin')
            _0x304d30['push'](_0x78c06e['id']);
    }
    return _0x304d30;
};
export const smsg = (_0x24c21a, _0x59a168, _0x4d6fc3) => {
    if (!_0x59a168)
        return _0x59a168;
    const _0x4045ac = proto['WebMessageInfo'];
    if (_0x59a168['key']) {
        _0x59a168['id'] = _0x59a168['key']['id'];
        _0x59a168['isBaileys'] = _0x59a168['id']['startsWith']('BAE5') && _0x59a168['id']['length'] === 0x10;
        _0x59a168['chat'] = _0x59a168['key']['remoteJid'];
        _0x59a168['fromMe'] = _0x59a168['key']['fromMe'];
        _0x59a168['isGroup'] = _0x59a168['chat']['endsWith']('@g.us');
        _0x59a168['sender'] = _0x24c21a['decodeJid'](_0x59a168['fromMe'] && _0x24c21a['user']['id'] || _0x59a168['participant'] || _0x59a168['key']['participant'] || _0x59a168['chat'] || '');
        if (_0x59a168['isGroup'])
            _0x59a168['participant'] = _0x24c21a['decodeJid'](_0x59a168['key']['participant']) || '';
    }
    if (_0x59a168['message']) {
        _0x59a168['mtype'] = getContentType(_0x59a168['message']);
        _0x59a168['msg'] = _0x59a168['mtype'] === 'viewOnceMessage' ? _0x59a168['message'][_0x59a168['mtype']]['message'][getContentType(_0x59a168['message'][_0x59a168['mtype']]['message'])] : _0x59a168['message'][_0x59a168['mtype']];
        _0x59a168['body'] = _0x59a168['message']['conversation'] || _0x59a168['msg']?.['caption'] || _0x59a168['msg']?.['text'] || _0x59a168['mtype'] === 'listResponseMessage' && _0x59a168['msg']?.['singleSelectReply']?.['selectedRowId'] || _0x59a168['mtype'] === 'buttonsResponseMessage' && _0x59a168['msg']?.['selectedButtonId'] || _0x59a168['mtype'] === 'viewOnceMessage' && _0x59a168['msg']?.['caption'] || _0x59a168['text'];
        const _0x4317a5 = _0x59a168['quoted'] = _0x59a168['msg']?.['contextInfo'] ? _0x59a168['msg']['contextInfo']['quotedMessage'] : null;
        _0x59a168['mentionedJid'] = _0x59a168['msg']?.['contextInfo'] ? _0x59a168['msg']['contextInfo']['mentionedJid'] : [];
        if (_0x59a168['quoted']) {
            let _0x170d3e = getContentType(_0x4317a5);
            _0x59a168['quoted'] = _0x59a168['quoted'][_0x170d3e];
            if (['productMessage']['includes'](_0x170d3e)) {
                _0x170d3e = getContentType(_0x59a168['quoted']);
                _0x59a168['quoted'] = _0x59a168['quoted'][_0x170d3e];
            }
            if (typeof _0x59a168['quoted'] === 'string')
                _0x59a168['quoted'] = { 'text': _0x59a168['quoted'] };
            _0x59a168['quoted']['mtype'] = _0x170d3e;
            _0x59a168['quoted']['id'] = _0x59a168['msg']['contextInfo']['stanzaId'];
            _0x59a168['quoted']['chat'] = _0x59a168['msg']['contextInfo']['remoteJid'] || _0x59a168['chat'];
            _0x59a168['quoted']['isBaileys'] = _0x59a168['quoted']['id'] ? _0x59a168['quoted']['id']['startsWith']('BAE5') && _0x59a168['quoted']['id']['length'] === 0x10 : ![];
            _0x59a168['quoted']['sender'] = _0x24c21a['decodeJid'](_0x59a168['msg']['contextInfo']['participant']);
            _0x59a168['quoted']['fromMe'] = _0x59a168['quoted']['sender'] === (_0x24c21a['user'] && _0x24c21a['user']['id']);
            _0x59a168['quoted']['text'] = _0x59a168['quoted']['text'] || _0x59a168['quoted']['caption'] || _0x59a168['quoted']['conversation'] || _0x59a168['quoted']['contentText'] || _0x59a168['quoted']['selectedDisplayText'] || _0x59a168['quoted']['title'] || '';
            _0x59a168['quoted']['mentionedJid'] = _0x59a168['msg']['contextInfo'] ? _0x59a168['msg']['contextInfo']['mentionedJid'] : [];
            _0x59a168['getQuotedObj'] = _0x59a168['getQuotedMessage'] = async () => {
                if (!_0x59a168['quoted']['id'])
                    return ![];
                const _0x34cc56 = await _0x4d6fc3['loadMessage'](_0x59a168['chat'], _0x59a168['quoted']['id'], _0x24c21a);
                return smsg(_0x24c21a, _0x34cc56, _0x4d6fc3);
            };
            const _0x2d9db1 = _0x59a168['quoted']['fakeObj'] = _0x4045ac['fromObject']({
                'key': {
                    'remoteJid': _0x59a168['quoted']['chat'],
                    'fromMe': _0x59a168['quoted']['fromMe'],
                    'id': _0x59a168['quoted']['id']
                },
                'message': _0x4317a5,
                ..._0x59a168['isGroup'] ? { 'participant': _0x59a168['quoted']['sender'] } : {}
            });
            _0x59a168['quoted']['delete'] = () => _0x24c21a['sendMessage'](_0x59a168['quoted']['chat'], { 'delete': _0x2d9db1['key'] });
            _0x59a168['quoted']['copyNForward'] = (_0x541e2c, _0x2aefbd = ![], _0x3af68f = {}) => _0x24c21a['copyNForward'](_0x541e2c, _0x2d9db1, _0x2aefbd, _0x3af68f);
            _0x59a168['quoted']['download'] = () => _0x24c21a['downloadMediaMessage'](_0x59a168['quoted']);
        }
    }
    if (_0x59a168['msg']?.['url'])
        _0x59a168['download'] = () => _0x24c21a['downloadMediaMessage'](_0x59a168['msg']);
    _0x59a168['text'] = _0x59a168['msg']?.['text'] || _0x59a168['msg']?.['caption'] || _0x59a168['message']?.['conversation'] || _0x59a168['msg']?.['contentText'] || _0x59a168['msg']?.['selectedDisplayText'] || _0x59a168['msg']?.['title'] || '';
    _0x59a168['reply'] = (_0x5794af, _0x49f4b5 = _0x59a168['chat'], _0x4cb726 = {}) => Buffer['isBuffer'](_0x5794af) ? _0x24c21a['sendMedia'](_0x49f4b5, _0x5794af, 'file', '', _0x59a168, { ..._0x4cb726 }) : _0x24c21a['sendText'](_0x49f4b5, _0x5794af, _0x59a168, { ..._0x4cb726 });
    _0x59a168['copy'] = () => smsg(_0x24c21a, _0x4045ac['fromObject'](_0x4045ac['toObject'](_0x59a168)), _0x4d6fc3);
    _0x59a168['copyNForward'] = (_0x1fddf9 = _0x59a168['chat'], _0x259528 = ![], _0x1f8800 = {}) => _0x24c21a['copyNForward'](_0x1fddf9, _0x59a168, _0x259528, _0x1f8800);
    return _0x59a168;
};