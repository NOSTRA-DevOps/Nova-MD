import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x4d636b from 'fs';
import { dataFile } from './paths.js';
import { handleChatbotResponse } from './Chatbots.js';
import _0x0_0x3db79c from '../config.js';
import _0x0_0x1ec840 from './lightweight_store.js';
import _0x0_0x131705 from './commandHandler.js';
import {
    printMessage,
    printLog
} from './print.js';
import { isBanned } from './isBanned.js';
import { isSudo } from './index.js';
import _0x0_0x19a378 from './isOwner.js';
import _0x0_0x40fa98 from './isAdmin.js';
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
import { handleTagDetection } from '../plugins/antitag.js';
import { handleMentionDetection } from '../plugins/mention.js';
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
        const _0x59cc0a = await _0x0_0x1ec840['getSetting']('global', 'stickerCommands');
        return _0x59cc0a || {};
    } else {
        try {
            if (!_0x0_0x4d636b['existsSync'](STICKER_FILE)) {
                return {};
            }
            return JSON['parse'](_0x0_0x4d636b['readFileSync'](STICKER_FILE, 'utf8'));
        } catch {
            return {};
        }
    }
}
async function handleMessages(_0x49c91d, _0x4a985a) {
    try {
        const {
            messages: _0x5a77f6,
            type: _0x1b0218
        } = _0x4a985a;
        if (_0x1b0218 !== 'notify')
            return;
        const _0x294404 = _0x5a77f6[0x0];
        if (!_0x294404?.['message'])
            return;
        const _0x17f580 = _0x294404['key']['remoteJid'];
        const _0x1b202c = _0x17f580['endsWith']('@g.us');
        const _0x39ffae = _0x294404['key']['participant'] || _0x294404['key']['remoteJid'];
        const _0x3b4621 = await _0x0_0x19a378(_0x39ffae, _0x49c91d, _0x17f580);
        const _0x1ce9ca = _0x294404['key']['fromMe'] || _0x3b4621;
        const _0x1ec008 = await _0x0_0x1ec840['getBotMode']();
        if ((_0x1ec008 === 'private' || _0x1ec008 === 'self') && !_0x1ce9ca) {
            return;
        }
        await printMessage(_0x294404, _0x49c91d);
        try {
            const _0x13cac0 = await _0x0_0x1ec840['getSetting']('global', 'stealthMode');
            if (!_0x13cac0 || !_0x13cac0['enabled']) {
                await handleAutoread(_0x49c91d, _0x294404);
            } else {
                printLog('info', '👻\x20Stealth\x20mode\x20active');
            }
        } catch (_0x7d2d56) {
            await handleAutoread(_0x49c91d, _0x294404);
        }
        if (_0x294404['message']?.['protocolMessage']?.['type'] === 0x0) {
            printLog('info', 'Message\x20deletion\x20detected');
            await handleMessageRevocation(_0x49c91d, _0x294404);
            return;
        }
        await storeMessage(_0x49c91d, _0x294404);
        if (_0x294404['pushName'] && _0x49c91d['store']?.['contacts']) {
            const _0x39f59d = _0x294404['key']['participant'] || _0x294404['key']['remoteJid'];
            if (_0x39f59d) {
                _0x49c91d['store']['contacts'][_0x39f59d] = {
                    ..._0x49c91d['store']['contacts'][_0x39f59d],
                    'id': _0x39f59d,
                    'notify': _0x294404['pushName'],
                    'name': _0x294404['pushName']
                };
                const _0x526e25 = _0x49c91d['decodeJid']?.(_0x39f59d);
                if (_0x526e25 && _0x526e25 !== _0x39f59d) {
                    _0x49c91d['store']['contacts'][_0x526e25] = {
                        ..._0x49c91d['store']['contacts'][_0x526e25],
                        'id': _0x526e25,
                        'notify': _0x294404['pushName'],
                        'name': _0x294404['pushName']
                    };
                }
            }
        }
        const _0x1a4a3c = _0x294404['key']['participant'] || _0x294404['key']['remoteJid'];
        if (_0x1a4a3c?.['includes']('@lid') && _0x49c91d['store']?.['contacts']) {
            const _0x3b200e = _0x49c91d['store']['contacts'];
            const _0x21013c = Object['keys'](_0x3b200e)['find'](_0x32a9d1 => _0x3b200e[_0x32a9d1]?.['lid'] === _0x1a4a3c || _0x3b200e[_0x32a9d1]?.['lid']?.['split'](':')[0x0] === _0x1a4a3c['split']('@')[0x0]);
            if (_0x21013c?.['includes']('@s.whatsapp.net'))
                _0x39ffae = _0x21013c;
        }
        if (_0x294404['message']?.['stickerMessage']) {
            const _0xb060a5 = _0x294404['message']['stickerMessage']['fileSha256'];
            if (_0xb060a5) {
                const _0xeb463 = Buffer['from'](_0xb060a5)['toString']('base64');
                const _0x212686 = await getStickerCommands();
                if (_0x212686[_0xeb463]) {
                    const _0xae4018 = _0x212686[_0xeb463]['text'];
                    const [_0x47359a, ..._0x4c9501] = _0xae4018['split']('\x20');
                    let _0x50137b = null;
                    let _0x180b52 = '';
                    for (const _0x34b457 of _0x0_0x3db79c['prefixes']) {
                        const _0x14fcd7 = (_0x34b457 + _0x47359a)['toLowerCase']();
                        _0x50137b = _0x0_0x131705['getCommand'](_0x14fcd7, _0x0_0x3db79c['prefixes']);
                        if (_0x50137b) {
                            _0x180b52 = _0x34b457;
                            break;
                        }
                    }
                    if (_0x50137b) {
                        const _0xb310e7 = await isSudo(_0x39ffae);
                        const _0x2733f5 = await _0x0_0x19a378(_0x39ffae, _0x49c91d, _0x17f580);
                        const _0x4364a8 = _0x294404['key']['fromMe'] || _0x2733f5;
                        const _0x540a72 = await _0x0_0x1ec840['getBotMode']();
                        const _0x470d78 = ((() => {
                            if (_0x4364a8)
                                return !![];
                            switch (_0x540a72) {
                            case 'public':
                                return !![];
                            case 'private':
                            case 'self':
                                return ![];
                            case 'groups':
                                return _0x1b202c;
                            case 'inbox':
                                return !_0x1b202c;
                            default:
                                return !![];
                            }
                        })());
                        if (!_0x470d78)
                            return;
                        const _0x280b70 = await isBanned(_0x39ffae);
                        if (_0x280b70)
                            return;
                        if (_0x50137b['strictOwnerOnly']) {
                            const {isOwnerOnly: _0x5f3406} = await import('./isOwner.js');
                            if (!_0x294404['key']['fromMe'] && !_0x5f3406(_0x39ffae)) {
                                await _0x49c91d['sendMessage'](_0x17f580, {
                                    'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20bot\x20owner!*',
                                    ...channelInfo
                                }, { 'quoted': _0x294404 });
                                return;
                            }
                        }
                        if (_0x50137b['ownerOnly'] && !_0x294404['key']['fromMe'] && !_0x2733f5) {
                            await _0x49c91d['sendMessage'](_0x17f580, {
                                'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20owner\x20or\x20sudo\x20users!*',
                                ...channelInfo
                            }, { 'quoted': _0x294404 });
                            return;
                        }
                        if (_0x50137b['groupOnly'] && !_0x1b202c) {
                            await _0x49c91d['sendMessage'](_0x17f580, {
                                'text': 'ℹ️\x20*This\x20command\x20can\x20only\x20be\x20used\x20in\x20groups!*',
                                ...channelInfo
                            }, { 'quoted': _0x294404 });
                            return;
                        }
                        let _0x5ca8ee = ![];
                        let _0x270188 = ![];
                        if (_0x50137b['adminOnly'] && _0x1b202c) {
                            const _0x18a6a2 = await _0x0_0x40fa98(_0x49c91d, _0x17f580, _0x39ffae);
                            _0x5ca8ee = _0x18a6a2['isSenderAdmin'];
                            _0x270188 = _0x18a6a2['isBotAdmin'];
                            if (!_0x270188) {
                                await _0x49c91d['sendMessage'](_0x17f580, {
                                    'text': 'ℹ️\x20*Please\x20make\x20the\x20bot\x20an\x20admin\x20to\x20use\x20this\x20command.*',
                                    ...channelInfo
                                }, { 'quoted': _0x294404 });
                                return;
                            }
                            if (!_0x5ca8ee && !_0x294404['key']['fromMe'] && !_0x2733f5) {
                                await _0x49c91d['sendMessage'](_0x17f580, {
                                    'text': 'ℹ️\x20*Sorry,\x20only\x20group\x20admins\x20can\x20use\x20this\x20command.*',
                                    ...channelInfo
                                }, { 'quoted': _0x294404 });
                                return;
                            }
                        }
                        const _0x184e9b = {
                            'key': _0x294404['key'],
                            'message': {
                                'extendedTextMessage': {
                                    'text': _0x180b52 + _0xae4018,
                                    'contextInfo': _0x294404['message']['stickerMessage']['contextInfo'] || {}
                                }
                            },
                            'messageTimestamp': _0x294404['messageTimestamp'],
                            'pushName': _0x294404['pushName'],
                            'broadcast': _0x294404['broadcast']
                        };
                        const _0x52e2eb = {
                            'chatId': _0x17f580,
                            'senderId': _0x39ffae,
                            'isGroup': _0x1b202c,
                            'isSenderAdmin': _0x5ca8ee,
                            'isBotAdmin': _0x270188,
                            'senderIsOwnerOrSudo': _0x2733f5,
                            'isOwnerOrSudoCheck': _0x4364a8,
                            'channelInfo': channelInfo,
                            'rawText': _0x180b52 + _0xae4018,
                            'userMessage': (_0x180b52 + _0xae4018)['toLowerCase'](),
                            'messageText': _0x180b52 + _0xae4018,
                            'config': _0x0_0x3db79c
                        };
                        try {
                            await _0x50137b['handler'](_0x49c91d, _0x184e9b, _0x4c9501, _0x52e2eb);
                            await addCommandReaction(_0x49c91d, _0x294404);
                            await showTypingAfterCommand(_0x49c91d, _0x17f580);
                            printLog('success', '✅\x20Sticker\x20command\x20executed:\x20' + _0xae4018);
                        } catch (_0x10b872) {
                            printLog('error', '❌\x20Sticker\x20command\x20error\x20[' + _0xae4018 + ']:\x20' + _0x10b872['message']);
                            console['error'](_0x10b872['stack']);
                            await _0x49c91d['sendMessage'](_0x17f580, {
                                'text': '❌\x20Error\x20executing\x20sticker\x20command:\x20' + _0x10b872['message'],
                                ...channelInfo
                            }, { 'quoted': _0x294404 });
                        }
                    } else {
                        printLog('warning', '⚠️\x20Sticker\x20command\x20not\x20found:\x20' + _0xae4018);
                    }
                    return;
                }
            }
        }
        const _0x2613e3 = _0x294404['message']?.['conversation'] || _0x294404['message']?.['extendedTextMessage']?.['text'] || _0x294404['message']?.['imageMessage']?.['caption'] || _0x294404['message']?.['videoMessage']?.['caption'] || _0x294404['message']?.['buttonsResponseMessage']?.['selectedButtonId'] || '';
        const _0x5cb8f9 = _0x2613e3['trim']();
        const _0x120436 = _0x5cb8f9['toLowerCase']();
        const _0x23aebb = await isSudo(_0x39ffae);
        startSchedulerEngine(_0x49c91d);
        if (!_0x294404['key']['fromMe']) {
            const _0x286644 = await handleAutoReply(_0x49c91d, _0x17f580, _0x294404, _0x120436);
            if (_0x286644)
                return;
        }
        if (_0x294404['message']?.['buttonsResponseMessage']) {
            const _0xdb5e7f = _0x294404['message']['buttonsResponseMessage']['selectedButtonId'];
            printLog('info', 'Button\x20response:\x20' + _0xdb5e7f);
            if (_0xdb5e7f === 'channel') {
                await _0x49c91d['sendMessage'](_0x17f580, { 'text': '*Join\x20our\x20Channel:*\x0a[https://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y](https://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y)' }, { 'quoted': _0x294404 });
                return;
            } else if (_0xdb5e7f === 'owner') {
                const _0x2350c7 = (await import('../plugins/owner.js'))['default'];
                await _0x2350c7['handler']?.(_0x49c91d, _0x17f580, '', {});
                return;
            } else if (_0xdb5e7f === 'support') {
                await _0x49c91d['sendMessage'](_0x17f580, { 'text': '*Support*\x0a\x0ahttps://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y' }, { 'quoted': _0x294404 });
                return;
            }
        }
        const _0x36d03e = await isBanned(_0x39ffae);
        if (_0x36d03e && !_0x120436['startsWith']('.unban')) {
            if (Math['random']() < 0.1) {
                printLog('warning', 'Banned\x20user\x20attempted\x20command:\x20' + _0x39ffae['split']('@')[0x0]);
                await _0x49c91d['sendMessage'](_0x17f580, {
                    'text': 'You\x20are\x20banned\x20from\x20using\x20the\x20bot.\x20Contact\x20an\x20admin\x20to\x20get\x20unbanned.',
                    ...channelInfo
                });
            }
            return;
        }
        if (/^[1-9]$/['test'](_0x120436) || _0x120436 === 'surrender') {
            await handleTicTacToeMove(_0x49c91d, _0x17f580, _0x39ffae, _0x120436);
            return;
        }
        if (!_0x294404['key']['fromMe']) {
            await _0x0_0x1ec840['incrementMessageCount'](_0x17f580, _0x39ffae, _0x294404['pushName']);
        } else {
            const _0x55629b = _0x49c91d['user']?.['id'] || _0x39ffae;
            const _0x557c2b = _0x49c91d['user']?.['name'] || _0x49c91d['user']?.['notify'] || 'Me';
            await _0x0_0x1ec840['incrementMessageCount'](_0x17f580, _0x55629b, _0x557c2b);
        }
        if (_0x1b202c) {
            if (_0x120436) {
                await handleBadwordDetection(_0x49c91d, _0x17f580, _0x294404, _0x120436, _0x39ffae);
            }
            await handleLinkDetection(_0x49c91d, _0x17f580, _0x294404, _0x120436, _0x39ffae);
        }
        if (_0x1b202c && !_0x294404['key']['fromMe']) {
            const _0x2f01e1 = await handleAntiSpam(_0x49c91d, _0x17f580, _0x294404, _0x39ffae, _0x3b4621);
            if (_0x2f01e1)
                return;
        }
        if (!_0x1b202c && !_0x294404['key']['fromMe'] && !_0x23aebb) {
            try {
                const _0x2bd5dc = (await import('../plugins/pmblocker.js'))['default'];
                const _0xb30bd = _0x2bd5dc?.['readState'];
                const _0x51f199 = await _0xb30bd();
                if (_0x51f199['enabled']) {
                    printLog('warning', 'PM\x20blocked\x20from:\x20' + _0x39ffae['split']('@')[0x0]);
                    await _0x49c91d['sendMessage'](_0x17f580, { 'text': _0x51f199['message'] || 'Private\x20messages\x20are\x20blocked.\x20Please\x20contact\x20the\x20owner\x20in\x20groups\x20only.' });
                    await new Promise(_0x4b517a => setTimeout(_0x4b517a, 0x5dc));
                    try {
                        await _0x49c91d['updateBlockStatus'](_0x17f580, 'block');
                        printLog('success', 'Blocked\x20user:\x20' + _0x39ffae['split']('@')[0x0]);
                    } catch (_0x38ae60) {
                        printLog('error', 'Failed\x20to\x20block\x20user:\x20' + _0x38ae60['message']);
                    }
                    return;
                }
            } catch (_0x1f5528) {
                printLog('error', 'PM\x20blocker\x20error:\x20' + _0x1f5528['message']);
            }
        }
        const _0x1dac89 = _0x0_0x3db79c['prefixes']?.['find'](_0x3ae8f0 => _0x120436['startsWith'](_0x3ae8f0));
        const _0x136417 = _0x0_0x131705['getCommand'](_0x120436, _0x0_0x3db79c['prefixes']);
        if (!_0x1dac89 && !_0x136417) {
            await handleAutotypingForMessage(_0x49c91d, _0x17f580, _0x120436);
            const _0x56aef7 = await _0x0_0x1ec840['getBotMode']();
            const _0x3fa00f = _0x56aef7 === 'public' || _0x56aef7 === 'groups' && _0x1b202c || _0x56aef7 === 'inbox' && !_0x1b202c || _0x1ce9ca;
            if (_0x3fa00f) {
                if (_0x1b202c && _0x120436['length'] < 0x3) {
                    const _0x2725aa = 'nova';
                    if (!_0x120436['includes'](_0x2725aa) && !_0x120436['includes']('@')) {
                        return;
                    }
                }
                await handleChatbotResponse(_0x49c91d, _0x17f580, _0x294404, _0x120436, _0x39ffae);
            }
            return;
        }
        if (!_0x136417) {
            const _0x4d9b70 = 'nova';
            const _0x1415db = _0x120436['includes'](_0x4d9b70) || _0x120436['includes']('@nova');
            if (_0x1415db) {
                const _0x37cc9f = await _0x0_0x1ec840['getBotMode']();
                const _0x4ffe39 = _0x37cc9f === 'public' || _0x37cc9f === 'groups' && _0x1b202c || _0x37cc9f === 'inbox' && !_0x1b202c || _0x1ce9ca;
                if (_0x4ffe39) {
                    await handleChatbotResponse(_0x49c91d, _0x17f580, _0x294404, _0x120436, _0x39ffae);
                    return;
                }
            }
            return;
        }
        const _0x1fd1d8 = ((() => {
            if (_0x1ce9ca)
                return !![];
            switch (_0x1ec008) {
            case 'public':
                return !![];
            case 'private':
            case 'self':
                return ![];
            case 'groups':
                return _0x1b202c;
            case 'inbox':
                return !_0x1b202c;
            default:
                return !![];
            }
        })());
        if (!_0x1fd1d8) {
            return;
        }
        let _0x4bcc55;
        if (_0x1dac89) {
            const _0x20b3e9 = _0x5cb8f9['slice'](_0x1dac89['length'])['trim']();
            _0x4bcc55 = _0x20b3e9['split'](/\s+/)['slice'](0x1);
        } else {
            _0x4bcc55 = _0x5cb8f9['trim']()['split'](/\s+/)['slice'](0x1);
        }
        if (_0x136417['strictOwnerOnly']) {
            const {isOwnerOnly: _0x2f63e4} = await import('./isOwner.js');
            if (!_0x294404['key']['fromMe'] && !_0x2f63e4(_0x39ffae)) {
                await _0x49c91d['sendMessage'](_0x17f580, {
                    'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20bot\x20owner!*\x0a\x0a_Sudo\x20users\x20cannot\x20manage\x20other\x20sudo\x20users._',
                    ...channelInfo
                }, { 'quoted': _0x294404 });
                return;
            }
        }
        if (_0x136417['ownerOnly'] && !_0x294404['key']['fromMe'] && !_0x3b4621) {
            await _0x49c91d['sendMessage'](_0x17f580, {
                'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20owner\x20or\x20sudo\x20users!*',
                ...channelInfo
            }, { 'quoted': _0x294404 });
            return;
        }
        if (_0x136417['groupOnly'] && !_0x1b202c) {
            await _0x49c91d['sendMessage'](_0x17f580, {
                'text': 'ℹ️\x20*This\x20command\x20can\x20only\x20be\x20used\x20in\x20groups!*',
                ...channelInfo
            }, { 'quoted': _0x294404 });
            return;
        }
        let _0x1a6b15 = ![];
        let _0x1a6d82 = ![];
        if (_0x136417['adminOnly'] && _0x1b202c) {
            const _0x374ce9 = await _0x0_0x40fa98(_0x49c91d, _0x17f580, _0x39ffae);
            _0x1a6b15 = _0x374ce9['isSenderAdmin'];
            _0x1a6d82 = _0x374ce9['isBotAdmin'];
            if (!_0x1a6d82) {
                await _0x49c91d['sendMessage'](_0x17f580, {
                    'text': 'ℹ️\x20*Please\x20make\x20the\x20bot\x20an\x20admin\x20to\x20use\x20this\x20command.*',
                    ...channelInfo
                }, { 'quoted': _0x294404 });
                return;
            }
            if (!_0x1a6b15 && !_0x294404['key']['fromMe'] && !_0x3b4621) {
                await _0x49c91d['sendMessage'](_0x17f580, {
                    'text': 'ℹ️\x20*Sorry,\x20only\x20group\x20admins\x20can\x20use\x20this\x20command.*',
                    ...channelInfo
                }, { 'quoted': _0x294404 });
                return;
            }
        }
        const _0x473743 = {
            'chatId': _0x17f580,
            'senderId': _0x39ffae,
            'isGroup': _0x1b202c,
            'isSenderAdmin': _0x1a6b15,
            'isBotAdmin': _0x1a6d82,
            'senderIsOwnerOrSudo': _0x3b4621,
            'isOwnerOrSudoCheck': _0x1ce9ca,
            'channelInfo': channelInfo,
            'rawText': _0x2613e3,
            'userMessage': _0x120436,
            'messageText': _0x5cb8f9,
            'config': _0x0_0x3db79c
        };
        try {
            await _0x136417['handler'](_0x49c91d, _0x294404, _0x4bcc55, _0x473743);
            await addCommandReaction(_0x49c91d, _0x294404);
            await showTypingAfterCommand(_0x49c91d, _0x17f580);
        } catch (_0x49f54b) {
            printLog('error', 'Command\x20error\x20[' + _0x136417['command'] + ']:\x20' + _0x49f54b['message']);
            console['error'](_0x49f54b['stack']);
            await _0x49c91d['sendMessage'](_0x17f580, {
                'text': '❌\x20Error\x20executing\x20command:\x20' + _0x49f54b['message'],
                ...channelInfo
            }, { 'quoted': _0x294404 });
            const _0x2d12de = {
                'command': _0x136417['command'],
                'error': _0x49f54b['message'],
                'stack': _0x49f54b['stack'],
                'timestamp': new Date()['toISOString'](),
                'user': _0x39ffae,
                'chat': _0x17f580
            };
            try {
                writeErrorLog(_0x2d12de);
            } catch (_0x198a79) {
                printLog('error', 'Failed\x20to\x20write\x20error\x20log:\x20' + _0x198a79['message']);
            }
        }
    } catch (_0xde749f) {
        printLog('error', 'Message\x20handler\x20error:\x20' + _0xde749f['message']);
        console['error'](_0xde749f['stack']);
        const _0x375274 = _0x4a985a['messages']?.[0x0]?.['key']?.['remoteJid'];
        if (_0x375274) {
            try {
                await _0x49c91d['sendMessage'](_0x375274, {
                    'text': 'ℹ️\x20*Failed\x20to\x20process\x20message!*',
                    ...channelInfo
                });
            } catch (_0x4889fd) {
                printLog('error', 'Failed\x20to\x20send\x20error\x20message:\x20' + _0x4889fd['message']);
            }
        }
    }
}
async function handleGroupParticipantUpdate(_0xdae156, _0x1df3c6) {
    try {
        const {
            id: _0x10d0a4,
            participants: _0xe8625e,
            action: _0x5f28e6,
            author: _0x2472ae
        } = _0x1df3c6;
        if (!_0x10d0a4['endsWith']('@g.us'))
            return;
        const _0x1312cd = await _0x0_0x1ec840['getBotMode']();
        const _0x2cd8a4 = _0x2472ae ? await _0x0_0x19a378(_0x2472ae, _0xdae156, _0x10d0a4) : ![];
        const _0x4ce14a = _0x2472ae ? _0x2472ae === _0xdae156['user']['id'] || _0x2472ae === _0xdae156['user']['id']['split'](':')[0x0] + '@s.whatsapp.net' : ![];
        const _0x3ba536 = _0x4ce14a || _0x2cd8a4;
        if ((_0x1312cd === 'private' || _0x1312cd === 'self') && !_0x3ba536) {
            return;
        }
        invalidateGroupCache(_0x10d0a4);
        if (!_0x10d0a4['endsWith']('@g.us'))
            return;
        printLog('info', 'Group\x20update:\x20' + _0x5f28e6 + '\x20in\x20' + _0x10d0a4['split']('@')[0x0]);
        const _0xc0d088 = _0x1312cd === 'public' || _0x1312cd === 'groups' || _0x3ba536;
        switch (_0x5f28e6) {
        case 'promote':
            if (!_0xc0d088)
                return;
            const _0x2a5230 = (await import('../plugins/promote.js'))['default']?.['handlePromotionEvent'];
            await _0x2a5230(_0xdae156, _0x10d0a4, _0xe8625e, _0x2472ae);
            break;
        case 'demote':
            if (!_0xc0d088)
                return;
            const _0x2efd70 = (await import('../plugins/demote.js'))['default']?.['handleDemotionEvent'];
            await _0x2efd70(_0xdae156, _0x10d0a4, _0xe8625e, _0x2472ae);
            break;
        case 'add':
            const {handleJoinEvent: _0xab7e25} = await import('../plugins/welcome.js');
            await _0xab7e25(_0xdae156, _0x10d0a4, _0xe8625e);
            break;
        case 'remove':
            const _0x1afc2b = (await import('../plugins/goodbye.js'))['default']?.['handleLeaveEvent'];
            await _0x1afc2b(_0xdae156, _0x10d0a4, _0xe8625e);
            break;
        default:
            printLog('warning', 'Unhandled\x20group\x20action:\x20' + _0x5f28e6);
        }
    } catch (_0x50573d) {
        printLog('error', 'Group\x20update\x20error:\x20' + _0x50573d['message']);
        console['error'](_0x50573d['stack']);
    }
}
async function handleStatus(_0x1aebfd, _0x366c65) {
    try {
        const {default: _0x4c9076} = await import('../plugins/autostatus.js');
        const _0x5c0078 = _0x4c9076['handleStatusUpdate'];
        await _0x5c0078(_0x1aebfd, _0x366c65);
    } catch (_0x1ecc66) {
        printLog('error', 'Status\x20handler\x20error:\x20' + _0x1ecc66['message']);
        console['error'](_0x1ecc66['stack']);
    }
}
async function handleCall(_0x2a33a7, _0x89027f) {
    try {
        const _0x4a27ae = (await import('../plugins/anticall.js'))['default'];
        const _0x5327ad = _0x4a27ae['readState'] ? await _0x4a27ae['readState']() : { 'enabled': ![] };
        if (!_0x5327ad['enabled'])
            return;
        const _0x191df1 = new Set();
        for (const _0xe9808b of _0x89027f) {
            const _0x315b5b = _0xe9808b['from'] || _0xe9808b['peerJid'] || _0xe9808b['chatId'];
            if (!_0x315b5b)
                continue;
            try {
                try {
                    if (typeof _0x2a33a7['rejectCall'] === 'function' && _0xe9808b['id']) {
                        await _0x2a33a7['rejectCall'](_0xe9808b['id'], _0x315b5b);
                    } else if (typeof _0x2a33a7['sendCallOfferAck'] === 'function' && _0xe9808b['id']) {
                        await _0x2a33a7['sendCallOfferAck'](_0xe9808b['id'], _0x315b5b, 'reject');
                    }
                } catch (_0x4eb531) {
                    printLog('error', 'Error\x20rejecting\x20call:\x20' + _0x4eb531['message']);
                }
                if (!_0x191df1['has'](_0x315b5b)) {
                    _0x191df1['add'](_0x315b5b);
                    setTimeout(() => _0x191df1['delete'](_0x315b5b), 0xea60);
                    await _0x2a33a7['sendMessage'](_0x315b5b, { 'text': '📵\x20Anticall\x20is\x20enabled.\x20Your\x20call\x20was\x20rejected\x20and\x20you\x20will\x20be\x20blocked.' });
                    printLog('info', 'Sent\x20anticall\x20warning\x20to:\x20' + _0x315b5b['split']('@')[0x0]);
                }
                setTimeout(async () => {
                    try {
                        await _0x2a33a7['updateBlockStatus'](_0x315b5b, 'block');
                        printLog('success', 'Blocked\x20caller:\x20' + _0x315b5b['split']('@')[0x0]);
                    } catch (_0x1b3ad0) {
                        printLog('error', 'Error\x20blocking\x20caller:\x20' + _0x1b3ad0['message']);
                    }
                }, 0x320);
            } catch (_0x5b97ee) {
                printLog('error', 'Error\x20handling\x20call\x20from\x20' + _0x315b5b['split']('@')[0x0] + ':\x20' + _0x5b97ee['message']);
            }
        }
    } catch (_0x2ccb0f) {
        printLog('error', 'Call\x20handler\x20error:\x20' + _0x2ccb0f['message']);
        console['error'](_0x2ccb0f['stack']);
    }
}
export {
    handleMessages,
    handleGroupParticipantUpdate,
    handleStatus,
    handleCall
};