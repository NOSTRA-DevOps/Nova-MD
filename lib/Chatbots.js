import _0x0_0x3fe557 from './chatbotService.js';
import _0x0_0x3ec326 from './chatbotConfig.js';
import _0x0_0x570445 from './isOwner.js';
import _0x0_0x3209f2 from './lightweight_store.js';
import { dataFile } from './paths.js';
import _0x0_0x59e03d from 'fs';
import _0x0_0x9c4624 from 'path';
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
            const _0x191056 = await _0x0_0x3209f2['getSetting']('global', 'userGroupData');
            return _0x191056 || {
                'groups': [],
                'chatbot': {}
            };
        }
        if (!_0x0_0x59e03d['existsSync'](USER_GROUP_DATA)) {
            return {
                'groups': [],
                'chatbot': {}
            };
        }
        return JSON['parse'](_0x0_0x59e03d['readFileSync'](USER_GROUP_DATA, 'utf-8'));
    } catch (_0x381fdc) {
        console['error']('Error\x20loading\x20user\x20group\x20data:', _0x381fdc['message']);
        return {
            'groups': [],
            'chatbot': {}
        };
    }
}
export async function saveUserGroupData(_0x51f0ed) {
    try {
        if (HAS_DB) {
            await _0x0_0x3209f2['saveSetting']('global', 'userGroupData', _0x51f0ed);
        } else {
            const _0x5cb436 = _0x0_0x9c4624['dirname'](USER_GROUP_DATA);
            if (!_0x0_0x59e03d['existsSync'](_0x5cb436)) {
                _0x0_0x59e03d['mkdirSync'](_0x5cb436, { 'recursive': !![] });
            }
            _0x0_0x59e03d['writeFileSync'](USER_GROUP_DATA, JSON['stringify'](_0x51f0ed, null, 0x2));
        }
    } catch (_0x8cd430) {
        console['error']('Error\x20saving\x20user\x20group\x20data:', _0x8cd430['message']);
    }
}
async function handleViewOnce(_0x182bef, _0x241f19) {
    try {
        const _0x2b1370 = _0x241f19['message'];
        let _0x56d22c = null;
        let _0x104bc5 = '';
        let _0x2395e4 = '';
        if (_0x2b1370?.['viewOnceMessageV2']?.['message']?.['imageMessage']) {
            _0x56d22c = _0x2b1370['viewOnceMessageV2']['message']['imageMessage'];
            _0x104bc5 = 'Image';
            _0x2395e4 = _0x56d22c['caption'] || '';
        } else if (_0x2b1370?.['viewOnceMessageV2']?.['message']?.['videoMessage']) {
            _0x56d22c = _0x2b1370['viewOnceMessageV2']['message']['videoMessage'];
            _0x104bc5 = 'Video';
            _0x2395e4 = _0x56d22c['caption'] || '';
        } else if (_0x2b1370?.['viewOnceMessageV2']?.['message']?.['audioMessage']) {
            _0x56d22c = _0x2b1370['viewOnceMessageV2']['message']['audioMessage'];
            _0x104bc5 = 'Audio';
            _0x2395e4 = '';
        } else if (_0x2b1370?.['viewOnceMessage']?.['message']?.['imageMessage']) {
            _0x56d22c = _0x2b1370['viewOnceMessage']['message']['imageMessage'];
            _0x104bc5 = 'Image';
            _0x2395e4 = _0x56d22c['caption'] || '';
        } else if (_0x2b1370?.['viewOnceMessage']?.['message']?.['videoMessage']) {
            _0x56d22c = _0x2b1370['viewOnceMessage']['message']['videoMessage'];
            _0x104bc5 = 'Video';
            _0x2395e4 = _0x56d22c['caption'] || '';
        }
        if (!_0x56d22c)
            return null;
        const _0x4b32b1 = await _0x182bef['downloadMediaMessage'](_0x241f19);
        if (!_0x4b32b1)
            return null;
        return {
            'buffer': _0x4b32b1,
            'type': _0x104bc5,
            'caption': _0x2395e4,
            'mimeType': _0x56d22c['mimetype'],
            'fileLength': _0x56d22c['fileLength']
        };
    } catch (_0x21a21e) {
        console['error']('Error\x20handling\x20view\x20once:', _0x21a21e);
        return null;
    }
}
async function getAIResponse(_0x4f6bde, _0x1384fe, _0x47241a) {
    try {
        const _0x1baab1 = await _0x0_0x3fe557['getResponse'](_0x4f6bde, _0x47241a, _0x1384fe, {
            'senderId': _0x1384fe,
            'chatId': _0x47241a,
            'timestamp': Date['now']()
        });
        return _0x1baab1 || 'Je\x20suis\x20là\x20!\x20Comment\x20puis-je\x20vous\x20aider\x20?\x20😊';
    } catch (_0x1fa1c2) {
        console['error']('AI\x20response\x20error:', _0x1fa1c2);
        return 'Désolé,\x20je\x20rencontre\x20un\x20problème\x20technique.\x20Veuillez\x20réessayer.\x20🥲';
    }
}
export async function handleChatbotResponse(_0x25f272, _0x19aa2e, _0x1bbd40, _0x5e15ef, _0x53662b) {
    if (!_0x0_0x3ec326['get']('enabled'))
        return;
    try {
        const _0x1e8c5a = _0x0_0x3ec326['get']('botName') || 'Nova';
        const _0x1b65a6 = _0x25f272['user']['id'];
        const _0x16e15a = _0x1b65a6?.['split'](':')[0x0] || '';
        const _0x44b34b = await _0x0_0x570445(_0x53662b, _0x25f272, _0x19aa2e);
        const _0x5b49a9 = _0x1bbd40['key']['fromMe'];
        const _0x4093b6 = _0x5b49a9 || _0x44b34b;
        const _0x4c6880 = await _0x0_0x3209f2['getBotMode']();
        const _0x71cdb8 = _0x0_0x3ec326['get']('mode') || 'private';
        if (_0x71cdb8 === 'private' && !_0x4093b6) {
            return;
        }
        const _0x47790e = ((() => {
            if (_0x4093b6)
                return !![];
            switch (_0x4c6880) {
            case 'public':
                return !![];
            case 'private':
            case 'self':
                return ![];
            case 'groups':
                return _0x19aa2e['endsWith']('@g.us');
            case 'inbox':
                return !_0x19aa2e['endsWith']('@g.us');
            default:
                return !![];
            }
        })());
        if (!_0x47790e)
            return;
        const _0xb274 = _0x1bbd40['message']?.['extendedTextMessage']?.['contextInfo']?.['participant']?.['includes'](_0x16e15a);
        const _0x2a7000 = _0x5e15ef['toLowerCase']()['trim']();
        const _0x35da67 = _0x1e8c5a['toLowerCase']();
        const _0x130849 = _0x2a7000['includes'](_0x35da67) || _0x2a7000['includes']('@' + _0x35da67) || _0x2a7000['includes']('@' + _0x16e15a);
        const _0xdc5901 = new RegExp('^' + _0x35da67 + '\x5cs+|^@' + _0x35da67 + '\x5cs+', 'i')['test'](_0x5e15ef);
        const _0x42acaf = _0xdc5901 || _0x130849 || _0xb274 || _0x5e15ef['includes']('@' + _0x16e15a);
        if (!_0x42acaf) {
            return;
        }
        let _0xf1af2 = _0x5e15ef;
        const _0x11c3b4 = [
            new RegExp('^' + _0x1e8c5a + '\x5cs+', 'i'),
            new RegExp('^@' + _0x1e8c5a + '\x5cs+', 'i'),
            new RegExp('^' + _0x1e8c5a + '[:]\x5cs+', 'i'),
            new RegExp('^@' + _0x1e8c5a + '[:]\x5cs+', 'i'),
            new RegExp('\x5cs+' + _0x1e8c5a + '\x5cs+', 'i'),
            new RegExp('\x5cs+@' + _0x1e8c5a + '\x5cs+', 'i'),
            new RegExp('\x5cs+' + _0x1e8c5a + '$', 'i'),
            new RegExp('\x5cs+@' + _0x1e8c5a + '$', 'i')
        ];
        for (const _0x5d469b of _0x11c3b4) {
            _0xf1af2 = _0xf1af2['replace'](_0x5d469b, '\x20')['trim']();
        }
        if (_0xb274 && !_0x42acaf) {
            _0xf1af2 = _0x5e15ef;
        }
        if (!_0xf1af2 || _0xf1af2['length'] < 0x1) {
            return;
        }
        if (_0xf1af2['startsWith']('.') || _0xf1af2['startsWith']('$') || _0xf1af2['startsWith']('#')) {
            return;
        }
        const _0xe71c55 = await handleViewOnce(_0x25f272, _0x1bbd40);
        if (_0xe71c55) {
            await _0x25f272['sendMessage'](_0x19aa2e, { 'text': '✅\x20View\x20Once\x20Media\x20Recovered\x0a\x0a📊\x20Type:\x20' + _0xe71c55['type'] + '\x0a📏\x20Size:\x20' + (_0xe71c55['fileLength'] / 0x400)['toFixed'](0x2) + '\x20KB' }, { 'quoted': _0x1bbd40 });
            if (_0xe71c55['type'] === 'Image') {
                await _0x25f272['sendMessage'](_0x19aa2e, {
                    'image': _0xe71c55['buffer'],
                    'caption': '📸\x20' + (_0xe71c55['caption'] || 'View\x20once\x20image')
                });
            } else if (_0xe71c55['type'] === 'Video') {
                await _0x25f272['sendMessage'](_0x19aa2e, {
                    'video': _0xe71c55['buffer'],
                    'caption': '📹\x20' + (_0xe71c55['caption'] || 'View\x20once\x20video')
                });
            } else if (_0xe71c55['type'] === 'Audio') {
                await _0x25f272['sendMessage'](_0x19aa2e, {
                    'audio': _0xe71c55['buffer'],
                    'mimetype': 'audio/mpeg'
                });
            }
            return;
        }
        await _0x25f272['sendPresenceUpdate']('composing', _0x19aa2e);
        await new Promise(_0x11a9e6 => setTimeout(_0x11a9e6, 0x3e8 + Math['random']() * 0x5dc));
        const _0x1c1e93 = await getAIResponse(_0xf1af2, _0x53662b, _0x19aa2e);
        if (_0x1c1e93) {
            const _0x1e1ed0 = _0x0_0x3ec326['get']('responsePrefix') || '🤖\x20';
            await _0x25f272['sendMessage'](_0x19aa2e, { 'text': '' + _0x1e1ed0 + _0x1c1e93 }, { 'quoted': _0x1bbd40 });
        }
    } catch (_0xebf0eb) {
        console['error']('Error\x20in\x20chatbot\x20response:', _0xebf0eb['message']);
    }
}