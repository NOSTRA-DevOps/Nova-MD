import _0x0_0x4d39e6 from './chatbotService.js';
import _0x0_0x5a4cd0 from './chatbotConfig.js';
import _0x0_0x44c2e3 from './isOwner.js';
import _0x0_0x4c6340 from './lightweight_store.js';
import { dataFile } from './paths.js';
import _0x0_0x38a053 from 'fs';
import _0x0_0x28c02a from 'path';
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
            const _0x51605b = await _0x0_0x4c6340['getSetting']('global', 'userGroupData');
            return _0x51605b || {
                'groups': [],
                'chatbot': {}
            };
        }
        if (!_0x0_0x38a053['existsSync'](USER_GROUP_DATA)) {
            return {
                'groups': [],
                'chatbot': {}
            };
        }
        return JSON['parse'](_0x0_0x38a053['readFileSync'](USER_GROUP_DATA, 'utf-8'));
    } catch (_0x557b84) {
        console['error']('Error\x20loading\x20user\x20group\x20data:', _0x557b84['message']);
        return {
            'groups': [],
            'chatbot': {}
        };
    }
}
export async function saveUserGroupData(_0x1dfaa0) {
    try {
        if (HAS_DB) {
            await _0x0_0x4c6340['saveSetting']('global', 'userGroupData', _0x1dfaa0);
        } else {
            const _0x8a4fea = _0x0_0x28c02a['dirname'](USER_GROUP_DATA);
            if (!_0x0_0x38a053['existsSync'](_0x8a4fea)) {
                _0x0_0x38a053['mkdirSync'](_0x8a4fea, { 'recursive': !![] });
            }
            _0x0_0x38a053['writeFileSync'](USER_GROUP_DATA, JSON['stringify'](_0x1dfaa0, null, 0x2));
        }
    } catch (_0x559741) {
        console['error']('Error\x20saving\x20user\x20group\x20data:', _0x559741['message']);
    }
}
async function handleViewOnce(_0x5f3ed5, _0x365a16) {
    try {
        const _0x43e408 = _0x365a16['message'];
        let _0xfe8fdf = null;
        let _0xef81e9 = '';
        let _0x374b0a = '';
        if (_0x43e408?.['viewOnceMessageV2']?.['message']?.['imageMessage']) {
            _0xfe8fdf = _0x43e408['viewOnceMessageV2']['message']['imageMessage'];
            _0xef81e9 = 'Image';
            _0x374b0a = _0xfe8fdf['caption'] || '';
        } else if (_0x43e408?.['viewOnceMessageV2']?.['message']?.['videoMessage']) {
            _0xfe8fdf = _0x43e408['viewOnceMessageV2']['message']['videoMessage'];
            _0xef81e9 = 'Video';
            _0x374b0a = _0xfe8fdf['caption'] || '';
        } else if (_0x43e408?.['viewOnceMessageV2']?.['message']?.['audioMessage']) {
            _0xfe8fdf = _0x43e408['viewOnceMessageV2']['message']['audioMessage'];
            _0xef81e9 = 'Audio';
            _0x374b0a = '';
        } else if (_0x43e408?.['viewOnceMessage']?.['message']?.['imageMessage']) {
            _0xfe8fdf = _0x43e408['viewOnceMessage']['message']['imageMessage'];
            _0xef81e9 = 'Image';
            _0x374b0a = _0xfe8fdf['caption'] || '';
        } else if (_0x43e408?.['viewOnceMessage']?.['message']?.['videoMessage']) {
            _0xfe8fdf = _0x43e408['viewOnceMessage']['message']['videoMessage'];
            _0xef81e9 = 'Video';
            _0x374b0a = _0xfe8fdf['caption'] || '';
        }
        if (!_0xfe8fdf)
            return null;
        const _0xba3048 = await _0x5f3ed5['downloadMediaMessage'](_0x365a16);
        if (!_0xba3048)
            return null;
        return {
            'buffer': _0xba3048,
            'type': _0xef81e9,
            'caption': _0x374b0a,
            'mimeType': _0xfe8fdf['mimetype'],
            'fileLength': _0xfe8fdf['fileLength']
        };
    } catch (_0x9a821e) {
        console['error']('Error\x20handling\x20view\x20once:', _0x9a821e);
        return null;
    }
}
async function getAIResponse(_0x4cfcf1, _0x450c52, _0x3ffaca) {
    try {
        const _0x18e6aa = await _0x0_0x4d39e6['getResponse'](_0x4cfcf1, _0x3ffaca, _0x450c52, {
            'senderId': _0x450c52,
            'chatId': _0x3ffaca,
            'timestamp': Date['now']()
        });
        return _0x18e6aa || 'Je\x20suis\x20là\x20!\x20Comment\x20puis-je\x20vous\x20aider\x20?\x20😊';
    } catch (_0x19c7ab) {
        console['error']('AI\x20response\x20error:', _0x19c7ab);
        return 'Désolé,\x20je\x20rencontre\x20un\x20problème\x20technique.\x20Veuillez\x20réessayer.\x20🥲';
    }
}
export async function handleChatbotResponse(_0x48d509, _0x4b825e, _0x2ef610, _0x15e8c6, _0x33170c) {
    if (!_0x0_0x5a4cd0['get']('enabled'))
        return;
    try {
        const _0x513c5a = _0x0_0x5a4cd0['get']('botName') || 'Nova';
        const _0x399a5d = _0x48d509['user']['id'];
        const _0x53fa8a = _0x399a5d?.['split'](':')[0x0] || '';
        const _0x45e97d = await _0x0_0x44c2e3(_0x33170c, _0x48d509, _0x4b825e);
        const _0x2e8fba = _0x2ef610['key']['fromMe'];
        const _0x405288 = _0x2e8fba || _0x45e97d;
        const _0x1a5898 = await _0x0_0x4c6340['getBotMode']();
        const _0x553729 = _0x0_0x5a4cd0['get']('mode') || 'private';
        if (_0x553729 === 'private' && !_0x405288) {
            return;
        }
        const _0x4eed6d = ((() => {
            if (_0x405288)
                return !![];
            switch (_0x1a5898) {
            case 'public':
                return !![];
            case 'private':
            case 'self':
                return ![];
            case 'groups':
                return _0x4b825e['endsWith']('@g.us');
            case 'inbox':
                return !_0x4b825e['endsWith']('@g.us');
            default:
                return !![];
            }
        })());
        if (!_0x4eed6d)
            return;
        const _0x4e2218 = _0x2ef610['message']?.['extendedTextMessage']?.['contextInfo']?.['participant']?.['includes'](_0x53fa8a);
        const _0xd734f3 = _0x15e8c6['toLowerCase']()['trim']();
        const _0xa59db3 = _0x513c5a['toLowerCase']();
        const _0x1ebed7 = _0xd734f3['includes'](_0xa59db3) || _0xd734f3['includes']('@' + _0xa59db3) || _0xd734f3['includes']('@' + _0x53fa8a);
        const _0x146761 = new RegExp('^' + _0xa59db3 + '\x5cs+|^@' + _0xa59db3 + '\x5cs+', 'i')['test'](_0x15e8c6);
        const _0x183919 = _0x146761 || _0x1ebed7 || _0x4e2218 || _0x15e8c6['includes']('@' + _0x53fa8a);
        if (!_0x183919) {
            return;
        }
        let _0x332cd9 = _0x15e8c6;
        const _0x162035 = [
            new RegExp('^' + _0x513c5a + '\x5cs+', 'i'),
            new RegExp('^@' + _0x513c5a + '\x5cs+', 'i'),
            new RegExp('^' + _0x513c5a + '[:]\x5cs+', 'i'),
            new RegExp('^@' + _0x513c5a + '[:]\x5cs+', 'i'),
            new RegExp('\x5cs+' + _0x513c5a + '\x5cs+', 'i'),
            new RegExp('\x5cs+@' + _0x513c5a + '\x5cs+', 'i'),
            new RegExp('\x5cs+' + _0x513c5a + '$', 'i'),
            new RegExp('\x5cs+@' + _0x513c5a + '$', 'i')
        ];
        for (const _0x1d3b9c of _0x162035) {
            _0x332cd9 = _0x332cd9['replace'](_0x1d3b9c, '\x20')['trim']();
        }
        if (_0x4e2218 && !_0x183919) {
            _0x332cd9 = _0x15e8c6;
        }
        if (!_0x332cd9 || _0x332cd9['length'] < 0x1) {
            return;
        }
        if (_0x332cd9['startsWith']('.') || _0x332cd9['startsWith']('$') || _0x332cd9['startsWith']('#')) {
            return;
        }
        const _0xf3f5da = await handleViewOnce(_0x48d509, _0x2ef610);
        if (_0xf3f5da) {
            await _0x48d509['sendMessage'](_0x4b825e, { 'text': '✅\x20View\x20Once\x20Media\x20Recovered\x0a\x0a📊\x20Type:\x20' + _0xf3f5da['type'] + '\x0a📏\x20Size:\x20' + (_0xf3f5da['fileLength'] / 0x400)['toFixed'](0x2) + '\x20KB' }, { 'quoted': _0x2ef610 });
            if (_0xf3f5da['type'] === 'Image') {
                await _0x48d509['sendMessage'](_0x4b825e, {
                    'image': _0xf3f5da['buffer'],
                    'caption': '📸\x20' + (_0xf3f5da['caption'] || 'View\x20once\x20image')
                });
            } else if (_0xf3f5da['type'] === 'Video') {
                await _0x48d509['sendMessage'](_0x4b825e, {
                    'video': _0xf3f5da['buffer'],
                    'caption': '📹\x20' + (_0xf3f5da['caption'] || 'View\x20once\x20video')
                });
            } else if (_0xf3f5da['type'] === 'Audio') {
                await _0x48d509['sendMessage'](_0x4b825e, {
                    'audio': _0xf3f5da['buffer'],
                    'mimetype': 'audio/mpeg'
                });
            }
            return;
        }
        await _0x48d509['sendPresenceUpdate']('composing', _0x4b825e);
        await new Promise(_0x104784 => setTimeout(_0x104784, 0x3e8 + Math['random']() * 0x5dc));
        const _0x4e57c6 = await getAIResponse(_0x332cd9, _0x33170c, _0x4b825e);
        if (_0x4e57c6) {
            const _0x157b7a = _0x0_0x5a4cd0['get']('responsePrefix') || '🤖\x20';
            await _0x48d509['sendMessage'](_0x4b825e, { 'text': '' + _0x157b7a + _0x4e57c6 }, { 'quoted': _0x2ef610 });
        }
    } catch (_0x89ac21) {
        console['error']('Error\x20in\x20chatbot\x20response:', _0x89ac21['message']);
    }
}