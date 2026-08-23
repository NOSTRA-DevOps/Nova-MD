import { isJidGroup } from '@whiskeysockets/baileys';
import {
    getAntilink,
    incrementWarningCount,
    resetWarningCount,
    isSudo
} from '../lib/index.js';
import _0x0_0x489c20 from '../lib/isAdmin.js';
import _0x0_0x2039d8 from '../config.js';
const WARN_COUNT = _0x0_0x2039d8['warnCount'] || 0x3;
function containsURL(_0x23ecf3) {
    const _0x401249 = /(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/[^\s]*)?/i;
    return _0x401249['test'](_0x23ecf3);
}
async function Antilink(_0x398e40, _0x37e44d) {
    const _0x1dea5f = _0x398e40['key']['remoteJid'];
    if (!isJidGroup(_0x1dea5f))
        return;
    const _0x1459fa = _0x398e40['message']?.['conversation'] || _0x398e40['message']?.['extendedTextMessage']?.['text'] || '';
    if (!_0x1459fa || typeof _0x1459fa !== 'string')
        return;
    const _0x56cbb0 = _0x398e40['key']['participant'];
    if (!_0x56cbb0)
        return;
    try {
        const {isSenderAdmin: _0x49760b} = await _0x0_0x489c20(_0x37e44d, _0x1dea5f, _0x56cbb0);
        if (_0x49760b)
            return;
    } catch (_0x3a6e1c) {
    }
    const _0x3e85e4 = await isSudo(_0x56cbb0);
    if (_0x3e85e4)
        return;
    if (!containsURL(_0x1459fa['trim']()))
        return;
    const _0x26b2f0 = await getAntilink(_0x1dea5f, 'on');
    if (!_0x26b2f0)
        return;
    const _0x4477c5 = _0x26b2f0['action'];
    try {
        await _0x37e44d['sendMessage'](_0x1dea5f, { 'delete': _0x398e40['key'] });
        switch (_0x4477c5) {
        case 'delete':
            await _0x37e44d['sendMessage'](_0x1dea5f, {
                'text': '```@' + _0x56cbb0['split']('@')[0x0] + '\x20link\x20are\x20not\x20allowed\x20here```',
                'mentions': [_0x56cbb0]
            });
            break;
        case 'kick':
            await _0x37e44d['groupParticipantsUpdate'](_0x1dea5f, [_0x56cbb0], 'remove');
            await _0x37e44d['sendMessage'](_0x1dea5f, {
                'text': '```@' + _0x56cbb0['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20for\x20sending\x20links```',
                'mentions': [_0x56cbb0]
            });
            break;
        case 'warn':
            const _0x1fc2a0 = await incrementWarningCount(_0x1dea5f, _0x56cbb0);
            if (_0x1fc2a0 >= WARN_COUNT) {
                await _0x37e44d['groupParticipantsUpdate'](_0x1dea5f, [_0x56cbb0], 'remove');
                await resetWarningCount(_0x1dea5f, _0x56cbb0);
                await _0x37e44d['sendMessage'](_0x1dea5f, {
                    'text': '```@' + _0x56cbb0['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20after\x20' + WARN_COUNT + '\x20warnings```',
                    'mentions': [_0x56cbb0]
                });
            } else {
                await _0x37e44d['sendMessage'](_0x1dea5f, {
                    'text': '```@' + _0x56cbb0['split']('@')[0x0] + '\x20warning\x20' + _0x1fc2a0 + '/' + WARN_COUNT + '\x20for\x20sending\x20links```',
                    'mentions': [_0x56cbb0]
                });
            }
            break;
        }
    } catch (_0x3adb4c) {
        console['error']('Error\x20in\x20Antilink:', _0x3adb4c);
    }
}
export default { 'Antilink': Antilink };