import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0xc98b97 from 'fs';
import { dataFile } from './paths.js';
import { handleChatbotResponse } from './Chatbots.js';
import _0x0_0x1d6fa2 from '../config.js';
import _0x0_0x17342c from './lightweight_store.js';
import _0x0_0x7f6384 from './commandHandler.js';
import {
    printMessage,
    printLog
} from './print.js';
import { isBanned } from './isBanned.js';
import { isSudo } from './index.js';
import _0x0_0x438e45 from './isOwner.js';
import _0x0_0x53c411 from './isAdmin.js';
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
        const _0x30bc81 = await _0x0_0x17342c['getSetting']('global', 'stickerCommands');
        return _0x30bc81 || {};
    } else {
        try {
            if (!_0x0_0xc98b97['existsSync'](STICKER_FILE)) {
                return {};
            }
            return JSON['parse'](_0x0_0xc98b97['readFileSync'](STICKER_FILE, 'utf8'));
        } catch {
            return {};
        }
    }
}
async function handleMessages(_0x4f93db, _0x4a0528) {
    try {
        const {
            messages: _0x584f17,
            type: _0x432c21
        } = _0x4a0528;
        if (_0x432c21 !== 'notify')
            return;
        const _0x15ede4 = _0x584f17[0x0];
        if (!_0x15ede4?.['message'])
            return;
        const _0x523a89 = _0x15ede4['key']['remoteJid'];
        const _0x2aab94 = _0x523a89['endsWith']('@g.us');
        const _0x4515aa = _0x15ede4['key']['participant'] || _0x15ede4['key']['remoteJid'];
        const _0x1155df = await _0x0_0x438e45(_0x4515aa, _0x4f93db, _0x523a89);
        const _0x15f755 = _0x15ede4['key']['fromMe'] || _0x1155df;
        const _0x3dc9ea = await _0x0_0x17342c['getBotMode']();
        if ((_0x3dc9ea === 'private' || _0x3dc9ea === 'self') && !_0x15f755) {
            return;
        }
        await printMessage(_0x15ede4, _0x4f93db);
        try {
            const _0x350a64 = await _0x0_0x17342c['getSetting']('global', 'stealthMode');
            if (!_0x350a64 || !_0x350a64['enabled']) {
                await handleAutoread(_0x4f93db, _0x15ede4);
            } else {
                printLog('info', '👻\x20Stealth\x20mode\x20active');
            }
        } catch (_0x357c02) {
            await handleAutoread(_0x4f93db, _0x15ede4);
        }
        if (_0x15ede4['message']?.['protocolMessage']?.['type'] === 0x0) {
            printLog('info', 'Message\x20deletion\x20detected');
            await handleMessageRevocation(_0x4f93db, _0x15ede4);
            return;
        }
        await storeMessage(_0x4f93db, _0x15ede4);
        if (_0x15ede4['pushName'] && _0x4f93db['store']?.['contacts']) {
            const _0xb723 = _0x15ede4['key']['participant'] || _0x15ede4['key']['remoteJid'];
            if (_0xb723) {
                _0x4f93db['store']['contacts'][_0xb723] = {
                    ..._0x4f93db['store']['contacts'][_0xb723],
                    'id': _0xb723,
                    'notify': _0x15ede4['pushName'],
                    'name': _0x15ede4['pushName']
                };
                const _0x23d612 = _0x4f93db['decodeJid']?.(_0xb723);
                if (_0x23d612 && _0x23d612 !== _0xb723) {
                    _0x4f93db['store']['contacts'][_0x23d612] = {
                        ..._0x4f93db['store']['contacts'][_0x23d612],
                        'id': _0x23d612,
                        'notify': _0x15ede4['pushName'],
                        'name': _0x15ede4['pushName']
                    };
                }
            }
        }
        const _0x66d23b = _0x15ede4['key']['participant'] || _0x15ede4['key']['remoteJid'];
        if (_0x66d23b?.['includes']('@lid') && _0x4f93db['store']?.['contacts']) {
            const _0x25dc0f = _0x4f93db['store']['contacts'];
            const _0x1f4c1a = Object['keys'](_0x25dc0f)['find'](_0x27267f => _0x25dc0f[_0x27267f]?.['lid'] === _0x66d23b || _0x25dc0f[_0x27267f]?.['lid']?.['split'](':')[0x0] === _0x66d23b['split']('@')[0x0]);
            if (_0x1f4c1a?.['includes']('@s.whatsapp.net'))
                _0x4515aa = _0x1f4c1a;
        }
        if (_0x15ede4['message']?.['stickerMessage']) {
            const _0x3d4284 = _0x15ede4['message']['stickerMessage']['fileSha256'];
            if (_0x3d4284) {
                const _0x3d2412 = Buffer['from'](_0x3d4284)['toString']('base64');
                const _0xa9b33a = await getStickerCommands();
                if (_0xa9b33a[_0x3d2412]) {
                    const _0x597e04 = _0xa9b33a[_0x3d2412]['text'];
                    const [_0x37bea2, ..._0x13bd33] = _0x597e04['split']('\x20');
                    let _0x5308dc = null;
                    let _0x31335b = '';
                    for (const _0x523da0 of _0x0_0x1d6fa2['prefixes']) {
                        const _0x187987 = (_0x523da0 + _0x37bea2)['toLowerCase']();
                        _0x5308dc = _0x0_0x7f6384['getCommand'](_0x187987, _0x0_0x1d6fa2['prefixes']);
                        if (_0x5308dc) {
                            _0x31335b = _0x523da0;
                            break;
                        }
                    }
                    if (_0x5308dc) {
                        const _0x1aa32b = await isSudo(_0x4515aa);
                        const _0x1fcffa = await _0x0_0x438e45(_0x4515aa, _0x4f93db, _0x523a89);
                        const _0x31f824 = _0x15ede4['key']['fromMe'] || _0x1fcffa;
                        const _0x38cebc = await _0x0_0x17342c['getBotMode']();
                        const _0x3879bc = ((() => {
                            if (_0x31f824)
                                return !![];
                            switch (_0x38cebc) {
                            case 'public':
                                return !![];
                            case 'private':
                            case 'self':
                                return ![];
                            case 'groups':
                                return _0x2aab94;
                            case 'inbox':
                                return !_0x2aab94;
                            default:
                                return !![];
                            }
                        })());
                        if (!_0x3879bc)
                            return;
                        const _0x5c2a0a = await isBanned(_0x4515aa);
                        if (_0x5c2a0a)
                            return;
                        if (_0x5308dc['strictOwnerOnly']) {
                            const {isOwnerOnly: _0x2032bb} = await import('./isOwner.js');
                            if (!_0x15ede4['key']['fromMe'] && !_0x2032bb(_0x4515aa)) {
                                return await _0x4f93db['sendMessage'](_0x523a89, {
                                    'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20bot\x20owner!*',
                                    ...channelInfo
                                }, { 'quoted': _0x15ede4 });
                            }
                        }
                        if (_0x5308dc['ownerOnly'] && !_0x15ede4['key']['fromMe'] && !_0x1fcffa) {
                            return await _0x4f93db['sendMessage'](_0x523a89, {
                                'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20owner\x20or\x20sudo\x20users!*',
                                ...channelInfo
                            }, { 'quoted': _0x15ede4 });
                        }
                        if (_0x5308dc['groupOnly'] && !_0x2aab94) {
                            return await _0x4f93db['sendMessage'](_0x523a89, {
                                'text': 'ℹ️\x20*This\x20command\x20can\x20only\x20be\x20used\x20in\x20groups!*',
                                ...channelInfo
                            }, { 'quoted': _0x15ede4 });
                        }
                        let _0x17662d = ![];
                        let _0x247618 = ![];
                        if (_0x5308dc['adminOnly'] && _0x2aab94) {
                            const _0x4bfe32 = await _0x0_0x53c411(_0x4f93db, _0x523a89, _0x4515aa);
                            _0x17662d = _0x4bfe32['isSenderAdmin'];
                            _0x247618 = _0x4bfe32['isBotAdmin'];
                            if (!_0x247618) {
                                return await _0x4f93db['sendMessage'](_0x523a89, {
                                    'text': 'ℹ️\x20*Please\x20make\x20the\x20bot\x20an\x20admin\x20to\x20use\x20this\x20command.*',
                                    ...channelInfo
                                }, { 'quoted': _0x15ede4 });
                            }
                            if (!_0x17662d && !_0x15ede4['key']['fromMe'] && !_0x1fcffa) {
                                return await _0x4f93db['sendMessage'](_0x523a89, {
                                    'text': 'ℹ️\x20*Sorry,\x20only\x20group\x20admins\x20can\x20use\x20this\x20command.*',
                                    ...channelInfo
                                }, { 'quoted': _0x15ede4 });
                            }
                        }
                        const _0x1608c8 = {
                            'key': _0x15ede4['key'],
                            'message': {
                                'extendedTextMessage': {
                                    'text': _0x31335b + _0x597e04,
                                    'contextInfo': _0x15ede4['message']['stickerMessage']['contextInfo'] || {}
                                }
                            },
                            'messageTimestamp': _0x15ede4['messageTimestamp'],
                            'pushName': _0x15ede4['pushName'],
                            'broadcast': _0x15ede4['broadcast']
                        };
                        const _0x4d30eb = {
                            'chatId': _0x523a89,
                            'senderId': _0x4515aa,
                            'isGroup': _0x2aab94,
                            'isSenderAdmin': _0x17662d,
                            'isBotAdmin': _0x247618,
                            'senderIsOwnerOrSudo': _0x1fcffa,
                            'isOwnerOrSudoCheck': _0x31f824,
                            'channelInfo': channelInfo,
                            'rawText': _0x31335b + _0x597e04,
                            'userMessage': (_0x31335b + _0x597e04)['toLowerCase'](),
                            'messageText': _0x31335b + _0x597e04,
                            'config': _0x0_0x1d6fa2
                        };
                        try {
                            await _0x5308dc['handler'](_0x4f93db, _0x1608c8, _0x13bd33, _0x4d30eb);
                            await addCommandReaction(_0x4f93db, _0x15ede4);
                            await showTypingAfterCommand(_0x4f93db, _0x523a89);
                            printLog('success', '✅\x20Sticker\x20command\x20executed:\x20' + _0x597e04);
                        } catch (_0x525e2b) {
                            printLog('error', '❌\x20Sticker\x20command\x20error\x20[' + _0x597e04 + ']:\x20' + _0x525e2b['message']);
                            console['error'](_0x525e2b['stack']);
                            await _0x4f93db['sendMessage'](_0x523a89, {
                                'text': '❌\x20Error\x20executing\x20sticker\x20command:\x20' + _0x525e2b['message'],
                                ...channelInfo
                            }, { 'quoted': _0x15ede4 });
                        }
                    } else {
                        printLog('warning', '⚠️\x20Sticker\x20command\x20not\x20found:\x20' + _0x597e04);
                    }
                    return;
                }
            }
        }
        const _0x574b7a = _0x15ede4['message']?.['conversation'] || _0x15ede4['message']?.['extendedTextMessage']?.['text'] || _0x15ede4['message']?.['imageMessage']?.['caption'] || _0x15ede4['message']?.['videoMessage']?.['caption'] || _0x15ede4['message']?.['buttonsResponseMessage']?.['selectedButtonId'] || '';
        const _0x59ed6d = _0x574b7a['trim']();
        const _0x1c9266 = _0x59ed6d['toLowerCase']();
        const _0x13748d = await isSudo(_0x4515aa);
        startSchedulerEngine(_0x4f93db);
        if (!_0x15ede4['key']['fromMe']) {
            const _0x355a0c = await handleAutoReply(_0x4f93db, _0x523a89, _0x15ede4, _0x1c9266);
            if (_0x355a0c)
                return;
        }
        if (_0x15ede4['message']?.['buttonsResponseMessage']) {
            const _0x585e77 = _0x15ede4['message']['buttonsResponseMessage']['selectedButtonId'];
            printLog('info', 'Button\x20response:\x20' + _0x585e77);
            if (_0x585e77 === 'channel') {
                await _0x4f93db['sendMessage'](_0x523a89, { 'text': '*Join\x20our\x20Channel:*\x0a[https://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y](https://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y)' }, { 'quoted': _0x15ede4 });
                return;
            } else if (_0x585e77 === 'owner') {
                const _0x23f3ad = (await import('../plugins/owner.js'))['default'];
                await _0x23f3ad['handler']?.(_0x4f93db, _0x523a89, '', {});
                return;
            } else if (_0x585e77 === 'support') {
                await _0x4f93db['sendMessage'](_0x523a89, { 'text': '*Support*\x0a\x0ahttps://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y' }, { 'quoted': _0x15ede4 });
                return;
            }
        }
        const _0x5949f3 = await isBanned(_0x4515aa);
        if (_0x5949f3 && !_0x1c9266['startsWith']('.unban')) {
            if (Math['random']() < 0.1) {
                printLog('warning', 'Banned\x20user\x20attempted\x20command:\x20' + _0x4515aa['split']('@')[0x0]);
                await _0x4f93db['sendMessage'](_0x523a89, {
                    'text': 'You\x20are\x20banned\x20from\x20using\x20the\x20bot.\x20Contact\x20an\x20admin\x20to\x20get\x20unbanned.',
                    ...channelInfo
                });
            }
            return;
        }
        if (/^[1-9]$/['test'](_0x1c9266) || _0x1c9266 === 'surrender') {
            await handleTicTacToeMove(_0x4f93db, _0x523a89, _0x4515aa, _0x1c9266);
            return;
        }
        if (!_0x15ede4['key']['fromMe']) {
            await _0x0_0x17342c['incrementMessageCount'](_0x523a89, _0x4515aa, _0x15ede4['pushName']);
        } else {
            const _0x1328f7 = _0x4f93db['user']?.['id'] || _0x4515aa;
            const _0x571d45 = _0x4f93db['user']?.['name'] || _0x4f93db['user']?.['notify'] || 'Me';
            await _0x0_0x17342c['incrementMessageCount'](_0x523a89, _0x1328f7, _0x571d45);
        }
        if (_0x2aab94) {
            if (_0x1c9266) {
                await handleBadwordDetection(_0x4f93db, _0x523a89, _0x15ede4, _0x1c9266, _0x4515aa);
            }
            await handleLinkDetection(_0x4f93db, _0x523a89, _0x15ede4, _0x1c9266, _0x4515aa);
        }
        if (_0x2aab94 && !_0x15ede4['key']['fromMe']) {
            const _0x59cb4e = await handleAntiSpam(_0x4f93db, _0x523a89, _0x15ede4, _0x4515aa, _0x1155df);
            if (_0x59cb4e)
                return;
        }
        if (!_0x2aab94 && !_0x15ede4['key']['fromMe'] && !_0x13748d) {
            try {
                const _0x4fe397 = (await import('../plugins/pmblocker.js'))['default'];
                const _0x2533f0 = _0x4fe397?.['readState'];
                const _0x6c704d = await _0x2533f0();
                if (_0x6c704d['enabled']) {
                    printLog('warning', 'PM\x20blocked\x20from:\x20' + _0x4515aa['split']('@')[0x0]);
                    await _0x4f93db['sendMessage'](_0x523a89, { 'text': _0x6c704d['message'] || 'Private\x20messages\x20are\x20blocked.\x20Please\x20contact\x20the\x20owner\x20in\x20groups\x20only.' });
                    await new Promise(_0x1f1934 => setTimeout(_0x1f1934, 0x5dc));
                    try {
                        await _0x4f93db['updateBlockStatus'](_0x523a89, 'block');
                        printLog('success', 'Blocked\x20user:\x20' + _0x4515aa['split']('@')[0x0]);
                    } catch (_0x1f9ca4) {
                        printLog('error', 'Failed\x20to\x20block\x20user:\x20' + _0x1f9ca4['message']);
                    }
                    return;
                }
            } catch (_0x19edb4) {
                printLog('error', 'PM\x20blocker\x20error:\x20' + _0x19edb4['message']);
            }
        }
        const _0x2971f0 = _0x0_0x1d6fa2['prefixes']?.['find'](_0x47f105 => _0x1c9266['startsWith'](_0x47f105));
        const _0x1c2a13 = _0x0_0x7f6384['getCommand'](_0x1c9266, _0x0_0x1d6fa2['prefixes']);
        if (!_0x2971f0 && !_0x1c2a13) {
            await handleAutotypingForMessage(_0x4f93db, _0x523a89, _0x1c9266);
            const _0x4e6610 = await _0x0_0x17342c['getBotMode']();
            const _0x3afb94 = _0x4e6610 === 'public' || _0x4e6610 === 'groups' && _0x2aab94 || _0x4e6610 === 'inbox' && !_0x2aab94 || _0x15f755;
            if (_0x3afb94) {
                if (_0x2aab94 && _0x1c9266['length'] < 0x3) {
                    const _0x5d7f22 = 'nova';
                    if (!_0x1c9266['includes'](_0x5d7f22) && !_0x1c9266['includes']('@')) {
                        return;
                    }
                }
                await handleChatbotResponse(_0x4f93db, _0x523a89, _0x15ede4, _0x1c9266, _0x4515aa);
            }
            return;
        }
        if (!_0x1c2a13) {
            const _0x2a3c54 = 'nova';
            const _0x498110 = _0x1c9266['includes'](_0x2a3c54) || _0x1c9266['includes']('@nova');
            if (_0x498110) {
                const _0x39b276 = await _0x0_0x17342c['getBotMode']();
                const _0x246ad2 = _0x39b276 === 'public' || _0x39b276 === 'groups' && _0x2aab94 || _0x39b276 === 'inbox' && !_0x2aab94 || _0x15f755;
                if (_0x246ad2) {
                    await handleChatbotResponse(_0x4f93db, _0x523a89, _0x15ede4, _0x1c9266, _0x4515aa);
                    return;
                }
            }
            return;
        }
        const _0x5a040c = ((() => {
            if (_0x15f755)
                return !![];
            switch (_0x3dc9ea) {
            case 'public':
                return !![];
            case 'private':
            case 'self':
                return ![];
            case 'groups':
                return _0x2aab94;
            case 'inbox':
                return !_0x2aab94;
            default:
                return !![];
            }
        })());
        if (!_0x5a040c) {
            return;
        }
        let _0x4c0ee7;
        if (_0x2971f0) {
            const _0x3f3835 = _0x59ed6d['slice'](_0x2971f0['length'])['trim']();
            _0x4c0ee7 = _0x3f3835['split'](/\s+/)['slice'](0x1);
        } else {
            _0x4c0ee7 = _0x59ed6d['trim']()['split'](/\s+/)['slice'](0x1);
        }
        if (_0x1c2a13['strictOwnerOnly']) {
            const {isOwnerOnly: _0x3772d3} = await import('./isOwner.js');
            if (!_0x15ede4['key']['fromMe'] && !_0x3772d3(_0x4515aa)) {
                return await _0x4f93db['sendMessage'](_0x523a89, {
                    'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20bot\x20owner!*\x0a\x0a_Sudo\x20users\x20cannot\x20manage\x20other\x20sudo\x20users._',
                    ...channelInfo
                }, { 'quoted': _0x15ede4 });
            }
        }
        if (_0x1c2a13['ownerOnly'] && !_0x15ede4['key']['fromMe'] && !_0x1155df) {
            return await _0x4f93db['sendMessage'](_0x523a89, {
                'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20owner\x20or\x20sudo\x20users!*',
                ...channelInfo
            }, { 'quoted': _0x15ede4 });
        }
        if (_0x1c2a13['groupOnly'] && !_0x2aab94) {
            return await _0x4f93db['sendMessage'](_0x523a89, {
                'text': 'ℹ️\x20*This\x20command\x20can\x20only\x20be\x20used\x20in\x20groups!*',
                ...channelInfo
            }, { 'quoted': _0x15ede4 });
        }
        let _0x5c3b00 = ![];
        let _0x2fc5fe = ![];
        if (_0x1c2a13['adminOnly'] && _0x2aab94) {
            const _0x1078dd = await _0x0_0x53c411(_0x4f93db, _0x523a89, _0x4515aa);
            _0x5c3b00 = _0x1078dd['isSenderAdmin'];
            _0x2fc5fe = _0x1078dd['isBotAdmin'];
            if (!_0x2fc5fe) {
                return await _0x4f93db['sendMessage'](_0x523a89, {
                    'text': 'ℹ️\x20*Please\x20make\x20the\x20bot\x20an\x20admin\x20to\x20use\x20this\x20command.*',
                    ...channelInfo
                }, { 'quoted': _0x15ede4 });
            }
            if (!_0x5c3b00 && !_0x15ede4['key']['fromMe'] && !_0x1155df) {
                return await _0x4f93db['sendMessage'](_0x523a89, {
                    'text': 'ℹ️\x20*Sorry,\x20only\x20group\x20admins\x20can\x20use\x20this\x20command.*',
                    ...channelInfo
                }, { 'quoted': _0x15ede4 });
            }
        }
        const _0x3b2a7f = {
            'chatId': _0x523a89,
            'senderId': _0x4515aa,
            'isGroup': _0x2aab94,
            'isSenderAdmin': _0x5c3b00,
            'isBotAdmin': _0x2fc5fe,
            'senderIsOwnerOrSudo': _0x1155df,
            'isOwnerOrSudoCheck': _0x15f755,
            'channelInfo': channelInfo,
            'rawText': _0x574b7a,
            'userMessage': _0x1c9266,
            'messageText': _0x59ed6d,
            'config': _0x0_0x1d6fa2
        };
        try {
            await _0x1c2a13['handler'](_0x4f93db, _0x15ede4, _0x4c0ee7, _0x3b2a7f);
            await addCommandReaction(_0x4f93db, _0x15ede4);
            await showTypingAfterCommand(_0x4f93db, _0x523a89);
        } catch (_0x4cc860) {
            printLog('error', 'Command\x20error\x20[' + _0x1c2a13['command'] + ']:\x20' + _0x4cc860['message']);
            console['error'](_0x4cc860['stack']);
            await _0x4f93db['sendMessage'](_0x523a89, {
                'text': '❌\x20Error\x20executing\x20command:\x20' + _0x4cc860['message'],
                ...channelInfo
            }, { 'quoted': _0x15ede4 });
            const _0x976c7c = {
                'command': _0x1c2a13['command'],
                'error': _0x4cc860['message'],
                'stack': _0x4cc860['stack'],
                'timestamp': new Date()['toISOString'](),
                'user': _0x4515aa,
                'chat': _0x523a89
            };
            try {
                writeErrorLog(_0x976c7c);
            } catch (_0x475972) {
                printLog('error', 'Failed\x20to\x20write\x20error\x20log:\x20' + _0x475972['message']);
            }
        }
    } catch (_0x532ef8) {
        printLog('error', 'Message\x20handler\x20error:\x20' + _0x532ef8['message']);
        console['error'](_0x532ef8['stack']);
        const _0x299b53 = _0x4a0528['messages']?.[0x0]?.['key']?.['remoteJid'];
        if (_0x299b53) {
            try {
                await _0x4f93db['sendMessage'](_0x299b53, {
                    'text': 'ℹ️\x20*Failed\x20to\x20process\x20message!*',
                    ...channelInfo
                });
            } catch (_0x4c9047) {
                printLog('error', 'Failed\x20to\x20send\x20error\x20message:\x20' + _0x4c9047['message']);
            }
        }
    }
}
async function handleGroupParticipantUpdate(_0x3bdeb0, _0x19e6ab) {
    try {
        const {
            id: _0x5aeb6b,
            participants: _0x190f1b,
            action: _0x419544,
            author: _0x3e98d8
        } = _0x19e6ab;
        if (!_0x5aeb6b['endsWith']('@g.us'))
            return;
        const _0x666ce6 = await _0x0_0x17342c['getBotMode']();
        const _0x186b08 = _0x3e98d8 ? await _0x0_0x438e45(_0x3e98d8, _0x3bdeb0, _0x5aeb6b) : ![];
        const _0x5c2db7 = _0x3e98d8 ? _0x3e98d8 === _0x3bdeb0['user']['id'] || _0x3e98d8 === _0x3bdeb0['user']['id']['split'](':')[0x0] + '@s.whatsapp.net' : ![];
        const _0x4d2894 = _0x5c2db7 || _0x186b08;
        if ((_0x666ce6 === 'private' || _0x666ce6 === 'self') && !_0x4d2894) {
            return;
        }
        invalidateGroupCache(_0x5aeb6b);
        if (!_0x5aeb6b['endsWith']('@g.us'))
            return;
        printLog('info', 'Group\x20update:\x20' + _0x419544 + '\x20in\x20' + _0x5aeb6b['split']('@')[0x0]);
        const _0x4cbbcb = _0x666ce6 === 'public' || _0x666ce6 === 'groups' || _0x4d2894;
        switch (_0x419544) {
        case 'promote':
            if (!_0x4cbbcb)
                return;
            const _0x4b8494 = (await import('../plugins/promote.js'))['default']?.['handlePromotionEvent'];
            await _0x4b8494(_0x3bdeb0, _0x5aeb6b, _0x190f1b, _0x3e98d8);
            break;
        case 'demote':
            if (!_0x4cbbcb)
                return;
            const _0x4c18b4 = (await import('../plugins/demote.js'))['default']?.['handleDemotionEvent'];
            await _0x4c18b4(_0x3bdeb0, _0x5aeb6b, _0x190f1b, _0x3e98d8);
            break;
        case 'add':
            const {handleJoinEvent: _0x4178fe} = await import('../plugins/welcome.js');
            await _0x4178fe(_0x3bdeb0, _0x5aeb6b, _0x190f1b);
            break;
        case 'remove':
            const _0x270c03 = (await import('../plugins/goodbye.js'))['default']?.['handleLeaveEvent'];
            await _0x270c03(_0x3bdeb0, _0x5aeb6b, _0x190f1b);
            break;
        default:
            printLog('warning', 'Unhandled\x20group\x20action:\x20' + _0x419544);
        }
    } catch (_0x1dcb2c) {
        printLog('error', 'Group\x20update\x20error:\x20' + _0x1dcb2c['message']);
        console['error'](_0x1dcb2c['stack']);
    }
}
async function handleStatus(_0x3731ef, _0x3015c4) {
    try {
        const {default: _0x3e064e} = await import('../plugins/autostatus.js');
        const _0x32e111 = _0x3e064e['handleStatusUpdate'];
        await _0x32e111(_0x3731ef, _0x3015c4);
    } catch (_0xb1ecc) {
        printLog('error', 'Status\x20handler\x20error:\x20' + _0xb1ecc['message']);
        console['error'](_0xb1ecc['stack']);
    }
}
async function handleCall(_0x121823, _0x275d5a) {
    try {
        const _0x43bbc1 = (await import('../plugins/anticall.js'))['default'];
        const _0x4af318 = _0x43bbc1['readState'] ? await _0x43bbc1['readState']() : { 'enabled': ![] };
        if (!_0x4af318['enabled'])
            return;
        const _0xf4c9b = new Set();
        for (const _0x1ab142 of _0x275d5a) {
            const _0x184bb9 = _0x1ab142['from'] || _0x1ab142['peerJid'] || _0x1ab142['chatId'];
            if (!_0x184bb9)
                continue;
            try {
                try {
                    if (typeof _0x121823['rejectCall'] === 'function' && _0x1ab142['id']) {
                        await _0x121823['rejectCall'](_0x1ab142['id'], _0x184bb9);
                    } else if (typeof _0x121823['sendCallOfferAck'] === 'function' && _0x1ab142['id']) {
                        await _0x121823['sendCallOfferAck'](_0x1ab142['id'], _0x184bb9, 'reject');
                    }
                } catch (_0x5bee51) {
                    printLog('error', 'Error\x20rejecting\x20call:\x20' + _0x5bee51['message']);
                }
                if (!_0xf4c9b['has'](_0x184bb9)) {
                    _0xf4c9b['add'](_0x184bb9);
                    setTimeout(() => _0xf4c9b['delete'](_0x184bb9), 0xea60);
                    await _0x121823['sendMessage'](_0x184bb9, { 'text': '📵\x20Anticall\x20is\x20enabled.\x20Your\x20call\x20was\x20rejected\x20and\x20you\x20will\x20be\x20blocked.' });
                    printLog('info', 'Sent\x20anticall\x20warning\x20to:\x20' + _0x184bb9['split']('@')[0x0]);
                }
                setTimeout(async () => {
                    try {
                        await _0x121823['updateBlockStatus'](_0x184bb9, 'block');
                        printLog('success', 'Blocked\x20caller:\x20' + _0x184bb9['split']('@')[0x0]);
                    } catch (_0x2d55d1) {
                        printLog('error', 'Error\x20blocking\x20caller:\x20' + _0x2d55d1['message']);
                    }
                }, 0x320);
            } catch (_0x43b0f6) {
                printLog('error', 'Error\x20handling\x20call\x20from\x20' + _0x184bb9['split']('@')[0x0] + ':\x20' + _0x43b0f6['message']);
            }
        }
    } catch (_0x4114cf) {
        printLog('error', 'Call\x20handler\x20error:\x20' + _0x4114cf['message']);
        console['error'](_0x4114cf['stack']);
    }
}
export {
    handleMessages,
    handleGroupParticipantUpdate,
    handleStatus,
    handleCall
};