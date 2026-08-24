import { isJidGroup } from '@whiskeysockets/baileys';
import {
    getAntilink,
    incrementWarningCount,
    resetWarningCount,
    isSudo
} from '../lib/index.js';
import _0x0_0x33d406 from '../lib/isAdmin.js';
import _0x0_0x49d800 from '../config.js';
const WARN_COUNT = _0x0_0x49d800['warnCount'] || 0x3;
function containsURL(_0x4c961a) {
    const _0x47ee40 = /(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/[^\s]*)?/i;
    return _0x47ee40['test'](_0x4c961a);
}
async function Antilink(_0x39400b, _0x16c877) {
    const _0x2263cb = _0x39400b['key']['remoteJid'];
    if (!isJidGroup(_0x2263cb))
        return;
    const _0x247bb9 = _0x39400b['message']?.['conversation'] || _0x39400b['message']?.['extendedTextMessage']?.['text'] || '';
    if (!_0x247bb9 || typeof _0x247bb9 !== 'string')
        return;
    const _0x5ea733 = _0x39400b['key']['participant'];
    if (!_0x5ea733)
        return;
    try {
        const {isSenderAdmin: _0x18f349} = await _0x0_0x33d406(_0x16c877, _0x2263cb, _0x5ea733);
        if (_0x18f349)
            return;
    } catch (_0x598578) {
    }
    const _0x528288 = await isSudo(_0x5ea733);
    if (_0x528288)
        return;
    if (!containsURL(_0x247bb9['trim']()))
        return;
    const _0x2eca97 = await getAntilink(_0x2263cb, 'on');
    if (!_0x2eca97)
        return;
    const _0x2fb660 = _0x2eca97['action'];
    try {
        await _0x16c877['sendMessage'](_0x2263cb, { 'delete': _0x39400b['key'] });
        switch (_0x2fb660) {
        case 'delete':
            await _0x16c877['sendMessage'](_0x2263cb, {
                'text': '```@' + _0x5ea733['split']('@')[0x0] + '\x20link\x20are\x20not\x20allowed\x20here```',
                'mentions': [_0x5ea733]
            });
            break;
        case 'kick':
            await _0x16c877['groupParticipantsUpdate'](_0x2263cb, [_0x5ea733], 'remove');
            await _0x16c877['sendMessage'](_0x2263cb, {
                'text': '```@' + _0x5ea733['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20for\x20sending\x20links```',
                'mentions': [_0x5ea733]
            });
            break;
        case 'warn':
            const _0x1c9e37 = await incrementWarningCount(_0x2263cb, _0x5ea733);
            if (_0x1c9e37 >= WARN_COUNT) {
                await _0x16c877['groupParticipantsUpdate'](_0x2263cb, [_0x5ea733], 'remove');
                await resetWarningCount(_0x2263cb, _0x5ea733);
                await _0x16c877['sendMessage'](_0x2263cb, {
                    'text': '```@' + _0x5ea733['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20after\x20' + WARN_COUNT + '\x20warnings```',
                    'mentions': [_0x5ea733]
                });
            } else {
                await _0x16c877['sendMessage'](_0x2263cb, {
                    'text': '```@' + _0x5ea733['split']('@')[0x0] + '\x20warning\x20' + _0x1c9e37 + '/' + WARN_COUNT + '\x20for\x20sending\x20links```',
                    'mentions': [_0x5ea733]
                });
            }
            break;
        }
    } catch (_0x106401) {
        console['error']('Error\x20in\x20Antilink:', _0x106401);
    }
}
export default { 'Antilink': Antilink };