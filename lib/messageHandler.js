import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x5091bc from 'fs';
import { dataFile } from './paths.js';
import { handleChatbotResponse } from './Chatbots.js';
import _0x0_0x470d1b from '../config.js';
import _0x0_0x5fe1bd from './lightweight_store.js';
import _0x0_0x1d9dd9 from './commandHandler.js';
import {
    printMessage,
    printLog
} from './print.js';
import { isBanned } from './isBanned.js';
import { isSudo } from './index.js';
import _0x0_0x49e21e from './isOwner.js';
import _0x0_0xc0513d from './isAdmin.js';
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
        const _0x45b044 = await _0x0_0x5fe1bd['getSetting']('global', 'stickerCommands');
        return _0x45b044 || {};
    } else {
        try {
            if (!_0x0_0x5091bc['existsSync'](STICKER_FILE)) {
                return {};
            }
            return JSON['parse'](_0x0_0x5091bc['readFileSync'](STICKER_FILE, 'utf8'));
        } catch {
            return {};
        }
    }
}
async function handleMessages(_0x2df355, _0x319356) {
    try {
        const {
            messages: _0x230e52,
            type: _0x122ac4
        } = _0x319356;
        if (_0x122ac4 !== 'notify')
            return;
        const _0x173f49 = _0x230e52[0x0];
        if (!_0x173f49?.['message'])
            return;
        const _0x2cbd0c = _0x173f49['key']['remoteJid'];
        const _0x56a912 = _0x2cbd0c['endsWith']('@g.us');
        const _0x5136e4 = _0x173f49['key']['participant'] || _0x173f49['key']['remoteJid'];
        const _0x56c919 = await _0x0_0x49e21e(_0x5136e4, _0x2df355, _0x2cbd0c);
        const _0x13a60b = _0x173f49['key']['fromMe'] || _0x56c919;
        const _0x17170e = await _0x0_0x5fe1bd['getBotMode']();
        if ((_0x17170e === 'private' || _0x17170e === 'self') && !_0x13a60b) {
            return;
        }
        await printMessage(_0x173f49, _0x2df355);
        try {
            const _0x66d227 = await _0x0_0x5fe1bd['getSetting']('global', 'stealthMode');
            if (!_0x66d227 || !_0x66d227['enabled']) {
                await handleAutoread(_0x2df355, _0x173f49);
            } else {
                printLog('info', '👻\x20Stealth\x20mode\x20active');
            }
        } catch (_0x1663aa) {
            await handleAutoread(_0x2df355, _0x173f49);
        }
        if (_0x173f49['message']?.['protocolMessage']?.['type'] === 0x0) {
            printLog('info', 'Message\x20deletion\x20detected');
            await handleMessageRevocation(_0x2df355, _0x173f49);
            return;
        }
        await storeMessage(_0x2df355, _0x173f49);
        if (_0x173f49['pushName'] && _0x2df355['store']?.['contacts']) {
            const _0x1b1315 = _0x173f49['key']['participant'] || _0x173f49['key']['remoteJid'];
            if (_0x1b1315) {
                _0x2df355['store']['contacts'][_0x1b1315] = {
                    ..._0x2df355['store']['contacts'][_0x1b1315],
                    'id': _0x1b1315,
                    'notify': _0x173f49['pushName'],
                    'name': _0x173f49['pushName']
                };
                const _0x4441e2 = _0x2df355['decodeJid']?.(_0x1b1315);
                if (_0x4441e2 && _0x4441e2 !== _0x1b1315) {
                    _0x2df355['store']['contacts'][_0x4441e2] = {
                        ..._0x2df355['store']['contacts'][_0x4441e2],
                        'id': _0x4441e2,
                        'notify': _0x173f49['pushName'],
                        'name': _0x173f49['pushName']
                    };
                }
            }
        }
        const _0x199d07 = _0x173f49['key']['participant'] || _0x173f49['key']['remoteJid'];
        if (_0x199d07?.['includes']('@lid') && _0x2df355['store']?.['contacts']) {
            const _0x4eb632 = _0x2df355['store']['contacts'];
            const _0x5eabf1 = Object['keys'](_0x4eb632)['find'](_0x544155 => _0x4eb632[_0x544155]?.['lid'] === _0x199d07 || _0x4eb632[_0x544155]?.['lid']?.['split'](':')[0x0] === _0x199d07['split']('@')[0x0]);
            if (_0x5eabf1?.['includes']('@s.whatsapp.net'))
                _0x5136e4 = _0x5eabf1;
        }
        if (_0x173f49['message']?.['stickerMessage']) {
            const _0x2b77b5 = _0x173f49['message']['stickerMessage']['fileSha256'];
            if (_0x2b77b5) {
                const _0x206eb7 = Buffer['from'](_0x2b77b5)['toString']('base64');
                const _0x45e70a = await getStickerCommands();
                if (_0x45e70a[_0x206eb7]) {
                    const _0x3eebf0 = _0x45e70a[_0x206eb7]['text'];
                    const [_0x88ecb8, ..._0x139e72] = _0x3eebf0['split']('\x20');
                    let _0x1b97a8 = null;
                    let _0x5b271e = '';
                    for (const _0x48492d of _0x0_0x470d1b['prefixes']) {
                        const _0x1ca1a1 = (_0x48492d + _0x88ecb8)['toLowerCase']();
                        _0x1b97a8 = _0x0_0x1d9dd9['getCommand'](_0x1ca1a1, _0x0_0x470d1b['prefixes']);
                        if (_0x1b97a8) {
                            _0x5b271e = _0x48492d;
                            break;
                        }
                    }
                    if (_0x1b97a8) {
                        const _0x9bab11 = await isSudo(_0x5136e4);
                        const _0x550694 = await _0x0_0x49e21e(_0x5136e4, _0x2df355, _0x2cbd0c);
                        const _0x40cdc0 = _0x173f49['key']['fromMe'] || _0x550694;
                        const _0x2ec2fd = await _0x0_0x5fe1bd['getBotMode']();
                        const _0x4713c5 = ((() => {
                            if (_0x40cdc0)
                                return !![];
                            switch (_0x2ec2fd) {
                            case 'public':
                                return !![];
                            case 'private':
                            case 'self':
                                return ![];
                            case 'groups':
                                return _0x56a912;
                            case 'inbox':
                                return !_0x56a912;
                            default:
                                return !![];
                            }
                        })());
                        if (!_0x4713c5)
                            return;
                        const _0xbe7915 = await isBanned(_0x5136e4);
                        if (_0xbe7915)
                            return;
                        if (_0x1b97a8['strictOwnerOnly']) {
                            const {isOwnerOnly: _0x28c76f} = await import('./isOwner.js');
                            if (!_0x173f49['key']['fromMe'] && !_0x28c76f(_0x5136e4)) {
                                return await _0x2df355['sendMessage'](_0x2cbd0c, {
                                    'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20bot\x20owner!*',
                                    ...channelInfo
                                }, { 'quoted': _0x173f49 });
                            }
                        }
                        if (_0x1b97a8['ownerOnly'] && !_0x173f49['key']['fromMe'] && !_0x550694) {
                            return await _0x2df355['sendMessage'](_0x2cbd0c, {
                                'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20owner\x20or\x20sudo\x20users!*',
                                ...channelInfo
                            }, { 'quoted': _0x173f49 });
                        }
                        if (_0x1b97a8['groupOnly'] && !_0x56a912) {
                            return await _0x2df355['sendMessage'](_0x2cbd0c, {
                                'text': 'ℹ️\x20*This\x20command\x20can\x20only\x20be\x20used\x20in\x20groups!*',
                                ...channelInfo
                            }, { 'quoted': _0x173f49 });
                        }
                        let _0x3a9f4e = ![];
                        let _0xe69970 = ![];
                        if (_0x1b97a8['adminOnly'] && _0x56a912) {
                            const _0x25254c = await _0x0_0xc0513d(_0x2df355, _0x2cbd0c, _0x5136e4);
                            _0x3a9f4e = _0x25254c['isSenderAdmin'];
                            _0xe69970 = _0x25254c['isBotAdmin'];
                            if (!_0xe69970) {
                                return await _0x2df355['sendMessage'](_0x2cbd0c, {
                                    'text': 'ℹ️\x20*Please\x20make\x20the\x20bot\x20an\x20admin\x20to\x20use\x20this\x20command.*',
                                    ...channelInfo
                                }, { 'quoted': _0x173f49 });
                            }
                            if (!_0x3a9f4e && !_0x173f49['key']['fromMe'] && !_0x550694) {
                                return await _0x2df355['sendMessage'](_0x2cbd0c, {
                                    'text': 'ℹ️\x20*Sorry,\x20only\x20group\x20admins\x20can\x20use\x20this\x20command.*',
                                    ...channelInfo
                                }, { 'quoted': _0x173f49 });
                            }
                        }
                        const _0x498119 = {
                            'key': _0x173f49['key'],
                            'message': {
                                'extendedTextMessage': {
                                    'text': _0x5b271e + _0x3eebf0,
                                    'contextInfo': _0x173f49['message']['stickerMessage']['contextInfo'] || {}
                                }
                            },
                            'messageTimestamp': _0x173f49['messageTimestamp'],
                            'pushName': _0x173f49['pushName'],
                            'broadcast': _0x173f49['broadcast']
                        };
                        const _0x4f8569 = {
                            'chatId': _0x2cbd0c,
                            'senderId': _0x5136e4,
                            'isGroup': _0x56a912,
                            'isSenderAdmin': _0x3a9f4e,
                            'isBotAdmin': _0xe69970,
                            'senderIsOwnerOrSudo': _0x550694,
                            'isOwnerOrSudoCheck': _0x40cdc0,
                            'channelInfo': channelInfo,
                            'rawText': _0x5b271e + _0x3eebf0,
                            'userMessage': (_0x5b271e + _0x3eebf0)['toLowerCase'](),
                            'messageText': _0x5b271e + _0x3eebf0,
                            'config': _0x0_0x470d1b
                        };
                        try {
                            await _0x1b97a8['handler'](_0x2df355, _0x498119, _0x139e72, _0x4f8569);
                            await addCommandReaction(_0x2df355, _0x173f49);
                            await showTypingAfterCommand(_0x2df355, _0x2cbd0c);
                            printLog('success', '✅\x20Sticker\x20command\x20executed:\x20' + _0x3eebf0);
                        } catch (_0x2a2074) {
                            printLog('error', '❌\x20Sticker\x20command\x20error\x20[' + _0x3eebf0 + ']:\x20' + _0x2a2074['message']);
                            console['error'](_0x2a2074['stack']);
                            await _0x2df355['sendMessage'](_0x2cbd0c, {
                                'text': '❌\x20Error\x20executing\x20sticker\x20command:\x20' + _0x2a2074['message'],
                                ...channelInfo
                            }, { 'quoted': _0x173f49 });
                        }
                    } else {
                        printLog('warning', '⚠️\x20Sticker\x20command\x20not\x20found:\x20' + _0x3eebf0);
                    }
                    return;
                }
            }
        }
        const _0x472976 = _0x173f49['message']?.['conversation'] || _0x173f49['message']?.['extendedTextMessage']?.['text'] || _0x173f49['message']?.['imageMessage']?.['caption'] || _0x173f49['message']?.['videoMessage']?.['caption'] || _0x173f49['message']?.['buttonsResponseMessage']?.['selectedButtonId'] || '';
        const _0x5d27fd = _0x472976['trim']();
        const _0x44d03b = _0x5d27fd['toLowerCase']();
        const _0x39d14b = await isSudo(_0x5136e4);
        startSchedulerEngine(_0x2df355);
        if (!_0x173f49['key']['fromMe']) {
            const _0x398157 = await handleAutoReply(_0x2df355, _0x2cbd0c, _0x173f49, _0x44d03b);
            if (_0x398157)
                return;
        }
        if (_0x173f49['message']?.['buttonsResponseMessage']) {
            const _0x1c76a0 = _0x173f49['message']['buttonsResponseMessage']['selectedButtonId'];
            printLog('info', 'Button\x20response:\x20' + _0x1c76a0);
            if (_0x1c76a0 === 'channel') {
                await _0x2df355['sendMessage'](_0x2cbd0c, { 'text': '*Join\x20our\x20Channel:*\x0a[https://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y](https://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y)' }, { 'quoted': _0x173f49 });
                return;
            } else if (_0x1c76a0 === 'owner') {
                const _0x4210c0 = (await import('../plugins/owner.js'))['default'];
                await _0x4210c0['handler']?.(_0x2df355, _0x2cbd0c, '', {});
                return;
            } else if (_0x1c76a0 === 'support') {
                await _0x2df355['sendMessage'](_0x2cbd0c, { 'text': '*Support*\x0a\x0ahttps://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y' }, { 'quoted': _0x173f49 });
                return;
            }
        }
        const _0x22a405 = await isBanned(_0x5136e4);
        if (_0x22a405 && !_0x44d03b['startsWith']('.unban')) {
            if (Math['random']() < 0.1) {
                printLog('warning', 'Banned\x20user\x20attempted\x20command:\x20' + _0x5136e4['split']('@')[0x0]);
                await _0x2df355['sendMessage'](_0x2cbd0c, {
                    'text': 'You\x20are\x20banned\x20from\x20using\x20the\x20bot.\x20Contact\x20an\x20admin\x20to\x20get\x20unbanned.',
                    ...channelInfo
                });
            }
            return;
        }
        if (/^[1-9]$/['test'](_0x44d03b) || _0x44d03b === 'surrender') {
            await handleTicTacToeMove(_0x2df355, _0x2cbd0c, _0x5136e4, _0x44d03b);
            return;
        }
        if (!_0x173f49['key']['fromMe']) {
            await _0x0_0x5fe1bd['incrementMessageCount'](_0x2cbd0c, _0x5136e4, _0x173f49['pushName']);
        } else {
            const _0x2fe9fe = _0x2df355['user']?.['id'] || _0x5136e4;
            const _0x46e930 = _0x2df355['user']?.['name'] || _0x2df355['user']?.['notify'] || 'Me';
            await _0x0_0x5fe1bd['incrementMessageCount'](_0x2cbd0c, _0x2fe9fe, _0x46e930);
        }
        if (_0x56a912) {
            if (_0x44d03b) {
                await handleBadwordDetection(_0x2df355, _0x2cbd0c, _0x173f49, _0x44d03b, _0x5136e4);
            }
            await handleLinkDetection(_0x2df355, _0x2cbd0c, _0x173f49, _0x44d03b, _0x5136e4);
        }
        if (_0x56a912 && !_0x173f49['key']['fromMe']) {
            const _0x8e0106 = await handleAntiSpam(_0x2df355, _0x2cbd0c, _0x173f49, _0x5136e4, _0x56c919);
            if (_0x8e0106)
                return;
        }
        if (!_0x56a912 && !_0x173f49['key']['fromMe'] && !_0x39d14b) {
            try {
                const _0x5ab407 = (await import('../plugins/pmblocker.js'))['default'];
                const _0x28d069 = _0x5ab407?.['readState'];
                const _0x5af26d = await _0x28d069();
                if (_0x5af26d['enabled']) {
                    printLog('warning', 'PM\x20blocked\x20from:\x20' + _0x5136e4['split']('@')[0x0]);
                    await _0x2df355['sendMessage'](_0x2cbd0c, { 'text': _0x5af26d['message'] || 'Private\x20messages\x20are\x20blocked.\x20Please\x20contact\x20the\x20owner\x20in\x20groups\x20only.' });
                    await new Promise(_0xf23f4 => setTimeout(_0xf23f4, 0x5dc));
                    try {
                        await _0x2df355['updateBlockStatus'](_0x2cbd0c, 'block');
                        printLog('success', 'Blocked\x20user:\x20' + _0x5136e4['split']('@')[0x0]);
                    } catch (_0x59cb8d) {
                        printLog('error', 'Failed\x20to\x20block\x20user:\x20' + _0x59cb8d['message']);
                    }
                    return;
                }
            } catch (_0x3e5483) {
                printLog('error', 'PM\x20blocker\x20error:\x20' + _0x3e5483['message']);
            }
        }
        const _0x424c93 = _0x0_0x470d1b['prefixes']?.['find'](_0xc5d8d2 => _0x44d03b['startsWith'](_0xc5d8d2));
        const _0x16f28c = _0x0_0x1d9dd9['getCommand'](_0x44d03b, _0x0_0x470d1b['prefixes']);
        if (!_0x424c93 && !_0x16f28c) {
            await handleAutotypingForMessage(_0x2df355, _0x2cbd0c, _0x44d03b);
            const _0x155a0e = await _0x0_0x5fe1bd['getBotMode']();
            const _0x559faa = _0x155a0e === 'public' || _0x155a0e === 'groups' && _0x56a912 || _0x155a0e === 'inbox' && !_0x56a912 || _0x13a60b;
            if (_0x559faa) {
                if (_0x56a912 && _0x44d03b['length'] < 0x3) {
                    const _0x802386 = 'nova';
                    if (!_0x44d03b['includes'](_0x802386) && !_0x44d03b['includes']('@')) {
                        return;
                    }
                }
                await handleChatbotResponse(_0x2df355, _0x2cbd0c, _0x173f49, _0x44d03b, _0x5136e4);
            }
            return;
        }
        if (!_0x16f28c) {
            const _0x1cfeca = 'nova';
            const _0x31015e = _0x44d03b['includes'](_0x1cfeca) || _0x44d03b['includes']('@nova');
            if (_0x31015e) {
                const _0x295792 = await _0x0_0x5fe1bd['getBotMode']();
                const _0x3a98a4 = _0x295792 === 'public' || _0x295792 === 'groups' && _0x56a912 || _0x295792 === 'inbox' && !_0x56a912 || _0x13a60b;
                if (_0x3a98a4) {
                    await handleChatbotResponse(_0x2df355, _0x2cbd0c, _0x173f49, _0x44d03b, _0x5136e4);
                    return;
                }
            }
            return;
        }
        const _0x22c690 = ((() => {
            if (_0x13a60b)
                return !![];
            switch (_0x17170e) {
            case 'public':
                return !![];
            case 'private':
            case 'self':
                return ![];
            case 'groups':
                return _0x56a912;
            case 'inbox':
                return !_0x56a912;
            default:
                return !![];
            }
        })());
        if (!_0x22c690) {
            return;
        }
        let _0x2eddc2;
        if (_0x424c93) {
            const _0x1f24dd = _0x5d27fd['slice'](_0x424c93['length'])['trim']();
            _0x2eddc2 = _0x1f24dd['split'](/\s+/)['slice'](0x1);
        } else {
            _0x2eddc2 = _0x5d27fd['trim']()['split'](/\s+/)['slice'](0x1);
        }
        if (_0x16f28c['strictOwnerOnly']) {
            const {isOwnerOnly: _0x328b6b} = await import('./isOwner.js');
            if (!_0x173f49['key']['fromMe'] && !_0x328b6b(_0x5136e4)) {
                return await _0x2df355['sendMessage'](_0x2cbd0c, {
                    'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20bot\x20owner!*\x0a\x0a_Sudo\x20users\x20cannot\x20manage\x20other\x20sudo\x20users._',
                    ...channelInfo
                }, { 'quoted': _0x173f49 });
            }
        }
        if (_0x16f28c['ownerOnly'] && !_0x173f49['key']['fromMe'] && !_0x56c919) {
            return await _0x2df355['sendMessage'](_0x2cbd0c, {
                'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20owner\x20or\x20sudo\x20users!*',
                ...channelInfo
            }, { 'quoted': _0x173f49 });
        }
        if (_0x16f28c['groupOnly'] && !_0x56a912) {
            return await _0x2df355['sendMessage'](_0x2cbd0c, {
                'text': 'ℹ️\x20*This\x20command\x20can\x20only\x20be\x20used\x20in\x20groups!*',
                ...channelInfo
            }, { 'quoted': _0x173f49 });
        }
        let _0x4d19da = ![];
        let _0x19ada1 = ![];
        if (_0x16f28c['adminOnly'] && _0x56a912) {
            const _0x271dd0 = await _0x0_0xc0513d(_0x2df355, _0x2cbd0c, _0x5136e4);
            _0x4d19da = _0x271dd0['isSenderAdmin'];
            _0x19ada1 = _0x271dd0['isBotAdmin'];
            if (!_0x19ada1) {
                return await _0x2df355['sendMessage'](_0x2cbd0c, {
                    'text': 'ℹ️\x20*Please\x20make\x20the\x20bot\x20an\x20admin\x20to\x20use\x20this\x20command.*',
                    ...channelInfo
                }, { 'quoted': _0x173f49 });
            }
            if (!_0x4d19da && !_0x173f49['key']['fromMe'] && !_0x56c919) {
                return await _0x2df355['sendMessage'](_0x2cbd0c, {
                    'text': 'ℹ️\x20*Sorry,\x20only\x20group\x20admins\x20can\x20use\x20this\x20command.*',
                    ...channelInfo
                }, { 'quoted': _0x173f49 });
            }
        }
        const _0x181ed4 = {
            'chatId': _0x2cbd0c,
            'senderId': _0x5136e4,
            'isGroup': _0x56a912,
            'isSenderAdmin': _0x4d19da,
            'isBotAdmin': _0x19ada1,
            'senderIsOwnerOrSudo': _0x56c919,
            'isOwnerOrSudoCheck': _0x13a60b,
            'channelInfo': channelInfo,
            'rawText': _0x472976,
            'userMessage': _0x44d03b,
            'messageText': _0x5d27fd,
            'config': _0x0_0x470d1b
        };
        try {
            await _0x16f28c['handler'](_0x2df355, _0x173f49, _0x2eddc2, _0x181ed4);
            await addCommandReaction(_0x2df355, _0x173f49);
            await showTypingAfterCommand(_0x2df355, _0x2cbd0c);
        } catch (_0x52828b) {
            printLog('error', 'Command\x20error\x20[' + _0x16f28c['command'] + ']:\x20' + _0x52828b['message']);
            console['error'](_0x52828b['stack']);
            await _0x2df355['sendMessage'](_0x2cbd0c, {
                'text': '❌\x20Error\x20executing\x20command:\x20' + _0x52828b['message'],
                ...channelInfo
            }, { 'quoted': _0x173f49 });
            const _0x16ad4a = {
                'command': _0x16f28c['command'],
                'error': _0x52828b['message'],
                'stack': _0x52828b['stack'],
                'timestamp': new Date()['toISOString'](),
                'user': _0x5136e4,
                'chat': _0x2cbd0c
            };
            try {
                writeErrorLog(_0x16ad4a);
            } catch (_0x366d26) {
                printLog('error', 'Failed\x20to\x20write\x20error\x20log:\x20' + _0x366d26['message']);
            }
        }
    } catch (_0x50d48f) {
        printLog('error', 'Message\x20handler\x20error:\x20' + _0x50d48f['message']);
        console['error'](_0x50d48f['stack']);
        const _0x23170f = _0x319356['messages']?.[0x0]?.['key']?.['remoteJid'];
        if (_0x23170f) {
            try {
                await _0x2df355['sendMessage'](_0x23170f, {
                    'text': 'ℹ️\x20*Failed\x20to\x20process\x20message!*',
                    ...channelInfo
                });
            } catch (_0x2ad222) {
                printLog('error', 'Failed\x20to\x20send\x20error\x20message:\x20' + _0x2ad222['message']);
            }
        }
    }
}
async function handleGroupParticipantUpdate(_0x4d4bf2, _0x1acd48) {
    try {
        const {
            id: _0x4a88cc,
            participants: _0x35ddef,
            action: _0x276649,
            author: _0x447d65
        } = _0x1acd48;
        if (!_0x4a88cc['endsWith']('@g.us'))
            return;
        const _0x6fdff7 = await _0x0_0x5fe1bd['getBotMode']();
        const _0x364ae4 = _0x447d65 ? await _0x0_0x49e21e(_0x447d65, _0x4d4bf2, _0x4a88cc) : ![];
        const _0x3c312a = _0x447d65 ? _0x447d65 === _0x4d4bf2['user']['id'] || _0x447d65 === _0x4d4bf2['user']['id']['split'](':')[0x0] + '@s.whatsapp.net' : ![];
        const _0x12bfb5 = _0x3c312a || _0x364ae4;
        if ((_0x6fdff7 === 'private' || _0x6fdff7 === 'self') && !_0x12bfb5) {
            return;
        }
        invalidateGroupCache(_0x4a88cc);
        if (!_0x4a88cc['endsWith']('@g.us'))
            return;
        printLog('info', 'Group\x20update:\x20' + _0x276649 + '\x20in\x20' + _0x4a88cc['split']('@')[0x0]);
        const _0x26b51f = _0x6fdff7 === 'public' || _0x6fdff7 === 'groups' || _0x12bfb5;
        switch (_0x276649) {
        case 'promote':
            if (!_0x26b51f)
                return;
            const _0x50818a = (await import('../plugins/promote.js'))['default']?.['handlePromotionEvent'];
            await _0x50818a(_0x4d4bf2, _0x4a88cc, _0x35ddef, _0x447d65);
            break;
        case 'demote':
            if (!_0x26b51f)
                return;
            const _0x561db3 = (await import('../plugins/demote.js'))['default']?.['handleDemotionEvent'];
            await _0x561db3(_0x4d4bf2, _0x4a88cc, _0x35ddef, _0x447d65);
            break;
        case 'add':
            const {handleJoinEvent: _0x1fd2fc} = await import('../plugins/welcome.js');
            await _0x1fd2fc(_0x4d4bf2, _0x4a88cc, _0x35ddef);
            break;
        case 'remove':
            const _0x1b6d30 = (await import('../plugins/goodbye.js'))['default']?.['handleLeaveEvent'];
            await _0x1b6d30(_0x4d4bf2, _0x4a88cc, _0x35ddef);
            break;
        default:
            printLog('warning', 'Unhandled\x20group\x20action:\x20' + _0x276649);
        }
    } catch (_0x4bf455) {
        printLog('error', 'Group\x20update\x20error:\x20' + _0x4bf455['message']);
        console['error'](_0x4bf455['stack']);
    }
}
async function handleStatus(_0x481dc6, _0x45a9f2) {
    try {
        const {default: _0x2f0b93} = await import('../plugins/autostatus.js');
        const _0x5e3a83 = _0x2f0b93['handleStatusUpdate'];
        await _0x5e3a83(_0x481dc6, _0x45a9f2);
    } catch (_0x4f40f9) {
        printLog('error', 'Status\x20handler\x20error:\x20' + _0x4f40f9['message']);
        console['error'](_0x4f40f9['stack']);
    }
}
async function handleCall(_0x1bc611, _0x29e081) {
    try {
        const _0x175589 = (await import('../plugins/anticall.js'))['default'];
        const _0x3445f0 = _0x175589['readState'] ? await _0x175589['readState']() : { 'enabled': ![] };
        if (!_0x3445f0['enabled'])
            return;
        const _0x40932e = new Set();
        for (const _0x49feeb of _0x29e081) {
            const _0x4d6988 = _0x49feeb['from'] || _0x49feeb['peerJid'] || _0x49feeb['chatId'];
            if (!_0x4d6988)
                continue;
            try {
                try {
                    if (typeof _0x1bc611['rejectCall'] === 'function' && _0x49feeb['id']) {
                        await _0x1bc611['rejectCall'](_0x49feeb['id'], _0x4d6988);
                    } else if (typeof _0x1bc611['sendCallOfferAck'] === 'function' && _0x49feeb['id']) {
                        await _0x1bc611['sendCallOfferAck'](_0x49feeb['id'], _0x4d6988, 'reject');
                    }
                } catch (_0x4b7cc7) {
                    printLog('error', 'Error\x20rejecting\x20call:\x20' + _0x4b7cc7['message']);
                }
                if (!_0x40932e['has'](_0x4d6988)) {
                    _0x40932e['add'](_0x4d6988);
                    setTimeout(() => _0x40932e['delete'](_0x4d6988), 0xea60);
                    await _0x1bc611['sendMessage'](_0x4d6988, { 'text': '📵\x20Anticall\x20is\x20enabled.\x20Your\x20call\x20was\x20rejected\x20and\x20you\x20will\x20be\x20blocked.' });
                    printLog('info', 'Sent\x20anticall\x20warning\x20to:\x20' + _0x4d6988['split']('@')[0x0]);
                }
                setTimeout(async () => {
                    try {
                        await _0x1bc611['updateBlockStatus'](_0x4d6988, 'block');
                        printLog('success', 'Blocked\x20caller:\x20' + _0x4d6988['split']('@')[0x0]);
                    } catch (_0x2ab5c1) {
                        printLog('error', 'Error\x20blocking\x20caller:\x20' + _0x2ab5c1['message']);
                    }
                }, 0x320);
            } catch (_0x3fdb92) {
                printLog('error', 'Error\x20handling\x20call\x20from\x20' + _0x4d6988['split']('@')[0x0] + ':\x20' + _0x3fdb92['message']);
            }
        }
    } catch (_0x11e27d) {
        printLog('error', 'Call\x20handler\x20error:\x20' + _0x11e27d['message']);
        console['error'](_0x11e27d['stack']);
    }
}
export {
    handleMessages,
    handleGroupParticipantUpdate,
    handleStatus,
    handleCall
};