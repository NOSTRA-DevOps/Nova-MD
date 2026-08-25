import { isJidGroup } from '@whiskeysockets/baileys';
import {
    getAntilink,
    incrementWarningCount,
    resetWarningCount,
    isSudo
} from '../lib/index.js';
import _0x0_0x138120 from '../lib/isAdmin.js';
import _0x0_0x43d5cf from '../config.js';
const WARN_COUNT = _0x0_0x43d5cf['warnCount'] || 0x3;
function containsURL(_0x8d1b57) {
    const _0x1e426b = /(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/[^\s]*)?/i;
    return _0x1e426b['test'](_0x8d1b57);
}
async function Antilink(_0x3b1bfa, _0x2734b8) {
    const _0x300eed = _0x3b1bfa['key']['remoteJid'];
    if (!isJidGroup(_0x300eed))
        return;
    const _0x7657b0 = _0x3b1bfa['message']?.['conversation'] || _0x3b1bfa['message']?.['extendedTextMessage']?.['text'] || '';
    if (!_0x7657b0 || typeof _0x7657b0 !== 'string')
        return;
    const _0x444752 = _0x3b1bfa['key']['participant'];
    if (!_0x444752)
        return;
    try {
        const {isSenderAdmin: _0x2cce0f} = await _0x0_0x138120(_0x2734b8, _0x300eed, _0x444752);
        if (_0x2cce0f)
            return;
    } catch (_0x559d1d) {
    }
    const _0x2ccf58 = await isSudo(_0x444752);
    if (_0x2ccf58)
        return;
    if (!containsURL(_0x7657b0['trim']()))
        return;
    const _0x576eab = await getAntilink(_0x300eed, 'on');
    if (!_0x576eab)
        return;
    const _0x25ebd8 = _0x576eab['action'];
    try {
        await _0x2734b8['sendMessage'](_0x300eed, { 'delete': _0x3b1bfa['key'] });
        switch (_0x25ebd8) {
        case 'delete':
            await _0x2734b8['sendMessage'](_0x300eed, {
                'text': '```@' + _0x444752['split']('@')[0x0] + '\x20link\x20are\x20not\x20allowed\x20here```',
                'mentions': [_0x444752]
            });
            break;
        case 'kick':
            await _0x2734b8['groupParticipantsUpdate'](_0x300eed, [_0x444752], 'remove');
            await _0x2734b8['sendMessage'](_0x300eed, {
                'text': '```@' + _0x444752['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20for\x20sending\x20links```',
                'mentions': [_0x444752]
            });
            break;
        case 'warn':
            const _0x46db23 = await incrementWarningCount(_0x300eed, _0x444752);
            if (_0x46db23 >= WARN_COUNT) {
                await _0x2734b8['groupParticipantsUpdate'](_0x300eed, [_0x444752], 'remove');
                await resetWarningCount(_0x300eed, _0x444752);
                await _0x2734b8['sendMessage'](_0x300eed, {
                    'text': '```@' + _0x444752['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20after\x20' + WARN_COUNT + '\x20warnings```',
                    'mentions': [_0x444752]
                });
            } else {
                await _0x2734b8['sendMessage'](_0x300eed, {
                    'text': '```@' + _0x444752['split']('@')[0x0] + '\x20warning\x20' + _0x46db23 + '/' + WARN_COUNT + '\x20for\x20sending\x20links```',
                    'mentions': [_0x444752]
                });
            }
            break;
        }
    } catch (_0x218650) {
        console['error']('Error\x20in\x20Antilink:', _0x218650);
    }
}
export default { 'Antilink': Antilink };