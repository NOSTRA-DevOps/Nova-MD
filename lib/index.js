import { fileURLToPath } from 'url';
import _0x0_0x29f093, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x456fc5 from 'fs';
import { dataFile } from './paths.js';
import _0x0_0x162687 from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const dataPath = dataFile('userGroupData.json');
async function loadUserGroupData() {
    try {
        if (HAS_DB) {
            const _0x1ea8ff = await _0x0_0x162687['getSetting']('global', 'userGroupData');
            return _0x1ea8ff || {
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
            if (!_0x0_0x456fc5['existsSync'](dataPath)) {
                const _0x46ba56 = {
                    'antibadword': {},
                    'antilink': {},
                    'welcome': {},
                    'goodbye': {},
                    'chatbot': {},
                    'warnings': {},
                    'sudo': [],
                    'antitag': {}
                };
                _0x0_0x456fc5['writeFileSync'](dataPath, JSON['stringify'](_0x46ba56, null, 0x2));
                return _0x46ba56;
            }
            const _0x16d299 = JSON['parse'](_0x0_0x456fc5['readFileSync'](dataPath, 'utf8'));
            return _0x16d299;
        }
    } catch (_0x4762ca) {
        console['error']('Error\x20loading\x20user\x20group\x20data:', _0x4762ca);
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
async function saveUserGroupData(_0x4d2e56) {
    try {
        if (HAS_DB) {
            await _0x0_0x162687['saveSetting']('global', 'userGroupData', _0x4d2e56);
        } else {
            const _0x34a377 = _0x0_0x29f093['dirname'](dataPath);
            if (!_0x0_0x456fc5['existsSync'](_0x34a377)) {
                _0x0_0x456fc5['mkdirSync'](_0x34a377, { 'recursive': !![] });
            }
            _0x0_0x456fc5['writeFileSync'](dataPath, JSON['stringify'](_0x4d2e56, null, 0x2));
        }
        return !![];
    } catch (_0x17a659) {
        console['error']('Error\x20saving\x20user\x20group\x20data:', _0x17a659);
        return ![];
    }
}
async function setAntilink(_0x564282, _0x5451bd, _0x5436f6) {
    try {
        const _0xede656 = await loadUserGroupData();
        if (!_0xede656['antilink'])
            _0xede656['antilink'] = {};
        if (!_0xede656['antilink'][_0x564282])
            _0xede656['antilink'][_0x564282] = {};
        _0xede656['antilink'][_0x564282] = {
            'enabled': _0x5451bd === 'on',
            'action': _0x5436f6 || 'delete'
        };
        await saveUserGroupData(_0xede656);
        return !![];
    } catch (_0x2021f4) {
        console['error']('Error\x20setting\x20antilink:', _0x2021f4);
        return ![];
    }
}
async function getAntilink(_0x58c79f, _0x177e7b) {
    try {
        const _0xa75eda = await loadUserGroupData();
        if (!_0xa75eda['antilink'] || !_0xa75eda['antilink'][_0x58c79f])
            return null;
        return _0x177e7b === 'on' ? _0xa75eda['antilink'][_0x58c79f] : null;
    } catch (_0xe8416c) {
        console['error']('Error\x20getting\x20antilink:', _0xe8416c);
        return null;
    }
}
async function removeAntilink(_0x409c52, _0x42b9ba) {
    try {
        const _0x587f28 = await loadUserGroupData();
        if (_0x587f28['antilink'] && _0x587f28['antilink'][_0x409c52]) {
            delete _0x587f28['antilink'][_0x409c52];
            await saveUserGroupData(_0x587f28);
        }
        return !![];
    } catch (_0x47c6e1) {
        console['error']('Error\x20removing\x20antilink:', _0x47c6e1);
        return ![];
    }
}
async function setAntitag(_0x53d0c1, _0x3d304d, _0x4b1e20) {
    try {
        const _0x360566 = await loadUserGroupData();
        if (!_0x360566['antitag'])
            _0x360566['antitag'] = {};
        if (!_0x360566['antitag'][_0x53d0c1])
            _0x360566['antitag'][_0x53d0c1] = {};
        _0x360566['antitag'][_0x53d0c1] = {
            'enabled': _0x3d304d === 'on',
            'action': _0x4b1e20 || 'delete'
        };
        await saveUserGroupData(_0x360566);
        return !![];
    } catch (_0x5756f0) {
        console['error']('Error\x20setting\x20antitag:', _0x5756f0);
        return ![];
    }
}
async function getAntitag(_0x171430, _0x18c01c) {
    try {
        const _0x53dd4e = await loadUserGroupData();
        if (!_0x53dd4e['antitag'] || !_0x53dd4e['antitag'][_0x171430])
            return null;
        return _0x18c01c === 'on' ? _0x53dd4e['antitag'][_0x171430] : null;
    } catch (_0x10f24d) {
        console['error']('Error\x20getting\x20antitag:', _0x10f24d);
        return null;
    }
}
async function removeAntitag(_0x51f962, _0x359902) {
    try {
        const _0x3939a6 = await loadUserGroupData();
        if (_0x3939a6['antitag'] && _0x3939a6['antitag'][_0x51f962]) {
            delete _0x3939a6['antitag'][_0x51f962];
            await saveUserGroupData(_0x3939a6);
        }
        return !![];
    } catch (_0x3026a8) {
        console['error']('Error\x20removing\x20antitag:', _0x3026a8);
        return ![];
    }
}
async function incrementWarningCount(_0x57e2be, _0x424133) {
    try {
        const _0x1d7d27 = await loadUserGroupData();
        if (!_0x1d7d27['warnings'])
            _0x1d7d27['warnings'] = {};
        if (!_0x1d7d27['warnings'][_0x57e2be])
            _0x1d7d27['warnings'][_0x57e2be] = {};
        if (!_0x1d7d27['warnings'][_0x57e2be][_0x424133])
            _0x1d7d27['warnings'][_0x57e2be][_0x424133] = 0x0;
        _0x1d7d27['warnings'][_0x57e2be][_0x424133]++;
        await saveUserGroupData(_0x1d7d27);
        return _0x1d7d27['warnings'][_0x57e2be][_0x424133];
    } catch (_0x2f8d5d) {
        console['error']('Error\x20incrementing\x20warning\x20count:', _0x2f8d5d);
        return 0x0;
    }
}
async function resetWarningCount(_0x4a203c, _0x8f3df7) {
    try {
        const _0x4d8021 = await loadUserGroupData();
        if (_0x4d8021['warnings'] && _0x4d8021['warnings'][_0x4a203c] && _0x4d8021['warnings'][_0x4a203c][_0x8f3df7]) {
            _0x4d8021['warnings'][_0x4a203c][_0x8f3df7] = 0x0;
            await saveUserGroupData(_0x4d8021);
        }
        return !![];
    } catch (_0xb6fa7f) {
        console['error']('Error\x20resetting\x20warning\x20count:', _0xb6fa7f);
        return ![];
    }
}
async function isSudo(_0x2fd598) {
    try {
        const _0x1671d9 = await loadUserGroupData();
        return _0x1671d9['sudo'] && _0x1671d9['sudo']['includes'](_0x2fd598);
    } catch (_0x2f9e9f) {
        console['error']('Error\x20checking\x20sudo:', _0x2f9e9f);
        return ![];
    }
}
async function addSudo(_0x253069) {
    try {
        const _0x28a412 = await loadUserGroupData();
        if (!_0x28a412['sudo'])
            _0x28a412['sudo'] = [];
        if (!_0x28a412['sudo']['includes'](_0x253069)) {
            _0x28a412['sudo']['push'](_0x253069);
            await saveUserGroupData(_0x28a412);
        }
        return !![];
    } catch (_0x4049e0) {
        console['error']('Error\x20adding\x20sudo:', _0x4049e0);
        return ![];
    }
}
async function removeSudo(_0x74413d) {
    try {
        const _0x46a217 = await loadUserGroupData();
        if (!_0x46a217['sudo'])
            _0x46a217['sudo'] = [];
        const _0x4527f4 = _0x46a217['sudo']['indexOf'](_0x74413d);
        if (_0x4527f4 !== -0x1) {
            _0x46a217['sudo']['splice'](_0x4527f4, 0x1);
            await saveUserGroupData(_0x46a217);
        }
        return !![];
    } catch (_0x2def89) {
        console['error']('Error\x20removing\x20sudo:', _0x2def89);
        return ![];
    }
}
async function getSudoList() {
    try {
        const _0xe4d0b = await loadUserGroupData();
        return Array['isArray'](_0xe4d0b['sudo']) ? _0xe4d0b['sudo'] : [];
    } catch (_0x40ca43) {
        console['error']('Error\x20getting\x20sudo\x20list:', _0x40ca43);
        return [];
    }
}
async function addWelcome(_0x5d248e, _0x574743, _0x9d9ffe) {
    try {
        const _0x57e7ea = await loadUserGroupData();
        if (!_0x57e7ea['welcome'])
            _0x57e7ea['welcome'] = {};
        _0x57e7ea['welcome'][_0x5d248e] = {
            'enabled': _0x574743,
            'message': _0x9d9ffe || '╔═⚔️\x20WELCOME\x20⚔️═╗\x0a║\x20🛡️\x20User:\x20{user}\x0a║\x20🏰\x20Kingdom:\x20{group}\x0a╠═══════════════╣\x0a║\x20📜\x20Message:\x0a║\x20{description}\x0a╚═══════════════╝',
            'channelId': '120363429019355682@newsletter'
        };
        await saveUserGroupData(_0x57e7ea);
        return !![];
    } catch (_0x245083) {
        console['error']('Error\x20in\x20addWelcome:', _0x245083);
        return ![];
    }
}
async function delWelcome(_0x37def4) {
    try {
        const _0x3dc69c = await loadUserGroupData();
        if (_0x3dc69c['welcome'] && _0x3dc69c['welcome'][_0x37def4]) {
            delete _0x3dc69c['welcome'][_0x37def4];
            await saveUserGroupData(_0x3dc69c);
        }
        return !![];
    } catch (_0x836b84) {
        console['error']('Error\x20in\x20delWelcome:', _0x836b84);
        return ![];
    }
}
async function isWelcomeOn(_0x33b829) {
    try {
        const _0x20d053 = await loadUserGroupData();
        return _0x20d053['welcome'] && _0x20d053['welcome'][_0x33b829] && _0x20d053['welcome'][_0x33b829]['enabled'];
    } catch (_0x54be09) {
        console['error']('Error\x20in\x20isWelcomeOn:', _0x54be09);
        return ![];
    }
}
async function addGoodbye(_0x471c0f, _0x213a9c, _0x54880) {
    try {
        const _0x3cf6e8 = await loadUserGroupData();
        if (!_0x3cf6e8['goodbye'])
            _0x3cf6e8['goodbye'] = {};
        _0x3cf6e8['goodbye'][_0x471c0f] = {
            'enabled': _0x213a9c,
            'message': _0x54880 || '╔═⚔️\x20GOODBYE\x20⚔️═╗\x0a║\x20🛡️\x20User:\x20{user}\x0a║\x20🏰\x20Kingdom:\x20{group}\x0a╠═══════════════╣\x0a║\x20⚰️\x20We\x20will\x20never\x20miss\x20you!\x0a╚═══════════════╝',
            'channelId': '120363429019355682@newsletter'
        };
        await saveUserGroupData(_0x3cf6e8);
        return !![];
    } catch (_0x18bcdb) {
        console['error']('Error\x20in\x20addGoodbye:', _0x18bcdb);
        return ![];
    }
}
async function delGoodBye(_0x4ed944) {
    try {
        const _0x2b5560 = await loadUserGroupData();
        if (_0x2b5560['goodbye'] && _0x2b5560['goodbye'][_0x4ed944]) {
            delete _0x2b5560['goodbye'][_0x4ed944];
            await saveUserGroupData(_0x2b5560);
        }
        return !![];
    } catch (_0x922c02) {
        console['error']('Error\x20in\x20delGoodBye:', _0x922c02);
        return ![];
    }
}
async function isGoodByeOn(_0x56726b) {
    try {
        const _0x2fbb7e = await loadUserGroupData();
        return _0x2fbb7e['goodbye'] && _0x2fbb7e['goodbye'][_0x56726b] && _0x2fbb7e['goodbye'][_0x56726b]['enabled'];
    } catch (_0x4eef20) {
        console['error']('Error\x20in\x20isGoodByeOn:', _0x4eef20);
        return ![];
    }
}
async function getWelcome(_0x3ffd09) {
    try {
        const _0xe20b77 = await loadUserGroupData();
        return _0xe20b77['welcome'] && _0xe20b77['welcome'][_0x3ffd09] ? _0xe20b77['welcome'][_0x3ffd09]['message'] : null;
    } catch (_0x1167ee) {
        console['error']('Error\x20in\x20getWelcome:', _0x1167ee);
        return null;
    }
}
async function getGoodbye(_0x44b82d) {
    try {
        const _0x5455e3 = await loadUserGroupData();
        return _0x5455e3['goodbye'] && _0x5455e3['goodbye'][_0x44b82d] ? _0x5455e3['goodbye'][_0x44b82d]['message'] : null;
    } catch (_0x4867fc) {
        console['error']('Error\x20in\x20getGoodbye:', _0x4867fc);
        return null;
    }
}
async function setAntiBadword(_0x4e4a16, _0x544f19, _0x1281d7) {
    try {
        const _0x91a914 = await loadUserGroupData();
        if (!_0x91a914['antibadword'])
            _0x91a914['antibadword'] = {};
        if (!_0x91a914['antibadword'][_0x4e4a16])
            _0x91a914['antibadword'][_0x4e4a16] = {};
        _0x91a914['antibadword'][_0x4e4a16] = {
            'enabled': _0x544f19 === 'on',
            'action': _0x1281d7 || 'delete'
        };
        await saveUserGroupData(_0x91a914);
        return !![];
    } catch (_0x2b95ed) {
        console['error']('Error\x20setting\x20antibadword:', _0x2b95ed);
        return ![];
    }
}
async function getAntiBadword(_0x5aa498, _0x106d8d) {
    try {
        const _0x5eef14 = await loadUserGroupData();
        if (!_0x5eef14['antibadword'] || !_0x5eef14['antibadword'][_0x5aa498]) {
            return null;
        }
        const _0xfe2840 = _0x5eef14['antibadword'][_0x5aa498];
        return _0x106d8d === 'on' ? _0xfe2840 : null;
    } catch (_0x30e0c6) {
        console['error']('Error\x20getting\x20antibadword:', _0x30e0c6);
        return null;
    }
}
async function removeAntiBadword(_0x50732e, _0x1ecd85) {
    try {
        const _0x317380 = await loadUserGroupData();
        if (_0x317380['antibadword'] && _0x317380['antibadword'][_0x50732e]) {
            delete _0x317380['antibadword'][_0x50732e];
            await saveUserGroupData(_0x317380);
        }
        return !![];
    } catch (_0x128ee0) {
        console['error']('Error\x20removing\x20antibadword:', _0x128ee0);
        return ![];
    }
}
async function setChatbot(_0x2d89f4, _0x5843f5) {
    try {
        const _0x43e7b7 = await loadUserGroupData();
        if (!_0x43e7b7['chatbot'])
            _0x43e7b7['chatbot'] = {};
        _0x43e7b7['chatbot'][_0x2d89f4] = { 'enabled': _0x5843f5 };
        await saveUserGroupData(_0x43e7b7);
        return !![];
    } catch (_0x5d22e9) {
        console['error']('Error\x20setting\x20chatbot:', _0x5d22e9);
        return ![];
    }
}
async function getChatbot(_0x538f49) {
    try {
        const _0x2299d7 = await loadUserGroupData();
        return _0x2299d7['chatbot']?.[_0x538f49] || null;
    } catch (_0x10d533) {
        console['error']('Error\x20getting\x20chatbot:', _0x10d533);
        return null;
    }
}
async function removeChatbot(_0x33fdac) {
    try {
        const _0x3abb44 = await loadUserGroupData();
        if (_0x3abb44['chatbot'] && _0x3abb44['chatbot'][_0x33fdac]) {
            delete _0x3abb44['chatbot'][_0x33fdac];
            await saveUserGroupData(_0x3abb44);
        }
        return !![];
    } catch (_0x4419a1) {
        console['error']('Error\x20removing\x20chatbot:', _0x4419a1);
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