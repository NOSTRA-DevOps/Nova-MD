import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x29cde7 from 'fs';
import { dataFile } from './paths.js';
import { handleChatbotResponse } from './Chatbots.js';
import _0x0_0x47c6a4 from '../config.js';
import _0x0_0x350a11 from './lightweight_store.js';
import _0x0_0x4c657a from './commandHandler.js';
import {
    printMessage,
    printLog
} from './print.js';
import { isBanned } from './isBanned.js';
import { isSudo } from './index.js';
import _0x0_0xba0e02 from './isOwner.js';
import _0x0_0x331aca from './isAdmin.js';
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
        const _0x4d7dec = await _0x0_0x350a11['getSetting']('global', 'stickerCommands');
        return _0x4d7dec || {};
    } else {
        try {
            if (!_0x0_0x29cde7['existsSync'](STICKER_FILE)) {
                return {};
            }
            return JSON['parse'](_0x0_0x29cde7['readFileSync'](STICKER_FILE, 'utf8'));
        } catch {
            return {};
        }
    }
}
async function handleMessages(_0x4b7094, _0x2e025f) {
    try {
        const {
            messages: _0x23e34a,
            type: _0x5c4c5c
        } = _0x2e025f;
        if (_0x5c4c5c !== 'notify')
            return;
        const _0x55fdc1 = _0x23e34a[0x0];
        if (!_0x55fdc1?.['message'])
            return;
        const _0x10b3aa = _0x55fdc1['key']['remoteJid'];
        const _0x44a968 = _0x10b3aa['endsWith']('@g.us');
        const _0x4a0d58 = _0x55fdc1['key']['participant'] || _0x55fdc1['key']['remoteJid'];
        const _0x3566b3 = await _0x0_0xba0e02(_0x4a0d58, _0x4b7094, _0x10b3aa);
        const _0xca5cbe = _0x55fdc1['key']['fromMe'] || _0x3566b3;
        const _0x408cce = await _0x0_0x350a11['getBotMode']();
        if ((_0x408cce === 'private' || _0x408cce === 'self') && !_0xca5cbe) {
            return;
        }
        await printMessage(_0x55fdc1, _0x4b7094);
        try {
            const _0x3ceb37 = await _0x0_0x350a11['getSetting']('global', 'stealthMode');
            if (!_0x3ceb37 || !_0x3ceb37['enabled']) {
                await handleAutoread(_0x4b7094, _0x55fdc1);
            } else {
                printLog('info', '👻\x20Stealth\x20mode\x20active');
            }
        } catch (_0x1e323c) {
            await handleAutoread(_0x4b7094, _0x55fdc1);
        }
        if (_0x55fdc1['message']?.['protocolMessage']?.['type'] === 0x0) {
            printLog('info', 'Message\x20deletion\x20detected');
            await handleMessageRevocation(_0x4b7094, _0x55fdc1);
            return;
        }
        await storeMessage(_0x4b7094, _0x55fdc1);
        if (_0x55fdc1['pushName'] && _0x4b7094['store']?.['contacts']) {
            const _0x16a38b = _0x55fdc1['key']['participant'] || _0x55fdc1['key']['remoteJid'];
            if (_0x16a38b) {
                _0x4b7094['store']['contacts'][_0x16a38b] = {
                    ..._0x4b7094['store']['contacts'][_0x16a38b],
                    'id': _0x16a38b,
                    'notify': _0x55fdc1['pushName'],
                    'name': _0x55fdc1['pushName']
                };
                const _0x3bcdcf = _0x4b7094['decodeJid']?.(_0x16a38b);
                if (_0x3bcdcf && _0x3bcdcf !== _0x16a38b) {
                    _0x4b7094['store']['contacts'][_0x3bcdcf] = {
                        ..._0x4b7094['store']['contacts'][_0x3bcdcf],
                        'id': _0x3bcdcf,
                        'notify': _0x55fdc1['pushName'],
                        'name': _0x55fdc1['pushName']
                    };
                }
            }
        }
        const _0x74d0e = _0x55fdc1['key']['participant'] || _0x55fdc1['key']['remoteJid'];
        if (_0x74d0e?.['includes']('@lid') && _0x4b7094['store']?.['contacts']) {
            const _0x2fac1a = _0x4b7094['store']['contacts'];
            const _0x1a394c = Object['keys'](_0x2fac1a)['find'](_0x4c50c5 => _0x2fac1a[_0x4c50c5]?.['lid'] === _0x74d0e || _0x2fac1a[_0x4c50c5]?.['lid']?.['split'](':')[0x0] === _0x74d0e['split']('@')[0x0]);
            if (_0x1a394c?.['includes']('@s.whatsapp.net'))
                _0x4a0d58 = _0x1a394c;
        }
        if (_0x55fdc1['message']?.['stickerMessage']) {
            const _0x546787 = _0x55fdc1['message']['stickerMessage']['fileSha256'];
            if (_0x546787) {
                const _0x84aacd = Buffer['from'](_0x546787)['toString']('base64');
                const _0x33e485 = await getStickerCommands();
                if (_0x33e485[_0x84aacd]) {
                    const _0x47f54c = _0x33e485[_0x84aacd]['text'];
                    const [_0x3c4dc9, ..._0x5b3634] = _0x47f54c['split']('\x20');
                    let _0x1c391c = null;
                    let _0x2f8d2a = '';
                    for (const _0x2ffa55 of _0x0_0x47c6a4['prefixes']) {
                        const _0x257753 = (_0x2ffa55 + _0x3c4dc9)['toLowerCase']();
                        _0x1c391c = _0x0_0x4c657a['getCommand'](_0x257753, _0x0_0x47c6a4['prefixes']);
                        if (_0x1c391c) {
                            _0x2f8d2a = _0x2ffa55;
                            break;
                        }
                    }
                    if (_0x1c391c) {
                        const _0x469f93 = await isSudo(_0x4a0d58);
                        const _0x5742b0 = await _0x0_0xba0e02(_0x4a0d58, _0x4b7094, _0x10b3aa);
                        const _0x559a85 = _0x55fdc1['key']['fromMe'] || _0x5742b0;
                        const _0x2f6fbf = await _0x0_0x350a11['getBotMode']();
                        const _0x4e2be9 = ((() => {
                            if (_0x559a85)
                                return !![];
                            switch (_0x2f6fbf) {
                            case 'public':
                                return !![];
                            case 'private':
                            case 'self':
                                return ![];
                            case 'groups':
                                return _0x44a968;
                            case 'inbox':
                                return !_0x44a968;
                            default:
                                return !![];
                            }
                        })());
                        if (!_0x4e2be9)
                            return;
                        const _0x217880 = await isBanned(_0x4a0d58);
                        if (_0x217880)
                            return;
                        if (_0x1c391c['strictOwnerOnly']) {
                            const {isOwnerOnly: _0x5a7387} = await import('./isOwner.js');
                            if (!_0x55fdc1['key']['fromMe'] && !_0x5a7387(_0x4a0d58)) {
                                return await _0x4b7094['sendMessage'](_0x10b3aa, {
                                    'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20bot\x20owner!*',
                                    ...channelInfo
                                }, { 'quoted': _0x55fdc1 });
                            }
                        }
                        if (_0x1c391c['ownerOnly'] && !_0x55fdc1['key']['fromMe'] && !_0x5742b0) {
                            return await _0x4b7094['sendMessage'](_0x10b3aa, {
                                'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20owner\x20or\x20sudo\x20users!*',
                                ...channelInfo
                            }, { 'quoted': _0x55fdc1 });
                        }
                        if (_0x1c391c['groupOnly'] && !_0x44a968) {
                            return await _0x4b7094['sendMessage'](_0x10b3aa, {
                                'text': 'ℹ️\x20*This\x20command\x20can\x20only\x20be\x20used\x20in\x20groups!*',
                                ...channelInfo
                            }, { 'quoted': _0x55fdc1 });
                        }
                        let _0x41e99c = ![];
                        let _0x435f6c = ![];
                        if (_0x1c391c['adminOnly'] && _0x44a968) {
                            const _0x1f44ea = await _0x0_0x331aca(_0x4b7094, _0x10b3aa, _0x4a0d58);
                            _0x41e99c = _0x1f44ea['isSenderAdmin'];
                            _0x435f6c = _0x1f44ea['isBotAdmin'];
                            if (!_0x435f6c) {
                                return await _0x4b7094['sendMessage'](_0x10b3aa, {
                                    'text': 'ℹ️\x20*Please\x20make\x20the\x20bot\x20an\x20admin\x20to\x20use\x20this\x20command.*',
                                    ...channelInfo
                                }, { 'quoted': _0x55fdc1 });
                            }
                            if (!_0x41e99c && !_0x55fdc1['key']['fromMe'] && !_0x5742b0) {
                                return await _0x4b7094['sendMessage'](_0x10b3aa, {
                                    'text': 'ℹ️\x20*Sorry,\x20only\x20group\x20admins\x20can\x20use\x20this\x20command.*',
                                    ...channelInfo
                                }, { 'quoted': _0x55fdc1 });
                            }
                        }
                        const _0x1920d0 = {
                            'key': _0x55fdc1['key'],
                            'message': {
                                'extendedTextMessage': {
                                    'text': _0x2f8d2a + _0x47f54c,
                                    'contextInfo': _0x55fdc1['message']['stickerMessage']['contextInfo'] || {}
                                }
                            },
                            'messageTimestamp': _0x55fdc1['messageTimestamp'],
                            'pushName': _0x55fdc1['pushName'],
                            'broadcast': _0x55fdc1['broadcast']
                        };
                        const _0x2e5203 = {
                            'chatId': _0x10b3aa,
                            'senderId': _0x4a0d58,
                            'isGroup': _0x44a968,
                            'isSenderAdmin': _0x41e99c,
                            'isBotAdmin': _0x435f6c,
                            'senderIsOwnerOrSudo': _0x5742b0,
                            'isOwnerOrSudoCheck': _0x559a85,
                            'channelInfo': channelInfo,
                            'rawText': _0x2f8d2a + _0x47f54c,
                            'userMessage': (_0x2f8d2a + _0x47f54c)['toLowerCase'](),
                            'messageText': _0x2f8d2a + _0x47f54c,
                            'config': _0x0_0x47c6a4
                        };
                        try {
                            await _0x1c391c['handler'](_0x4b7094, _0x1920d0, _0x5b3634, _0x2e5203);
                            await addCommandReaction(_0x4b7094, _0x55fdc1);
                            await showTypingAfterCommand(_0x4b7094, _0x10b3aa);
                            printLog('success', '✅\x20Sticker\x20command\x20executed:\x20' + _0x47f54c);
                        } catch (_0x16b181) {
                            printLog('error', '❌\x20Sticker\x20command\x20error\x20[' + _0x47f54c + ']:\x20' + _0x16b181['message']);
                            console['error'](_0x16b181['stack']);
                            await _0x4b7094['sendMessage'](_0x10b3aa, {
                                'text': '❌\x20Error\x20executing\x20sticker\x20command:\x20' + _0x16b181['message'],
                                ...channelInfo
                            }, { 'quoted': _0x55fdc1 });
                        }
                    } else {
                        printLog('warning', '⚠️\x20Sticker\x20command\x20not\x20found:\x20' + _0x47f54c);
                    }
                    return;
                }
            }
        }
        const _0x4ee576 = _0x55fdc1['message']?.['conversation'] || _0x55fdc1['message']?.['extendedTextMessage']?.['text'] || _0x55fdc1['message']?.['imageMessage']?.['caption'] || _0x55fdc1['message']?.['videoMessage']?.['caption'] || _0x55fdc1['message']?.['buttonsResponseMessage']?.['selectedButtonId'] || '';
        const _0x2f8790 = _0x4ee576['trim']();
        const _0x26de1f = _0x2f8790['toLowerCase']();
        const _0x1a2642 = await isSudo(_0x4a0d58);
        startSchedulerEngine(_0x4b7094);
        if (!_0x55fdc1['key']['fromMe']) {
            const _0x54c46b = await handleAutoReply(_0x4b7094, _0x10b3aa, _0x55fdc1, _0x26de1f);
            if (_0x54c46b)
                return;
        }
        if (_0x55fdc1['message']?.['buttonsResponseMessage']) {
            const _0x5ec2b2 = _0x55fdc1['message']['buttonsResponseMessage']['selectedButtonId'];
            printLog('info', 'Button\x20response:\x20' + _0x5ec2b2);
            if (_0x5ec2b2 === 'channel') {
                await _0x4b7094['sendMessage'](_0x10b3aa, { 'text': '*Join\x20our\x20Channel:*\x0a[https://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y](https://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y)' }, { 'quoted': _0x55fdc1 });
                return;
            } else if (_0x5ec2b2 === 'owner') {
                const _0x35e996 = (await import('../plugins/owner.js'))['default'];
                await _0x35e996['handler']?.(_0x4b7094, _0x10b3aa, '', {});
                return;
            } else if (_0x5ec2b2 === 'support') {
                await _0x4b7094['sendMessage'](_0x10b3aa, { 'text': '*Support*\x0a\x0ahttps://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y' }, { 'quoted': _0x55fdc1 });
                return;
            }
        }
        const _0x46424a = await isBanned(_0x4a0d58);
        if (_0x46424a && !_0x26de1f['startsWith']('.unban')) {
            if (Math['random']() < 0.1) {
                printLog('warning', 'Banned\x20user\x20attempted\x20command:\x20' + _0x4a0d58['split']('@')[0x0]);
                await _0x4b7094['sendMessage'](_0x10b3aa, {
                    'text': 'You\x20are\x20banned\x20from\x20using\x20the\x20bot.\x20Contact\x20an\x20admin\x20to\x20get\x20unbanned.',
                    ...channelInfo
                });
            }
            return;
        }
        if (/^[1-9]$/['test'](_0x26de1f) || _0x26de1f === 'surrender') {
            await handleTicTacToeMove(_0x4b7094, _0x10b3aa, _0x4a0d58, _0x26de1f);
            return;
        }
        if (!_0x55fdc1['key']['fromMe']) {
            await _0x0_0x350a11['incrementMessageCount'](_0x10b3aa, _0x4a0d58, _0x55fdc1['pushName']);
        } else {
            const _0x3b971b = _0x4b7094['user']?.['id'] || _0x4a0d58;
            const _0x301f9b = _0x4b7094['user']?.['name'] || _0x4b7094['user']?.['notify'] || 'Me';
            await _0x0_0x350a11['incrementMessageCount'](_0x10b3aa, _0x3b971b, _0x301f9b);
        }
        if (_0x44a968) {
            if (_0x26de1f) {
                await handleBadwordDetection(_0x4b7094, _0x10b3aa, _0x55fdc1, _0x26de1f, _0x4a0d58);
            }
            await handleLinkDetection(_0x4b7094, _0x10b3aa, _0x55fdc1, _0x26de1f, _0x4a0d58);
        }
        if (_0x44a968 && !_0x55fdc1['key']['fromMe']) {
            const _0x180296 = await handleAntiSpam(_0x4b7094, _0x10b3aa, _0x55fdc1, _0x4a0d58, _0x3566b3);
            if (_0x180296)
                return;
        }
        if (!_0x44a968 && !_0x55fdc1['key']['fromMe'] && !_0x1a2642) {
            try {
                const _0x33726c = (await import('../plugins/pmblocker.js'))['default'];
                const _0x42813b = _0x33726c?.['readState'];
                const _0x444e0a = await _0x42813b();
                if (_0x444e0a['enabled']) {
                    printLog('warning', 'PM\x20blocked\x20from:\x20' + _0x4a0d58['split']('@')[0x0]);
                    await _0x4b7094['sendMessage'](_0x10b3aa, { 'text': _0x444e0a['message'] || 'Private\x20messages\x20are\x20blocked.\x20Please\x20contact\x20the\x20owner\x20in\x20groups\x20only.' });
                    await new Promise(_0x5f301d => setTimeout(_0x5f301d, 0x5dc));
                    try {
                        await _0x4b7094['updateBlockStatus'](_0x10b3aa, 'block');
                        printLog('success', 'Blocked\x20user:\x20' + _0x4a0d58['split']('@')[0x0]);
                    } catch (_0x442430) {
                        printLog('error', 'Failed\x20to\x20block\x20user:\x20' + _0x442430['message']);
                    }
                    return;
                }
            } catch (_0x36b224) {
                printLog('error', 'PM\x20blocker\x20error:\x20' + _0x36b224['message']);
            }
        }
        const _0x5d6bc1 = _0x0_0x47c6a4['prefixes']?.['find'](_0x502f3f => _0x26de1f['startsWith'](_0x502f3f));
        const _0x2f5d9a = _0x0_0x4c657a['getCommand'](_0x26de1f, _0x0_0x47c6a4['prefixes']);
        if (!_0x5d6bc1 && !_0x2f5d9a) {
            await handleAutotypingForMessage(_0x4b7094, _0x10b3aa, _0x26de1f);
            if (_0x44a968) {
                await handleTagDetection(_0x4b7094, _0x10b3aa, _0x55fdc1, _0x4a0d58);
                await handleMentionDetection(_0x4b7094, _0x10b3aa, _0x55fdc1);
                const _0x5f2b62 = await _0x0_0x350a11['getBotMode']();
                const _0x1ada26 = _0x5f2b62 === 'public' || _0x5f2b62 === 'groups' && _0x44a968 || _0x5f2b62 === 'inbox' && !_0x44a968 || _0xca5cbe;
                if (_0x1ada26) {
                    await handleChatbotResponse(_0x4b7094, _0x10b3aa, _0x55fdc1, _0x26de1f, _0x4a0d58);
                }
            }
            return;
        }
        if (!_0x2f5d9a) {
            if (_0x44a968) {
                await handleTagDetection(_0x4b7094, _0x10b3aa, _0x55fdc1, _0x4a0d58);
                await handleMentionDetection(_0x4b7094, _0x10b3aa, _0x55fdc1);
                const _0x5db666 = await _0x0_0x350a11['getBotMode']();
                const _0x13b5a4 = _0x5db666 === 'public' || _0x5db666 === 'groups' && _0x44a968 || _0x5db666 === 'inbox' && !_0x44a968 || _0xca5cbe;
                if (_0x13b5a4) {
                    await handleChatbotResponse(_0x4b7094, _0x10b3aa, _0x55fdc1, _0x26de1f, _0x4a0d58);
                }
            }
            return;
        }
        const _0x359d59 = ((() => {
            if (_0xca5cbe)
                return !![];
            switch (_0x408cce) {
            case 'public':
                return !![];
            case 'private':
            case 'self':
                return ![];
            case 'groups':
                return _0x44a968;
            case 'inbox':
                return !_0x44a968;
            default:
                return !![];
            }
        })());
        if (!_0x359d59) {
            return;
        }
        let _0x17d51e;
        if (_0x5d6bc1) {
            const _0x84793a = _0x2f8790['slice'](_0x5d6bc1['length'])['trim']();
            _0x17d51e = _0x84793a['split'](/\s+/)['slice'](0x1);
        } else {
            _0x17d51e = _0x2f8790['trim']()['split'](/\s+/)['slice'](0x1);
        }
        if (_0x2f5d9a['strictOwnerOnly']) {
            const {isOwnerOnly: _0x46de97} = await import('./isOwner.js');
            if (!_0x55fdc1['key']['fromMe'] && !_0x46de97(_0x4a0d58)) {
                return await _0x4b7094['sendMessage'](_0x10b3aa, {
                    'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20bot\x20owner!*\x0a\x0a_Sudo\x20users\x20cannot\x20manage\x20other\x20sudo\x20users._',
                    ...channelInfo
                }, { 'quoted': _0x55fdc1 });
            }
        }
        if (_0x2f5d9a['ownerOnly'] && !_0x55fdc1['key']['fromMe'] && !_0x3566b3) {
            return await _0x4b7094['sendMessage'](_0x10b3aa, {
                'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20owner\x20or\x20sudo\x20users!*',
                ...channelInfo
            }, { 'quoted': _0x55fdc1 });
        }
        if (_0x2f5d9a['groupOnly'] && !_0x44a968) {
            return await _0x4b7094['sendMessage'](_0x10b3aa, {
                'text': 'ℹ️\x20*This\x20command\x20can\x20only\x20be\x20used\x20in\x20groups!*',
                ...channelInfo
            }, { 'quoted': _0x55fdc1 });
        }
        let _0x10cf1f = ![];
        let _0x94f2a9 = ![];
        if (_0x2f5d9a['adminOnly'] && _0x44a968) {
            const _0x1c78c2 = await _0x0_0x331aca(_0x4b7094, _0x10b3aa, _0x4a0d58);
            _0x10cf1f = _0x1c78c2['isSenderAdmin'];
            _0x94f2a9 = _0x1c78c2['isBotAdmin'];
            if (!_0x94f2a9) {
                return await _0x4b7094['sendMessage'](_0x10b3aa, {
                    'text': 'ℹ️\x20*Please\x20make\x20the\x20bot\x20an\x20admin\x20to\x20use\x20this\x20command.*',
                    ...channelInfo
                }, { 'quoted': _0x55fdc1 });
            }
            if (!_0x10cf1f && !_0x55fdc1['key']['fromMe'] && !_0x3566b3) {
                return await _0x4b7094['sendMessage'](_0x10b3aa, {
                    'text': 'ℹ️\x20*Sorry,\x20only\x20group\x20admins\x20can\x20use\x20this\x20command.*',
                    ...channelInfo
                }, { 'quoted': _0x55fdc1 });
            }
        }
        const _0x50b65d = {
            'chatId': _0x10b3aa,
            'senderId': _0x4a0d58,
            'isGroup': _0x44a968,
            'isSenderAdmin': _0x10cf1f,
            'isBotAdmin': _0x94f2a9,
            'senderIsOwnerOrSudo': _0x3566b3,
            'isOwnerOrSudoCheck': _0xca5cbe,
            'channelInfo': channelInfo,
            'rawText': _0x4ee576,
            'userMessage': _0x26de1f,
            'messageText': _0x2f8790,
            'config': _0x0_0x47c6a4
        };
        try {
            await _0x2f5d9a['handler'](_0x4b7094, _0x55fdc1, _0x17d51e, _0x50b65d);
            await addCommandReaction(_0x4b7094, _0x55fdc1);
            await showTypingAfterCommand(_0x4b7094, _0x10b3aa);
        } catch (_0xc56628) {
            printLog('error', 'Command\x20error\x20[' + _0x2f5d9a['command'] + ']:\x20' + _0xc56628['message']);
            console['error'](_0xc56628['stack']);
            await _0x4b7094['sendMessage'](_0x10b3aa, {
                'text': '❌\x20Error\x20executing\x20command:\x20' + _0xc56628['message'],
                ...channelInfo
            }, { 'quoted': _0x55fdc1 });
            const _0x252fe4 = {
                'command': _0x2f5d9a['command'],
                'error': _0xc56628['message'],
                'stack': _0xc56628['stack'],
                'timestamp': new Date()['toISOString'](),
                'user': _0x4a0d58,
                'chat': _0x10b3aa
            };
            try {
                writeErrorLog(_0x252fe4);
            } catch (_0x27ce8a) {
                printLog('error', 'Failed\x20to\x20write\x20error\x20log:\x20' + _0x27ce8a['message']);
            }
        }
    } catch (_0x58cd1d) {
        printLog('error', 'Message\x20handler\x20error:\x20' + _0x58cd1d['message']);
        console['error'](_0x58cd1d['stack']);
        const _0x329e0a = _0x2e025f['messages']?.[0x0]?.['key']?.['remoteJid'];
        if (_0x329e0a) {
            try {
                await _0x4b7094['sendMessage'](_0x329e0a, {
                    'text': 'ℹ️\x20*Failed\x20to\x20process\x20message!*',
                    ...channelInfo
                });
            } catch (_0x14c4c6) {
                printLog('error', 'Failed\x20to\x20send\x20error\x20message:\x20' + _0x14c4c6['message']);
            }
        }
    }
}
async function handleGroupParticipantUpdate(_0x178e2b, _0x1c1e6a) {
    try {
        const {
            id: _0x3c10c1,
            participants: _0x4fe750,
            action: _0x54a82b,
            author: _0x12f977
        } = _0x1c1e6a;
        if (!_0x3c10c1['endsWith']('@g.us'))
            return;
        const _0xe6c347 = await _0x0_0x350a11['getBotMode']();
        const _0xc66550 = _0x12f977 ? await _0x0_0xba0e02(_0x12f977, _0x178e2b, _0x3c10c1) : ![];
        const _0x21a13c = _0x12f977 ? _0x12f977 === _0x178e2b['user']['id'] || _0x12f977 === _0x178e2b['user']['id']['split'](':')[0x0] + '@s.whatsapp.net' : ![];
        const _0x43d1db = _0x21a13c || _0xc66550;
        if ((_0xe6c347 === 'private' || _0xe6c347 === 'self') && !_0x43d1db) {
            return;
        }
        invalidateGroupCache(_0x3c10c1);
        if (!_0x3c10c1['endsWith']('@g.us'))
            return;
        printLog('info', 'Group\x20update:\x20' + _0x54a82b + '\x20in\x20' + _0x3c10c1['split']('@')[0x0]);
        const _0x463a15 = _0xe6c347 === 'public' || _0xe6c347 === 'groups' || _0x43d1db;
        switch (_0x54a82b) {
        case 'promote':
            if (!_0x463a15)
                return;
            if (_0x4fe750 && _0x4fe750['length'] > 0x0) {
                const _0x2f7311 = Array['isArray'](_0x4fe750) ? _0x4fe750[0x0] : _0x4fe750;
            }
            const _0x3f9e87 = (await import('../plugins/promote.js'))['default']?.['handlePromotionEvent'];
            await _0x3f9e87(_0x178e2b, _0x3c10c1, _0x4fe750, _0x12f977);
            break;
        case 'demote':
            if (!_0x463a15)
                return;
            if (_0x4fe750 && _0x4fe750['length'] > 0x0) {
                const _0xa1f288 = Array['isArray'](_0x4fe750) ? _0x4fe750[0x0] : _0x4fe750;
            }
            const _0xc701a7 = (await import('../plugins/demote.js'))['default']?.['handleDemotionEvent'];
            await _0xc701a7(_0x178e2b, _0x3c10c1, _0x4fe750, _0x12f977);
            break;
        case 'add':
            if (_0x4fe750 && _0x4fe750['length'] > 0x0) {
                const _0x38c2ad = Array['isArray'](_0x4fe750) ? _0x4fe750[0x0] : _0x4fe750;
            }
            const {handleJoinEvent: _0x45ec3f} = await import('../plugins/welcome.js');
            await _0x45ec3f(_0x178e2b, _0x3c10c1, _0x4fe750);
            break;
        case 'remove':
            if (_0x4fe750 && _0x4fe750['length'] > 0x0) {
                const _0x4bd9eb = Array['isArray'](_0x4fe750) ? _0x4fe750[0x0] : _0x4fe750;
            }
            const _0x4bdde5 = (await import('../plugins/goodbye.js'))['default']?.['handleLeaveEvent'];
            await _0x4bdde5(_0x178e2b, _0x3c10c1, _0x4fe750);
            break;
        default:
            printLog('warning', 'Unhandled\x20group\x20action:\x20' + _0x54a82b);
        }
    } catch (_0x498d3e) {
        printLog('error', 'Group\x20update\x20error:\x20' + _0x498d3e['message']);
        console['error'](_0x498d3e['stack']);
    }
}
async function handleStatus(_0x1e15ca, _0x276bab) {
    try {
        const {default: _0xa2baa3} = await import('../plugins/autostatus.js');
        const _0x1f93f6 = _0xa2baa3['handleStatusUpdate'];
        await _0x1f93f6(_0x1e15ca, _0x276bab);
    } catch (_0x2e03b2) {
        printLog('error', 'Status\x20handler\x20error:\x20' + _0x2e03b2['message']);
        console['error'](_0x2e03b2['stack']);
    }
}
async function handleCall(_0x17c4d4, _0x3e5bf4) {
    try {
        const _0x493980 = (await import('../plugins/anticall.js'))['default'];
        const _0x14a9ac = _0x493980['readState'] ? await _0x493980['readState']() : { 'enabled': ![] };
        if (!_0x14a9ac['enabled'])
            return;
        const _0x55db03 = new Set();
        for (const _0x486005 of _0x3e5bf4) {
            const _0x56c4bd = _0x486005['from'] || _0x486005['peerJid'] || _0x486005['chatId'];
            if (!_0x56c4bd)
                continue;
            try {
                try {
                    if (typeof _0x17c4d4['rejectCall'] === 'function' && _0x486005['id']) {
                        await _0x17c4d4['rejectCall'](_0x486005['id'], _0x56c4bd);
                    } else if (typeof _0x17c4d4['sendCallOfferAck'] === 'function' && _0x486005['id']) {
                        await _0x17c4d4['sendCallOfferAck'](_0x486005['id'], _0x56c4bd, 'reject');
                    }
                } catch (_0x39140a) {
                    printLog('error', 'Error\x20rejecting\x20call:\x20' + _0x39140a['message']);
                }
                if (!_0x55db03['has'](_0x56c4bd)) {
                    _0x55db03['add'](_0x56c4bd);
                    setTimeout(() => _0x55db03['delete'](_0x56c4bd), 0xea60);
                    await _0x17c4d4['sendMessage'](_0x56c4bd, { 'text': '📵\x20Anticall\x20is\x20enabled.\x20Your\x20call\x20was\x20rejected\x20and\x20you\x20will\x20be\x20blocked.' });
                    printLog('info', 'Sent\x20anticall\x20warning\x20to:\x20' + _0x56c4bd['split']('@')[0x0]);
                }
                setTimeout(async () => {
                    try {
                        await _0x17c4d4['updateBlockStatus'](_0x56c4bd, 'block');
                        printLog('success', 'Blocked\x20caller:\x20' + _0x56c4bd['split']('@')[0x0]);
                    } catch (_0x3df45b) {
                        printLog('error', 'Error\x20blocking\x20caller:\x20' + _0x3df45b['message']);
                    }
                }, 0x320);
            } catch (_0x2cdb4a) {
                printLog('error', 'Error\x20handling\x20call\x20from\x20' + _0x56c4bd['split']('@')[0x0] + ':\x20' + _0x2cdb4a['message']);
            }
        }
    } catch (_0x26fb96) {
        printLog('error', 'Call\x20handler\x20error:\x20' + _0x26fb96['message']);
        console['error'](_0x26fb96['stack']);
    }
}
export {
    handleMessages,
    handleGroupParticipantUpdate,
    handleStatus,
    handleCall
};