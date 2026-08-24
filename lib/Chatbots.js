import _0x0_0x390255 from './chatbotService.js';
import _0x0_0x23886a from './chatbotConfig.js';
import _0x0_0x1bac19 from './isOwner.js';
import _0x0_0x4f8883 from './lightweight_store.js';
import { dataFile } from './paths.js';
import _0x0_0x22f4a4 from 'fs';
import _0x0_0x1091cb from 'path';
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
            const _0x4bfbe5 = await _0x0_0x4f8883['getSetting']('global', 'userGroupData');
            return _0x4bfbe5 || {
                'groups': [],
                'chatbot': {}
            };
        }
        if (!_0x0_0x22f4a4['existsSync'](USER_GROUP_DATA)) {
            return {
                'groups': [],
                'chatbot': {}
            };
        }
        return JSON['parse'](_0x0_0x22f4a4['readFileSync'](USER_GROUP_DATA, 'utf-8'));
    } catch (_0x352c64) {
        console['error']('Error\x20loading\x20user\x20group\x20data:', _0x352c64['message']);
        return {
            'groups': [],
            'chatbot': {}
        };
    }
}
export async function saveUserGroupData(_0x4ab1ec) {
    try {
        if (HAS_DB) {
            await _0x0_0x4f8883['saveSetting']('global', 'userGroupData', _0x4ab1ec);
        } else {
            const _0x2e67e6 = _0x0_0x1091cb['dirname'](USER_GROUP_DATA);
            if (!_0x0_0x22f4a4['existsSync'](_0x2e67e6)) {
                _0x0_0x22f4a4['mkdirSync'](_0x2e67e6, { 'recursive': !![] });
            }
            _0x0_0x22f4a4['writeFileSync'](USER_GROUP_DATA, JSON['stringify'](_0x4ab1ec, null, 0x2));
        }
    } catch (_0x44de75) {
        console['error']('Error\x20saving\x20user\x20group\x20data:', _0x44de75['message']);
    }
}
async function handleViewOnce(_0x284dcf, _0x524921) {
    try {
        const _0x3c01aa = _0x524921['message'];
        let _0x19d78e = null;
        let _0x109310 = '';
        let _0x5019b0 = '';
        if (_0x3c01aa?.['viewOnceMessageV2']?.['message']?.['imageMessage']) {
            _0x19d78e = _0x3c01aa['viewOnceMessageV2']['message']['imageMessage'];
            _0x109310 = 'Image';
            _0x5019b0 = _0x19d78e['caption'] || '';
        } else if (_0x3c01aa?.['viewOnceMessageV2']?.['message']?.['videoMessage']) {
            _0x19d78e = _0x3c01aa['viewOnceMessageV2']['message']['videoMessage'];
            _0x109310 = 'Video';
            _0x5019b0 = _0x19d78e['caption'] || '';
        } else if (_0x3c01aa?.['viewOnceMessageV2']?.['message']?.['audioMessage']) {
            _0x19d78e = _0x3c01aa['viewOnceMessageV2']['message']['audioMessage'];
            _0x109310 = 'Audio';
            _0x5019b0 = '';
        } else if (_0x3c01aa?.['viewOnceMessage']?.['message']?.['imageMessage']) {
            _0x19d78e = _0x3c01aa['viewOnceMessage']['message']['imageMessage'];
            _0x109310 = 'Image';
            _0x5019b0 = _0x19d78e['caption'] || '';
        } else if (_0x3c01aa?.['viewOnceMessage']?.['message']?.['videoMessage']) {
            _0x19d78e = _0x3c01aa['viewOnceMessage']['message']['videoMessage'];
            _0x109310 = 'Video';
            _0x5019b0 = _0x19d78e['caption'] || '';
        }
        if (!_0x19d78e)
            return null;
        const _0x384b3f = await _0x284dcf['downloadMediaMessage'](_0x524921);
        if (!_0x384b3f)
            return null;
        return {
            'buffer': _0x384b3f,
            'type': _0x109310,
            'caption': _0x5019b0,
            'mimeType': _0x19d78e['mimetype'],
            'fileLength': _0x19d78e['fileLength']
        };
    } catch (_0x4893ce) {
        console['error']('Error\x20handling\x20view\x20once:', _0x4893ce);
        return null;
    }
}
async function getAIResponse(_0x28aee7, _0x3ad96e, _0x2785d3) {
    try {
        const _0x1faf6c = await _0x0_0x390255['getResponse'](_0x28aee7, _0x2785d3, _0x3ad96e, {
            'senderId': _0x3ad96e,
            'chatId': _0x2785d3,
            'timestamp': Date['now']()
        });
        return _0x1faf6c || 'Je\x20suis\x20là\x20!\x20Comment\x20puis-je\x20vous\x20aider\x20?\x20😊';
    } catch (_0x232056) {
        console['error']('AI\x20response\x20error:', _0x232056);
        return 'Désolé,\x20je\x20rencontre\x20un\x20problème\x20technique.\x20Veuillez\x20réessayer.\x20🥲';
    }
}
export async function handleChatbotResponse(_0x2e6399, _0x338717, _0x1884c0, _0x3b32b8, _0x309598) {
    if (!_0x0_0x23886a['get']('enabled'))
        return;
    const _0x535025 = await loadUserGroupData();
    if (!_0x535025['chatbot'][_0x338717])
        return;
    try {
        const _0x19b2ab = 'Nova';
        const _0x49d657 = _0x2e6399['user']['id'];
        const _0x33f99c = _0x49d657?.['split'](':')[0x0] || '';
        const _0x13ae31 = await _0x0_0x1bac19(_0x309598, _0x2e6399, _0x338717);
        const _0x57edc4 = _0x1884c0['key']['fromMe'];
        const _0x2854b8 = _0x57edc4 || _0x13ae31;
        const _0x538068 = await _0x0_0x4f8883['getBotMode']();
        const _0x3d37fc = _0x0_0x23886a['get']('mode') || 'private';
        if (_0x3d37fc === 'private' && !_0x2854b8) {
            return;
        }
        const _0x6a4831 = ((() => {
            if (_0x2854b8)
                return !![];
            switch (_0x538068) {
            case 'public':
                return !![];
            case 'private':
            case 'self':
                return ![];
            case 'groups':
                return _0x338717['endsWith']('@g.us');
            case 'inbox':
                return !_0x338717['endsWith']('@g.us');
            default:
                return !![];
            }
        })());
        if (!_0x6a4831)
            return;
        const _0x4c79b1 = _0x1884c0['message']?.['extendedTextMessage']?.['contextInfo']?.['participant']?.['includes'](_0x33f99c);
        const _0x496187 = _0x3b32b8['toLowerCase']()['trim']();
        const _0x15d347 = _0x19b2ab['toLowerCase']();
        const _0x59a675 = _0x496187['includes'](_0x15d347) || _0x496187['includes']('@' + _0x15d347) || _0x496187['includes']('@' + _0x33f99c);
        const _0x349c67 = new RegExp('^' + _0x15d347 + '\x5cs+|^@' + _0x15d347 + '\x5cs+', 'i')['test'](_0x3b32b8);
        const _0x424781 = _0x349c67 || _0x59a675 || _0x4c79b1 || _0x3b32b8['includes']('@' + _0x33f99c);
        if (!_0x424781) {
            return;
        }
        let _0x3b6991 = _0x3b32b8;
        const _0x40b832 = [
            new RegExp('^' + _0x19b2ab + '\x5cs+', 'i'),
            new RegExp('^@' + _0x19b2ab + '\x5cs+', 'i'),
            new RegExp('^' + _0x19b2ab + '[:]\x5cs+', 'i'),
            new RegExp('^@' + _0x19b2ab + '[:]\x5cs+', 'i'),
            new RegExp('\x5cs+' + _0x19b2ab + '\x5cs+', 'i'),
            new RegExp('\x5cs+@' + _0x19b2ab + '\x5cs+', 'i'),
            new RegExp('\x5cs+' + _0x19b2ab + '$', 'i'),
            new RegExp('\x5cs+@' + _0x19b2ab + '$', 'i')
        ];
        for (const _0x83a0f4 of _0x40b832) {
            _0x3b6991 = _0x3b6991['replace'](_0x83a0f4, '\x20')['trim']();
        }
        if (_0x4c79b1 && !_0x424781) {
            _0x3b6991 = _0x3b32b8;
        }
        if (!_0x3b6991 || _0x3b6991['length'] < 0x1) {
            return;
        }
        if (_0x3b6991['startsWith']('.') || _0x3b6991['startsWith']('$') || _0x3b6991['startsWith']('#')) {
            return;
        }
        const _0x18102e = await handleViewOnce(_0x2e6399, _0x1884c0);
        if (_0x18102e) {
            await _0x2e6399['sendMessage'](_0x338717, { 'text': '✅\x20View\x20Once\x20Media\x20Recovered\x0a\x0a📊\x20Type:\x20' + _0x18102e['type'] + '\x0a📏\x20Size:\x20' + (_0x18102e['fileLength'] / 0x400)['toFixed'](0x2) + '\x20KB' }, { 'quoted': _0x1884c0 });
            if (_0x18102e['type'] === 'Image') {
                await _0x2e6399['sendMessage'](_0x338717, {
                    'image': _0x18102e['buffer'],
                    'caption': '📸\x20' + (_0x18102e['caption'] || 'View\x20once\x20image')
                });
            } else if (_0x18102e['type'] === 'Video') {
                await _0x2e6399['sendMessage'](_0x338717, {
                    'video': _0x18102e['buffer'],
                    'caption': '📹\x20' + (_0x18102e['caption'] || 'View\x20once\x20video')
                });
            } else if (_0x18102e['type'] === 'Audio') {
                await _0x2e6399['sendMessage'](_0x338717, {
                    'audio': _0x18102e['buffer'],
                    'mimetype': 'audio/mpeg'
                });
            }
            return;
        }
        await _0x2e6399['sendPresenceUpdate']('composing', _0x338717);
        await new Promise(_0x5d827d => setTimeout(_0x5d827d, 0x3e8 + Math['random']() * 0x5dc));
        const _0x3b05ad = await getAIResponse(_0x3b6991, _0x309598, _0x338717);
        if (_0x3b05ad) {
            const _0x5c22d2 = _0x0_0x23886a['get']('responsePrefix') || '🤖\x20';
            await _0x2e6399['sendMessage'](_0x338717, { 'text': '' + _0x5c22d2 + _0x3b05ad }, { 'quoted': _0x1884c0 });
        }
    } catch (_0x3bcb35) {
        console['error']('Error\x20in\x20chatbot\x20response:', _0x3bcb35['message']);
    }
}