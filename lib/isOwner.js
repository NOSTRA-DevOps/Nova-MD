import _0x0_0x573fad from '../config.js';
import { isSudo } from './index.js';
function cleanJid(_0x3155fd) {
    if (!_0x3155fd)
        return '';
    return _0x3155fd['split'](':')[0x0]['split']('@')[0x0];
}
async function isOwnerOrSudo(_0x153aaf, _0x234386 = null, _0x375b2e = null) {
    const _0x146418 = cleanJid(_0x0_0x573fad['ownerNumber']);
    const _0xa883d7 = cleanJid(_0x153aaf);
    if (_0xa883d7 === _0x146418) {
        return !![];
    }
    const _0x4a007d = await isSudo(_0x153aaf);
    if (_0x4a007d) {
        return !![];
    }
    if (_0x234386 && _0x375b2e && _0x375b2e['endsWith']('@g.us') && _0x153aaf['includes']('@lid')) {
        try {
            const _0x37cdad = await _0x234386['groupMetadata'](_0x375b2e);
            const _0x28e5bb = _0x37cdad['participants'] || [];
            const _0xadf3e5 = _0x28e5bb['find'](_0x1a4b0c => _0x1a4b0c['lid'] === _0x153aaf || _0x1a4b0c['id'] === _0x153aaf);
            if (_0xadf3e5) {
                const _0x3f9ed1 = cleanJid(_0xadf3e5['id']);
                if (_0x3f9ed1 === _0x146418 || await isSudo(_0xadf3e5['id'])) {
                    return !![];
                }
            }
        } catch (_0x177cd2) {
        }
    }
    return ![];
}
function isOwnerOnly(_0x36e646) {
    const _0x2f8e7e = cleanJid(_0x0_0x573fad['ownerNumber']);
    const _0x3fdabd = cleanJid(_0x36e646);
    return _0x3fdabd === _0x2f8e7e;
}
async function getCleanName(_0x330aaf, _0x2b743b) {
    if (!_0x330aaf)
        return 'Unknown';
    const _0x5b7485 = cleanJid(_0x330aaf);
    try {
        if (_0x2b743b) {
            const _0x9cf508 = await _0x2b743b['onWhatsApp'](_0x330aaf);
            if (_0x9cf508 && _0x9cf508[0x0] && _0x9cf508[0x0]['exists']) {
                return _0x5b7485;
            }
        }
    } catch (_0x5e1dab) {
    }
    return _0x5b7485;
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