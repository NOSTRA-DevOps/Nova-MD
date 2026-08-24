import _0x0_0x51d964 from '../config.js';
import { isSudo } from './index.js';
function cleanJid(_0x17760d) {
    if (!_0x17760d)
        return '';
    return _0x17760d['split'](':')[0x0]['split']('@')[0x0];
}
async function isOwnerOrSudo(_0x282881, _0x285f21 = null, _0xbb1b3d = null) {
    const _0x3bbf47 = cleanJid(_0x0_0x51d964['ownerNumber']);
    const _0x916eee = cleanJid(_0x282881);
    if (_0x916eee === _0x3bbf47) {
        return !![];
    }
    const _0x3f76ec = await isSudo(_0x282881);
    if (_0x3f76ec) {
        return !![];
    }
    if (_0x285f21 && _0xbb1b3d && _0xbb1b3d['endsWith']('@g.us') && _0x282881['includes']('@lid')) {
        try {
            const _0x53eb32 = await _0x285f21['groupMetadata'](_0xbb1b3d);
            const _0x260ad2 = _0x53eb32['participants'] || [];
            const _0x831147 = _0x260ad2['find'](_0x33629d => _0x33629d['lid'] === _0x282881 || _0x33629d['id'] === _0x282881);
            if (_0x831147) {
                const _0x4cbda8 = cleanJid(_0x831147['id']);
                if (_0x4cbda8 === _0x3bbf47 || await isSudo(_0x831147['id'])) {
                    return !![];
                }
            }
        } catch (_0x31ad4f) {
        }
    }
    return ![];
}
function isOwnerOnly(_0x426998) {
    const _0x33d14b = cleanJid(_0x0_0x51d964['ownerNumber']);
    const _0x58ef76 = cleanJid(_0x426998);
    return _0x58ef76 === _0x33d14b;
}
async function getCleanName(_0xb6cab3, _0xd63de3) {
    if (!_0xb6cab3)
        return 'Unknown';
    const _0x96b84f = cleanJid(_0xb6cab3);
    try {
        if (_0xd63de3) {
            const _0x4d27ac = await _0xd63de3['onWhatsApp'](_0xb6cab3);
            if (_0x4d27ac && _0x4d27ac[0x0] && _0x4d27ac[0x0]['exists']) {
                return _0x96b84f;
            }
        }
    } catch (_0x557a89) {
    }
    return _0x96b84f;
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