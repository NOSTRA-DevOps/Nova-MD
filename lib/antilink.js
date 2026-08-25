import { isJidGroup } from '@whiskeysockets/baileys';
import {
    getAntilink,
    incrementWarningCount,
    resetWarningCount,
    isSudo
} from '../lib/index.js';
import _0x0_0x4513d4 from '../lib/isAdmin.js';
import _0x0_0x4fda16 from '../config.js';
const WARN_COUNT = _0x0_0x4fda16['warnCount'] || 0x3;
function containsURL(_0x4cfde3) {
    const _0x4fad5b = /(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/[^\s]*)?/i;
    return _0x4fad5b['test'](_0x4cfde3);
}
async function Antilink(_0x4a7bd3, _0x1c0792) {
    const _0x5ea9f1 = _0x4a7bd3['key']['remoteJid'];
    if (!isJidGroup(_0x5ea9f1))
        return;
    const _0x1d9301 = _0x4a7bd3['message']?.['conversation'] || _0x4a7bd3['message']?.['extendedTextMessage']?.['text'] || '';
    if (!_0x1d9301 || typeof _0x1d9301 !== 'string')
        return;
    const _0x3718f1 = _0x4a7bd3['key']['participant'];
    if (!_0x3718f1)
        return;
    try {
        const {isSenderAdmin: _0x5bfa13} = await _0x0_0x4513d4(_0x1c0792, _0x5ea9f1, _0x3718f1);
        if (_0x5bfa13)
            return;
    } catch (_0x218166) {
    }
    const _0x336449 = await isSudo(_0x3718f1);
    if (_0x336449)
        return;
    if (!containsURL(_0x1d9301['trim']()))
        return;
    const _0x5ab856 = await getAntilink(_0x5ea9f1, 'on');
    if (!_0x5ab856)
        return;
    const _0x392a27 = _0x5ab856['action'];
    try {
        await _0x1c0792['sendMessage'](_0x5ea9f1, { 'delete': _0x4a7bd3['key'] });
        switch (_0x392a27) {
        case 'delete':
            await _0x1c0792['sendMessage'](_0x5ea9f1, {
                'text': '```@' + _0x3718f1['split']('@')[0x0] + '\x20link\x20are\x20not\x20allowed\x20here```',
                'mentions': [_0x3718f1]
            });
            break;
        case 'kick':
            await _0x1c0792['groupParticipantsUpdate'](_0x5ea9f1, [_0x3718f1], 'remove');
            await _0x1c0792['sendMessage'](_0x5ea9f1, {
                'text': '```@' + _0x3718f1['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20for\x20sending\x20links```',
                'mentions': [_0x3718f1]
            });
            break;
        case 'warn':
            const _0x3632db = await incrementWarningCount(_0x5ea9f1, _0x3718f1);
            if (_0x3632db >= WARN_COUNT) {
                await _0x1c0792['groupParticipantsUpdate'](_0x5ea9f1, [_0x3718f1], 'remove');
                await resetWarningCount(_0x5ea9f1, _0x3718f1);
                await _0x1c0792['sendMessage'](_0x5ea9f1, {
                    'text': '```@' + _0x3718f1['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20after\x20' + WARN_COUNT + '\x20warnings```',
                    'mentions': [_0x3718f1]
                });
            } else {
                await _0x1c0792['sendMessage'](_0x5ea9f1, {
                    'text': '```@' + _0x3718f1['split']('@')[0x0] + '\x20warning\x20' + _0x3632db + '/' + WARN_COUNT + '\x20for\x20sending\x20links```',
                    'mentions': [_0x3718f1]
                });
            }
            break;
        }
    } catch (_0x256c78) {
        console['error']('Error\x20in\x20Antilink:', _0x256c78);
    }
}
export default { 'Antilink': Antilink };