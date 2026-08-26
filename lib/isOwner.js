import _0x0_0x28315e from '../config.js';
import { isSudo } from './index.js';
import _0x0_0x2eae98 from 'fs-extra';
function cleanJid(_0x477298) {
    if (!_0x477298)
        return '';
    return _0x477298['split'](':')[0x0]['split']('@')[0x0];
}
function getEffectiveOwnerNumber() {
    if (_0x0_0x28315e['ownerNumber'] && _0x0_0x28315e['ownerNumber']['trim']() !== '') {
        return cleanJid(_0x0_0x28315e['ownerNumber']);
    }
    try {
        const _0x498534 = './session/creds.json';
        if (_0x0_0x2eae98['existsSync'](_0x498534)) {
            const _0x441083 = JSON['parse'](_0x0_0x2eae98['readFileSync'](_0x498534, 'utf-8'));
            if (_0x441083['me'] && _0x441083['me']['id']) {
                return cleanJid(_0x441083['me']['id']);
            }
        }
    } catch (_0x3e90e6) {
    }
    return '';
}
function getOwnerList() {
    try {
        const _0x174df2 = './data/owner.json';
        if (_0x0_0x2eae98['existsSync'](_0x174df2)) {
            const _0xebc15b = JSON['parse'](_0x0_0x2eae98['readFileSync'](_0x174df2, 'utf-8'));
            return _0xebc15b || [];
        }
    } catch (_0x29f16f) {
    }
    return [];
}
async function isOwnerOrSudo(_0x41decf, _0x918702 = null, _0x1ac0ff = null) {
    const _0x2aa039 = getEffectiveOwnerNumber();
    const _0x514d65 = cleanJid(_0x41decf);
    if (_0x2aa039 && _0x514d65 === _0x2aa039) {
        return !![];
    }
    const _0x4de36f = getOwnerList();
    if (_0x4de36f['includes'](_0x514d65)) {
        return !![];
    }
    const _0x5662f9 = await isSudo(_0x41decf);
    if (_0x5662f9) {
        return !![];
    }
    if (_0x918702 && _0x1ac0ff && _0x1ac0ff['endsWith']('@g.us') && _0x41decf['includes']('@lid')) {
        try {
            const _0xad68d3 = await _0x918702['groupMetadata'](_0x1ac0ff);
            const _0x40c506 = _0xad68d3['participants'] || [];
            const _0x51277c = _0x40c506['find'](_0x3ebdef => _0x3ebdef['lid'] === _0x41decf || _0x3ebdef['id'] === _0x41decf);
            if (_0x51277c) {
                const _0x50ac80 = cleanJid(_0x51277c['id']);
                if (_0x4de36f['includes'](_0x50ac80) || _0x50ac80 === _0x2aa039 || await isSudo(_0x51277c['id'])) {
                    return !![];
                }
            }
        } catch (_0x565f82) {
        }
    }
    return ![];
}
function isOwnerOnly(_0x5509ae) {
    const _0x5270b6 = getEffectiveOwnerNumber();
    const _0x50aa5e = cleanJid(_0x5509ae);
    if (_0x5270b6 && _0x50aa5e === _0x5270b6) {
        return !![];
    }
    const _0x265448 = getOwnerList();
    return _0x265448['includes'](_0x50aa5e);
}
async function getCleanName(_0xc2017, _0x30d5a2) {
    if (!_0xc2017)
        return 'Unknown';
    const _0x476085 = cleanJid(_0xc2017);
    try {
        if (_0x30d5a2) {
            const _0x4ba595 = await _0x30d5a2['onWhatsApp'](_0xc2017);
            if (_0x4ba595 && _0x4ba595[0x0] && _0x4ba595[0x0]['exists']) {
                return _0x476085;
            }
        }
    } catch (_0x92686c) {
    }
    return _0x476085;
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
export {
    getOwnerList
};