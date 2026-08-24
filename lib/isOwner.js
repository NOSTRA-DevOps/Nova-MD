import _0x0_0x30087e from '../config.js';
import { isSudo } from './index.js';
function cleanJid(_0x7c3fa2) {
    if (!_0x7c3fa2)
        return '';
    return _0x7c3fa2['split'](':')[0x0]['split']('@')[0x0];
}
async function isOwnerOrSudo(_0x45ed8b, _0x15aa2f = null, _0x5c4e3b = null) {
    const _0xd564e9 = cleanJid(_0x0_0x30087e['ownerNumber']);
    const _0x4f7afa = cleanJid(_0x45ed8b);
    if (_0x4f7afa === _0xd564e9) {
        return !![];
    }
    const _0x418c8a = await isSudo(_0x45ed8b);
    if (_0x418c8a) {
        return !![];
    }
    if (_0x15aa2f && _0x5c4e3b && _0x5c4e3b['endsWith']('@g.us') && _0x45ed8b['includes']('@lid')) {
        try {
            const _0x3273c5 = await _0x15aa2f['groupMetadata'](_0x5c4e3b);
            const _0x167b9e = _0x3273c5['participants'] || [];
            const _0x2f2fa1 = _0x167b9e['find'](_0x27b5ff => _0x27b5ff['lid'] === _0x45ed8b || _0x27b5ff['id'] === _0x45ed8b);
            if (_0x2f2fa1) {
                const _0x1da357 = cleanJid(_0x2f2fa1['id']);
                if (_0x1da357 === _0xd564e9 || await isSudo(_0x2f2fa1['id'])) {
                    return !![];
                }
            }
        } catch (_0xf18666) {
        }
    }
    return ![];
}
function isOwnerOnly(_0x8f4ab9) {
    const _0x22a3e9 = cleanJid(_0x0_0x30087e['ownerNumber']);
    const _0x46cbbb = cleanJid(_0x8f4ab9);
    return _0x46cbbb === _0x22a3e9;
}
async function getCleanName(_0xc4c9a2, _0x5a31ef) {
    if (!_0xc4c9a2)
        return 'Unknown';
    const _0x2dc8d5 = cleanJid(_0xc4c9a2);
    try {
        if (_0x5a31ef) {
            const _0x5b2fa9 = await _0x5a31ef['onWhatsApp'](_0xc4c9a2);
            if (_0x5b2fa9 && _0x5b2fa9[0x0] && _0x5b2fa9[0x0]['exists']) {
                return _0x2dc8d5;
            }
        }
    } catch (_0x5daa30) {
    }
    return _0x2dc8d5;
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