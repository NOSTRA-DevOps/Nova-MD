import { isJidGroup } from '@whiskeysockets/baileys';
import {
    getAntilink,
    incrementWarningCount,
    resetWarningCount,
    isSudo
} from '../lib/index.js';
import _0x0_0x4f9fa3 from '../lib/isAdmin.js';
import _0x0_0x35f1b5 from '../config.js';
const WARN_COUNT = _0x0_0x35f1b5['warnCount'] || 0x3;
function containsURL(_0x3ecbed) {
    const _0x37717c = /(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/[^\s]*)?/i;
    return _0x37717c['test'](_0x3ecbed);
}
async function Antilink(_0x145045, _0x38a6c4) {
    const _0x5c101c = _0x145045['key']['remoteJid'];
    if (!isJidGroup(_0x5c101c))
        return;
    const _0x5a5997 = _0x145045['message']?.['conversation'] || _0x145045['message']?.['extendedTextMessage']?.['text'] || '';
    if (!_0x5a5997 || typeof _0x5a5997 !== 'string')
        return;
    const _0x62b4dc = _0x145045['key']['participant'];
    if (!_0x62b4dc)
        return;
    try {
        const {isSenderAdmin: _0x42c51f} = await _0x0_0x4f9fa3(_0x38a6c4, _0x5c101c, _0x62b4dc);
        if (_0x42c51f)
            return;
    } catch (_0x1d8acf) {
    }
    const _0x32c41d = await isSudo(_0x62b4dc);
    if (_0x32c41d)
        return;
    if (!containsURL(_0x5a5997['trim']()))
        return;
    const _0x3f14f1 = await getAntilink(_0x5c101c, 'on');
    if (!_0x3f14f1)
        return;
    const _0x18b95d = _0x3f14f1['action'];
    try {
        await _0x38a6c4['sendMessage'](_0x5c101c, { 'delete': _0x145045['key'] });
        switch (_0x18b95d) {
        case 'delete':
            await _0x38a6c4['sendMessage'](_0x5c101c, {
                'text': '```@' + _0x62b4dc['split']('@')[0x0] + '\x20link\x20are\x20not\x20allowed\x20here```',
                'mentions': [_0x62b4dc]
            });
            break;
        case 'kick':
            await _0x38a6c4['groupParticipantsUpdate'](_0x5c101c, [_0x62b4dc], 'remove');
            await _0x38a6c4['sendMessage'](_0x5c101c, {
                'text': '```@' + _0x62b4dc['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20for\x20sending\x20links```',
                'mentions': [_0x62b4dc]
            });
            break;
        case 'warn':
            const _0x3400c4 = await incrementWarningCount(_0x5c101c, _0x62b4dc);
            if (_0x3400c4 >= WARN_COUNT) {
                await _0x38a6c4['groupParticipantsUpdate'](_0x5c101c, [_0x62b4dc], 'remove');
                await resetWarningCount(_0x5c101c, _0x62b4dc);
                await _0x38a6c4['sendMessage'](_0x5c101c, {
                    'text': '```@' + _0x62b4dc['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20after\x20' + WARN_COUNT + '\x20warnings```',
                    'mentions': [_0x62b4dc]
                });
            } else {
                await _0x38a6c4['sendMessage'](_0x5c101c, {
                    'text': '```@' + _0x62b4dc['split']('@')[0x0] + '\x20warning\x20' + _0x3400c4 + '/' + WARN_COUNT + '\x20for\x20sending\x20links```',
                    'mentions': [_0x62b4dc]
                });
            }
            break;
        }
    } catch (_0x333a87) {
        console['error']('Error\x20in\x20Antilink:', _0x333a87);
    }
}
export default { 'Antilink': Antilink };