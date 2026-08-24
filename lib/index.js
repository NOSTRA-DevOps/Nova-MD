import { fileURLToPath } from 'url';
import _0x0_0x5a8ba1, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x219f2f from 'fs';
import { dataFile } from './paths.js';
import _0x0_0x4d653e from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const dataPath = dataFile('userGroupData.json');
async function loadUserGroupData() {
    try {
        if (HAS_DB) {
            const _0x5b4ba4 = await _0x0_0x4d653e['getSetting']('global', 'userGroupData');
            return _0x5b4ba4 || {
                'antibadword': {},
                'antilink': {},
                'welcome': {},
                'goodbye': {},
                'chatbot': {},
                'warnings': {},
                'sudo': [],
                'antitag': {}
            };
        } else {
            if (!_0x0_0x219f2f['existsSync'](dataPath)) {
                const _0x1d6b99 = {
                    'antibadword': {},
                    'antilink': {},
                    'welcome': {},
                    'goodbye': {},
                    'chatbot': {},
                    'warnings': {},
                    'sudo': [],
                    'antitag': {}
                };
                _0x0_0x219f2f['writeFileSync'](dataPath, JSON['stringify'](_0x1d6b99, null, 0x2));
                return _0x1d6b99;
            }
            const _0x511089 = JSON['parse'](_0x0_0x219f2f['readFileSync'](dataPath, 'utf8'));
            return _0x511089;
        }
    } catch (_0xe3ec42) {
        console['error']('Error\x20loading\x20user\x20group\x20data:', _0xe3ec42);
        return {
            'antibadword': {},
            'antilink': {},
            'welcome': {},
            'goodbye': {},
            'chatbot': {},
            'warnings': {},
            'sudo': [],
            'antitag': {}
        };
    }
}
async function saveUserGroupData(_0x1672ea) {
    try {
        if (HAS_DB) {
            await _0x0_0x4d653e['saveSetting']('global', 'userGroupData', _0x1672ea);
        } else {
            const _0x51d7bb = _0x0_0x5a8ba1['dirname'](dataPath);
            if (!_0x0_0x219f2f['existsSync'](_0x51d7bb)) {
                _0x0_0x219f2f['mkdirSync'](_0x51d7bb, { 'recursive': !![] });
            }
            _0x0_0x219f2f['writeFileSync'](dataPath, JSON['stringify'](_0x1672ea, null, 0x2));
        }
        return !![];
    } catch (_0x16e6a8) {
        console['error']('Error\x20saving\x20user\x20group\x20data:', _0x16e6a8);
        return ![];
    }
}
async function setAntilink(_0x493f6f, _0x21e588, _0x2fe9e2) {
    try {
        const _0x5a9123 = await loadUserGroupData();
        if (!_0x5a9123['antilink'])
            _0x5a9123['antilink'] = {};
        if (!_0x5a9123['antilink'][_0x493f6f])
            _0x5a9123['antilink'][_0x493f6f] = {};
        _0x5a9123['antilink'][_0x493f6f] = {
            'enabled': _0x21e588 === 'on',
            'action': _0x2fe9e2 || 'delete'
        };
        await saveUserGroupData(_0x5a9123);
        return !![];
    } catch (_0x1d24a9) {
        console['error']('Error\x20setting\x20antilink:', _0x1d24a9);
        return ![];
    }
}
async function getAntilink(_0x389f1a, _0x41f676) {
    try {
        const _0x1773ca = await loadUserGroupData();
        if (!_0x1773ca['antilink'] || !_0x1773ca['antilink'][_0x389f1a])
            return null;
        return _0x41f676 === 'on' ? _0x1773ca['antilink'][_0x389f1a] : null;
    } catch (_0x200610) {
        console['error']('Error\x20getting\x20antilink:', _0x200610);
        return null;
    }
}
async function removeAntilink(_0x4837e0, _0x1d6370) {
    try {
        const _0x3cd1fe = await loadUserGroupData();
        if (_0x3cd1fe['antilink'] && _0x3cd1fe['antilink'][_0x4837e0]) {
            delete _0x3cd1fe['antilink'][_0x4837e0];
            await saveUserGroupData(_0x3cd1fe);
        }
        return !![];
    } catch (_0x5cef0a) {
        console['error']('Error\x20removing\x20antilink:', _0x5cef0a);
        return ![];
    }
}
async function setAntitag(_0x487685, _0x2fa7eb, _0x313577) {
    try {
        const _0x4ebd94 = await loadUserGroupData();
        if (!_0x4ebd94['antitag'])
            _0x4ebd94['antitag'] = {};
        if (!_0x4ebd94['antitag'][_0x487685])
            _0x4ebd94['antitag'][_0x487685] = {};
        _0x4ebd94['antitag'][_0x487685] = {
            'enabled': _0x2fa7eb === 'on',
            'action': _0x313577 || 'delete'
        };
        await saveUserGroupData(_0x4ebd94);
        return !![];
    } catch (_0x50501c) {
        console['error']('Error\x20setting\x20antitag:', _0x50501c);
        return ![];
    }
}
async function getAntitag(_0x3bdfcc, _0x174de1) {
    try {
        const _0xa6876d = await loadUserGroupData();
        if (!_0xa6876d['antitag'] || !_0xa6876d['antitag'][_0x3bdfcc])
            return null;
        return _0x174de1 === 'on' ? _0xa6876d['antitag'][_0x3bdfcc] : null;
    } catch (_0x5b4be1) {
        console['error']('Error\x20getting\x20antitag:', _0x5b4be1);
        return null;
    }
}
async function removeAntitag(_0x582c12, _0x365817) {
    try {
        const _0x42b3ca = await loadUserGroupData();
        if (_0x42b3ca['antitag'] && _0x42b3ca['antitag'][_0x582c12]) {
            delete _0x42b3ca['antitag'][_0x582c12];
            await saveUserGroupData(_0x42b3ca);
        }
        return !![];
    } catch (_0x4a1498) {
        console['error']('Error\x20removing\x20antitag:', _0x4a1498);
        return ![];
    }
}
async function incrementWarningCount(_0x4ec1fb, _0x31a816) {
    try {
        const _0x35bdd8 = await loadUserGroupData();
        if (!_0x35bdd8['warnings'])
            _0x35bdd8['warnings'] = {};
        if (!_0x35bdd8['warnings'][_0x4ec1fb])
            _0x35bdd8['warnings'][_0x4ec1fb] = {};
        if (!_0x35bdd8['warnings'][_0x4ec1fb][_0x31a816])
            _0x35bdd8['warnings'][_0x4ec1fb][_0x31a816] = 0x0;
        _0x35bdd8['warnings'][_0x4ec1fb][_0x31a816]++;
        await saveUserGroupData(_0x35bdd8);
        return _0x35bdd8['warnings'][_0x4ec1fb][_0x31a816];
    } catch (_0x52c561) {
        console['error']('Error\x20incrementing\x20warning\x20count:', _0x52c561);
        return 0x0;
    }
}
async function resetWarningCount(_0x4fc9ba, _0x526aa1) {
    try {
        const _0x3b8f89 = await loadUserGroupData();
        if (_0x3b8f89['warnings'] && _0x3b8f89['warnings'][_0x4fc9ba] && _0x3b8f89['warnings'][_0x4fc9ba][_0x526aa1]) {
            _0x3b8f89['warnings'][_0x4fc9ba][_0x526aa1] = 0x0;
            await saveUserGroupData(_0x3b8f89);
        }
        return !![];
    } catch (_0x514fe8) {
        console['error']('Error\x20resetting\x20warning\x20count:', _0x514fe8);
        return ![];
    }
}
async function isSudo(_0x434483) {
    try {
        const _0x186bd9 = await loadUserGroupData();
        return _0x186bd9['sudo'] && _0x186bd9['sudo']['includes'](_0x434483);
    } catch (_0x58461e) {
        console['error']('Error\x20checking\x20sudo:', _0x58461e);
        return ![];
    }
}
async function addSudo(_0x9c4f58) {
    try {
        const _0x191992 = await loadUserGroupData();
        if (!_0x191992['sudo'])
            _0x191992['sudo'] = [];
        if (!_0x191992['sudo']['includes'](_0x9c4f58)) {
            _0x191992['sudo']['push'](_0x9c4f58);
            await saveUserGroupData(_0x191992);
        }
        return !![];
    } catch (_0x545307) {
        console['error']('Error\x20adding\x20sudo:', _0x545307);
        return ![];
    }
}
async function removeSudo(_0x2af1cd) {
    try {
        const _0x4493cf = await loadUserGroupData();
        if (!_0x4493cf['sudo'])
            _0x4493cf['sudo'] = [];
        const _0x174f66 = _0x4493cf['sudo']['indexOf'](_0x2af1cd);
        if (_0x174f66 !== -0x1) {
            _0x4493cf['sudo']['splice'](_0x174f66, 0x1);
            await saveUserGroupData(_0x4493cf);
        }
        return !![];
    } catch (_0x1f828c) {
        console['error']('Error\x20removing\x20sudo:', _0x1f828c);
        return ![];
    }
}
async function getSudoList() {
    try {
        const _0x8bdd86 = await loadUserGroupData();
        return Array['isArray'](_0x8bdd86['sudo']) ? _0x8bdd86['sudo'] : [];
    } catch (_0x283a4a) {
        console['error']('Error\x20getting\x20sudo\x20list:', _0x283a4a);
        return [];
    }
}
async function addWelcome(_0x343a9c, _0x1d2b18, _0x1d84cd) {
    try {
        const _0x246733 = await loadUserGroupData();
        if (!_0x246733['welcome'])
            _0x246733['welcome'] = {};
        _0x246733['welcome'][_0x343a9c] = {
            'enabled': _0x1d2b18,
            'message': _0x1d84cd || '╔═⚔️\x20WELCOME\x20⚔️═╗\x0a║\x20🛡️\x20User:\x20{user}\x0a║\x20🏰\x20Kingdom:\x20{group}\x0a╠═══════════════╣\x0a║\x20📜\x20Message:\x0a║\x20{description}\x0a╚═══════════════╝',
            'channelId': '120363429019355682@newsletter'
        };
        await saveUserGroupData(_0x246733);
        return !![];
    } catch (_0x5df569) {
        console['error']('Error\x20in\x20addWelcome:', _0x5df569);
        return ![];
    }
}
async function delWelcome(_0x30a8bc) {
    try {
        const _0x27d22c = await loadUserGroupData();
        if (_0x27d22c['welcome'] && _0x27d22c['welcome'][_0x30a8bc]) {
            delete _0x27d22c['welcome'][_0x30a8bc];
            await saveUserGroupData(_0x27d22c);
        }
        return !![];
    } catch (_0x31a141) {
        console['error']('Error\x20in\x20delWelcome:', _0x31a141);
        return ![];
    }
}
async function isWelcomeOn(_0x218e68) {
    try {
        const _0x3b9778 = await loadUserGroupData();
        return _0x3b9778['welcome'] && _0x3b9778['welcome'][_0x218e68] && _0x3b9778['welcome'][_0x218e68]['enabled'];
    } catch (_0x2db637) {
        console['error']('Error\x20in\x20isWelcomeOn:', _0x2db637);
        return ![];
    }
}
async function addGoodbye(_0x2a98aa, _0x276b94, _0x4c339f) {
    try {
        const _0x2ef923 = await loadUserGroupData();
        if (!_0x2ef923['goodbye'])
            _0x2ef923['goodbye'] = {};
        _0x2ef923['goodbye'][_0x2a98aa] = {
            'enabled': _0x276b94,
            'message': _0x4c339f || '╔═⚔️\x20GOODBYE\x20⚔️═╗\x0a║\x20🛡️\x20User:\x20{user}\x0a║\x20🏰\x20Kingdom:\x20{group}\x0a╠═══════════════╣\x0a║\x20⚰️\x20We\x20will\x20never\x20miss\x20you!\x0a╚═══════════════╝',
            'channelId': '120363429019355682@newsletter'
        };
        await saveUserGroupData(_0x2ef923);
        return !![];
    } catch (_0x4de291) {
        console['error']('Error\x20in\x20addGoodbye:', _0x4de291);
        return ![];
    }
}
async function delGoodBye(_0x108dca) {
    try {
        const _0x300395 = await loadUserGroupData();
        if (_0x300395['goodbye'] && _0x300395['goodbye'][_0x108dca]) {
            delete _0x300395['goodbye'][_0x108dca];
            await saveUserGroupData(_0x300395);
        }
        return !![];
    } catch (_0x429a40) {
        console['error']('Error\x20in\x20delGoodBye:', _0x429a40);
        return ![];
    }
}
async function isGoodByeOn(_0x4640ea) {
    try {
        const _0x3fde18 = await loadUserGroupData();
        return _0x3fde18['goodbye'] && _0x3fde18['goodbye'][_0x4640ea] && _0x3fde18['goodbye'][_0x4640ea]['enabled'];
    } catch (_0x162e2b) {
        console['error']('Error\x20in\x20isGoodByeOn:', _0x162e2b);
        return ![];
    }
}
async function getWelcome(_0x3b8a8d) {
    try {
        const _0x4a5ebd = await loadUserGroupData();
        return _0x4a5ebd['welcome'] && _0x4a5ebd['welcome'][_0x3b8a8d] ? _0x4a5ebd['welcome'][_0x3b8a8d]['message'] : null;
    } catch (_0x3b2883) {
        console['error']('Error\x20in\x20getWelcome:', _0x3b2883);
        return null;
    }
}
async function getGoodbye(_0x4d634f) {
    try {
        const _0x381830 = await loadUserGroupData();
        return _0x381830['goodbye'] && _0x381830['goodbye'][_0x4d634f] ? _0x381830['goodbye'][_0x4d634f]['message'] : null;
    } catch (_0x1cc355) {
        console['error']('Error\x20in\x20getGoodbye:', _0x1cc355);
        return null;
    }
}
async function setAntiBadword(_0x918aa1, _0x3bf0a7, _0xbd188a) {
    try {
        const _0x50de19 = await loadUserGroupData();
        if (!_0x50de19['antibadword'])
            _0x50de19['antibadword'] = {};
        if (!_0x50de19['antibadword'][_0x918aa1])
            _0x50de19['antibadword'][_0x918aa1] = {};
        _0x50de19['antibadword'][_0x918aa1] = {
            'enabled': _0x3bf0a7 === 'on',
            'action': _0xbd188a || 'delete'
        };
        await saveUserGroupData(_0x50de19);
        return !![];
    } catch (_0x26e54d) {
        console['error']('Error\x20setting\x20antibadword:', _0x26e54d);
        return ![];
    }
}
async function getAntiBadword(_0x23e701, _0x473292) {
    try {
        const _0x4b933c = await loadUserGroupData();
        if (!_0x4b933c['antibadword'] || !_0x4b933c['antibadword'][_0x23e701]) {
            return null;
        }
        const _0x4c165a = _0x4b933c['antibadword'][_0x23e701];
        return _0x473292 === 'on' ? _0x4c165a : null;
    } catch (_0x4ced1d) {
        console['error']('Error\x20getting\x20antibadword:', _0x4ced1d);
        return null;
    }
}
async function removeAntiBadword(_0x378401, _0x1296df) {
    try {
        const _0x259f09 = await loadUserGroupData();
        if (_0x259f09['antibadword'] && _0x259f09['antibadword'][_0x378401]) {
            delete _0x259f09['antibadword'][_0x378401];
            await saveUserGroupData(_0x259f09);
        }
        return !![];
    } catch (_0x87ad2) {
        console['error']('Error\x20removing\x20antibadword:', _0x87ad2);
        return ![];
    }
}
async function setChatbot(_0x1f1c4b, _0x373a2e) {
    try {
        const _0x9d3ffb = await loadUserGroupData();
        if (!_0x9d3ffb['chatbot'])
            _0x9d3ffb['chatbot'] = {};
        _0x9d3ffb['chatbot'][_0x1f1c4b] = { 'enabled': _0x373a2e };
        await saveUserGroupData(_0x9d3ffb);
        return !![];
    } catch (_0x3deeea) {
        console['error']('Error\x20setting\x20chatbot:', _0x3deeea);
        return ![];
    }
}
async function getChatbot(_0x244c18) {
    try {
        const _0x1dc35 = await loadUserGroupData();
        return _0x1dc35['chatbot']?.[_0x244c18] || null;
    } catch (_0xd547a7) {
        console['error']('Error\x20getting\x20chatbot:', _0xd547a7);
        return null;
    }
}
async function removeChatbot(_0x113dcb) {
    try {
        const _0x402b2d = await loadUserGroupData();
        if (_0x402b2d['chatbot'] && _0x402b2d['chatbot'][_0x113dcb]) {
            delete _0x402b2d['chatbot'][_0x113dcb];
            await saveUserGroupData(_0x402b2d);
        }
        return !![];
    } catch (_0x5660ac) {
        console['error']('Error\x20removing\x20chatbot:', _0x5660ac);
        return ![];
    }
}
export {
    setAntilink,
    getAntilink,
    removeAntilink,
    setAntitag,
    getAntitag,
    removeAntitag,
    incrementWarningCount,
    resetWarningCount,
    isSudo,
    addSudo,
    removeSudo,
    getSudoList,
    addWelcome,
    delWelcome,
    isWelcomeOn,
    getWelcome,
    addGoodbye,
    delGoodBye,
    isGoodByeOn,
    getGoodbye,
    setAntiBadword,
    getAntiBadword,
    removeAntiBadword,
    setChatbot,
    getChatbot,
    removeChatbot,
    loadUserGroupData,
    saveUserGroupData
};