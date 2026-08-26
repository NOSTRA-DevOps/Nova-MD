import { fileURLToPath } from 'url';
import _0x0_0x49af48, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x48bb16 from 'fs';
import { dataFile } from './paths.js';
import _0x0_0x2b542f from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const dataPath = dataFile('userGroupData.json');
async function loadUserGroupData() {
    try {
        if (HAS_DB) {
            const _0x26b561 = await _0x0_0x2b542f['getSetting']('global', 'userGroupData');
            return _0x26b561 || {
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
            if (!_0x0_0x48bb16['existsSync'](dataPath)) {
                const _0x3aa714 = {
                    'antibadword': {},
                    'antilink': {},
                    'welcome': {},
                    'goodbye': {},
                    'chatbot': {},
                    'warnings': {},
                    'sudo': [],
                    'antitag': {}
                };
                _0x0_0x48bb16['writeFileSync'](dataPath, JSON['stringify'](_0x3aa714, null, 0x2));
                return _0x3aa714;
            }
            const _0x5a31ce = JSON['parse'](_0x0_0x48bb16['readFileSync'](dataPath, 'utf8'));
            return _0x5a31ce;
        }
    } catch (_0x1996ad) {
        console['error']('Error\x20loading\x20user\x20group\x20data:', _0x1996ad);
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
async function saveUserGroupData(_0x5a7158) {
    try {
        if (HAS_DB) {
            await _0x0_0x2b542f['saveSetting']('global', 'userGroupData', _0x5a7158);
        } else {
            const _0x2a651d = _0x0_0x49af48['dirname'](dataPath);
            if (!_0x0_0x48bb16['existsSync'](_0x2a651d)) {
                _0x0_0x48bb16['mkdirSync'](_0x2a651d, { 'recursive': !![] });
            }
            _0x0_0x48bb16['writeFileSync'](dataPath, JSON['stringify'](_0x5a7158, null, 0x2));
        }
        return !![];
    } catch (_0x422ca5) {
        console['error']('Error\x20saving\x20user\x20group\x20data:', _0x422ca5);
        return ![];
    }
}
async function setAntilink(_0x14849c, _0x3302f4, _0x12737c) {
    try {
        const _0x374473 = await loadUserGroupData();
        if (!_0x374473['antilink'])
            _0x374473['antilink'] = {};
        if (!_0x374473['antilink'][_0x14849c])
            _0x374473['antilink'][_0x14849c] = {};
        _0x374473['antilink'][_0x14849c] = {
            'enabled': _0x3302f4 === 'on',
            'action': _0x12737c || 'delete'
        };
        await saveUserGroupData(_0x374473);
        return !![];
    } catch (_0x39ce71) {
        console['error']('Error\x20setting\x20antilink:', _0x39ce71);
        return ![];
    }
}
async function getAntilink(_0xde56e3, _0x3cebf9) {
    try {
        const _0x4e7317 = await loadUserGroupData();
        if (!_0x4e7317['antilink'] || !_0x4e7317['antilink'][_0xde56e3])
            return null;
        return _0x3cebf9 === 'on' ? _0x4e7317['antilink'][_0xde56e3] : null;
    } catch (_0x15521d) {
        console['error']('Error\x20getting\x20antilink:', _0x15521d);
        return null;
    }
}
async function removeAntilink(_0x4e440b, _0x25acca) {
    try {
        const _0x53ebf7 = await loadUserGroupData();
        if (_0x53ebf7['antilink'] && _0x53ebf7['antilink'][_0x4e440b]) {
            delete _0x53ebf7['antilink'][_0x4e440b];
            await saveUserGroupData(_0x53ebf7);
        }
        return !![];
    } catch (_0xea113) {
        console['error']('Error\x20removing\x20antilink:', _0xea113);
        return ![];
    }
}
async function setAntitag(_0x36e04b, _0x24bf18, _0x2cd531) {
    try {
        const _0x59b170 = await loadUserGroupData();
        if (!_0x59b170['antitag'])
            _0x59b170['antitag'] = {};
        if (!_0x59b170['antitag'][_0x36e04b])
            _0x59b170['antitag'][_0x36e04b] = {};
        _0x59b170['antitag'][_0x36e04b] = {
            'enabled': _0x24bf18 === 'on',
            'action': _0x2cd531 || 'delete'
        };
        await saveUserGroupData(_0x59b170);
        return !![];
    } catch (_0x41727f) {
        console['error']('Error\x20setting\x20antitag:', _0x41727f);
        return ![];
    }
}
async function getAntitag(_0x44e7fe, _0x56ea0f) {
    try {
        const _0x18aabf = await loadUserGroupData();
        if (!_0x18aabf['antitag'] || !_0x18aabf['antitag'][_0x44e7fe])
            return null;
        return _0x56ea0f === 'on' ? _0x18aabf['antitag'][_0x44e7fe] : null;
    } catch (_0x4aaae1) {
        console['error']('Error\x20getting\x20antitag:', _0x4aaae1);
        return null;
    }
}
async function removeAntitag(_0x52a323, _0x1d83ee) {
    try {
        const _0x422d9a = await loadUserGroupData();
        if (_0x422d9a['antitag'] && _0x422d9a['antitag'][_0x52a323]) {
            delete _0x422d9a['antitag'][_0x52a323];
            await saveUserGroupData(_0x422d9a);
        }
        return !![];
    } catch (_0x332724) {
        console['error']('Error\x20removing\x20antitag:', _0x332724);
        return ![];
    }
}
async function incrementWarningCount(_0x357298, _0x41b3a9) {
    try {
        const _0x1ead2 = await loadUserGroupData();
        if (!_0x1ead2['warnings'])
            _0x1ead2['warnings'] = {};
        if (!_0x1ead2['warnings'][_0x357298])
            _0x1ead2['warnings'][_0x357298] = {};
        if (!_0x1ead2['warnings'][_0x357298][_0x41b3a9])
            _0x1ead2['warnings'][_0x357298][_0x41b3a9] = 0x0;
        _0x1ead2['warnings'][_0x357298][_0x41b3a9]++;
        await saveUserGroupData(_0x1ead2);
        return _0x1ead2['warnings'][_0x357298][_0x41b3a9];
    } catch (_0x424739) {
        console['error']('Error\x20incrementing\x20warning\x20count:', _0x424739);
        return 0x0;
    }
}
async function resetWarningCount(_0x278ee5, _0x1475e5) {
    try {
        const _0x186890 = await loadUserGroupData();
        if (_0x186890['warnings'] && _0x186890['warnings'][_0x278ee5] && _0x186890['warnings'][_0x278ee5][_0x1475e5]) {
            _0x186890['warnings'][_0x278ee5][_0x1475e5] = 0x0;
            await saveUserGroupData(_0x186890);
        }
        return !![];
    } catch (_0x46ee98) {
        console['error']('Error\x20resetting\x20warning\x20count:', _0x46ee98);
        return ![];
    }
}
async function isSudo(_0x1843a4) {
    try {
        const _0xb4b3d1 = await loadUserGroupData();
        return _0xb4b3d1['sudo'] && _0xb4b3d1['sudo']['includes'](_0x1843a4);
    } catch (_0x20e465) {
        console['error']('Error\x20checking\x20sudo:', _0x20e465);
        return ![];
    }
}
async function addSudo(_0x58eef5) {
    try {
        const _0x4436e6 = await loadUserGroupData();
        if (!_0x4436e6['sudo'])
            _0x4436e6['sudo'] = [];
        if (!_0x4436e6['sudo']['includes'](_0x58eef5)) {
            _0x4436e6['sudo']['push'](_0x58eef5);
            await saveUserGroupData(_0x4436e6);
        }
        return !![];
    } catch (_0xbd09d6) {
        console['error']('Error\x20adding\x20sudo:', _0xbd09d6);
        return ![];
    }
}
async function removeSudo(_0x2f1414) {
    try {
        const _0x2b2392 = await loadUserGroupData();
        if (!_0x2b2392['sudo'])
            _0x2b2392['sudo'] = [];
        const _0x93850e = _0x2b2392['sudo']['indexOf'](_0x2f1414);
        if (_0x93850e !== -0x1) {
            _0x2b2392['sudo']['splice'](_0x93850e, 0x1);
            await saveUserGroupData(_0x2b2392);
        }
        return !![];
    } catch (_0x2bf3c8) {
        console['error']('Error\x20removing\x20sudo:', _0x2bf3c8);
        return ![];
    }
}
async function getSudoList() {
    try {
        const _0x8a8c67 = await loadUserGroupData();
        return Array['isArray'](_0x8a8c67['sudo']) ? _0x8a8c67['sudo'] : [];
    } catch (_0x2fc884) {
        console['error']('Error\x20getting\x20sudo\x20list:', _0x2fc884);
        return [];
    }
}
async function addWelcome(_0x5a1eff, _0x13c3a3, _0x178906) {
    try {
        const _0x4e77d9 = await loadUserGroupData();
        if (!_0x4e77d9['welcome'])
            _0x4e77d9['welcome'] = {};
        _0x4e77d9['welcome'][_0x5a1eff] = {
            'enabled': _0x13c3a3,
            'message': _0x178906 || '╔═⚔️\x20WELCOME\x20⚔️═╗\x0a║\x20🛡️\x20User:\x20{user}\x0a║\x20🏰\x20Kingdom:\x20{group}\x0a╠═══════════════╣\x0a║\x20📜\x20Message:\x0a║\x20{description}\x0a╚═══════════════╝',
            'channelId': '120363429019355682@newsletter'
        };
        await saveUserGroupData(_0x4e77d9);
        return !![];
    } catch (_0x463cae) {
        console['error']('Error\x20in\x20addWelcome:', _0x463cae);
        return ![];
    }
}
async function delWelcome(_0x1b6a7d) {
    try {
        const _0x4f41a7 = await loadUserGroupData();
        if (_0x4f41a7['welcome'] && _0x4f41a7['welcome'][_0x1b6a7d]) {
            delete _0x4f41a7['welcome'][_0x1b6a7d];
            await saveUserGroupData(_0x4f41a7);
        }
        return !![];
    } catch (_0x73cda9) {
        console['error']('Error\x20in\x20delWelcome:', _0x73cda9);
        return ![];
    }
}
async function isWelcomeOn(_0x51fd42) {
    try {
        const _0x4d03a0 = await loadUserGroupData();
        return _0x4d03a0['welcome'] && _0x4d03a0['welcome'][_0x51fd42] && _0x4d03a0['welcome'][_0x51fd42]['enabled'];
    } catch (_0xd4310f) {
        console['error']('Error\x20in\x20isWelcomeOn:', _0xd4310f);
        return ![];
    }
}
async function addGoodbye(_0x4f8ea7, _0x2fcbb3, _0x2ce405) {
    try {
        const _0x80aded = await loadUserGroupData();
        if (!_0x80aded['goodbye'])
            _0x80aded['goodbye'] = {};
        _0x80aded['goodbye'][_0x4f8ea7] = {
            'enabled': _0x2fcbb3,
            'message': _0x2ce405 || '╔═⚔️\x20GOODBYE\x20⚔️═╗\x0a║\x20🛡️\x20User:\x20{user}\x0a║\x20🏰\x20Kingdom:\x20{group}\x0a╠═══════════════╣\x0a║\x20⚰️\x20We\x20will\x20never\x20miss\x20you!\x0a╚═══════════════╝',
            'channelId': '120363429019355682@newsletter'
        };
        await saveUserGroupData(_0x80aded);
        return !![];
    } catch (_0x4956b1) {
        console['error']('Error\x20in\x20addGoodbye:', _0x4956b1);
        return ![];
    }
}
async function delGoodBye(_0x1e3a03) {
    try {
        const _0x34994f = await loadUserGroupData();
        if (_0x34994f['goodbye'] && _0x34994f['goodbye'][_0x1e3a03]) {
            delete _0x34994f['goodbye'][_0x1e3a03];
            await saveUserGroupData(_0x34994f);
        }
        return !![];
    } catch (_0x20e26f) {
        console['error']('Error\x20in\x20delGoodBye:', _0x20e26f);
        return ![];
    }
}
async function isGoodByeOn(_0x392f42) {
    try {
        const _0x246d01 = await loadUserGroupData();
        return _0x246d01['goodbye'] && _0x246d01['goodbye'][_0x392f42] && _0x246d01['goodbye'][_0x392f42]['enabled'];
    } catch (_0xc47e9b) {
        console['error']('Error\x20in\x20isGoodByeOn:', _0xc47e9b);
        return ![];
    }
}
async function getWelcome(_0x5f4e35) {
    try {
        const _0x2d4aa9 = await loadUserGroupData();
        return _0x2d4aa9['welcome'] && _0x2d4aa9['welcome'][_0x5f4e35] ? _0x2d4aa9['welcome'][_0x5f4e35]['message'] : null;
    } catch (_0x28c77d) {
        console['error']('Error\x20in\x20getWelcome:', _0x28c77d);
        return null;
    }
}
async function getGoodbye(_0x38759b) {
    try {
        const _0x17d9f2 = await loadUserGroupData();
        return _0x17d9f2['goodbye'] && _0x17d9f2['goodbye'][_0x38759b] ? _0x17d9f2['goodbye'][_0x38759b]['message'] : null;
    } catch (_0x3f1dc7) {
        console['error']('Error\x20in\x20getGoodbye:', _0x3f1dc7);
        return null;
    }
}
async function setAntiBadword(_0x40e47f, _0xc1ac89, _0x261f29) {
    try {
        const _0x3dbd65 = await loadUserGroupData();
        if (!_0x3dbd65['antibadword'])
            _0x3dbd65['antibadword'] = {};
        if (!_0x3dbd65['antibadword'][_0x40e47f])
            _0x3dbd65['antibadword'][_0x40e47f] = {};
        _0x3dbd65['antibadword'][_0x40e47f] = {
            'enabled': _0xc1ac89 === 'on',
            'action': _0x261f29 || 'delete'
        };
        await saveUserGroupData(_0x3dbd65);
        return !![];
    } catch (_0xcf8dfc) {
        console['error']('Error\x20setting\x20antibadword:', _0xcf8dfc);
        return ![];
    }
}
async function getAntiBadword(_0x205cbf, _0x122f46) {
    try {
        const _0x46de56 = await loadUserGroupData();
        if (!_0x46de56['antibadword'] || !_0x46de56['antibadword'][_0x205cbf]) {
            return null;
        }
        const _0x28bd3a = _0x46de56['antibadword'][_0x205cbf];
        return _0x122f46 === 'on' ? _0x28bd3a : null;
    } catch (_0x16bd81) {
        console['error']('Error\x20getting\x20antibadword:', _0x16bd81);
        return null;
    }
}
async function removeAntiBadword(_0x5b943b, _0x466e6d) {
    try {
        const _0x4eecc0 = await loadUserGroupData();
        if (_0x4eecc0['antibadword'] && _0x4eecc0['antibadword'][_0x5b943b]) {
            delete _0x4eecc0['antibadword'][_0x5b943b];
            await saveUserGroupData(_0x4eecc0);
        }
        return !![];
    } catch (_0x49c9bd) {
        console['error']('Error\x20removing\x20antibadword:', _0x49c9bd);
        return ![];
    }
}
async function setChatbot(_0x195bd9, _0x4e002d) {
    try {
        const _0x520184 = await loadUserGroupData();
        if (!_0x520184['chatbot'])
            _0x520184['chatbot'] = {};
        _0x520184['chatbot'][_0x195bd9] = { 'enabled': _0x4e002d };
        await saveUserGroupData(_0x520184);
        return !![];
    } catch (_0x2ef137) {
        console['error']('Error\x20setting\x20chatbot:', _0x2ef137);
        return ![];
    }
}
async function getChatbot(_0x2652ef) {
    try {
        const _0x249ef6 = await loadUserGroupData();
        return _0x249ef6['chatbot']?.[_0x2652ef] || null;
    } catch (_0x4cd92f) {
        console['error']('Error\x20getting\x20chatbot:', _0x4cd92f);
        return null;
    }
}
async function removeChatbot(_0x5006d8) {
    try {
        const _0x208ea7 = await loadUserGroupData();
        if (_0x208ea7['chatbot'] && _0x208ea7['chatbot'][_0x5006d8]) {
            delete _0x208ea7['chatbot'][_0x5006d8];
            await saveUserGroupData(_0x208ea7);
        }
        return !![];
    } catch (_0x467ce8) {
        console['error']('Error\x20removing\x20chatbot:', _0x467ce8);
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