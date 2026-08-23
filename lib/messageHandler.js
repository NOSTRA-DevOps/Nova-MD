import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x5d3537 from 'fs';
import { dataFile } from './paths.js';
import { handleChatbotResponse } from './Chatbots.js';
import _0x0_0x590b96 from '../config.js';
import _0x0_0x4c9121 from './lightweight_store.js';
import _0x0_0x4acfb3 from './commandHandler.js';
import {
    printMessage,
    printLog
} from './print.js';
import { isBanned } from './isBanned.js';
import { isSudo } from './index.js';
import _0x0_0x19d944 from './isOwner.js';
import _0x0_0x4c93d1 from './isAdmin.js';
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
        const _0x489c38 = await _0x0_0x4c9121['getSetting']('global', 'stickerCommands');
        return _0x489c38 || {};
    } else {
        try {
            if (!_0x0_0x5d3537['existsSync'](STICKER_FILE)) {
                return {};
            }
            return JSON['parse'](_0x0_0x5d3537['readFileSync'](STICKER_FILE, 'utf8'));
        } catch {
            return {};
        }
    }
}
async function handleMessages(_0x52f946, _0x457d6e) {
    try {
        const {
            messages: _0x42ec1b,
            type: _0x30746a
        } = _0x457d6e;
        if (_0x30746a !== 'notify')
            return;
        const _0x26daa2 = _0x42ec1b[0x0];
        if (!_0x26daa2?.['message'])
            return;
        const _0x5db3e6 = _0x26daa2['key']['remoteJid'];
        const _0x72a48f = _0x5db3e6['endsWith']('@g.us');
        const _0x156bd2 = _0x26daa2['key']['participant'] || _0x26daa2['key']['remoteJid'];
        const _0x499362 = await _0x0_0x19d944(_0x156bd2, _0x52f946, _0x5db3e6);
        const _0x16ae63 = _0x26daa2['key']['fromMe'] || _0x499362;
        const _0x4486cf = await _0x0_0x4c9121['getBotMode']();
        if ((_0x4486cf === 'private' || _0x4486cf === 'self') && !_0x16ae63) {
            return;
        }
        await printMessage(_0x26daa2, _0x52f946);
        try {
            const _0x22a6d1 = await _0x0_0x4c9121['getSetting']('global', 'stealthMode');
            if (!_0x22a6d1 || !_0x22a6d1['enabled']) {
                await handleAutoread(_0x52f946, _0x26daa2);
            } else {
                printLog('info', '👻\x20Stealth\x20mode\x20active');
            }
        } catch (_0x40d602) {
            await handleAutoread(_0x52f946, _0x26daa2);
        }
        if (_0x26daa2['message']?.['protocolMessage']?.['type'] === 0x0) {
            printLog('info', 'Message\x20deletion\x20detected');
            await handleMessageRevocation(_0x52f946, _0x26daa2);
            return;
        }
        await storeMessage(_0x52f946, _0x26daa2);
        if (_0x26daa2['pushName'] && _0x52f946['store']?.['contacts']) {
            const _0x39dee1 = _0x26daa2['key']['participant'] || _0x26daa2['key']['remoteJid'];
            if (_0x39dee1) {
                _0x52f946['store']['contacts'][_0x39dee1] = {
                    ..._0x52f946['store']['contacts'][_0x39dee1],
                    'id': _0x39dee1,
                    'notify': _0x26daa2['pushName'],
                    'name': _0x26daa2['pushName']
                };
                const _0x2e7c59 = _0x52f946['decodeJid']?.(_0x39dee1);
                if (_0x2e7c59 && _0x2e7c59 !== _0x39dee1) {
                    _0x52f946['store']['contacts'][_0x2e7c59] = {
                        ..._0x52f946['store']['contacts'][_0x2e7c59],
                        'id': _0x2e7c59,
                        'notify': _0x26daa2['pushName'],
                        'name': _0x26daa2['pushName']
                    };
                }
            }
        }
        const _0x1b4f33 = _0x26daa2['key']['participant'] || _0x26daa2['key']['remoteJid'];
        if (_0x1b4f33?.['includes']('@lid') && _0x52f946['store']?.['contacts']) {
            const _0x28e41b = _0x52f946['store']['contacts'];
            const _0x131e6c = Object['keys'](_0x28e41b)['find'](_0xbbb0a5 => _0x28e41b[_0xbbb0a5]?.['lid'] === _0x1b4f33 || _0x28e41b[_0xbbb0a5]?.['lid']?.['split'](':')[0x0] === _0x1b4f33['split']('@')[0x0]);
            if (_0x131e6c?.['includes']('@s.whatsapp.net'))
                _0x156bd2 = _0x131e6c;
        }
        if (_0x26daa2['message']?.['stickerMessage']) {
            const _0x23a1c5 = _0x26daa2['message']['stickerMessage']['fileSha256'];
            if (_0x23a1c5) {
                const _0x21f2cb = Buffer['from'](_0x23a1c5)['toString']('base64');
                const _0xe6408e = await getStickerCommands();
                if (_0xe6408e[_0x21f2cb]) {
                    const _0x504cdb = _0xe6408e[_0x21f2cb]['text'];
                    const [_0x2c12eb, ..._0x17c9d7] = _0x504cdb['split']('\x20');
                    let _0x2815e2 = null;
                    let _0x44f2f4 = '';
                    for (const _0x1c7475 of _0x0_0x590b96['prefixes']) {
                        const _0xbb4816 = (_0x1c7475 + _0x2c12eb)['toLowerCase']();
                        _0x2815e2 = _0x0_0x4acfb3['getCommand'](_0xbb4816, _0x0_0x590b96['prefixes']);
                        if (_0x2815e2) {
                            _0x44f2f4 = _0x1c7475;
                            break;
                        }
                    }
                    if (_0x2815e2) {
                        const _0x544495 = await isSudo(_0x156bd2);
                        const _0x3ca9d5 = await _0x0_0x19d944(_0x156bd2, _0x52f946, _0x5db3e6);
                        const _0x18b2ac = _0x26daa2['key']['fromMe'] || _0x3ca9d5;
                        const _0x18d763 = await _0x0_0x4c9121['getBotMode']();
                        const _0x3900ca = ((() => {
                            if (_0x18b2ac)
                                return !![];
                            switch (_0x18d763) {
                            case 'public':
                                return !![];
                            case 'private':
                            case 'self':
                                return ![];
                            case 'groups':
                                return _0x72a48f;
                            case 'inbox':
                                return !_0x72a48f;
                            default:
                                return !![];
                            }
                        })());
                        if (!_0x3900ca)
                            return;
                        const _0x5b0512 = await isBanned(_0x156bd2);
                        if (_0x5b0512)
                            return;
                        if (_0x2815e2['strictOwnerOnly']) {
                            const {isOwnerOnly: _0x2336af} = await import('./isOwner.js');
                            if (!_0x26daa2['key']['fromMe'] && !_0x2336af(_0x156bd2)) {
                                return await _0x52f946['sendMessage'](_0x5db3e6, {
                                    'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20bot\x20owner!*',
                                    ...channelInfo
                                }, { 'quoted': _0x26daa2 });
                            }
                        }
                        if (_0x2815e2['ownerOnly'] && !_0x26daa2['key']['fromMe'] && !_0x3ca9d5) {
                            return await _0x52f946['sendMessage'](_0x5db3e6, {
                                'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20owner\x20or\x20sudo\x20users!*',
                                ...channelInfo
                            }, { 'quoted': _0x26daa2 });
                        }
                        if (_0x2815e2['groupOnly'] && !_0x72a48f) {
                            return await _0x52f946['sendMessage'](_0x5db3e6, {
                                'text': 'ℹ️\x20*This\x20command\x20can\x20only\x20be\x20used\x20in\x20groups!*',
                                ...channelInfo
                            }, { 'quoted': _0x26daa2 });
                        }
                        let _0x1dece5 = ![];
                        let _0x4b751 = ![];
                        if (_0x2815e2['adminOnly'] && _0x72a48f) {
                            const _0x2a74ff = await _0x0_0x4c93d1(_0x52f946, _0x5db3e6, _0x156bd2);
                            _0x1dece5 = _0x2a74ff['isSenderAdmin'];
                            _0x4b751 = _0x2a74ff['isBotAdmin'];
                            if (!_0x4b751) {
                                return await _0x52f946['sendMessage'](_0x5db3e6, {
                                    'text': 'ℹ️\x20*Please\x20make\x20the\x20bot\x20an\x20admin\x20to\x20use\x20this\x20command.*',
                                    ...channelInfo
                                }, { 'quoted': _0x26daa2 });
                            }
                            if (!_0x1dece5 && !_0x26daa2['key']['fromMe'] && !_0x3ca9d5) {
                                return await _0x52f946['sendMessage'](_0x5db3e6, {
                                    'text': 'ℹ️\x20*Sorry,\x20only\x20group\x20admins\x20can\x20use\x20this\x20command.*',
                                    ...channelInfo
                                }, { 'quoted': _0x26daa2 });
                            }
                        }
                        const _0x593bad = {
                            'key': _0x26daa2['key'],
                            'message': {
                                'extendedTextMessage': {
                                    'text': _0x44f2f4 + _0x504cdb,
                                    'contextInfo': _0x26daa2['message']['stickerMessage']['contextInfo'] || {}
                                }
                            },
                            'messageTimestamp': _0x26daa2['messageTimestamp'],
                            'pushName': _0x26daa2['pushName'],
                            'broadcast': _0x26daa2['broadcast']
                        };
                        const _0x34110b = {
                            'chatId': _0x5db3e6,
                            'senderId': _0x156bd2,
                            'isGroup': _0x72a48f,
                            'isSenderAdmin': _0x1dece5,
                            'isBotAdmin': _0x4b751,
                            'senderIsOwnerOrSudo': _0x3ca9d5,
                            'isOwnerOrSudoCheck': _0x18b2ac,
                            'channelInfo': channelInfo,
                            'rawText': _0x44f2f4 + _0x504cdb,
                            'userMessage': (_0x44f2f4 + _0x504cdb)['toLowerCase'](),
                            'messageText': _0x44f2f4 + _0x504cdb,
                            'config': _0x0_0x590b96
                        };
                        try {
                            await _0x2815e2['handler'](_0x52f946, _0x593bad, _0x17c9d7, _0x34110b);
                            await addCommandReaction(_0x52f946, _0x26daa2);
                            await showTypingAfterCommand(_0x52f946, _0x5db3e6);
                            printLog('success', '✅\x20Sticker\x20command\x20executed:\x20' + _0x504cdb);
                        } catch (_0x134e95) {
                            printLog('error', '❌\x20Sticker\x20command\x20error\x20[' + _0x504cdb + ']:\x20' + _0x134e95['message']);
                            console['error'](_0x134e95['stack']);
                            await _0x52f946['sendMessage'](_0x5db3e6, {
                                'text': '❌\x20Error\x20executing\x20sticker\x20command:\x20' + _0x134e95['message'],
                                ...channelInfo
                            }, { 'quoted': _0x26daa2 });
                        }
                    } else {
                        printLog('warning', '⚠️\x20Sticker\x20command\x20not\x20found:\x20' + _0x504cdb);
                    }
                    return;
                }
            }
        }
        const _0x3834d6 = _0x26daa2['message']?.['conversation'] || _0x26daa2['message']?.['extendedTextMessage']?.['text'] || _0x26daa2['message']?.['imageMessage']?.['caption'] || _0x26daa2['message']?.['videoMessage']?.['caption'] || _0x26daa2['message']?.['buttonsResponseMessage']?.['selectedButtonId'] || '';
        const _0x3ca487 = _0x3834d6['trim']();
        const _0x22de47 = _0x3ca487['toLowerCase']();
        const _0xab1489 = await isSudo(_0x156bd2);
        startSchedulerEngine(_0x52f946);
        if (!_0x26daa2['key']['fromMe']) {
            const _0x38fadc = await handleAutoReply(_0x52f946, _0x5db3e6, _0x26daa2, _0x22de47);
            if (_0x38fadc)
                return;
        }
        if (_0x26daa2['message']?.['buttonsResponseMessage']) {
            const _0x3782f6 = _0x26daa2['message']['buttonsResponseMessage']['selectedButtonId'];
            printLog('info', 'Button\x20response:\x20' + _0x3782f6);
            if (_0x3782f6 === 'channel') {
                await _0x52f946['sendMessage'](_0x5db3e6, { 'text': '*Join\x20our\x20Channel:*\x0a[https://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y](https://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y)' }, { 'quoted': _0x26daa2 });
                return;
            } else if (_0x3782f6 === 'owner') {
                const _0x51ecfa = (await import('../plugins/owner.js'))['default'];
                await _0x51ecfa['handler']?.(_0x52f946, _0x5db3e6, '', {});
                return;
            } else if (_0x3782f6 === 'support') {
                await _0x52f946['sendMessage'](_0x5db3e6, { 'text': '*Support*\x0a\x0ahttps://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y' }, { 'quoted': _0x26daa2 });
                return;
            }
        }
        const _0x35a173 = await isBanned(_0x156bd2);
        if (_0x35a173 && !_0x22de47['startsWith']('.unban')) {
            if (Math['random']() < 0.1) {
                printLog('warning', 'Banned\x20user\x20attempted\x20command:\x20' + _0x156bd2['split']('@')[0x0]);
                await _0x52f946['sendMessage'](_0x5db3e6, {
                    'text': 'You\x20are\x20banned\x20from\x20using\x20the\x20bot.\x20Contact\x20an\x20admin\x20to\x20get\x20unbanned.',
                    ...channelInfo
                });
            }
            return;
        }
        if (/^[1-9]$/['test'](_0x22de47) || _0x22de47 === 'surrender') {
            await handleTicTacToeMove(_0x52f946, _0x5db3e6, _0x156bd2, _0x22de47);
            return;
        }
        if (!_0x26daa2['key']['fromMe']) {
            await _0x0_0x4c9121['incrementMessageCount'](_0x5db3e6, _0x156bd2, _0x26daa2['pushName']);
        } else {
            const _0x517565 = _0x52f946['user']?.['id'] || _0x156bd2;
            const _0x2bc6f8 = _0x52f946['user']?.['name'] || _0x52f946['user']?.['notify'] || 'Me';
            await _0x0_0x4c9121['incrementMessageCount'](_0x5db3e6, _0x517565, _0x2bc6f8);
        }
        if (_0x72a48f) {
            if (_0x22de47) {
                await handleBadwordDetection(_0x52f946, _0x5db3e6, _0x26daa2, _0x22de47, _0x156bd2);
            }
            await handleLinkDetection(_0x52f946, _0x5db3e6, _0x26daa2, _0x22de47, _0x156bd2);
        }
        if (_0x72a48f && !_0x26daa2['key']['fromMe']) {
            const _0x3c405d = await handleAntiSpam(_0x52f946, _0x5db3e6, _0x26daa2, _0x156bd2, _0x499362);
            if (_0x3c405d)
                return;
        }
        if (!_0x72a48f && !_0x26daa2['key']['fromMe'] && !_0xab1489) {
            try {
                const _0x1ad186 = (await import('../plugins/pmblocker.js'))['default'];
                const _0x496b64 = _0x1ad186?.['readState'];
                const _0x4512c3 = await _0x496b64();
                if (_0x4512c3['enabled']) {
                    printLog('warning', 'PM\x20blocked\x20from:\x20' + _0x156bd2['split']('@')[0x0]);
                    await _0x52f946['sendMessage'](_0x5db3e6, { 'text': _0x4512c3['message'] || 'Private\x20messages\x20are\x20blocked.\x20Please\x20contact\x20the\x20owner\x20in\x20groups\x20only.' });
                    await new Promise(_0x23e67a => setTimeout(_0x23e67a, 0x5dc));
                    try {
                        await _0x52f946['updateBlockStatus'](_0x5db3e6, 'block');
                        printLog('success', 'Blocked\x20user:\x20' + _0x156bd2['split']('@')[0x0]);
                    } catch (_0x3ce81a) {
                        printLog('error', 'Failed\x20to\x20block\x20user:\x20' + _0x3ce81a['message']);
                    }
                    return;
                }
            } catch (_0x273883) {
                printLog('error', 'PM\x20blocker\x20error:\x20' + _0x273883['message']);
            }
        }
        const _0x52a870 = _0x0_0x590b96['prefixes']?.['find'](_0xaf6309 => _0x22de47['startsWith'](_0xaf6309));
        const _0x4c7cf4 = _0x0_0x4acfb3['getCommand'](_0x22de47, _0x0_0x590b96['prefixes']);
        if (!_0x52a870 && !_0x4c7cf4) {
            await handleAutotypingForMessage(_0x52f946, _0x5db3e6, _0x22de47);
            if (_0x72a48f) {
                await handleTagDetection(_0x52f946, _0x5db3e6, _0x26daa2, _0x156bd2);
                await handleMentionDetection(_0x52f946, _0x5db3e6, _0x26daa2);
                const _0x84396a = await _0x0_0x4c9121['getBotMode']();
                const _0x1b3cf2 = _0x84396a === 'public' || _0x84396a === 'groups' && _0x72a48f || _0x84396a === 'inbox' && !_0x72a48f || _0x16ae63;
                if (_0x1b3cf2) {
                    if (_0x72a48f && _0x22de47['length'] < 0x3) {
                        return;
                    }
                    await handleChatbotResponse(_0x52f946, _0x5db3e6, _0x26daa2, _0x22de47, _0x156bd2);
                }
            }
            return;
        }
        if (!_0x4c7cf4) {
            if (_0x72a48f) {
                await handleTagDetection(_0x52f946, _0x5db3e6, _0x26daa2, _0x156bd2);
                await handleMentionDetection(_0x52f946, _0x5db3e6, _0x26daa2);
                const _0xdd06fd = await _0x0_0x4c9121['getBotMode']();
                const _0x3e7b96 = _0xdd06fd === 'public' || _0xdd06fd === 'groups' && _0x72a48f || _0xdd06fd === 'inbox' && !_0x72a48f || _0x16ae63;
                if (_0x3e7b96) {
                    if (_0x72a48f && _0x22de47['length'] < 0x3) {
                        return;
                    }
                    await handleChatbotResponse(_0x52f946, _0x5db3e6, _0x26daa2, _0x22de47, _0x156bd2);
                }
            }
            return;
        }
        const _0x28e4f2 = ((() => {
            if (_0x16ae63)
                return !![];
            switch (_0x4486cf) {
            case 'public':
                return !![];
            case 'private':
            case 'self':
                return ![];
            case 'groups':
                return _0x72a48f;
            case 'inbox':
                return !_0x72a48f;
            default:
                return !![];
            }
        })());
        if (!_0x28e4f2) {
            return;
        }
        let _0x510954;
        if (_0x52a870) {
            const _0x382e90 = _0x3ca487['slice'](_0x52a870['length'])['trim']();
            _0x510954 = _0x382e90['split'](/\s+/)['slice'](0x1);
        } else {
            _0x510954 = _0x3ca487['trim']()['split'](/\s+/)['slice'](0x1);
        }
        if (_0x4c7cf4['strictOwnerOnly']) {
            const {isOwnerOnly: _0x23ccf8} = await import('./isOwner.js');
            if (!_0x26daa2['key']['fromMe'] && !_0x23ccf8(_0x156bd2)) {
                return await _0x52f946['sendMessage'](_0x5db3e6, {
                    'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20bot\x20owner!*\x0a\x0a_Sudo\x20users\x20cannot\x20manage\x20other\x20sudo\x20users._',
                    ...channelInfo
                }, { 'quoted': _0x26daa2 });
            }
        }
        if (_0x4c7cf4['ownerOnly'] && !_0x26daa2['key']['fromMe'] && !_0x499362) {
            return await _0x52f946['sendMessage'](_0x5db3e6, {
                'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20owner\x20or\x20sudo\x20users!*',
                ...channelInfo
            }, { 'quoted': _0x26daa2 });
        }
        if (_0x4c7cf4['groupOnly'] && !_0x72a48f) {
            return await _0x52f946['sendMessage'](_0x5db3e6, {
                'text': 'ℹ️\x20*This\x20command\x20can\x20only\x20be\x20used\x20in\x20groups!*',
                ...channelInfo
            }, { 'quoted': _0x26daa2 });
        }
        let _0x495c8e = ![];
        let _0x4b605f = ![];
        if (_0x4c7cf4['adminOnly'] && _0x72a48f) {
            const _0x491bf5 = await _0x0_0x4c93d1(_0x52f946, _0x5db3e6, _0x156bd2);
            _0x495c8e = _0x491bf5['isSenderAdmin'];
            _0x4b605f = _0x491bf5['isBotAdmin'];
            if (!_0x4b605f) {
                return await _0x52f946['sendMessage'](_0x5db3e6, {
                    'text': 'ℹ️\x20*Please\x20make\x20the\x20bot\x20an\x20admin\x20to\x20use\x20this\x20command.*',
                    ...channelInfo
                }, { 'quoted': _0x26daa2 });
            }
            if (!_0x495c8e && !_0x26daa2['key']['fromMe'] && !_0x499362) {
                return await _0x52f946['sendMessage'](_0x5db3e6, {
                    'text': 'ℹ️\x20*Sorry,\x20only\x20group\x20admins\x20can\x20use\x20this\x20command.*',
                    ...channelInfo
                }, { 'quoted': _0x26daa2 });
            }
        }
        const _0x31ad4a = {
            'chatId': _0x5db3e6,
            'senderId': _0x156bd2,
            'isGroup': _0x72a48f,
            'isSenderAdmin': _0x495c8e,
            'isBotAdmin': _0x4b605f,
            'senderIsOwnerOrSudo': _0x499362,
            'isOwnerOrSudoCheck': _0x16ae63,
            'channelInfo': channelInfo,
            'rawText': _0x3834d6,
            'userMessage': _0x22de47,
            'messageText': _0x3ca487,
            'config': _0x0_0x590b96
        };
        try {
            await _0x4c7cf4['handler'](_0x52f946, _0x26daa2, _0x510954, _0x31ad4a);
            await addCommandReaction(_0x52f946, _0x26daa2);
            await showTypingAfterCommand(_0x52f946, _0x5db3e6);
        } catch (_0x560b5b) {
            printLog('error', 'Command\x20error\x20[' + _0x4c7cf4['command'] + ']:\x20' + _0x560b5b['message']);
            console['error'](_0x560b5b['stack']);
            await _0x52f946['sendMessage'](_0x5db3e6, {
                'text': '❌\x20Error\x20executing\x20command:\x20' + _0x560b5b['message'],
                ...channelInfo
            }, { 'quoted': _0x26daa2 });
            const _0x3c451e = {
                'command': _0x4c7cf4['command'],
                'error': _0x560b5b['message'],
                'stack': _0x560b5b['stack'],
                'timestamp': new Date()['toISOString'](),
                'user': _0x156bd2,
                'chat': _0x5db3e6
            };
            try {
                writeErrorLog(_0x3c451e);
            } catch (_0x36ff31) {
                printLog('error', 'Failed\x20to\x20write\x20error\x20log:\x20' + _0x36ff31['message']);
            }
        }
    } catch (_0x2576f9) {
        printLog('error', 'Message\x20handler\x20error:\x20' + _0x2576f9['message']);
        console['error'](_0x2576f9['stack']);
        const _0x23ee71 = _0x457d6e['messages']?.[0x0]?.['key']?.['remoteJid'];
        if (_0x23ee71) {
            try {
                await _0x52f946['sendMessage'](_0x23ee71, {
                    'text': 'ℹ️\x20*Failed\x20to\x20process\x20message!*',
                    ...channelInfo
                });
            } catch (_0x2f30f4) {
                printLog('error', 'Failed\x20to\x20send\x20error\x20message:\x20' + _0x2f30f4['message']);
            }
        }
    }
}
async function handleGroupParticipantUpdate(_0x2610fe, _0x47cfc4) {
    try {
        const {
            id: _0x37e386,
            participants: _0x1fa1f7,
            action: _0x3ff8e7,
            author: _0x5bc8b2
        } = _0x47cfc4;
        if (!_0x37e386['endsWith']('@g.us'))
            return;
        const _0x2df225 = await _0x0_0x4c9121['getBotMode']();
        const _0x24b7e9 = _0x5bc8b2 ? await _0x0_0x19d944(_0x5bc8b2, _0x2610fe, _0x37e386) : ![];
        const _0xef8aa4 = _0x5bc8b2 ? _0x5bc8b2 === _0x2610fe['user']['id'] || _0x5bc8b2 === _0x2610fe['user']['id']['split'](':')[0x0] + '@s.whatsapp.net' : ![];
        const _0x37ad50 = _0xef8aa4 || _0x24b7e9;
        if ((_0x2df225 === 'private' || _0x2df225 === 'self') && !_0x37ad50) {
            return;
        }
        invalidateGroupCache(_0x37e386);
        if (!_0x37e386['endsWith']('@g.us'))
            return;
        printLog('info', 'Group\x20update:\x20' + _0x3ff8e7 + '\x20in\x20' + _0x37e386['split']('@')[0x0]);
        const _0x215499 = _0x2df225 === 'public' || _0x2df225 === 'groups' || _0x37ad50;
        switch (_0x3ff8e7) {
        case 'promote':
            if (!_0x215499)
                return;
            if (_0x1fa1f7 && _0x1fa1f7['length'] > 0x0) {
                const _0x446aec = Array['isArray'](_0x1fa1f7) ? _0x1fa1f7[0x0] : _0x1fa1f7;
            }
            const _0x40286e = (await import('../plugins/promote.js'))['default']?.['handlePromotionEvent'];
            await _0x40286e(_0x2610fe, _0x37e386, _0x1fa1f7, _0x5bc8b2);
            break;
        case 'demote':
            if (!_0x215499)
                return;
            if (_0x1fa1f7 && _0x1fa1f7['length'] > 0x0) {
                const _0x4ae3fe = Array['isArray'](_0x1fa1f7) ? _0x1fa1f7[0x0] : _0x1fa1f7;
            }
            const _0x5728d8 = (await import('../plugins/demote.js'))['default']?.['handleDemotionEvent'];
            await _0x5728d8(_0x2610fe, _0x37e386, _0x1fa1f7, _0x5bc8b2);
            break;
        case 'add':
            if (_0x1fa1f7 && _0x1fa1f7['length'] > 0x0) {
                const _0x57644e = Array['isArray'](_0x1fa1f7) ? _0x1fa1f7[0x0] : _0x1fa1f7;
            }
            const {handleJoinEvent: _0x1a5723} = await import('../plugins/welcome.js');
            await _0x1a5723(_0x2610fe, _0x37e386, _0x1fa1f7);
            break;
        case 'remove':
            if (_0x1fa1f7 && _0x1fa1f7['length'] > 0x0) {
                const _0x441710 = Array['isArray'](_0x1fa1f7) ? _0x1fa1f7[0x0] : _0x1fa1f7;
            }
            const _0x937e9e = (await import('../plugins/goodbye.js'))['default']?.['handleLeaveEvent'];
            await _0x937e9e(_0x2610fe, _0x37e386, _0x1fa1f7);
            break;
        default:
            printLog('warning', 'Unhandled\x20group\x20action:\x20' + _0x3ff8e7);
        }
    } catch (_0x303cfe) {
        printLog('error', 'Group\x20update\x20error:\x20' + _0x303cfe['message']);
        console['error'](_0x303cfe['stack']);
    }
}
async function handleStatus(_0x407a45, _0x203181) {
    try {
        const {default: _0x2fb979} = await import('../plugins/autostatus.js');
        const _0x4c06a8 = _0x2fb979['handleStatusUpdate'];
        await _0x4c06a8(_0x407a45, _0x203181);
    } catch (_0x3aa5a4) {
        printLog('error', 'Status\x20handler\x20error:\x20' + _0x3aa5a4['message']);
        console['error'](_0x3aa5a4['stack']);
    }
}
async function handleCall(_0x1d9110, _0x1e91ea) {
    try {
        const _0x117d77 = (await import('../plugins/anticall.js'))['default'];
        const _0x1d37ca = _0x117d77['readState'] ? await _0x117d77['readState']() : { 'enabled': ![] };
        if (!_0x1d37ca['enabled'])
            return;
        const _0x5a6523 = new Set();
        for (const _0x133c5d of _0x1e91ea) {
            const _0x42bbbe = _0x133c5d['from'] || _0x133c5d['peerJid'] || _0x133c5d['chatId'];
            if (!_0x42bbbe)
                continue;
            try {
                try {
                    if (typeof _0x1d9110['rejectCall'] === 'function' && _0x133c5d['id']) {
                        await _0x1d9110['rejectCall'](_0x133c5d['id'], _0x42bbbe);
                    } else if (typeof _0x1d9110['sendCallOfferAck'] === 'function' && _0x133c5d['id']) {
                        await _0x1d9110['sendCallOfferAck'](_0x133c5d['id'], _0x42bbbe, 'reject');
                    }
                } catch (_0x434975) {
                    printLog('error', 'Error\x20rejecting\x20call:\x20' + _0x434975['message']);
                }
                if (!_0x5a6523['has'](_0x42bbbe)) {
                    _0x5a6523['add'](_0x42bbbe);
                    setTimeout(() => _0x5a6523['delete'](_0x42bbbe), 0xea60);
                    await _0x1d9110['sendMessage'](_0x42bbbe, { 'text': '📵\x20Anticall\x20is\x20enabled.\x20Your\x20call\x20was\x20rejected\x20and\x20you\x20will\x20be\x20blocked.' });
                    printLog('info', 'Sent\x20anticall\x20warning\x20to:\x20' + _0x42bbbe['split']('@')[0x0]);
                }
                setTimeout(async () => {
                    try {
                        await _0x1d9110['updateBlockStatus'](_0x42bbbe, 'block');
                        printLog('success', 'Blocked\x20caller:\x20' + _0x42bbbe['split']('@')[0x0]);
                    } catch (_0x48a4b2) {
                        printLog('error', 'Error\x20blocking\x20caller:\x20' + _0x48a4b2['message']);
                    }
                }, 0x320);
            } catch (_0x5d7885) {
                printLog('error', 'Error\x20handling\x20call\x20from\x20' + _0x42bbbe['split']('@')[0x0] + ':\x20' + _0x5d7885['message']);
            }
        }
    } catch (_0x18dfce) {
        printLog('error', 'Call\x20handler\x20error:\x20' + _0x18dfce['message']);
        console['error'](_0x18dfce['stack']);
    }
}
export {
    handleMessages,
    handleGroupParticipantUpdate,
    handleStatus,
    handleCall
};