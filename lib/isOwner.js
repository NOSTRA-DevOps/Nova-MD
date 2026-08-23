import _0x0_0x3b9f4c from '../config.js';
import { isSudo } from './index.js';
function cleanJid(_0x4f8c80) {
    if (!_0x4f8c80)
        return '';
    return _0x4f8c80['split'](':')[0x0]['split']('@')[0x0];
}
async function isOwnerOrSudo(_0x752529, _0x285a62 = null, _0x1d8248 = null) {
    const _0x325ce5 = cleanJid(_0x0_0x3b9f4c['ownerNumber']);
    const _0x22408e = cleanJid(_0x752529);
    if (_0x22408e === _0x325ce5) {
        return !![];
    }
    const _0xef8023 = await isSudo(_0x752529);
    if (_0xef8023) {
        return !![];
    }
    if (_0x285a62 && _0x1d8248 && _0x1d8248['endsWith']('@g.us') && _0x752529['includes']('@lid')) {
        try {
            const _0x5c6ebc = await _0x285a62['groupMetadata'](_0x1d8248);
            const _0x2c1414 = _0x5c6ebc['participants'] || [];
            const _0x2970a4 = _0x2c1414['find'](_0x35fda0 => _0x35fda0['lid'] === _0x752529 || _0x35fda0['id'] === _0x752529);
            if (_0x2970a4) {
                const _0x1a3988 = cleanJid(_0x2970a4['id']);
                if (_0x1a3988 === _0x325ce5 || await isSudo(_0x2970a4['id'])) {
                    return !![];
                }
            }
        } catch (_0x4cd9c3) {
        }
    }
    return ![];
}
function isOwnerOnly(_0xe1fa2b) {
    const _0x45cd6a = cleanJid(_0x0_0x3b9f4c['ownerNumber']);
    const _0x300af8 = cleanJid(_0xe1fa2b);
    return _0x300af8 === _0x45cd6a;
}
async function getCleanName(_0x2e9842, _0x5e94f3) {
    if (!_0x2e9842)
        return 'Unknown';
    const _0x31d705 = cleanJid(_0x2e9842);
    try {
        if (_0x5e94f3) {
            const _0x1d7540 = await _0x5e94f3['onWhatsApp'](_0x2e9842);
            if (_0x1d7540 && _0x1d7540[0x0] && _0x1d7540[0x0]['exists']) {
                return _0x31d705;
            }
        }
    } catch (_0x42f251) {
    }
    return _0x31d705;
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