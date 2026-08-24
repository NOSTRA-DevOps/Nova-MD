import _0x0_0x470281 from './chatbotService.js';
import _0x0_0x15ce60 from './chatbotConfig.js';
import _0x0_0x12a6f0 from './isOwner.js';
import _0x0_0x44e682 from './lightweight_store.js';
import { dataFile } from './paths.js';
import _0x0_0x504f24 from 'fs';
import _0x0_0x54dd88 from 'path';
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
            const _0x3b748e = await _0x0_0x44e682['getSetting']('global', 'userGroupData');
            return _0x3b748e || {
                'groups': [],
                'chatbot': {}
            };
        }
        if (!_0x0_0x504f24['existsSync'](USER_GROUP_DATA)) {
            return {
                'groups': [],
                'chatbot': {}
            };
        }
        return JSON['parse'](_0x0_0x504f24['readFileSync'](USER_GROUP_DATA, 'utf-8'));
    } catch (_0x42fcf7) {
        console['error']('Error\x20loading\x20user\x20group\x20data:', _0x42fcf7['message']);
        return {
            'groups': [],
            'chatbot': {}
        };
    }
}
export async function saveUserGroupData(_0xb330bd) {
    try {
        if (HAS_DB) {
            await _0x0_0x44e682['saveSetting']('global', 'userGroupData', _0xb330bd);
        } else {
            const _0xe278b4 = _0x0_0x54dd88['dirname'](USER_GROUP_DATA);
            if (!_0x0_0x504f24['existsSync'](_0xe278b4)) {
                _0x0_0x504f24['mkdirSync'](_0xe278b4, { 'recursive': !![] });
            }
            _0x0_0x504f24['writeFileSync'](USER_GROUP_DATA, JSON['stringify'](_0xb330bd, null, 0x2));
        }
    } catch (_0x28b5e4) {
        console['error']('Error\x20saving\x20user\x20group\x20data:', _0x28b5e4['message']);
    }
}
async function handleViewOnce(_0x11b4b7, _0x470758) {
    try {
        const _0x381716 = _0x470758['message'];
        let _0x461dce = null;
        let _0x364449 = '';
        let _0x46e5d8 = '';
        if (_0x381716?.['viewOnceMessageV2']?.['message']?.['imageMessage']) {
            _0x461dce = _0x381716['viewOnceMessageV2']['message']['imageMessage'];
            _0x364449 = 'Image';
            _0x46e5d8 = _0x461dce['caption'] || '';
        } else if (_0x381716?.['viewOnceMessageV2']?.['message']?.['videoMessage']) {
            _0x461dce = _0x381716['viewOnceMessageV2']['message']['videoMessage'];
            _0x364449 = 'Video';
            _0x46e5d8 = _0x461dce['caption'] || '';
        } else if (_0x381716?.['viewOnceMessageV2']?.['message']?.['audioMessage']) {
            _0x461dce = _0x381716['viewOnceMessageV2']['message']['audioMessage'];
            _0x364449 = 'Audio';
            _0x46e5d8 = '';
        } else if (_0x381716?.['viewOnceMessage']?.['message']?.['imageMessage']) {
            _0x461dce = _0x381716['viewOnceMessage']['message']['imageMessage'];
            _0x364449 = 'Image';
            _0x46e5d8 = _0x461dce['caption'] || '';
        } else if (_0x381716?.['viewOnceMessage']?.['message']?.['videoMessage']) {
            _0x461dce = _0x381716['viewOnceMessage']['message']['videoMessage'];
            _0x364449 = 'Video';
            _0x46e5d8 = _0x461dce['caption'] || '';
        }
        if (!_0x461dce)
            return null;
        const _0x50345f = await _0x11b4b7['downloadMediaMessage'](_0x470758);
        if (!_0x50345f)
            return null;
        return {
            'buffer': _0x50345f,
            'type': _0x364449,
            'caption': _0x46e5d8,
            'mimeType': _0x461dce['mimetype'],
            'fileLength': _0x461dce['fileLength']
        };
    } catch (_0x345a79) {
        console['error']('Error\x20handling\x20view\x20once:', _0x345a79);
        return null;
    }
}
async function getAIResponse(_0x48c741, _0x4eccaa, _0x34d631) {
    try {
        const _0x1789c0 = await _0x0_0x470281['getResponse'](_0x48c741, _0x34d631, _0x4eccaa, {
            'senderId': _0x4eccaa,
            'chatId': _0x34d631,
            'timestamp': Date['now']()
        });
        return _0x1789c0 || 'Je\x20suis\x20là\x20!\x20Comment\x20puis-je\x20vous\x20aider\x20?\x20😊';
    } catch (_0x34de0b) {
        console['error']('AI\x20response\x20error:', _0x34de0b);
        return 'Désolé,\x20je\x20rencontre\x20un\x20problème\x20technique.\x20Veuillez\x20réessayer.\x20🥲';
    }
}
export async function handleChatbotResponse(_0x11bd2c, _0x47e900, _0x2244af, _0x51997a, _0x303beb) {
    if (!_0x0_0x15ce60['get']('enabled'))
        return;
    const _0x572115 = await loadUserGroupData();
    if (!_0x572115['chatbot'][_0x47e900])
        return;
    try {
        const _0xb6697a = 'Nova';
        const _0x1970be = _0x11bd2c['user']['id'];
        const _0xe7d47b = _0x1970be?.['split'](':')[0x0] || '';
        const _0x8c6c4c = await _0x0_0x12a6f0(_0x303beb, _0x11bd2c, _0x47e900);
        const _0x5a3ad8 = _0x2244af['key']['fromMe'];
        const _0x136e78 = _0x5a3ad8 || _0x8c6c4c;
        const _0x5287d6 = await _0x0_0x44e682['getBotMode']();
        const _0x460e03 = _0x0_0x15ce60['get']('mode') || 'private';
        if (_0x460e03 === 'private' && !_0x136e78) {
            return;
        }
        const _0x57ffa2 = ((() => {
            if (_0x136e78)
                return !![];
            switch (_0x5287d6) {
            case 'public':
                return !![];
            case 'private':
            case 'self':
                return ![];
            case 'groups':
                return _0x47e900['endsWith']('@g.us');
            case 'inbox':
                return !_0x47e900['endsWith']('@g.us');
            default:
                return !![];
            }
        })());
        if (!_0x57ffa2)
            return;
        const _0x21f3f8 = _0x2244af['message']?.['extendedTextMessage']?.['contextInfo']?.['participant']?.['includes'](_0xe7d47b);
        const _0x1991e1 = _0x51997a['toLowerCase']()['trim']();
        const _0x37c182 = _0xb6697a['toLowerCase']();
        const _0xfba5bc = _0x1991e1['includes'](_0x37c182) || _0x1991e1['includes']('@' + _0x37c182) || _0x1991e1['includes']('@' + _0xe7d47b);
        const _0xb54ff1 = new RegExp('^' + _0x37c182 + '\x5cs+|^@' + _0x37c182 + '\x5cs+', 'i')['test'](_0x51997a);
        const _0x498ce2 = _0xb54ff1 || _0xfba5bc || _0x21f3f8 || _0x51997a['includes']('@' + _0xe7d47b);
        if (!_0x498ce2) {
            return;
        }
        let _0x225444 = _0x51997a;
        const _0x3487c4 = [
            new RegExp('^' + _0xb6697a + '\x5cs+', 'i'),
            new RegExp('^@' + _0xb6697a + '\x5cs+', 'i'),
            new RegExp('^' + _0xb6697a + '[:]\x5cs+', 'i'),
            new RegExp('^@' + _0xb6697a + '[:]\x5cs+', 'i'),
            new RegExp('\x5cs+' + _0xb6697a + '\x5cs+', 'i'),
            new RegExp('\x5cs+@' + _0xb6697a + '\x5cs+', 'i'),
            new RegExp('\x5cs+' + _0xb6697a + '$', 'i'),
            new RegExp('\x5cs+@' + _0xb6697a + '$', 'i')
        ];
        for (const _0x29a4a4 of _0x3487c4) {
            _0x225444 = _0x225444['replace'](_0x29a4a4, '\x20')['trim']();
        }
        if (_0x21f3f8 && !_0x498ce2) {
            _0x225444 = _0x51997a;
        }
        if (!_0x225444 || _0x225444['length'] < 0x1) {
            return;
        }
        if (_0x225444['startsWith']('.') || _0x225444['startsWith']('$') || _0x225444['startsWith']('#')) {
            return;
        }
        const _0x4259f2 = await handleViewOnce(_0x11bd2c, _0x2244af);
        if (_0x4259f2) {
            await _0x11bd2c['sendMessage'](_0x47e900, { 'text': '✅\x20View\x20Once\x20Media\x20Recovered\x0a\x0a📊\x20Type:\x20' + _0x4259f2['type'] + '\x0a📏\x20Size:\x20' + (_0x4259f2['fileLength'] / 0x400)['toFixed'](0x2) + '\x20KB' }, { 'quoted': _0x2244af });
            if (_0x4259f2['type'] === 'Image') {
                await _0x11bd2c['sendMessage'](_0x47e900, {
                    'image': _0x4259f2['buffer'],
                    'caption': '📸\x20' + (_0x4259f2['caption'] || 'View\x20once\x20image')
                });
            } else if (_0x4259f2['type'] === 'Video') {
                await _0x11bd2c['sendMessage'](_0x47e900, {
                    'video': _0x4259f2['buffer'],
                    'caption': '📹\x20' + (_0x4259f2['caption'] || 'View\x20once\x20video')
                });
            } else if (_0x4259f2['type'] === 'Audio') {
                await _0x11bd2c['sendMessage'](_0x47e900, {
                    'audio': _0x4259f2['buffer'],
                    'mimetype': 'audio/mpeg'
                });
            }
            return;
        }
        await _0x11bd2c['sendPresenceUpdate']('composing', _0x47e900);
        await new Promise(_0x18bb92 => setTimeout(_0x18bb92, 0x3e8 + Math['random']() * 0x5dc));
        const _0x2e2f85 = await getAIResponse(_0x225444, _0x303beb, _0x47e900);
        if (_0x2e2f85) {
            const _0x1cd410 = _0x0_0x15ce60['get']('responsePrefix') || '🤖\x20';
            await _0x11bd2c['sendMessage'](_0x47e900, { 'text': '' + _0x1cd410 + _0x2e2f85 }, { 'quoted': _0x2244af });
        }
    } catch (_0x24ddcd) {
        console['error']('Error\x20in\x20chatbot\x20response:', _0x24ddcd['message']);
    }
}