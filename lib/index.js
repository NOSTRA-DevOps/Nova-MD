import { fileURLToPath } from 'url';
import _0x0_0x174667, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x4792c5 from 'fs';
import { dataFile } from './paths.js';
import _0x0_0xee5bcb from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const dataPath = dataFile('userGroupData.json');
async function loadUserGroupData() {
    try {
        if (HAS_DB) {
            const _0x3639db = await _0x0_0xee5bcb['getSetting']('global', 'userGroupData');
            return _0x3639db || {
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
            if (!_0x0_0x4792c5['existsSync'](dataPath)) {
                const _0x266c17 = {
                    'antibadword': {},
                    'antilink': {},
                    'welcome': {},
                    'goodbye': {},
                    'chatbot': {},
                    'warnings': {},
                    'sudo': [],
                    'antitag': {}
                };
                _0x0_0x4792c5['writeFileSync'](dataPath, JSON['stringify'](_0x266c17, null, 0x2));
                return _0x266c17;
            }
            const _0x2ade0c = JSON['parse'](_0x0_0x4792c5['readFileSync'](dataPath, 'utf8'));
            return _0x2ade0c;
        }
    } catch (_0x53243f) {
        console['error']('Error\x20loading\x20user\x20group\x20data:', _0x53243f);
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
async function saveUserGroupData(_0x371ab1) {
    try {
        if (HAS_DB) {
            await _0x0_0xee5bcb['saveSetting']('global', 'userGroupData', _0x371ab1);
        } else {
            const _0x265953 = _0x0_0x174667['dirname'](dataPath);
            if (!_0x0_0x4792c5['existsSync'](_0x265953)) {
                _0x0_0x4792c5['mkdirSync'](_0x265953, { 'recursive': !![] });
            }
            _0x0_0x4792c5['writeFileSync'](dataPath, JSON['stringify'](_0x371ab1, null, 0x2));
        }
        return !![];
    } catch (_0x2e033d) {
        console['error']('Error\x20saving\x20user\x20group\x20data:', _0x2e033d);
        return ![];
    }
}
async function setAntilink(_0x4f3a5a, _0x25aeed, _0x577699) {
    try {
        const _0x2da5f4 = await loadUserGroupData();
        if (!_0x2da5f4['antilink'])
            _0x2da5f4['antilink'] = {};
        if (!_0x2da5f4['antilink'][_0x4f3a5a])
            _0x2da5f4['antilink'][_0x4f3a5a] = {};
        _0x2da5f4['antilink'][_0x4f3a5a] = {
            'enabled': _0x25aeed === 'on',
            'action': _0x577699 || 'delete'
        };
        await saveUserGroupData(_0x2da5f4);
        return !![];
    } catch (_0x40d512) {
        console['error']('Error\x20setting\x20antilink:', _0x40d512);
        return ![];
    }
}
async function getAntilink(_0x5c7e9b, _0x273732) {
    try {
        const _0x26dba0 = await loadUserGroupData();
        if (!_0x26dba0['antilink'] || !_0x26dba0['antilink'][_0x5c7e9b])
            return null;
        return _0x273732 === 'on' ? _0x26dba0['antilink'][_0x5c7e9b] : null;
    } catch (_0x3e2293) {
        console['error']('Error\x20getting\x20antilink:', _0x3e2293);
        return null;
    }
}
async function removeAntilink(_0x1ba0ec, _0xaf78f0) {
    try {
        const _0x226d81 = await loadUserGroupData();
        if (_0x226d81['antilink'] && _0x226d81['antilink'][_0x1ba0ec]) {
            delete _0x226d81['antilink'][_0x1ba0ec];
            await saveUserGroupData(_0x226d81);
        }
        return !![];
    } catch (_0x5932a5) {
        console['error']('Error\x20removing\x20antilink:', _0x5932a5);
        return ![];
    }
}
async function setAntitag(_0x304b55, _0x5728e3, _0x475381) {
    try {
        const _0x472055 = await loadUserGroupData();
        if (!_0x472055['antitag'])
            _0x472055['antitag'] = {};
        if (!_0x472055['antitag'][_0x304b55])
            _0x472055['antitag'][_0x304b55] = {};
        _0x472055['antitag'][_0x304b55] = {
            'enabled': _0x5728e3 === 'on',
            'action': _0x475381 || 'delete'
        };
        await saveUserGroupData(_0x472055);
        return !![];
    } catch (_0x317f41) {
        console['error']('Error\x20setting\x20antitag:', _0x317f41);
        return ![];
    }
}
async function getAntitag(_0x4a1765, _0x44eb25) {
    try {
        const _0x137669 = await loadUserGroupData();
        if (!_0x137669['antitag'] || !_0x137669['antitag'][_0x4a1765])
            return null;
        return _0x44eb25 === 'on' ? _0x137669['antitag'][_0x4a1765] : null;
    } catch (_0x1c8801) {
        console['error']('Error\x20getting\x20antitag:', _0x1c8801);
        return null;
    }
}
async function removeAntitag(_0x2a47ac, _0x109964) {
    try {
        const _0x2bbbcd = await loadUserGroupData();
        if (_0x2bbbcd['antitag'] && _0x2bbbcd['antitag'][_0x2a47ac]) {
            delete _0x2bbbcd['antitag'][_0x2a47ac];
            await saveUserGroupData(_0x2bbbcd);
        }
        return !![];
    } catch (_0x47e859) {
        console['error']('Error\x20removing\x20antitag:', _0x47e859);
        return ![];
    }
}
async function incrementWarningCount(_0x4e690d, _0x2de506) {
    try {
        const _0x402c73 = await loadUserGroupData();
        if (!_0x402c73['warnings'])
            _0x402c73['warnings'] = {};
        if (!_0x402c73['warnings'][_0x4e690d])
            _0x402c73['warnings'][_0x4e690d] = {};
        if (!_0x402c73['warnings'][_0x4e690d][_0x2de506])
            _0x402c73['warnings'][_0x4e690d][_0x2de506] = 0x0;
        _0x402c73['warnings'][_0x4e690d][_0x2de506]++;
        await saveUserGroupData(_0x402c73);
        return _0x402c73['warnings'][_0x4e690d][_0x2de506];
    } catch (_0x3da55c) {
        console['error']('Error\x20incrementing\x20warning\x20count:', _0x3da55c);
        return 0x0;
    }
}
async function resetWarningCount(_0x5b9ff7, _0x4b7c66) {
    try {
        const _0x3f61b5 = await loadUserGroupData();
        if (_0x3f61b5['warnings'] && _0x3f61b5['warnings'][_0x5b9ff7] && _0x3f61b5['warnings'][_0x5b9ff7][_0x4b7c66]) {
            _0x3f61b5['warnings'][_0x5b9ff7][_0x4b7c66] = 0x0;
            await saveUserGroupData(_0x3f61b5);
        }
        return !![];
    } catch (_0x226b49) {
        console['error']('Error\x20resetting\x20warning\x20count:', _0x226b49);
        return ![];
    }
}
async function isSudo(_0x910117) {
    try {
        const _0x1749dc = await loadUserGroupData();
        return _0x1749dc['sudo'] && _0x1749dc['sudo']['includes'](_0x910117);
    } catch (_0x4e399b) {
        console['error']('Error\x20checking\x20sudo:', _0x4e399b);
        return ![];
    }
}
async function addSudo(_0x5dc0e7) {
    try {
        const _0x5ce807 = await loadUserGroupData();
        if (!_0x5ce807['sudo'])
            _0x5ce807['sudo'] = [];
        if (!_0x5ce807['sudo']['includes'](_0x5dc0e7)) {
            _0x5ce807['sudo']['push'](_0x5dc0e7);
            await saveUserGroupData(_0x5ce807);
        }
        return !![];
    } catch (_0x390f73) {
        console['error']('Error\x20adding\x20sudo:', _0x390f73);
        return ![];
    }
}
async function removeSudo(_0x1fd181) {
    try {
        const _0x4c940d = await loadUserGroupData();
        if (!_0x4c940d['sudo'])
            _0x4c940d['sudo'] = [];
        const _0x4a1e0c = _0x4c940d['sudo']['indexOf'](_0x1fd181);
        if (_0x4a1e0c !== -0x1) {
            _0x4c940d['sudo']['splice'](_0x4a1e0c, 0x1);
            await saveUserGroupData(_0x4c940d);
        }
        return !![];
    } catch (_0x48e420) {
        console['error']('Error\x20removing\x20sudo:', _0x48e420);
        return ![];
    }
}
async function getSudoList() {
    try {
        const _0x5310e5 = await loadUserGroupData();
        return Array['isArray'](_0x5310e5['sudo']) ? _0x5310e5['sudo'] : [];
    } catch (_0x60fe8e) {
        console['error']('Error\x20getting\x20sudo\x20list:', _0x60fe8e);
        return [];
    }
}
async function addWelcome(_0x585333, _0x300fe4, _0x14cc3f) {
    try {
        const _0x470c71 = await loadUserGroupData();
        if (!_0x470c71['welcome'])
            _0x470c71['welcome'] = {};
        _0x470c71['welcome'][_0x585333] = {
            'enabled': _0x300fe4,
            'message': _0x14cc3f || '╔═⚔️\x20WELCOME\x20⚔️═╗\x0a║\x20🛡️\x20User:\x20{user}\x0a║\x20🏰\x20Kingdom:\x20{group}\x0a╠═══════════════╣\x0a║\x20📜\x20Message:\x0a║\x20{description}\x0a╚═══════════════╝',
            'channelId': '120363429019355682@newsletter'
        };
        await saveUserGroupData(_0x470c71);
        return !![];
    } catch (_0x18b514) {
        console['error']('Error\x20in\x20addWelcome:', _0x18b514);
        return ![];
    }
}
async function delWelcome(_0x37bb82) {
    try {
        const _0x5b73db = await loadUserGroupData();
        if (_0x5b73db['welcome'] && _0x5b73db['welcome'][_0x37bb82]) {
            delete _0x5b73db['welcome'][_0x37bb82];
            await saveUserGroupData(_0x5b73db);
        }
        return !![];
    } catch (_0x343c07) {
        console['error']('Error\x20in\x20delWelcome:', _0x343c07);
        return ![];
    }
}
async function isWelcomeOn(_0x11b8c0) {
    try {
        const _0x3626e7 = await loadUserGroupData();
        return _0x3626e7['welcome'] && _0x3626e7['welcome'][_0x11b8c0] && _0x3626e7['welcome'][_0x11b8c0]['enabled'];
    } catch (_0x21db44) {
        console['error']('Error\x20in\x20isWelcomeOn:', _0x21db44);
        return ![];
    }
}
async function addGoodbye(_0x5e43e4, _0x2fc900, _0x3a8044) {
    try {
        const _0x51db09 = await loadUserGroupData();
        if (!_0x51db09['goodbye'])
            _0x51db09['goodbye'] = {};
        _0x51db09['goodbye'][_0x5e43e4] = {
            'enabled': _0x2fc900,
            'message': _0x3a8044 || '╔═⚔️\x20GOODBYE\x20⚔️═╗\x0a║\x20🛡️\x20User:\x20{user}\x0a║\x20🏰\x20Kingdom:\x20{group}\x0a╠═══════════════╣\x0a║\x20⚰️\x20We\x20will\x20never\x20miss\x20you!\x0a╚═══════════════╝',
            'channelId': '120363429019355682@newsletter'
        };
        await saveUserGroupData(_0x51db09);
        return !![];
    } catch (_0x1b0d85) {
        console['error']('Error\x20in\x20addGoodbye:', _0x1b0d85);
        return ![];
    }
}
async function delGoodBye(_0x55c679) {
    try {
        const _0xc9914f = await loadUserGroupData();
        if (_0xc9914f['goodbye'] && _0xc9914f['goodbye'][_0x55c679]) {
            delete _0xc9914f['goodbye'][_0x55c679];
            await saveUserGroupData(_0xc9914f);
        }
        return !![];
    } catch (_0xb9af68) {
        console['error']('Error\x20in\x20delGoodBye:', _0xb9af68);
        return ![];
    }
}
async function isGoodByeOn(_0x44d584) {
    try {
        const _0x32dcb0 = await loadUserGroupData();
        return _0x32dcb0['goodbye'] && _0x32dcb0['goodbye'][_0x44d584] && _0x32dcb0['goodbye'][_0x44d584]['enabled'];
    } catch (_0x4dd2df) {
        console['error']('Error\x20in\x20isGoodByeOn:', _0x4dd2df);
        return ![];
    }
}
async function getWelcome(_0x5c0d83) {
    try {
        const _0x4b1e28 = await loadUserGroupData();
        return _0x4b1e28['welcome'] && _0x4b1e28['welcome'][_0x5c0d83] ? _0x4b1e28['welcome'][_0x5c0d83]['message'] : null;
    } catch (_0x4fb4bf) {
        console['error']('Error\x20in\x20getWelcome:', _0x4fb4bf);
        return null;
    }
}
async function getGoodbye(_0x7e98af) {
    try {
        const _0x5c6ee1 = await loadUserGroupData();
        return _0x5c6ee1['goodbye'] && _0x5c6ee1['goodbye'][_0x7e98af] ? _0x5c6ee1['goodbye'][_0x7e98af]['message'] : null;
    } catch (_0x19fe88) {
        console['error']('Error\x20in\x20getGoodbye:', _0x19fe88);
        return null;
    }
}
async function setAntiBadword(_0x1ea461, _0x2d6c21, _0x41de26) {
    try {
        const _0x51accb = await loadUserGroupData();
        if (!_0x51accb['antibadword'])
            _0x51accb['antibadword'] = {};
        if (!_0x51accb['antibadword'][_0x1ea461])
            _0x51accb['antibadword'][_0x1ea461] = {};
        _0x51accb['antibadword'][_0x1ea461] = {
            'enabled': _0x2d6c21 === 'on',
            'action': _0x41de26 || 'delete'
        };
        await saveUserGroupData(_0x51accb);
        return !![];
    } catch (_0x2394b7) {
        console['error']('Error\x20setting\x20antibadword:', _0x2394b7);
        return ![];
    }
}
async function getAntiBadword(_0x59c544, _0x3dd665) {
    try {
        const _0x23b4ee = await loadUserGroupData();
        if (!_0x23b4ee['antibadword'] || !_0x23b4ee['antibadword'][_0x59c544]) {
            return null;
        }
        const _0xa86ac5 = _0x23b4ee['antibadword'][_0x59c544];
        return _0x3dd665 === 'on' ? _0xa86ac5 : null;
    } catch (_0x4cd774) {
        console['error']('Error\x20getting\x20antibadword:', _0x4cd774);
        return null;
    }
}
async function removeAntiBadword(_0x3a7200, _0x282832) {
    try {
        const _0x29e371 = await loadUserGroupData();
        if (_0x29e371['antibadword'] && _0x29e371['antibadword'][_0x3a7200]) {
            delete _0x29e371['antibadword'][_0x3a7200];
            await saveUserGroupData(_0x29e371);
        }
        return !![];
    } catch (_0x422af0) {
        console['error']('Error\x20removing\x20antibadword:', _0x422af0);
        return ![];
    }
}
async function setChatbot(_0x23bc14, _0x19a455) {
    try {
        const _0x544cf0 = await loadUserGroupData();
        if (!_0x544cf0['chatbot'])
            _0x544cf0['chatbot'] = {};
        _0x544cf0['chatbot'][_0x23bc14] = { 'enabled': _0x19a455 };
        await saveUserGroupData(_0x544cf0);
        return !![];
    } catch (_0x349348) {
        console['error']('Error\x20setting\x20chatbot:', _0x349348);
        return ![];
    }
}
async function getChatbot(_0x517b5b) {
    try {
        const _0x2a0d8a = await loadUserGroupData();
        return _0x2a0d8a['chatbot']?.[_0x517b5b] || null;
    } catch (_0x48235a) {
        console['error']('Error\x20getting\x20chatbot:', _0x48235a);
        return null;
    }
}
async function removeChatbot(_0xccc214) {
    try {
        const _0x35d4c1 = await loadUserGroupData();
        if (_0x35d4c1['chatbot'] && _0x35d4c1['chatbot'][_0xccc214]) {
            delete _0x35d4c1['chatbot'][_0xccc214];
            await saveUserGroupData(_0x35d4c1);
        }
        return !![];
    } catch (_0x3770d5) {
        console['error']('Error\x20removing\x20chatbot:', _0x3770d5);
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