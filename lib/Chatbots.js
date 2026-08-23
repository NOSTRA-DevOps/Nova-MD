import _0x0_0x4edb0c from './chatbotService.js';
import _0x0_0x598734 from './chatbotConfig.js';
import _0x0_0x2c9f9b from './isOwner.js';
import _0x0_0x46dfd6 from './lightweight_store.js';
import { dataFile } from './paths.js';
import _0x0_0x1fe6cc from 'fs';
import _0x0_0x16d98d from 'path';
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
            const _0x4655a3 = await _0x0_0x46dfd6['getSetting']('global', 'userGroupData');
            return _0x4655a3 || {
                'groups': [],
                'chatbot': {}
            };
        }
        if (!_0x0_0x1fe6cc['existsSync'](USER_GROUP_DATA)) {
            return {
                'groups': [],
                'chatbot': {}
            };
        }
        return JSON['parse'](_0x0_0x1fe6cc['readFileSync'](USER_GROUP_DATA, 'utf-8'));
    } catch (_0xb90363) {
        console['error']('Error\x20loading\x20user\x20group\x20data:', _0xb90363['message']);
        return {
            'groups': [],
            'chatbot': {}
        };
    }
}
export async function saveUserGroupData(_0x502114) {
    try {
        if (HAS_DB) {
            await _0x0_0x46dfd6['saveSetting']('global', 'userGroupData', _0x502114);
        } else {
            const _0x57d250 = _0x0_0x16d98d['dirname'](USER_GROUP_DATA);
            if (!_0x0_0x1fe6cc['existsSync'](_0x57d250)) {
                _0x0_0x1fe6cc['mkdirSync'](_0x57d250, { 'recursive': !![] });
            }
            _0x0_0x1fe6cc['writeFileSync'](USER_GROUP_DATA, JSON['stringify'](_0x502114, null, 0x2));
        }
    } catch (_0x22b856) {
        console['error']('Error\x20saving\x20user\x20group\x20data:', _0x22b856['message']);
    }
}
async function handleViewOnce(_0x416113, _0x2836e9) {
    try {
        const _0x1485ca = _0x2836e9['message'];
        let _0x5d4cfe = null;
        let _0x53eed1 = '';
        let _0x19c810 = '';
        if (_0x1485ca?.['viewOnceMessageV2']?.['message']?.['imageMessage']) {
            _0x5d4cfe = _0x1485ca['viewOnceMessageV2']['message']['imageMessage'];
            _0x53eed1 = 'Image';
            _0x19c810 = _0x5d4cfe['caption'] || '';
        } else if (_0x1485ca?.['viewOnceMessageV2']?.['message']?.['videoMessage']) {
            _0x5d4cfe = _0x1485ca['viewOnceMessageV2']['message']['videoMessage'];
            _0x53eed1 = 'Video';
            _0x19c810 = _0x5d4cfe['caption'] || '';
        } else if (_0x1485ca?.['viewOnceMessageV2']?.['message']?.['audioMessage']) {
            _0x5d4cfe = _0x1485ca['viewOnceMessageV2']['message']['audioMessage'];
            _0x53eed1 = 'Audio';
            _0x19c810 = '';
        } else if (_0x1485ca?.['viewOnceMessage']?.['message']?.['imageMessage']) {
            _0x5d4cfe = _0x1485ca['viewOnceMessage']['message']['imageMessage'];
            _0x53eed1 = 'Image';
            _0x19c810 = _0x5d4cfe['caption'] || '';
        } else if (_0x1485ca?.['viewOnceMessage']?.['message']?.['videoMessage']) {
            _0x5d4cfe = _0x1485ca['viewOnceMessage']['message']['videoMessage'];
            _0x53eed1 = 'Video';
            _0x19c810 = _0x5d4cfe['caption'] || '';
        }
        if (!_0x5d4cfe)
            return null;
        const _0x44c866 = await _0x416113['downloadMediaMessage'](_0x2836e9);
        if (!_0x44c866)
            return null;
        return {
            'buffer': _0x44c866,
            'type': _0x53eed1,
            'caption': _0x19c810,
            'mimeType': _0x5d4cfe['mimetype'],
            'fileLength': _0x5d4cfe['fileLength']
        };
    } catch (_0x3a20bb) {
        console['error']('Error\x20handling\x20view\x20once:', _0x3a20bb);
        return null;
    }
}
async function getAIResponse(_0x440510, _0x44ad51, _0x8d7b19) {
    try {
        const _0x216335 = await _0x0_0x4edb0c['getResponse'](_0x440510, _0x8d7b19, _0x44ad51, {
            'senderId': _0x44ad51,
            'chatId': _0x8d7b19,
            'timestamp': Date['now']()
        });
        return _0x216335 || 'Je\x20suis\x20là\x20!\x20Comment\x20puis-je\x20vous\x20aider\x20?\x20😊';
    } catch (_0x36e0d7) {
        console['error']('AI\x20response\x20error:', _0x36e0d7);
        return 'Désolé,\x20je\x20rencontre\x20un\x20problème\x20technique.\x20Veuillez\x20réessayer.\x20🥲';
    }
}
export async function handleChatbotResponse(_0x2f0bf1, _0x4b7fda, _0x3a2bdf, _0x54a63e, _0x507f4c) {
    if (!_0x0_0x598734['get']('enabled'))
        return;
    const _0x49edd8 = await loadUserGroupData();
    if (!_0x49edd8['chatbot'][_0x4b7fda])
        return;
    try {
        const _0x5b2d51 = 'Nova';
        const _0x25d95a = _0x2f0bf1['user']['id'];
        const _0x3b0d28 = _0x25d95a?.['split'](':')[0x0] || '';
        const _0xdee50a = await _0x0_0x2c9f9b(_0x507f4c, _0x2f0bf1, _0x4b7fda);
        const _0x2c7c72 = _0x3a2bdf['key']['fromMe'];
        const _0x59d481 = _0x2c7c72 || _0xdee50a;
        const _0x3ea4e0 = await _0x0_0x46dfd6['getBotMode']();
        const _0x1866ba = _0x0_0x598734['get']('mode') || 'private';
        if (_0x1866ba === 'private' && !_0x59d481) {
            return;
        }
        const _0x2e54c6 = ((() => {
            if (_0x59d481)
                return !![];
            switch (_0x3ea4e0) {
            case 'public':
                return !![];
            case 'private':
            case 'self':
                return ![];
            case 'groups':
                return _0x4b7fda['endsWith']('@g.us');
            case 'inbox':
                return !_0x4b7fda['endsWith']('@g.us');
            default:
                return !![];
            }
        })());
        if (!_0x2e54c6)
            return;
        const _0x2a38e6 = _0x3a2bdf['message']?.['extendedTextMessage']?.['contextInfo']?.['participant']?.['includes'](_0x3b0d28);
        const _0x284564 = _0x54a63e['toLowerCase']()['trim']();
        const _0x49c3b4 = _0x5b2d51['toLowerCase']();
        const _0x2300cb = _0x284564['includes'](_0x49c3b4) || _0x284564['includes']('@' + _0x49c3b4) || _0x284564['includes']('@' + _0x3b0d28);
        const _0x86e0b3 = new RegExp('^' + _0x49c3b4 + '\x5cs+|^@' + _0x49c3b4 + '\x5cs+', 'i')['test'](_0x54a63e);
        const _0x13fe6c = _0x86e0b3 || _0x2300cb || _0x2a38e6 || _0x54a63e['includes']('@' + _0x3b0d28);
        if (!_0x13fe6c) {
            return;
        }
        let _0x59657f = _0x54a63e;
        const _0x5bb351 = [
            new RegExp('^' + _0x5b2d51 + '\x5cs+', 'i'),
            new RegExp('^@' + _0x5b2d51 + '\x5cs+', 'i'),
            new RegExp('^' + _0x5b2d51 + '[:]\x5cs+', 'i'),
            new RegExp('^@' + _0x5b2d51 + '[:]\x5cs+', 'i'),
            new RegExp('\x5cs+' + _0x5b2d51 + '\x5cs+', 'i'),
            new RegExp('\x5cs+@' + _0x5b2d51 + '\x5cs+', 'i'),
            new RegExp('\x5cs+' + _0x5b2d51 + '$', 'i'),
            new RegExp('\x5cs+@' + _0x5b2d51 + '$', 'i')
        ];
        for (const _0x33767c of _0x5bb351) {
            _0x59657f = _0x59657f['replace'](_0x33767c, '\x20')['trim']();
        }
        if (_0x2a38e6 && !_0x13fe6c) {
            _0x59657f = _0x54a63e;
        }
        if (!_0x59657f || _0x59657f['length'] < 0x1) {
            return;
        }
        if (_0x59657f['startsWith']('.') || _0x59657f['startsWith']('$') || _0x59657f['startsWith']('#')) {
            return;
        }
        const _0x1990dc = await handleViewOnce(_0x2f0bf1, _0x3a2bdf);
        if (_0x1990dc) {
            await _0x2f0bf1['sendMessage'](_0x4b7fda, { 'text': '✅\x20View\x20Once\x20Media\x20Recovered\x0a\x0a📊\x20Type:\x20' + _0x1990dc['type'] + '\x0a📏\x20Size:\x20' + (_0x1990dc['fileLength'] / 0x400)['toFixed'](0x2) + '\x20KB' }, { 'quoted': _0x3a2bdf });
            if (_0x1990dc['type'] === 'Image') {
                await _0x2f0bf1['sendMessage'](_0x4b7fda, {
                    'image': _0x1990dc['buffer'],
                    'caption': '📸\x20' + (_0x1990dc['caption'] || 'View\x20once\x20image')
                });
            } else if (_0x1990dc['type'] === 'Video') {
                await _0x2f0bf1['sendMessage'](_0x4b7fda, {
                    'video': _0x1990dc['buffer'],
                    'caption': '📹\x20' + (_0x1990dc['caption'] || 'View\x20once\x20video')
                });
            } else if (_0x1990dc['type'] === 'Audio') {
                await _0x2f0bf1['sendMessage'](_0x4b7fda, {
                    'audio': _0x1990dc['buffer'],
                    'mimetype': 'audio/mpeg'
                });
            }
            return;
        }
        await _0x2f0bf1['sendPresenceUpdate']('composing', _0x4b7fda);
        await new Promise(_0x1409a9 => setTimeout(_0x1409a9, 0x3e8 + Math['random']() * 0x5dc));
        const _0x9f4ff = await getAIResponse(_0x59657f, _0x507f4c, _0x4b7fda);
        if (_0x9f4ff) {
            const _0x4f4b54 = _0x0_0x598734['get']('responsePrefix') || '🤖\x20';
            await _0x2f0bf1['sendMessage'](_0x4b7fda, { 'text': '' + _0x4f4b54 + _0x9f4ff }, { 'quoted': _0x3a2bdf });
        }
    } catch (_0x53a3fd) {
        console['error']('Error\x20in\x20chatbot\x20response:', _0x53a3fd['message']);
    }
}