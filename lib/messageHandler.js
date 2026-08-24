import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x5d17c2 from 'fs';
import { dataFile } from './paths.js';
import _0x0_0x32bce2 from '../config.js';
import _0x0_0x3490fd from './lightweight_store.js';
import _0x0_0x2f2e01 from './commandHandler.js';
import {
    printMessage,
    printLog
} from './print.js';
import { isBanned } from './isBanned.js';
import { isSudo } from './index.js';
import _0x0_0x3bbe97 from './isOwner.js';
import _0x0_0x1b0420 from './isAdmin.js';
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
import { handleChatbotResponse } from '../plugins/chatbot.js';
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
        const _0xf4365c = await _0x0_0x3490fd['getSetting']('global', 'stickerCommands');
        return _0xf4365c || {};
    } else {
        try {
            if (!_0x0_0x5d17c2['existsSync'](STICKER_FILE)) {
                return {};
            }
            return JSON['parse'](_0x0_0x5d17c2['readFileSync'](STICKER_FILE, 'utf8'));
        } catch {
            return {};
        }
    }
}
async function handleMessages(_0x503bae, _0x4b933a) {
    try {
        const {
            messages: _0x2e1be0,
            type: _0x4d93dd
        } = _0x4b933a;
        if (_0x4d93dd !== 'notify')
            return;
        const _0x46f5a1 = _0x2e1be0[0x0];
        if (!_0x46f5a1?.['message'])
            return;
        const _0x3496a2 = _0x46f5a1['key']['remoteJid'];
        const _0xfc198b = _0x3496a2['endsWith']('@g.us');
        const _0x382a90 = _0x46f5a1['key']['participant'] || _0x46f5a1['key']['remoteJid'];
        const _0x447235 = await _0x0_0x3bbe97(_0x382a90, _0x503bae, _0x3496a2);
        const _0x3b6b16 = _0x46f5a1['key']['fromMe'] || _0x447235;
        const _0x29f3e5 = await _0x0_0x3490fd['getBotMode']();
        if ((_0x29f3e5 === 'private' || _0x29f3e5 === 'self') && !_0x3b6b16) {
            return;
        }
        await printMessage(_0x46f5a1, _0x503bae);
        try {
            const _0x182cc2 = await _0x0_0x3490fd['getSetting']('global', 'stealthMode');
            if (!_0x182cc2 || !_0x182cc2['enabled']) {
                await handleAutoread(_0x503bae, _0x46f5a1);
            } else {
                printLog('info', '👻\x20Stealth\x20mode\x20active');
            }
        } catch (_0x3a3005) {
            await handleAutoread(_0x503bae, _0x46f5a1);
        }
        if (_0x46f5a1['message']?.['protocolMessage']?.['type'] === 0x0) {
            printLog('info', 'Message\x20deletion\x20detected');
            await handleMessageRevocation(_0x503bae, _0x46f5a1);
            return;
        }
        await storeMessage(_0x503bae, _0x46f5a1);
        if (_0x46f5a1['pushName'] && _0x503bae['store']?.['contacts']) {
            const _0x4d826d = _0x46f5a1['key']['participant'] || _0x46f5a1['key']['remoteJid'];
            if (_0x4d826d) {
                _0x503bae['store']['contacts'][_0x4d826d] = {
                    ..._0x503bae['store']['contacts'][_0x4d826d],
                    'id': _0x4d826d,
                    'notify': _0x46f5a1['pushName'],
                    'name': _0x46f5a1['pushName']
                };
                const _0x322ccc = _0x503bae['decodeJid']?.(_0x4d826d);
                if (_0x322ccc && _0x322ccc !== _0x4d826d) {
                    _0x503bae['store']['contacts'][_0x322ccc] = {
                        ..._0x503bae['store']['contacts'][_0x322ccc],
                        'id': _0x322ccc,
                        'notify': _0x46f5a1['pushName'],
                        'name': _0x46f5a1['pushName']
                    };
                }
            }
        }
        const _0x5e31f5 = _0x46f5a1['key']['participant'] || _0x46f5a1['key']['remoteJid'];
        if (_0x5e31f5?.['includes']('@lid') && _0x503bae['store']?.['contacts']) {
            const _0x411f5a = _0x503bae['store']['contacts'];
            const _0x1584d5 = Object['keys'](_0x411f5a)['find'](_0x20938d => _0x411f5a[_0x20938d]?.['lid'] === _0x5e31f5 || _0x411f5a[_0x20938d]?.['lid']?.['split'](':')[0x0] === _0x5e31f5['split']('@')[0x0]);
            if (_0x1584d5?.['includes']('@s.whatsapp.net'))
                _0x382a90 = _0x1584d5;
        }
        if (_0x46f5a1['message']?.['stickerMessage']) {
            const _0x22b224 = _0x46f5a1['message']['stickerMessage']['fileSha256'];
            if (_0x22b224) {
                const _0x5c0c9e = Buffer['from'](_0x22b224)['toString']('base64');
                const _0x17db5a = await getStickerCommands();
                if (_0x17db5a[_0x5c0c9e]) {
                    const _0x44db1c = _0x17db5a[_0x5c0c9e]['text'];
                    const [_0x327c00, ..._0x4af143] = _0x44db1c['split']('\x20');
                    let _0x1fbb97 = null;
                    let _0x5b89f6 = '';
                    for (const _0x1cbdd0 of _0x0_0x32bce2['prefixes']) {
                        const _0x1eece0 = (_0x1cbdd0 + _0x327c00)['toLowerCase']();
                        _0x1fbb97 = _0x0_0x2f2e01['getCommand'](_0x1eece0, _0x0_0x32bce2['prefixes']);
                        if (_0x1fbb97) {
                            _0x5b89f6 = _0x1cbdd0;
                            break;
                        }
                    }
                    if (_0x1fbb97) {
                        const _0x55e3b9 = await isSudo(_0x382a90);
                        const _0x40aa83 = await _0x0_0x3bbe97(_0x382a90, _0x503bae, _0x3496a2);
                        const _0x430425 = _0x46f5a1['key']['fromMe'] || _0x40aa83;
                        const _0x5573d7 = await _0x0_0x3490fd['getBotMode']();
                        const _0x4dca62 = ((() => {
                            if (_0x430425)
                                return !![];
                            switch (_0x5573d7) {
                            case 'public':
                                return !![];
                            case 'private':
                            case 'self':
                                return ![];
                            case 'groups':
                                return _0xfc198b;
                            case 'inbox':
                                return !_0xfc198b;
                            default:
                                return !![];
                            }
                        })());
                        if (!_0x4dca62)
                            return;
                        const _0x5afc75 = await isBanned(_0x382a90);
                        if (_0x5afc75)
                            return;
                        if (_0x1fbb97['strictOwnerOnly']) {
                            const {isOwnerOnly: _0x28dea6} = await import('./isOwner.js');
                            if (!_0x46f5a1['key']['fromMe'] && !_0x28dea6(_0x382a90)) {
                                return await _0x503bae['sendMessage'](_0x3496a2, {
                                    'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20bot\x20owner!*',
                                    ...channelInfo
                                }, { 'quoted': _0x46f5a1 });
                            }
                        }
                        if (_0x1fbb97['ownerOnly'] && !_0x46f5a1['key']['fromMe'] && !_0x40aa83) {
                            return await _0x503bae['sendMessage'](_0x3496a2, {
                                'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20owner\x20or\x20sudo\x20users!*',
                                ...channelInfo
                            }, { 'quoted': _0x46f5a1 });
                        }
                        if (_0x1fbb97['groupOnly'] && !_0xfc198b) {
                            return await _0x503bae['sendMessage'](_0x3496a2, {
                                'text': 'ℹ️\x20*This\x20command\x20can\x20only\x20be\x20used\x20in\x20groups!*',
                                ...channelInfo
                            }, { 'quoted': _0x46f5a1 });
                        }
                        let _0x40bc40 = ![];
                        let _0x1b97a3 = ![];
                        if (_0x1fbb97['adminOnly'] && _0xfc198b) {
                            const _0x188ea5 = await _0x0_0x1b0420(_0x503bae, _0x3496a2, _0x382a90);
                            _0x40bc40 = _0x188ea5['isSenderAdmin'];
                            _0x1b97a3 = _0x188ea5['isBotAdmin'];
                            if (!_0x1b97a3) {
                                return await _0x503bae['sendMessage'](_0x3496a2, {
                                    'text': 'ℹ️\x20*Please\x20make\x20the\x20bot\x20an\x20admin\x20to\x20use\x20this\x20command.*',
                                    ...channelInfo
                                }, { 'quoted': _0x46f5a1 });
                            }
                            if (!_0x40bc40 && !_0x46f5a1['key']['fromMe'] && !_0x40aa83) {
                                return await _0x503bae['sendMessage'](_0x3496a2, {
                                    'text': 'ℹ️\x20*Sorry,\x20only\x20group\x20admins\x20can\x20use\x20this\x20command.*',
                                    ...channelInfo
                                }, { 'quoted': _0x46f5a1 });
                            }
                        }
                        const _0x15930b = {
                            'key': _0x46f5a1['key'],
                            'message': {
                                'extendedTextMessage': {
                                    'text': _0x5b89f6 + _0x44db1c,
                                    'contextInfo': _0x46f5a1['message']['stickerMessage']['contextInfo'] || {}
                                }
                            },
                            'messageTimestamp': _0x46f5a1['messageTimestamp'],
                            'pushName': _0x46f5a1['pushName'],
                            'broadcast': _0x46f5a1['broadcast']
                        };
                        const _0x59d743 = {
                            'chatId': _0x3496a2,
                            'senderId': _0x382a90,
                            'isGroup': _0xfc198b,
                            'isSenderAdmin': _0x40bc40,
                            'isBotAdmin': _0x1b97a3,
                            'senderIsOwnerOrSudo': _0x40aa83,
                            'isOwnerOrSudoCheck': _0x430425,
                            'channelInfo': channelInfo,
                            'rawText': _0x5b89f6 + _0x44db1c,
                            'userMessage': (_0x5b89f6 + _0x44db1c)['toLowerCase'](),
                            'messageText': _0x5b89f6 + _0x44db1c,
                            'config': _0x0_0x32bce2
                        };
                        try {
                            await _0x1fbb97['handler'](_0x503bae, _0x15930b, _0x4af143, _0x59d743);
                            await addCommandReaction(_0x503bae, _0x46f5a1);
                            await showTypingAfterCommand(_0x503bae, _0x3496a2);
                            printLog('success', '✅\x20Sticker\x20command\x20executed:\x20' + _0x44db1c);
                        } catch (_0x79aa17) {
                            printLog('error', '❌\x20Sticker\x20command\x20error\x20[' + _0x44db1c + ']:\x20' + _0x79aa17['message']);
                            console['error'](_0x79aa17['stack']);
                            await _0x503bae['sendMessage'](_0x3496a2, {
                                'text': '❌\x20Error\x20executing\x20sticker\x20command:\x20' + _0x79aa17['message'],
                                ...channelInfo
                            }, { 'quoted': _0x46f5a1 });
                        }
                    } else {
                        printLog('warning', '⚠️\x20Sticker\x20command\x20not\x20found:\x20' + _0x44db1c);
                    }
                    return;
                }
            }
        }
        const _0x5f23e6 = _0x46f5a1['message']?.['conversation'] || _0x46f5a1['message']?.['extendedTextMessage']?.['text'] || _0x46f5a1['message']?.['imageMessage']?.['caption'] || _0x46f5a1['message']?.['videoMessage']?.['caption'] || _0x46f5a1['message']?.['buttonsResponseMessage']?.['selectedButtonId'] || '';
        const _0x71cd4 = _0x5f23e6['trim']();
        const _0x501fa5 = _0x71cd4['toLowerCase']();
        const _0x3468a4 = await isSudo(_0x382a90);
        startSchedulerEngine(_0x503bae);
        if (!_0x46f5a1['key']['fromMe']) {
            const _0x5f38a0 = await handleAutoReply(_0x503bae, _0x3496a2, _0x46f5a1, _0x501fa5);
            if (_0x5f38a0)
                return;
        }
        if (_0x46f5a1['message']?.['buttonsResponseMessage']) {
            const _0x219fc7 = _0x46f5a1['message']['buttonsResponseMessage']['selectedButtonId'];
            printLog('info', 'Button\x20response:\x20' + _0x219fc7);
            if (_0x219fc7 === 'channel') {
                await _0x503bae['sendMessage'](_0x3496a2, { 'text': '*Join\x20our\x20Channel:*\x0a[https://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y](https://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y)' }, { 'quoted': _0x46f5a1 });
                return;
            } else if (_0x219fc7 === 'owner') {
                const _0x1ccafe = (await import('../plugins/owner.js'))['default'];
                await _0x1ccafe['handler']?.(_0x503bae, _0x3496a2, '', {});
                return;
            } else if (_0x219fc7 === 'support') {
                await _0x503bae['sendMessage'](_0x3496a2, { 'text': '*Support*\x0a\x0ahttps://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y' }, { 'quoted': _0x46f5a1 });
                return;
            }
        }
        const _0xe7f40a = await isBanned(_0x382a90);
        if (_0xe7f40a && !_0x501fa5['startsWith']('.unban')) {
            if (Math['random']() < 0.1) {
                printLog('warning', 'Banned\x20user\x20attempted\x20command:\x20' + _0x382a90['split']('@')[0x0]);
                await _0x503bae['sendMessage'](_0x3496a2, {
                    'text': 'You\x20are\x20banned\x20from\x20using\x20the\x20bot.\x20Contact\x20an\x20admin\x20to\x20get\x20unbanned.',
                    ...channelInfo
                });
            }
            return;
        }
        if (/^[1-9]$/['test'](_0x501fa5) || _0x501fa5 === 'surrender') {
            await handleTicTacToeMove(_0x503bae, _0x3496a2, _0x382a90, _0x501fa5);
            return;
        }
        if (!_0x46f5a1['key']['fromMe']) {
            await _0x0_0x3490fd['incrementMessageCount'](_0x3496a2, _0x382a90, _0x46f5a1['pushName']);
        } else {
            const _0x5aef2c = _0x503bae['user']?.['id'] || _0x382a90;
            const _0x152217 = _0x503bae['user']?.['name'] || _0x503bae['user']?.['notify'] || 'Me';
            await _0x0_0x3490fd['incrementMessageCount'](_0x3496a2, _0x5aef2c, _0x152217);
        }
        if (_0xfc198b) {
            if (_0x501fa5) {
                await handleBadwordDetection(_0x503bae, _0x3496a2, _0x46f5a1, _0x501fa5, _0x382a90);
            }
            await handleLinkDetection(_0x503bae, _0x3496a2, _0x46f5a1, _0x501fa5, _0x382a90);
        }
        if (_0xfc198b && !_0x46f5a1['key']['fromMe']) {
            const _0x52670f = await handleAntiSpam(_0x503bae, _0x3496a2, _0x46f5a1, _0x382a90, _0x447235);
            if (_0x52670f)
                return;
        }
        if (!_0xfc198b && !_0x46f5a1['key']['fromMe'] && !_0x3468a4) {
            try {
                const _0x1de71d = (await import('../plugins/pmblocker.js'))['default'];
                const _0x38d1be = _0x1de71d?.['readState'];
                const _0x36b8d9 = await _0x38d1be();
                if (_0x36b8d9['enabled']) {
                    printLog('warning', 'PM\x20blocked\x20from:\x20' + _0x382a90['split']('@')[0x0]);
                    await _0x503bae['sendMessage'](_0x3496a2, { 'text': _0x36b8d9['message'] || 'Private\x20messages\x20are\x20blocked.\x20Please\x20contact\x20the\x20owner\x20in\x20groups\x20only.' });
                    await new Promise(_0x23351e => setTimeout(_0x23351e, 0x5dc));
                    try {
                        await _0x503bae['updateBlockStatus'](_0x3496a2, 'block');
                        printLog('success', 'Blocked\x20user:\x20' + _0x382a90['split']('@')[0x0]);
                    } catch (_0x5a7b1f) {
                        printLog('error', 'Failed\x20to\x20block\x20user:\x20' + _0x5a7b1f['message']);
                    }
                    return;
                }
            } catch (_0x326589) {
                printLog('error', 'PM\x20blocker\x20error:\x20' + _0x326589['message']);
            }
        }
        const _0x167dcf = _0x0_0x32bce2['prefixes']?.['find'](_0x34a217 => _0x501fa5['startsWith'](_0x34a217));
        const _0x5873bd = _0x0_0x2f2e01['getCommand'](_0x501fa5, _0x0_0x32bce2['prefixes']);
        if (!_0x167dcf && !_0x5873bd) {
            await handleAutotypingForMessage(_0x503bae, _0x3496a2, _0x501fa5);
            if (_0xfc198b) {
                await handleTagDetection(_0x503bae, _0x3496a2, _0x46f5a1, _0x382a90);
                await handleMentionDetection(_0x503bae, _0x3496a2, _0x46f5a1);
                const _0x2043ca = await _0x0_0x3490fd['getBotMode']();
                const _0x28a584 = _0x2043ca === 'public' || _0x2043ca === 'groups' && _0xfc198b || _0x2043ca === 'inbox' && !_0xfc198b || _0x3b6b16;
                if (_0x28a584) {
                    await handleChatbotResponse(_0x503bae, _0x3496a2, _0x46f5a1, _0x501fa5, _0x382a90);
                }
            }
            return;
        }
        if (!_0x5873bd) {
            if (_0xfc198b) {
                await handleTagDetection(_0x503bae, _0x3496a2, _0x46f5a1, _0x382a90);
                await handleMentionDetection(_0x503bae, _0x3496a2, _0x46f5a1);
                const _0x2e1ad2 = await _0x0_0x3490fd['getBotMode']();
                const _0x5c9c34 = _0x2e1ad2 === 'public' || _0x2e1ad2 === 'groups' && _0xfc198b || _0x2e1ad2 === 'inbox' && !_0xfc198b || _0x3b6b16;
                if (_0x5c9c34) {
                    await handleChatbotResponse(_0x503bae, _0x3496a2, _0x46f5a1, _0x501fa5, _0x382a90);
                }
            }
            return;
        }
        const _0xb073d2 = ((() => {
            if (_0x3b6b16)
                return !![];
            switch (_0x29f3e5) {
            case 'public':
                return !![];
            case 'private':
            case 'self':
                return ![];
            case 'groups':
                return _0xfc198b;
            case 'inbox':
                return !_0xfc198b;
            default:
                return !![];
            }
        })());
        if (!_0xb073d2) {
            return;
        }
        let _0x3121c3;
        if (_0x167dcf) {
            const _0x3e9e7e = _0x71cd4['slice'](_0x167dcf['length'])['trim']();
            _0x3121c3 = _0x3e9e7e['split'](/\s+/)['slice'](0x1);
        } else {
            _0x3121c3 = _0x71cd4['trim']()['split'](/\s+/)['slice'](0x1);
        }
        if (_0x5873bd['strictOwnerOnly']) {
            const {isOwnerOnly: _0x235194} = await import('./isOwner.js');
            if (!_0x46f5a1['key']['fromMe'] && !_0x235194(_0x382a90)) {
                return await _0x503bae['sendMessage'](_0x3496a2, {
                    'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20bot\x20owner!*\x0a\x0a_Sudo\x20users\x20cannot\x20manage\x20other\x20sudo\x20users._',
                    ...channelInfo
                }, { 'quoted': _0x46f5a1 });
            }
        }
        if (_0x5873bd['ownerOnly'] && !_0x46f5a1['key']['fromMe'] && !_0x447235) {
            return await _0x503bae['sendMessage'](_0x3496a2, {
                'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20owner\x20or\x20sudo\x20users!*',
                ...channelInfo
            }, { 'quoted': _0x46f5a1 });
        }
        if (_0x5873bd['groupOnly'] && !_0xfc198b) {
            return await _0x503bae['sendMessage'](_0x3496a2, {
                'text': 'ℹ️\x20*This\x20command\x20can\x20only\x20be\x20used\x20in\x20groups!*',
                ...channelInfo
            }, { 'quoted': _0x46f5a1 });
        }
        let _0x13b97e = ![];
        let _0x579ecd = ![];
        if (_0x5873bd['adminOnly'] && _0xfc198b) {
            const _0x1f67e7 = await _0x0_0x1b0420(_0x503bae, _0x3496a2, _0x382a90);
            _0x13b97e = _0x1f67e7['isSenderAdmin'];
            _0x579ecd = _0x1f67e7['isBotAdmin'];
            if (!_0x579ecd) {
                return await _0x503bae['sendMessage'](_0x3496a2, {
                    'text': 'ℹ️\x20*Please\x20make\x20the\x20bot\x20an\x20admin\x20to\x20use\x20this\x20command.*',
                    ...channelInfo
                }, { 'quoted': _0x46f5a1 });
            }
            if (!_0x13b97e && !_0x46f5a1['key']['fromMe'] && !_0x447235) {
                return await _0x503bae['sendMessage'](_0x3496a2, {
                    'text': 'ℹ️\x20*Sorry,\x20only\x20group\x20admins\x20can\x20use\x20this\x20command.*',
                    ...channelInfo
                }, { 'quoted': _0x46f5a1 });
            }
        }
        const _0x46fdde = {
            'chatId': _0x3496a2,
            'senderId': _0x382a90,
            'isGroup': _0xfc198b,
            'isSenderAdmin': _0x13b97e,
            'isBotAdmin': _0x579ecd,
            'senderIsOwnerOrSudo': _0x447235,
            'isOwnerOrSudoCheck': _0x3b6b16,
            'channelInfo': channelInfo,
            'rawText': _0x5f23e6,
            'userMessage': _0x501fa5,
            'messageText': _0x71cd4,
            'config': _0x0_0x32bce2
        };
        try {
            await _0x5873bd['handler'](_0x503bae, _0x46f5a1, _0x3121c3, _0x46fdde);
            await addCommandReaction(_0x503bae, _0x46f5a1);
            await showTypingAfterCommand(_0x503bae, _0x3496a2);
        } catch (_0x4c3f07) {
            printLog('error', 'Command\x20error\x20[' + _0x5873bd['command'] + ']:\x20' + _0x4c3f07['message']);
            console['error'](_0x4c3f07['stack']);
            await _0x503bae['sendMessage'](_0x3496a2, {
                'text': '❌\x20Error\x20executing\x20command:\x20' + _0x4c3f07['message'],
                ...channelInfo
            }, { 'quoted': _0x46f5a1 });
            const _0xcc0bf3 = {
                'command': _0x5873bd['command'],
                'error': _0x4c3f07['message'],
                'stack': _0x4c3f07['stack'],
                'timestamp': new Date()['toISOString'](),
                'user': _0x382a90,
                'chat': _0x3496a2
            };
            try {
                writeErrorLog(_0xcc0bf3);
            } catch (_0x81a123) {
                printLog('error', 'Failed\x20to\x20write\x20error\x20log:\x20' + _0x81a123['message']);
            }
        }
    } catch (_0x2ff5c7) {
        printLog('error', 'Message\x20handler\x20error:\x20' + _0x2ff5c7['message']);
        console['error'](_0x2ff5c7['stack']);
        const _0x380ceb = _0x4b933a['messages']?.[0x0]?.['key']?.['remoteJid'];
        if (_0x380ceb) {
            try {
                await _0x503bae['sendMessage'](_0x380ceb, {
                    'text': 'ℹ️\x20*Failed\x20to\x20process\x20message!*',
                    ...channelInfo
                });
            } catch (_0x4ecd33) {
                printLog('error', 'Failed\x20to\x20send\x20error\x20message:\x20' + _0x4ecd33['message']);
            }
        }
    }
}
async function handleGroupParticipantUpdate(_0x30f505, _0x33d13b) {
    try {
        const {
            id: _0x39b060,
            participants: _0x3a0c1a,
            action: _0x5c3c2b,
            author: _0x467abc
        } = _0x33d13b;
        if (!_0x39b060['endsWith']('@g.us'))
            return;
        const _0x565023 = await _0x0_0x3490fd['getBotMode']();
        const _0x4b8867 = _0x467abc ? await _0x0_0x3bbe97(_0x467abc, _0x30f505, _0x39b060) : ![];
        const _0x38fc41 = _0x467abc ? _0x467abc === _0x30f505['user']['id'] || _0x467abc === _0x30f505['user']['id']['split'](':')[0x0] + '@s.whatsapp.net' : ![];
        const _0x4aa1c7 = _0x38fc41 || _0x4b8867;
        if ((_0x565023 === 'private' || _0x565023 === 'self') && !_0x4aa1c7) {
            return;
        }
        invalidateGroupCache(_0x39b060);
        if (!_0x39b060['endsWith']('@g.us'))
            return;
        printLog('info', 'Group\x20update:\x20' + _0x5c3c2b + '\x20in\x20' + _0x39b060['split']('@')[0x0]);
        const _0x2182bd = _0x565023 === 'public' || _0x565023 === 'groups' || _0x4aa1c7;
        switch (_0x5c3c2b) {
        case 'promote':
            if (!_0x2182bd)
                return;
            if (_0x3a0c1a && _0x3a0c1a['length'] > 0x0) {
                const _0x594871 = Array['isArray'](_0x3a0c1a) ? _0x3a0c1a[0x0] : _0x3a0c1a;
            }
            const _0x352028 = (await import('../plugins/promote.js'))['default']?.['handlePromotionEvent'];
            await _0x352028(_0x30f505, _0x39b060, _0x3a0c1a, _0x467abc);
            break;
        case 'demote':
            if (!_0x2182bd)
                return;
            if (_0x3a0c1a && _0x3a0c1a['length'] > 0x0) {
                const _0x2102be = Array['isArray'](_0x3a0c1a) ? _0x3a0c1a[0x0] : _0x3a0c1a;
            }
            const _0x2fd9db = (await import('../plugins/demote.js'))['default']?.['handleDemotionEvent'];
            await _0x2fd9db(_0x30f505, _0x39b060, _0x3a0c1a, _0x467abc);
            break;
        case 'add':
            if (_0x3a0c1a && _0x3a0c1a['length'] > 0x0) {
                const _0x9e0188 = Array['isArray'](_0x3a0c1a) ? _0x3a0c1a[0x0] : _0x3a0c1a;
            }
            const {handleJoinEvent: _0x1f0b01} = await import('../plugins/welcome.js');
            await _0x1f0b01(_0x30f505, _0x39b060, _0x3a0c1a);
            break;
        case 'remove':
            if (_0x3a0c1a && _0x3a0c1a['length'] > 0x0) {
                const _0x285a16 = Array['isArray'](_0x3a0c1a) ? _0x3a0c1a[0x0] : _0x3a0c1a;
            }
            const _0x18382d = (await import('../plugins/goodbye.js'))['default']?.['handleLeaveEvent'];
            await _0x18382d(_0x30f505, _0x39b060, _0x3a0c1a);
            break;
        default:
            printLog('warning', 'Unhandled\x20group\x20action:\x20' + _0x5c3c2b);
        }
    } catch (_0x56a680) {
        printLog('error', 'Group\x20update\x20error:\x20' + _0x56a680['message']);
        console['error'](_0x56a680['stack']);
    }
}
async function handleStatus(_0x56a790, _0x3a3ce7) {
    try {
        const {default: _0x3e0e86} = await import('../plugins/autostatus.js');
        const _0x2d4996 = _0x3e0e86['handleStatusUpdate'];
        await _0x2d4996(_0x56a790, _0x3a3ce7);
    } catch (_0x356982) {
        printLog('error', 'Status\x20handler\x20error:\x20' + _0x356982['message']);
        console['error'](_0x356982['stack']);
    }
}
async function handleCall(_0x1bbb3d, _0x4f01ef) {
    try {
        const _0x253dd8 = (await import('../plugins/anticall.js'))['default'];
        const _0x2078d5 = _0x253dd8['readState'] ? await _0x253dd8['readState']() : { 'enabled': ![] };
        if (!_0x2078d5['enabled'])
            return;
        const _0x3bf902 = new Set();
        for (const _0x17be7f of _0x4f01ef) {
            const _0x3dbfb7 = _0x17be7f['from'] || _0x17be7f['peerJid'] || _0x17be7f['chatId'];
            if (!_0x3dbfb7)
                continue;
            try {
                try {
                    if (typeof _0x1bbb3d['rejectCall'] === 'function' && _0x17be7f['id']) {
                        await _0x1bbb3d['rejectCall'](_0x17be7f['id'], _0x3dbfb7);
                    } else if (typeof _0x1bbb3d['sendCallOfferAck'] === 'function' && _0x17be7f['id']) {
                        await _0x1bbb3d['sendCallOfferAck'](_0x17be7f['id'], _0x3dbfb7, 'reject');
                    }
                } catch (_0x535324) {
                    printLog('error', 'Error\x20rejecting\x20call:\x20' + _0x535324['message']);
                }
                if (!_0x3bf902['has'](_0x3dbfb7)) {
                    _0x3bf902['add'](_0x3dbfb7);
                    setTimeout(() => _0x3bf902['delete'](_0x3dbfb7), 0xea60);
                    await _0x1bbb3d['sendMessage'](_0x3dbfb7, { 'text': '📵\x20Anticall\x20is\x20enabled.\x20Your\x20call\x20was\x20rejected\x20and\x20you\x20will\x20be\x20blocked.' });
                    printLog('info', 'Sent\x20anticall\x20warning\x20to:\x20' + _0x3dbfb7['split']('@')[0x0]);
                }
                setTimeout(async () => {
                    try {
                        await _0x1bbb3d['updateBlockStatus'](_0x3dbfb7, 'block');
                        printLog('success', 'Blocked\x20caller:\x20' + _0x3dbfb7['split']('@')[0x0]);
                    } catch (_0x300db3) {
                        printLog('error', 'Error\x20blocking\x20caller:\x20' + _0x300db3['message']);
                    }
                }, 0x320);
            } catch (_0x525dbf) {
                printLog('error', 'Error\x20handling\x20call\x20from\x20' + _0x3dbfb7['split']('@')[0x0] + ':\x20' + _0x525dbf['message']);
            }
        }
    } catch (_0x266a83) {
        printLog('error', 'Call\x20handler\x20error:\x20' + _0x266a83['message']);
        console['error'](_0x266a83['stack']);
    }
}
export {
    handleMessages,
    handleGroupParticipantUpdate,
    handleStatus,
    handleCall
};