import { isJidGroup } from '@whiskeysockets/baileys';
import {
    getAntilink,
    incrementWarningCount,
    resetWarningCount,
    isSudo
} from '../lib/index.js';
import _0x0_0x209d8b from '../lib/isAdmin.js';
import _0x0_0x5308eb from '../config.js';
const WARN_COUNT = _0x0_0x5308eb['warnCount'] || 0x3;
function containsURL(_0x4e3ca5) {
    const _0x17421a = /(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/[^\s]*)?/i;
    return _0x17421a['test'](_0x4e3ca5);
}
async function Antilink(_0x539794, _0x9cd9dc) {
    const _0x48cf7d = _0x539794['key']['remoteJid'];
    if (!isJidGroup(_0x48cf7d))
        return;
    const _0x4ec192 = _0x539794['message']?.['conversation'] || _0x539794['message']?.['extendedTextMessage']?.['text'] || '';
    if (!_0x4ec192 || typeof _0x4ec192 !== 'string')
        return;
    const _0x2bd61e = _0x539794['key']['participant'];
    if (!_0x2bd61e)
        return;
    try {
        const {isSenderAdmin: _0x106338} = await _0x0_0x209d8b(_0x9cd9dc, _0x48cf7d, _0x2bd61e);
        if (_0x106338)
            return;
    } catch (_0x36a27e) {
    }
    const _0x1e3f4f = await isSudo(_0x2bd61e);
    if (_0x1e3f4f)
        return;
    if (!containsURL(_0x4ec192['trim']()))
        return;
    const _0x5db84f = await getAntilink(_0x48cf7d, 'on');
    if (!_0x5db84f)
        return;
    const _0x4efe8a = _0x5db84f['action'];
    try {
        await _0x9cd9dc['sendMessage'](_0x48cf7d, { 'delete': _0x539794['key'] });
        switch (_0x4efe8a) {
        case 'delete':
            await _0x9cd9dc['sendMessage'](_0x48cf7d, {
                'text': '```@' + _0x2bd61e['split']('@')[0x0] + '\x20link\x20are\x20not\x20allowed\x20here```',
                'mentions': [_0x2bd61e]
            });
            break;
        case 'kick':
            await _0x9cd9dc['groupParticipantsUpdate'](_0x48cf7d, [_0x2bd61e], 'remove');
            await _0x9cd9dc['sendMessage'](_0x48cf7d, {
                'text': '```@' + _0x2bd61e['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20for\x20sending\x20links```',
                'mentions': [_0x2bd61e]
            });
            break;
        case 'warn':
            const _0x2507d1 = await incrementWarningCount(_0x48cf7d, _0x2bd61e);
            if (_0x2507d1 >= WARN_COUNT) {
                await _0x9cd9dc['groupParticipantsUpdate'](_0x48cf7d, [_0x2bd61e], 'remove');
                await resetWarningCount(_0x48cf7d, _0x2bd61e);
                await _0x9cd9dc['sendMessage'](_0x48cf7d, {
                    'text': '```@' + _0x2bd61e['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20after\x20' + WARN_COUNT + '\x20warnings```',
                    'mentions': [_0x2bd61e]
                });
            } else {
                await _0x9cd9dc['sendMessage'](_0x48cf7d, {
                    'text': '```@' + _0x2bd61e['split']('@')[0x0] + '\x20warning\x20' + _0x2507d1 + '/' + WARN_COUNT + '\x20for\x20sending\x20links```',
                    'mentions': [_0x2bd61e]
                });
            }
            break;
        }
    } catch (_0x302ceb) {
        console['error']('Error\x20in\x20Antilink:', _0x302ceb);
    }
}
export default { 'Antilink': Antilink };