import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x4cd3a6 from 'fs';
import { dataFile } from './paths.js';
import _0x0_0x2a4136 from '../config.js';
import _0x0_0x11a053 from './lightweight_store.js';
import _0x0_0x4f7bfa from './commandHandler.js';
import {
    printMessage,
    printLog
} from './print.js';
import { isBanned } from './isBanned.js';
import { isSudo } from './index.js';
import _0x0_0x4ae1da from './isOwner.js';
import _0x0_0x1c957c from './isAdmin.js';
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
        const _0x2ae76b = await _0x0_0x11a053['getSetting']('global', 'stickerCommands');
        return _0x2ae76b || {};
    } else {
        try {
            if (!_0x0_0x4cd3a6['existsSync'](STICKER_FILE)) {
                return {};
            }
            return JSON['parse'](_0x0_0x4cd3a6['readFileSync'](STICKER_FILE, 'utf8'));
        } catch {
            return {};
        }
    }
}
async function handleMessages(_0x6f8f8, _0x76c97) {
    try {
        const {
            messages: _0xf7fc89,
            type: _0x3da3ee
        } = _0x76c97;
        if (_0x3da3ee !== 'notify')
            return;
        const _0x258b70 = _0xf7fc89[0x0];
        if (!_0x258b70?.['message'])
            return;
        const _0x23a86a = _0x258b70['key']['remoteJid'];
        const _0x3a9fc3 = _0x23a86a['endsWith']('@g.us');
        const _0x2b445d = _0x258b70['key']['participant'] || _0x258b70['key']['remoteJid'];
        const _0x55a39c = await _0x0_0x4ae1da(_0x2b445d, _0x6f8f8, _0x23a86a);
        const _0xc418a6 = _0x258b70['key']['fromMe'] || _0x55a39c;
        const _0x317a2a = await _0x0_0x11a053['getBotMode']();
        if ((_0x317a2a === 'private' || _0x317a2a === 'self') && !_0xc418a6) {
            return;
        }
        await printMessage(_0x258b70, _0x6f8f8);
        try {
            const _0x123fa8 = await _0x0_0x11a053['getSetting']('global', 'stealthMode');
            if (!_0x123fa8 || !_0x123fa8['enabled']) {
                await handleAutoread(_0x6f8f8, _0x258b70);
            } else {
                printLog('info', '👻\x20Stealth\x20mode\x20active');
            }
        } catch (_0x265ba8) {
            await handleAutoread(_0x6f8f8, _0x258b70);
        }
        if (_0x258b70['message']?.['protocolMessage']?.['type'] === 0x0) {
            printLog('info', 'Message\x20deletion\x20detected');
            await handleMessageRevocation(_0x6f8f8, _0x258b70);
            return;
        }
        await storeMessage(_0x6f8f8, _0x258b70);
        if (_0x258b70['pushName'] && _0x6f8f8['store']?.['contacts']) {
            const _0x576bce = _0x258b70['key']['participant'] || _0x258b70['key']['remoteJid'];
            if (_0x576bce) {
                _0x6f8f8['store']['contacts'][_0x576bce] = {
                    ..._0x6f8f8['store']['contacts'][_0x576bce],
                    'id': _0x576bce,
                    'notify': _0x258b70['pushName'],
                    'name': _0x258b70['pushName']
                };
                const _0x2d343e = _0x6f8f8['decodeJid']?.(_0x576bce);
                if (_0x2d343e && _0x2d343e !== _0x576bce) {
                    _0x6f8f8['store']['contacts'][_0x2d343e] = {
                        ..._0x6f8f8['store']['contacts'][_0x2d343e],
                        'id': _0x2d343e,
                        'notify': _0x258b70['pushName'],
                        'name': _0x258b70['pushName']
                    };
                }
            }
        }
        const _0x4b2f30 = _0x258b70['key']['participant'] || _0x258b70['key']['remoteJid'];
        if (_0x4b2f30?.['includes']('@lid') && _0x6f8f8['store']?.['contacts']) {
            const _0x4706bf = _0x6f8f8['store']['contacts'];
            const _0x510020 = Object['keys'](_0x4706bf)['find'](_0x122ea6 => _0x4706bf[_0x122ea6]?.['lid'] === _0x4b2f30 || _0x4706bf[_0x122ea6]?.['lid']?.['split'](':')[0x0] === _0x4b2f30['split']('@')[0x0]);
            if (_0x510020?.['includes']('@s.whatsapp.net'))
                _0x2b445d = _0x510020;
        }
        if (_0x258b70['message']?.['stickerMessage']) {
            const _0x33baac = _0x258b70['message']['stickerMessage']['fileSha256'];
            if (_0x33baac) {
                const _0xd06252 = Buffer['from'](_0x33baac)['toString']('base64');
                const _0x13defd = await getStickerCommands();
                if (_0x13defd[_0xd06252]) {
                    const _0x234b0d = _0x13defd[_0xd06252]['text'];
                    const [_0x2bd52f, ..._0x3b2d18] = _0x234b0d['split']('\x20');
                    let _0x59531c = null;
                    let _0x2ec0fa = '';
                    for (const _0x4f01ad of _0x0_0x2a4136['prefixes']) {
                        const _0x21f1f7 = (_0x4f01ad + _0x2bd52f)['toLowerCase']();
                        _0x59531c = _0x0_0x4f7bfa['getCommand'](_0x21f1f7, _0x0_0x2a4136['prefixes']);
                        if (_0x59531c) {
                            _0x2ec0fa = _0x4f01ad;
                            break;
                        }
                    }
                    if (_0x59531c) {
                        const _0x8b32d7 = await isSudo(_0x2b445d);
                        const _0x3d3ad7 = await _0x0_0x4ae1da(_0x2b445d, _0x6f8f8, _0x23a86a);
                        const _0x5e3b86 = _0x258b70['key']['fromMe'] || _0x3d3ad7;
                        const _0x378f72 = await _0x0_0x11a053['getBotMode']();
                        const _0x45e0a9 = ((() => {
                            if (_0x5e3b86)
                                return !![];
                            switch (_0x378f72) {
                            case 'public':
                                return !![];
                            case 'private':
                            case 'self':
                                return ![];
                            case 'groups':
                                return _0x3a9fc3;
                            case 'inbox':
                                return !_0x3a9fc3;
                            default:
                                return !![];
                            }
                        })());
                        if (!_0x45e0a9)
                            return;
                        const _0x399e18 = await isBanned(_0x2b445d);
                        if (_0x399e18)
                            return;
                        if (_0x59531c['strictOwnerOnly']) {
                            const {isOwnerOnly: _0x48c7b6} = await import('./isOwner.js');
                            if (!_0x258b70['key']['fromMe'] && !_0x48c7b6(_0x2b445d)) {
                                return await _0x6f8f8['sendMessage'](_0x23a86a, {
                                    'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20bot\x20owner!*',
                                    ...channelInfo
                                }, { 'quoted': _0x258b70 });
                            }
                        }
                        if (_0x59531c['ownerOnly'] && !_0x258b70['key']['fromMe'] && !_0x3d3ad7) {
                            return await _0x6f8f8['sendMessage'](_0x23a86a, {
                                'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20owner\x20or\x20sudo\x20users!*',
                                ...channelInfo
                            }, { 'quoted': _0x258b70 });
                        }
                        if (_0x59531c['groupOnly'] && !_0x3a9fc3) {
                            return await _0x6f8f8['sendMessage'](_0x23a86a, {
                                'text': 'ℹ️\x20*This\x20command\x20can\x20only\x20be\x20used\x20in\x20groups!*',
                                ...channelInfo
                            }, { 'quoted': _0x258b70 });
                        }
                        let _0x40e064 = ![];
                        let _0x1b424a = ![];
                        if (_0x59531c['adminOnly'] && _0x3a9fc3) {
                            const _0x484b46 = await _0x0_0x1c957c(_0x6f8f8, _0x23a86a, _0x2b445d);
                            _0x40e064 = _0x484b46['isSenderAdmin'];
                            _0x1b424a = _0x484b46['isBotAdmin'];
                            if (!_0x1b424a) {
                                return await _0x6f8f8['sendMessage'](_0x23a86a, {
                                    'text': 'ℹ️\x20*Please\x20make\x20the\x20bot\x20an\x20admin\x20to\x20use\x20this\x20command.*',
                                    ...channelInfo
                                }, { 'quoted': _0x258b70 });
                            }
                            if (!_0x40e064 && !_0x258b70['key']['fromMe'] && !_0x3d3ad7) {
                                return await _0x6f8f8['sendMessage'](_0x23a86a, {
                                    'text': 'ℹ️\x20*Sorry,\x20only\x20group\x20admins\x20can\x20use\x20this\x20command.*',
                                    ...channelInfo
                                }, { 'quoted': _0x258b70 });
                            }
                        }
                        const _0x5ecf21 = {
                            'key': _0x258b70['key'],
                            'message': {
                                'extendedTextMessage': {
                                    'text': _0x2ec0fa + _0x234b0d,
                                    'contextInfo': _0x258b70['message']['stickerMessage']['contextInfo'] || {}
                                }
                            },
                            'messageTimestamp': _0x258b70['messageTimestamp'],
                            'pushName': _0x258b70['pushName'],
                            'broadcast': _0x258b70['broadcast']
                        };
                        const _0x4d7b0e = {
                            'chatId': _0x23a86a,
                            'senderId': _0x2b445d,
                            'isGroup': _0x3a9fc3,
                            'isSenderAdmin': _0x40e064,
                            'isBotAdmin': _0x1b424a,
                            'senderIsOwnerOrSudo': _0x3d3ad7,
                            'isOwnerOrSudoCheck': _0x5e3b86,
                            'channelInfo': channelInfo,
                            'rawText': _0x2ec0fa + _0x234b0d,
                            'userMessage': (_0x2ec0fa + _0x234b0d)['toLowerCase'](),
                            'messageText': _0x2ec0fa + _0x234b0d,
                            'config': _0x0_0x2a4136
                        };
                        try {
                            await _0x59531c['handler'](_0x6f8f8, _0x5ecf21, _0x3b2d18, _0x4d7b0e);
                            await addCommandReaction(_0x6f8f8, _0x258b70);
                            await showTypingAfterCommand(_0x6f8f8, _0x23a86a);
                            printLog('success', '✅\x20Sticker\x20command\x20executed:\x20' + _0x234b0d);
                        } catch (_0x32c793) {
                            printLog('error', '❌\x20Sticker\x20command\x20error\x20[' + _0x234b0d + ']:\x20' + _0x32c793['message']);
                            console['error'](_0x32c793['stack']);
                            await _0x6f8f8['sendMessage'](_0x23a86a, {
                                'text': '❌\x20Error\x20executing\x20sticker\x20command:\x20' + _0x32c793['message'],
                                ...channelInfo
                            }, { 'quoted': _0x258b70 });
                        }
                    } else {
                        printLog('warning', '⚠️\x20Sticker\x20command\x20not\x20found:\x20' + _0x234b0d);
                    }
                    return;
                }
            }
        }
        const _0x50ddc0 = _0x258b70['message']?.['conversation'] || _0x258b70['message']?.['extendedTextMessage']?.['text'] || _0x258b70['message']?.['imageMessage']?.['caption'] || _0x258b70['message']?.['videoMessage']?.['caption'] || _0x258b70['message']?.['buttonsResponseMessage']?.['selectedButtonId'] || '';
        const _0x127320 = _0x50ddc0['trim']();
        const _0x21749f = _0x127320['toLowerCase']();
        const _0x11ff78 = await isSudo(_0x2b445d);
        startSchedulerEngine(_0x6f8f8);
        if (!_0x258b70['key']['fromMe']) {
            const _0x46e251 = await handleAutoReply(_0x6f8f8, _0x23a86a, _0x258b70, _0x21749f);
            if (_0x46e251)
                return;
        }
        if (_0x258b70['message']?.['buttonsResponseMessage']) {
            const _0x40de40 = _0x258b70['message']['buttonsResponseMessage']['selectedButtonId'];
            printLog('info', 'Button\x20response:\x20' + _0x40de40);
            if (_0x40de40 === 'channel') {
                await _0x6f8f8['sendMessage'](_0x23a86a, { 'text': '*Join\x20our\x20Channel:*\x0a[https://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y](https://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y)' }, { 'quoted': _0x258b70 });
                return;
            } else if (_0x40de40 === 'owner') {
                const _0x2a4082 = (await import('../plugins/owner.js'))['default'];
                await _0x2a4082['handler']?.(_0x6f8f8, _0x23a86a, '', {});
                return;
            } else if (_0x40de40 === 'support') {
                await _0x6f8f8['sendMessage'](_0x23a86a, { 'text': '*Support*\x0a\x0ahttps://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y' }, { 'quoted': _0x258b70 });
                return;
            }
        }
        const _0x4941e5 = await isBanned(_0x2b445d);
        if (_0x4941e5 && !_0x21749f['startsWith']('.unban')) {
            if (Math['random']() < 0.1) {
                printLog('warning', 'Banned\x20user\x20attempted\x20command:\x20' + _0x2b445d['split']('@')[0x0]);
                await _0x6f8f8['sendMessage'](_0x23a86a, {
                    'text': 'You\x20are\x20banned\x20from\x20using\x20the\x20bot.\x20Contact\x20an\x20admin\x20to\x20get\x20unbanned.',
                    ...channelInfo
                });
            }
            return;
        }
        if (/^[1-9]$/['test'](_0x21749f) || _0x21749f === 'surrender') {
            await handleTicTacToeMove(_0x6f8f8, _0x23a86a, _0x2b445d, _0x21749f);
            return;
        }
        if (!_0x258b70['key']['fromMe']) {
            await _0x0_0x11a053['incrementMessageCount'](_0x23a86a, _0x2b445d, _0x258b70['pushName']);
        } else {
            const _0x5c8635 = _0x6f8f8['user']?.['id'] || _0x2b445d;
            const _0x2a8832 = _0x6f8f8['user']?.['name'] || _0x6f8f8['user']?.['notify'] || 'Me';
            await _0x0_0x11a053['incrementMessageCount'](_0x23a86a, _0x5c8635, _0x2a8832);
        }
        if (_0x3a9fc3) {
            if (_0x21749f) {
                await handleBadwordDetection(_0x6f8f8, _0x23a86a, _0x258b70, _0x21749f, _0x2b445d);
            }
            await handleLinkDetection(_0x6f8f8, _0x23a86a, _0x258b70, _0x21749f, _0x2b445d);
        }
        if (_0x3a9fc3 && !_0x258b70['key']['fromMe']) {
            const _0x1c5bf2 = await handleAntiSpam(_0x6f8f8, _0x23a86a, _0x258b70, _0x2b445d, _0x55a39c);
            if (_0x1c5bf2)
                return;
        }
        if (!_0x3a9fc3 && !_0x258b70['key']['fromMe'] && !_0x11ff78) {
            try {
                const _0x3e338c = (await import('../plugins/pmblocker.js'))['default'];
                const _0x4ee471 = _0x3e338c?.['readState'];
                const _0x5c0aea = await _0x4ee471();
                if (_0x5c0aea['enabled']) {
                    printLog('warning', 'PM\x20blocked\x20from:\x20' + _0x2b445d['split']('@')[0x0]);
                    await _0x6f8f8['sendMessage'](_0x23a86a, { 'text': _0x5c0aea['message'] || 'Private\x20messages\x20are\x20blocked.\x20Please\x20contact\x20the\x20owner\x20in\x20groups\x20only.' });
                    await new Promise(_0x40ea0f => setTimeout(_0x40ea0f, 0x5dc));
                    try {
                        await _0x6f8f8['updateBlockStatus'](_0x23a86a, 'block');
                        printLog('success', 'Blocked\x20user:\x20' + _0x2b445d['split']('@')[0x0]);
                    } catch (_0x558448) {
                        printLog('error', 'Failed\x20to\x20block\x20user:\x20' + _0x558448['message']);
                    }
                    return;
                }
            } catch (_0x4967ba) {
                printLog('error', 'PM\x20blocker\x20error:\x20' + _0x4967ba['message']);
            }
        }
        const _0x1212c5 = _0x0_0x2a4136['prefixes']?.['find'](_0x1c825f => _0x21749f['startsWith'](_0x1c825f));
        const _0x203ad5 = _0x0_0x4f7bfa['getCommand'](_0x21749f, _0x0_0x2a4136['prefixes']);
        if (!_0x1212c5 && !_0x203ad5) {
            await handleAutotypingForMessage(_0x6f8f8, _0x23a86a, _0x21749f);
            if (_0x3a9fc3) {
                await handleTagDetection(_0x6f8f8, _0x23a86a, _0x258b70, _0x2b445d);
                await handleMentionDetection(_0x6f8f8, _0x23a86a, _0x258b70);
                const _0x1b05d0 = await _0x0_0x11a053['getBotMode']();
                const _0x439caf = _0x1b05d0 === 'public' || _0x1b05d0 === 'groups' && _0x3a9fc3 || _0x1b05d0 === 'inbox' && !_0x3a9fc3 || _0xc418a6;
                if (_0x439caf) {
                    await handleChatbotResponse(_0x6f8f8, _0x23a86a, _0x258b70, _0x21749f, _0x2b445d);
                }
            }
            return;
        }
        if (!_0x203ad5) {
            if (_0x3a9fc3) {
                await handleTagDetection(_0x6f8f8, _0x23a86a, _0x258b70, _0x2b445d);
                await handleMentionDetection(_0x6f8f8, _0x23a86a, _0x258b70);
                const _0x15fd8a = await _0x0_0x11a053['getBotMode']();
                const _0x940847 = _0x15fd8a === 'public' || _0x15fd8a === 'groups' && _0x3a9fc3 || _0x15fd8a === 'inbox' && !_0x3a9fc3 || _0xc418a6;
                if (_0x940847) {
                    await handleChatbotResponse(_0x6f8f8, _0x23a86a, _0x258b70, _0x21749f, _0x2b445d);
                }
            }
            return;
        }
        const _0x479aae = ((() => {
            if (_0xc418a6)
                return !![];
            switch (_0x317a2a) {
            case 'public':
                return !![];
            case 'private':
            case 'self':
                return ![];
            case 'groups':
                return _0x3a9fc3;
            case 'inbox':
                return !_0x3a9fc3;
            default:
                return !![];
            }
        })());
        if (!_0x479aae) {
            return;
        }
        let _0x36416b;
        if (_0x1212c5) {
            const _0x4274b5 = _0x127320['slice'](_0x1212c5['length'])['trim']();
            _0x36416b = _0x4274b5['split'](/\s+/)['slice'](0x1);
        } else {
            _0x36416b = _0x127320['trim']()['split'](/\s+/)['slice'](0x1);
        }
        if (_0x203ad5['strictOwnerOnly']) {
            const {isOwnerOnly: _0x50476d} = await import('./isOwner.js');
            if (!_0x258b70['key']['fromMe'] && !_0x50476d(_0x2b445d)) {
                return await _0x6f8f8['sendMessage'](_0x23a86a, {
                    'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20bot\x20owner!*\x0a\x0a_Sudo\x20users\x20cannot\x20manage\x20other\x20sudo\x20users._',
                    ...channelInfo
                }, { 'quoted': _0x258b70 });
            }
        }
        if (_0x203ad5['ownerOnly'] && !_0x258b70['key']['fromMe'] && !_0x55a39c) {
            return await _0x6f8f8['sendMessage'](_0x23a86a, {
                'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20owner\x20or\x20sudo\x20users!*',
                ...channelInfo
            }, { 'quoted': _0x258b70 });
        }
        if (_0x203ad5['groupOnly'] && !_0x3a9fc3) {
            return await _0x6f8f8['sendMessage'](_0x23a86a, {
                'text': 'ℹ️\x20*This\x20command\x20can\x20only\x20be\x20used\x20in\x20groups!*',
                ...channelInfo
            }, { 'quoted': _0x258b70 });
        }
        let _0x375611 = ![];
        let _0x436a88 = ![];
        if (_0x203ad5['adminOnly'] && _0x3a9fc3) {
            const _0x14bb78 = await _0x0_0x1c957c(_0x6f8f8, _0x23a86a, _0x2b445d);
            _0x375611 = _0x14bb78['isSenderAdmin'];
            _0x436a88 = _0x14bb78['isBotAdmin'];
            if (!_0x436a88) {
                return await _0x6f8f8['sendMessage'](_0x23a86a, {
                    'text': 'ℹ️\x20*Please\x20make\x20the\x20bot\x20an\x20admin\x20to\x20use\x20this\x20command.*',
                    ...channelInfo
                }, { 'quoted': _0x258b70 });
            }
            if (!_0x375611 && !_0x258b70['key']['fromMe'] && !_0x55a39c) {
                return await _0x6f8f8['sendMessage'](_0x23a86a, {
                    'text': 'ℹ️\x20*Sorry,\x20only\x20group\x20admins\x20can\x20use\x20this\x20command.*',
                    ...channelInfo
                }, { 'quoted': _0x258b70 });
            }
        }
        const _0x2fc6ca = {
            'chatId': _0x23a86a,
            'senderId': _0x2b445d,
            'isGroup': _0x3a9fc3,
            'isSenderAdmin': _0x375611,
            'isBotAdmin': _0x436a88,
            'senderIsOwnerOrSudo': _0x55a39c,
            'isOwnerOrSudoCheck': _0xc418a6,
            'channelInfo': channelInfo,
            'rawText': _0x50ddc0,
            'userMessage': _0x21749f,
            'messageText': _0x127320,
            'config': _0x0_0x2a4136
        };
        try {
            await _0x203ad5['handler'](_0x6f8f8, _0x258b70, _0x36416b, _0x2fc6ca);
            await addCommandReaction(_0x6f8f8, _0x258b70);
            await showTypingAfterCommand(_0x6f8f8, _0x23a86a);
        } catch (_0x2a907c) {
            printLog('error', 'Command\x20error\x20[' + _0x203ad5['command'] + ']:\x20' + _0x2a907c['message']);
            console['error'](_0x2a907c['stack']);
            await _0x6f8f8['sendMessage'](_0x23a86a, {
                'text': '❌\x20Error\x20executing\x20command:\x20' + _0x2a907c['message'],
                ...channelInfo
            }, { 'quoted': _0x258b70 });
            const _0x4acb51 = {
                'command': _0x203ad5['command'],
                'error': _0x2a907c['message'],
                'stack': _0x2a907c['stack'],
                'timestamp': new Date()['toISOString'](),
                'user': _0x2b445d,
                'chat': _0x23a86a
            };
            try {
                writeErrorLog(_0x4acb51);
            } catch (_0x8660ee) {
                printLog('error', 'Failed\x20to\x20write\x20error\x20log:\x20' + _0x8660ee['message']);
            }
        }
    } catch (_0xf2df27) {
        printLog('error', 'Message\x20handler\x20error:\x20' + _0xf2df27['message']);
        console['error'](_0xf2df27['stack']);
        const _0x5c4205 = _0x76c97['messages']?.[0x0]?.['key']?.['remoteJid'];
        if (_0x5c4205) {
            try {
                await _0x6f8f8['sendMessage'](_0x5c4205, {
                    'text': 'ℹ️\x20*Failed\x20to\x20process\x20message!*',
                    ...channelInfo
                });
            } catch (_0x1f79d9) {
                printLog('error', 'Failed\x20to\x20send\x20error\x20message:\x20' + _0x1f79d9['message']);
            }
        }
    }
}
async function handleGroupParticipantUpdate(_0x37f684, _0xe0d0c1) {
    try {
        const {
            id: _0x15f644,
            participants: _0x567803,
            action: _0x4a0aa1,
            author: _0x47e7d9
        } = _0xe0d0c1;
        if (!_0x15f644['endsWith']('@g.us'))
            return;
        const _0x33a750 = await _0x0_0x11a053['getBotMode']();
        const _0x7aa2b0 = _0x47e7d9 ? await _0x0_0x4ae1da(_0x47e7d9, _0x37f684, _0x15f644) : ![];
        const _0x109883 = _0x47e7d9 ? _0x47e7d9 === _0x37f684['user']['id'] || _0x47e7d9 === _0x37f684['user']['id']['split'](':')[0x0] + '@s.whatsapp.net' : ![];
        const _0x288f94 = _0x109883 || _0x7aa2b0;
        if ((_0x33a750 === 'private' || _0x33a750 === 'self') && !_0x288f94) {
            return;
        }
        invalidateGroupCache(_0x15f644);
        if (!_0x15f644['endsWith']('@g.us'))
            return;
        printLog('info', 'Group\x20update:\x20' + _0x4a0aa1 + '\x20in\x20' + _0x15f644['split']('@')[0x0]);
        const _0x57a3ab = _0x33a750 === 'public' || _0x33a750 === 'groups' || _0x288f94;
        switch (_0x4a0aa1) {
        case 'promote':
            if (!_0x57a3ab)
                return;
            if (_0x567803 && _0x567803['length'] > 0x0) {
                const _0x39f179 = Array['isArray'](_0x567803) ? _0x567803[0x0] : _0x567803;
            }
            const _0x4e0f2b = (await import('../plugins/promote.js'))['default']?.['handlePromotionEvent'];
            await _0x4e0f2b(_0x37f684, _0x15f644, _0x567803, _0x47e7d9);
            break;
        case 'demote':
            if (!_0x57a3ab)
                return;
            if (_0x567803 && _0x567803['length'] > 0x0) {
                const _0x442631 = Array['isArray'](_0x567803) ? _0x567803[0x0] : _0x567803;
            }
            const _0x145ab0 = (await import('../plugins/demote.js'))['default']?.['handleDemotionEvent'];
            await _0x145ab0(_0x37f684, _0x15f644, _0x567803, _0x47e7d9);
            break;
        case 'add':
            if (_0x567803 && _0x567803['length'] > 0x0) {
                const _0x6081e6 = Array['isArray'](_0x567803) ? _0x567803[0x0] : _0x567803;
            }
            const {handleJoinEvent: _0x504295} = await import('../plugins/welcome.js');
            await _0x504295(_0x37f684, _0x15f644, _0x567803);
            break;
        case 'remove':
            if (_0x567803 && _0x567803['length'] > 0x0) {
                const _0x39771c = Array['isArray'](_0x567803) ? _0x567803[0x0] : _0x567803;
            }
            const _0xb0380 = (await import('../plugins/goodbye.js'))['default']?.['handleLeaveEvent'];
            await _0xb0380(_0x37f684, _0x15f644, _0x567803);
            break;
        default:
            printLog('warning', 'Unhandled\x20group\x20action:\x20' + _0x4a0aa1);
        }
    } catch (_0xfaee71) {
        printLog('error', 'Group\x20update\x20error:\x20' + _0xfaee71['message']);
        console['error'](_0xfaee71['stack']);
    }
}
async function handleStatus(_0x548dbd, _0x34b6d8) {
    try {
        const {default: _0x3fabc5} = await import('../plugins/autostatus.js');
        const _0x55d164 = _0x3fabc5['handleStatusUpdate'];
        await _0x55d164(_0x548dbd, _0x34b6d8);
    } catch (_0x31c6ae) {
        printLog('error', 'Status\x20handler\x20error:\x20' + _0x31c6ae['message']);
        console['error'](_0x31c6ae['stack']);
    }
}
async function handleCall(_0x22bdc0, _0x594bc0) {
    try {
        const _0x55df31 = (await import('../plugins/anticall.js'))['default'];
        const _0x4f6934 = _0x55df31['readState'] ? await _0x55df31['readState']() : { 'enabled': ![] };
        if (!_0x4f6934['enabled'])
            return;
        const _0x1c121a = new Set();
        for (const _0x512b38 of _0x594bc0) {
            const _0x5cec20 = _0x512b38['from'] || _0x512b38['peerJid'] || _0x512b38['chatId'];
            if (!_0x5cec20)
                continue;
            try {
                try {
                    if (typeof _0x22bdc0['rejectCall'] === 'function' && _0x512b38['id']) {
                        await _0x22bdc0['rejectCall'](_0x512b38['id'], _0x5cec20);
                    } else if (typeof _0x22bdc0['sendCallOfferAck'] === 'function' && _0x512b38['id']) {
                        await _0x22bdc0['sendCallOfferAck'](_0x512b38['id'], _0x5cec20, 'reject');
                    }
                } catch (_0x282993) {
                    printLog('error', 'Error\x20rejecting\x20call:\x20' + _0x282993['message']);
                }
                if (!_0x1c121a['has'](_0x5cec20)) {
                    _0x1c121a['add'](_0x5cec20);
                    setTimeout(() => _0x1c121a['delete'](_0x5cec20), 0xea60);
                    await _0x22bdc0['sendMessage'](_0x5cec20, { 'text': '📵\x20Anticall\x20is\x20enabled.\x20Your\x20call\x20was\x20rejected\x20and\x20you\x20will\x20be\x20blocked.' });
                    printLog('info', 'Sent\x20anticall\x20warning\x20to:\x20' + _0x5cec20['split']('@')[0x0]);
                }
                setTimeout(async () => {
                    try {
                        await _0x22bdc0['updateBlockStatus'](_0x5cec20, 'block');
                        printLog('success', 'Blocked\x20caller:\x20' + _0x5cec20['split']('@')[0x0]);
                    } catch (_0x1d2df2) {
                        printLog('error', 'Error\x20blocking\x20caller:\x20' + _0x1d2df2['message']);
                    }
                }, 0x320);
            } catch (_0x33eebe) {
                printLog('error', 'Error\x20handling\x20call\x20from\x20' + _0x5cec20['split']('@')[0x0] + ':\x20' + _0x33eebe['message']);
            }
        }
    } catch (_0x5bfa06) {
        printLog('error', 'Call\x20handler\x20error:\x20' + _0x5bfa06['message']);
        console['error'](_0x5bfa06['stack']);
    }
}
export {
    handleMessages,
    handleGroupParticipantUpdate,
    handleStatus,
    handleCall
};