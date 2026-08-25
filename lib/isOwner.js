import _0x0_0x3c66a6 from '../config.js';
import { isSudo } from './index.js';
function cleanJid(_0x3c5bf6) {
    if (!_0x3c5bf6)
        return '';
    return _0x3c5bf6['split'](':')[0x0]['split']('@')[0x0];
}
async function isOwnerOrSudo(_0x1e7ba2, _0x37bf5a = null, _0x13ee3b = null) {
    const _0x51115a = cleanJid(_0x0_0x3c66a6['ownerNumber']);
    const _0x3aa086 = cleanJid(_0x1e7ba2);
    if (_0x3aa086 === _0x51115a) {
        return !![];
    }
    const _0x4d845b = await isSudo(_0x1e7ba2);
    if (_0x4d845b) {
        return !![];
    }
    if (_0x37bf5a && _0x13ee3b && _0x13ee3b['endsWith']('@g.us') && _0x1e7ba2['includes']('@lid')) {
        try {
            const _0x20bc14 = await _0x37bf5a['groupMetadata'](_0x13ee3b);
            const _0x4be855 = _0x20bc14['participants'] || [];
            const _0x309951 = _0x4be855['find'](_0x414284 => _0x414284['lid'] === _0x1e7ba2 || _0x414284['id'] === _0x1e7ba2);
            if (_0x309951) {
                const _0x42fcb1 = cleanJid(_0x309951['id']);
                if (_0x42fcb1 === _0x51115a || await isSudo(_0x309951['id'])) {
                    return !![];
                }
            }
        } catch (_0x22a133) {
        }
    }
    return ![];
}
function isOwnerOnly(_0x126b42) {
    const _0x165320 = cleanJid(_0x0_0x3c66a6['ownerNumber']);
    const _0x9c38bc = cleanJid(_0x126b42);
    return _0x9c38bc === _0x165320;
}
async function getCleanName(_0x1dea89, _0x5a2428) {
    if (!_0x1dea89)
        return 'Unknown';
    const _0x4341c5 = cleanJid(_0x1dea89);
    try {
        if (_0x5a2428) {
            const _0x3b3678 = await _0x5a2428['onWhatsApp'](_0x1dea89);
            if (_0x3b3678 && _0x3b3678[0x0] && _0x3b3678[0x0]['exists']) {
                return _0x4341c5;
            }
        }
    } catch (_0x5d9181) {
    }
    return _0x4341c5;
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