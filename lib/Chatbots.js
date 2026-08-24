import _0x0_0x560292 from './chatbotService.js';
import _0x0_0x585f55 from './chatbotConfig.js';
import _0x0_0x392c13 from './isOwner.js';
import _0x0_0x51a5d8 from './lightweight_store.js';
import { dataFile } from './paths.js';
import _0x0_0x1c8a78 from 'fs';
import _0x0_0x5cdfff from 'path';
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
            const _0x2a29fd = await _0x0_0x51a5d8['getSetting']('global', 'userGroupData');
            return _0x2a29fd || {
                'groups': [],
                'chatbot': {}
            };
        }
        if (!_0x0_0x1c8a78['existsSync'](USER_GROUP_DATA)) {
            return {
                'groups': [],
                'chatbot': {}
            };
        }
        return JSON['parse'](_0x0_0x1c8a78['readFileSync'](USER_GROUP_DATA, 'utf-8'));
    } catch (_0x94f0) {
        console['error']('Error\x20loading\x20user\x20group\x20data:', _0x94f0['message']);
        return {
            'groups': [],
            'chatbot': {}
        };
    }
}
export async function saveUserGroupData(_0x51b002) {
    try {
        if (HAS_DB) {
            await _0x0_0x51a5d8['saveSetting']('global', 'userGroupData', _0x51b002);
        } else {
            const _0x2372ba = _0x0_0x5cdfff['dirname'](USER_GROUP_DATA);
            if (!_0x0_0x1c8a78['existsSync'](_0x2372ba)) {
                _0x0_0x1c8a78['mkdirSync'](_0x2372ba, { 'recursive': !![] });
            }
            _0x0_0x1c8a78['writeFileSync'](USER_GROUP_DATA, JSON['stringify'](_0x51b002, null, 0x2));
        }
    } catch (_0x1762df) {
        console['error']('Error\x20saving\x20user\x20group\x20data:', _0x1762df['message']);
    }
}
async function handleViewOnce(_0xa18e3e, _0xb64a66) {
    try {
        const _0x720e01 = _0xb64a66['message'];
        let _0x50a0f7 = null;
        let _0x31451a = '';
        let _0x4bd979 = '';
        if (_0x720e01?.['viewOnceMessageV2']?.['message']?.['imageMessage']) {
            _0x50a0f7 = _0x720e01['viewOnceMessageV2']['message']['imageMessage'];
            _0x31451a = 'Image';
            _0x4bd979 = _0x50a0f7['caption'] || '';
        } else if (_0x720e01?.['viewOnceMessageV2']?.['message']?.['videoMessage']) {
            _0x50a0f7 = _0x720e01['viewOnceMessageV2']['message']['videoMessage'];
            _0x31451a = 'Video';
            _0x4bd979 = _0x50a0f7['caption'] || '';
        } else if (_0x720e01?.['viewOnceMessageV2']?.['message']?.['audioMessage']) {
            _0x50a0f7 = _0x720e01['viewOnceMessageV2']['message']['audioMessage'];
            _0x31451a = 'Audio';
            _0x4bd979 = '';
        } else if (_0x720e01?.['viewOnceMessage']?.['message']?.['imageMessage']) {
            _0x50a0f7 = _0x720e01['viewOnceMessage']['message']['imageMessage'];
            _0x31451a = 'Image';
            _0x4bd979 = _0x50a0f7['caption'] || '';
        } else if (_0x720e01?.['viewOnceMessage']?.['message']?.['videoMessage']) {
            _0x50a0f7 = _0x720e01['viewOnceMessage']['message']['videoMessage'];
            _0x31451a = 'Video';
            _0x4bd979 = _0x50a0f7['caption'] || '';
        }
        if (!_0x50a0f7)
            return null;
        const _0xb07424 = await _0xa18e3e['downloadMediaMessage'](_0xb64a66);
        if (!_0xb07424)
            return null;
        return {
            'buffer': _0xb07424,
            'type': _0x31451a,
            'caption': _0x4bd979,
            'mimeType': _0x50a0f7['mimetype'],
            'fileLength': _0x50a0f7['fileLength']
        };
    } catch (_0x2ad45b) {
        console['error']('Error\x20handling\x20view\x20once:', _0x2ad45b);
        return null;
    }
}
async function getAIResponse(_0x532ce9, _0x34d3f7, _0x33c3eb) {
    try {
        const _0x17a634 = await _0x0_0x560292['getResponse'](_0x532ce9, _0x33c3eb, _0x34d3f7, {
            'senderId': _0x34d3f7,
            'chatId': _0x33c3eb,
            'timestamp': Date['now']()
        });
        return _0x17a634 || 'Je\x20suis\x20là\x20!\x20Comment\x20puis-je\x20vous\x20aider\x20?\x20😊';
    } catch (_0x50b3f3) {
        console['error']('AI\x20response\x20error:', _0x50b3f3);
        return 'Désolé,\x20je\x20rencontre\x20un\x20problème\x20technique.\x20Veuillez\x20réessayer.\x20🥲';
    }
}
export async function handleChatbotResponse(_0x352218, _0x4dbf7d, _0xb42d92, _0x5820c5, _0x3a853f) {
    if (!_0x0_0x585f55['get']('enabled'))
        return;
    try {
        const _0x146302 = _0x0_0x585f55['get']('botName') || 'Nova';
        const _0x2bc347 = _0x352218['user']['id'];
        const _0x1e729b = _0x2bc347?.['split'](':')[0x0] || '';
        const _0x417f54 = await _0x0_0x392c13(_0x3a853f, _0x352218, _0x4dbf7d);
        const _0x1fd878 = _0xb42d92['key']['fromMe'];
        const _0x3cac42 = _0x1fd878 || _0x417f54;
        const _0x312d9b = await _0x0_0x51a5d8['getBotMode']();
        const _0x4793dc = _0x0_0x585f55['get']('mode') || 'private';
        if (_0x4793dc === 'private' && !_0x3cac42) {
            return;
        }
        const _0x4441df = ((() => {
            if (_0x3cac42)
                return !![];
            switch (_0x312d9b) {
            case 'public':
                return !![];
            case 'private':
            case 'self':
                return ![];
            case 'groups':
                return _0x4dbf7d['endsWith']('@g.us');
            case 'inbox':
                return !_0x4dbf7d['endsWith']('@g.us');
            default:
                return !![];
            }
        })());
        if (!_0x4441df)
            return;
        const _0x5eb5ac = _0xb42d92['message']?.['extendedTextMessage']?.['contextInfo']?.['participant']?.['includes'](_0x1e729b);
        const _0xb7b3e6 = _0x5820c5['toLowerCase']()['trim']();
        const _0x22d12a = _0x146302['toLowerCase']();
        const _0x1a9c9a = _0xb7b3e6['includes'](_0x22d12a) || _0xb7b3e6['includes']('@' + _0x22d12a) || _0xb7b3e6['includes']('@' + _0x1e729b);
        const _0x30aff6 = new RegExp('^' + _0x22d12a + '\x5cs+|^@' + _0x22d12a + '\x5cs+', 'i')['test'](_0x5820c5);
        const _0x746d5d = _0x30aff6 || _0x1a9c9a || _0x5eb5ac || _0x5820c5['includes']('@' + _0x1e729b);
        if (!_0x746d5d) {
            return;
        }
        let _0x4b46f5 = _0x5820c5;
        const _0x2a8f24 = [
            new RegExp('^' + _0x146302 + '\x5cs+', 'i'),
            new RegExp('^@' + _0x146302 + '\x5cs+', 'i'),
            new RegExp('^' + _0x146302 + '[:]\x5cs+', 'i'),
            new RegExp('^@' + _0x146302 + '[:]\x5cs+', 'i'),
            new RegExp('\x5cs+' + _0x146302 + '\x5cs+', 'i'),
            new RegExp('\x5cs+@' + _0x146302 + '\x5cs+', 'i'),
            new RegExp('\x5cs+' + _0x146302 + '$', 'i'),
            new RegExp('\x5cs+@' + _0x146302 + '$', 'i')
        ];
        for (const _0x41e215 of _0x2a8f24) {
            _0x4b46f5 = _0x4b46f5['replace'](_0x41e215, '\x20')['trim']();
        }
        if (_0x5eb5ac && !_0x746d5d) {
            _0x4b46f5 = _0x5820c5;
        }
        if (!_0x4b46f5 || _0x4b46f5['length'] < 0x1) {
            return;
        }
        if (_0x4b46f5['startsWith']('.') || _0x4b46f5['startsWith']('$') || _0x4b46f5['startsWith']('#')) {
            return;
        }
        const _0x2088b9 = await handleViewOnce(_0x352218, _0xb42d92);
        if (_0x2088b9) {
            await _0x352218['sendMessage'](_0x4dbf7d, { 'text': '✅\x20View\x20Once\x20Media\x20Recovered\x0a\x0a📊\x20Type:\x20' + _0x2088b9['type'] + '\x0a📏\x20Size:\x20' + (_0x2088b9['fileLength'] / 0x400)['toFixed'](0x2) + '\x20KB' }, { 'quoted': _0xb42d92 });
            if (_0x2088b9['type'] === 'Image') {
                await _0x352218['sendMessage'](_0x4dbf7d, {
                    'image': _0x2088b9['buffer'],
                    'caption': '📸\x20' + (_0x2088b9['caption'] || 'View\x20once\x20image')
                });
            } else if (_0x2088b9['type'] === 'Video') {
                await _0x352218['sendMessage'](_0x4dbf7d, {
                    'video': _0x2088b9['buffer'],
                    'caption': '📹\x20' + (_0x2088b9['caption'] || 'View\x20once\x20video')
                });
            } else if (_0x2088b9['type'] === 'Audio') {
                await _0x352218['sendMessage'](_0x4dbf7d, {
                    'audio': _0x2088b9['buffer'],
                    'mimetype': 'audio/mpeg'
                });
            }
            return;
        }
        await _0x352218['sendPresenceUpdate']('composing', _0x4dbf7d);
        await new Promise(_0xcd12f6 => setTimeout(_0xcd12f6, 0x3e8 + Math['random']() * 0x5dc));
        const _0x5794f6 = await getAIResponse(_0x4b46f5, _0x3a853f, _0x4dbf7d);
        if (_0x5794f6) {
            const _0x1a9874 = _0x0_0x585f55['get']('responsePrefix') || '🤖\x20';
            await _0x352218['sendMessage'](_0x4dbf7d, { 'text': '' + _0x1a9874 + _0x5794f6 }, { 'quoted': _0xb42d92 });
        }
    } catch (_0x15a9cf) {
        console['error']('Error\x20in\x20chatbot\x20response:', _0x15a9cf['message']);
    }
}