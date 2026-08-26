import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x50cd28 from 'fs';
import { dataFile } from './paths.js';
import { handleChatbotResponse } from './Chatbots.js';
import _0x0_0x21d930 from '../config.js';
import _0x0_0x30e9aa from './lightweight_store.js';
import _0x0_0x316b7e from './commandHandler.js';
import {
    printMessage,
    printLog
} from './print.js';
import { isBanned } from './isBanned.js';
import { isSudo } from './index.js';
import _0x0_0x3b0d79 from './isOwner.js';
import _0x0_0x63df01 from './isAdmin.js';
import { handleAutoread } from '../plugins/autoread.js';
import {
    handleAutotypingForMessage,
    showTypingAfterCommand
} from '../plugins/autotyping.js';
import {
    storeMessage,
    handleMessageRevocation
} from '../plugins/antidelete.js';
import { handleBadwordDetection } from './antibadword.js';
import { handleLinkDetection } from '../plugins/antilink.js';
import { handleTicTacToeMove } from '../plugins/tictactoe.js';
import { handleAutoReply } from '../plugins/autoreply.js';
import {
    handleAntiSpam,
    invalidateGroupCache
} from '../plugins/antispam.js';
import { startSchedulerEngine } from '../plugins/schedule.js';
import { addCommandReaction } from './reactions.js';
import { writeErrorLog } from './logger.js';
import { channelInfo } from './messageConfig.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const STICKER_FILE = dataFile('sticker_commands.json');
async function getStickerCommands() {
    if (HAS_DB) {
        const _0x208cbd = await _0x0_0x30e9aa['getSetting']('global', 'stickerCommands');
        return _0x208cbd || {};
    } else {
        try {
            if (!_0x0_0x50cd28['existsSync'](STICKER_FILE)) {
                return {};
            }
            return JSON['parse'](_0x0_0x50cd28['readFileSync'](STICKER_FILE, 'utf8'));
        } catch {
            return {};
        }
    }
}
async function handleMessages(_0x34e943, _0x4f417c) {
    try {
        const {
            messages: _0x270442,
            type: _0x125106
        } = _0x4f417c;
        if (_0x125106 !== 'notify')
            return;
        const _0x223d12 = _0x270442[0x0];
        if (!_0x223d12?.['message'])
            return;
        const _0x5a535f = _0x223d12['key']['remoteJid'];
        const _0xab313b = _0x5a535f['endsWith']('@g.us');
        const _0x3e38cd = _0x223d12['key']['participant'] || _0x223d12['key']['remoteJid'];
        const _0x1b743 = await _0x0_0x3b0d79(_0x3e38cd, _0x34e943, _0x5a535f);
        const _0xda983c = _0x223d12['key']['fromMe'] || _0x1b743;
        const _0x20694e = await _0x0_0x30e9aa['getBotMode']();
        if ((_0x20694e === 'private' || _0x20694e === 'self') && !_0xda983c) {
            return;
        }
        await printMessage(_0x223d12, _0x34e943);
        try {
            const _0x5776c0 = await _0x0_0x30e9aa['getSetting']('global', 'stealthMode');
            if (!_0x5776c0 || !_0x5776c0['enabled']) {
                await handleAutoread(_0x34e943, _0x223d12);
            } else {
                printLog('info', '👻\x20Stealth\x20mode\x20active');
            }
        } catch (_0x24554f) {
            await handleAutoread(_0x34e943, _0x223d12);
        }
        if (_0x223d12['message']?.['protocolMessage']?.['type'] === 0x0) {
            printLog('info', 'Message\x20deletion\x20detected');
            await handleMessageRevocation(_0x34e943, _0x223d12);
            return;
        }
        await storeMessage(_0x34e943, _0x223d12);
        if (_0x223d12['pushName'] && _0x34e943['store']?.['contacts']) {
            const _0x4b4717 = _0x223d12['key']['participant'] || _0x223d12['key']['remoteJid'];
            if (_0x4b4717) {
                _0x34e943['store']['contacts'][_0x4b4717] = {
                    ..._0x34e943['store']['contacts'][_0x4b4717],
                    'id': _0x4b4717,
                    'notify': _0x223d12['pushName'],
                    'name': _0x223d12['pushName']
                };
                const _0x3eb0b0 = _0x34e943['decodeJid']?.(_0x4b4717);
                if (_0x3eb0b0 && _0x3eb0b0 !== _0x4b4717) {
                    _0x34e943['store']['contacts'][_0x3eb0b0] = {
                        ..._0x34e943['store']['contacts'][_0x3eb0b0],
                        'id': _0x3eb0b0,
                        'notify': _0x223d12['pushName'],
                        'name': _0x223d12['pushName']
                    };
                }
            }
        }
        const _0x1e748b = _0x223d12['key']['participant'] || _0x223d12['key']['remoteJid'];
        if (_0x1e748b?.['includes']('@lid') && _0x34e943['store']?.['contacts']) {
            const _0x12930e = _0x34e943['store']['contacts'];
            const _0x212417 = Object['keys'](_0x12930e)['find'](_0x538829 => _0x12930e[_0x538829]?.['lid'] === _0x1e748b || _0x12930e[_0x538829]?.['lid']?.['split'](':')[0x0] === _0x1e748b['split']('@')[0x0]);
            if (_0x212417?.['includes']('@s.whatsapp.net'))
                _0x3e38cd = _0x212417;
        }
        if (_0x223d12['message']?.['stickerMessage']) {
            const _0x32a2f0 = _0x223d12['message']['stickerMessage']['fileSha256'];
            if (_0x32a2f0) {
                const _0x5e40e2 = Buffer['from'](_0x32a2f0)['toString']('base64');
                const _0x5c63c8 = await getStickerCommands();
                if (_0x5c63c8[_0x5e40e2]) {
                    const _0x9e04eb = _0x5c63c8[_0x5e40e2]['text'];
                    const [_0x23c517, ..._0x48bc7e] = _0x9e04eb['split']('\x20');
                    let _0x17665c = null;
                    let _0x5ac04f = '';
                    for (const _0x21453f of _0x0_0x21d930['prefixes']) {
                        const _0x2af67e = (_0x21453f + _0x23c517)['toLowerCase']();
                        _0x17665c = _0x0_0x316b7e['getCommand'](_0x2af67e, _0x0_0x21d930['prefixes']);
                        if (_0x17665c) {
                            _0x5ac04f = _0x21453f;
                            break;
                        }
                    }
                    if (_0x17665c) {
                        const _0x41a823 = await isSudo(_0x3e38cd);
                        const _0x47cd50 = await _0x0_0x3b0d79(_0x3e38cd, _0x34e943, _0x5a535f);
                        const _0x38b940 = _0x223d12['key']['fromMe'] || _0x47cd50;
                        const _0x49e417 = await _0x0_0x30e9aa['getBotMode']();
                        const _0x50ce04 = ((() => {
                            if (_0x38b940)
                                return !![];
                            switch (_0x49e417) {
                            case 'public':
                                return !![];
                            case 'private':
                            case 'self':
                                return ![];
                            case 'groups':
                                return _0xab313b;
                            case 'inbox':
                                return !_0xab313b;
                            default:
                                return !![];
                            }
                        })());
                        if (!_0x50ce04)
                            return;
                        const _0x550f69 = await isBanned(_0x3e38cd);
                        if (_0x550f69)
                            return;
                        if (_0x17665c['strictOwnerOnly']) {
                            const {isOwnerOnly: _0x274a4a} = await import('./isOwner.js');
                            if (!_0x223d12['key']['fromMe'] && !_0x274a4a(_0x3e38cd)) {
                                return await _0x34e943['sendMessage'](_0x5a535f, {
                                    'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20bot\x20owner!*',
                                    ...channelInfo
                                }, { 'quoted': _0x223d12 });
                            }
                        }
                        if (_0x17665c['ownerOnly'] && !_0x223d12['key']['fromMe'] && !_0x47cd50) {
                            return await _0x34e943['sendMessage'](_0x5a535f, {
                                'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20owner\x20or\x20sudo\x20users!*',
                                ...channelInfo
                            }, { 'quoted': _0x223d12 });
                        }
                        if (_0x17665c['groupOnly'] && !_0xab313b) {
                            return await _0x34e943['sendMessage'](_0x5a535f, {
                                'text': 'ℹ️\x20*This\x20command\x20can\x20only\x20be\x20used\x20in\x20groups!*',
                                ...channelInfo
                            }, { 'quoted': _0x223d12 });
                        }
                        let _0x4305b1 = ![];
                        let _0x5e1e04 = ![];
                        if (_0x17665c['adminOnly'] && _0xab313b) {
                            const _0x10325b = await _0x0_0x63df01(_0x34e943, _0x5a535f, _0x3e38cd);
                            _0x4305b1 = _0x10325b['isSenderAdmin'];
                            _0x5e1e04 = _0x10325b['isBotAdmin'];
                            if (!_0x5e1e04) {
                                return await _0x34e943['sendMessage'](_0x5a535f, {
                                    'text': 'ℹ️\x20*Please\x20make\x20the\x20bot\x20an\x20admin\x20to\x20use\x20this\x20command.*',
                                    ...channelInfo
                                }, { 'quoted': _0x223d12 });
                            }
                            if (!_0x4305b1 && !_0x223d12['key']['fromMe'] && !_0x47cd50) {
                                return await _0x34e943['sendMessage'](_0x5a535f, {
                                    'text': 'ℹ️\x20*Sorry,\x20only\x20group\x20admins\x20can\x20use\x20this\x20command.*',
                                    ...channelInfo
                                }, { 'quoted': _0x223d12 });
                            }
                        }
                        const _0x3a99b7 = {
                            'key': _0x223d12['key'],
                            'message': {
                                'extendedTextMessage': {
                                    'text': _0x5ac04f + _0x9e04eb,
                                    'contextInfo': _0x223d12['message']['stickerMessage']['contextInfo'] || {}
                                }
                            },
                            'messageTimestamp': _0x223d12['messageTimestamp'],
                            'pushName': _0x223d12['pushName'],
                            'broadcast': _0x223d12['broadcast']
                        };
                        const _0x516f9e = {
                            'chatId': _0x5a535f,
                            'senderId': _0x3e38cd,
                            'isGroup': _0xab313b,
                            'isSenderAdmin': _0x4305b1,
                            'isBotAdmin': _0x5e1e04,
                            'senderIsOwnerOrSudo': _0x47cd50,
                            'isOwnerOrSudoCheck': _0x38b940,
                            'channelInfo': channelInfo,
                            'rawText': _0x5ac04f + _0x9e04eb,
                            'userMessage': (_0x5ac04f + _0x9e04eb)['toLowerCase'](),
                            'messageText': _0x5ac04f + _0x9e04eb,
                            'config': _0x0_0x21d930
                        };
                        try {
                            await _0x17665c['handler'](_0x34e943, _0x3a99b7, _0x48bc7e, _0x516f9e);
                            await addCommandReaction(_0x34e943, _0x223d12);
                            await showTypingAfterCommand(_0x34e943, _0x5a535f);
                            printLog('success', '✅\x20Sticker\x20command\x20executed:\x20' + _0x9e04eb);
                        } catch (_0x5474aa) {
                            printLog('error', '❌\x20Sticker\x20command\x20error\x20[' + _0x9e04eb + ']:\x20' + _0x5474aa['message']);
                            console['error'](_0x5474aa['stack']);
                            await _0x34e943['sendMessage'](_0x5a535f, {
                                'text': '❌\x20Error\x20executing\x20sticker\x20command:\x20' + _0x5474aa['message'],
                                ...channelInfo
                            }, { 'quoted': _0x223d12 });
                        }
                    } else {
                        printLog('warning', '⚠️\x20Sticker\x20command\x20not\x20found:\x20' + _0x9e04eb);
                    }
                    return;
                }
            }
        }
        const _0x504bb5 = _0x223d12['message']?.['conversation'] || _0x223d12['message']?.['extendedTextMessage']?.['text'] || _0x223d12['message']?.['imageMessage']?.['caption'] || _0x223d12['message']?.['videoMessage']?.['caption'] || _0x223d12['message']?.['buttonsResponseMessage']?.['selectedButtonId'] || '';
        const _0x3eb145 = _0x504bb5['trim']();
        const _0x52c4ab = _0x3eb145['toLowerCase']();
        const _0xc5575c = await isSudo(_0x3e38cd);
        startSchedulerEngine(_0x34e943);
        if (!_0x223d12['key']['fromMe']) {
            const _0x2930be = await handleAutoReply(_0x34e943, _0x5a535f, _0x223d12, _0x52c4ab);
            if (_0x2930be)
                return;
        }
        if (_0x223d12['message']?.['buttonsResponseMessage']) {
            const _0x2e6d55 = _0x223d12['message']['buttonsResponseMessage']['selectedButtonId'];
            printLog('info', 'Button\x20response:\x20' + _0x2e6d55);
            if (_0x2e6d55 === 'channel') {
                await _0x34e943['sendMessage'](_0x5a535f, { 'text': '*Join\x20our\x20Channel:*\x0a[https://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y](https://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y)' }, { 'quoted': _0x223d12 });
                return;
            } else if (_0x2e6d55 === 'owner') {
                const _0x1568d5 = (await import('../plugins/owner.js'))['default'];
                await _0x1568d5['handler']?.(_0x34e943, _0x5a535f, '', {});
                return;
            } else if (_0x2e6d55 === 'support') {
                await _0x34e943['sendMessage'](_0x5a535f, { 'text': '*Support*\x0a\x0ahttps://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y' }, { 'quoted': _0x223d12 });
                return;
            }
        }
        const _0x5eb55b = await isBanned(_0x3e38cd);
        if (_0x5eb55b && !_0x52c4ab['startsWith']('.unban')) {
            if (Math['random']() < 0.1) {
                printLog('warning', 'Banned\x20user\x20attempted\x20command:\x20' + _0x3e38cd['split']('@')[0x0]);
                await _0x34e943['sendMessage'](_0x5a535f, {
                    'text': 'You\x20are\x20banned\x20from\x20using\x20the\x20bot.\x20Contact\x20an\x20admin\x20to\x20get\x20unbanned.',
                    ...channelInfo
                });
            }
            return;
        }
        if (/^[1-9]$/['test'](_0x52c4ab) || _0x52c4ab === 'surrender') {
            await handleTicTacToeMove(_0x34e943, _0x5a535f, _0x3e38cd, _0x52c4ab);
            return;
        }
        if (!_0x223d12['key']['fromMe']) {
            await _0x0_0x30e9aa['incrementMessageCount'](_0x5a535f, _0x3e38cd, _0x223d12['pushName']);
        } else {
            const _0x3585d9 = _0x34e943['user']?.['id'] || _0x3e38cd;
            const _0x132e0a = _0x34e943['user']?.['name'] || _0x34e943['user']?.['notify'] || 'Me';
            await _0x0_0x30e9aa['incrementMessageCount'](_0x5a535f, _0x3585d9, _0x132e0a);
        }
        if (_0xab313b) {
            if (_0x52c4ab) {
                await handleBadwordDetection(_0x34e943, _0x5a535f, _0x223d12, _0x52c4ab, _0x3e38cd);
            }
            await handleLinkDetection(_0x34e943, _0x5a535f, _0x223d12, _0x52c4ab, _0x3e38cd);
        }
        if (_0xab313b && !_0x223d12['key']['fromMe']) {
            const _0xd8b06c = await handleAntiSpam(_0x34e943, _0x5a535f, _0x223d12, _0x3e38cd, _0x1b743);
            if (_0xd8b06c)
                return;
        }
        if (!_0xab313b && !_0x223d12['key']['fromMe'] && !_0xc5575c) {
            try {
                const _0x147761 = (await import('../plugins/pmblocker.js'))['default'];
                const _0x3ca9e4 = _0x147761?.['readState'];
                const _0x4e0f1c = await _0x3ca9e4();
                if (_0x4e0f1c['enabled']) {
                    printLog('warning', 'PM\x20blocked\x20from:\x20' + _0x3e38cd['split']('@')[0x0]);
                    await _0x34e943['sendMessage'](_0x5a535f, { 'text': _0x4e0f1c['message'] || 'Private\x20messages\x20are\x20blocked.\x20Please\x20contact\x20the\x20owner\x20in\x20groups\x20only.' });
                    await new Promise(_0x27aaae => setTimeout(_0x27aaae, 0x5dc));
                    try {
                        await _0x34e943['updateBlockStatus'](_0x5a535f, 'block');
                        printLog('success', 'Blocked\x20user:\x20' + _0x3e38cd['split']('@')[0x0]);
                    } catch (_0x1ffb59) {
                        printLog('error', 'Failed\x20to\x20block\x20user:\x20' + _0x1ffb59['message']);
                    }
                    return;
                }
            } catch (_0x498617) {
                printLog('error', 'PM\x20blocker\x20error:\x20' + _0x498617['message']);
            }
        }
        const _0x3dff79 = _0x0_0x21d930['prefixes']?.['find'](_0x47e7c2 => _0x52c4ab['startsWith'](_0x47e7c2));
        const _0x15d9a7 = _0x0_0x316b7e['getCommand'](_0x52c4ab, _0x0_0x21d930['prefixes']);
        if (!_0x3dff79 && !_0x15d9a7) {
            await handleAutotypingForMessage(_0x34e943, _0x5a535f, _0x52c4ab);
            const _0x14b873 = await _0x0_0x30e9aa['getBotMode']();
            const _0x433e6f = _0x14b873 === 'public' || _0x14b873 === 'groups' && _0xab313b || _0x14b873 === 'inbox' && !_0xab313b || _0xda983c;
            if (_0x433e6f) {
                if (_0xab313b && _0x52c4ab['length'] < 0x3) {
                    const _0x231b27 = 'nova';
                    if (!_0x52c4ab['includes'](_0x231b27) && !_0x52c4ab['includes']('@')) {
                        return;
                    }
                }
                await handleChatbotResponse(_0x34e943, _0x5a535f, _0x223d12, _0x52c4ab, _0x3e38cd);
            }
            return;
        }
        if (!_0x15d9a7) {
            const _0x370ba9 = 'nova';
            const _0x966e95 = _0x52c4ab['includes'](_0x370ba9) || _0x52c4ab['includes']('@nova');
            if (_0x966e95) {
                const _0x438c7f = await _0x0_0x30e9aa['getBotMode']();
                const _0x3d998a = _0x438c7f === 'public' || _0x438c7f === 'groups' && _0xab313b || _0x438c7f === 'inbox' && !_0xab313b || _0xda983c;
                if (_0x3d998a) {
                    await handleChatbotResponse(_0x34e943, _0x5a535f, _0x223d12, _0x52c4ab, _0x3e38cd);
                    return;
                }
            }
            return;
        }
        const _0xb934e3 = ((() => {
            if (_0xda983c)
                return !![];
            switch (_0x20694e) {
            case 'public':
                return !![];
            case 'private':
            case 'self':
                return ![];
            case 'groups':
                return _0xab313b;
            case 'inbox':
                return !_0xab313b;
            default:
                return !![];
            }
        })());
        if (!_0xb934e3) {
            return;
        }
        let _0x2815bf;
        if (_0x3dff79) {
            const _0xa14b5e = _0x3eb145['slice'](_0x3dff79['length'])['trim']();
            _0x2815bf = _0xa14b5e['split'](/\s+/)['slice'](0x1);
        } else {
            _0x2815bf = _0x3eb145['trim']()['split'](/\s+/)['slice'](0x1);
        }
        if (_0x15d9a7['strictOwnerOnly']) {
            const {isOwnerOnly: _0x2dd652} = await import('./isOwner.js');
            if (!_0x223d12['key']['fromMe'] && !_0x2dd652(_0x3e38cd)) {
                return await _0x34e943['sendMessage'](_0x5a535f, {
                    'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20bot\x20owner!*\x0a\x0a_Sudo\x20users\x20cannot\x20manage\x20other\x20sudo\x20users._',
                    ...channelInfo
                }, { 'quoted': _0x223d12 });
            }
        }
        if (_0x15d9a7['ownerOnly'] && !_0x223d12['key']['fromMe'] && !_0x1b743) {
            return await _0x34e943['sendMessage'](_0x5a535f, {
                'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20owner\x20or\x20sudo\x20users!*',
                ...channelInfo
            }, { 'quoted': _0x223d12 });
        }
        if (_0x15d9a7['groupOnly'] && !_0xab313b) {
            return await _0x34e943['sendMessage'](_0x5a535f, {
                'text': 'ℹ️\x20*This\x20command\x20can\x20only\x20be\x20used\x20in\x20groups!*',
                ...channelInfo
            }, { 'quoted': _0x223d12 });
        }
        let _0x52b8b2 = ![];
        let _0x23f693 = ![];
        if (_0x15d9a7['adminOnly'] && _0xab313b) {
            const _0x4f2b51 = await _0x0_0x63df01(_0x34e943, _0x5a535f, _0x3e38cd);
            _0x52b8b2 = _0x4f2b51['isSenderAdmin'];
            _0x23f693 = _0x4f2b51['isBotAdmin'];
            if (!_0x23f693) {
                return await _0x34e943['sendMessage'](_0x5a535f, {
                    'text': 'ℹ️\x20*Please\x20make\x20the\x20bot\x20an\x20admin\x20to\x20use\x20this\x20command.*',
                    ...channelInfo
                }, { 'quoted': _0x223d12 });
            }
            if (!_0x52b8b2 && !_0x223d12['key']['fromMe'] && !_0x1b743) {
                return await _0x34e943['sendMessage'](_0x5a535f, {
                    'text': 'ℹ️\x20*Sorry,\x20only\x20group\x20admins\x20can\x20use\x20this\x20command.*',
                    ...channelInfo
                }, { 'quoted': _0x223d12 });
            }
        }
        const _0x50a6c9 = {
            'chatId': _0x5a535f,
            'senderId': _0x3e38cd,
            'isGroup': _0xab313b,
            'isSenderAdmin': _0x52b8b2,
            'isBotAdmin': _0x23f693,
            'senderIsOwnerOrSudo': _0x1b743,
            'isOwnerOrSudoCheck': _0xda983c,
            'channelInfo': channelInfo,
            'rawText': _0x504bb5,
            'userMessage': _0x52c4ab,
            'messageText': _0x3eb145,
            'config': _0x0_0x21d930
        };
        try {
            await _0x15d9a7['handler'](_0x34e943, _0x223d12, _0x2815bf, _0x50a6c9);
            await addCommandReaction(_0x34e943, _0x223d12);
            await showTypingAfterCommand(_0x34e943, _0x5a535f);
        } catch (_0x9fcaf3) {
            printLog('error', 'Command\x20error\x20[' + _0x15d9a7['command'] + ']:\x20' + _0x9fcaf3['message']);
            console['error'](_0x9fcaf3['stack']);
            await _0x34e943['sendMessage'](_0x5a535f, {
                'text': '❌\x20Error\x20executing\x20command:\x20' + _0x9fcaf3['message'],
                ...channelInfo
            }, { 'quoted': _0x223d12 });
            const _0x9166d8 = {
                'command': _0x15d9a7['command'],
                'error': _0x9fcaf3['message'],
                'stack': _0x9fcaf3['stack'],
                'timestamp': new Date()['toISOString'](),
                'user': _0x3e38cd,
                'chat': _0x5a535f
            };
            try {
                writeErrorLog(_0x9166d8);
            } catch (_0x272a70) {
                printLog('error', 'Failed\x20to\x20write\x20error\x20log:\x20' + _0x272a70['message']);
            }
        }
    } catch (_0x6642a7) {
        printLog('error', 'Message\x20handler\x20error:\x20' + _0x6642a7['message']);
        console['error'](_0x6642a7['stack']);
        const _0xebe4e2 = _0x4f417c['messages']?.[0x0]?.['key']?.['remoteJid'];
        if (_0xebe4e2) {
            try {
                await _0x34e943['sendMessage'](_0xebe4e2, {
                    'text': 'ℹ️\x20*Failed\x20to\x20process\x20message!*',
                    ...channelInfo
                });
            } catch (_0x23b1ae) {
                printLog('error', 'Failed\x20to\x20send\x20error\x20message:\x20' + _0x23b1ae['message']);
            }
        }
    }
}
async function handleGroupParticipantUpdate(_0x368876, _0x6924e6) {
    try {
        const {
            id: _0x4e9ce4,
            participants: _0x14b521,
            action: _0x47c1bb,
            author: _0x2ef572
        } = _0x6924e6;
        if (!_0x4e9ce4['endsWith']('@g.us'))
            return;
        const _0x2fbf21 = await _0x0_0x30e9aa['getBotMode']();
        const _0x5bb5e8 = _0x2ef572 ? await _0x0_0x3b0d79(_0x2ef572, _0x368876, _0x4e9ce4) : ![];
        const _0x5f00d4 = _0x2ef572 ? _0x2ef572 === _0x368876['user']['id'] || _0x2ef572 === _0x368876['user']['id']['split'](':')[0x0] + '@s.whatsapp.net' : ![];
        const _0x411701 = _0x5f00d4 || _0x5bb5e8;
        if ((_0x2fbf21 === 'private' || _0x2fbf21 === 'self') && !_0x411701) {
            return;
        }
        invalidateGroupCache(_0x4e9ce4);
        if (!_0x4e9ce4['endsWith']('@g.us'))
            return;
        printLog('info', 'Group\x20update:\x20' + _0x47c1bb + '\x20in\x20' + _0x4e9ce4['split']('@')[0x0]);
        const _0x55301b = _0x2fbf21 === 'public' || _0x2fbf21 === 'groups' || _0x411701;
        switch (_0x47c1bb) {
        case 'promote':
            if (!_0x55301b)
                return;
            const _0x20b83d = (await import('../plugins/promote.js'))['default']?.['handlePromotionEvent'];
            await _0x20b83d(_0x368876, _0x4e9ce4, _0x14b521, _0x2ef572);
            break;
        case 'demote':
            if (!_0x55301b)
                return;
            const _0x3397d7 = (await import('../plugins/demote.js'))['default']?.['handleDemotionEvent'];
            await _0x3397d7(_0x368876, _0x4e9ce4, _0x14b521, _0x2ef572);
            break;
        case 'add':
            const {handleJoinEvent: _0x330b54} = await import('../plugins/welcome.js');
            await _0x330b54(_0x368876, _0x4e9ce4, _0x14b521);
            break;
        case 'remove':
            const _0x44db1d = (await import('../plugins/goodbye.js'))['default']?.['handleLeaveEvent'];
            await _0x44db1d(_0x368876, _0x4e9ce4, _0x14b521);
            break;
        default:
            printLog('warning', 'Unhandled\x20group\x20action:\x20' + _0x47c1bb);
        }
    } catch (_0x478eb8) {
        printLog('error', 'Group\x20update\x20error:\x20' + _0x478eb8['message']);
        console['error'](_0x478eb8['stack']);
    }
}
async function handleStatus(_0x3013ea, _0x156d8b) {
    try {
        const {default: _0xdd837b} = await import('../plugins/autostatus.js');
        const _0x2bae54 = _0xdd837b['handleStatusUpdate'];
        await _0x2bae54(_0x3013ea, _0x156d8b);
    } catch (_0x42e706) {
        printLog('error', 'Status\x20handler\x20error:\x20' + _0x42e706['message']);
        console['error'](_0x42e706['stack']);
    }
}
async function handleCall(_0x3dd98b, _0x1a30b6) {
    try {
        const _0x390255 = (await import('../plugins/anticall.js'))['default'];
        const _0x1e6b70 = _0x390255['readState'] ? await _0x390255['readState']() : { 'enabled': ![] };
        if (!_0x1e6b70['enabled'])
            return;
        const _0xc6090a = new Set();
        for (const _0x3d1bcc of _0x1a30b6) {
            const _0xfada71 = _0x3d1bcc['from'] || _0x3d1bcc['peerJid'] || _0x3d1bcc['chatId'];
            if (!_0xfada71)
                continue;
            try {
                try {
                    if (typeof _0x3dd98b['rejectCall'] === 'function' && _0x3d1bcc['id']) {
                        await _0x3dd98b['rejectCall'](_0x3d1bcc['id'], _0xfada71);
                    } else if (typeof _0x3dd98b['sendCallOfferAck'] === 'function' && _0x3d1bcc['id']) {
                        await _0x3dd98b['sendCallOfferAck'](_0x3d1bcc['id'], _0xfada71, 'reject');
                    }
                } catch (_0x2908ce) {
                    printLog('error', 'Error\x20rejecting\x20call:\x20' + _0x2908ce['message']);
                }
                if (!_0xc6090a['has'](_0xfada71)) {
                    _0xc6090a['add'](_0xfada71);
                    setTimeout(() => _0xc6090a['delete'](_0xfada71), 0xea60);
                    await _0x3dd98b['sendMessage'](_0xfada71, { 'text': '📵\x20Anticall\x20is\x20enabled.\x20Your\x20call\x20was\x20rejected\x20and\x20you\x20will\x20be\x20blocked.' });
                    printLog('info', 'Sent\x20anticall\x20warning\x20to:\x20' + _0xfada71['split']('@')[0x0]);
                }
                setTimeout(async () => {
                    try {
                        await _0x3dd98b['updateBlockStatus'](_0xfada71, 'block');
                        printLog('success', 'Blocked\x20caller:\x20' + _0xfada71['split']('@')[0x0]);
                    } catch (_0x555164) {
                        printLog('error', 'Error\x20blocking\x20caller:\x20' + _0x555164['message']);
                    }
                }, 0x320);
            } catch (_0x2f1831) {
                printLog('error', 'Error\x20handling\x20call\x20from\x20' + _0xfada71['split']('@')[0x0] + ':\x20' + _0x2f1831['message']);
            }
        }
    } catch (_0x366c4c) {
        printLog('error', 'Call\x20handler\x20error:\x20' + _0x366c4c['message']);
        console['error'](_0x366c4c['stack']);
    }
}
export {
    handleMessages,
    handleGroupParticipantUpdate,
    handleStatus,
    handleCall
};