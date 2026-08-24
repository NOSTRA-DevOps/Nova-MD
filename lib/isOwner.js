import _0x0_0x278e77 from '../config.js';
import { isSudo } from './index.js';
function cleanJid(_0x4d7afa) {
    if (!_0x4d7afa)
        return '';
    return _0x4d7afa['split'](':')[0x0]['split']('@')[0x0];
}
async function isOwnerOrSudo(_0x146471, _0x2ac486 = null, _0x129b09 = null) {
    const _0x137b13 = cleanJid(_0x0_0x278e77['ownerNumber']);
    const _0x41812b = cleanJid(_0x146471);
    if (_0x41812b === _0x137b13) {
        return !![];
    }
    const _0x2fcfb9 = await isSudo(_0x146471);
    if (_0x2fcfb9) {
        return !![];
    }
    if (_0x2ac486 && _0x129b09 && _0x129b09['endsWith']('@g.us') && _0x146471['includes']('@lid')) {
        try {
            const _0x519823 = await _0x2ac486['groupMetadata'](_0x129b09);
            const _0x4540a6 = _0x519823['participants'] || [];
            const _0x55295f = _0x4540a6['find'](_0x499cc5 => _0x499cc5['lid'] === _0x146471 || _0x499cc5['id'] === _0x146471);
            if (_0x55295f) {
                const _0x142a8b = cleanJid(_0x55295f['id']);
                if (_0x142a8b === _0x137b13 || await isSudo(_0x55295f['id'])) {
                    return !![];
                }
            }
        } catch (_0x9d69ed) {
        }
    }
    return ![];
}
function isOwnerOnly(_0x3e371a) {
    const _0x562b26 = cleanJid(_0x0_0x278e77['ownerNumber']);
    const _0x447796 = cleanJid(_0x3e371a);
    return _0x447796 === _0x562b26;
}
async function getCleanName(_0xefc962, _0xa6240c) {
    if (!_0xefc962)
        return 'Unknown';
    const _0x577391 = cleanJid(_0xefc962);
    try {
        if (_0xa6240c) {
            const _0xa9e9db = await _0xa6240c['onWhatsApp'](_0xefc962);
            if (_0xa9e9db && _0xa9e9db[0x0] && _0xa9e9db[0x0]['exists']) {
                return _0x577391;
            }
        }
    } catch (_0x4d9483) {
    }
    return _0x577391;
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