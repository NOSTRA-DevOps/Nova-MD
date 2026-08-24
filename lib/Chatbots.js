import _0x0_0x51e01e from './chatbotService.js';
import _0x0_0x4e7083 from './chatbotConfig.js';
import _0x0_0x639876 from './isOwner.js';
import _0x0_0x312b02 from './lightweight_store.js';
import { dataFile } from './paths.js';
import _0x0_0x37b88e from 'fs';
import _0x0_0xce47ec from 'path';
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
            const _0x4bba9d = await _0x0_0x312b02['getSetting']('global', 'userGroupData');
            return _0x4bba9d || {
                'groups': [],
                'chatbot': {}
            };
        }
        if (!_0x0_0x37b88e['existsSync'](USER_GROUP_DATA)) {
            return {
                'groups': [],
                'chatbot': {}
            };
        }
        return JSON['parse'](_0x0_0x37b88e['readFileSync'](USER_GROUP_DATA, 'utf-8'));
    } catch (_0x53c340) {
        console['error']('Error\x20loading\x20user\x20group\x20data:', _0x53c340['message']);
        return {
            'groups': [],
            'chatbot': {}
        };
    }
}
export async function saveUserGroupData(_0x57a7ec) {
    try {
        if (HAS_DB) {
            await _0x0_0x312b02['saveSetting']('global', 'userGroupData', _0x57a7ec);
        } else {
            const _0x5a4aa9 = _0x0_0xce47ec['dirname'](USER_GROUP_DATA);
            if (!_0x0_0x37b88e['existsSync'](_0x5a4aa9)) {
                _0x0_0x37b88e['mkdirSync'](_0x5a4aa9, { 'recursive': !![] });
            }
            _0x0_0x37b88e['writeFileSync'](USER_GROUP_DATA, JSON['stringify'](_0x57a7ec, null, 0x2));
        }
    } catch (_0x157f1b) {
        console['error']('Error\x20saving\x20user\x20group\x20data:', _0x157f1b['message']);
    }
}
async function handleViewOnce(_0x53eff6, _0x1588bb) {
    try {
        const _0x53ddaf = _0x1588bb['message'];
        let _0x579933 = null;
        let _0x5467a8 = '';
        let _0x43f9c6 = '';
        if (_0x53ddaf?.['viewOnceMessageV2']?.['message']?.['imageMessage']) {
            _0x579933 = _0x53ddaf['viewOnceMessageV2']['message']['imageMessage'];
            _0x5467a8 = 'Image';
            _0x43f9c6 = _0x579933['caption'] || '';
        } else if (_0x53ddaf?.['viewOnceMessageV2']?.['message']?.['videoMessage']) {
            _0x579933 = _0x53ddaf['viewOnceMessageV2']['message']['videoMessage'];
            _0x5467a8 = 'Video';
            _0x43f9c6 = _0x579933['caption'] || '';
        } else if (_0x53ddaf?.['viewOnceMessageV2']?.['message']?.['audioMessage']) {
            _0x579933 = _0x53ddaf['viewOnceMessageV2']['message']['audioMessage'];
            _0x5467a8 = 'Audio';
            _0x43f9c6 = '';
        } else if (_0x53ddaf?.['viewOnceMessage']?.['message']?.['imageMessage']) {
            _0x579933 = _0x53ddaf['viewOnceMessage']['message']['imageMessage'];
            _0x5467a8 = 'Image';
            _0x43f9c6 = _0x579933['caption'] || '';
        } else if (_0x53ddaf?.['viewOnceMessage']?.['message']?.['videoMessage']) {
            _0x579933 = _0x53ddaf['viewOnceMessage']['message']['videoMessage'];
            _0x5467a8 = 'Video';
            _0x43f9c6 = _0x579933['caption'] || '';
        }
        if (!_0x579933)
            return null;
        const _0x32d547 = await _0x53eff6['downloadMediaMessage'](_0x1588bb);
        if (!_0x32d547)
            return null;
        return {
            'buffer': _0x32d547,
            'type': _0x5467a8,
            'caption': _0x43f9c6,
            'mimeType': _0x579933['mimetype'],
            'fileLength': _0x579933['fileLength']
        };
    } catch (_0x450010) {
        console['error']('Error\x20handling\x20view\x20once:', _0x450010);
        return null;
    }
}
async function getAIResponse(_0x39684a, _0x13730e, _0x1b5b71) {
    try {
        const _0x55ecac = await _0x0_0x51e01e['getResponse'](_0x39684a, _0x1b5b71, _0x13730e, {
            'senderId': _0x13730e,
            'chatId': _0x1b5b71,
            'timestamp': Date['now']()
        });
        return _0x55ecac || 'Je\x20suis\x20là\x20!\x20Comment\x20puis-je\x20vous\x20aider\x20?\x20😊';
    } catch (_0x4ac68c) {
        console['error']('AI\x20response\x20error:', _0x4ac68c);
        return 'Désolé,\x20je\x20rencontre\x20un\x20problème\x20technique.\x20Veuillez\x20réessayer.\x20🥲';
    }
}
export async function handleChatbotResponse(_0x1d9324, _0x2b4f18, _0x220d0f, _0x5bf574, _0x276b36) {
    if (!_0x0_0x4e7083['get']('enabled'))
        return;
    try {
        const _0x822f05 = _0x0_0x4e7083['get']('botName') || 'Nova';
        const _0x556c28 = _0x1d9324['user']['id'];
        const _0x5a4407 = _0x556c28?.['split'](':')[0x0] || '';
        const _0x4cb642 = await _0x0_0x639876(_0x276b36, _0x1d9324, _0x2b4f18);
        const _0x17f4cc = _0x220d0f['key']['fromMe'];
        const _0xaa82d4 = _0x17f4cc || _0x4cb642;
        const _0x101bd3 = await _0x0_0x312b02['getBotMode']();
        const _0x29300e = _0x0_0x4e7083['get']('mode') || 'private';
        if (_0x29300e === 'private' && !_0xaa82d4) {
            return;
        }
        const _0x443a54 = ((() => {
            if (_0xaa82d4)
                return !![];
            switch (_0x101bd3) {
            case 'public':
                return !![];
            case 'private':
            case 'self':
                return ![];
            case 'groups':
                return _0x2b4f18['endsWith']('@g.us');
            case 'inbox':
                return !_0x2b4f18['endsWith']('@g.us');
            default:
                return !![];
            }
        })());
        if (!_0x443a54)
            return;
        const _0x24a50e = _0x220d0f['message']?.['extendedTextMessage']?.['contextInfo']?.['participant']?.['includes'](_0x5a4407);
        const _0x1d33f4 = _0x5bf574['toLowerCase']()['trim']();
        const _0x37219a = _0x822f05['toLowerCase']();
        const _0x219032 = _0x1d33f4['includes'](_0x37219a) || _0x1d33f4['includes']('@' + _0x37219a) || _0x1d33f4['includes']('@' + _0x5a4407);
        const _0x2ce2c6 = new RegExp('^' + _0x37219a + '\x5cs+|^@' + _0x37219a + '\x5cs+', 'i')['test'](_0x5bf574);
        const _0xad1db0 = _0x2ce2c6 || _0x219032 || _0x24a50e || _0x5bf574['includes']('@' + _0x5a4407);
        if (!_0xad1db0) {
            return;
        }
        let _0x1c86f9 = _0x5bf574;
        const _0x5078c1 = [
            new RegExp('^' + _0x822f05 + '\x5cs+', 'i'),
            new RegExp('^@' + _0x822f05 + '\x5cs+', 'i'),
            new RegExp('^' + _0x822f05 + '[:]\x5cs+', 'i'),
            new RegExp('^@' + _0x822f05 + '[:]\x5cs+', 'i'),
            new RegExp('\x5cs+' + _0x822f05 + '\x5cs+', 'i'),
            new RegExp('\x5cs+@' + _0x822f05 + '\x5cs+', 'i'),
            new RegExp('\x5cs+' + _0x822f05 + '$', 'i'),
            new RegExp('\x5cs+@' + _0x822f05 + '$', 'i')
        ];
        for (const _0xcd5d92 of _0x5078c1) {
            _0x1c86f9 = _0x1c86f9['replace'](_0xcd5d92, '\x20')['trim']();
        }
        if (_0x24a50e && !_0xad1db0) {
            _0x1c86f9 = _0x5bf574;
        }
        if (!_0x1c86f9 || _0x1c86f9['length'] < 0x1) {
            return;
        }
        if (_0x1c86f9['startsWith']('.') || _0x1c86f9['startsWith']('$') || _0x1c86f9['startsWith']('#')) {
            return;
        }
        const _0x1e3b43 = await handleViewOnce(_0x1d9324, _0x220d0f);
        if (_0x1e3b43) {
            await _0x1d9324['sendMessage'](_0x2b4f18, { 'text': '✅\x20View\x20Once\x20Media\x20Recovered\x0a\x0a📊\x20Type:\x20' + _0x1e3b43['type'] + '\x0a📏\x20Size:\x20' + (_0x1e3b43['fileLength'] / 0x400)['toFixed'](0x2) + '\x20KB' }, { 'quoted': _0x220d0f });
            if (_0x1e3b43['type'] === 'Image') {
                await _0x1d9324['sendMessage'](_0x2b4f18, {
                    'image': _0x1e3b43['buffer'],
                    'caption': '📸\x20' + (_0x1e3b43['caption'] || 'View\x20once\x20image')
                });
            } else if (_0x1e3b43['type'] === 'Video') {
                await _0x1d9324['sendMessage'](_0x2b4f18, {
                    'video': _0x1e3b43['buffer'],
                    'caption': '📹\x20' + (_0x1e3b43['caption'] || 'View\x20once\x20video')
                });
            } else if (_0x1e3b43['type'] === 'Audio') {
                await _0x1d9324['sendMessage'](_0x2b4f18, {
                    'audio': _0x1e3b43['buffer'],
                    'mimetype': 'audio/mpeg'
                });
            }
            return;
        }
        await _0x1d9324['sendPresenceUpdate']('composing', _0x2b4f18);
        await new Promise(_0x39c00f => setTimeout(_0x39c00f, 0x3e8 + Math['random']() * 0x5dc));
        const _0x115a1c = await getAIResponse(_0x1c86f9, _0x276b36, _0x2b4f18);
        if (_0x115a1c) {
            const _0x36a5a3 = _0x0_0x4e7083['get']('responsePrefix') || '🤖\x20';
            await _0x1d9324['sendMessage'](_0x2b4f18, { 'text': '' + _0x36a5a3 + _0x115a1c }, { 'quoted': _0x220d0f });
        }
    } catch (_0x524710) {
        console['error']('Error\x20in\x20chatbot\x20response:', _0x524710['message']);
    }
}