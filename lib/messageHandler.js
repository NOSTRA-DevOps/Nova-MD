import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x18cd3b from 'fs';
import { dataFile } from './paths.js';
import { handleChatbotResponse } from './Chatbots.js';
import _0x0_0x5d62ab from '../config.js';
import _0x0_0x4fa846 from './lightweight_store.js';
import _0x0_0x5d69a0 from './commandHandler.js';
import {
    printMessage,
    printLog
} from './print.js';
import { isBanned } from './isBanned.js';
import { isSudo } from './index.js';
import _0x0_0x1bc4af from './isOwner.js';
import _0x0_0x56c746 from './isAdmin.js';
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
        const _0x540761 = await _0x0_0x4fa846['getSetting']('global', 'stickerCommands');
        return _0x540761 || {};
    } else {
        try {
            if (!_0x0_0x18cd3b['existsSync'](STICKER_FILE)) {
                return {};
            }
            return JSON['parse'](_0x0_0x18cd3b['readFileSync'](STICKER_FILE, 'utf8'));
        } catch {
            return {};
        }
    }
}
async function handleMessages(_0x3e88c4, _0x51b0d6) {
    try {
        const {
            messages: _0x59e761,
            type: _0x1e57e1
        } = _0x51b0d6;
        if (_0x1e57e1 !== 'notify')
            return;
        const _0x1185cd = _0x59e761[0x0];
        if (!_0x1185cd?.['message'])
            return;
        const _0x1b00d6 = _0x1185cd['key']['remoteJid'];
        const _0x4428b2 = _0x1b00d6['endsWith']('@g.us');
        const _0x52dc3d = _0x1185cd['key']['participant'] || _0x1185cd['key']['remoteJid'];
        const _0x3d67ad = await _0x0_0x1bc4af(_0x52dc3d, _0x3e88c4, _0x1b00d6);
        const _0x29ca9f = _0x1185cd['key']['fromMe'] || _0x3d67ad;
        const _0x35f919 = await _0x0_0x4fa846['getBotMode']();
        if ((_0x35f919 === 'private' || _0x35f919 === 'self') && !_0x29ca9f) {
            return;
        }
        await printMessage(_0x1185cd, _0x3e88c4);
        try {
            const _0x483e63 = await _0x0_0x4fa846['getSetting']('global', 'stealthMode');
            if (!_0x483e63 || !_0x483e63['enabled']) {
                await handleAutoread(_0x3e88c4, _0x1185cd);
            } else {
                printLog('info', '👻\x20Stealth\x20mode\x20active');
            }
        } catch (_0x528938) {
            await handleAutoread(_0x3e88c4, _0x1185cd);
        }
        if (_0x1185cd['message']?.['protocolMessage']?.['type'] === 0x0) {
            printLog('info', 'Message\x20deletion\x20detected');
            await handleMessageRevocation(_0x3e88c4, _0x1185cd);
            return;
        }
        await storeMessage(_0x3e88c4, _0x1185cd);
        if (_0x1185cd['pushName'] && _0x3e88c4['store']?.['contacts']) {
            const _0x218129 = _0x1185cd['key']['participant'] || _0x1185cd['key']['remoteJid'];
            if (_0x218129) {
                _0x3e88c4['store']['contacts'][_0x218129] = {
                    ..._0x3e88c4['store']['contacts'][_0x218129],
                    'id': _0x218129,
                    'notify': _0x1185cd['pushName'],
                    'name': _0x1185cd['pushName']
                };
                const _0x345455 = _0x3e88c4['decodeJid']?.(_0x218129);
                if (_0x345455 && _0x345455 !== _0x218129) {
                    _0x3e88c4['store']['contacts'][_0x345455] = {
                        ..._0x3e88c4['store']['contacts'][_0x345455],
                        'id': _0x345455,
                        'notify': _0x1185cd['pushName'],
                        'name': _0x1185cd['pushName']
                    };
                }
            }
        }
        const _0x483e49 = _0x1185cd['key']['participant'] || _0x1185cd['key']['remoteJid'];
        if (_0x483e49?.['includes']('@lid') && _0x3e88c4['store']?.['contacts']) {
            const _0x4f7b00 = _0x3e88c4['store']['contacts'];
            const _0x3c3781 = Object['keys'](_0x4f7b00)['find'](_0x53a498 => _0x4f7b00[_0x53a498]?.['lid'] === _0x483e49 || _0x4f7b00[_0x53a498]?.['lid']?.['split'](':')[0x0] === _0x483e49['split']('@')[0x0]);
            if (_0x3c3781?.['includes']('@s.whatsapp.net'))
                _0x52dc3d = _0x3c3781;
        }
        if (_0x1185cd['message']?.['stickerMessage']) {
            const _0x3b5a52 = _0x1185cd['message']['stickerMessage']['fileSha256'];
            if (_0x3b5a52) {
                const _0x267c85 = Buffer['from'](_0x3b5a52)['toString']('base64');
                const _0x413bec = await getStickerCommands();
                if (_0x413bec[_0x267c85]) {
                    const _0x136199 = _0x413bec[_0x267c85]['text'];
                    const [_0x1588bc, ..._0x3f1622] = _0x136199['split']('\x20');
                    let _0x24a7bb = null;
                    let _0x550162 = '';
                    for (const _0x3046fb of _0x0_0x5d62ab['prefixes']) {
                        const _0x1b054e = (_0x3046fb + _0x1588bc)['toLowerCase']();
                        _0x24a7bb = _0x0_0x5d69a0['getCommand'](_0x1b054e, _0x0_0x5d62ab['prefixes']);
                        if (_0x24a7bb) {
                            _0x550162 = _0x3046fb;
                            break;
                        }
                    }
                    if (_0x24a7bb) {
                        const _0x326669 = await isSudo(_0x52dc3d);
                        const _0x182f70 = await _0x0_0x1bc4af(_0x52dc3d, _0x3e88c4, _0x1b00d6);
                        const _0x120511 = _0x1185cd['key']['fromMe'] || _0x182f70;
                        const _0x1fe3f3 = await _0x0_0x4fa846['getBotMode']();
                        const _0x4facf2 = ((() => {
                            if (_0x120511)
                                return !![];
                            switch (_0x1fe3f3) {
                            case 'public':
                                return !![];
                            case 'private':
                            case 'self':
                                return ![];
                            case 'groups':
                                return _0x4428b2;
                            case 'inbox':
                                return !_0x4428b2;
                            default:
                                return !![];
                            }
                        })());
                        if (!_0x4facf2)
                            return;
                        const _0xb49022 = await isBanned(_0x52dc3d);
                        if (_0xb49022)
                            return;
                        if (_0x24a7bb['strictOwnerOnly']) {
                            const {isOwnerOnly: _0x32ae86} = await import('./isOwner.js');
                            if (!_0x1185cd['key']['fromMe'] && !_0x32ae86(_0x52dc3d)) {
                                return await _0x3e88c4['sendMessage'](_0x1b00d6, {
                                    'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20bot\x20owner!*',
                                    ...channelInfo
                                }, { 'quoted': _0x1185cd });
                            }
                        }
                        if (_0x24a7bb['ownerOnly'] && !_0x1185cd['key']['fromMe'] && !_0x182f70) {
                            return await _0x3e88c4['sendMessage'](_0x1b00d6, {
                                'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20owner\x20or\x20sudo\x20users!*',
                                ...channelInfo
                            }, { 'quoted': _0x1185cd });
                        }
                        if (_0x24a7bb['groupOnly'] && !_0x4428b2) {
                            return await _0x3e88c4['sendMessage'](_0x1b00d6, {
                                'text': 'ℹ️\x20*This\x20command\x20can\x20only\x20be\x20used\x20in\x20groups!*',
                                ...channelInfo
                            }, { 'quoted': _0x1185cd });
                        }
                        let _0x2081af = ![];
                        let _0x21e1ed = ![];
                        if (_0x24a7bb['adminOnly'] && _0x4428b2) {
                            const _0x3c46a6 = await _0x0_0x56c746(_0x3e88c4, _0x1b00d6, _0x52dc3d);
                            _0x2081af = _0x3c46a6['isSenderAdmin'];
                            _0x21e1ed = _0x3c46a6['isBotAdmin'];
                            if (!_0x21e1ed) {
                                return await _0x3e88c4['sendMessage'](_0x1b00d6, {
                                    'text': 'ℹ️\x20*Please\x20make\x20the\x20bot\x20an\x20admin\x20to\x20use\x20this\x20command.*',
                                    ...channelInfo
                                }, { 'quoted': _0x1185cd });
                            }
                            if (!_0x2081af && !_0x1185cd['key']['fromMe'] && !_0x182f70) {
                                return await _0x3e88c4['sendMessage'](_0x1b00d6, {
                                    'text': 'ℹ️\x20*Sorry,\x20only\x20group\x20admins\x20can\x20use\x20this\x20command.*',
                                    ...channelInfo
                                }, { 'quoted': _0x1185cd });
                            }
                        }
                        const _0x539294 = {
                            'key': _0x1185cd['key'],
                            'message': {
                                'extendedTextMessage': {
                                    'text': _0x550162 + _0x136199,
                                    'contextInfo': _0x1185cd['message']['stickerMessage']['contextInfo'] || {}
                                }
                            },
                            'messageTimestamp': _0x1185cd['messageTimestamp'],
                            'pushName': _0x1185cd['pushName'],
                            'broadcast': _0x1185cd['broadcast']
                        };
                        const _0x486ae7 = {
                            'chatId': _0x1b00d6,
                            'senderId': _0x52dc3d,
                            'isGroup': _0x4428b2,
                            'isSenderAdmin': _0x2081af,
                            'isBotAdmin': _0x21e1ed,
                            'senderIsOwnerOrSudo': _0x182f70,
                            'isOwnerOrSudoCheck': _0x120511,
                            'channelInfo': channelInfo,
                            'rawText': _0x550162 + _0x136199,
                            'userMessage': (_0x550162 + _0x136199)['toLowerCase'](),
                            'messageText': _0x550162 + _0x136199,
                            'config': _0x0_0x5d62ab
                        };
                        try {
                            await _0x24a7bb['handler'](_0x3e88c4, _0x539294, _0x3f1622, _0x486ae7);
                            await addCommandReaction(_0x3e88c4, _0x1185cd);
                            await showTypingAfterCommand(_0x3e88c4, _0x1b00d6);
                            printLog('success', '✅\x20Sticker\x20command\x20executed:\x20' + _0x136199);
                        } catch (_0x489aaa) {
                            printLog('error', '❌\x20Sticker\x20command\x20error\x20[' + _0x136199 + ']:\x20' + _0x489aaa['message']);
                            console['error'](_0x489aaa['stack']);
                            await _0x3e88c4['sendMessage'](_0x1b00d6, {
                                'text': '❌\x20Error\x20executing\x20sticker\x20command:\x20' + _0x489aaa['message'],
                                ...channelInfo
                            }, { 'quoted': _0x1185cd });
                        }
                    } else {
                        printLog('warning', '⚠️\x20Sticker\x20command\x20not\x20found:\x20' + _0x136199);
                    }
                    return;
                }
            }
        }
        const _0x1a4a77 = _0x1185cd['message']?.['conversation'] || _0x1185cd['message']?.['extendedTextMessage']?.['text'] || _0x1185cd['message']?.['imageMessage']?.['caption'] || _0x1185cd['message']?.['videoMessage']?.['caption'] || _0x1185cd['message']?.['buttonsResponseMessage']?.['selectedButtonId'] || '';
        const _0x49269c = _0x1a4a77['trim']();
        const _0x5e84f9 = _0x49269c['toLowerCase']();
        const _0x2f18ab = await isSudo(_0x52dc3d);
        startSchedulerEngine(_0x3e88c4);
        if (!_0x1185cd['key']['fromMe']) {
            const _0x310dc7 = await handleAutoReply(_0x3e88c4, _0x1b00d6, _0x1185cd, _0x5e84f9);
            if (_0x310dc7)
                return;
        }
        if (_0x1185cd['message']?.['buttonsResponseMessage']) {
            const _0x2694b9 = _0x1185cd['message']['buttonsResponseMessage']['selectedButtonId'];
            printLog('info', 'Button\x20response:\x20' + _0x2694b9);
            if (_0x2694b9 === 'channel') {
                await _0x3e88c4['sendMessage'](_0x1b00d6, { 'text': '*Join\x20our\x20Channel:*\x0a[https://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y](https://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y)' }, { 'quoted': _0x1185cd });
                return;
            } else if (_0x2694b9 === 'owner') {
                const _0x4f3931 = (await import('../plugins/owner.js'))['default'];
                await _0x4f3931['handler']?.(_0x3e88c4, _0x1b00d6, '', {});
                return;
            } else if (_0x2694b9 === 'support') {
                await _0x3e88c4['sendMessage'](_0x1b00d6, { 'text': '*Support*\x0a\x0ahttps://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y' }, { 'quoted': _0x1185cd });
                return;
            }
        }
        const _0x377e1f = await isBanned(_0x52dc3d);
        if (_0x377e1f && !_0x5e84f9['startsWith']('.unban')) {
            if (Math['random']() < 0.1) {
                printLog('warning', 'Banned\x20user\x20attempted\x20command:\x20' + _0x52dc3d['split']('@')[0x0]);
                await _0x3e88c4['sendMessage'](_0x1b00d6, {
                    'text': 'You\x20are\x20banned\x20from\x20using\x20the\x20bot.\x20Contact\x20an\x20admin\x20to\x20get\x20unbanned.',
                    ...channelInfo
                });
            }
            return;
        }
        if (/^[1-9]$/['test'](_0x5e84f9) || _0x5e84f9 === 'surrender') {
            await handleTicTacToeMove(_0x3e88c4, _0x1b00d6, _0x52dc3d, _0x5e84f9);
            return;
        }
        if (!_0x1185cd['key']['fromMe']) {
            await _0x0_0x4fa846['incrementMessageCount'](_0x1b00d6, _0x52dc3d, _0x1185cd['pushName']);
        } else {
            const _0x20785f = _0x3e88c4['user']?.['id'] || _0x52dc3d;
            const _0x5089db = _0x3e88c4['user']?.['name'] || _0x3e88c4['user']?.['notify'] || 'Me';
            await _0x0_0x4fa846['incrementMessageCount'](_0x1b00d6, _0x20785f, _0x5089db);
        }
        if (_0x4428b2) {
            if (_0x5e84f9) {
                await handleBadwordDetection(_0x3e88c4, _0x1b00d6, _0x1185cd, _0x5e84f9, _0x52dc3d);
            }
            await handleLinkDetection(_0x3e88c4, _0x1b00d6, _0x1185cd, _0x5e84f9, _0x52dc3d);
        }
        if (_0x4428b2 && !_0x1185cd['key']['fromMe']) {
            const _0x497269 = await handleAntiSpam(_0x3e88c4, _0x1b00d6, _0x1185cd, _0x52dc3d, _0x3d67ad);
            if (_0x497269)
                return;
        }
        if (!_0x4428b2 && !_0x1185cd['key']['fromMe'] && !_0x2f18ab) {
            try {
                const _0x533d84 = (await import('../plugins/pmblocker.js'))['default'];
                const _0x35bcef = _0x533d84?.['readState'];
                const _0xa6b0a8 = await _0x35bcef();
                if (_0xa6b0a8['enabled']) {
                    printLog('warning', 'PM\x20blocked\x20from:\x20' + _0x52dc3d['split']('@')[0x0]);
                    await _0x3e88c4['sendMessage'](_0x1b00d6, { 'text': _0xa6b0a8['message'] || 'Private\x20messages\x20are\x20blocked.\x20Please\x20contact\x20the\x20owner\x20in\x20groups\x20only.' });
                    await new Promise(_0x2306a1 => setTimeout(_0x2306a1, 0x5dc));
                    try {
                        await _0x3e88c4['updateBlockStatus'](_0x1b00d6, 'block');
                        printLog('success', 'Blocked\x20user:\x20' + _0x52dc3d['split']('@')[0x0]);
                    } catch (_0x1b686b) {
                        printLog('error', 'Failed\x20to\x20block\x20user:\x20' + _0x1b686b['message']);
                    }
                    return;
                }
            } catch (_0x4452f6) {
                printLog('error', 'PM\x20blocker\x20error:\x20' + _0x4452f6['message']);
            }
        }
        const _0xbb2ee7 = _0x0_0x5d62ab['prefixes']?.['find'](_0x51b7bc => _0x5e84f9['startsWith'](_0x51b7bc));
        const _0x48b4bf = _0x0_0x5d69a0['getCommand'](_0x5e84f9, _0x0_0x5d62ab['prefixes']);
        if (!_0xbb2ee7 && !_0x48b4bf) {
            await handleAutotypingForMessage(_0x3e88c4, _0x1b00d6, _0x5e84f9);
            const _0x47f6db = await _0x0_0x4fa846['getBotMode']();
            const _0x3fd5c6 = _0x47f6db === 'public' || _0x47f6db === 'groups' && _0x4428b2 || _0x47f6db === 'inbox' && !_0x4428b2 || _0x29ca9f;
            if (_0x3fd5c6) {
                if (_0x4428b2 && _0x5e84f9['length'] < 0x3) {
                    const _0x257b80 = 'nova';
                    if (!_0x5e84f9['includes'](_0x257b80) && !_0x5e84f9['includes']('@')) {
                        return;
                    }
                }
                await handleChatbotResponse(_0x3e88c4, _0x1b00d6, _0x1185cd, _0x5e84f9, _0x52dc3d);
            }
            return;
        }
        if (!_0x48b4bf) {
            const _0x458b26 = 'nova';
            const _0x5da05a = _0x5e84f9['includes'](_0x458b26) || _0x5e84f9['includes']('@nova');
            if (_0x5da05a) {
                const _0x1413d6 = await _0x0_0x4fa846['getBotMode']();
                const _0x1bcece = _0x1413d6 === 'public' || _0x1413d6 === 'groups' && _0x4428b2 || _0x1413d6 === 'inbox' && !_0x4428b2 || _0x29ca9f;
                if (_0x1bcece) {
                    await handleChatbotResponse(_0x3e88c4, _0x1b00d6, _0x1185cd, _0x5e84f9, _0x52dc3d);
                    return;
                }
            }
            return;
        }
        const _0x23d5ee = ((() => {
            if (_0x29ca9f)
                return !![];
            switch (_0x35f919) {
            case 'public':
                return !![];
            case 'private':
            case 'self':
                return ![];
            case 'groups':
                return _0x4428b2;
            case 'inbox':
                return !_0x4428b2;
            default:
                return !![];
            }
        })());
        if (!_0x23d5ee) {
            return;
        }
        let _0xd2404e;
        if (_0xbb2ee7) {
            const _0x3627b3 = _0x49269c['slice'](_0xbb2ee7['length'])['trim']();
            _0xd2404e = _0x3627b3['split'](/\s+/)['slice'](0x1);
        } else {
            _0xd2404e = _0x49269c['trim']()['split'](/\s+/)['slice'](0x1);
        }
        if (_0x48b4bf['strictOwnerOnly']) {
            const {isOwnerOnly: _0x567e35} = await import('./isOwner.js');
            if (!_0x1185cd['key']['fromMe'] && !_0x567e35(_0x52dc3d)) {
                return await _0x3e88c4['sendMessage'](_0x1b00d6, {
                    'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20bot\x20owner!*\x0a\x0a_Sudo\x20users\x20cannot\x20manage\x20other\x20sudo\x20users._',
                    ...channelInfo
                }, { 'quoted': _0x1185cd });
            }
        }
        if (_0x48b4bf['ownerOnly'] && !_0x1185cd['key']['fromMe'] && !_0x3d67ad) {
            return await _0x3e88c4['sendMessage'](_0x1b00d6, {
                'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20owner\x20or\x20sudo\x20users!*',
                ...channelInfo
            }, { 'quoted': _0x1185cd });
        }
        if (_0x48b4bf['groupOnly'] && !_0x4428b2) {
            return await _0x3e88c4['sendMessage'](_0x1b00d6, {
                'text': 'ℹ️\x20*This\x20command\x20can\x20only\x20be\x20used\x20in\x20groups!*',
                ...channelInfo
            }, { 'quoted': _0x1185cd });
        }
        let _0x51f7f4 = ![];
        let _0x5eeb98 = ![];
        if (_0x48b4bf['adminOnly'] && _0x4428b2) {
            const _0x2d464d = await _0x0_0x56c746(_0x3e88c4, _0x1b00d6, _0x52dc3d);
            _0x51f7f4 = _0x2d464d['isSenderAdmin'];
            _0x5eeb98 = _0x2d464d['isBotAdmin'];
            if (!_0x5eeb98) {
                return await _0x3e88c4['sendMessage'](_0x1b00d6, {
                    'text': 'ℹ️\x20*Please\x20make\x20the\x20bot\x20an\x20admin\x20to\x20use\x20this\x20command.*',
                    ...channelInfo
                }, { 'quoted': _0x1185cd });
            }
            if (!_0x51f7f4 && !_0x1185cd['key']['fromMe'] && !_0x3d67ad) {
                return await _0x3e88c4['sendMessage'](_0x1b00d6, {
                    'text': 'ℹ️\x20*Sorry,\x20only\x20group\x20admins\x20can\x20use\x20this\x20command.*',
                    ...channelInfo
                }, { 'quoted': _0x1185cd });
            }
        }
        const _0x506a37 = {
            'chatId': _0x1b00d6,
            'senderId': _0x52dc3d,
            'isGroup': _0x4428b2,
            'isSenderAdmin': _0x51f7f4,
            'isBotAdmin': _0x5eeb98,
            'senderIsOwnerOrSudo': _0x3d67ad,
            'isOwnerOrSudoCheck': _0x29ca9f,
            'channelInfo': channelInfo,
            'rawText': _0x1a4a77,
            'userMessage': _0x5e84f9,
            'messageText': _0x49269c,
            'config': _0x0_0x5d62ab
        };
        try {
            await _0x48b4bf['handler'](_0x3e88c4, _0x1185cd, _0xd2404e, _0x506a37);
            await addCommandReaction(_0x3e88c4, _0x1185cd);
            await showTypingAfterCommand(_0x3e88c4, _0x1b00d6);
        } catch (_0x53a331) {
            printLog('error', 'Command\x20error\x20[' + _0x48b4bf['command'] + ']:\x20' + _0x53a331['message']);
            console['error'](_0x53a331['stack']);
            await _0x3e88c4['sendMessage'](_0x1b00d6, {
                'text': '❌\x20Error\x20executing\x20command:\x20' + _0x53a331['message'],
                ...channelInfo
            }, { 'quoted': _0x1185cd });
            const _0x9523c = {
                'command': _0x48b4bf['command'],
                'error': _0x53a331['message'],
                'stack': _0x53a331['stack'],
                'timestamp': new Date()['toISOString'](),
                'user': _0x52dc3d,
                'chat': _0x1b00d6
            };
            try {
                writeErrorLog(_0x9523c);
            } catch (_0x1e0baf) {
                printLog('error', 'Failed\x20to\x20write\x20error\x20log:\x20' + _0x1e0baf['message']);
            }
        }
    } catch (_0x570fde) {
        printLog('error', 'Message\x20handler\x20error:\x20' + _0x570fde['message']);
        console['error'](_0x570fde['stack']);
        const _0x1b43ac = _0x51b0d6['messages']?.[0x0]?.['key']?.['remoteJid'];
        if (_0x1b43ac) {
            try {
                await _0x3e88c4['sendMessage'](_0x1b43ac, {
                    'text': 'ℹ️\x20*Failed\x20to\x20process\x20message!*',
                    ...channelInfo
                });
            } catch (_0x140dbf) {
                printLog('error', 'Failed\x20to\x20send\x20error\x20message:\x20' + _0x140dbf['message']);
            }
        }
    }
}
async function handleGroupParticipantUpdate(_0xb6c3d5, _0x1ad3ba) {
    try {
        const {
            id: _0x1c0a27,
            participants: _0x383813,
            action: _0x324373,
            author: _0x567449
        } = _0x1ad3ba;
        if (!_0x1c0a27['endsWith']('@g.us'))
            return;
        const _0x2fb9d4 = await _0x0_0x4fa846['getBotMode']();
        const _0x3bcbfe = _0x567449 ? await _0x0_0x1bc4af(_0x567449, _0xb6c3d5, _0x1c0a27) : ![];
        const _0x541144 = _0x567449 ? _0x567449 === _0xb6c3d5['user']['id'] || _0x567449 === _0xb6c3d5['user']['id']['split'](':')[0x0] + '@s.whatsapp.net' : ![];
        const _0x5cb108 = _0x541144 || _0x3bcbfe;
        if ((_0x2fb9d4 === 'private' || _0x2fb9d4 === 'self') && !_0x5cb108) {
            return;
        }
        invalidateGroupCache(_0x1c0a27);
        if (!_0x1c0a27['endsWith']('@g.us'))
            return;
        printLog('info', 'Group\x20update:\x20' + _0x324373 + '\x20in\x20' + _0x1c0a27['split']('@')[0x0]);
        const _0xae007e = _0x2fb9d4 === 'public' || _0x2fb9d4 === 'groups' || _0x5cb108;
        switch (_0x324373) {
        case 'promote':
            if (!_0xae007e)
                return;
            const _0x386b4f = (await import('../plugins/promote.js'))['default']?.['handlePromotionEvent'];
            await _0x386b4f(_0xb6c3d5, _0x1c0a27, _0x383813, _0x567449);
            break;
        case 'demote':
            if (!_0xae007e)
                return;
            const _0x3f5818 = (await import('../plugins/demote.js'))['default']?.['handleDemotionEvent'];
            await _0x3f5818(_0xb6c3d5, _0x1c0a27, _0x383813, _0x567449);
            break;
        case 'add':
            const {handleJoinEvent: _0x2ed927} = await import('../plugins/welcome.js');
            await _0x2ed927(_0xb6c3d5, _0x1c0a27, _0x383813);
            break;
        case 'remove':
            const _0x4a285c = (await import('../plugins/goodbye.js'))['default']?.['handleLeaveEvent'];
            await _0x4a285c(_0xb6c3d5, _0x1c0a27, _0x383813);
            break;
        default:
            printLog('warning', 'Unhandled\x20group\x20action:\x20' + _0x324373);
        }
    } catch (_0x14d5c6) {
        printLog('error', 'Group\x20update\x20error:\x20' + _0x14d5c6['message']);
        console['error'](_0x14d5c6['stack']);
    }
}
async function handleStatus(_0x2d4bb6, _0x1c8809) {
    try {
        const {default: _0x4afe68} = await import('../plugins/autostatus.js');
        const _0x4f7c07 = _0x4afe68['handleStatusUpdate'];
        await _0x4f7c07(_0x2d4bb6, _0x1c8809);
    } catch (_0x2024c3) {
        printLog('error', 'Status\x20handler\x20error:\x20' + _0x2024c3['message']);
        console['error'](_0x2024c3['stack']);
    }
}
async function handleCall(_0x39353b, _0x7c9c8e) {
    try {
        const _0x2a05e5 = (await import('../plugins/anticall.js'))['default'];
        const _0x550a32 = _0x2a05e5['readState'] ? await _0x2a05e5['readState']() : { 'enabled': ![] };
        if (!_0x550a32['enabled'])
            return;
        const _0x2d03fa = new Set();
        for (const _0x3e14a6 of _0x7c9c8e) {
            const _0x3d9f3c = _0x3e14a6['from'] || _0x3e14a6['peerJid'] || _0x3e14a6['chatId'];
            if (!_0x3d9f3c)
                continue;
            try {
                try {
                    if (typeof _0x39353b['rejectCall'] === 'function' && _0x3e14a6['id']) {
                        await _0x39353b['rejectCall'](_0x3e14a6['id'], _0x3d9f3c);
                    } else if (typeof _0x39353b['sendCallOfferAck'] === 'function' && _0x3e14a6['id']) {
                        await _0x39353b['sendCallOfferAck'](_0x3e14a6['id'], _0x3d9f3c, 'reject');
                    }
                } catch (_0x3af965) {
                    printLog('error', 'Error\x20rejecting\x20call:\x20' + _0x3af965['message']);
                }
                if (!_0x2d03fa['has'](_0x3d9f3c)) {
                    _0x2d03fa['add'](_0x3d9f3c);
                    setTimeout(() => _0x2d03fa['delete'](_0x3d9f3c), 0xea60);
                    await _0x39353b['sendMessage'](_0x3d9f3c, { 'text': '📵\x20Anticall\x20is\x20enabled.\x20Your\x20call\x20was\x20rejected\x20and\x20you\x20will\x20be\x20blocked.' });
                    printLog('info', 'Sent\x20anticall\x20warning\x20to:\x20' + _0x3d9f3c['split']('@')[0x0]);
                }
                setTimeout(async () => {
                    try {
                        await _0x39353b['updateBlockStatus'](_0x3d9f3c, 'block');
                        printLog('success', 'Blocked\x20caller:\x20' + _0x3d9f3c['split']('@')[0x0]);
                    } catch (_0x5eda17) {
                        printLog('error', 'Error\x20blocking\x20caller:\x20' + _0x5eda17['message']);
                    }
                }, 0x320);
            } catch (_0x4d7c76) {
                printLog('error', 'Error\x20handling\x20call\x20from\x20' + _0x3d9f3c['split']('@')[0x0] + ':\x20' + _0x4d7c76['message']);
            }
        }
    } catch (_0x17c770) {
        printLog('error', 'Call\x20handler\x20error:\x20' + _0x17c770['message']);
        console['error'](_0x17c770['stack']);
    }
}
export {
    handleMessages,
    handleGroupParticipantUpdate,
    handleStatus,
    handleCall
};