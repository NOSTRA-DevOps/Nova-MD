import _0x0_0x4e7bcb from './chatbotService.js';
import _0x0_0x50d365 from './chatbotConfig.js';
import _0x0_0x144546 from './isOwner.js';
import _0x0_0x5f5874 from './lightweight_store.js';
import { dataFile } from './paths.js';
import _0x0_0x3adb82 from 'fs';
import _0x0_0x5440a5 from 'path';
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
            const _0x220ea9 = await _0x0_0x5f5874['getSetting']('global', 'userGroupData');
            return _0x220ea9 || {
                'groups': [],
                'chatbot': {}
            };
        }
        if (!_0x0_0x3adb82['existsSync'](USER_GROUP_DATA)) {
            return {
                'groups': [],
                'chatbot': {}
            };
        }
        return JSON['parse'](_0x0_0x3adb82['readFileSync'](USER_GROUP_DATA, 'utf-8'));
    } catch (_0x489049) {
        console['error']('Error\x20loading\x20user\x20group\x20data:', _0x489049['message']);
        return {
            'groups': [],
            'chatbot': {}
        };
    }
}
export async function saveUserGroupData(_0x13876c) {
    try {
        if (HAS_DB) {
            await _0x0_0x5f5874['saveSetting']('global', 'userGroupData', _0x13876c);
        } else {
            const _0x474946 = _0x0_0x5440a5['dirname'](USER_GROUP_DATA);
            if (!_0x0_0x3adb82['existsSync'](_0x474946)) {
                _0x0_0x3adb82['mkdirSync'](_0x474946, { 'recursive': !![] });
            }
            _0x0_0x3adb82['writeFileSync'](USER_GROUP_DATA, JSON['stringify'](_0x13876c, null, 0x2));
        }
    } catch (_0x2f91df) {
        console['error']('Error\x20saving\x20user\x20group\x20data:', _0x2f91df['message']);
    }
}
async function handleViewOnce(_0x268e8f, _0x54fd84) {
    try {
        const _0x41b278 = _0x54fd84['message'];
        let _0x4c28d6 = null;
        let _0x304659 = '';
        let _0x269a13 = '';
        if (_0x41b278?.['viewOnceMessageV2']?.['message']?.['imageMessage']) {
            _0x4c28d6 = _0x41b278['viewOnceMessageV2']['message']['imageMessage'];
            _0x304659 = 'Image';
            _0x269a13 = _0x4c28d6['caption'] || '';
        } else if (_0x41b278?.['viewOnceMessageV2']?.['message']?.['videoMessage']) {
            _0x4c28d6 = _0x41b278['viewOnceMessageV2']['message']['videoMessage'];
            _0x304659 = 'Video';
            _0x269a13 = _0x4c28d6['caption'] || '';
        } else if (_0x41b278?.['viewOnceMessageV2']?.['message']?.['audioMessage']) {
            _0x4c28d6 = _0x41b278['viewOnceMessageV2']['message']['audioMessage'];
            _0x304659 = 'Audio';
            _0x269a13 = '';
        } else if (_0x41b278?.['viewOnceMessage']?.['message']?.['imageMessage']) {
            _0x4c28d6 = _0x41b278['viewOnceMessage']['message']['imageMessage'];
            _0x304659 = 'Image';
            _0x269a13 = _0x4c28d6['caption'] || '';
        } else if (_0x41b278?.['viewOnceMessage']?.['message']?.['videoMessage']) {
            _0x4c28d6 = _0x41b278['viewOnceMessage']['message']['videoMessage'];
            _0x304659 = 'Video';
            _0x269a13 = _0x4c28d6['caption'] || '';
        }
        if (!_0x4c28d6)
            return null;
        const _0x2b6ad0 = await _0x268e8f['downloadMediaMessage'](_0x54fd84);
        if (!_0x2b6ad0)
            return null;
        return {
            'buffer': _0x2b6ad0,
            'type': _0x304659,
            'caption': _0x269a13,
            'mimeType': _0x4c28d6['mimetype'],
            'fileLength': _0x4c28d6['fileLength']
        };
    } catch (_0x505bd6) {
        console['error']('Error\x20handling\x20view\x20once:', _0x505bd6);
        return null;
    }
}
async function getAIResponse(_0x4aef44, _0x344d07, _0x4e39ed) {
    try {
        const _0x7da906 = await _0x0_0x4e7bcb['getResponse'](_0x4aef44, _0x4e39ed, _0x344d07, {
            'senderId': _0x344d07,
            'chatId': _0x4e39ed,
            'timestamp': Date['now']()
        });
        return _0x7da906 || 'Je\x20suis\x20là\x20!\x20Comment\x20puis-je\x20vous\x20aider\x20?\x20😊';
    } catch (_0x14a6e5) {
        console['error']('AI\x20response\x20error:', _0x14a6e5);
        return 'Désolé,\x20je\x20rencontre\x20un\x20problème\x20technique.\x20Veuillez\x20réessayer.\x20🥲';
    }
}
export async function handleChatbotResponse(_0x4f07c3, _0x158fab, _0x288fc9, _0x175379, _0x2c4952) {
    if (!_0x0_0x50d365['get']('enabled'))
        return;
    try {
        const _0x110c18 = _0x0_0x50d365['get']('botName') || 'Nova';
        const _0xb4ebe3 = _0x4f07c3['user']['id'];
        const _0x5562b6 = _0xb4ebe3?.['split'](':')[0x0] || '';
        const _0x460cd7 = await _0x0_0x144546(_0x2c4952, _0x4f07c3, _0x158fab);
        const _0x2d8f65 = _0x288fc9['key']['fromMe'];
        const _0x5187a1 = _0x2d8f65 || _0x460cd7;
        const _0x20807b = await _0x0_0x5f5874['getBotMode']();
        const _0x3c76f7 = _0x0_0x50d365['get']('mode') || 'private';
        if (_0x3c76f7 === 'private' && !_0x5187a1) {
            return;
        }
        const _0x463cd3 = ((() => {
            if (_0x5187a1)
                return !![];
            switch (_0x20807b) {
            case 'public':
                return !![];
            case 'private':
            case 'self':
                return ![];
            case 'groups':
                return _0x158fab['endsWith']('@g.us');
            case 'inbox':
                return !_0x158fab['endsWith']('@g.us');
            default:
                return !![];
            }
        })());
        if (!_0x463cd3)
            return;
        const _0xc4ffc1 = _0x288fc9['message']?.['extendedTextMessage']?.['contextInfo']?.['participant']?.['includes'](_0x5562b6);
        const _0x2019f9 = _0x175379['toLowerCase']()['trim']();
        const _0x2c944b = _0x110c18['toLowerCase']();
        const _0x28954e = _0x2019f9['includes'](_0x2c944b) || _0x2019f9['includes']('@' + _0x2c944b) || _0x2019f9['includes']('@' + _0x5562b6);
        const _0x2ebf03 = new RegExp('^' + _0x2c944b + '\x5cs+|^@' + _0x2c944b + '\x5cs+', 'i')['test'](_0x175379);
        const _0x27355c = _0x2ebf03 || _0x28954e || _0xc4ffc1 || _0x175379['includes']('@' + _0x5562b6);
        if (!_0x27355c) {
            return;
        }
        let _0x39fdf7 = _0x175379;
        const _0x37c151 = [
            new RegExp('^' + _0x110c18 + '\x5cs+', 'i'),
            new RegExp('^@' + _0x110c18 + '\x5cs+', 'i'),
            new RegExp('^' + _0x110c18 + '[:]\x5cs+', 'i'),
            new RegExp('^@' + _0x110c18 + '[:]\x5cs+', 'i'),
            new RegExp('\x5cs+' + _0x110c18 + '\x5cs+', 'i'),
            new RegExp('\x5cs+@' + _0x110c18 + '\x5cs+', 'i'),
            new RegExp('\x5cs+' + _0x110c18 + '$', 'i'),
            new RegExp('\x5cs+@' + _0x110c18 + '$', 'i')
        ];
        for (const _0x287465 of _0x37c151) {
            _0x39fdf7 = _0x39fdf7['replace'](_0x287465, '\x20')['trim']();
        }
        if (_0xc4ffc1 && !_0x27355c) {
            _0x39fdf7 = _0x175379;
        }
        if (!_0x39fdf7 || _0x39fdf7['length'] < 0x1) {
            return;
        }
        if (_0x39fdf7['startsWith']('.') || _0x39fdf7['startsWith']('$') || _0x39fdf7['startsWith']('#')) {
            return;
        }
        const _0x5e1adb = await handleViewOnce(_0x4f07c3, _0x288fc9);
        if (_0x5e1adb) {
            await _0x4f07c3['sendMessage'](_0x158fab, { 'text': '✅\x20View\x20Once\x20Media\x20Recovered\x0a\x0a📊\x20Type:\x20' + _0x5e1adb['type'] + '\x0a📏\x20Size:\x20' + (_0x5e1adb['fileLength'] / 0x400)['toFixed'](0x2) + '\x20KB' }, { 'quoted': _0x288fc9 });
            if (_0x5e1adb['type'] === 'Image') {
                await _0x4f07c3['sendMessage'](_0x158fab, {
                    'image': _0x5e1adb['buffer'],
                    'caption': '📸\x20' + (_0x5e1adb['caption'] || 'View\x20once\x20image')
                });
            } else if (_0x5e1adb['type'] === 'Video') {
                await _0x4f07c3['sendMessage'](_0x158fab, {
                    'video': _0x5e1adb['buffer'],
                    'caption': '📹\x20' + (_0x5e1adb['caption'] || 'View\x20once\x20video')
                });
            } else if (_0x5e1adb['type'] === 'Audio') {
                await _0x4f07c3['sendMessage'](_0x158fab, {
                    'audio': _0x5e1adb['buffer'],
                    'mimetype': 'audio/mpeg'
                });
            }
            return;
        }
        await _0x4f07c3['sendPresenceUpdate']('composing', _0x158fab);
        await new Promise(_0x2f1210 => setTimeout(_0x2f1210, 0x3e8 + Math['random']() * 0x5dc));
        const _0x304ad9 = await getAIResponse(_0x39fdf7, _0x2c4952, _0x158fab);
        if (_0x304ad9) {
            const _0x473277 = _0x0_0x50d365['get']('responsePrefix') || '🤖\x20';
            await _0x4f07c3['sendMessage'](_0x158fab, { 'text': '' + _0x473277 + _0x304ad9 }, { 'quoted': _0x288fc9 });
        }
    } catch (_0x4adb4f) {
        console['error']('Error\x20in\x20chatbot\x20response:', _0x4adb4f['message']);
    }
}