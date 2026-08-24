import { isJidGroup } from '@whiskeysockets/baileys';
import {
    getAntilink,
    incrementWarningCount,
    resetWarningCount,
    isSudo
} from '../lib/index.js';
import _0x0_0xe2c926 from '../lib/isAdmin.js';
import _0x0_0x156363 from '../config.js';
const WARN_COUNT = _0x0_0x156363['warnCount'] || 0x3;
function containsURL(_0x3cc597) {
    const _0x5cfaab = /(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/[^\s]*)?/i;
    return _0x5cfaab['test'](_0x3cc597);
}
async function Antilink(_0x43bfb8, _0x1beb88) {
    const _0x2a3837 = _0x43bfb8['key']['remoteJid'];
    if (!isJidGroup(_0x2a3837))
        return;
    const _0x20da0f = _0x43bfb8['message']?.['conversation'] || _0x43bfb8['message']?.['extendedTextMessage']?.['text'] || '';
    if (!_0x20da0f || typeof _0x20da0f !== 'string')
        return;
    const _0x3870c8 = _0x43bfb8['key']['participant'];
    if (!_0x3870c8)
        return;
    try {
        const {isSenderAdmin: _0x48d116} = await _0x0_0xe2c926(_0x1beb88, _0x2a3837, _0x3870c8);
        if (_0x48d116)
            return;
    } catch (_0x33867d) {
    }
    const _0xb10a66 = await isSudo(_0x3870c8);
    if (_0xb10a66)
        return;
    if (!containsURL(_0x20da0f['trim']()))
        return;
    const _0x5ee9a3 = await getAntilink(_0x2a3837, 'on');
    if (!_0x5ee9a3)
        return;
    const _0x5c2a26 = _0x5ee9a3['action'];
    try {
        await _0x1beb88['sendMessage'](_0x2a3837, { 'delete': _0x43bfb8['key'] });
        switch (_0x5c2a26) {
        case 'delete':
            await _0x1beb88['sendMessage'](_0x2a3837, {
                'text': '```@' + _0x3870c8['split']('@')[0x0] + '\x20link\x20are\x20not\x20allowed\x20here```',
                'mentions': [_0x3870c8]
            });
            break;
        case 'kick':
            await _0x1beb88['groupParticipantsUpdate'](_0x2a3837, [_0x3870c8], 'remove');
            await _0x1beb88['sendMessage'](_0x2a3837, {
                'text': '```@' + _0x3870c8['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20for\x20sending\x20links```',
                'mentions': [_0x3870c8]
            });
            break;
        case 'warn':
            const _0x3d8359 = await incrementWarningCount(_0x2a3837, _0x3870c8);
            if (_0x3d8359 >= WARN_COUNT) {
                await _0x1beb88['groupParticipantsUpdate'](_0x2a3837, [_0x3870c8], 'remove');
                await resetWarningCount(_0x2a3837, _0x3870c8);
                await _0x1beb88['sendMessage'](_0x2a3837, {
                    'text': '```@' + _0x3870c8['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20after\x20' + WARN_COUNT + '\x20warnings```',
                    'mentions': [_0x3870c8]
                });
            } else {
                await _0x1beb88['sendMessage'](_0x2a3837, {
                    'text': '```@' + _0x3870c8['split']('@')[0x0] + '\x20warning\x20' + _0x3d8359 + '/' + WARN_COUNT + '\x20for\x20sending\x20links```',
                    'mentions': [_0x3870c8]
                });
            }
            break;
        }
    } catch (_0x2683aa) {
        console['error']('Error\x20in\x20Antilink:', _0x2683aa);
    }
}
export default { 'Antilink': Antilink };