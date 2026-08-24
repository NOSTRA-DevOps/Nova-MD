import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x212d4c from 'fs';
import { dataFile } from './paths.js';
import { handleChatbotResponse } from './Chatbots.js';
import _0x0_0x2ab65e from '../config.js';
import _0x0_0x5b46aa from './lightweight_store.js';
import _0x0_0x326427 from './commandHandler.js';
import {
    printMessage,
    printLog
} from './print.js';
import { isBanned } from './isBanned.js';
import { isSudo } from './index.js';
import _0x0_0x54c754 from './isOwner.js';
import _0x0_0x4539ac from './isAdmin.js';
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
        const _0x31fabc = await _0x0_0x5b46aa['getSetting']('global', 'stickerCommands');
        return _0x31fabc || {};
    } else {
        try {
            if (!_0x0_0x212d4c['existsSync'](STICKER_FILE)) {
                return {};
            }
            return JSON['parse'](_0x0_0x212d4c['readFileSync'](STICKER_FILE, 'utf8'));
        } catch {
            return {};
        }
    }
}
async function handleMessages(_0x2e4cf4, _0x2fa96c) {
    try {
        const {
            messages: _0x35bc17,
            type: _0x2cd795
        } = _0x2fa96c;
        if (_0x2cd795 !== 'notify')
            return;
        const _0x3e9a88 = _0x35bc17[0x0];
        if (!_0x3e9a88?.['message'])
            return;
        const _0x526c9a = _0x3e9a88['key']['remoteJid'];
        const _0xfce25e = _0x526c9a['endsWith']('@g.us');
        const _0xd79642 = _0x3e9a88['key']['participant'] || _0x3e9a88['key']['remoteJid'];
        const _0x518b45 = await _0x0_0x54c754(_0xd79642, _0x2e4cf4, _0x526c9a);
        const _0x27e8a3 = _0x3e9a88['key']['fromMe'] || _0x518b45;
        const _0x33a0dd = await _0x0_0x5b46aa['getBotMode']();
        if ((_0x33a0dd === 'private' || _0x33a0dd === 'self') && !_0x27e8a3) {
            return;
        }
        await printMessage(_0x3e9a88, _0x2e4cf4);
        try {
            const _0x47b547 = await _0x0_0x5b46aa['getSetting']('global', 'stealthMode');
            if (!_0x47b547 || !_0x47b547['enabled']) {
                await handleAutoread(_0x2e4cf4, _0x3e9a88);
            } else {
                printLog('info', '👻\x20Stealth\x20mode\x20active');
            }
        } catch (_0x677a2b) {
            await handleAutoread(_0x2e4cf4, _0x3e9a88);
        }
        if (_0x3e9a88['message']?.['protocolMessage']?.['type'] === 0x0) {
            printLog('info', 'Message\x20deletion\x20detected');
            await handleMessageRevocation(_0x2e4cf4, _0x3e9a88);
            return;
        }
        await storeMessage(_0x2e4cf4, _0x3e9a88);
        if (_0x3e9a88['pushName'] && _0x2e4cf4['store']?.['contacts']) {
            const _0x10da80 = _0x3e9a88['key']['participant'] || _0x3e9a88['key']['remoteJid'];
            if (_0x10da80) {
                _0x2e4cf4['store']['contacts'][_0x10da80] = {
                    ..._0x2e4cf4['store']['contacts'][_0x10da80],
                    'id': _0x10da80,
                    'notify': _0x3e9a88['pushName'],
                    'name': _0x3e9a88['pushName']
                };
                const _0x1d5f3b = _0x2e4cf4['decodeJid']?.(_0x10da80);
                if (_0x1d5f3b && _0x1d5f3b !== _0x10da80) {
                    _0x2e4cf4['store']['contacts'][_0x1d5f3b] = {
                        ..._0x2e4cf4['store']['contacts'][_0x1d5f3b],
                        'id': _0x1d5f3b,
                        'notify': _0x3e9a88['pushName'],
                        'name': _0x3e9a88['pushName']
                    };
                }
            }
        }
        const _0x569ec8 = _0x3e9a88['key']['participant'] || _0x3e9a88['key']['remoteJid'];
        if (_0x569ec8?.['includes']('@lid') && _0x2e4cf4['store']?.['contacts']) {
            const _0x4e8f6a = _0x2e4cf4['store']['contacts'];
            const _0x547631 = Object['keys'](_0x4e8f6a)['find'](_0x55c400 => _0x4e8f6a[_0x55c400]?.['lid'] === _0x569ec8 || _0x4e8f6a[_0x55c400]?.['lid']?.['split'](':')[0x0] === _0x569ec8['split']('@')[0x0]);
            if (_0x547631?.['includes']('@s.whatsapp.net'))
                _0xd79642 = _0x547631;
        }
        if (_0x3e9a88['message']?.['stickerMessage']) {
            const _0x2adea5 = _0x3e9a88['message']['stickerMessage']['fileSha256'];
            if (_0x2adea5) {
                const _0x1665f8 = Buffer['from'](_0x2adea5)['toString']('base64');
                const _0x5e6b56 = await getStickerCommands();
                if (_0x5e6b56[_0x1665f8]) {
                    const _0x43c84e = _0x5e6b56[_0x1665f8]['text'];
                    const [_0x49b044, ..._0x4b9b49] = _0x43c84e['split']('\x20');
                    let _0xaf8126 = null;
                    let _0x24eb9e = '';
                    for (const _0x87d4bc of _0x0_0x2ab65e['prefixes']) {
                        const _0x3de175 = (_0x87d4bc + _0x49b044)['toLowerCase']();
                        _0xaf8126 = _0x0_0x326427['getCommand'](_0x3de175, _0x0_0x2ab65e['prefixes']);
                        if (_0xaf8126) {
                            _0x24eb9e = _0x87d4bc;
                            break;
                        }
                    }
                    if (_0xaf8126) {
                        const _0x4eadbc = await isSudo(_0xd79642);
                        const _0x37c1d1 = await _0x0_0x54c754(_0xd79642, _0x2e4cf4, _0x526c9a);
                        const _0x58bb13 = _0x3e9a88['key']['fromMe'] || _0x37c1d1;
                        const _0x216655 = await _0x0_0x5b46aa['getBotMode']();
                        const _0x280316 = ((() => {
                            if (_0x58bb13)
                                return !![];
                            switch (_0x216655) {
                            case 'public':
                                return !![];
                            case 'private':
                            case 'self':
                                return ![];
                            case 'groups':
                                return _0xfce25e;
                            case 'inbox':
                                return !_0xfce25e;
                            default:
                                return !![];
                            }
                        })());
                        if (!_0x280316)
                            return;
                        const _0x426f58 = await isBanned(_0xd79642);
                        if (_0x426f58)
                            return;
                        if (_0xaf8126['strictOwnerOnly']) {
                            const {isOwnerOnly: _0x2d3afa} = await import('./isOwner.js');
                            if (!_0x3e9a88['key']['fromMe'] && !_0x2d3afa(_0xd79642)) {
                                return await _0x2e4cf4['sendMessage'](_0x526c9a, {
                                    'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20bot\x20owner!*',
                                    ...channelInfo
                                }, { 'quoted': _0x3e9a88 });
                            }
                        }
                        if (_0xaf8126['ownerOnly'] && !_0x3e9a88['key']['fromMe'] && !_0x37c1d1) {
                            return await _0x2e4cf4['sendMessage'](_0x526c9a, {
                                'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20owner\x20or\x20sudo\x20users!*',
                                ...channelInfo
                            }, { 'quoted': _0x3e9a88 });
                        }
                        if (_0xaf8126['groupOnly'] && !_0xfce25e) {
                            return await _0x2e4cf4['sendMessage'](_0x526c9a, {
                                'text': 'ℹ️\x20*This\x20command\x20can\x20only\x20be\x20used\x20in\x20groups!*',
                                ...channelInfo
                            }, { 'quoted': _0x3e9a88 });
                        }
                        let _0x42690f = ![];
                        let _0x26b1f5 = ![];
                        if (_0xaf8126['adminOnly'] && _0xfce25e) {
                            const _0x19b785 = await _0x0_0x4539ac(_0x2e4cf4, _0x526c9a, _0xd79642);
                            _0x42690f = _0x19b785['isSenderAdmin'];
                            _0x26b1f5 = _0x19b785['isBotAdmin'];
                            if (!_0x26b1f5) {
                                return await _0x2e4cf4['sendMessage'](_0x526c9a, {
                                    'text': 'ℹ️\x20*Please\x20make\x20the\x20bot\x20an\x20admin\x20to\x20use\x20this\x20command.*',
                                    ...channelInfo
                                }, { 'quoted': _0x3e9a88 });
                            }
                            if (!_0x42690f && !_0x3e9a88['key']['fromMe'] && !_0x37c1d1) {
                                return await _0x2e4cf4['sendMessage'](_0x526c9a, {
                                    'text': 'ℹ️\x20*Sorry,\x20only\x20group\x20admins\x20can\x20use\x20this\x20command.*',
                                    ...channelInfo
                                }, { 'quoted': _0x3e9a88 });
                            }
                        }
                        const _0x352856 = {
                            'key': _0x3e9a88['key'],
                            'message': {
                                'extendedTextMessage': {
                                    'text': _0x24eb9e + _0x43c84e,
                                    'contextInfo': _0x3e9a88['message']['stickerMessage']['contextInfo'] || {}
                                }
                            },
                            'messageTimestamp': _0x3e9a88['messageTimestamp'],
                            'pushName': _0x3e9a88['pushName'],
                            'broadcast': _0x3e9a88['broadcast']
                        };
                        const _0x1465aa = {
                            'chatId': _0x526c9a,
                            'senderId': _0xd79642,
                            'isGroup': _0xfce25e,
                            'isSenderAdmin': _0x42690f,
                            'isBotAdmin': _0x26b1f5,
                            'senderIsOwnerOrSudo': _0x37c1d1,
                            'isOwnerOrSudoCheck': _0x58bb13,
                            'channelInfo': channelInfo,
                            'rawText': _0x24eb9e + _0x43c84e,
                            'userMessage': (_0x24eb9e + _0x43c84e)['toLowerCase'](),
                            'messageText': _0x24eb9e + _0x43c84e,
                            'config': _0x0_0x2ab65e
                        };
                        try {
                            await _0xaf8126['handler'](_0x2e4cf4, _0x352856, _0x4b9b49, _0x1465aa);
                            await addCommandReaction(_0x2e4cf4, _0x3e9a88);
                            await showTypingAfterCommand(_0x2e4cf4, _0x526c9a);
                            printLog('success', '✅\x20Sticker\x20command\x20executed:\x20' + _0x43c84e);
                        } catch (_0x260865) {
                            printLog('error', '❌\x20Sticker\x20command\x20error\x20[' + _0x43c84e + ']:\x20' + _0x260865['message']);
                            console['error'](_0x260865['stack']);
                            await _0x2e4cf4['sendMessage'](_0x526c9a, {
                                'text': '❌\x20Error\x20executing\x20sticker\x20command:\x20' + _0x260865['message'],
                                ...channelInfo
                            }, { 'quoted': _0x3e9a88 });
                        }
                    } else {
                        printLog('warning', '⚠️\x20Sticker\x20command\x20not\x20found:\x20' + _0x43c84e);
                    }
                    return;
                }
            }
        }
        const _0x20116e = _0x3e9a88['message']?.['conversation'] || _0x3e9a88['message']?.['extendedTextMessage']?.['text'] || _0x3e9a88['message']?.['imageMessage']?.['caption'] || _0x3e9a88['message']?.['videoMessage']?.['caption'] || _0x3e9a88['message']?.['buttonsResponseMessage']?.['selectedButtonId'] || '';
        const _0x50d694 = _0x20116e['trim']();
        const _0x120701 = _0x50d694['toLowerCase']();
        const _0x7378bd = await isSudo(_0xd79642);
        startSchedulerEngine(_0x2e4cf4);
        if (!_0x3e9a88['key']['fromMe']) {
            const _0xaa9369 = await handleAutoReply(_0x2e4cf4, _0x526c9a, _0x3e9a88, _0x120701);
            if (_0xaa9369)
                return;
        }
        if (_0x3e9a88['message']?.['buttonsResponseMessage']) {
            const _0x4b6436 = _0x3e9a88['message']['buttonsResponseMessage']['selectedButtonId'];
            printLog('info', 'Button\x20response:\x20' + _0x4b6436);
            if (_0x4b6436 === 'channel') {
                await _0x2e4cf4['sendMessage'](_0x526c9a, { 'text': '*Join\x20our\x20Channel:*\x0a[https://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y](https://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y)' }, { 'quoted': _0x3e9a88 });
                return;
            } else if (_0x4b6436 === 'owner') {
                const _0x31600d = (await import('../plugins/owner.js'))['default'];
                await _0x31600d['handler']?.(_0x2e4cf4, _0x526c9a, '', {});
                return;
            } else if (_0x4b6436 === 'support') {
                await _0x2e4cf4['sendMessage'](_0x526c9a, { 'text': '*Support*\x0a\x0ahttps://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y' }, { 'quoted': _0x3e9a88 });
                return;
            }
        }
        const _0x2ede15 = await isBanned(_0xd79642);
        if (_0x2ede15 && !_0x120701['startsWith']('.unban')) {
            if (Math['random']() < 0.1) {
                printLog('warning', 'Banned\x20user\x20attempted\x20command:\x20' + _0xd79642['split']('@')[0x0]);
                await _0x2e4cf4['sendMessage'](_0x526c9a, {
                    'text': 'You\x20are\x20banned\x20from\x20using\x20the\x20bot.\x20Contact\x20an\x20admin\x20to\x20get\x20unbanned.',
                    ...channelInfo
                });
            }
            return;
        }
        if (/^[1-9]$/['test'](_0x120701) || _0x120701 === 'surrender') {
            await handleTicTacToeMove(_0x2e4cf4, _0x526c9a, _0xd79642, _0x120701);
            return;
        }
        if (!_0x3e9a88['key']['fromMe']) {
            await _0x0_0x5b46aa['incrementMessageCount'](_0x526c9a, _0xd79642, _0x3e9a88['pushName']);
        } else {
            const _0x588184 = _0x2e4cf4['user']?.['id'] || _0xd79642;
            const _0x2dee87 = _0x2e4cf4['user']?.['name'] || _0x2e4cf4['user']?.['notify'] || 'Me';
            await _0x0_0x5b46aa['incrementMessageCount'](_0x526c9a, _0x588184, _0x2dee87);
        }
        if (_0xfce25e) {
            if (_0x120701) {
                await handleBadwordDetection(_0x2e4cf4, _0x526c9a, _0x3e9a88, _0x120701, _0xd79642);
            }
            await handleLinkDetection(_0x2e4cf4, _0x526c9a, _0x3e9a88, _0x120701, _0xd79642);
        }
        if (_0xfce25e && !_0x3e9a88['key']['fromMe']) {
            const _0x454411 = await handleAntiSpam(_0x2e4cf4, _0x526c9a, _0x3e9a88, _0xd79642, _0x518b45);
            if (_0x454411)
                return;
        }
        if (!_0xfce25e && !_0x3e9a88['key']['fromMe'] && !_0x7378bd) {
            try {
                const _0x18eaf2 = (await import('../plugins/pmblocker.js'))['default'];
                const _0x36ab83 = _0x18eaf2?.['readState'];
                const _0x2d7176 = await _0x36ab83();
                if (_0x2d7176['enabled']) {
                    printLog('warning', 'PM\x20blocked\x20from:\x20' + _0xd79642['split']('@')[0x0]);
                    await _0x2e4cf4['sendMessage'](_0x526c9a, { 'text': _0x2d7176['message'] || 'Private\x20messages\x20are\x20blocked.\x20Please\x20contact\x20the\x20owner\x20in\x20groups\x20only.' });
                    await new Promise(_0x2cef54 => setTimeout(_0x2cef54, 0x5dc));
                    try {
                        await _0x2e4cf4['updateBlockStatus'](_0x526c9a, 'block');
                        printLog('success', 'Blocked\x20user:\x20' + _0xd79642['split']('@')[0x0]);
                    } catch (_0x214dcf) {
                        printLog('error', 'Failed\x20to\x20block\x20user:\x20' + _0x214dcf['message']);
                    }
                    return;
                }
            } catch (_0x5501a3) {
                printLog('error', 'PM\x20blocker\x20error:\x20' + _0x5501a3['message']);
            }
        }
        const _0x322b79 = _0x0_0x2ab65e['prefixes']?.['find'](_0x390151 => _0x120701['startsWith'](_0x390151));
        const _0xfb6ea1 = _0x0_0x326427['getCommand'](_0x120701, _0x0_0x2ab65e['prefixes']);
        if (!_0x322b79 && !_0xfb6ea1) {
            await handleAutotypingForMessage(_0x2e4cf4, _0x526c9a, _0x120701);
            const _0x2dda24 = await _0x0_0x5b46aa['getBotMode']();
            const _0x2dc413 = _0x2dda24 === 'public' || _0x2dda24 === 'groups' && _0xfce25e || _0x2dda24 === 'inbox' && !_0xfce25e || _0x27e8a3;
            if (_0x2dc413) {
                if (_0xfce25e && _0x120701['length'] < 0x3) {
                    const _0x47428e = 'nova';
                    if (!_0x120701['includes'](_0x47428e) && !_0x120701['includes']('@')) {
                        return;
                    }
                }
                await handleChatbotResponse(_0x2e4cf4, _0x526c9a, _0x3e9a88, _0x120701, _0xd79642);
            }
            return;
        }
        if (!_0xfb6ea1) {
            const _0x5b6721 = 'nova';
            const _0x46c0f2 = _0x120701['includes'](_0x5b6721) || _0x120701['includes']('@nova');
            if (_0x46c0f2) {
                const _0x4482bd = await _0x0_0x5b46aa['getBotMode']();
                const _0x9d247d = _0x4482bd === 'public' || _0x4482bd === 'groups' && _0xfce25e || _0x4482bd === 'inbox' && !_0xfce25e || _0x27e8a3;
                if (_0x9d247d) {
                    await handleChatbotResponse(_0x2e4cf4, _0x526c9a, _0x3e9a88, _0x120701, _0xd79642);
                    return;
                }
            }
            return;
        }
        const _0x3320f9 = ((() => {
            if (_0x27e8a3)
                return !![];
            switch (_0x33a0dd) {
            case 'public':
                return !![];
            case 'private':
            case 'self':
                return ![];
            case 'groups':
                return _0xfce25e;
            case 'inbox':
                return !_0xfce25e;
            default:
                return !![];
            }
        })());
        if (!_0x3320f9) {
            return;
        }
        let _0x23af75;
        if (_0x322b79) {
            const _0x28bf1d = _0x50d694['slice'](_0x322b79['length'])['trim']();
            _0x23af75 = _0x28bf1d['split'](/\s+/)['slice'](0x1);
        } else {
            _0x23af75 = _0x50d694['trim']()['split'](/\s+/)['slice'](0x1);
        }
        if (_0xfb6ea1['strictOwnerOnly']) {
            const {isOwnerOnly: _0x22d4f5} = await import('./isOwner.js');
            if (!_0x3e9a88['key']['fromMe'] && !_0x22d4f5(_0xd79642)) {
                return await _0x2e4cf4['sendMessage'](_0x526c9a, {
                    'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20bot\x20owner!*\x0a\x0a_Sudo\x20users\x20cannot\x20manage\x20other\x20sudo\x20users._',
                    ...channelInfo
                }, { 'quoted': _0x3e9a88 });
            }
        }
        if (_0xfb6ea1['ownerOnly'] && !_0x3e9a88['key']['fromMe'] && !_0x518b45) {
            return await _0x2e4cf4['sendMessage'](_0x526c9a, {
                'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20owner\x20or\x20sudo\x20users!*',
                ...channelInfo
            }, { 'quoted': _0x3e9a88 });
        }
        if (_0xfb6ea1['groupOnly'] && !_0xfce25e) {
            return await _0x2e4cf4['sendMessage'](_0x526c9a, {
                'text': 'ℹ️\x20*This\x20command\x20can\x20only\x20be\x20used\x20in\x20groups!*',
                ...channelInfo
            }, { 'quoted': _0x3e9a88 });
        }
        let _0x13afeb = ![];
        let _0x3a954a = ![];
        if (_0xfb6ea1['adminOnly'] && _0xfce25e) {
            const _0x26b2e4 = await _0x0_0x4539ac(_0x2e4cf4, _0x526c9a, _0xd79642);
            _0x13afeb = _0x26b2e4['isSenderAdmin'];
            _0x3a954a = _0x26b2e4['isBotAdmin'];
            if (!_0x3a954a) {
                return await _0x2e4cf4['sendMessage'](_0x526c9a, {
                    'text': 'ℹ️\x20*Please\x20make\x20the\x20bot\x20an\x20admin\x20to\x20use\x20this\x20command.*',
                    ...channelInfo
                }, { 'quoted': _0x3e9a88 });
            }
            if (!_0x13afeb && !_0x3e9a88['key']['fromMe'] && !_0x518b45) {
                return await _0x2e4cf4['sendMessage'](_0x526c9a, {
                    'text': 'ℹ️\x20*Sorry,\x20only\x20group\x20admins\x20can\x20use\x20this\x20command.*',
                    ...channelInfo
                }, { 'quoted': _0x3e9a88 });
            }
        }
        const _0x2c2994 = {
            'chatId': _0x526c9a,
            'senderId': _0xd79642,
            'isGroup': _0xfce25e,
            'isSenderAdmin': _0x13afeb,
            'isBotAdmin': _0x3a954a,
            'senderIsOwnerOrSudo': _0x518b45,
            'isOwnerOrSudoCheck': _0x27e8a3,
            'channelInfo': channelInfo,
            'rawText': _0x20116e,
            'userMessage': _0x120701,
            'messageText': _0x50d694,
            'config': _0x0_0x2ab65e
        };
        try {
            await _0xfb6ea1['handler'](_0x2e4cf4, _0x3e9a88, _0x23af75, _0x2c2994);
            await addCommandReaction(_0x2e4cf4, _0x3e9a88);
            await showTypingAfterCommand(_0x2e4cf4, _0x526c9a);
        } catch (_0xb9fcd4) {
            printLog('error', 'Command\x20error\x20[' + _0xfb6ea1['command'] + ']:\x20' + _0xb9fcd4['message']);
            console['error'](_0xb9fcd4['stack']);
            await _0x2e4cf4['sendMessage'](_0x526c9a, {
                'text': '❌\x20Error\x20executing\x20command:\x20' + _0xb9fcd4['message'],
                ...channelInfo
            }, { 'quoted': _0x3e9a88 });
            const _0x1c3b7f = {
                'command': _0xfb6ea1['command'],
                'error': _0xb9fcd4['message'],
                'stack': _0xb9fcd4['stack'],
                'timestamp': new Date()['toISOString'](),
                'user': _0xd79642,
                'chat': _0x526c9a
            };
            try {
                writeErrorLog(_0x1c3b7f);
            } catch (_0x4b7a4d) {
                printLog('error', 'Failed\x20to\x20write\x20error\x20log:\x20' + _0x4b7a4d['message']);
            }
        }
    } catch (_0x4198b3) {
        printLog('error', 'Message\x20handler\x20error:\x20' + _0x4198b3['message']);
        console['error'](_0x4198b3['stack']);
        const _0x1a8374 = _0x2fa96c['messages']?.[0x0]?.['key']?.['remoteJid'];
        if (_0x1a8374) {
            try {
                await _0x2e4cf4['sendMessage'](_0x1a8374, {
                    'text': 'ℹ️\x20*Failed\x20to\x20process\x20message!*',
                    ...channelInfo
                });
            } catch (_0x1840b6) {
                printLog('error', 'Failed\x20to\x20send\x20error\x20message:\x20' + _0x1840b6['message']);
            }
        }
    }
}
async function handleGroupParticipantUpdate(_0x550138, _0x2ae397) {
    try {
        const {
            id: _0x8db737,
            participants: _0x4237e3,
            action: _0x234c3d,
            author: _0x11b04c
        } = _0x2ae397;
        if (!_0x8db737['endsWith']('@g.us'))
            return;
        const _0x10aa9f = await _0x0_0x5b46aa['getBotMode']();
        const _0x1dba57 = _0x11b04c ? await _0x0_0x54c754(_0x11b04c, _0x550138, _0x8db737) : ![];
        const _0xafab48 = _0x11b04c ? _0x11b04c === _0x550138['user']['id'] || _0x11b04c === _0x550138['user']['id']['split'](':')[0x0] + '@s.whatsapp.net' : ![];
        const _0x467758 = _0xafab48 || _0x1dba57;
        if ((_0x10aa9f === 'private' || _0x10aa9f === 'self') && !_0x467758) {
            return;
        }
        invalidateGroupCache(_0x8db737);
        if (!_0x8db737['endsWith']('@g.us'))
            return;
        printLog('info', 'Group\x20update:\x20' + _0x234c3d + '\x20in\x20' + _0x8db737['split']('@')[0x0]);
        const _0x72dd88 = _0x10aa9f === 'public' || _0x10aa9f === 'groups' || _0x467758;
        switch (_0x234c3d) {
        case 'promote':
            if (!_0x72dd88)
                return;
            const _0x34ac60 = (await import('../plugins/promote.js'))['default']?.['handlePromotionEvent'];
            await _0x34ac60(_0x550138, _0x8db737, _0x4237e3, _0x11b04c);
            break;
        case 'demote':
            if (!_0x72dd88)
                return;
            const _0x5128e2 = (await import('../plugins/demote.js'))['default']?.['handleDemotionEvent'];
            await _0x5128e2(_0x550138, _0x8db737, _0x4237e3, _0x11b04c);
            break;
        case 'add':
            const {handleJoinEvent: _0x433b9e} = await import('../plugins/welcome.js');
            await _0x433b9e(_0x550138, _0x8db737, _0x4237e3);
            break;
        case 'remove':
            const _0x1c5ebf = (await import('../plugins/goodbye.js'))['default']?.['handleLeaveEvent'];
            await _0x1c5ebf(_0x550138, _0x8db737, _0x4237e3);
            break;
        default:
            printLog('warning', 'Unhandled\x20group\x20action:\x20' + _0x234c3d);
        }
    } catch (_0x38e6d9) {
        printLog('error', 'Group\x20update\x20error:\x20' + _0x38e6d9['message']);
        console['error'](_0x38e6d9['stack']);
    }
}
async function handleStatus(_0x1ea761, _0x4047b6) {
    try {
        const {default: _0x2b5daa} = await import('../plugins/autostatus.js');
        const _0x449126 = _0x2b5daa['handleStatusUpdate'];
        await _0x449126(_0x1ea761, _0x4047b6);
    } catch (_0x38363a) {
        printLog('error', 'Status\x20handler\x20error:\x20' + _0x38363a['message']);
        console['error'](_0x38363a['stack']);
    }
}
async function handleCall(_0x2a7ee8, _0x287124) {
    try {
        const _0x3c7a31 = (await import('../plugins/anticall.js'))['default'];
        const _0x41cd9b = _0x3c7a31['readState'] ? await _0x3c7a31['readState']() : { 'enabled': ![] };
        if (!_0x41cd9b['enabled'])
            return;
        const _0x2dc8dd = new Set();
        for (const _0x5e3e93 of _0x287124) {
            const _0x13d0bf = _0x5e3e93['from'] || _0x5e3e93['peerJid'] || _0x5e3e93['chatId'];
            if (!_0x13d0bf)
                continue;
            try {
                try {
                    if (typeof _0x2a7ee8['rejectCall'] === 'function' && _0x5e3e93['id']) {
                        await _0x2a7ee8['rejectCall'](_0x5e3e93['id'], _0x13d0bf);
                    } else if (typeof _0x2a7ee8['sendCallOfferAck'] === 'function' && _0x5e3e93['id']) {
                        await _0x2a7ee8['sendCallOfferAck'](_0x5e3e93['id'], _0x13d0bf, 'reject');
                    }
                } catch (_0x2196b0) {
                    printLog('error', 'Error\x20rejecting\x20call:\x20' + _0x2196b0['message']);
                }
                if (!_0x2dc8dd['has'](_0x13d0bf)) {
                    _0x2dc8dd['add'](_0x13d0bf);
                    setTimeout(() => _0x2dc8dd['delete'](_0x13d0bf), 0xea60);
                    await _0x2a7ee8['sendMessage'](_0x13d0bf, { 'text': '📵\x20Anticall\x20is\x20enabled.\x20Your\x20call\x20was\x20rejected\x20and\x20you\x20will\x20be\x20blocked.' });
                    printLog('info', 'Sent\x20anticall\x20warning\x20to:\x20' + _0x13d0bf['split']('@')[0x0]);
                }
                setTimeout(async () => {
                    try {
                        await _0x2a7ee8['updateBlockStatus'](_0x13d0bf, 'block');
                        printLog('success', 'Blocked\x20caller:\x20' + _0x13d0bf['split']('@')[0x0]);
                    } catch (_0x3d4df1) {
                        printLog('error', 'Error\x20blocking\x20caller:\x20' + _0x3d4df1['message']);
                    }
                }, 0x320);
            } catch (_0xb29130) {
                printLog('error', 'Error\x20handling\x20call\x20from\x20' + _0x13d0bf['split']('@')[0x0] + ':\x20' + _0xb29130['message']);
            }
        }
    } catch (_0x20efca) {
        printLog('error', 'Call\x20handler\x20error:\x20' + _0x20efca['message']);
        console['error'](_0x20efca['stack']);
    }
}
export {
    handleMessages,
    handleGroupParticipantUpdate,
    handleStatus,
    handleCall
};