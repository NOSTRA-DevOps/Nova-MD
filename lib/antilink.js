import { isJidGroup } from '@whiskeysockets/baileys';
import {
    getAntilink,
    incrementWarningCount,
    resetWarningCount,
    isSudo
} from '../lib/index.js';
import _0x0_0x30e343 from '../lib/isAdmin.js';
import _0x0_0x2eaf94 from '../config.js';
const WARN_COUNT = _0x0_0x2eaf94['warnCount'] || 0x3;
function containsURL(_0x265cda) {
    const _0x3cf12b = /(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/[^\s]*)?/i;
    return _0x3cf12b['test'](_0x265cda);
}
async function Antilink(_0x473e69, _0x494ca4) {
    const _0x19d8d2 = _0x473e69['key']['remoteJid'];
    if (!isJidGroup(_0x19d8d2))
        return;
    const _0xda77e0 = _0x473e69['message']?.['conversation'] || _0x473e69['message']?.['extendedTextMessage']?.['text'] || '';
    if (!_0xda77e0 || typeof _0xda77e0 !== 'string')
        return;
    const _0x29ec6a = _0x473e69['key']['participant'];
    if (!_0x29ec6a)
        return;
    try {
        const {isSenderAdmin: _0x374d57} = await _0x0_0x30e343(_0x494ca4, _0x19d8d2, _0x29ec6a);
        if (_0x374d57)
            return;
    } catch (_0x5d921c) {
    }
    const _0x112513 = await isSudo(_0x29ec6a);
    if (_0x112513)
        return;
    if (!containsURL(_0xda77e0['trim']()))
        return;
    const _0x2834ed = await getAntilink(_0x19d8d2, 'on');
    if (!_0x2834ed)
        return;
    const _0x143ded = _0x2834ed['action'];
    try {
        await _0x494ca4['sendMessage'](_0x19d8d2, { 'delete': _0x473e69['key'] });
        switch (_0x143ded) {
        case 'delete':
            await _0x494ca4['sendMessage'](_0x19d8d2, {
                'text': '```@' + _0x29ec6a['split']('@')[0x0] + '\x20link\x20are\x20not\x20allowed\x20here```',
                'mentions': [_0x29ec6a]
            });
            break;
        case 'kick':
            await _0x494ca4['groupParticipantsUpdate'](_0x19d8d2, [_0x29ec6a], 'remove');
            await _0x494ca4['sendMessage'](_0x19d8d2, {
                'text': '```@' + _0x29ec6a['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20for\x20sending\x20links```',
                'mentions': [_0x29ec6a]
            });
            break;
        case 'warn':
            const _0x2cc102 = await incrementWarningCount(_0x19d8d2, _0x29ec6a);
            if (_0x2cc102 >= WARN_COUNT) {
                await _0x494ca4['groupParticipantsUpdate'](_0x19d8d2, [_0x29ec6a], 'remove');
                await resetWarningCount(_0x19d8d2, _0x29ec6a);
                await _0x494ca4['sendMessage'](_0x19d8d2, {
                    'text': '```@' + _0x29ec6a['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20after\x20' + WARN_COUNT + '\x20warnings```',
                    'mentions': [_0x29ec6a]
                });
            } else {
                await _0x494ca4['sendMessage'](_0x19d8d2, {
                    'text': '```@' + _0x29ec6a['split']('@')[0x0] + '\x20warning\x20' + _0x2cc102 + '/' + WARN_COUNT + '\x20for\x20sending\x20links```',
                    'mentions': [_0x29ec6a]
                });
            }
            break;
        }
    } catch (_0x317e48) {
        console['error']('Error\x20in\x20Antilink:', _0x317e48);
    }
}
export default { 'Antilink': Antilink };