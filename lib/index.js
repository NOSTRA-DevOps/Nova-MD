import { fileURLToPath } from 'url';
import _0x0_0x5c7a1c, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x5117e1 from 'fs';
import { dataFile } from './paths.js';
import _0x0_0xb522bf from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const dataPath = dataFile('userGroupData.json');
async function loadUserGroupData() {
    try {
        if (HAS_DB) {
            const _0x4009fc = await _0x0_0xb522bf['getSetting']('global', 'userGroupData');
            return _0x4009fc || {
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
            if (!_0x0_0x5117e1['existsSync'](dataPath)) {
                const _0x275503 = {
                    'antibadword': {},
                    'antilink': {},
                    'welcome': {},
                    'goodbye': {},
                    'chatbot': {},
                    'warnings': {},
                    'sudo': [],
                    'antitag': {}
                };
                _0x0_0x5117e1['writeFileSync'](dataPath, JSON['stringify'](_0x275503, null, 0x2));
                return _0x275503;
            }
            const _0x38593a = JSON['parse'](_0x0_0x5117e1['readFileSync'](dataPath, 'utf8'));
            return _0x38593a;
        }
    } catch (_0x10ba15) {
        console['error']('Error\x20loading\x20user\x20group\x20data:', _0x10ba15);
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
async function saveUserGroupData(_0x4dc9d1) {
    try {
        if (HAS_DB) {
            await _0x0_0xb522bf['saveSetting']('global', 'userGroupData', _0x4dc9d1);
        } else {
            const _0x1ae4ae = _0x0_0x5c7a1c['dirname'](dataPath);
            if (!_0x0_0x5117e1['existsSync'](_0x1ae4ae)) {
                _0x0_0x5117e1['mkdirSync'](_0x1ae4ae, { 'recursive': !![] });
            }
            _0x0_0x5117e1['writeFileSync'](dataPath, JSON['stringify'](_0x4dc9d1, null, 0x2));
        }
        return !![];
    } catch (_0x2b214a) {
        console['error']('Error\x20saving\x20user\x20group\x20data:', _0x2b214a);
        return ![];
    }
}
async function setAntilink(_0x249413, _0x446f77, _0xc915b8) {
    try {
        const _0x413484 = await loadUserGroupData();
        if (!_0x413484['antilink'])
            _0x413484['antilink'] = {};
        if (!_0x413484['antilink'][_0x249413])
            _0x413484['antilink'][_0x249413] = {};
        _0x413484['antilink'][_0x249413] = {
            'enabled': _0x446f77 === 'on',
            'action': _0xc915b8 || 'delete'
        };
        await saveUserGroupData(_0x413484);
        return !![];
    } catch (_0xbe7e2e) {
        console['error']('Error\x20setting\x20antilink:', _0xbe7e2e);
        return ![];
    }
}
async function getAntilink(_0x49c18a, _0x198d15) {
    try {
        const _0x1bc22a = await loadUserGroupData();
        if (!_0x1bc22a['antilink'] || !_0x1bc22a['antilink'][_0x49c18a])
            return null;
        return _0x198d15 === 'on' ? _0x1bc22a['antilink'][_0x49c18a] : null;
    } catch (_0x28b2b4) {
        console['error']('Error\x20getting\x20antilink:', _0x28b2b4);
        return null;
    }
}
async function removeAntilink(_0x2a9b23, _0x2b6603) {
    try {
        const _0x21583f = await loadUserGroupData();
        if (_0x21583f['antilink'] && _0x21583f['antilink'][_0x2a9b23]) {
            delete _0x21583f['antilink'][_0x2a9b23];
            await saveUserGroupData(_0x21583f);
        }
        return !![];
    } catch (_0x2ab640) {
        console['error']('Error\x20removing\x20antilink:', _0x2ab640);
        return ![];
    }
}
async function setAntitag(_0x4f8b3f, _0x2461c2, _0x37788a) {
    try {
        const _0x3abb54 = await loadUserGroupData();
        if (!_0x3abb54['antitag'])
            _0x3abb54['antitag'] = {};
        if (!_0x3abb54['antitag'][_0x4f8b3f])
            _0x3abb54['antitag'][_0x4f8b3f] = {};
        _0x3abb54['antitag'][_0x4f8b3f] = {
            'enabled': _0x2461c2 === 'on',
            'action': _0x37788a || 'delete'
        };
        await saveUserGroupData(_0x3abb54);
        return !![];
    } catch (_0x194e0b) {
        console['error']('Error\x20setting\x20antitag:', _0x194e0b);
        return ![];
    }
}
async function getAntitag(_0x360348, _0x1aa77f) {
    try {
        const _0x378534 = await loadUserGroupData();
        if (!_0x378534['antitag'] || !_0x378534['antitag'][_0x360348])
            return null;
        return _0x1aa77f === 'on' ? _0x378534['antitag'][_0x360348] : null;
    } catch (_0x231fb0) {
        console['error']('Error\x20getting\x20antitag:', _0x231fb0);
        return null;
    }
}
async function removeAntitag(_0x51a065, _0x21cb6f) {
    try {
        const _0x51369d = await loadUserGroupData();
        if (_0x51369d['antitag'] && _0x51369d['antitag'][_0x51a065]) {
            delete _0x51369d['antitag'][_0x51a065];
            await saveUserGroupData(_0x51369d);
        }
        return !![];
    } catch (_0x6ffd2d) {
        console['error']('Error\x20removing\x20antitag:', _0x6ffd2d);
        return ![];
    }
}
async function incrementWarningCount(_0x1b072e, _0x5e3b83) {
    try {
        const _0x231dca = await loadUserGroupData();
        if (!_0x231dca['warnings'])
            _0x231dca['warnings'] = {};
        if (!_0x231dca['warnings'][_0x1b072e])
            _0x231dca['warnings'][_0x1b072e] = {};
        if (!_0x231dca['warnings'][_0x1b072e][_0x5e3b83])
            _0x231dca['warnings'][_0x1b072e][_0x5e3b83] = 0x0;
        _0x231dca['warnings'][_0x1b072e][_0x5e3b83]++;
        await saveUserGroupData(_0x231dca);
        return _0x231dca['warnings'][_0x1b072e][_0x5e3b83];
    } catch (_0x2fdb95) {
        console['error']('Error\x20incrementing\x20warning\x20count:', _0x2fdb95);
        return 0x0;
    }
}
async function resetWarningCount(_0x361b58, _0x430b88) {
    try {
        const _0x197c75 = await loadUserGroupData();
        if (_0x197c75['warnings'] && _0x197c75['warnings'][_0x361b58] && _0x197c75['warnings'][_0x361b58][_0x430b88]) {
            _0x197c75['warnings'][_0x361b58][_0x430b88] = 0x0;
            await saveUserGroupData(_0x197c75);
        }
        return !![];
    } catch (_0x37e4b6) {
        console['error']('Error\x20resetting\x20warning\x20count:', _0x37e4b6);
        return ![];
    }
}
async function isSudo(_0xe133d) {
    try {
        const _0x515234 = await loadUserGroupData();
        return _0x515234['sudo'] && _0x515234['sudo']['includes'](_0xe133d);
    } catch (_0x5b8d78) {
        console['error']('Error\x20checking\x20sudo:', _0x5b8d78);
        return ![];
    }
}
async function addSudo(_0xae8ea9) {
    try {
        const _0x4962b8 = await loadUserGroupData();
        if (!_0x4962b8['sudo'])
            _0x4962b8['sudo'] = [];
        if (!_0x4962b8['sudo']['includes'](_0xae8ea9)) {
            _0x4962b8['sudo']['push'](_0xae8ea9);
            await saveUserGroupData(_0x4962b8);
        }
        return !![];
    } catch (_0x5c63a0) {
        console['error']('Error\x20adding\x20sudo:', _0x5c63a0);
        return ![];
    }
}
async function removeSudo(_0x282795) {
    try {
        const _0x5533d3 = await loadUserGroupData();
        if (!_0x5533d3['sudo'])
            _0x5533d3['sudo'] = [];
        const _0x4d89be = _0x5533d3['sudo']['indexOf'](_0x282795);
        if (_0x4d89be !== -0x1) {
            _0x5533d3['sudo']['splice'](_0x4d89be, 0x1);
            await saveUserGroupData(_0x5533d3);
        }
        return !![];
    } catch (_0x3d54ee) {
        console['error']('Error\x20removing\x20sudo:', _0x3d54ee);
        return ![];
    }
}
async function getSudoList() {
    try {
        const _0x2e5538 = await loadUserGroupData();
        return Array['isArray'](_0x2e5538['sudo']) ? _0x2e5538['sudo'] : [];
    } catch (_0x5bb83f) {
        console['error']('Error\x20getting\x20sudo\x20list:', _0x5bb83f);
        return [];
    }
}
async function addWelcome(_0x181bbf, _0xe36238, _0x3d9f23) {
    try {
        const _0x15e690 = await loadUserGroupData();
        if (!_0x15e690['welcome'])
            _0x15e690['welcome'] = {};
        _0x15e690['welcome'][_0x181bbf] = {
            'enabled': _0xe36238,
            'message': _0x3d9f23 || '╔═⚔️\x20WELCOME\x20⚔️═╗\x0a║\x20🛡️\x20User:\x20{user}\x0a║\x20🏰\x20Kingdom:\x20{group}\x0a╠═══════════════╣\x0a║\x20📜\x20Message:\x0a║\x20{description}\x0a╚═══════════════╝',
            'channelId': '120363429019355682@newsletter'
        };
        await saveUserGroupData(_0x15e690);
        return !![];
    } catch (_0x5de88c) {
        console['error']('Error\x20in\x20addWelcome:', _0x5de88c);
        return ![];
    }
}
async function delWelcome(_0x2d4a65) {
    try {
        const _0x2fcfa0 = await loadUserGroupData();
        if (_0x2fcfa0['welcome'] && _0x2fcfa0['welcome'][_0x2d4a65]) {
            delete _0x2fcfa0['welcome'][_0x2d4a65];
            await saveUserGroupData(_0x2fcfa0);
        }
        return !![];
    } catch (_0x369626) {
        console['error']('Error\x20in\x20delWelcome:', _0x369626);
        return ![];
    }
}
async function isWelcomeOn(_0x4d4b4c) {
    try {
        const _0x5f1c0c = await loadUserGroupData();
        return _0x5f1c0c['welcome'] && _0x5f1c0c['welcome'][_0x4d4b4c] && _0x5f1c0c['welcome'][_0x4d4b4c]['enabled'];
    } catch (_0x338294) {
        console['error']('Error\x20in\x20isWelcomeOn:', _0x338294);
        return ![];
    }
}
async function addGoodbye(_0x21d93e, _0x63d9d6, _0x3dfb16) {
    try {
        const _0x4e1077 = await loadUserGroupData();
        if (!_0x4e1077['goodbye'])
            _0x4e1077['goodbye'] = {};
        _0x4e1077['goodbye'][_0x21d93e] = {
            'enabled': _0x63d9d6,
            'message': _0x3dfb16 || '╔═⚔️\x20GOODBYE\x20⚔️═╗\x0a║\x20🛡️\x20User:\x20{user}\x0a║\x20🏰\x20Kingdom:\x20{group}\x0a╠═══════════════╣\x0a║\x20⚰️\x20We\x20will\x20never\x20miss\x20you!\x0a╚═══════════════╝',
            'channelId': '120363429019355682@newsletter'
        };
        await saveUserGroupData(_0x4e1077);
        return !![];
    } catch (_0x4a9c7d) {
        console['error']('Error\x20in\x20addGoodbye:', _0x4a9c7d);
        return ![];
    }
}
async function delGoodBye(_0x425126) {
    try {
        const _0x94a7e8 = await loadUserGroupData();
        if (_0x94a7e8['goodbye'] && _0x94a7e8['goodbye'][_0x425126]) {
            delete _0x94a7e8['goodbye'][_0x425126];
            await saveUserGroupData(_0x94a7e8);
        }
        return !![];
    } catch (_0x35e039) {
        console['error']('Error\x20in\x20delGoodBye:', _0x35e039);
        return ![];
    }
}
async function isGoodByeOn(_0x32a6f6) {
    try {
        const _0x4c8c51 = await loadUserGroupData();
        return _0x4c8c51['goodbye'] && _0x4c8c51['goodbye'][_0x32a6f6] && _0x4c8c51['goodbye'][_0x32a6f6]['enabled'];
    } catch (_0x5286e4) {
        console['error']('Error\x20in\x20isGoodByeOn:', _0x5286e4);
        return ![];
    }
}
async function getWelcome(_0x2ac0b2) {
    try {
        const _0x19d573 = await loadUserGroupData();
        return _0x19d573['welcome'] && _0x19d573['welcome'][_0x2ac0b2] ? _0x19d573['welcome'][_0x2ac0b2]['message'] : null;
    } catch (_0x1e8619) {
        console['error']('Error\x20in\x20getWelcome:', _0x1e8619);
        return null;
    }
}
async function getGoodbye(_0x383cf7) {
    try {
        const _0x56426a = await loadUserGroupData();
        return _0x56426a['goodbye'] && _0x56426a['goodbye'][_0x383cf7] ? _0x56426a['goodbye'][_0x383cf7]['message'] : null;
    } catch (_0x14ad8d) {
        console['error']('Error\x20in\x20getGoodbye:', _0x14ad8d);
        return null;
    }
}
async function setAntiBadword(_0x1e2427, _0x11b046, _0x5073de) {
    try {
        const _0x31e170 = await loadUserGroupData();
        if (!_0x31e170['antibadword'])
            _0x31e170['antibadword'] = {};
        if (!_0x31e170['antibadword'][_0x1e2427])
            _0x31e170['antibadword'][_0x1e2427] = {};
        _0x31e170['antibadword'][_0x1e2427] = {
            'enabled': _0x11b046 === 'on',
            'action': _0x5073de || 'delete'
        };
        await saveUserGroupData(_0x31e170);
        return !![];
    } catch (_0x54334a) {
        console['error']('Error\x20setting\x20antibadword:', _0x54334a);
        return ![];
    }
}
async function getAntiBadword(_0x108635, _0x2a1049) {
    try {
        const _0x3f1671 = await loadUserGroupData();
        if (!_0x3f1671['antibadword'] || !_0x3f1671['antibadword'][_0x108635]) {
            return null;
        }
        const _0xc6bd07 = _0x3f1671['antibadword'][_0x108635];
        return _0x2a1049 === 'on' ? _0xc6bd07 : null;
    } catch (_0x2796a3) {
        console['error']('Error\x20getting\x20antibadword:', _0x2796a3);
        return null;
    }
}
async function removeAntiBadword(_0x36ac21, _0xd12f23) {
    try {
        const _0x28dbce = await loadUserGroupData();
        if (_0x28dbce['antibadword'] && _0x28dbce['antibadword'][_0x36ac21]) {
            delete _0x28dbce['antibadword'][_0x36ac21];
            await saveUserGroupData(_0x28dbce);
        }
        return !![];
    } catch (_0x18ad1f) {
        console['error']('Error\x20removing\x20antibadword:', _0x18ad1f);
        return ![];
    }
}
async function setChatbot(_0x2f967a, _0x2898b8) {
    try {
        const _0x3e390e = await loadUserGroupData();
        if (!_0x3e390e['chatbot'])
            _0x3e390e['chatbot'] = {};
        _0x3e390e['chatbot'][_0x2f967a] = { 'enabled': _0x2898b8 };
        await saveUserGroupData(_0x3e390e);
        return !![];
    } catch (_0x18bba3) {
        console['error']('Error\x20setting\x20chatbot:', _0x18bba3);
        return ![];
    }
}
async function getChatbot(_0x4e5873) {
    try {
        const _0xea314a = await loadUserGroupData();
        return _0xea314a['chatbot']?.[_0x4e5873] || null;
    } catch (_0x363a83) {
        console['error']('Error\x20getting\x20chatbot:', _0x363a83);
        return null;
    }
}
async function removeChatbot(_0x4c3698) {
    try {
        const _0x1f98b7 = await loadUserGroupData();
        if (_0x1f98b7['chatbot'] && _0x1f98b7['chatbot'][_0x4c3698]) {
            delete _0x1f98b7['chatbot'][_0x4c3698];
            await saveUserGroupData(_0x1f98b7);
        }
        return !![];
    } catch (_0x10bc3e) {
        console['error']('Error\x20removing\x20chatbot:', _0x10bc3e);
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