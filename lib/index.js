import { fileURLToPath } from 'url';
import _0x0_0x29b7e5, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x45046c from 'fs';
import { dataFile } from './paths.js';
import _0x0_0x883386 from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const dataPath = dataFile('userGroupData.json');
async function loadUserGroupData() {
    try {
        if (HAS_DB) {
            const _0x3ff3fa = await _0x0_0x883386['getSetting']('global', 'userGroupData');
            return _0x3ff3fa || {
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
            if (!_0x0_0x45046c['existsSync'](dataPath)) {
                const _0x4cc03a = {
                    'antibadword': {},
                    'antilink': {},
                    'welcome': {},
                    'goodbye': {},
                    'chatbot': {},
                    'warnings': {},
                    'sudo': [],
                    'antitag': {}
                };
                _0x0_0x45046c['writeFileSync'](dataPath, JSON['stringify'](_0x4cc03a, null, 0x2));
                return _0x4cc03a;
            }
            const _0xe171d8 = JSON['parse'](_0x0_0x45046c['readFileSync'](dataPath, 'utf8'));
            return _0xe171d8;
        }
    } catch (_0x664920) {
        console['error']('Error\x20loading\x20user\x20group\x20data:', _0x664920);
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
async function saveUserGroupData(_0xc0776c) {
    try {
        if (HAS_DB) {
            await _0x0_0x883386['saveSetting']('global', 'userGroupData', _0xc0776c);
        } else {
            const _0x4f5452 = _0x0_0x29b7e5['dirname'](dataPath);
            if (!_0x0_0x45046c['existsSync'](_0x4f5452)) {
                _0x0_0x45046c['mkdirSync'](_0x4f5452, { 'recursive': !![] });
            }
            _0x0_0x45046c['writeFileSync'](dataPath, JSON['stringify'](_0xc0776c, null, 0x2));
        }
        return !![];
    } catch (_0x36d893) {
        console['error']('Error\x20saving\x20user\x20group\x20data:', _0x36d893);
        return ![];
    }
}
async function setAntilink(_0xbfb129, _0x3732cf, _0x47e0e0) {
    try {
        const _0x439c7c = await loadUserGroupData();
        if (!_0x439c7c['antilink'])
            _0x439c7c['antilink'] = {};
        if (!_0x439c7c['antilink'][_0xbfb129])
            _0x439c7c['antilink'][_0xbfb129] = {};
        _0x439c7c['antilink'][_0xbfb129] = {
            'enabled': _0x3732cf === 'on',
            'action': _0x47e0e0 || 'delete'
        };
        await saveUserGroupData(_0x439c7c);
        return !![];
    } catch (_0x335d9d) {
        console['error']('Error\x20setting\x20antilink:', _0x335d9d);
        return ![];
    }
}
async function getAntilink(_0x2805b2, _0x1c9ae0) {
    try {
        const _0x553863 = await loadUserGroupData();
        if (!_0x553863['antilink'] || !_0x553863['antilink'][_0x2805b2])
            return null;
        return _0x1c9ae0 === 'on' ? _0x553863['antilink'][_0x2805b2] : null;
    } catch (_0x1f41b6) {
        console['error']('Error\x20getting\x20antilink:', _0x1f41b6);
        return null;
    }
}
async function removeAntilink(_0x427315, _0x53a993) {
    try {
        const _0x18b14c = await loadUserGroupData();
        if (_0x18b14c['antilink'] && _0x18b14c['antilink'][_0x427315]) {
            delete _0x18b14c['antilink'][_0x427315];
            await saveUserGroupData(_0x18b14c);
        }
        return !![];
    } catch (_0x3b40b3) {
        console['error']('Error\x20removing\x20antilink:', _0x3b40b3);
        return ![];
    }
}
async function setAntitag(_0x549d24, _0x37c8d3, _0x2db709) {
    try {
        const _0x4ee9af = await loadUserGroupData();
        if (!_0x4ee9af['antitag'])
            _0x4ee9af['antitag'] = {};
        if (!_0x4ee9af['antitag'][_0x549d24])
            _0x4ee9af['antitag'][_0x549d24] = {};
        _0x4ee9af['antitag'][_0x549d24] = {
            'enabled': _0x37c8d3 === 'on',
            'action': _0x2db709 || 'delete'
        };
        await saveUserGroupData(_0x4ee9af);
        return !![];
    } catch (_0x63d7b4) {
        console['error']('Error\x20setting\x20antitag:', _0x63d7b4);
        return ![];
    }
}
async function getAntitag(_0x532a8b, _0x2b9bf3) {
    try {
        const _0x31e9c3 = await loadUserGroupData();
        if (!_0x31e9c3['antitag'] || !_0x31e9c3['antitag'][_0x532a8b])
            return null;
        return _0x2b9bf3 === 'on' ? _0x31e9c3['antitag'][_0x532a8b] : null;
    } catch (_0x8781e9) {
        console['error']('Error\x20getting\x20antitag:', _0x8781e9);
        return null;
    }
}
async function removeAntitag(_0x3f24d4, _0x1484ea) {
    try {
        const _0xa7790a = await loadUserGroupData();
        if (_0xa7790a['antitag'] && _0xa7790a['antitag'][_0x3f24d4]) {
            delete _0xa7790a['antitag'][_0x3f24d4];
            await saveUserGroupData(_0xa7790a);
        }
        return !![];
    } catch (_0x255cb8) {
        console['error']('Error\x20removing\x20antitag:', _0x255cb8);
        return ![];
    }
}
async function incrementWarningCount(_0x1281b0, _0x1fa0cf) {
    try {
        const _0x376875 = await loadUserGroupData();
        if (!_0x376875['warnings'])
            _0x376875['warnings'] = {};
        if (!_0x376875['warnings'][_0x1281b0])
            _0x376875['warnings'][_0x1281b0] = {};
        if (!_0x376875['warnings'][_0x1281b0][_0x1fa0cf])
            _0x376875['warnings'][_0x1281b0][_0x1fa0cf] = 0x0;
        _0x376875['warnings'][_0x1281b0][_0x1fa0cf]++;
        await saveUserGroupData(_0x376875);
        return _0x376875['warnings'][_0x1281b0][_0x1fa0cf];
    } catch (_0x241088) {
        console['error']('Error\x20incrementing\x20warning\x20count:', _0x241088);
        return 0x0;
    }
}
async function resetWarningCount(_0xdc902, _0x4c8e1e) {
    try {
        const _0x351647 = await loadUserGroupData();
        if (_0x351647['warnings'] && _0x351647['warnings'][_0xdc902] && _0x351647['warnings'][_0xdc902][_0x4c8e1e]) {
            _0x351647['warnings'][_0xdc902][_0x4c8e1e] = 0x0;
            await saveUserGroupData(_0x351647);
        }
        return !![];
    } catch (_0x291278) {
        console['error']('Error\x20resetting\x20warning\x20count:', _0x291278);
        return ![];
    }
}
async function isSudo(_0x2a86e9) {
    try {
        const _0x1fac28 = await loadUserGroupData();
        return _0x1fac28['sudo'] && _0x1fac28['sudo']['includes'](_0x2a86e9);
    } catch (_0x1a0760) {
        console['error']('Error\x20checking\x20sudo:', _0x1a0760);
        return ![];
    }
}
async function addSudo(_0x21425c) {
    try {
        const _0x484583 = await loadUserGroupData();
        if (!_0x484583['sudo'])
            _0x484583['sudo'] = [];
        if (!_0x484583['sudo']['includes'](_0x21425c)) {
            _0x484583['sudo']['push'](_0x21425c);
            await saveUserGroupData(_0x484583);
        }
        return !![];
    } catch (_0x524fd4) {
        console['error']('Error\x20adding\x20sudo:', _0x524fd4);
        return ![];
    }
}
async function removeSudo(_0x1305e7) {
    try {
        const _0x33ecdc = await loadUserGroupData();
        if (!_0x33ecdc['sudo'])
            _0x33ecdc['sudo'] = [];
        const _0x1b51a2 = _0x33ecdc['sudo']['indexOf'](_0x1305e7);
        if (_0x1b51a2 !== -0x1) {
            _0x33ecdc['sudo']['splice'](_0x1b51a2, 0x1);
            await saveUserGroupData(_0x33ecdc);
        }
        return !![];
    } catch (_0x5a408b) {
        console['error']('Error\x20removing\x20sudo:', _0x5a408b);
        return ![];
    }
}
async function getSudoList() {
    try {
        const _0x27c175 = await loadUserGroupData();
        return Array['isArray'](_0x27c175['sudo']) ? _0x27c175['sudo'] : [];
    } catch (_0x3fe7ec) {
        console['error']('Error\x20getting\x20sudo\x20list:', _0x3fe7ec);
        return [];
    }
}
async function addWelcome(_0x1fafde, _0x1b2f57, _0x3d6d60) {
    try {
        const _0x1676b1 = await loadUserGroupData();
        if (!_0x1676b1['welcome'])
            _0x1676b1['welcome'] = {};
        _0x1676b1['welcome'][_0x1fafde] = {
            'enabled': _0x1b2f57,
            'message': _0x3d6d60 || '╔═⚔️\x20WELCOME\x20⚔️═╗\x0a║\x20🛡️\x20User:\x20{user}\x0a║\x20🏰\x20Kingdom:\x20{group}\x0a╠═══════════════╣\x0a║\x20📜\x20Message:\x0a║\x20{description}\x0a╚═══════════════╝',
            'channelId': '120363429019355682@newsletter'
        };
        await saveUserGroupData(_0x1676b1);
        return !![];
    } catch (_0x4faf9c) {
        console['error']('Error\x20in\x20addWelcome:', _0x4faf9c);
        return ![];
    }
}
async function delWelcome(_0x1d79e7) {
    try {
        const _0x249d0d = await loadUserGroupData();
        if (_0x249d0d['welcome'] && _0x249d0d['welcome'][_0x1d79e7]) {
            delete _0x249d0d['welcome'][_0x1d79e7];
            await saveUserGroupData(_0x249d0d);
        }
        return !![];
    } catch (_0x3726ed) {
        console['error']('Error\x20in\x20delWelcome:', _0x3726ed);
        return ![];
    }
}
async function isWelcomeOn(_0x556f4d) {
    try {
        const _0x41ac45 = await loadUserGroupData();
        return _0x41ac45['welcome'] && _0x41ac45['welcome'][_0x556f4d] && _0x41ac45['welcome'][_0x556f4d]['enabled'];
    } catch (_0x57b4cf) {
        console['error']('Error\x20in\x20isWelcomeOn:', _0x57b4cf);
        return ![];
    }
}
async function addGoodbye(_0x809c0b, _0x3634c7, _0xb9027a) {
    try {
        const _0x101cff = await loadUserGroupData();
        if (!_0x101cff['goodbye'])
            _0x101cff['goodbye'] = {};
        _0x101cff['goodbye'][_0x809c0b] = {
            'enabled': _0x3634c7,
            'message': _0xb9027a || '╔═⚔️\x20GOODBYE\x20⚔️═╗\x0a║\x20🛡️\x20User:\x20{user}\x0a║\x20🏰\x20Kingdom:\x20{group}\x0a╠═══════════════╣\x0a║\x20⚰️\x20We\x20will\x20never\x20miss\x20you!\x0a╚═══════════════╝',
            'channelId': '120363429019355682@newsletter'
        };
        await saveUserGroupData(_0x101cff);
        return !![];
    } catch (_0x26550f) {
        console['error']('Error\x20in\x20addGoodbye:', _0x26550f);
        return ![];
    }
}
async function delGoodBye(_0x41214f) {
    try {
        const _0x1934b2 = await loadUserGroupData();
        if (_0x1934b2['goodbye'] && _0x1934b2['goodbye'][_0x41214f]) {
            delete _0x1934b2['goodbye'][_0x41214f];
            await saveUserGroupData(_0x1934b2);
        }
        return !![];
    } catch (_0x491c6c) {
        console['error']('Error\x20in\x20delGoodBye:', _0x491c6c);
        return ![];
    }
}
async function isGoodByeOn(_0x23efb3) {
    try {
        const _0x46b42c = await loadUserGroupData();
        return _0x46b42c['goodbye'] && _0x46b42c['goodbye'][_0x23efb3] && _0x46b42c['goodbye'][_0x23efb3]['enabled'];
    } catch (_0x3b8eff) {
        console['error']('Error\x20in\x20isGoodByeOn:', _0x3b8eff);
        return ![];
    }
}
async function getWelcome(_0x25a3d0) {
    try {
        const _0x436141 = await loadUserGroupData();
        return _0x436141['welcome'] && _0x436141['welcome'][_0x25a3d0] ? _0x436141['welcome'][_0x25a3d0]['message'] : null;
    } catch (_0x6df816) {
        console['error']('Error\x20in\x20getWelcome:', _0x6df816);
        return null;
    }
}
async function getGoodbye(_0x337b6a) {
    try {
        const _0x444bf1 = await loadUserGroupData();
        return _0x444bf1['goodbye'] && _0x444bf1['goodbye'][_0x337b6a] ? _0x444bf1['goodbye'][_0x337b6a]['message'] : null;
    } catch (_0x1b82fb) {
        console['error']('Error\x20in\x20getGoodbye:', _0x1b82fb);
        return null;
    }
}
async function setAntiBadword(_0x2f7394, _0x55531e, _0x53b038) {
    try {
        const _0x647d45 = await loadUserGroupData();
        if (!_0x647d45['antibadword'])
            _0x647d45['antibadword'] = {};
        if (!_0x647d45['antibadword'][_0x2f7394])
            _0x647d45['antibadword'][_0x2f7394] = {};
        _0x647d45['antibadword'][_0x2f7394] = {
            'enabled': _0x55531e === 'on',
            'action': _0x53b038 || 'delete'
        };
        await saveUserGroupData(_0x647d45);
        return !![];
    } catch (_0x30207c) {
        console['error']('Error\x20setting\x20antibadword:', _0x30207c);
        return ![];
    }
}
async function getAntiBadword(_0x3695ad, _0x1b2026) {
    try {
        const _0x1fe5ac = await loadUserGroupData();
        if (!_0x1fe5ac['antibadword'] || !_0x1fe5ac['antibadword'][_0x3695ad]) {
            return null;
        }
        const _0x4255f9 = _0x1fe5ac['antibadword'][_0x3695ad];
        return _0x1b2026 === 'on' ? _0x4255f9 : null;
    } catch (_0x4ded20) {
        console['error']('Error\x20getting\x20antibadword:', _0x4ded20);
        return null;
    }
}
async function removeAntiBadword(_0x24ab4f, _0x155203) {
    try {
        const _0x1f810f = await loadUserGroupData();
        if (_0x1f810f['antibadword'] && _0x1f810f['antibadword'][_0x24ab4f]) {
            delete _0x1f810f['antibadword'][_0x24ab4f];
            await saveUserGroupData(_0x1f810f);
        }
        return !![];
    } catch (_0x353fa0) {
        console['error']('Error\x20removing\x20antibadword:', _0x353fa0);
        return ![];
    }
}
async function setChatbot(_0x5970e1, _0x44502a) {
    try {
        const _0x26d107 = await loadUserGroupData();
        if (!_0x26d107['chatbot'])
            _0x26d107['chatbot'] = {};
        _0x26d107['chatbot'][_0x5970e1] = { 'enabled': _0x44502a };
        await saveUserGroupData(_0x26d107);
        return !![];
    } catch (_0x11a6e9) {
        console['error']('Error\x20setting\x20chatbot:', _0x11a6e9);
        return ![];
    }
}
async function getChatbot(_0x5140c1) {
    try {
        const _0x12bf21 = await loadUserGroupData();
        return _0x12bf21['chatbot']?.[_0x5140c1] || null;
    } catch (_0x353fa6) {
        console['error']('Error\x20getting\x20chatbot:', _0x353fa6);
        return null;
    }
}
async function removeChatbot(_0x4561de) {
    try {
        const _0xa91ca3 = await loadUserGroupData();
        if (_0xa91ca3['chatbot'] && _0xa91ca3['chatbot'][_0x4561de]) {
            delete _0xa91ca3['chatbot'][_0x4561de];
            await saveUserGroupData(_0xa91ca3);
        }
        return !![];
    } catch (_0x85b9a9) {
        console['error']('Error\x20removing\x20chatbot:', _0x85b9a9);
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