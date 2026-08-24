import _0x0_0x3d45b7 from '../config.js';
import { isSudo } from './index.js';
function cleanJid(_0xa88da8) {
    if (!_0xa88da8)
        return '';
    return _0xa88da8['split'](':')[0x0]['split']('@')[0x0];
}
async function isOwnerOrSudo(_0x161cbc, _0x32a1a4 = null, _0x3771ad = null) {
    const _0x40c6a2 = cleanJid(_0x0_0x3d45b7['ownerNumber']);
    const _0x2c940d = cleanJid(_0x161cbc);
    if (_0x2c940d === _0x40c6a2) {
        return !![];
    }
    const _0x6d659f = await isSudo(_0x161cbc);
    if (_0x6d659f) {
        return !![];
    }
    if (_0x32a1a4 && _0x3771ad && _0x3771ad['endsWith']('@g.us') && _0x161cbc['includes']('@lid')) {
        try {
            const _0x3addfe = await _0x32a1a4['groupMetadata'](_0x3771ad);
            const _0x1049be = _0x3addfe['participants'] || [];
            const _0x399f4c = _0x1049be['find'](_0x4b856b => _0x4b856b['lid'] === _0x161cbc || _0x4b856b['id'] === _0x161cbc);
            if (_0x399f4c) {
                const _0x2d13a2 = cleanJid(_0x399f4c['id']);
                if (_0x2d13a2 === _0x40c6a2 || await isSudo(_0x399f4c['id'])) {
                    return !![];
                }
            }
        } catch (_0x26d325) {
        }
    }
    return ![];
}
function isOwnerOnly(_0x1a92d6) {
    const _0x536218 = cleanJid(_0x0_0x3d45b7['ownerNumber']);
    const _0x171c1e = cleanJid(_0x1a92d6);
    return _0x171c1e === _0x536218;
}
async function getCleanName(_0x3e1031, _0x282645) {
    if (!_0x3e1031)
        return 'Unknown';
    const _0x56389b = cleanJid(_0x3e1031);
    try {
        if (_0x282645) {
            const _0x219596 = await _0x282645['onWhatsApp'](_0x3e1031);
            if (_0x219596 && _0x219596[0x0] && _0x219596[0x0]['exists']) {
                return _0x56389b;
            }
        }
    } catch (_0x351299) {
    }
    return _0x56389b;
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