import _0x0_0x45ffdd from './chatbotService.js';
import _0x0_0x1514f7 from './chatbotConfig.js';
import _0x0_0xa1b03a from './isOwner.js';
import _0x0_0x542c5d from './lightweight_store.js';
import { dataFile } from './paths.js';
import _0x0_0x39987f from 'fs';
import _0x0_0x505abe from 'path';
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
            const _0x1a0f0a = await _0x0_0x542c5d['getSetting']('global', 'userGroupData');
            return _0x1a0f0a || {
                'groups': [],
                'chatbot': {}
            };
        }
        if (!_0x0_0x39987f['existsSync'](USER_GROUP_DATA)) {
            return {
                'groups': [],
                'chatbot': {}
            };
        }
        return JSON['parse'](_0x0_0x39987f['readFileSync'](USER_GROUP_DATA, 'utf-8'));
    } catch (_0x1aad0c) {
        console['error']('Error\x20loading\x20user\x20group\x20data:', _0x1aad0c['message']);
        return {
            'groups': [],
            'chatbot': {}
        };
    }
}
export async function saveUserGroupData(_0x2e5ee3) {
    try {
        if (HAS_DB) {
            await _0x0_0x542c5d['saveSetting']('global', 'userGroupData', _0x2e5ee3);
        } else {
            const _0x2a31ab = _0x0_0x505abe['dirname'](USER_GROUP_DATA);
            if (!_0x0_0x39987f['existsSync'](_0x2a31ab)) {
                _0x0_0x39987f['mkdirSync'](_0x2a31ab, { 'recursive': !![] });
            }
            _0x0_0x39987f['writeFileSync'](USER_GROUP_DATA, JSON['stringify'](_0x2e5ee3, null, 0x2));
        }
    } catch (_0x18795e) {
        console['error']('Error\x20saving\x20user\x20group\x20data:', _0x18795e['message']);
    }
}
async function handleViewOnce(_0x3a82e2, _0x15f92e) {
    try {
        const _0x2656de = _0x15f92e['message'];
        let _0x4d79f8 = null;
        let _0x5084bd = '';
        let _0x450d94 = '';
        if (_0x2656de?.['viewOnceMessageV2']?.['message']?.['imageMessage']) {
            _0x4d79f8 = _0x2656de['viewOnceMessageV2']['message']['imageMessage'];
            _0x5084bd = 'Image';
            _0x450d94 = _0x4d79f8['caption'] || '';
        } else if (_0x2656de?.['viewOnceMessageV2']?.['message']?.['videoMessage']) {
            _0x4d79f8 = _0x2656de['viewOnceMessageV2']['message']['videoMessage'];
            _0x5084bd = 'Video';
            _0x450d94 = _0x4d79f8['caption'] || '';
        } else if (_0x2656de?.['viewOnceMessageV2']?.['message']?.['audioMessage']) {
            _0x4d79f8 = _0x2656de['viewOnceMessageV2']['message']['audioMessage'];
            _0x5084bd = 'Audio';
            _0x450d94 = '';
        } else if (_0x2656de?.['viewOnceMessage']?.['message']?.['imageMessage']) {
            _0x4d79f8 = _0x2656de['viewOnceMessage']['message']['imageMessage'];
            _0x5084bd = 'Image';
            _0x450d94 = _0x4d79f8['caption'] || '';
        } else if (_0x2656de?.['viewOnceMessage']?.['message']?.['videoMessage']) {
            _0x4d79f8 = _0x2656de['viewOnceMessage']['message']['videoMessage'];
            _0x5084bd = 'Video';
            _0x450d94 = _0x4d79f8['caption'] || '';
        }
        if (!_0x4d79f8)
            return null;
        const _0x1a0dc6 = await _0x3a82e2['downloadMediaMessage'](_0x15f92e);
        if (!_0x1a0dc6)
            return null;
        return {
            'buffer': _0x1a0dc6,
            'type': _0x5084bd,
            'caption': _0x450d94,
            'mimeType': _0x4d79f8['mimetype'],
            'fileLength': _0x4d79f8['fileLength']
        };
    } catch (_0x3976c4) {
        console['error']('Error\x20handling\x20view\x20once:', _0x3976c4);
        return null;
    }
}
async function getAIResponse(_0x2a006a, _0x3f2cc9, _0x3e336b) {
    try {
        const _0x5d135e = await _0x0_0x45ffdd['getResponse'](_0x2a006a, _0x3e336b, _0x3f2cc9, {
            'senderId': _0x3f2cc9,
            'chatId': _0x3e336b,
            'timestamp': Date['now']()
        });
        return _0x5d135e || 'Je\x20suis\x20là\x20!\x20Comment\x20puis-je\x20vous\x20aider\x20?\x20😊';
    } catch (_0x43084d) {
        console['error']('AI\x20response\x20error:', _0x43084d);
        return 'Désolé,\x20je\x20rencontre\x20un\x20problème\x20technique.\x20Veuillez\x20réessayer.\x20🥲';
    }
}
export async function handleChatbotResponse(_0x369b90, _0x18b2d5, _0x5c5508, _0x266b44, _0x39d3ea) {
    if (!_0x0_0x1514f7['get']('enabled'))
        return;
    const _0x34d1c9 = await loadUserGroupData();
    if (!_0x34d1c9['chatbot'][_0x18b2d5])
        return;
    try {
        const _0x46265c = 'Nova';
        const _0x4a0b5e = _0x369b90['user']['id'];
        const _0x39163e = _0x4a0b5e?.['split'](':')[0x0] || '';
        const _0x176faf = await _0x0_0xa1b03a(_0x39d3ea, _0x369b90, _0x18b2d5);
        const _0x69d351 = _0x5c5508['key']['fromMe'];
        const _0x1abaee = _0x69d351 || _0x176faf;
        const _0xb23c94 = await _0x0_0x542c5d['getBotMode']();
        const _0x1e16eb = _0x0_0x1514f7['get']('mode') || 'private';
        if (_0x1e16eb === 'private' && !_0x1abaee) {
            return;
        }
        const _0x32f846 = ((() => {
            if (_0x1abaee)
                return !![];
            switch (_0xb23c94) {
            case 'public':
                return !![];
            case 'private':
            case 'self':
                return ![];
            case 'groups':
                return _0x18b2d5['endsWith']('@g.us');
            case 'inbox':
                return !_0x18b2d5['endsWith']('@g.us');
            default:
                return !![];
            }
        })());
        if (!_0x32f846)
            return;
        const _0x580f31 = _0x5c5508['message']?.['extendedTextMessage']?.['contextInfo']?.['participant']?.['includes'](_0x39163e);
        const _0x1559af = _0x266b44['toLowerCase']()['trim']();
        const _0x3d1b52 = _0x46265c['toLowerCase']();
        const _0x539f0b = _0x1559af['includes'](_0x3d1b52) || _0x1559af['includes']('@' + _0x3d1b52) || _0x1559af['includes']('@' + _0x39163e);
        const _0x4dc9aa = new RegExp('^' + _0x3d1b52 + '\x5cs+|^@' + _0x3d1b52 + '\x5cs+', 'i')['test'](_0x266b44);
        const _0x295b7c = _0x4dc9aa || _0x539f0b || _0x580f31 || _0x266b44['includes']('@' + _0x39163e);
        if (!_0x295b7c) {
            return;
        }
        let _0x227d18 = _0x266b44;
        const _0x560afe = [
            new RegExp('^' + _0x46265c + '\x5cs+', 'i'),
            new RegExp('^@' + _0x46265c + '\x5cs+', 'i'),
            new RegExp('^' + _0x46265c + '[:]\x5cs+', 'i'),
            new RegExp('^@' + _0x46265c + '[:]\x5cs+', 'i'),
            new RegExp('\x5cs+' + _0x46265c + '\x5cs+', 'i'),
            new RegExp('\x5cs+@' + _0x46265c + '\x5cs+', 'i'),
            new RegExp('\x5cs+' + _0x46265c + '$', 'i'),
            new RegExp('\x5cs+@' + _0x46265c + '$', 'i')
        ];
        for (const _0xf3f435 of _0x560afe) {
            _0x227d18 = _0x227d18['replace'](_0xf3f435, '\x20')['trim']();
        }
        if (_0x580f31 && !_0x295b7c) {
            _0x227d18 = _0x266b44;
        }
        if (!_0x227d18 || _0x227d18['length'] < 0x1) {
            return;
        }
        if (_0x227d18['startsWith']('.') || _0x227d18['startsWith']('$') || _0x227d18['startsWith']('#')) {
            return;
        }
        const _0x5c4e67 = await handleViewOnce(_0x369b90, _0x5c5508);
        if (_0x5c4e67) {
            await _0x369b90['sendMessage'](_0x18b2d5, { 'text': '✅\x20View\x20Once\x20Media\x20Recovered\x0a\x0a📊\x20Type:\x20' + _0x5c4e67['type'] + '\x0a📏\x20Size:\x20' + (_0x5c4e67['fileLength'] / 0x400)['toFixed'](0x2) + '\x20KB' }, { 'quoted': _0x5c5508 });
            if (_0x5c4e67['type'] === 'Image') {
                await _0x369b90['sendMessage'](_0x18b2d5, {
                    'image': _0x5c4e67['buffer'],
                    'caption': '📸\x20' + (_0x5c4e67['caption'] || 'View\x20once\x20image')
                });
            } else if (_0x5c4e67['type'] === 'Video') {
                await _0x369b90['sendMessage'](_0x18b2d5, {
                    'video': _0x5c4e67['buffer'],
                    'caption': '📹\x20' + (_0x5c4e67['caption'] || 'View\x20once\x20video')
                });
            } else if (_0x5c4e67['type'] === 'Audio') {
                await _0x369b90['sendMessage'](_0x18b2d5, {
                    'audio': _0x5c4e67['buffer'],
                    'mimetype': 'audio/mpeg'
                });
            }
            return;
        }
        await _0x369b90['sendPresenceUpdate']('composing', _0x18b2d5);
        await new Promise(_0x1f0ccd => setTimeout(_0x1f0ccd, 0x3e8 + Math['random']() * 0x5dc));
        const _0x4f0c75 = await getAIResponse(_0x227d18, _0x39d3ea, _0x18b2d5);
        if (_0x4f0c75) {
            const _0x1d860e = _0x0_0x1514f7['get']('responsePrefix') || '🤖\x20';
            await _0x369b90['sendMessage'](_0x18b2d5, { 'text': '' + _0x1d860e + _0x4f0c75 }, { 'quoted': _0x5c5508 });
        }
    } catch (_0x341cc9) {
        console['error']('Error\x20in\x20chatbot\x20response:', _0x341cc9['message']);
    }
}