import _0x0_0x52162e from '../config.js';
import { isSudo } from './index.js';
import _0x0_0x3292b6 from 'fs-extra';
function cleanJid(_0x2ef9fb) {
    if (!_0x2ef9fb)
        return '';
    return _0x2ef9fb['split'](':')[0x0]['split']('@')[0x0];
}
function getEffectiveOwnerNumber() {
    if (_0x0_0x52162e['ownerNumber'] && _0x0_0x52162e['ownerNumber']['trim']() !== '') {
        return cleanJid(_0x0_0x52162e['ownerNumber']);
    }
    try {
        const _0x2b3f7 = './session/creds.json';
        if (_0x0_0x3292b6['existsSync'](_0x2b3f7)) {
            const _0x5d4c4a = JSON['parse'](_0x0_0x3292b6['readFileSync'](_0x2b3f7, 'utf-8'));
            if (_0x5d4c4a['me'] && _0x5d4c4a['me']['id']) {
                return cleanJid(_0x5d4c4a['me']['id']);
            }
        }
    } catch (_0x25e753) {
    }
    return '';
}
function getOwnerList() {
    try {
        const _0x8a91a4 = './data/owner.json';
        if (_0x0_0x3292b6['existsSync'](_0x8a91a4)) {
            const _0x1e41ca = JSON['parse'](_0x0_0x3292b6['readFileSync'](_0x8a91a4, 'utf-8'));
            return _0x1e41ca || [];
        }
    } catch (_0x10711a) {
    }
    return [];
}
async function isOwnerOrSudo(_0xe78836, _0x1025b9 = null, _0x584a07 = null) {
    const _0x5a49ca = getEffectiveOwnerNumber();
    const _0x29db23 = cleanJid(_0xe78836);
    if (_0x5a49ca && _0x29db23 === _0x5a49ca) {
        return !![];
    }
    const _0x45095f = getOwnerList();
    if (_0x45095f['includes'](_0x29db23)) {
        return !![];
    }
    const _0x55b422 = await isSudo(_0xe78836);
    if (_0x55b422) {
        return !![];
    }
    if (_0x1025b9 && _0x584a07 && _0x584a07['endsWith']('@g.us') && _0xe78836['includes']('@lid')) {
        try {
            const _0x5a488e = await _0x1025b9['groupMetadata'](_0x584a07);
            const _0x41c2f5 = _0x5a488e['participants'] || [];
            const _0xf9ddae = _0x41c2f5['find'](_0x2569cf => _0x2569cf['lid'] === _0xe78836 || _0x2569cf['id'] === _0xe78836);
            if (_0xf9ddae) {
                const _0x1f8aa2 = cleanJid(_0xf9ddae['id']);
                if (_0x45095f['includes'](_0x1f8aa2) || _0x1f8aa2 === _0x5a49ca || await isSudo(_0xf9ddae['id'])) {
                    return !![];
                }
            }
        } catch (_0x3e6048) {
        }
    }
    return ![];
}
function isOwnerOnly(_0x5ded6b) {
    const _0x143500 = getEffectiveOwnerNumber();
    const _0x48c6d7 = cleanJid(_0x5ded6b);
    if (_0x143500 && _0x48c6d7 === _0x143500) {
        return !![];
    }
    const _0x2c5246 = getOwnerList();
    return _0x2c5246['includes'](_0x48c6d7);
}
async function getCleanName(_0x5d3b57, _0x53164b) {
    if (!_0x5d3b57)
        return 'Unknown';
    const _0x462b4e = cleanJid(_0x5d3b57);
    try {
        if (_0x53164b) {
            const _0x47224d = await _0x53164b['onWhatsApp'](_0x5d3b57);
            if (_0x47224d && _0x47224d[0x0] && _0x47224d[0x0]['exists']) {
                return _0x462b4e;
            }
        }
    } catch (_0xf6425d) {
    }
    return _0x462b4e;
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