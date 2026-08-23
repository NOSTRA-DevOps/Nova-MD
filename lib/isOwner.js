import _0x0_0x570499 from '../config.js';
import { isSudo } from './index.js';
function cleanJid(_0x1232fd) {
    if (!_0x1232fd)
        return '';
    return _0x1232fd['split'](':')[0x0]['split']('@')[0x0];
}
async function isOwnerOrSudo(_0x1b5031, _0x4e5025 = null, _0x3c32d8 = null) {
    const _0x21f87f = cleanJid(_0x0_0x570499['ownerNumber']);
    const _0x3cebf1 = cleanJid(_0x1b5031);
    if (_0x3cebf1 === _0x21f87f) {
        return !![];
    }
    const _0xca7af8 = await isSudo(_0x1b5031);
    if (_0xca7af8) {
        return !![];
    }
    if (_0x4e5025 && _0x3c32d8 && _0x3c32d8['endsWith']('@g.us') && _0x1b5031['includes']('@lid')) {
        try {
            const _0x4a157f = await _0x4e5025['groupMetadata'](_0x3c32d8);
            const _0x4208a1 = _0x4a157f['participants'] || [];
            const _0x6a6dac = _0x4208a1['find'](_0x1468c8 => _0x1468c8['lid'] === _0x1b5031 || _0x1468c8['id'] === _0x1b5031);
            if (_0x6a6dac) {
                const _0x3e6209 = cleanJid(_0x6a6dac['id']);
                if (_0x3e6209 === _0x21f87f || await isSudo(_0x6a6dac['id'])) {
                    return !![];
                }
            }
        } catch (_0x368083) {
        }
    }
    return ![];
}
function isOwnerOnly(_0x4d6ab0) {
    const _0x16c94b = cleanJid(_0x0_0x570499['ownerNumber']);
    const _0x3789f9 = cleanJid(_0x4d6ab0);
    return _0x3789f9 === _0x16c94b;
}
async function getCleanName(_0x14e776, _0x4ed323) {
    if (!_0x14e776)
        return 'Unknown';
    const _0xd7c9f1 = cleanJid(_0x14e776);
    try {
        if (_0x4ed323) {
            const _0x29a673 = await _0x4ed323['onWhatsApp'](_0x14e776);
            if (_0x29a673 && _0x29a673[0x0] && _0x29a673[0x0]['exists']) {
                return _0xd7c9f1;
            }
        }
    } catch (_0x4602d7) {
    }
    return _0xd7c9f1;
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