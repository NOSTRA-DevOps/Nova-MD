import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x44939b from 'fs';
import { dataFile } from './paths.js';
import { handleChatbotResponse } from './Chatbots.js';
import _0x0_0x20fac9 from '../config.js';
import _0x0_0x53c996 from './lightweight_store.js';
import _0x0_0x2a7b90 from './commandHandler.js';
import {
    printMessage,
    printLog
} from './print.js';
import { isBanned } from './isBanned.js';
import { isSudo } from './index.js';
import _0x0_0x49f6ef from './isOwner.js';
import _0x0_0x29cd7f from './isAdmin.js';
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
        const _0x70364d = await _0x0_0x53c996['getSetting']('global', 'stickerCommands');
        return _0x70364d || {};
    } else {
        try {
            if (!_0x0_0x44939b['existsSync'](STICKER_FILE)) {
                return {};
            }
            return JSON['parse'](_0x0_0x44939b['readFileSync'](STICKER_FILE, 'utf8'));
        } catch {
            return {};
        }
    }
}
async function handleMessages(_0x247880, _0xaced9e) {
    try {
        const {
            messages: _0x560304,
            type: _0xed9bc1
        } = _0xaced9e;
        if (_0xed9bc1 !== 'notify')
            return;
        const _0x5c686c = _0x560304[0x0];
        if (!_0x5c686c?.['message'])
            return;
        const _0x276448 = _0x5c686c['key']['remoteJid'];
        const _0x22f156 = _0x276448['endsWith']('@g.us');
        const _0x3ffb36 = _0x5c686c['key']['participant'] || _0x5c686c['key']['remoteJid'];
        const _0x2323e4 = await _0x0_0x49f6ef(_0x3ffb36, _0x247880, _0x276448);
        const _0x5cf5e0 = _0x5c686c['key']['fromMe'] || _0x2323e4;
        const _0xfae824 = await _0x0_0x53c996['getBotMode']();
        if ((_0xfae824 === 'private' || _0xfae824 === 'self') && !_0x5cf5e0) {
            return;
        }
        await printMessage(_0x5c686c, _0x247880);
        try {
            const _0x27bcc5 = await _0x0_0x53c996['getSetting']('global', 'stealthMode');
            if (!_0x27bcc5 || !_0x27bcc5['enabled']) {
                await handleAutoread(_0x247880, _0x5c686c);
            } else {
                printLog('info', '👻\x20Stealth\x20mode\x20active');
            }
        } catch (_0x3c9703) {
            await handleAutoread(_0x247880, _0x5c686c);
        }
        if (_0x5c686c['message']?.['protocolMessage']?.['type'] === 0x0) {
            printLog('info', 'Message\x20deletion\x20detected');
            await handleMessageRevocation(_0x247880, _0x5c686c);
            return;
        }
        await storeMessage(_0x247880, _0x5c686c);
        if (_0x5c686c['pushName'] && _0x247880['store']?.['contacts']) {
            const _0x571f53 = _0x5c686c['key']['participant'] || _0x5c686c['key']['remoteJid'];
            if (_0x571f53) {
                _0x247880['store']['contacts'][_0x571f53] = {
                    ..._0x247880['store']['contacts'][_0x571f53],
                    'id': _0x571f53,
                    'notify': _0x5c686c['pushName'],
                    'name': _0x5c686c['pushName']
                };
                const _0x4b25e5 = _0x247880['decodeJid']?.(_0x571f53);
                if (_0x4b25e5 && _0x4b25e5 !== _0x571f53) {
                    _0x247880['store']['contacts'][_0x4b25e5] = {
                        ..._0x247880['store']['contacts'][_0x4b25e5],
                        'id': _0x4b25e5,
                        'notify': _0x5c686c['pushName'],
                        'name': _0x5c686c['pushName']
                    };
                }
            }
        }
        const _0xd3046f = _0x5c686c['key']['participant'] || _0x5c686c['key']['remoteJid'];
        if (_0xd3046f?.['includes']('@lid') && _0x247880['store']?.['contacts']) {
            const _0x25a564 = _0x247880['store']['contacts'];
            const _0xcc8691 = Object['keys'](_0x25a564)['find'](_0x2bf919 => _0x25a564[_0x2bf919]?.['lid'] === _0xd3046f || _0x25a564[_0x2bf919]?.['lid']?.['split'](':')[0x0] === _0xd3046f['split']('@')[0x0]);
            if (_0xcc8691?.['includes']('@s.whatsapp.net'))
                _0x3ffb36 = _0xcc8691;
        }
        if (_0x5c686c['message']?.['stickerMessage']) {
            const _0x58dfec = _0x5c686c['message']['stickerMessage']['fileSha256'];
            if (_0x58dfec) {
                const _0x3c7e21 = Buffer['from'](_0x58dfec)['toString']('base64');
                const _0x548840 = await getStickerCommands();
                if (_0x548840[_0x3c7e21]) {
                    const _0x5e068d = _0x548840[_0x3c7e21]['text'];
                    const [_0xa7099, ..._0x25583a] = _0x5e068d['split']('\x20');
                    let _0x2a539c = null;
                    let _0x40abec = '';
                    for (const _0x82c484 of _0x0_0x20fac9['prefixes']) {
                        const _0x104397 = (_0x82c484 + _0xa7099)['toLowerCase']();
                        _0x2a539c = _0x0_0x2a7b90['getCommand'](_0x104397, _0x0_0x20fac9['prefixes']);
                        if (_0x2a539c) {
                            _0x40abec = _0x82c484;
                            break;
                        }
                    }
                    if (_0x2a539c) {
                        const _0x374b13 = await isSudo(_0x3ffb36);
                        const _0x558b7f = await _0x0_0x49f6ef(_0x3ffb36, _0x247880, _0x276448);
                        const _0x40745f = _0x5c686c['key']['fromMe'] || _0x558b7f;
                        const _0x5e1d69 = await _0x0_0x53c996['getBotMode']();
                        const _0x33ff3f = ((() => {
                            if (_0x40745f)
                                return !![];
                            switch (_0x5e1d69) {
                            case 'public':
                                return !![];
                            case 'private':
                            case 'self':
                                return ![];
                            case 'groups':
                                return _0x22f156;
                            case 'inbox':
                                return !_0x22f156;
                            default:
                                return !![];
                            }
                        })());
                        if (!_0x33ff3f)
                            return;
                        const _0x41d216 = await isBanned(_0x3ffb36);
                        if (_0x41d216)
                            return;
                        if (_0x2a539c['strictOwnerOnly']) {
                            const {isOwnerOnly: _0x3f173e} = await import('./isOwner.js');
                            if (!_0x5c686c['key']['fromMe'] && !_0x3f173e(_0x3ffb36)) {
                                return await _0x247880['sendMessage'](_0x276448, {
                                    'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20bot\x20owner!*',
                                    ...channelInfo
                                }, { 'quoted': _0x5c686c });
                            }
                        }
                        if (_0x2a539c['ownerOnly'] && !_0x5c686c['key']['fromMe'] && !_0x558b7f) {
                            return await _0x247880['sendMessage'](_0x276448, {
                                'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20owner\x20or\x20sudo\x20users!*',
                                ...channelInfo
                            }, { 'quoted': _0x5c686c });
                        }
                        if (_0x2a539c['groupOnly'] && !_0x22f156) {
                            return await _0x247880['sendMessage'](_0x276448, {
                                'text': 'ℹ️\x20*This\x20command\x20can\x20only\x20be\x20used\x20in\x20groups!*',
                                ...channelInfo
                            }, { 'quoted': _0x5c686c });
                        }
                        let _0x2c8ef9 = ![];
                        let _0x17946a = ![];
                        if (_0x2a539c['adminOnly'] && _0x22f156) {
                            const _0x1196cd = await _0x0_0x29cd7f(_0x247880, _0x276448, _0x3ffb36);
                            _0x2c8ef9 = _0x1196cd['isSenderAdmin'];
                            _0x17946a = _0x1196cd['isBotAdmin'];
                            if (!_0x17946a) {
                                return await _0x247880['sendMessage'](_0x276448, {
                                    'text': 'ℹ️\x20*Please\x20make\x20the\x20bot\x20an\x20admin\x20to\x20use\x20this\x20command.*',
                                    ...channelInfo
                                }, { 'quoted': _0x5c686c });
                            }
                            if (!_0x2c8ef9 && !_0x5c686c['key']['fromMe'] && !_0x558b7f) {
                                return await _0x247880['sendMessage'](_0x276448, {
                                    'text': 'ℹ️\x20*Sorry,\x20only\x20group\x20admins\x20can\x20use\x20this\x20command.*',
                                    ...channelInfo
                                }, { 'quoted': _0x5c686c });
                            }
                        }
                        const _0x3c3893 = {
                            'key': _0x5c686c['key'],
                            'message': {
                                'extendedTextMessage': {
                                    'text': _0x40abec + _0x5e068d,
                                    'contextInfo': _0x5c686c['message']['stickerMessage']['contextInfo'] || {}
                                }
                            },
                            'messageTimestamp': _0x5c686c['messageTimestamp'],
                            'pushName': _0x5c686c['pushName'],
                            'broadcast': _0x5c686c['broadcast']
                        };
                        const _0x1c5bb5 = {
                            'chatId': _0x276448,
                            'senderId': _0x3ffb36,
                            'isGroup': _0x22f156,
                            'isSenderAdmin': _0x2c8ef9,
                            'isBotAdmin': _0x17946a,
                            'senderIsOwnerOrSudo': _0x558b7f,
                            'isOwnerOrSudoCheck': _0x40745f,
                            'channelInfo': channelInfo,
                            'rawText': _0x40abec + _0x5e068d,
                            'userMessage': (_0x40abec + _0x5e068d)['toLowerCase'](),
                            'messageText': _0x40abec + _0x5e068d,
                            'config': _0x0_0x20fac9
                        };
                        try {
                            await _0x2a539c['handler'](_0x247880, _0x3c3893, _0x25583a, _0x1c5bb5);
                            await addCommandReaction(_0x247880, _0x5c686c);
                            await showTypingAfterCommand(_0x247880, _0x276448);
                            printLog('success', '✅\x20Sticker\x20command\x20executed:\x20' + _0x5e068d);
                        } catch (_0x2f48b1) {
                            printLog('error', '❌\x20Sticker\x20command\x20error\x20[' + _0x5e068d + ']:\x20' + _0x2f48b1['message']);
                            console['error'](_0x2f48b1['stack']);
                            await _0x247880['sendMessage'](_0x276448, {
                                'text': '❌\x20Error\x20executing\x20sticker\x20command:\x20' + _0x2f48b1['message'],
                                ...channelInfo
                            }, { 'quoted': _0x5c686c });
                        }
                    } else {
                        printLog('warning', '⚠️\x20Sticker\x20command\x20not\x20found:\x20' + _0x5e068d);
                    }
                    return;
                }
            }
        }
        const _0x3d29a4 = _0x5c686c['message']?.['conversation'] || _0x5c686c['message']?.['extendedTextMessage']?.['text'] || _0x5c686c['message']?.['imageMessage']?.['caption'] || _0x5c686c['message']?.['videoMessage']?.['caption'] || _0x5c686c['message']?.['buttonsResponseMessage']?.['selectedButtonId'] || '';
        const _0x11e5ec = _0x3d29a4['trim']();
        const _0x98efc6 = _0x11e5ec['toLowerCase']();
        const _0x13b46c = await isSudo(_0x3ffb36);
        startSchedulerEngine(_0x247880);
        if (!_0x5c686c['key']['fromMe']) {
            const _0xcdc665 = await handleAutoReply(_0x247880, _0x276448, _0x5c686c, _0x98efc6);
            if (_0xcdc665)
                return;
        }
        if (_0x5c686c['message']?.['buttonsResponseMessage']) {
            const _0x349db2 = _0x5c686c['message']['buttonsResponseMessage']['selectedButtonId'];
            printLog('info', 'Button\x20response:\x20' + _0x349db2);
            if (_0x349db2 === 'channel') {
                await _0x247880['sendMessage'](_0x276448, { 'text': '*Join\x20our\x20Channel:*\x0a[https://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y](https://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y)' }, { 'quoted': _0x5c686c });
                return;
            } else if (_0x349db2 === 'owner') {
                const _0x153a02 = (await import('../plugins/owner.js'))['default'];
                await _0x153a02['handler']?.(_0x247880, _0x276448, '', {});
                return;
            } else if (_0x349db2 === 'support') {
                await _0x247880['sendMessage'](_0x276448, { 'text': '*Support*\x0a\x0ahttps://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y' }, { 'quoted': _0x5c686c });
                return;
            }
        }
        const _0x417f4d = await isBanned(_0x3ffb36);
        if (_0x417f4d && !_0x98efc6['startsWith']('.unban')) {
            if (Math['random']() < 0.1) {
                printLog('warning', 'Banned\x20user\x20attempted\x20command:\x20' + _0x3ffb36['split']('@')[0x0]);
                await _0x247880['sendMessage'](_0x276448, {
                    'text': 'You\x20are\x20banned\x20from\x20using\x20the\x20bot.\x20Contact\x20an\x20admin\x20to\x20get\x20unbanned.',
                    ...channelInfo
                });
            }
            return;
        }
        if (/^[1-9]$/['test'](_0x98efc6) || _0x98efc6 === 'surrender') {
            await handleTicTacToeMove(_0x247880, _0x276448, _0x3ffb36, _0x98efc6);
            return;
        }
        if (!_0x5c686c['key']['fromMe']) {
            await _0x0_0x53c996['incrementMessageCount'](_0x276448, _0x3ffb36, _0x5c686c['pushName']);
        } else {
            const _0x1cab6e = _0x247880['user']?.['id'] || _0x3ffb36;
            const _0x1c8122 = _0x247880['user']?.['name'] || _0x247880['user']?.['notify'] || 'Me';
            await _0x0_0x53c996['incrementMessageCount'](_0x276448, _0x1cab6e, _0x1c8122);
        }
        if (_0x22f156) {
            if (_0x98efc6) {
                await handleBadwordDetection(_0x247880, _0x276448, _0x5c686c, _0x98efc6, _0x3ffb36);
            }
            await handleLinkDetection(_0x247880, _0x276448, _0x5c686c, _0x98efc6, _0x3ffb36);
        }
        if (_0x22f156 && !_0x5c686c['key']['fromMe']) {
            const _0x42840d = await handleAntiSpam(_0x247880, _0x276448, _0x5c686c, _0x3ffb36, _0x2323e4);
            if (_0x42840d)
                return;
        }
        if (!_0x22f156 && !_0x5c686c['key']['fromMe'] && !_0x13b46c) {
            try {
                const _0x20ed92 = (await import('../plugins/pmblocker.js'))['default'];
                const _0x30a286 = _0x20ed92?.['readState'];
                const _0x224b5b = await _0x30a286();
                if (_0x224b5b['enabled']) {
                    printLog('warning', 'PM\x20blocked\x20from:\x20' + _0x3ffb36['split']('@')[0x0]);
                    await _0x247880['sendMessage'](_0x276448, { 'text': _0x224b5b['message'] || 'Private\x20messages\x20are\x20blocked.\x20Please\x20contact\x20the\x20owner\x20in\x20groups\x20only.' });
                    await new Promise(_0x5f3ec1 => setTimeout(_0x5f3ec1, 0x5dc));
                    try {
                        await _0x247880['updateBlockStatus'](_0x276448, 'block');
                        printLog('success', 'Blocked\x20user:\x20' + _0x3ffb36['split']('@')[0x0]);
                    } catch (_0x2839e2) {
                        printLog('error', 'Failed\x20to\x20block\x20user:\x20' + _0x2839e2['message']);
                    }
                    return;
                }
            } catch (_0x1d1f21) {
                printLog('error', 'PM\x20blocker\x20error:\x20' + _0x1d1f21['message']);
            }
        }
        const _0x22ee37 = _0x0_0x20fac9['prefixes']?.['find'](_0x3d49f4 => _0x98efc6['startsWith'](_0x3d49f4));
        const _0x382d19 = _0x0_0x2a7b90['getCommand'](_0x98efc6, _0x0_0x20fac9['prefixes']);
        if (!_0x22ee37 && !_0x382d19) {
            await handleAutotypingForMessage(_0x247880, _0x276448, _0x98efc6);
            const _0x6361e5 = await _0x0_0x53c996['getBotMode']();
            const _0xb72518 = _0x6361e5 === 'public' || _0x6361e5 === 'groups' && _0x22f156 || _0x6361e5 === 'inbox' && !_0x22f156 || _0x5cf5e0;
            if (_0xb72518) {
                if (_0x22f156 && _0x98efc6['length'] < 0x3) {
                    const _0x3373d6 = 'nova';
                    if (!_0x98efc6['includes'](_0x3373d6) && !_0x98efc6['includes']('@')) {
                        return;
                    }
                }
                await handleChatbotResponse(_0x247880, _0x276448, _0x5c686c, _0x98efc6, _0x3ffb36);
            }
            return;
        }
        if (!_0x382d19) {
            const _0x3bfcdb = 'nova';
            const _0x376653 = _0x98efc6['includes'](_0x3bfcdb) || _0x98efc6['includes']('@nova');
            if (_0x376653) {
                const _0x112840 = await _0x0_0x53c996['getBotMode']();
                const _0x2d3df7 = _0x112840 === 'public' || _0x112840 === 'groups' && _0x22f156 || _0x112840 === 'inbox' && !_0x22f156 || _0x5cf5e0;
                if (_0x2d3df7) {
                    await handleChatbotResponse(_0x247880, _0x276448, _0x5c686c, _0x98efc6, _0x3ffb36);
                    return;
                }
            }
            return;
        }
        const _0xc0cf9a = ((() => {
            if (_0x5cf5e0)
                return !![];
            switch (_0xfae824) {
            case 'public':
                return !![];
            case 'private':
            case 'self':
                return ![];
            case 'groups':
                return _0x22f156;
            case 'inbox':
                return !_0x22f156;
            default:
                return !![];
            }
        })());
        if (!_0xc0cf9a) {
            return;
        }
        let _0x51cbe5;
        if (_0x22ee37) {
            const _0x4f1671 = _0x11e5ec['slice'](_0x22ee37['length'])['trim']();
            _0x51cbe5 = _0x4f1671['split'](/\s+/)['slice'](0x1);
        } else {
            _0x51cbe5 = _0x11e5ec['trim']()['split'](/\s+/)['slice'](0x1);
        }
        if (_0x382d19['strictOwnerOnly']) {
            const {isOwnerOnly: _0x5ec88f} = await import('./isOwner.js');
            if (!_0x5c686c['key']['fromMe'] && !_0x5ec88f(_0x3ffb36)) {
                return await _0x247880['sendMessage'](_0x276448, {
                    'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20bot\x20owner!*\x0a\x0a_Sudo\x20users\x20cannot\x20manage\x20other\x20sudo\x20users._',
                    ...channelInfo
                }, { 'quoted': _0x5c686c });
            }
        }
        if (_0x382d19['ownerOnly'] && !_0x5c686c['key']['fromMe'] && !_0x2323e4) {
            return await _0x247880['sendMessage'](_0x276448, {
                'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20owner\x20or\x20sudo\x20users!*',
                ...channelInfo
            }, { 'quoted': _0x5c686c });
        }
        if (_0x382d19['groupOnly'] && !_0x22f156) {
            return await _0x247880['sendMessage'](_0x276448, {
                'text': 'ℹ️\x20*This\x20command\x20can\x20only\x20be\x20used\x20in\x20groups!*',
                ...channelInfo
            }, { 'quoted': _0x5c686c });
        }
        let _0x31867b = ![];
        let _0x536933 = ![];
        if (_0x382d19['adminOnly'] && _0x22f156) {
            const _0x26b416 = await _0x0_0x29cd7f(_0x247880, _0x276448, _0x3ffb36);
            _0x31867b = _0x26b416['isSenderAdmin'];
            _0x536933 = _0x26b416['isBotAdmin'];
            if (!_0x536933) {
                return await _0x247880['sendMessage'](_0x276448, {
                    'text': 'ℹ️\x20*Please\x20make\x20the\x20bot\x20an\x20admin\x20to\x20use\x20this\x20command.*',
                    ...channelInfo
                }, { 'quoted': _0x5c686c });
            }
            if (!_0x31867b && !_0x5c686c['key']['fromMe'] && !_0x2323e4) {
                return await _0x247880['sendMessage'](_0x276448, {
                    'text': 'ℹ️\x20*Sorry,\x20only\x20group\x20admins\x20can\x20use\x20this\x20command.*',
                    ...channelInfo
                }, { 'quoted': _0x5c686c });
            }
        }
        const _0x1b25ef = {
            'chatId': _0x276448,
            'senderId': _0x3ffb36,
            'isGroup': _0x22f156,
            'isSenderAdmin': _0x31867b,
            'isBotAdmin': _0x536933,
            'senderIsOwnerOrSudo': _0x2323e4,
            'isOwnerOrSudoCheck': _0x5cf5e0,
            'channelInfo': channelInfo,
            'rawText': _0x3d29a4,
            'userMessage': _0x98efc6,
            'messageText': _0x11e5ec,
            'config': _0x0_0x20fac9
        };
        try {
            await _0x382d19['handler'](_0x247880, _0x5c686c, _0x51cbe5, _0x1b25ef);
            await addCommandReaction(_0x247880, _0x5c686c);
            await showTypingAfterCommand(_0x247880, _0x276448);
        } catch (_0x109541) {
            printLog('error', 'Command\x20error\x20[' + _0x382d19['command'] + ']:\x20' + _0x109541['message']);
            console['error'](_0x109541['stack']);
            await _0x247880['sendMessage'](_0x276448, {
                'text': '❌\x20Error\x20executing\x20command:\x20' + _0x109541['message'],
                ...channelInfo
            }, { 'quoted': _0x5c686c });
            const _0xbf6711 = {
                'command': _0x382d19['command'],
                'error': _0x109541['message'],
                'stack': _0x109541['stack'],
                'timestamp': new Date()['toISOString'](),
                'user': _0x3ffb36,
                'chat': _0x276448
            };
            try {
                writeErrorLog(_0xbf6711);
            } catch (_0x259238) {
                printLog('error', 'Failed\x20to\x20write\x20error\x20log:\x20' + _0x259238['message']);
            }
        }
    } catch (_0xe1b04e) {
        printLog('error', 'Message\x20handler\x20error:\x20' + _0xe1b04e['message']);
        console['error'](_0xe1b04e['stack']);
        const _0x17fdb6 = _0xaced9e['messages']?.[0x0]?.['key']?.['remoteJid'];
        if (_0x17fdb6) {
            try {
                await _0x247880['sendMessage'](_0x17fdb6, {
                    'text': 'ℹ️\x20*Failed\x20to\x20process\x20message!*',
                    ...channelInfo
                });
            } catch (_0x179fdc) {
                printLog('error', 'Failed\x20to\x20send\x20error\x20message:\x20' + _0x179fdc['message']);
            }
        }
    }
}
async function handleGroupParticipantUpdate(_0x2d1bee, _0x4252e5) {
    try {
        const {
            id: _0x2d9610,
            participants: _0x1ac971,
            action: _0x41d5dc,
            author: _0x4ab36a
        } = _0x4252e5;
        if (!_0x2d9610['endsWith']('@g.us'))
            return;
        const _0x2cdd62 = await _0x0_0x53c996['getBotMode']();
        const _0x377ba1 = _0x4ab36a ? await _0x0_0x49f6ef(_0x4ab36a, _0x2d1bee, _0x2d9610) : ![];
        const _0x23d1a1 = _0x4ab36a ? _0x4ab36a === _0x2d1bee['user']['id'] || _0x4ab36a === _0x2d1bee['user']['id']['split'](':')[0x0] + '@s.whatsapp.net' : ![];
        const _0x3110f3 = _0x23d1a1 || _0x377ba1;
        if ((_0x2cdd62 === 'private' || _0x2cdd62 === 'self') && !_0x3110f3) {
            return;
        }
        invalidateGroupCache(_0x2d9610);
        if (!_0x2d9610['endsWith']('@g.us'))
            return;
        printLog('info', 'Group\x20update:\x20' + _0x41d5dc + '\x20in\x20' + _0x2d9610['split']('@')[0x0]);
        const _0x1ec567 = _0x2cdd62 === 'public' || _0x2cdd62 === 'groups' || _0x3110f3;
        switch (_0x41d5dc) {
        case 'promote':
            if (!_0x1ec567)
                return;
            const _0x42ea5c = (await import('../plugins/promote.js'))['default']?.['handlePromotionEvent'];
            await _0x42ea5c(_0x2d1bee, _0x2d9610, _0x1ac971, _0x4ab36a);
            break;
        case 'demote':
            if (!_0x1ec567)
                return;
            const _0x15a3a5 = (await import('../plugins/demote.js'))['default']?.['handleDemotionEvent'];
            await _0x15a3a5(_0x2d1bee, _0x2d9610, _0x1ac971, _0x4ab36a);
            break;
        case 'add':
            const {handleJoinEvent: _0x4733ac} = await import('../plugins/welcome.js');
            await _0x4733ac(_0x2d1bee, _0x2d9610, _0x1ac971);
            break;
        case 'remove':
            const _0x3c8b16 = (await import('../plugins/goodbye.js'))['default']?.['handleLeaveEvent'];
            await _0x3c8b16(_0x2d1bee, _0x2d9610, _0x1ac971);
            break;
        default:
            printLog('warning', 'Unhandled\x20group\x20action:\x20' + _0x41d5dc);
        }
    } catch (_0x1a9578) {
        printLog('error', 'Group\x20update\x20error:\x20' + _0x1a9578['message']);
        console['error'](_0x1a9578['stack']);
    }
}
async function handleStatus(_0x2eb4e0, _0x25f722) {
    try {
        const {default: _0xd44bb6} = await import('../plugins/autostatus.js');
        const _0x4f5b6c = _0xd44bb6['handleStatusUpdate'];
        await _0x4f5b6c(_0x2eb4e0, _0x25f722);
    } catch (_0xb8953f) {
        printLog('error', 'Status\x20handler\x20error:\x20' + _0xb8953f['message']);
        console['error'](_0xb8953f['stack']);
    }
}
async function handleCall(_0x14fd68, _0x4ce381) {
    try {
        const _0x1d3b86 = (await import('../plugins/anticall.js'))['default'];
        const _0x1a2500 = _0x1d3b86['readState'] ? await _0x1d3b86['readState']() : { 'enabled': ![] };
        if (!_0x1a2500['enabled'])
            return;
        const _0x30db42 = new Set();
        for (const _0x16bf22 of _0x4ce381) {
            const _0x3714fb = _0x16bf22['from'] || _0x16bf22['peerJid'] || _0x16bf22['chatId'];
            if (!_0x3714fb)
                continue;
            try {
                try {
                    if (typeof _0x14fd68['rejectCall'] === 'function' && _0x16bf22['id']) {
                        await _0x14fd68['rejectCall'](_0x16bf22['id'], _0x3714fb);
                    } else if (typeof _0x14fd68['sendCallOfferAck'] === 'function' && _0x16bf22['id']) {
                        await _0x14fd68['sendCallOfferAck'](_0x16bf22['id'], _0x3714fb, 'reject');
                    }
                } catch (_0xe0ba14) {
                    printLog('error', 'Error\x20rejecting\x20call:\x20' + _0xe0ba14['message']);
                }
                if (!_0x30db42['has'](_0x3714fb)) {
                    _0x30db42['add'](_0x3714fb);
                    setTimeout(() => _0x30db42['delete'](_0x3714fb), 0xea60);
                    await _0x14fd68['sendMessage'](_0x3714fb, { 'text': '📵\x20Anticall\x20is\x20enabled.\x20Your\x20call\x20was\x20rejected\x20and\x20you\x20will\x20be\x20blocked.' });
                    printLog('info', 'Sent\x20anticall\x20warning\x20to:\x20' + _0x3714fb['split']('@')[0x0]);
                }
                setTimeout(async () => {
                    try {
                        await _0x14fd68['updateBlockStatus'](_0x3714fb, 'block');
                        printLog('success', 'Blocked\x20caller:\x20' + _0x3714fb['split']('@')[0x0]);
                    } catch (_0x255f12) {
                        printLog('error', 'Error\x20blocking\x20caller:\x20' + _0x255f12['message']);
                    }
                }, 0x320);
            } catch (_0x446261) {
                printLog('error', 'Error\x20handling\x20call\x20from\x20' + _0x3714fb['split']('@')[0x0] + ':\x20' + _0x446261['message']);
            }
        }
    } catch (_0x320013) {
        printLog('error', 'Call\x20handler\x20error:\x20' + _0x320013['message']);
        console['error'](_0x320013['stack']);
    }
}
export {
    handleMessages,
    handleGroupParticipantUpdate,
    handleStatus,
    handleCall
};