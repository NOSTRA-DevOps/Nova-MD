import _0x0_0x1d6518 from '../config.js';
import { isSudo } from './index.js';
function cleanJid(_0x349b44) {
    if (!_0x349b44)
        return '';
    return _0x349b44['split'](':')[0x0]['split']('@')[0x0];
}
async function isOwnerOrSudo(_0x392f75, _0x3f3e10 = null, _0x3b7be7 = null) {
    const _0x5d8021 = cleanJid(_0x0_0x1d6518['ownerNumber']);
    const _0x1e587a = cleanJid(_0x392f75);
    if (_0x1e587a === _0x5d8021) {
        return !![];
    }
    const _0x40f3d9 = await isSudo(_0x392f75);
    if (_0x40f3d9) {
        return !![];
    }
    if (_0x3f3e10 && _0x3b7be7 && _0x3b7be7['endsWith']('@g.us') && _0x392f75['includes']('@lid')) {
        try {
            const _0x3f8e1d = await _0x3f3e10['groupMetadata'](_0x3b7be7);
            const _0x3b223b = _0x3f8e1d['participants'] || [];
            const _0x3ecb69 = _0x3b223b['find'](_0x247a71 => _0x247a71['lid'] === _0x392f75 || _0x247a71['id'] === _0x392f75);
            if (_0x3ecb69) {
                const _0xabd092 = cleanJid(_0x3ecb69['id']);
                if (_0xabd092 === _0x5d8021 || await isSudo(_0x3ecb69['id'])) {
                    return !![];
                }
            }
        } catch (_0x2182ff) {
        }
    }
    return ![];
}
function isOwnerOnly(_0x512e88) {
    const _0x4613f3 = cleanJid(_0x0_0x1d6518['ownerNumber']);
    const _0x278b74 = cleanJid(_0x512e88);
    return _0x278b74 === _0x4613f3;
}
async function getCleanName(_0x4a29d3, _0x541b2e) {
    if (!_0x4a29d3)
        return 'Unknown';
    const _0x9fac9c = cleanJid(_0x4a29d3);
    try {
        if (_0x541b2e) {
            const _0x1c9125 = await _0x541b2e['onWhatsApp'](_0x4a29d3);
            if (_0x1c9125 && _0x1c9125[0x0] && _0x1c9125[0x0]['exists']) {
                return _0x9fac9c;
            }
        }
    } catch (_0x5129d2) {
    }
    return _0x9fac9c;
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