import { fileURLToPath } from 'url';
import _0x0_0x153fbe, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x3a7676 from 'fs';
import { dataFile } from './paths.js';
import _0x0_0x422093 from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const dataPath = dataFile('userGroupData.json');
async function loadUserGroupData() {
    try {
        if (HAS_DB) {
            const _0x4970cb = await _0x0_0x422093['getSetting']('global', 'userGroupData');
            return _0x4970cb || {
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
            if (!_0x0_0x3a7676['existsSync'](dataPath)) {
                const _0x21c042 = {
                    'antibadword': {},
                    'antilink': {},
                    'welcome': {},
                    'goodbye': {},
                    'chatbot': {},
                    'warnings': {},
                    'sudo': [],
                    'antitag': {}
                };
                _0x0_0x3a7676['writeFileSync'](dataPath, JSON['stringify'](_0x21c042, null, 0x2));
                return _0x21c042;
            }
            const _0x2dbd89 = JSON['parse'](_0x0_0x3a7676['readFileSync'](dataPath, 'utf8'));
            return _0x2dbd89;
        }
    } catch (_0x51a6ea) {
        console['error']('Error\x20loading\x20user\x20group\x20data:', _0x51a6ea);
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
async function saveUserGroupData(_0x206097) {
    try {
        if (HAS_DB) {
            await _0x0_0x422093['saveSetting']('global', 'userGroupData', _0x206097);
        } else {
            const _0x46fada = _0x0_0x153fbe['dirname'](dataPath);
            if (!_0x0_0x3a7676['existsSync'](_0x46fada)) {
                _0x0_0x3a7676['mkdirSync'](_0x46fada, { 'recursive': !![] });
            }
            _0x0_0x3a7676['writeFileSync'](dataPath, JSON['stringify'](_0x206097, null, 0x2));
        }
        return !![];
    } catch (_0x28ca78) {
        console['error']('Error\x20saving\x20user\x20group\x20data:', _0x28ca78);
        return ![];
    }
}
async function setAntilink(_0x127f0e, _0x1e6062, _0x10a4e) {
    try {
        const _0x52ea27 = await loadUserGroupData();
        if (!_0x52ea27['antilink'])
            _0x52ea27['antilink'] = {};
        if (!_0x52ea27['antilink'][_0x127f0e])
            _0x52ea27['antilink'][_0x127f0e] = {};
        _0x52ea27['antilink'][_0x127f0e] = {
            'enabled': _0x1e6062 === 'on',
            'action': _0x10a4e || 'delete'
        };
        await saveUserGroupData(_0x52ea27);
        return !![];
    } catch (_0x23a183) {
        console['error']('Error\x20setting\x20antilink:', _0x23a183);
        return ![];
    }
}
async function getAntilink(_0x52a9df, _0x1a4747) {
    try {
        const _0x558cea = await loadUserGroupData();
        if (!_0x558cea['antilink'] || !_0x558cea['antilink'][_0x52a9df])
            return null;
        return _0x1a4747 === 'on' ? _0x558cea['antilink'][_0x52a9df] : null;
    } catch (_0x569407) {
        console['error']('Error\x20getting\x20antilink:', _0x569407);
        return null;
    }
}
async function removeAntilink(_0x524270, _0x1a47f9) {
    try {
        const _0x3e95e1 = await loadUserGroupData();
        if (_0x3e95e1['antilink'] && _0x3e95e1['antilink'][_0x524270]) {
            delete _0x3e95e1['antilink'][_0x524270];
            await saveUserGroupData(_0x3e95e1);
        }
        return !![];
    } catch (_0x1dcd3b) {
        console['error']('Error\x20removing\x20antilink:', _0x1dcd3b);
        return ![];
    }
}
async function setAntitag(_0x5322be, _0x465a13, _0x4a9007) {
    try {
        const _0x49d40b = await loadUserGroupData();
        if (!_0x49d40b['antitag'])
            _0x49d40b['antitag'] = {};
        if (!_0x49d40b['antitag'][_0x5322be])
            _0x49d40b['antitag'][_0x5322be] = {};
        _0x49d40b['antitag'][_0x5322be] = {
            'enabled': _0x465a13 === 'on',
            'action': _0x4a9007 || 'delete'
        };
        await saveUserGroupData(_0x49d40b);
        return !![];
    } catch (_0x22ab65) {
        console['error']('Error\x20setting\x20antitag:', _0x22ab65);
        return ![];
    }
}
async function getAntitag(_0x3b1495, _0x59cc4d) {
    try {
        const _0x74cadd = await loadUserGroupData();
        if (!_0x74cadd['antitag'] || !_0x74cadd['antitag'][_0x3b1495])
            return null;
        return _0x59cc4d === 'on' ? _0x74cadd['antitag'][_0x3b1495] : null;
    } catch (_0x31e19a) {
        console['error']('Error\x20getting\x20antitag:', _0x31e19a);
        return null;
    }
}
async function removeAntitag(_0x4f6d1e, _0x56bd5b) {
    try {
        const _0x4783db = await loadUserGroupData();
        if (_0x4783db['antitag'] && _0x4783db['antitag'][_0x4f6d1e]) {
            delete _0x4783db['antitag'][_0x4f6d1e];
            await saveUserGroupData(_0x4783db);
        }
        return !![];
    } catch (_0x15cbc5) {
        console['error']('Error\x20removing\x20antitag:', _0x15cbc5);
        return ![];
    }
}
async function incrementWarningCount(_0x5224a2, _0x2a73c2) {
    try {
        const _0x64e5ef = await loadUserGroupData();
        if (!_0x64e5ef['warnings'])
            _0x64e5ef['warnings'] = {};
        if (!_0x64e5ef['warnings'][_0x5224a2])
            _0x64e5ef['warnings'][_0x5224a2] = {};
        if (!_0x64e5ef['warnings'][_0x5224a2][_0x2a73c2])
            _0x64e5ef['warnings'][_0x5224a2][_0x2a73c2] = 0x0;
        _0x64e5ef['warnings'][_0x5224a2][_0x2a73c2]++;
        await saveUserGroupData(_0x64e5ef);
        return _0x64e5ef['warnings'][_0x5224a2][_0x2a73c2];
    } catch (_0x4a48fa) {
        console['error']('Error\x20incrementing\x20warning\x20count:', _0x4a48fa);
        return 0x0;
    }
}
async function resetWarningCount(_0x5af431, _0x31fb25) {
    try {
        const _0x3fdcab = await loadUserGroupData();
        if (_0x3fdcab['warnings'] && _0x3fdcab['warnings'][_0x5af431] && _0x3fdcab['warnings'][_0x5af431][_0x31fb25]) {
            _0x3fdcab['warnings'][_0x5af431][_0x31fb25] = 0x0;
            await saveUserGroupData(_0x3fdcab);
        }
        return !![];
    } catch (_0x42022f) {
        console['error']('Error\x20resetting\x20warning\x20count:', _0x42022f);
        return ![];
    }
}
async function isSudo(_0x4644b2) {
    try {
        const _0x118cd0 = await loadUserGroupData();
        return _0x118cd0['sudo'] && _0x118cd0['sudo']['includes'](_0x4644b2);
    } catch (_0x7c796b) {
        console['error']('Error\x20checking\x20sudo:', _0x7c796b);
        return ![];
    }
}
async function addSudo(_0x549eb9) {
    try {
        const _0x4f236a = await loadUserGroupData();
        if (!_0x4f236a['sudo'])
            _0x4f236a['sudo'] = [];
        if (!_0x4f236a['sudo']['includes'](_0x549eb9)) {
            _0x4f236a['sudo']['push'](_0x549eb9);
            await saveUserGroupData(_0x4f236a);
        }
        return !![];
    } catch (_0x3f8da2) {
        console['error']('Error\x20adding\x20sudo:', _0x3f8da2);
        return ![];
    }
}
async function removeSudo(_0x170f7c) {
    try {
        const _0x5a389f = await loadUserGroupData();
        if (!_0x5a389f['sudo'])
            _0x5a389f['sudo'] = [];
        const _0x415f03 = _0x5a389f['sudo']['indexOf'](_0x170f7c);
        if (_0x415f03 !== -0x1) {
            _0x5a389f['sudo']['splice'](_0x415f03, 0x1);
            await saveUserGroupData(_0x5a389f);
        }
        return !![];
    } catch (_0x1ddbc6) {
        console['error']('Error\x20removing\x20sudo:', _0x1ddbc6);
        return ![];
    }
}
async function getSudoList() {
    try {
        const _0x31f9dc = await loadUserGroupData();
        return Array['isArray'](_0x31f9dc['sudo']) ? _0x31f9dc['sudo'] : [];
    } catch (_0x45fc0e) {
        console['error']('Error\x20getting\x20sudo\x20list:', _0x45fc0e);
        return [];
    }
}
async function addWelcome(_0x3b4f8f, _0x129cbd, _0x1fc5f3) {
    try {
        const _0x1856c4 = await loadUserGroupData();
        if (!_0x1856c4['welcome'])
            _0x1856c4['welcome'] = {};
        _0x1856c4['welcome'][_0x3b4f8f] = {
            'enabled': _0x129cbd,
            'message': _0x1fc5f3 || '╔═⚔️\x20WELCOME\x20⚔️═╗\x0a║\x20🛡️\x20User:\x20{user}\x0a║\x20🏰\x20Kingdom:\x20{group}\x0a╠═══════════════╣\x0a║\x20📜\x20Message:\x0a║\x20{description}\x0a╚═══════════════╝',
            'channelId': '120363429019355682@newsletter'
        };
        await saveUserGroupData(_0x1856c4);
        return !![];
    } catch (_0x39c5f9) {
        console['error']('Error\x20in\x20addWelcome:', _0x39c5f9);
        return ![];
    }
}
async function delWelcome(_0x14141f) {
    try {
        const _0x1bf1fd = await loadUserGroupData();
        if (_0x1bf1fd['welcome'] && _0x1bf1fd['welcome'][_0x14141f]) {
            delete _0x1bf1fd['welcome'][_0x14141f];
            await saveUserGroupData(_0x1bf1fd);
        }
        return !![];
    } catch (_0x12badc) {
        console['error']('Error\x20in\x20delWelcome:', _0x12badc);
        return ![];
    }
}
async function isWelcomeOn(_0x54cd14) {
    try {
        const _0x379dd7 = await loadUserGroupData();
        return _0x379dd7['welcome'] && _0x379dd7['welcome'][_0x54cd14] && _0x379dd7['welcome'][_0x54cd14]['enabled'];
    } catch (_0x5ab4de) {
        console['error']('Error\x20in\x20isWelcomeOn:', _0x5ab4de);
        return ![];
    }
}
async function addGoodbye(_0x22ba9f, _0x5b3d64, _0x3d2cfb) {
    try {
        const _0x12a1e1 = await loadUserGroupData();
        if (!_0x12a1e1['goodbye'])
            _0x12a1e1['goodbye'] = {};
        _0x12a1e1['goodbye'][_0x22ba9f] = {
            'enabled': _0x5b3d64,
            'message': _0x3d2cfb || '╔═⚔️\x20GOODBYE\x20⚔️═╗\x0a║\x20🛡️\x20User:\x20{user}\x0a║\x20🏰\x20Kingdom:\x20{group}\x0a╠═══════════════╣\x0a║\x20⚰️\x20We\x20will\x20never\x20miss\x20you!\x0a╚═══════════════╝',
            'channelId': '120363429019355682@newsletter'
        };
        await saveUserGroupData(_0x12a1e1);
        return !![];
    } catch (_0x34d6d1) {
        console['error']('Error\x20in\x20addGoodbye:', _0x34d6d1);
        return ![];
    }
}
async function delGoodBye(_0x11eae1) {
    try {
        const _0x3945d5 = await loadUserGroupData();
        if (_0x3945d5['goodbye'] && _0x3945d5['goodbye'][_0x11eae1]) {
            delete _0x3945d5['goodbye'][_0x11eae1];
            await saveUserGroupData(_0x3945d5);
        }
        return !![];
    } catch (_0x446f02) {
        console['error']('Error\x20in\x20delGoodBye:', _0x446f02);
        return ![];
    }
}
async function isGoodByeOn(_0x52af9a) {
    try {
        const _0x5ed698 = await loadUserGroupData();
        return _0x5ed698['goodbye'] && _0x5ed698['goodbye'][_0x52af9a] && _0x5ed698['goodbye'][_0x52af9a]['enabled'];
    } catch (_0x110035) {
        console['error']('Error\x20in\x20isGoodByeOn:', _0x110035);
        return ![];
    }
}
async function getWelcome(_0xfc1466) {
    try {
        const _0x3d5961 = await loadUserGroupData();
        return _0x3d5961['welcome'] && _0x3d5961['welcome'][_0xfc1466] ? _0x3d5961['welcome'][_0xfc1466]['message'] : null;
    } catch (_0x5b6c4c) {
        console['error']('Error\x20in\x20getWelcome:', _0x5b6c4c);
        return null;
    }
}
async function getGoodbye(_0x20f378) {
    try {
        const _0x53e89d = await loadUserGroupData();
        return _0x53e89d['goodbye'] && _0x53e89d['goodbye'][_0x20f378] ? _0x53e89d['goodbye'][_0x20f378]['message'] : null;
    } catch (_0x5be95c) {
        console['error']('Error\x20in\x20getGoodbye:', _0x5be95c);
        return null;
    }
}
async function setAntiBadword(_0x17a417, _0x94f395, _0x1eb7cb) {
    try {
        const _0xd34117 = await loadUserGroupData();
        if (!_0xd34117['antibadword'])
            _0xd34117['antibadword'] = {};
        if (!_0xd34117['antibadword'][_0x17a417])
            _0xd34117['antibadword'][_0x17a417] = {};
        _0xd34117['antibadword'][_0x17a417] = {
            'enabled': _0x94f395 === 'on',
            'action': _0x1eb7cb || 'delete'
        };
        await saveUserGroupData(_0xd34117);
        return !![];
    } catch (_0x17222d) {
        console['error']('Error\x20setting\x20antibadword:', _0x17222d);
        return ![];
    }
}
async function getAntiBadword(_0x1e0c20, _0x246dcf) {
    try {
        const _0x1dec0c = await loadUserGroupData();
        if (!_0x1dec0c['antibadword'] || !_0x1dec0c['antibadword'][_0x1e0c20]) {
            return null;
        }
        const _0xe2dd52 = _0x1dec0c['antibadword'][_0x1e0c20];
        return _0x246dcf === 'on' ? _0xe2dd52 : null;
    } catch (_0x4ab61e) {
        console['error']('Error\x20getting\x20antibadword:', _0x4ab61e);
        return null;
    }
}
async function removeAntiBadword(_0x52a39b, _0x3ffe03) {
    try {
        const _0x20b4d9 = await loadUserGroupData();
        if (_0x20b4d9['antibadword'] && _0x20b4d9['antibadword'][_0x52a39b]) {
            delete _0x20b4d9['antibadword'][_0x52a39b];
            await saveUserGroupData(_0x20b4d9);
        }
        return !![];
    } catch (_0x1cde16) {
        console['error']('Error\x20removing\x20antibadword:', _0x1cde16);
        return ![];
    }
}
async function setChatbot(_0xebc86e, _0x274843) {
    try {
        const _0x28e849 = await loadUserGroupData();
        if (!_0x28e849['chatbot'])
            _0x28e849['chatbot'] = {};
        _0x28e849['chatbot'][_0xebc86e] = { 'enabled': _0x274843 };
        await saveUserGroupData(_0x28e849);
        return !![];
    } catch (_0x15992b) {
        console['error']('Error\x20setting\x20chatbot:', _0x15992b);
        return ![];
    }
}
async function getChatbot(_0x55e2a8) {
    try {
        const _0x2024da = await loadUserGroupData();
        return _0x2024da['chatbot']?.[_0x55e2a8] || null;
    } catch (_0x4d5612) {
        console['error']('Error\x20getting\x20chatbot:', _0x4d5612);
        return null;
    }
}
async function removeChatbot(_0x8a782e) {
    try {
        const _0x4625de = await loadUserGroupData();
        if (_0x4625de['chatbot'] && _0x4625de['chatbot'][_0x8a782e]) {
            delete _0x4625de['chatbot'][_0x8a782e];
            await saveUserGroupData(_0x4625de);
        }
        return !![];
    } catch (_0x26dd1b) {
        console['error']('Error\x20removing\x20chatbot:', _0x26dd1b);
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