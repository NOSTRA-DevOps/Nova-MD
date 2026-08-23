import _0x0_0x498fd1 from './chatbotService.js';
import _0x0_0x4b3464 from './chatbotConfig.js';
import _0x0_0x561b61 from './isOwner.js';
import _0x0_0x1741b0 from './lightweight_store.js';
import { dataFile } from './paths.js';
import _0x0_0x21971c from 'fs';
import _0x0_0x1df6f8 from 'path';
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
            const _0x44d2a5 = await _0x0_0x1741b0['getSetting']('global', 'userGroupData');
            return _0x44d2a5 || {
                'groups': [],
                'chatbot': {}
            };
        }
        if (!_0x0_0x21971c['existsSync'](USER_GROUP_DATA)) {
            return {
                'groups': [],
                'chatbot': {}
            };
        }
        return JSON['parse'](_0x0_0x21971c['readFileSync'](USER_GROUP_DATA, 'utf-8'));
    } catch (_0x1e88e5) {
        console['error']('Error\x20loading\x20user\x20group\x20data:', _0x1e88e5['message']);
        return {
            'groups': [],
            'chatbot': {}
        };
    }
}
export async function saveUserGroupData(_0x49becf) {
    try {
        if (HAS_DB) {
            await _0x0_0x1741b0['saveSetting']('global', 'userGroupData', _0x49becf);
        } else {
            const _0xb9f4b1 = _0x0_0x1df6f8['dirname'](USER_GROUP_DATA);
            if (!_0x0_0x21971c['existsSync'](_0xb9f4b1)) {
                _0x0_0x21971c['mkdirSync'](_0xb9f4b1, { 'recursive': !![] });
            }
            _0x0_0x21971c['writeFileSync'](USER_GROUP_DATA, JSON['stringify'](_0x49becf, null, 0x2));
        }
    } catch (_0x37f8bf) {
        console['error']('Error\x20saving\x20user\x20group\x20data:', _0x37f8bf['message']);
    }
}
async function handleViewOnce(_0x14b98c, _0x3eac5b) {
    try {
        const _0x26de5b = _0x3eac5b['message'];
        let _0x44ad01 = null;
        let _0x825258 = '';
        let _0x52311f = '';
        if (_0x26de5b?.['viewOnceMessageV2']?.['message']?.['imageMessage']) {
            _0x44ad01 = _0x26de5b['viewOnceMessageV2']['message']['imageMessage'];
            _0x825258 = 'Image';
            _0x52311f = _0x44ad01['caption'] || '';
        } else if (_0x26de5b?.['viewOnceMessageV2']?.['message']?.['videoMessage']) {
            _0x44ad01 = _0x26de5b['viewOnceMessageV2']['message']['videoMessage'];
            _0x825258 = 'Video';
            _0x52311f = _0x44ad01['caption'] || '';
        } else if (_0x26de5b?.['viewOnceMessageV2']?.['message']?.['audioMessage']) {
            _0x44ad01 = _0x26de5b['viewOnceMessageV2']['message']['audioMessage'];
            _0x825258 = 'Audio';
            _0x52311f = '';
        } else if (_0x26de5b?.['viewOnceMessage']?.['message']?.['imageMessage']) {
            _0x44ad01 = _0x26de5b['viewOnceMessage']['message']['imageMessage'];
            _0x825258 = 'Image';
            _0x52311f = _0x44ad01['caption'] || '';
        } else if (_0x26de5b?.['viewOnceMessage']?.['message']?.['videoMessage']) {
            _0x44ad01 = _0x26de5b['viewOnceMessage']['message']['videoMessage'];
            _0x825258 = 'Video';
            _0x52311f = _0x44ad01['caption'] || '';
        }
        if (!_0x44ad01)
            return null;
        const _0x14d6de = await _0x14b98c['downloadMediaMessage'](_0x3eac5b);
        if (!_0x14d6de)
            return null;
        return {
            'buffer': _0x14d6de,
            'type': _0x825258,
            'caption': _0x52311f,
            'mimeType': _0x44ad01['mimetype'],
            'fileLength': _0x44ad01['fileLength']
        };
    } catch (_0x4db789) {
        console['error']('Error\x20handling\x20view\x20once:', _0x4db789);
        return null;
    }
}
async function getAIResponse(_0x32f5c1, _0x22dad9, _0x2da887) {
    try {
        const _0x4a03b5 = await _0x0_0x498fd1['getResponse'](_0x32f5c1, _0x2da887, _0x22dad9, {
            'senderId': _0x22dad9,
            'chatId': _0x2da887,
            'timestamp': Date['now']()
        });
        return _0x4a03b5 || 'Je\x20suis\x20là\x20!\x20Comment\x20puis-je\x20vous\x20aider\x20?\x20😊';
    } catch (_0x88dc91) {
        console['error']('AI\x20response\x20error:', _0x88dc91);
        return 'Désolé,\x20je\x20rencontre\x20un\x20problème\x20technique.\x20Veuillez\x20réessayer.\x20🥲';
    }
}
export async function handleChatbotResponse(_0x51614f, _0x1733ec, _0x4ad732, _0x5e42e4, _0x2f8676) {
    if (!_0x0_0x4b3464['get']('enabled'))
        return;
    const _0x5e55ca = await loadUserGroupData();
    if (!_0x5e55ca['chatbot'][_0x1733ec])
        return;
    try {
        const _0x2e2c74 = global['botname'] || 'NOVA';
        const _0x576907 = _0x51614f['user']['id'];
        const _0x25f4c2 = _0x576907?.['split'](':')[0x0] || '';
        const _0x59ef37 = await _0x0_0x561b61(_0x2f8676, _0x51614f, _0x1733ec);
        const _0x4d4ddf = _0x4ad732['key']['fromMe'];
        const _0x3db305 = _0x4d4ddf || _0x59ef37;
        const _0x4447e8 = await _0x0_0x1741b0['getBotMode']();
        const _0x2c023c = _0x0_0x4b3464['get']('mode') || 'private';
        if (_0x2c023c === 'private' && !_0x3db305) {
            return;
        }
        const _0x250205 = ((() => {
            if (_0x3db305)
                return !![];
            switch (_0x4447e8) {
            case 'public':
                return !![];
            case 'private':
            case 'self':
                return ![];
            case 'groups':
                return _0x1733ec['endsWith']('@g.us');
            case 'inbox':
                return !_0x1733ec['endsWith']('@g.us');
            default:
                return !![];
            }
        })());
        if (!_0x250205)
            return;
        const _0x1a0425 = new RegExp('^' + _0x2e2c74 + '\x5cs+|^@' + _0x25f4c2 + '\x5cs+', 'i')['test'](_0x5e42e4);
        const _0x1f8324 = _0x4ad732['message']?.['extendedTextMessage']?.['contextInfo']?.['participant']?.['includes'](_0x25f4c2);
        if (!_0x1a0425 && !_0x1f8324)
            return;
        let _0x21b4e6 = _0x5e42e4;
        const _0x1c2b66 = [
            new RegExp('^' + _0x2e2c74 + '\x5cs+', 'i'),
            new RegExp('^@' + _0x25f4c2 + '\x5cs+', 'i'),
            new RegExp('^' + _0x2e2c74 + '[:]\x5cs+', 'i'),
            new RegExp('^@' + _0x25f4c2 + '[:]\x5cs+', 'i')
        ];
        for (const _0x160569 of _0x1c2b66) {
            if (_0x160569['test'](_0x21b4e6)) {
                _0x21b4e6 = _0x21b4e6['replace'](_0x160569, '')['trim']();
                break;
            }
        }
        if (_0x1f8324 && !_0x1a0425) {
            _0x21b4e6 = _0x5e42e4;
        }
        if (!_0x21b4e6 || _0x21b4e6['length'] < 0x1) {
            return;
        }
        const _0x4ed2e0 = await handleViewOnce(_0x51614f, _0x4ad732);
        if (_0x4ed2e0) {
            await _0x51614f['sendMessage'](_0x1733ec, { 'text': '✅\x20View\x20Once\x20Media\x20Recovered\x0a\x0a📊\x20Type:\x20' + _0x4ed2e0['type'] + '\x0a📏\x20Size:\x20' + (_0x4ed2e0['fileLength'] / 0x400)['toFixed'](0x2) + '\x20KB' }, { 'quoted': _0x4ad732 });
            if (_0x4ed2e0['type'] === 'Image') {
                await _0x51614f['sendMessage'](_0x1733ec, {
                    'image': _0x4ed2e0['buffer'],
                    'caption': '📸\x20' + (_0x4ed2e0['caption'] || 'View\x20once\x20image')
                });
            } else if (_0x4ed2e0['type'] === 'Video') {
                await _0x51614f['sendMessage'](_0x1733ec, {
                    'video': _0x4ed2e0['buffer'],
                    'caption': '📹\x20' + (_0x4ed2e0['caption'] || 'View\x20once\x20video')
                });
            } else if (_0x4ed2e0['type'] === 'Audio') {
                await _0x51614f['sendMessage'](_0x1733ec, {
                    'audio': _0x4ed2e0['buffer'],
                    'mimetype': 'audio/mpeg'
                });
            }
            return;
        }
        await _0x51614f['sendPresenceUpdate']('composing', _0x1733ec);
        await new Promise(_0x55325f => setTimeout(_0x55325f, 0x3e8 + Math['random']() * 0x5dc));
        const _0x191912 = await getAIResponse(_0x21b4e6, _0x2f8676, _0x1733ec);
        if (_0x191912) {
            const _0x2d51f3 = _0x0_0x4b3464['get']('responsePrefix') || '🤖\x20';
            await _0x51614f['sendMessage'](_0x1733ec, { 'text': '' + _0x2d51f3 + _0x191912 }, { 'quoted': _0x4ad732 });
        }
    } catch (_0x531f59) {
        console['error']('Error\x20in\x20chatbot\x20response:', _0x531f59['message']);
    }
}