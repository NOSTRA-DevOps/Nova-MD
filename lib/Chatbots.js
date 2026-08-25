import _0x0_0x39f5ad from './chatbotService.js';
import _0x0_0x3bc31b from './chatbotConfig.js';
import _0x0_0x69db08 from './isOwner.js';
import _0x0_0x47546b from './lightweight_store.js';
import { dataFile } from './paths.js';
import _0x0_0x4c03d2 from 'fs';
import _0x0_0x4bc782 from 'path';
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
            const _0x3eb6ae = await _0x0_0x47546b['getSetting']('global', 'userGroupData');
            return _0x3eb6ae || {
                'groups': [],
                'chatbot': {}
            };
        }
        if (!_0x0_0x4c03d2['existsSync'](USER_GROUP_DATA)) {
            return {
                'groups': [],
                'chatbot': {}
            };
        }
        return JSON['parse'](_0x0_0x4c03d2['readFileSync'](USER_GROUP_DATA, 'utf-8'));
    } catch (_0x9d76f3) {
        console['error']('Error\x20loading\x20user\x20group\x20data:', _0x9d76f3['message']);
        return {
            'groups': [],
            'chatbot': {}
        };
    }
}
export async function saveUserGroupData(_0x6914ff) {
    try {
        if (HAS_DB) {
            await _0x0_0x47546b['saveSetting']('global', 'userGroupData', _0x6914ff);
        } else {
            const _0x1af2bf = _0x0_0x4bc782['dirname'](USER_GROUP_DATA);
            if (!_0x0_0x4c03d2['existsSync'](_0x1af2bf)) {
                _0x0_0x4c03d2['mkdirSync'](_0x1af2bf, { 'recursive': !![] });
            }
            _0x0_0x4c03d2['writeFileSync'](USER_GROUP_DATA, JSON['stringify'](_0x6914ff, null, 0x2));
        }
    } catch (_0x3d3d5b) {
        console['error']('Error\x20saving\x20user\x20group\x20data:', _0x3d3d5b['message']);
    }
}
async function handleViewOnce(_0x319400, _0x331ad0) {
    try {
        const _0x2c5ef5 = _0x331ad0['message'];
        let _0x33b74b = null;
        let _0x61c4bb = '';
        let _0x212340 = '';
        if (_0x2c5ef5?.['viewOnceMessageV2']?.['message']?.['imageMessage']) {
            _0x33b74b = _0x2c5ef5['viewOnceMessageV2']['message']['imageMessage'];
            _0x61c4bb = 'Image';
            _0x212340 = _0x33b74b['caption'] || '';
        } else if (_0x2c5ef5?.['viewOnceMessageV2']?.['message']?.['videoMessage']) {
            _0x33b74b = _0x2c5ef5['viewOnceMessageV2']['message']['videoMessage'];
            _0x61c4bb = 'Video';
            _0x212340 = _0x33b74b['caption'] || '';
        } else if (_0x2c5ef5?.['viewOnceMessageV2']?.['message']?.['audioMessage']) {
            _0x33b74b = _0x2c5ef5['viewOnceMessageV2']['message']['audioMessage'];
            _0x61c4bb = 'Audio';
            _0x212340 = '';
        } else if (_0x2c5ef5?.['viewOnceMessage']?.['message']?.['imageMessage']) {
            _0x33b74b = _0x2c5ef5['viewOnceMessage']['message']['imageMessage'];
            _0x61c4bb = 'Image';
            _0x212340 = _0x33b74b['caption'] || '';
        } else if (_0x2c5ef5?.['viewOnceMessage']?.['message']?.['videoMessage']) {
            _0x33b74b = _0x2c5ef5['viewOnceMessage']['message']['videoMessage'];
            _0x61c4bb = 'Video';
            _0x212340 = _0x33b74b['caption'] || '';
        }
        if (!_0x33b74b)
            return null;
        const _0x33b5ea = await _0x319400['downloadMediaMessage'](_0x331ad0);
        if (!_0x33b5ea)
            return null;
        return {
            'buffer': _0x33b5ea,
            'type': _0x61c4bb,
            'caption': _0x212340,
            'mimeType': _0x33b74b['mimetype'],
            'fileLength': _0x33b74b['fileLength']
        };
    } catch (_0x2846a5) {
        console['error']('Error\x20handling\x20view\x20once:', _0x2846a5);
        return null;
    }
}
async function getAIResponse(_0x14ae5c, _0x8b57b2, _0x45324f) {
    try {
        const _0x119413 = await _0x0_0x39f5ad['getResponse'](_0x14ae5c, _0x45324f, _0x8b57b2, {
            'senderId': _0x8b57b2,
            'chatId': _0x45324f,
            'timestamp': Date['now']()
        });
        return _0x119413 || 'Je\x20suis\x20là\x20!\x20Comment\x20puis-je\x20vous\x20aider\x20?\x20😊';
    } catch (_0x247fe9) {
        console['error']('AI\x20response\x20error:', _0x247fe9);
        return 'Désolé,\x20je\x20rencontre\x20un\x20problème\x20technique.\x20Veuillez\x20réessayer.\x20🥲';
    }
}
export async function handleChatbotResponse(_0x357e2d, _0x32a3a7, _0x58e249, _0x129015, _0x40fadf) {
    if (!_0x0_0x3bc31b['get']('enabled'))
        return;
    try {
        const _0xe9285b = _0x0_0x3bc31b['get']('botName') || 'Nova';
        const _0x50e425 = _0x357e2d['user']['id'];
        const _0xbf0ed5 = _0x50e425?.['split'](':')[0x0] || '';
        const _0x495b70 = await _0x0_0x69db08(_0x40fadf, _0x357e2d, _0x32a3a7);
        const _0x2a9fcc = _0x58e249['key']['fromMe'];
        const _0x3b1e38 = _0x2a9fcc || _0x495b70;
        const _0x24ed54 = await _0x0_0x47546b['getBotMode']();
        const _0x1b0c6a = _0x0_0x3bc31b['get']('mode') || 'private';
        if (_0x1b0c6a === 'private' && !_0x3b1e38) {
            return;
        }
        const _0xe6e5 = ((() => {
            if (_0x3b1e38)
                return !![];
            switch (_0x24ed54) {
            case 'public':
                return !![];
            case 'private':
            case 'self':
                return ![];
            case 'groups':
                return _0x32a3a7['endsWith']('@g.us');
            case 'inbox':
                return !_0x32a3a7['endsWith']('@g.us');
            default:
                return !![];
            }
        })());
        if (!_0xe6e5)
            return;
        const _0x518a2a = _0x58e249['message']?.['extendedTextMessage']?.['contextInfo']?.['participant']?.['includes'](_0xbf0ed5);
        const _0x14e357 = _0x129015['toLowerCase']()['trim']();
        const _0x4a9192 = _0xe9285b['toLowerCase']();
        const _0x285591 = _0x14e357['includes'](_0x4a9192) || _0x14e357['includes']('@' + _0x4a9192) || _0x14e357['includes']('@' + _0xbf0ed5);
        const _0xa5f9ed = new RegExp('^' + _0x4a9192 + '\x5cs+|^@' + _0x4a9192 + '\x5cs+', 'i')['test'](_0x129015);
        const _0x139936 = _0xa5f9ed || _0x285591 || _0x518a2a || _0x129015['includes']('@' + _0xbf0ed5);
        if (!_0x139936) {
            return;
        }
        let _0x6f1a0d = _0x129015;
        const _0x1fd5a7 = [
            new RegExp('^' + _0xe9285b + '\x5cs+', 'i'),
            new RegExp('^@' + _0xe9285b + '\x5cs+', 'i'),
            new RegExp('^' + _0xe9285b + '[:]\x5cs+', 'i'),
            new RegExp('^@' + _0xe9285b + '[:]\x5cs+', 'i'),
            new RegExp('\x5cs+' + _0xe9285b + '\x5cs+', 'i'),
            new RegExp('\x5cs+@' + _0xe9285b + '\x5cs+', 'i'),
            new RegExp('\x5cs+' + _0xe9285b + '$', 'i'),
            new RegExp('\x5cs+@' + _0xe9285b + '$', 'i')
        ];
        for (const _0xf17844 of _0x1fd5a7) {
            _0x6f1a0d = _0x6f1a0d['replace'](_0xf17844, '\x20')['trim']();
        }
        if (_0x518a2a && !_0x139936) {
            _0x6f1a0d = _0x129015;
        }
        if (!_0x6f1a0d || _0x6f1a0d['length'] < 0x1) {
            return;
        }
        if (_0x6f1a0d['startsWith']('.') || _0x6f1a0d['startsWith']('$') || _0x6f1a0d['startsWith']('#')) {
            return;
        }
        const _0x5bdf8e = await handleViewOnce(_0x357e2d, _0x58e249);
        if (_0x5bdf8e) {
            await _0x357e2d['sendMessage'](_0x32a3a7, { 'text': '✅\x20View\x20Once\x20Media\x20Recovered\x0a\x0a📊\x20Type:\x20' + _0x5bdf8e['type'] + '\x0a📏\x20Size:\x20' + (_0x5bdf8e['fileLength'] / 0x400)['toFixed'](0x2) + '\x20KB' }, { 'quoted': _0x58e249 });
            if (_0x5bdf8e['type'] === 'Image') {
                await _0x357e2d['sendMessage'](_0x32a3a7, {
                    'image': _0x5bdf8e['buffer'],
                    'caption': '📸\x20' + (_0x5bdf8e['caption'] || 'View\x20once\x20image')
                });
            } else if (_0x5bdf8e['type'] === 'Video') {
                await _0x357e2d['sendMessage'](_0x32a3a7, {
                    'video': _0x5bdf8e['buffer'],
                    'caption': '📹\x20' + (_0x5bdf8e['caption'] || 'View\x20once\x20video')
                });
            } else if (_0x5bdf8e['type'] === 'Audio') {
                await _0x357e2d['sendMessage'](_0x32a3a7, {
                    'audio': _0x5bdf8e['buffer'],
                    'mimetype': 'audio/mpeg'
                });
            }
            return;
        }
        await _0x357e2d['sendPresenceUpdate']('composing', _0x32a3a7);
        await new Promise(_0xf3af06 => setTimeout(_0xf3af06, 0x3e8 + Math['random']() * 0x5dc));
        const _0x3fc81e = await getAIResponse(_0x6f1a0d, _0x40fadf, _0x32a3a7);
        if (_0x3fc81e) {
            const _0x10433f = _0x0_0x3bc31b['get']('responsePrefix') || '🤖\x20';
            await _0x357e2d['sendMessage'](_0x32a3a7, { 'text': '' + _0x10433f + _0x3fc81e }, { 'quoted': _0x58e249 });
        }
    } catch (_0x51b399) {
        console['error']('Error\x20in\x20chatbot\x20response:', _0x51b399['message']);
    }
}