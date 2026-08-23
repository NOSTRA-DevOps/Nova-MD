import { isJidGroup } from '@whiskeysockets/baileys';
import {
    getAntilink,
    incrementWarningCount,
    resetWarningCount,
    isSudo
} from '../lib/index.js';
import _0x0_0x264721 from '../lib/isAdmin.js';
import _0x0_0x146f00 from '../config.js';
const WARN_COUNT = _0x0_0x146f00['warnCount'] || 0x3;
function containsURL(_0x332553) {
    const _0x1cc39f = /(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/[^\s]*)?/i;
    return _0x1cc39f['test'](_0x332553);
}
async function Antilink(_0x4127f8, _0x59e979) {
    const _0xbe0039 = _0x4127f8['key']['remoteJid'];
    if (!isJidGroup(_0xbe0039))
        return;
    const _0x1f64f2 = _0x4127f8['message']?.['conversation'] || _0x4127f8['message']?.['extendedTextMessage']?.['text'] || '';
    if (!_0x1f64f2 || typeof _0x1f64f2 !== 'string')
        return;
    const _0x42d1d6 = _0x4127f8['key']['participant'];
    if (!_0x42d1d6)
        return;
    try {
        const {isSenderAdmin: _0x430fc2} = await _0x0_0x264721(_0x59e979, _0xbe0039, _0x42d1d6);
        if (_0x430fc2)
            return;
    } catch (_0x4509da) {
    }
    const _0x53b734 = await isSudo(_0x42d1d6);
    if (_0x53b734)
        return;
    if (!containsURL(_0x1f64f2['trim']()))
        return;
    const _0x1fa114 = await getAntilink(_0xbe0039, 'on');
    if (!_0x1fa114)
        return;
    const _0xc08a9e = _0x1fa114['action'];
    try {
        await _0x59e979['sendMessage'](_0xbe0039, { 'delete': _0x4127f8['key'] });
        switch (_0xc08a9e) {
        case 'delete':
            await _0x59e979['sendMessage'](_0xbe0039, {
                'text': '```@' + _0x42d1d6['split']('@')[0x0] + '\x20link\x20are\x20not\x20allowed\x20here```',
                'mentions': [_0x42d1d6]
            });
            break;
        case 'kick':
            await _0x59e979['groupParticipantsUpdate'](_0xbe0039, [_0x42d1d6], 'remove');
            await _0x59e979['sendMessage'](_0xbe0039, {
                'text': '```@' + _0x42d1d6['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20for\x20sending\x20links```',
                'mentions': [_0x42d1d6]
            });
            break;
        case 'warn':
            const _0x308190 = await incrementWarningCount(_0xbe0039, _0x42d1d6);
            if (_0x308190 >= WARN_COUNT) {
                await _0x59e979['groupParticipantsUpdate'](_0xbe0039, [_0x42d1d6], 'remove');
                await resetWarningCount(_0xbe0039, _0x42d1d6);
                await _0x59e979['sendMessage'](_0xbe0039, {
                    'text': '```@' + _0x42d1d6['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20after\x20' + WARN_COUNT + '\x20warnings```',
                    'mentions': [_0x42d1d6]
                });
            } else {
                await _0x59e979['sendMessage'](_0xbe0039, {
                    'text': '```@' + _0x42d1d6['split']('@')[0x0] + '\x20warning\x20' + _0x308190 + '/' + WARN_COUNT + '\x20for\x20sending\x20links```',
                    'mentions': [_0x42d1d6]
                });
            }
            break;
        }
    } catch (_0x35376f) {
        console['error']('Error\x20in\x20Antilink:', _0x35376f);
    }
}
export default { 'Antilink': Antilink };