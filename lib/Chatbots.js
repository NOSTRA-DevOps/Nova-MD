import _0x0_0x14cfe3 from './chatbotService.js';
import _0x0_0x1e60c9 from './chatbotConfig.js';
import _0x0_0x4d5ae9 from './isOwner.js';
import _0x0_0x5a3a0e from './lightweight_store.js';
import { dataFile } from './paths.js';
import _0x0_0x244cc4 from 'fs';
import _0x0_0x522ede from 'path';
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
            const _0x108bdd = await _0x0_0x5a3a0e['getSetting']('global', 'userGroupData');
            return _0x108bdd || {
                'groups': [],
                'chatbot': {}
            };
        }
        if (!_0x0_0x244cc4['existsSync'](USER_GROUP_DATA)) {
            return {
                'groups': [],
                'chatbot': {}
            };
        }
        return JSON['parse'](_0x0_0x244cc4['readFileSync'](USER_GROUP_DATA, 'utf-8'));
    } catch (_0x350d84) {
        console['error']('Error\x20loading\x20user\x20group\x20data:', _0x350d84['message']);
        return {
            'groups': [],
            'chatbot': {}
        };
    }
}
export async function saveUserGroupData(_0x16db29) {
    try {
        if (HAS_DB) {
            await _0x0_0x5a3a0e['saveSetting']('global', 'userGroupData', _0x16db29);
        } else {
            const _0x4aa090 = _0x0_0x522ede['dirname'](USER_GROUP_DATA);
            if (!_0x0_0x244cc4['existsSync'](_0x4aa090)) {
                _0x0_0x244cc4['mkdirSync'](_0x4aa090, { 'recursive': !![] });
            }
            _0x0_0x244cc4['writeFileSync'](USER_GROUP_DATA, JSON['stringify'](_0x16db29, null, 0x2));
        }
    } catch (_0x6028cb) {
        console['error']('Error\x20saving\x20user\x20group\x20data:', _0x6028cb['message']);
    }
}
async function handleViewOnce(_0x209c21, _0x472508) {
    try {
        const _0x250917 = _0x472508['message'];
        let _0x4c3dba = null;
        let _0x27e9ee = '';
        let _0x3daf3d = '';
        if (_0x250917?.['viewOnceMessageV2']?.['message']?.['imageMessage']) {
            _0x4c3dba = _0x250917['viewOnceMessageV2']['message']['imageMessage'];
            _0x27e9ee = 'Image';
            _0x3daf3d = _0x4c3dba['caption'] || '';
        } else if (_0x250917?.['viewOnceMessageV2']?.['message']?.['videoMessage']) {
            _0x4c3dba = _0x250917['viewOnceMessageV2']['message']['videoMessage'];
            _0x27e9ee = 'Video';
            _0x3daf3d = _0x4c3dba['caption'] || '';
        } else if (_0x250917?.['viewOnceMessageV2']?.['message']?.['audioMessage']) {
            _0x4c3dba = _0x250917['viewOnceMessageV2']['message']['audioMessage'];
            _0x27e9ee = 'Audio';
            _0x3daf3d = '';
        } else if (_0x250917?.['viewOnceMessage']?.['message']?.['imageMessage']) {
            _0x4c3dba = _0x250917['viewOnceMessage']['message']['imageMessage'];
            _0x27e9ee = 'Image';
            _0x3daf3d = _0x4c3dba['caption'] || '';
        } else if (_0x250917?.['viewOnceMessage']?.['message']?.['videoMessage']) {
            _0x4c3dba = _0x250917['viewOnceMessage']['message']['videoMessage'];
            _0x27e9ee = 'Video';
            _0x3daf3d = _0x4c3dba['caption'] || '';
        }
        if (!_0x4c3dba)
            return null;
        const _0x11fa36 = await _0x209c21['downloadMediaMessage'](_0x472508);
        if (!_0x11fa36)
            return null;
        return {
            'buffer': _0x11fa36,
            'type': _0x27e9ee,
            'caption': _0x3daf3d,
            'mimeType': _0x4c3dba['mimetype'],
            'fileLength': _0x4c3dba['fileLength']
        };
    } catch (_0x47a9b6) {
        console['error']('Error\x20handling\x20view\x20once:', _0x47a9b6);
        return null;
    }
}
async function getAIResponse(_0x4f32be, _0xce2c92, _0x3d627c) {
    try {
        const _0x3698e6 = await _0x0_0x14cfe3['getResponse'](_0x4f32be, _0x3d627c, _0xce2c92, {
            'senderId': _0xce2c92,
            'chatId': _0x3d627c,
            'timestamp': Date['now']()
        });
        return _0x3698e6 || 'Je\x20suis\x20là\x20!\x20Comment\x20puis-je\x20vous\x20aider\x20?\x20😊';
    } catch (_0x1496e7) {
        console['error']('AI\x20response\x20error:', _0x1496e7);
        return 'Désolé,\x20je\x20rencontre\x20un\x20problème\x20technique.\x20Veuillez\x20réessayer.\x20🥲';
    }
}
export async function handleChatbotResponse(_0x146565, _0x187370, _0x97b1d0, _0x162bb6, _0x35c672) {
    if (!_0x0_0x1e60c9['get']('enabled'))
        return;
    try {
        const _0x3bb850 = _0x0_0x1e60c9['get']('botName') || 'Nova';
        const _0x5b802c = _0x146565['user']['id'];
        const _0x4b6897 = _0x5b802c?.['split'](':')[0x0] || '';
        const _0x1686ff = await _0x0_0x4d5ae9(_0x35c672, _0x146565, _0x187370);
        const _0x23f949 = _0x97b1d0['key']['fromMe'];
        const _0x3edf6d = _0x23f949 || _0x1686ff;
        const _0x2d163a = await _0x0_0x5a3a0e['getBotMode']();
        const _0x29c312 = _0x0_0x1e60c9['get']('mode') || 'private';
        if (_0x29c312 === 'private' && !_0x3edf6d) {
            return;
        }
        const _0x415e89 = ((() => {
            if (_0x3edf6d)
                return !![];
            switch (_0x2d163a) {
            case 'public':
                return !![];
            case 'private':
            case 'self':
                return ![];
            case 'groups':
                return _0x187370['endsWith']('@g.us');
            case 'inbox':
                return !_0x187370['endsWith']('@g.us');
            default:
                return !![];
            }
        })());
        if (!_0x415e89)
            return;
        const _0x2f29e8 = _0x97b1d0['message']?.['extendedTextMessage']?.['contextInfo']?.['participant']?.['includes'](_0x4b6897);
        const _0x3f706a = _0x162bb6['toLowerCase']()['trim']();
        const _0x2cc0b3 = _0x3bb850['toLowerCase']();
        const _0x5254a2 = _0x3f706a['includes'](_0x2cc0b3) || _0x3f706a['includes']('@' + _0x2cc0b3) || _0x3f706a['includes']('@' + _0x4b6897);
        const _0x50d4ad = new RegExp('^' + _0x2cc0b3 + '\x5cs+|^@' + _0x2cc0b3 + '\x5cs+', 'i')['test'](_0x162bb6);
        const _0x32bbe3 = _0x50d4ad || _0x5254a2 || _0x2f29e8 || _0x162bb6['includes']('@' + _0x4b6897);
        if (!_0x32bbe3) {
            return;
        }
        let _0x56facf = _0x162bb6;
        const _0x206cd4 = [
            new RegExp('^' + _0x3bb850 + '\x5cs+', 'i'),
            new RegExp('^@' + _0x3bb850 + '\x5cs+', 'i'),
            new RegExp('^' + _0x3bb850 + '[:]\x5cs+', 'i'),
            new RegExp('^@' + _0x3bb850 + '[:]\x5cs+', 'i'),
            new RegExp('\x5cs+' + _0x3bb850 + '\x5cs+', 'i'),
            new RegExp('\x5cs+@' + _0x3bb850 + '\x5cs+', 'i'),
            new RegExp('\x5cs+' + _0x3bb850 + '$', 'i'),
            new RegExp('\x5cs+@' + _0x3bb850 + '$', 'i')
        ];
        for (const _0x174a25 of _0x206cd4) {
            _0x56facf = _0x56facf['replace'](_0x174a25, '\x20')['trim']();
        }
        if (_0x2f29e8 && !_0x32bbe3) {
            _0x56facf = _0x162bb6;
        }
        if (!_0x56facf || _0x56facf['length'] < 0x1) {
            return;
        }
        if (_0x56facf['startsWith']('.') || _0x56facf['startsWith']('$') || _0x56facf['startsWith']('#')) {
            return;
        }
        const _0x1995a6 = await handleViewOnce(_0x146565, _0x97b1d0);
        if (_0x1995a6) {
            await _0x146565['sendMessage'](_0x187370, { 'text': '✅\x20View\x20Once\x20Media\x20Recovered\x0a\x0a📊\x20Type:\x20' + _0x1995a6['type'] + '\x0a📏\x20Size:\x20' + (_0x1995a6['fileLength'] / 0x400)['toFixed'](0x2) + '\x20KB' }, { 'quoted': _0x97b1d0 });
            if (_0x1995a6['type'] === 'Image') {
                await _0x146565['sendMessage'](_0x187370, {
                    'image': _0x1995a6['buffer'],
                    'caption': '📸\x20' + (_0x1995a6['caption'] || 'View\x20once\x20image')
                });
            } else if (_0x1995a6['type'] === 'Video') {
                await _0x146565['sendMessage'](_0x187370, {
                    'video': _0x1995a6['buffer'],
                    'caption': '📹\x20' + (_0x1995a6['caption'] || 'View\x20once\x20video')
                });
            } else if (_0x1995a6['type'] === 'Audio') {
                await _0x146565['sendMessage'](_0x187370, {
                    'audio': _0x1995a6['buffer'],
                    'mimetype': 'audio/mpeg'
                });
            }
            return;
        }
        await _0x146565['sendPresenceUpdate']('composing', _0x187370);
        await new Promise(_0x516c90 => setTimeout(_0x516c90, 0x3e8 + Math['random']() * 0x5dc));
        const _0x1e5ad9 = await getAIResponse(_0x56facf, _0x35c672, _0x187370);
        if (_0x1e5ad9) {
            const _0x2aa18a = _0x0_0x1e60c9['get']('responsePrefix') || '🤖\x20';
            await _0x146565['sendMessage'](_0x187370, { 'text': '' + _0x2aa18a + _0x1e5ad9 }, { 'quoted': _0x97b1d0 });
        }
    } catch (_0x426cb4) {
        console['error']('Error\x20in\x20chatbot\x20response:', _0x426cb4['message']);
    }
}