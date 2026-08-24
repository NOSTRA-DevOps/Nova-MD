import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x3ac719 from 'fs';
import { dataFile } from './paths.js';
import { handleChatbotResponse } from './Chatbots.js';
import _0x0_0x26a4cc from '../config.js';
import _0x0_0x5f4a7c from './lightweight_store.js';
import _0x0_0x1a806b from './commandHandler.js';
import {
    printMessage,
    printLog
} from './print.js';
import { isBanned } from './isBanned.js';
import { isSudo } from './index.js';
import _0x0_0x35caae from './isOwner.js';
import _0x0_0x4f074c from './isAdmin.js';
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
        const _0x5b270a = await _0x0_0x5f4a7c['getSetting']('global', 'stickerCommands');
        return _0x5b270a || {};
    } else {
        try {
            if (!_0x0_0x3ac719['existsSync'](STICKER_FILE)) {
                return {};
            }
            return JSON['parse'](_0x0_0x3ac719['readFileSync'](STICKER_FILE, 'utf8'));
        } catch {
            return {};
        }
    }
}
async function handleMessages(_0x25938e, _0x7d6f4b) {
    try {
        const {
            messages: _0x5e7d57,
            type: _0x5b0071
        } = _0x7d6f4b;
        if (_0x5b0071 !== 'notify')
            return;
        const _0x1adbe4 = _0x5e7d57[0x0];
        if (!_0x1adbe4?.['message'])
            return;
        const _0x3d1b75 = _0x1adbe4['key']['remoteJid'];
        const _0x3ef717 = _0x3d1b75['endsWith']('@g.us');
        const _0x3122d0 = _0x1adbe4['key']['participant'] || _0x1adbe4['key']['remoteJid'];
        const _0x10f041 = await _0x0_0x35caae(_0x3122d0, _0x25938e, _0x3d1b75);
        const _0x51ed0a = _0x1adbe4['key']['fromMe'] || _0x10f041;
        const _0x9c106a = await _0x0_0x5f4a7c['getBotMode']();
        if ((_0x9c106a === 'private' || _0x9c106a === 'self') && !_0x51ed0a) {
            return;
        }
        await printMessage(_0x1adbe4, _0x25938e);
        try {
            const _0x1b1334 = await _0x0_0x5f4a7c['getSetting']('global', 'stealthMode');
            if (!_0x1b1334 || !_0x1b1334['enabled']) {
                await handleAutoread(_0x25938e, _0x1adbe4);
            } else {
                printLog('info', '👻\x20Stealth\x20mode\x20active');
            }
        } catch (_0x395718) {
            await handleAutoread(_0x25938e, _0x1adbe4);
        }
        if (_0x1adbe4['message']?.['protocolMessage']?.['type'] === 0x0) {
            printLog('info', 'Message\x20deletion\x20detected');
            await handleMessageRevocation(_0x25938e, _0x1adbe4);
            return;
        }
        await storeMessage(_0x25938e, _0x1adbe4);
        if (_0x1adbe4['pushName'] && _0x25938e['store']?.['contacts']) {
            const _0x1e6c32 = _0x1adbe4['key']['participant'] || _0x1adbe4['key']['remoteJid'];
            if (_0x1e6c32) {
                _0x25938e['store']['contacts'][_0x1e6c32] = {
                    ..._0x25938e['store']['contacts'][_0x1e6c32],
                    'id': _0x1e6c32,
                    'notify': _0x1adbe4['pushName'],
                    'name': _0x1adbe4['pushName']
                };
                const _0x2f114a = _0x25938e['decodeJid']?.(_0x1e6c32);
                if (_0x2f114a && _0x2f114a !== _0x1e6c32) {
                    _0x25938e['store']['contacts'][_0x2f114a] = {
                        ..._0x25938e['store']['contacts'][_0x2f114a],
                        'id': _0x2f114a,
                        'notify': _0x1adbe4['pushName'],
                        'name': _0x1adbe4['pushName']
                    };
                }
            }
        }
        const _0x175dec = _0x1adbe4['key']['participant'] || _0x1adbe4['key']['remoteJid'];
        if (_0x175dec?.['includes']('@lid') && _0x25938e['store']?.['contacts']) {
            const _0x128d7f = _0x25938e['store']['contacts'];
            const _0x2c63f0 = Object['keys'](_0x128d7f)['find'](_0x4b9f64 => _0x128d7f[_0x4b9f64]?.['lid'] === _0x175dec || _0x128d7f[_0x4b9f64]?.['lid']?.['split'](':')[0x0] === _0x175dec['split']('@')[0x0]);
            if (_0x2c63f0?.['includes']('@s.whatsapp.net'))
                _0x3122d0 = _0x2c63f0;
        }
        if (_0x1adbe4['message']?.['stickerMessage']) {
            const _0x51032c = _0x1adbe4['message']['stickerMessage']['fileSha256'];
            if (_0x51032c) {
                const _0x24b2d7 = Buffer['from'](_0x51032c)['toString']('base64');
                const _0xa038b9 = await getStickerCommands();
                if (_0xa038b9[_0x24b2d7]) {
                    const _0x558d80 = _0xa038b9[_0x24b2d7]['text'];
                    const [_0x4efec7, ..._0xe2b85b] = _0x558d80['split']('\x20');
                    let _0x59b2dd = null;
                    let _0x28ae79 = '';
                    for (const _0x227981 of _0x0_0x26a4cc['prefixes']) {
                        const _0x159b1d = (_0x227981 + _0x4efec7)['toLowerCase']();
                        _0x59b2dd = _0x0_0x1a806b['getCommand'](_0x159b1d, _0x0_0x26a4cc['prefixes']);
                        if (_0x59b2dd) {
                            _0x28ae79 = _0x227981;
                            break;
                        }
                    }
                    if (_0x59b2dd) {
                        const _0x5c654d = await isSudo(_0x3122d0);
                        const _0x3e5a0e = await _0x0_0x35caae(_0x3122d0, _0x25938e, _0x3d1b75);
                        const _0x42df28 = _0x1adbe4['key']['fromMe'] || _0x3e5a0e;
                        const _0x4b284f = await _0x0_0x5f4a7c['getBotMode']();
                        const _0x56bde4 = ((() => {
                            if (_0x42df28)
                                return !![];
                            switch (_0x4b284f) {
                            case 'public':
                                return !![];
                            case 'private':
                            case 'self':
                                return ![];
                            case 'groups':
                                return _0x3ef717;
                            case 'inbox':
                                return !_0x3ef717;
                            default:
                                return !![];
                            }
                        })());
                        if (!_0x56bde4)
                            return;
                        const _0x44e5c2 = await isBanned(_0x3122d0);
                        if (_0x44e5c2)
                            return;
                        if (_0x59b2dd['strictOwnerOnly']) {
                            const {isOwnerOnly: _0x1cb5f0} = await import('./isOwner.js');
                            if (!_0x1adbe4['key']['fromMe'] && !_0x1cb5f0(_0x3122d0)) {
                                return await _0x25938e['sendMessage'](_0x3d1b75, {
                                    'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20bot\x20owner!*',
                                    ...channelInfo
                                }, { 'quoted': _0x1adbe4 });
                            }
                        }
                        if (_0x59b2dd['ownerOnly'] && !_0x1adbe4['key']['fromMe'] && !_0x3e5a0e) {
                            return await _0x25938e['sendMessage'](_0x3d1b75, {
                                'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20owner\x20or\x20sudo\x20users!*',
                                ...channelInfo
                            }, { 'quoted': _0x1adbe4 });
                        }
                        if (_0x59b2dd['groupOnly'] && !_0x3ef717) {
                            return await _0x25938e['sendMessage'](_0x3d1b75, {
                                'text': 'ℹ️\x20*This\x20command\x20can\x20only\x20be\x20used\x20in\x20groups!*',
                                ...channelInfo
                            }, { 'quoted': _0x1adbe4 });
                        }
                        let _0x1538e0 = ![];
                        let _0x5b2e98 = ![];
                        if (_0x59b2dd['adminOnly'] && _0x3ef717) {
                            const _0x518483 = await _0x0_0x4f074c(_0x25938e, _0x3d1b75, _0x3122d0);
                            _0x1538e0 = _0x518483['isSenderAdmin'];
                            _0x5b2e98 = _0x518483['isBotAdmin'];
                            if (!_0x5b2e98) {
                                return await _0x25938e['sendMessage'](_0x3d1b75, {
                                    'text': 'ℹ️\x20*Please\x20make\x20the\x20bot\x20an\x20admin\x20to\x20use\x20this\x20command.*',
                                    ...channelInfo
                                }, { 'quoted': _0x1adbe4 });
                            }
                            if (!_0x1538e0 && !_0x1adbe4['key']['fromMe'] && !_0x3e5a0e) {
                                return await _0x25938e['sendMessage'](_0x3d1b75, {
                                    'text': 'ℹ️\x20*Sorry,\x20only\x20group\x20admins\x20can\x20use\x20this\x20command.*',
                                    ...channelInfo
                                }, { 'quoted': _0x1adbe4 });
                            }
                        }
                        const _0x272984 = {
                            'key': _0x1adbe4['key'],
                            'message': {
                                'extendedTextMessage': {
                                    'text': _0x28ae79 + _0x558d80,
                                    'contextInfo': _0x1adbe4['message']['stickerMessage']['contextInfo'] || {}
                                }
                            },
                            'messageTimestamp': _0x1adbe4['messageTimestamp'],
                            'pushName': _0x1adbe4['pushName'],
                            'broadcast': _0x1adbe4['broadcast']
                        };
                        const _0x5c4274 = {
                            'chatId': _0x3d1b75,
                            'senderId': _0x3122d0,
                            'isGroup': _0x3ef717,
                            'isSenderAdmin': _0x1538e0,
                            'isBotAdmin': _0x5b2e98,
                            'senderIsOwnerOrSudo': _0x3e5a0e,
                            'isOwnerOrSudoCheck': _0x42df28,
                            'channelInfo': channelInfo,
                            'rawText': _0x28ae79 + _0x558d80,
                            'userMessage': (_0x28ae79 + _0x558d80)['toLowerCase'](),
                            'messageText': _0x28ae79 + _0x558d80,
                            'config': _0x0_0x26a4cc
                        };
                        try {
                            await _0x59b2dd['handler'](_0x25938e, _0x272984, _0xe2b85b, _0x5c4274);
                            await addCommandReaction(_0x25938e, _0x1adbe4);
                            await showTypingAfterCommand(_0x25938e, _0x3d1b75);
                            printLog('success', '✅\x20Sticker\x20command\x20executed:\x20' + _0x558d80);
                        } catch (_0x30f8d9) {
                            printLog('error', '❌\x20Sticker\x20command\x20error\x20[' + _0x558d80 + ']:\x20' + _0x30f8d9['message']);
                            console['error'](_0x30f8d9['stack']);
                            await _0x25938e['sendMessage'](_0x3d1b75, {
                                'text': '❌\x20Error\x20executing\x20sticker\x20command:\x20' + _0x30f8d9['message'],
                                ...channelInfo
                            }, { 'quoted': _0x1adbe4 });
                        }
                    } else {
                        printLog('warning', '⚠️\x20Sticker\x20command\x20not\x20found:\x20' + _0x558d80);
                    }
                    return;
                }
            }
        }
        const _0x200307 = _0x1adbe4['message']?.['conversation'] || _0x1adbe4['message']?.['extendedTextMessage']?.['text'] || _0x1adbe4['message']?.['imageMessage']?.['caption'] || _0x1adbe4['message']?.['videoMessage']?.['caption'] || _0x1adbe4['message']?.['buttonsResponseMessage']?.['selectedButtonId'] || '';
        const _0x10c53b = _0x200307['trim']();
        const _0x543a3e = _0x10c53b['toLowerCase']();
        const _0x2c7348 = await isSudo(_0x3122d0);
        startSchedulerEngine(_0x25938e);
        if (!_0x1adbe4['key']['fromMe']) {
            const _0x5adb30 = await handleAutoReply(_0x25938e, _0x3d1b75, _0x1adbe4, _0x543a3e);
            if (_0x5adb30)
                return;
        }
        if (_0x1adbe4['message']?.['buttonsResponseMessage']) {
            const _0x41ed5c = _0x1adbe4['message']['buttonsResponseMessage']['selectedButtonId'];
            printLog('info', 'Button\x20response:\x20' + _0x41ed5c);
            if (_0x41ed5c === 'channel') {
                await _0x25938e['sendMessage'](_0x3d1b75, { 'text': '*Join\x20our\x20Channel:*\x0a[https://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y](https://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y)' }, { 'quoted': _0x1adbe4 });
                return;
            } else if (_0x41ed5c === 'owner') {
                const _0x1a408c = (await import('../plugins/owner.js'))['default'];
                await _0x1a408c['handler']?.(_0x25938e, _0x3d1b75, '', {});
                return;
            } else if (_0x41ed5c === 'support') {
                await _0x25938e['sendMessage'](_0x3d1b75, { 'text': '*Support*\x0a\x0ahttps://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y' }, { 'quoted': _0x1adbe4 });
                return;
            }
        }
        const _0x344656 = await isBanned(_0x3122d0);
        if (_0x344656 && !_0x543a3e['startsWith']('.unban')) {
            if (Math['random']() < 0.1) {
                printLog('warning', 'Banned\x20user\x20attempted\x20command:\x20' + _0x3122d0['split']('@')[0x0]);
                await _0x25938e['sendMessage'](_0x3d1b75, {
                    'text': 'You\x20are\x20banned\x20from\x20using\x20the\x20bot.\x20Contact\x20an\x20admin\x20to\x20get\x20unbanned.',
                    ...channelInfo
                });
            }
            return;
        }
        if (/^[1-9]$/['test'](_0x543a3e) || _0x543a3e === 'surrender') {
            await handleTicTacToeMove(_0x25938e, _0x3d1b75, _0x3122d0, _0x543a3e);
            return;
        }
        if (!_0x1adbe4['key']['fromMe']) {
            await _0x0_0x5f4a7c['incrementMessageCount'](_0x3d1b75, _0x3122d0, _0x1adbe4['pushName']);
        } else {
            const _0x3bfe59 = _0x25938e['user']?.['id'] || _0x3122d0;
            const _0x32b5a2 = _0x25938e['user']?.['name'] || _0x25938e['user']?.['notify'] || 'Me';
            await _0x0_0x5f4a7c['incrementMessageCount'](_0x3d1b75, _0x3bfe59, _0x32b5a2);
        }
        if (_0x3ef717) {
            if (_0x543a3e) {
                await handleBadwordDetection(_0x25938e, _0x3d1b75, _0x1adbe4, _0x543a3e, _0x3122d0);
            }
            await handleLinkDetection(_0x25938e, _0x3d1b75, _0x1adbe4, _0x543a3e, _0x3122d0);
        }
        if (_0x3ef717 && !_0x1adbe4['key']['fromMe']) {
            const _0x3e4c2f = await handleAntiSpam(_0x25938e, _0x3d1b75, _0x1adbe4, _0x3122d0, _0x10f041);
            if (_0x3e4c2f)
                return;
        }
        if (!_0x3ef717 && !_0x1adbe4['key']['fromMe'] && !_0x2c7348) {
            try {
                const _0x39b941 = (await import('../plugins/pmblocker.js'))['default'];
                const _0x1be540 = _0x39b941?.['readState'];
                const _0x25145d = await _0x1be540();
                if (_0x25145d['enabled']) {
                    printLog('warning', 'PM\x20blocked\x20from:\x20' + _0x3122d0['split']('@')[0x0]);
                    await _0x25938e['sendMessage'](_0x3d1b75, { 'text': _0x25145d['message'] || 'Private\x20messages\x20are\x20blocked.\x20Please\x20contact\x20the\x20owner\x20in\x20groups\x20only.' });
                    await new Promise(_0x17275a => setTimeout(_0x17275a, 0x5dc));
                    try {
                        await _0x25938e['updateBlockStatus'](_0x3d1b75, 'block');
                        printLog('success', 'Blocked\x20user:\x20' + _0x3122d0['split']('@')[0x0]);
                    } catch (_0xdfcf1e) {
                        printLog('error', 'Failed\x20to\x20block\x20user:\x20' + _0xdfcf1e['message']);
                    }
                    return;
                }
            } catch (_0x444b02) {
                printLog('error', 'PM\x20blocker\x20error:\x20' + _0x444b02['message']);
            }
        }
        const _0x39a25e = _0x0_0x26a4cc['prefixes']?.['find'](_0x25f6fd => _0x543a3e['startsWith'](_0x25f6fd));
        const _0x56386e = _0x0_0x1a806b['getCommand'](_0x543a3e, _0x0_0x26a4cc['prefixes']);
        if (!_0x39a25e && !_0x56386e) {
            await handleAutotypingForMessage(_0x25938e, _0x3d1b75, _0x543a3e);
            const _0x18de22 = await _0x0_0x5f4a7c['getBotMode']();
            const _0x215ae9 = _0x18de22 === 'public' || _0x18de22 === 'groups' && _0x3ef717 || _0x18de22 === 'inbox' && !_0x3ef717 || _0x51ed0a;
            if (_0x215ae9) {
                if (_0x3ef717 && _0x543a3e['length'] < 0x3) {
                    const _0x326479 = 'nova';
                    if (!_0x543a3e['includes'](_0x326479) && !_0x543a3e['includes']('@')) {
                        return;
                    }
                }
                await handleChatbotResponse(_0x25938e, _0x3d1b75, _0x1adbe4, _0x543a3e, _0x3122d0);
            }
            return;
        }
        if (!_0x56386e) {
            const _0x34e568 = 'nova';
            const _0x302042 = _0x543a3e['includes'](_0x34e568) || _0x543a3e['includes']('@nova');
            if (_0x302042) {
                const _0x49fe13 = await _0x0_0x5f4a7c['getBotMode']();
                const _0xee1296 = _0x49fe13 === 'public' || _0x49fe13 === 'groups' && _0x3ef717 || _0x49fe13 === 'inbox' && !_0x3ef717 || _0x51ed0a;
                if (_0xee1296) {
                    await handleChatbotResponse(_0x25938e, _0x3d1b75, _0x1adbe4, _0x543a3e, _0x3122d0);
                    return;
                }
            }
            return;
        }
        const _0x1d971d = ((() => {
            if (_0x51ed0a)
                return !![];
            switch (_0x9c106a) {
            case 'public':
                return !![];
            case 'private':
            case 'self':
                return ![];
            case 'groups':
                return _0x3ef717;
            case 'inbox':
                return !_0x3ef717;
            default:
                return !![];
            }
        })());
        if (!_0x1d971d) {
            return;
        }
        let _0xe36ae3;
        if (_0x39a25e) {
            const _0x533e93 = _0x10c53b['slice'](_0x39a25e['length'])['trim']();
            _0xe36ae3 = _0x533e93['split'](/\s+/)['slice'](0x1);
        } else {
            _0xe36ae3 = _0x10c53b['trim']()['split'](/\s+/)['slice'](0x1);
        }
        if (_0x56386e['strictOwnerOnly']) {
            const {isOwnerOnly: _0x537cd7} = await import('./isOwner.js');
            if (!_0x1adbe4['key']['fromMe'] && !_0x537cd7(_0x3122d0)) {
                return await _0x25938e['sendMessage'](_0x3d1b75, {
                    'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20bot\x20owner!*\x0a\x0a_Sudo\x20users\x20cannot\x20manage\x20other\x20sudo\x20users._',
                    ...channelInfo
                }, { 'quoted': _0x1adbe4 });
            }
        }
        if (_0x56386e['ownerOnly'] && !_0x1adbe4['key']['fromMe'] && !_0x10f041) {
            return await _0x25938e['sendMessage'](_0x3d1b75, {
                'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20owner\x20or\x20sudo\x20users!*',
                ...channelInfo
            }, { 'quoted': _0x1adbe4 });
        }
        if (_0x56386e['groupOnly'] && !_0x3ef717) {
            return await _0x25938e['sendMessage'](_0x3d1b75, {
                'text': 'ℹ️\x20*This\x20command\x20can\x20only\x20be\x20used\x20in\x20groups!*',
                ...channelInfo
            }, { 'quoted': _0x1adbe4 });
        }
        let _0x4e9959 = ![];
        let _0x1304a5 = ![];
        if (_0x56386e['adminOnly'] && _0x3ef717) {
            const _0xff1ed5 = await _0x0_0x4f074c(_0x25938e, _0x3d1b75, _0x3122d0);
            _0x4e9959 = _0xff1ed5['isSenderAdmin'];
            _0x1304a5 = _0xff1ed5['isBotAdmin'];
            if (!_0x1304a5) {
                return await _0x25938e['sendMessage'](_0x3d1b75, {
                    'text': 'ℹ️\x20*Please\x20make\x20the\x20bot\x20an\x20admin\x20to\x20use\x20this\x20command.*',
                    ...channelInfo
                }, { 'quoted': _0x1adbe4 });
            }
            if (!_0x4e9959 && !_0x1adbe4['key']['fromMe'] && !_0x10f041) {
                return await _0x25938e['sendMessage'](_0x3d1b75, {
                    'text': 'ℹ️\x20*Sorry,\x20only\x20group\x20admins\x20can\x20use\x20this\x20command.*',
                    ...channelInfo
                }, { 'quoted': _0x1adbe4 });
            }
        }
        const _0x35fc9e = {
            'chatId': _0x3d1b75,
            'senderId': _0x3122d0,
            'isGroup': _0x3ef717,
            'isSenderAdmin': _0x4e9959,
            'isBotAdmin': _0x1304a5,
            'senderIsOwnerOrSudo': _0x10f041,
            'isOwnerOrSudoCheck': _0x51ed0a,
            'channelInfo': channelInfo,
            'rawText': _0x200307,
            'userMessage': _0x543a3e,
            'messageText': _0x10c53b,
            'config': _0x0_0x26a4cc
        };
        try {
            await _0x56386e['handler'](_0x25938e, _0x1adbe4, _0xe36ae3, _0x35fc9e);
            await addCommandReaction(_0x25938e, _0x1adbe4);
            await showTypingAfterCommand(_0x25938e, _0x3d1b75);
        } catch (_0x397f99) {
            printLog('error', 'Command\x20error\x20[' + _0x56386e['command'] + ']:\x20' + _0x397f99['message']);
            console['error'](_0x397f99['stack']);
            await _0x25938e['sendMessage'](_0x3d1b75, {
                'text': '❌\x20Error\x20executing\x20command:\x20' + _0x397f99['message'],
                ...channelInfo
            }, { 'quoted': _0x1adbe4 });
            const _0x564201 = {
                'command': _0x56386e['command'],
                'error': _0x397f99['message'],
                'stack': _0x397f99['stack'],
                'timestamp': new Date()['toISOString'](),
                'user': _0x3122d0,
                'chat': _0x3d1b75
            };
            try {
                writeErrorLog(_0x564201);
            } catch (_0x2222a0) {
                printLog('error', 'Failed\x20to\x20write\x20error\x20log:\x20' + _0x2222a0['message']);
            }
        }
    } catch (_0x480e58) {
        printLog('error', 'Message\x20handler\x20error:\x20' + _0x480e58['message']);
        console['error'](_0x480e58['stack']);
        const _0x171e36 = _0x7d6f4b['messages']?.[0x0]?.['key']?.['remoteJid'];
        if (_0x171e36) {
            try {
                await _0x25938e['sendMessage'](_0x171e36, {
                    'text': 'ℹ️\x20*Failed\x20to\x20process\x20message!*',
                    ...channelInfo
                });
            } catch (_0x570f66) {
                printLog('error', 'Failed\x20to\x20send\x20error\x20message:\x20' + _0x570f66['message']);
            }
        }
    }
}
async function handleGroupParticipantUpdate(_0x283703, _0x307408) {
    try {
        const {
            id: _0x51597a,
            participants: _0x28725a,
            action: _0x54001c,
            author: _0xfe10e8
        } = _0x307408;
        if (!_0x51597a['endsWith']('@g.us'))
            return;
        const _0x2b871f = await _0x0_0x5f4a7c['getBotMode']();
        const _0x30c4f6 = _0xfe10e8 ? await _0x0_0x35caae(_0xfe10e8, _0x283703, _0x51597a) : ![];
        const _0x40168c = _0xfe10e8 ? _0xfe10e8 === _0x283703['user']['id'] || _0xfe10e8 === _0x283703['user']['id']['split'](':')[0x0] + '@s.whatsapp.net' : ![];
        const _0x264c6d = _0x40168c || _0x30c4f6;
        if ((_0x2b871f === 'private' || _0x2b871f === 'self') && !_0x264c6d) {
            return;
        }
        invalidateGroupCache(_0x51597a);
        if (!_0x51597a['endsWith']('@g.us'))
            return;
        printLog('info', 'Group\x20update:\x20' + _0x54001c + '\x20in\x20' + _0x51597a['split']('@')[0x0]);
        const _0x3f9dc4 = _0x2b871f === 'public' || _0x2b871f === 'groups' || _0x264c6d;
        switch (_0x54001c) {
        case 'promote':
            if (!_0x3f9dc4)
                return;
            const _0x1b35b3 = (await import('../plugins/promote.js'))['default']?.['handlePromotionEvent'];
            await _0x1b35b3(_0x283703, _0x51597a, _0x28725a, _0xfe10e8);
            break;
        case 'demote':
            if (!_0x3f9dc4)
                return;
            const _0x4c3e43 = (await import('../plugins/demote.js'))['default']?.['handleDemotionEvent'];
            await _0x4c3e43(_0x283703, _0x51597a, _0x28725a, _0xfe10e8);
            break;
        case 'add':
            const {handleJoinEvent: _0x3f524d} = await import('../plugins/welcome.js');
            await _0x3f524d(_0x283703, _0x51597a, _0x28725a);
            break;
        case 'remove':
            const _0xc3fc06 = (await import('../plugins/goodbye.js'))['default']?.['handleLeaveEvent'];
            await _0xc3fc06(_0x283703, _0x51597a, _0x28725a);
            break;
        default:
            printLog('warning', 'Unhandled\x20group\x20action:\x20' + _0x54001c);
        }
    } catch (_0x4d3edf) {
        printLog('error', 'Group\x20update\x20error:\x20' + _0x4d3edf['message']);
        console['error'](_0x4d3edf['stack']);
    }
}
async function handleStatus(_0x43b3ad, _0x6d3b25) {
    try {
        const {default: _0x5ad756} = await import('../plugins/autostatus.js');
        const _0x9e66d6 = _0x5ad756['handleStatusUpdate'];
        await _0x9e66d6(_0x43b3ad, _0x6d3b25);
    } catch (_0x37dfd0) {
        printLog('error', 'Status\x20handler\x20error:\x20' + _0x37dfd0['message']);
        console['error'](_0x37dfd0['stack']);
    }
}
async function handleCall(_0x235fa9, _0xc01e3d) {
    try {
        const _0x458f64 = (await import('../plugins/anticall.js'))['default'];
        const _0x4c42ea = _0x458f64['readState'] ? await _0x458f64['readState']() : { 'enabled': ![] };
        if (!_0x4c42ea['enabled'])
            return;
        const _0x234327 = new Set();
        for (const _0x2d43fb of _0xc01e3d) {
            const _0x8fbcfa = _0x2d43fb['from'] || _0x2d43fb['peerJid'] || _0x2d43fb['chatId'];
            if (!_0x8fbcfa)
                continue;
            try {
                try {
                    if (typeof _0x235fa9['rejectCall'] === 'function' && _0x2d43fb['id']) {
                        await _0x235fa9['rejectCall'](_0x2d43fb['id'], _0x8fbcfa);
                    } else if (typeof _0x235fa9['sendCallOfferAck'] === 'function' && _0x2d43fb['id']) {
                        await _0x235fa9['sendCallOfferAck'](_0x2d43fb['id'], _0x8fbcfa, 'reject');
                    }
                } catch (_0x5211e4) {
                    printLog('error', 'Error\x20rejecting\x20call:\x20' + _0x5211e4['message']);
                }
                if (!_0x234327['has'](_0x8fbcfa)) {
                    _0x234327['add'](_0x8fbcfa);
                    setTimeout(() => _0x234327['delete'](_0x8fbcfa), 0xea60);
                    await _0x235fa9['sendMessage'](_0x8fbcfa, { 'text': '📵\x20Anticall\x20is\x20enabled.\x20Your\x20call\x20was\x20rejected\x20and\x20you\x20will\x20be\x20blocked.' });
                    printLog('info', 'Sent\x20anticall\x20warning\x20to:\x20' + _0x8fbcfa['split']('@')[0x0]);
                }
                setTimeout(async () => {
                    try {
                        await _0x235fa9['updateBlockStatus'](_0x8fbcfa, 'block');
                        printLog('success', 'Blocked\x20caller:\x20' + _0x8fbcfa['split']('@')[0x0]);
                    } catch (_0x176460) {
                        printLog('error', 'Error\x20blocking\x20caller:\x20' + _0x176460['message']);
                    }
                }, 0x320);
            } catch (_0x14b67d) {
                printLog('error', 'Error\x20handling\x20call\x20from\x20' + _0x8fbcfa['split']('@')[0x0] + ':\x20' + _0x14b67d['message']);
            }
        }
    } catch (_0x4d4287) {
        printLog('error', 'Call\x20handler\x20error:\x20' + _0x4d4287['message']);
        console['error'](_0x4d4287['stack']);
    }
}
export {
    handleMessages,
    handleGroupParticipantUpdate,
    handleStatus,
    handleCall
};