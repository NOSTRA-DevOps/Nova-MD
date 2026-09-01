import { isJidGroup } from '@whiskeysockets/baileys';
import {
    getAntilink,
    incrementWarningCount,
    resetWarningCount,
    isSudo
} from '../lib/index.js';
import _0x0_0x4401bf from '../lib/isAdmin.js';
import _0x0_0x1fd9d1 from '../config.js';
const WARN_COUNT = _0x0_0x1fd9d1['warnCount'] || 0x3;
function containsURL(_0x5784c5) {
    const _0x3eda49 = /(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/[^\s]*)?/i;
    return _0x3eda49['test'](_0x5784c5);
}
async function Antilink(_0x5f12fb, _0x3a9507) {
    const _0x22676b = _0x5f12fb['key']['remoteJid'];
    if (!isJidGroup(_0x22676b))
        return;
    const _0x2efb1d = _0x5f12fb['message']?.['conversation'] || _0x5f12fb['message']?.['extendedTextMessage']?.['text'] || '';
    if (!_0x2efb1d || typeof _0x2efb1d !== 'string')
        return;
    const _0x13580a = _0x5f12fb['key']['participant'];
    if (!_0x13580a)
        return;
    try {
        const {isSenderAdmin: _0x29009c} = await _0x0_0x4401bf(_0x3a9507, _0x22676b, _0x13580a);
        if (_0x29009c)
            return;
    } catch (_0x56e9d1) {
    }
    const _0x517019 = await isSudo(_0x13580a);
    if (_0x517019)
        return;
    if (!containsURL(_0x2efb1d['trim']()))
        return;
    const _0x4fd9b3 = await getAntilink(_0x22676b, 'on');
    if (!_0x4fd9b3)
        return;
    const _0x3d94fc = _0x4fd9b3['action'];
    try {
        await _0x3a9507['sendMessage'](_0x22676b, { 'delete': _0x5f12fb['key'] });
        switch (_0x3d94fc) {
        case 'delete':
            await _0x3a9507['sendMessage'](_0x22676b, {
                'text': '```@' + _0x13580a['split']('@')[0x0] + '\x20link\x20are\x20not\x20allowed\x20here```',
                'mentions': [_0x13580a]
            });
            break;
        case 'kick':
            await _0x3a9507['groupParticipantsUpdate'](_0x22676b, [_0x13580a], 'remove');
            await _0x3a9507['sendMessage'](_0x22676b, {
                'text': '```@' + _0x13580a['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20for\x20sending\x20links```',
                'mentions': [_0x13580a]
            });
            break;
        case 'warn':
            const _0x5be920 = await incrementWarningCount(_0x22676b, _0x13580a);
            if (_0x5be920 >= WARN_COUNT) {
                await _0x3a9507['groupParticipantsUpdate'](_0x22676b, [_0x13580a], 'remove');
                await resetWarningCount(_0x22676b, _0x13580a);
                await _0x3a9507['sendMessage'](_0x22676b, {
                    'text': '```@' + _0x13580a['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20after\x20' + WARN_COUNT + '\x20warnings```',
                    'mentions': [_0x13580a]
                });
            } else {
                await _0x3a9507['sendMessage'](_0x22676b, {
                    'text': '```@' + _0x13580a['split']('@')[0x0] + '\x20warning\x20' + _0x5be920 + '/' + WARN_COUNT + '\x20for\x20sending\x20links```',
                    'mentions': [_0x13580a]
                });
            }
            break;
        }
    } catch (_0x43f862) {
        console['error']('Error\x20in\x20Antilink:', _0x43f862);
    }
}
export default { 'Antilink': Antilink };