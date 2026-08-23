import { fileURLToPath } from 'url';
import _0x0_0x1cc567, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x1c365d from 'fs';
import { dataFile } from './paths.js';
import _0x0_0x36ed41 from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const dataPath = dataFile('userGroupData.json');
async function loadUserGroupData() {
    try {
        if (HAS_DB) {
            const _0x1799b0 = await _0x0_0x36ed41['getSetting']('global', 'userGroupData');
            return _0x1799b0 || {
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
            if (!_0x0_0x1c365d['existsSync'](dataPath)) {
                const _0x4f70cc = {
                    'antibadword': {},
                    'antilink': {},
                    'welcome': {},
                    'goodbye': {},
                    'chatbot': {},
                    'warnings': {},
                    'sudo': [],
                    'antitag': {}
                };
                _0x0_0x1c365d['writeFileSync'](dataPath, JSON['stringify'](_0x4f70cc, null, 0x2));
                return _0x4f70cc;
            }
            const _0x542d10 = JSON['parse'](_0x0_0x1c365d['readFileSync'](dataPath, 'utf8'));
            return _0x542d10;
        }
    } catch (_0x3364f4) {
        console['error']('Error\x20loading\x20user\x20group\x20data:', _0x3364f4);
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
async function saveUserGroupData(_0xe686ee) {
    try {
        if (HAS_DB) {
            await _0x0_0x36ed41['saveSetting']('global', 'userGroupData', _0xe686ee);
        } else {
            const _0x35fd56 = _0x0_0x1cc567['dirname'](dataPath);
            if (!_0x0_0x1c365d['existsSync'](_0x35fd56)) {
                _0x0_0x1c365d['mkdirSync'](_0x35fd56, { 'recursive': !![] });
            }
            _0x0_0x1c365d['writeFileSync'](dataPath, JSON['stringify'](_0xe686ee, null, 0x2));
        }
        return !![];
    } catch (_0x22f021) {
        console['error']('Error\x20saving\x20user\x20group\x20data:', _0x22f021);
        return ![];
    }
}
async function setAntilink(_0x2d8e52, _0x2e437f, _0x711159) {
    try {
        const _0x343ece = await loadUserGroupData();
        if (!_0x343ece['antilink'])
            _0x343ece['antilink'] = {};
        if (!_0x343ece['antilink'][_0x2d8e52])
            _0x343ece['antilink'][_0x2d8e52] = {};
        _0x343ece['antilink'][_0x2d8e52] = {
            'enabled': _0x2e437f === 'on',
            'action': _0x711159 || 'delete'
        };
        await saveUserGroupData(_0x343ece);
        return !![];
    } catch (_0xd821) {
        console['error']('Error\x20setting\x20antilink:', _0xd821);
        return ![];
    }
}
async function getAntilink(_0x56c4ab, _0x1256fd) {
    try {
        const _0x2cfc7e = await loadUserGroupData();
        if (!_0x2cfc7e['antilink'] || !_0x2cfc7e['antilink'][_0x56c4ab])
            return null;
        return _0x1256fd === 'on' ? _0x2cfc7e['antilink'][_0x56c4ab] : null;
    } catch (_0x3c58ea) {
        console['error']('Error\x20getting\x20antilink:', _0x3c58ea);
        return null;
    }
}
async function removeAntilink(_0x582929, _0x5de8ee) {
    try {
        const _0x5d800c = await loadUserGroupData();
        if (_0x5d800c['antilink'] && _0x5d800c['antilink'][_0x582929]) {
            delete _0x5d800c['antilink'][_0x582929];
            await saveUserGroupData(_0x5d800c);
        }
        return !![];
    } catch (_0x55bbac) {
        console['error']('Error\x20removing\x20antilink:', _0x55bbac);
        return ![];
    }
}
async function setAntitag(_0x22266d, _0x36d4b1, _0x1a264c) {
    try {
        const _0x414f99 = await loadUserGroupData();
        if (!_0x414f99['antitag'])
            _0x414f99['antitag'] = {};
        if (!_0x414f99['antitag'][_0x22266d])
            _0x414f99['antitag'][_0x22266d] = {};
        _0x414f99['antitag'][_0x22266d] = {
            'enabled': _0x36d4b1 === 'on',
            'action': _0x1a264c || 'delete'
        };
        await saveUserGroupData(_0x414f99);
        return !![];
    } catch (_0x13c5b9) {
        console['error']('Error\x20setting\x20antitag:', _0x13c5b9);
        return ![];
    }
}
async function getAntitag(_0x12dc55, _0x4b7d8b) {
    try {
        const _0x552c8e = await loadUserGroupData();
        if (!_0x552c8e['antitag'] || !_0x552c8e['antitag'][_0x12dc55])
            return null;
        return _0x4b7d8b === 'on' ? _0x552c8e['antitag'][_0x12dc55] : null;
    } catch (_0x3ccd75) {
        console['error']('Error\x20getting\x20antitag:', _0x3ccd75);
        return null;
    }
}
async function removeAntitag(_0x6473c6, _0xfec908) {
    try {
        const _0x26ce66 = await loadUserGroupData();
        if (_0x26ce66['antitag'] && _0x26ce66['antitag'][_0x6473c6]) {
            delete _0x26ce66['antitag'][_0x6473c6];
            await saveUserGroupData(_0x26ce66);
        }
        return !![];
    } catch (_0x27ecaf) {
        console['error']('Error\x20removing\x20antitag:', _0x27ecaf);
        return ![];
    }
}
async function incrementWarningCount(_0xfb4376, _0x1a7775) {
    try {
        const _0xcec8a6 = await loadUserGroupData();
        if (!_0xcec8a6['warnings'])
            _0xcec8a6['warnings'] = {};
        if (!_0xcec8a6['warnings'][_0xfb4376])
            _0xcec8a6['warnings'][_0xfb4376] = {};
        if (!_0xcec8a6['warnings'][_0xfb4376][_0x1a7775])
            _0xcec8a6['warnings'][_0xfb4376][_0x1a7775] = 0x0;
        _0xcec8a6['warnings'][_0xfb4376][_0x1a7775]++;
        await saveUserGroupData(_0xcec8a6);
        return _0xcec8a6['warnings'][_0xfb4376][_0x1a7775];
    } catch (_0x57fb81) {
        console['error']('Error\x20incrementing\x20warning\x20count:', _0x57fb81);
        return 0x0;
    }
}
async function resetWarningCount(_0x13df1f, _0x1fa060) {
    try {
        const _0x9142ff = await loadUserGroupData();
        if (_0x9142ff['warnings'] && _0x9142ff['warnings'][_0x13df1f] && _0x9142ff['warnings'][_0x13df1f][_0x1fa060]) {
            _0x9142ff['warnings'][_0x13df1f][_0x1fa060] = 0x0;
            await saveUserGroupData(_0x9142ff);
        }
        return !![];
    } catch (_0x4e7ce2) {
        console['error']('Error\x20resetting\x20warning\x20count:', _0x4e7ce2);
        return ![];
    }
}
async function isSudo(_0x2c683d) {
    try {
        const _0x59b1bf = await loadUserGroupData();
        return _0x59b1bf['sudo'] && _0x59b1bf['sudo']['includes'](_0x2c683d);
    } catch (_0x5e697d) {
        console['error']('Error\x20checking\x20sudo:', _0x5e697d);
        return ![];
    }
}
async function addSudo(_0xd19eb6) {
    try {
        const _0x4b699c = await loadUserGroupData();
        if (!_0x4b699c['sudo'])
            _0x4b699c['sudo'] = [];
        if (!_0x4b699c['sudo']['includes'](_0xd19eb6)) {
            _0x4b699c['sudo']['push'](_0xd19eb6);
            await saveUserGroupData(_0x4b699c);
        }
        return !![];
    } catch (_0x30b7b4) {
        console['error']('Error\x20adding\x20sudo:', _0x30b7b4);
        return ![];
    }
}
async function removeSudo(_0x473e83) {
    try {
        const _0x509696 = await loadUserGroupData();
        if (!_0x509696['sudo'])
            _0x509696['sudo'] = [];
        const _0xdbda33 = _0x509696['sudo']['indexOf'](_0x473e83);
        if (_0xdbda33 !== -0x1) {
            _0x509696['sudo']['splice'](_0xdbda33, 0x1);
            await saveUserGroupData(_0x509696);
        }
        return !![];
    } catch (_0x25d5a6) {
        console['error']('Error\x20removing\x20sudo:', _0x25d5a6);
        return ![];
    }
}
async function getSudoList() {
    try {
        const _0x2642fd = await loadUserGroupData();
        return Array['isArray'](_0x2642fd['sudo']) ? _0x2642fd['sudo'] : [];
    } catch (_0x44413b) {
        console['error']('Error\x20getting\x20sudo\x20list:', _0x44413b);
        return [];
    }
}
async function addWelcome(_0x4b0adf, _0x45ac68, _0x1075c8) {
    try {
        const _0x58f099 = await loadUserGroupData();
        if (!_0x58f099['welcome'])
            _0x58f099['welcome'] = {};
        _0x58f099['welcome'][_0x4b0adf] = {
            'enabled': _0x45ac68,
            'message': _0x1075c8 || '╔═⚔️\x20WELCOME\x20⚔️═╗\x0a║\x20🛡️\x20User:\x20{user}\x0a║\x20🏰\x20Kingdom:\x20{group}\x0a╠═══════════════╣\x0a║\x20📜\x20Message:\x0a║\x20{description}\x0a╚═══════════════╝',
            'channelId': '120363429019355682@newsletter'
        };
        await saveUserGroupData(_0x58f099);
        return !![];
    } catch (_0xcc71be) {
        console['error']('Error\x20in\x20addWelcome:', _0xcc71be);
        return ![];
    }
}
async function delWelcome(_0x29bfa3) {
    try {
        const _0x34a809 = await loadUserGroupData();
        if (_0x34a809['welcome'] && _0x34a809['welcome'][_0x29bfa3]) {
            delete _0x34a809['welcome'][_0x29bfa3];
            await saveUserGroupData(_0x34a809);
        }
        return !![];
    } catch (_0x3426b7) {
        console['error']('Error\x20in\x20delWelcome:', _0x3426b7);
        return ![];
    }
}
async function isWelcomeOn(_0x11da87) {
    try {
        const _0x5891f4 = await loadUserGroupData();
        return _0x5891f4['welcome'] && _0x5891f4['welcome'][_0x11da87] && _0x5891f4['welcome'][_0x11da87]['enabled'];
    } catch (_0x18dacd) {
        console['error']('Error\x20in\x20isWelcomeOn:', _0x18dacd);
        return ![];
    }
}
async function addGoodbye(_0x35294d, _0x52f742, _0x23cbdb) {
    try {
        const _0x184b66 = await loadUserGroupData();
        if (!_0x184b66['goodbye'])
            _0x184b66['goodbye'] = {};
        _0x184b66['goodbye'][_0x35294d] = {
            'enabled': _0x52f742,
            'message': _0x23cbdb || '╔═⚔️\x20GOODBYE\x20⚔️═╗\x0a║\x20🛡️\x20User:\x20{user}\x0a║\x20🏰\x20Kingdom:\x20{group}\x0a╠═══════════════╣\x0a║\x20⚰️\x20We\x20will\x20never\x20miss\x20you!\x0a╚═══════════════╝',
            'channelId': '120363429019355682@newsletter'
        };
        await saveUserGroupData(_0x184b66);
        return !![];
    } catch (_0x5e8b09) {
        console['error']('Error\x20in\x20addGoodbye:', _0x5e8b09);
        return ![];
    }
}
async function delGoodBye(_0x41cdce) {
    try {
        const _0x2e0655 = await loadUserGroupData();
        if (_0x2e0655['goodbye'] && _0x2e0655['goodbye'][_0x41cdce]) {
            delete _0x2e0655['goodbye'][_0x41cdce];
            await saveUserGroupData(_0x2e0655);
        }
        return !![];
    } catch (_0x13ac07) {
        console['error']('Error\x20in\x20delGoodBye:', _0x13ac07);
        return ![];
    }
}
async function isGoodByeOn(_0x2bf45b) {
    try {
        const _0x3a2fd1 = await loadUserGroupData();
        return _0x3a2fd1['goodbye'] && _0x3a2fd1['goodbye'][_0x2bf45b] && _0x3a2fd1['goodbye'][_0x2bf45b]['enabled'];
    } catch (_0x3ceba9) {
        console['error']('Error\x20in\x20isGoodByeOn:', _0x3ceba9);
        return ![];
    }
}
async function getWelcome(_0x8a4f74) {
    try {
        const _0x24c26a = await loadUserGroupData();
        return _0x24c26a['welcome'] && _0x24c26a['welcome'][_0x8a4f74] ? _0x24c26a['welcome'][_0x8a4f74]['message'] : null;
    } catch (_0x4a71b6) {
        console['error']('Error\x20in\x20getWelcome:', _0x4a71b6);
        return null;
    }
}
async function getGoodbye(_0x3e853e) {
    try {
        const _0xae7e30 = await loadUserGroupData();
        return _0xae7e30['goodbye'] && _0xae7e30['goodbye'][_0x3e853e] ? _0xae7e30['goodbye'][_0x3e853e]['message'] : null;
    } catch (_0x16a406) {
        console['error']('Error\x20in\x20getGoodbye:', _0x16a406);
        return null;
    }
}
async function setAntiBadword(_0x25ed5b, _0x59f01d, _0x468ff4) {
    try {
        const _0x10d026 = await loadUserGroupData();
        if (!_0x10d026['antibadword'])
            _0x10d026['antibadword'] = {};
        if (!_0x10d026['antibadword'][_0x25ed5b])
            _0x10d026['antibadword'][_0x25ed5b] = {};
        _0x10d026['antibadword'][_0x25ed5b] = {
            'enabled': _0x59f01d === 'on',
            'action': _0x468ff4 || 'delete'
        };
        await saveUserGroupData(_0x10d026);
        return !![];
    } catch (_0x280681) {
        console['error']('Error\x20setting\x20antibadword:', _0x280681);
        return ![];
    }
}
async function getAntiBadword(_0x5524d2, _0x60553b) {
    try {
        const _0xb91271 = await loadUserGroupData();
        if (!_0xb91271['antibadword'] || !_0xb91271['antibadword'][_0x5524d2]) {
            return null;
        }
        const _0x37525d = _0xb91271['antibadword'][_0x5524d2];
        return _0x60553b === 'on' ? _0x37525d : null;
    } catch (_0x488566) {
        console['error']('Error\x20getting\x20antibadword:', _0x488566);
        return null;
    }
}
async function removeAntiBadword(_0x33e768, _0x3a3542) {
    try {
        const _0x1fef6b = await loadUserGroupData();
        if (_0x1fef6b['antibadword'] && _0x1fef6b['antibadword'][_0x33e768]) {
            delete _0x1fef6b['antibadword'][_0x33e768];
            await saveUserGroupData(_0x1fef6b);
        }
        return !![];
    } catch (_0x513ef4) {
        console['error']('Error\x20removing\x20antibadword:', _0x513ef4);
        return ![];
    }
}
async function setChatbot(_0x264fb3, _0x5d5a79) {
    try {
        const _0x549b35 = await loadUserGroupData();
        if (!_0x549b35['chatbot'])
            _0x549b35['chatbot'] = {};
        _0x549b35['chatbot'][_0x264fb3] = { 'enabled': _0x5d5a79 };
        await saveUserGroupData(_0x549b35);
        return !![];
    } catch (_0x25fa03) {
        console['error']('Error\x20setting\x20chatbot:', _0x25fa03);
        return ![];
    }
}
async function getChatbot(_0x38f838) {
    try {
        const _0x3907bf = await loadUserGroupData();
        return _0x3907bf['chatbot']?.[_0x38f838] || null;
    } catch (_0x454783) {
        console['error']('Error\x20getting\x20chatbot:', _0x454783);
        return null;
    }
}
async function removeChatbot(_0x3b9452) {
    try {
        const _0x1adf48 = await loadUserGroupData();
        if (_0x1adf48['chatbot'] && _0x1adf48['chatbot'][_0x3b9452]) {
            delete _0x1adf48['chatbot'][_0x3b9452];
            await saveUserGroupData(_0x1adf48);
        }
        return !![];
    } catch (_0x216877) {
        console['error']('Error\x20removing\x20chatbot:', _0x216877);
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