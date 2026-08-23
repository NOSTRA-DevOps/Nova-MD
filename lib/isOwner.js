import _0x0_0x3b5ff5 from '../config.js';
import { isSudo } from './index.js';
function cleanJid(_0x33fc72) {
    if (!_0x33fc72)
        return '';
    return _0x33fc72['split'](':')[0x0]['split']('@')[0x0];
}
async function isOwnerOrSudo(_0x1418d6, _0xcde501 = null, _0xf6de36 = null) {
    const _0x9295f4 = cleanJid(_0x0_0x3b5ff5['ownerNumber']);
    const _0x2fa060 = cleanJid(_0x1418d6);
    if (_0x2fa060 === _0x9295f4) {
        return !![];
    }
    const _0xa3c079 = await isSudo(_0x1418d6);
    if (_0xa3c079) {
        return !![];
    }
    if (_0xcde501 && _0xf6de36 && _0xf6de36['endsWith']('@g.us') && _0x1418d6['includes']('@lid')) {
        try {
            const _0x5a604b = await _0xcde501['groupMetadata'](_0xf6de36);
            const _0x59c027 = _0x5a604b['participants'] || [];
            const _0x899f98 = _0x59c027['find'](_0x263210 => _0x263210['lid'] === _0x1418d6 || _0x263210['id'] === _0x1418d6);
            if (_0x899f98) {
                const _0x3e1a92 = cleanJid(_0x899f98['id']);
                if (_0x3e1a92 === _0x9295f4 || await isSudo(_0x899f98['id'])) {
                    return !![];
                }
            }
        } catch (_0x14b3f7) {
        }
    }
    return ![];
}
function isOwnerOnly(_0x14b790) {
    const _0xa372f9 = cleanJid(_0x0_0x3b5ff5['ownerNumber']);
    const _0x2f2859 = cleanJid(_0x14b790);
    return _0x2f2859 === _0xa372f9;
}
async function getCleanName(_0x4b5638, _0x374a38) {
    if (!_0x4b5638)
        return 'Unknown';
    const _0x114483 = cleanJid(_0x4b5638);
    try {
        if (_0x374a38) {
            const _0x4cfee7 = await _0x374a38['onWhatsApp'](_0x4b5638);
            if (_0x4cfee7 && _0x4cfee7[0x0] && _0x4cfee7[0x0]['exists']) {
                return _0x114483;
            }
        }
    } catch (_0x25d7e8) {
    }
    return _0x114483;
}
export default isOwnerOrSudo;
export {
    isOwnerOnly
};
export {
    cleanJid
};
export {
    getCleanName
};