import _0x0_0x65afe3 from './chatbotService.js';
import _0x0_0x1e66ff from './chatbotConfig.js';
import _0x0_0x1c6474 from './isOwner.js';
import _0x0_0x36a279 from './lightweight_store.js';
import { dataFile } from './paths.js';
import _0x0_0x4e6f40 from 'fs';
import _0x0_0x186127 from 'path';
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
            const _0x1baf21 = await _0x0_0x36a279['getSetting']('global', 'userGroupData');
            return _0x1baf21 || {
                'groups': [],
                'chatbot': {}
            };
        }
        if (!_0x0_0x4e6f40['existsSync'](USER_GROUP_DATA)) {
            return {
                'groups': [],
                'chatbot': {}
            };
        }
        return JSON['parse'](_0x0_0x4e6f40['readFileSync'](USER_GROUP_DATA, 'utf-8'));
    } catch (_0x3bc995) {
        console['error']('Error\x20loading\x20user\x20group\x20data:', _0x3bc995['message']);
        return {
            'groups': [],
            'chatbot': {}
        };
    }
}
export async function saveUserGroupData(_0x46e7a4) {
    try {
        if (HAS_DB) {
            await _0x0_0x36a279['saveSetting']('global', 'userGroupData', _0x46e7a4);
        } else {
            const _0x3d04d4 = _0x0_0x186127['dirname'](USER_GROUP_DATA);
            if (!_0x0_0x4e6f40['existsSync'](_0x3d04d4)) {
                _0x0_0x4e6f40['mkdirSync'](_0x3d04d4, { 'recursive': !![] });
            }
            _0x0_0x4e6f40['writeFileSync'](USER_GROUP_DATA, JSON['stringify'](_0x46e7a4, null, 0x2));
        }
    } catch (_0x5ef994) {
        console['error']('Error\x20saving\x20user\x20group\x20data:', _0x5ef994['message']);
    }
}
async function handleViewOnce(_0x5a772c, _0x19e870) {
    try {
        const _0x37314a = _0x19e870['message'];
        let _0x4953aa = null;
        let _0x2dfde4 = '';
        let _0x23834a = '';
        if (_0x37314a?.['viewOnceMessageV2']?.['message']?.['imageMessage']) {
            _0x4953aa = _0x37314a['viewOnceMessageV2']['message']['imageMessage'];
            _0x2dfde4 = 'Image';
            _0x23834a = _0x4953aa['caption'] || '';
        } else if (_0x37314a?.['viewOnceMessageV2']?.['message']?.['videoMessage']) {
            _0x4953aa = _0x37314a['viewOnceMessageV2']['message']['videoMessage'];
            _0x2dfde4 = 'Video';
            _0x23834a = _0x4953aa['caption'] || '';
        } else if (_0x37314a?.['viewOnceMessageV2']?.['message']?.['audioMessage']) {
            _0x4953aa = _0x37314a['viewOnceMessageV2']['message']['audioMessage'];
            _0x2dfde4 = 'Audio';
            _0x23834a = '';
        } else if (_0x37314a?.['viewOnceMessage']?.['message']?.['imageMessage']) {
            _0x4953aa = _0x37314a['viewOnceMessage']['message']['imageMessage'];
            _0x2dfde4 = 'Image';
            _0x23834a = _0x4953aa['caption'] || '';
        } else if (_0x37314a?.['viewOnceMessage']?.['message']?.['videoMessage']) {
            _0x4953aa = _0x37314a['viewOnceMessage']['message']['videoMessage'];
            _0x2dfde4 = 'Video';
            _0x23834a = _0x4953aa['caption'] || '';
        }
        if (!_0x4953aa)
            return null;
        const _0x1ea293 = await _0x5a772c['downloadMediaMessage'](_0x19e870);
        if (!_0x1ea293)
            return null;
        return {
            'buffer': _0x1ea293,
            'type': _0x2dfde4,
            'caption': _0x23834a,
            'mimeType': _0x4953aa['mimetype'],
            'fileLength': _0x4953aa['fileLength']
        };
    } catch (_0xeb088f) {
        console['error']('Error\x20handling\x20view\x20once:', _0xeb088f);
        return null;
    }
}
async function getAIResponse(_0x486085, _0x1dc6b8, _0x127d30) {
    try {
        const _0x15537e = await _0x0_0x65afe3['getResponse'](_0x486085, _0x127d30, _0x1dc6b8, {
            'senderId': _0x1dc6b8,
            'chatId': _0x127d30,
            'timestamp': Date['now']()
        });
        return _0x15537e || 'Je\x20suis\x20là\x20!\x20Comment\x20puis-je\x20vous\x20aider\x20?\x20😊';
    } catch (_0x5940ff) {
        console['error']('AI\x20response\x20error:', _0x5940ff);
        return 'Désolé,\x20je\x20rencontre\x20un\x20problème\x20technique.\x20Veuillez\x20réessayer.\x20🥲';
    }
}
export async function handleChatbotResponse(_0x316c3f, _0x1bb6be, _0x2af9dc, _0xb2c535, _0x32daf3) {
    if (!_0x0_0x1e66ff['get']('enabled'))
        return;
    const _0x3e9ad4 = await loadUserGroupData();
    if (!_0x3e9ad4['chatbot'][_0x1bb6be])
        return;
    try {
        const _0x1fa17b = 'Nova';
        const _0x366a8b = _0x316c3f['user']['id'];
        const _0x40bd14 = _0x366a8b?.['split'](':')[0x0] || '';
        const _0x1ed20a = await _0x0_0x1c6474(_0x32daf3, _0x316c3f, _0x1bb6be);
        const _0x1df9b4 = _0x2af9dc['key']['fromMe'];
        const _0x309c8a = _0x1df9b4 || _0x1ed20a;
        const _0x585c9f = await _0x0_0x36a279['getBotMode']();
        const _0x6bb24f = _0x0_0x1e66ff['get']('mode') || 'private';
        if (_0x6bb24f === 'private' && !_0x309c8a) {
            return;
        }
        const _0xda527a = ((() => {
            if (_0x309c8a)
                return !![];
            switch (_0x585c9f) {
            case 'public':
                return !![];
            case 'private':
            case 'self':
                return ![];
            case 'groups':
                return _0x1bb6be['endsWith']('@g.us');
            case 'inbox':
                return !_0x1bb6be['endsWith']('@g.us');
            default:
                return !![];
            }
        })());
        if (!_0xda527a)
            return;
        const _0x5d6e85 = _0x2af9dc['message']?.['extendedTextMessage']?.['contextInfo']?.['participant']?.['includes'](_0x40bd14);
        const _0x4fd186 = _0xb2c535['toLowerCase']()['trim']();
        const _0x237947 = _0x1fa17b['toLowerCase']();
        const _0x196ba7 = _0x4fd186['includes'](_0x237947) || _0x4fd186['includes']('@' + _0x237947) || _0x4fd186['includes']('@' + _0x40bd14);
        const _0x59ff89 = new RegExp('^' + _0x237947 + '\x5cs+|^@' + _0x237947 + '\x5cs+', 'i')['test'](_0xb2c535);
        const _0x214076 = _0x59ff89 || _0x196ba7 || _0x5d6e85 || _0xb2c535['includes']('@' + _0x40bd14);
        if (!_0x214076) {
            return;
        }
        let _0x440ce0 = _0xb2c535;
        const _0x204a5d = [
            new RegExp('^' + _0x1fa17b + '\x5cs+', 'i'),
            new RegExp('^@' + _0x1fa17b + '\x5cs+', 'i'),
            new RegExp('^' + _0x1fa17b + '[:]\x5cs+', 'i'),
            new RegExp('^@' + _0x1fa17b + '[:]\x5cs+', 'i'),
            new RegExp('\x5cs+' + _0x1fa17b + '\x5cs+', 'i'),
            new RegExp('\x5cs+@' + _0x1fa17b + '\x5cs+', 'i'),
            new RegExp('\x5cs+' + _0x1fa17b + '$', 'i'),
            new RegExp('\x5cs+@' + _0x1fa17b + '$', 'i')
        ];
        for (const _0xda9edb of _0x204a5d) {
            _0x440ce0 = _0x440ce0['replace'](_0xda9edb, '\x20')['trim']();
        }
        if (_0x5d6e85 && !_0x214076) {
            _0x440ce0 = _0xb2c535;
        }
        if (!_0x440ce0 || _0x440ce0['length'] < 0x1) {
            return;
        }
        if (_0x440ce0['startsWith']('.') || _0x440ce0['startsWith']('$') || _0x440ce0['startsWith']('#')) {
            return;
        }
        const _0x3222be = await handleViewOnce(_0x316c3f, _0x2af9dc);
        if (_0x3222be) {
            await _0x316c3f['sendMessage'](_0x1bb6be, { 'text': '✅\x20View\x20Once\x20Media\x20Recovered\x0a\x0a📊\x20Type:\x20' + _0x3222be['type'] + '\x0a📏\x20Size:\x20' + (_0x3222be['fileLength'] / 0x400)['toFixed'](0x2) + '\x20KB' }, { 'quoted': _0x2af9dc });
            if (_0x3222be['type'] === 'Image') {
                await _0x316c3f['sendMessage'](_0x1bb6be, {
                    'image': _0x3222be['buffer'],
                    'caption': '📸\x20' + (_0x3222be['caption'] || 'View\x20once\x20image')
                });
            } else if (_0x3222be['type'] === 'Video') {
                await _0x316c3f['sendMessage'](_0x1bb6be, {
                    'video': _0x3222be['buffer'],
                    'caption': '📹\x20' + (_0x3222be['caption'] || 'View\x20once\x20video')
                });
            } else if (_0x3222be['type'] === 'Audio') {
                await _0x316c3f['sendMessage'](_0x1bb6be, {
                    'audio': _0x3222be['buffer'],
                    'mimetype': 'audio/mpeg'
                });
            }
            return;
        }
        await _0x316c3f['sendPresenceUpdate']('composing', _0x1bb6be);
        await new Promise(_0x3c440b => setTimeout(_0x3c440b, 0x3e8 + Math['random']() * 0x5dc));
        const _0x376db2 = await getAIResponse(_0x440ce0, _0x32daf3, _0x1bb6be);
        if (_0x376db2) {
            const _0x323a3c = _0x0_0x1e66ff['get']('responsePrefix') || '🤖\x20';
            await _0x316c3f['sendMessage'](_0x1bb6be, { 'text': '' + _0x323a3c + _0x376db2 }, { 'quoted': _0x2af9dc });
        }
    } catch (_0x55c0f2) {
        console['error']('Error\x20in\x20chatbot\x20response:', _0x55c0f2['message']);
    }
}