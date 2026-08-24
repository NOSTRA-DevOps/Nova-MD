import { isJidGroup } from '@whiskeysockets/baileys';
import {
    getAntilink,
    incrementWarningCount,
    resetWarningCount,
    isSudo
} from '../lib/index.js';
import _0x0_0x446749 from '../lib/isAdmin.js';
import _0x0_0x3183a4 from '../config.js';
const WARN_COUNT = _0x0_0x3183a4['warnCount'] || 0x3;
function containsURL(_0x227649) {
    const _0x5b4c60 = /(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/[^\s]*)?/i;
    return _0x5b4c60['test'](_0x227649);
}
async function Antilink(_0x27c303, _0x35e392) {
    const _0x68c65e = _0x27c303['key']['remoteJid'];
    if (!isJidGroup(_0x68c65e))
        return;
    const _0x3f1993 = _0x27c303['message']?.['conversation'] || _0x27c303['message']?.['extendedTextMessage']?.['text'] || '';
    if (!_0x3f1993 || typeof _0x3f1993 !== 'string')
        return;
    const _0x90ffde = _0x27c303['key']['participant'];
    if (!_0x90ffde)
        return;
    try {
        const {isSenderAdmin: _0x1c5a9d} = await _0x0_0x446749(_0x35e392, _0x68c65e, _0x90ffde);
        if (_0x1c5a9d)
            return;
    } catch (_0x5b7b7e) {
    }
    const _0x12a5df = await isSudo(_0x90ffde);
    if (_0x12a5df)
        return;
    if (!containsURL(_0x3f1993['trim']()))
        return;
    const _0x540689 = await getAntilink(_0x68c65e, 'on');
    if (!_0x540689)
        return;
    const _0x1dc80d = _0x540689['action'];
    try {
        await _0x35e392['sendMessage'](_0x68c65e, { 'delete': _0x27c303['key'] });
        switch (_0x1dc80d) {
        case 'delete':
            await _0x35e392['sendMessage'](_0x68c65e, {
                'text': '```@' + _0x90ffde['split']('@')[0x0] + '\x20link\x20are\x20not\x20allowed\x20here```',
                'mentions': [_0x90ffde]
            });
            break;
        case 'kick':
            await _0x35e392['groupParticipantsUpdate'](_0x68c65e, [_0x90ffde], 'remove');
            await _0x35e392['sendMessage'](_0x68c65e, {
                'text': '```@' + _0x90ffde['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20for\x20sending\x20links```',
                'mentions': [_0x90ffde]
            });
            break;
        case 'warn':
            const _0x168c66 = await incrementWarningCount(_0x68c65e, _0x90ffde);
            if (_0x168c66 >= WARN_COUNT) {
                await _0x35e392['groupParticipantsUpdate'](_0x68c65e, [_0x90ffde], 'remove');
                await resetWarningCount(_0x68c65e, _0x90ffde);
                await _0x35e392['sendMessage'](_0x68c65e, {
                    'text': '```@' + _0x90ffde['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20after\x20' + WARN_COUNT + '\x20warnings```',
                    'mentions': [_0x90ffde]
                });
            } else {
                await _0x35e392['sendMessage'](_0x68c65e, {
                    'text': '```@' + _0x90ffde['split']('@')[0x0] + '\x20warning\x20' + _0x168c66 + '/' + WARN_COUNT + '\x20for\x20sending\x20links```',
                    'mentions': [_0x90ffde]
                });
            }
            break;
        }
    } catch (_0x7123e8) {
        console['error']('Error\x20in\x20Antilink:', _0x7123e8);
    }
}
export default { 'Antilink': Antilink };