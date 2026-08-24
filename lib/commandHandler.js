import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x204d7f from 'fs';
import { dataFile } from './paths.js';
import { handleChatbotResponse } from './Chatbots.js';
import _0x0_0x19cc06 from '../config.js';
import _0x0_0x3e5965 from './lightweight_store.js';
import _0x0_0x2570cb from './commandHandler.js';
import {
    printMessage,
    printLog
} from './print.js';
import { isBanned } from './isBanned.js';
import { isSudo } from './index.js';
import _0x0_0xdd0eac from './isOwner.js';
import _0x0_0x5a4dbc from './isAdmin.js';
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
        const _0x23416f = await _0x0_0x3e5965['getSetting']('global', 'stickerCommands');
        return _0x23416f || {};
    } else {
        try {
            if (!_0x0_0x204d7f['existsSync'](STICKER_FILE)) {
                return {};
            }
            return JSON['parse'](_0x0_0x204d7f['readFileSync'](STICKER_FILE, 'utf8'));
        } catch {
            return {};
        }
    }
}
async function handleMessages(_0x2de05f, _0x4e6148) {
    try {
        const {
            messages: _0x2c6054,
            type: _0xb7db12
        } = _0x4e6148;
        if (_0xb7db12 !== 'notify')
            return;
        const _0x333760 = _0x2c6054[0x0];
        if (!_0x333760?.['message'])
            return;
        const _0x23ad29 = _0x333760['key']['remoteJid'];
        const _0x356b46 = _0x23ad29['endsWith']('@g.us');
        const _0x25af32 = _0x333760['key']['participant'] || _0x333760['key']['remoteJid'];
        const _0x194f88 = await _0x0_0xdd0eac(_0x25af32, _0x2de05f, _0x23ad29);
        const _0x13a034 = _0x333760['key']['fromMe'] || _0x194f88;
        const _0x3b9cc0 = await _0x0_0x3e5965['getBotMode']();
        if ((_0x3b9cc0 === 'private' || _0x3b9cc0 === 'self') && !_0x13a034) {
            return;
        }
        await printMessage(_0x333760, _0x2de05f);
        try {
            const _0x2e9137 = await _0x0_0x3e5965['getSetting']('global', 'stealthMode');
            if (!_0x2e9137 || !_0x2e9137['enabled']) {
                await handleAutoread(_0x2de05f, _0x333760);
            } else {
                printLog('info', '👻\x20Stealth\x20mode\x20active');
            }
        } catch (_0x140f12) {
            await handleAutoread(_0x2de05f, _0x333760);
        }
        if (_0x333760['message']?.['protocolMessage']?.['type'] === 0x0) {
            printLog('info', 'Message\x20deletion\x20detected');
            await handleMessageRevocation(_0x2de05f, _0x333760);
            return;
        }
        await storeMessage(_0x2de05f, _0x333760);
        if (_0x333760['pushName'] && _0x2de05f['store']?.['contacts']) {
            const _0x4ecde3 = _0x333760['key']['participant'] || _0x333760['key']['remoteJid'];
            if (_0x4ecde3) {
                _0x2de05f['store']['contacts'][_0x4ecde3] = {
                    ..._0x2de05f['store']['contacts'][_0x4ecde3],
                    'id': _0x4ecde3,
                    'notify': _0x333760['pushName'],
                    'name': _0x333760['pushName']
                };
                const _0x4bfab3 = _0x2de05f['decodeJid']?.(_0x4ecde3);
                if (_0x4bfab3 && _0x4bfab3 !== _0x4ecde3) {
                    _0x2de05f['store']['contacts'][_0x4bfab3] = {
                        ..._0x2de05f['store']['contacts'][_0x4bfab3],
                        'id': _0x4bfab3,
                        'notify': _0x333760['pushName'],
                        'name': _0x333760['pushName']
                    };
                }
            }
        }
        const _0x5af1dd = _0x333760['key']['participant'] || _0x333760['key']['remoteJid'];
        if (_0x5af1dd?.['includes']('@lid') && _0x2de05f['store']?.['contacts']) {
            const _0x4363b9 = _0x2de05f['store']['contacts'];
            const _0x902ace = Object['keys'](_0x4363b9)['find'](_0x3d175e => _0x4363b9[_0x3d175e]?.['lid'] === _0x5af1dd || _0x4363b9[_0x3d175e]?.['lid']?.['split'](':')[0x0] === _0x5af1dd['split']('@')[0x0]);
            if (_0x902ace?.['includes']('@s.whatsapp.net'))
                _0x25af32 = _0x902ace;
        }
        if (_0x333760['message']?.['stickerMessage']) {
            const _0x22515c = _0x333760['message']['stickerMessage']['fileSha256'];
            if (_0x22515c) {
                const _0x4019ff = Buffer['from'](_0x22515c)['toString']('base64');
                const _0x2361ad = await getStickerCommands();
                if (_0x2361ad[_0x4019ff]) {
                    const _0x49f545 = _0x2361ad[_0x4019ff]['text'];
                    const [_0x11b223, ..._0x1513ab] = _0x49f545['split']('\x20');
                    let _0x61860b = null;
                    let _0x167dad = '';
                    for (const _0x1f2387 of _0x0_0x19cc06['prefixes']) {
                        const _0x46123f = (_0x1f2387 + _0x11b223)['toLowerCase']();
                        _0x61860b = _0x0_0x2570cb['getCommand'](_0x46123f, _0x0_0x19cc06['prefixes']);
                        if (_0x61860b) {
                            _0x167dad = _0x1f2387;
                            break;
                        }
                    }
                    if (_0x61860b) {
                        const _0x551f00 = await isSudo(_0x25af32);
                        const _0x4b5a37 = await _0x0_0xdd0eac(_0x25af32, _0x2de05f, _0x23ad29);
                        const _0x4dcf59 = _0x333760['key']['fromMe'] || _0x4b5a37;
                        const _0x5a65bc = await _0x0_0x3e5965['getBotMode']();
                        const _0x58c245 = ((() => {
                            if (_0x4dcf59)
                                return !![];
                            switch (_0x5a65bc) {
                            case 'public':
                                return !![];
                            case 'private':
                            case 'self':
                                return ![];
                            case 'groups':
                                return _0x356b46;
                            case 'inbox':
                                return !_0x356b46;
                            default:
                                return !![];
                            }
                        })());
                        if (!_0x58c245)
                            return;
                        const _0x2e4512 = await isBanned(_0x25af32);
                        if (_0x2e4512)
                            return;
                        if (_0x61860b['strictOwnerOnly']) {
                            const {isOwnerOnly: _0x347374} = await import('./isOwner.js');
                            if (!_0x333760['key']['fromMe'] && !_0x347374(_0x25af32)) {
                                return await _0x2de05f['sendMessage'](_0x23ad29, {
                                    'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20bot\x20owner!*',
                                    ...channelInfo
                                }, { 'quoted': _0x333760 });
                            }
                        }
                        if (_0x61860b['ownerOnly'] && !_0x333760['key']['fromMe'] && !_0x4b5a37) {
                            return await _0x2de05f['sendMessage'](_0x23ad29, {
                                'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20owner\x20or\x20sudo\x20users!*',
                                ...channelInfo
                            }, { 'quoted': _0x333760 });
                        }
                        if (_0x61860b['groupOnly'] && !_0x356b46) {
                            return await _0x2de05f['sendMessage'](_0x23ad29, {
                                'text': 'ℹ️\x20*This\x20command\x20can\x20only\x20be\x20used\x20in\x20groups!*',
                                ...channelInfo
                            }, { 'quoted': _0x333760 });
                        }
                        let _0x1c0ab3 = ![];
                        let _0xc1418f = ![];
                        if (_0x61860b['adminOnly'] && _0x356b46) {
                            const _0xf14584 = await _0x0_0x5a4dbc(_0x2de05f, _0x23ad29, _0x25af32);
                            _0x1c0ab3 = _0xf14584['isSenderAdmin'];
                            _0xc1418f = _0xf14584['isBotAdmin'];
                            if (!_0xc1418f) {
                                return await _0x2de05f['sendMessage'](_0x23ad29, {
                                    'text': 'ℹ️\x20*Please\x20make\x20the\x20bot\x20an\x20admin\x20to\x20use\x20this\x20command.*',
                                    ...channelInfo
                                }, { 'quoted': _0x333760 });
                            }
                            if (!_0x1c0ab3 && !_0x333760['key']['fromMe'] && !_0x4b5a37) {
                                return await _0x2de05f['sendMessage'](_0x23ad29, {
                                    'text': 'ℹ️\x20*Sorry,\x20only\x20group\x20admins\x20can\x20use\x20this\x20command.*',
                                    ...channelInfo
                                }, { 'quoted': _0x333760 });
                            }
                        }
                        const _0xe48949 = {
                            'key': _0x333760['key'],
                            'message': {
                                'extendedTextMessage': {
                                    'text': _0x167dad + _0x49f545,
                                    'contextInfo': _0x333760['message']['stickerMessage']['contextInfo'] || {}
                                }
                            },
                            'messageTimestamp': _0x333760['messageTimestamp'],
                            'pushName': _0x333760['pushName'],
                            'broadcast': _0x333760['broadcast']
                        };
                        const _0x5f4615 = {
                            'chatId': _0x23ad29,
                            'senderId': _0x25af32,
                            'isGroup': _0x356b46,
                            'isSenderAdmin': _0x1c0ab3,
                            'isBotAdmin': _0xc1418f,
                            'senderIsOwnerOrSudo': _0x4b5a37,
                            'isOwnerOrSudoCheck': _0x4dcf59,
                            'channelInfo': channelInfo,
                            'rawText': _0x167dad + _0x49f545,
                            'userMessage': (_0x167dad + _0x49f545)['toLowerCase'](),
                            'messageText': _0x167dad + _0x49f545,
                            'config': _0x0_0x19cc06
                        };
                        try {
                            await _0x61860b['handler'](_0x2de05f, _0xe48949, _0x1513ab, _0x5f4615);
                            await addCommandReaction(_0x2de05f, _0x333760);
                            await showTypingAfterCommand(_0x2de05f, _0x23ad29);
                            printLog('success', '✅\x20Sticker\x20command\x20executed:\x20' + _0x49f545);
                        } catch (_0x1478bf) {
                            printLog('error', '❌\x20Sticker\x20command\x20error\x20[' + _0x49f545 + ']:\x20' + _0x1478bf['message']);
                            console['error'](_0x1478bf['stack']);
                            await _0x2de05f['sendMessage'](_0x23ad29, {
                                'text': '❌\x20Error\x20executing\x20sticker\x20command:\x20' + _0x1478bf['message'],
                                ...channelInfo
                            }, { 'quoted': _0x333760 });
                        }
                    } else {
                        printLog('warning', '⚠️\x20Sticker\x20command\x20not\x20found:\x20' + _0x49f545);
                    }
                    return;
                }
            }
        }
        const _0x459d84 = _0x333760['message']?.['conversation'] || _0x333760['message']?.['extendedTextMessage']?.['text'] || _0x333760['message']?.['imageMessage']?.['caption'] || _0x333760['message']?.['videoMessage']?.['caption'] || _0x333760['message']?.['buttonsResponseMessage']?.['selectedButtonId'] || '';
        const _0x285a93 = _0x459d84['trim']();
        const _0x200f0e = _0x285a93['toLowerCase']();
        const _0x431b8a = await isSudo(_0x25af32);
        startSchedulerEngine(_0x2de05f);
        if (!_0x333760['key']['fromMe']) {
            const _0x9b4630 = await handleAutoReply(_0x2de05f, _0x23ad29, _0x333760, _0x200f0e);
            if (_0x9b4630)
                return;
        }
        if (_0x333760['message']?.['buttonsResponseMessage']) {
            const _0x51425a = _0x333760['message']['buttonsResponseMessage']['selectedButtonId'];
            printLog('info', 'Button\x20response:\x20' + _0x51425a);
            if (_0x51425a === 'channel') {
                await _0x2de05f['sendMessage'](_0x23ad29, { 'text': '*Join\x20our\x20Channel:*\x0a[https://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y](https://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y)' }, { 'quoted': _0x333760 });
                return;
            } else if (_0x51425a === 'owner') {
                const _0x152c7b = (await import('../plugins/owner.js'))['default'];
                await _0x152c7b['handler']?.(_0x2de05f, _0x23ad29, '', {});
                return;
            } else if (_0x51425a === 'support') {
                await _0x2de05f['sendMessage'](_0x23ad29, { 'text': '*Support*\x0a\x0ahttps://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y' }, { 'quoted': _0x333760 });
                return;
            }
        }
        const _0x5d5480 = await isBanned(_0x25af32);
        if (_0x5d5480 && !_0x200f0e['startsWith']('.unban')) {
            if (Math['random']() < 0.1) {
                printLog('warning', 'Banned\x20user\x20attempted\x20command:\x20' + _0x25af32['split']('@')[0x0]);
                await _0x2de05f['sendMessage'](_0x23ad29, {
                    'text': 'You\x20are\x20banned\x20from\x20using\x20the\x20bot.\x20Contact\x20an\x20admin\x20to\x20get\x20unbanned.',
                    ...channelInfo
                });
            }
            return;
        }
        if (/^[1-9]$/['test'](_0x200f0e) || _0x200f0e === 'surrender') {
            await handleTicTacToeMove(_0x2de05f, _0x23ad29, _0x25af32, _0x200f0e);
            return;
        }
        if (!_0x333760['key']['fromMe']) {
            await _0x0_0x3e5965['incrementMessageCount'](_0x23ad29, _0x25af32, _0x333760['pushName']);
        } else {
            const _0x24a292 = _0x2de05f['user']?.['id'] || _0x25af32;
            const _0x4304ae = _0x2de05f['user']?.['name'] || _0x2de05f['user']?.['notify'] || 'Me';
            await _0x0_0x3e5965['incrementMessageCount'](_0x23ad29, _0x24a292, _0x4304ae);
        }
        if (_0x356b46) {
            if (_0x200f0e) {
                await handleBadwordDetection(_0x2de05f, _0x23ad29, _0x333760, _0x200f0e, _0x25af32);
            }
            await handleLinkDetection(_0x2de05f, _0x23ad29, _0x333760, _0x200f0e, _0x25af32);
        }
        if (_0x356b46 && !_0x333760['key']['fromMe']) {
            const _0x41daa8 = await handleAntiSpam(_0x2de05f, _0x23ad29, _0x333760, _0x25af32, _0x194f88);
            if (_0x41daa8)
                return;
        }
        if (!_0x356b46 && !_0x333760['key']['fromMe'] && !_0x431b8a) {
            try {
                const _0x4def0e = (await import('../plugins/pmblocker.js'))['default'];
                const _0x1ce802 = _0x4def0e?.['readState'];
                const _0x910229 = await _0x1ce802();
                if (_0x910229['enabled']) {
                    printLog('warning', 'PM\x20blocked\x20from:\x20' + _0x25af32['split']('@')[0x0]);
                    await _0x2de05f['sendMessage'](_0x23ad29, { 'text': _0x910229['message'] || 'Private\x20messages\x20are\x20blocked.\x20Please\x20contact\x20the\x20owner\x20in\x20groups\x20only.' });
                    await new Promise(_0x409f1b => setTimeout(_0x409f1b, 0x5dc));
                    try {
                        await _0x2de05f['updateBlockStatus'](_0x23ad29, 'block');
                        printLog('success', 'Blocked\x20user:\x20' + _0x25af32['split']('@')[0x0]);
                    } catch (_0x1df149) {
                        printLog('error', 'Failed\x20to\x20block\x20user:\x20' + _0x1df149['message']);
                    }
                    return;
                }
            } catch (_0x16f244) {
                printLog('error', 'PM\x20blocker\x20error:\x20' + _0x16f244['message']);
            }
        }
        const _0x130b24 = _0x0_0x19cc06['prefixes']?.['find'](_0xeaf7d9 => _0x200f0e['startsWith'](_0xeaf7d9));
        const _0x350099 = _0x0_0x2570cb['getCommand'](_0x200f0e, _0x0_0x19cc06['prefixes']);
        if (!_0x130b24 && !_0x350099) {
            await handleAutotypingForMessage(_0x2de05f, _0x23ad29, _0x200f0e);
            const _0xd984e3 = await _0x0_0x3e5965['getBotMode']();
            const _0x16841e = _0xd984e3 === 'public' || _0xd984e3 === 'groups' && _0x356b46 || _0xd984e3 === 'inbox' && !_0x356b46 || _0x13a034;
            if (_0x16841e) {
                if (_0x356b46 && _0x200f0e['length'] < 0x3) {
                    const _0x220c55 = 'nova';
                    if (!_0x200f0e['includes'](_0x220c55) && !_0x200f0e['includes']('@')) {
                        return;
                    }
                }
                await handleChatbotResponse(_0x2de05f, _0x23ad29, _0x333760, _0x200f0e, _0x25af32);
            }
            return;
        }
        if (!_0x350099) {
            const _0x113ac3 = 'nova';
            const _0x3104dd = _0x200f0e['includes'](_0x113ac3) || _0x200f0e['includes']('@nova');
            if (_0x3104dd) {
                const _0x119298 = await _0x0_0x3e5965['getBotMode']();
                const _0x559782 = _0x119298 === 'public' || _0x119298 === 'groups' && _0x356b46 || _0x119298 === 'inbox' && !_0x356b46 || _0x13a034;
                if (_0x559782) {
                    await handleChatbotResponse(_0x2de05f, _0x23ad29, _0x333760, _0x200f0e, _0x25af32);
                    return;
                }
            }
            return;
        }
        const _0x4a3819 = ((() => {
            if (_0x13a034)
                return !![];
            switch (_0x3b9cc0) {
            case 'public':
                return !![];
            case 'private':
            case 'self':
                return ![];
            case 'groups':
                return _0x356b46;
            case 'inbox':
                return !_0x356b46;
            default:
                return !![];
            }
        })());
        if (!_0x4a3819) {
            return;
        }
        let _0x348456;
        if (_0x130b24) {
            const _0x4acf33 = _0x285a93['slice'](_0x130b24['length'])['trim']();
            _0x348456 = _0x4acf33['split'](/\s+/)['slice'](0x1);
        } else {
            _0x348456 = _0x285a93['trim']()['split'](/\s+/)['slice'](0x1);
        }
        if (_0x350099['strictOwnerOnly']) {
            const {isOwnerOnly: _0x1e45bc} = await import('./isOwner.js');
            if (!_0x333760['key']['fromMe'] && !_0x1e45bc(_0x25af32)) {
                return await _0x2de05f['sendMessage'](_0x23ad29, {
                    'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20bot\x20owner!*\x0a\x0a_Sudo\x20users\x20cannot\x20manage\x20other\x20sudo\x20users._',
                    ...channelInfo
                }, { 'quoted': _0x333760 });
            }
        }
        if (_0x350099['ownerOnly'] && !_0x333760['key']['fromMe'] && !_0x194f88) {
            return await _0x2de05f['sendMessage'](_0x23ad29, {
                'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20owner\x20or\x20sudo\x20users!*',
                ...channelInfo
            }, { 'quoted': _0x333760 });
        }
        if (_0x350099['groupOnly'] && !_0x356b46) {
            return await _0x2de05f['sendMessage'](_0x23ad29, {
                'text': 'ℹ️\x20*This\x20command\x20can\x20only\x20be\x20used\x20in\x20groups!*',
                ...channelInfo
            }, { 'quoted': _0x333760 });
        }
        let _0x812f95 = ![];
        let _0x2ce6ca = ![];
        if (_0x350099['adminOnly'] && _0x356b46) {
            const _0x2ece40 = await _0x0_0x5a4dbc(_0x2de05f, _0x23ad29, _0x25af32);
            _0x812f95 = _0x2ece40['isSenderAdmin'];
            _0x2ce6ca = _0x2ece40['isBotAdmin'];
            if (!_0x2ce6ca) {
                return await _0x2de05f['sendMessage'](_0x23ad29, {
                    'text': 'ℹ️\x20*Please\x20make\x20the\x20bot\x20an\x20admin\x20to\x20use\x20this\x20command.*',
                    ...channelInfo
                }, { 'quoted': _0x333760 });
            }
            if (!_0x812f95 && !_0x333760['key']['fromMe'] && !_0x194f88) {
                return await _0x2de05f['sendMessage'](_0x23ad29, {
                    'text': 'ℹ️\x20*Sorry,\x20only\x20group\x20admins\x20can\x20use\x20this\x20command.*',
                    ...channelInfo
                }, { 'quoted': _0x333760 });
            }
        }
        const _0x38fad7 = {
            'chatId': _0x23ad29,
            'senderId': _0x25af32,
            'isGroup': _0x356b46,
            'isSenderAdmin': _0x812f95,
            'isBotAdmin': _0x2ce6ca,
            'senderIsOwnerOrSudo': _0x194f88,
            'isOwnerOrSudoCheck': _0x13a034,
            'channelInfo': channelInfo,
            'rawText': _0x459d84,
            'userMessage': _0x200f0e,
            'messageText': _0x285a93,
            'config': _0x0_0x19cc06
        };
        try {
            await _0x350099['handler'](_0x2de05f, _0x333760, _0x348456, _0x38fad7);
            await addCommandReaction(_0x2de05f, _0x333760);
            await showTypingAfterCommand(_0x2de05f, _0x23ad29);
        } catch (_0x276ba7) {
            printLog('error', 'Command\x20error\x20[' + _0x350099['command'] + ']:\x20' + _0x276ba7['message']);
            console['error'](_0x276ba7['stack']);
            await _0x2de05f['sendMessage'](_0x23ad29, {
                'text': '❌\x20Error\x20executing\x20command:\x20' + _0x276ba7['message'],
                ...channelInfo
            }, { 'quoted': _0x333760 });
            const _0x32b5b6 = {
                'command': _0x350099['command'],
                'error': _0x276ba7['message'],
                'stack': _0x276ba7['stack'],
                'timestamp': new Date()['toISOString'](),
                'user': _0x25af32,
                'chat': _0x23ad29
            };
            try {
                writeErrorLog(_0x32b5b6);
            } catch (_0x262d16) {
                printLog('error', 'Failed\x20to\x20write\x20error\x20log:\x20' + _0x262d16['message']);
            }
        }
    } catch (_0x21093d) {
        printLog('error', 'Message\x20handler\x20error:\x20' + _0x21093d['message']);
        console['error'](_0x21093d['stack']);
        const _0x4f2c49 = _0x4e6148['messages']?.[0x0]?.['key']?.['remoteJid'];
        if (_0x4f2c49) {
            try {
                await _0x2de05f['sendMessage'](_0x4f2c49, {
                    'text': 'ℹ️\x20*Failed\x20to\x20process\x20message!*',
                    ...channelInfo
                });
            } catch (_0x5bd2d0) {
                printLog('error', 'Failed\x20to\x20send\x20error\x20message:\x20' + _0x5bd2d0['message']);
            }
        }
    }
}
async function handleGroupParticipantUpdate(_0x2ff11e, _0x1e451a) {
    try {
        const {
            id: _0xfe8298,
            participants: _0x40ef42,
            action: _0xd79484,
            author: _0x15308d
        } = _0x1e451a;
        if (!_0xfe8298['endsWith']('@g.us'))
            return;
        const _0x97eb56 = await _0x0_0x3e5965['getBotMode']();
        const _0x537491 = _0x15308d ? await _0x0_0xdd0eac(_0x15308d, _0x2ff11e, _0xfe8298) : ![];
        const _0x168202 = _0x15308d ? _0x15308d === _0x2ff11e['user']['id'] || _0x15308d === _0x2ff11e['user']['id']['split'](':')[0x0] + '@s.whatsapp.net' : ![];
        const _0x5a8781 = _0x168202 || _0x537491;
        if ((_0x97eb56 === 'private' || _0x97eb56 === 'self') && !_0x5a8781) {
            return;
        }
        invalidateGroupCache(_0xfe8298);
        if (!_0xfe8298['endsWith']('@g.us'))
            return;
        printLog('info', 'Group\x20update:\x20' + _0xd79484 + '\x20in\x20' + _0xfe8298['split']('@')[0x0]);
        const _0x10e803 = _0x97eb56 === 'public' || _0x97eb56 === 'groups' || _0x5a8781;
        switch (_0xd79484) {
        case 'promote':
            if (!_0x10e803)
                return;
            const _0x324bba = (await import('../plugins/promote.js'))['default']?.['handlePromotionEvent'];
            await _0x324bba(_0x2ff11e, _0xfe8298, _0x40ef42, _0x15308d);
            break;
        case 'demote':
            if (!_0x10e803)
                return;
            const _0x31e577 = (await import('../plugins/demote.js'))['default']?.['handleDemotionEvent'];
            await _0x31e577(_0x2ff11e, _0xfe8298, _0x40ef42, _0x15308d);
            break;
        case 'add':
            const {handleJoinEvent: _0x263d05} = await import('../plugins/welcome.js');
            await _0x263d05(_0x2ff11e, _0xfe8298, _0x40ef42);
            break;
        case 'remove':
            const _0x908539 = (await import('../plugins/goodbye.js'))['default']?.['handleLeaveEvent'];
            await _0x908539(_0x2ff11e, _0xfe8298, _0x40ef42);
            break;
        default:
            printLog('warning', 'Unhandled\x20group\x20action:\x20' + _0xd79484);
        }
    } catch (_0x3d6654) {
        printLog('error', 'Group\x20update\x20error:\x20' + _0x3d6654['message']);
        console['error'](_0x3d6654['stack']);
    }
}
async function handleStatus(_0x38d4e5, _0x29e9a9) {
    try {
        const {default: _0x58f794} = await import('../plugins/autostatus.js');
        const _0x337ad8 = _0x58f794['handleStatusUpdate'];
        await _0x337ad8(_0x38d4e5, _0x29e9a9);
    } catch (_0xa890a0) {
        printLog('error', 'Status\x20handler\x20error:\x20' + _0xa890a0['message']);
        console['error'](_0xa890a0['stack']);
    }
}
async function handleCall(_0x152645, _0x50a628) {
    try {
        const _0x553057 = (await import('../plugins/anticall.js'))['default'];
        const _0x20f12b = _0x553057['readState'] ? await _0x553057['readState']() : { 'enabled': ![] };
        if (!_0x20f12b['enabled'])
            return;
        const _0x3a6cd = new Set();
        for (const _0xb45399 of _0x50a628) {
            const _0x544ff5 = _0xb45399['from'] || _0xb45399['peerJid'] || _0xb45399['chatId'];
            if (!_0x544ff5)
                continue;
            try {
                try {
                    if (typeof _0x152645['rejectCall'] === 'function' && _0xb45399['id']) {
                        await _0x152645['rejectCall'](_0xb45399['id'], _0x544ff5);
                    } else if (typeof _0x152645['sendCallOfferAck'] === 'function' && _0xb45399['id']) {
                        await _0x152645['sendCallOfferAck'](_0xb45399['id'], _0x544ff5, 'reject');
                    }
                } catch (_0x2a7d18) {
                    printLog('error', 'Error\x20rejecting\x20call:\x20' + _0x2a7d18['message']);
                }
                if (!_0x3a6cd['has'](_0x544ff5)) {
                    _0x3a6cd['add'](_0x544ff5);
                    setTimeout(() => _0x3a6cd['delete'](_0x544ff5), 0xea60);
                    await _0x152645['sendMessage'](_0x544ff5, { 'text': '📵\x20Anticall\x20is\x20enabled.\x20Your\x20call\x20was\x20rejected\x20and\x20you\x20will\x20be\x20blocked.' });
                    printLog('info', 'Sent\x20anticall\x20warning\x20to:\x20' + _0x544ff5['split']('@')[0x0]);
                }
                setTimeout(async () => {
                    try {
                        await _0x152645['updateBlockStatus'](_0x544ff5, 'block');
                        printLog('success', 'Blocked\x20caller:\x20' + _0x544ff5['split']('@')[0x0]);
                    } catch (_0x330ed2) {
                        printLog('error', 'Error\x20blocking\x20caller:\x20' + _0x330ed2['message']);
                    }
                }, 0x320);
            } catch (_0x133511) {
                printLog('error', 'Error\x20handling\x20call\x20from\x20' + _0x544ff5['split']('@')[0x0] + ':\x20' + _0x133511['message']);
            }
        }
    } catch (_0x4221b2) {
        printLog('error', 'Call\x20handler\x20error:\x20' + _0x4221b2['message']);
        console['error'](_0x4221b2['stack']);
    }
}
export {
    handleMessages,
    handleGroupParticipantUpdate,
    handleStatus,
    handleCall
};