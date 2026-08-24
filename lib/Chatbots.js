import _0x0_0x2a68be from './chatbotService.js';
import _0x0_0x3dc0aa from './chatbotConfig.js';
import _0x0_0x52b453 from './isOwner.js';
import _0x0_0x3e935e from './lightweight_store.js';
import { dataFile } from './paths.js';
import _0x0_0xfd6495 from 'fs';
import _0x0_0x1bccc9 from 'path';
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
            const _0x322367 = await _0x0_0x3e935e['getSetting']('global', 'userGroupData');
            return _0x322367 || {
                'groups': [],
                'chatbot': {}
            };
        }
        if (!_0x0_0xfd6495['existsSync'](USER_GROUP_DATA)) {
            return {
                'groups': [],
                'chatbot': {}
            };
        }
        return JSON['parse'](_0x0_0xfd6495['readFileSync'](USER_GROUP_DATA, 'utf-8'));
    } catch (_0x1957ca) {
        console['error']('Error\x20loading\x20user\x20group\x20data:', _0x1957ca['message']);
        return {
            'groups': [],
            'chatbot': {}
        };
    }
}
export async function saveUserGroupData(_0x22634c) {
    try {
        if (HAS_DB) {
            await _0x0_0x3e935e['saveSetting']('global', 'userGroupData', _0x22634c);
        } else {
            const _0x11d063 = _0x0_0x1bccc9['dirname'](USER_GROUP_DATA);
            if (!_0x0_0xfd6495['existsSync'](_0x11d063)) {
                _0x0_0xfd6495['mkdirSync'](_0x11d063, { 'recursive': !![] });
            }
            _0x0_0xfd6495['writeFileSync'](USER_GROUP_DATA, JSON['stringify'](_0x22634c, null, 0x2));
        }
    } catch (_0x336c95) {
        console['error']('Error\x20saving\x20user\x20group\x20data:', _0x336c95['message']);
    }
}
async function handleViewOnce(_0xc8efab, _0x1902a9) {
    try {
        const _0x37c1b9 = _0x1902a9['message'];
        let _0x2b4358 = null;
        let _0x363c90 = '';
        let _0x145ad0 = '';
        if (_0x37c1b9?.['viewOnceMessageV2']?.['message']?.['imageMessage']) {
            _0x2b4358 = _0x37c1b9['viewOnceMessageV2']['message']['imageMessage'];
            _0x363c90 = 'Image';
            _0x145ad0 = _0x2b4358['caption'] || '';
        } else if (_0x37c1b9?.['viewOnceMessageV2']?.['message']?.['videoMessage']) {
            _0x2b4358 = _0x37c1b9['viewOnceMessageV2']['message']['videoMessage'];
            _0x363c90 = 'Video';
            _0x145ad0 = _0x2b4358['caption'] || '';
        } else if (_0x37c1b9?.['viewOnceMessageV2']?.['message']?.['audioMessage']) {
            _0x2b4358 = _0x37c1b9['viewOnceMessageV2']['message']['audioMessage'];
            _0x363c90 = 'Audio';
            _0x145ad0 = '';
        } else if (_0x37c1b9?.['viewOnceMessage']?.['message']?.['imageMessage']) {
            _0x2b4358 = _0x37c1b9['viewOnceMessage']['message']['imageMessage'];
            _0x363c90 = 'Image';
            _0x145ad0 = _0x2b4358['caption'] || '';
        } else if (_0x37c1b9?.['viewOnceMessage']?.['message']?.['videoMessage']) {
            _0x2b4358 = _0x37c1b9['viewOnceMessage']['message']['videoMessage'];
            _0x363c90 = 'Video';
            _0x145ad0 = _0x2b4358['caption'] || '';
        }
        if (!_0x2b4358)
            return null;
        const _0x55b1ea = await _0xc8efab['downloadMediaMessage'](_0x1902a9);
        if (!_0x55b1ea)
            return null;
        return {
            'buffer': _0x55b1ea,
            'type': _0x363c90,
            'caption': _0x145ad0,
            'mimeType': _0x2b4358['mimetype'],
            'fileLength': _0x2b4358['fileLength']
        };
    } catch (_0x185dc4) {
        console['error']('Error\x20handling\x20view\x20once:', _0x185dc4);
        return null;
    }
}
async function getAIResponse(_0x2a622e, _0xb7f404, _0x2ebc47) {
    try {
        const _0x4703ed = await _0x0_0x2a68be['getResponse'](_0x2a622e, _0x2ebc47, _0xb7f404, {
            'senderId': _0xb7f404,
            'chatId': _0x2ebc47,
            'timestamp': Date['now']()
        });
        return _0x4703ed || 'Je\x20suis\x20là\x20!\x20Comment\x20puis-je\x20vous\x20aider\x20?\x20😊';
    } catch (_0x616d33) {
        console['error']('AI\x20response\x20error:', _0x616d33);
        return 'Désolé,\x20je\x20rencontre\x20un\x20problème\x20technique.\x20Veuillez\x20réessayer.\x20🥲';
    }
}
export async function handleChatbotResponse(_0x5ef5cf, _0xf8da7e, _0x4ab1c6, _0x37bc52, _0x252f2b) {
    if (!_0x0_0x3dc0aa['get']('enabled'))
        return;
    const _0x5244d7 = await loadUserGroupData();
    if (!_0x5244d7['chatbot'][_0xf8da7e])
        return;
    try {
        const _0x2619eb = 'Nova';
        const _0x5f3b02 = _0x5ef5cf['user']['id'];
        const _0x59f7ca = _0x5f3b02?.['split'](':')[0x0] || '';
        const _0x22c577 = await _0x0_0x52b453(_0x252f2b, _0x5ef5cf, _0xf8da7e);
        const _0x2d178d = _0x4ab1c6['key']['fromMe'];
        const _0x293d8c = _0x2d178d || _0x22c577;
        const _0x3cd2b6 = await _0x0_0x3e935e['getBotMode']();
        const _0x594396 = _0x0_0x3dc0aa['get']('mode') || 'private';
        if (_0x594396 === 'private' && !_0x293d8c) {
            return;
        }
        const _0x29d1f1 = ((() => {
            if (_0x293d8c)
                return !![];
            switch (_0x3cd2b6) {
            case 'public':
                return !![];
            case 'private':
            case 'self':
                return ![];
            case 'groups':
                return _0xf8da7e['endsWith']('@g.us');
            case 'inbox':
                return !_0xf8da7e['endsWith']('@g.us');
            default:
                return !![];
            }
        })());
        if (!_0x29d1f1)
            return;
        const _0x5aee5f = _0x4ab1c6['message']?.['extendedTextMessage']?.['contextInfo']?.['participant']?.['includes'](_0x59f7ca);
        const _0x48bf82 = _0x37bc52['toLowerCase']()['trim']();
        const _0x387c15 = _0x2619eb['toLowerCase']();
        const _0x22ffcf = _0x48bf82['includes'](_0x387c15) || _0x48bf82['includes']('@' + _0x387c15) || _0x48bf82['includes']('@' + _0x59f7ca);
        const _0x404f7f = new RegExp('^' + _0x387c15 + '\x5cs+|^@' + _0x387c15 + '\x5cs+', 'i')['test'](_0x37bc52);
        const _0xa5a09f = _0x404f7f || _0x22ffcf || _0x5aee5f || _0x37bc52['includes']('@' + _0x59f7ca);
        if (!_0xa5a09f) {
            return;
        }
        let _0x44e84b = _0x37bc52;
        const _0x5da0c1 = [
            new RegExp('^' + _0x2619eb + '\x5cs+', 'i'),
            new RegExp('^@' + _0x2619eb + '\x5cs+', 'i'),
            new RegExp('^' + _0x2619eb + '[:]\x5cs+', 'i'),
            new RegExp('^@' + _0x2619eb + '[:]\x5cs+', 'i'),
            new RegExp('\x5cs+' + _0x2619eb + '\x5cs+', 'i'),
            new RegExp('\x5cs+@' + _0x2619eb + '\x5cs+', 'i'),
            new RegExp('\x5cs+' + _0x2619eb + '$', 'i'),
            new RegExp('\x5cs+@' + _0x2619eb + '$', 'i')
        ];
        for (const _0x3f2125 of _0x5da0c1) {
            _0x44e84b = _0x44e84b['replace'](_0x3f2125, '\x20')['trim']();
        }
        if (_0x5aee5f && !_0xa5a09f) {
            _0x44e84b = _0x37bc52;
        }
        if (!_0x44e84b || _0x44e84b['length'] < 0x1) {
            return;
        }
        if (_0x44e84b['startsWith']('.') || _0x44e84b['startsWith']('$') || _0x44e84b['startsWith']('#')) {
            return;
        }
        const _0x478d08 = await handleViewOnce(_0x5ef5cf, _0x4ab1c6);
        if (_0x478d08) {
            await _0x5ef5cf['sendMessage'](_0xf8da7e, { 'text': '✅\x20View\x20Once\x20Media\x20Recovered\x0a\x0a📊\x20Type:\x20' + _0x478d08['type'] + '\x0a📏\x20Size:\x20' + (_0x478d08['fileLength'] / 0x400)['toFixed'](0x2) + '\x20KB' }, { 'quoted': _0x4ab1c6 });
            if (_0x478d08['type'] === 'Image') {
                await _0x5ef5cf['sendMessage'](_0xf8da7e, {
                    'image': _0x478d08['buffer'],
                    'caption': '📸\x20' + (_0x478d08['caption'] || 'View\x20once\x20image')
                });
            } else if (_0x478d08['type'] === 'Video') {
                await _0x5ef5cf['sendMessage'](_0xf8da7e, {
                    'video': _0x478d08['buffer'],
                    'caption': '📹\x20' + (_0x478d08['caption'] || 'View\x20once\x20video')
                });
            } else if (_0x478d08['type'] === 'Audio') {
                await _0x5ef5cf['sendMessage'](_0xf8da7e, {
                    'audio': _0x478d08['buffer'],
                    'mimetype': 'audio/mpeg'
                });
            }
            return;
        }
        await _0x5ef5cf['sendPresenceUpdate']('composing', _0xf8da7e);
        await new Promise(_0xbdea21 => setTimeout(_0xbdea21, 0x3e8 + Math['random']() * 0x5dc));
        const _0x55543c = await getAIResponse(_0x44e84b, _0x252f2b, _0xf8da7e);
        if (_0x55543c) {
            const _0x5efcf5 = _0x0_0x3dc0aa['get']('responsePrefix') || '🤖\x20';
            await _0x5ef5cf['sendMessage'](_0xf8da7e, { 'text': '' + _0x5efcf5 + _0x55543c }, { 'quoted': _0x4ab1c6 });
        }
    } catch (_0x5d0853) {
        console['error']('Error\x20in\x20chatbot\x20response:', _0x5d0853['message']);
    }
}