import { isJidGroup } from '@whiskeysockets/baileys';
import {
    getAntilink,
    incrementWarningCount,
    resetWarningCount,
    isSudo
} from '../lib/index.js';
import _0x0_0x58b411 from '../lib/isAdmin.js';
import _0x0_0x45f924 from '../config.js';
const WARN_COUNT = _0x0_0x45f924['warnCount'] || 0x3;
function containsURL(_0x41fcfc) {
    const _0x425eae = /(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/[^\s]*)?/i;
    return _0x425eae['test'](_0x41fcfc);
}
async function Antilink(_0x1633e0, _0x19ec6f) {
    const _0x514ef4 = _0x1633e0['key']['remoteJid'];
    if (!isJidGroup(_0x514ef4))
        return;
    const _0x3269c4 = _0x1633e0['message']?.['conversation'] || _0x1633e0['message']?.['extendedTextMessage']?.['text'] || '';
    if (!_0x3269c4 || typeof _0x3269c4 !== 'string')
        return;
    const _0x36da6b = _0x1633e0['key']['participant'];
    if (!_0x36da6b)
        return;
    try {
        const {isSenderAdmin: _0x16f316} = await _0x0_0x58b411(_0x19ec6f, _0x514ef4, _0x36da6b);
        if (_0x16f316)
            return;
    } catch (_0x2ef42b) {
    }
    const _0x93245b = await isSudo(_0x36da6b);
    if (_0x93245b)
        return;
    if (!containsURL(_0x3269c4['trim']()))
        return;
    const _0x5366af = await getAntilink(_0x514ef4, 'on');
    if (!_0x5366af)
        return;
    const _0x49fdda = _0x5366af['action'];
    try {
        await _0x19ec6f['sendMessage'](_0x514ef4, { 'delete': _0x1633e0['key'] });
        switch (_0x49fdda) {
        case 'delete':
            await _0x19ec6f['sendMessage'](_0x514ef4, {
                'text': '```@' + _0x36da6b['split']('@')[0x0] + '\x20link\x20are\x20not\x20allowed\x20here```',
                'mentions': [_0x36da6b]
            });
            break;
        case 'kick':
            await _0x19ec6f['groupParticipantsUpdate'](_0x514ef4, [_0x36da6b], 'remove');
            await _0x19ec6f['sendMessage'](_0x514ef4, {
                'text': '```@' + _0x36da6b['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20for\x20sending\x20links```',
                'mentions': [_0x36da6b]
            });
            break;
        case 'warn':
            const _0x3b343c = await incrementWarningCount(_0x514ef4, _0x36da6b);
            if (_0x3b343c >= WARN_COUNT) {
                await _0x19ec6f['groupParticipantsUpdate'](_0x514ef4, [_0x36da6b], 'remove');
                await resetWarningCount(_0x514ef4, _0x36da6b);
                await _0x19ec6f['sendMessage'](_0x514ef4, {
                    'text': '```@' + _0x36da6b['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20after\x20' + WARN_COUNT + '\x20warnings```',
                    'mentions': [_0x36da6b]
                });
            } else {
                await _0x19ec6f['sendMessage'](_0x514ef4, {
                    'text': '```@' + _0x36da6b['split']('@')[0x0] + '\x20warning\x20' + _0x3b343c + '/' + WARN_COUNT + '\x20for\x20sending\x20links```',
                    'mentions': [_0x36da6b]
                });
            }
            break;
        }
    } catch (_0x431da0) {
        console['error']('Error\x20in\x20Antilink:', _0x431da0);
    }
}
export default { 'Antilink': Antilink };