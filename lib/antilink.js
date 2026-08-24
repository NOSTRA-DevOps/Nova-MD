import { isJidGroup } from '@whiskeysockets/baileys';
import {
    getAntilink,
    incrementWarningCount,
    resetWarningCount,
    isSudo
} from '../lib/index.js';
import _0x0_0x5618bc from '../lib/isAdmin.js';
import _0x0_0x538d4c from '../config.js';
const WARN_COUNT = _0x0_0x538d4c['warnCount'] || 0x3;
function containsURL(_0x448360) {
    const _0x370c32 = /(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/[^\s]*)?/i;
    return _0x370c32['test'](_0x448360);
}
async function Antilink(_0x3b2da0, _0x57b632) {
    const _0x4eda84 = _0x3b2da0['key']['remoteJid'];
    if (!isJidGroup(_0x4eda84))
        return;
    const _0x4ec956 = _0x3b2da0['message']?.['conversation'] || _0x3b2da0['message']?.['extendedTextMessage']?.['text'] || '';
    if (!_0x4ec956 || typeof _0x4ec956 !== 'string')
        return;
    const _0x551bba = _0x3b2da0['key']['participant'];
    if (!_0x551bba)
        return;
    try {
        const {isSenderAdmin: _0x4df0f7} = await _0x0_0x5618bc(_0x57b632, _0x4eda84, _0x551bba);
        if (_0x4df0f7)
            return;
    } catch (_0x2b58eb) {
    }
    const _0x3f5120 = await isSudo(_0x551bba);
    if (_0x3f5120)
        return;
    if (!containsURL(_0x4ec956['trim']()))
        return;
    const _0x1759be = await getAntilink(_0x4eda84, 'on');
    if (!_0x1759be)
        return;
    const _0xabc030 = _0x1759be['action'];
    try {
        await _0x57b632['sendMessage'](_0x4eda84, { 'delete': _0x3b2da0['key'] });
        switch (_0xabc030) {
        case 'delete':
            await _0x57b632['sendMessage'](_0x4eda84, {
                'text': '```@' + _0x551bba['split']('@')[0x0] + '\x20link\x20are\x20not\x20allowed\x20here```',
                'mentions': [_0x551bba]
            });
            break;
        case 'kick':
            await _0x57b632['groupParticipantsUpdate'](_0x4eda84, [_0x551bba], 'remove');
            await _0x57b632['sendMessage'](_0x4eda84, {
                'text': '```@' + _0x551bba['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20for\x20sending\x20links```',
                'mentions': [_0x551bba]
            });
            break;
        case 'warn':
            const _0x3305d0 = await incrementWarningCount(_0x4eda84, _0x551bba);
            if (_0x3305d0 >= WARN_COUNT) {
                await _0x57b632['groupParticipantsUpdate'](_0x4eda84, [_0x551bba], 'remove');
                await resetWarningCount(_0x4eda84, _0x551bba);
                await _0x57b632['sendMessage'](_0x4eda84, {
                    'text': '```@' + _0x551bba['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20after\x20' + WARN_COUNT + '\x20warnings```',
                    'mentions': [_0x551bba]
                });
            } else {
                await _0x57b632['sendMessage'](_0x4eda84, {
                    'text': '```@' + _0x551bba['split']('@')[0x0] + '\x20warning\x20' + _0x3305d0 + '/' + WARN_COUNT + '\x20for\x20sending\x20links```',
                    'mentions': [_0x551bba]
                });
            }
            break;
        }
    } catch (_0x14f3bf) {
        console['error']('Error\x20in\x20Antilink:', _0x14f3bf);
    }
}
export default { 'Antilink': Antilink };