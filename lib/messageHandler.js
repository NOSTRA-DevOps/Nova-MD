import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x81cb3d from 'fs';
import { dataFile } from './paths.js';
import { handleChatbotResponse } from './Chatbots.js';
import _0x0_0x20a0f5 from '../config.js';
import _0x0_0x2eaa89 from './lightweight_store.js';
import _0x0_0x184b3d from './commandHandler.js';
import {
    printMessage,
    printLog
} from './print.js';
import { isBanned } from './isBanned.js';
import { isSudo } from './index.js';
import _0x0_0x3bec37 from './isOwner.js';
import _0x0_0x99e027 from './isAdmin.js';
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
        const _0x1f78c9 = await _0x0_0x2eaa89['getSetting']('global', 'stickerCommands');
        return _0x1f78c9 || {};
    } else {
        try {
            if (!_0x0_0x81cb3d['existsSync'](STICKER_FILE)) {
                return {};
            }
            return JSON['parse'](_0x0_0x81cb3d['readFileSync'](STICKER_FILE, 'utf8'));
        } catch {
            return {};
        }
    }
}
async function handleMessages(_0x24f0c9, _0x5686f6) {
    try {
        const {
            messages: _0x2cd86b,
            type: _0x4893d7
        } = _0x5686f6;
        if (_0x4893d7 !== 'notify')
            return;
        const _0x25b148 = _0x2cd86b[0x0];
        if (!_0x25b148?.['message'])
            return;
        const _0x5b48c1 = _0x25b148['key']['remoteJid'];
        const _0x210714 = _0x5b48c1['endsWith']('@g.us');
        const _0x1e406b = _0x25b148['key']['participant'] || _0x25b148['key']['remoteJid'];
        const _0x2aa313 = await _0x0_0x3bec37(_0x1e406b, _0x24f0c9, _0x5b48c1);
        const _0x450582 = _0x25b148['key']['fromMe'] || _0x2aa313;
        const _0x1c7bef = await _0x0_0x2eaa89['getBotMode']();
        if ((_0x1c7bef === 'private' || _0x1c7bef === 'self') && !_0x450582) {
            return;
        }
        await printMessage(_0x25b148, _0x24f0c9);
        try {
            const _0x45872b = await _0x0_0x2eaa89['getSetting']('global', 'stealthMode');
            if (!_0x45872b || !_0x45872b['enabled']) {
                await handleAutoread(_0x24f0c9, _0x25b148);
            } else {
                printLog('info', '👻\x20Stealth\x20mode\x20active');
            }
        } catch (_0x241d72) {
            await handleAutoread(_0x24f0c9, _0x25b148);
        }
        if (_0x25b148['message']?.['protocolMessage']?.['type'] === 0x0) {
            printLog('info', 'Message\x20deletion\x20detected');
            await handleMessageRevocation(_0x24f0c9, _0x25b148);
            return;
        }
        await storeMessage(_0x24f0c9, _0x25b148);
        if (_0x25b148['pushName'] && _0x24f0c9['store']?.['contacts']) {
            const _0xf87426 = _0x25b148['key']['participant'] || _0x25b148['key']['remoteJid'];
            if (_0xf87426) {
                _0x24f0c9['store']['contacts'][_0xf87426] = {
                    ..._0x24f0c9['store']['contacts'][_0xf87426],
                    'id': _0xf87426,
                    'notify': _0x25b148['pushName'],
                    'name': _0x25b148['pushName']
                };
                const _0xc4287e = _0x24f0c9['decodeJid']?.(_0xf87426);
                if (_0xc4287e && _0xc4287e !== _0xf87426) {
                    _0x24f0c9['store']['contacts'][_0xc4287e] = {
                        ..._0x24f0c9['store']['contacts'][_0xc4287e],
                        'id': _0xc4287e,
                        'notify': _0x25b148['pushName'],
                        'name': _0x25b148['pushName']
                    };
                }
            }
        }
        const _0x2287ea = _0x25b148['key']['participant'] || _0x25b148['key']['remoteJid'];
        if (_0x2287ea?.['includes']('@lid') && _0x24f0c9['store']?.['contacts']) {
            const _0x190fb2 = _0x24f0c9['store']['contacts'];
            const _0x2aaa87 = Object['keys'](_0x190fb2)['find'](_0x3433a6 => _0x190fb2[_0x3433a6]?.['lid'] === _0x2287ea || _0x190fb2[_0x3433a6]?.['lid']?.['split'](':')[0x0] === _0x2287ea['split']('@')[0x0]);
            if (_0x2aaa87?.['includes']('@s.whatsapp.net'))
                _0x1e406b = _0x2aaa87;
        }
        if (_0x25b148['message']?.['stickerMessage']) {
            const _0x24016d = _0x25b148['message']['stickerMessage']['fileSha256'];
            if (_0x24016d) {
                const _0x5dabae = Buffer['from'](_0x24016d)['toString']('base64');
                const _0x487c41 = await getStickerCommands();
                if (_0x487c41[_0x5dabae]) {
                    const _0x2b51e5 = _0x487c41[_0x5dabae]['text'];
                    const [_0x171d8e, ..._0x54552e] = _0x2b51e5['split']('\x20');
                    let _0x3f128e = null;
                    let _0x2ab55b = '';
                    for (const _0x5beb96 of _0x0_0x20a0f5['prefixes']) {
                        const _0x32788a = (_0x5beb96 + _0x171d8e)['toLowerCase']();
                        _0x3f128e = _0x0_0x184b3d['getCommand'](_0x32788a, _0x0_0x20a0f5['prefixes']);
                        if (_0x3f128e) {
                            _0x2ab55b = _0x5beb96;
                            break;
                        }
                    }
                    if (_0x3f128e) {
                        const _0x20133b = await isSudo(_0x1e406b);
                        const _0x419012 = await _0x0_0x3bec37(_0x1e406b, _0x24f0c9, _0x5b48c1);
                        const _0x3fb0f7 = _0x25b148['key']['fromMe'] || _0x419012;
                        const _0x484a19 = await _0x0_0x2eaa89['getBotMode']();
                        const _0x1556ec = ((() => {
                            if (_0x3fb0f7)
                                return !![];
                            switch (_0x484a19) {
                            case 'public':
                                return !![];
                            case 'private':
                            case 'self':
                                return ![];
                            case 'groups':
                                return _0x210714;
                            case 'inbox':
                                return !_0x210714;
                            default:
                                return !![];
                            }
                        })());
                        if (!_0x1556ec)
                            return;
                        const _0x37b6f0 = await isBanned(_0x1e406b);
                        if (_0x37b6f0)
                            return;
                        if (_0x3f128e['strictOwnerOnly']) {
                            const {isOwnerOnly: _0x35fc57} = await import('./isOwner.js');
                            if (!_0x25b148['key']['fromMe'] && !_0x35fc57(_0x1e406b)) {
                                return await _0x24f0c9['sendMessage'](_0x5b48c1, {
                                    'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20bot\x20owner!*',
                                    ...channelInfo
                                }, { 'quoted': _0x25b148 });
                            }
                        }
                        if (_0x3f128e['ownerOnly'] && !_0x25b148['key']['fromMe'] && !_0x419012) {
                            return await _0x24f0c9['sendMessage'](_0x5b48c1, {
                                'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20owner\x20or\x20sudo\x20users!*',
                                ...channelInfo
                            }, { 'quoted': _0x25b148 });
                        }
                        if (_0x3f128e['groupOnly'] && !_0x210714) {
                            return await _0x24f0c9['sendMessage'](_0x5b48c1, {
                                'text': 'ℹ️\x20*This\x20command\x20can\x20only\x20be\x20used\x20in\x20groups!*',
                                ...channelInfo
                            }, { 'quoted': _0x25b148 });
                        }
                        let _0x1e15e3 = ![];
                        let _0x20ef5d = ![];
                        if (_0x3f128e['adminOnly'] && _0x210714) {
                            const _0x7f43c6 = await _0x0_0x99e027(_0x24f0c9, _0x5b48c1, _0x1e406b);
                            _0x1e15e3 = _0x7f43c6['isSenderAdmin'];
                            _0x20ef5d = _0x7f43c6['isBotAdmin'];
                            if (!_0x20ef5d) {
                                return await _0x24f0c9['sendMessage'](_0x5b48c1, {
                                    'text': 'ℹ️\x20*Please\x20make\x20the\x20bot\x20an\x20admin\x20to\x20use\x20this\x20command.*',
                                    ...channelInfo
                                }, { 'quoted': _0x25b148 });
                            }
                            if (!_0x1e15e3 && !_0x25b148['key']['fromMe'] && !_0x419012) {
                                return await _0x24f0c9['sendMessage'](_0x5b48c1, {
                                    'text': 'ℹ️\x20*Sorry,\x20only\x20group\x20admins\x20can\x20use\x20this\x20command.*',
                                    ...channelInfo
                                }, { 'quoted': _0x25b148 });
                            }
                        }
                        const _0x52604d = {
                            'key': _0x25b148['key'],
                            'message': {
                                'extendedTextMessage': {
                                    'text': _0x2ab55b + _0x2b51e5,
                                    'contextInfo': _0x25b148['message']['stickerMessage']['contextInfo'] || {}
                                }
                            },
                            'messageTimestamp': _0x25b148['messageTimestamp'],
                            'pushName': _0x25b148['pushName'],
                            'broadcast': _0x25b148['broadcast']
                        };
                        const _0x16fdff = {
                            'chatId': _0x5b48c1,
                            'senderId': _0x1e406b,
                            'isGroup': _0x210714,
                            'isSenderAdmin': _0x1e15e3,
                            'isBotAdmin': _0x20ef5d,
                            'senderIsOwnerOrSudo': _0x419012,
                            'isOwnerOrSudoCheck': _0x3fb0f7,
                            'channelInfo': channelInfo,
                            'rawText': _0x2ab55b + _0x2b51e5,
                            'userMessage': (_0x2ab55b + _0x2b51e5)['toLowerCase'](),
                            'messageText': _0x2ab55b + _0x2b51e5,
                            'config': _0x0_0x20a0f5
                        };
                        try {
                            await _0x3f128e['handler'](_0x24f0c9, _0x52604d, _0x54552e, _0x16fdff);
                            await addCommandReaction(_0x24f0c9, _0x25b148);
                            await showTypingAfterCommand(_0x24f0c9, _0x5b48c1);
                            printLog('success', '✅\x20Sticker\x20command\x20executed:\x20' + _0x2b51e5);
                        } catch (_0x1fa85b) {
                            printLog('error', '❌\x20Sticker\x20command\x20error\x20[' + _0x2b51e5 + ']:\x20' + _0x1fa85b['message']);
                            console['error'](_0x1fa85b['stack']);
                            await _0x24f0c9['sendMessage'](_0x5b48c1, {
                                'text': '❌\x20Error\x20executing\x20sticker\x20command:\x20' + _0x1fa85b['message'],
                                ...channelInfo
                            }, { 'quoted': _0x25b148 });
                        }
                    } else {
                        printLog('warning', '⚠️\x20Sticker\x20command\x20not\x20found:\x20' + _0x2b51e5);
                    }
                    return;
                }
            }
        }
        const _0xd4d4fa = _0x25b148['message']?.['conversation'] || _0x25b148['message']?.['extendedTextMessage']?.['text'] || _0x25b148['message']?.['imageMessage']?.['caption'] || _0x25b148['message']?.['videoMessage']?.['caption'] || _0x25b148['message']?.['buttonsResponseMessage']?.['selectedButtonId'] || '';
        const _0xf7080d = _0xd4d4fa['trim']();
        const _0x5e4fcb = _0xf7080d['toLowerCase']();
        const _0x23a4de = await isSudo(_0x1e406b);
        startSchedulerEngine(_0x24f0c9);
        if (!_0x25b148['key']['fromMe']) {
            const _0x316a50 = await handleAutoReply(_0x24f0c9, _0x5b48c1, _0x25b148, _0x5e4fcb);
            if (_0x316a50)
                return;
        }
        if (_0x25b148['message']?.['buttonsResponseMessage']) {
            const _0x3047cf = _0x25b148['message']['buttonsResponseMessage']['selectedButtonId'];
            printLog('info', 'Button\x20response:\x20' + _0x3047cf);
            if (_0x3047cf === 'channel') {
                await _0x24f0c9['sendMessage'](_0x5b48c1, { 'text': '*Join\x20our\x20Channel:*\x0a[https://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y](https://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y)' }, { 'quoted': _0x25b148 });
                return;
            } else if (_0x3047cf === 'owner') {
                const _0x5c3196 = (await import('../plugins/owner.js'))['default'];
                await _0x5c3196['handler']?.(_0x24f0c9, _0x5b48c1, '', {});
                return;
            } else if (_0x3047cf === 'support') {
                await _0x24f0c9['sendMessage'](_0x5b48c1, { 'text': '*Support*\x0a\x0ahttps://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y' }, { 'quoted': _0x25b148 });
                return;
            }
        }
        const _0x889497 = await isBanned(_0x1e406b);
        if (_0x889497 && !_0x5e4fcb['startsWith']('.unban')) {
            if (Math['random']() < 0.1) {
                printLog('warning', 'Banned\x20user\x20attempted\x20command:\x20' + _0x1e406b['split']('@')[0x0]);
                await _0x24f0c9['sendMessage'](_0x5b48c1, {
                    'text': 'You\x20are\x20banned\x20from\x20using\x20the\x20bot.\x20Contact\x20an\x20admin\x20to\x20get\x20unbanned.',
                    ...channelInfo
                });
            }
            return;
        }
        if (/^[1-9]$/['test'](_0x5e4fcb) || _0x5e4fcb === 'surrender') {
            await handleTicTacToeMove(_0x24f0c9, _0x5b48c1, _0x1e406b, _0x5e4fcb);
            return;
        }
        if (!_0x25b148['key']['fromMe']) {
            await _0x0_0x2eaa89['incrementMessageCount'](_0x5b48c1, _0x1e406b, _0x25b148['pushName']);
        } else {
            const _0x99883d = _0x24f0c9['user']?.['id'] || _0x1e406b;
            const _0x3570f4 = _0x24f0c9['user']?.['name'] || _0x24f0c9['user']?.['notify'] || 'Me';
            await _0x0_0x2eaa89['incrementMessageCount'](_0x5b48c1, _0x99883d, _0x3570f4);
        }
        if (_0x210714) {
            if (_0x5e4fcb) {
                await handleBadwordDetection(_0x24f0c9, _0x5b48c1, _0x25b148, _0x5e4fcb, _0x1e406b);
            }
            await handleLinkDetection(_0x24f0c9, _0x5b48c1, _0x25b148, _0x5e4fcb, _0x1e406b);
        }
        if (_0x210714 && !_0x25b148['key']['fromMe']) {
            const _0x19b954 = await handleAntiSpam(_0x24f0c9, _0x5b48c1, _0x25b148, _0x1e406b, _0x2aa313);
            if (_0x19b954)
                return;
        }
        if (!_0x210714 && !_0x25b148['key']['fromMe'] && !_0x23a4de) {
            try {
                const _0x42538d = (await import('../plugins/pmblocker.js'))['default'];
                const _0x264a42 = _0x42538d?.['readState'];
                const _0x475d93 = await _0x264a42();
                if (_0x475d93['enabled']) {
                    printLog('warning', 'PM\x20blocked\x20from:\x20' + _0x1e406b['split']('@')[0x0]);
                    await _0x24f0c9['sendMessage'](_0x5b48c1, { 'text': _0x475d93['message'] || 'Private\x20messages\x20are\x20blocked.\x20Please\x20contact\x20the\x20owner\x20in\x20groups\x20only.' });
                    await new Promise(_0x37bc18 => setTimeout(_0x37bc18, 0x5dc));
                    try {
                        await _0x24f0c9['updateBlockStatus'](_0x5b48c1, 'block');
                        printLog('success', 'Blocked\x20user:\x20' + _0x1e406b['split']('@')[0x0]);
                    } catch (_0x325637) {
                        printLog('error', 'Failed\x20to\x20block\x20user:\x20' + _0x325637['message']);
                    }
                    return;
                }
            } catch (_0x2fa496) {
                printLog('error', 'PM\x20blocker\x20error:\x20' + _0x2fa496['message']);
            }
        }
        const _0xc8e10e = _0x0_0x20a0f5['prefixes']?.['find'](_0x467430 => _0x5e4fcb['startsWith'](_0x467430));
        const _0x5a4838 = _0x0_0x184b3d['getCommand'](_0x5e4fcb, _0x0_0x20a0f5['prefixes']);
        if (!_0xc8e10e && !_0x5a4838) {
            await handleAutotypingForMessage(_0x24f0c9, _0x5b48c1, _0x5e4fcb);
            const _0x3d183f = await _0x0_0x2eaa89['getBotMode']();
            const _0x16007c = _0x3d183f === 'public' || _0x3d183f === 'groups' && _0x210714 || _0x3d183f === 'inbox' && !_0x210714 || _0x450582;
            if (_0x16007c) {
                if (_0x210714 && _0x5e4fcb['length'] < 0x3) {
                    const _0x23443c = 'nova';
                    if (!_0x5e4fcb['includes'](_0x23443c) && !_0x5e4fcb['includes']('@')) {
                        return;
                    }
                }
                await handleChatbotResponse(_0x24f0c9, _0x5b48c1, _0x25b148, _0x5e4fcb, _0x1e406b);
            }
            return;
        }
        if (!_0x5a4838) {
            const _0x4d1403 = 'nova';
            const _0x3bbad0 = _0x5e4fcb['includes'](_0x4d1403) || _0x5e4fcb['includes']('@nova');
            if (_0x3bbad0) {
                const _0x290c5f = await _0x0_0x2eaa89['getBotMode']();
                const _0x14652c = _0x290c5f === 'public' || _0x290c5f === 'groups' && _0x210714 || _0x290c5f === 'inbox' && !_0x210714 || _0x450582;
                if (_0x14652c) {
                    await handleChatbotResponse(_0x24f0c9, _0x5b48c1, _0x25b148, _0x5e4fcb, _0x1e406b);
                    return;
                }
            }
            return;
        }
        const _0xac39b3 = ((() => {
            if (_0x450582)
                return !![];
            switch (_0x1c7bef) {
            case 'public':
                return !![];
            case 'private':
            case 'self':
                return ![];
            case 'groups':
                return _0x210714;
            case 'inbox':
                return !_0x210714;
            default:
                return !![];
            }
        })());
        if (!_0xac39b3) {
            return;
        }
        let _0x31f9d1;
        if (_0xc8e10e) {
            const _0x4a111f = _0xf7080d['slice'](_0xc8e10e['length'])['trim']();
            _0x31f9d1 = _0x4a111f['split'](/\s+/)['slice'](0x1);
        } else {
            _0x31f9d1 = _0xf7080d['trim']()['split'](/\s+/)['slice'](0x1);
        }
        if (_0x5a4838['strictOwnerOnly']) {
            const {isOwnerOnly: _0x40cec5} = await import('./isOwner.js');
            if (!_0x25b148['key']['fromMe'] && !_0x40cec5(_0x1e406b)) {
                return await _0x24f0c9['sendMessage'](_0x5b48c1, {
                    'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20bot\x20owner!*\x0a\x0a_Sudo\x20users\x20cannot\x20manage\x20other\x20sudo\x20users._',
                    ...channelInfo
                }, { 'quoted': _0x25b148 });
            }
        }
        if (_0x5a4838['ownerOnly'] && !_0x25b148['key']['fromMe'] && !_0x2aa313) {
            return await _0x24f0c9['sendMessage'](_0x5b48c1, {
                'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20owner\x20or\x20sudo\x20users!*',
                ...channelInfo
            }, { 'quoted': _0x25b148 });
        }
        if (_0x5a4838['groupOnly'] && !_0x210714) {
            return await _0x24f0c9['sendMessage'](_0x5b48c1, {
                'text': 'ℹ️\x20*This\x20command\x20can\x20only\x20be\x20used\x20in\x20groups!*',
                ...channelInfo
            }, { 'quoted': _0x25b148 });
        }
        let _0x1001a0 = ![];
        let _0x4a1350 = ![];
        if (_0x5a4838['adminOnly'] && _0x210714) {
            const _0x2414ae = await _0x0_0x99e027(_0x24f0c9, _0x5b48c1, _0x1e406b);
            _0x1001a0 = _0x2414ae['isSenderAdmin'];
            _0x4a1350 = _0x2414ae['isBotAdmin'];
            if (!_0x4a1350) {
                return await _0x24f0c9['sendMessage'](_0x5b48c1, {
                    'text': 'ℹ️\x20*Please\x20make\x20the\x20bot\x20an\x20admin\x20to\x20use\x20this\x20command.*',
                    ...channelInfo
                }, { 'quoted': _0x25b148 });
            }
            if (!_0x1001a0 && !_0x25b148['key']['fromMe'] && !_0x2aa313) {
                return await _0x24f0c9['sendMessage'](_0x5b48c1, {
                    'text': 'ℹ️\x20*Sorry,\x20only\x20group\x20admins\x20can\x20use\x20this\x20command.*',
                    ...channelInfo
                }, { 'quoted': _0x25b148 });
            }
        }
        const _0x21227a = {
            'chatId': _0x5b48c1,
            'senderId': _0x1e406b,
            'isGroup': _0x210714,
            'isSenderAdmin': _0x1001a0,
            'isBotAdmin': _0x4a1350,
            'senderIsOwnerOrSudo': _0x2aa313,
            'isOwnerOrSudoCheck': _0x450582,
            'channelInfo': channelInfo,
            'rawText': _0xd4d4fa,
            'userMessage': _0x5e4fcb,
            'messageText': _0xf7080d,
            'config': _0x0_0x20a0f5
        };
        try {
            await _0x5a4838['handler'](_0x24f0c9, _0x25b148, _0x31f9d1, _0x21227a);
            await addCommandReaction(_0x24f0c9, _0x25b148);
            await showTypingAfterCommand(_0x24f0c9, _0x5b48c1);
        } catch (_0x26384e) {
            printLog('error', 'Command\x20error\x20[' + _0x5a4838['command'] + ']:\x20' + _0x26384e['message']);
            console['error'](_0x26384e['stack']);
            await _0x24f0c9['sendMessage'](_0x5b48c1, {
                'text': '❌\x20Error\x20executing\x20command:\x20' + _0x26384e['message'],
                ...channelInfo
            }, { 'quoted': _0x25b148 });
            const _0x5b36e1 = {
                'command': _0x5a4838['command'],
                'error': _0x26384e['message'],
                'stack': _0x26384e['stack'],
                'timestamp': new Date()['toISOString'](),
                'user': _0x1e406b,
                'chat': _0x5b48c1
            };
            try {
                writeErrorLog(_0x5b36e1);
            } catch (_0x2acce2) {
                printLog('error', 'Failed\x20to\x20write\x20error\x20log:\x20' + _0x2acce2['message']);
            }
        }
    } catch (_0x1cd96c) {
        printLog('error', 'Message\x20handler\x20error:\x20' + _0x1cd96c['message']);
        console['error'](_0x1cd96c['stack']);
        const _0x43e9ac = _0x5686f6['messages']?.[0x0]?.['key']?.['remoteJid'];
        if (_0x43e9ac) {
            try {
                await _0x24f0c9['sendMessage'](_0x43e9ac, {
                    'text': 'ℹ️\x20*Failed\x20to\x20process\x20message!*',
                    ...channelInfo
                });
            } catch (_0x1f6fac) {
                printLog('error', 'Failed\x20to\x20send\x20error\x20message:\x20' + _0x1f6fac['message']);
            }
        }
    }
}
async function handleGroupParticipantUpdate(_0x2c4790, _0xb11142) {
    try {
        const {
            id: _0x1ea3e7,
            participants: _0x2ea33a,
            action: _0x5cb8cb,
            author: _0x15dd21
        } = _0xb11142;
        if (!_0x1ea3e7['endsWith']('@g.us'))
            return;
        const _0x185639 = await _0x0_0x2eaa89['getBotMode']();
        const _0x24ba6c = _0x15dd21 ? await _0x0_0x3bec37(_0x15dd21, _0x2c4790, _0x1ea3e7) : ![];
        const _0x44f9b7 = _0x15dd21 ? _0x15dd21 === _0x2c4790['user']['id'] || _0x15dd21 === _0x2c4790['user']['id']['split'](':')[0x0] + '@s.whatsapp.net' : ![];
        const _0x3bad28 = _0x44f9b7 || _0x24ba6c;
        if ((_0x185639 === 'private' || _0x185639 === 'self') && !_0x3bad28) {
            return;
        }
        invalidateGroupCache(_0x1ea3e7);
        if (!_0x1ea3e7['endsWith']('@g.us'))
            return;
        printLog('info', 'Group\x20update:\x20' + _0x5cb8cb + '\x20in\x20' + _0x1ea3e7['split']('@')[0x0]);
        const _0x1be754 = _0x185639 === 'public' || _0x185639 === 'groups' || _0x3bad28;
        switch (_0x5cb8cb) {
        case 'promote':
            if (!_0x1be754)
                return;
            const _0x52cf6e = (await import('../plugins/promote.js'))['default']?.['handlePromotionEvent'];
            await _0x52cf6e(_0x2c4790, _0x1ea3e7, _0x2ea33a, _0x15dd21);
            break;
        case 'demote':
            if (!_0x1be754)
                return;
            const _0x8c0e9f = (await import('../plugins/demote.js'))['default']?.['handleDemotionEvent'];
            await _0x8c0e9f(_0x2c4790, _0x1ea3e7, _0x2ea33a, _0x15dd21);
            break;
        case 'add':
            const {handleJoinEvent: _0x14a8fd} = await import('../plugins/welcome.js');
            await _0x14a8fd(_0x2c4790, _0x1ea3e7, _0x2ea33a);
            break;
        case 'remove':
            const _0x22de19 = (await import('../plugins/goodbye.js'))['default']?.['handleLeaveEvent'];
            await _0x22de19(_0x2c4790, _0x1ea3e7, _0x2ea33a);
            break;
        default:
            printLog('warning', 'Unhandled\x20group\x20action:\x20' + _0x5cb8cb);
        }
    } catch (_0xb3945a) {
        printLog('error', 'Group\x20update\x20error:\x20' + _0xb3945a['message']);
        console['error'](_0xb3945a['stack']);
    }
}
async function handleStatus(_0xe9c08c, _0x20770a) {
    try {
        const {default: _0xaf4893} = await import('../plugins/autostatus.js');
        const _0x263f3c = _0xaf4893['handleStatusUpdate'];
        await _0x263f3c(_0xe9c08c, _0x20770a);
    } catch (_0x223f33) {
        printLog('error', 'Status\x20handler\x20error:\x20' + _0x223f33['message']);
        console['error'](_0x223f33['stack']);
    }
}
async function handleCall(_0x5ad0fb, _0x2ea3e0) {
    try {
        const _0x5cf028 = (await import('../plugins/anticall.js'))['default'];
        const _0x1f2ca9 = _0x5cf028['readState'] ? await _0x5cf028['readState']() : { 'enabled': ![] };
        if (!_0x1f2ca9['enabled'])
            return;
        const _0x54b51a = new Set();
        for (const _0x2912a0 of _0x2ea3e0) {
            const _0x25e278 = _0x2912a0['from'] || _0x2912a0['peerJid'] || _0x2912a0['chatId'];
            if (!_0x25e278)
                continue;
            try {
                try {
                    if (typeof _0x5ad0fb['rejectCall'] === 'function' && _0x2912a0['id']) {
                        await _0x5ad0fb['rejectCall'](_0x2912a0['id'], _0x25e278);
                    } else if (typeof _0x5ad0fb['sendCallOfferAck'] === 'function' && _0x2912a0['id']) {
                        await _0x5ad0fb['sendCallOfferAck'](_0x2912a0['id'], _0x25e278, 'reject');
                    }
                } catch (_0x49c322) {
                    printLog('error', 'Error\x20rejecting\x20call:\x20' + _0x49c322['message']);
                }
                if (!_0x54b51a['has'](_0x25e278)) {
                    _0x54b51a['add'](_0x25e278);
                    setTimeout(() => _0x54b51a['delete'](_0x25e278), 0xea60);
                    await _0x5ad0fb['sendMessage'](_0x25e278, { 'text': '📵\x20Anticall\x20is\x20enabled.\x20Your\x20call\x20was\x20rejected\x20and\x20you\x20will\x20be\x20blocked.' });
                    printLog('info', 'Sent\x20anticall\x20warning\x20to:\x20' + _0x25e278['split']('@')[0x0]);
                }
                setTimeout(async () => {
                    try {
                        await _0x5ad0fb['updateBlockStatus'](_0x25e278, 'block');
                        printLog('success', 'Blocked\x20caller:\x20' + _0x25e278['split']('@')[0x0]);
                    } catch (_0x479bd6) {
                        printLog('error', 'Error\x20blocking\x20caller:\x20' + _0x479bd6['message']);
                    }
                }, 0x320);
            } catch (_0x4f276d) {
                printLog('error', 'Error\x20handling\x20call\x20from\x20' + _0x25e278['split']('@')[0x0] + ':\x20' + _0x4f276d['message']);
            }
        }
    } catch (_0x22aefc) {
        printLog('error', 'Call\x20handler\x20error:\x20' + _0x22aefc['message']);
        console['error'](_0x22aefc['stack']);
    }
}
export {
    handleMessages,
    handleGroupParticipantUpdate,
    handleStatus,
    handleCall
};