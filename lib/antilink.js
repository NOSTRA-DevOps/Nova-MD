import { isJidGroup } from '@whiskeysockets/baileys';
import {
    getAntilink,
    incrementWarningCount,
    resetWarningCount,
    isSudo
} from '../lib/index.js';
import _0x0_0x4c5419 from '../lib/isAdmin.js';
import _0x0_0x144677 from '../config.js';
const WARN_COUNT = _0x0_0x144677['warnCount'] || 0x3;
function containsURL(_0x5d2c88) {
    const _0x171e56 = /(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/[^\s]*)?/i;
    return _0x171e56['test'](_0x5d2c88);
}
async function Antilink(_0x35e5d5, _0x546740) {
    const _0x305afa = _0x35e5d5['key']['remoteJid'];
    if (!isJidGroup(_0x305afa))
        return;
    const _0x26925c = _0x35e5d5['message']?.['conversation'] || _0x35e5d5['message']?.['extendedTextMessage']?.['text'] || '';
    if (!_0x26925c || typeof _0x26925c !== 'string')
        return;
    const _0x18a120 = _0x35e5d5['key']['participant'];
    if (!_0x18a120)
        return;
    try {
        const {isSenderAdmin: _0x398a94} = await _0x0_0x4c5419(_0x546740, _0x305afa, _0x18a120);
        if (_0x398a94)
            return;
    } catch (_0x2c9297) {
    }
    const _0x5e003e = await isSudo(_0x18a120);
    if (_0x5e003e)
        return;
    if (!containsURL(_0x26925c['trim']()))
        return;
    const _0x40aa30 = await getAntilink(_0x305afa, 'on');
    if (!_0x40aa30)
        return;
    const _0x5c34b8 = _0x40aa30['action'];
    try {
        await _0x546740['sendMessage'](_0x305afa, { 'delete': _0x35e5d5['key'] });
        switch (_0x5c34b8) {
        case 'delete':
            await _0x546740['sendMessage'](_0x305afa, {
                'text': '```@' + _0x18a120['split']('@')[0x0] + '\x20link\x20are\x20not\x20allowed\x20here```',
                'mentions': [_0x18a120]
            });
            break;
        case 'kick':
            await _0x546740['groupParticipantsUpdate'](_0x305afa, [_0x18a120], 'remove');
            await _0x546740['sendMessage'](_0x305afa, {
                'text': '```@' + _0x18a120['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20for\x20sending\x20links```',
                'mentions': [_0x18a120]
            });
            break;
        case 'warn':
            const _0x50af2f = await incrementWarningCount(_0x305afa, _0x18a120);
            if (_0x50af2f >= WARN_COUNT) {
                await _0x546740['groupParticipantsUpdate'](_0x305afa, [_0x18a120], 'remove');
                await resetWarningCount(_0x305afa, _0x18a120);
                await _0x546740['sendMessage'](_0x305afa, {
                    'text': '```@' + _0x18a120['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20after\x20' + WARN_COUNT + '\x20warnings```',
                    'mentions': [_0x18a120]
                });
            } else {
                await _0x546740['sendMessage'](_0x305afa, {
                    'text': '```@' + _0x18a120['split']('@')[0x0] + '\x20warning\x20' + _0x50af2f + '/' + WARN_COUNT + '\x20for\x20sending\x20links```',
                    'mentions': [_0x18a120]
                });
            }
            break;
        }
    } catch (_0x429d51) {
        console['error']('Error\x20in\x20Antilink:', _0x429d51);
    }
}
export default { 'Antilink': Antilink };