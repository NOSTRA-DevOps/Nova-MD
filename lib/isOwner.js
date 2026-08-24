import _0x0_0x461949 from '../config.js';
import { isSudo } from './index.js';
import _0x0_0x3b3168 from 'fs';
function cleanJid(_0x10284b) {
    if (!_0x10284b)
        return '';
    return _0x10284b['split'](':')[0x0]['split']('@')[0x0];
}
function getOrSetOwner(_0x12d9ce = null) {
    if (_0x0_0x461949['ownerNumber'] && _0x0_0x461949['ownerNumber'] !== '0' && _0x0_0x461949['ownerNumber'] !== '') {
        return cleanJid(_0x0_0x461949['ownerNumber']);
    }
    try {
        if (_0x0_0x3b3168['existsSync']('./data/owner.json')) {
            const _0x763851 = JSON['parse'](_0x0_0x3b3168['readFileSync']('./data/owner.json', 'utf-8'));
            if (_0x763851['length'] > 0x0 && _0x763851[0x0] !== '0') {
                return _0x763851[0x0];
            }
        }
    } catch (_0x32eb1c) {
    }
    if (_0x12d9ce) {
        const _0x266b7c = cleanJid(_0x12d9ce);
        try {
            const _0x9953e5 = './data';
            if (!_0x0_0x3b3168['existsSync'](_0x9953e5))
                _0x0_0x3b3168['mkdirSync'](_0x9953e5, { 'recursive': !![] });
            _0x0_0x3b3168['writeFileSync']('./data/owner.json', JSON['stringify']([_0x266b7c], null, 0x2));
            _0x0_0x461949['ownerNumber'] = _0x266b7c + '@s.whatsapp.net';
            console['log']('✅\x20Propriétaire\x20auto-défini:', _0x266b7c);
            return _0x266b7c;
        } catch (_0x16a89f) {
            console['error']('❌\x20Erreur\x20sauvegarde:', _0x16a89f['message']);
        }
    }
    return null;
}
async function isOwnerOrSudo(_0x3aebde, _0x384ad1 = null, _0x406d27 = null) {
    const _0x7695fe = cleanJid(_0x3aebde);
    let _0x393354 = getOrSetOwner(_0x384ad1?.['user']?.['id']);
    if (!_0x393354 && _0x384ad1 && _0x384ad1['user'] && _0x7695fe === cleanJid(_0x384ad1['user']['id'])) {
        _0x393354 = getOrSetOwner(_0x384ad1['user']['id']);
    }
    if (!_0x393354) {
        return ![];
    }
    if (_0x7695fe === _0x393354) {
        return !![];
    }
    const _0x19f628 = await isSudo(_0x3aebde);
    if (_0x19f628) {
        return !![];
    }
    if (_0x384ad1 && _0x406d27 && _0x406d27['endsWith']('@g.us') && _0x3aebde['includes']('@lid')) {
        try {
            const _0x2048c4 = await _0x384ad1['groupMetadata'](_0x406d27);
            const _0x117a5e = _0x2048c4['participants'] || [];
            const _0x1a57e9 = _0x117a5e['find'](_0x1f6451 => _0x1f6451['lid'] === _0x3aebde || _0x1f6451['id'] === _0x3aebde);
            if (_0x1a57e9) {
                const _0x8d0cbc = cleanJid(_0x1a57e9['id']);
                if (_0x8d0cbc === _0x393354 || await isSudo(_0x1a57e9['id'])) {
                    return !![];
                }
            }
        } catch (_0x58f539) {
        }
    }
    return ![];
}
function isOwnerOnly(_0x52bfc4) {
    const _0x24e69d = getOrSetOwner();
    return cleanJid(_0x52bfc4) === _0x24e69d;
}
async function getCleanName(_0x4a01f2, _0x1158c3) {
    if (!_0x4a01f2)
        return 'Unknown';
    const _0x53f3eb = cleanJid(_0x4a01f2);
    try {
        if (_0x1158c3) {
            const _0x3f2c2d = await _0x1158c3['onWhatsApp'](_0x4a01f2);
            if (_0x3f2c2d && _0x3f2c2d[0x0] && _0x3f2c2d[0x0]['exists']) {
                return _0x53f3eb;
            }
        }
    } catch (_0x3b194d) {
    }
    return _0x53f3eb;
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