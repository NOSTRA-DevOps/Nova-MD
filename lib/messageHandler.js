import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0xff8758 from 'fs';
import { dataFile } from './paths.js';
import _0x0_0x130c02 from '../config.js';
import _0x0_0x4c4533 from './lightweight_store.js';
import _0x0_0x300a1e from './commandHandler.js';
import {
    printMessage,
    printLog
} from './print.js';
import { isBanned } from './isBanned.js';
import { isSudo } from './index.js';
import _0x0_0x28ec47 from './isOwner.js';
import _0x0_0x58799a from './isAdmin.js';
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
import { handleChatbotResponse } from './Chatbots.js';
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
        const _0x8056b2 = await _0x0_0x4c4533['getSetting']('global', 'stickerCommands');
        return _0x8056b2 || {};
    } else {
        try {
            if (!_0x0_0xff8758['existsSync'](STICKER_FILE)) {
                return {};
            }
            return JSON['parse'](_0x0_0xff8758['readFileSync'](STICKER_FILE, 'utf8'));
        } catch {
            return {};
        }
    }
}
async function handleMessages(_0x5f00f0, _0x561676) {
    try {
        const {
            messages: _0x31747e,
            type: _0x2d0644
        } = _0x561676;
        if (_0x2d0644 !== 'notify')
            return;
        const _0x112873 = _0x31747e[0x0];
        if (!_0x112873?.['message'])
            return;
        const _0x35311d = _0x112873['key']['remoteJid'];
        const _0xb6302a = _0x35311d['endsWith']('@g.us');
        const _0x3db7b5 = _0x112873['key']['participant'] || _0x112873['key']['remoteJid'];
        const _0xcf37eb = await _0x0_0x28ec47(_0x3db7b5, _0x5f00f0, _0x35311d);
        const _0x2342f0 = _0x112873['key']['fromMe'] || _0xcf37eb;
        const _0x357529 = await _0x0_0x4c4533['getBotMode']();
        if ((_0x357529 === 'private' || _0x357529 === 'self') && !_0x2342f0) {
            return;
        }
        await printMessage(_0x112873, _0x5f00f0);
        try {
            const _0x59d216 = await _0x0_0x4c4533['getSetting']('global', 'stealthMode');
            if (!_0x59d216 || !_0x59d216['enabled']) {
                await handleAutoread(_0x5f00f0, _0x112873);
            } else {
                printLog('info', '👻\x20Stealth\x20mode\x20active');
            }
        } catch (_0x24de2d) {
            await handleAutoread(_0x5f00f0, _0x112873);
        }
        if (_0x112873['message']?.['protocolMessage']?.['type'] === 0x0) {
            printLog('info', 'Message\x20deletion\x20detected');
            await handleMessageRevocation(_0x5f00f0, _0x112873);
            return;
        }
        await storeMessage(_0x5f00f0, _0x112873);
        if (_0x112873['pushName'] && _0x5f00f0['store']?.['contacts']) {
            const _0x3a96a4 = _0x112873['key']['participant'] || _0x112873['key']['remoteJid'];
            if (_0x3a96a4) {
                _0x5f00f0['store']['contacts'][_0x3a96a4] = {
                    ..._0x5f00f0['store']['contacts'][_0x3a96a4],
                    'id': _0x3a96a4,
                    'notify': _0x112873['pushName'],
                    'name': _0x112873['pushName']
                };
                const _0x10efdf = _0x5f00f0['decodeJid']?.(_0x3a96a4);
                if (_0x10efdf && _0x10efdf !== _0x3a96a4) {
                    _0x5f00f0['store']['contacts'][_0x10efdf] = {
                        ..._0x5f00f0['store']['contacts'][_0x10efdf],
                        'id': _0x10efdf,
                        'notify': _0x112873['pushName'],
                        'name': _0x112873['pushName']
                    };
                }
            }
        }
        const _0x37f88a = _0x112873['key']['participant'] || _0x112873['key']['remoteJid'];
        if (_0x37f88a?.['includes']('@lid') && _0x5f00f0['store']?.['contacts']) {
            const _0x3fcbb5 = _0x5f00f0['store']['contacts'];
            const _0x3f59ec = Object['keys'](_0x3fcbb5)['find'](_0x56ffbc => _0x3fcbb5[_0x56ffbc]?.['lid'] === _0x37f88a || _0x3fcbb5[_0x56ffbc]?.['lid']?.['split'](':')[0x0] === _0x37f88a['split']('@')[0x0]);
            if (_0x3f59ec?.['includes']('@s.whatsapp.net'))
                _0x3db7b5 = _0x3f59ec;
        }
        if (_0x112873['message']?.['stickerMessage']) {
            const _0x2f2538 = _0x112873['message']['stickerMessage']['fileSha256'];
            if (_0x2f2538) {
                const _0xe325a = Buffer['from'](_0x2f2538)['toString']('base64');
                const _0x48a488 = await getStickerCommands();
                if (_0x48a488[_0xe325a]) {
                    const _0xbdec7c = _0x48a488[_0xe325a]['text'];
                    const [_0x28352a, ..._0x406d31] = _0xbdec7c['split']('\x20');
                    let _0x4f02b2 = null;
                    let _0x434753 = '';
                    for (const _0x3c9079 of _0x0_0x130c02['prefixes']) {
                        const _0x457c6c = (_0x3c9079 + _0x28352a)['toLowerCase']();
                        _0x4f02b2 = _0x0_0x300a1e['getCommand'](_0x457c6c, _0x0_0x130c02['prefixes']);
                        if (_0x4f02b2) {
                            _0x434753 = _0x3c9079;
                            break;
                        }
                    }
                    if (_0x4f02b2) {
                        const _0x2f4637 = await isSudo(_0x3db7b5);
                        const _0x2f30cf = await _0x0_0x28ec47(_0x3db7b5, _0x5f00f0, _0x35311d);
                        const _0x2a12b9 = _0x112873['key']['fromMe'] || _0x2f30cf;
                        const _0x129d3c = await _0x0_0x4c4533['getBotMode']();
                        const _0x15af11 = ((() => {
                            if (_0x2a12b9)
                                return !![];
                            switch (_0x129d3c) {
                            case 'public':
                                return !![];
                            case 'private':
                            case 'self':
                                return ![];
                            case 'groups':
                                return _0xb6302a;
                            case 'inbox':
                                return !_0xb6302a;
                            default:
                                return !![];
                            }
                        })());
                        if (!_0x15af11)
                            return;
                        const _0x493426 = await isBanned(_0x3db7b5);
                        if (_0x493426)
                            return;
                        if (_0x4f02b2['strictOwnerOnly']) {
                            const {isOwnerOnly: _0x2e0531} = await import('./isOwner.js');
                            if (!_0x112873['key']['fromMe'] && !_0x2e0531(_0x3db7b5)) {
                                return await _0x5f00f0['sendMessage'](_0x35311d, {
                                    'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20bot\x20owner!*',
                                    ...channelInfo
                                }, { 'quoted': _0x112873 });
                            }
                        }
                        if (_0x4f02b2['ownerOnly'] && !_0x112873['key']['fromMe'] && !_0x2f30cf) {
                            return await _0x5f00f0['sendMessage'](_0x35311d, {
                                'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20owner\x20or\x20sudo\x20users!*',
                                ...channelInfo
                            }, { 'quoted': _0x112873 });
                        }
                        if (_0x4f02b2['groupOnly'] && !_0xb6302a) {
                            return await _0x5f00f0['sendMessage'](_0x35311d, {
                                'text': 'ℹ️\x20*This\x20command\x20can\x20only\x20be\x20used\x20in\x20groups!*',
                                ...channelInfo
                            }, { 'quoted': _0x112873 });
                        }
                        let _0x537ef0 = ![];
                        let _0xe71c32 = ![];
                        if (_0x4f02b2['adminOnly'] && _0xb6302a) {
                            const _0x3e2a3d = await _0x0_0x58799a(_0x5f00f0, _0x35311d, _0x3db7b5);
                            _0x537ef0 = _0x3e2a3d['isSenderAdmin'];
                            _0xe71c32 = _0x3e2a3d['isBotAdmin'];
                            if (!_0xe71c32) {
                                return await _0x5f00f0['sendMessage'](_0x35311d, {
                                    'text': 'ℹ️\x20*Please\x20make\x20the\x20bot\x20an\x20admin\x20to\x20use\x20this\x20command.*',
                                    ...channelInfo
                                }, { 'quoted': _0x112873 });
                            }
                            if (!_0x537ef0 && !_0x112873['key']['fromMe'] && !_0x2f30cf) {
                                return await _0x5f00f0['sendMessage'](_0x35311d, {
                                    'text': 'ℹ️\x20*Sorry,\x20only\x20group\x20admins\x20can\x20use\x20this\x20command.*',
                                    ...channelInfo
                                }, { 'quoted': _0x112873 });
                            }
                        }
                        const _0x318510 = {
                            'key': _0x112873['key'],
                            'message': {
                                'extendedTextMessage': {
                                    'text': _0x434753 + _0xbdec7c,
                                    'contextInfo': _0x112873['message']['stickerMessage']['contextInfo'] || {}
                                }
                            },
                            'messageTimestamp': _0x112873['messageTimestamp'],
                            'pushName': _0x112873['pushName'],
                            'broadcast': _0x112873['broadcast']
                        };
                        const _0x52292e = {
                            'chatId': _0x35311d,
                            'senderId': _0x3db7b5,
                            'isGroup': _0xb6302a,
                            'isSenderAdmin': _0x537ef0,
                            'isBotAdmin': _0xe71c32,
                            'senderIsOwnerOrSudo': _0x2f30cf,
                            'isOwnerOrSudoCheck': _0x2a12b9,
                            'channelInfo': channelInfo,
                            'rawText': _0x434753 + _0xbdec7c,
                            'userMessage': (_0x434753 + _0xbdec7c)['toLowerCase'](),
                            'messageText': _0x434753 + _0xbdec7c,
                            'config': _0x0_0x130c02
                        };
                        try {
                            await _0x4f02b2['handler'](_0x5f00f0, _0x318510, _0x406d31, _0x52292e);
                            await addCommandReaction(_0x5f00f0, _0x112873);
                            await showTypingAfterCommand(_0x5f00f0, _0x35311d);
                            printLog('success', '✅\x20Sticker\x20command\x20executed:\x20' + _0xbdec7c);
                        } catch (_0x22b679) {
                            printLog('error', '❌\x20Sticker\x20command\x20error\x20[' + _0xbdec7c + ']:\x20' + _0x22b679['message']);
                            console['error'](_0x22b679['stack']);
                            await _0x5f00f0['sendMessage'](_0x35311d, {
                                'text': '❌\x20Error\x20executing\x20sticker\x20command:\x20' + _0x22b679['message'],
                                ...channelInfo
                            }, { 'quoted': _0x112873 });
                        }
                    } else {
                        printLog('warning', '⚠️\x20Sticker\x20command\x20not\x20found:\x20' + _0xbdec7c);
                    }
                    return;
                }
            }
        }
        const _0x3a91a4 = _0x112873['message']?.['conversation'] || _0x112873['message']?.['extendedTextMessage']?.['text'] || _0x112873['message']?.['imageMessage']?.['caption'] || _0x112873['message']?.['videoMessage']?.['caption'] || _0x112873['message']?.['buttonsResponseMessage']?.['selectedButtonId'] || '';
        const _0x56c5e3 = _0x3a91a4['trim']();
        const _0xfbfaf = _0x56c5e3['toLowerCase']();
        const _0x545feb = await isSudo(_0x3db7b5);
        startSchedulerEngine(_0x5f00f0);
        if (!_0x112873['key']['fromMe']) {
            const _0x5bb6b4 = await handleAutoReply(_0x5f00f0, _0x35311d, _0x112873, _0xfbfaf);
            if (_0x5bb6b4)
                return;
        }
        if (_0x112873['message']?.['buttonsResponseMessage']) {
            const _0x5afc31 = _0x112873['message']['buttonsResponseMessage']['selectedButtonId'];
            printLog('info', 'Button\x20response:\x20' + _0x5afc31);
            if (_0x5afc31 === 'channel') {
                await _0x5f00f0['sendMessage'](_0x35311d, { 'text': '*Join\x20our\x20Channel:*\x0a[https://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y](https://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y)' }, { 'quoted': _0x112873 });
                return;
            } else if (_0x5afc31 === 'owner') {
                const _0x3826b1 = (await import('../plugins/owner.js'))['default'];
                await _0x3826b1['handler']?.(_0x5f00f0, _0x35311d, '', {});
                return;
            } else if (_0x5afc31 === 'support') {
                await _0x5f00f0['sendMessage'](_0x35311d, { 'text': '*Support*\x0a\x0ahttps://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y' }, { 'quoted': _0x112873 });
                return;
            }
        }
        const _0x1d85ef = await isBanned(_0x3db7b5);
        if (_0x1d85ef && !_0xfbfaf['startsWith']('.unban')) {
            if (Math['random']() < 0.1) {
                printLog('warning', 'Banned\x20user\x20attempted\x20command:\x20' + _0x3db7b5['split']('@')[0x0]);
                await _0x5f00f0['sendMessage'](_0x35311d, {
                    'text': 'You\x20are\x20banned\x20from\x20using\x20the\x20bot.\x20Contact\x20an\x20admin\x20to\x20get\x20unbanned.',
                    ...channelInfo
                });
            }
            return;
        }
        if (/^[1-9]$/['test'](_0xfbfaf) || _0xfbfaf === 'surrender') {
            await handleTicTacToeMove(_0x5f00f0, _0x35311d, _0x3db7b5, _0xfbfaf);
            return;
        }
        if (!_0x112873['key']['fromMe']) {
            await _0x0_0x4c4533['incrementMessageCount'](_0x35311d, _0x3db7b5, _0x112873['pushName']);
        } else {
            const _0x3b03d3 = _0x5f00f0['user']?.['id'] || _0x3db7b5;
            const _0x3f207a = _0x5f00f0['user']?.['name'] || _0x5f00f0['user']?.['notify'] || 'Me';
            await _0x0_0x4c4533['incrementMessageCount'](_0x35311d, _0x3b03d3, _0x3f207a);
        }
        if (_0xb6302a) {
            if (_0xfbfaf) {
                await handleBadwordDetection(_0x5f00f0, _0x35311d, _0x112873, _0xfbfaf, _0x3db7b5);
            }
            await handleLinkDetection(_0x5f00f0, _0x35311d, _0x112873, _0xfbfaf, _0x3db7b5);
        }
        if (_0xb6302a && !_0x112873['key']['fromMe']) {
            const _0x2f6ff0 = await handleAntiSpam(_0x5f00f0, _0x35311d, _0x112873, _0x3db7b5, _0xcf37eb);
            if (_0x2f6ff0)
                return;
        }
        if (!_0xb6302a && !_0x112873['key']['fromMe'] && !_0x545feb) {
            try {
                const _0x2712d8 = (await import('../plugins/pmblocker.js'))['default'];
                const _0x3e5437 = _0x2712d8?.['readState'];
                const _0x1d16e4 = await _0x3e5437();
                if (_0x1d16e4['enabled']) {
                    printLog('warning', 'PM\x20blocked\x20from:\x20' + _0x3db7b5['split']('@')[0x0]);
                    await _0x5f00f0['sendMessage'](_0x35311d, { 'text': _0x1d16e4['message'] || 'Private\x20messages\x20are\x20blocked.\x20Please\x20contact\x20the\x20owner\x20in\x20groups\x20only.' });
                    await new Promise(_0x4e4a15 => setTimeout(_0x4e4a15, 0x5dc));
                    try {
                        await _0x5f00f0['updateBlockStatus'](_0x35311d, 'block');
                        printLog('success', 'Blocked\x20user:\x20' + _0x3db7b5['split']('@')[0x0]);
                    } catch (_0x560d9a) {
                        printLog('error', 'Failed\x20to\x20block\x20user:\x20' + _0x560d9a['message']);
                    }
                    return;
                }
            } catch (_0x53f6e1) {
                printLog('error', 'PM\x20blocker\x20error:\x20' + _0x53f6e1['message']);
            }
        }
        const _0x30151a = _0x0_0x130c02['prefixes']?.['find'](_0x2e9184 => _0xfbfaf['startsWith'](_0x2e9184));
        const _0xbd7fad = _0x0_0x300a1e['getCommand'](_0xfbfaf, _0x0_0x130c02['prefixes']);
        if (!_0x30151a && !_0xbd7fad) {
            await handleAutotypingForMessage(_0x5f00f0, _0x35311d, _0xfbfaf);
            if (_0xb6302a) {
                await handleTagDetection(_0x5f00f0, _0x35311d, _0x112873, _0x3db7b5);
                await handleMentionDetection(_0x5f00f0, _0x35311d, _0x112873);
                const _0x2dda6b = await _0x0_0x4c4533['getBotMode']();
                const _0x43b5f5 = _0x2dda6b === 'public' || _0x2dda6b === 'groups' && _0xb6302a || _0x2dda6b === 'inbox' && !_0xb6302a || _0x2342f0;
                if (_0x43b5f5) {
                    await handleChatbotResponse(_0x5f00f0, _0x35311d, _0x112873, _0xfbfaf, _0x3db7b5);
                }
            }
            return;
        }
        if (!_0xbd7fad) {
            if (_0xb6302a) {
                await handleTagDetection(_0x5f00f0, _0x35311d, _0x112873, _0x3db7b5);
                await handleMentionDetection(_0x5f00f0, _0x35311d, _0x112873);
                const _0xd3a914 = await _0x0_0x4c4533['getBotMode']();
                const _0x2e0355 = _0xd3a914 === 'public' || _0xd3a914 === 'groups' && _0xb6302a || _0xd3a914 === 'inbox' && !_0xb6302a || _0x2342f0;
                if (_0x2e0355) {
                    await handleChatbotResponse(_0x5f00f0, _0x35311d, _0x112873, _0xfbfaf, _0x3db7b5);
                }
            }
            return;
        }
        const _0x3d2fb3 = ((() => {
            if (_0x2342f0)
                return !![];
            switch (_0x357529) {
            case 'public':
                return !![];
            case 'private':
            case 'self':
                return ![];
            case 'groups':
                return _0xb6302a;
            case 'inbox':
                return !_0xb6302a;
            default:
                return !![];
            }
        })());
        if (!_0x3d2fb3) {
            return;
        }
        let _0x3ce4ed;
        if (_0x30151a) {
            const _0x5bae04 = _0x56c5e3['slice'](_0x30151a['length'])['trim']();
            _0x3ce4ed = _0x5bae04['split'](/\s+/)['slice'](0x1);
        } else {
            _0x3ce4ed = _0x56c5e3['trim']()['split'](/\s+/)['slice'](0x1);
        }
        if (_0xbd7fad['strictOwnerOnly']) {
            const {isOwnerOnly: _0x14170b} = await import('./isOwner.js');
            if (!_0x112873['key']['fromMe'] && !_0x14170b(_0x3db7b5)) {
                return await _0x5f00f0['sendMessage'](_0x35311d, {
                    'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20bot\x20owner!*\x0a\x0a_Sudo\x20users\x20cannot\x20manage\x20other\x20sudo\x20users._',
                    ...channelInfo
                }, { 'quoted': _0x112873 });
            }
        }
        if (_0xbd7fad['ownerOnly'] && !_0x112873['key']['fromMe'] && !_0xcf37eb) {
            return await _0x5f00f0['sendMessage'](_0x35311d, {
                'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20owner\x20or\x20sudo\x20users!*',
                ...channelInfo
            }, { 'quoted': _0x112873 });
        }
        if (_0xbd7fad['groupOnly'] && !_0xb6302a) {
            return await _0x5f00f0['sendMessage'](_0x35311d, {
                'text': 'ℹ️\x20*This\x20command\x20can\x20only\x20be\x20used\x20in\x20groups!*',
                ...channelInfo
            }, { 'quoted': _0x112873 });
        }
        let _0x56c74f = ![];
        let _0x1b22c1 = ![];
        if (_0xbd7fad['adminOnly'] && _0xb6302a) {
            const _0x5d79db = await _0x0_0x58799a(_0x5f00f0, _0x35311d, _0x3db7b5);
            _0x56c74f = _0x5d79db['isSenderAdmin'];
            _0x1b22c1 = _0x5d79db['isBotAdmin'];
            if (!_0x1b22c1) {
                return await _0x5f00f0['sendMessage'](_0x35311d, {
                    'text': 'ℹ️\x20*Please\x20make\x20the\x20bot\x20an\x20admin\x20to\x20use\x20this\x20command.*',
                    ...channelInfo
                }, { 'quoted': _0x112873 });
            }
            if (!_0x56c74f && !_0x112873['key']['fromMe'] && !_0xcf37eb) {
                return await _0x5f00f0['sendMessage'](_0x35311d, {
                    'text': 'ℹ️\x20*Sorry,\x20only\x20group\x20admins\x20can\x20use\x20this\x20command.*',
                    ...channelInfo
                }, { 'quoted': _0x112873 });
            }
        }
        const _0x4824e5 = {
            'chatId': _0x35311d,
            'senderId': _0x3db7b5,
            'isGroup': _0xb6302a,
            'isSenderAdmin': _0x56c74f,
            'isBotAdmin': _0x1b22c1,
            'senderIsOwnerOrSudo': _0xcf37eb,
            'isOwnerOrSudoCheck': _0x2342f0,
            'channelInfo': channelInfo,
            'rawText': _0x3a91a4,
            'userMessage': _0xfbfaf,
            'messageText': _0x56c5e3,
            'config': _0x0_0x130c02
        };
        try {
            await _0xbd7fad['handler'](_0x5f00f0, _0x112873, _0x3ce4ed, _0x4824e5);
            await addCommandReaction(_0x5f00f0, _0x112873);
            await showTypingAfterCommand(_0x5f00f0, _0x35311d);
        } catch (_0x5a3879) {
            printLog('error', 'Command\x20error\x20[' + _0xbd7fad['command'] + ']:\x20' + _0x5a3879['message']);
            console['error'](_0x5a3879['stack']);
            await _0x5f00f0['sendMessage'](_0x35311d, {
                'text': '❌\x20Error\x20executing\x20command:\x20' + _0x5a3879['message'],
                ...channelInfo
            }, { 'quoted': _0x112873 });
            const _0x5cbb12 = {
                'command': _0xbd7fad['command'],
                'error': _0x5a3879['message'],
                'stack': _0x5a3879['stack'],
                'timestamp': new Date()['toISOString'](),
                'user': _0x3db7b5,
                'chat': _0x35311d
            };
            try {
                writeErrorLog(_0x5cbb12);
            } catch (_0x545e62) {
                printLog('error', 'Failed\x20to\x20write\x20error\x20log:\x20' + _0x545e62['message']);
            }
        }
    } catch (_0x61f1f9) {
        printLog('error', 'Message\x20handler\x20error:\x20' + _0x61f1f9['message']);
        console['error'](_0x61f1f9['stack']);
        const _0x25f31c = _0x561676['messages']?.[0x0]?.['key']?.['remoteJid'];
        if (_0x25f31c) {
            try {
                await _0x5f00f0['sendMessage'](_0x25f31c, {
                    'text': 'ℹ️\x20*Failed\x20to\x20process\x20message!*',
                    ...channelInfo
                });
            } catch (_0xc63f38) {
                printLog('error', 'Failed\x20to\x20send\x20error\x20message:\x20' + _0xc63f38['message']);
            }
        }
    }
}
async function handleGroupParticipantUpdate(_0x12076a, _0x2940f5) {
    try {
        const {
            id: _0x8e07a,
            participants: _0x4b3727,
            action: _0x3a53ba,
            author: _0x48c8f0
        } = _0x2940f5;
        if (!_0x8e07a['endsWith']('@g.us'))
            return;
        const _0x5a2972 = await _0x0_0x4c4533['getBotMode']();
        const _0x197e4f = _0x48c8f0 ? await _0x0_0x28ec47(_0x48c8f0, _0x12076a, _0x8e07a) : ![];
        const _0x519bb8 = _0x48c8f0 ? _0x48c8f0 === _0x12076a['user']['id'] || _0x48c8f0 === _0x12076a['user']['id']['split'](':')[0x0] + '@s.whatsapp.net' : ![];
        const _0x343bfe = _0x519bb8 || _0x197e4f;
        if ((_0x5a2972 === 'private' || _0x5a2972 === 'self') && !_0x343bfe) {
            return;
        }
        invalidateGroupCache(_0x8e07a);
        if (!_0x8e07a['endsWith']('@g.us'))
            return;
        printLog('info', 'Group\x20update:\x20' + _0x3a53ba + '\x20in\x20' + _0x8e07a['split']('@')[0x0]);
        const _0x3c57ab = _0x5a2972 === 'public' || _0x5a2972 === 'groups' || _0x343bfe;
        switch (_0x3a53ba) {
        case 'promote':
            if (!_0x3c57ab)
                return;
            if (_0x4b3727 && _0x4b3727['length'] > 0x0) {
                const _0x410a87 = Array['isArray'](_0x4b3727) ? _0x4b3727[0x0] : _0x4b3727;
            }
            const _0x1bf997 = (await import('../plugins/promote.js'))['default']?.['handlePromotionEvent'];
            await _0x1bf997(_0x12076a, _0x8e07a, _0x4b3727, _0x48c8f0);
            break;
        case 'demote':
            if (!_0x3c57ab)
                return;
            if (_0x4b3727 && _0x4b3727['length'] > 0x0) {
                const _0x29cb0e = Array['isArray'](_0x4b3727) ? _0x4b3727[0x0] : _0x4b3727;
            }
            const _0x3c4437 = (await import('../plugins/demote.js'))['default']?.['handleDemotionEvent'];
            await _0x3c4437(_0x12076a, _0x8e07a, _0x4b3727, _0x48c8f0);
            break;
        case 'add':
            if (_0x4b3727 && _0x4b3727['length'] > 0x0) {
                const _0x9fac67 = Array['isArray'](_0x4b3727) ? _0x4b3727[0x0] : _0x4b3727;
            }
            const {handleJoinEvent: _0x2ab82e} = await import('../plugins/welcome.js');
            await _0x2ab82e(_0x12076a, _0x8e07a, _0x4b3727);
            break;
        case 'remove':
            if (_0x4b3727 && _0x4b3727['length'] > 0x0) {
                const _0x31f767 = Array['isArray'](_0x4b3727) ? _0x4b3727[0x0] : _0x4b3727;
            }
            const _0x558eda = (await import('../plugins/goodbye.js'))['default']?.['handleLeaveEvent'];
            await _0x558eda(_0x12076a, _0x8e07a, _0x4b3727);
            break;
        default:
            printLog('warning', 'Unhandled\x20group\x20action:\x20' + _0x3a53ba);
        }
    } catch (_0x1e252b) {
        printLog('error', 'Group\x20update\x20error:\x20' + _0x1e252b['message']);
        console['error'](_0x1e252b['stack']);
    }
}
async function handleStatus(_0x197e2f, _0xdd328a) {
    try {
        const {default: _0x221f27} = await import('../plugins/autostatus.js');
        const _0x9a9ebe = _0x221f27['handleStatusUpdate'];
        await _0x9a9ebe(_0x197e2f, _0xdd328a);
    } catch (_0x255c2f) {
        printLog('error', 'Status\x20handler\x20error:\x20' + _0x255c2f['message']);
        console['error'](_0x255c2f['stack']);
    }
}
async function handleCall(_0x11638b, _0x14928c) {
    try {
        const _0x937033 = (await import('../plugins/anticall.js'))['default'];
        const _0x3739bd = _0x937033['readState'] ? await _0x937033['readState']() : { 'enabled': ![] };
        if (!_0x3739bd['enabled'])
            return;
        const _0x3c5189 = new Set();
        for (const _0x59dff5 of _0x14928c) {
            const _0x1d8b86 = _0x59dff5['from'] || _0x59dff5['peerJid'] || _0x59dff5['chatId'];
            if (!_0x1d8b86)
                continue;
            try {
                try {
                    if (typeof _0x11638b['rejectCall'] === 'function' && _0x59dff5['id']) {
                        await _0x11638b['rejectCall'](_0x59dff5['id'], _0x1d8b86);
                    } else if (typeof _0x11638b['sendCallOfferAck'] === 'function' && _0x59dff5['id']) {
                        await _0x11638b['sendCallOfferAck'](_0x59dff5['id'], _0x1d8b86, 'reject');
                    }
                } catch (_0x22355c) {
                    printLog('error', 'Error\x20rejecting\x20call:\x20' + _0x22355c['message']);
                }
                if (!_0x3c5189['has'](_0x1d8b86)) {
                    _0x3c5189['add'](_0x1d8b86);
                    setTimeout(() => _0x3c5189['delete'](_0x1d8b86), 0xea60);
                    await _0x11638b['sendMessage'](_0x1d8b86, { 'text': '📵\x20Anticall\x20is\x20enabled.\x20Your\x20call\x20was\x20rejected\x20and\x20you\x20will\x20be\x20blocked.' });
                    printLog('info', 'Sent\x20anticall\x20warning\x20to:\x20' + _0x1d8b86['split']('@')[0x0]);
                }
                setTimeout(async () => {
                    try {
                        await _0x11638b['updateBlockStatus'](_0x1d8b86, 'block');
                        printLog('success', 'Blocked\x20caller:\x20' + _0x1d8b86['split']('@')[0x0]);
                    } catch (_0x10ccaf) {
                        printLog('error', 'Error\x20blocking\x20caller:\x20' + _0x10ccaf['message']);
                    }
                }, 0x320);
            } catch (_0x436323) {
                printLog('error', 'Error\x20handling\x20call\x20from\x20' + _0x1d8b86['split']('@')[0x0] + ':\x20' + _0x436323['message']);
            }
        }
    } catch (_0x444e11) {
        printLog('error', 'Call\x20handler\x20error:\x20' + _0x444e11['message']);
        console['error'](_0x444e11['stack']);
    }
}
export {
    handleMessages,
    handleGroupParticipantUpdate,
    handleStatus,
    handleCall
};