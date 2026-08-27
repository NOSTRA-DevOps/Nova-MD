import _0x0_0x73456d from '../config.js';
import { isSudo } from './index.js';
import _0x0_0x48af43 from 'fs-extra';
function cleanJid(_0x4685f0) {
    if (!_0x4685f0)
        return '';
    return _0x4685f0['split'](':')[0x0]['split']('@')[0x0];
}
function getEffectiveOwnerNumber() {
    if (_0x0_0x73456d['ownerNumber'] && _0x0_0x73456d['ownerNumber']['trim']() !== '') {
        return cleanJid(_0x0_0x73456d['ownerNumber']);
    }
    try {
        const _0x11ff72 = './session/creds.json';
        if (_0x0_0x48af43['existsSync'](_0x11ff72)) {
            const _0x213967 = JSON['parse'](_0x0_0x48af43['readFileSync'](_0x11ff72, 'utf-8'));
            if (_0x213967['me'] && _0x213967['me']['id']) {
                return cleanJid(_0x213967['me']['id']);
            }
        }
    } catch (_0x50502a) {
    }
    return '';
}
function getOwnerList() {
    try {
        const _0x31bbb6 = './data/owner.json';
        if (_0x0_0x48af43['existsSync'](_0x31bbb6)) {
            const _0x4c1672 = JSON['parse'](_0x0_0x48af43['readFileSync'](_0x31bbb6, 'utf-8'));
            return _0x4c1672 || [];
        }
    } catch (_0x1e472e) {
    }
    return [];
}
async function isOwnerOrSudo(_0x415047, _0x19fb72 = null, _0x56ae4c = null) {
    const _0x2e7219 = getEffectiveOwnerNumber();
    const _0x3ef494 = cleanJid(_0x415047);
    if (_0x2e7219 && _0x3ef494 === _0x2e7219) {
        return !![];
    }
    const _0x3185e2 = getOwnerList();
    if (_0x3185e2['includes'](_0x3ef494)) {
        return !![];
    }
    const _0xaf297d = await isSudo(_0x415047);
    if (_0xaf297d) {
        return !![];
    }
    if (_0x19fb72 && _0x56ae4c && _0x56ae4c['endsWith']('@g.us') && _0x415047['includes']('@lid')) {
        try {
            const _0x4498a6 = await _0x19fb72['groupMetadata'](_0x56ae4c);
            const _0x5040d4 = _0x4498a6['participants'] || [];
            const _0x4141e5 = _0x5040d4['find'](_0xa4cb2b => _0xa4cb2b['lid'] === _0x415047 || _0xa4cb2b['id'] === _0x415047);
            if (_0x4141e5) {
                const _0x82b864 = cleanJid(_0x4141e5['id']);
                if (_0x3185e2['includes'](_0x82b864) || _0x82b864 === _0x2e7219 || await isSudo(_0x4141e5['id'])) {
                    return !![];
                }
            }
        } catch (_0x30d4b9) {
        }
    }
    return ![];
}
function isOwnerOnly(_0x246f8e) {
    const _0xb5302f = getEffectiveOwnerNumber();
    const _0x294c44 = cleanJid(_0x246f8e);
    if (_0xb5302f && _0x294c44 === _0xb5302f) {
        return !![];
    }
    const _0x58414c = getOwnerList();
    return _0x58414c['includes'](_0x294c44);
}
async function getCleanName(_0x4276b0, _0x3ab67a) {
    if (!_0x4276b0)
        return 'Unknown';
    const _0x47fef1 = cleanJid(_0x4276b0);
    try {
        if (_0x3ab67a) {
            const _0x58f4dd = await _0x3ab67a['onWhatsApp'](_0x4276b0);
            if (_0x58f4dd && _0x58f4dd[0x0] && _0x58f4dd[0x0]['exists']) {
                return _0x47fef1;
            }
        }
    } catch (_0x5f2989) {
    }
    return _0x47fef1;
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