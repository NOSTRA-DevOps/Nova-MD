import { isJidGroup } from '@whiskeysockets/baileys';
import {
    getAntilink,
    incrementWarningCount,
    resetWarningCount,
    isSudo
} from '../lib/index.js';
import _0x0_0x396b4e from '../lib/isAdmin.js';
import _0x0_0x1f988b from '../config.js';
const WARN_COUNT = _0x0_0x1f988b['warnCount'] || 0x3;
function containsURL(_0x3f2b6a) {
    const _0x566715 = /(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/[^\s]*)?/i;
    return _0x566715['test'](_0x3f2b6a);
}
async function Antilink(_0x5e5eca, _0x303b0a) {
    const _0x4e2034 = _0x5e5eca['key']['remoteJid'];
    if (!isJidGroup(_0x4e2034))
        return;
    const _0x510c1c = _0x5e5eca['message']?.['conversation'] || _0x5e5eca['message']?.['extendedTextMessage']?.['text'] || '';
    if (!_0x510c1c || typeof _0x510c1c !== 'string')
        return;
    const _0x20d019 = _0x5e5eca['key']['participant'];
    if (!_0x20d019)
        return;
    try {
        const {isSenderAdmin: _0x33826f} = await _0x0_0x396b4e(_0x303b0a, _0x4e2034, _0x20d019);
        if (_0x33826f)
            return;
    } catch (_0x164967) {
    }
    const _0x4c9c67 = await isSudo(_0x20d019);
    if (_0x4c9c67)
        return;
    if (!containsURL(_0x510c1c['trim']()))
        return;
    const _0x3a37e0 = await getAntilink(_0x4e2034, 'on');
    if (!_0x3a37e0)
        return;
    const _0x2a7179 = _0x3a37e0['action'];
    try {
        await _0x303b0a['sendMessage'](_0x4e2034, { 'delete': _0x5e5eca['key'] });
        switch (_0x2a7179) {
        case 'delete':
            await _0x303b0a['sendMessage'](_0x4e2034, {
                'text': '```@' + _0x20d019['split']('@')[0x0] + '\x20link\x20are\x20not\x20allowed\x20here```',
                'mentions': [_0x20d019]
            });
            break;
        case 'kick':
            await _0x303b0a['groupParticipantsUpdate'](_0x4e2034, [_0x20d019], 'remove');
            await _0x303b0a['sendMessage'](_0x4e2034, {
                'text': '```@' + _0x20d019['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20for\x20sending\x20links```',
                'mentions': [_0x20d019]
            });
            break;
        case 'warn':
            const _0x4fe5f8 = await incrementWarningCount(_0x4e2034, _0x20d019);
            if (_0x4fe5f8 >= WARN_COUNT) {
                await _0x303b0a['groupParticipantsUpdate'](_0x4e2034, [_0x20d019], 'remove');
                await resetWarningCount(_0x4e2034, _0x20d019);
                await _0x303b0a['sendMessage'](_0x4e2034, {
                    'text': '```@' + _0x20d019['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20after\x20' + WARN_COUNT + '\x20warnings```',
                    'mentions': [_0x20d019]
                });
            } else {
                await _0x303b0a['sendMessage'](_0x4e2034, {
                    'text': '```@' + _0x20d019['split']('@')[0x0] + '\x20warning\x20' + _0x4fe5f8 + '/' + WARN_COUNT + '\x20for\x20sending\x20links```',
                    'mentions': [_0x20d019]
                });
            }
            break;
        }
    } catch (_0x163850) {
        console['error']('Error\x20in\x20Antilink:', _0x163850);
    }
}
export default { 'Antilink': Antilink };