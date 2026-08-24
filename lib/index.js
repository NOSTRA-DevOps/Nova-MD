import { fileURLToPath } from 'url';
import _0x0_0x43b41d, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x3ee2ae from 'fs';
import { dataFile } from './paths.js';
import _0x0_0x43b3f3 from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const dataPath = dataFile('userGroupData.json');
async function loadUserGroupData() {
    try {
        if (HAS_DB) {
            const _0x398700 = await _0x0_0x43b3f3['getSetting']('global', 'userGroupData');
            return _0x398700 || {
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
            if (!_0x0_0x3ee2ae['existsSync'](dataPath)) {
                const _0xc50d1b = {
                    'antibadword': {},
                    'antilink': {},
                    'welcome': {},
                    'goodbye': {},
                    'chatbot': {},
                    'warnings': {},
                    'sudo': [],
                    'antitag': {}
                };
                _0x0_0x3ee2ae['writeFileSync'](dataPath, JSON['stringify'](_0xc50d1b, null, 0x2));
                return _0xc50d1b;
            }
            const _0x6a4085 = JSON['parse'](_0x0_0x3ee2ae['readFileSync'](dataPath, 'utf8'));
            return _0x6a4085;
        }
    } catch (_0x414439) {
        console['error']('Error\x20loading\x20user\x20group\x20data:', _0x414439);
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
async function saveUserGroupData(_0x3f7736) {
    try {
        if (HAS_DB) {
            await _0x0_0x43b3f3['saveSetting']('global', 'userGroupData', _0x3f7736);
        } else {
            const _0x2dd0b2 = _0x0_0x43b41d['dirname'](dataPath);
            if (!_0x0_0x3ee2ae['existsSync'](_0x2dd0b2)) {
                _0x0_0x3ee2ae['mkdirSync'](_0x2dd0b2, { 'recursive': !![] });
            }
            _0x0_0x3ee2ae['writeFileSync'](dataPath, JSON['stringify'](_0x3f7736, null, 0x2));
        }
        return !![];
    } catch (_0x44b6e6) {
        console['error']('Error\x20saving\x20user\x20group\x20data:', _0x44b6e6);
        return ![];
    }
}
async function setAntilink(_0x2d45c1, _0x568a79, _0x52c3be) {
    try {
        const _0x4f11d5 = await loadUserGroupData();
        if (!_0x4f11d5['antilink'])
            _0x4f11d5['antilink'] = {};
        if (!_0x4f11d5['antilink'][_0x2d45c1])
            _0x4f11d5['antilink'][_0x2d45c1] = {};
        _0x4f11d5['antilink'][_0x2d45c1] = {
            'enabled': _0x568a79 === 'on',
            'action': _0x52c3be || 'delete'
        };
        await saveUserGroupData(_0x4f11d5);
        return !![];
    } catch (_0x53f8f5) {
        console['error']('Error\x20setting\x20antilink:', _0x53f8f5);
        return ![];
    }
}
async function getAntilink(_0x5ec53e, _0x143482) {
    try {
        const _0x1d06c7 = await loadUserGroupData();
        if (!_0x1d06c7['antilink'] || !_0x1d06c7['antilink'][_0x5ec53e])
            return null;
        return _0x143482 === 'on' ? _0x1d06c7['antilink'][_0x5ec53e] : null;
    } catch (_0x5914d5) {
        console['error']('Error\x20getting\x20antilink:', _0x5914d5);
        return null;
    }
}
async function removeAntilink(_0x191323, _0x10a12b) {
    try {
        const _0x153a4d = await loadUserGroupData();
        if (_0x153a4d['antilink'] && _0x153a4d['antilink'][_0x191323]) {
            delete _0x153a4d['antilink'][_0x191323];
            await saveUserGroupData(_0x153a4d);
        }
        return !![];
    } catch (_0xba7022) {
        console['error']('Error\x20removing\x20antilink:', _0xba7022);
        return ![];
    }
}
async function setAntitag(_0x3ee265, _0xa4e6a8, _0x3289ad) {
    try {
        const _0x45ec92 = await loadUserGroupData();
        if (!_0x45ec92['antitag'])
            _0x45ec92['antitag'] = {};
        if (!_0x45ec92['antitag'][_0x3ee265])
            _0x45ec92['antitag'][_0x3ee265] = {};
        _0x45ec92['antitag'][_0x3ee265] = {
            'enabled': _0xa4e6a8 === 'on',
            'action': _0x3289ad || 'delete'
        };
        await saveUserGroupData(_0x45ec92);
        return !![];
    } catch (_0x4e4c10) {
        console['error']('Error\x20setting\x20antitag:', _0x4e4c10);
        return ![];
    }
}
async function getAntitag(_0x473aa4, _0x139dd0) {
    try {
        const _0x39b420 = await loadUserGroupData();
        if (!_0x39b420['antitag'] || !_0x39b420['antitag'][_0x473aa4])
            return null;
        return _0x139dd0 === 'on' ? _0x39b420['antitag'][_0x473aa4] : null;
    } catch (_0x2e2f08) {
        console['error']('Error\x20getting\x20antitag:', _0x2e2f08);
        return null;
    }
}
async function removeAntitag(_0x136e95, _0x1c8d81) {
    try {
        const _0x236c1d = await loadUserGroupData();
        if (_0x236c1d['antitag'] && _0x236c1d['antitag'][_0x136e95]) {
            delete _0x236c1d['antitag'][_0x136e95];
            await saveUserGroupData(_0x236c1d);
        }
        return !![];
    } catch (_0x15d6d9) {
        console['error']('Error\x20removing\x20antitag:', _0x15d6d9);
        return ![];
    }
}
async function incrementWarningCount(_0x20bf5e, _0x3e349a) {
    try {
        const _0x5eb2a0 = await loadUserGroupData();
        if (!_0x5eb2a0['warnings'])
            _0x5eb2a0['warnings'] = {};
        if (!_0x5eb2a0['warnings'][_0x20bf5e])
            _0x5eb2a0['warnings'][_0x20bf5e] = {};
        if (!_0x5eb2a0['warnings'][_0x20bf5e][_0x3e349a])
            _0x5eb2a0['warnings'][_0x20bf5e][_0x3e349a] = 0x0;
        _0x5eb2a0['warnings'][_0x20bf5e][_0x3e349a]++;
        await saveUserGroupData(_0x5eb2a0);
        return _0x5eb2a0['warnings'][_0x20bf5e][_0x3e349a];
    } catch (_0x30b037) {
        console['error']('Error\x20incrementing\x20warning\x20count:', _0x30b037);
        return 0x0;
    }
}
async function resetWarningCount(_0x5f020c, _0x5ac6ba) {
    try {
        const _0x3d5fd3 = await loadUserGroupData();
        if (_0x3d5fd3['warnings'] && _0x3d5fd3['warnings'][_0x5f020c] && _0x3d5fd3['warnings'][_0x5f020c][_0x5ac6ba]) {
            _0x3d5fd3['warnings'][_0x5f020c][_0x5ac6ba] = 0x0;
            await saveUserGroupData(_0x3d5fd3);
        }
        return !![];
    } catch (_0x597a19) {
        console['error']('Error\x20resetting\x20warning\x20count:', _0x597a19);
        return ![];
    }
}
async function isSudo(_0x285d0c) {
    try {
        const _0x3269dd = await loadUserGroupData();
        return _0x3269dd['sudo'] && _0x3269dd['sudo']['includes'](_0x285d0c);
    } catch (_0x4fc2f3) {
        console['error']('Error\x20checking\x20sudo:', _0x4fc2f3);
        return ![];
    }
}
async function addSudo(_0x1fd965) {
    try {
        const _0x29aa34 = await loadUserGroupData();
        if (!_0x29aa34['sudo'])
            _0x29aa34['sudo'] = [];
        if (!_0x29aa34['sudo']['includes'](_0x1fd965)) {
            _0x29aa34['sudo']['push'](_0x1fd965);
            await saveUserGroupData(_0x29aa34);
        }
        return !![];
    } catch (_0x3b33de) {
        console['error']('Error\x20adding\x20sudo:', _0x3b33de);
        return ![];
    }
}
async function removeSudo(_0x180f7a) {
    try {
        const _0x5e1dd6 = await loadUserGroupData();
        if (!_0x5e1dd6['sudo'])
            _0x5e1dd6['sudo'] = [];
        const _0x22fc60 = _0x5e1dd6['sudo']['indexOf'](_0x180f7a);
        if (_0x22fc60 !== -0x1) {
            _0x5e1dd6['sudo']['splice'](_0x22fc60, 0x1);
            await saveUserGroupData(_0x5e1dd6);
        }
        return !![];
    } catch (_0x553a13) {
        console['error']('Error\x20removing\x20sudo:', _0x553a13);
        return ![];
    }
}
async function getSudoList() {
    try {
        const _0x2c85a9 = await loadUserGroupData();
        return Array['isArray'](_0x2c85a9['sudo']) ? _0x2c85a9['sudo'] : [];
    } catch (_0x2219aa) {
        console['error']('Error\x20getting\x20sudo\x20list:', _0x2219aa);
        return [];
    }
}
async function addWelcome(_0x2ae59c, _0xf1874b, _0x424052) {
    try {
        const _0x58a165 = await loadUserGroupData();
        if (!_0x58a165['welcome'])
            _0x58a165['welcome'] = {};
        _0x58a165['welcome'][_0x2ae59c] = {
            'enabled': _0xf1874b,
            'message': _0x424052 || '╔═⚔️\x20WELCOME\x20⚔️═╗\x0a║\x20🛡️\x20User:\x20{user}\x0a║\x20🏰\x20Kingdom:\x20{group}\x0a╠═══════════════╣\x0a║\x20📜\x20Message:\x0a║\x20{description}\x0a╚═══════════════╝',
            'channelId': '120363429019355682@newsletter'
        };
        await saveUserGroupData(_0x58a165);
        return !![];
    } catch (_0x259c3b) {
        console['error']('Error\x20in\x20addWelcome:', _0x259c3b);
        return ![];
    }
}
async function delWelcome(_0x1bd3ff) {
    try {
        const _0x3c56c8 = await loadUserGroupData();
        if (_0x3c56c8['welcome'] && _0x3c56c8['welcome'][_0x1bd3ff]) {
            delete _0x3c56c8['welcome'][_0x1bd3ff];
            await saveUserGroupData(_0x3c56c8);
        }
        return !![];
    } catch (_0x273c18) {
        console['error']('Error\x20in\x20delWelcome:', _0x273c18);
        return ![];
    }
}
async function isWelcomeOn(_0x5bc1fd) {
    try {
        const _0xa161d6 = await loadUserGroupData();
        return _0xa161d6['welcome'] && _0xa161d6['welcome'][_0x5bc1fd] && _0xa161d6['welcome'][_0x5bc1fd]['enabled'];
    } catch (_0x112cde) {
        console['error']('Error\x20in\x20isWelcomeOn:', _0x112cde);
        return ![];
    }
}
async function addGoodbye(_0x94d1bb, _0xca9b26, _0x3c34bd) {
    try {
        const _0x47fdfe = await loadUserGroupData();
        if (!_0x47fdfe['goodbye'])
            _0x47fdfe['goodbye'] = {};
        _0x47fdfe['goodbye'][_0x94d1bb] = {
            'enabled': _0xca9b26,
            'message': _0x3c34bd || '╔═⚔️\x20GOODBYE\x20⚔️═╗\x0a║\x20🛡️\x20User:\x20{user}\x0a║\x20🏰\x20Kingdom:\x20{group}\x0a╠═══════════════╣\x0a║\x20⚰️\x20We\x20will\x20never\x20miss\x20you!\x0a╚═══════════════╝',
            'channelId': '120363429019355682@newsletter'
        };
        await saveUserGroupData(_0x47fdfe);
        return !![];
    } catch (_0x2aee6f) {
        console['error']('Error\x20in\x20addGoodbye:', _0x2aee6f);
        return ![];
    }
}
async function delGoodBye(_0x3f0364) {
    try {
        const _0x12d4c0 = await loadUserGroupData();
        if (_0x12d4c0['goodbye'] && _0x12d4c0['goodbye'][_0x3f0364]) {
            delete _0x12d4c0['goodbye'][_0x3f0364];
            await saveUserGroupData(_0x12d4c0);
        }
        return !![];
    } catch (_0x540c86) {
        console['error']('Error\x20in\x20delGoodBye:', _0x540c86);
        return ![];
    }
}
async function isGoodByeOn(_0x286f00) {
    try {
        const _0x5b4c28 = await loadUserGroupData();
        return _0x5b4c28['goodbye'] && _0x5b4c28['goodbye'][_0x286f00] && _0x5b4c28['goodbye'][_0x286f00]['enabled'];
    } catch (_0x2487d7) {
        console['error']('Error\x20in\x20isGoodByeOn:', _0x2487d7);
        return ![];
    }
}
async function getWelcome(_0x14ba1e) {
    try {
        const _0x2b4ef0 = await loadUserGroupData();
        return _0x2b4ef0['welcome'] && _0x2b4ef0['welcome'][_0x14ba1e] ? _0x2b4ef0['welcome'][_0x14ba1e]['message'] : null;
    } catch (_0x24a2a1) {
        console['error']('Error\x20in\x20getWelcome:', _0x24a2a1);
        return null;
    }
}
async function getGoodbye(_0x7cba6a) {
    try {
        const _0x3ec9de = await loadUserGroupData();
        return _0x3ec9de['goodbye'] && _0x3ec9de['goodbye'][_0x7cba6a] ? _0x3ec9de['goodbye'][_0x7cba6a]['message'] : null;
    } catch (_0x1625d0) {
        console['error']('Error\x20in\x20getGoodbye:', _0x1625d0);
        return null;
    }
}
async function setAntiBadword(_0x7393ff, _0x4303bc, _0x2fa898) {
    try {
        const _0x1cc31f = await loadUserGroupData();
        if (!_0x1cc31f['antibadword'])
            _0x1cc31f['antibadword'] = {};
        if (!_0x1cc31f['antibadword'][_0x7393ff])
            _0x1cc31f['antibadword'][_0x7393ff] = {};
        _0x1cc31f['antibadword'][_0x7393ff] = {
            'enabled': _0x4303bc === 'on',
            'action': _0x2fa898 || 'delete'
        };
        await saveUserGroupData(_0x1cc31f);
        return !![];
    } catch (_0x2947aa) {
        console['error']('Error\x20setting\x20antibadword:', _0x2947aa);
        return ![];
    }
}
async function getAntiBadword(_0x4ca3c9, _0xd4be94) {
    try {
        const _0x1a99bf = await loadUserGroupData();
        if (!_0x1a99bf['antibadword'] || !_0x1a99bf['antibadword'][_0x4ca3c9]) {
            return null;
        }
        const _0x232175 = _0x1a99bf['antibadword'][_0x4ca3c9];
        return _0xd4be94 === 'on' ? _0x232175 : null;
    } catch (_0x15838d) {
        console['error']('Error\x20getting\x20antibadword:', _0x15838d);
        return null;
    }
}
async function removeAntiBadword(_0x3f66c7, _0x43c107) {
    try {
        const _0x3fe059 = await loadUserGroupData();
        if (_0x3fe059['antibadword'] && _0x3fe059['antibadword'][_0x3f66c7]) {
            delete _0x3fe059['antibadword'][_0x3f66c7];
            await saveUserGroupData(_0x3fe059);
        }
        return !![];
    } catch (_0x5f15f1) {
        console['error']('Error\x20removing\x20antibadword:', _0x5f15f1);
        return ![];
    }
}
async function setChatbot(_0x4e416d, _0x216399) {
    try {
        const _0x4a5bf8 = await loadUserGroupData();
        if (!_0x4a5bf8['chatbot'])
            _0x4a5bf8['chatbot'] = {};
        _0x4a5bf8['chatbot'][_0x4e416d] = { 'enabled': _0x216399 };
        await saveUserGroupData(_0x4a5bf8);
        return !![];
    } catch (_0x8f93cf) {
        console['error']('Error\x20setting\x20chatbot:', _0x8f93cf);
        return ![];
    }
}
async function getChatbot(_0x39db74) {
    try {
        const _0x307b57 = await loadUserGroupData();
        return _0x307b57['chatbot']?.[_0x39db74] || null;
    } catch (_0x260f2c) {
        console['error']('Error\x20getting\x20chatbot:', _0x260f2c);
        return null;
    }
}
async function removeChatbot(_0x5c0b54) {
    try {
        const _0x415d49 = await loadUserGroupData();
        if (_0x415d49['chatbot'] && _0x415d49['chatbot'][_0x5c0b54]) {
            delete _0x415d49['chatbot'][_0x5c0b54];
            await saveUserGroupData(_0x415d49);
        }
        return !![];
    } catch (_0x105754) {
        console['error']('Error\x20removing\x20chatbot:', _0x105754);
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