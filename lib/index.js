import { fileURLToPath } from 'url';
import _0x0_0x12fba0, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x120039 from 'fs';
import { dataFile } from './paths.js';
import _0x0_0x3af02d from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const dataPath = dataFile('userGroupData.json');
async function loadUserGroupData() {
    try {
        if (HAS_DB) {
            const _0xd7d269 = await _0x0_0x3af02d['getSetting']('global', 'userGroupData');
            return _0xd7d269 || {
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
            if (!_0x0_0x120039['existsSync'](dataPath)) {
                const _0x5c7e8a = {
                    'antibadword': {},
                    'antilink': {},
                    'welcome': {},
                    'goodbye': {},
                    'chatbot': {},
                    'warnings': {},
                    'sudo': [],
                    'antitag': {}
                };
                _0x0_0x120039['writeFileSync'](dataPath, JSON['stringify'](_0x5c7e8a, null, 0x2));
                return _0x5c7e8a;
            }
            const _0x2d62e8 = JSON['parse'](_0x0_0x120039['readFileSync'](dataPath, 'utf8'));
            return _0x2d62e8;
        }
    } catch (_0x29f169) {
        console['error']('Error\x20loading\x20user\x20group\x20data:', _0x29f169);
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
async function saveUserGroupData(_0x10855e) {
    try {
        if (HAS_DB) {
            await _0x0_0x3af02d['saveSetting']('global', 'userGroupData', _0x10855e);
        } else {
            const _0xe913e2 = _0x0_0x12fba0['dirname'](dataPath);
            if (!_0x0_0x120039['existsSync'](_0xe913e2)) {
                _0x0_0x120039['mkdirSync'](_0xe913e2, { 'recursive': !![] });
            }
            _0x0_0x120039['writeFileSync'](dataPath, JSON['stringify'](_0x10855e, null, 0x2));
        }
        return !![];
    } catch (_0x4ac9a7) {
        console['error']('Error\x20saving\x20user\x20group\x20data:', _0x4ac9a7);
        return ![];
    }
}
async function setAntilink(_0x12980b, _0x46bbd8, _0x3ae173) {
    try {
        const _0x1a0b45 = await loadUserGroupData();
        if (!_0x1a0b45['antilink'])
            _0x1a0b45['antilink'] = {};
        if (!_0x1a0b45['antilink'][_0x12980b])
            _0x1a0b45['antilink'][_0x12980b] = {};
        _0x1a0b45['antilink'][_0x12980b] = {
            'enabled': _0x46bbd8 === 'on',
            'action': _0x3ae173 || 'delete'
        };
        await saveUserGroupData(_0x1a0b45);
        return !![];
    } catch (_0x1f6846) {
        console['error']('Error\x20setting\x20antilink:', _0x1f6846);
        return ![];
    }
}
async function getAntilink(_0x3aac15, _0x46e67a) {
    try {
        const _0x11104a = await loadUserGroupData();
        if (!_0x11104a['antilink'] || !_0x11104a['antilink'][_0x3aac15])
            return null;
        return _0x46e67a === 'on' ? _0x11104a['antilink'][_0x3aac15] : null;
    } catch (_0x412efb) {
        console['error']('Error\x20getting\x20antilink:', _0x412efb);
        return null;
    }
}
async function removeAntilink(_0x209dda, _0x4b31f2) {
    try {
        const _0x5484cf = await loadUserGroupData();
        if (_0x5484cf['antilink'] && _0x5484cf['antilink'][_0x209dda]) {
            delete _0x5484cf['antilink'][_0x209dda];
            await saveUserGroupData(_0x5484cf);
        }
        return !![];
    } catch (_0xddc8fb) {
        console['error']('Error\x20removing\x20antilink:', _0xddc8fb);
        return ![];
    }
}
async function setAntitag(_0x219a6e, _0x490723, _0x523b24) {
    try {
        const _0x338fc8 = await loadUserGroupData();
        if (!_0x338fc8['antitag'])
            _0x338fc8['antitag'] = {};
        if (!_0x338fc8['antitag'][_0x219a6e])
            _0x338fc8['antitag'][_0x219a6e] = {};
        _0x338fc8['antitag'][_0x219a6e] = {
            'enabled': _0x490723 === 'on',
            'action': _0x523b24 || 'delete'
        };
        await saveUserGroupData(_0x338fc8);
        return !![];
    } catch (_0x1c1d2d) {
        console['error']('Error\x20setting\x20antitag:', _0x1c1d2d);
        return ![];
    }
}
async function getAntitag(_0x48ead8, _0x561999) {
    try {
        const _0x4cf037 = await loadUserGroupData();
        if (!_0x4cf037['antitag'] || !_0x4cf037['antitag'][_0x48ead8])
            return null;
        return _0x561999 === 'on' ? _0x4cf037['antitag'][_0x48ead8] : null;
    } catch (_0x41b7b6) {
        console['error']('Error\x20getting\x20antitag:', _0x41b7b6);
        return null;
    }
}
async function removeAntitag(_0x244b20, _0x32e5da) {
    try {
        const _0x179868 = await loadUserGroupData();
        if (_0x179868['antitag'] && _0x179868['antitag'][_0x244b20]) {
            delete _0x179868['antitag'][_0x244b20];
            await saveUserGroupData(_0x179868);
        }
        return !![];
    } catch (_0x494ab9) {
        console['error']('Error\x20removing\x20antitag:', _0x494ab9);
        return ![];
    }
}
async function incrementWarningCount(_0x5cdfd3, _0x16fd3e) {
    try {
        const _0x10c652 = await loadUserGroupData();
        if (!_0x10c652['warnings'])
            _0x10c652['warnings'] = {};
        if (!_0x10c652['warnings'][_0x5cdfd3])
            _0x10c652['warnings'][_0x5cdfd3] = {};
        if (!_0x10c652['warnings'][_0x5cdfd3][_0x16fd3e])
            _0x10c652['warnings'][_0x5cdfd3][_0x16fd3e] = 0x0;
        _0x10c652['warnings'][_0x5cdfd3][_0x16fd3e]++;
        await saveUserGroupData(_0x10c652);
        return _0x10c652['warnings'][_0x5cdfd3][_0x16fd3e];
    } catch (_0x1a2ccf) {
        console['error']('Error\x20incrementing\x20warning\x20count:', _0x1a2ccf);
        return 0x0;
    }
}
async function resetWarningCount(_0x57deb8, _0x2cb4a4) {
    try {
        const _0x1de126 = await loadUserGroupData();
        if (_0x1de126['warnings'] && _0x1de126['warnings'][_0x57deb8] && _0x1de126['warnings'][_0x57deb8][_0x2cb4a4]) {
            _0x1de126['warnings'][_0x57deb8][_0x2cb4a4] = 0x0;
            await saveUserGroupData(_0x1de126);
        }
        return !![];
    } catch (_0x5e6589) {
        console['error']('Error\x20resetting\x20warning\x20count:', _0x5e6589);
        return ![];
    }
}
async function isSudo(_0xbe0253) {
    try {
        const _0x5db522 = await loadUserGroupData();
        return _0x5db522['sudo'] && _0x5db522['sudo']['includes'](_0xbe0253);
    } catch (_0x41aad7) {
        console['error']('Error\x20checking\x20sudo:', _0x41aad7);
        return ![];
    }
}
async function addSudo(_0x53a0d2) {
    try {
        const _0x31972c = await loadUserGroupData();
        if (!_0x31972c['sudo'])
            _0x31972c['sudo'] = [];
        if (!_0x31972c['sudo']['includes'](_0x53a0d2)) {
            _0x31972c['sudo']['push'](_0x53a0d2);
            await saveUserGroupData(_0x31972c);
        }
        return !![];
    } catch (_0x49c533) {
        console['error']('Error\x20adding\x20sudo:', _0x49c533);
        return ![];
    }
}
async function removeSudo(_0x3f83cd) {
    try {
        const _0x38b80f = await loadUserGroupData();
        if (!_0x38b80f['sudo'])
            _0x38b80f['sudo'] = [];
        const _0x2d3d09 = _0x38b80f['sudo']['indexOf'](_0x3f83cd);
        if (_0x2d3d09 !== -0x1) {
            _0x38b80f['sudo']['splice'](_0x2d3d09, 0x1);
            await saveUserGroupData(_0x38b80f);
        }
        return !![];
    } catch (_0x4a29e9) {
        console['error']('Error\x20removing\x20sudo:', _0x4a29e9);
        return ![];
    }
}
async function getSudoList() {
    try {
        const _0x4f73d5 = await loadUserGroupData();
        return Array['isArray'](_0x4f73d5['sudo']) ? _0x4f73d5['sudo'] : [];
    } catch (_0x1d14fb) {
        console['error']('Error\x20getting\x20sudo\x20list:', _0x1d14fb);
        return [];
    }
}
async function addWelcome(_0x477249, _0x259cb4, _0xb32984) {
    try {
        const _0x2f1442 = await loadUserGroupData();
        if (!_0x2f1442['welcome'])
            _0x2f1442['welcome'] = {};
        _0x2f1442['welcome'][_0x477249] = {
            'enabled': _0x259cb4,
            'message': _0xb32984 || '╔═⚔️\x20WELCOME\x20⚔️═╗\x0a║\x20🛡️\x20User:\x20{user}\x0a║\x20🏰\x20Kingdom:\x20{group}\x0a╠═══════════════╣\x0a║\x20📜\x20Message:\x0a║\x20{description}\x0a╚═══════════════╝',
            'channelId': '120363429019355682@newsletter'
        };
        await saveUserGroupData(_0x2f1442);
        return !![];
    } catch (_0x1eb11b) {
        console['error']('Error\x20in\x20addWelcome:', _0x1eb11b);
        return ![];
    }
}
async function delWelcome(_0x493950) {
    try {
        const _0x4a5d41 = await loadUserGroupData();
        if (_0x4a5d41['welcome'] && _0x4a5d41['welcome'][_0x493950]) {
            delete _0x4a5d41['welcome'][_0x493950];
            await saveUserGroupData(_0x4a5d41);
        }
        return !![];
    } catch (_0x1b26bb) {
        console['error']('Error\x20in\x20delWelcome:', _0x1b26bb);
        return ![];
    }
}
async function isWelcomeOn(_0x527de1) {
    try {
        const _0x47c041 = await loadUserGroupData();
        return _0x47c041['welcome'] && _0x47c041['welcome'][_0x527de1] && _0x47c041['welcome'][_0x527de1]['enabled'];
    } catch (_0x2b3545) {
        console['error']('Error\x20in\x20isWelcomeOn:', _0x2b3545);
        return ![];
    }
}
async function addGoodbye(_0x230715, _0x2cf741, _0x16244e) {
    try {
        const _0x443575 = await loadUserGroupData();
        if (!_0x443575['goodbye'])
            _0x443575['goodbye'] = {};
        _0x443575['goodbye'][_0x230715] = {
            'enabled': _0x2cf741,
            'message': _0x16244e || '╔═⚔️\x20GOODBYE\x20⚔️═╗\x0a║\x20🛡️\x20User:\x20{user}\x0a║\x20🏰\x20Kingdom:\x20{group}\x0a╠═══════════════╣\x0a║\x20⚰️\x20We\x20will\x20never\x20miss\x20you!\x0a╚═══════════════╝',
            'channelId': '120363429019355682@newsletter'
        };
        await saveUserGroupData(_0x443575);
        return !![];
    } catch (_0x3e45c0) {
        console['error']('Error\x20in\x20addGoodbye:', _0x3e45c0);
        return ![];
    }
}
async function delGoodBye(_0x324de9) {
    try {
        const _0x4d3263 = await loadUserGroupData();
        if (_0x4d3263['goodbye'] && _0x4d3263['goodbye'][_0x324de9]) {
            delete _0x4d3263['goodbye'][_0x324de9];
            await saveUserGroupData(_0x4d3263);
        }
        return !![];
    } catch (_0x2bd97b) {
        console['error']('Error\x20in\x20delGoodBye:', _0x2bd97b);
        return ![];
    }
}
async function isGoodByeOn(_0x1fcf71) {
    try {
        const _0x4d545c = await loadUserGroupData();
        return _0x4d545c['goodbye'] && _0x4d545c['goodbye'][_0x1fcf71] && _0x4d545c['goodbye'][_0x1fcf71]['enabled'];
    } catch (_0x1b0d4a) {
        console['error']('Error\x20in\x20isGoodByeOn:', _0x1b0d4a);
        return ![];
    }
}
async function getWelcome(_0x2cbe42) {
    try {
        const _0x52cba9 = await loadUserGroupData();
        return _0x52cba9['welcome'] && _0x52cba9['welcome'][_0x2cbe42] ? _0x52cba9['welcome'][_0x2cbe42]['message'] : null;
    } catch (_0x49fdea) {
        console['error']('Error\x20in\x20getWelcome:', _0x49fdea);
        return null;
    }
}
async function getGoodbye(_0x46af9b) {
    try {
        const _0x5777c6 = await loadUserGroupData();
        return _0x5777c6['goodbye'] && _0x5777c6['goodbye'][_0x46af9b] ? _0x5777c6['goodbye'][_0x46af9b]['message'] : null;
    } catch (_0x4f76a4) {
        console['error']('Error\x20in\x20getGoodbye:', _0x4f76a4);
        return null;
    }
}
async function setAntiBadword(_0x16530c, _0xabd8b2, _0x1c1d03) {
    try {
        const _0x6f437 = await loadUserGroupData();
        if (!_0x6f437['antibadword'])
            _0x6f437['antibadword'] = {};
        if (!_0x6f437['antibadword'][_0x16530c])
            _0x6f437['antibadword'][_0x16530c] = {};
        _0x6f437['antibadword'][_0x16530c] = {
            'enabled': _0xabd8b2 === 'on',
            'action': _0x1c1d03 || 'delete'
        };
        await saveUserGroupData(_0x6f437);
        return !![];
    } catch (_0x3810ae) {
        console['error']('Error\x20setting\x20antibadword:', _0x3810ae);
        return ![];
    }
}
async function getAntiBadword(_0x4f68ab, _0x4efa9a) {
    try {
        const _0x17f03c = await loadUserGroupData();
        if (!_0x17f03c['antibadword'] || !_0x17f03c['antibadword'][_0x4f68ab]) {
            return null;
        }
        const _0xba9473 = _0x17f03c['antibadword'][_0x4f68ab];
        return _0x4efa9a === 'on' ? _0xba9473 : null;
    } catch (_0x181f9a) {
        console['error']('Error\x20getting\x20antibadword:', _0x181f9a);
        return null;
    }
}
async function removeAntiBadword(_0x5b5ea1, _0x3bb571) {
    try {
        const _0x479d4e = await loadUserGroupData();
        if (_0x479d4e['antibadword'] && _0x479d4e['antibadword'][_0x5b5ea1]) {
            delete _0x479d4e['antibadword'][_0x5b5ea1];
            await saveUserGroupData(_0x479d4e);
        }
        return !![];
    } catch (_0x9a40d1) {
        console['error']('Error\x20removing\x20antibadword:', _0x9a40d1);
        return ![];
    }
}
async function setChatbot(_0x179a34, _0x2367ef) {
    try {
        const _0x1080ef = await loadUserGroupData();
        if (!_0x1080ef['chatbot'])
            _0x1080ef['chatbot'] = {};
        _0x1080ef['chatbot'][_0x179a34] = { 'enabled': _0x2367ef };
        await saveUserGroupData(_0x1080ef);
        return !![];
    } catch (_0x578b94) {
        console['error']('Error\x20setting\x20chatbot:', _0x578b94);
        return ![];
    }
}
async function getChatbot(_0x22c29d) {
    try {
        const _0x5d426a = await loadUserGroupData();
        return _0x5d426a['chatbot']?.[_0x22c29d] || null;
    } catch (_0x4666ad) {
        console['error']('Error\x20getting\x20chatbot:', _0x4666ad);
        return null;
    }
}
async function removeChatbot(_0x32d880) {
    try {
        const _0x34deb6 = await loadUserGroupData();
        if (_0x34deb6['chatbot'] && _0x34deb6['chatbot'][_0x32d880]) {
            delete _0x34deb6['chatbot'][_0x32d880];
            await saveUserGroupData(_0x34deb6);
        }
        return !![];
    } catch (_0xf7fc9e) {
        console['error']('Error\x20removing\x20chatbot:', _0xf7fc9e);
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