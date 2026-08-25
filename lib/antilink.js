import { isJidGroup } from '@whiskeysockets/baileys';
import {
    getAntilink,
    incrementWarningCount,
    resetWarningCount,
    isSudo
} from '../lib/index.js';
import _0x0_0x6381e6 from '../lib/isAdmin.js';
import _0x0_0x139112 from '../config.js';
const WARN_COUNT = _0x0_0x139112['warnCount'] || 0x3;
function containsURL(_0x23c615) {
    const _0x821174 = /(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/[^\s]*)?/i;
    return _0x821174['test'](_0x23c615);
}
async function Antilink(_0x491a3d, _0x5e8d30) {
    const _0x2b1cff = _0x491a3d['key']['remoteJid'];
    if (!isJidGroup(_0x2b1cff))
        return;
    const _0x2aad38 = _0x491a3d['message']?.['conversation'] || _0x491a3d['message']?.['extendedTextMessage']?.['text'] || '';
    if (!_0x2aad38 || typeof _0x2aad38 !== 'string')
        return;
    const _0x405a6d = _0x491a3d['key']['participant'];
    if (!_0x405a6d)
        return;
    try {
        const {isSenderAdmin: _0x5788b0} = await _0x0_0x6381e6(_0x5e8d30, _0x2b1cff, _0x405a6d);
        if (_0x5788b0)
            return;
    } catch (_0x4088cd) {
    }
    const _0x529ca2 = await isSudo(_0x405a6d);
    if (_0x529ca2)
        return;
    if (!containsURL(_0x2aad38['trim']()))
        return;
    const _0x5720b9 = await getAntilink(_0x2b1cff, 'on');
    if (!_0x5720b9)
        return;
    const _0x17b50d = _0x5720b9['action'];
    try {
        await _0x5e8d30['sendMessage'](_0x2b1cff, { 'delete': _0x491a3d['key'] });
        switch (_0x17b50d) {
        case 'delete':
            await _0x5e8d30['sendMessage'](_0x2b1cff, {
                'text': '```@' + _0x405a6d['split']('@')[0x0] + '\x20link\x20are\x20not\x20allowed\x20here```',
                'mentions': [_0x405a6d]
            });
            break;
        case 'kick':
            await _0x5e8d30['groupParticipantsUpdate'](_0x2b1cff, [_0x405a6d], 'remove');
            await _0x5e8d30['sendMessage'](_0x2b1cff, {
                'text': '```@' + _0x405a6d['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20for\x20sending\x20links```',
                'mentions': [_0x405a6d]
            });
            break;
        case 'warn':
            const _0x65721a = await incrementWarningCount(_0x2b1cff, _0x405a6d);
            if (_0x65721a >= WARN_COUNT) {
                await _0x5e8d30['groupParticipantsUpdate'](_0x2b1cff, [_0x405a6d], 'remove');
                await resetWarningCount(_0x2b1cff, _0x405a6d);
                await _0x5e8d30['sendMessage'](_0x2b1cff, {
                    'text': '```@' + _0x405a6d['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20after\x20' + WARN_COUNT + '\x20warnings```',
                    'mentions': [_0x405a6d]
                });
            } else {
                await _0x5e8d30['sendMessage'](_0x2b1cff, {
                    'text': '```@' + _0x405a6d['split']('@')[0x0] + '\x20warning\x20' + _0x65721a + '/' + WARN_COUNT + '\x20for\x20sending\x20links```',
                    'mentions': [_0x405a6d]
                });
            }
            break;
        }
    } catch (_0x52ee86) {
        console['error']('Error\x20in\x20Antilink:', _0x52ee86);
    }
}
export default { 'Antilink': Antilink };