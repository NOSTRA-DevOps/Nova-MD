import _0x0_0x30f19a from '../config.js';
import { isSudo } from './index.js';
function cleanJid(_0x2ed98a) {
    if (!_0x2ed98a)
        return '';
    return _0x2ed98a['split'](':')[0x0]['split']('@')[0x0];
}
async function isOwnerOrSudo(_0x439f01, _0x53c01d = null, _0x5362b7 = null) {
    const _0x576247 = cleanJid(_0x0_0x30f19a['ownerNumber']);
    const _0x509bf0 = cleanJid(_0x439f01);
    if (_0x509bf0 === _0x576247) {
        return !![];
    }
    const _0x35b326 = await isSudo(_0x439f01);
    if (_0x35b326) {
        return !![];
    }
    if (_0x53c01d && _0x5362b7 && _0x5362b7['endsWith']('@g.us') && _0x439f01['includes']('@lid')) {
        try {
            const _0x2a7e4f = await _0x53c01d['groupMetadata'](_0x5362b7);
            const _0x32d470 = _0x2a7e4f['participants'] || [];
            const _0xa0e573 = _0x32d470['find'](_0x1a5a5b => _0x1a5a5b['lid'] === _0x439f01 || _0x1a5a5b['id'] === _0x439f01);
            if (_0xa0e573) {
                const _0x4de1e8 = cleanJid(_0xa0e573['id']);
                if (_0x4de1e8 === _0x576247 || await isSudo(_0xa0e573['id'])) {
                    return !![];
                }
            }
        } catch (_0x5768ea) {
        }
    }
    return ![];
}
function isOwnerOnly(_0x193d2e) {
    const _0x3d9dc9 = cleanJid(_0x0_0x30f19a['ownerNumber']);
    const _0x3de7bc = cleanJid(_0x193d2e);
    return _0x3de7bc === _0x3d9dc9;
}
async function getCleanName(_0xf42f4, _0x5a134a) {
    if (!_0xf42f4)
        return 'Unknown';
    const _0x1cf3bd = cleanJid(_0xf42f4);
    try {
        if (_0x5a134a) {
            const _0x3cb80d = await _0x5a134a['onWhatsApp'](_0xf42f4);
            if (_0x3cb80d && _0x3cb80d[0x0] && _0x3cb80d[0x0]['exists']) {
                return _0x1cf3bd;
            }
        }
    } catch (_0x4abb41) {
    }
    return _0x1cf3bd;
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