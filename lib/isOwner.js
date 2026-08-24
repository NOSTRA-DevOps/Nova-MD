import _0x0_0x45fbe2 from '../config.js';
import { isSudo } from './index.js';
function cleanJid(_0x2be620) {
    if (!_0x2be620)
        return '';
    return _0x2be620['split'](':')[0x0]['split']('@')[0x0];
}
async function isOwnerOrSudo(_0x44ea18, _0x14dcc4 = null, _0x1156db = null) {
    const _0x580b11 = cleanJid(_0x0_0x45fbe2['ownerNumber']);
    const _0x4c90c4 = cleanJid(_0x44ea18);
    if (_0x4c90c4 === _0x580b11) {
        return !![];
    }
    const _0x1a79aa = await isSudo(_0x44ea18);
    if (_0x1a79aa) {
        return !![];
    }
    if (_0x14dcc4 && _0x1156db && _0x1156db['endsWith']('@g.us') && _0x44ea18['includes']('@lid')) {
        try {
            const _0x4ce025 = await _0x14dcc4['groupMetadata'](_0x1156db);
            const _0x510131 = _0x4ce025['participants'] || [];
            const _0x4f5c8d = _0x510131['find'](_0x510283 => _0x510283['lid'] === _0x44ea18 || _0x510283['id'] === _0x44ea18);
            if (_0x4f5c8d) {
                const _0xf98639 = cleanJid(_0x4f5c8d['id']);
                if (_0xf98639 === _0x580b11 || await isSudo(_0x4f5c8d['id'])) {
                    return !![];
                }
            }
        } catch (_0x1dbf1c) {
        }
    }
    return ![];
}
function isOwnerOnly(_0x4e9bf1) {
    const _0x3343b3 = cleanJid(_0x0_0x45fbe2['ownerNumber']);
    const _0x5049cf = cleanJid(_0x4e9bf1);
    return _0x5049cf === _0x3343b3;
}
async function getCleanName(_0x29ae33, _0x4f853d) {
    if (!_0x29ae33)
        return 'Unknown';
    const _0x5b4a5f = cleanJid(_0x29ae33);
    try {
        if (_0x4f853d) {
            const _0xdd372b = await _0x4f853d['onWhatsApp'](_0x29ae33);
            if (_0xdd372b && _0xdd372b[0x0] && _0xdd372b[0x0]['exists']) {
                return _0x5b4a5f;
            }
        }
    } catch (_0x15e901) {
    }
    return _0x5b4a5f;
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