import _0x0_0x5d54b1 from '../config.js';
import { isSudo } from './index.js';
import _0x0_0x25c18d from 'fs-extra';
function cleanJid(_0x596a7d) {
    if (!_0x596a7d)
        return '';
    const _0x147b1b = _0x596a7d['split'](':')[0x0]['split']('@')[0x0];
    if (_0x147b1b && /^\d+$/['test'](_0x147b1b)) {
        return _0x147b1b;
    }
    return '';
}
function getEffectiveOwnerNumber() {
    if (_0x0_0x5d54b1['ownerNumber'] && _0x0_0x5d54b1['ownerNumber']['trim']() !== '') {
        return cleanJid(_0x0_0x5d54b1['ownerNumber']);
    }
    try {
        const _0x4bdd54 = './data/config.json';
        if (_0x0_0x25c18d['existsSync'](_0x4bdd54)) {
            const _0x3d6ff5 = JSON['parse'](_0x0_0x25c18d['readFileSync'](_0x4bdd54, 'utf-8'));
            if (_0x3d6ff5['ownerNumber'] && _0x3d6ff5['ownerNumber']['trim']() !== '') {
                return cleanJid(_0x3d6ff5['ownerNumber']);
            }
        }
    } catch (_0x2a40fe) {
    }
    try {
        const _0x14516e = './data/owner.json';
        if (_0x0_0x25c18d['existsSync'](_0x14516e)) {
            const _0x4ca85c = JSON['parse'](_0x0_0x25c18d['readFileSync'](_0x14516e, 'utf-8'));
            if (_0x4ca85c['length'] > 0x0) {
                return cleanJid(_0x4ca85c[0x0]);
            }
        }
    } catch (_0x2bb6cc) {
    }
    try {
        const _0x27b705 = './session/creds.json';
        if (_0x0_0x25c18d['existsSync'](_0x27b705)) {
            const _0x148326 = JSON['parse'](_0x0_0x25c18d['readFileSync'](_0x27b705, 'utf-8'));
            let _0x5030a3 = null;
            if (_0x148326['me']) {
                if (typeof _0x148326['me'] === 'string') {
                    _0x5030a3 = _0x148326['me'];
                } else if (_0x148326['me']['id']) {
                    _0x5030a3 = _0x148326['me']['id'];
                } else if (_0x148326['me']['user']) {
                    _0x5030a3 = _0x148326['me']['user'];
                } else if (_0x148326['me']['jid']) {
                    _0x5030a3 = _0x148326['me']['jid'];
                }
            }
            if (!_0x5030a3 && _0x148326['account']) {
                if (_0x148326['account']['jid'])
                    _0x5030a3 = _0x148326['account']['jid'];
                else if (_0x148326['account']['id'])
                    _0x5030a3 = _0x148326['account']['id'];
            }
            if (_0x5030a3) {
                const _0x23a930 = cleanJid(_0x5030a3);
                if (_0x23a930) {
                    return _0x23a930;
                }
            }
        }
    } catch (_0x9541f) {
    }
    return '';
}
function getOwnerList() {
    try {
        const _0x408454 = './data/owner.json';
        if (_0x0_0x25c18d['existsSync'](_0x408454)) {
            const _0xb83466 = JSON['parse'](_0x0_0x25c18d['readFileSync'](_0x408454, 'utf-8'));
            return _0xb83466 || [];
        }
    } catch (_0x4a61f9) {
    }
    return [];
}
async function isOwnerOrSudo(_0x2518db, _0x55acbe = null, _0xeafebf = null) {
    const _0x34a08b = getEffectiveOwnerNumber();
    const _0x576b3c = cleanJid(_0x2518db);
    if (_0x34a08b && _0x576b3c === _0x34a08b) {
        return !![];
    }
    const _0x2ede47 = getOwnerList();
    if (_0x2ede47['includes'](_0x576b3c)) {
        return !![];
    }
    try {
        const _0x5528a2 = await isSudo(_0x2518db);
        if (_0x5528a2) {
            return !![];
        }
    } catch (_0x501f9f) {
    }
    if (_0x55acbe && _0xeafebf && _0xeafebf['endsWith']('@g.us') && _0x2518db['includes']('@lid')) {
        try {
            const _0x1ef45e = await _0x55acbe['groupMetadata'](_0xeafebf);
            const _0x5ee72d = _0x1ef45e['participants'] || [];
            const _0x14ff4b = _0x5ee72d['find'](_0x571889 => _0x571889['lid'] === _0x2518db || _0x571889['id'] === _0x2518db);
            if (_0x14ff4b) {
                const _0x43f42e = cleanJid(_0x14ff4b['id']);
                if (_0x2ede47['includes'](_0x43f42e) || _0x43f42e === _0x34a08b || await isSudo(_0x14ff4b['id'])) {
                    return !![];
                }
            }
        } catch (_0x1680a3) {
        }
    }
    return ![];
}
function isOwnerOnly(_0x4c2e8f) {
    const _0x5b195b = getEffectiveOwnerNumber();
    const _0x433622 = cleanJid(_0x4c2e8f);
    if (_0x5b195b && _0x433622 === _0x5b195b) {
        return !![];
    }
    const _0x3d1950 = getOwnerList();
    return _0x3d1950['includes'](_0x433622);
}
async function getCleanName(_0x1a356f, _0x55b237) {
    if (!_0x1a356f)
        return 'Unknown';
    const _0x1b574e = cleanJid(_0x1a356f);
    try {
        if (_0x55b237) {
            const _0x55116f = await _0x55b237['onWhatsApp'](_0x1a356f);
            if (_0x55116f && _0x55116f[0x0] && _0x55116f[0x0]['exists']) {
                return _0x1b574e;
            }
        }
    } catch (_0x5ac9ed) {
    }
    return _0x1b574e;
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