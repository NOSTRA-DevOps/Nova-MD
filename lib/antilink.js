import { isJidGroup } from '@whiskeysockets/baileys';
import {
    getAntilink,
    incrementWarningCount,
    resetWarningCount,
    isSudo
} from '../lib/index.js';
import _0x0_0x2da268 from '../lib/isAdmin.js';
import _0x0_0x4d68d2 from '../config.js';
const WARN_COUNT = _0x0_0x4d68d2['warnCount'] || 0x3;
function containsURL(_0x442cb2) {
    const _0x5044cc = /(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/[^\s]*)?/i;
    return _0x5044cc['test'](_0x442cb2);
}
async function Antilink(_0x11dcf0, _0x68be37) {
    const _0x3dab28 = _0x11dcf0['key']['remoteJid'];
    if (!isJidGroup(_0x3dab28))
        return;
    const _0x16b1a1 = _0x11dcf0['message']?.['conversation'] || _0x11dcf0['message']?.['extendedTextMessage']?.['text'] || '';
    if (!_0x16b1a1 || typeof _0x16b1a1 !== 'string')
        return;
    const _0x408ee6 = _0x11dcf0['key']['participant'];
    if (!_0x408ee6)
        return;
    try {
        const {isSenderAdmin: _0x417ffc} = await _0x0_0x2da268(_0x68be37, _0x3dab28, _0x408ee6);
        if (_0x417ffc)
            return;
    } catch (_0x959ac3) {
    }
    const _0x5550e4 = await isSudo(_0x408ee6);
    if (_0x5550e4)
        return;
    if (!containsURL(_0x16b1a1['trim']()))
        return;
    const _0x14dbeb = await getAntilink(_0x3dab28, 'on');
    if (!_0x14dbeb)
        return;
    const _0x12635a = _0x14dbeb['action'];
    try {
        await _0x68be37['sendMessage'](_0x3dab28, { 'delete': _0x11dcf0['key'] });
        switch (_0x12635a) {
        case 'delete':
            await _0x68be37['sendMessage'](_0x3dab28, {
                'text': '```@' + _0x408ee6['split']('@')[0x0] + '\x20link\x20are\x20not\x20allowed\x20here```',
                'mentions': [_0x408ee6]
            });
            break;
        case 'kick':
            await _0x68be37['groupParticipantsUpdate'](_0x3dab28, [_0x408ee6], 'remove');
            await _0x68be37['sendMessage'](_0x3dab28, {
                'text': '```@' + _0x408ee6['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20for\x20sending\x20links```',
                'mentions': [_0x408ee6]
            });
            break;
        case 'warn':
            const _0xd59ca7 = await incrementWarningCount(_0x3dab28, _0x408ee6);
            if (_0xd59ca7 >= WARN_COUNT) {
                await _0x68be37['groupParticipantsUpdate'](_0x3dab28, [_0x408ee6], 'remove');
                await resetWarningCount(_0x3dab28, _0x408ee6);
                await _0x68be37['sendMessage'](_0x3dab28, {
                    'text': '```@' + _0x408ee6['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20after\x20' + WARN_COUNT + '\x20warnings```',
                    'mentions': [_0x408ee6]
                });
            } else {
                await _0x68be37['sendMessage'](_0x3dab28, {
                    'text': '```@' + _0x408ee6['split']('@')[0x0] + '\x20warning\x20' + _0xd59ca7 + '/' + WARN_COUNT + '\x20for\x20sending\x20links```',
                    'mentions': [_0x408ee6]
                });
            }
            break;
        }
    } catch (_0x19d1e2) {
        console['error']('Error\x20in\x20Antilink:', _0x19d1e2);
    }
}
export default { 'Antilink': Antilink };