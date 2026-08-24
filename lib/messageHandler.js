import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x22973b from 'fs';
import { dataFile } from './paths.js';
import { handleChatbotResponse } from './Chatbots.js';
import _0x0_0x323d32 from '../config.js';
import _0x0_0xc2d6c6 from './lightweight_store.js';
import _0x0_0xaf9e5b from './commandHandler.js';
import {
    printMessage,
    printLog
} from './print.js';
import { isBanned } from './isBanned.js';
import { isSudo } from './index.js';
import _0x0_0x114f8b from './isOwner.js';
import _0x0_0x3717c1 from './isAdmin.js';
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
        const _0x4d9a33 = await _0x0_0xc2d6c6['getSetting']('global', 'stickerCommands');
        return _0x4d9a33 || {};
    } else {
        try {
            if (!_0x0_0x22973b['existsSync'](STICKER_FILE)) {
                return {};
            }
            return JSON['parse'](_0x0_0x22973b['readFileSync'](STICKER_FILE, 'utf8'));
        } catch {
            return {};
        }
    }
}
async function handleMessages(_0x56b0da, _0x19b36c) {
    try {
        const {
            messages: _0x349052,
            type: _0x3e08f9
        } = _0x19b36c;
        if (_0x3e08f9 !== 'notify')
            return;
        const _0x213493 = _0x349052[0x0];
        if (!_0x213493?.['message'])
            return;
        const _0xaf2c = _0x213493['key']['remoteJid'];
        const _0x340607 = _0xaf2c['endsWith']('@g.us');
        const _0x2c569c = _0x213493['key']['participant'] || _0x213493['key']['remoteJid'];
        const _0x2c8bc9 = await _0x0_0x114f8b(_0x2c569c, _0x56b0da, _0xaf2c);
        const _0x5e3444 = _0x213493['key']['fromMe'] || _0x2c8bc9;
        const _0x3e420e = await _0x0_0xc2d6c6['getBotMode']();
        if ((_0x3e420e === 'private' || _0x3e420e === 'self') && !_0x5e3444) {
            return;
        }
        await printMessage(_0x213493, _0x56b0da);
        try {
            const _0x29e93c = await _0x0_0xc2d6c6['getSetting']('global', 'stealthMode');
            if (!_0x29e93c || !_0x29e93c['enabled']) {
                await handleAutoread(_0x56b0da, _0x213493);
            } else {
                printLog('info', '👻\x20Stealth\x20mode\x20active');
            }
        } catch (_0x412de6) {
            await handleAutoread(_0x56b0da, _0x213493);
        }
        if (_0x213493['message']?.['protocolMessage']?.['type'] === 0x0) {
            printLog('info', 'Message\x20deletion\x20detected');
            await handleMessageRevocation(_0x56b0da, _0x213493);
            return;
        }
        await storeMessage(_0x56b0da, _0x213493);
        if (_0x213493['pushName'] && _0x56b0da['store']?.['contacts']) {
            const _0x14088d = _0x213493['key']['participant'] || _0x213493['key']['remoteJid'];
            if (_0x14088d) {
                _0x56b0da['store']['contacts'][_0x14088d] = {
                    ..._0x56b0da['store']['contacts'][_0x14088d],
                    'id': _0x14088d,
                    'notify': _0x213493['pushName'],
                    'name': _0x213493['pushName']
                };
                const _0x3face8 = _0x56b0da['decodeJid']?.(_0x14088d);
                if (_0x3face8 && _0x3face8 !== _0x14088d) {
                    _0x56b0da['store']['contacts'][_0x3face8] = {
                        ..._0x56b0da['store']['contacts'][_0x3face8],
                        'id': _0x3face8,
                        'notify': _0x213493['pushName'],
                        'name': _0x213493['pushName']
                    };
                }
            }
        }
        const _0xae606e = _0x213493['key']['participant'] || _0x213493['key']['remoteJid'];
        if (_0xae606e?.['includes']('@lid') && _0x56b0da['store']?.['contacts']) {
            const _0x3c8a43 = _0x56b0da['store']['contacts'];
            const _0x570698 = Object['keys'](_0x3c8a43)['find'](_0x4ce3cf => _0x3c8a43[_0x4ce3cf]?.['lid'] === _0xae606e || _0x3c8a43[_0x4ce3cf]?.['lid']?.['split'](':')[0x0] === _0xae606e['split']('@')[0x0]);
            if (_0x570698?.['includes']('@s.whatsapp.net'))
                _0x2c569c = _0x570698;
        }
        if (_0x213493['message']?.['stickerMessage']) {
            const _0x22ba65 = _0x213493['message']['stickerMessage']['fileSha256'];
            if (_0x22ba65) {
                const _0x21292c = Buffer['from'](_0x22ba65)['toString']('base64');
                const _0x41cd61 = await getStickerCommands();
                if (_0x41cd61[_0x21292c]) {
                    const _0x46ae82 = _0x41cd61[_0x21292c]['text'];
                    const [_0xf066d, ..._0xe3e6c0] = _0x46ae82['split']('\x20');
                    let _0x5e8dcc = null;
                    let _0x21e8b6 = '';
                    for (const _0x1aad5b of _0x0_0x323d32['prefixes']) {
                        const _0x253912 = (_0x1aad5b + _0xf066d)['toLowerCase']();
                        _0x5e8dcc = _0x0_0xaf9e5b['getCommand'](_0x253912, _0x0_0x323d32['prefixes']);
                        if (_0x5e8dcc) {
                            _0x21e8b6 = _0x1aad5b;
                            break;
                        }
                    }
                    if (_0x5e8dcc) {
                        const _0x466a84 = await isSudo(_0x2c569c);
                        const _0x300742 = await _0x0_0x114f8b(_0x2c569c, _0x56b0da, _0xaf2c);
                        const _0x456bb6 = _0x213493['key']['fromMe'] || _0x300742;
                        const _0x254ffc = await _0x0_0xc2d6c6['getBotMode']();
                        const _0x23170c = ((() => {
                            if (_0x456bb6)
                                return !![];
                            switch (_0x254ffc) {
                            case 'public':
                                return !![];
                            case 'private':
                            case 'self':
                                return ![];
                            case 'groups':
                                return _0x340607;
                            case 'inbox':
                                return !_0x340607;
                            default:
                                return !![];
                            }
                        })());
                        if (!_0x23170c)
                            return;
                        const _0x3ae07e = await isBanned(_0x2c569c);
                        if (_0x3ae07e)
                            return;
                        if (_0x5e8dcc['strictOwnerOnly']) {
                            const {isOwnerOnly: _0x3407a2} = await import('./isOwner.js');
                            if (!_0x213493['key']['fromMe'] && !_0x3407a2(_0x2c569c)) {
                                return await _0x56b0da['sendMessage'](_0xaf2c, {
                                    'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20bot\x20owner!*',
                                    ...channelInfo
                                }, { 'quoted': _0x213493 });
                            }
                        }
                        if (_0x5e8dcc['ownerOnly'] && !_0x213493['key']['fromMe'] && !_0x300742) {
                            return await _0x56b0da['sendMessage'](_0xaf2c, {
                                'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20owner\x20or\x20sudo\x20users!*',
                                ...channelInfo
                            }, { 'quoted': _0x213493 });
                        }
                        if (_0x5e8dcc['groupOnly'] && !_0x340607) {
                            return await _0x56b0da['sendMessage'](_0xaf2c, {
                                'text': 'ℹ️\x20*This\x20command\x20can\x20only\x20be\x20used\x20in\x20groups!*',
                                ...channelInfo
                            }, { 'quoted': _0x213493 });
                        }
                        let _0x4de467 = ![];
                        let _0x2102a3 = ![];
                        if (_0x5e8dcc['adminOnly'] && _0x340607) {
                            const _0x149c51 = await _0x0_0x3717c1(_0x56b0da, _0xaf2c, _0x2c569c);
                            _0x4de467 = _0x149c51['isSenderAdmin'];
                            _0x2102a3 = _0x149c51['isBotAdmin'];
                            if (!_0x2102a3) {
                                return await _0x56b0da['sendMessage'](_0xaf2c, {
                                    'text': 'ℹ️\x20*Please\x20make\x20the\x20bot\x20an\x20admin\x20to\x20use\x20this\x20command.*',
                                    ...channelInfo
                                }, { 'quoted': _0x213493 });
                            }
                            if (!_0x4de467 && !_0x213493['key']['fromMe'] && !_0x300742) {
                                return await _0x56b0da['sendMessage'](_0xaf2c, {
                                    'text': 'ℹ️\x20*Sorry,\x20only\x20group\x20admins\x20can\x20use\x20this\x20command.*',
                                    ...channelInfo
                                }, { 'quoted': _0x213493 });
                            }
                        }
                        const _0x196828 = {
                            'key': _0x213493['key'],
                            'message': {
                                'extendedTextMessage': {
                                    'text': _0x21e8b6 + _0x46ae82,
                                    'contextInfo': _0x213493['message']['stickerMessage']['contextInfo'] || {}
                                }
                            },
                            'messageTimestamp': _0x213493['messageTimestamp'],
                            'pushName': _0x213493['pushName'],
                            'broadcast': _0x213493['broadcast']
                        };
                        const _0x100389 = {
                            'chatId': _0xaf2c,
                            'senderId': _0x2c569c,
                            'isGroup': _0x340607,
                            'isSenderAdmin': _0x4de467,
                            'isBotAdmin': _0x2102a3,
                            'senderIsOwnerOrSudo': _0x300742,
                            'isOwnerOrSudoCheck': _0x456bb6,
                            'channelInfo': channelInfo,
                            'rawText': _0x21e8b6 + _0x46ae82,
                            'userMessage': (_0x21e8b6 + _0x46ae82)['toLowerCase'](),
                            'messageText': _0x21e8b6 + _0x46ae82,
                            'config': _0x0_0x323d32
                        };
                        try {
                            await _0x5e8dcc['handler'](_0x56b0da, _0x196828, _0xe3e6c0, _0x100389);
                            await addCommandReaction(_0x56b0da, _0x213493);
                            await showTypingAfterCommand(_0x56b0da, _0xaf2c);
                            printLog('success', '✅\x20Sticker\x20command\x20executed:\x20' + _0x46ae82);
                        } catch (_0x215457) {
                            printLog('error', '❌\x20Sticker\x20command\x20error\x20[' + _0x46ae82 + ']:\x20' + _0x215457['message']);
                            console['error'](_0x215457['stack']);
                            await _0x56b0da['sendMessage'](_0xaf2c, {
                                'text': '❌\x20Error\x20executing\x20sticker\x20command:\x20' + _0x215457['message'],
                                ...channelInfo
                            }, { 'quoted': _0x213493 });
                        }
                    } else {
                        printLog('warning', '⚠️\x20Sticker\x20command\x20not\x20found:\x20' + _0x46ae82);
                    }
                    return;
                }
            }
        }
        const _0x2256e4 = _0x213493['message']?.['conversation'] || _0x213493['message']?.['extendedTextMessage']?.['text'] || _0x213493['message']?.['imageMessage']?.['caption'] || _0x213493['message']?.['videoMessage']?.['caption'] || _0x213493['message']?.['buttonsResponseMessage']?.['selectedButtonId'] || '';
        const _0x2fa569 = _0x2256e4['trim']();
        const _0xfda189 = _0x2fa569['toLowerCase']();
        const _0x3e6a5a = await isSudo(_0x2c569c);
        startSchedulerEngine(_0x56b0da);
        if (!_0x213493['key']['fromMe']) {
            const _0xa736b5 = await handleAutoReply(_0x56b0da, _0xaf2c, _0x213493, _0xfda189);
            if (_0xa736b5)
                return;
        }
        if (_0x213493['message']?.['buttonsResponseMessage']) {
            const _0x2b4947 = _0x213493['message']['buttonsResponseMessage']['selectedButtonId'];
            printLog('info', 'Button\x20response:\x20' + _0x2b4947);
            if (_0x2b4947 === 'channel') {
                await _0x56b0da['sendMessage'](_0xaf2c, { 'text': '*Join\x20our\x20Channel:*\x0a[https://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y](https://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y)' }, { 'quoted': _0x213493 });
                return;
            } else if (_0x2b4947 === 'owner') {
                const _0x25fb9e = (await import('../plugins/owner.js'))['default'];
                await _0x25fb9e['handler']?.(_0x56b0da, _0xaf2c, '', {});
                return;
            } else if (_0x2b4947 === 'support') {
                await _0x56b0da['sendMessage'](_0xaf2c, { 'text': '*Support*\x0a\x0ahttps://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y' }, { 'quoted': _0x213493 });
                return;
            }
        }
        const _0x5cfd39 = await isBanned(_0x2c569c);
        if (_0x5cfd39 && !_0xfda189['startsWith']('.unban')) {
            if (Math['random']() < 0.1) {
                printLog('warning', 'Banned\x20user\x20attempted\x20command:\x20' + _0x2c569c['split']('@')[0x0]);
                await _0x56b0da['sendMessage'](_0xaf2c, {
                    'text': 'You\x20are\x20banned\x20from\x20using\x20the\x20bot.\x20Contact\x20an\x20admin\x20to\x20get\x20unbanned.',
                    ...channelInfo
                });
            }
            return;
        }
        if (/^[1-9]$/['test'](_0xfda189) || _0xfda189 === 'surrender') {
            await handleTicTacToeMove(_0x56b0da, _0xaf2c, _0x2c569c, _0xfda189);
            return;
        }
        if (!_0x213493['key']['fromMe']) {
            await _0x0_0xc2d6c6['incrementMessageCount'](_0xaf2c, _0x2c569c, _0x213493['pushName']);
        } else {
            const _0x160547 = _0x56b0da['user']?.['id'] || _0x2c569c;
            const _0x5001c4 = _0x56b0da['user']?.['name'] || _0x56b0da['user']?.['notify'] || 'Me';
            await _0x0_0xc2d6c6['incrementMessageCount'](_0xaf2c, _0x160547, _0x5001c4);
        }
        if (_0x340607) {
            if (_0xfda189) {
                await handleBadwordDetection(_0x56b0da, _0xaf2c, _0x213493, _0xfda189, _0x2c569c);
            }
            await handleLinkDetection(_0x56b0da, _0xaf2c, _0x213493, _0xfda189, _0x2c569c);
        }
        if (_0x340607 && !_0x213493['key']['fromMe']) {
            const _0x102f24 = await handleAntiSpam(_0x56b0da, _0xaf2c, _0x213493, _0x2c569c, _0x2c8bc9);
            if (_0x102f24)
                return;
        }
        if (!_0x340607 && !_0x213493['key']['fromMe'] && !_0x3e6a5a) {
            try {
                const _0x278538 = (await import('../plugins/pmblocker.js'))['default'];
                const _0x43a6d4 = _0x278538?.['readState'];
                const _0x4dcb1c = await _0x43a6d4();
                if (_0x4dcb1c['enabled']) {
                    printLog('warning', 'PM\x20blocked\x20from:\x20' + _0x2c569c['split']('@')[0x0]);
                    await _0x56b0da['sendMessage'](_0xaf2c, { 'text': _0x4dcb1c['message'] || 'Private\x20messages\x20are\x20blocked.\x20Please\x20contact\x20the\x20owner\x20in\x20groups\x20only.' });
                    await new Promise(_0x2ae8e9 => setTimeout(_0x2ae8e9, 0x5dc));
                    try {
                        await _0x56b0da['updateBlockStatus'](_0xaf2c, 'block');
                        printLog('success', 'Blocked\x20user:\x20' + _0x2c569c['split']('@')[0x0]);
                    } catch (_0xa7a5ee) {
                        printLog('error', 'Failed\x20to\x20block\x20user:\x20' + _0xa7a5ee['message']);
                    }
                    return;
                }
            } catch (_0x102ca7) {
                printLog('error', 'PM\x20blocker\x20error:\x20' + _0x102ca7['message']);
            }
        }
        const _0x39e264 = _0x0_0x323d32['prefixes']?.['find'](_0x4a5649 => _0xfda189['startsWith'](_0x4a5649));
        const _0x47e48d = _0x0_0xaf9e5b['getCommand'](_0xfda189, _0x0_0x323d32['prefixes']);
        if (!_0x39e264 && !_0x47e48d) {
            await handleAutotypingForMessage(_0x56b0da, _0xaf2c, _0xfda189);
            const _0x2d5b56 = await _0x0_0xc2d6c6['getBotMode']();
            const _0x1d5d5e = _0x2d5b56 === 'public' || _0x2d5b56 === 'groups' && _0x340607 || _0x2d5b56 === 'inbox' && !_0x340607 || _0x5e3444;
            if (_0x1d5d5e) {
                if (_0x340607 && _0xfda189['length'] < 0x3) {
                    const _0x3c6fc8 = 'nova';
                    if (!_0xfda189['includes'](_0x3c6fc8) && !_0xfda189['includes']('@')) {
                        return;
                    }
                }
                await handleChatbotResponse(_0x56b0da, _0xaf2c, _0x213493, _0xfda189, _0x2c569c);
            }
            return;
        }
        if (!_0x47e48d) {
            const _0x2ad020 = 'nova';
            const _0x58a62b = _0xfda189['includes'](_0x2ad020) || _0xfda189['includes']('@nova');
            if (_0x58a62b) {
                const _0x3694c3 = await _0x0_0xc2d6c6['getBotMode']();
                const _0x2f7a8a = _0x3694c3 === 'public' || _0x3694c3 === 'groups' && _0x340607 || _0x3694c3 === 'inbox' && !_0x340607 || _0x5e3444;
                if (_0x2f7a8a) {
                    await handleChatbotResponse(_0x56b0da, _0xaf2c, _0x213493, _0xfda189, _0x2c569c);
                    return;
                }
            }
            return;
        }
        const _0x3705f4 = ((() => {
            if (_0x5e3444)
                return !![];
            switch (_0x3e420e) {
            case 'public':
                return !![];
            case 'private':
            case 'self':
                return ![];
            case 'groups':
                return _0x340607;
            case 'inbox':
                return !_0x340607;
            default:
                return !![];
            }
        })());
        if (!_0x3705f4) {
            return;
        }
        let _0x2b5fce;
        if (_0x39e264) {
            const _0x4a9164 = _0x2fa569['slice'](_0x39e264['length'])['trim']();
            _0x2b5fce = _0x4a9164['split'](/\s+/)['slice'](0x1);
        } else {
            _0x2b5fce = _0x2fa569['trim']()['split'](/\s+/)['slice'](0x1);
        }
        if (_0x47e48d['strictOwnerOnly']) {
            const {isOwnerOnly: _0x6a8387} = await import('./isOwner.js');
            if (!_0x213493['key']['fromMe'] && !_0x6a8387(_0x2c569c)) {
                return await _0x56b0da['sendMessage'](_0xaf2c, {
                    'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20bot\x20owner!*\x0a\x0a_Sudo\x20users\x20cannot\x20manage\x20other\x20sudo\x20users._',
                    ...channelInfo
                }, { 'quoted': _0x213493 });
            }
        }
        if (_0x47e48d['ownerOnly'] && !_0x213493['key']['fromMe'] && !_0x2c8bc9) {
            return await _0x56b0da['sendMessage'](_0xaf2c, {
                'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20owner\x20or\x20sudo\x20users!*',
                ...channelInfo
            }, { 'quoted': _0x213493 });
        }
        if (_0x47e48d['groupOnly'] && !_0x340607) {
            return await _0x56b0da['sendMessage'](_0xaf2c, {
                'text': 'ℹ️\x20*This\x20command\x20can\x20only\x20be\x20used\x20in\x20groups!*',
                ...channelInfo
            }, { 'quoted': _0x213493 });
        }
        let _0x464304 = ![];
        let _0x1b5c49 = ![];
        if (_0x47e48d['adminOnly'] && _0x340607) {
            const _0x1230af = await _0x0_0x3717c1(_0x56b0da, _0xaf2c, _0x2c569c);
            _0x464304 = _0x1230af['isSenderAdmin'];
            _0x1b5c49 = _0x1230af['isBotAdmin'];
            if (!_0x1b5c49) {
                return await _0x56b0da['sendMessage'](_0xaf2c, {
                    'text': 'ℹ️\x20*Please\x20make\x20the\x20bot\x20an\x20admin\x20to\x20use\x20this\x20command.*',
                    ...channelInfo
                }, { 'quoted': _0x213493 });
            }
            if (!_0x464304 && !_0x213493['key']['fromMe'] && !_0x2c8bc9) {
                return await _0x56b0da['sendMessage'](_0xaf2c, {
                    'text': 'ℹ️\x20*Sorry,\x20only\x20group\x20admins\x20can\x20use\x20this\x20command.*',
                    ...channelInfo
                }, { 'quoted': _0x213493 });
            }
        }
        const _0x2bd7ad = {
            'chatId': _0xaf2c,
            'senderId': _0x2c569c,
            'isGroup': _0x340607,
            'isSenderAdmin': _0x464304,
            'isBotAdmin': _0x1b5c49,
            'senderIsOwnerOrSudo': _0x2c8bc9,
            'isOwnerOrSudoCheck': _0x5e3444,
            'channelInfo': channelInfo,
            'rawText': _0x2256e4,
            'userMessage': _0xfda189,
            'messageText': _0x2fa569,
            'config': _0x0_0x323d32
        };
        try {
            await _0x47e48d['handler'](_0x56b0da, _0x213493, _0x2b5fce, _0x2bd7ad);
            await addCommandReaction(_0x56b0da, _0x213493);
            await showTypingAfterCommand(_0x56b0da, _0xaf2c);
        } catch (_0x5ae50d) {
            printLog('error', 'Command\x20error\x20[' + _0x47e48d['command'] + ']:\x20' + _0x5ae50d['message']);
            console['error'](_0x5ae50d['stack']);
            await _0x56b0da['sendMessage'](_0xaf2c, {
                'text': '❌\x20Error\x20executing\x20command:\x20' + _0x5ae50d['message'],
                ...channelInfo
            }, { 'quoted': _0x213493 });
            const _0xd6f55 = {
                'command': _0x47e48d['command'],
                'error': _0x5ae50d['message'],
                'stack': _0x5ae50d['stack'],
                'timestamp': new Date()['toISOString'](),
                'user': _0x2c569c,
                'chat': _0xaf2c
            };
            try {
                writeErrorLog(_0xd6f55);
            } catch (_0x1e4f80) {
                printLog('error', 'Failed\x20to\x20write\x20error\x20log:\x20' + _0x1e4f80['message']);
            }
        }
    } catch (_0x162bbe) {
        printLog('error', 'Message\x20handler\x20error:\x20' + _0x162bbe['message']);
        console['error'](_0x162bbe['stack']);
        const _0x159090 = _0x19b36c['messages']?.[0x0]?.['key']?.['remoteJid'];
        if (_0x159090) {
            try {
                await _0x56b0da['sendMessage'](_0x159090, {
                    'text': 'ℹ️\x20*Failed\x20to\x20process\x20message!*',
                    ...channelInfo
                });
            } catch (_0x4b76b1) {
                printLog('error', 'Failed\x20to\x20send\x20error\x20message:\x20' + _0x4b76b1['message']);
            }
        }
    }
}
async function handleGroupParticipantUpdate(_0x192a7b, _0x40fcf7) {
    try {
        const {
            id: _0x280a74,
            participants: _0x4229fe,
            action: _0x41adea,
            author: _0x4cd55d
        } = _0x40fcf7;
        if (!_0x280a74['endsWith']('@g.us'))
            return;
        const _0x398ee4 = await _0x0_0xc2d6c6['getBotMode']();
        const _0x95162e = _0x4cd55d ? await _0x0_0x114f8b(_0x4cd55d, _0x192a7b, _0x280a74) : ![];
        const _0x100940 = _0x4cd55d ? _0x4cd55d === _0x192a7b['user']['id'] || _0x4cd55d === _0x192a7b['user']['id']['split'](':')[0x0] + '@s.whatsapp.net' : ![];
        const _0x44ac89 = _0x100940 || _0x95162e;
        if ((_0x398ee4 === 'private' || _0x398ee4 === 'self') && !_0x44ac89) {
            return;
        }
        invalidateGroupCache(_0x280a74);
        if (!_0x280a74['endsWith']('@g.us'))
            return;
        printLog('info', 'Group\x20update:\x20' + _0x41adea + '\x20in\x20' + _0x280a74['split']('@')[0x0]);
        const _0x508a97 = _0x398ee4 === 'public' || _0x398ee4 === 'groups' || _0x44ac89;
        switch (_0x41adea) {
        case 'promote':
            if (!_0x508a97)
                return;
            const _0x443d9a = (await import('../plugins/promote.js'))['default']?.['handlePromotionEvent'];
            await _0x443d9a(_0x192a7b, _0x280a74, _0x4229fe, _0x4cd55d);
            break;
        case 'demote':
            if (!_0x508a97)
                return;
            const _0x32416e = (await import('../plugins/demote.js'))['default']?.['handleDemotionEvent'];
            await _0x32416e(_0x192a7b, _0x280a74, _0x4229fe, _0x4cd55d);
            break;
        case 'add':
            const {handleJoinEvent: _0x2ddfbc} = await import('../plugins/welcome.js');
            await _0x2ddfbc(_0x192a7b, _0x280a74, _0x4229fe);
            break;
        case 'remove':
            const _0x257952 = (await import('../plugins/goodbye.js'))['default']?.['handleLeaveEvent'];
            await _0x257952(_0x192a7b, _0x280a74, _0x4229fe);
            break;
        default:
            printLog('warning', 'Unhandled\x20group\x20action:\x20' + _0x41adea);
        }
    } catch (_0x373593) {
        printLog('error', 'Group\x20update\x20error:\x20' + _0x373593['message']);
        console['error'](_0x373593['stack']);
    }
}
async function handleStatus(_0x568abe, _0x3b54d4) {
    try {
        const {default: _0x189a7a} = await import('../plugins/autostatus.js');
        const _0x4ab957 = _0x189a7a['handleStatusUpdate'];
        await _0x4ab957(_0x568abe, _0x3b54d4);
    } catch (_0x295fb7) {
        printLog('error', 'Status\x20handler\x20error:\x20' + _0x295fb7['message']);
        console['error'](_0x295fb7['stack']);
    }
}
async function handleCall(_0x2f8f83, _0x2b6fd8) {
    try {
        const _0x1685e4 = (await import('../plugins/anticall.js'))['default'];
        const _0x562876 = _0x1685e4['readState'] ? await _0x1685e4['readState']() : { 'enabled': ![] };
        if (!_0x562876['enabled'])
            return;
        const _0x194205 = new Set();
        for (const _0x506158 of _0x2b6fd8) {
            const _0x353a4b = _0x506158['from'] || _0x506158['peerJid'] || _0x506158['chatId'];
            if (!_0x353a4b)
                continue;
            try {
                try {
                    if (typeof _0x2f8f83['rejectCall'] === 'function' && _0x506158['id']) {
                        await _0x2f8f83['rejectCall'](_0x506158['id'], _0x353a4b);
                    } else if (typeof _0x2f8f83['sendCallOfferAck'] === 'function' && _0x506158['id']) {
                        await _0x2f8f83['sendCallOfferAck'](_0x506158['id'], _0x353a4b, 'reject');
                    }
                } catch (_0x50559d) {
                    printLog('error', 'Error\x20rejecting\x20call:\x20' + _0x50559d['message']);
                }
                if (!_0x194205['has'](_0x353a4b)) {
                    _0x194205['add'](_0x353a4b);
                    setTimeout(() => _0x194205['delete'](_0x353a4b), 0xea60);
                    await _0x2f8f83['sendMessage'](_0x353a4b, { 'text': '📵\x20Anticall\x20is\x20enabled.\x20Your\x20call\x20was\x20rejected\x20and\x20you\x20will\x20be\x20blocked.' });
                    printLog('info', 'Sent\x20anticall\x20warning\x20to:\x20' + _0x353a4b['split']('@')[0x0]);
                }
                setTimeout(async () => {
                    try {
                        await _0x2f8f83['updateBlockStatus'](_0x353a4b, 'block');
                        printLog('success', 'Blocked\x20caller:\x20' + _0x353a4b['split']('@')[0x0]);
                    } catch (_0xc5cf3) {
                        printLog('error', 'Error\x20blocking\x20caller:\x20' + _0xc5cf3['message']);
                    }
                }, 0x320);
            } catch (_0x3ff829) {
                printLog('error', 'Error\x20handling\x20call\x20from\x20' + _0x353a4b['split']('@')[0x0] + ':\x20' + _0x3ff829['message']);
            }
        }
    } catch (_0x29af73) {
        printLog('error', 'Call\x20handler\x20error:\x20' + _0x29af73['message']);
        console['error'](_0x29af73['stack']);
    }
}
export {
    handleMessages,
    handleGroupParticipantUpdate,
    handleStatus,
    handleCall
};