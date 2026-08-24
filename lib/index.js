import { fileURLToPath } from 'url';
import _0x0_0xffc5c0, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x65a12f from 'fs';
import { dataFile } from './paths.js';
import _0x0_0x3fb319 from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const dataPath = dataFile('userGroupData.json');
async function loadUserGroupData() {
    try {
        if (HAS_DB) {
            const _0x4a6e60 = await _0x0_0x3fb319['getSetting']('global', 'userGroupData');
            return _0x4a6e60 || {
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
            if (!_0x0_0x65a12f['existsSync'](dataPath)) {
                const _0xd831b2 = {
                    'antibadword': {},
                    'antilink': {},
                    'welcome': {},
                    'goodbye': {},
                    'chatbot': {},
                    'warnings': {},
                    'sudo': [],
                    'antitag': {}
                };
                _0x0_0x65a12f['writeFileSync'](dataPath, JSON['stringify'](_0xd831b2, null, 0x2));
                return _0xd831b2;
            }
            const _0x222e30 = JSON['parse'](_0x0_0x65a12f['readFileSync'](dataPath, 'utf8'));
            return _0x222e30;
        }
    } catch (_0x4b219d) {
        console['error']('Error\x20loading\x20user\x20group\x20data:', _0x4b219d);
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
async function saveUserGroupData(_0x2e17f7) {
    try {
        if (HAS_DB) {
            await _0x0_0x3fb319['saveSetting']('global', 'userGroupData', _0x2e17f7);
        } else {
            const _0x44c287 = _0x0_0xffc5c0['dirname'](dataPath);
            if (!_0x0_0x65a12f['existsSync'](_0x44c287)) {
                _0x0_0x65a12f['mkdirSync'](_0x44c287, { 'recursive': !![] });
            }
            _0x0_0x65a12f['writeFileSync'](dataPath, JSON['stringify'](_0x2e17f7, null, 0x2));
        }
        return !![];
    } catch (_0x1771a4) {
        console['error']('Error\x20saving\x20user\x20group\x20data:', _0x1771a4);
        return ![];
    }
}
async function setAntilink(_0x265b08, _0x7fec0d, _0x5d0a18) {
    try {
        const _0x483ea2 = await loadUserGroupData();
        if (!_0x483ea2['antilink'])
            _0x483ea2['antilink'] = {};
        if (!_0x483ea2['antilink'][_0x265b08])
            _0x483ea2['antilink'][_0x265b08] = {};
        _0x483ea2['antilink'][_0x265b08] = {
            'enabled': _0x7fec0d === 'on',
            'action': _0x5d0a18 || 'delete'
        };
        await saveUserGroupData(_0x483ea2);
        return !![];
    } catch (_0xd6cd5) {
        console['error']('Error\x20setting\x20antilink:', _0xd6cd5);
        return ![];
    }
}
async function getAntilink(_0x9ce837, _0x522fc1) {
    try {
        const _0x1105ab = await loadUserGroupData();
        if (!_0x1105ab['antilink'] || !_0x1105ab['antilink'][_0x9ce837])
            return null;
        return _0x522fc1 === 'on' ? _0x1105ab['antilink'][_0x9ce837] : null;
    } catch (_0x12a3e4) {
        console['error']('Error\x20getting\x20antilink:', _0x12a3e4);
        return null;
    }
}
async function removeAntilink(_0x31585c, _0x33167e) {
    try {
        const _0xe4607c = await loadUserGroupData();
        if (_0xe4607c['antilink'] && _0xe4607c['antilink'][_0x31585c]) {
            delete _0xe4607c['antilink'][_0x31585c];
            await saveUserGroupData(_0xe4607c);
        }
        return !![];
    } catch (_0x3be423) {
        console['error']('Error\x20removing\x20antilink:', _0x3be423);
        return ![];
    }
}
async function setAntitag(_0x431590, _0x1cf6a5, _0x57ccd4) {
    try {
        const _0x187bbe = await loadUserGroupData();
        if (!_0x187bbe['antitag'])
            _0x187bbe['antitag'] = {};
        if (!_0x187bbe['antitag'][_0x431590])
            _0x187bbe['antitag'][_0x431590] = {};
        _0x187bbe['antitag'][_0x431590] = {
            'enabled': _0x1cf6a5 === 'on',
            'action': _0x57ccd4 || 'delete'
        };
        await saveUserGroupData(_0x187bbe);
        return !![];
    } catch (_0x178013) {
        console['error']('Error\x20setting\x20antitag:', _0x178013);
        return ![];
    }
}
async function getAntitag(_0x4941d5, _0x3c5975) {
    try {
        const _0x5957d5 = await loadUserGroupData();
        if (!_0x5957d5['antitag'] || !_0x5957d5['antitag'][_0x4941d5])
            return null;
        return _0x3c5975 === 'on' ? _0x5957d5['antitag'][_0x4941d5] : null;
    } catch (_0x2c7035) {
        console['error']('Error\x20getting\x20antitag:', _0x2c7035);
        return null;
    }
}
async function removeAntitag(_0x405be8, _0x28b0f6) {
    try {
        const _0x419ea8 = await loadUserGroupData();
        if (_0x419ea8['antitag'] && _0x419ea8['antitag'][_0x405be8]) {
            delete _0x419ea8['antitag'][_0x405be8];
            await saveUserGroupData(_0x419ea8);
        }
        return !![];
    } catch (_0x4b3fc2) {
        console['error']('Error\x20removing\x20antitag:', _0x4b3fc2);
        return ![];
    }
}
async function incrementWarningCount(_0x2c2a4d, _0x36f0bd) {
    try {
        const _0x43dc2f = await loadUserGroupData();
        if (!_0x43dc2f['warnings'])
            _0x43dc2f['warnings'] = {};
        if (!_0x43dc2f['warnings'][_0x2c2a4d])
            _0x43dc2f['warnings'][_0x2c2a4d] = {};
        if (!_0x43dc2f['warnings'][_0x2c2a4d][_0x36f0bd])
            _0x43dc2f['warnings'][_0x2c2a4d][_0x36f0bd] = 0x0;
        _0x43dc2f['warnings'][_0x2c2a4d][_0x36f0bd]++;
        await saveUserGroupData(_0x43dc2f);
        return _0x43dc2f['warnings'][_0x2c2a4d][_0x36f0bd];
    } catch (_0x860e39) {
        console['error']('Error\x20incrementing\x20warning\x20count:', _0x860e39);
        return 0x0;
    }
}
async function resetWarningCount(_0x17ffce, _0x4079e2) {
    try {
        const _0x4dc24b = await loadUserGroupData();
        if (_0x4dc24b['warnings'] && _0x4dc24b['warnings'][_0x17ffce] && _0x4dc24b['warnings'][_0x17ffce][_0x4079e2]) {
            _0x4dc24b['warnings'][_0x17ffce][_0x4079e2] = 0x0;
            await saveUserGroupData(_0x4dc24b);
        }
        return !![];
    } catch (_0x5ce5e8) {
        console['error']('Error\x20resetting\x20warning\x20count:', _0x5ce5e8);
        return ![];
    }
}
async function isSudo(_0x56bf47) {
    try {
        const _0x4f4ebe = await loadUserGroupData();
        return _0x4f4ebe['sudo'] && _0x4f4ebe['sudo']['includes'](_0x56bf47);
    } catch (_0x3b053a) {
        console['error']('Error\x20checking\x20sudo:', _0x3b053a);
        return ![];
    }
}
async function addSudo(_0x217c5d) {
    try {
        const _0x6a360 = await loadUserGroupData();
        if (!_0x6a360['sudo'])
            _0x6a360['sudo'] = [];
        if (!_0x6a360['sudo']['includes'](_0x217c5d)) {
            _0x6a360['sudo']['push'](_0x217c5d);
            await saveUserGroupData(_0x6a360);
        }
        return !![];
    } catch (_0x1fabc3) {
        console['error']('Error\x20adding\x20sudo:', _0x1fabc3);
        return ![];
    }
}
async function removeSudo(_0x55f025) {
    try {
        const _0x1d1ee0 = await loadUserGroupData();
        if (!_0x1d1ee0['sudo'])
            _0x1d1ee0['sudo'] = [];
        const _0x5694b0 = _0x1d1ee0['sudo']['indexOf'](_0x55f025);
        if (_0x5694b0 !== -0x1) {
            _0x1d1ee0['sudo']['splice'](_0x5694b0, 0x1);
            await saveUserGroupData(_0x1d1ee0);
        }
        return !![];
    } catch (_0x1011cd) {
        console['error']('Error\x20removing\x20sudo:', _0x1011cd);
        return ![];
    }
}
async function getSudoList() {
    try {
        const _0x44bbbc = await loadUserGroupData();
        return Array['isArray'](_0x44bbbc['sudo']) ? _0x44bbbc['sudo'] : [];
    } catch (_0x560dfa) {
        console['error']('Error\x20getting\x20sudo\x20list:', _0x560dfa);
        return [];
    }
}
async function addWelcome(_0x1b3601, _0x4aedb6, _0x5ab74e) {
    try {
        const _0x5c3492 = await loadUserGroupData();
        if (!_0x5c3492['welcome'])
            _0x5c3492['welcome'] = {};
        _0x5c3492['welcome'][_0x1b3601] = {
            'enabled': _0x4aedb6,
            'message': _0x5ab74e || '╔═⚔️\x20WELCOME\x20⚔️═╗\x0a║\x20🛡️\x20User:\x20{user}\x0a║\x20🏰\x20Kingdom:\x20{group}\x0a╠═══════════════╣\x0a║\x20📜\x20Message:\x0a║\x20{description}\x0a╚═══════════════╝',
            'channelId': '120363429019355682@newsletter'
        };
        await saveUserGroupData(_0x5c3492);
        return !![];
    } catch (_0x547ecc) {
        console['error']('Error\x20in\x20addWelcome:', _0x547ecc);
        return ![];
    }
}
async function delWelcome(_0x5c2435) {
    try {
        const _0x6afc77 = await loadUserGroupData();
        if (_0x6afc77['welcome'] && _0x6afc77['welcome'][_0x5c2435]) {
            delete _0x6afc77['welcome'][_0x5c2435];
            await saveUserGroupData(_0x6afc77);
        }
        return !![];
    } catch (_0xf13f0a) {
        console['error']('Error\x20in\x20delWelcome:', _0xf13f0a);
        return ![];
    }
}
async function isWelcomeOn(_0xd7904c) {
    try {
        const _0x25430c = await loadUserGroupData();
        return _0x25430c['welcome'] && _0x25430c['welcome'][_0xd7904c] && _0x25430c['welcome'][_0xd7904c]['enabled'];
    } catch (_0x1ec03d) {
        console['error']('Error\x20in\x20isWelcomeOn:', _0x1ec03d);
        return ![];
    }
}
async function addGoodbye(_0x375ba6, _0x74cb3, _0x523808) {
    try {
        const _0xcc848a = await loadUserGroupData();
        if (!_0xcc848a['goodbye'])
            _0xcc848a['goodbye'] = {};
        _0xcc848a['goodbye'][_0x375ba6] = {
            'enabled': _0x74cb3,
            'message': _0x523808 || '╔═⚔️\x20GOODBYE\x20⚔️═╗\x0a║\x20🛡️\x20User:\x20{user}\x0a║\x20🏰\x20Kingdom:\x20{group}\x0a╠═══════════════╣\x0a║\x20⚰️\x20We\x20will\x20never\x20miss\x20you!\x0a╚═══════════════╝',
            'channelId': '120363429019355682@newsletter'
        };
        await saveUserGroupData(_0xcc848a);
        return !![];
    } catch (_0x2068d0) {
        console['error']('Error\x20in\x20addGoodbye:', _0x2068d0);
        return ![];
    }
}
async function delGoodBye(_0x1fae63) {
    try {
        const _0x439d37 = await loadUserGroupData();
        if (_0x439d37['goodbye'] && _0x439d37['goodbye'][_0x1fae63]) {
            delete _0x439d37['goodbye'][_0x1fae63];
            await saveUserGroupData(_0x439d37);
        }
        return !![];
    } catch (_0x42b0b3) {
        console['error']('Error\x20in\x20delGoodBye:', _0x42b0b3);
        return ![];
    }
}
async function isGoodByeOn(_0x1f0f8f) {
    try {
        const _0x56e712 = await loadUserGroupData();
        return _0x56e712['goodbye'] && _0x56e712['goodbye'][_0x1f0f8f] && _0x56e712['goodbye'][_0x1f0f8f]['enabled'];
    } catch (_0x3aa42f) {
        console['error']('Error\x20in\x20isGoodByeOn:', _0x3aa42f);
        return ![];
    }
}
async function getWelcome(_0x2ca67b) {
    try {
        const _0x4b85ae = await loadUserGroupData();
        return _0x4b85ae['welcome'] && _0x4b85ae['welcome'][_0x2ca67b] ? _0x4b85ae['welcome'][_0x2ca67b]['message'] : null;
    } catch (_0x2b2865) {
        console['error']('Error\x20in\x20getWelcome:', _0x2b2865);
        return null;
    }
}
async function getGoodbye(_0x3efa03) {
    try {
        const _0x743659 = await loadUserGroupData();
        return _0x743659['goodbye'] && _0x743659['goodbye'][_0x3efa03] ? _0x743659['goodbye'][_0x3efa03]['message'] : null;
    } catch (_0x3e9bbf) {
        console['error']('Error\x20in\x20getGoodbye:', _0x3e9bbf);
        return null;
    }
}
async function setAntiBadword(_0x2a41b2, _0x290d58, _0x5a0043) {
    try {
        const _0x4546e1 = await loadUserGroupData();
        if (!_0x4546e1['antibadword'])
            _0x4546e1['antibadword'] = {};
        if (!_0x4546e1['antibadword'][_0x2a41b2])
            _0x4546e1['antibadword'][_0x2a41b2] = {};
        _0x4546e1['antibadword'][_0x2a41b2] = {
            'enabled': _0x290d58 === 'on',
            'action': _0x5a0043 || 'delete'
        };
        await saveUserGroupData(_0x4546e1);
        return !![];
    } catch (_0x4d1c1d) {
        console['error']('Error\x20setting\x20antibadword:', _0x4d1c1d);
        return ![];
    }
}
async function getAntiBadword(_0x56222c, _0x40dcfb) {
    try {
        const _0x336b78 = await loadUserGroupData();
        if (!_0x336b78['antibadword'] || !_0x336b78['antibadword'][_0x56222c]) {
            return null;
        }
        const _0x2260c9 = _0x336b78['antibadword'][_0x56222c];
        return _0x40dcfb === 'on' ? _0x2260c9 : null;
    } catch (_0x372e11) {
        console['error']('Error\x20getting\x20antibadword:', _0x372e11);
        return null;
    }
}
async function removeAntiBadword(_0x474087, _0x46722e) {
    try {
        const _0x2f27d3 = await loadUserGroupData();
        if (_0x2f27d3['antibadword'] && _0x2f27d3['antibadword'][_0x474087]) {
            delete _0x2f27d3['antibadword'][_0x474087];
            await saveUserGroupData(_0x2f27d3);
        }
        return !![];
    } catch (_0x40eafc) {
        console['error']('Error\x20removing\x20antibadword:', _0x40eafc);
        return ![];
    }
}
async function setChatbot(_0x1e0196, _0x3109e8) {
    try {
        const _0x2506f5 = await loadUserGroupData();
        if (!_0x2506f5['chatbot'])
            _0x2506f5['chatbot'] = {};
        _0x2506f5['chatbot'][_0x1e0196] = { 'enabled': _0x3109e8 };
        await saveUserGroupData(_0x2506f5);
        return !![];
    } catch (_0x176d11) {
        console['error']('Error\x20setting\x20chatbot:', _0x176d11);
        return ![];
    }
}
async function getChatbot(_0x38b14a) {
    try {
        const _0x57fdb1 = await loadUserGroupData();
        return _0x57fdb1['chatbot']?.[_0x38b14a] || null;
    } catch (_0x24860d) {
        console['error']('Error\x20getting\x20chatbot:', _0x24860d);
        return null;
    }
}
async function removeChatbot(_0x5e1f4e) {
    try {
        const _0x267993 = await loadUserGroupData();
        if (_0x267993['chatbot'] && _0x267993['chatbot'][_0x5e1f4e]) {
            delete _0x267993['chatbot'][_0x5e1f4e];
            await saveUserGroupData(_0x267993);
        }
        return !![];
    } catch (_0x2e167a) {
        console['error']('Error\x20removing\x20chatbot:', _0x2e167a);
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