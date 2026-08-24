import { isJidGroup } from '@whiskeysockets/baileys';
import {
    getAntilink,
    incrementWarningCount,
    resetWarningCount,
    isSudo
} from '../lib/index.js';
import _0x0_0x127249 from '../lib/isAdmin.js';
import _0x0_0x53820c from '../config.js';
const WARN_COUNT = _0x0_0x53820c['warnCount'] || 0x3;
function containsURL(_0xd365cc) {
    const _0x47b78f = /(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/[^\s]*)?/i;
    return _0x47b78f['test'](_0xd365cc);
}
async function Antilink(_0xc799c1, _0x1803a6) {
    const _0xfd8b33 = _0xc799c1['key']['remoteJid'];
    if (!isJidGroup(_0xfd8b33))
        return;
    const _0x7beeb = _0xc799c1['message']?.['conversation'] || _0xc799c1['message']?.['extendedTextMessage']?.['text'] || '';
    if (!_0x7beeb || typeof _0x7beeb !== 'string')
        return;
    const _0xfab251 = _0xc799c1['key']['participant'];
    if (!_0xfab251)
        return;
    try {
        const {isSenderAdmin: _0x181edf} = await _0x0_0x127249(_0x1803a6, _0xfd8b33, _0xfab251);
        if (_0x181edf)
            return;
    } catch (_0x560533) {
    }
    const _0xc7d9a1 = await isSudo(_0xfab251);
    if (_0xc7d9a1)
        return;
    if (!containsURL(_0x7beeb['trim']()))
        return;
    const _0x2321a8 = await getAntilink(_0xfd8b33, 'on');
    if (!_0x2321a8)
        return;
    const _0x160251 = _0x2321a8['action'];
    try {
        await _0x1803a6['sendMessage'](_0xfd8b33, { 'delete': _0xc799c1['key'] });
        switch (_0x160251) {
        case 'delete':
            await _0x1803a6['sendMessage'](_0xfd8b33, {
                'text': '```@' + _0xfab251['split']('@')[0x0] + '\x20link\x20are\x20not\x20allowed\x20here```',
                'mentions': [_0xfab251]
            });
            break;
        case 'kick':
            await _0x1803a6['groupParticipantsUpdate'](_0xfd8b33, [_0xfab251], 'remove');
            await _0x1803a6['sendMessage'](_0xfd8b33, {
                'text': '```@' + _0xfab251['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20for\x20sending\x20links```',
                'mentions': [_0xfab251]
            });
            break;
        case 'warn':
            const _0x197dd8 = await incrementWarningCount(_0xfd8b33, _0xfab251);
            if (_0x197dd8 >= WARN_COUNT) {
                await _0x1803a6['groupParticipantsUpdate'](_0xfd8b33, [_0xfab251], 'remove');
                await resetWarningCount(_0xfd8b33, _0xfab251);
                await _0x1803a6['sendMessage'](_0xfd8b33, {
                    'text': '```@' + _0xfab251['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20after\x20' + WARN_COUNT + '\x20warnings```',
                    'mentions': [_0xfab251]
                });
            } else {
                await _0x1803a6['sendMessage'](_0xfd8b33, {
                    'text': '```@' + _0xfab251['split']('@')[0x0] + '\x20warning\x20' + _0x197dd8 + '/' + WARN_COUNT + '\x20for\x20sending\x20links```',
                    'mentions': [_0xfab251]
                });
            }
            break;
        }
    } catch (_0x1d5e2b) {
        console['error']('Error\x20in\x20Antilink:', _0x1d5e2b);
    }
}
export default { 'Antilink': Antilink };