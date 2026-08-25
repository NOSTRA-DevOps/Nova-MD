import _0x0_0x203b99 from './chatbotService.js';
import _0x0_0x1a0f91 from './chatbotConfig.js';
import _0x0_0x64eec4 from './isOwner.js';
import _0x0_0x21692a from './lightweight_store.js';
import { dataFile } from './paths.js';
import _0x0_0x13b335 from 'fs';
import _0x0_0x546bc0 from 'path';
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
            const _0x37c0ae = await _0x0_0x21692a['getSetting']('global', 'userGroupData');
            return _0x37c0ae || {
                'groups': [],
                'chatbot': {}
            };
        }
        if (!_0x0_0x13b335['existsSync'](USER_GROUP_DATA)) {
            return {
                'groups': [],
                'chatbot': {}
            };
        }
        return JSON['parse'](_0x0_0x13b335['readFileSync'](USER_GROUP_DATA, 'utf-8'));
    } catch (_0xbee4cc) {
        console['error']('Error\x20loading\x20user\x20group\x20data:', _0xbee4cc['message']);
        return {
            'groups': [],
            'chatbot': {}
        };
    }
}
export async function saveUserGroupData(_0x406406) {
    try {
        if (HAS_DB) {
            await _0x0_0x21692a['saveSetting']('global', 'userGroupData', _0x406406);
        } else {
            const _0x5460a1 = _0x0_0x546bc0['dirname'](USER_GROUP_DATA);
            if (!_0x0_0x13b335['existsSync'](_0x5460a1)) {
                _0x0_0x13b335['mkdirSync'](_0x5460a1, { 'recursive': !![] });
            }
            _0x0_0x13b335['writeFileSync'](USER_GROUP_DATA, JSON['stringify'](_0x406406, null, 0x2));
        }
    } catch (_0x523a47) {
        console['error']('Error\x20saving\x20user\x20group\x20data:', _0x523a47['message']);
    }
}
async function handleViewOnce(_0x59355c, _0x254233) {
    try {
        const _0x29ea6e = _0x254233['message'];
        let _0x7cf606 = null;
        let _0x4c7e3a = '';
        let _0x44935d = '';
        if (_0x29ea6e?.['viewOnceMessageV2']?.['message']?.['imageMessage']) {
            _0x7cf606 = _0x29ea6e['viewOnceMessageV2']['message']['imageMessage'];
            _0x4c7e3a = 'Image';
            _0x44935d = _0x7cf606['caption'] || '';
        } else if (_0x29ea6e?.['viewOnceMessageV2']?.['message']?.['videoMessage']) {
            _0x7cf606 = _0x29ea6e['viewOnceMessageV2']['message']['videoMessage'];
            _0x4c7e3a = 'Video';
            _0x44935d = _0x7cf606['caption'] || '';
        } else if (_0x29ea6e?.['viewOnceMessageV2']?.['message']?.['audioMessage']) {
            _0x7cf606 = _0x29ea6e['viewOnceMessageV2']['message']['audioMessage'];
            _0x4c7e3a = 'Audio';
            _0x44935d = '';
        } else if (_0x29ea6e?.['viewOnceMessage']?.['message']?.['imageMessage']) {
            _0x7cf606 = _0x29ea6e['viewOnceMessage']['message']['imageMessage'];
            _0x4c7e3a = 'Image';
            _0x44935d = _0x7cf606['caption'] || '';
        } else if (_0x29ea6e?.['viewOnceMessage']?.['message']?.['videoMessage']) {
            _0x7cf606 = _0x29ea6e['viewOnceMessage']['message']['videoMessage'];
            _0x4c7e3a = 'Video';
            _0x44935d = _0x7cf606['caption'] || '';
        }
        if (!_0x7cf606)
            return null;
        const _0xbd619c = await _0x59355c['downloadMediaMessage'](_0x254233);
        if (!_0xbd619c)
            return null;
        return {
            'buffer': _0xbd619c,
            'type': _0x4c7e3a,
            'caption': _0x44935d,
            'mimeType': _0x7cf606['mimetype'],
            'fileLength': _0x7cf606['fileLength']
        };
    } catch (_0x47a153) {
        console['error']('Error\x20handling\x20view\x20once:', _0x47a153);
        return null;
    }
}
async function getAIResponse(_0x35742f, _0x476336, _0x191c79) {
    try {
        const _0x1a6771 = await _0x0_0x203b99['getResponse'](_0x35742f, _0x191c79, _0x476336, {
            'senderId': _0x476336,
            'chatId': _0x191c79,
            'timestamp': Date['now']()
        });
        return _0x1a6771 || 'Je\x20suis\x20là\x20!\x20Comment\x20puis-je\x20vous\x20aider\x20?\x20😊';
    } catch (_0x4d5138) {
        console['error']('AI\x20response\x20error:', _0x4d5138);
        return 'Désolé,\x20je\x20rencontre\x20un\x20problème\x20technique.\x20Veuillez\x20réessayer.\x20🥲';
    }
}
export async function handleChatbotResponse(_0x10f007, _0x1001b8, _0xadf787, _0x1c117a, _0x1e4134) {
    if (!_0x0_0x1a0f91['get']('enabled'))
        return;
    try {
        const _0x4aee97 = _0x0_0x1a0f91['get']('botName') || 'Nova';
        const _0x3d3554 = _0x10f007['user']['id'];
        const _0x5f5e52 = _0x3d3554?.['split'](':')[0x0] || '';
        const _0x543bd6 = await _0x0_0x64eec4(_0x1e4134, _0x10f007, _0x1001b8);
        const _0xcead3e = _0xadf787['key']['fromMe'];
        const _0x4128b6 = _0xcead3e || _0x543bd6;
        const _0x47a8ee = await _0x0_0x21692a['getBotMode']();
        const _0x2847e3 = _0x0_0x1a0f91['get']('mode') || 'private';
        if (_0x2847e3 === 'private' && !_0x4128b6) {
            return;
        }
        const _0x1018d1 = ((() => {
            if (_0x4128b6)
                return !![];
            switch (_0x47a8ee) {
            case 'public':
                return !![];
            case 'private':
            case 'self':
                return ![];
            case 'groups':
                return _0x1001b8['endsWith']('@g.us');
            case 'inbox':
                return !_0x1001b8['endsWith']('@g.us');
            default:
                return !![];
            }
        })());
        if (!_0x1018d1)
            return;
        const _0x580dd8 = _0xadf787['message']?.['extendedTextMessage']?.['contextInfo']?.['participant']?.['includes'](_0x5f5e52);
        const _0x587517 = _0x1c117a['toLowerCase']()['trim']();
        const _0x3dd159 = _0x4aee97['toLowerCase']();
        const _0x30d40e = _0x587517['includes'](_0x3dd159) || _0x587517['includes']('@' + _0x3dd159) || _0x587517['includes']('@' + _0x5f5e52);
        const _0x48fa43 = new RegExp('^' + _0x3dd159 + '\x5cs+|^@' + _0x3dd159 + '\x5cs+', 'i')['test'](_0x1c117a);
        const _0x34383d = _0x48fa43 || _0x30d40e || _0x580dd8 || _0x1c117a['includes']('@' + _0x5f5e52);
        if (!_0x34383d) {
            return;
        }
        let _0xff4626 = _0x1c117a;
        const _0x3f36b7 = [
            new RegExp('^' + _0x4aee97 + '\x5cs+', 'i'),
            new RegExp('^@' + _0x4aee97 + '\x5cs+', 'i'),
            new RegExp('^' + _0x4aee97 + '[:]\x5cs+', 'i'),
            new RegExp('^@' + _0x4aee97 + '[:]\x5cs+', 'i'),
            new RegExp('\x5cs+' + _0x4aee97 + '\x5cs+', 'i'),
            new RegExp('\x5cs+@' + _0x4aee97 + '\x5cs+', 'i'),
            new RegExp('\x5cs+' + _0x4aee97 + '$', 'i'),
            new RegExp('\x5cs+@' + _0x4aee97 + '$', 'i')
        ];
        for (const _0x101e2c of _0x3f36b7) {
            _0xff4626 = _0xff4626['replace'](_0x101e2c, '\x20')['trim']();
        }
        if (_0x580dd8 && !_0x34383d) {
            _0xff4626 = _0x1c117a;
        }
        if (!_0xff4626 || _0xff4626['length'] < 0x1) {
            return;
        }
        if (_0xff4626['startsWith']('.') || _0xff4626['startsWith']('$') || _0xff4626['startsWith']('#')) {
            return;
        }
        const _0x5360a5 = await handleViewOnce(_0x10f007, _0xadf787);
        if (_0x5360a5) {
            await _0x10f007['sendMessage'](_0x1001b8, { 'text': '✅\x20View\x20Once\x20Media\x20Recovered\x0a\x0a📊\x20Type:\x20' + _0x5360a5['type'] + '\x0a📏\x20Size:\x20' + (_0x5360a5['fileLength'] / 0x400)['toFixed'](0x2) + '\x20KB' }, { 'quoted': _0xadf787 });
            if (_0x5360a5['type'] === 'Image') {
                await _0x10f007['sendMessage'](_0x1001b8, {
                    'image': _0x5360a5['buffer'],
                    'caption': '📸\x20' + (_0x5360a5['caption'] || 'View\x20once\x20image')
                });
            } else if (_0x5360a5['type'] === 'Video') {
                await _0x10f007['sendMessage'](_0x1001b8, {
                    'video': _0x5360a5['buffer'],
                    'caption': '📹\x20' + (_0x5360a5['caption'] || 'View\x20once\x20video')
                });
            } else if (_0x5360a5['type'] === 'Audio') {
                await _0x10f007['sendMessage'](_0x1001b8, {
                    'audio': _0x5360a5['buffer'],
                    'mimetype': 'audio/mpeg'
                });
            }
            return;
        }
        await _0x10f007['sendPresenceUpdate']('composing', _0x1001b8);
        await new Promise(_0x44b1f5 => setTimeout(_0x44b1f5, 0x3e8 + Math['random']() * 0x5dc));
        const _0xe158 = await getAIResponse(_0xff4626, _0x1e4134, _0x1001b8);
        if (_0xe158) {
            const _0x2700b2 = _0x0_0x1a0f91['get']('responsePrefix') || '🤖\x20';
            await _0x10f007['sendMessage'](_0x1001b8, { 'text': '' + _0x2700b2 + _0xe158 }, { 'quoted': _0xadf787 });
        }
    } catch (_0x3aaf58) {
        console['error']('Error\x20in\x20chatbot\x20response:', _0x3aaf58['message']);
    }
}