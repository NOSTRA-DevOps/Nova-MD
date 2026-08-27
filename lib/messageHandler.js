import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0xb489b3 from 'fs';
import { dataFile } from './paths.js';
import { handleChatbotResponse } from './Chatbots.js';
import _0x0_0x588dbf from '../config.js';
import _0x0_0x1dc38c from './lightweight_store.js';
import _0x0_0x29ea8f from './commandHandler.js';
import {
    printMessage,
    printLog
} from './print.js';
import { isBanned } from './isBanned.js';
import { isSudo } from './index.js';
import _0x0_0x4c30f9 from './isOwner.js';
import _0x0_0x1d0dcf from './isAdmin.js';
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
        const _0x227231 = await _0x0_0x1dc38c['getSetting']('global', 'stickerCommands');
        return _0x227231 || {};
    } else {
        try {
            if (!_0x0_0xb489b3['existsSync'](STICKER_FILE)) {
                return {};
            }
            return JSON['parse'](_0x0_0xb489b3['readFileSync'](STICKER_FILE, 'utf8'));
        } catch {
            return {};
        }
    }
}
async function handleMessages(_0x5db192, _0x3c430b) {
    try {
        const {
            messages: _0x3690ef,
            type: _0x581d02
        } = _0x3c430b;
        if (_0x581d02 !== 'notify')
            return;
        const _0x363a65 = _0x3690ef[0x0];
        if (!_0x363a65?.['message'])
            return;
        const _0x2cfab6 = _0x363a65['key']['remoteJid'];
        const _0x50e0fd = _0x2cfab6['endsWith']('@g.us');
        const _0x56f637 = _0x363a65['key']['participant'] || _0x363a65['key']['remoteJid'];
        const _0x2d4574 = await _0x0_0x4c30f9(_0x56f637, _0x5db192, _0x2cfab6);
        const _0x325789 = _0x363a65['key']['fromMe'] || _0x2d4574;
        const _0x6d3284 = await _0x0_0x1dc38c['getBotMode']();
        if ((_0x6d3284 === 'private' || _0x6d3284 === 'self') && !_0x325789) {
            return;
        }
        await printMessage(_0x363a65, _0x5db192);
        try {
            const _0x1b3103 = await _0x0_0x1dc38c['getSetting']('global', 'stealthMode');
            if (!_0x1b3103 || !_0x1b3103['enabled']) {
                await handleAutoread(_0x5db192, _0x363a65);
            } else {
                printLog('info', '👻\x20Stealth\x20mode\x20active');
            }
        } catch (_0x582e20) {
            await handleAutoread(_0x5db192, _0x363a65);
        }
        if (_0x363a65['message']?.['protocolMessage']?.['type'] === 0x0) {
            printLog('info', 'Message\x20deletion\x20detected');
            await handleMessageRevocation(_0x5db192, _0x363a65);
            return;
        }
        await storeMessage(_0x5db192, _0x363a65);
        if (_0x363a65['pushName'] && _0x5db192['store']?.['contacts']) {
            const _0x54a296 = _0x363a65['key']['participant'] || _0x363a65['key']['remoteJid'];
            if (_0x54a296) {
                _0x5db192['store']['contacts'][_0x54a296] = {
                    ..._0x5db192['store']['contacts'][_0x54a296],
                    'id': _0x54a296,
                    'notify': _0x363a65['pushName'],
                    'name': _0x363a65['pushName']
                };
                const _0x56691d = _0x5db192['decodeJid']?.(_0x54a296);
                if (_0x56691d && _0x56691d !== _0x54a296) {
                    _0x5db192['store']['contacts'][_0x56691d] = {
                        ..._0x5db192['store']['contacts'][_0x56691d],
                        'id': _0x56691d,
                        'notify': _0x363a65['pushName'],
                        'name': _0x363a65['pushName']
                    };
                }
            }
        }
        const _0x23710a = _0x363a65['key']['participant'] || _0x363a65['key']['remoteJid'];
        if (_0x23710a?.['includes']('@lid') && _0x5db192['store']?.['contacts']) {
            const _0x445fd9 = _0x5db192['store']['contacts'];
            const _0x4556a5 = Object['keys'](_0x445fd9)['find'](_0x3dfa2e => _0x445fd9[_0x3dfa2e]?.['lid'] === _0x23710a || _0x445fd9[_0x3dfa2e]?.['lid']?.['split'](':')[0x0] === _0x23710a['split']('@')[0x0]);
            if (_0x4556a5?.['includes']('@s.whatsapp.net'))
                _0x56f637 = _0x4556a5;
        }
        if (_0x363a65['message']?.['stickerMessage']) {
            const _0x3fd76d = _0x363a65['message']['stickerMessage']['fileSha256'];
            if (_0x3fd76d) {
                const _0x56934c = Buffer['from'](_0x3fd76d)['toString']('base64');
                const _0x1e126f = await getStickerCommands();
                if (_0x1e126f[_0x56934c]) {
                    const _0x2137dc = _0x1e126f[_0x56934c]['text'];
                    const [_0x181256, ..._0x4c83fb] = _0x2137dc['split']('\x20');
                    let _0x1ef8c3 = null;
                    let _0xa2cfd = '';
                    for (const _0xd5c467 of _0x0_0x588dbf['prefixes']) {
                        const _0x13db44 = (_0xd5c467 + _0x181256)['toLowerCase']();
                        _0x1ef8c3 = _0x0_0x29ea8f['getCommand'](_0x13db44, _0x0_0x588dbf['prefixes']);
                        if (_0x1ef8c3) {
                            _0xa2cfd = _0xd5c467;
                            break;
                        }
                    }
                    if (_0x1ef8c3) {
                        const _0x1a470a = await isSudo(_0x56f637);
                        const _0x14dcc5 = await _0x0_0x4c30f9(_0x56f637, _0x5db192, _0x2cfab6);
                        const _0x46620f = _0x363a65['key']['fromMe'] || _0x14dcc5;
                        const _0x210fbc = await _0x0_0x1dc38c['getBotMode']();
                        const _0x5aec72 = ((() => {
                            if (_0x46620f)
                                return !![];
                            switch (_0x210fbc) {
                            case 'public':
                                return !![];
                            case 'private':
                            case 'self':
                                return ![];
                            case 'groups':
                                return _0x50e0fd;
                            case 'inbox':
                                return !_0x50e0fd;
                            default:
                                return !![];
                            }
                        })());
                        if (!_0x5aec72)
                            return;
                        const _0x47eda4 = await isBanned(_0x56f637);
                        if (_0x47eda4)
                            return;
                        if (_0x1ef8c3['strictOwnerOnly']) {
                            const {isOwnerOnly: _0x23f16d} = await import('./isOwner.js');
                            if (!_0x363a65['key']['fromMe'] && !_0x23f16d(_0x56f637)) {
                                return await _0x5db192['sendMessage'](_0x2cfab6, {
                                    'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20bot\x20owner!*',
                                    ...channelInfo
                                }, { 'quoted': _0x363a65 });
                            }
                        }
                        if (_0x1ef8c3['ownerOnly'] && !_0x363a65['key']['fromMe'] && !_0x14dcc5) {
                            return await _0x5db192['sendMessage'](_0x2cfab6, {
                                'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20owner\x20or\x20sudo\x20users!*',
                                ...channelInfo
                            }, { 'quoted': _0x363a65 });
                        }
                        if (_0x1ef8c3['groupOnly'] && !_0x50e0fd) {
                            return await _0x5db192['sendMessage'](_0x2cfab6, {
                                'text': 'ℹ️\x20*This\x20command\x20can\x20only\x20be\x20used\x20in\x20groups!*',
                                ...channelInfo
                            }, { 'quoted': _0x363a65 });
                        }
                        let _0x21142e = ![];
                        let _0x5eaae1 = ![];
                        if (_0x1ef8c3['adminOnly'] && _0x50e0fd) {
                            const _0x140835 = await _0x0_0x1d0dcf(_0x5db192, _0x2cfab6, _0x56f637);
                            _0x21142e = _0x140835['isSenderAdmin'];
                            _0x5eaae1 = _0x140835['isBotAdmin'];
                            if (!_0x5eaae1) {
                                return await _0x5db192['sendMessage'](_0x2cfab6, {
                                    'text': 'ℹ️\x20*Please\x20make\x20the\x20bot\x20an\x20admin\x20to\x20use\x20this\x20command.*',
                                    ...channelInfo
                                }, { 'quoted': _0x363a65 });
                            }
                            if (!_0x21142e && !_0x363a65['key']['fromMe'] && !_0x14dcc5) {
                                return await _0x5db192['sendMessage'](_0x2cfab6, {
                                    'text': 'ℹ️\x20*Sorry,\x20only\x20group\x20admins\x20can\x20use\x20this\x20command.*',
                                    ...channelInfo
                                }, { 'quoted': _0x363a65 });
                            }
                        }
                        const _0x10bcde = {
                            'key': _0x363a65['key'],
                            'message': {
                                'extendedTextMessage': {
                                    'text': _0xa2cfd + _0x2137dc,
                                    'contextInfo': _0x363a65['message']['stickerMessage']['contextInfo'] || {}
                                }
                            },
                            'messageTimestamp': _0x363a65['messageTimestamp'],
                            'pushName': _0x363a65['pushName'],
                            'broadcast': _0x363a65['broadcast']
                        };
                        const _0x17f537 = {
                            'chatId': _0x2cfab6,
                            'senderId': _0x56f637,
                            'isGroup': _0x50e0fd,
                            'isSenderAdmin': _0x21142e,
                            'isBotAdmin': _0x5eaae1,
                            'senderIsOwnerOrSudo': _0x14dcc5,
                            'isOwnerOrSudoCheck': _0x46620f,
                            'channelInfo': channelInfo,
                            'rawText': _0xa2cfd + _0x2137dc,
                            'userMessage': (_0xa2cfd + _0x2137dc)['toLowerCase'](),
                            'messageText': _0xa2cfd + _0x2137dc,
                            'config': _0x0_0x588dbf
                        };
                        try {
                            await _0x1ef8c3['handler'](_0x5db192, _0x10bcde, _0x4c83fb, _0x17f537);
                            await addCommandReaction(_0x5db192, _0x363a65);
                            await showTypingAfterCommand(_0x5db192, _0x2cfab6);
                            printLog('success', '✅\x20Sticker\x20command\x20executed:\x20' + _0x2137dc);
                        } catch (_0x26297e) {
                            printLog('error', '❌\x20Sticker\x20command\x20error\x20[' + _0x2137dc + ']:\x20' + _0x26297e['message']);
                            console['error'](_0x26297e['stack']);
                            await _0x5db192['sendMessage'](_0x2cfab6, {
                                'text': '❌\x20Error\x20executing\x20sticker\x20command:\x20' + _0x26297e['message'],
                                ...channelInfo
                            }, { 'quoted': _0x363a65 });
                        }
                    } else {
                        printLog('warning', '⚠️\x20Sticker\x20command\x20not\x20found:\x20' + _0x2137dc);
                    }
                    return;
                }
            }
        }
        const _0x3622b2 = _0x363a65['message']?.['conversation'] || _0x363a65['message']?.['extendedTextMessage']?.['text'] || _0x363a65['message']?.['imageMessage']?.['caption'] || _0x363a65['message']?.['videoMessage']?.['caption'] || _0x363a65['message']?.['buttonsResponseMessage']?.['selectedButtonId'] || '';
        const _0xb6ec1f = _0x3622b2['trim']();
        const _0x5f2a7c = _0xb6ec1f['toLowerCase']();
        const _0x346638 = await isSudo(_0x56f637);
        startSchedulerEngine(_0x5db192);
        if (!_0x363a65['key']['fromMe']) {
            const _0x4ad582 = await handleAutoReply(_0x5db192, _0x2cfab6, _0x363a65, _0x5f2a7c);
            if (_0x4ad582)
                return;
        }
        if (_0x363a65['message']?.['buttonsResponseMessage']) {
            const _0x120eb8 = _0x363a65['message']['buttonsResponseMessage']['selectedButtonId'];
            printLog('info', 'Button\x20response:\x20' + _0x120eb8);
            if (_0x120eb8 === 'channel') {
                await _0x5db192['sendMessage'](_0x2cfab6, { 'text': '*Join\x20our\x20Channel:*\x0a[https://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y](https://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y)' }, { 'quoted': _0x363a65 });
                return;
            } else if (_0x120eb8 === 'owner') {
                const _0x221ac8 = (await import('../plugins/owner.js'))['default'];
                await _0x221ac8['handler']?.(_0x5db192, _0x2cfab6, '', {});
                return;
            } else if (_0x120eb8 === 'support') {
                await _0x5db192['sendMessage'](_0x2cfab6, { 'text': '*Support*\x0a\x0ahttps://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y' }, { 'quoted': _0x363a65 });
                return;
            }
        }
        const _0x5da385 = await isBanned(_0x56f637);
        if (_0x5da385 && !_0x5f2a7c['startsWith']('.unban')) {
            if (Math['random']() < 0.1) {
                printLog('warning', 'Banned\x20user\x20attempted\x20command:\x20' + _0x56f637['split']('@')[0x0]);
                await _0x5db192['sendMessage'](_0x2cfab6, {
                    'text': 'You\x20are\x20banned\x20from\x20using\x20the\x20bot.\x20Contact\x20an\x20admin\x20to\x20get\x20unbanned.',
                    ...channelInfo
                });
            }
            return;
        }
        if (/^[1-9]$/['test'](_0x5f2a7c) || _0x5f2a7c === 'surrender') {
            await handleTicTacToeMove(_0x5db192, _0x2cfab6, _0x56f637, _0x5f2a7c);
            return;
        }
        if (!_0x363a65['key']['fromMe']) {
            await _0x0_0x1dc38c['incrementMessageCount'](_0x2cfab6, _0x56f637, _0x363a65['pushName']);
        } else {
            const _0x2b94b3 = _0x5db192['user']?.['id'] || _0x56f637;
            const _0x47ca58 = _0x5db192['user']?.['name'] || _0x5db192['user']?.['notify'] || 'Me';
            await _0x0_0x1dc38c['incrementMessageCount'](_0x2cfab6, _0x2b94b3, _0x47ca58);
        }
        if (_0x50e0fd) {
            if (_0x5f2a7c) {
                await handleBadwordDetection(_0x5db192, _0x2cfab6, _0x363a65, _0x5f2a7c, _0x56f637);
            }
            await handleLinkDetection(_0x5db192, _0x2cfab6, _0x363a65, _0x5f2a7c, _0x56f637);
        }
        if (_0x50e0fd && !_0x363a65['key']['fromMe']) {
            const _0xebe7ca = await handleAntiSpam(_0x5db192, _0x2cfab6, _0x363a65, _0x56f637, _0x2d4574);
            if (_0xebe7ca)
                return;
        }
        if (!_0x50e0fd && !_0x363a65['key']['fromMe'] && !_0x346638) {
            try {
                const _0x31659 = (await import('../plugins/pmblocker.js'))['default'];
                const _0x9d9ea3 = _0x31659?.['readState'];
                const _0x46b127 = await _0x9d9ea3();
                if (_0x46b127['enabled']) {
                    printLog('warning', 'PM\x20blocked\x20from:\x20' + _0x56f637['split']('@')[0x0]);
                    await _0x5db192['sendMessage'](_0x2cfab6, { 'text': _0x46b127['message'] || 'Private\x20messages\x20are\x20blocked.\x20Please\x20contact\x20the\x20owner\x20in\x20groups\x20only.' });
                    await new Promise(_0x1f47f0 => setTimeout(_0x1f47f0, 0x5dc));
                    try {
                        await _0x5db192['updateBlockStatus'](_0x2cfab6, 'block');
                        printLog('success', 'Blocked\x20user:\x20' + _0x56f637['split']('@')[0x0]);
                    } catch (_0x35b768) {
                        printLog('error', 'Failed\x20to\x20block\x20user:\x20' + _0x35b768['message']);
                    }
                    return;
                }
            } catch (_0x4dba7d) {
                printLog('error', 'PM\x20blocker\x20error:\x20' + _0x4dba7d['message']);
            }
        }
        const _0x172e7e = _0x0_0x588dbf['prefixes']?.['find'](_0x4b1aba => _0x5f2a7c['startsWith'](_0x4b1aba));
        const _0x36c4f8 = _0x0_0x29ea8f['getCommand'](_0x5f2a7c, _0x0_0x588dbf['prefixes']);
        if (!_0x172e7e && !_0x36c4f8) {
            await handleAutotypingForMessage(_0x5db192, _0x2cfab6, _0x5f2a7c);
            const _0x4142b6 = await _0x0_0x1dc38c['getBotMode']();
            const _0x47d464 = _0x4142b6 === 'public' || _0x4142b6 === 'groups' && _0x50e0fd || _0x4142b6 === 'inbox' && !_0x50e0fd || _0x325789;
            if (_0x47d464) {
                if (_0x50e0fd && _0x5f2a7c['length'] < 0x3) {
                    const _0xd60ee2 = 'nova';
                    if (!_0x5f2a7c['includes'](_0xd60ee2) && !_0x5f2a7c['includes']('@')) {
                        return;
                    }
                }
                await handleChatbotResponse(_0x5db192, _0x2cfab6, _0x363a65, _0x5f2a7c, _0x56f637);
            }
            return;
        }
        if (!_0x36c4f8) {
            const _0xbd40d = 'nova';
            const _0x2eaeb1 = _0x5f2a7c['includes'](_0xbd40d) || _0x5f2a7c['includes']('@nova');
            if (_0x2eaeb1) {
                const _0x2e9efa = await _0x0_0x1dc38c['getBotMode']();
                const _0x4f8c6a = _0x2e9efa === 'public' || _0x2e9efa === 'groups' && _0x50e0fd || _0x2e9efa === 'inbox' && !_0x50e0fd || _0x325789;
                if (_0x4f8c6a) {
                    await handleChatbotResponse(_0x5db192, _0x2cfab6, _0x363a65, _0x5f2a7c, _0x56f637);
                    return;
                }
            }
            return;
        }
        const _0xaa8ad5 = ((() => {
            if (_0x325789)
                return !![];
            switch (_0x6d3284) {
            case 'public':
                return !![];
            case 'private':
            case 'self':
                return ![];
            case 'groups':
                return _0x50e0fd;
            case 'inbox':
                return !_0x50e0fd;
            default:
                return !![];
            }
        })());
        if (!_0xaa8ad5) {
            return;
        }
        let _0x17cbfe;
        if (_0x172e7e) {
            const _0x57302e = _0xb6ec1f['slice'](_0x172e7e['length'])['trim']();
            _0x17cbfe = _0x57302e['split'](/\s+/)['slice'](0x1);
        } else {
            _0x17cbfe = _0xb6ec1f['trim']()['split'](/\s+/)['slice'](0x1);
        }
        if (_0x36c4f8['strictOwnerOnly']) {
            const {isOwnerOnly: _0x5c5320} = await import('./isOwner.js');
            if (!_0x363a65['key']['fromMe'] && !_0x5c5320(_0x56f637)) {
                return await _0x5db192['sendMessage'](_0x2cfab6, {
                    'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20bot\x20owner!*\x0a\x0a_Sudo\x20users\x20cannot\x20manage\x20other\x20sudo\x20users._',
                    ...channelInfo
                }, { 'quoted': _0x363a65 });
            }
        }
        if (_0x36c4f8['ownerOnly'] && !_0x363a65['key']['fromMe'] && !_0x2d4574) {
            return await _0x5db192['sendMessage'](_0x2cfab6, {
                'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20owner\x20or\x20sudo\x20users!*',
                ...channelInfo
            }, { 'quoted': _0x363a65 });
        }
        if (_0x36c4f8['groupOnly'] && !_0x50e0fd) {
            return await _0x5db192['sendMessage'](_0x2cfab6, {
                'text': 'ℹ️\x20*This\x20command\x20can\x20only\x20be\x20used\x20in\x20groups!*',
                ...channelInfo
            }, { 'quoted': _0x363a65 });
        }
        let _0x1b6a72 = ![];
        let _0x408de4 = ![];
        if (_0x36c4f8['adminOnly'] && _0x50e0fd) {
            const _0x131aa0 = await _0x0_0x1d0dcf(_0x5db192, _0x2cfab6, _0x56f637);
            _0x1b6a72 = _0x131aa0['isSenderAdmin'];
            _0x408de4 = _0x131aa0['isBotAdmin'];
            if (!_0x408de4) {
                return await _0x5db192['sendMessage'](_0x2cfab6, {
                    'text': 'ℹ️\x20*Please\x20make\x20the\x20bot\x20an\x20admin\x20to\x20use\x20this\x20command.*',
                    ...channelInfo
                }, { 'quoted': _0x363a65 });
            }
            if (!_0x1b6a72 && !_0x363a65['key']['fromMe'] && !_0x2d4574) {
                return await _0x5db192['sendMessage'](_0x2cfab6, {
                    'text': 'ℹ️\x20*Sorry,\x20only\x20group\x20admins\x20can\x20use\x20this\x20command.*',
                    ...channelInfo
                }, { 'quoted': _0x363a65 });
            }
        }
        const _0x80f6d = {
            'chatId': _0x2cfab6,
            'senderId': _0x56f637,
            'isGroup': _0x50e0fd,
            'isSenderAdmin': _0x1b6a72,
            'isBotAdmin': _0x408de4,
            'senderIsOwnerOrSudo': _0x2d4574,
            'isOwnerOrSudoCheck': _0x325789,
            'channelInfo': channelInfo,
            'rawText': _0x3622b2,
            'userMessage': _0x5f2a7c,
            'messageText': _0xb6ec1f,
            'config': _0x0_0x588dbf
        };
        try {
            await _0x36c4f8['handler'](_0x5db192, _0x363a65, _0x17cbfe, _0x80f6d);
            await addCommandReaction(_0x5db192, _0x363a65);
            await showTypingAfterCommand(_0x5db192, _0x2cfab6);
        } catch (_0x5b9d11) {
            printLog('error', 'Command\x20error\x20[' + _0x36c4f8['command'] + ']:\x20' + _0x5b9d11['message']);
            console['error'](_0x5b9d11['stack']);
            await _0x5db192['sendMessage'](_0x2cfab6, {
                'text': '❌\x20Error\x20executing\x20command:\x20' + _0x5b9d11['message'],
                ...channelInfo
            }, { 'quoted': _0x363a65 });
            const _0x187b2f = {
                'command': _0x36c4f8['command'],
                'error': _0x5b9d11['message'],
                'stack': _0x5b9d11['stack'],
                'timestamp': new Date()['toISOString'](),
                'user': _0x56f637,
                'chat': _0x2cfab6
            };
            try {
                writeErrorLog(_0x187b2f);
            } catch (_0x4dcf0a) {
                printLog('error', 'Failed\x20to\x20write\x20error\x20log:\x20' + _0x4dcf0a['message']);
            }
        }
    } catch (_0x512c75) {
        printLog('error', 'Message\x20handler\x20error:\x20' + _0x512c75['message']);
        console['error'](_0x512c75['stack']);
        const _0x39933b = _0x3c430b['messages']?.[0x0]?.['key']?.['remoteJid'];
        if (_0x39933b) {
            try {
                await _0x5db192['sendMessage'](_0x39933b, {
                    'text': 'ℹ️\x20*Failed\x20to\x20process\x20message!*',
                    ...channelInfo
                });
            } catch (_0x23c9ff) {
                printLog('error', 'Failed\x20to\x20send\x20error\x20message:\x20' + _0x23c9ff['message']);
            }
        }
    }
}
async function handleGroupParticipantUpdate(_0x5dc01e, _0x2f5a57) {
    try {
        const {
            id: _0x17c68b,
            participants: _0x3dac4b,
            action: _0x2dfcdf,
            author: _0x24039c
        } = _0x2f5a57;
        if (!_0x17c68b['endsWith']('@g.us'))
            return;
        const _0x5b8d77 = await _0x0_0x1dc38c['getBotMode']();
        const _0x621ee6 = _0x24039c ? await _0x0_0x4c30f9(_0x24039c, _0x5dc01e, _0x17c68b) : ![];
        const _0x9e72dd = _0x24039c ? _0x24039c === _0x5dc01e['user']['id'] || _0x24039c === _0x5dc01e['user']['id']['split'](':')[0x0] + '@s.whatsapp.net' : ![];
        const _0x313e84 = _0x9e72dd || _0x621ee6;
        if ((_0x5b8d77 === 'private' || _0x5b8d77 === 'self') && !_0x313e84) {
            return;
        }
        invalidateGroupCache(_0x17c68b);
        if (!_0x17c68b['endsWith']('@g.us'))
            return;
        printLog('info', 'Group\x20update:\x20' + _0x2dfcdf + '\x20in\x20' + _0x17c68b['split']('@')[0x0]);
        const _0x57ff86 = _0x5b8d77 === 'public' || _0x5b8d77 === 'groups' || _0x313e84;
        switch (_0x2dfcdf) {
        case 'promote':
            if (!_0x57ff86)
                return;
            const _0x345a79 = (await import('../plugins/promote.js'))['default']?.['handlePromotionEvent'];
            await _0x345a79(_0x5dc01e, _0x17c68b, _0x3dac4b, _0x24039c);
            break;
        case 'demote':
            if (!_0x57ff86)
                return;
            const _0x1ad48e = (await import('../plugins/demote.js'))['default']?.['handleDemotionEvent'];
            await _0x1ad48e(_0x5dc01e, _0x17c68b, _0x3dac4b, _0x24039c);
            break;
        case 'add':
            const {handleJoinEvent: _0x5369ec} = await import('../plugins/welcome.js');
            await _0x5369ec(_0x5dc01e, _0x17c68b, _0x3dac4b);
            break;
        case 'remove':
            const _0xcb2b23 = (await import('../plugins/goodbye.js'))['default']?.['handleLeaveEvent'];
            await _0xcb2b23(_0x5dc01e, _0x17c68b, _0x3dac4b);
            break;
        default:
            printLog('warning', 'Unhandled\x20group\x20action:\x20' + _0x2dfcdf);
        }
    } catch (_0xc5db2f) {
        printLog('error', 'Group\x20update\x20error:\x20' + _0xc5db2f['message']);
        console['error'](_0xc5db2f['stack']);
    }
}
async function handleStatus(_0x62d818, _0x26cf30) {
    try {
        const {default: _0x12df3a} = await import('../plugins/autostatus.js');
        const _0x87abfb = _0x12df3a['handleStatusUpdate'];
        await _0x87abfb(_0x62d818, _0x26cf30);
    } catch (_0xbed497) {
        printLog('error', 'Status\x20handler\x20error:\x20' + _0xbed497['message']);
        console['error'](_0xbed497['stack']);
    }
}
async function handleCall(_0x9578c8, _0x2fe24a) {
    try {
        const _0x1fce7b = (await import('../plugins/anticall.js'))['default'];
        const _0x3c5b04 = _0x1fce7b['readState'] ? await _0x1fce7b['readState']() : { 'enabled': ![] };
        if (!_0x3c5b04['enabled'])
            return;
        const _0x745591 = new Set();
        for (const _0x2e17fe of _0x2fe24a) {
            const _0xb18e9a = _0x2e17fe['from'] || _0x2e17fe['peerJid'] || _0x2e17fe['chatId'];
            if (!_0xb18e9a)
                continue;
            try {
                try {
                    if (typeof _0x9578c8['rejectCall'] === 'function' && _0x2e17fe['id']) {
                        await _0x9578c8['rejectCall'](_0x2e17fe['id'], _0xb18e9a);
                    } else if (typeof _0x9578c8['sendCallOfferAck'] === 'function' && _0x2e17fe['id']) {
                        await _0x9578c8['sendCallOfferAck'](_0x2e17fe['id'], _0xb18e9a, 'reject');
                    }
                } catch (_0x6cc055) {
                    printLog('error', 'Error\x20rejecting\x20call:\x20' + _0x6cc055['message']);
                }
                if (!_0x745591['has'](_0xb18e9a)) {
                    _0x745591['add'](_0xb18e9a);
                    setTimeout(() => _0x745591['delete'](_0xb18e9a), 0xea60);
                    await _0x9578c8['sendMessage'](_0xb18e9a, { 'text': '📵\x20Anticall\x20is\x20enabled.\x20Your\x20call\x20was\x20rejected\x20and\x20you\x20will\x20be\x20blocked.' });
                    printLog('info', 'Sent\x20anticall\x20warning\x20to:\x20' + _0xb18e9a['split']('@')[0x0]);
                }
                setTimeout(async () => {
                    try {
                        await _0x9578c8['updateBlockStatus'](_0xb18e9a, 'block');
                        printLog('success', 'Blocked\x20caller:\x20' + _0xb18e9a['split']('@')[0x0]);
                    } catch (_0x4d60ec) {
                        printLog('error', 'Error\x20blocking\x20caller:\x20' + _0x4d60ec['message']);
                    }
                }, 0x320);
            } catch (_0x1863d0) {
                printLog('error', 'Error\x20handling\x20call\x20from\x20' + _0xb18e9a['split']('@')[0x0] + ':\x20' + _0x1863d0['message']);
            }
        }
    } catch (_0x5220bc) {
        printLog('error', 'Call\x20handler\x20error:\x20' + _0x5220bc['message']);
        console['error'](_0x5220bc['stack']);
    }
}
export {
    handleMessages,
    handleGroupParticipantUpdate,
    handleStatus,
    handleCall
};