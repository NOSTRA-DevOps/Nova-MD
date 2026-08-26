import _0x0_0x55f2ab from './chatbotService.js';
import _0x0_0x1fdc7c from './chatbotConfig.js';
import _0x0_0x1974b8 from './isOwner.js';
import _0x0_0x8313ad from './lightweight_store.js';
import { dataFile } from './paths.js';
import _0x0_0x45c518 from 'fs';
import _0x0_0x1d9463 from 'path';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const USER_GROUP_DATA = dataFile('userGroupData.json');
const _chatMemory = {
    'messages': new Map(),
    'userInfo': new Map()
};
export async function loadUserGroupData() {
    try {
        if (HAS_DB) {
            const _0x39f9b = await _0x0_0x8313ad['getSetting']('global', 'userGroupData');
            return _0x39f9b || {
                'groups': [],
                'chatbot': {}
            };
        }
        if (!_0x0_0x45c518['existsSync'](USER_GROUP_DATA)) {
            return {
                'groups': [],
                'chatbot': {}
            };
        }
        return JSON['parse'](_0x0_0x45c518['readFileSync'](USER_GROUP_DATA, 'utf-8'));
    } catch (_0x16a30c) {
        console['error']('Error\x20loading\x20user\x20group\x20data:', _0x16a30c['message']);
        return {
            'groups': [],
            'chatbot': {}
        };
    }
}
export async function saveUserGroupData(_0xa380f2) {
    try {
        if (HAS_DB) {
            await _0x0_0x8313ad['saveSetting']('global', 'userGroupData', _0xa380f2);
        } else {
            const _0xb72da7 = _0x0_0x1d9463['dirname'](USER_GROUP_DATA);
            if (!_0x0_0x45c518['existsSync'](_0xb72da7)) {
                _0x0_0x45c518['mkdirSync'](_0xb72da7, { 'recursive': !![] });
            }
            _0x0_0x45c518['writeFileSync'](USER_GROUP_DATA, JSON['stringify'](_0xa380f2, null, 0x2));
        }
    } catch (_0x2053ec) {
        console['error']('Error\x20saving\x20user\x20group\x20data:', _0x2053ec['message']);
    }
}
async function handleViewOnce(_0x44ddfd, _0x53d8c7) {
    try {
        const _0x1f340c = _0x53d8c7['message'];
        let _0x3c8ad7 = null;
        let _0x5afa2a = '';
        let _0x1759a2 = '';
        if (_0x1f340c?.['viewOnceMessageV2']?.['message']?.['imageMessage']) {
            _0x3c8ad7 = _0x1f340c['viewOnceMessageV2']['message']['imageMessage'];
            _0x5afa2a = 'Image';
            _0x1759a2 = _0x3c8ad7['caption'] || '';
        } else if (_0x1f340c?.['viewOnceMessageV2']?.['message']?.['videoMessage']) {
            _0x3c8ad7 = _0x1f340c['viewOnceMessageV2']['message']['videoMessage'];
            _0x5afa2a = 'Video';
            _0x1759a2 = _0x3c8ad7['caption'] || '';
        } else if (_0x1f340c?.['viewOnceMessageV2']?.['message']?.['audioMessage']) {
            _0x3c8ad7 = _0x1f340c['viewOnceMessageV2']['message']['audioMessage'];
            _0x5afa2a = 'Audio';
            _0x1759a2 = '';
        } else if (_0x1f340c?.['viewOnceMessage']?.['message']?.['imageMessage']) {
            _0x3c8ad7 = _0x1f340c['viewOnceMessage']['message']['imageMessage'];
            _0x5afa2a = 'Image';
            _0x1759a2 = _0x3c8ad7['caption'] || '';
        } else if (_0x1f340c?.['viewOnceMessage']?.['message']?.['videoMessage']) {
            _0x3c8ad7 = _0x1f340c['viewOnceMessage']['message']['videoMessage'];
            _0x5afa2a = 'Video';
            _0x1759a2 = _0x3c8ad7['caption'] || '';
        }
        if (!_0x3c8ad7)
            return null;
        const _0x528931 = await _0x44ddfd['downloadMediaMessage'](_0x53d8c7);
        if (!_0x528931)
            return null;
        return {
            'buffer': _0x528931,
            'type': _0x5afa2a,
            'caption': _0x1759a2,
            'mimeType': _0x3c8ad7['mimetype'],
            'fileLength': _0x3c8ad7['fileLength']
        };
    } catch (_0x3ed5aa) {
        console['error']('Error\x20handling\x20view\x20once:', _0x3ed5aa);
        return null;
    }
}
async function getAIResponse(_0x3669bf, _0x5dc04d, _0x378f57) {
    try {
        const _0x1752ab = await _0x0_0x55f2ab['getResponse'](_0x3669bf, _0x378f57, _0x5dc04d, {
            'senderId': _0x5dc04d,
            'chatId': _0x378f57,
            'timestamp': Date['now']()
        });
        return _0x1752ab || 'Je\x20suis\x20là\x20!\x20Comment\x20puis-je\x20vous\x20aider\x20?\x20😊';
    } catch (_0x53c236) {
        console['error']('AI\x20response\x20error:', _0x53c236);
        return 'Désolé,\x20je\x20rencontre\x20un\x20problème\x20technique.\x20Veuillez\x20réessayer.\x20🥲';
    }
}
export async function handleChatbotResponse(_0x30dae6, _0x5437be, _0x2ad6ec, _0x46d1e0, _0x40520a) {
    if (!_0x0_0x1fdc7c['get']('enabled'))
        return;
    try {
        const _0x4d3f92 = _0x0_0x1fdc7c['get']('botName') || 'Nova';
        const _0x4ec565 = _0x30dae6['user']['id'];
        const _0x4b25a6 = _0x4ec565?.['split'](':')[0x0] || '';
        const _0x353f33 = await _0x0_0x1974b8(_0x40520a, _0x30dae6, _0x5437be);
        const _0x3b28cb = _0x2ad6ec['key']['fromMe'];
        const _0x12e7c9 = _0x3b28cb || _0x353f33;
        const _0xd50fdd = await _0x0_0x8313ad['getBotMode']();
        const _0x54c28a = _0x0_0x1fdc7c['get']('mode') || 'private';
        if (_0x54c28a === 'private' && !_0x12e7c9) {
            return;
        }
        const _0x2692fe = ((() => {
            if (_0x12e7c9)
                return !![];
            switch (_0xd50fdd) {
            case 'public':
                return !![];
            case 'private':
            case 'self':
                return ![];
            case 'groups':
                return _0x5437be['endsWith']('@g.us');
            case 'inbox':
                return !_0x5437be['endsWith']('@g.us');
            default:
                return !![];
            }
        })());
        if (!_0x2692fe)
            return;
        const _0x2a69b4 = _0x2ad6ec['message']?.['extendedTextMessage']?.['contextInfo']?.['participant']?.['includes'](_0x4b25a6);
        const _0x4514a1 = _0x46d1e0['toLowerCase']()['trim']();
        const _0x5a0976 = _0x4d3f92['toLowerCase']();
        const _0x1f3eba = _0x4514a1['includes'](_0x5a0976) || _0x4514a1['includes']('@' + _0x5a0976) || _0x4514a1['includes']('@' + _0x4b25a6);
        const _0x5b5c1f = new RegExp('^' + _0x5a0976 + '\x5cs+|^@' + _0x5a0976 + '\x5cs+', 'i')['test'](_0x46d1e0);
        const _0x29acae = _0x5b5c1f || _0x1f3eba || _0x2a69b4 || _0x46d1e0['includes']('@' + _0x4b25a6);
        if (!_0x29acae) {
            return;
        }
        let _0x445e17 = _0x46d1e0;
        const _0x2871a7 = [
            new RegExp('^' + _0x4d3f92 + '\x5cs+', 'i'),
            new RegExp('^@' + _0x4d3f92 + '\x5cs+', 'i'),
            new RegExp('^' + _0x4d3f92 + '[:]\x5cs+', 'i'),
            new RegExp('^@' + _0x4d3f92 + '[:]\x5cs+', 'i'),
            new RegExp('\x5cs+' + _0x4d3f92 + '\x5cs+', 'i'),
            new RegExp('\x5cs+@' + _0x4d3f92 + '\x5cs+', 'i'),
            new RegExp('\x5cs+' + _0x4d3f92 + '$', 'i'),
            new RegExp('\x5cs+@' + _0x4d3f92 + '$', 'i')
        ];
        for (const _0x177854 of _0x2871a7) {
            _0x445e17 = _0x445e17['replace'](_0x177854, '\x20')['trim']();
        }
        if (_0x2a69b4 && !_0x29acae) {
            _0x445e17 = _0x46d1e0;
        }
        if (!_0x445e17 || _0x445e17['length'] < 0x1) {
            return;
        }
        if (_0x445e17['startsWith']('.') || _0x445e17['startsWith']('$') || _0x445e17['startsWith']('#')) {
            return;
        }
        const _0x3ce2cf = await handleViewOnce(_0x30dae6, _0x2ad6ec);
        if (_0x3ce2cf) {
            await _0x30dae6['sendMessage'](_0x5437be, { 'text': '✅\x20View\x20Once\x20Media\x20Recovered\x0a\x0a📊\x20Type:\x20' + _0x3ce2cf['type'] + '\x0a📏\x20Size:\x20' + (_0x3ce2cf['fileLength'] / 0x400)['toFixed'](0x2) + '\x20KB' }, { 'quoted': _0x2ad6ec });
            if (_0x3ce2cf['type'] === 'Image') {
                await _0x30dae6['sendMessage'](_0x5437be, {
                    'image': _0x3ce2cf['buffer'],
                    'caption': '📸\x20' + (_0x3ce2cf['caption'] || 'View\x20once\x20image')
                });
            } else if (_0x3ce2cf['type'] === 'Video') {
                await _0x30dae6['sendMessage'](_0x5437be, {
                    'video': _0x3ce2cf['buffer'],
                    'caption': '📹\x20' + (_0x3ce2cf['caption'] || 'View\x20once\x20video')
                });
            } else if (_0x3ce2cf['type'] === 'Audio') {
                await _0x30dae6['sendMessage'](_0x5437be, {
                    'audio': _0x3ce2cf['buffer'],
                    'mimetype': 'audio/mpeg'
                });
            }
            return;
        }
        await _0x30dae6['sendPresenceUpdate']('composing', _0x5437be);
        await new Promise(_0x58fcc3 => setTimeout(_0x58fcc3, 0x3e8 + Math['random']() * 0x5dc));
        const _0xa0ee61 = await getAIResponse(_0x445e17, _0x40520a, _0x5437be);
        if (_0xa0ee61) {
            const _0x4612f3 = _0x0_0x1fdc7c['get']('responsePrefix') || '🤖\x20';
            await _0x30dae6['sendMessage'](_0x5437be, { 'text': '' + _0x4612f3 + _0xa0ee61 }, { 'quoted': _0x2ad6ec });
        }
    } catch (_0x13d1ba) {
        console['error']('Error\x20in\x20chatbot\x20response:', _0x13d1ba['message']);
    }
}