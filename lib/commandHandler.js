import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x56570e from 'fs';
import { dataFile } from './paths.js';
import { handleChatbotResponse } from './Chatbots.js';
import _0x0_0x928bde from '../config.js';
import _0x0_0x36aeae from './lightweight_store.js';
import _0x0_0x11361f from './commandHandler.js';
import {
    printMessage,
    printLog
} from './print.js';
import { isBanned } from './isBanned.js';
import { isSudo } from './index.js';
import _0x0_0x11d219 from './isOwner.js';
import _0x0_0x3ed459 from './isAdmin.js';
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
        const _0x2435bd = await _0x0_0x36aeae['getSetting']('global', 'stickerCommands');
        return _0x2435bd || {};
    } else {
        try {
            if (!_0x0_0x56570e['existsSync'](STICKER_FILE)) {
                return {};
            }
            return JSON['parse'](_0x0_0x56570e['readFileSync'](STICKER_FILE, 'utf8'));
        } catch {
            return {};
        }
    }
}
async function handleMessages(_0x483b58, _0x2169a5) {
    try {
        const {
            messages: _0x1fc0f5,
            type: _0x4d3cbd
        } = _0x2169a5;
        if (_0x4d3cbd !== 'notify')
            return;
        const _0x12e66b = _0x1fc0f5[0x0];
        if (!_0x12e66b?.['message'])
            return;
        const _0x3eb0cc = _0x12e66b['key']['remoteJid'];
        const _0x3eceb6 = _0x3eb0cc['endsWith']('@g.us');
        const _0x4b4ac2 = _0x12e66b['key']['participant'] || _0x12e66b['key']['remoteJid'];
        const _0x31b338 = await _0x0_0x11d219(_0x4b4ac2, _0x483b58, _0x3eb0cc);
        const _0xd247ac = _0x12e66b['key']['fromMe'] || _0x31b338;
        const _0xe7b230 = await _0x0_0x36aeae['getBotMode']();
        if ((_0xe7b230 === 'private' || _0xe7b230 === 'self') && !_0xd247ac) {
            return;
        }
        await printMessage(_0x12e66b, _0x483b58);
        try {
            const _0x24df4e = await _0x0_0x36aeae['getSetting']('global', 'stealthMode');
            if (!_0x24df4e || !_0x24df4e['enabled']) {
                await handleAutoread(_0x483b58, _0x12e66b);
            } else {
                printLog('info', '👻\x20Stealth\x20mode\x20active');
            }
        } catch (_0x4091d2) {
            await handleAutoread(_0x483b58, _0x12e66b);
        }
        if (_0x12e66b['message']?.['protocolMessage']?.['type'] === 0x0) {
            printLog('info', 'Message\x20deletion\x20detected');
            await handleMessageRevocation(_0x483b58, _0x12e66b);
            return;
        }
        await storeMessage(_0x483b58, _0x12e66b);
        if (_0x12e66b['pushName'] && _0x483b58['store']?.['contacts']) {
            const _0x5d0111 = _0x12e66b['key']['participant'] || _0x12e66b['key']['remoteJid'];
            if (_0x5d0111) {
                _0x483b58['store']['contacts'][_0x5d0111] = {
                    ..._0x483b58['store']['contacts'][_0x5d0111],
                    'id': _0x5d0111,
                    'notify': _0x12e66b['pushName'],
                    'name': _0x12e66b['pushName']
                };
                const _0x8d2875 = _0x483b58['decodeJid']?.(_0x5d0111);
                if (_0x8d2875 && _0x8d2875 !== _0x5d0111) {
                    _0x483b58['store']['contacts'][_0x8d2875] = {
                        ..._0x483b58['store']['contacts'][_0x8d2875],
                        'id': _0x8d2875,
                        'notify': _0x12e66b['pushName'],
                        'name': _0x12e66b['pushName']
                    };
                }
            }
        }
        const _0x1ea0b1 = _0x12e66b['key']['participant'] || _0x12e66b['key']['remoteJid'];
        if (_0x1ea0b1?.['includes']('@lid') && _0x483b58['store']?.['contacts']) {
            const _0x1c5347 = _0x483b58['store']['contacts'];
            const _0x2d51ed = Object['keys'](_0x1c5347)['find'](_0x40bf30 => _0x1c5347[_0x40bf30]?.['lid'] === _0x1ea0b1 || _0x1c5347[_0x40bf30]?.['lid']?.['split'](':')[0x0] === _0x1ea0b1['split']('@')[0x0]);
            if (_0x2d51ed?.['includes']('@s.whatsapp.net'))
                _0x4b4ac2 = _0x2d51ed;
        }
        if (_0x12e66b['message']?.['stickerMessage']) {
            const _0x2cd1bf = _0x12e66b['message']['stickerMessage']['fileSha256'];
            if (_0x2cd1bf) {
                const _0x404ab6 = Buffer['from'](_0x2cd1bf)['toString']('base64');
                const _0x2dfaa7 = await getStickerCommands();
                if (_0x2dfaa7[_0x404ab6]) {
                    const _0x1daea4 = _0x2dfaa7[_0x404ab6]['text'];
                    const [_0x3e7020, ..._0x514b68] = _0x1daea4['split']('\x20');
                    let _0x31720c = null;
                    let _0x3aa42e = '';
                    for (const _0x3587d9 of _0x0_0x928bde['prefixes']) {
                        const _0x2886c6 = (_0x3587d9 + _0x3e7020)['toLowerCase']();
                        _0x31720c = _0x0_0x11361f['getCommand'](_0x2886c6, _0x0_0x928bde['prefixes']);
                        if (_0x31720c) {
                            _0x3aa42e = _0x3587d9;
                            break;
                        }
                    }
                    if (_0x31720c) {
                        const _0x59682c = await isSudo(_0x4b4ac2);
                        const _0x4433f6 = await _0x0_0x11d219(_0x4b4ac2, _0x483b58, _0x3eb0cc);
                        const _0x19d3fd = _0x12e66b['key']['fromMe'] || _0x4433f6;
                        const _0x94e38a = await _0x0_0x36aeae['getBotMode']();
                        const _0x18e14c = ((() => {
                            if (_0x19d3fd)
                                return !![];
                            switch (_0x94e38a) {
                            case 'public':
                                return !![];
                            case 'private':
                            case 'self':
                                return ![];
                            case 'groups':
                                return _0x3eceb6;
                            case 'inbox':
                                return !_0x3eceb6;
                            default:
                                return !![];
                            }
                        })());
                        if (!_0x18e14c)
                            return;
                        const _0x1dbebd = await isBanned(_0x4b4ac2);
                        if (_0x1dbebd)
                            return;
                        if (_0x31720c['strictOwnerOnly']) {
                            const {isOwnerOnly: _0x5d6769} = await import('./isOwner.js');
                            if (!_0x12e66b['key']['fromMe'] && !_0x5d6769(_0x4b4ac2)) {
                                return await _0x483b58['sendMessage'](_0x3eb0cc, {
                                    'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20bot\x20owner!*',
                                    ...channelInfo
                                }, { 'quoted': _0x12e66b });
                            }
                        }
                        if (_0x31720c['ownerOnly'] && !_0x12e66b['key']['fromMe'] && !_0x4433f6) {
                            return await _0x483b58['sendMessage'](_0x3eb0cc, {
                                'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20owner\x20or\x20sudo\x20users!*',
                                ...channelInfo
                            }, { 'quoted': _0x12e66b });
                        }
                        if (_0x31720c['groupOnly'] && !_0x3eceb6) {
                            return await _0x483b58['sendMessage'](_0x3eb0cc, {
                                'text': 'ℹ️\x20*This\x20command\x20can\x20only\x20be\x20used\x20in\x20groups!*',
                                ...channelInfo
                            }, { 'quoted': _0x12e66b });
                        }
                        let _0x5406e6 = ![];
                        let _0x1778cc = ![];
                        if (_0x31720c['adminOnly'] && _0x3eceb6) {
                            const _0x456980 = await _0x0_0x3ed459(_0x483b58, _0x3eb0cc, _0x4b4ac2);
                            _0x5406e6 = _0x456980['isSenderAdmin'];
                            _0x1778cc = _0x456980['isBotAdmin'];
                            if (!_0x1778cc) {
                                return await _0x483b58['sendMessage'](_0x3eb0cc, {
                                    'text': 'ℹ️\x20*Please\x20make\x20the\x20bot\x20an\x20admin\x20to\x20use\x20this\x20command.*',
                                    ...channelInfo
                                }, { 'quoted': _0x12e66b });
                            }
                            if (!_0x5406e6 && !_0x12e66b['key']['fromMe'] && !_0x4433f6) {
                                return await _0x483b58['sendMessage'](_0x3eb0cc, {
                                    'text': 'ℹ️\x20*Sorry,\x20only\x20group\x20admins\x20can\x20use\x20this\x20command.*',
                                    ...channelInfo
                                }, { 'quoted': _0x12e66b });
                            }
                        }
                        const _0x3ae8ff = {
                            'key': _0x12e66b['key'],
                            'message': {
                                'extendedTextMessage': {
                                    'text': _0x3aa42e + _0x1daea4,
                                    'contextInfo': _0x12e66b['message']['stickerMessage']['contextInfo'] || {}
                                }
                            },
                            'messageTimestamp': _0x12e66b['messageTimestamp'],
                            'pushName': _0x12e66b['pushName'],
                            'broadcast': _0x12e66b['broadcast']
                        };
                        const _0x421f64 = {
                            'chatId': _0x3eb0cc,
                            'senderId': _0x4b4ac2,
                            'isGroup': _0x3eceb6,
                            'isSenderAdmin': _0x5406e6,
                            'isBotAdmin': _0x1778cc,
                            'senderIsOwnerOrSudo': _0x4433f6,
                            'isOwnerOrSudoCheck': _0x19d3fd,
                            'channelInfo': channelInfo,
                            'rawText': _0x3aa42e + _0x1daea4,
                            'userMessage': (_0x3aa42e + _0x1daea4)['toLowerCase'](),
                            'messageText': _0x3aa42e + _0x1daea4,
                            'config': _0x0_0x928bde
                        };
                        try {
                            await _0x31720c['handler'](_0x483b58, _0x3ae8ff, _0x514b68, _0x421f64);
                            await addCommandReaction(_0x483b58, _0x12e66b);
                            await showTypingAfterCommand(_0x483b58, _0x3eb0cc);
                            printLog('success', '✅\x20Sticker\x20command\x20executed:\x20' + _0x1daea4);
                        } catch (_0x46f73c) {
                            printLog('error', '❌\x20Sticker\x20command\x20error\x20[' + _0x1daea4 + ']:\x20' + _0x46f73c['message']);
                            console['error'](_0x46f73c['stack']);
                            await _0x483b58['sendMessage'](_0x3eb0cc, {
                                'text': '❌\x20Error\x20executing\x20sticker\x20command:\x20' + _0x46f73c['message'],
                                ...channelInfo
                            }, { 'quoted': _0x12e66b });
                        }
                    } else {
                        printLog('warning', '⚠️\x20Sticker\x20command\x20not\x20found:\x20' + _0x1daea4);
                    }
                    return;
                }
            }
        }
        const _0x4cb62d = _0x12e66b['message']?.['conversation'] || _0x12e66b['message']?.['extendedTextMessage']?.['text'] || _0x12e66b['message']?.['imageMessage']?.['caption'] || _0x12e66b['message']?.['videoMessage']?.['caption'] || _0x12e66b['message']?.['buttonsResponseMessage']?.['selectedButtonId'] || '';
        const _0x3d815e = _0x4cb62d['trim']();
        const _0x367409 = _0x3d815e['toLowerCase']();
        const _0x3a267e = await isSudo(_0x4b4ac2);
        startSchedulerEngine(_0x483b58);
        if (!_0x12e66b['key']['fromMe']) {
            const _0x384191 = await handleAutoReply(_0x483b58, _0x3eb0cc, _0x12e66b, _0x367409);
            if (_0x384191)
                return;
        }
        if (_0x12e66b['message']?.['buttonsResponseMessage']) {
            const _0x2bcb5c = _0x12e66b['message']['buttonsResponseMessage']['selectedButtonId'];
            printLog('info', 'Button\x20response:\x20' + _0x2bcb5c);
            if (_0x2bcb5c === 'channel') {
                await _0x483b58['sendMessage'](_0x3eb0cc, { 'text': '*Join\x20our\x20Channel:*\x0a[https://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y](https://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y)' }, { 'quoted': _0x12e66b });
                return;
            } else if (_0x2bcb5c === 'owner') {
                const _0x40027b = (await import('../plugins/owner.js'))['default'];
                await _0x40027b['handler']?.(_0x483b58, _0x3eb0cc, '', {});
                return;
            } else if (_0x2bcb5c === 'support') {
                await _0x483b58['sendMessage'](_0x3eb0cc, { 'text': '*Support*\x0a\x0ahttps://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y' }, { 'quoted': _0x12e66b });
                return;
            }
        }
        const _0x1fab57 = await isBanned(_0x4b4ac2);
        if (_0x1fab57 && !_0x367409['startsWith']('.unban')) {
            if (Math['random']() < 0.1) {
                printLog('warning', 'Banned\x20user\x20attempted\x20command:\x20' + _0x4b4ac2['split']('@')[0x0]);
                await _0x483b58['sendMessage'](_0x3eb0cc, {
                    'text': 'You\x20are\x20banned\x20from\x20using\x20the\x20bot.\x20Contact\x20an\x20admin\x20to\x20get\x20unbanned.',
                    ...channelInfo
                });
            }
            return;
        }
        if (/^[1-9]$/['test'](_0x367409) || _0x367409 === 'surrender') {
            await handleTicTacToeMove(_0x483b58, _0x3eb0cc, _0x4b4ac2, _0x367409);
            return;
        }
        if (!_0x12e66b['key']['fromMe']) {
            await _0x0_0x36aeae['incrementMessageCount'](_0x3eb0cc, _0x4b4ac2, _0x12e66b['pushName']);
        } else {
            const _0x370825 = _0x483b58['user']?.['id'] || _0x4b4ac2;
            const _0x29b287 = _0x483b58['user']?.['name'] || _0x483b58['user']?.['notify'] || 'Me';
            await _0x0_0x36aeae['incrementMessageCount'](_0x3eb0cc, _0x370825, _0x29b287);
        }
        if (_0x3eceb6) {
            if (_0x367409) {
                await handleBadwordDetection(_0x483b58, _0x3eb0cc, _0x12e66b, _0x367409, _0x4b4ac2);
            }
            await handleLinkDetection(_0x483b58, _0x3eb0cc, _0x12e66b, _0x367409, _0x4b4ac2);
        }
        if (_0x3eceb6 && !_0x12e66b['key']['fromMe']) {
            const _0x1dcc36 = await handleAntiSpam(_0x483b58, _0x3eb0cc, _0x12e66b, _0x4b4ac2, _0x31b338);
            if (_0x1dcc36)
                return;
        }
        if (!_0x3eceb6 && !_0x12e66b['key']['fromMe'] && !_0x3a267e) {
            try {
                const _0x44e838 = (await import('../plugins/pmblocker.js'))['default'];
                const _0x196f32 = _0x44e838?.['readState'];
                const _0x57cd03 = await _0x196f32();
                if (_0x57cd03['enabled']) {
                    printLog('warning', 'PM\x20blocked\x20from:\x20' + _0x4b4ac2['split']('@')[0x0]);
                    await _0x483b58['sendMessage'](_0x3eb0cc, { 'text': _0x57cd03['message'] || 'Private\x20messages\x20are\x20blocked.\x20Please\x20contact\x20the\x20owner\x20in\x20groups\x20only.' });
                    await new Promise(_0x463c5f => setTimeout(_0x463c5f, 0x5dc));
                    try {
                        await _0x483b58['updateBlockStatus'](_0x3eb0cc, 'block');
                        printLog('success', 'Blocked\x20user:\x20' + _0x4b4ac2['split']('@')[0x0]);
                    } catch (_0x53fcdd) {
                        printLog('error', 'Failed\x20to\x20block\x20user:\x20' + _0x53fcdd['message']);
                    }
                    return;
                }
            } catch (_0x4ad8bd) {
                printLog('error', 'PM\x20blocker\x20error:\x20' + _0x4ad8bd['message']);
            }
        }
        const _0x442520 = _0x0_0x928bde['prefixes']?.['find'](_0x46112a => _0x367409['startsWith'](_0x46112a));
        const _0x4a097e = _0x0_0x11361f['getCommand'](_0x367409, _0x0_0x928bde['prefixes']);
        if (!_0x442520 && !_0x4a097e) {
            await handleAutotypingForMessage(_0x483b58, _0x3eb0cc, _0x367409);
            const _0x459077 = await _0x0_0x36aeae['getBotMode']();
            const _0x1691e4 = _0x459077 === 'public' || _0x459077 === 'groups' && _0x3eceb6 || _0x459077 === 'inbox' && !_0x3eceb6 || _0xd247ac;
            if (_0x1691e4) {
                if (_0x3eceb6 && _0x367409['length'] < 0x3) {
                    const _0x403a4a = 'nova';
                    if (!_0x367409['includes'](_0x403a4a) && !_0x367409['includes']('@')) {
                        return;
                    }
                }
                await handleChatbotResponse(_0x483b58, _0x3eb0cc, _0x12e66b, _0x367409, _0x4b4ac2);
            }
            return;
        }
        if (!_0x4a097e) {
            const _0x34079d = 'nova';
            const _0x1dc0be = _0x367409['includes'](_0x34079d) || _0x367409['includes']('@nova');
            if (_0x1dc0be) {
                const _0x57ecd2 = await _0x0_0x36aeae['getBotMode']();
                const _0x42d2e9 = _0x57ecd2 === 'public' || _0x57ecd2 === 'groups' && _0x3eceb6 || _0x57ecd2 === 'inbox' && !_0x3eceb6 || _0xd247ac;
                if (_0x42d2e9) {
                    await handleChatbotResponse(_0x483b58, _0x3eb0cc, _0x12e66b, _0x367409, _0x4b4ac2);
                    return;
                }
            }
            return;
        }
        const _0x47aae1 = ((() => {
            if (_0xd247ac)
                return !![];
            switch (_0xe7b230) {
            case 'public':
                return !![];
            case 'private':
            case 'self':
                return ![];
            case 'groups':
                return _0x3eceb6;
            case 'inbox':
                return !_0x3eceb6;
            default:
                return !![];
            }
        })());
        if (!_0x47aae1) {
            return;
        }
        let _0x8010db;
        if (_0x442520) {
            const _0xe9cb6f = _0x3d815e['slice'](_0x442520['length'])['trim']();
            _0x8010db = _0xe9cb6f['split'](/\s+/)['slice'](0x1);
        } else {
            _0x8010db = _0x3d815e['trim']()['split'](/\s+/)['slice'](0x1);
        }
        if (_0x4a097e['strictOwnerOnly']) {
            const {isOwnerOnly: _0x387527} = await import('./isOwner.js');
            if (!_0x12e66b['key']['fromMe'] && !_0x387527(_0x4b4ac2)) {
                return await _0x483b58['sendMessage'](_0x3eb0cc, {
                    'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20bot\x20owner!*\x0a\x0a_Sudo\x20users\x20cannot\x20manage\x20other\x20sudo\x20users._',
                    ...channelInfo
                }, { 'quoted': _0x12e66b });
            }
        }
        if (_0x4a097e['ownerOnly'] && !_0x12e66b['key']['fromMe'] && !_0x31b338) {
            return await _0x483b58['sendMessage'](_0x3eb0cc, {
                'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20owner\x20or\x20sudo\x20users!*',
                ...channelInfo
            }, { 'quoted': _0x12e66b });
        }
        if (_0x4a097e['groupOnly'] && !_0x3eceb6) {
            return await _0x483b58['sendMessage'](_0x3eb0cc, {
                'text': 'ℹ️\x20*This\x20command\x20can\x20only\x20be\x20used\x20in\x20groups!*',
                ...channelInfo
            }, { 'quoted': _0x12e66b });
        }
        let _0x51738a = ![];
        let _0x5036ce = ![];
        if (_0x4a097e['adminOnly'] && _0x3eceb6) {
            const _0xbee2d0 = await _0x0_0x3ed459(_0x483b58, _0x3eb0cc, _0x4b4ac2);
            _0x51738a = _0xbee2d0['isSenderAdmin'];
            _0x5036ce = _0xbee2d0['isBotAdmin'];
            if (!_0x5036ce) {
                return await _0x483b58['sendMessage'](_0x3eb0cc, {
                    'text': 'ℹ️\x20*Please\x20make\x20the\x20bot\x20an\x20admin\x20to\x20use\x20this\x20command.*',
                    ...channelInfo
                }, { 'quoted': _0x12e66b });
            }
            if (!_0x51738a && !_0x12e66b['key']['fromMe'] && !_0x31b338) {
                return await _0x483b58['sendMessage'](_0x3eb0cc, {
                    'text': 'ℹ️\x20*Sorry,\x20only\x20group\x20admins\x20can\x20use\x20this\x20command.*',
                    ...channelInfo
                }, { 'quoted': _0x12e66b });
            }
        }
        const _0x27d506 = {
            'chatId': _0x3eb0cc,
            'senderId': _0x4b4ac2,
            'isGroup': _0x3eceb6,
            'isSenderAdmin': _0x51738a,
            'isBotAdmin': _0x5036ce,
            'senderIsOwnerOrSudo': _0x31b338,
            'isOwnerOrSudoCheck': _0xd247ac,
            'channelInfo': channelInfo,
            'rawText': _0x4cb62d,
            'userMessage': _0x367409,
            'messageText': _0x3d815e,
            'config': _0x0_0x928bde
        };
        try {
            await _0x4a097e['handler'](_0x483b58, _0x12e66b, _0x8010db, _0x27d506);
            await addCommandReaction(_0x483b58, _0x12e66b);
            await showTypingAfterCommand(_0x483b58, _0x3eb0cc);
        } catch (_0x29aa5a) {
            printLog('error', 'Command\x20error\x20[' + _0x4a097e['command'] + ']:\x20' + _0x29aa5a['message']);
            console['error'](_0x29aa5a['stack']);
            await _0x483b58['sendMessage'](_0x3eb0cc, {
                'text': '❌\x20Error\x20executing\x20command:\x20' + _0x29aa5a['message'],
                ...channelInfo
            }, { 'quoted': _0x12e66b });
            const _0x588797 = {
                'command': _0x4a097e['command'],
                'error': _0x29aa5a['message'],
                'stack': _0x29aa5a['stack'],
                'timestamp': new Date()['toISOString'](),
                'user': _0x4b4ac2,
                'chat': _0x3eb0cc
            };
            try {
                writeErrorLog(_0x588797);
            } catch (_0x3e22f8) {
                printLog('error', 'Failed\x20to\x20write\x20error\x20log:\x20' + _0x3e22f8['message']);
            }
        }
    } catch (_0x3c9c8a) {
        printLog('error', 'Message\x20handler\x20error:\x20' + _0x3c9c8a['message']);
        console['error'](_0x3c9c8a['stack']);
        const _0x3befcd = _0x2169a5['messages']?.[0x0]?.['key']?.['remoteJid'];
        if (_0x3befcd) {
            try {
                await _0x483b58['sendMessage'](_0x3befcd, {
                    'text': 'ℹ️\x20*Failed\x20to\x20process\x20message!*',
                    ...channelInfo
                });
            } catch (_0x3cf25b) {
                printLog('error', 'Failed\x20to\x20send\x20error\x20message:\x20' + _0x3cf25b['message']);
            }
        }
    }
}
async function handleGroupParticipantUpdate(_0x5791ed, _0x408bfb) {
    try {
        const {
            id: _0x3f53de,
            participants: _0x48ca16,
            action: _0x71a078,
            author: _0x23cdd2
        } = _0x408bfb;
        if (!_0x3f53de['endsWith']('@g.us'))
            return;
        const _0x36e822 = await _0x0_0x36aeae['getBotMode']();
        const _0x53660e = _0x23cdd2 ? await _0x0_0x11d219(_0x23cdd2, _0x5791ed, _0x3f53de) : ![];
        const _0x5e08cf = _0x23cdd2 ? _0x23cdd2 === _0x5791ed['user']['id'] || _0x23cdd2 === _0x5791ed['user']['id']['split'](':')[0x0] + '@s.whatsapp.net' : ![];
        const _0x2814f9 = _0x5e08cf || _0x53660e;
        if ((_0x36e822 === 'private' || _0x36e822 === 'self') && !_0x2814f9) {
            return;
        }
        invalidateGroupCache(_0x3f53de);
        if (!_0x3f53de['endsWith']('@g.us'))
            return;
        printLog('info', 'Group\x20update:\x20' + _0x71a078 + '\x20in\x20' + _0x3f53de['split']('@')[0x0]);
        const _0x168de3 = _0x36e822 === 'public' || _0x36e822 === 'groups' || _0x2814f9;
        switch (_0x71a078) {
        case 'promote':
            if (!_0x168de3)
                return;
            const _0x1c1b59 = (await import('../plugins/promote.js'))['default']?.['handlePromotionEvent'];
            await _0x1c1b59(_0x5791ed, _0x3f53de, _0x48ca16, _0x23cdd2);
            break;
        case 'demote':
            if (!_0x168de3)
                return;
            const _0x14995f = (await import('../plugins/demote.js'))['default']?.['handleDemotionEvent'];
            await _0x14995f(_0x5791ed, _0x3f53de, _0x48ca16, _0x23cdd2);
            break;
        case 'add':
            const {handleJoinEvent: _0x51ba41} = await import('../plugins/welcome.js');
            await _0x51ba41(_0x5791ed, _0x3f53de, _0x48ca16);
            break;
        case 'remove':
            const _0x22fc34 = (await import('../plugins/goodbye.js'))['default']?.['handleLeaveEvent'];
            await _0x22fc34(_0x5791ed, _0x3f53de, _0x48ca16);
            break;
        default:
            printLog('warning', 'Unhandled\x20group\x20action:\x20' + _0x71a078);
        }
    } catch (_0xd97f19) {
        printLog('error', 'Group\x20update\x20error:\x20' + _0xd97f19['message']);
        console['error'](_0xd97f19['stack']);
    }
}
async function handleStatus(_0x3e81e7, _0x1f5dfc) {
    try {
        const {default: _0xbb6265} = await import('../plugins/autostatus.js');
        const _0x41a6fe = _0xbb6265['handleStatusUpdate'];
        await _0x41a6fe(_0x3e81e7, _0x1f5dfc);
    } catch (_0x52efb2) {
        printLog('error', 'Status\x20handler\x20error:\x20' + _0x52efb2['message']);
        console['error'](_0x52efb2['stack']);
    }
}
async function handleCall(_0x4a48af, _0xc697d2) {
    try {
        const _0x2437be = (await import('../plugins/anticall.js'))['default'];
        const _0x1a158d = _0x2437be['readState'] ? await _0x2437be['readState']() : { 'enabled': ![] };
        if (!_0x1a158d['enabled'])
            return;
        const _0x12d4a9 = new Set();
        for (const _0xb012c4 of _0xc697d2) {
            const _0x38e2ab = _0xb012c4['from'] || _0xb012c4['peerJid'] || _0xb012c4['chatId'];
            if (!_0x38e2ab)
                continue;
            try {
                try {
                    if (typeof _0x4a48af['rejectCall'] === 'function' && _0xb012c4['id']) {
                        await _0x4a48af['rejectCall'](_0xb012c4['id'], _0x38e2ab);
                    } else if (typeof _0x4a48af['sendCallOfferAck'] === 'function' && _0xb012c4['id']) {
                        await _0x4a48af['sendCallOfferAck'](_0xb012c4['id'], _0x38e2ab, 'reject');
                    }
                } catch (_0x171b33) {
                    printLog('error', 'Error\x20rejecting\x20call:\x20' + _0x171b33['message']);
                }
                if (!_0x12d4a9['has'](_0x38e2ab)) {
                    _0x12d4a9['add'](_0x38e2ab);
                    setTimeout(() => _0x12d4a9['delete'](_0x38e2ab), 0xea60);
                    await _0x4a48af['sendMessage'](_0x38e2ab, { 'text': '📵\x20Anticall\x20is\x20enabled.\x20Your\x20call\x20was\x20rejected\x20and\x20you\x20will\x20be\x20blocked.' });
                    printLog('info', 'Sent\x20anticall\x20warning\x20to:\x20' + _0x38e2ab['split']('@')[0x0]);
                }
                setTimeout(async () => {
                    try {
                        await _0x4a48af['updateBlockStatus'](_0x38e2ab, 'block');
                        printLog('success', 'Blocked\x20caller:\x20' + _0x38e2ab['split']('@')[0x0]);
                    } catch (_0x1a5524) {
                        printLog('error', 'Error\x20blocking\x20caller:\x20' + _0x1a5524['message']);
                    }
                }, 0x320);
            } catch (_0x140760) {
                printLog('error', 'Error\x20handling\x20call\x20from\x20' + _0x38e2ab['split']('@')[0x0] + ':\x20' + _0x140760['message']);
            }
        }
    } catch (_0x5bded4) {
        printLog('error', 'Call\x20handler\x20error:\x20' + _0x5bded4['message']);
        console['error'](_0x5bded4['stack']);
    }
}
export {
    handleMessages,
    handleGroupParticipantUpdate,
    handleStatus,
    handleCall
};