import { fileURLToPath } from 'url';
import _0x0_0x1c1fcd, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x38d849 from 'fs';
import { dataFile } from './paths.js';
import _0x0_0x13c476 from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const dataPath = dataFile('userGroupData.json');
async function loadUserGroupData() {
    try {
        if (HAS_DB) {
            const _0x1bb3fd = await _0x0_0x13c476['getSetting']('global', 'userGroupData');
            return _0x1bb3fd || {
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
            if (!_0x0_0x38d849['existsSync'](dataPath)) {
                const _0x513a77 = {
                    'antibadword': {},
                    'antilink': {},
                    'welcome': {},
                    'goodbye': {},
                    'chatbot': {},
                    'warnings': {},
                    'sudo': [],
                    'antitag': {}
                };
                _0x0_0x38d849['writeFileSync'](dataPath, JSON['stringify'](_0x513a77, null, 0x2));
                return _0x513a77;
            }
            const _0x2453f0 = JSON['parse'](_0x0_0x38d849['readFileSync'](dataPath, 'utf8'));
            return _0x2453f0;
        }
    } catch (_0x1f0540) {
        console['error']('Error\x20loading\x20user\x20group\x20data:', _0x1f0540);
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
async function saveUserGroupData(_0x4568ed) {
    try {
        if (HAS_DB) {
            await _0x0_0x13c476['saveSetting']('global', 'userGroupData', _0x4568ed);
        } else {
            const _0x494e8b = _0x0_0x1c1fcd['dirname'](dataPath);
            if (!_0x0_0x38d849['existsSync'](_0x494e8b)) {
                _0x0_0x38d849['mkdirSync'](_0x494e8b, { 'recursive': !![] });
            }
            _0x0_0x38d849['writeFileSync'](dataPath, JSON['stringify'](_0x4568ed, null, 0x2));
        }
        return !![];
    } catch (_0x4d3fe0) {
        console['error']('Error\x20saving\x20user\x20group\x20data:', _0x4d3fe0);
        return ![];
    }
}
async function setAntilink(_0x2548f7, _0x62997a, _0x47cc46) {
    try {
        const _0x565d61 = await loadUserGroupData();
        if (!_0x565d61['antilink'])
            _0x565d61['antilink'] = {};
        if (!_0x565d61['antilink'][_0x2548f7])
            _0x565d61['antilink'][_0x2548f7] = {};
        _0x565d61['antilink'][_0x2548f7] = {
            'enabled': _0x62997a === 'on',
            'action': _0x47cc46 || 'delete'
        };
        await saveUserGroupData(_0x565d61);
        return !![];
    } catch (_0x3649cc) {
        console['error']('Error\x20setting\x20antilink:', _0x3649cc);
        return ![];
    }
}
async function getAntilink(_0x152a0b, _0x3c54ad) {
    try {
        const _0x5d57f7 = await loadUserGroupData();
        if (!_0x5d57f7['antilink'] || !_0x5d57f7['antilink'][_0x152a0b])
            return null;
        return _0x3c54ad === 'on' ? _0x5d57f7['antilink'][_0x152a0b] : null;
    } catch (_0x2ef1ff) {
        console['error']('Error\x20getting\x20antilink:', _0x2ef1ff);
        return null;
    }
}
async function removeAntilink(_0x163663, _0x43100a) {
    try {
        const _0x3b5f54 = await loadUserGroupData();
        if (_0x3b5f54['antilink'] && _0x3b5f54['antilink'][_0x163663]) {
            delete _0x3b5f54['antilink'][_0x163663];
            await saveUserGroupData(_0x3b5f54);
        }
        return !![];
    } catch (_0x36834a) {
        console['error']('Error\x20removing\x20antilink:', _0x36834a);
        return ![];
    }
}
async function setAntitag(_0xc3ef3b, _0x3509ac, _0x4d4005) {
    try {
        const _0x37c4de = await loadUserGroupData();
        if (!_0x37c4de['antitag'])
            _0x37c4de['antitag'] = {};
        if (!_0x37c4de['antitag'][_0xc3ef3b])
            _0x37c4de['antitag'][_0xc3ef3b] = {};
        _0x37c4de['antitag'][_0xc3ef3b] = {
            'enabled': _0x3509ac === 'on',
            'action': _0x4d4005 || 'delete'
        };
        await saveUserGroupData(_0x37c4de);
        return !![];
    } catch (_0x403f42) {
        console['error']('Error\x20setting\x20antitag:', _0x403f42);
        return ![];
    }
}
async function getAntitag(_0x26dc4f, _0x2586e0) {
    try {
        const _0x2e6ce0 = await loadUserGroupData();
        if (!_0x2e6ce0['antitag'] || !_0x2e6ce0['antitag'][_0x26dc4f])
            return null;
        return _0x2586e0 === 'on' ? _0x2e6ce0['antitag'][_0x26dc4f] : null;
    } catch (_0x1366b7) {
        console['error']('Error\x20getting\x20antitag:', _0x1366b7);
        return null;
    }
}
async function removeAntitag(_0x3d9ab4, _0x47bb24) {
    try {
        const _0x3bc544 = await loadUserGroupData();
        if (_0x3bc544['antitag'] && _0x3bc544['antitag'][_0x3d9ab4]) {
            delete _0x3bc544['antitag'][_0x3d9ab4];
            await saveUserGroupData(_0x3bc544);
        }
        return !![];
    } catch (_0xa80917) {
        console['error']('Error\x20removing\x20antitag:', _0xa80917);
        return ![];
    }
}
async function incrementWarningCount(_0x396826, _0x1a514b) {
    try {
        const _0xd4c75d = await loadUserGroupData();
        if (!_0xd4c75d['warnings'])
            _0xd4c75d['warnings'] = {};
        if (!_0xd4c75d['warnings'][_0x396826])
            _0xd4c75d['warnings'][_0x396826] = {};
        if (!_0xd4c75d['warnings'][_0x396826][_0x1a514b])
            _0xd4c75d['warnings'][_0x396826][_0x1a514b] = 0x0;
        _0xd4c75d['warnings'][_0x396826][_0x1a514b]++;
        await saveUserGroupData(_0xd4c75d);
        return _0xd4c75d['warnings'][_0x396826][_0x1a514b];
    } catch (_0x561239) {
        console['error']('Error\x20incrementing\x20warning\x20count:', _0x561239);
        return 0x0;
    }
}
async function resetWarningCount(_0x59f650, _0x2bca42) {
    try {
        const _0x94eb3e = await loadUserGroupData();
        if (_0x94eb3e['warnings'] && _0x94eb3e['warnings'][_0x59f650] && _0x94eb3e['warnings'][_0x59f650][_0x2bca42]) {
            _0x94eb3e['warnings'][_0x59f650][_0x2bca42] = 0x0;
            await saveUserGroupData(_0x94eb3e);
        }
        return !![];
    } catch (_0x495646) {
        console['error']('Error\x20resetting\x20warning\x20count:', _0x495646);
        return ![];
    }
}
async function isSudo(_0x26c6a4) {
    try {
        const _0x6f38a = await loadUserGroupData();
        return _0x6f38a['sudo'] && _0x6f38a['sudo']['includes'](_0x26c6a4);
    } catch (_0x1e23ed) {
        console['error']('Error\x20checking\x20sudo:', _0x1e23ed);
        return ![];
    }
}
async function addSudo(_0x4072be) {
    try {
        const _0x299b04 = await loadUserGroupData();
        if (!_0x299b04['sudo'])
            _0x299b04['sudo'] = [];
        if (!_0x299b04['sudo']['includes'](_0x4072be)) {
            _0x299b04['sudo']['push'](_0x4072be);
            await saveUserGroupData(_0x299b04);
        }
        return !![];
    } catch (_0x364cd3) {
        console['error']('Error\x20adding\x20sudo:', _0x364cd3);
        return ![];
    }
}
async function removeSudo(_0x3a6643) {
    try {
        const _0x1f8863 = await loadUserGroupData();
        if (!_0x1f8863['sudo'])
            _0x1f8863['sudo'] = [];
        const _0x3b7f3c = _0x1f8863['sudo']['indexOf'](_0x3a6643);
        if (_0x3b7f3c !== -0x1) {
            _0x1f8863['sudo']['splice'](_0x3b7f3c, 0x1);
            await saveUserGroupData(_0x1f8863);
        }
        return !![];
    } catch (_0xd4888f) {
        console['error']('Error\x20removing\x20sudo:', _0xd4888f);
        return ![];
    }
}
async function getSudoList() {
    try {
        const _0x359caa = await loadUserGroupData();
        return Array['isArray'](_0x359caa['sudo']) ? _0x359caa['sudo'] : [];
    } catch (_0x2fe1b4) {
        console['error']('Error\x20getting\x20sudo\x20list:', _0x2fe1b4);
        return [];
    }
}
async function addWelcome(_0x4378ec, _0x37033a, _0x54b4d6) {
    try {
        const _0x356d0f = await loadUserGroupData();
        if (!_0x356d0f['welcome'])
            _0x356d0f['welcome'] = {};
        _0x356d0f['welcome'][_0x4378ec] = {
            'enabled': _0x37033a,
            'message': _0x54b4d6 || '╔═⚔️\x20WELCOME\x20⚔️═╗\x0a║\x20🛡️\x20User:\x20{user}\x0a║\x20🏰\x20Kingdom:\x20{group}\x0a╠═══════════════╣\x0a║\x20📜\x20Message:\x0a║\x20{description}\x0a╚═══════════════╝',
            'channelId': '120363429019355682@newsletter'
        };
        await saveUserGroupData(_0x356d0f);
        return !![];
    } catch (_0x4faf12) {
        console['error']('Error\x20in\x20addWelcome:', _0x4faf12);
        return ![];
    }
}
async function delWelcome(_0x48757d) {
    try {
        const _0x128cd7 = await loadUserGroupData();
        if (_0x128cd7['welcome'] && _0x128cd7['welcome'][_0x48757d]) {
            delete _0x128cd7['welcome'][_0x48757d];
            await saveUserGroupData(_0x128cd7);
        }
        return !![];
    } catch (_0x1f38de) {
        console['error']('Error\x20in\x20delWelcome:', _0x1f38de);
        return ![];
    }
}
async function isWelcomeOn(_0x1ed3b8) {
    try {
        const _0x3bcc72 = await loadUserGroupData();
        return _0x3bcc72['welcome'] && _0x3bcc72['welcome'][_0x1ed3b8] && _0x3bcc72['welcome'][_0x1ed3b8]['enabled'];
    } catch (_0x3c8b3f) {
        console['error']('Error\x20in\x20isWelcomeOn:', _0x3c8b3f);
        return ![];
    }
}
async function addGoodbye(_0x12ebac, _0x19e232, _0xa7993a) {
    try {
        const _0x7d9998 = await loadUserGroupData();
        if (!_0x7d9998['goodbye'])
            _0x7d9998['goodbye'] = {};
        _0x7d9998['goodbye'][_0x12ebac] = {
            'enabled': _0x19e232,
            'message': _0xa7993a || '╔═⚔️\x20GOODBYE\x20⚔️═╗\x0a║\x20🛡️\x20User:\x20{user}\x0a║\x20🏰\x20Kingdom:\x20{group}\x0a╠═══════════════╣\x0a║\x20⚰️\x20We\x20will\x20never\x20miss\x20you!\x0a╚═══════════════╝',
            'channelId': '120363429019355682@newsletter'
        };
        await saveUserGroupData(_0x7d9998);
        return !![];
    } catch (_0x4c1a5e) {
        console['error']('Error\x20in\x20addGoodbye:', _0x4c1a5e);
        return ![];
    }
}
async function delGoodBye(_0x18b7de) {
    try {
        const _0x48c174 = await loadUserGroupData();
        if (_0x48c174['goodbye'] && _0x48c174['goodbye'][_0x18b7de]) {
            delete _0x48c174['goodbye'][_0x18b7de];
            await saveUserGroupData(_0x48c174);
        }
        return !![];
    } catch (_0x4da4a7) {
        console['error']('Error\x20in\x20delGoodBye:', _0x4da4a7);
        return ![];
    }
}
async function isGoodByeOn(_0x3d5409) {
    try {
        const _0x16a22b = await loadUserGroupData();
        return _0x16a22b['goodbye'] && _0x16a22b['goodbye'][_0x3d5409] && _0x16a22b['goodbye'][_0x3d5409]['enabled'];
    } catch (_0x1acfab) {
        console['error']('Error\x20in\x20isGoodByeOn:', _0x1acfab);
        return ![];
    }
}
async function getWelcome(_0x252159) {
    try {
        const _0x36bdc7 = await loadUserGroupData();
        return _0x36bdc7['welcome'] && _0x36bdc7['welcome'][_0x252159] ? _0x36bdc7['welcome'][_0x252159]['message'] : null;
    } catch (_0x1eda95) {
        console['error']('Error\x20in\x20getWelcome:', _0x1eda95);
        return null;
    }
}
async function getGoodbye(_0x664272) {
    try {
        const _0x6d664 = await loadUserGroupData();
        return _0x6d664['goodbye'] && _0x6d664['goodbye'][_0x664272] ? _0x6d664['goodbye'][_0x664272]['message'] : null;
    } catch (_0x483b1c) {
        console['error']('Error\x20in\x20getGoodbye:', _0x483b1c);
        return null;
    }
}
async function setAntiBadword(_0x254d7d, _0xf2a433, _0x2d1fb1) {
    try {
        const _0x44037f = await loadUserGroupData();
        if (!_0x44037f['antibadword'])
            _0x44037f['antibadword'] = {};
        if (!_0x44037f['antibadword'][_0x254d7d])
            _0x44037f['antibadword'][_0x254d7d] = {};
        _0x44037f['antibadword'][_0x254d7d] = {
            'enabled': _0xf2a433 === 'on',
            'action': _0x2d1fb1 || 'delete'
        };
        await saveUserGroupData(_0x44037f);
        return !![];
    } catch (_0x269211) {
        console['error']('Error\x20setting\x20antibadword:', _0x269211);
        return ![];
    }
}
async function getAntiBadword(_0x58937e, _0x10f899) {
    try {
        const _0x50f125 = await loadUserGroupData();
        if (!_0x50f125['antibadword'] || !_0x50f125['antibadword'][_0x58937e]) {
            return null;
        }
        const _0x4c410b = _0x50f125['antibadword'][_0x58937e];
        return _0x10f899 === 'on' ? _0x4c410b : null;
    } catch (_0x4272b1) {
        console['error']('Error\x20getting\x20antibadword:', _0x4272b1);
        return null;
    }
}
async function removeAntiBadword(_0x3a7546, _0x3bbf14) {
    try {
        const _0x2584c5 = await loadUserGroupData();
        if (_0x2584c5['antibadword'] && _0x2584c5['antibadword'][_0x3a7546]) {
            delete _0x2584c5['antibadword'][_0x3a7546];
            await saveUserGroupData(_0x2584c5);
        }
        return !![];
    } catch (_0x27f64f) {
        console['error']('Error\x20removing\x20antibadword:', _0x27f64f);
        return ![];
    }
}
async function setChatbot(_0x5a2b70, _0x2b9aa5) {
    try {
        const _0xc5fa86 = await loadUserGroupData();
        if (!_0xc5fa86['chatbot'])
            _0xc5fa86['chatbot'] = {};
        _0xc5fa86['chatbot'][_0x5a2b70] = { 'enabled': _0x2b9aa5 };
        await saveUserGroupData(_0xc5fa86);
        return !![];
    } catch (_0x45a041) {
        console['error']('Error\x20setting\x20chatbot:', _0x45a041);
        return ![];
    }
}
async function getChatbot(_0x1af6a2) {
    try {
        const _0xfc8403 = await loadUserGroupData();
        return _0xfc8403['chatbot']?.[_0x1af6a2] || null;
    } catch (_0x57d6a0) {
        console['error']('Error\x20getting\x20chatbot:', _0x57d6a0);
        return null;
    }
}
async function removeChatbot(_0xef55f0) {
    try {
        const _0x534737 = await loadUserGroupData();
        if (_0x534737['chatbot'] && _0x534737['chatbot'][_0xef55f0]) {
            delete _0x534737['chatbot'][_0xef55f0];
            await saveUserGroupData(_0x534737);
        }
        return !![];
    } catch (_0x58dc30) {
        console['error']('Error\x20removing\x20chatbot:', _0x58dc30);
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