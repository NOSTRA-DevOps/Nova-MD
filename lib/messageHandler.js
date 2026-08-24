import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x37a6d8 from 'fs';
import { dataFile } from './paths.js';
import _0x0_0xb8d821 from '../config.js';
import _0x0_0x3015eb from './lightweight_store.js';
import _0x0_0x58e145 from './commandHandler.js';
import {
    printMessage,
    printLog
} from './print.js';
import { isBanned } from './isBanned.js';
import { isSudo } from './index.js';
import _0x0_0x2dde34 from './isOwner.js';
import _0x0_0x4305ed from './isAdmin.js';
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
        const _0xe9af79 = await _0x0_0x3015eb['getSetting']('global', 'stickerCommands');
        return _0xe9af79 || {};
    } else {
        try {
            if (!_0x0_0x37a6d8['existsSync'](STICKER_FILE)) {
                return {};
            }
            return JSON['parse'](_0x0_0x37a6d8['readFileSync'](STICKER_FILE, 'utf8'));
        } catch {
            return {};
        }
    }
}
async function handleMessages(_0x3bcc35, _0x3a326a) {
    try {
        const {
            messages: _0x5565e2,
            type: _0x550ab9
        } = _0x3a326a;
        if (_0x550ab9 !== 'notify')
            return;
        const _0x45f3b = _0x5565e2[0x0];
        if (!_0x45f3b?.['message'])
            return;
        const _0x9d2895 = _0x45f3b['key']['remoteJid'];
        const _0x3120ac = _0x9d2895['endsWith']('@g.us');
        const _0xd402db = _0x45f3b['key']['participant'] || _0x45f3b['key']['remoteJid'];
        const _0x9a92c4 = await _0x0_0x2dde34(_0xd402db, _0x3bcc35, _0x9d2895);
        const _0x3f3663 = _0x45f3b['key']['fromMe'] || _0x9a92c4;
        const _0x1b80ff = await _0x0_0x3015eb['getBotMode']();
        if ((_0x1b80ff === 'private' || _0x1b80ff === 'self') && !_0x3f3663) {
            return;
        }
        await printMessage(_0x45f3b, _0x3bcc35);
        try {
            const _0x43e7f8 = await _0x0_0x3015eb['getSetting']('global', 'stealthMode');
            if (!_0x43e7f8 || !_0x43e7f8['enabled']) {
                await handleAutoread(_0x3bcc35, _0x45f3b);
            } else {
                printLog('info', '👻\x20Stealth\x20mode\x20active');
            }
        } catch (_0x25c5a1) {
            await handleAutoread(_0x3bcc35, _0x45f3b);
        }
        if (_0x45f3b['message']?.['protocolMessage']?.['type'] === 0x0) {
            printLog('info', 'Message\x20deletion\x20detected');
            await handleMessageRevocation(_0x3bcc35, _0x45f3b);
            return;
        }
        await storeMessage(_0x3bcc35, _0x45f3b);
        if (_0x45f3b['pushName'] && _0x3bcc35['store']?.['contacts']) {
            const _0x56a0ed = _0x45f3b['key']['participant'] || _0x45f3b['key']['remoteJid'];
            if (_0x56a0ed) {
                _0x3bcc35['store']['contacts'][_0x56a0ed] = {
                    ..._0x3bcc35['store']['contacts'][_0x56a0ed],
                    'id': _0x56a0ed,
                    'notify': _0x45f3b['pushName'],
                    'name': _0x45f3b['pushName']
                };
                const _0x1dae80 = _0x3bcc35['decodeJid']?.(_0x56a0ed);
                if (_0x1dae80 && _0x1dae80 !== _0x56a0ed) {
                    _0x3bcc35['store']['contacts'][_0x1dae80] = {
                        ..._0x3bcc35['store']['contacts'][_0x1dae80],
                        'id': _0x1dae80,
                        'notify': _0x45f3b['pushName'],
                        'name': _0x45f3b['pushName']
                    };
                }
            }
        }
        const _0x21502d = _0x45f3b['key']['participant'] || _0x45f3b['key']['remoteJid'];
        if (_0x21502d?.['includes']('@lid') && _0x3bcc35['store']?.['contacts']) {
            const _0x4f1d8d = _0x3bcc35['store']['contacts'];
            const _0x3619b7 = Object['keys'](_0x4f1d8d)['find'](_0x142f1c => _0x4f1d8d[_0x142f1c]?.['lid'] === _0x21502d || _0x4f1d8d[_0x142f1c]?.['lid']?.['split'](':')[0x0] === _0x21502d['split']('@')[0x0]);
            if (_0x3619b7?.['includes']('@s.whatsapp.net'))
                _0xd402db = _0x3619b7;
        }
        if (_0x45f3b['message']?.['stickerMessage']) {
            const _0x507e83 = _0x45f3b['message']['stickerMessage']['fileSha256'];
            if (_0x507e83) {
                const _0x139296 = Buffer['from'](_0x507e83)['toString']('base64');
                const _0x2720ed = await getStickerCommands();
                if (_0x2720ed[_0x139296]) {
                    const _0x3a958d = _0x2720ed[_0x139296]['text'];
                    const [_0x750c53, ..._0x5a27fc] = _0x3a958d['split']('\x20');
                    let _0x481004 = null;
                    let _0x1ce317 = '';
                    for (const _0x18134c of _0x0_0xb8d821['prefixes']) {
                        const _0x277994 = (_0x18134c + _0x750c53)['toLowerCase']();
                        _0x481004 = _0x0_0x58e145['getCommand'](_0x277994, _0x0_0xb8d821['prefixes']);
                        if (_0x481004) {
                            _0x1ce317 = _0x18134c;
                            break;
                        }
                    }
                    if (_0x481004) {
                        const _0x5e6bc4 = await isSudo(_0xd402db);
                        const _0x5aba72 = await _0x0_0x2dde34(_0xd402db, _0x3bcc35, _0x9d2895);
                        const _0x3c0d58 = _0x45f3b['key']['fromMe'] || _0x5aba72;
                        const _0x2ec15f = await _0x0_0x3015eb['getBotMode']();
                        const _0x4f80b2 = ((() => {
                            if (_0x3c0d58)
                                return !![];
                            switch (_0x2ec15f) {
                            case 'public':
                                return !![];
                            case 'private':
                            case 'self':
                                return ![];
                            case 'groups':
                                return _0x3120ac;
                            case 'inbox':
                                return !_0x3120ac;
                            default:
                                return !![];
                            }
                        })());
                        if (!_0x4f80b2)
                            return;
                        const _0x2c3a90 = await isBanned(_0xd402db);
                        if (_0x2c3a90)
                            return;
                        if (_0x481004['strictOwnerOnly']) {
                            const {isOwnerOnly: _0x45335d} = await import('./isOwner.js');
                            if (!_0x45f3b['key']['fromMe'] && !_0x45335d(_0xd402db)) {
                                return await _0x3bcc35['sendMessage'](_0x9d2895, {
                                    'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20bot\x20owner!*',
                                    ...channelInfo
                                }, { 'quoted': _0x45f3b });
                            }
                        }
                        if (_0x481004['ownerOnly'] && !_0x45f3b['key']['fromMe'] && !_0x5aba72) {
                            return await _0x3bcc35['sendMessage'](_0x9d2895, {
                                'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20owner\x20or\x20sudo\x20users!*',
                                ...channelInfo
                            }, { 'quoted': _0x45f3b });
                        }
                        if (_0x481004['groupOnly'] && !_0x3120ac) {
                            return await _0x3bcc35['sendMessage'](_0x9d2895, {
                                'text': 'ℹ️\x20*This\x20command\x20can\x20only\x20be\x20used\x20in\x20groups!*',
                                ...channelInfo
                            }, { 'quoted': _0x45f3b });
                        }
                        let _0x39ecaa = ![];
                        let _0x4390fd = ![];
                        if (_0x481004['adminOnly'] && _0x3120ac) {
                            const _0x5c9883 = await _0x0_0x4305ed(_0x3bcc35, _0x9d2895, _0xd402db);
                            _0x39ecaa = _0x5c9883['isSenderAdmin'];
                            _0x4390fd = _0x5c9883['isBotAdmin'];
                            if (!_0x4390fd) {
                                return await _0x3bcc35['sendMessage'](_0x9d2895, {
                                    'text': 'ℹ️\x20*Please\x20make\x20the\x20bot\x20an\x20admin\x20to\x20use\x20this\x20command.*',
                                    ...channelInfo
                                }, { 'quoted': _0x45f3b });
                            }
                            if (!_0x39ecaa && !_0x45f3b['key']['fromMe'] && !_0x5aba72) {
                                return await _0x3bcc35['sendMessage'](_0x9d2895, {
                                    'text': 'ℹ️\x20*Sorry,\x20only\x20group\x20admins\x20can\x20use\x20this\x20command.*',
                                    ...channelInfo
                                }, { 'quoted': _0x45f3b });
                            }
                        }
                        const _0x582be2 = {
                            'key': _0x45f3b['key'],
                            'message': {
                                'extendedTextMessage': {
                                    'text': _0x1ce317 + _0x3a958d,
                                    'contextInfo': _0x45f3b['message']['stickerMessage']['contextInfo'] || {}
                                }
                            },
                            'messageTimestamp': _0x45f3b['messageTimestamp'],
                            'pushName': _0x45f3b['pushName'],
                            'broadcast': _0x45f3b['broadcast']
                        };
                        const _0x1662f0 = {
                            'chatId': _0x9d2895,
                            'senderId': _0xd402db,
                            'isGroup': _0x3120ac,
                            'isSenderAdmin': _0x39ecaa,
                            'isBotAdmin': _0x4390fd,
                            'senderIsOwnerOrSudo': _0x5aba72,
                            'isOwnerOrSudoCheck': _0x3c0d58,
                            'channelInfo': channelInfo,
                            'rawText': _0x1ce317 + _0x3a958d,
                            'userMessage': (_0x1ce317 + _0x3a958d)['toLowerCase'](),
                            'messageText': _0x1ce317 + _0x3a958d,
                            'config': _0x0_0xb8d821
                        };
                        try {
                            await _0x481004['handler'](_0x3bcc35, _0x582be2, _0x5a27fc, _0x1662f0);
                            await addCommandReaction(_0x3bcc35, _0x45f3b);
                            await showTypingAfterCommand(_0x3bcc35, _0x9d2895);
                            printLog('success', '✅\x20Sticker\x20command\x20executed:\x20' + _0x3a958d);
                        } catch (_0x5add6d) {
                            printLog('error', '❌\x20Sticker\x20command\x20error\x20[' + _0x3a958d + ']:\x20' + _0x5add6d['message']);
                            console['error'](_0x5add6d['stack']);
                            await _0x3bcc35['sendMessage'](_0x9d2895, {
                                'text': '❌\x20Error\x20executing\x20sticker\x20command:\x20' + _0x5add6d['message'],
                                ...channelInfo
                            }, { 'quoted': _0x45f3b });
                        }
                    } else {
                        printLog('warning', '⚠️\x20Sticker\x20command\x20not\x20found:\x20' + _0x3a958d);
                    }
                    return;
                }
            }
        }
        const _0x2861c0 = _0x45f3b['message']?.['conversation'] || _0x45f3b['message']?.['extendedTextMessage']?.['text'] || _0x45f3b['message']?.['imageMessage']?.['caption'] || _0x45f3b['message']?.['videoMessage']?.['caption'] || _0x45f3b['message']?.['buttonsResponseMessage']?.['selectedButtonId'] || '';
        const _0x22f3ab = _0x2861c0['trim']();
        const _0x2e8204 = _0x22f3ab['toLowerCase']();
        const _0x5d9af0 = await isSudo(_0xd402db);
        startSchedulerEngine(_0x3bcc35);
        if (!_0x45f3b['key']['fromMe']) {
            const _0x1f3efe = await handleAutoReply(_0x3bcc35, _0x9d2895, _0x45f3b, _0x2e8204);
            if (_0x1f3efe)
                return;
        }
        if (_0x45f3b['message']?.['buttonsResponseMessage']) {
            const _0x4ef6d5 = _0x45f3b['message']['buttonsResponseMessage']['selectedButtonId'];
            printLog('info', 'Button\x20response:\x20' + _0x4ef6d5);
            if (_0x4ef6d5 === 'channel') {
                await _0x3bcc35['sendMessage'](_0x9d2895, { 'text': '*Join\x20our\x20Channel:*\x0a[https://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y](https://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y)' }, { 'quoted': _0x45f3b });
                return;
            } else if (_0x4ef6d5 === 'owner') {
                const _0x4358e5 = (await import('../plugins/owner.js'))['default'];
                await _0x4358e5['handler']?.(_0x3bcc35, _0x9d2895, '', {});
                return;
            } else if (_0x4ef6d5 === 'support') {
                await _0x3bcc35['sendMessage'](_0x9d2895, { 'text': '*Support*\x0a\x0ahttps://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y' }, { 'quoted': _0x45f3b });
                return;
            }
        }
        const _0x5890a6 = await isBanned(_0xd402db);
        if (_0x5890a6 && !_0x2e8204['startsWith']('.unban')) {
            if (Math['random']() < 0.1) {
                printLog('warning', 'Banned\x20user\x20attempted\x20command:\x20' + _0xd402db['split']('@')[0x0]);
                await _0x3bcc35['sendMessage'](_0x9d2895, {
                    'text': 'You\x20are\x20banned\x20from\x20using\x20the\x20bot.\x20Contact\x20an\x20admin\x20to\x20get\x20unbanned.',
                    ...channelInfo
                });
            }
            return;
        }
        if (/^[1-9]$/['test'](_0x2e8204) || _0x2e8204 === 'surrender') {
            await handleTicTacToeMove(_0x3bcc35, _0x9d2895, _0xd402db, _0x2e8204);
            return;
        }
        if (!_0x45f3b['key']['fromMe']) {
            await _0x0_0x3015eb['incrementMessageCount'](_0x9d2895, _0xd402db, _0x45f3b['pushName']);
        } else {
            const _0x1de341 = _0x3bcc35['user']?.['id'] || _0xd402db;
            const _0xef9b03 = _0x3bcc35['user']?.['name'] || _0x3bcc35['user']?.['notify'] || 'Me';
            await _0x0_0x3015eb['incrementMessageCount'](_0x9d2895, _0x1de341, _0xef9b03);
        }
        if (_0x3120ac) {
            if (_0x2e8204) {
                await handleBadwordDetection(_0x3bcc35, _0x9d2895, _0x45f3b, _0x2e8204, _0xd402db);
            }
            await handleLinkDetection(_0x3bcc35, _0x9d2895, _0x45f3b, _0x2e8204, _0xd402db);
        }
        if (_0x3120ac && !_0x45f3b['key']['fromMe']) {
            const _0x205f4f = await handleAntiSpam(_0x3bcc35, _0x9d2895, _0x45f3b, _0xd402db, _0x9a92c4);
            if (_0x205f4f)
                return;
        }
        if (!_0x3120ac && !_0x45f3b['key']['fromMe'] && !_0x5d9af0) {
            try {
                const _0x355e6d = (await import('../plugins/pmblocker.js'))['default'];
                const _0x27117d = _0x355e6d?.['readState'];
                const _0xde4042 = await _0x27117d();
                if (_0xde4042['enabled']) {
                    printLog('warning', 'PM\x20blocked\x20from:\x20' + _0xd402db['split']('@')[0x0]);
                    await _0x3bcc35['sendMessage'](_0x9d2895, { 'text': _0xde4042['message'] || 'Private\x20messages\x20are\x20blocked.\x20Please\x20contact\x20the\x20owner\x20in\x20groups\x20only.' });
                    await new Promise(_0x47609f => setTimeout(_0x47609f, 0x5dc));
                    try {
                        await _0x3bcc35['updateBlockStatus'](_0x9d2895, 'block');
                        printLog('success', 'Blocked\x20user:\x20' + _0xd402db['split']('@')[0x0]);
                    } catch (_0x53fde3) {
                        printLog('error', 'Failed\x20to\x20block\x20user:\x20' + _0x53fde3['message']);
                    }
                    return;
                }
            } catch (_0x5ac4e8) {
                printLog('error', 'PM\x20blocker\x20error:\x20' + _0x5ac4e8['message']);
            }
        }
        const _0x534a8f = _0x0_0xb8d821['prefixes']?.['find'](_0x5b0b4b => _0x2e8204['startsWith'](_0x5b0b4b));
        const _0x14b04a = _0x0_0x58e145['getCommand'](_0x2e8204, _0x0_0xb8d821['prefixes']);
        if (!_0x534a8f && !_0x14b04a) {
            await handleAutotypingForMessage(_0x3bcc35, _0x9d2895, _0x2e8204);
            if (_0x3120ac) {
                await handleTagDetection(_0x3bcc35, _0x9d2895, _0x45f3b, _0xd402db);
                await handleMentionDetection(_0x3bcc35, _0x9d2895, _0x45f3b);
                const _0x18adff = await _0x0_0x3015eb['getBotMode']();
                const _0x4fb96d = _0x18adff === 'public' || _0x18adff === 'groups' && _0x3120ac || _0x18adff === 'inbox' && !_0x3120ac || _0x3f3663;
                if (_0x4fb96d) {
                    await handleChatbotResponse(_0x3bcc35, _0x9d2895, _0x45f3b, _0x2e8204, _0xd402db);
                }
            }
            return;
        }
        if (!_0x14b04a) {
            if (_0x3120ac) {
                await handleTagDetection(_0x3bcc35, _0x9d2895, _0x45f3b, _0xd402db);
                await handleMentionDetection(_0x3bcc35, _0x9d2895, _0x45f3b);
                const _0x542d37 = await _0x0_0x3015eb['getBotMode']();
                const _0x5ac03e = _0x542d37 === 'public' || _0x542d37 === 'groups' && _0x3120ac || _0x542d37 === 'inbox' && !_0x3120ac || _0x3f3663;
                if (_0x5ac03e) {
                    await handleChatbotResponse(_0x3bcc35, _0x9d2895, _0x45f3b, _0x2e8204, _0xd402db);
                }
            }
            return;
        }
        const _0x286c42 = ((() => {
            if (_0x3f3663)
                return !![];
            switch (_0x1b80ff) {
            case 'public':
                return !![];
            case 'private':
            case 'self':
                return ![];
            case 'groups':
                return _0x3120ac;
            case 'inbox':
                return !_0x3120ac;
            default:
                return !![];
            }
        })());
        if (!_0x286c42) {
            return;
        }
        let _0x36dcb0;
        if (_0x534a8f) {
            const _0x5a4801 = _0x22f3ab['slice'](_0x534a8f['length'])['trim']();
            _0x36dcb0 = _0x5a4801['split'](/\s+/)['slice'](0x1);
        } else {
            _0x36dcb0 = _0x22f3ab['trim']()['split'](/\s+/)['slice'](0x1);
        }
        if (_0x14b04a['strictOwnerOnly']) {
            const {isOwnerOnly: _0xefa6a0} = await import('./isOwner.js');
            if (!_0x45f3b['key']['fromMe'] && !_0xefa6a0(_0xd402db)) {
                return await _0x3bcc35['sendMessage'](_0x9d2895, {
                    'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20bot\x20owner!*\x0a\x0a_Sudo\x20users\x20cannot\x20manage\x20other\x20sudo\x20users._',
                    ...channelInfo
                }, { 'quoted': _0x45f3b });
            }
        }
        if (_0x14b04a['ownerOnly'] && !_0x45f3b['key']['fromMe'] && !_0x9a92c4) {
            return await _0x3bcc35['sendMessage'](_0x9d2895, {
                'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20owner\x20or\x20sudo\x20users!*',
                ...channelInfo
            }, { 'quoted': _0x45f3b });
        }
        if (_0x14b04a['groupOnly'] && !_0x3120ac) {
            return await _0x3bcc35['sendMessage'](_0x9d2895, {
                'text': 'ℹ️\x20*This\x20command\x20can\x20only\x20be\x20used\x20in\x20groups!*',
                ...channelInfo
            }, { 'quoted': _0x45f3b });
        }
        let _0x4a5cd2 = ![];
        let _0x8526b5 = ![];
        if (_0x14b04a['adminOnly'] && _0x3120ac) {
            const _0x50979f = await _0x0_0x4305ed(_0x3bcc35, _0x9d2895, _0xd402db);
            _0x4a5cd2 = _0x50979f['isSenderAdmin'];
            _0x8526b5 = _0x50979f['isBotAdmin'];
            if (!_0x8526b5) {
                return await _0x3bcc35['sendMessage'](_0x9d2895, {
                    'text': 'ℹ️\x20*Please\x20make\x20the\x20bot\x20an\x20admin\x20to\x20use\x20this\x20command.*',
                    ...channelInfo
                }, { 'quoted': _0x45f3b });
            }
            if (!_0x4a5cd2 && !_0x45f3b['key']['fromMe'] && !_0x9a92c4) {
                return await _0x3bcc35['sendMessage'](_0x9d2895, {
                    'text': 'ℹ️\x20*Sorry,\x20only\x20group\x20admins\x20can\x20use\x20this\x20command.*',
                    ...channelInfo
                }, { 'quoted': _0x45f3b });
            }
        }
        const _0x119634 = {
            'chatId': _0x9d2895,
            'senderId': _0xd402db,
            'isGroup': _0x3120ac,
            'isSenderAdmin': _0x4a5cd2,
            'isBotAdmin': _0x8526b5,
            'senderIsOwnerOrSudo': _0x9a92c4,
            'isOwnerOrSudoCheck': _0x3f3663,
            'channelInfo': channelInfo,
            'rawText': _0x2861c0,
            'userMessage': _0x2e8204,
            'messageText': _0x22f3ab,
            'config': _0x0_0xb8d821
        };
        try {
            await _0x14b04a['handler'](_0x3bcc35, _0x45f3b, _0x36dcb0, _0x119634);
            await addCommandReaction(_0x3bcc35, _0x45f3b);
            await showTypingAfterCommand(_0x3bcc35, _0x9d2895);
        } catch (_0x28a09e) {
            printLog('error', 'Command\x20error\x20[' + _0x14b04a['command'] + ']:\x20' + _0x28a09e['message']);
            console['error'](_0x28a09e['stack']);
            await _0x3bcc35['sendMessage'](_0x9d2895, {
                'text': '❌\x20Error\x20executing\x20command:\x20' + _0x28a09e['message'],
                ...channelInfo
            }, { 'quoted': _0x45f3b });
            const _0x434a5b = {
                'command': _0x14b04a['command'],
                'error': _0x28a09e['message'],
                'stack': _0x28a09e['stack'],
                'timestamp': new Date()['toISOString'](),
                'user': _0xd402db,
                'chat': _0x9d2895
            };
            try {
                writeErrorLog(_0x434a5b);
            } catch (_0x29a0be) {
                printLog('error', 'Failed\x20to\x20write\x20error\x20log:\x20' + _0x29a0be['message']);
            }
        }
    } catch (_0x1c757b) {
        printLog('error', 'Message\x20handler\x20error:\x20' + _0x1c757b['message']);
        console['error'](_0x1c757b['stack']);
        const _0x4db85a = _0x3a326a['messages']?.[0x0]?.['key']?.['remoteJid'];
        if (_0x4db85a) {
            try {
                await _0x3bcc35['sendMessage'](_0x4db85a, {
                    'text': 'ℹ️\x20*Failed\x20to\x20process\x20message!*',
                    ...channelInfo
                });
            } catch (_0x4096a4) {
                printLog('error', 'Failed\x20to\x20send\x20error\x20message:\x20' + _0x4096a4['message']);
            }
        }
    }
}
async function handleGroupParticipantUpdate(_0x2d82eb, _0x2d32d7) {
    try {
        const {
            id: _0x3a8461,
            participants: _0xfcfdc6,
            action: _0x471e9c,
            author: _0x52af60
        } = _0x2d32d7;
        if (!_0x3a8461['endsWith']('@g.us'))
            return;
        const _0x3ae874 = await _0x0_0x3015eb['getBotMode']();
        const _0x28e970 = _0x52af60 ? await _0x0_0x2dde34(_0x52af60, _0x2d82eb, _0x3a8461) : ![];
        const _0xea7314 = _0x52af60 ? _0x52af60 === _0x2d82eb['user']['id'] || _0x52af60 === _0x2d82eb['user']['id']['split'](':')[0x0] + '@s.whatsapp.net' : ![];
        const _0x5342cd = _0xea7314 || _0x28e970;
        if ((_0x3ae874 === 'private' || _0x3ae874 === 'self') && !_0x5342cd) {
            return;
        }
        invalidateGroupCache(_0x3a8461);
        if (!_0x3a8461['endsWith']('@g.us'))
            return;
        printLog('info', 'Group\x20update:\x20' + _0x471e9c + '\x20in\x20' + _0x3a8461['split']('@')[0x0]);
        const _0x500865 = _0x3ae874 === 'public' || _0x3ae874 === 'groups' || _0x5342cd;
        switch (_0x471e9c) {
        case 'promote':
            if (!_0x500865)
                return;
            if (_0xfcfdc6 && _0xfcfdc6['length'] > 0x0) {
                const _0x5eab06 = Array['isArray'](_0xfcfdc6) ? _0xfcfdc6[0x0] : _0xfcfdc6;
            }
            const _0x2b2ea2 = (await import('../plugins/promote.js'))['default']?.['handlePromotionEvent'];
            await _0x2b2ea2(_0x2d82eb, _0x3a8461, _0xfcfdc6, _0x52af60);
            break;
        case 'demote':
            if (!_0x500865)
                return;
            if (_0xfcfdc6 && _0xfcfdc6['length'] > 0x0) {
                const _0xe57f04 = Array['isArray'](_0xfcfdc6) ? _0xfcfdc6[0x0] : _0xfcfdc6;
            }
            const _0x2dcae1 = (await import('../plugins/demote.js'))['default']?.['handleDemotionEvent'];
            await _0x2dcae1(_0x2d82eb, _0x3a8461, _0xfcfdc6, _0x52af60);
            break;
        case 'add':
            if (_0xfcfdc6 && _0xfcfdc6['length'] > 0x0) {
                const _0x325d15 = Array['isArray'](_0xfcfdc6) ? _0xfcfdc6[0x0] : _0xfcfdc6;
            }
            const {handleJoinEvent: _0x2d9000} = await import('../plugins/welcome.js');
            await _0x2d9000(_0x2d82eb, _0x3a8461, _0xfcfdc6);
            break;
        case 'remove':
            if (_0xfcfdc6 && _0xfcfdc6['length'] > 0x0) {
                const _0xe1b0ca = Array['isArray'](_0xfcfdc6) ? _0xfcfdc6[0x0] : _0xfcfdc6;
            }
            const _0x46e3cd = (await import('../plugins/goodbye.js'))['default']?.['handleLeaveEvent'];
            await _0x46e3cd(_0x2d82eb, _0x3a8461, _0xfcfdc6);
            break;
        default:
            printLog('warning', 'Unhandled\x20group\x20action:\x20' + _0x471e9c);
        }
    } catch (_0x3cf20c) {
        printLog('error', 'Group\x20update\x20error:\x20' + _0x3cf20c['message']);
        console['error'](_0x3cf20c['stack']);
    }
}
async function handleStatus(_0xffb75c, _0xc4738d) {
    try {
        const {default: _0x3ebd50} = await import('../plugins/autostatus.js');
        const _0x28093c = _0x3ebd50['handleStatusUpdate'];
        await _0x28093c(_0xffb75c, _0xc4738d);
    } catch (_0x4d42d4) {
        printLog('error', 'Status\x20handler\x20error:\x20' + _0x4d42d4['message']);
        console['error'](_0x4d42d4['stack']);
    }
}
async function handleCall(_0x28d988, _0x43480e) {
    try {
        const _0x123b43 = (await import('../plugins/anticall.js'))['default'];
        const _0x48a41d = _0x123b43['readState'] ? await _0x123b43['readState']() : { 'enabled': ![] };
        if (!_0x48a41d['enabled'])
            return;
        const _0x2ed12e = new Set();
        for (const _0x2daee7 of _0x43480e) {
            const _0x2ef287 = _0x2daee7['from'] || _0x2daee7['peerJid'] || _0x2daee7['chatId'];
            if (!_0x2ef287)
                continue;
            try {
                try {
                    if (typeof _0x28d988['rejectCall'] === 'function' && _0x2daee7['id']) {
                        await _0x28d988['rejectCall'](_0x2daee7['id'], _0x2ef287);
                    } else if (typeof _0x28d988['sendCallOfferAck'] === 'function' && _0x2daee7['id']) {
                        await _0x28d988['sendCallOfferAck'](_0x2daee7['id'], _0x2ef287, 'reject');
                    }
                } catch (_0x4e7151) {
                    printLog('error', 'Error\x20rejecting\x20call:\x20' + _0x4e7151['message']);
                }
                if (!_0x2ed12e['has'](_0x2ef287)) {
                    _0x2ed12e['add'](_0x2ef287);
                    setTimeout(() => _0x2ed12e['delete'](_0x2ef287), 0xea60);
                    await _0x28d988['sendMessage'](_0x2ef287, { 'text': '📵\x20Anticall\x20is\x20enabled.\x20Your\x20call\x20was\x20rejected\x20and\x20you\x20will\x20be\x20blocked.' });
                    printLog('info', 'Sent\x20anticall\x20warning\x20to:\x20' + _0x2ef287['split']('@')[0x0]);
                }
                setTimeout(async () => {
                    try {
                        await _0x28d988['updateBlockStatus'](_0x2ef287, 'block');
                        printLog('success', 'Blocked\x20caller:\x20' + _0x2ef287['split']('@')[0x0]);
                    } catch (_0x57d848) {
                        printLog('error', 'Error\x20blocking\x20caller:\x20' + _0x57d848['message']);
                    }
                }, 0x320);
            } catch (_0x37f60f) {
                printLog('error', 'Error\x20handling\x20call\x20from\x20' + _0x2ef287['split']('@')[0x0] + ':\x20' + _0x37f60f['message']);
            }
        }
    } catch (_0x558364) {
        printLog('error', 'Call\x20handler\x20error:\x20' + _0x558364['message']);
        console['error'](_0x558364['stack']);
    }
}
export {
    handleMessages,
    handleGroupParticipantUpdate,
    handleStatus,
    handleCall
};