import _0x0_0x4371f5 from '../config.js';
import { isSudo } from './index.js';
function cleanJid(_0x45b3b1) {
    if (!_0x45b3b1)
        return '';
    return _0x45b3b1['split'](':')[0x0]['split']('@')[0x0];
}
async function isOwnerOrSudo(_0x1de1f5, _0x35d1cf = null, _0x4058c5 = null) {
    const _0x17e9cd = cleanJid(_0x0_0x4371f5['ownerNumber']);
    const _0x135a96 = cleanJid(_0x1de1f5);
    if (_0x135a96 === _0x17e9cd) {
        return !![];
    }
    const _0x2a34e5 = await isSudo(_0x1de1f5);
    if (_0x2a34e5) {
        return !![];
    }
    if (_0x35d1cf && _0x4058c5 && _0x4058c5['endsWith']('@g.us') && _0x1de1f5['includes']('@lid')) {
        try {
            const _0x36a293 = await _0x35d1cf['groupMetadata'](_0x4058c5);
            const _0x4f712b = _0x36a293['participants'] || [];
            const _0x281178 = _0x4f712b['find'](_0x48d9c8 => _0x48d9c8['lid'] === _0x1de1f5 || _0x48d9c8['id'] === _0x1de1f5);
            if (_0x281178) {
                const _0x3f3c88 = cleanJid(_0x281178['id']);
                if (_0x3f3c88 === _0x17e9cd || await isSudo(_0x281178['id'])) {
                    return !![];
                }
            }
        } catch (_0x3debb7) {
        }
    }
    return ![];
}
function isOwnerOnly(_0x8c8a07) {
    const _0x2d9b30 = cleanJid(_0x0_0x4371f5['ownerNumber']);
    const _0x283a56 = cleanJid(_0x8c8a07);
    return _0x283a56 === _0x2d9b30;
}
async function getCleanName(_0x108077, _0x155a4d) {
    if (!_0x108077)
        return 'Unknown';
    const _0x32ee4e = cleanJid(_0x108077);
    try {
        if (_0x155a4d) {
            const _0x5a7c3e = await _0x155a4d['onWhatsApp'](_0x108077);
            if (_0x5a7c3e && _0x5a7c3e[0x0] && _0x5a7c3e[0x0]['exists']) {
                return _0x32ee4e;
            }
        }
    } catch (_0x53ed1c) {
    }
    return _0x32ee4e;
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