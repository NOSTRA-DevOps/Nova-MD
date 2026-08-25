import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x56c269 from 'fs';
import { dataFile } from './paths.js';
import { handleChatbotResponse } from './Chatbots.js';
import _0x0_0x224b49 from '../config.js';
import _0x0_0x54ea10 from './lightweight_store.js';
import _0x0_0x4e2c24 from './commandHandler.js';
import {
    printMessage,
    printLog
} from './print.js';
import { isBanned } from './isBanned.js';
import { isSudo } from './index.js';
import _0x0_0x29e20b from './isOwner.js';
import _0x0_0x4e9a3c from './isAdmin.js';
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
        const _0x4e71e7 = await _0x0_0x54ea10['getSetting']('global', 'stickerCommands');
        return _0x4e71e7 || {};
    } else {
        try {
            if (!_0x0_0x56c269['existsSync'](STICKER_FILE)) {
                return {};
            }
            return JSON['parse'](_0x0_0x56c269['readFileSync'](STICKER_FILE, 'utf8'));
        } catch {
            return {};
        }
    }
}
async function handleMessages(_0x37a7cb, _0x428847) {
    try {
        const {
            messages: _0x3c909f,
            type: _0xcd7e7c
        } = _0x428847;
        if (_0xcd7e7c !== 'notify')
            return;
        const _0x341a56 = _0x3c909f[0x0];
        if (!_0x341a56?.['message'])
            return;
        const _0x4a51a0 = _0x341a56['key']['remoteJid'];
        const _0x460dcd = _0x4a51a0['endsWith']('@g.us');
        const _0x2af6cb = _0x341a56['key']['participant'] || _0x341a56['key']['remoteJid'];
        const _0x4e1be0 = await _0x0_0x29e20b(_0x2af6cb, _0x37a7cb, _0x4a51a0);
        const _0x3751d4 = _0x341a56['key']['fromMe'] || _0x4e1be0;
        const _0x5b84e6 = await _0x0_0x54ea10['getBotMode']();
        if ((_0x5b84e6 === 'private' || _0x5b84e6 === 'self') && !_0x3751d4) {
            return;
        }
        await printMessage(_0x341a56, _0x37a7cb);
        try {
            const _0x5106d4 = await _0x0_0x54ea10['getSetting']('global', 'stealthMode');
            if (!_0x5106d4 || !_0x5106d4['enabled']) {
                await handleAutoread(_0x37a7cb, _0x341a56);
            } else {
                printLog('info', '👻\x20Stealth\x20mode\x20active');
            }
        } catch (_0x21b845) {
            await handleAutoread(_0x37a7cb, _0x341a56);
        }
        if (_0x341a56['message']?.['protocolMessage']?.['type'] === 0x0) {
            printLog('info', 'Message\x20deletion\x20detected');
            await handleMessageRevocation(_0x37a7cb, _0x341a56);
            return;
        }
        await storeMessage(_0x37a7cb, _0x341a56);
        if (_0x341a56['pushName'] && _0x37a7cb['store']?.['contacts']) {
            const _0x131da2 = _0x341a56['key']['participant'] || _0x341a56['key']['remoteJid'];
            if (_0x131da2) {
                _0x37a7cb['store']['contacts'][_0x131da2] = {
                    ..._0x37a7cb['store']['contacts'][_0x131da2],
                    'id': _0x131da2,
                    'notify': _0x341a56['pushName'],
                    'name': _0x341a56['pushName']
                };
                const _0x2297ff = _0x37a7cb['decodeJid']?.(_0x131da2);
                if (_0x2297ff && _0x2297ff !== _0x131da2) {
                    _0x37a7cb['store']['contacts'][_0x2297ff] = {
                        ..._0x37a7cb['store']['contacts'][_0x2297ff],
                        'id': _0x2297ff,
                        'notify': _0x341a56['pushName'],
                        'name': _0x341a56['pushName']
                    };
                }
            }
        }
        const _0x122bf0 = _0x341a56['key']['participant'] || _0x341a56['key']['remoteJid'];
        if (_0x122bf0?.['includes']('@lid') && _0x37a7cb['store']?.['contacts']) {
            const _0xfc128b = _0x37a7cb['store']['contacts'];
            const _0x43dd88 = Object['keys'](_0xfc128b)['find'](_0x176c71 => _0xfc128b[_0x176c71]?.['lid'] === _0x122bf0 || _0xfc128b[_0x176c71]?.['lid']?.['split'](':')[0x0] === _0x122bf0['split']('@')[0x0]);
            if (_0x43dd88?.['includes']('@s.whatsapp.net'))
                _0x2af6cb = _0x43dd88;
        }
        if (_0x341a56['message']?.['stickerMessage']) {
            const _0x2b112a = _0x341a56['message']['stickerMessage']['fileSha256'];
            if (_0x2b112a) {
                const _0x1cb237 = Buffer['from'](_0x2b112a)['toString']('base64');
                const _0x10fbf4 = await getStickerCommands();
                if (_0x10fbf4[_0x1cb237]) {
                    const _0x2dd218 = _0x10fbf4[_0x1cb237]['text'];
                    const [_0x5502e0, ..._0x21b83b] = _0x2dd218['split']('\x20');
                    let _0x2b385d = null;
                    let _0x480f81 = '';
                    for (const _0x2436c3 of _0x0_0x224b49['prefixes']) {
                        const _0x5dc998 = (_0x2436c3 + _0x5502e0)['toLowerCase']();
                        _0x2b385d = _0x0_0x4e2c24['getCommand'](_0x5dc998, _0x0_0x224b49['prefixes']);
                        if (_0x2b385d) {
                            _0x480f81 = _0x2436c3;
                            break;
                        }
                    }
                    if (_0x2b385d) {
                        const _0xd2ff51 = await isSudo(_0x2af6cb);
                        const _0x196c12 = await _0x0_0x29e20b(_0x2af6cb, _0x37a7cb, _0x4a51a0);
                        const _0x5d5cb1 = _0x341a56['key']['fromMe'] || _0x196c12;
                        const _0x8085bd = await _0x0_0x54ea10['getBotMode']();
                        const _0x48ff6f = ((() => {
                            if (_0x5d5cb1)
                                return !![];
                            switch (_0x8085bd) {
                            case 'public':
                                return !![];
                            case 'private':
                            case 'self':
                                return ![];
                            case 'groups':
                                return _0x460dcd;
                            case 'inbox':
                                return !_0x460dcd;
                            default:
                                return !![];
                            }
                        })());
                        if (!_0x48ff6f)
                            return;
                        const _0x18607c = await isBanned(_0x2af6cb);
                        if (_0x18607c)
                            return;
                        if (_0x2b385d['strictOwnerOnly']) {
                            const {isOwnerOnly: _0x206a4b} = await import('./isOwner.js');
                            if (!_0x341a56['key']['fromMe'] && !_0x206a4b(_0x2af6cb)) {
                                return await _0x37a7cb['sendMessage'](_0x4a51a0, {
                                    'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20bot\x20owner!*',
                                    ...channelInfo
                                }, { 'quoted': _0x341a56 });
                            }
                        }
                        if (_0x2b385d['ownerOnly'] && !_0x341a56['key']['fromMe'] && !_0x196c12) {
                            return await _0x37a7cb['sendMessage'](_0x4a51a0, {
                                'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20owner\x20or\x20sudo\x20users!*',
                                ...channelInfo
                            }, { 'quoted': _0x341a56 });
                        }
                        if (_0x2b385d['groupOnly'] && !_0x460dcd) {
                            return await _0x37a7cb['sendMessage'](_0x4a51a0, {
                                'text': 'ℹ️\x20*This\x20command\x20can\x20only\x20be\x20used\x20in\x20groups!*',
                                ...channelInfo
                            }, { 'quoted': _0x341a56 });
                        }
                        let _0x170fa5 = ![];
                        let _0x33c19a = ![];
                        if (_0x2b385d['adminOnly'] && _0x460dcd) {
                            const _0x30a7d0 = await _0x0_0x4e9a3c(_0x37a7cb, _0x4a51a0, _0x2af6cb);
                            _0x170fa5 = _0x30a7d0['isSenderAdmin'];
                            _0x33c19a = _0x30a7d0['isBotAdmin'];
                            if (!_0x33c19a) {
                                return await _0x37a7cb['sendMessage'](_0x4a51a0, {
                                    'text': 'ℹ️\x20*Please\x20make\x20the\x20bot\x20an\x20admin\x20to\x20use\x20this\x20command.*',
                                    ...channelInfo
                                }, { 'quoted': _0x341a56 });
                            }
                            if (!_0x170fa5 && !_0x341a56['key']['fromMe'] && !_0x196c12) {
                                return await _0x37a7cb['sendMessage'](_0x4a51a0, {
                                    'text': 'ℹ️\x20*Sorry,\x20only\x20group\x20admins\x20can\x20use\x20this\x20command.*',
                                    ...channelInfo
                                }, { 'quoted': _0x341a56 });
                            }
                        }
                        const _0xa345b8 = {
                            'key': _0x341a56['key'],
                            'message': {
                                'extendedTextMessage': {
                                    'text': _0x480f81 + _0x2dd218,
                                    'contextInfo': _0x341a56['message']['stickerMessage']['contextInfo'] || {}
                                }
                            },
                            'messageTimestamp': _0x341a56['messageTimestamp'],
                            'pushName': _0x341a56['pushName'],
                            'broadcast': _0x341a56['broadcast']
                        };
                        const _0x8dbf0 = {
                            'chatId': _0x4a51a0,
                            'senderId': _0x2af6cb,
                            'isGroup': _0x460dcd,
                            'isSenderAdmin': _0x170fa5,
                            'isBotAdmin': _0x33c19a,
                            'senderIsOwnerOrSudo': _0x196c12,
                            'isOwnerOrSudoCheck': _0x5d5cb1,
                            'channelInfo': channelInfo,
                            'rawText': _0x480f81 + _0x2dd218,
                            'userMessage': (_0x480f81 + _0x2dd218)['toLowerCase'](),
                            'messageText': _0x480f81 + _0x2dd218,
                            'config': _0x0_0x224b49
                        };
                        try {
                            await _0x2b385d['handler'](_0x37a7cb, _0xa345b8, _0x21b83b, _0x8dbf0);
                            await addCommandReaction(_0x37a7cb, _0x341a56);
                            await showTypingAfterCommand(_0x37a7cb, _0x4a51a0);
                            printLog('success', '✅\x20Sticker\x20command\x20executed:\x20' + _0x2dd218);
                        } catch (_0x24312b) {
                            printLog('error', '❌\x20Sticker\x20command\x20error\x20[' + _0x2dd218 + ']:\x20' + _0x24312b['message']);
                            console['error'](_0x24312b['stack']);
                            await _0x37a7cb['sendMessage'](_0x4a51a0, {
                                'text': '❌\x20Error\x20executing\x20sticker\x20command:\x20' + _0x24312b['message'],
                                ...channelInfo
                            }, { 'quoted': _0x341a56 });
                        }
                    } else {
                        printLog('warning', '⚠️\x20Sticker\x20command\x20not\x20found:\x20' + _0x2dd218);
                    }
                    return;
                }
            }
        }
        const _0x1928d5 = _0x341a56['message']?.['conversation'] || _0x341a56['message']?.['extendedTextMessage']?.['text'] || _0x341a56['message']?.['imageMessage']?.['caption'] || _0x341a56['message']?.['videoMessage']?.['caption'] || _0x341a56['message']?.['buttonsResponseMessage']?.['selectedButtonId'] || '';
        const _0x1ad92a = _0x1928d5['trim']();
        const _0x513c2e = _0x1ad92a['toLowerCase']();
        const _0x11cab0 = await isSudo(_0x2af6cb);
        startSchedulerEngine(_0x37a7cb);
        if (!_0x341a56['key']['fromMe']) {
            const _0x4a370e = await handleAutoReply(_0x37a7cb, _0x4a51a0, _0x341a56, _0x513c2e);
            if (_0x4a370e)
                return;
        }
        if (_0x341a56['message']?.['buttonsResponseMessage']) {
            const _0x3839e1 = _0x341a56['message']['buttonsResponseMessage']['selectedButtonId'];
            printLog('info', 'Button\x20response:\x20' + _0x3839e1);
            if (_0x3839e1 === 'channel') {
                await _0x37a7cb['sendMessage'](_0x4a51a0, { 'text': '*Join\x20our\x20Channel:*\x0a[https://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y](https://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y)' }, { 'quoted': _0x341a56 });
                return;
            } else if (_0x3839e1 === 'owner') {
                const _0x5c4e15 = (await import('../plugins/owner.js'))['default'];
                await _0x5c4e15['handler']?.(_0x37a7cb, _0x4a51a0, '', {});
                return;
            } else if (_0x3839e1 === 'support') {
                await _0x37a7cb['sendMessage'](_0x4a51a0, { 'text': '*Support*\x0a\x0ahttps://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y' }, { 'quoted': _0x341a56 });
                return;
            }
        }
        const _0x5950a3 = await isBanned(_0x2af6cb);
        if (_0x5950a3 && !_0x513c2e['startsWith']('.unban')) {
            if (Math['random']() < 0.1) {
                printLog('warning', 'Banned\x20user\x20attempted\x20command:\x20' + _0x2af6cb['split']('@')[0x0]);
                await _0x37a7cb['sendMessage'](_0x4a51a0, {
                    'text': 'You\x20are\x20banned\x20from\x20using\x20the\x20bot.\x20Contact\x20an\x20admin\x20to\x20get\x20unbanned.',
                    ...channelInfo
                });
            }
            return;
        }
        if (/^[1-9]$/['test'](_0x513c2e) || _0x513c2e === 'surrender') {
            await handleTicTacToeMove(_0x37a7cb, _0x4a51a0, _0x2af6cb, _0x513c2e);
            return;
        }
        if (!_0x341a56['key']['fromMe']) {
            await _0x0_0x54ea10['incrementMessageCount'](_0x4a51a0, _0x2af6cb, _0x341a56['pushName']);
        } else {
            const _0x2fa0e8 = _0x37a7cb['user']?.['id'] || _0x2af6cb;
            const _0x20e845 = _0x37a7cb['user']?.['name'] || _0x37a7cb['user']?.['notify'] || 'Me';
            await _0x0_0x54ea10['incrementMessageCount'](_0x4a51a0, _0x2fa0e8, _0x20e845);
        }
        if (_0x460dcd) {
            if (_0x513c2e) {
                await handleBadwordDetection(_0x37a7cb, _0x4a51a0, _0x341a56, _0x513c2e, _0x2af6cb);
            }
            await handleLinkDetection(_0x37a7cb, _0x4a51a0, _0x341a56, _0x513c2e, _0x2af6cb);
        }
        if (_0x460dcd && !_0x341a56['key']['fromMe']) {
            const _0x49dc1f = await handleAntiSpam(_0x37a7cb, _0x4a51a0, _0x341a56, _0x2af6cb, _0x4e1be0);
            if (_0x49dc1f)
                return;
        }
        if (!_0x460dcd && !_0x341a56['key']['fromMe'] && !_0x11cab0) {
            try {
                const _0x106541 = (await import('../plugins/pmblocker.js'))['default'];
                const _0x5ece6e = _0x106541?.['readState'];
                const _0xa01d52 = await _0x5ece6e();
                if (_0xa01d52['enabled']) {
                    printLog('warning', 'PM\x20blocked\x20from:\x20' + _0x2af6cb['split']('@')[0x0]);
                    await _0x37a7cb['sendMessage'](_0x4a51a0, { 'text': _0xa01d52['message'] || 'Private\x20messages\x20are\x20blocked.\x20Please\x20contact\x20the\x20owner\x20in\x20groups\x20only.' });
                    await new Promise(_0x45b866 => setTimeout(_0x45b866, 0x5dc));
                    try {
                        await _0x37a7cb['updateBlockStatus'](_0x4a51a0, 'block');
                        printLog('success', 'Blocked\x20user:\x20' + _0x2af6cb['split']('@')[0x0]);
                    } catch (_0x4f5ae7) {
                        printLog('error', 'Failed\x20to\x20block\x20user:\x20' + _0x4f5ae7['message']);
                    }
                    return;
                }
            } catch (_0x154cf7) {
                printLog('error', 'PM\x20blocker\x20error:\x20' + _0x154cf7['message']);
            }
        }
        const _0x588743 = _0x0_0x224b49['prefixes']?.['find'](_0x3f3a9f => _0x513c2e['startsWith'](_0x3f3a9f));
        const _0x42f8c6 = _0x0_0x4e2c24['getCommand'](_0x513c2e, _0x0_0x224b49['prefixes']);
        if (!_0x588743 && !_0x42f8c6) {
            await handleAutotypingForMessage(_0x37a7cb, _0x4a51a0, _0x513c2e);
            const _0x501596 = await _0x0_0x54ea10['getBotMode']();
            const _0x331f47 = _0x501596 === 'public' || _0x501596 === 'groups' && _0x460dcd || _0x501596 === 'inbox' && !_0x460dcd || _0x3751d4;
            if (_0x331f47) {
                if (_0x460dcd && _0x513c2e['length'] < 0x3) {
                    const _0x2fee0b = 'nova';
                    if (!_0x513c2e['includes'](_0x2fee0b) && !_0x513c2e['includes']('@')) {
                        return;
                    }
                }
                await handleChatbotResponse(_0x37a7cb, _0x4a51a0, _0x341a56, _0x513c2e, _0x2af6cb);
            }
            return;
        }
        if (!_0x42f8c6) {
            const _0x1c46d8 = 'nova';
            const _0x54e513 = _0x513c2e['includes'](_0x1c46d8) || _0x513c2e['includes']('@nova');
            if (_0x54e513) {
                const _0x19ce83 = await _0x0_0x54ea10['getBotMode']();
                const _0x28d101 = _0x19ce83 === 'public' || _0x19ce83 === 'groups' && _0x460dcd || _0x19ce83 === 'inbox' && !_0x460dcd || _0x3751d4;
                if (_0x28d101) {
                    await handleChatbotResponse(_0x37a7cb, _0x4a51a0, _0x341a56, _0x513c2e, _0x2af6cb);
                    return;
                }
            }
            return;
        }
        const _0x5acca4 = ((() => {
            if (_0x3751d4)
                return !![];
            switch (_0x5b84e6) {
            case 'public':
                return !![];
            case 'private':
            case 'self':
                return ![];
            case 'groups':
                return _0x460dcd;
            case 'inbox':
                return !_0x460dcd;
            default:
                return !![];
            }
        })());
        if (!_0x5acca4) {
            return;
        }
        let _0x32229f;
        if (_0x588743) {
            const _0x3ece77 = _0x1ad92a['slice'](_0x588743['length'])['trim']();
            _0x32229f = _0x3ece77['split'](/\s+/)['slice'](0x1);
        } else {
            _0x32229f = _0x1ad92a['trim']()['split'](/\s+/)['slice'](0x1);
        }
        if (_0x42f8c6['strictOwnerOnly']) {
            const {isOwnerOnly: _0xc47929} = await import('./isOwner.js');
            if (!_0x341a56['key']['fromMe'] && !_0xc47929(_0x2af6cb)) {
                return await _0x37a7cb['sendMessage'](_0x4a51a0, {
                    'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20bot\x20owner!*\x0a\x0a_Sudo\x20users\x20cannot\x20manage\x20other\x20sudo\x20users._',
                    ...channelInfo
                }, { 'quoted': _0x341a56 });
            }
        }
        if (_0x42f8c6['ownerOnly'] && !_0x341a56['key']['fromMe'] && !_0x4e1be0) {
            return await _0x37a7cb['sendMessage'](_0x4a51a0, {
                'text': 'ℹ️\x20*This\x20command\x20is\x20only\x20available\x20for\x20the\x20owner\x20or\x20sudo\x20users!*',
                ...channelInfo
            }, { 'quoted': _0x341a56 });
        }
        if (_0x42f8c6['groupOnly'] && !_0x460dcd) {
            return await _0x37a7cb['sendMessage'](_0x4a51a0, {
                'text': 'ℹ️\x20*This\x20command\x20can\x20only\x20be\x20used\x20in\x20groups!*',
                ...channelInfo
            }, { 'quoted': _0x341a56 });
        }
        let _0x593c44 = ![];
        let _0x40a2a7 = ![];
        if (_0x42f8c6['adminOnly'] && _0x460dcd) {
            const _0x565253 = await _0x0_0x4e9a3c(_0x37a7cb, _0x4a51a0, _0x2af6cb);
            _0x593c44 = _0x565253['isSenderAdmin'];
            _0x40a2a7 = _0x565253['isBotAdmin'];
            if (!_0x40a2a7) {
                return await _0x37a7cb['sendMessage'](_0x4a51a0, {
                    'text': 'ℹ️\x20*Please\x20make\x20the\x20bot\x20an\x20admin\x20to\x20use\x20this\x20command.*',
                    ...channelInfo
                }, { 'quoted': _0x341a56 });
            }
            if (!_0x593c44 && !_0x341a56['key']['fromMe'] && !_0x4e1be0) {
                return await _0x37a7cb['sendMessage'](_0x4a51a0, {
                    'text': 'ℹ️\x20*Sorry,\x20only\x20group\x20admins\x20can\x20use\x20this\x20command.*',
                    ...channelInfo
                }, { 'quoted': _0x341a56 });
            }
        }
        const _0x5d6887 = {
            'chatId': _0x4a51a0,
            'senderId': _0x2af6cb,
            'isGroup': _0x460dcd,
            'isSenderAdmin': _0x593c44,
            'isBotAdmin': _0x40a2a7,
            'senderIsOwnerOrSudo': _0x4e1be0,
            'isOwnerOrSudoCheck': _0x3751d4,
            'channelInfo': channelInfo,
            'rawText': _0x1928d5,
            'userMessage': _0x513c2e,
            'messageText': _0x1ad92a,
            'config': _0x0_0x224b49
        };
        try {
            await _0x42f8c6['handler'](_0x37a7cb, _0x341a56, _0x32229f, _0x5d6887);
            await addCommandReaction(_0x37a7cb, _0x341a56);
            await showTypingAfterCommand(_0x37a7cb, _0x4a51a0);
        } catch (_0x1507a2) {
            printLog('error', 'Command\x20error\x20[' + _0x42f8c6['command'] + ']:\x20' + _0x1507a2['message']);
            console['error'](_0x1507a2['stack']);
            await _0x37a7cb['sendMessage'](_0x4a51a0, {
                'text': '❌\x20Error\x20executing\x20command:\x20' + _0x1507a2['message'],
                ...channelInfo
            }, { 'quoted': _0x341a56 });
            const _0x175be6 = {
                'command': _0x42f8c6['command'],
                'error': _0x1507a2['message'],
                'stack': _0x1507a2['stack'],
                'timestamp': new Date()['toISOString'](),
                'user': _0x2af6cb,
                'chat': _0x4a51a0
            };
            try {
                writeErrorLog(_0x175be6);
            } catch (_0x147034) {
                printLog('error', 'Failed\x20to\x20write\x20error\x20log:\x20' + _0x147034['message']);
            }
        }
    } catch (_0x4c3b4d) {
        printLog('error', 'Message\x20handler\x20error:\x20' + _0x4c3b4d['message']);
        console['error'](_0x4c3b4d['stack']);
        const _0x4a64df = _0x428847['messages']?.[0x0]?.['key']?.['remoteJid'];
        if (_0x4a64df) {
            try {
                await _0x37a7cb['sendMessage'](_0x4a64df, {
                    'text': 'ℹ️\x20*Failed\x20to\x20process\x20message!*',
                    ...channelInfo
                });
            } catch (_0x1082e5) {
                printLog('error', 'Failed\x20to\x20send\x20error\x20message:\x20' + _0x1082e5['message']);
            }
        }
    }
}
async function handleGroupParticipantUpdate(_0xb97196, _0x578d4d) {
    try {
        const {
            id: _0x5a26be,
            participants: _0x3fd219,
            action: _0x1b9961,
            author: _0x1223d1
        } = _0x578d4d;
        if (!_0x5a26be['endsWith']('@g.us'))
            return;
        const _0x12fe39 = await _0x0_0x54ea10['getBotMode']();
        const _0x1fb9b6 = _0x1223d1 ? await _0x0_0x29e20b(_0x1223d1, _0xb97196, _0x5a26be) : ![];
        const _0x8c6f97 = _0x1223d1 ? _0x1223d1 === _0xb97196['user']['id'] || _0x1223d1 === _0xb97196['user']['id']['split'](':')[0x0] + '@s.whatsapp.net' : ![];
        const _0x5586e4 = _0x8c6f97 || _0x1fb9b6;
        if ((_0x12fe39 === 'private' || _0x12fe39 === 'self') && !_0x5586e4) {
            return;
        }
        invalidateGroupCache(_0x5a26be);
        if (!_0x5a26be['endsWith']('@g.us'))
            return;
        printLog('info', 'Group\x20update:\x20' + _0x1b9961 + '\x20in\x20' + _0x5a26be['split']('@')[0x0]);
        const _0x3ac72d = _0x12fe39 === 'public' || _0x12fe39 === 'groups' || _0x5586e4;
        switch (_0x1b9961) {
        case 'promote':
            if (!_0x3ac72d)
                return;
            const _0x392f0c = (await import('../plugins/promote.js'))['default']?.['handlePromotionEvent'];
            await _0x392f0c(_0xb97196, _0x5a26be, _0x3fd219, _0x1223d1);
            break;
        case 'demote':
            if (!_0x3ac72d)
                return;
            const _0xa057c0 = (await import('../plugins/demote.js'))['default']?.['handleDemotionEvent'];
            await _0xa057c0(_0xb97196, _0x5a26be, _0x3fd219, _0x1223d1);
            break;
        case 'add':
            const {handleJoinEvent: _0x1524d3} = await import('../plugins/welcome.js');
            await _0x1524d3(_0xb97196, _0x5a26be, _0x3fd219);
            break;
        case 'remove':
            const _0x48019c = (await import('../plugins/goodbye.js'))['default']?.['handleLeaveEvent'];
            await _0x48019c(_0xb97196, _0x5a26be, _0x3fd219);
            break;
        default:
            printLog('warning', 'Unhandled\x20group\x20action:\x20' + _0x1b9961);
        }
    } catch (_0x2b8441) {
        printLog('error', 'Group\x20update\x20error:\x20' + _0x2b8441['message']);
        console['error'](_0x2b8441['stack']);
    }
}
async function handleStatus(_0x20b2da, _0x49a439) {
    try {
        const {default: _0x51ed00} = await import('../plugins/autostatus.js');
        const _0x1b75f0 = _0x51ed00['handleStatusUpdate'];
        await _0x1b75f0(_0x20b2da, _0x49a439);
    } catch (_0x1dc804) {
        printLog('error', 'Status\x20handler\x20error:\x20' + _0x1dc804['message']);
        console['error'](_0x1dc804['stack']);
    }
}
async function handleCall(_0x55df5b, _0x41c3be) {
    try {
        const _0x1ef8ec = (await import('../plugins/anticall.js'))['default'];
        const _0x557ec1 = _0x1ef8ec['readState'] ? await _0x1ef8ec['readState']() : { 'enabled': ![] };
        if (!_0x557ec1['enabled'])
            return;
        const _0x4e347a = new Set();
        for (const _0x9b3376 of _0x41c3be) {
            const _0x239479 = _0x9b3376['from'] || _0x9b3376['peerJid'] || _0x9b3376['chatId'];
            if (!_0x239479)
                continue;
            try {
                try {
                    if (typeof _0x55df5b['rejectCall'] === 'function' && _0x9b3376['id']) {
                        await _0x55df5b['rejectCall'](_0x9b3376['id'], _0x239479);
                    } else if (typeof _0x55df5b['sendCallOfferAck'] === 'function' && _0x9b3376['id']) {
                        await _0x55df5b['sendCallOfferAck'](_0x9b3376['id'], _0x239479, 'reject');
                    }
                } catch (_0x45086e) {
                    printLog('error', 'Error\x20rejecting\x20call:\x20' + _0x45086e['message']);
                }
                if (!_0x4e347a['has'](_0x239479)) {
                    _0x4e347a['add'](_0x239479);
                    setTimeout(() => _0x4e347a['delete'](_0x239479), 0xea60);
                    await _0x55df5b['sendMessage'](_0x239479, { 'text': '📵\x20Anticall\x20is\x20enabled.\x20Your\x20call\x20was\x20rejected\x20and\x20you\x20will\x20be\x20blocked.' });
                    printLog('info', 'Sent\x20anticall\x20warning\x20to:\x20' + _0x239479['split']('@')[0x0]);
                }
                setTimeout(async () => {
                    try {
                        await _0x55df5b['updateBlockStatus'](_0x239479, 'block');
                        printLog('success', 'Blocked\x20caller:\x20' + _0x239479['split']('@')[0x0]);
                    } catch (_0x481d67) {
                        printLog('error', 'Error\x20blocking\x20caller:\x20' + _0x481d67['message']);
                    }
                }, 0x320);
            } catch (_0x554e62) {
                printLog('error', 'Error\x20handling\x20call\x20from\x20' + _0x239479['split']('@')[0x0] + ':\x20' + _0x554e62['message']);
            }
        }
    } catch (_0x591de6) {
        printLog('error', 'Call\x20handler\x20error:\x20' + _0x591de6['message']);
        console['error'](_0x591de6['stack']);
    }
}
export {
    handleMessages,
    handleGroupParticipantUpdate,
    handleStatus,
    handleCall
};