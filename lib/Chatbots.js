import _0x0_0x1932ab from './chatbotService.js';
import _0x0_0x32dac1 from './chatbotConfig.js';
import _0x0_0x5b0c24 from './isOwner.js';
import _0x0_0x41a5e0 from './lightweight_store.js';
import { dataFile } from './paths.js';
import _0x0_0x832622 from 'fs';
import _0x0_0xf43a64 from 'path';
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
            const _0x4435bf = await _0x0_0x41a5e0['getSetting']('global', 'userGroupData');
            return _0x4435bf || {
                'groups': [],
                'chatbot': {}
            };
        }
        if (!_0x0_0x832622['existsSync'](USER_GROUP_DATA)) {
            return {
                'groups': [],
                'chatbot': {}
            };
        }
        return JSON['parse'](_0x0_0x832622['readFileSync'](USER_GROUP_DATA, 'utf-8'));
    } catch (_0x112958) {
        console['error']('Error\x20loading\x20user\x20group\x20data:', _0x112958['message']);
        return {
            'groups': [],
            'chatbot': {}
        };
    }
}
export async function saveUserGroupData(_0x981523) {
    try {
        if (HAS_DB) {
            await _0x0_0x41a5e0['saveSetting']('global', 'userGroupData', _0x981523);
        } else {
            const _0x52d097 = _0x0_0xf43a64['dirname'](USER_GROUP_DATA);
            if (!_0x0_0x832622['existsSync'](_0x52d097)) {
                _0x0_0x832622['mkdirSync'](_0x52d097, { 'recursive': !![] });
            }
            _0x0_0x832622['writeFileSync'](USER_GROUP_DATA, JSON['stringify'](_0x981523, null, 0x2));
        }
    } catch (_0x237297) {
        console['error']('Error\x20saving\x20user\x20group\x20data:', _0x237297['message']);
    }
}
async function handleViewOnce(_0x4d0d50, _0x562a5a) {
    try {
        const _0x289499 = _0x562a5a['message'];
        let _0x230e75 = null;
        let _0x5e442e = '';
        let _0x5ea4e6 = '';
        if (_0x289499?.['viewOnceMessageV2']?.['message']?.['imageMessage']) {
            _0x230e75 = _0x289499['viewOnceMessageV2']['message']['imageMessage'];
            _0x5e442e = 'Image';
            _0x5ea4e6 = _0x230e75['caption'] || '';
        } else if (_0x289499?.['viewOnceMessageV2']?.['message']?.['videoMessage']) {
            _0x230e75 = _0x289499['viewOnceMessageV2']['message']['videoMessage'];
            _0x5e442e = 'Video';
            _0x5ea4e6 = _0x230e75['caption'] || '';
        } else if (_0x289499?.['viewOnceMessageV2']?.['message']?.['audioMessage']) {
            _0x230e75 = _0x289499['viewOnceMessageV2']['message']['audioMessage'];
            _0x5e442e = 'Audio';
            _0x5ea4e6 = '';
        } else if (_0x289499?.['viewOnceMessage']?.['message']?.['imageMessage']) {
            _0x230e75 = _0x289499['viewOnceMessage']['message']['imageMessage'];
            _0x5e442e = 'Image';
            _0x5ea4e6 = _0x230e75['caption'] || '';
        } else if (_0x289499?.['viewOnceMessage']?.['message']?.['videoMessage']) {
            _0x230e75 = _0x289499['viewOnceMessage']['message']['videoMessage'];
            _0x5e442e = 'Video';
            _0x5ea4e6 = _0x230e75['caption'] || '';
        }
        if (!_0x230e75)
            return null;
        const _0x52ed7a = await _0x4d0d50['downloadMediaMessage'](_0x562a5a);
        if (!_0x52ed7a)
            return null;
        return {
            'buffer': _0x52ed7a,
            'type': _0x5e442e,
            'caption': _0x5ea4e6,
            'mimeType': _0x230e75['mimetype'],
            'fileLength': _0x230e75['fileLength']
        };
    } catch (_0x4cbcef) {
        console['error']('Error\x20handling\x20view\x20once:', _0x4cbcef);
        return null;
    }
}
async function getAIResponse(_0x4e4834, _0x209228, _0x2bcdd2) {
    try {
        const _0x569556 = await _0x0_0x1932ab['getResponse'](_0x4e4834, _0x2bcdd2, _0x209228, {
            'senderId': _0x209228,
            'chatId': _0x2bcdd2,
            'timestamp': Date['now']()
        });
        return _0x569556 || 'Je\x20suis\x20là\x20!\x20Comment\x20puis-je\x20vous\x20aider\x20?\x20😊';
    } catch (_0x2f3f15) {
        console['error']('AI\x20response\x20error:', _0x2f3f15);
        return 'Désolé,\x20je\x20rencontre\x20un\x20problème\x20technique.\x20Veuillez\x20réessayer.\x20🥲';
    }
}
export async function handleChatbotResponse(_0xb98097, _0x22d50a, _0x1e7ac0, _0x26edd5, _0x4be969) {
    if (!_0x0_0x32dac1['get']('enabled'))
        return;
    const _0x1c4cfc = await loadUserGroupData();
    if (!_0x1c4cfc['chatbot'][_0x22d50a])
        return;
    try {
        const _0x3dea0b = 'Nova';
        const _0x40bf13 = _0xb98097['user']['id'];
        const _0x4e81bb = _0x40bf13?.['split'](':')[0x0] || '';
        const _0x21d613 = await _0x0_0x5b0c24(_0x4be969, _0xb98097, _0x22d50a);
        const _0x4d45d0 = _0x1e7ac0['key']['fromMe'];
        const _0x36432b = _0x4d45d0 || _0x21d613;
        const _0x3a7347 = await _0x0_0x41a5e0['getBotMode']();
        const _0x2e5b64 = _0x0_0x32dac1['get']('mode') || 'private';
        if (_0x2e5b64 === 'private' && !_0x36432b) {
            return;
        }
        const _0x5696d3 = ((() => {
            if (_0x36432b)
                return !![];
            switch (_0x3a7347) {
            case 'public':
                return !![];
            case 'private':
            case 'self':
                return ![];
            case 'groups':
                return _0x22d50a['endsWith']('@g.us');
            case 'inbox':
                return !_0x22d50a['endsWith']('@g.us');
            default:
                return !![];
            }
        })());
        if (!_0x5696d3)
            return;
        const _0x5862dc = !_0x22d50a['endsWith']('@g.us');
        const _0xf98021 = _0x1e7ac0['message']?.['extendedTextMessage']?.['contextInfo']?.['participant']?.['includes'](_0x4e81bb);
        const _0x1426ef = _0x26edd5['toLowerCase']()['trim']();
        const _0x33ce4f = _0x3dea0b['toLowerCase']();
        const _0xc4f943 = _0x1426ef['includes'](_0x33ce4f) || _0x1426ef['includes']('@' + _0x33ce4f) || _0x1426ef['includes']('@' + _0x4e81bb);
        const _0x331ebe = new RegExp('^' + _0x33ce4f + '\x5cs+|^@' + _0x33ce4f + '\x5cs+', 'i')['test'](_0x26edd5);
        if (_0x5862dc) {
            const _0xd1f2b0 = !![];
            if (!_0xd1f2b0)
                return;
            let _0x327e7f = _0x26edd5;
            const _0x5e53c3 = [
                new RegExp('^' + _0x3dea0b + '\x5cs+', 'i'),
                new RegExp('^@' + _0x3dea0b + '\x5cs+', 'i'),
                new RegExp('^' + _0x3dea0b + '[:]\x5cs+', 'i'),
                new RegExp('^@' + _0x3dea0b + '[:]\x5cs+', 'i'),
                new RegExp('\x5cs+' + _0x3dea0b + '\x5cs+', 'i'),
                new RegExp('\x5cs+@' + _0x3dea0b + '\x5cs+', 'i'),
                new RegExp('\x5cs+' + _0x3dea0b + '$', 'i'),
                new RegExp('\x5cs+@' + _0x3dea0b + '$', 'i')
            ];
            for (const _0x5c3928 of _0x5e53c3) {
                _0x327e7f = _0x327e7f['replace'](_0x5c3928, '\x20')['trim']();
            }
            if (!_0x327e7f || _0x327e7f['length'] < 0x1) {
                _0x327e7f = _0x26edd5;
            }
            await _0xb98097['sendPresenceUpdate']('composing', _0x22d50a);
            await new Promise(_0x1821ca => setTimeout(_0x1821ca, 0x3e8 + Math['random']() * 0x5dc));
            const _0x13c384 = await getAIResponse(_0x327e7f, _0x4be969, _0x22d50a);
            if (_0x13c384) {
                const _0x44d524 = _0x0_0x32dac1['get']('responsePrefix') || '🤖\x20';
                await _0xb98097['sendMessage'](_0x22d50a, { 'text': '' + _0x44d524 + _0x13c384 }, { 'quoted': _0x1e7ac0 });
            }
            return;
        }
        const _0x284a77 = _0x331ebe || _0xc4f943 || _0xf98021 || _0x26edd5['includes']('@' + _0x4e81bb);
        if (!_0x284a77) {
            return;
        }
        let _0x7d894d = _0x26edd5;
        const _0x221edb = [
            new RegExp('^' + _0x3dea0b + '\x5cs+', 'i'),
            new RegExp('^@' + _0x3dea0b + '\x5cs+', 'i'),
            new RegExp('^' + _0x3dea0b + '[:]\x5cs+', 'i'),
            new RegExp('^@' + _0x3dea0b + '[:]\x5cs+', 'i'),
            new RegExp('\x5cs+' + _0x3dea0b + '\x5cs+', 'i'),
            new RegExp('\x5cs+@' + _0x3dea0b + '\x5cs+', 'i'),
            new RegExp('\x5cs+' + _0x3dea0b + '$', 'i'),
            new RegExp('\x5cs+@' + _0x3dea0b + '$', 'i')
        ];
        for (const _0x39df1d of _0x221edb) {
            _0x7d894d = _0x7d894d['replace'](_0x39df1d, '\x20')['trim']();
        }
        if (_0xf98021 && !_0x284a77) {
            _0x7d894d = _0x26edd5;
        }
        if (!_0x7d894d || _0x7d894d['length'] < 0x1) {
            return;
        }
        const _0x41f215 = await handleViewOnce(_0xb98097, _0x1e7ac0);
        if (_0x41f215) {
            await _0xb98097['sendMessage'](_0x22d50a, { 'text': '✅\x20View\x20Once\x20Media\x20Recovered\x0a\x0a📊\x20Type:\x20' + _0x41f215['type'] + '\x0a📏\x20Size:\x20' + (_0x41f215['fileLength'] / 0x400)['toFixed'](0x2) + '\x20KB' }, { 'quoted': _0x1e7ac0 });
            if (_0x41f215['type'] === 'Image') {
                await _0xb98097['sendMessage'](_0x22d50a, {
                    'image': _0x41f215['buffer'],
                    'caption': '📸\x20' + (_0x41f215['caption'] || 'View\x20once\x20image')
                });
            } else if (_0x41f215['type'] === 'Video') {
                await _0xb98097['sendMessage'](_0x22d50a, {
                    'video': _0x41f215['buffer'],
                    'caption': '📹\x20' + (_0x41f215['caption'] || 'View\x20once\x20video')
                });
            } else if (_0x41f215['type'] === 'Audio') {
                await _0xb98097['sendMessage'](_0x22d50a, {
                    'audio': _0x41f215['buffer'],
                    'mimetype': 'audio/mpeg'
                });
            }
            return;
        }
        await _0xb98097['sendPresenceUpdate']('composing', _0x22d50a);
        await new Promise(_0x33854b => setTimeout(_0x33854b, 0x3e8 + Math['random']() * 0x5dc));
        const _0x49bbe4 = await getAIResponse(_0x7d894d, _0x4be969, _0x22d50a);
        if (_0x49bbe4) {
            const _0x12974a = _0x0_0x32dac1['get']('responsePrefix') || '🤖\x20';
            await _0xb98097['sendMessage'](_0x22d50a, { 'text': '' + _0x12974a + _0x49bbe4 }, { 'quoted': _0x1e7ac0 });
        }
    } catch (_0xf2242c) {
        console['error']('Error\x20in\x20chatbot\x20response:', _0xf2242c['message']);
    }
}