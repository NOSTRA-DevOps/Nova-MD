import { fileURLToPath } from 'url';
import _0x0_0x1db164, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x18bf02 from 'fs';
import { dataFile } from './paths.js';
import _0x0_0x310d4e from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const dataPath = dataFile('userGroupData.json');
async function loadUserGroupData() {
    try {
        if (HAS_DB) {
            const _0x570b3b = await _0x0_0x310d4e['getSetting']('global', 'userGroupData');
            return _0x570b3b || {
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
            if (!_0x0_0x18bf02['existsSync'](dataPath)) {
                const _0x53e0ee = {
                    'antibadword': {},
                    'antilink': {},
                    'welcome': {},
                    'goodbye': {},
                    'chatbot': {},
                    'warnings': {},
                    'sudo': [],
                    'antitag': {}
                };
                _0x0_0x18bf02['writeFileSync'](dataPath, JSON['stringify'](_0x53e0ee, null, 0x2));
                return _0x53e0ee;
            }
            const _0x2d2467 = JSON['parse'](_0x0_0x18bf02['readFileSync'](dataPath, 'utf8'));
            return _0x2d2467;
        }
    } catch (_0x2a8fa0) {
        console['error']('Error\x20loading\x20user\x20group\x20data:', _0x2a8fa0);
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
async function saveUserGroupData(_0x2ced60) {
    try {
        if (HAS_DB) {
            await _0x0_0x310d4e['saveSetting']('global', 'userGroupData', _0x2ced60);
        } else {
            const _0x40fbf2 = _0x0_0x1db164['dirname'](dataPath);
            if (!_0x0_0x18bf02['existsSync'](_0x40fbf2)) {
                _0x0_0x18bf02['mkdirSync'](_0x40fbf2, { 'recursive': !![] });
            }
            _0x0_0x18bf02['writeFileSync'](dataPath, JSON['stringify'](_0x2ced60, null, 0x2));
        }
        return !![];
    } catch (_0x30a36b) {
        console['error']('Error\x20saving\x20user\x20group\x20data:', _0x30a36b);
        return ![];
    }
}
async function setAntilink(_0x3ab5ab, _0x59811e, _0x5a9e36) {
    try {
        const _0x234865 = await loadUserGroupData();
        if (!_0x234865['antilink'])
            _0x234865['antilink'] = {};
        if (!_0x234865['antilink'][_0x3ab5ab])
            _0x234865['antilink'][_0x3ab5ab] = {};
        _0x234865['antilink'][_0x3ab5ab] = {
            'enabled': _0x59811e === 'on',
            'action': _0x5a9e36 || 'delete'
        };
        await saveUserGroupData(_0x234865);
        return !![];
    } catch (_0x49dad6) {
        console['error']('Error\x20setting\x20antilink:', _0x49dad6);
        return ![];
    }
}
async function getAntilink(_0x85a097, _0x1eabf5) {
    try {
        const _0x5c786e = await loadUserGroupData();
        if (!_0x5c786e['antilink'] || !_0x5c786e['antilink'][_0x85a097])
            return null;
        return _0x1eabf5 === 'on' ? _0x5c786e['antilink'][_0x85a097] : null;
    } catch (_0x37d752) {
        console['error']('Error\x20getting\x20antilink:', _0x37d752);
        return null;
    }
}
async function removeAntilink(_0x1ea92f, _0x52f684) {
    try {
        const _0x15e047 = await loadUserGroupData();
        if (_0x15e047['antilink'] && _0x15e047['antilink'][_0x1ea92f]) {
            delete _0x15e047['antilink'][_0x1ea92f];
            await saveUserGroupData(_0x15e047);
        }
        return !![];
    } catch (_0x3539d0) {
        console['error']('Error\x20removing\x20antilink:', _0x3539d0);
        return ![];
    }
}
async function setAntitag(_0x1788c3, _0x581dd0, _0x587add) {
    try {
        const _0x459d08 = await loadUserGroupData();
        if (!_0x459d08['antitag'])
            _0x459d08['antitag'] = {};
        if (!_0x459d08['antitag'][_0x1788c3])
            _0x459d08['antitag'][_0x1788c3] = {};
        _0x459d08['antitag'][_0x1788c3] = {
            'enabled': _0x581dd0 === 'on',
            'action': _0x587add || 'delete'
        };
        await saveUserGroupData(_0x459d08);
        return !![];
    } catch (_0x29670e) {
        console['error']('Error\x20setting\x20antitag:', _0x29670e);
        return ![];
    }
}
async function getAntitag(_0x460712, _0x2edff2) {
    try {
        const _0x6d4180 = await loadUserGroupData();
        if (!_0x6d4180['antitag'] || !_0x6d4180['antitag'][_0x460712])
            return null;
        return _0x2edff2 === 'on' ? _0x6d4180['antitag'][_0x460712] : null;
    } catch (_0x10176e) {
        console['error']('Error\x20getting\x20antitag:', _0x10176e);
        return null;
    }
}
async function removeAntitag(_0x1f5b52, _0x59434e) {
    try {
        const _0x248b4d = await loadUserGroupData();
        if (_0x248b4d['antitag'] && _0x248b4d['antitag'][_0x1f5b52]) {
            delete _0x248b4d['antitag'][_0x1f5b52];
            await saveUserGroupData(_0x248b4d);
        }
        return !![];
    } catch (_0x1fecc3) {
        console['error']('Error\x20removing\x20antitag:', _0x1fecc3);
        return ![];
    }
}
async function incrementWarningCount(_0x2e5768, _0x1524a4) {
    try {
        const _0x225b9e = await loadUserGroupData();
        if (!_0x225b9e['warnings'])
            _0x225b9e['warnings'] = {};
        if (!_0x225b9e['warnings'][_0x2e5768])
            _0x225b9e['warnings'][_0x2e5768] = {};
        if (!_0x225b9e['warnings'][_0x2e5768][_0x1524a4])
            _0x225b9e['warnings'][_0x2e5768][_0x1524a4] = 0x0;
        _0x225b9e['warnings'][_0x2e5768][_0x1524a4]++;
        await saveUserGroupData(_0x225b9e);
        return _0x225b9e['warnings'][_0x2e5768][_0x1524a4];
    } catch (_0x3e1384) {
        console['error']('Error\x20incrementing\x20warning\x20count:', _0x3e1384);
        return 0x0;
    }
}
async function resetWarningCount(_0x32a82a, _0x35e299) {
    try {
        const _0x340c38 = await loadUserGroupData();
        if (_0x340c38['warnings'] && _0x340c38['warnings'][_0x32a82a] && _0x340c38['warnings'][_0x32a82a][_0x35e299]) {
            _0x340c38['warnings'][_0x32a82a][_0x35e299] = 0x0;
            await saveUserGroupData(_0x340c38);
        }
        return !![];
    } catch (_0x2a6a0d) {
        console['error']('Error\x20resetting\x20warning\x20count:', _0x2a6a0d);
        return ![];
    }
}
async function isSudo(_0x11054b) {
    try {
        const _0x26f4fc = await loadUserGroupData();
        return _0x26f4fc['sudo'] && _0x26f4fc['sudo']['includes'](_0x11054b);
    } catch (_0x49258b) {
        console['error']('Error\x20checking\x20sudo:', _0x49258b);
        return ![];
    }
}
async function addSudo(_0x24beda) {
    try {
        const _0x4e3bc1 = await loadUserGroupData();
        if (!_0x4e3bc1['sudo'])
            _0x4e3bc1['sudo'] = [];
        if (!_0x4e3bc1['sudo']['includes'](_0x24beda)) {
            _0x4e3bc1['sudo']['push'](_0x24beda);
            await saveUserGroupData(_0x4e3bc1);
        }
        return !![];
    } catch (_0x31acd5) {
        console['error']('Error\x20adding\x20sudo:', _0x31acd5);
        return ![];
    }
}
async function removeSudo(_0x2967c7) {
    try {
        const _0x14ed9e = await loadUserGroupData();
        if (!_0x14ed9e['sudo'])
            _0x14ed9e['sudo'] = [];
        const _0x432592 = _0x14ed9e['sudo']['indexOf'](_0x2967c7);
        if (_0x432592 !== -0x1) {
            _0x14ed9e['sudo']['splice'](_0x432592, 0x1);
            await saveUserGroupData(_0x14ed9e);
        }
        return !![];
    } catch (_0x311386) {
        console['error']('Error\x20removing\x20sudo:', _0x311386);
        return ![];
    }
}
async function getSudoList() {
    try {
        const _0x1b3661 = await loadUserGroupData();
        return Array['isArray'](_0x1b3661['sudo']) ? _0x1b3661['sudo'] : [];
    } catch (_0x43d667) {
        console['error']('Error\x20getting\x20sudo\x20list:', _0x43d667);
        return [];
    }
}
async function addWelcome(_0x1ae4e6, _0x44c5e7, _0x58cd2c) {
    try {
        const _0x596ebd = await loadUserGroupData();
        if (!_0x596ebd['welcome'])
            _0x596ebd['welcome'] = {};
        _0x596ebd['welcome'][_0x1ae4e6] = {
            'enabled': _0x44c5e7,
            'message': _0x58cd2c || '╔═⚔️\x20WELCOME\x20⚔️═╗\x0a║\x20🛡️\x20User:\x20{user}\x0a║\x20🏰\x20Kingdom:\x20{group}\x0a╠═══════════════╣\x0a║\x20📜\x20Message:\x0a║\x20{description}\x0a╚═══════════════╝',
            'channelId': '120363429019355682@newsletter'
        };
        await saveUserGroupData(_0x596ebd);
        return !![];
    } catch (_0x5ed0c1) {
        console['error']('Error\x20in\x20addWelcome:', _0x5ed0c1);
        return ![];
    }
}
async function delWelcome(_0x4a9f3d) {
    try {
        const _0x423601 = await loadUserGroupData();
        if (_0x423601['welcome'] && _0x423601['welcome'][_0x4a9f3d]) {
            delete _0x423601['welcome'][_0x4a9f3d];
            await saveUserGroupData(_0x423601);
        }
        return !![];
    } catch (_0x2cf7a2) {
        console['error']('Error\x20in\x20delWelcome:', _0x2cf7a2);
        return ![];
    }
}
async function isWelcomeOn(_0x5516a9) {
    try {
        const _0x39eb8a = await loadUserGroupData();
        return _0x39eb8a['welcome'] && _0x39eb8a['welcome'][_0x5516a9] && _0x39eb8a['welcome'][_0x5516a9]['enabled'];
    } catch (_0x146e47) {
        console['error']('Error\x20in\x20isWelcomeOn:', _0x146e47);
        return ![];
    }
}
async function addGoodbye(_0x58add9, _0x2039ee, _0x4a54b3) {
    try {
        const _0x4adb9e = await loadUserGroupData();
        if (!_0x4adb9e['goodbye'])
            _0x4adb9e['goodbye'] = {};
        _0x4adb9e['goodbye'][_0x58add9] = {
            'enabled': _0x2039ee,
            'message': _0x4a54b3 || '╔═⚔️\x20GOODBYE\x20⚔️═╗\x0a║\x20🛡️\x20User:\x20{user}\x0a║\x20🏰\x20Kingdom:\x20{group}\x0a╠═══════════════╣\x0a║\x20⚰️\x20We\x20will\x20never\x20miss\x20you!\x0a╚═══════════════╝',
            'channelId': '120363429019355682@newsletter'
        };
        await saveUserGroupData(_0x4adb9e);
        return !![];
    } catch (_0x16320d) {
        console['error']('Error\x20in\x20addGoodbye:', _0x16320d);
        return ![];
    }
}
async function delGoodBye(_0x9a3fc4) {
    try {
        const _0x20798c = await loadUserGroupData();
        if (_0x20798c['goodbye'] && _0x20798c['goodbye'][_0x9a3fc4]) {
            delete _0x20798c['goodbye'][_0x9a3fc4];
            await saveUserGroupData(_0x20798c);
        }
        return !![];
    } catch (_0x59b6d0) {
        console['error']('Error\x20in\x20delGoodBye:', _0x59b6d0);
        return ![];
    }
}
async function isGoodByeOn(_0x558e93) {
    try {
        const _0x4dee23 = await loadUserGroupData();
        return _0x4dee23['goodbye'] && _0x4dee23['goodbye'][_0x558e93] && _0x4dee23['goodbye'][_0x558e93]['enabled'];
    } catch (_0x2007ae) {
        console['error']('Error\x20in\x20isGoodByeOn:', _0x2007ae);
        return ![];
    }
}
async function getWelcome(_0x27ad82) {
    try {
        const _0x3073d6 = await loadUserGroupData();
        return _0x3073d6['welcome'] && _0x3073d6['welcome'][_0x27ad82] ? _0x3073d6['welcome'][_0x27ad82]['message'] : null;
    } catch (_0xc5b126) {
        console['error']('Error\x20in\x20getWelcome:', _0xc5b126);
        return null;
    }
}
async function getGoodbye(_0x162c83) {
    try {
        const _0x49a79c = await loadUserGroupData();
        return _0x49a79c['goodbye'] && _0x49a79c['goodbye'][_0x162c83] ? _0x49a79c['goodbye'][_0x162c83]['message'] : null;
    } catch (_0x15836a) {
        console['error']('Error\x20in\x20getGoodbye:', _0x15836a);
        return null;
    }
}
async function setAntiBadword(_0xcc1e12, _0x4a582c, _0x2b54d3) {
    try {
        const _0x296733 = await loadUserGroupData();
        if (!_0x296733['antibadword'])
            _0x296733['antibadword'] = {};
        if (!_0x296733['antibadword'][_0xcc1e12])
            _0x296733['antibadword'][_0xcc1e12] = {};
        _0x296733['antibadword'][_0xcc1e12] = {
            'enabled': _0x4a582c === 'on',
            'action': _0x2b54d3 || 'delete'
        };
        await saveUserGroupData(_0x296733);
        return !![];
    } catch (_0x202aee) {
        console['error']('Error\x20setting\x20antibadword:', _0x202aee);
        return ![];
    }
}
async function getAntiBadword(_0x1ad50c, _0x5119b7) {
    try {
        const _0x1aa485 = await loadUserGroupData();
        if (!_0x1aa485['antibadword'] || !_0x1aa485['antibadword'][_0x1ad50c]) {
            return null;
        }
        const _0x557d2d = _0x1aa485['antibadword'][_0x1ad50c];
        return _0x5119b7 === 'on' ? _0x557d2d : null;
    } catch (_0xbaea98) {
        console['error']('Error\x20getting\x20antibadword:', _0xbaea98);
        return null;
    }
}
async function removeAntiBadword(_0x115928, _0x3b1aea) {
    try {
        const _0x43bb50 = await loadUserGroupData();
        if (_0x43bb50['antibadword'] && _0x43bb50['antibadword'][_0x115928]) {
            delete _0x43bb50['antibadword'][_0x115928];
            await saveUserGroupData(_0x43bb50);
        }
        return !![];
    } catch (_0x4afd1b) {
        console['error']('Error\x20removing\x20antibadword:', _0x4afd1b);
        return ![];
    }
}
async function setChatbot(_0x5004a, _0x587547) {
    try {
        const _0x26ba3c = await loadUserGroupData();
        if (!_0x26ba3c['chatbot'])
            _0x26ba3c['chatbot'] = {};
        _0x26ba3c['chatbot'][_0x5004a] = { 'enabled': _0x587547 };
        await saveUserGroupData(_0x26ba3c);
        return !![];
    } catch (_0x32a14a) {
        console['error']('Error\x20setting\x20chatbot:', _0x32a14a);
        return ![];
    }
}
async function getChatbot(_0x33edb9) {
    try {
        const _0x14dcb6 = await loadUserGroupData();
        return _0x14dcb6['chatbot']?.[_0x33edb9] || null;
    } catch (_0x3b9eff) {
        console['error']('Error\x20getting\x20chatbot:', _0x3b9eff);
        return null;
    }
}
async function removeChatbot(_0x9e37ac) {
    try {
        const _0x4e35e5 = await loadUserGroupData();
        if (_0x4e35e5['chatbot'] && _0x4e35e5['chatbot'][_0x9e37ac]) {
            delete _0x4e35e5['chatbot'][_0x9e37ac];
            await saveUserGroupData(_0x4e35e5);
        }
        return !![];
    } catch (_0xf8a4fb) {
        console['error']('Error\x20removing\x20chatbot:', _0xf8a4fb);
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